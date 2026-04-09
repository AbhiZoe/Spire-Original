"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, BookOpen, Loader2, AlertCircle, Plus, ChevronLeft, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getCourse, getCourseLessons, getCourseAssignments, enroll, createLesson, deleteLesson, checkCertificate, generateCertificate } from "@/lib/api";
import { Award, Download, Loader2 as CertLoader } from "lucide-react";
import { LessonItem } from "@/components/courses/LessonItem";
import { AssignmentItem } from "@/components/courses/AssignmentItem";
import { QuizSection } from "@/components/courses/QuizSection";
import { QuizBuilder } from "@/components/courses/QuizBuilder";
import { TaskSection } from "@/components/courses/TaskSection";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { VideoUpload } from "@/components/courses/VideoUpload";
import { cn } from "@/lib/utils";

interface CourseData {
  id: number; title: string; slug: string; description: string; shortDescription: string;
  level: string; price: number; isFree: boolean; durationHours: number; category: string;
  rating: number; ratingsCount: number; lessonsCount: number; enrolledCount: number;
  thumbnailUrl: string | null; isPublished: boolean;
  instructor: { id: number; fullName: string; email: string; avatarUrl: string | null } | null;
}

interface LessonData {
  id: number; courseId: number; title: string; description: string | null;
  videoUrl: string | null; orderIndex: number; durationMinutes: number | null;
  isFree: boolean;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");

  // Assignments
  const [assignments, setAssignments] = useState<Array<{ id: number; title: string; description: string; assignmentType: string; dueDate: string | null; unlocked: boolean }>>([]);

  // Track which lessons are completed
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  // Add lesson form state
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", description: "", videoUrl: "", durationMinutes: "", isFree: false });
  const [addingLesson, setAddingLesson] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [certificate, setCertificate] = useState<{ exists: boolean; certificateUrl?: string } | null>(null);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [certError, setCertError] = useState("");

  const isOwner = user && course?.instructor?.id === user.id;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const canManage = isOwner || isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const courseData = await getCourse(id);
        setCourse(courseData as CourseData);
        const lessonData = await getCourseLessons(id);
        setLessons((lessonData || []) as LessonData[]);
        // Try to fetch assignments (only works if authenticated)
        try {
          const assignmentData = await getCourseAssignments(id);
          setAssignments((assignmentData || []) as typeof assignments);
          setEnrolled(true);
          // Check certificate
          try { const c = await checkCertificate(id); setCertificate(c); } catch {}
        } catch {
          // Not enrolled or not authenticated
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { router.push(`/login?redirect=/courses/${id}`); return; }
    setEnrolling(true); setEnrollMsg("");
    try {
      await enroll(Number(id));
      setEnrollMsg("Enrolled successfully!");
      setEnrolled(true);
      const lessonData = await getCourseLessons(id);
      setLessons((lessonData || []) as LessonData[]);
      try { const a = await getCourseAssignments(id); setAssignments((a || []) as typeof assignments); } catch {}
    } catch (err) {
      setEnrollMsg(err instanceof Error ? err.message : "Failed to enroll");
    } finally { setEnrolling(false); }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingLesson(true);
    try {
      await createLesson(id, {
        title: newLesson.title,
        description: newLesson.description || undefined,
        videoUrl: newLesson.videoUrl || undefined,
        durationMinutes: newLesson.durationMinutes ? parseInt(newLesson.durationMinutes) : undefined,
        isFree: newLesson.isFree,
      });
      setNewLesson({ title: "", description: "", videoUrl: "", durationMinutes: "", isFree: false });
      setShowAddLesson(false);
      const lessonData = await getCourseLessons(id);
      setLessons((lessonData || []) as LessonData[]);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Failed to add lesson");
    } finally { setAddingLesson(false); }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Failed to delete");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen pt-24"><Loader2 className="animate-spin text-teal-600" size={32} /></div>;
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-24 px-6">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-gray-700 mb-4">{error || "Course not found"}</p>
        <Link href="/courses" className="text-teal-600 hover:underline">Back to courses</Link>
      </div>
    );
  }

  return (
    <section className="pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0E6B6B] mb-6">
          <ChevronLeft size={16} /> Back to courses
        </Link>

        {/* Course header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Info */}
          <div className="lg:col-span-2">
            <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 inline-block",
              course.level === "BEGINNER" && "bg-teal-100 text-teal-700",
              course.level === "INTERMEDIATE" && "bg-amber-100 text-amber-700",
              course.level === "ADVANCED" && "bg-red-100 text-red-700",
            )}>{course.level}</span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description || course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Clock size={14} /> {course.durationHours}h</span>
              <span className="flex items-center gap-1"><BookOpen size={14} /> {course.lessonsCount} lessons</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> {course.rating} ({course.ratingsCount})</span>
              <span>{course.enrolledCount.toLocaleString()} enrolled</span>
            </div>

            {course.instructor && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E6B6B] text-white flex items-center justify-center text-sm font-bold">
                  {course.instructor.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{course.instructor.fullName}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {course.isFree ? "Free" : `₹${course.price}`}
            </div>
            <p className="text-sm text-gray-500 mb-6">{course.isFree ? "No payment required" : "One-time payment"}</p>

            <button onClick={handleEnroll} disabled={enrolling}
              className="w-full py-3 rounded-xl bg-[#0E6B6B] text-white text-sm font-semibold hover:bg-[#5FA3A3] transition disabled:opacity-50 flex items-center justify-center gap-2">
              {enrolling ? <><Loader2 size={16} className="animate-spin" /> Enrolling...</> : "Enroll Now"}
            </button>

            {enrollMsg && <p className={cn("text-xs mt-3 text-center", enrollMsg.includes("success") ? "text-teal-600" : "text-red-500")}>{enrollMsg}</p>}

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p>Category: <span className="font-medium text-gray-900">{course.category}</span></p>
              <p>Level: <span className="font-medium text-gray-900">{course.level}</span></p>
              <p>Lessons: <span className="font-medium text-gray-900">{course.lessonsCount}</span></p>
            </div>
          </div>
        </motion.div>

        {/* Lessons section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Course Lessons</h2>
            {canManage && (
              <button onClick={() => setShowAddLesson(!showAddLesson)}
                className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700">
                <Plus size={16} /> Add Lesson
              </button>
            )}
          </div>

          {/* Add lesson form */}
          {showAddLesson && canManage && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleAddLesson}
              className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
              <input type="text" placeholder="Lesson title *" required value={newLesson.title}
                onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="text" placeholder="Description (optional)" value={newLesson.description}
                onChange={(e) => setNewLesson((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="Video URL (optional)" value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson((p) => ({ ...p, videoUrl: e.target.value }))}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <input type="number" placeholder="Duration (min)" value={newLesson.durationMinutes}
                  onChange={(e) => setNewLesson((p) => ({ ...p, durationMinutes: e.target.value }))}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={newLesson.isFree} onChange={(e) => setNewLesson((p) => ({ ...p, isFree: e.target.checked }))}
                  className="rounded text-teal-600" />
                Free preview lesson
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={addingLesson}
                  className="px-6 py-2.5 rounded-lg bg-[#0E6B6B] text-white text-sm font-semibold hover:bg-[#5FA3A3] disabled:opacity-50">
                  {addingLesson ? "Adding..." : "Add Lesson"}
                </button>
                <button type="button" onClick={() => setShowAddLesson(false)}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Lesson list */}
          {lessons.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No lessons yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <div key={lesson.id}>
                  <LessonItem
                    id={lesson.id}
                    title={lesson.title}
                    description={lesson.description}
                    orderIndex={lesson.orderIndex}
                    durationMinutes={lesson.durationMinutes}
                    isFree={lesson.isFree}
                    videoUrl={lesson.videoUrl}
                    canManage={canManage}
                    canComplete={enrolled && !canManage}
                    index={idx}
                    onDelete={handleDeleteLesson}
                    onClick={() => setSelectedLessonId(selectedLessonId === lesson.id ? null : lesson.id)}
                    onComplete={async () => {
                      // Track this lesson as completed (unlocks quiz)
                      setCompletedLessons((prev) => new Set(prev).add(lesson.id));
                      try { const a = await getCourseAssignments(id); setAssignments((a || []) as typeof assignments); } catch {}
                    }}
                  />
                  {/* Expanded lesson content — video + quiz */}
                  {selectedLessonId === lesson.id && (
                    <div className="mt-2 ml-13 space-y-4">
                      {/* Video player for students */}
                      {(lesson.isFree || lesson.videoUrl) && (
                        <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} isFree={lesson.isFree} />
                      )}

                      {/* Video upload for instructors/admins */}
                      {canManage && (
                        <VideoUpload
                          lessonId={lesson.id}
                          currentVideoUrl={lesson.videoUrl}
                          onUploadComplete={(url) => {
                            setLessons((prev) => prev.map((l) =>
                              l.id === lesson.id ? { ...l, videoUrl: url } : l
                            ));
                          }}
                        />
                      )}

                      {/* Quiz — Builder for instructor, Taker for students */}
                      {canManage ? (
                        <QuizBuilder lessonId={lesson.id} lessonTitle={lesson.title} />
                      ) : (lesson.isFree || lesson.videoUrl) ? (
                        <QuizSection lessonId={lesson.id} isAuthenticated={isAuthenticated} lessonCompleted={completedLessons.has(lesson.id)} />
                      ) : null}

                      {/* Tasks */}
                      <TaskSection lessonId={lesson.id} isAuthenticated={isAuthenticated} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Assignments Section ─────────────────────────────── */}
        {assignments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Assignments</h2>
            <div className="space-y-3">
              {assignments.map((assignment, idx) => (
                <AssignmentItem
                  key={assignment.id}
                  id={assignment.id}
                  title={assignment.title}
                  description={assignment.description}
                  assignmentType={assignment.assignmentType}
                  dueDate={assignment.dueDate}
                  unlocked={assignment.unlocked}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Certificate Section ─────────────────────────────── */}
        {enrolled && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
            <div className="bg-gradient-to-r from-teal-50 to-teal-50 rounded-2xl border border-teal-200 p-8 text-center">
              <Award size={40} className="text-teal-600 mx-auto mb-3" />
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Course Certificate</h2>

              {certificate?.exists && certificate.certificateUrl ? (
                <>
                  <p className="text-teal-600 font-medium mb-4">You&apos;ve earned your certificate!</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${certificate.certificateUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E6B6B] text-white text-sm font-semibold hover:bg-[#5FA3A3] transition"
                  >
                    <Download size={16} /> Download Certificate (PDF)
                  </a>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
                    Complete all lessons, pass all quizzes, and submit all assignments to earn your certificate.
                  </p>
                  {certError && <p className="text-red-500 text-sm mb-3">{certError}</p>}
                  <button
                    onClick={async () => {
                      setGeneratingCert(true);
                      setCertError("");
                      try {
                        const result = await generateCertificate(id);
                        setCertificate({ exists: true, certificateUrl: result.certificateUrl });
                      } catch (err) {
                        setCertError(err instanceof Error ? err.message : "Not eligible yet");
                      } finally {
                        setGeneratingCert(false);
                      }
                    }}
                    disabled={generatingCert}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {generatingCert ? <><CertLoader size={16} className="animate-spin" /> Generating...</> : <><Award size={16} /> Generate Certificate</>}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
