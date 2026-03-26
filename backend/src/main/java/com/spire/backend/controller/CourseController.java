package com.spire.backend.controller;

import com.spire.backend.dto.ApiResponse;
import com.spire.backend.dto.CourseDTO;
import com.spire.backend.dto.LessonDTO;
import com.spire.backend.entity.Lesson;
import com.spire.backend.repository.LessonRepository;
import com.spire.backend.service.CourseService;
import com.spire.backend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final LessonRepository lessonRepository;
    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getAllCourses(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String search) {
        List<CourseDTO> courses;
        if (search != null && !search.isBlank()) {
            courses = courseService.searchCourses(search);
        } else if (level != null && !level.isBlank()) {
            courses = courseService.getCoursesByLevel(level);
        } else {
            courses = courseService.getAllCourses();
        }
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourse(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseById(id)));
    }

    @GetMapping("/{id}/lessons")
    public ResponseEntity<ApiResponse<List<LessonDTO>>> getCourseLessons(
            @PathVariable UUID id, Authentication authentication) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndex(id);

        boolean hasAccess = false;
        if (authentication != null) {
            UUID userId = (UUID) authentication.getPrincipal();
            hasAccess = enrollmentService.isEnrolled(userId, id);
        }

        boolean finalHasAccess = hasAccess;
        List<LessonDTO> dtos = lessons.stream()
                .map(l -> LessonDTO.from(l, finalHasAccess || Boolean.TRUE.equals(l.getIsFree())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(
            @RequestBody CourseDTO dto, Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        CourseDTO created = courseService.createCourse(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Course created", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(
            @PathVariable UUID id, @RequestBody CourseDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(courseService.updateCourse(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted", null));
    }
}
