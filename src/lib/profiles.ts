import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  userId: string;
  createdAt: string;
}

interface ApiError {
  error: string;
}

// Every profile route requires the JWT, so this helper builds the header once
function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchProfiles(): Promise<Profile[]> {
  const res = await fetch(`${API_URL}/profiles`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || "Failed to load profiles");
  }

  return data.profiles as Profile[];
}

export async function createProfile(name: string, avatar: string): Promise<Profile> {
  const res = await fetch(`${API_URL}/profiles`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, avatar }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || "Failed to create profile");
  }

  return data.profile as Profile;
}

export async function deleteProfile(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/profiles/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to delete profile");
  }
}

// --- Active profile tracking (which profile is currently "logged in" within the account) ---

export function saveActiveProfile(profile: Profile) {
  localStorage.setItem("streamify_active_profile", JSON.stringify(profile));
}

export function getActiveProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("streamify_active_profile");
  return raw ? JSON.parse(raw) : null;
}

export function clearActiveProfile() {
  localStorage.removeItem("streamify_active_profile");
}