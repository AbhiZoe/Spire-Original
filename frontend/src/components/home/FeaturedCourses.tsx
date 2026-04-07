"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { getCourses } from "@/lib/api";
import { MOCK_COURSES } from "@/lib/mock-data";
import type { Course } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="rounded-2xl border border-[#E3DED7] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="aspect-video overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              loading="lazy"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0E6B6B] to-[#95C8CB] flex items-center justify-center">
              <svg
                className="h-12 w-12 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
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
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#95C8CB]/20 text-[#0E6B6B] mb-3">
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
            <span className="text-gray-300">|</span>
            <StarRating rating={course.rating} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E3DED7] pt-4">
            <span className="text-base font-bold text-gray-900">
              {course.is_free ? (
                <span className="text-[#0E6B6B]">Free</span>
              ) : (
                `\u20B9${course.price}`
              )}
            </span>
            <span className="text-sm font-medium text-[#0E6B6B] group-hover:underline">
              View Course &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCourses() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES.slice(0, 3));

  useEffect(() => {
    getCourses()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setCourses(res.slice(0, 3) as Course[]);
        }
      })
      .catch(() => {
        // keep mock data
      });
  }, []);

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
            Popular Courses
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Explore our most enrolled courses
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
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

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-12 text-center"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-[#0E6B6B] font-semibold text-lg hover:underline underline-offset-4"
          >
            View All Courses &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
