"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32">
      {/* Decorative SVG shapes */}
      <div className="absolute top-20 -left-32 w-96 h-96 opacity-20 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="200" fill="#d1fae5" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-full pointer-events-none">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80C360 160 720 0 1080 80C1260 120 1380 100 1440 80V180H0V80Z"
            fill="#ecfdf5"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        {/* Text content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
          >
            Advance Your Career with Structured Learning
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
          >
            Master in-demand skills with expert-led courses, track your
            progress, and earn certificates.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Start Learning Free
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border-2 border-emerald-600 px-8 py-3.5 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              View Courses
            </Link>
          </motion.div>
        </div>

        {/* Feature image placeholder */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full max-w-lg"
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
            alt="Person learning on device"
            loading="lazy"
            className="rounded-2xl object-cover w-full aspect-[4/3]"
          />
        </motion.div>
      </div>
    </section>
  );
}
