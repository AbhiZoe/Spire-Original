"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TESTIMONIALS } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < count
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            What Our Students Say
          </h2>
          <p className="mt-3 text-gray-600">
            Hear from learners who have transformed their careers with Spire.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="rounded-2xl bg-amber-50/60 border border-amber-100 p-6 shadow-sm"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-4 text-gray-700 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
