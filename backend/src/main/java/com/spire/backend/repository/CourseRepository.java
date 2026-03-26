package com.spire.backend.repository;

import com.spire.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findByLevel(Course.Level level);

    List<Course> findByIsPublished(Boolean isPublished);

    Optional<Course> findBySlug(String slug);

    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Course> searchByTitle(@Param("query") String query);

    List<Course> findByCategory(String category);

    List<Course> findByInstructorId(UUID instructorId);
}
