import { BracketCard } from "@/components/BracketCard";
import { Divider } from "@/components/Divider";

const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};

const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

export default function Home() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 40px 80px" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="hero-panel" style={{ marginBottom: "48px" }}>
        {/* Content offset from the 28px code column */}
        <div style={{ padding: "32px 32px 32px 52px" }}>
          {/* Data readout — decorative */}
          <p
            className="data-readout"
            style={{ marginBottom: "20px" }}
          >
            PLATFORM 01 · SYS:ONLINE · 2025.03
          </p>

          {/* Wordmark */}
          <h1
            style={{
              ...display,
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 900,
              letterSpacing: "4px",
              lineHeight: 1,
              color: "#2A6094",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            SETO<span style={{ color: "#5A9ED4" }}>.MEDIA</span>
          </h1>

          {/* Subtitle — Exo 2 italic 200 */}
          <p
            style={{
              ...body,
              fontSize: "14px",
              fontWeight: 200,
              fontStyle: "italic",
              letterSpacing: "2.5px",
              color: "#5A8AAA",
              textTransform: "uppercase",
            }}
          >
            music releases · beats · producer tools
          </p>
        </div>
      </header>

      <Divider label="01 · CATALOG" />

      {/* ── Releases ──────────────────────────────────────────── */}
      <section style={{ marginBottom: "0" }}>
        <BracketCard>
          <p
            style={{ ...mono, fontSize: "9px", letterSpacing: "2.5px", color: "#5A8AAA",
              textTransform: "uppercase", marginBottom: "10px" }}
          >
            01 · RELEASES
          </p>
          <h2
            style={{ ...display, fontSize: "18px", fontWeight: 700, letterSpacing: "2px",
              color: "#2A6094", textTransform: "uppercase", marginBottom: "10px" }}
          >
            MUSIC
          </h2>
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, lineHeight: 1.75, color: "#2E6080" }}>
            Original releases coming soon.
          </p>
        </BracketCard>
      </section>

      <Divider label="02 · CATALOG" />

      {/* ── Beats ──────────────────────────────────────────────── */}
      <section>
        <BracketCard>
          <p
            style={{ ...mono, fontSize: "9px", letterSpacing: "2.5px", color: "#5A8AAA",
              textTransform: "uppercase", marginBottom: "10px" }}
          >
            02 · BEATS
          </p>
          <h2
            style={{ ...display, fontSize: "18px", fontWeight: 700, letterSpacing: "2px",
              color: "#2A6094", textTransform: "uppercase", marginBottom: "10px" }}
          >
            BEAT CATALOG
          </h2>
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, lineHeight: 1.75, color: "#2E6080" }}>
            Instrumentals and beat packs coming soon.
          </p>
        </BracketCard>
      </section>

      <Divider label="03 · CATALOG" />

      {/* ── Tools ──────────────────────────────────────────────── */}
      <section>
        <BracketCard>
          <p
            style={{ ...mono, fontSize: "9px", letterSpacing: "2.5px", color: "#5A8AAA",
              textTransform: "uppercase", marginBottom: "10px" }}
          >
            03 · TOOLS
          </p>
          <h2
            style={{ ...display, fontSize: "18px", fontWeight: 700, letterSpacing: "2px",
              color: "#2A6094", textTransform: "uppercase", marginBottom: "10px" }}
          >
            PRODUCER TOOLS
          </h2>
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, lineHeight: 1.75, color: "#2E6080" }}>
            Utilities for music production coming soon.
          </p>
        </BracketCard>
      </section>

    </main>
  );
}
