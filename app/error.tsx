"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <p
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#5c5c5c",
        }}
      >
        Something went wrong
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.625rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: "transparent",
          border: "1px solid #2a2a2a",
          color: "#3a3a3a",
          padding: "0.625rem 1.5rem",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}
