package com.CommentDraw.Backend.entity;

import com.CommentDraw.Backend.model.PaymentStatus;
import com.CommentDraw.Backend.model.SubscriptionTypes;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SubscriptionTypes planType;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    // Stripe Checkout Session ID (cs_test_...)
    @Column(nullable = false, unique = true)
    private String orderId;

    // Stripe PaymentIntent ID (pi_...)
    @Column(unique = true)
    private String paymentId;

    @Column(unique = true)
    private String stripeSubscriptionId;

    private String stripeCustomerId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(nullable = false, unique = true)
    private String receiptId;

    private LocalDateTime paymentDate;

    private String method;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
