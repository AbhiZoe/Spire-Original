package com.spire.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmitRequest {
    // Map of questionId -> selected answer ("A", "B", "C", "D")
    private Map<Long, String> answers;
}
