const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Types ──────────────────────────────────────────────────────────

// Spring Boot wraps all responses in ApiResponse<T>
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserDTO {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

// ─── Core fetch helper ──────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Handle 401 — try refresh
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
      const retry = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      if (retry.ok) return retry.json();
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.detail || `API error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),  // camelCase for Spring Boot
    });
    if (!res.ok) return false;
    const wrapper: ApiResponse<AuthResponse> = await res.json();
    localStorage.setItem("access_token", wrapper.data.accessToken);
    localStorage.setItem("refresh_token", wrapper.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ───────────────────────────────────────────────────────────

export async function register(data: { fullName: string; email: string; password: string }): Promise<AuthResponse> {
  const wrapper = await apiFetch<ApiResponse<AuthResponse>>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return wrapper.data;
}

export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const wrapper = await apiFetch<ApiResponse<AuthResponse>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return wrapper.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return Promise.resolve();
}

// ─── User / Profile ─────────────────────────────────────────────────

export async function getProfile(): Promise<UserDTO> {
  const wrapper = await apiFetch<ApiResponse<UserDTO>>("/api/user/profile");
  return wrapper.data;
}

// ─── Courses ────────────────────────────────────────────────────────

export async function getCourses(params?: { level?: string; search?: string }) {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const wrapper = await apiFetch<ApiResponse<unknown[]>>(`/api/courses${qs}`);
  return wrapper.data;
}

export async function getCourse(id: string) {
  const wrapper = await apiFetch<ApiResponse<unknown>>(`/api/courses/${id}`);
  return wrapper.data;
}

// ─── Enrollments ────────────────────────────────────────────────────

export async function enroll(courseId: number) {
  const wrapper = await apiFetch<ApiResponse<unknown>>(`/api/enrollments/${courseId}`, { method: "POST" });
  return wrapper.data;
}

export async function getEnrollments() {
  const wrapper = await apiFetch<ApiResponse<unknown[]>>("/api/enrollments");
  return wrapper.data;
}

// ─── Subscriptions ──────────────────────────────────────────────────

export async function createOrder(plan: string) {
  const wrapper = await apiFetch<ApiResponse<unknown>>("/api/subscriptions/create", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
  return wrapper.data;
}

export async function verifyPayment(data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
  const wrapper = await apiFetch<ApiResponse<unknown>>("/api/subscriptions/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return wrapper.data;
}

export async function getSubscriptionStatus() {
  const wrapper = await apiFetch<ApiResponse<unknown>>("/api/subscriptions/status");
  return wrapper.data;
}

// ─── Admin ──────────────────────────────────────────────────────────

export async function getAnalytics() {
  const wrapper = await apiFetch<ApiResponse<unknown>>("/api/admin/analytics");
  return wrapper.data;
}

export async function getUsers() {
  const wrapper = await apiFetch<ApiResponse<unknown[]>>("/api/admin/users");
  return wrapper.data;
}
