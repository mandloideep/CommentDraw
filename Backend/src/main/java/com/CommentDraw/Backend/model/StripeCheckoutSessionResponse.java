package com.CommentDraw.Backend.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StripeCheckoutSessionResponse {
    private String sessionId;
    private String url;
}
