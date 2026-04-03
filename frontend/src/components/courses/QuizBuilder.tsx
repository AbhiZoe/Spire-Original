"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Plus, Trash2, Save, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getLessonQuiz, createQuiz, addQuizQuestion } from "@/lib/api";
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

interface QuizBuilderProps {
  lessonId: number;
  lessonTitle: string;
}

const EMPTY_QUESTION = { questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" };

export function QuizBuilder({ lessonId, lessonTitle }: QuizBuilderProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Create quiz state
  const [quizTitle, setQuizTitle] = useState("");
  const [creating, setCreating] = useState(false);

  // Add question state
  const [newQ, setNewQ] = useState(EMPTY_QUESTION);
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    getLessonQuiz(lessonId)
      .then((data) => setQuiz(data as QuizData))
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) return;
    setCreating(true);
    setMessage(null);
    try {
      const result = await createQuiz(lessonId, quizTitle);
      const r = result as { id: number };
      setQuiz({ id: r.id, title: quizTitle, questions: [] });
      setMessage({ type: "success", text: "Quiz created! Now add questions." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create quiz" });
    } finally {
      setCreating(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!quiz || !newQ.questionText.trim() || !newQ.optionA.trim() || !newQ.optionB.trim()) return;
    setAdding(true);
    setMessage(null);
    try {
      const result = await addQuizQuestion(quiz.id, {
        questionText: newQ.questionText,
        optionA: newQ.optionA,
        optionB: newQ.optionB,
        optionC: newQ.optionC || undefined,
        optionD: newQ.optionD || undefined,
        correctAnswer: newQ.correctAnswer,
      });
      const r = result as { id: number; questionText: string };
      setQuiz((prev) => prev ? {
        ...prev,
        questions: [...prev.questions, { id: r.id, questionText: newQ.questionText, optionA: newQ.optionA, optionB: newQ.optionB, optionC: newQ.optionC || null, optionD: newQ.optionD || null }]
      } : prev);
      setNewQ(EMPTY_QUESTION);
      setShowAddForm(false);
      setMessage({ type: "success", text: "Question added!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to add question" });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mt-4 border border-purple-200 rounded-xl overflow-hidden bg-white">
      {/* Header — click to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition text-left"
      >
        <Brain size={18} className="text-purple-600" />
        <span className="font-medium text-sm text-gray-900 flex-1">
          Quiz Builder {quiz ? `(${quiz.questions.length} questions)` : "— No quiz yet"}
        </span>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Message */}
              {message && (
                <div className={cn("flex items-center gap-2 text-xs p-3 rounded-lg",
                  message.type === "success" ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"
                )}>
                  {message.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {message.text}
                </div>
              )}

              {/* No quiz yet — create one */}
              {!quiz && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Create a quiz for: <strong>{lessonTitle}</strong></p>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Quiz title (e.g., 'React Hooks Quiz')"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button onClick={handleCreateQuiz} disabled={creating || !quizTitle.trim()}
                    className="px-5 py-2.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-1.5">
                    {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    {creating ? "Creating..." : "Create Quiz"}
                  </button>
                </div>
              )}

              {/* Quiz exists — show questions + add form */}
              {quiz && (
                <>
                  <h4 className="font-semibold text-sm text-purple-800">{quiz.title}</h4>

                  {/* Existing questions */}
                  {quiz.questions.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No questions yet. Add your first question below.</p>
                  ) : (
                    <div className="space-y-2">
                      {quiz.questions.map((q, idx) => (
                        <div key={q.id} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <span className="text-xs font-bold text-purple-500 mt-0.5">Q{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-900 font-medium">{q.questionText}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-gray-500">
                              <span>A: {q.optionA}</span>
                              <span>B: {q.optionB}</span>
                              {q.optionC && <span>C: {q.optionC}</span>}
                              {q.optionD && <span>D: {q.optionD}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add question form */}
                  {!showAddForm ? (
                    <button onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700">
                      <Plus size={14} /> Add Question
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 p-4 rounded-lg border border-purple-200 bg-purple-50/50">
                      <p className="text-xs font-semibold text-purple-700">New Question</p>

                      <textarea value={newQ.questionText}
                        onChange={(e) => setNewQ((p) => ({ ...p, questionText: e.target.value }))}
                        placeholder="Question text *"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input value={newQ.optionA} onChange={(e) => setNewQ((p) => ({ ...p, optionA: e.target.value }))}
                          placeholder="Option A *" className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        <input value={newQ.optionB} onChange={(e) => setNewQ((p) => ({ ...p, optionB: e.target.value }))}
                          placeholder="Option B *" className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        <input value={newQ.optionC} onChange={(e) => setNewQ((p) => ({ ...p, optionC: e.target.value }))}
                          placeholder="Option C (optional)" className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        <input value={newQ.optionD} onChange={(e) => setNewQ((p) => ({ ...p, optionD: e.target.value }))}
                          placeholder="Option D (optional)" className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400" />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Correct Answer</label>
                        <div className="flex gap-2">
                          {["A", "B", "C", "D"].map((opt) => (
                            <button key={opt} onClick={() => setNewQ((p) => ({ ...p, correctAnswer: opt }))}
                              className={cn(
                                "w-10 h-10 rounded-lg text-sm font-bold transition",
                                newQ.correctAnswer === opt
                                  ? "bg-purple-600 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:border-purple-400"
                              )}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={handleAddQuestion}
                          disabled={adding || !newQ.questionText.trim() || !newQ.optionA.trim() || !newQ.optionB.trim()}
                          className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-1">
                          {adding ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                          {adding ? "Saving..." : "Save Question"}
                        </button>
                        <button onClick={() => { setShowAddForm(false); setNewQ(EMPTY_QUESTION); }}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
