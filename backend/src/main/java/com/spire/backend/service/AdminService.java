package com.spire.backend.service;

import com.spire.backend.dto.UserDTO;
import com.spire.backend.entity.User;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SubscriptionRepository subscriptionRepository;

    public Map<String, Object> getAnalytics() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "totalCourses", courseRepository.count(),
                "totalEnrollments", enrollmentRepository.count(),
                "totalSubscriptions", subscriptionRepository.count()
        );
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setRole(User.Role.valueOf(role.toUpperCase()));
        return UserDTO.from(userRepository.save(user));
    }
}
