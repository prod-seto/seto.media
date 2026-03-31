import type { Release } from "@/lib/types";

const mono: React.CSSProperties = { fontFamily: "var(--font-share-tech-mono), monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-orbitron), sans-serif" };
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

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {releases.map((r) => (
          <div key={r.id} className="ghost-panel" style={{ padding: "18px 20px" }}>
            <p style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA",
              textTransform: "uppercase", marginBottom: "8px" }}>
              {r.type}{r.released_at ? ` · ${r.released_at}` : ""}
            </p>
            <h3 style={{ ...display, fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px",
              color: "#2A6094", textTransform: "uppercase", marginBottom: "4px" }}>
              {r.title}
            </h3>
            <p style={{ ...body, fontSize: "12px", fontWeight: 300, color: "#5A8AAA",
              marginBottom: r.soundcloud_url ? "14px" : "0" }}>
              {r.artist}
            </p>
            {r.soundcloud_url && (
              <iframe
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(r.soundcloud_url)}&color=%235A9ED4&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_artwork=false&buying=false&liking=false&download=false&sharing=false`}
                style={{ display: "block" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
