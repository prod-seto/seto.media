# Tasks: BPM + Key Detector

**Input**: Design documents from `/specs/009-bpm-key-detector/`  
**Branch**: `009-bpm-key-detector`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not requested — no test tasks generated. TypeScript build gate (`npm run build`) is the automated check.

**Organization**: Tasks grouped by user story. US1 (drop → analyze → show result) is the MVP. US2 (copy) and US3 (reset/re-analyze) layer on top.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Different files, no blocking dependencies — can run in parallel
- **[Story]**: Maps to user story (US1/US2/US3) from spec.md

---

## Phase 1: Setup

**Purpose**: Create the route shell and lib file stubs so imports resolve from the start.

- [x] T001 [P] Create `src/app/tools/bpm-key/page.tsx` — server component shell: export default function, page title metadata, import placeholder for `<BpmKeyDetector />`
- [x] T002 [P] Create `src/lib/bpm-key-analysis.ts` — define all exported TypeScript types: `AudioFormat`, `NoteClass`, `AnalysisState`, `AnalysisPhase`, `AnalysisResult`, `AnalysisErrorCode`, `AnalysisError` class (extends Error with `code` field)

**Checkpoint**: `npm run build` passes (stubs only, no logic yet)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The core analysis engine in `src/lib/bpm-key-analysis.ts`. Nothing in the UI phases can be wired up until this is complete and type-checks.

**⚠️ CRITICAL**: US1–US3 implementation cannot begin until this phase is complete.

- [x] T003 Implement `extractChromaMean(buffer: AudioBuffer): number[]` in `src/lib/bpm-key-analysis.ts` — decode mono channel from AudioBuffer, compute overlapping FFT frames (hop ~512 samples), map each FFT bin frequency to pitch class 0–11 via `Math.round(12 * Math.log2(binHz / 440)) % 12`, accumulate energy per pitch class, return 12-element mean chroma vector normalised to sum 1
- [x] T004 Implement `detectKey(chromaMean: number[]): { key: NoteClass; mode: 'major' | 'minor'; confidence: number }` in `src/lib/bpm-key-analysis.ts` — direct JS port of rawmaster.py lines 668–684: Krumhansl-Schmuckler `MAJOR_PROFILE` + `MINOR_PROFILE` constants, `pearsonCorr()` helper, rotate profiles over all 12 keys, pick highest major/minor correlation, map winning correlation to confidence 0–100 via `Math.round(Math.max(0, r) * 100)`
- [x] T005 Implement `detectBpm(buffer: AudioBuffer): number` in `src/lib/bpm-key-analysis.ts` — extract mono float32 samples, compute RMS energy in 2048-sample frames with 512-sample hop, compute onset strength as positive flux (frame[i] − frame[i−1] clipped to 0), autocorrelate onset signal, find dominant peak in lag range corresponding to 60–200 BPM, apply octave-error correction (prefer 80–160 BPM), return BPM rounded to 2 decimal places
- [x] T006 Implement `analyzeBpmAndKey(file: File): Promise<AnalysisResult>` in `src/lib/bpm-key-analysis.ts` — validate format (throw `UNSUPPORTED_FORMAT`), validate size ≤ 50MB (throw `FILE_TOO_LARGE`), read as ArrayBuffer, create `AudioContext`, call `decodeAudioData` (throw `DECODE_FAILED` on error), check duration ≥ 3s (throw `TOO_SHORT`), check RMS ≥ 0.001 (throw `SILENT_AUDIO`), call `extractChromaMean` + `detectKey` + `detectBpm`, return `AnalysisResult`; also export `MIN_DURATION_WARN = 10` constant for component to surface short-file warning

**Checkpoint**: `npm run build` passes; `analyzeBpmAndKey` is typed and importable

---

## Phase 3: User Story 1 — Drop File, Get BPM + Key (Priority: P1) 🎯 MVP

**Goal**: User drops or selects a file; the tool runs analysis and displays BPM, key, mode, and confidence.

**Independent Test**: Open `/tools/bpm-key`, drop an MP3 file. Within 10 seconds the page shows a BPM number, a key (e.g., "C# minor"), and a confidence percentage. No page reload needed.

- [x] T007 [US1] Create `src/components/BpmKeyDetector.tsx` with `'use client'` — `useState<AnalysisState>` initialised to `{ phase: 'idle', result: null, errorMessage: null, warningMessage: null }`; render idle phase: `.ghost-panel` drop zone, `.type-body` instruction text "drop an audio file to analyze", dragover highlight via `data-dragging` attribute + CSS
- [x] T008 [US1] Add file intake handlers in `src/components/BpmKeyDetector.tsx` — `onDrop` (dragover/dragleave/drop events) and hidden `<input type="file" accept="audio/*">` triggered by click on drop zone; both call `handleFile(file: File)` which creates `AudioContext` inside the handler (never on mount — constitution Principle IV), transitions phase to `'decoding'`, calls `analyzeBpmAndKey(file)`, transitions to `'analyzing'` after decode, then to `'done'` with result; catch `AnalysisError` → transition to `'error'` with `errorMessage`
- [x] T009 [US1] Implement progress states in `src/components/BpmKeyDetector.tsx` — `decoding` phase: `.ghost-panel` with animated pulse dot + `.type-label` "decoding audio…"; `analyzing` phase: same panel + `.type-label` "detecting bpm + key…"; use CSS `@keyframes pulse` on a `--color-blue` dot element
- [x] T010 [US1] Implement `done` phase results panel in `src/components/BpmKeyDetector.tsx` — `.ghost-panel` with two rows: (1) `.type-display` BPM value (e.g., "128.00"), `.type-label` "bpm" below it; (2) `.type-display` key+mode (e.g., "c# minor"), `.type-label` "key · {confidence}% confidence" below it; all palette colours from design tokens (`--color-navy` for values, `--color-faint` for labels)
- [x] T011 [P] [US1] Wire `page.tsx` to render `<BpmKeyDetector />` in `src/app/tools/bpm-key/page.tsx` — add `import BpmKeyDetector from '@/components/BpmKeyDetector'`, render inside a `max-w-[960px] mx-auto px-10` wrapper div

**Checkpoint**: Navigate to `/tools/bpm-key`, drop a file, see BPM + key displayed. US1 is fully functional.

---

## Phase 4: User Story 2 — Copy Results (Priority: P2)

**Goal**: Three copy buttons let the user paste BPM, key, or a combined string directly into a DAW or file manager.

**Independent Test**: After analysis shows results, click each of the three copy buttons in turn. Paste into a text editor; confirm the values match the displayed result in the correct formats.

- [x] T012 [US2] Add copy buttons row to done phase in `src/components/BpmKeyDetector.tsx` — three `<button>` elements with `.type-label` class and `--color-blue` border: `copy bpm` (copies `bpm.toFixed(2)`), `copy key` (copies `${key} ${mode}` lowercase), `copy all` (copies `${bpm.toFixed(2)} bpm · ${key} ${mode}`); all use `navigator.clipboard.writeText()`; label text lowercase in JSX (`.type-label` CSS uppercases)
- [x] T013 [US2] Add clipboard feedback state in `src/components/BpmKeyDetector.tsx` — `useState<string | null>` for `copiedLabel`; on copy success set to button id and clear after 1200ms; render `.type-label` "copied!" next to the triggered button replacing its label during feedback window

**Checkpoint**: All three copy buttons work; feedback flash confirms copy. US2 is complete alongside US1.

---

## Phase 5: User Story 3 — Analyze Another File (Priority: P3)

**Goal**: User can reset and analyze a second file without a page reload.

**Independent Test**: After seeing results, drop a new file directly onto the results panel — OR click "analyze another" — and confirm the drop zone reappears and a fresh analysis runs.

- [x] T014 [US3] Add "analyze another" reset button to done phase in `src/components/BpmKeyDetector.tsx` — `.type-label` styled button below copy buttons that calls `resetAnalysis()` which sets state back to `{ phase: 'idle', result: null, errorMessage: null, warningMessage: null }`
- [x] T015 [US3] Allow file drop while in `done` or `error` phase in `src/components/BpmKeyDetector.tsx` — attach drop event listener to the results panel container (not just the idle drop zone); `handleFile()` already handles the full flow, so the done/error panels just need `onDrop` and `onDragOver` props wired to the same handlers

**Checkpoint**: Drop a second file from the done state; results update without page reload. US3 complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge case handling, error UI, design system audit, and final verification.

- [x] T016 Add short-file warning in `src/components/BpmKeyDetector.tsx` — in `handleFile()`, after a successful result check if `result.duration < MIN_DURATION_WARN` (10s) and set `warningMessage: "short file — results may be less accurate"`; render warning as `.type-label` in `--color-faint` beneath the results panel when present
- [x] T017 Implement `error` phase UI in `src/components/BpmKeyDetector.tsx` — `.ghost-panel` with `.type-body` `errorMessage` text and "try another file" reset button (`.type-label`); map `AnalysisErrorCode` to human-readable messages: `UNSUPPORTED_FORMAT` → "unsupported file type — try mp3, wav, ogg, or m4a", `FILE_TOO_LARGE` → "file too large — maximum 50mb", `DECODE_FAILED` → "could not read this file — it may be corrupt or unsupported", `SILENT_AUDIO` → "audio appears silent — nothing to analyze", `TOO_SHORT` → "file too short — need at least 3 seconds"
- [x] T018 Design system audit on `src/components/BpmKeyDetector.tsx` — verify: all text uses `.type-display`, `.type-subheading`, `.type-body`, or `.type-label`; all containers use `.ghost-panel`; no inline `fontFamily`, `fontWeight > 400`, `borderRadius`, or `boxShadow`; palette colours use CSS vars or exact hex tokens; label text content is lowercase in JSX; `text-transform: uppercase` only comes from `.type-label` CSS
- [x] T019 Manual visual verification — run `npm run dev`, open `/tools/bpm-key` at ≥960px: confirm drop zone layout, results panel proportions, copy buttons; resize to ≤680px: confirm responsive single-column layout, buttons stack cleanly, no overflow; test with a real MP3 and WAV file
- [x] T020 Run `npm run build` and fix all TypeScript errors — zero errors required before this task is complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately. T001 and T002 are [P].
- **Phase 2 (Foundational)**: Depends on T002 (types). T003, T004, T005 each depend on T002 but are functionally independent algorithm implementations. T006 depends on T003, T004, T005.
- **Phase 3 (US1)**: Depends on T006. T011 is [P] with T007–T010.
- **Phase 4 (US2)**: Depends on T010 (done phase exists). T012–T013 are additions to the done panel.
- **Phase 5 (US3)**: Depends on T010. T014–T015 are additions to existing phases/panels.
- **Phase 6 (Polish)**: Depends on all story phases complete.

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2. Independent MVP.
- **US2 (P2)**: Depends on US1 (needs done panel to add copy buttons to). Lightweight addition.
- **US3 (P3)**: Depends on US1 (needs done/error phases). Lightweight addition.

### Within Phase 2 (Algorithm Order)

```
T002 (types)
  ↓
T003 (chroma)  T004 (key)  T005 (bpm)  ← independent of each other, all need T002
        ↓            ↓          ↓
             T006 (main function)
```

### Parallel Opportunities

```bash
# Phase 1 — both immediately:
Task T001: "Create src/app/tools/bpm-key/page.tsx shell"
Task T002: "Define TypeScript types in src/lib/bpm-key-analysis.ts"

# Phase 3 — T011 can run in parallel with T007-T010:
Task T007-T010: "Build BpmKeyDetector.tsx component"
Task T011:      "Wire page.tsx to render BpmKeyDetector"
```

---

## Implementation Strategy

### MVP First (US1 Only — 11 tasks)

1. Complete Phase 1: T001, T002
2. Complete Phase 2: T003 → T004 → T005 → T006
3. Complete Phase 3: T007 → T008 → T009 → T010, T011
4. **STOP and VALIDATE**: Drop a real MP3 at `/tools/bpm-key` — see BPM + key displayed
5. Ship MVP

### Incremental Delivery

1. T001–T006 → Analysis engine ready
2. T007–T011 → US1: Drop → Analyze → Results (**MVP**) 
3. T012–T013 → US2: Copy buttons working
4. T014–T015 → US3: Multi-file session
5. T016–T020 → Polish: Edge cases, error UI, design audit, build gate

---

## Notes

- `AudioContext` MUST be created inside `handleFile()` (user gesture), never on component mount — this is a hard constitution rule
- No new npm packages — Web Audio API only; if `AudioContext` browser compat is an issue, add a `typeof AudioContext !== 'undefined'` guard
- All `.type-label` button text MUST be lowercase in JSX; the CSS class handles uppercase display
- Commit after each checkpoint (phases 1–6) with `feat: <description> (feature 009)`
- Task IDs T001–T020 are in execution order; follow this order unless [P] is marked
