"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { searchMovies, IMAGE_URL } from "@/lib/tmdb";
import { Movie } from "@/types";

export default function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce: wait 400ms after the user stops typing before actually searching,
  // so we're not firing a request on every single keystroke
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      searchMovies(query)
        .then((res) => {
          setResults(res.data.results.slice(0, 8)); // cap at 8 results for a clean dropdown
        })
        .catch((err) => console.error("Search failed:", err))
        .finally(() => setLoading(false));
    }, 400);

    // Cleanup: if the user types again before 400ms passes, cancel the pending search.
    // This is what makes it a "debounce" instead of firing a request per keystroke.
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close the dropdown if the user clicks anywhere outside this component
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectMovie(movieId: number) {
    setExpanded(false);
    setQuery("");
    setResults([]);
    router.push(`/watch/${movieId}`);
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {expanded && (
          <input
            autoFocus
            type="text"
            placeholder="Titles, people, genres"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "rgba(0,0,0,0.9)",
              border: "1px solid #666",
              borderRadius: "4px",
              color: "#fff",
              padding: "8px 12px",
              fontSize: "14px",
              width: "240px",
              outline: "none",
            }}
          />
        )}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: "18px",
            padding: "4px",
          }}
          title="Search"
        >
          🔍
        </button>
      </div>

      {/* Results dropdown — only shows when expanded AND there's something to show */}
      {expanded && query.trim() && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: "360px",
          maxHeight: "400px",
          overflowY: "auto",
          background: "rgba(20,20,20,0.98)",
          border: "1px solid #333",
          borderRadius: "6px",
          padding: "8px",
          zIndex: 300,
        }}>
          {loading && (
            <p style={{ color: "#9ca3af", fontSize: "14px", padding: "12px" }}>Searching...</p>
          )}

          {!loading && results.length === 0 && (
            <p style={{ color: "#9ca3af", fontSize: "14px", padding: "12px" }}>
              No results for &quot;{query}&quot;
            </p>
          )}

          {!loading && results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleSelectMovie(movie.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ position: "relative", width: "40px", height: "60px", flexShrink: 0, background: "#333", borderRadius: "3px", overflow: "hidden" }}>
                {movie.poster_path && (
                  <Image
                    src={`${IMAGE_URL}/w200${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="40px"
                  />
                )}
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>{movie.title}</p>
                <p style={{ color: "#9ca3af", fontSize: "12px" }}>
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}