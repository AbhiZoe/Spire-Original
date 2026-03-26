package com.spire.backend.service;

import com.spire.backend.dto.ProgressDTO;
import com.spire.backend.entity.Course;
import com.spire.backend.entity.Lesson;
import com.spire.backend.entity.Progress;
import com.spire.backend.entity.User;
import com.spire.backend.exception.ResourceNotFoundException;
import com.spire.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public List<ProgressDTO> getUserProgress(UUID userId) {
        return progressRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProgressDTO> getCourseProgress(UUID userId, UUID courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProgressDTO updateProgress(UUID userId, UUID courseId, ProgressDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        Lesson lesson = null;
        if (dto.getLessonId() != null) {
            lesson = lessonRepository.findById(dto.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", dto.getLessonId()));
        }

        Progress progress;
        if (dto.getLessonId() != null) {
            progress = progressRepository.findByUserIdAndLessonId(userId, dto.getLessonId())
                    .orElse(Progress.builder().user(user).course(course).lesson(lesson).build());
        } else {
            var existing = progressRepository.findByUserIdAndCourseId(userId, courseId);
            progress = existing.isEmpty()
                    ? Progress.builder().user(user).course(course).build()
                    : existing.get(0);
        }

        if (dto.getCompletionPercent() != null) progress.setCompletionPercent(dto.getCompletionPercent());
        if (dto.getCompleted() != null) progress.setCompleted(dto.getCompleted());
        if (dto.getStreakDays() != null) progress.setStreakDays(dto.getStreakDays());
        progress.setLastAccessed(LocalDateTime.now());

        return toDTO(progressRepository.save(progress));
    }

    public int getStreakDays(UUID userId) {
        return progressRepository.findByUserId(userId).stream()
                .mapToInt(Progress::getStreakDays)
                .max()
                .orElse(0);
    }

    private ProgressDTO toDTO(Progress p) {
        return ProgressDTO.builder()
                .courseId(p.getCourse().getId())
                .lessonId(p.getLesson() != null ? p.getLesson().getId() : null)
                .completionPercent(p.getCompletionPercent())
                .completed(p.getCompleted())
                .streakDays(p.getStreakDays())
                .build();
    }
}
