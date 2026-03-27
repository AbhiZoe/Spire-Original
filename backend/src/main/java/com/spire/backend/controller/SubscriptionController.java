package com.spire.backend.controller;

import com.spire.backend.dto.*;
import com.spire.backend.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        Map<String, Object> order = subscriptionService.createOrder(userId, request.getPlan());
        return ResponseEntity.ok(ApiResponse.success("Order created", order));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> verifyPayment(
            Authentication authentication, @Valid @RequestBody VerifyPaymentRequest request) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        SubscriptionDTO subscription = subscriptionService.verifyPayment(
                userId, request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(), request.getRazorpaySignature());
        return ResponseEntity.ok(ApiResponse.success("Payment verified", subscription));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> getStatus(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getStatus(userId)));
    }
}
