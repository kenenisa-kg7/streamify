export default function MovieCardSkeleton() {
  return (
    <div
      className="skeleton-pulse"
      style={{
        width: "160px",
        height: "240px",
        borderRadius: "6px",
        background: "#2a2a2a",
        flexShrink: 0,
      }}
    />
  );
}