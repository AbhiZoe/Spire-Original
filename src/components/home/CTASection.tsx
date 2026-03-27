"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative">
      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 w-full -translate-y-[99%] pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24"
        >
          <path
            d="M0 100V60C240 0 480 80 720 60C960 40 1200 80 1440 40V100H0Z"
            fill="#065f46"
          />
        </svg>
      </div>

      <div ref={ref} className="bg-emerald-800 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="font-serif text-3xl sm:text-4xl font-bold text-white"
          >
            Ready to Start Learning?
          </motion.h2>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-4 text-emerald-100 text-lg"
          >
            Join thousands of learners who are building real-world skills with
            expert-led courses, hands-on projects, and a supportive community.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Link
              href="/register"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
