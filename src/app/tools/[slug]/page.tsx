import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: tool } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!tool) notFound();

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 40px 80px" }}>
      <div className="ghost-panel" style={{ padding: "32px 32px 40px 52px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <p style={{ ...mono, fontSize: "8px", letterSpacing: "3px", color: "#5A8AAA", textTransform: "uppercase" }}>
            PRODUCER TOOLS
          </p>
          <Link
            href="/tools"
            style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textDecoration: "none", textTransform: "uppercase" }}
          >
            ← TOOLS
          </Link>
        </div>

        <h1
          style={{
            ...display,
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 900,
            letterSpacing: "4px",
            color: "#2A6094",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          {tool.name}
        </h1>

        {tool.description && (
          <p style={{ ...body, fontSize: "14px", fontWeight: 300, color: "#2E6080", marginBottom: "32px" }}>
            {tool.description}
          </p>
        )}

        <p style={{ ...mono, fontSize: "9px", letterSpacing: "2px", color: "rgba(90,158,212,0.50)" }}>
          COMING SOON
        </p>
      </div>
    </main>
  );
}
