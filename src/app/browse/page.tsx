"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/Moviecard";
import { Movie } from "@/types";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/tmdb";

interface MovieRow {
  title: string;
  movies: Movie[];
}

export default function BrowsePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [rows, setRows] = useState<MovieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch all categories at the same time
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

        // Pick a random trending movie for the hero banner
        const randomIndex = Math.floor(Math.random() * trendingMovies.length);
        setFeaturedMovie(trendingMovies[randomIndex]);

        // Build the rows
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
            {["Home", "TV Shows", "Movies", "My List"].map((item) => (
              <span key={item} style={{ color: "#e5e5e5", fontSize: "14px", cursor: "pointer" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          width: "32px", height: "32px", borderRadius: "4px",
          background: "linear-gradient(135deg, #e50914, #a78bfa)"
        }} />
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
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}