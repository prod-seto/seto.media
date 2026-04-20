import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
    <main className="max-w-[960px] mx-auto px-4 sm:px-10 pt-8 sm:pt-12 pb-20">
      <div className="ghost-panel p-4 sm:pt-8 sm:pr-8 sm:pb-10 sm:pl-[52px]">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <p className="type-label" style={{ color: "#5A8AAA" }}>
            producer tools
          </p>
          <Link href="/tools" className="type-label" style={{ color: "#5A8AAA", textDecoration: "none" }}>
            ← tools
          </Link>
        </div>

        <h1 className="type-display" style={{ fontSize: "clamp(38px, 5vw, 60px)", color: "#2A6094", marginBottom: "16px" }}>
          {tool.name}
        </h1>

        {tool.description && (
          <p className="type-body" style={{ fontSize: "16px", color: "#2E6080", marginBottom: "32px" }}>
            {tool.description}
          </p>
        )}

        <p className="type-label" style={{ color: "rgba(90,158,212,0.50)" }}>
          coming soon
        </p>
      </div>
    </main>
  );
}
