package com.spire.backend.controller;

import com.spire.backend.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    @PostMapping("/razorpay")
    public ResponseEntity<ApiResponse<Void>> handleRazorpayWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        log.info("Received Razorpay webhook: {}", payload.get("event"));

        // TODO: Verify webhook signature and process events
        // Events: payment.authorized, payment.captured, payment.failed, subscription.charged

        return ResponseEntity.ok(ApiResponse.success("Webhook received", null));
    }
}
