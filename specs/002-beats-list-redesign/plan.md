# Implementation Plan: Beats List Redesign

**Branch**: `002-beats-list-redesign` | **Date**: 2026-04-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-beats-list-redesign/spec.md`

## Summary

Redesign the beats catalog section to fix four structural problems: a tag filter bar
that won't scale beyond ~5 tags, per-row tag overflow with 3+ tags, BPM/key metadata
that is too small to read at 8px, and a first-row height inconsistency caused by a
layout hack. The solution merges the filter bar and tracklist into a single `ghost-panel`
and replaces the single-line row layout with a 3-line stacked layout.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router
**Primary Dependencies**: React 19, Supabase JS client
**Storage**: Supabase (no schema changes in this feature)
**Testing**: `npm run build` (TypeScript gate) + manual visual/audio review
**Target Platform**: Browser (desktop ≥960px, mobile ≤680px)
**Project Type**: Web application — client-side component redesign only
**Performance Goals**: No new RAF loops or audio work; RAF loop already in place
**Constraints**: Must preserve all existing audio playback behaviors exactly
**Scale/Scope**: 2 files modified, no new files, no new dependencies

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Component Quality | Server components fetch data; client components handle state. No new abstractions for one-off operations. No dead code (remove `isFirst` prop). | ✅ Pass — `BeatsCatalog` remains the client component owning filter state. `BeatRow` stays a pure display component. `isFirst` prop removed cleanly. |
| II. Design System Fidelity | `ghost-panel` class, Orbitron/Share Tech Mono typefaces, 0px radius, cool blue-teal palette. | ✅ Pass — single `ghost-panel` integrating filter + rows. BPM/key uses Share Tech Mono 11px. Titles use Orbitron 700 13px. All colours remain within spec. |
| III. Testing Standards | `npm run build` must pass. Audio behaviors (play, pause, seek, visualizer, single-play) must be manually verified after any change to audio player components. Desktop + mobile visual review required. | ✅ Pass — audio logic in `BeatRow` is not touched. Only layout/padding/structure changes. Build gate + visual review in quickstart.md. |
| IV. Performance Requirements | RAF loop must re-queue even when canvas is null. AudioContext lazy-initialized. | ✅ Pass — RAF loop logic is unchanged. No new effects added. |
| V. Data Integrity | All Supabase queries use typed interfaces. No hardcoded URLs. | ✅ Pass — no data model changes. `beat.audio_url` and `beat.baton_url` remain authoritative. |

**UX Consistency gate**: Tag filter MUST filter immediately on click. × CLEAR MUST restore full list. Single-play coordination preserved. ✅ All preserved — no filter logic changes, only structural relayout.

**Post-design re-check** (after research.md design was finalized): All gates still pass. The integrated panel design resolves the `isFirst` hack structurally by placing the `ghost-panel::before` bracket over the filter header zone, not over a beat row play button.

## Project Structure

### Documentation (this feature)

```text
specs/002-beats-list-redesign/
├── plan.md              ← this file
├── research.md          ← design proposal (Phase 0)
├── spec.md              ← feature specification
├── quickstart.md        ← manual verification guide (Phase 1)
├── checklists/
│   └── requirements.md  ← spec quality checklist
└── tasks.md             ← task breakdown (/speckit-tasks output)
```

### Source Code (files changed by this feature)

```text
src/components/
├── BeatsCatalog.tsx    ← merge filter into single ghost-panel; restructure filter zone
└── BeatCard.tsx        ← 3-line row layout; remove isFirst prop; keep isLast
```

No new files. No CSS changes. No Supabase changes.

## Implementation Design

### Integrated panel structure

`BeatsCatalog.tsx` wraps the entire beats section in a single `ghost-panel`. Inside:

**Zone 1 — Filter header**
- Padding: `10px 14px`
- Bottom border: `1px solid rgba(90,158,212,0.20)` separating filter from rows
- Left: Share Tech Mono 8px `#5A8AAA` "FILTER" label
- Center/right: `display: flex, flexWrap: wrap, gap: 6px` tag buttons
- Far right: `× CLEAR` button (only when tags active)
- The `ghost-panel::before` corner bracket sits at `top: 6px, left: 6px` — above this
  zone, not above a play button

**Zone 2 — Beat rows (3-line stacked layout)**

Each `BeatRow` renders three vertically stacked lines, uniform `padding: 10px 14px`:

```
[▶]  title text here                    ← Line 1
     165 BPM · G# MINOR                 ← Line 2 (indented ~38px to align with title)
     [osamason]  [fakemink]             ← Line 3 (same indent, flex-wrap)
```

When playing, below Line 3:
```
     ▓▓▓▓▒▒░░░░░░░░░░░░  ← canvas 24px
     ══════░░░░░░░░░░░░  ← progress 2px
     0:32          1:45  ← timestamps
```

### BeatRow prop changes

| Prop | Before | After |
|------|--------|-------|
| `isFirst` | Present — set `paddingTop: 20px` on first row | **Removed** — not needed; bracket is over filter zone |
| `isLast` | Present — suppresses bottom border | **Kept** — still needed |

### Typography changes

| Element | Before | After |
|---------|--------|-------|
| BPM/key | Share Tech Mono 8px, inline with tags | Share Tech Mono 11px, own line, indented |
| Title | Orbitron 700 13px (unchanged) | Orbitron 700 13px (unchanged) |
| Tags | 9px, single line `flexShrink: 0` | 9px, own line, `flex-wrap` (unlimited tags) |

## Complexity Tracking

No constitution violations. No justifications needed.
