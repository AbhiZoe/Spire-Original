package com.spire.backend.controller;

import com.spire.backend.dto.ApiResponse;
import com.spire.backend.dto.CourseDTO;
import com.spire.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> addToCart(
            Authentication authentication, @PathVariable Long courseId) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        cartService.addToCart(userId, courseId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Added to cart", null));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getCart(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(userId)));
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            Authentication authentication, @PathVariable Long courseId) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        cartService.removeFromCart(userId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Removed from cart", null));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }

    @PostMapping("/checkout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BigDecimal>> checkout(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        BigDecimal total = cartService.checkout(userId);
        return ResponseEntity.ok(ApiResponse.success("Checkout successful", total));
    }
}
