package com.spire.backend.service;

import com.spire.backend.dto.CourseDTO;
import com.spire.backend.entity.CartItem;
import com.spire.backend.entity.Course;
import com.spire.backend.entity.User;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.repository.CartRepository;
import com.spire.backend.repository.CourseRepository;
import com.spire.backend.repository.EnrollmentRepository;
import com.spire.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentService enrollmentService;

    @Transactional
    public void addToCart(Long userId, Long courseId) {
        if (cartRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new IllegalArgumentException("Course is already in your cart");
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new IllegalArgumentException("You are already enrolled in this course");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (Boolean.TRUE.equals(course.getIsFree())) {
            throw new IllegalArgumentException("Free courses can be enrolled directly");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        CartItem item = CartItem.builder()
                .user(user)
                .course(course)
                .build();

        cartRepository.save(item);
    }

    public List<CourseDTO> getCart(Long userId) {
        return cartRepository.findByUserId(userId).stream()
                .map(item -> CourseDTO.from(item.getCourse()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromCart(Long userId, Long courseId) {
        cartRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    @Transactional
    public BigDecimal checkout(Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        if (items.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            Course course = item.getCourse();
            total = total.add(course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO);
            enrollmentService.enrollUser(userId, course.getId());
        }

        cartRepository.deleteByUserId(userId);
        return total;
    }
}
