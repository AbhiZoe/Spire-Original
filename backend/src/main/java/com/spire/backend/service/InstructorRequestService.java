package com.spire.backend.service;

import com.spire.backend.entity.*;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.repository.InstructorRequestRepository;
import com.spire.backend.repository.RoleRepository;
import com.spire.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstructorRequestService {

    private final InstructorRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    /**
     * Student submits a request to become an instructor.
     * Does NOT change the user's role — only creates a PENDING request.
     */
    @Transactional
    public InstructorRequest requestInstructor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Only students can request
        if (!"STUDENT".equals(user.getRole().getName())) {
            throw new IllegalArgumentException("Only students can request instructor status");
        }

        // Prevent duplicate pending requests
        if (requestRepository.existsByUserIdAndStatus(userId, RequestStatus.PENDING)) {
            throw new IllegalArgumentException("You already have a pending instructor request");
        }

        InstructorRequest request = InstructorRequest.builder()
                .user(user)
                .status(RequestStatus.PENDING)
                .build();

        return requestRepository.save(request);
    }

    /**
     * Returns all pending instructor requests (for admin review).
     */
    public List<InstructorRequest> getPendingRequests() {
        return requestRepository.findByStatus(RequestStatus.PENDING);
    }

    /**
     * Admin approves an instructor request.
     * Changes user role to INSTRUCTOR and sets instructorApproved = true.
     */
    @Transactional
    public InstructorRequest approveInstructor(Long requestId) {
        InstructorRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("InstructorRequest", "id", requestId));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request is already " + request.getStatus());
        }

        // Change user role to INSTRUCTOR
        Role instructorRole = roleRepository.findByName("INSTRUCTOR")
                .orElseThrow(() -> new IllegalStateException("INSTRUCTOR role not found in database"));

        User user = request.getUser();
        user.setRole(instructorRole);
        user.setInstructorApproved(true);
        userRepository.save(user);

        // Update request status
        request.setStatus(RequestStatus.APPROVED);
        return requestRepository.save(request);
    }

    /**
     * Admin rejects an instructor request.
     * Does NOT change the user's role.
     */
    @Transactional
    public InstructorRequest rejectInstructor(Long requestId) {
        InstructorRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("InstructorRequest", "id", requestId));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request is already " + request.getStatus());
        }

        request.setStatus(RequestStatus.REJECTED);
        return requestRepository.save(request);
    }
}
