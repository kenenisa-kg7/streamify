"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMovieGenres } from "@/lib/tmdb";
import { Genre } from "@/types";

export default function GenreDropdown() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMovieGenres()
      .then((res) => setGenres(res.data.genres))
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectGenre(genre: Genre) {
    setOpen(false);
    router.push(`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`);
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <span
        onClick={() => setOpen((prev) => !prev)}
        style={{ color: "#e5e5e5", fontSize: "14px", cursor: "pointer" }}
      >
        Genres ▾
      </span>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          width: "200px",
          maxHeight: "320px",
          overflowY: "auto",
          background: "rgba(20,20,20,0.98)",
          border: "1px solid #333",
          borderRadius: "6px",
          padding: "8px",
          zIndex: 300,
        }}>
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => handleSelectGenre(genre)}
              style={{
                padding: "8px 12px",
                color: "#e5e5e5",
                fontSize: "14px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {genre.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}