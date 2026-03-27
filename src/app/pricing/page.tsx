"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: 0,
    icon: Zap,
    color: "emerald",
    description: "Get started with the basics",
    cta: "Start Free",
    href: "/signup",
    popular: false,
    features: [
      { name: "Access 3 free courses", included: true },
      { name: "Basic progress tracking", included: true },
      { name: "Community forum", included: true },
      { name: "All courses", included: false },
      { name: "Certificates", included: false },
      { name: "DRM video protection", included: false },
      { name: "Priority support", included: false },
      { name: "Downloads", included: false },
    ],
  },
  {
    name: "Pro",
    price: 499,
    icon: Crown,
    color: "emerald",
    description: "Everything you need to learn",
    cta: "Subscribe to Pro",
    plan: "pro",
    popular: true,
    features: [
      { name: "Access all courses", included: true },
      { name: "Full progress tracking", included: true },
      { name: "Community forum", included: true },
      { name: "Course certificates", included: true },
      { name: "DRM video protection", included: true },
      { name: "Priority support", included: true },
      { name: "Downloadable resources", included: true },
      { name: "Team seats", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: 999,
    icon: Building2,
    color: "emerald",
    description: "For teams and organizations",
    cta: "Subscribe to Enterprise",
    plan: "enterprise",
    popular: false,
    features: [
      { name: "Access all courses + custom paths", included: true },
      { name: "Full progress tracking", included: true },
      { name: "Community forum", included: true },
      { name: "Course certificates", included: true },
      { name: "DRM video protection", included: true },
      { name: "Dedicated support", included: true },
      { name: "Downloadable resources", included: true },
      { name: "Team seats & API access", included: true },
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (!token) {
      window.location.href = `/login?redirect=/pricing&plan=${plan}`;
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/subscriptions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.demo) {
        // Demo mode - simulate successful payment
        const verifyRes = await fetch(`${apiUrl}/api/subscriptions/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: data.order_id,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: "demo_signature",
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert(`${plan.toUpperCase()} subscription activated! (Demo mode)`);
          window.location.href = "/dashboard";
        }
        return;
      }

      // Real Razorpay checkout
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Spire",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
        order_id: data.order_id,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          const verifyRes = await fetch(`${apiUrl}/api/subscriptions/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            window.location.href = "/dashboard";
          }
        },
        prefill: { email: "" },
        theme: { color: "#1B4332" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="pt-32 pb-20 px-6">
      {/* Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade or cancel anytime.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: "easeOut" as const }}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm ${
                plan.popular
                  ? "border-[#1B4332] shadow-lg scale-[1.02]"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1B4332] text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? "bg-[#1B4332] text-white" : "bg-emerald-100 text-emerald-700"
                }`}>
                  <plan.icon size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price === 0 ? "Free" : `₹${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500 text-sm ml-1">/month</span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

              {plan.price === 0 ? (
                <Link
                  href={plan.href || "/signup"}
                  className="block w-full text-center py-3 rounded-xl border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition mb-6"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.plan!)}
                  disabled={loading === plan.plan}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition mb-6 disabled:opacity-60 ${
                    plan.popular
                      ? "bg-[#1B4332] text-white hover:bg-[#2D6A4F]"
                      : "border-2 border-[#1B4332] text-[#1B4332] hover:bg-emerald-50"
                  }`}
                >
                  {loading === plan.plan ? "Processing..." : plan.cta}
                </button>
              )}

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f.name} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <Check size={16} className="text-emerald-600 flex-shrink-0" />
                    ) : (
                      <X size={16} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={f.included ? "text-gray-700" : "text-gray-400"}>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-500">
            Have questions?{" "}
            <Link href="/support" className="text-[#1B4332] font-semibold hover:underline">
              Check our FAQ
            </Link>{" "}
            or{" "}
            <a href="mailto:support@spire-learn.in" className="text-[#1B4332] font-semibold hover:underline">
              contact support
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
