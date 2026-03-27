"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Promo Banner */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-[#1B4332] text-white text-center text-sm py-2 px-4 font-medium">
        🎓 New courses added weekly — Start your journey today
      </div>

      {/* Navbar */}
      <header
        className={cn(
          "fixed top-[36px] inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50"
            : "bg-white/50 backdrop-blur-sm"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-serif text-2xl font-bold text-[#1B4332] tracking-tight">
            {APP_NAME}
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-medium text-gray-600 hover:text-[#1B4332] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#1B4332] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">
                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span>{user.full_name}</span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          {user.role}
                        </span>
                      </div>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <User size={16} /> Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { logout(); setDropdownOpen(false); }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[#1B4332] transition-colors">
                  Sign In
                </Link>
                <Link href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2D6A4F] transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-[#1B4332] cursor-pointer" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white border-b border-gray-200"
            >
              <div className="flex flex-col gap-3 px-6 py-5">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-gray-700 hover:text-[#1B4332] py-1">
                    {link.label}
                  </Link>
                ))}
                <hr className="border-gray-200 my-1" />
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">
                        {user.full_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-gray-700 hover:text-[#1B4332] py-1">Dashboard</Link>
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-gray-700 hover:text-[#1B4332] py-1">Admin Panel</Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="text-sm font-medium text-red-600 hover:text-red-700 py-1 text-left">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-gray-700 hover:text-[#1B4332] py-1">Sign In</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center rounded-full bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2D6A4F] transition-colors mt-1">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
