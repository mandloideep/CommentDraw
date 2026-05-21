package com.CommentDraw.Backend.service;

import com.CommentDraw.Backend.entity.Payment;
import com.CommentDraw.Backend.entity.Subscription;
import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.model.SubscriptionResponse;
import com.CommentDraw.Backend.model.SubscriptionTypes;

import java.math.BigDecimal;

public interface SubscriptionService {
    SubscriptionTypes getPlanByAmount(BigDecimal subAmount);

    SubscriptionResponse getUserSubscription(User user);

    void upgradeSubscription(User user, Payment payment);

    void save(Subscription subscription);
}
