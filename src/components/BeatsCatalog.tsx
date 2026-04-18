"use client";
import { useState, useMemo } from "react";
import type { Beat } from "@/lib/types";
import { BeatRow } from "./BeatCard";

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
      <h2 className="type-subheading" style={{ fontSize: "24px", color: "#2A6094", marginBottom: "16px" }}>
        Beats
      </h2>

      <div className="ghost-panel" style={{ overflow: "hidden" }}>
        {/* Zone 1 — Filter chip row */}
        {allTags.length > 0 && (
          <div style={{
            padding: "14px 14px",
            borderBottom: "1px solid rgba(90,158,212,0.20)",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}>
            {allTags.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="tag"
                  style={{
                    cursor: "pointer",
                    background: active ? "rgba(90,158,212,0.15)" : "transparent",
                    borderColor: active ? "#5A9ED4" : "rgba(90,158,212,0.30)",
                    color: active ? "#2A6094" : "#5A8AAA",
                    transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  {tag}
                </button>
              );
            })}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="type-label"
                style={{
                  background: "none",
                  border: "none",
                  color: "#5A9ED4",
                  cursor: "pointer",
                  padding: "3px 6px",
                  marginLeft: "auto",
                }}
              >
                × clear
              </button>
            )}
          </div>
        )}

        {/* Zone 2 — Beat rows */}
        {filtered.length === 0 ? (
          <div className="type-body" style={{ padding: "14px", color: "#5A8AAA" }}>
            No beats match the selected tags.
          </div>
        ) : (
          filtered.map((b, i) => (
            <BeatRow
              key={b.id}
              beat={b}
              activeTags={activeTags}
              onTagToggle={toggleTag}
              isLast={i === filtered.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
