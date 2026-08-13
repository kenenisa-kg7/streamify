import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WatchHistoryItem {
  id: string;
  movieId: number;
  progress: number;
  profileId: string;
  watchedAt: string;
}

interface ApiError {
  error: string;
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchWatchHistory(profileId: string): Promise<WatchHistoryItem[]> {
  const res = await fetch(`${API_URL}/watch-history?profileId=${profileId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || "Failed to load watch history");
  }

  return data.history as WatchHistoryItem[];
}

export async function updateWatchProgress(
  movieId: number,
  profileId: string,
  progress: number
): Promise<void> {
  const res = await fetch(`${API_URL}/watch-history`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ movieId, profileId, progress }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to update watch progress");
  }
}

export async function removeFromHistory(movieId: number, profileId: string): Promise<void> {
  const res = await fetch(`${API_URL}/watch-history/${movieId}?profileId=${profileId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to remove from watch history");
  }
}