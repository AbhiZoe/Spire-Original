"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  DollarSign,
  BookOpen,
  LayoutDashboard,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const sidebarLinks = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Users", icon: Users, active: false },
  { label: "Courses", icon: BookOpen, active: false },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const stats = [
  { label: "Total Users", value: "24,580", icon: Users, change: "+12%" },
  { label: "Active Subscribers", value: "8,430", icon: CreditCard, change: "+8%" },
  { label: "Revenue (MTD)", value: "₹42.1L", icon: DollarSign, change: "+15%" },
  { label: "Courses", value: "6", icon: BookOpen, change: "+1" },
];

const mockUsers = [
  { id: 1, name: "Rohit Verma", email: "rohit@example.com", plan: "pro" as const, joined: "2025-01-15" },
  { id: 2, name: "Ananya Desai", email: "ananya@example.com", plan: "free" as const, joined: "2025-02-20" },
  { id: 3, name: "Karthik Nair", email: "karthik@example.com", plan: "pro" as const, joined: "2025-03-01" },
  { id: 4, name: "Meera Joshi", email: "meera@example.com", plan: "enterprise" as const, joined: "2024-12-10" },
  { id: 5, name: "Arjun Patel", email: "arjun@example.com", plan: "free" as const, joined: "2025-03-18" },
];

const recentActivity = [
  { text: "Arjun Patel signed up", time: "5 min ago" },
  { text: "Karthik Nair upgraded to Pro", time: "1 hour ago" },
  { text: "New course published: Mobile App Development", time: "3 hours ago" },
  { text: "Meera Joshi completed Cloud Architecture", time: "5 hours ago" },
  { text: "Monthly revenue milestone: ₹40L reached", time: "Yesterday" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/60 backdrop-blur-sm border-r border-white/40 px-4 py-8 shrink-0">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1B4332] px-3 mb-8">
          Admin
        </h2>
        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => setActiveTab(link.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === link.label
                  ? "bg-[#1B4332] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </button>
          ))}
        </nav>
        <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 lg:px-10 py-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-[#1B4332] mb-6">
            Dashboard Overview
          </h1>

          {/* Stats cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <GlassCard key={stat.label}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                    <stat.icon size={18} className="text-[#1B4332]" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a1a]">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* User management table */}
          <h2 className="text-lg font-bold text-[#1B4332] mb-4">
            Recent Users
          </h2>
          <GlassCard className="mb-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 font-medium text-[#1a1a1a]">
                      {user.name}
                    </td>
                    <td className="py-3 text-gray-500">{user.email}</td>
                    <td className="py-3">
                      <Badge variant="plan" plan={user.plan} />
                    </td>
                    <td className="py-3 text-gray-500">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>

          {/* Course management */}
          <h2 className="text-lg font-bold text-[#1B4332] mb-4">
            Course Management
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {MOCK_COURSES.map((course) => (
              <GlassCard key={course.id}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="level" level={course.level} />
                  <span
                    className={`text-xs font-medium ${
                      course.is_published
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  >
                    {course.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#1a1a1a] line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {course.instructor?.name}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>
                    {course.enrolled_count.toLocaleString()} enrolled
                  </span>
                  <span>{course.rating} / 5</span>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Recent activity feed */}
          <h2 className="text-lg font-bold text-[#1B4332] mb-4">
            Recent Activity
          </h2>
          <GlassCard>
            <ul className="space-y-4">
              {recentActivity.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{item.text}</span>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}
