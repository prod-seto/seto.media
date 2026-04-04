import { supabase } from "@/lib/supabase";
import { DiskCard } from "@/components/DiskCard";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

export default async function ToolsPage() {
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 40px 80px" }}>
      <div className="ghost-panel" style={{ padding: "32px 32px 40px 52px", marginBottom: "48px" }}>
        <p style={{ ...mono, fontSize: "8px", letterSpacing: "3px", color: "#5A8AAA", textTransform: "uppercase", marginBottom: "20px" }}>
          PRODUCER TOOLS · SETO.MEDIA
        </p>
        <h1
          style={{
            ...display,
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 900,
            letterSpacing: "4px",
            color: "#2A6094",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          TOOLS
        </h1>
        <p style={{ ...body, fontSize: "13px", fontWeight: 200, fontStyle: "italic", letterSpacing: "2px", color: "#5A8AAA", textTransform: "uppercase" }}>
          instruments for the process
        </p>
      </div>

      {(!tools || tools.length === 0) ? (
        <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#5A8AAA" }}>
          No tools available yet.
        </p>
      ) : (
        <div className="tools-grid">
          {tools.map((tool) => (
            <DiskCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </main>
  );
}
