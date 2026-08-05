const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

interface AuthError {
  error: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as AuthError).error || "Registration failed");
  }

  return data as AuthResponse;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as AuthError).error || "Login failed");
  }

  return data as AuthResponse;
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem("streamify_token", token);
  localStorage.setItem("streamify_user", JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null; // guard for server-side rendering
  return localStorage.getItem("streamify_token");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("streamify_user");
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem("streamify_token");
  localStorage.removeItem("streamify_user");
}