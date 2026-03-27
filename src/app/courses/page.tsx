"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock } from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { LEVELS } from "@/lib/constants";
import type { CourseLevel } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

const allLevels = ["All", ...LEVELS] as const;

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_COURSES.filter((c) => {
      const matchesLevel =
        selectedLevel === "All" || c.level === selectedLevel;
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, search]);

  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#1B4332] mb-2">
        Explore Courses
      </h1>
      <p className="text-gray-600 mb-8">
        Find the perfect course to advance your skills.
      </p>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {allLevels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer",
                selectedLevel === level
                  ? "bg-[#1B4332] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72 sm:ml-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
          />
        </div>
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          No courses found. Try adjusting your filters.
        </p>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {filtered.map((course) => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/courses/${course.id}`} className="block group">
                <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-white/40 overflow-hidden transition-shadow hover:shadow-md">
                  {/* Thumbnail placeholder */}
                  <div className="h-44 bg-gradient-to-br from-[#1B4332]/10 to-[#2D6A4F]/20 flex items-center justify-center">
                    <span className="text-[#1B4332]/40 text-sm font-medium">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="level" level={course.level} />
                      {course.is_free && (
                        <span className="text-xs font-semibold text-emerald-600">
                          FREE
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-[#1a1a1a] group-hover:text-[#1B4332] transition-colors line-clamp-1">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {course.instructor?.name}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {course.duration_hours}h
                      </span>
                      <span>{course.lessons_count} lessons</span>
                      <span className="ml-auto font-medium text-amber-600">
                        {course.rating} / 5
                      </span>
                    </div>

                    {/* Progress indicator (mock: show for first 2 courses) */}
                    {(course.id === "course-1" || course.id === "course-3") && (
                      <div className="mt-3">
                        <ProgressBar
                          value={course.id === "course-1" ? 65 : 40}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
