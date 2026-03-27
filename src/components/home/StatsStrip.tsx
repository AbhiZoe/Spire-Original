"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Students", target: 10000, suffix: "+" },
  { label: "Courses", target: 200, suffix: "+" },
  { label: "Instructors", target: 50, suffix: "+" },
  { label: "Completion Rate", target: 95, suffix: "%" },
];

function AnimatedCounter({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-emerald-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="mt-1 text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
