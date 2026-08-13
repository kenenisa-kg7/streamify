"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/tmdb";
import { getToken, getStoredUser, logout } from "@/lib/auth";
import { getActiveProfile } from "@/lib/profiles";
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { fetchFavorites, addToFavorites, removeFromFavorites } from "@/lib/favorites";

interface MovieRow {
  title: string;
  movies: Movie[];
}

export default function BrowsePage() {
  const router = useRouter();

  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [rows, setRows] = useState<MovieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Fetch TMDB movie data for the browse rows
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);

        const trendingMovies: Movie[] = trending.data.results;
        const popularMovies: Movie[] = popular.data.results;
        const topRatedMovies: Movie[] = topRated.data.results;
        const upcomingMovies: Movie[] = upcoming.data.results;

        const randomIndex = Math.floor(Math.random() * trendingMovies.length);
        setFeaturedMovie(trendingMovies[randomIndex]);

        setRows([
          { title: "Trending Now", movies: trendingMovies },
          { title: "Popular on Streamify", movies: popularMovies },
          { title: "Top Rated", movies: topRatedMovies },
          { title: "Upcoming", movies: upcomingMovies },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please check your connection.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auth guard + active profile check + initial watchlist load
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
      .then((items) => {
        const ids = new Set(items.map((item) => item.movieId));
        setWatchlistIds(ids);
      })
      .catch((err) => console.error("Failed to load watchlist:", err));
  fetchFavorites(activeProfile.id)
  .then((items) => {
    const ids = new Set(items.map((item) => item.movieId));
    setFavoriteIds(ids);
  })
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
      <main style={{
        minHeight: "100vh", background: "#141414",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#ffffff", fontSize: "18px" }}>Loading Streamify...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{
        minHeight: "100vh", background: "#141414",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#e50914", fontSize: "18px" }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#141414" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)"
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
<Link href="/favorites" style={{ color: "#e5e5e5", fontSize: "14px", textDecoration: "none" }}>
  Favorites
</Link>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <span style={{ color: "#e5e5e5", fontSize: "14px" }}>
              {user.name}
            </span>
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

      {/* Hero Banner */}
      <HeroBanner movie={featuredMovie} />

      {/* Movie rows */}
      <div style={{ padding: "0 48px 64px", marginTop: "-80px", position: "relative", zIndex: 5 }}>
        {rows.map((row) => (
          <div key={row.title} style={{ marginBottom: "40px" }}>
            <h2 style={{
              color: "#ffffff", fontSize: "20px",
              fontWeight: 700, marginBottom: "12px"
            }}>
              {row.title}
            </h2>
            <div style={{
              display: "flex", gap: "8px",
              overflowX: "auto", paddingBottom: "12px"
            }}>
              {row.movies.map((movie) => (
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
          </div>
        ))}
      </div>

    </main>
  );
}