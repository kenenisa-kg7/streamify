"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Movie } from "@/types";
import { IMAGE_URL } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (movieId: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
}
interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (movieId: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  progress?: number;
}
export default function MovieCard({
  movie,
  isInWatchlist = false,
  onToggleWatchlist,
  isFavorite = false,
  onToggleFavorite,
  progress,
}: MovieCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const posterUrl = movie.poster_path && !imgError
    ? `${IMAGE_URL}/w300${movie.poster_path}`
    : "/placeholder.png";

  const rating = movie.vote_average?.toFixed(1);

  return (
    <div
      onClick={() => router.push(`/watch/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "6px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.8)" : "none",
        flexShrink: 0,
        width: "160px",
      }}
    >
      <div style={{ position: "relative", width: "160px", height: "240px" }}>
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          style={{ objectFit: "cover" }}
          onError={() => setImgError(true)}
          sizes="160px"
        />
        {progress !== undefined && progress > 0 && (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "4px", background: "rgba(255,255,255,0.3)",
  }}>
    <div style={{
      height: "100%", width: `${progress}%`,
      background: "#e50914",
    }} />
  </div>
)}
      </div>

      {/* Watchlist toggle — top right */}
      {onToggleWatchlist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie.id);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: isInWatchlist ? "#e50914" : "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "#fff",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
          title={isInWatchlist ? "Remove from My List" : "Add to My List"}
        >
          {isInWatchlist ? "✓" : "+"}
        </button>
      )}

      {/* Favorite toggle — top left */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.4)",
            color: isFavorite ? "#e50914" : "#fff",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      )}

      {hovered && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "12px"
        }}>
          <p style={{
            color: "#ffffff", fontSize: "13px",
            fontWeight: 600, marginBottom: "4px",
            overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {movie.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#e50914", fontSize: "12px", fontWeight: 700 }}>
              ★ {rating}
            </span>
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>
              {movie.release_date?.slice(0, 4)}
            </span>
          </div>
          <div style={{
            marginTop: "8px", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#ffffff", borderRadius: "50%",
            width: "32px", height: "32px"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#000000">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}