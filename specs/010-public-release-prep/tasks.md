# Tasks: Public Release Prep

**Input**: Design documents from `/specs/010-public-release-prep/`  
**Branch**: `010-public-release-prep`  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ui-contract.md ✅ quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US5)
- No test tasks — no tests were requested in the spec

---

## Phase 1: Setup (Static Assets)

**Purpose**: Prepare binary assets that code depends on before any code can be tested end-to-end.

- [ ] T001 Create `public/downloads/` directory, zip the drum kit from `/Volumes/SSK SSD/seto sound bank/◈ adrift stash kit - @prod_seto` into `public/downloads/adrift-stash-kit.zip`, and copy the cover art JPEG into `public/downloads/adrift-stash-kit-cover.jpg`

**Checkpoint**: `public/downloads/` contains `adrift-stash-kit.zip` and `adrift-stash-kit-cover.jpg`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the audio coordinator module — required by both US2 (BeatCard) and US1/US4 (SoundCloudPlayer) before those files can be edited.

**⚠️ CRITICAL**: US2 implementation cannot begin until T002 is complete.

- [ ] T002 Create `src/lib/audio-coordinator.ts` with module-level `pauseBeats`/`pauseReleases` callbacks and exported `registerBeatPause`, `registerReleasePause`, `notifyBeatPlay`, `notifyReleasePlay` functions — see `data-model.md` for exact signatures

**Checkpoint**: `src/lib/audio-coordinator.ts` compiles with `npm run build`

---

## Phase 3: User Story 1 — Downloads Page (Priority: P1) 🎯 MVP

**Goal**: A visitor can navigate to `/downloads`, see the file tree, click the drum kit, and download it from a detail page.

**Independent Test**: Visit `/downloads` → see tree with `released/` and `coming_soon/` folders → click "◈ adrift stash kit" → confirm detail page shows cover art and download button → click download → zip downloads.

- [ ] T003 [US1] Create `src/app/downloads/page.tsx` as an async server component: static file tree with root label `◈ /downloads`, a `released/` folder containing the adrift stash kit as a clickable Link to `/downloads/adrift-stash-kit`, and a `coming_soon/` folder containing `round_robin.vst3` as a plain non-clickable div with no subtitle — use `ghost-panel` container and copy the ASCII tree visual pattern from `src/app/tools/page.tsx`
- [ ] T004 [US1] Create `src/app/downloads/[slug]/page.tsx` as an async server component: render cover art `<img src="/downloads/{slug}-cover.jpg">` at 200×200, item name as `<h1>` with `type-display` class and `#2A6094` color, and a download `<a href="/downloads/{slug}.zip" download>` styled as `.tag` with `rgba(90,158,212,0.08)` background and `rgba(90,158,212,0.35)` border — for unknown slugs render a "not found" message

**Checkpoint**: US1 fully functional — `/downloads` renders tree, detail page renders cover art + download link, download triggers zip file

---

## Phase 4: User Story 2 — Mutually Exclusive Audio (Priority: P1)

**Goal**: Playing a release pauses any active beat, and vice versa.

**Independent Test**: Play a release → play a beat → release pauses. Play a beat → play a release → beat pauses.

- [ ] T005 [US2] Edit `src/components/BeatCard.tsx`: import `registerBeatPause` and `notifyBeatPlay` from `@/lib/audio-coordinator`; at module level (outside the component) call `registerBeatPause(() => { currentAudio?.pause(); currentAudio = null; })`; inside the beat's play handler (where `audio.play()` is called) call `notifyBeatPlay()` before starting playback
- [ ] T006 [US2] Edit `src/components/SoundCloudPlayer.tsx`: import `registerReleasePause` and `notifyReleasePlay` from `@/lib/audio-coordinator`; at module level call `registerReleasePause(() => { currentWidget?.pause(); })`; inside `toggle()` add `notifyReleasePlay()` guarded by `if (!isPlaying)` (only when starting, not when pausing)

**Checkpoint**: US2 fully functional — only one audio source plays at a time, cross-column

---

## Phase 5: User Story 3 — Navbar with Downloads Link (Priority: P2)

**Goal**: Navbar shows HOME, DOWNLOADS, TOOLS in that order; DOWNLOADS routes to `/downloads` and is active-highlighted when there.

**Independent Test**: Load any page → confirm navbar order → click DOWNLOADS → confirm route and active state.

- [ ] T007 [US3] Edit `src/components/SiteNav.tsx`: add `downloadsActive = pathname.startsWith("/downloads")` constant; insert a `<Link href="/downloads">` with `type-label` class between the HOME and TOOLS links, with `color: downloadsActive ? "#2A6094" : "#5A8AAA"` and text `downloads`

**Checkpoint**: US3 fully functional — navbar shows three links in correct order with correct active states

---

## Phase 6: User Story 4 — Visual Polish (Priority: P2)

**Goal**: Column header renamed; waveform bars are equal width; Play/Pause buttons are centered.

**Independent Test**: Homepage shows "Produced by me" header; waveform bars appear identical width; play/pause content is centered in both columns.

- [ ] T008 [P] [US4] Edit `src/components/ReleasesCatalog.tsx`: change the `<h2>` text from `"Releases"` to `"Produced by me"`
- [ ] T009 [P] [US4] Edit `src/components/ReleaseCard.tsx` in the `Waveform` component: change the container `style` from `display: "flex", gap: "1.5px"` to `display: "grid", gridTemplateColumns: \`repeat(${N_BARS}, 1fr)\`, gap: "1px"`; on each bar `<div>` remove `flex: 1` (not needed in grid context)
- [ ] T010 [US4] Edit `src/components/SoundCloudPlayer.tsx` play button: add `display: "inline-flex", alignItems: "center", justifyContent: "center"` to the button's inline `style` (this file was already edited in T006 — apply on top of that change)
- [ ] T011 [US4] Edit `src/components/BeatCard.tsx` play button: add `display: "inline-flex", alignItems: "center", justifyContent: "center"` to the beat button's inline `style` (this file was already edited in T005 — apply on top of that change)

**Checkpoint**: US4 fully functional — all three visual corrections confirmed in browser

---

## Phase 7: User Story 5 — Tools Page Fixes (Priority: P3)

**Goal**: Root label reads `/producer_tools`; coming_soon items are non-clickable with no subtitle.

**Independent Test**: `/tools` shows `/producer_tools` as root; all coming_soon items are plain text with no subtitle and do not navigate when clicked.

- [ ] T012 [US5] Edit `src/app/tools/page.tsx`: (1) change the root label string from `/producer-tools` to `/producer_tools` at line 199; (2) add `isComingSoon: boolean` prop to `FolderSection`; when `isComingSoon` is true, render each tool row as a `<div>` (not `<Link>`), suppress the tagline `<p>` entirely, hide the `→` arrow, and set text color to `rgba(90,158,212,0.55)` or `#5A8AAA`; (3) pass `isComingSoon={folder.name === "coming_soon"}` to each `<FolderSection>` call

**Checkpoint**: US5 fully functional — root label and coming_soon behavior confirmed

---

## Phase 8: Polish & Verification

**Purpose**: Build gate + manual review across all stories before shipping.

- [ ] T013 Run `npm run build` and confirm zero TypeScript errors — fix any type errors before proceeding
- [ ] T014 [P] Manual browser review at ≥960px: work through every item in `specs/010-public-release-prep/quickstart.md` verification checklist
- [ ] T015 [P] Manual browser review at ≤680px: confirm all pages are responsive (downloads page, tools page, homepage columns)

**Checkpoint**: All 15 checklist items in quickstart.md are checked — feature is ship-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: No dependencies — start immediately (can run alongside Phase 1)
- **Phase 3 (US1 — Downloads)**: Depends on Phase 1 (assets must exist to test download)
- **Phase 4 (US2 — Audio)**: Depends on Phase 2 (audio-coordinator.ts must exist)
- **Phase 5 (US3 — Navbar)**: No blocker — can start after Phase 2 (build must pass)
- **Phase 6 (US4 — Visual)**: T010, T011 depend on T005, T006 being done (same files)
- **Phase 7 (US5 — Tools)**: No blocker — fully independent
- **Phase 8 (Polish)**: Depends on all prior phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 1 assets and Phase 2 build gate
- **US2 (P1)**: Depends on T002 (audio-coordinator.ts)
- **US3 (P2)**: Independent — no blockers beyond a passing build
- **US4 (P2)**: T010, T011 should come after T005, T006 (same files, avoid conflicts)
- **US5 (P3)**: Fully independent

### Parallel Opportunities

- T001 and T002 can run in parallel (different concerns)
- T003 and T004 can run in parallel (different files)
- T005 and T006 can run in parallel (different files)
- T008 and T009 can run in parallel (different files)
- T014 and T015 can run in parallel (different viewport widths)
- US3 (T007) and US5 (T012) can run in parallel (different files)

---

## Implementation Strategy

### MVP First (US1 + US2 — both P1)

1. Complete Phase 1 (assets) + Phase 2 (coordinator) in parallel
2. Complete Phase 3 (US1 — Downloads page) → test independently
3. Complete Phase 4 (US2 — Audio coordination) → test independently
4. **STOP and VALIDATE**: Both P1 stories work — this alone is a shippable launch
5. Continue with P2/P3 stories

### Full Delivery (all stories)

1. Phase 1 + Phase 2 (parallel)
2. Phase 3 (US1) + Phase 4 (US2) — P1 stories
3. Phase 5 (US3) + Phase 7 (US5) — can run in parallel (different files)
4. Phase 6 (US4) — after T005/T006 done
5. Phase 8: build + browser review

---

## Notes

- T010 and T011 edit files already touched by T005/T006 — complete US2 tasks first
- US1 depends on physical assets in `public/downloads/` — T001 must complete before testing T003/T004
- The audio coordinator (T002) uses module-level variables — no React state, no context
- `npm run build` must pass after every phase before committing
