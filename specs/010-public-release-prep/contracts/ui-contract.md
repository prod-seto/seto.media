# UI Contract: Public Release Prep

**Feature**: 010-public-release-prep  
**Date**: 2026-04-19

---

## Downloads Page (`/downloads`)

**Component type**: Async server component  
**Visual pattern**: Identical to tools page — `ghost-panel` container, ASCII file tree  
**Data source**: Static hardcoded arrays (no Supabase)

### Tree Structure

```
◈ /downloads                    [root label]
├── released/                   [folder — N items]
│   └── ◈ adrift stash kit      [clickable → /downloads/adrift-stash-kit]
│                               [no subtitle on released items]
└── coming_soon/                [folder — N items]
    └── round_robin.vst3        [NOT clickable, no subtitle, no arrow]
```

### Root Header Row

| Field | Value |
|-------|-------|
| Left text | `◈ /downloads` |
| Right text | `{N} folders · {M} items` |
| Style | Same as tools page root header |

### Folder Header Row

| Field | Value |
|-------|-------|
| Left | connector (`├──` or `└──`) + folder name + `/` |
| Right | `{N} item(s)` count |

### Released Item Row (clickable)

| Field | Value |
|-------|-------|
| Renders as | `<Link href="/downloads/{slug}">` |
| Text | item `name` |
| Subtitle | none (released items have no description) |
| Right | `→` arrow |
| Hover | `background: rgba(90,158,212,0.06)` |
| CSS class | `tool-tree-row` (reuse existing) |

### Coming Soon Item Row (non-clickable)

| Field | Value |
|-------|-------|
| Renders as | `<div>` (no Link, no pointer cursor) |
| Text | item `name` in muted color |
| Subtitle | none |
| Right | none (no arrow) |
| Hover | none |

---

## Drum Kit Detail Page (`/downloads/[slug]`)

**Component type**: Async server component  
**Route**: `/downloads/adrift-stash-kit`

### Layout

```
[Cover art image — square, ~200px]
[Item name — h1, type-display, #2A6094]
[Download button — .tag style, triggers zip download]
```

### Cover Art

- `<img>` src: `/downloads/adrift-stash-kit-cover.jpg`
- Width/height: 200×200, `object-fit: cover`
- No border radius (constitution rule)

### Download Button

| Field | Value |
|-------|-------|
| Element | `<a href="/downloads/{slug}.zip" download>` styled as `.tag` button |
| Text | `DOWNLOAD` |
| Style | Same as play button: `rgba(90,158,212,0.08)` background, `rgba(90,158,212,0.35)` border |

---

## Navbar (`SiteNav.tsx`)

### New Link Order

| Position | Label | href | Active when |
|----------|-------|------|-------------|
| 1 | `home` | `/` | `pathname === "/"` |
| 2 | `downloads` | `/downloads` | `pathname.startsWith("/downloads")` |
| 3 | `tools` | `/tools` | `pathname.startsWith("/tools")` |

All links use `type-label` class, dark blue when active (`#2A6094`), muted when inactive (`#5A8AAA`).

---

## Play/Pause Button Centering

Both `SoundCloudPlayer.tsx` and `BeatCard.tsx` play buttons receive:

```tsx
style={{
  // existing styles...
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}}
```

---

## Waveform Bars (`ReleaseCard.tsx`)

The `Waveform` component's container changes from flex to grid:

```tsx
// Before
style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "40px", ... }}

// After
style={{ display: "grid", gridTemplateColumns: `repeat(${N_BARS}, 1fr)`, gap: "1px", alignItems: "end", height: "40px", ... }}
```

Each bar `<div>`: remove `flex: 1`. Keep `height` and `background` unchanged.

---

## Tools Page Changes

### Root Label
- Before: `◈ /producer-tools`
- After: `◈ /producer_tools`

### Coming Soon Items
`FolderSection` receives new prop `isComingSoon: boolean`.

When `isComingSoon === true`:
- Item row renders as `<div>` instead of `<Link>`
- `cursor: default` (or omit pointer)
- Tagline/description suppressed (even if field is populated)
- `→` arrow hidden
- Text color: muted (`rgba(90,158,212,0.55)` or `#5A8AAA`)

### Releases Header

`ReleasesCatalog.tsx` line 7–9:
- Before: `Releases`
- After: `Produced by me`

---

## Audio Coordinator Behavior Contract

| Event | Trigger | Effect |
|-------|---------|--------|
| Beat play button clicked | `notifyBeatPlay()` called | `pauseReleases?.()` → SC widget pauses |
| Release play button clicked (starting) | `notifyReleasePlay()` called | `pauseBeats?.()` → currentAudio pauses, reset to null |
| Beat play button clicked (pausing) | No notify call | No cross-column effect |
| Release play button clicked (pausing) | No notify call | No cross-column effect |
