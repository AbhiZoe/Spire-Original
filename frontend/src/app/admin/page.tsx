"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  BookOpen,
  LayoutDashboard,
  LogOut,
  UserCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getAnalytics,
  getUsers,
  getPendingInstructorRequests,
  approveInstructor,
  rejectInstructor,
} from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

const sidebarLinks = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Users", icon: Users },
  { label: "Instructor Requests", icon: UserCheck },
];

interface Analytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalSubscriptions: number;
}

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface InstructorRequest {
  id: number;
  userId: number;
  userEmail: string;
  userFullName: string;
  status: string;
  createdAt: string;
}

function roleBadgeColor(role: string) {
  switch (role.toUpperCase()) {
    case "ADMIN":
      return "bg-purple-100 text-purple-700";
    case "INSTRUCTOR":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  // Data states
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<InstructorRequest[]>([]);

  // Loading / error
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action feedback
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Fetch analytics
  useEffect(() => {
    setLoadingAnalytics(true);
    getAnalytics()
      .then((data) => setAnalytics(data as Analytics))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingAnalytics(false));
  }, []);

  // Fetch users
  useEffect(() => {
    setLoadingUsers(true);
    getUsers()
      .then((data) => setUsers(data as User[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingUsers(false));
  }, []);

  // Fetch instructor requests
  const fetchRequests = () => {
    setLoadingRequests(true);
    getPendingInstructorRequests()
      .then((data) => setRequests(data as InstructorRequest[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingRequests(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle approve / reject
  const handleAction = async (requestId: number, action: "approve" | "reject") => {
    setProcessingId(requestId);
    setActionMsg(null);
    try {
      if (action === "approve") {
        await approveInstructor(requestId);
      } else {
        await rejectInstructor(requestId);
      }
      setActionMsg({ type: "success", text: `Instructor request ${action}d successfully.` });
      fetchRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed";
      setActionMsg({ type: "error", text: message });
    } finally {
      setProcessingId(null);
    }
  };

  // Stats cards derived from analytics
  const statCards = analytics
    ? [
        { label: "Total Users", value: analytics.totalUsers.toLocaleString(), icon: Users },
        { label: "Total Courses", value: analytics.totalCourses.toLocaleString(), icon: BookOpen },
        { label: "Enrollments", value: analytics.totalEnrollments.toLocaleString(), icon: CreditCard },
        { label: "Subscriptions", value: analytics.totalSubscriptions.toLocaleString(), icon: UserCheck },
      ]
    : [];

  const Spinner = () => (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="animate-spin text-[#0F766E]" size={32} />
    </div>
  );

  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/60 backdrop-blur-sm border-r border-white/40 px-4 py-8 shrink-0">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#0F766E] px-3 mb-8">
          Admin
        </h2>
        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => setActiveTab(link.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === link.label
                  ? "bg-[#0F766E] text-white"
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
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Global error banner */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">
                <XCircle size={16} />
              </button>
            </div>
          )}

          {/* ──────────── Overview Tab ──────────── */}
          {activeTab === "Overview" && (
            <>
              <h1 className="text-2xl font-bold text-[#0F766E] mb-6">
                Dashboard Overview
              </h1>

              {/* Stats cards */}
              {loadingAnalytics ? (
                <Spinner />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {statCards.map((stat) => (
                    <GlassCard key={stat.label}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0F766E]/10 flex items-center justify-center">
                          <stat.icon size={18} className="text-[#0F766E]" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-[#1a1a1a]">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </GlassCard>
                  ))}
                </div>
              )}

              {/* Recent users table */}
              <h2 className="text-lg font-bold text-[#0F766E] mb-4">
                Recent Users
              </h2>
              {loadingUsers ? (
                <Spinner />
              ) : (
                <GlassCard className="mb-10 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map((user) => (
                        <tr key={user.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 font-medium text-[#1a1a1a]">{user.fullName}</td>
                          <td className="py-3 text-gray-500">{user.email}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-gray-400">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </GlassCard>
              )}
            </>
          )}

          {/* ──────────── Users Tab ──────────── */}
          {activeTab === "Users" && (
            <>
              <h1 className="text-2xl font-bold text-[#0F766E] mb-6">
                All Users
              </h1>
              {loadingUsers ? (
                <Spinner />
              ) : (
                <GlassCard className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-3 font-medium">ID</th>
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 text-gray-400">#{user.id}</td>
                          <td className="py-3 font-medium text-[#1a1a1a]">{user.fullName}</td>
                          <td className="py-3 text-gray-500">{user.email}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-gray-400">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </GlassCard>
              )}
            </>
          )}

          {/* ──────────── Instructor Requests Tab ──────────── */}
          {activeTab === "Instructor Requests" && (
            <>
              <h1 className="text-2xl font-bold text-[#0F766E] mb-6">
                Pending Instructor Requests
              </h1>

              {/* Action feedback */}
              {actionMsg && (
                <div
                  className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                    actionMsg.type === "success"
                      ? "bg-teal-50 border-teal-200 text-teal-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {actionMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {actionMsg.text}
                  <button onClick={() => setActionMsg(null)} className="ml-auto opacity-60 hover:opacity-100 cursor-pointer">
                    <XCircle size={16} />
                  </button>
                </div>
              )}

              {loadingRequests ? (
                <Spinner />
              ) : requests.length === 0 ? (
                <GlassCard>
                  <p className="text-center text-gray-400 py-8">No pending instructor requests.</p>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <GlassCard key={req.id}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1a1a1a]">{req.userFullName}</p>
                          <p className="text-sm text-gray-500">{req.userEmail}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                              PENDING
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleAction(req.id, "approve")}
                            disabled={processingId === req.id}
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {processingId === req.id ? (
                              <Loader2 size={14} className="animate-spin inline mr-1" />
                            ) : null}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "reject")}
                            disabled={processingId === req.id}
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {processingId === req.id ? (
                              <Loader2 size={14} className="animate-spin inline mr-1" />
                            ) : null}
                            Reject
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
