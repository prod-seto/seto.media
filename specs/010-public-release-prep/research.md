# Research: Public Release Prep

**Feature**: 010-public-release-prep  
**Date**: 2026-04-19

---

## 1. Cross-Column Audio Coordination

**Decision**: Shared `src/lib/audio-coordinator.ts` module with module-level pause callbacks.

**Rationale**: `SoundCloudPlayer.tsx` and `BeatCard.tsx` each already use module-level variables (`currentWidget`, `currentAudio`) for within-column single-play. A direct import between the two files would create a circular dependency. A thin shared coordinator module breaks the cycle cleanly and is the minimum surface needed.

**Design**:
```typescript
// src/lib/audio-coordinator.ts
let pauseBeats: (() => void) | null = null;
let pauseReleases: (() => void) | null = null;

export function registerBeatPause(fn: () => void) { pauseBeats = fn; }
export function registerReleasePause(fn: () => void) { pauseReleases = fn; }
export function notifyBeatPlay() { pauseReleases?.(); }
export function notifyReleasePlay() { pauseBeats?.(); }
```

- `BeatCard.tsx` calls `registerBeatPause(() => { currentAudio?.pause(); currentAudio = null; })` at module level (once), and calls `notifyBeatPlay()` inside the beat's play handler.
- `SoundCloudPlayer.tsx` calls `registerReleasePause(() => { currentWidget?.pause(); })` at module level (once), and calls `notifyReleasePlay()` inside `toggle()` when `!isPlaying` (i.e., starting to play, not pausing).

**Alternatives considered**:
- Custom DOM events (`window.dispatchEvent`): Works but requires careful cleanup and is harder to type.
- React context: Overkill for a module-level singleton; would require restructuring the component tree.
- Direct cross-import: Creates circular dependency; ruled out.

---

## 2. Waveform Bar Equal-Width Fix

**Decision**: Replace `display: flex` + `gap: 1.5px` with CSS grid (`display: grid; gridTemplateColumns: repeat(N_BARS, 1fr); gap: 1px`) in the `Waveform` component.

**Rationale**: The current flex layout uses `gap: 1.5px` (fractional pixel). Browsers distribute fractional pixel gaps inconsistently — some bars receive `floor(barW)` and some `ceil(barW)`, causing visible width differences. CSS grid with `1fr` columns guarantees the browser performs a single integer-aware layout pass, distributing column widths equally. `gap: 1px` (integer) eliminates the fractional source.

**Change in ReleaseCard.tsx**:
```tsx
// Before (Waveform container):
style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "40px", ... }}

// After:
style={{ display: "grid", gridTemplateColumns: `repeat(${N_BARS}, 1fr)`, gap: "1px", alignItems: "flex-end", height: "40px", ... }}
```

Bar `div`s: remove `flex: 1` (not needed in grid context); keep `height` and `background` as-is.

**Alternatives considered**:
- Integer gap with flex: Still subject to fractional bar widths if (containerWidth - gaps) is not divisible by N_BARS.
- Explicit `width: calc((100% - Xpx) / N_BARS)` on each bar: Correct but verbose; grid `1fr` is equivalent and cleaner.

---

## 3. Play/Pause Button Vertical Centering

**Decision**: Add `display: "inline-flex", alignItems: "center", justifyContent: "center"` inline to both the SoundCloud play button (`SoundCloudPlayer.tsx`) and the beat play button (`BeatCard.tsx`).

**Rationale**: The `.tag` CSS class uses no flex display — buttons are `inline-block` by default. Emoji glyphs (▶, ⏸) have non-standard glyph metrics that cause them to render slightly above or below the text baseline in inline contexts. Flex centering is the reliable cross-browser fix. Adding inline rather than modifying `.tag` in globals.css avoids unintended side-effects on other `.tag` elements (filter tags, genre labels, etc.).

**Alternatives considered**:
- Modifying `.tag` in globals.css: Would affect all tag elements site-wide — too broad.
- `line-height` tricks: Fragile across browsers and font stacks; emoji metrics vary.
- `vertical-align: middle`: Insufficient for emoji alignment in inline-block context.

---

## 4. Downloads Page Architecture

**Decision**: Fully static server component with hardcoded download entries (no Supabase table). Files served from `public/downloads/`.

**Rationale**: Downloads are manually curated by seto and change infrequently. A database table would add schema/migration overhead with no meaningful benefit at this scale. The `public/` directory is served by Vercel's CDN automatically, making it the right place for binary assets. The file tree UI reuses the same JSX pattern from `tools/page.tsx` — no shared component abstraction needed (only 2 usages, below the 3-use threshold from the constitution).

**File preparation** (done before deploy, outside code changes):
1. Zip `/Volumes/SSK SSD/seto sound bank/◈ adrift stash kit - @prod_seto` → `adrift-stash-kit.zip`
2. Copy the JPEG cover art from the same folder → `adrift-stash-kit-cover.jpg`
3. Place both in `public/downloads/`

**Drum kit detail page route**: `/downloads/adrift-stash-kit`  
**Download URL**: `/downloads/adrift-stash-kit.zip` (served statically)

**Alternatives considered**:
- Supabase Storage: Consistent with audio files but adds latency for a simple file download; requires schema work.
- Dynamic route with Supabase table: Unnecessary for manually curated, rarely-updated content.

---

## 5. Tools Page Coming-Soon Non-Clickable

**Decision**: Add an `isComingSoon` prop to `FolderSection`. When `true`, tool rows render as a plain `<div>` instead of `<Link>`, and the tagline/description is suppressed.

**Rationale**: The `coming_soon` folder name determines the behavior. Rather than checking the folder name as a string inside `FolderSection`, passing a boolean prop keeps the logic explicit and the component testable. The arrow `→` is also hidden for coming-soon items since it implies navigability.

**Change**: In `tools/page.tsx`, the `folders` array determines which folders are `coming_soon`. Modify `FolderSection` to accept `isComingSoon: boolean`. Pass `isComingSoon={folder.name === "coming_soon"}`.

---

## 6. Root Label Fix

**Decision**: Change the literal string `/producer-tools` to `/producer_tools` at line 199 of `src/app/tools/page.tsx`.

**No research needed** — single character change.

---

## 7. Releases Header Rename

**Decision**: Change the `<h2>` content in `ReleasesCatalog.tsx` from `"Releases"` to `"Produced by me"`.

**Capitalization rationale**: Sentence case ("Produced by me") is the correct typographic choice for a column header in a media-focused UI. Title case ("Produced By Me") adds unnecessary weight to prepositions. The design brief does not prescribe title case for column headers, only for display names and labels. Sentence case is consistent with the informal, personal tone of the copy.
