package com.spire.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.spire.backend.dto.SubscriptionDTO;
import com.spire.backend.entity.Payment;
import com.spire.backend.entity.Subscription;
import com.spire.backend.entity.User;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.exception.UnauthorizedException;
import com.spire.backend.repository.PaymentRepository;
import com.spire.backend.repository.SubscriptionRepository;
import com.spire.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    private RazorpayClient razorpayClient;

    private static final Map<String, BigDecimal> PLAN_PRICES = Map.of(
            "PRO", new BigDecimal("999.00"),
            "ENTERPRISE", new BigDecimal("2999.00")
    );

    @PostConstruct
    public void init() {
        try {
            razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        } catch (RazorpayException e) {
            // Client will be null; handled in methods
        }
    }

    @Transactional
    public Map<String, Object> createOrder(UUID userId, String plan) {
        if (razorpayClient == null) {
            throw new IllegalStateException("Payment gateway not configured");
        }

        Subscription.Plan subscriptionPlan = Subscription.Plan.valueOf(plan.toUpperCase());
        BigDecimal amount = PLAN_PRICES.get(subscriptionPlan.name());
        if (amount == null) {
            throw new IllegalArgumentException("Invalid plan: " + plan);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount.multiply(new BigDecimal("100")).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "spire_" + UUID.randomUUID().toString().substring(0, 8));

            Order order = razorpayClient.orders.create(orderRequest);

            Payment payment = Payment.builder()
                    .user(user)
                    .amount(amount)
                    .status(Payment.Status.PENDING)
                    .razorpayOrderId(order.get("id"))
                    .build();
            paymentRepository.save(payment);

            return Map.of(
                    "orderId", order.get("id").toString(),
                    "amount", amount,
                    "currency", "INR",
                    "keyId", razorpayKeyId
            );
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }

    @Transactional
    public SubscriptionDTO verifyPayment(UUID userId, String razorpayOrderId,
                                          String razorpayPaymentId, String razorpaySignature) {
        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        if (!verifySignature(payload, razorpaySignature)) {
            throw new UnauthorizedException("Invalid payment signature");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", razorpayOrderId));

        payment.setStatus(Payment.Status.COMPLETED);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        paymentRepository.save(payment);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Determine plan from amount
        Subscription.Plan plan = payment.getAmount().compareTo(new BigDecimal("2000")) > 0
                ? Subscription.Plan.ENTERPRISE : Subscription.Plan.PRO;

        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(plan)
                .status(Subscription.Status.ACTIVE)
                .paymentId(razorpayPaymentId)
                .expiresAt(LocalDateTime.now().plusMonths(plan == Subscription.Plan.ENTERPRISE ? 12 : 1))
                .build();

        subscriptionRepository.save(subscription);

        return SubscriptionDTO.builder()
                .plan(subscription.getPlan().name())
                .status(subscription.getStatus().name())
                .expiresAt(subscription.getExpiresAt())
                .build();
    }

    public SubscriptionDTO getStatus(UUID userId) {
        return subscriptionRepository.findByUserIdAndStatus(userId, Subscription.Status.ACTIVE)
                .map(s -> SubscriptionDTO.builder()
                        .plan(s.getPlan().name())
                        .status(s.getStatus().name())
                        .expiresAt(s.getExpiresAt())
                        .build())
                .orElse(SubscriptionDTO.builder()
                        .plan("FREE")
                        .status("ACTIVE")
                        .build());
    }

    @Transactional
    public void cancelSubscription(UUID userId) {
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, Subscription.Status.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Active subscription not found"));

        subscription.setStatus(Subscription.Status.CANCELLED);
        subscriptionRepository.save(subscription);
    }

    private boolean verifySignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes());
            String generated = HexFormat.of().formatHex(hash);
            return generated.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
