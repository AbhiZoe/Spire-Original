package com.spire.backend.controller;

import com.spire.backend.dto.*;
import com.spire.backend.entity.User;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.repository.UserRepository;
import com.spire.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final ProgressService progressService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return ResponseEntity.ok(ApiResponse.success(UserDTO.from(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            Authentication authentication, @RequestBody UserDTO dto) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getBio() != null) user.setBio(dto.getBio());

        return ResponseEntity.ok(ApiResponse.success(UserDTO.from(userRepository.save(user))));
    }

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<List<ProgressDTO>>> getProgress(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        return ResponseEntity.ok(ApiResponse.success(progressService.getUserProgress(userId)));
    }

    @PutMapping("/progress/{courseId}")
    public ResponseEntity<ApiResponse<ProgressDTO>> updateProgress(
            Authentication authentication,
            @PathVariable Long courseId,
            @RequestBody ProgressDTO dto) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        return ResponseEntity.ok(ApiResponse.success(progressService.updateProgress(userId, courseId, dto)));
    }
}
