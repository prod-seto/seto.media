"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { updateTool } from "@/app/actions/tools";
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

const labelStyle: React.CSSProperties = {
  ...mono,
  display: "block",
  fontSize: "8px",
  letterSpacing: "2px",
  color: "#5A8AAA",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  ...body,
  width: "100%",
  padding: "9px 12px",
  background: "rgba(255,255,255,0.50)",
  border: "1px solid rgba(90,158,212,0.35)",
  color: "#1A3A50",
  fontSize: "13px",
  fontWeight: 300,
  outline: "none",
  boxSizing: "border-box",
};

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

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
          setSlug(data.slug);
          setDescription(data.description ?? "");
          setIsVisible(data.is_visible);
          setSortOrder(data.sort_order);
          setLoading(false);
        });
    });
  }, [router, params]);

  function handleSave() {
    if (!tool) return;
    setSaveStatus("idle");
    setSaveError(null);
    startSave(async () => {
      const result = await updateTool(tool.id, {
        name,
        slug,
        description: description || null,
        is_visible: isVisible,
        sort_order: sortOrder,
      });
      if (result.success) {
        setSaveStatus("saved");
        setTool(prev => prev ? { ...prev, name, slug, description: description || null, is_visible: isVisible, sort_order: sortOrder } : prev);
      } else {
        setSaveStatus("error");
        setSaveError(result.error ?? "Save failed");
      }
    });
  }

  return (
    <main style={{ maxWidth: "560px", margin: "80px auto", padding: "0 24px" }}>
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <h1 style={{ ...display, fontSize: "18px", fontWeight: 700, letterSpacing: "3px", color: "#2A6094", textTransform: "uppercase" }}>
            EDIT TOOL
          </h1>
          <Link href="/admin/tools" style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textDecoration: "none", textTransform: "uppercase" }}>
            ← TOOLS
          </Link>
        </div>

        {loading && (
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#5A8AAA" }}>Loading…</p>
        )}

        {!loading && tool && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={labelStyle}>NAME</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setSaveStatus("idle"); }}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>SLUG</label>
              <input
                type="text"
                value={slug}
                onChange={e => { setSlug(e.target.value); setSaveStatus("idle"); }}
                placeholder="bpm-key"
                style={inputStyle}
              />
              <p style={{ ...mono, fontSize: "7px", letterSpacing: "1px", color: "rgba(90,158,212,0.45)", marginTop: "4px" }}>
                CHANGING SLUG WILL BREAK THE ROUTE — UPDATE NEXT.JS PAGE FOLDER TO MATCH
              </p>
            </div>

            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea
                value={description}
                onChange={e => { setDescription(e.target.value); setSaveStatus("idle"); }}
                placeholder="Short tagline shown in the tools tree"
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div>
              <label style={labelStyle}>SORT ORDER</label>
              <input
                type="number"
                value={sortOrder}
                min={0}
                step={1}
                onChange={e => { setSortOrder(Number(e.target.value)); setSaveStatus("idle"); }}
                style={{ ...inputStyle, width: "100px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="is_visible"
                checked={isVisible}
                onChange={e => { setIsVisible(e.target.checked); setSaveStatus("idle"); }}
                style={{ accentColor: "#5A9ED4", width: "14px", height: "14px" }}
              />
              <label htmlFor="is_visible" style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textTransform: "uppercase", cursor: "pointer" }}>
                VISIBLE ON TOOLS PAGE
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="tag"
                style={{
                  ...mono,
                  fontSize: "10px",
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
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#3A8880" }}>SAVED</p>
              )}
              {saveStatus === "error" && (
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#8898C0" }}>
                  {(saveError ?? "Save failed").toUpperCase()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
