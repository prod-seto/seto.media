# Implementation Plan: BPM + Key Detector

**Branch**: `009-bpm-key-detector` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/009-bpm-key-detector/spec.md`

## Summary

Build a client-side audio analysis page at `/tools/bpm-key`. The user drops or selects an audio file; the browser decodes it using the Web Audio API and runs a JS port of RAWMASTER's `detect_info()` — Krumhansl-Schmuckler key profiling + energy-based BPM detection — returning tempo, key (e.g., "C# minor"), and confidence. All processing is in-browser; no audio data leaves the device and no new npm dependencies are added.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router + React 19  
**Primary Dependencies**: Web Audio API (browser native — `AudioContext`, `decodeAudioData`, `OfflineAudioContext`); no new npm packages  
**Storage**: N/A — feature is fully client-side and stateless  
**Testing**: `npm run build` (TypeScript gate); manual visual verification at ≥960px and ≤680px; manual drop-file functional test  
**Target Platform**: Browser (Chrome, Firefox, Safari — latest two versions)  
**Project Type**: web-service (Next.js page within existing app)  
**Performance Goals**: Analysis of a 3–5 min audio file completes in < 10 seconds on a consumer device  
**Constraints**: No audio data sent to server; no new third-party JS; `AudioContext` init inside user-gesture only; 50MB file size limit  
**Scale/Scope**: Single tool page; one user at a time, fully client-side

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Quality | PASS | Server component shell (`page.tsx`) + one client component (`BpmKeyDetector.tsx`) + pure analysis module (`bpm-key-analysis.ts`). Clear single responsibilities. No speculative abstractions. |
| II. Design System Fidelity | PASS | `.ghost-panel`, Unifont type classes, `#EEF4F8` background, `#5A9ED4` accent, 0px border-radius, no shadows. Labels lowercase in JSX, uppercase via `.type-label` CSS only. |
| III. Testing Standards | PASS | `npm run build` is the gate. Manual visual + functional verification required. No mocking of Web Audio API. |
| IV. Performance Requirements | PASS | `AudioContext` created inside the file-drop/click handler (user gesture). No RAF loops. No new external scripts — analysis is pure JS. |
| V. Data Integrity | PASS | No Supabase schema changes. `database.types.ts` not touched. |

**No violations. No Complexity Tracking table needed.**

## Project Structure

### Documentation (this feature)

```text
specs/009-bpm-key-detector/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── ui-contract.md   ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── tools/
│       └── bpm-key/
│           └── page.tsx           ← server shell (metadata + imports BpmKeyDetector)
├── components/
│   └── BpmKeyDetector.tsx         ← 'use client' — drop zone, state, copy buttons, results UI
└── lib/
    └── bpm-key-analysis.ts        ← pure analysis engine: chroma extraction, KS key detection, BPM
```

**Structure Decision**: Single project (Option 1). New page route under the existing `/tools` section. Analysis logic extracted to `src/lib/` so it is importable independently from the component (testable in isolation). No backend changes.

## Complexity Tracking

*No violations — section left blank.*
