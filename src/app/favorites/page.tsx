"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";
import { getMovieDetails } from "@/lib/tmdb";
import { getToken, getStoredUser, logout } from "@/lib/auth";
import { getActiveProfile } from "@/lib/profiles";
import { fetchFavorites, removeFromFavorites } from "@/lib/favorites";
import RowSkeleton from "@/components/RowSkeleton";

export default function FavoritesPage() {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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

    const loadFavorites = async () => {
      try {
        const favoriteItems = await fetchFavorites(activeProfile.id);

        const movieResponses = await Promise.all(
          favoriteItems.map((item) => getMovieDetails(item.movieId))
        );

        const fullMovies: Movie[] = movieResponses.map((res) => res.data);
        setMovies(fullMovies);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setError("Failed to load your favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [router]);

  async function handleRemove(movieId: number) {
    const activeProfile = getActiveProfile();
    if (!activeProfile) return;

    try {
      await removeFromFavorites(movieId, activeProfile.id);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  }
if (loading) {
  return (
    <main style={{ minHeight: "100vh", background: "#141414", padding: "100px 48px 40px" }}>
      <RowSkeleton cardCount={10} />
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
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/browse" style={{ color: "#e5e5e5", fontSize: "14px", textDecoration: "none" }}>
              Home
            </Link>
            <span style={{ color: "#e5e5e5", fontSize: "14px", cursor: "pointer" }}>TV Shows</span>
            <span style={{ color: "#e5e5e5", fontSize: "14px", cursor: "pointer" }}>Movies</span>
            <Link href="/mylist" style={{ color: "#e5e5e5", fontSize: "14px", textDecoration: "none" }}>
              My List
            </Link>
            <Link href="/favorites" style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              Favorites
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          Favorites
        </h1>

        {movies.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "16px" }}>
            No favorites yet. Tap the ♡ on any movie in Browse to add it here.
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={true}
                onToggleFavorite={handleRemove}
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