import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface FavoriteItem {
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

export async function fetchFavorites(profileId: string): Promise<FavoriteItem[]> {
  const res = await fetch(`${API_URL}/favorites?profileId=${profileId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error || "Failed to load favorites");
  }

  return data.favorites as FavoriteItem[];
}

export async function addToFavorites(movieId: number, profileId: string): Promise<void> {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ movieId, profileId }),
  });

  if (!res.ok && res.status !== 409) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to add to favorites");
  }
}

export async function removeFromFavorites(movieId: number, profileId: string): Promise<void> {
  const res = await fetch(`${API_URL}/favorites/${movieId}?profileId=${profileId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as ApiError).error || "Failed to remove from favorites");
  }
}