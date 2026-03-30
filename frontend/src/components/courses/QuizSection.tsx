"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle, XCircle, Loader2, Trophy } from "lucide-react";
import { getLessonQuiz, submitQuiz } from "@/lib/api";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string | null;
  optionD: string | null;
}

interface QuizData {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

interface QuizSectionProps {
  lessonId: number;
  isAuthenticated: boolean;
}

export function QuizSection({ lessonId, isAuthenticated }: QuizSectionProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await getLessonQuiz(lessonId);
        setQuiz(data as QuizData);
      } catch {
        // No quiz for this lesson — that's fine
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId, isAuthenticated]);

  const handleSelect = (questionId: number, option: string) => {
    if (result) return; // already submitted
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await submitQuiz(quiz.id, answers);
      setResult(res as typeof result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;
  if (!quiz || !quiz.questions?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-purple-600" />
          <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
          <span className="text-xs text-gray-500 ml-auto">{quiz.questions.length} questions</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id}>
            <p className="text-sm font-medium text-gray-900 mb-3">
              <span className="text-purple-600 font-bold mr-1">Q{idx + 1}.</span>
              {q.questionText}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const text = q[`option${opt}` as keyof QuizQuestion] as string | null;
                if (!text) return null;
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    disabled={!!result}
                    className={cn(
                      "text-left px-4 py-3 rounded-xl border text-sm transition-all",
                      selected
                        ? "bg-purple-100 border-purple-400 text-purple-800 font-medium"
                        : "bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50",
                      result && "cursor-default"
                    )}
                  >
                    <span className="font-bold mr-2 text-purple-500">{opt}.</span>
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-5 rounded-xl text-center",
              result.percentage >= 70 ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"
            )}
          >
            <Trophy size={32} className={result.percentage >= 70 ? "text-emerald-500 mx-auto mb-2" : "text-amber-500 mx-auto mb-2"} />
            <p className="text-2xl font-bold text-gray-900">{result.percentage}%</p>
            <p className="text-sm text-gray-600">
              {result.score} / {result.totalQuestions} correct
            </p>
            <p className={cn("text-sm font-medium mt-1", result.percentage >= 70 ? "text-emerald-600" : "text-amber-600")}>
              {result.percentage >= 70 ? "Great job!" : "Keep learning and try again!"}
            </p>
          </motion.div>
        )}

        {/* Submit button */}
        {!result && (
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length === 0}
            className="w-full py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Quiz"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
