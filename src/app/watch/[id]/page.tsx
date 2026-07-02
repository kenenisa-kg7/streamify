"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { Movie, Video, Cast } from "@/types";
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  IMAGE_URL,
} from "@/lib/tmdb";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = Number(params.id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      try {
        const [details, videos, credits, similarMovies] = await Promise.all([
          getMovieDetails(movieId),
          getMovieVideos(movieId),
          getMovieCredits(movieId),
          getSimilarMovies(movieId),
        ]);

        setMovie(details.data);

        // Find the official trailer (YouTube type)
        const officialTrailer = videos.data.results.find(
          (v: Video) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(officialTrailer || null);

        // Top 6 cast members
        setCast(credits.data.cast.slice(0, 6));

        // Top 5 similar movies
        setSimilar(similarMovies.data.results.slice(0, 5));

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <main style={{
        minHeight: "100vh", background: "#141414",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#ffffff", fontSize: "18px" }}>Loading...</p>
      </main>
    );
  }

  if (!movie) {
    return (
      <main style={{
        minHeight: "100vh", background: "#141414",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#e50914", fontSize: "18px" }}>Movie not found.</p>
      </main>
    );
  }

  const backdropUrl = `${IMAGE_URL}/original${movie.backdrop_path}`;

  return (
    <main style={{ minHeight: "100vh", background: "#141414" }}>

      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 48px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"
      }}>
        <Link href="/browse" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "#e50914", fontSize: "24px", fontWeight: 900 }}>STREAMIFY</h1>
        </Link>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          onClick={() => setShowTrailer(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9" }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}

      {/* Backdrop hero */}
      <div style={{ position: "relative", height: "70vh", width: "100%" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: "cover", backgroundPosition: "center top",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, #141414 0%, transparent 60%)"
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(20,20,20,0.9) 0%, transparent 60%)"
        }} />

        {/* Content over backdrop */}
        <div style={{
          position: "absolute", bottom: "8%", left: "48px",
          maxWidth: "600px", zIndex: 10
        }}>
          <h1 style={{
            color: "#ffffff", fontSize: "44px", fontWeight: 900,
            marginBottom: "16px", lineHeight: 1.1
          }}>
            {movie.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ color: "#46d369", fontWeight: 700 }}>
              ★ {movie.vote_average?.toFixed(1)}
            </span>
            <span style={{ color: "#e5e5e5" }}>{movie.release_date?.slice(0, 4)}</span>
            {movie.adult !== undefined && (
              <span style={{
                border: "1px solid #9ca3af", padding: "2px 8px",
                fontSize: "12px", color: "#e5e5e5"
              }}>
                {movie.adult ? "18+" : "PG-13"}
              </span>
            )}
          </div>

          <p style={{ color: "#e5e5e5", fontSize: "16px", lineHeight: 1.6, marginBottom: "24px" }}>
            {movie.overview}
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowTrailer(true)}
              disabled={!trailer}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "12px 28px",
                background: trailer ? "#ffffff" : "#666",
                color: "#000000", border: "none", borderRadius: "4px",
                fontSize: "16px", fontWeight: 700,
                cursor: trailer ? "pointer" : "not-allowed"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {trailer ? "Play Trailer" : "No Trailer Available"}
            </button>

            <button
              onClick={() => router.back()}
              style={{
                padding: "12px 28px", background: "rgba(109,109,110,0.7)",
                color: "#ffffff", border: "none", borderRadius: "4px",
                fontSize: "16px", fontWeight: 700, cursor: "pointer"
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Cast section */}
      {cast.length > 0 && (
        <div style={{ padding: "40px 48px" }}>
          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
            Cast & Crew
          </h2>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {cast.map((person) => (
              <div key={person.id} style={{ textAlign: "center", width: "90px" }}>
                <div style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  overflow: "hidden", background: "#333", marginBottom: "8px"
                }}>
                  {person.profile_path && (
                    <img
                      src={`${IMAGE_URL}/w200${person.profile_path}`}
                      alt={person.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>{person.name}</p>
                <p style={{ color: "#9ca3af", fontSize: "12px" }}>{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar movies */}
      {similar.length > 0 && (
        <div style={{ padding: "0 48px 64px" }}>
          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
            More Like This
          </h2>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px" }}>
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}

    </main>
  );
}