"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Zap,
  Trophy,
  BookOpen,
  Clock,
  ArrowRight,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { MOCK_COURSES, MOCK_ACHIEVEMENTS, MOCK_BADGES } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

// Mock user dashboard data
const mockUser = {
  name: "Rohit",
  plan: "pro" as const,
  status: "active",
  renewalDate: "2026-04-25",
  streak: 12,
  xp: 2450,
  level: "Developer",
};

const enrolledCourses = [
  { course: MOCK_COURSES[0], progress: 65 },
  { course: MOCK_COURSES[2], progress: 40 },
  { course: MOCK_COURSES[4], progress: 15 },
];

const lastLesson = {
  courseTitle: MOCK_COURSES[0].title,
  lessonTitle: "Core Concepts Overview",
  courseId: MOCK_COURSES[0].id,
};

const activityTimeline = [
  { time: "Today, 10:30 AM", text: "Completed lesson: Core Concepts Overview", icon: BookOpen },
  { time: "Yesterday, 4:15 PM", text: "Earned badge: Code Streak", icon: Trophy },
  { time: "Mar 22, 2:00 PM", text: "Started course: UI/UX Design Fundamentals", icon: TrendingUp },
  { time: "Mar 20, 9:00 AM", text: "Completed lesson: Introduction & Setup", icon: BookOpen },
];

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Greeting */}
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1B4332] mb-1">
          Welcome back, {mockUser.name}!
        </h1>
        <p className="text-gray-500 mb-8">Here is your learning overview.</p>

        {/* Top row: Streak, XP, Subscription */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {/* Streak */}
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1a1a]">
                  {mockUser.streak} days
                </p>
                <p className="text-xs text-gray-500">Learning Streak</p>
              </div>
            </div>
          </GlassCard>

          {/* XP / Level */}
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <Zap size={20} className="text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1a1a]">
                  {mockUser.xp.toLocaleString()} XP
                </p>
                <p className="text-xs text-gray-500">
                  Level: {mockUser.level}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Subscription status */}
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CreditCard size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="plan" plan={mockUser.plan} />
                  <span className="text-xs text-emerald-600 font-medium">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Renews {mockUser.renewalDate}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Resume learning */}
        <GlassCard className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                <Clock size={20} className="text-[#1B4332]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resume where you left off</p>
                <p className="font-semibold text-[#1a1a1a]">
                  {lastLesson.lessonTitle}
                </p>
                <p className="text-xs text-gray-400">{lastLesson.courseTitle}</p>
              </div>
            </div>
            <Button size="sm" asChild>
              <Link href={`/courses/${lastLesson.courseId}`}>
                Continue <ArrowRight size={14} className="ml-1" />
              </Link>
            </Button>
          </div>
        </GlassCard>

        {/* Enrolled courses grid */}
        <h2 className="text-xl font-bold text-[#1B4332] mb-4">
          Your Courses
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {enrolledCourses.map(({ course, progress }) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <GlassCard hover className="h-full">
                <div className="h-28 -mx-6 -mt-6 mb-4 rounded-t-2xl bg-gradient-to-br from-[#1B4332]/10 to-[#2D6A4F]/20 flex items-center justify-center">
                  <span className="text-[#1B4332]/40 text-xs">
                    {course.category}
                  </span>
                </div>
                <Badge variant="level" level={course.level} className="mb-2" />
                <h3 className="font-semibold text-sm text-[#1a1a1a] line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">
                  {course.instructor?.name}
                </p>
                <ProgressBar value={progress} />
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Achievement badges */}
        <h2 className="text-xl font-bold text-[#1B4332] mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
          {MOCK_BADGES.map((badge) => {
            const unlocked = MOCK_ACHIEVEMENTS.some(
              (a) => a.badge_id === badge.id
            );
            return (
              <GlassCard
                key={badge.id}
                className={`text-center ${!unlocked ? "opacity-40" : ""}`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-2">
                  <Trophy
                    size={20}
                    className={unlocked ? "text-amber-500" : "text-gray-300"}
                  />
                </div>
                <p className="text-xs font-semibold text-[#1a1a1a]">
                  {badge.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {badge.description}
                </p>
              </GlassCard>
            );
          })}
        </div>

        {/* Plan details + upgrade */}
        <h2 className="text-xl font-bold text-[#1B4332] mb-4">Your Plan</h2>
        <GlassCard className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="plan" plan={mockUser.plan} />
                <span className="text-sm font-medium text-[#1a1a1a]">
                  Pro Plan
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Unlimited access to all courses, certificates, and priority
                support.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Next billing date: {mockUser.renewalDate}
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Upgrade to Enterprise
            </Button>
          </div>
        </GlassCard>

        {/* Activity timeline */}
        <h2 className="text-xl font-bold text-[#1B4332] mb-4">
          Recent Activity
        </h2>
        <GlassCard>
          <ul className="space-y-4">
            {activityTimeline.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B4332]/5 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={14} className="text-[#1B4332]" />
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]">{item.text}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </motion.div>
    </section>
  );
}
