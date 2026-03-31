"use client";
import { useState, useMemo } from "react";
import type { Beat } from "@/lib/types";

const mono: React.CSSProperties = { fontFamily: "var(--font-share-tech-mono), monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-orbitron), sans-serif" };
const body: React.CSSProperties = { fontFamily: "var(--font-exo2), sans-serif" };

export function BeatsCatalog({ beats }: { beats: Beat[] }) {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const allTags = useMemo(
    () => Array.from(new Set(beats.flatMap((b) => b.tags))).sort(),
    [beats]
  );

  const filtered = useMemo(
    () =>
      activeTags.length === 0
        ? beats
        : beats.filter((b) => activeTags.every((t) => b.tags.includes(t))),
    [beats, activeTags]
  );

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div>
      <p style={{ ...mono, fontSize: "8px", letterSpacing: "3px", color: "#5A8AAA",
        textTransform: "uppercase", marginBottom: "16px" }}>
        02 · BEATS
      </p>

      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px",
          alignItems: "center" }}>
          {allTags.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="tag"
                style={{
                  cursor: "pointer",
                  background: active ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
                  borderColor: active ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
                  color: active ? "#2A6094" : "#5A8AAA",
                }}
              >
                {tag}
              </button>
            );
          })}
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags([])}
              style={{
                ...mono,
                fontSize: "8px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                color: "#5A9ED4",
                cursor: "pointer",
                padding: "3px 6px",
              }}
            >
              × CLEAR
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <p style={{ ...body, fontSize: "13px", color: "#5A8AAA", fontWeight: 300 }}>
          No beats match the selected tags.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filtered.map((b) => {
          const meta = [b.bpm ? `${b.bpm} BPM` : null, b.key, b.genre]
            .filter(Boolean)
            .join(" · ");

          return (
            <div key={b.id} className="ghost-panel" style={{ padding: "18px 20px" }}>
              {meta && (
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA",
                  textTransform: "uppercase", marginBottom: "8px" }}>
                  {meta}
                </p>
              )}
              {/* No textTransform — title casing is intentional */}
              <h3 style={{ ...display, fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px",
                color: "#2A6094", marginBottom: "10px" }}>
                {b.title}
              </h3>
              {b.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px",
                  marginBottom: b.baton_url ? "14px" : "0" }}>
                  {b.tags.map((tag) => {
                    const active = activeTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="tag"
                        style={{
                          cursor: "pointer",
                          background: active ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
                          borderColor: active ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
                          color: active ? "#2A6094" : "#5A8AAA",
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              )}
              {b.baton_url && (
                <iframe
                  src={b.baton_url}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay"
                  style={{ display: "block" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
