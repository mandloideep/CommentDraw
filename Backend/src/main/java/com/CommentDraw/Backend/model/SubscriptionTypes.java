package com.CommentDraw.Backend.model;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SubscriptionTypes {
    FREE(0, 300, 2, 3),
    GOLD(9, 600, 5, 10),
    DIAMOND(29, 1000, 10, -1);

    private final int price;        // USD per month (must match Stripe Dashboard Price objects)
    private final int maxComments;  // max comments per giveaway
    private final int maxWinners;   // winners per giveaway
    private final int maxGiveaways; // giveaways per month (-1 = unlimited)
}
