package com.spire.backend.service;

import com.spire.backend.dto.CourseDTO;
import com.spire.backend.entity.Course;
import com.spire.backend.entity.User;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.repository.CourseRepository;
import com.spire.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findByIsPublished(true).stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return CourseDTO.from(course);
    }

    public List<CourseDTO> getCoursesByLevel(String level) {
        Course.Level courseLevel = Course.Level.valueOf(level.toUpperCase());
        return courseRepository.findByLevel(courseLevel).stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> searchCourses(String query) {
        return courseRepository.searchByTitle(query).stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO dto, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorId));

        Course course = Course.builder()
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .shortDescription(dto.getShortDescription())
                .level(Course.Level.valueOf(dto.getLevel()))
                .price(dto.getPrice())
                .isFree(dto.getIsFree())
                .durationHours(dto.getDurationHours())
                .thumbnailUrl(dto.getThumbnailUrl())
                .instructor(instructor)
                .category(dto.getCategory())
                .tags(dto.getTags())
                .isPublished(dto.getIsPublished() != null ? dto.getIsPublished() : false)
                .build();

        return CourseDTO.from(courseRepository.save(course));
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        if (dto.getTitle() != null) course.setTitle(dto.getTitle());
        if (dto.getDescription() != null) course.setDescription(dto.getDescription());
        if (dto.getShortDescription() != null) course.setShortDescription(dto.getShortDescription());
        if (dto.getLevel() != null) course.setLevel(Course.Level.valueOf(dto.getLevel()));
        if (dto.getPrice() != null) course.setPrice(dto.getPrice());
        if (dto.getIsFree() != null) course.setIsFree(dto.getIsFree());
        if (dto.getDurationHours() != null) course.setDurationHours(dto.getDurationHours());
        if (dto.getThumbnailUrl() != null) course.setThumbnailUrl(dto.getThumbnailUrl());
        if (dto.getCategory() != null) course.setCategory(dto.getCategory());
        if (dto.getTags() != null) course.setTags(dto.getTags());
        if (dto.getIsPublished() != null) course.setIsPublished(dto.getIsPublished());

        return CourseDTO.from(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course", "id", id);
        }
        courseRepository.deleteById(id);
    }
}
