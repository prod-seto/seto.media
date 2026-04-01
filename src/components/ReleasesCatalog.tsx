import type { Release } from "@/lib/types";
import { ReleaseCard } from "./ReleaseCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-share-tech-mono), monospace" };
const body: React.CSSProperties = { fontFamily: "var(--font-exo2), sans-serif" };

export function ReleasesCatalog({ releases }: { releases: Release[] }) {
  return (
    <div>
      <p style={{ ...mono, fontSize: "8px", letterSpacing: "3px", color: "#5A8AAA",
        textTransform: "uppercase", marginBottom: "16px" }}>
        01 · RELEASES
      </p>

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
