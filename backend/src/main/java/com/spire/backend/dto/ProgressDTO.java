package com.spire.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDTO {

    private UUID courseId;
    private UUID lessonId;
    private Double completionPercent;
    private Boolean completed;
    private Integer streakDays;
}
