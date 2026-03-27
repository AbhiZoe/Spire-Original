import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1B4332] p-12 text-white">
        <Link href="/" className="font-serif text-3xl font-bold">
          Spire
        </Link>

        <div>
          <h2 className="font-serif text-4xl font-bold leading-tight mb-4">
            Advance your career<br />with structured learning.
          </h2>
          <p className="text-emerald-200 text-lg leading-relaxed max-w-md">
            Join thousands of learners mastering in-demand skills with expert-led courses,
            progress tracking, and certificates.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm text-emerald-300">
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
      <div className="flex items-center justify-center bg-[#FDFBF7] px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <Link
            href="/"
            className="lg:hidden block text-center font-serif text-3xl font-bold text-[#1B4332] mb-10"
          >
            Spire
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
