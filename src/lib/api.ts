const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

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
    throw new Error(body.detail || body.message || `API error ${res.status}`);
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
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ───────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url: string | null;
    bio: string | null;
  };
}

export function register(data: { full_name: string; email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return Promise.resolve();
}

// ─── User / Profile ─────────────────────────────────────────────────

export function getProfile() {
  return apiFetch<AuthResponse["user"]>("/api/user/profile");
}
