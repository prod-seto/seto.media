import type { Release } from "@/lib/types";
import { ReleaseCard } from "./ReleaseCard";

export function ReleasesCatalog({ releases }: { releases: Release[] }) {
  return (
    <div>
      <h2 className="type-subheading" style={{ fontSize: "24px", color: "#2A6094", marginBottom: "16px" }}>
        Produced by me
      </h2>

      {releases.length === 0 && (
        <p className="type-body" style={{ color: "#5A8AAA" }}>
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
