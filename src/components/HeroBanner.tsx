"use client";

import { motion } from "framer-motion";
import { Movie } from "@/types";
import { IMAGE_URL } from "@/lib/tmdb";

interface HeroBannerProps {
  movie: Movie | null;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  if (!movie) {
    return (
      <div style={{
        height: "70vh", background: "#1f1f1f",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#9ca3af" }}>Loading...</p>
      </div>
    );
  }

  const backdropUrl = `${IMAGE_URL}/original${movie.backdrop_path}`;

  // Trim overview so it doesn't overflow
  const shortOverview = movie.overview.length > 200
    ? movie.overview.slice(0, 200) + "..."
    : movie.overview;

  return (
    <div style={{
      position: "relative",
      height: "80vh",
      width: "100%",
      color: "#ffffff"
    }}>

      {/* Backdrop image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${backdropUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* Gradient overlays for readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, #141414 0%, transparent 50%)"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to right, rgba(20,20,20,0.9) 0%, transparent 60%)"
      }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "48px",
          maxWidth: "550px",
          zIndex: 10
        }}
      >
        <h1 style={{
          fontSize: "48px", fontWeight: 900,
          marginBottom: "16px", lineHeight: 1.1,
          textShadow: "2px 2px 8px rgba(0,0,0,0.6)"
        }}>
          {movie.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ color: "#46d369", fontWeight: 700, fontSize: "15px" }}>
            ★ {movie.vote_average?.toFixed(1)}
          </span>
          <span style={{ color: "#e5e5e5", fontSize: "15px" }}>
            {movie.release_date?.slice(0, 4)}
          </span>
        </div>

        <p style={{
          fontSize: "16px", lineHeight: 1.6,
          color: "#e5e5e5", marginBottom: "24px",
          textShadow: "1px 1px 4px rgba(0,0,0,0.8)"
        }}>
          {shortOverview}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 28px", background: "#ffffff",
            color: "#000000", border: "none", borderRadius: "4px",
            fontSize: "16px", fontWeight: 700, cursor: "pointer"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#000000">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Play
          </button>

          <button style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 28px", background: "rgba(109,109,110,0.7)",
            color: "#ffffff", border: "none", borderRadius: "4px",
            fontSize: "16px", fontWeight: 700, cursor: "pointer"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            More Info
          </button>
        </div>
      </motion.div>
    </div>
  );
}