"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import type { Tables } from "@/lib/database.types";

type Tool = Tables<"tools">;

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};


export default function AdminToolsPage() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
    });

    supabase
      .from("tools")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setTools(data);
        setLoading(false);
      });
  }, [router]);

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto", padding: "0 24px" }}>
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <h1
            style={{
              ...display,
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#2A6094",
              textTransform: "uppercase",
            }}
          >
            TOOLS
          </h1>
          <Link
            href="/admin"
            style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textDecoration: "none", textTransform: "uppercase" }}
          >
            ← ADMIN
          </Link>
        </div>

        {loading && (
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#5A8AAA" }}>Loading…</p>
        )}

        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tools.map((tool) => (
              <div
                key={tool.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.40)",
                  border: "1px solid rgba(90,158,212,0.25)",
                  gap: "12px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ ...display, fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", color: "#2A6094", textTransform: "uppercase", margin: 0 }}>
                    {tool.name}
                  </p>
                  {(!tool.is_visible || tool.slug) && (
                    <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#5A8AAA", textTransform: "uppercase", margin: "3px 0 0" }}>
                      /{tool.slug}{!tool.is_visible && " · HIDDEN"}
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/tools/${tool.id}/edit`}
                  className="tag"
                  style={{
                    ...mono,
                    fontSize: "8px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    padding: "6px 12px",
                    background: "rgba(90,158,212,0.08)",
                    borderColor: "rgba(90,158,212,0.35)",
                    color: "#2A6094",
                    flexShrink: 0,
                  }}
                >
                  EDIT
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
