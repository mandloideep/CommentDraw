package com.CommentDraw.Backend.controller;


import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.exception.UserNotFoundException;
import com.CommentDraw.Backend.model.OrderRequest;
import com.CommentDraw.Backend.model.StripeCheckoutSessionResponse;
import com.CommentDraw.Backend.service.PaymentService;
import com.CommentDraw.Backend.service.SubscriptionService;
import com.CommentDraw.Backend.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscription")
@Slf4j
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    private final PaymentService paymentService;
    private final UserService userService;

    public SubscriptionController(SubscriptionService subscriptionService, PaymentService paymentService, UserService userService) {
        this.subscriptionService = subscriptionService;
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping("/createOrder")
    public ResponseEntity<?> proceedPayment(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody OrderRequest request) {
        String planName = request.getPlanName().toUpperCase();
        String email = userDetails.getUsername();
        User user = userService.findUserByEmail(email)
                .orElseThrow(()-> new UserNotFoundException("User not found !"));

        StripeCheckoutSessionResponse response = paymentService.initializePayment(user, planName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lastPayment")
    public ResponseEntity<?> getLastPayment(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        User user = userService.findUserByEmail(email)
                               .orElseThrow(()-> new UserNotFoundException("User not found !"));

        return ResponseEntity.ok(paymentService.getLastPayment(user));
    }

    @GetMapping("/getSubscription")
    public ResponseEntity<?> getSubscription(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        User user = userService.findUserByEmail(email)
                .orElseThrow(()-> new UserNotFoundException("User not found !"));

        return ResponseEntity.ok(subscriptionService.getUserSubscription(user));
    }
}
