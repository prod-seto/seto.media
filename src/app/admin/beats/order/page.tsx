"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { updateBeatsOrder } from "@/app/actions/ordering";
import type { Tables } from "@/lib/database.types";

type Beat = Tables<"beats">;

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

export default function ReorderBeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    supabase
      .from("beats")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setBeats(data);
        setLoading(false);
      });
  }, []);

  function moveUp(index: number) {
    if (index === 0) return;
    setBeats((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSaveStatus("idle");
  }

  function moveDown(index: number) {
    if (index === beats.length - 1) return;
    setBeats((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setSaveStatus("idle");
  }

  function handleSave() {
    setSaveStatus("idle");
    setSaveError(null);
    startSave(async () => {
      const result = await updateBeatsOrder(beats.map((b) => b.id));
      if (result.success) {
        setSaveStatus("saved");
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
            REORDER BEATS
          </h1>
          <Link
            href="/admin"
            style={{
              ...mono,
              fontSize: "8px",
              letterSpacing: "2px",
              color: "#5A8AAA",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ← ADMIN
          </Link>
        </div>

        {loading && (
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#5A8AAA" }}>
            Loading…
          </p>
        )}

        {!loading && beats.length === 0 && (
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#5A8AAA" }}>
            No beats yet.
          </p>
        )}

        {!loading && beats.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {beats.map((beat, index) => (
                <div
                  key={beat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.40)",
                    border: "1px solid rgba(90,158,212,0.25)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0 || isSaving}
                      style={{
                        ...mono,
                        fontSize: "9px",
                        background: "none",
                        border: "none",
                        color: index === 0 ? "rgba(90,158,212,0.25)" : "#5A9ED4",
                        cursor: index === 0 || isSaving ? "default" : "pointer",
                        padding: "0 4px",
                        lineHeight: 1,
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === beats.length - 1 || isSaving}
                      style={{
                        ...mono,
                        fontSize: "9px",
                        background: "none",
                        border: "none",
                        color: index === beats.length - 1 ? "rgba(90,158,212,0.25)" : "#5A9ED4",
                        cursor: index === beats.length - 1 || isSaving ? "default" : "pointer",
                        padding: "0 4px",
                        lineHeight: 1,
                      }}
                    >
                      ↓
                    </button>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        ...display,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        color: "#2A6094",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {beat.title}
                    </p>
                    <p
                      style={{
                        ...body,
                        fontSize: "11px",
                        fontWeight: 300,
                        color: "#5A8AAA",
                        margin: 0,
                      }}
                    >
                      {[beat.bpm ? `${beat.bpm} BPM` : null, beat.key]
                        .filter(Boolean)
                        .join(" · ")}
                      {!beat.is_visible && (
                        <span style={{ ...mono, fontSize: "7px", letterSpacing: "1.5px", marginLeft: "8px", color: "#8898C0" }}>
                          HIDDEN
                        </span>
                      )}
                    </p>
                  </div>

                  <span style={{ ...mono, fontSize: "8px", color: "rgba(90,158,212,0.40)", flexShrink: 0 }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>

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
                {isSaving ? "SAVING..." : "SAVE ORDER"}
              </button>

              {saveStatus === "saved" && (
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#3A8880" }}>
                  ORDER SAVED
                </p>
              )}
              {saveStatus === "error" && (
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#8898C0" }}>
                  {(saveError ?? "Save failed").toUpperCase()}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
