"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  BookOpen,
  Award,
  BarChart3,
  Lock,
  Play,
  CheckCircle2,
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { PRICING_TIERS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

// Mock modules for the course detail page
const MOCK_MODULES = [
  {
    title: "Getting Started",
    lessons: [
      { title: "Introduction & Setup", duration: 12, isFree: true, completed: true },
      { title: "Core Concepts Overview", duration: 18, isFree: true, completed: true },
      { title: "Your First Project", duration: 25, isFree: false, completed: false },
    ],
  },
  {
    title: "Fundamentals",
    lessons: [
      { title: "Deep Dive into Basics", duration: 22, isFree: false, completed: false },
      { title: "Practical Exercises", duration: 30, isFree: false, completed: false },
      { title: "Assessment & Review", duration: 15, isFree: false, completed: false },
    ],
  },
  {
    title: "Advanced Topics",
    lessons: [
      { title: "Advanced Patterns", duration: 28, isFree: false, completed: false },
      { title: "Real-World Case Study", duration: 35, isFree: false, completed: false },
      { title: "Final Project", duration: 45, isFree: false, completed: false },
    ],
  },
];

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const course = MOCK_COURSES.find((c) => c.id === id);

  // Mock enrolled state for course-1
  const isEnrolled = id === "course-1";
  const progressPercent = isEnrolled ? 65 : 0;

  if (!course) {
    return (
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Course not found
        </h1>
        <p className="text-gray-500 mb-6">
          The course you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </section>
    );
  }

  const freeTier = PRICING_TIERS[0];
  const proTier = PRICING_TIERS[1];

  return (
    <div className="pt-24 pb-20">
      {/* Hero banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col lg:flex-row gap-10 items-center">
          {/* Thumbnail */}
          <div className="w-full lg:w-96 h-56 rounded-2xl bg-white/10 backdrop-blur-sm overflow-hidden shrink-0">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                loading="lazy"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-white/40 text-sm">{course.category}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Badge variant="level" level={course.level} className="mb-3" />
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl font-bold mb-3">
              {course.title}
            </h1>
            <p className="text-white/80 max-w-xl mb-4">
              {course.short_description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {course.duration_hours} hours
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} /> {course.lessons_count} lessons
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 size={14} /> {course.enrolled_count.toLocaleString()}{" "}
                enrolled
              </span>
              <span className="flex items-center gap-1">
                <Award size={14} /> {course.rating} / 5
              </span>
            </div>

            {isEnrolled && (
              <div className="mt-6 max-w-sm">
                <p className="text-sm text-white/70 mb-1">Your progress</p>
                <ProgressBar value={progressPercent} />
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <div className="mx-auto max-w-7xl px-6 mt-12 flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-[#1B4332] mb-3">
              About This Course
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </section>

          {/* Instructor card */}
          {course.instructor && (
            <GlassCard>
              <div className="flex items-center gap-4">
                {course.instructor.avatar_url ? (
                  <img
                    src={course.instructor.avatar_url}
                    alt={course.instructor.name}
                    loading="lazy"
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332] font-bold text-xl shrink-0">
                    {course.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">
                    {course.instructor.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Module / Lesson list */}
          <section>
            <h2 className="text-xl font-bold text-[#1B4332] mb-4">
              Course Content
            </h2>
            <div className="space-y-4">
              {MOCK_MODULES.map((mod, mi) => (
                <GlassCard key={mi} className="p-0 overflow-hidden">
                  <div className="px-5 py-3 bg-[#1B4332]/5 border-b border-white/40">
                    <h3 className="font-semibold text-sm text-[#1B4332]">
                      Module {mi + 1}: {mod.title}
                    </h3>
                  </div>
                  <ul>
                    {mod.lessons.map((lesson, li) => (
                      <li
                        key={li}
                        className="flex items-center gap-3 px-5 py-3 text-sm border-b border-gray-100 last:border-0"
                      >
                        {lesson.completed ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500 shrink-0"
                          />
                        ) : lesson.isFree ? (
                          <Play
                            size={16}
                            className="text-[#1B4332] shrink-0"
                          />
                        ) : (
                          <Lock
                            size={16}
                            className="text-gray-400 shrink-0"
                          />
                        )}
                        <span
                          className={
                            lesson.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-700"
                          }
                        >
                          {lesson.title}
                        </span>
                        {lesson.isFree && !lesson.completed && (
                          <span className="text-xs text-emerald-600 font-medium">
                            Free Preview
                          </span>
                        )}
                        <span className="ml-auto text-xs text-gray-400">
                          {lesson.duration} min
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Pricing comparison */}
          <section>
            <h2 className="text-xl font-bold text-[#1B4332] mb-4">
              Free vs Pro
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[freeTier, proTier].map((tier) => (
                <GlassCard
                  key={tier.name}
                  className={
                    tier.highlighted
                      ? "ring-2 ring-[#1B4332]"
                      : ""
                  }
                >
                  <h3 className="font-bold text-lg text-[#1B4332]">
                    {tier.name}
                  </h3>
                  <p className="text-2xl font-bold mt-1">
                    {tier.price === 0
                      ? "Free"
                      : `₹${tier.price}/mo`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    {tier.description}
                  </p>
                  <ul className="space-y-2">
                    {tier.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-28 space-y-6">
            <GlassCard>
              <h3 className="font-bold text-[#1B4332] mb-4">Course Info</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Level</span>
                  <Badge variant="level" level={course.level} />
                </li>
                <li className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-gray-800">
                    {course.duration_hours}h
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Lessons</span>
                  <span className="font-medium text-gray-800">
                    {course.lessons_count}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Certificate</span>
                  <span className="font-medium text-gray-800">
                    {course.is_free ? "No" : "Yes"}
                  </span>
                </li>
              </ul>

              <div className="mt-6 space-y-3">
                {isEnrolled ? (
                  <Button className="w-full">Resume Learning</Button>
                ) : course.is_free ? (
                  <Button className="w-full">Enrol Now</Button>
                ) : (
                  <Button className="w-full">Subscribe to Access</Button>
                )}
                {!course.is_free && !isEnrolled && (
                  <p className="text-xs text-center text-gray-400">
                    Included with Pro plan at ₹{proTier.price}/mo
                  </p>
                )}
              </div>
            </GlassCard>

            {/* Tags */}
            <GlassCard>
              <h3 className="font-bold text-[#1B4332] mb-3 text-sm">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </aside>
      </div>
    </div>
  );
}
