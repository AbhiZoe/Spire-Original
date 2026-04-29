package com.spire.backend.repository;

import com.spire.backend.entity.MentorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorAssignmentRepository extends JpaRepository<MentorAssignment, Long> {
    Optional<MentorAssignment> findByEnrollmentId(Long enrollmentId);
    List<MentorAssignment> findByMentorIdAndStatus(Long mentorId, String status);
    long countByMentorIdAndStatus(Long mentorId, String status);
}
