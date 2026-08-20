"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { Movie } from "@/types";
import { getMoviesByGenre } from "@/lib/tmdb";
import { getToken, getStoredUser, logout } from "@/lib/auth";
import { getActiveProfile } from "@/lib/profiles";
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { fetchFavorites, addToFavorites, removeFromFavorites } from "@/lib/favorites";

export default function GenrePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const genreId = Number(params.id);
  const genreName = searchParams.get("name") || "Genre";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!genreId) return;

    getMoviesByGenre(genreId)
      .then((res) => {
        setMovies(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch genre movies:", err);
        setError("Failed to load movies for this genre.");
        setLoading(false);
      });
  }, [genreId]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      router.push("/profiles");
      return;
    }

    setUser(getStoredUser());

    fetchWatchlist(activeProfile.id)
      .then((items) => setWatchlistIds(new Set(items.map((i) => i.movieId))))
      .catch((err) => console.error("Failed to load watchlist:", err));

    fetchFavorites(activeProfile.id)
      .then((items) => setFavoriteIds(new Set(items.map((i) => i.movieId))))
      .catch((err) => console.error("Failed to load favorites:", err));
  }, [router]);

  async function handleToggleWatchlist(movieId: number) {
    const activeProfile = getActiveProfile();
    if (!activeProfile) return;

    const isSaved = watchlistIds.has(movieId);
    try {
      if (isSaved) {
        await removeFromWatchlist(movieId, activeProfile.id);
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(movieId);
          return next;
        });
      } else {
        await addToWatchlist(movieId, activeProfile.id);
        setWatchlistIds((prev) => new Set(prev).add(movieId));
      }
    } catch (err) {
      console.error("Failed to toggle watchlist:", err);
    }
  }

  async function handleToggleFavorite(movieId: number) {
    const activeProfile = getActiveProfile();
    if (!activeProfile) return;

    const isSaved = favoriteIds.has(movieId);
    try {
      if (isSaved) {
        await removeFromFavorites(movieId, activeProfile.id);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(movieId);
          return next;
        });
      } else {
        await addToFavorites(movieId, activeProfile.id);
        setFavoriteIds((prev) => new Set(prev).add(movieId));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <p style={{ color: "#ffffff", fontSize: "18px" }}>Loading {genreName}...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={pageStyle}>
        <p style={{ color: "#e50914", fontSize: "18px" }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#141414" }}>

      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px",
        background: "rgba(0,0,0,0.9)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link href="/browse" style={{ textDecoration: "none" }}>
            <h1 style={{ color: "#e50914", fontSize: "24px", fontWeight: 900 }}>STREAMIFY</h1>
          </Link>
          <Link href="/browse" style={{ color: "#e5e5e5", fontSize: "14px", textDecoration: "none" }}>
            Home
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <SearchBar />
          {user && (
            <span style={{ color: "#e5e5e5", fontSize: "14px" }}>{user.name}</span>
          )}
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            style={{
              background: "transparent",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#e5e5e5",
              padding: "6px 14px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: "40px 48px" }}>
        <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700, marginBottom: "24px" }}>
          {genreName}
        </h1>

        {movies.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "16px" }}>No movies found in this genre.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={watchlistIds.has(movie.id)}
                onToggleWatchlist={handleToggleWatchlist}
                isFavorite={favoriteIds.has(movie.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#141414",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};