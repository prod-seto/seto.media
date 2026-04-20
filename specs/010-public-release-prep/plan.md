# Implementation Plan: Public Release Prep

**Branch**: `010-public-release-prep` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/010-public-release-prep/spec.md`

## Summary

Eight targeted fixes and one net-new page to prepare seto.media for public launch tonight. The largest change is the Downloads page — a static file tree at `/downloads` mirroring the tools page visual pattern, with a drum kit detail page and zip download. The most architecturally significant change is cross-column audio coordination: a shared `audio-coordinator` module ensures only one track (releases or beats) plays at a time. The remaining six changes are surgical text, styling, and navigation edits to existing components.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router + React 19  
**Primary Dependencies**: `@supabase/supabase-js` 2.x (existing, tools only), native Web APIs (HTMLAudioElement, SoundCloud Widget API)  
**Storage**: Static files in `public/downloads/` for drum kit zip and cover art  
**Testing**: `npm run build` (TypeScript gate) + manual browser review at ≥960px and ≤680px  
**Target Platform**: Web browser (desktop primary, mobile responsive)  
**Project Type**: Next.js web application  
**Performance Goals**: No new third-party JS dependencies; static file downloads via CDN  
**Constraints**: No new npm packages; SoundCloud Widget API is the only permitted external script  
**Scale/Scope**: Solo-maintained; changes are surgical — no new abstractions unless used 3+ places

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Quality — single responsibility | ✅ PASS | Downloads page is a new server component; audio coordinator is a standalone util |
| I. No speculative abstractions | ✅ PASS | `audio-coordinator.ts` is used by exactly 2 modules (BeatCard + SoundCloudPlayer) |
| I. TypeScript strict — no `any` | ✅ PASS | All new types defined in `data-model.md` |
| II. Design System — 0px border radius, palette, typefaces | ✅ PASS | Downloads page copies tools page visual pattern exactly |
| II. Ghost-panel / tracklist-panel for containers | ✅ PASS | Downloads page uses `ghost-panel` |
| III. `npm run build` gate before commit | ✅ PASS | Enforced per workflow |
| III. Manual visual review at desktop + mobile | ✅ PASS | Required before marking done |
| III. Audio: play/pause/single-play manually verified | ✅ PASS | Cross-column coordination is the primary audio change |
| IV. No blocking renders | ✅ PASS | Downloads page is a static server component (no data fetching) |
| IV. No new third-party JS | ✅ PASS | `audio-coordinator.ts` is a local module |
| V. Typed Supabase results | ✅ PASS | Tools page already typed; downloads has no Supabase queries |
| UX. Single-play coordination cross-column | ✅ PASS | This feature explicitly addresses the known gap |

**No violations. No Complexity Tracking section needed.**

## Project Structure

### Documentation (this feature)

```text
specs/010-public-release-prep/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code Changes

```text
src/
├── app/
│   ├── downloads/
│   │   ├── page.tsx                    # NEW — downloads file tree (server component)
│   │   └── [slug]/
│   │       └── page.tsx                # NEW — drum kit detail + download page
│   └── tools/
│       └── page.tsx                    # EDIT — root label /producer_tools, coming_soon non-clickable/no-subtitle
├── components/
│   ├── SiteNav.tsx                     # EDIT — add DOWNLOADS link (HOME, DOWNLOADS, TOOLS)
│   ├── ReleasesCatalog.tsx             # EDIT — rename header "Produced by me"
│   ├── SoundCloudPlayer.tsx            # EDIT — call notifyReleasePlay() on play; register pause callback
│   ├── ReleaseCard.tsx                 # EDIT — fix waveform bar widths (CSS grid), fix Play button centering
│   └── BeatCard.tsx                    # EDIT — call notifyBeatPlay() on play; register pause callback; fix Play button centering
└── lib/
    └── audio-coordinator.ts            # NEW — shared cross-column audio pause coordination

public/
└── downloads/
    ├── adrift-stash-kit.zip            # NEW — zipped drum kit (prepared before deploy)
    └── adrift-stash-kit-cover.jpg      # NEW — cover art (copied from source folder)
```
