import type { Release } from "@/lib/types";
import { ReleaseCard } from "./ReleaseCard";

const body: React.CSSProperties = { fontFamily: "var(--font-exo2), sans-serif" };

export function ReleasesCatalog({ releases }: { releases: Release[] }) {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-orbitron), sans-serif", fontSize: "16px",
        fontWeight: 700, letterSpacing: "2px", color: "#2A6094",
        textTransform: "uppercase", marginBottom: "16px" }}>
        RELEASES
      </h2>

      {releases.length === 0 && (
        <p style={{ ...body, fontSize: "13px", color: "#5A8AAA", fontWeight: 300 }}>
          No releases yet.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {releases.map((r) => (
          <ReleaseCard key={r.id} release={r} />
        ))}
      </div>
    </div>
  );
}
