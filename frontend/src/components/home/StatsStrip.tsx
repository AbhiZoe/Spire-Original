"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";

const stats = [
  { label: "Students", target: 10000, suffix: "+", icon: Users },
  { label: "Courses", target: 200, suffix: "+", icon: BookOpen },
  { label: "Expert Instructors", target: 50, suffix: "+", icon: Award },
  { label: "Completion Rate", target: 95, suffix: "%", icon: TrendingUp },
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
    <section ref={ref} className="py-16 bg-[#F0EDE8]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-[#E3DED7] bg-white/80 backdrop-blur-sm p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#95C8CB]/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-[#0E6B6B]" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#0E6B6B]">
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
