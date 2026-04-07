import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0E6B6B] p-12 text-white">
        <Link href="/" className="font-serif text-3xl font-bold">
          Spire
        </Link>

        <div>
          <h2 className="font-serif text-4xl font-bold leading-tight mb-4">
            Master skills.<br />Transform careers.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Join thousands of learners mastering in-demand skills with expert-led courses,
            progress tracking, and certificates.
          </p>
        </div>

        <div className="flex items-center gap-10 text-sm text-white/60">
          <div>
            <span className="text-2xl font-bold text-white block">10K+</span>
            Students
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">200+</span>
            Courses
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">95%</span>
            Completion
          </div>
        </div>
      </div>

      {/* Right - Form area */}
      <div className="flex items-center justify-center bg-[#F0EDE8] px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <Link
            href="/"
            className="lg:hidden block text-center font-serif text-3xl font-bold text-[#0E6B6B] mb-10"
          >
            Spire
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
