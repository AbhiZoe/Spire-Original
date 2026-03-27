"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MOCK_COURSES as FEATURED_COURSES } from "@/lib/mock-data";
import type { Course } from "@/lib/types";

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            loading="lazy"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="h-12 w-12 text-emerald-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Level badge */}
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mb-3">
          {course.level}
        </span>

        <h3 className="font-semibold text-gray-900 text-lg leading-snug line-clamp-2">
          {course.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {course.instructor?.name}
        </p>

        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
          <span>{course.duration_hours}h</span>
          <span>·</span>
          <span>{course.lessons_count} lessons</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <svg
              className="h-4 w-4 text-amber-400 fill-amber-400"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {course.rating}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            {course.is_free ? "Free" : `₹${course.price}`}
          </span>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View Course &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function FeaturedCourses() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Featured Courses
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Hand-picked courses to help you get started on your learning
            journey.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
