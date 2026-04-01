"use client";
import { useState, useMemo } from "react";
import type { Beat } from "@/lib/types";
import { BeatCard } from "./BeatCard";

const mono: React.CSSProperties = { fontFamily: "var(--font-share-tech-mono), monospace" };
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

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((b) => (
          <BeatCard
            key={b.id}
            beat={b}
            activeTags={activeTags}
            onTagToggle={toggleTag}
          />
        ))}
      </div>
    </div>
  );
}
