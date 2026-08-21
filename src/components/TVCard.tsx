"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TVShow } from "@/types";
import { IMAGE_URL } from "@/lib/tmdb";

interface TVCardProps {
  show: TVShow;
}

export default function TVCard({ show }: TVCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const posterUrl = show.poster_path && !imgError
    ? `${IMAGE_URL}/w300${show.poster_path}`
    : "/placeholder.png";

  const rating = show.vote_average?.toFixed(1);

  return (
    <div
      onClick={() => router.push(`/tv/${show.id}`)}
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
          alt={show.name}
          fill
          style={{ objectFit: "cover" }}
          onError={() => setImgError(true)}
          sizes="160px"
        />
      </div>

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
            {show.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#e50914", fontSize: "12px", fontWeight: 700 }}>
              ★ {rating}
            </span>
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>
              {show.first_air_date?.slice(0, 4)}
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