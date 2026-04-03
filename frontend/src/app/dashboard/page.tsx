"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, ArrowRight, ShieldCheck, GraduationCap, PlusCircle,
  Users, BarChart3, Loader2, AlertCircle, Trash2, Eye, Edit, Globe, GlobeLock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getEnrollments, requestInstructor, getMyCourses, getInstructorStudents, deleteCourse, publishCourse, unpublishCourse } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  STUDENT: { label: "Student", color: "bg-teal-100 text-teal-700" },
  INSTRUCTOR: { label: "Instructor", color: "bg-violet-100 text-violet-700" },
  ADMIN: { label: "Admin", color: "bg-amber-100 text-amber-700" },
};

interface InstructorCourse {
  id: number; title: string; shortDescription: string; price: number;
  isFree: boolean; isPublished: boolean; level: string; category: string;
  enrolledCount: number; rating: number; lessonsCount: number;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<unknown[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestMsg, setRequestMsg] = useState("");

  // Instructor course management
  const [myCourses, setMyCourses] = useState<InstructorCourse[]>([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(false);
  const [myStudents, setMyStudents] = useState<Array<{ studentName: string; email: string; courseTitle: string; enrolledAt: string }>>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEnrollLoading(true);
    getEnrollments()
      .then((data) => setEnrollments(data ?? []))
      .catch(() => setEnrollments([]))
      .finally(() => setEnrollLoading(false));

    // Fetch instructor courses
    const role = user.role?.toUpperCase();
    if (role === "INSTRUCTOR" || role === "ADMIN") {
      setMyCoursesLoading(true);
      getMyCourses()
        .then((data) => setMyCourses((data ?? []) as InstructorCourse[]))
        .catch(() => setMyCourses([]))
        .finally(() => setMyCoursesLoading(false));

      setStudentsLoading(true);
      getInstructorStudents()
        .then((data) => setMyStudents(data ?? []))
        .catch(() => setMyStudents([]))
        .finally(() => setStudentsLoading(false));
    }
  }, [user]);

  const handleRequestInstructor = async () => {
    setRequestStatus("loading");
    try {
      await requestInstructor();
      setRequestStatus("success");
      setRequestMsg("Request submitted! An admin will review it shortly.");
    } catch (err: unknown) {
      setRequestStatus("error");
      setRequestMsg(err instanceof Error ? err.message : "Failed to submit request.");
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(courseId);
      setMyCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleTogglePublish = async (courseId: number, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishCourse(courseId);
      } else {
        await publishCourse(courseId);
      }
      setMyCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, isPublished: !isPublished } : c));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  if (authLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#95C8CB]" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20 text-center">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
        <Button asChild className="mt-4"><Link href="/login">Go to Login</Link></Button>
      </section>
    );
  }

  const role = user.role?.toUpperCase() ?? "STUDENT";
  const roleInfo = ROLE_CONFIG[role] ?? ROLE_CONFIG.STUDENT;
  const isInstructor = role === "INSTRUCTOR";
  const isAdmin = role === "ADMIN";

  return (
    <section className="mx-auto max-w-7xl px-6 pt-28 pb-20">
      <motion.div {...fadeUp}>
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#0E6B6B]">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-gray-500 mt-1">Here&apos;s your overview.</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color} w-fit`}>
            <ShieldCheck size={14} /> {roleInfo.label}
          </span>
        </div>

        {/* Role-based actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {role === "STUDENT" && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <GraduationCap size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Become an Instructor</p>
                  <p className="text-xs text-gray-500">Share your knowledge</p>
                </div>
              </div>
              {requestStatus === "success" ? (
                <p className="text-xs text-teal-600 font-medium">{requestMsg}</p>
              ) : requestStatus === "error" ? (
                <p className="text-xs text-red-500 font-medium">{requestMsg}</p>
              ) : (
                <Button size="sm" onClick={handleRequestInstructor} disabled={requestStatus === "loading"} className="w-full">
                  {requestStatus === "loading" && <Loader2 size={14} className="animate-spin mr-1" />}
                  Request Instructor Status
                </Button>
              )}
            </GlassCard>
          )}

          {(isInstructor || isAdmin) && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <PlusCircle size={20} className="text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Create a Course</p>
                  <p className="text-xs text-gray-500">Build and publish your curriculum</p>
                </div>
              </div>
              <Button size="sm" asChild className="w-full">
                <Link href="/courses/create">Create Course <ArrowRight size={14} className="ml-1" /></Link>
              </Button>
            </GlassCard>
          )}

          {isAdmin && (
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Users size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Admin Panel</p>
                  <p className="text-xs text-gray-500">Manage users and requests</p>
                </div>
              </div>
              <Button size="sm" asChild className="w-full">
                <Link href="/admin">Open Admin Panel <ArrowRight size={14} className="ml-1" /></Link>
              </Button>
            </GlassCard>
          )}
        </div>

        {/* ── Instructor: My Courses ───────────────────────────────── */}
        {(isInstructor || isAdmin) && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0E6B6B]">My Courses</h2>
              <Link href="/courses/create" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                <PlusCircle size={14} /> New Course
              </Link>
            </div>

            {myCoursesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-[#95C8CB]" />
              </div>
            ) : myCourses.length === 0 ? (
              <GlassCard className="text-center py-12">
                <BookOpen size={40} className="mx-auto text-violet-300 mb-3" />
                <p className="text-gray-500 text-sm mb-4">No courses created yet.</p>
                <Button size="sm" asChild>
                  <Link href="/courses/create">Create Your First Course</Link>
                </Button>
              </GlassCard>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                      {/* Card header */}
                      <div className="h-24 bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center relative">
                        <BookOpen size={24} className="text-violet-300" />
                        <span className={cn(
                          "absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                          course.isPublished ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"
                        )}>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>

                      {/* Card body */}
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{course.title}</h3>
                        {course.shortDescription && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.shortDescription}</p>
                        )}

                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                          <span>{course.lessonsCount} lessons</span>
                          <span>{course.enrolledCount} enrolled</span>
                          <span className="ml-auto font-medium text-gray-900">
                            {course.isFree ? "Free" : `₹${course.price}`}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                          <Link href={`/courses/${course.id}`}
                            className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                            <Eye size={12} /> View
                          </Link>
                          <button onClick={() => handleTogglePublish(course.id, course.isPublished)}
                            className={cn("flex items-center gap-1 text-xs font-medium",
                              course.isPublished ? "text-amber-600 hover:text-amber-700" : "text-blue-600 hover:text-blue-700"
                            )}>
                            {course.isPublished ? <><GlobeLock size={12} /> Unpublish</> : <><Globe size={12} /> Publish</>}
                          </button>
                          <button onClick={() => handleDeleteCourse(course.id)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium ml-auto">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── My Students (Instructor) ──────────────────────────────── */}
        {isInstructor && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#0E6B6B] mb-4 flex items-center gap-2">
              <Users size={20} /> My Students
              {myStudents.length > 0 && (
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {myStudents.length} enrolled
                </span>
              )}
            </h2>

            {studentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-[#95C8CB]" />
              </div>
            ) : myStudents.length === 0 ? (
              <GlassCard className="text-center py-12">
                <Users size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No students enrolled yet.</p>
              </GlassCard>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {myStudents.map((s, i) => (
                        <motion.tr key={`${s.email}-${s.courseTitle}-${i}`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                                {s.studentName?.charAt(0)?.toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{s.studentName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-gray-500">{s.email}</td>
                          <td className="px-6 py-3">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                              {s.courseTitle}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-400 text-xs">
                            {new Date(s.enrolledAt).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Enrolled Courses ──────────────────────────────────────── */}
        {error && (
          <GlassCard className="mb-6 border-red-200 bg-red-50/80">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} /> <p className="text-sm">{error}</p>
            </div>
          </GlassCard>
        )}

        <h2 className="text-xl font-bold text-[#0E6B6B] mb-4">
          {isInstructor || isAdmin ? "Enrolled Courses" : "Your Courses"}
        </h2>

        {enrollLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#95C8CB]" />
          </div>
        ) : enrollments.length === 0 ? (
          <GlassCard className="text-center py-12">
            <BookOpen size={40} className="mx-auto text-[#95C8CB]/40 mb-3" />
            <p className="text-gray-500 text-sm mb-4">No enrolled courses yet.</p>
            <Button size="sm" asChild>
              <Link href="/courses">Browse Courses <ArrowRight size={14} className="ml-1" /></Link>
            </Button>
          </GlassCard>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: unknown) => {
              const e = enrollment as Record<string, unknown>;
              const course = (e.course ?? e) as Record<string, unknown>;
              const id = course.id ?? e.courseId;
              const title = (course.title as string) ?? "Untitled Course";
              return (
                <Link key={String(id)} href={`/courses/${id}`}>
                  <GlassCard hover className="h-full">
                    <div className="h-28 -mx-6 -mt-6 mb-4 rounded-t-2xl bg-gradient-to-br from-[#0E6B6B]/10 to-[#5FA3A3]/20 flex items-center justify-center">
                      <BookOpen size={24} className="text-[#0E6B6B]/30" />
                    </div>
                    <h3 className="font-semibold text-sm text-[#1a1a1a] line-clamp-2">{title}</h3>
                    {typeof course.shortDescription === "string" && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.shortDescription}</p>
                    )}
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}
