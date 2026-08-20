import MovieCardSkeleton from "./MovieCardSkeleton";

interface RowSkeletonProps {
  cardCount?: number;
}

export default function RowSkeleton({ cardCount = 6 }: RowSkeletonProps) {
  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Title placeholder */}
      <div
        className="skeleton-pulse"
        style={{
          width: "180px",
          height: "20px",
          borderRadius: "4px",
          background: "#2a2a2a",
          marginBottom: "12px",
        }}
      />

      {/* Card placeholders */}
      <div style={{ display: "flex", gap: "8px", overflowX: "hidden" }}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}