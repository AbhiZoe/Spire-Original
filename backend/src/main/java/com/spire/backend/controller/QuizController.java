package com.spire.backend.controller;

import com.spire.backend.dto.*;
import com.spire.backend.entity.Question;
import com.spire.backend.entity.Quiz;
import com.spire.backend.entity.QuizAttempt;
import com.spire.backend.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // ─── Create quiz for lesson (instructor/admin) ──────────────────

    @PostMapping("/api/lessons/{lessonId}/quiz")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createQuiz(
            @PathVariable Long lessonId,
            @Valid @RequestBody QuizRequest dto,
            Authentication auth) {
        Quiz quiz = quizService.createQuiz(lessonId, dto, uid(auth), isAdmin(auth));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Quiz created", Map.of(
                "id", quiz.getId(), "title", quiz.getTitle(), "lessonId", lessonId
        )));
    }

    // ─── Add question to quiz (instructor/admin) ────────────────────

    @PostMapping("/api/quizzes/{quizId}/questions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody QuestionRequest dto,
            Authentication auth) {
        Question q = quizService.addQuestion(quizId, dto, uid(auth), isAdmin(auth));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Question added", Map.of(
                "id", q.getId(), "questionText", q.getQuestionText()
        )));
    }

    // ─── Get quiz for lesson (authenticated) ────────────────────────

    @GetMapping("/api/lessons/{lessonId}/quiz")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuiz(@PathVariable Long lessonId) {
        Quiz quiz = quizService.getQuizForLesson(lessonId);
        List<Question> questions = quizService.getQuestions(quiz.getId());

        List<Map<String, Object>> questionData = questions.stream().map(q -> {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", q.getId());
            m.put("questionText", q.getQuestionText());
            m.put("optionA", q.getOptionA());
            m.put("optionB", q.getOptionB());
            m.put("optionC", q.getOptionC());
            m.put("optionD", q.getOptionD());
            // Do NOT send correctAnswer to student
            return m;
        }).toList();

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "id", quiz.getId(),
                "title", quiz.getTitle(),
                "lessonId", lessonId,
                "questions", questionData
        )));
    }

    // ─── Submit quiz answers (student) ──────────────────────────────

    @PostMapping("/api/quizzes/{quizId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody QuizSubmitRequest dto,
            Authentication auth) {
        QuizAttempt attempt = quizService.submitQuiz(quizId, dto, uid(auth));
        return ResponseEntity.ok(ApiResponse.success("Quiz submitted", Map.of(
                "score", attempt.getScore(),
                "totalQuestions", attempt.getTotalQuestions(),
                "percentage", attempt.getPercentage()
        )));
    }

    private Long uid(Authentication a) { return Long.parseLong(a.getPrincipal().toString()); }
    private boolean isAdmin(Authentication a) { return a.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN")); }
}
