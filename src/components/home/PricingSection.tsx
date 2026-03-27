"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRICING_TIERS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function PricingSection() {
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
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade or cancel
            anytime.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className={`relative rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-emerald-500 bg-emerald-50 shadow-lg scale-[1.03]"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                  Recommended
                </span>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{tier.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  {tier.price === 0 ? "Free" : formatPrice(tier.price)}
                </span>
                {tier.price > 0 && (
                  <span className="text-gray-500 text-sm">
                    /{tier.interval}
                  </span>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/pricing"
                className={`mt-8 block w-full rounded-full py-3 text-sm font-semibold text-center transition-colors ${
                  tier.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
