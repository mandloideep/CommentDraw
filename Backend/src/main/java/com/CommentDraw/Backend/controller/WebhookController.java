package com.CommentDraw.Backend.controller;

import com.CommentDraw.Backend.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final PaymentService paymentService;

    public WebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String signature){
        log.info("Stripe webhook request received!");
        paymentService.processStripeWebhook(payload, signature);
        return ResponseEntity.ok("Received");
    }
}
