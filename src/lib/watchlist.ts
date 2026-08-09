import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WatchlistItem {
  id: string;
  movieId: number;
  profileId: string;
  createdAt: string;
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

export async function fetchWatchlist(profileId: string): Promise<WatchlistItem[]> {
  const res = await fetch(`${API_URL}/watchlist?profileId=${profileId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || "Failed to load watchlist");
  }

  return data.watchlist as WatchlistItem[];
}

export async function addToWatchlist(movieId: number, profileId: string): Promise<void> {
  const res = await fetch(`${API_URL}/watchlist`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ movieId, profileId }),
  });

  // 409 means it's already saved — not a real failure from the user's perspective,
  // so we don't throw for that specific case.
  if (!res.ok && res.status !== 409) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to add to watchlist");
  }
}

export async function removeFromWatchlist(movieId: number, profileId: string): Promise<void> {
  const res = await fetch(`${API_URL}/watchlist/${movieId}?profileId=${profileId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to remove from watchlist");
  }
}