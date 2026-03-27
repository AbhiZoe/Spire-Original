package com.spire.backend.service;

import com.spire.backend.dto.UserDTO;
import com.spire.backend.entity.Role;
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
    private final RoleRepository roleRepository;
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
    public UserDTO updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String normalizedRole = roleName.toUpperCase();

        // SECURITY: Cannot directly assign INSTRUCTOR via this endpoint.
        // Use the Instructor Approval System instead (approve-instructor).
        if ("INSTRUCTOR".equals(normalizedRole)) {
            throw new IllegalArgumentException(
                    "Cannot assign INSTRUCTOR role directly. Use the instructor approval system.");
        }

        Role role = roleRepository.findByName(normalizedRole)
                .orElseThrow(() -> new IllegalArgumentException("Invalid role: " + roleName));

        // If demoting from INSTRUCTOR, also revoke approval
        if ("INSTRUCTOR".equals(user.getRole().getName()) && !"INSTRUCTOR".equals(normalizedRole)) {
            user.setInstructorApproved(false);
        }

        user.setRole(role);
        return UserDTO.from(userRepository.save(user));
    }
}
