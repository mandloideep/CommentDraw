package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.Payment;
import com.CommentDraw.Backend.entity.Subscription;
import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.event.PaymentSuccessfulEvent;
import com.CommentDraw.Backend.exception.SubscriptionDowngradeException;
import com.CommentDraw.Backend.model.PaymentStatus;
import com.CommentDraw.Backend.model.StripeCheckoutSessionResponse;
import com.CommentDraw.Backend.model.SubscriptionTypes;
import com.CommentDraw.Backend.repository.PaymentRepository;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepo;
    @Mock private UserService userService;
    @Mock private SubscriptionService subscriptionService;
    @Mock private ApplicationEventPublisher publisher;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User sampleUser;
    private Payment samplePayment;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "webhookSecret", "whsec_test");
        ReflectionTestUtils.setField(paymentService, "priceIdGold", "price_gold");
        ReflectionTestUtils.setField(paymentService, "priceIdDiamond", "price_diamond");
        ReflectionTestUtils.setField(paymentService, "frontendBaseUrl", "http://localhost:5571");

        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("user@example.com");
        sampleUser.setSubscription(Subscription.builder().subscriptionType(SubscriptionTypes.FREE).build());

        samplePayment = new Payment();
        samplePayment.setId(100L);
        samplePayment.setOrderId("cs_test_123");
        samplePayment.setUserId(sampleUser.getId());
        samplePayment.setAmount(new BigDecimal("49"));
        samplePayment.setPlanType(SubscriptionTypes.GOLD);
    }

    @Test
    void initializePayment_ShouldThrowException_OnDowngrade() {
        sampleUser.getSubscription().setSubscriptionType(SubscriptionTypes.DIAMOND);

        assertThrows(SubscriptionDowngradeException.class, () ->
                paymentService.initializePayment(sampleUser, "GOLD"));
    }

    @Test
    void initializePayment_ShouldCreateSession_WhenValid() {
        Session mockSession = mock(Session.class);
        when(mockSession.getId()).thenReturn("cs_test_abc");
        when(mockSession.getUrl()).thenReturn("https://checkout.stripe.com/c/pay/cs_test_abc");

        try (MockedStatic<Session> sessionStatic = mockStatic(Session.class)) {
            sessionStatic.when(() -> Session.create(any(SessionCreateParams.class))).thenReturn(mockSession);

            StripeCheckoutSessionResponse response = paymentService.initializePayment(sampleUser, "GOLD");

            assertNotNull(response);
            assertEquals("cs_test_abc", response.getSessionId());
            assertEquals("https://checkout.stripe.com/c/pay/cs_test_abc", response.getUrl());
            verify(paymentRepo, times(1)).save(any(Payment.class));
        }
    }

    @Test
    void completePayment_ShouldSyncSubscriptionAndPublishEvent() {
        when(paymentRepo.findByOrderId("cs_test_123")).thenReturn(Optional.of(samplePayment));

        paymentService.completePayment("cs_test_123", "pi_123", LocalDateTime.now(),
                sampleUser, "GOLD", new BigDecimal("49"), "card");

        verify(subscriptionService).upgradeSubscription(eq(sampleUser), any(Payment.class));
        verify(publisher).publishEvent(any(PaymentSuccessfulEvent.class));
        verify(paymentRepo).save(argThat(p -> p.getStatus() == PaymentStatus.SUCCESS));
    }

    @Test
    void getLastPayment_ShouldThrowException_WhenDateIsMissing() {
        samplePayment.setStatus(PaymentStatus.SUCCESS);
        samplePayment.setPaymentDate(null);
        when(paymentRepo.findFirstByUserIdAndStatusOrderByCreatedAtDesc(anyLong(), any())).thenReturn(Optional.of(samplePayment));

        assertThrows(IllegalStateException.class, () -> paymentService.getLastPayment(sampleUser));
    }

    @Test
    void processStripeWebhook_ShouldCompletePayment_OnCheckoutSessionCompleted() {
        Session session = mock(Session.class);
        when(session.getId()).thenReturn("cs_test_123");
        when(session.getCustomer()).thenReturn("cus_123");
        when(session.getSubscription()).thenReturn("sub_123");
        when(session.getAmountTotal()).thenReturn(4900L);
        when(session.getPaymentIntent()).thenReturn("pi_456");
        when(session.getPaymentMethodTypes()).thenReturn(java.util.List.of("card"));

        Event event = mock(Event.class);
        when(event.getType()).thenReturn("checkout.session.completed");
        EventDataObjectDeserializer deserializer = mock(EventDataObjectDeserializer.class);
        when(event.getDataObjectDeserializer()).thenReturn(deserializer);
        when(deserializer.getObject()).thenReturn(Optional.of(session));

        when(paymentRepo.findByOrderId("cs_test_123")).thenReturn(Optional.of(samplePayment));
        when(userService.findUserByUserId(anyLong())).thenReturn(sampleUser);
        when(subscriptionService.getPlanByAmount(any(BigDecimal.class))).thenReturn(SubscriptionTypes.GOLD);

        try (MockedStatic<Webhook> webhookStatic = mockStatic(Webhook.class)) {
            webhookStatic.when(() -> Webhook.constructEvent(any(), any(), any())).thenReturn(event);

            paymentService.processStripeWebhook("{}", "t=1,v1=abc");

            verify(paymentRepo, atLeastOnce()).save(argThat(p -> p.getStatus() == PaymentStatus.SUCCESS));
            verify(subscriptionService).upgradeSubscription(eq(sampleUser), any(Payment.class));
            verify(publisher).publishEvent(any(PaymentSuccessfulEvent.class));
        }
    }

    @Test
    void processStripeWebhook_ShouldSkip_WhenSessionAlreadyProcessed() {
        samplePayment.setStatus(PaymentStatus.SUCCESS);
        Session session = mock(Session.class);
        when(session.getId()).thenReturn("cs_test_123");

        Event event = mock(Event.class);
        when(event.getType()).thenReturn("checkout.session.completed");
        EventDataObjectDeserializer deserializer = mock(EventDataObjectDeserializer.class);
        when(event.getDataObjectDeserializer()).thenReturn(deserializer);
        when(deserializer.getObject()).thenReturn(Optional.of(session));

        when(paymentRepo.findByOrderId("cs_test_123")).thenReturn(Optional.of(samplePayment));

        try (MockedStatic<Webhook> webhookStatic = mockStatic(Webhook.class)) {
            webhookStatic.when(() -> Webhook.constructEvent(any(), any(), any())).thenReturn(event);

            paymentService.processStripeWebhook("{}", "sig");

            verify(subscriptionService, never()).upgradeSubscription(any(), any());
            verify(publisher, never()).publishEvent(any(PaymentSuccessfulEvent.class));
        }
    }

    @Test
    void cleanJunk_ShouldInvokeRepositoryDelete() {
        paymentService.cleanJunk();

        verify(paymentRepo, times(1)).deleteByStatusAndCreatedAtBefore(eq(PaymentStatus.PENDING), any());
        verify(paymentRepo, times(1)).deleteByStatusAndCreatedAtBefore(eq(PaymentStatus.FAILED), any());
    }
}
