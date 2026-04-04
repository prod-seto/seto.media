"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { updateToolDisk } from "@/app/actions/tools";
import { DiskCard } from "@/components/DiskCard";
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

const FONT_OPTIONS = [
  { value: "turret-road",  label: "Turret Road" },
  { value: "chakra-petch", label: "Chakra Petch" },
  { value: "teko",         label: "Teko" },
];

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [diskImageUrl, setDiskImageUrl] = useState("");
  const [diskFont, setDiskFont] = useState("turret-road");
  const [diskFontColor, setDiskFontColor] = useState("#2A6094");
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
          setDiskImageUrl(data.disk_image_url ?? "");
          setDiskFont(data.disk_font);
          setDiskFontColor(data.disk_font_color);
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
      const result = await updateToolDisk(tool.id, {
        name,
        disk_image_url: diskImageUrl || null,
        disk_font: diskFont,
        disk_font_color: diskFontColor,
        is_visible: isVisible,
      });
      if (result.success) {
        setSaveStatus("saved");
        // Update local tool state so preview stays in sync
        setTool((prev) => prev ? { ...prev, name, disk_image_url: diskImageUrl || null, disk_font: diskFont, disk_font_color: diskFontColor, is_visible: isVisible } : prev);
      } else {
        setSaveStatus("error");
        setSaveError(result.error ?? "Save failed");
      }
    });
  }

  // Assemble preview tool from current form state
  const previewTool: Tool | null = tool
    ? { ...tool, name, disk_image_url: diskImageUrl || null, disk_font: diskFont, disk_font_color: diskFontColor }
    : null;

  return (
    <main style={{ maxWidth: "700px", margin: "80px auto", padding: "0 24px" }}>
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <h1 style={{ ...display, fontSize: "18px", fontWeight: 700, letterSpacing: "3px", color: "#2A6094", textTransform: "uppercase" }}>
            EDIT DISK
          </h1>
          <Link href="/admin/tools" style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textDecoration: "none", textTransform: "uppercase" }}>
            ← TOOLS
          </Link>
        </div>

        {loading && (
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#5A8AAA" }}>Loading…</p>
        )}

        {!loading && tool && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: "32px", alignItems: "start" }}>
            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>TOOL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSaveStatus("idle"); }}
                  style={inputStyle}
                />
              </div>

              {/* Disk image URL */}
              <div>
                <label style={labelStyle}>DISK IMAGE URL</label>
                <input
                  type="url"
                  value={diskImageUrl}
                  onChange={(e) => { setDiskImageUrl(e.target.value); setSaveStatus("idle"); }}
                  placeholder="https://..."
                  style={inputStyle}
                />
              </div>

              {/* Font */}
              <div>
                <label style={labelStyle}>DISK FONT</label>
                <select
                  value={diskFont}
                  onChange={(e) => { setDiskFont(e.target.value); setSaveStatus("idle"); }}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                >
                  {FONT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Font color */}
              <div>
                <label style={labelStyle}>LABEL COLOR</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={diskFontColor}
                    onChange={(e) => { setDiskFontColor(e.target.value); setSaveStatus("idle"); }}
                    style={{ width: "40px", height: "36px", padding: "2px", border: "1px solid rgba(90,158,212,0.35)", background: "rgba(255,255,255,0.50)", cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={diskFontColor}
                    onChange={(e) => { setDiskFontColor(e.target.value); setSaveStatus("idle"); }}
                    placeholder="#2A6094"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>

              {/* Visibility */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={isVisible}
                  onChange={(e) => { setIsVisible(e.target.checked); setSaveStatus("idle"); }}
                  style={{ accentColor: "#5A9ED4", width: "14px", height: "14px" }}
                />
                <label htmlFor="is_visible" style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textTransform: "uppercase", cursor: "pointer" }}>
                  VISIBLE ON TOOLS PAGE
                </label>
              </div>

              {/* Save */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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

            {/* Live preview */}
            <div>
              <p style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textTransform: "uppercase", marginBottom: "12px" }}>
                PREVIEW
              </p>
              {previewTool && <DiskCard tool={previewTool} />}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
