package com.CommentDraw.Backend.controller;

import com.CommentDraw.Backend.entity.User;
import com.CommentDraw.Backend.model.*;
import com.CommentDraw.Backend.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubscriptionController.class)
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean private SubscriptionService subscriptionService;
    @MockitoBean private PaymentService paymentService;
    @MockitoBean private UserService userService;

    @MockitoBean private JWTService jwtService;
    @MockitoBean private UserDetailsService userDetailsService;

    private final String testEmail = "test@commentdraw.com";

    @BeforeEach
    void setUp() {
        User mockUser = new User();
        mockUser.setEmail(testEmail);
        when(userService.findUserByEmail(testEmail)).thenReturn(Optional.of(mockUser));
    }

    @Test
    @WithMockUser(username = testEmail)
    void proceedPayment_ShouldReturnCheckoutSession() throws Exception {
        StripeCheckoutSessionResponse mockResponse = StripeCheckoutSessionResponse.builder()
                .sessionId("cs_test_123")
                .url("https://checkout.stripe.com/c/pay/cs_test_123")
                .build();
        when(paymentService.initializePayment(any(User.class), eq("GOLD"))).thenReturn(mockResponse);

        mockMvc.perform(post("/subscription/createOrder")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"planName\":\"gold\"}"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.sessionId").value("cs_test_123"))
                        .andExpect(jsonPath("$.url").value("https://checkout.stripe.com/c/pay/cs_test_123"));
    }

    @Test
    @WithMockUser(username = testEmail)
    void getSubscription_ShouldReturnUserSub() throws Exception {
        mockMvc.perform(get("/subscription/getSubscription"))
                .andExpect(status().isOk());
    }
}
