package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.model.LastPaymentModel;
import com.CommentDraw.Backend.model.StripeCheckoutSessionResponse;
import com.CommentDraw.Backend.model.SubscriptionTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaymentService {
    void createPartialPayment(Long userId, SubscriptionTypes planType, BigDecimal amount, String currency, String sessionId, String receiptId);
    void completePayment(String sessionId, String paymentIntentId, LocalDateTime paymentDate, User user, String planByAmount, BigDecimal amount, String paymentMethod);

    LastPaymentModel getLastPayment(User user);

    void markPaymentFailed(String sessionId);

    StripeCheckoutSessionResponse initializePayment(User user, String planName);

    void processStripeWebhook(String payload, String signature);

    boolean checkIsPaymentSuccess(String sessionId);

    void deletePayment(long userId);
}
