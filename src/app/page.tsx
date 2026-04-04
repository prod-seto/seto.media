import Link from "next/link";
import { Divider } from "@/components/Divider";
import { HomeCatalog } from "@/components/HomeCatalog";
import { supabase } from "@/lib/supabase";

const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};

const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

export default async function Home() {
  const [{ data: releases }, { data: beats }] = await Promise.all([
    supabase
      .from("releases")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("beats")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
  ]);

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

      <Divider label="CATALOG" />

      <HomeCatalog beats={beats ?? []} releases={releases ?? []} />

      <Divider label="TOOLS" />

      <Link
        href="/tools"
        className="ghost-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          textDecoration: "none",
          transition: "background 0.15s ease",
        }}
      >
        <div>
          <p style={{
            fontFamily: "var(--font-share-tech-mono), monospace",
            fontSize: "8px",
            letterSpacing: "3px",
            color: "#5A8AAA",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}>
            PRODUCER TOOLS
          </p>
          <p style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "2px",
            color: "#2A6094",
            textTransform: "uppercase",
          }}>
            ISOtone · Mosaic · MIDIripper
          </p>
        </div>
        <span style={{
          fontFamily: "var(--font-share-tech-mono), monospace",
          fontSize: "10px",
          letterSpacing: "2px",
          color: "#5A9ED4",
          textTransform: "uppercase",
          flexShrink: 0,
          marginLeft: "16px",
        }}>
          VIEW TOOLS →
        </span>
      </Link>

    </main>
  );
}
