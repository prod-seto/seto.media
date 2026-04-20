"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { updateTool } from "@/app/actions/tools";
import type { Tables } from "@/lib/database.types";

type Tool = Tables<"tools">;

const mono: React.CSSProperties = { fontFamily: "'Unifont', monospace", fontWeight: 400 };

const labelStyle: React.CSSProperties = {
  ...mono,
  display: "block",
  fontSize: "11px",
  letterSpacing: "2px",
  color: "#5A8AAA",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Unifont', monospace",
  fontWeight: 400,
  width: "100%",
  padding: "9px 12px",
  background: "rgba(255,255,255,0.50)",
  border: "1px solid rgba(90,158,212,0.35)",
  color: "#1A3A50",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
    });

    params.then(({ id }) => {
      supabase
        .from("tools")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (!data) { router.push("/admin/tools"); return; }
          setTool(data);
          setName(data.name);
          setIsVisible(data.is_visible);
          setLoading(false);
        });
    });
  }, [router, params]);

  function handleSave() {
    if (!tool) return;
    setSaveStatus("idle");
    setSaveError(null);
    startSave(async () => {
      const result = await updateTool(tool.id, { name, is_visible: isVisible });
      if (result.success) {
        setSaveStatus("saved");
        setTool((prev) => prev ? { ...prev, name, is_visible: isVisible } : prev);
      } else {
        setSaveStatus("error");
        setSaveError(result.error ?? "Save failed");
      }
    });
  }

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto", padding: "0 24px" }}>
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <h1 style={{ ...mono, fontSize: "16px", letterSpacing: "3px", color: "#2A6094", textTransform: "uppercase" }}>
            EDIT TOOL
          </h1>
          <Link href="/admin/tools" style={{ ...mono, fontSize: "11px", letterSpacing: "2px", color: "#5A8AAA", textDecoration: "none", textTransform: "uppercase" }}>
            ← TOOLS
          </Link>
        </div>

        {loading && (
          <p style={{ ...mono, fontSize: "13px", color: "#5A8AAA" }}>Loading…</p>
        )}

        {!loading && tool && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={labelStyle}>TOOL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setSaveStatus("idle"); }}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="is_visible"
                checked={isVisible}
                onChange={(e) => { setIsVisible(e.target.checked); setSaveStatus("idle"); }}
                style={{ accentColor: "#5A9ED4", width: "14px", height: "14px" }}
              />
              <label htmlFor="is_visible" style={{ ...mono, fontSize: "11px", letterSpacing: "2px", color: "#5A8AAA", textTransform: "uppercase", cursor: "pointer" }}>
                VISIBLE ON TOOLS PAGE
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="tag"
                style={{
                  ...mono,
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  padding: "10px 20px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  background: "rgba(90,158,212,0.12)",
                  borderColor: "rgba(90,158,212,0.50)",
                  color: "#2A6094",
                }}
              >
                {isSaving ? "SAVING..." : "SAVE"}
              </button>

              {saveStatus === "saved" && (
                <span style={{ ...mono, fontSize: "11px", letterSpacing: "1.5px", color: "#3A8880" }}>SAVED</span>
              )}
              {saveStatus === "error" && (
                <span style={{ ...mono, fontSize: "11px", letterSpacing: "1.5px", color: "#8898C0" }}>
                  {(saveError ?? "Save failed").toUpperCase()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
