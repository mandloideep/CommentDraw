package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.Payment;
import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.event.PaymentRefundEvent;
import com.CommentDraw.Backend.event.PaymentSuccessfulEvent;
import com.CommentDraw.Backend.exception.*;
import com.CommentDraw.Backend.model.*;
import com.CommentDraw.Backend.repository.PaymentRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${STRIPE_WEBHOOK_SECRET}")
    private String webhookSecret;

    @Value("${STRIPE_PRICE_ID_GOLD}")
    private String priceIdGold;

    @Value("${STRIPE_PRICE_ID_DIAMOND}")
    private String priceIdDiamond;

    @Value("${FRONTEND_BASE_URL}")
    private String frontendBaseUrl;

    private final PaymentRepository paymentRepo;
    private final UserService userService;
    private final SubscriptionService subscriptionService;
    private final ApplicationEventPublisher publisher;

    public PaymentServiceImpl(PaymentRepository paymentRepo, @Lazy UserService userService, SubscriptionService subscriptionService, ApplicationEventPublisher publisher) {
        this.paymentRepo = paymentRepo;
        this.userService = userService;
        this.subscriptionService = subscriptionService;
        this.publisher = publisher;
    }

    private String priceIdFor(SubscriptionTypes plan) {
        return switch (plan) {
            case GOLD -> priceIdGold;
            case DIAMOND -> priceIdDiamond;
            default -> throw new InvalidPlanNameException("No Stripe price configured for plan " + plan);
        };
    }

    @Override
    @Transactional
    public void createPartialPayment(Long userId, SubscriptionTypes planType, BigDecimal amount, String currency, String sessionId, String receiptId) {
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setPlanType(planType);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setOrderId(sessionId);
        payment.setReceiptId(receiptId);
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepo.save(payment);
    }

    @Override
    @Transactional
    public void completePayment(String sessionId, String paymentIntentId, LocalDateTime paymentDate, User user, String planByAmount, BigDecimal amount, String paymentMethod) {
        Payment payment = paymentRepo.findByOrderId(sessionId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment record not found " + sessionId));

        payment.setPaymentId(paymentIntentId);
        payment.setPaymentDate(paymentDate);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setMethod(paymentMethod);
        paymentRepo.save(payment);
        paymentRepo.deleteByUserIdAndStatusAndIdNot(
                payment.getUserId(),
                PaymentStatus.SUCCESS,
                payment.getId()
        );
        subscriptionService.upgradeSubscription(user, payment);
        log.info("Trying to send the email........");
        publisher.publishEvent(new PaymentSuccessfulEvent(
                user,
                paymentIntentId,
                sessionId,
                amount,
                planByAmount
        ));
    }

    @Override
    public LastPaymentModel getLastPayment(User user) {

        Payment payment = paymentRepo.findFirstByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), PaymentStatus.SUCCESS)
                .orElseThrow(() -> new PaymentNotFoundException("No payment found for this user!"));

        if (payment.getPaymentDate() == null) {
            log.error("Data Integrity Error: Payment {} is SUCCESS but has no paymentDate", payment.getOrderId());
            throw new IllegalStateException("Payment date is missing for successful transaction.");
        }

        LocalDate startDate = payment.getPaymentDate().toLocalDate();
        LocalDate endDate = startDate.plusMonths(1);
        return LastPaymentModel.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .subscriptionType(payment.getPlanType())
                .periodStart(startDate)
                .periodEnd(endDate)
                .nextBillingDate(endDate)
                .build();
    }

    @Override
    @Transactional
    public void markPaymentFailed(String sessionId) {
        Payment payment = paymentRepo.findByOrderId(sessionId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found for Session ID: " + sessionId));

        payment.setStatus(PaymentStatus.FAILED);
        paymentRepo.save(payment);
    }

    @Override
    public StripeCheckoutSessionResponse initializePayment(User user, String planName) {
        SubscriptionTypes currPlan = (user.getSubscription() != null)
                ? user.getSubscription().getSubscriptionType()
                : SubscriptionTypes.FREE;

        SubscriptionTypes requestedPlan;
        try {
            requestedPlan = SubscriptionTypes.valueOf(planName);
        } catch (IllegalArgumentException e) {
            throw new InvalidPlanNameException("Invalid Plan Name!");
        }

        if (requestedPlan.getPrice() <= currPlan.getPrice()) {
            if (currPlan == SubscriptionTypes.DIAMOND) {
                throw new SubscriptionDowngradeException("You are already on the Max Tier!");
            }
            throw new SubscriptionDowngradeException("Downgrade or re-purchase of " + currPlan + " is not allowed!");
        }

        String receiptId = "LHN_" + user.getId() + "_" + System.currentTimeMillis();
        BigDecimal subAmount = BigDecimal.valueOf(requestedPlan.getPrice());

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(frontendBaseUrl + "/settings?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendBaseUrl + "/upgrade")
                .setCustomerEmail(user.getEmail())
                .setClientReferenceId(user.getId().toString())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceIdFor(requestedPlan))
                                .setQuantity(1L)
                                .build()
                )
                .putMetadata("userId", user.getId().toString())
                .putMetadata("planType", requestedPlan.name())
                .putMetadata("receiptId", receiptId)
                .build();

        Session session;
        try {
            session = Session.create(params);
            log.info("Stripe checkout session created for user {}", user.getId());
        } catch (StripeException e) {
            log.error("Stripe session creation failed for user {}: {}", user.getId(), e.getMessage());
            throw new PaymentGatewayException("Stripe session creation failed!");
        }

        createPartialPayment(user.getId(), requestedPlan, subAmount, "INR", session.getId(), receiptId);

        return StripeCheckoutSessionResponse.builder()
                .sessionId(session.getId())
                .url(session.getUrl())
                .build();
    }

    @Override
    public void processStripeWebhook(String payload, String signature) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Security alert: Invalid Stripe webhook signature: {}", e.getMessage());
            throw new PaymentGatewayException("Invalid Webhook Signature!");
        }

        String type = event.getType();
        log.info("Stripe webhook received: {}", type);

        switch (type) {
            case "checkout.session.completed" -> handleCheckoutCompleted(event);
            case "checkout.session.expired", "checkout.session.async_payment_failed" -> handleCheckoutFailed(event);
            case "invoice.paid" -> log.info("invoice.paid received — recurring renewal not yet implemented");
            case "customer.subscription.deleted" -> log.info("customer.subscription.deleted received");
            default -> log.info("Unhandled Stripe event type: {}", type);
        }
    }

    private void handleCheckoutCompleted(Event event) {
        Session session;
        try {
            session = (Session) event.getDataObjectDeserializer().getObject()
                    .orElseThrow(() -> new PaymentGatewayException("Could not deserialize Stripe session"));
        } catch (Exception e) {
            log.error("Webhook Error: failed to deserialize session for event {}: {}", event.getId(), e.getMessage());
            return;
        }

        String sessionId = session.getId();
        Payment payment;
        try {
            payment = paymentRepo.findByOrderId(sessionId)
                    .orElseThrow(() -> new PaymentNotFoundException("Payment not found for session " + sessionId));
        } catch (PaymentNotFoundException e) {
            log.warn("Webhook: no Payment row for session {} (may be a Stripe-side test event). Ignoring.", sessionId);
            return;
        }

        if (PaymentStatus.SUCCESS == payment.getStatus()) {
            log.info("Session {} already processed. Skipping.", sessionId);
            return;
        }

        long amountTotalCents = session.getAmountTotal() != null ? session.getAmountTotal() : 0L;
        BigDecimal amountInMajor = BigDecimal.valueOf(amountTotalCents)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        // Plan to activate is the one the user clicked, recorded in createPartialPayment.
        SubscriptionTypes planType = payment.getPlanType();
        User user = null;

        try {
            payment.setStripeCustomerId(session.getCustomer());
            payment.setStripeSubscriptionId(session.getSubscription());
            paymentRepo.save(payment);

            user = userService.findUserByUserId(payment.getUserId());

            // Sanity-check: warn (don't fail) if Stripe charged an amount that doesn't match the enum.
            try {
                SubscriptionTypes planByAmount = subscriptionService.getPlanByAmount(amountInMajor);
                if (planByAmount != planType) {
                    log.warn("Webhook: amount-derived plan {} ({}) does not match recorded plan {} for session {}",
                            planByAmount, amountInMajor, planType, sessionId);
                }
            } catch (Exception e) {
                log.warn("Webhook: amount {} does not match any plan price for session {} ({}). Proceeding with recorded plan {}.",
                        amountInMajor, sessionId, e.getMessage(), planType);
            }

            String paymentIntentId = session.getPaymentIntent();
            String paymentMethod = session.getPaymentMethodTypes() != null && !session.getPaymentMethodTypes().isEmpty()
                    ? session.getPaymentMethodTypes().get(0)
                    : "card";
            this.completePayment(sessionId, paymentIntentId, LocalDateTime.now(), user, planType.toString(), amountInMajor, paymentMethod);
            log.info("Webhook Success: Subscription activated for session {}", sessionId);
        } catch (Exception e) {
            log.error("Webhook Error: Completion failed for {}. Reason: {}", sessionId, e.getMessage(), e);
            try {
                this.markPaymentFailed(sessionId);
            } catch (Exception markEx) {
                log.error("Webhook Error: also failed to mark payment FAILED for {}: {}", sessionId, markEx.getMessage());
            }
            if (user != null) {
                publisher.publishEvent(new PaymentRefundEvent(
                        user,
                        planType.toString(),
                        sessionId,
                        amountInMajor
                ));
                log.info("Webhook Error: Payment Refund mail sent for user {}", user.getEmail());
            }
        }
    }

    private void handleCheckoutFailed(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new PaymentGatewayException("Could not deserialize Stripe session"));
        log.info("Checkout failed/expired for session {}", session.getId());
        try {
            this.markPaymentFailed(session.getId());
        } catch (PaymentNotFoundException e) {
            log.warn("No pending Payment row for failed session {}", session.getId());
        }
    }

    @Override
    public boolean checkIsPaymentSuccess(String sessionId) {
        log.info("[Payment-Service:]Checking payment status for sessionId {}", sessionId);
        Payment payment = paymentRepo.findByOrderId(sessionId).orElseThrow(() -> new PaymentNotFoundException("Payment not found!"));
        return payment.getStatus() == PaymentStatus.SUCCESS;
    }

    @Override
    @Transactional
    public void deletePayment(long userId) {
        paymentRepo.deleteByUserId(userId);
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void cleanJunk() {
        log.info("[Payment-CRON] Starting junk payment cleanup...");
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        paymentRepo.deleteByStatusAndCreatedAtBefore(PaymentStatus.PENDING, threshold);
        paymentRepo.deleteByStatusAndCreatedAtBefore(PaymentStatus.FAILED, threshold);

        log.info("[Payment-CRON] Cleanup finished.");
    }

    @Scheduled(cron = "0 0/15 * * * *")
    public void reconcileStuckPayments() {
        log.info("[Payment-CRON] Starting Stripe payment reconciliation job...");

        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);
        List<Payment> stuckPayments = paymentRepo.findAllByStatusAndCreatedAtBefore(PaymentStatus.PENDING, threshold);

        for (Payment payment : stuckPayments) {
            String sessionId = payment.getOrderId();
            String planName = payment.getPlanType().toString();
            BigDecimal amount = payment.getAmount();
            User user = null;

            try {
                user = userService.getUserById(payment.getUserId())
                        .orElseThrow(() -> new UserNotFoundException("User not found!"));

                Session session = Session.retrieve(sessionId);
                String paymentStatus = session.getPaymentStatus();

                if ("paid".equals(paymentStatus)) {
                    log.info("[Payment-CRON] Syncing paid session {}", sessionId);
                    String paymentMethod = session.getPaymentMethodTypes() != null && !session.getPaymentMethodTypes().isEmpty()
                            ? session.getPaymentMethodTypes().get(0)
                            : "card";
                    payment.setStripeCustomerId(session.getCustomer());
                    payment.setStripeSubscriptionId(session.getSubscription());
                    paymentRepo.save(payment);
                    this.completePayment(sessionId, session.getPaymentIntent(), LocalDateTime.now(), user, planName, amount, paymentMethod);
                } else if ("unpaid".equals(paymentStatus) && "expired".equals(session.getStatus())) {
                    log.info("[Payment-CRON] Marking expired session {} as FAILED", sessionId);
                    this.markPaymentFailed(sessionId);
                }
            } catch (StripeException e) {
                log.error("[Payment-CRON] Stripe lookup failed for session {}: {}", sessionId, e.getMessage());
            } catch (Exception e) {
                log.error("[Payment-CRON] Error processing session {}: {}", sessionId, e.getMessage());
                this.markPaymentFailed(sessionId);

                if (user != null) {
                    publisher.publishEvent(new PaymentRefundEvent(user, planName, sessionId, amount));
                    log.info("[Payment-CRON] Refund/Failure mail sent for session {}", sessionId);
                }
            }
        }
    }
}
