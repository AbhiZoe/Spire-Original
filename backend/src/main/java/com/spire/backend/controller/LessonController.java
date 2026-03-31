package com.spire.backend.controller;

import com.spire.backend.dto.ApiResponse;
import com.spire.backend.dto.LessonDTO;
import com.spire.backend.dto.LessonRequest;
import com.spire.backend.service.LessonService;
import com.spire.backend.service.VideoUploadService;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;
    private final VideoUploadService videoUploadService;

    // ─── Add lesson to course (owner INSTRUCTOR or ADMIN) ───────────

    @PostMapping("/api/courses/{courseId}/lessons")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('INSTRUCTOR') and @courseSecurity.isOwner(#courseId, authentication))")
    public ResponseEntity<ApiResponse<LessonDTO>> createLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody LessonRequest dto,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        LessonDTO created = lessonService.createLesson(courseId, dto, userId, isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Lesson added", created));
    }

    // ─── Update lesson ──────────────────────────────────────────────

    @PutMapping("/api/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<LessonDTO>> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonRequest dto,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        LessonDTO updated = lessonService.updateLesson(lessonId, dto, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Lesson updated", updated));
    }

    // ─── Delete lesson ──────────────────────────────────────────────

    @DeleteMapping("/api/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(
            @PathVariable Long lessonId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        lessonService.deleteLesson(lessonId, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted", null));
    }

    // ─── Upload video to lesson (Cloudinary) ────────────────────────

    @PostMapping("/api/lessons/{lessonId}/upload-video")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> uploadVideo(
            @PathVariable Long lessonId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        String videoUrl = videoUploadService.uploadVideo(lessonId, file, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Video uploaded", java.util.Map.of(
                "lessonId", lessonId,
                "videoUrl", videoUrl
        )));
    }
}
