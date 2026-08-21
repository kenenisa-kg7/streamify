"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TVCard from "@/components/TVCard";
import SearchBar from "@/components/SearchBar";
import GenreDropdown from "@/components/GenreDropdown";
import RowSkeleton from "@/components/RowSkeleton";
import { TVShow } from "@/types";
import { getTrendingTV, getPopularTV, getTopRatedTV } from "@/lib/tmdb";
import { getToken, getStoredUser, logout } from "@/lib/auth";

interface TVRow {
  title: string;
  shows: TVShow[];
}

export default function TVShowsPage() {
  const router = useRouter();

  const [rows, setRows] = useState<TVRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const [trending, popular, topRated] = await Promise.all([
          getTrendingTV(),
          getPopularTV(),
          getTopRatedTV(),
        ]);

        setRows([
          { title: "Trending Now", shows: trending.data.results },
          { title: "Popular Shows", shows: popular.data.results },
          { title: "Top Rated", shows: topRated.data.results },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch TV shows:", err);
        setError("Failed to load TV shows. Please check your connection.");
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setUser(getStoredUser());
  }, [router]);

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#141414", padding: "100px 48px 40px" }}>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
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
            <Link href="/tv" style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              TV Shows
            </Link>
            <GenreDropdown />
            <Link href="/mylist" style={{ color: "#e5e5e5", fontSize: "14px", textDecoration: "none" }}>
              My List
            </Link>
            <Link href="/favorites" style={{ color: "#e5e5e5", fontSize: "14px", textDecoration: "none" }}>
              Favorites
            </Link>
          </div>
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
          TV Shows
        </h1>

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
              {row.shows.map((show) => (
                <TVCard key={show.id} show={show} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}