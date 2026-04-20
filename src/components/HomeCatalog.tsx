"use client";
import { useState } from "react";
import type { Beat, Release } from "@/lib/types";
import { BeatsCatalog } from "./BeatsCatalog";
import { ReleasesCatalog } from "./ReleasesCatalog";

type Tab = "releases" | "beats";

export function HomeCatalog({ beats, releases }: { beats: Beat[]; releases: Release[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("releases");

  return (
    <>
      {/* Mobile tab switcher — hidden on desktop via CSS */}
      <div className="mobile-tabs" style={{ gap: "0", marginBottom: "24px" }}>
        {(["releases", "beats"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="type-label"
            style={{
              flex: 1,
              fontSize: "13px",
              padding: "10px",
              background: activeTab === tab ? "rgba(90,158,212,0.15)" : "rgba(255,255,255,0.30)",
              border: "1px solid rgba(90,158,212,0.35)",
              borderRight: tab === "releases" ? "none" : undefined,
              color: activeTab === tab ? "#2A6094" : "#5A8AAA",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        <div className={activeTab !== "releases" ? "catalog-col-hidden" : ""}>
          <ReleasesCatalog releases={releases} />
        </div>
        <div className={activeTab !== "beats" ? "catalog-col-hidden" : ""}>
          <BeatsCatalog beats={beats} />
        </div>
      </div>
    </>
  );
}
