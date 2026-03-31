Implementation Spec: Homepage Catalog UI

Source: stories/003-homepage-ui.md

Objective

Replace homepage placeholder stubs with real data-driven beat
and release cards fetched from Supabase, each with an embedded
  iframe player (Baton for beats, SoundCloud for releases).
Two-column layout on desktop, tab-switcher on mobile.

Pre-Conditions

- Story 002 complete: releases and beats tables exist in
Supabase
- src/lib/types.ts and src/lib/database.types.ts present
- .env.local has both Supabase vars set

Reference Files — Read First

┌────────────────────────────────┬─────────────────────────┐
│              File              │           Why           │
├────────────────────────────────┼─────────────────────────┤
│ src/app/page.tsx               │ Server component to     │
│                                │ modify                  │
├────────────────────────────────┼─────────────────────────┤
│                                │ .tag, .ghost-panel,     │
│ src/app/globals.css            │ .data-readout classes   │
│                                │ to reuse                │
├────────────────────────────────┼─────────────────────────┤
│ src/components/BracketCard.tsx │ Ghost panel pattern     │
├────────────────────────────────┼─────────────────────────┤
│ src/lib/supabase.ts            │ Fetch client            │
├────────────────────────────────┼─────────────────────────┤
│ src/lib/types.ts               │ Beat, Release types     │
└────────────────────────────────┴─────────────────────────┘

---
Step 1 — Seed Real Data in Supabase SQL Editor

Run this in the Supabase dashboard → SQL Editor:

-- Clear story 002 placeholder data
DELETE FROM releases;
DELETE FROM beats;

-- 9 releases
INSERT INTO releases (title, slug, type, artist,
soundcloud_url, cover_url) VALUES
  ('Faith', 'fckmannequin-faith-prod-seto', 'single',
'Fckmannequin',
    'https://soundcloud.com/prod-seto/fckmannequin-faith-prod-s
eto',
    'https://i1.sndcdn.com/artworks-oyJzD2OEwP3g94PZ-Y5foow-t50
0x500.jpg'),
  ('Oxy twin', 'fckmannequin-oxy-twin-prod-seto', 'single',
'Fckmannequin',
    'https://soundcloud.com/prod-seto/fckmannequin-oxy-twin-pro
d-seto',
    'https://i1.sndcdn.com/artworks-oyJzD2OEwP3g94PZ-Y5foow-t50
0x500.jpg'),
  ('Twoueeee', 'twoueeee-prodseto', 'single', 'Fckmannequin',
    'https://soundcloud.com/mannequinn_1/twoueeee-prodseto',
    'https://i1.sndcdn.com/artworks-uZFyjHCZcnKV3yhr-cUBu9A-t50
0x500.jpg'),
  ('Zelle for Drugs', 'zelle-for-drugs-seto-4', 'single',
'Fckmannequin',

'https://soundcloud.com/mannequinn_1/zelle-for-drugs-seto-4',
    'https://i1.sndcdn.com/artworks-PN3pvA3VYqU58TRy-nlRNWw-t50
0x500.jpg'),
  ('designer *****', 'designer-yeruzona', 'single',
'Yeruzona',
    'https://soundcloud.com/yeruzona/designer-12',
    'https://i1.sndcdn.com/artworks-78DY8gAu5VnzRGzq-Rvs5rA-t50
0x500.jpg'),
  ('Seto said', 'fckmannequin-seto-said-prod-seto', 'single',
'Fckmannequin',
    'https://soundcloud.com/prod-seto/fckmannequin-seto-said-pr
od-seto',
    'https://i1.sndcdn.com/artworks-hgJ708yVU5hToKfK-tx3xnw-t50
0x500.jpg'),
  ('Throwed', 'fckmannequin-throwed-prod-seto', 'single',
'Fckmannequin',
    'https://soundcloud.com/prod-seto/fckmannequin-throwed-prod
-seto',
    'https://i1.sndcdn.com/artworks-vR8RChaDy8yTzpih-oynMMA-t50
0x500.jpg'),
  ('Come w a fine', 'come-w-a-fine-prod-seto', 'single',
'Fckmannequin',

'https://soundcloud.com/mannequinn_1/come-w-a-fine-prod-seto',
    'https://i1.sndcdn.com/artworks-MLx5JaMFewEdNr3I-D5yy8g-t50
0x500.jpg'),
  ('Same one', 'fckmannequin-same-one-prod-seto', 'single',
'Fckmannequin',
    'https://soundcloud.com/prod-seto/fckmannequin-same-one-pro
d-seto',
    'https://i1.sndcdn.com/artworks-47fee1znvckVFfYk-fP5sFg-t50
0x500.jpg');

-- 5 beats (titles lowercase — artistic choice)
INSERT INTO beats (title, slug, bpm, key, genre, tags,
baton_url) VALUES
  ('outside', 'outside', 165, 'G# Minor', null,
ARRAY['osamason'],
    'https://baton.media/player/seto/tracks/500427/?t=387a7e62d
d152885d34568f62e8dfdb4c259a3b6&r=cmn1z3dq600gvh9dsfxo4mtpv'),
  ('no sleep', 'no-sleep', 190, 'G Minor', null,
ARRAY['fakemink', 'ksuuvi'],
    'https://baton.media/player/seto/tracks/500426/?t=358aa3598
90db95fe79902b9571a2934ebfca207&r=cmn1z3dq600gvh9dsfxo4mtpv'),
  ('speakerz', 'speakerz', 200, 'D Minor', null,
ARRAY['fakemink', 'ksuuvi'],
    'https://baton.media/player/seto/tracks/500429/?t=025772b16
0f886f263508050cc6dc3e8af820cdf&r=cmn1z3dq600gvh9dsfxo4mtpv'),
  ('sunset', 'sunset', 150, 'F# Major', null, ARRAY['surf
gang', 'sexy drill'],
    'https://baton.media/player/seto/tracks/500428/?t=8ea21cf67
4f6e1cc094c7635b57fa99c8dfee449&r=cmn1z3dq600gvh9dsfxo4mtpv'),
  ('saturday', 'saturday', 200, 'E Minor -50¢', null,
ARRAY['fakemink', 'ksuuvi'],
    'https://baton.media/player/seto/tracks/500430/?t=20359254f
c1116a41825167b500b88332e8eeecc&r=cmn1z3dq600gvh9dsfxo4mtpv');

---
Step 2 — Add catalog grid CSS to globals.css

Append to the bottom of src/app/globals.css:

/* ── Catalog grid — two columns desktop, single column mobile
  ── */
.catalog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.mobile-tabs {
  display: none;
}

@media (max-width: 680px) {
  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .mobile-tabs {
    display: flex;
  }

  .catalog-col-hidden {
    display: none;
  }
}

---
Step 3 — Create src/components/ReleasesCatalog.tsx

Plain function, no client state needed.

import type { Release } from "@/lib/types";

const mono: React.CSSProperties = { fontFamily:
"var(--font-share-tech-mono), monospace" };
const display: React.CSSProperties = { fontFamily:
"var(--font-orbitron), sans-serif" };
const body: React.CSSProperties = { fontFamily:
"var(--font-exo2), sans-serif" };

export function ReleasesCatalog({ releases }: { releases:
Release[] }) {
  return (
    <div>
      <p style={{ ...mono, fontSize: "8px", letterSpacing:
"3px", color: "#5A8AAA",
        textTransform: "uppercase", marginBottom: "16px" }}>
        01 · RELEASES
      </p>

      {releases.length === 0 && (
        <p style={{ ...body, fontSize: "13px", color:
"#5A8AAA", fontWeight: 300 }}>
          No releases yet.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column",
gap: "16px" }}>
        {releases.map((r) => (
          <div key={r.id} className="ghost-panel" style={{
padding: "18px 20px" }}>
            <p style={{ ...mono, fontSize: "8px",
letterSpacing: "2px", color: "#5A8AAA",
              textTransform: "uppercase", marginBottom: "8px"
}}>
              {r.type}{r.released_at ? ` · ${r.released_at}` :
  ""}
            </p>
            <h3 style={{ ...display, fontSize: "14px",
fontWeight: 700, letterSpacing: "1.5px",
              color: "#2A6094", textTransform: "uppercase",
marginBottom: "4px" }}>
              {r.title}
            </h3>
            <p style={{ ...body, fontSize: "12px", fontWeight:
  300, color: "#5A8AAA",
              marginBottom: r.soundcloud_url ? "14px" : "0"
}}>
              {r.artist}
            </p>
            {r.soundcloud_url && (
              <iframe
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${e
ncodeURIComponent(r.soundcloud_url)}&color=%235A9ED4&auto_play
=false&hide_related=true&show_comments=false&show_user=false&s
how_reposts=false&show_artwork=false&buying=false&liking=false
&download=false&sharing=false`}
                style={{ display: "block" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

---
Step 4 — Create src/components/BeatsCatalog.tsx

Client component — owns tag filter state. Beat titles are
stored and displayed as-is (no textTransform on the title).

"use client";
import { useState, useMemo } from "react";
import type { Beat } from "@/lib/types";

const mono: React.CSSProperties = { fontFamily:
"var(--font-share-tech-mono), monospace" };
const display: React.CSSProperties = { fontFamily:
"var(--font-orbitron), sans-serif" };
const body: React.CSSProperties = { fontFamily:
"var(--font-exo2), sans-serif" };

export function BeatsCatalog({ beats }: { beats: Beat[] }) {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const allTags = useMemo(
    () => Array.from(new Set(beats.flatMap((b) =>
b.tags))).sort(),
    [beats]
  );

  const filtered = useMemo(
    () =>
      activeTags.length === 0
        ? beats
        : beats.filter((b) => activeTags.every((t) =>
b.tags.includes(t))),
    [beats, activeTags]
  );

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) :
[...prev, tag]
    );
  }

  return (
    <div>
      <p style={{ ...mono, fontSize: "8px", letterSpacing:
"3px", color: "#5A8AAA",
        textTransform: "uppercase", marginBottom: "16px" }}>
        02 · BEATS
      </p>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap:
"6px", marginBottom: "16px",
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
                  background: active ? "rgba(90,158,212,0.20)"
  : "rgba(90,158,212,0.08)",
                  borderColor: active ?
"rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
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
        <p style={{ ...body, fontSize: "13px", color:
"#5A8AAA", fontWeight: 300 }}>
          No beats match the selected tags.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column",
gap: "16px" }}>
        {filtered.map((b) => {
          const meta = [b.bpm ? `${b.bpm} BPM` : null, b.key,
b.genre]
            .filter(Boolean)
            .join(" · ");

          return (
            <div key={b.id} className="ghost-panel" style={{
padding: "18px 20px" }}>
              {meta && (
                <p style={{ ...mono, fontSize: "8px",
letterSpacing: "2px", color: "#5A8AAA",
                  textTransform: "uppercase", marginBottom:
"8px" }}>
                  {meta}
                </p>
              )}
              {/* No textTransform — title casing is
intentional */}
              <h3 style={{ ...display, fontSize: "14px",
fontWeight: 700, letterSpacing: "1.5px",
                color: "#2A6094", marginBottom: "10px" }}>
                {b.title}
              </h3>
              {b.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap:
"wrap", gap: "4px",
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
                          background: active ?
"rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
                          borderColor: active ?
"rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
                          color: active ? "#2A6094" :
"#5A8AAA",
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

---
Step 5 — Create src/components/HomeCatalog.tsx

Client component — owns mobile tab state. Receives both data
arrays as props from the server component.

"use client";
import { useState } from "react";
import type { Beat, Release } from "@/lib/types";
import { BeatsCatalog } from "./BeatsCatalog";
import { ReleasesCatalog } from "./ReleasesCatalog";

const mono: React.CSSProperties = { fontFamily:
"var(--font-share-tech-mono), monospace" };

type Tab = "releases" | "beats";

export function HomeCatalog({ beats, releases }: { beats:
Beat[]; releases: Release[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("releases");

  return (
    <>
      {/* Mobile tab switcher — hidden on desktop via CSS */}
      <div className="mobile-tabs" style={{ gap: "0",
marginBottom: "24px" }}>
        {(["releases", "beats"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...mono,
              flex: 1,
              fontSize: "9px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "10px",
              background: activeTab === tab ?
"rgba(90,158,212,0.15)" : "rgba(255,255,255,0.30)",
              border: "1px solid rgba(90,158,212,0.35)",
              borderRight: tab === "releases" ? "none" :
undefined,
              color: activeTab === tab ? "#2A6094" :
"#5A8AAA",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        <div className={activeTab !== "releases" ?
"catalog-col-hidden" : ""}>
          <ReleasesCatalog releases={releases} />
        </div>
        <div className={activeTab !== "beats" ?
"catalog-col-hidden" : ""}>
          <BeatsCatalog beats={beats} />
        </div>
      </div>
    </>
  );
}

---
Step 6 — Update src/app/page.tsx

- Add Supabase fetch and HomeCatalog import
- Remove the three BracketCard sections and their surrounding
Divider calls
- Keep the hero header and replace the three dividers +
sections with a single <Divider label="CATALOG" /> +
<HomeCatalog>
- BracketCard import can be removed (no longer used in
page.tsx)

import { Divider } from "@/components/Divider";
import { HomeCatalog } from "@/components/HomeCatalog";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const [{ data: releases }, { data: beats }] = await
Promise.all([
    supabase
      .from("releases")
      .select("*")
      .eq("is_visible", true)
      .order("released_at", { ascending: false }),
    supabase
      .from("beats")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto",
padding: "48px 40px 80px" }}>

      {/* Hero — unchanged */}
      <header className="hero-panel" style={{ marginBottom:
"48px" }}>
        {/* ... existing hero content ... */}
      </header>

      <Divider label="CATALOG" />

      <HomeCatalog beats={beats ?? []} releases={releases ??
[]} />

    </main>
  );
}

---
Registration & Wiring

- No new routes
- No new env vars
- No schema changes
- New files: HomeCatalog.tsx, BeatsCatalog.tsx,
ReleasesCatalog.tsx
- BracketCard import removed from page.tsx

Definition of Done

- Supabase SQL editor: 9 releases + 5 beats seeded with no
errors
- Homepage renders real releases in left column with
SoundCloud iframes
- Homepage renders real beats in right column with Baton
iframes
- Beat titles render in their original lowercase casing
- genre: null beats show no genre in the overline
- Clicking a tag in the filter bar filters the beats list
- Clicking a tag inside a beat card also toggles the filter
- × CLEAR restores the full list
- Desktop: two columns side by side
- Mobile (≤680px): tab switcher shows one column at a time
- Empty states render without errors
- npm run build passes
