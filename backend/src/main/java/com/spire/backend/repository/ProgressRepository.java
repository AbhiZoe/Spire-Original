package com.spire.backend.repository;

import com.spire.backend.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, UUID> {

    List<Progress> findByUserId(UUID userId);

    List<Progress> findByUserIdAndCourseId(UUID userId, UUID courseId);

    Optional<Progress> findByUserIdAndLessonId(UUID userId, UUID lessonId);
}
