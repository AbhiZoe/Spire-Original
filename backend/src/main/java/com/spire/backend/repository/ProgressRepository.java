package com.spire.backend.repository;

import com.spire.backend.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    List<Progress> findByUserId(Long userId);

    List<Progress> findByUserIdAndCourseId(Long userId, Long courseId);

    Optional<Progress> findByUserIdAndLessonId(Long userId, Long lessonId);
}
