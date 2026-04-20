# Tasks: Mobile Responsiveness Fixes

**Input**: Design documents from `/specs/011-mobile-responsiveness/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. No test tasks generated (not requested in spec).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other [P] tasks in the same phase
- **[Story]**: Which user story this task belongs to (US1–US4)
- All inline `style` props being replaced MUST become Tailwind `className` strings using mobile-first convention (base = mobile, `sm:` = ≥640px)

---

## Phase 1: Setup

**Purpose**: No new files or dependencies needed. Verify dev environment is ready for responsive work.

- [x] T001 Confirm `npm run dev` starts cleanly and homepage loads at http://localhost:3000
- [x] T002 Open Chrome DevTools → Toggle Device Toolbar → confirm 375px and 320px viewport presets exist for testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add responsive padding to the shared `.ghost-panel` and `.tracklist-panel` CSS classes in `globals.css`. Every page uses these classes, so this foundation unlocks correct content widths for all subsequent user story tasks.

**⚠️ CRITICAL**: Complete this phase before any user story work — all components inherit these shared styles.

- [x] T003 In `src/app/globals.css`, add a `@media (max-width: 639px)` rule that overrides `.ghost-panel` padding to `12px 16px` (from the current `20px 32px` or equivalent desktop value)
- [x] T004 In `src/app/globals.css`, add a `@media (max-width: 639px)` rule that overrides `.tracklist-panel` horizontal padding to `16px` on mobile
- [x] T005 Run `npm run build` and verify zero TypeScript errors after globals.css changes
- [x] T006 Verify in browser at 375px that ghost panels no longer cause horizontal overflow on any page

**Checkpoint**: Shared panel styles are responsive — all pages now have correct base widths for component-level fixes.

---

## Phase 3: User Story 1 - Mobile Visitor Browses Catalog (Priority: P1) 🎯 MVP

**Goal**: Homepage loads cleanly at 320px–375px. Navbar fits, catalog renders without overflow, padding is proportional.

**Independent Test**: Open `/` on a 375px viewport. Confirm: no horizontal scrollbar, navbar links accessible, catalog cards readable, beats tab works.

### Implementation for User Story 1

- [x] T007 [US1] In `src/components/SiteNav.tsx`, replace the outer `style={{ padding: "0 40px" }}` wrapper with `className="px-4 sm:px-10"`. Change the inner flex container from a single row to `className="flex flex-col sm:flex-row sm:items-center sm:justify-between"` so the logo sits on its own row on mobile and links appear below it.
- [x] T008 [US1] In `src/components/SiteNav.tsx`, reduce logo font size on mobile: replace the hardcoded `fontSize: "28px"` with `className="text-xl sm:text-3xl"`. Reduce nav link `gap` from `36px` to `gap-3 sm:gap-9` (using Tailwind classes on the links container).
- [x] T009 [US1] In `src/components/SiteNav.tsx`, reduce individual nav link font size on mobile to `text-[10px] sm:text-xs` so all links fit on one row below the logo even at 320px.
- [x] T010 [US1] In `src/app/page.tsx`, replace the outer container's inline `padding: "32px 40px 80px"` style with `className="px-4 sm:px-10 pt-8 pb-20"`.
- [x] T011 [US1] In `src/components/BeatCard.tsx`, verify the beat row layout (play button 28px + gap 12px + title) fits at 320px after the outer padding reduction. If still overflowing, reduce the gap from `12px` to `8px` on mobile by adding `className="gap-2 sm:gap-3"` to the inner flex row.
- [x] T012 [US1] Run `npm run build` to confirm zero TypeScript errors after SiteNav and page.tsx changes.
- [x] T013 [US1] Visual verify in browser: open `/` at 375px — no horizontal scroll, navbar is readable and all links are tappable, catalog renders cleanly.
- [x] T014 [US1] Visual verify at 320px — same checklist: no overflow, navbar fits, beats and releases tabs both work.

**Checkpoint**: Homepage is fully usable on mobile — US1 independently testable and shippable.

---

## Phase 4: User Story 2 - Mobile Visitor Uses SoundCloud Player (Priority: P2)

**Goal**: Release cards stack the artist name below the song title on screens below 640px. SoundCloud player controls (play button + progress bar) fit on 320px screens.

**Independent Test**: Open `/` on a 375px viewport, scroll to the Releases section. Confirm both title and artist are fully readable. Tap play on a track and confirm the player controls are usable.

### Implementation for User Story 2

- [x] T015 [US2] In `src/components/ReleaseCard.tsx`, locate the title + artist inline layout (currently `[Title] — [Artist]` in a single flex row). Wrap both in a new flex container: `className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2"`. Move the `—` separator into a `<span className="hidden sm:inline">` so it is hidden on mobile.
- [x] T016 [US2] In `src/components/ReleaseCard.tsx`, make the artist element display as a separate block element on mobile: add `className="text-sm sm:text-base mt-0.5 sm:mt-0"` (or equivalent) so it naturally wraps below the title. Remove any `whiteSpace: "nowrap"`, `overflow: "hidden"`, and `textOverflow: "ellipsis"` from the artist element if present.
- [x] T017 [US2] In `src/components/ReleaseCard.tsx`, change the release cover image from fixed `width={88}` to a responsive size. Add `className="w-16 sm:w-[88px] shrink-0"` (64px on mobile, 88px on sm+) and remove any conflicting inline width style.
- [x] T018 [US2] In `src/components/SoundCloudPlayer.tsx`, change the play button from `width: "88px"` (inline style) to `className="w-20 sm:w-[88px] shrink-0"` (80px on mobile, 88px on sm+). Verify the full player row (button + progress bar) fits at 320px without wrapping or overflowing.
- [x] T019 [US2] Run `npm run build` to confirm zero TypeScript errors after ReleaseCard and SoundCloudPlayer changes.
- [x] T020 [US2] Visual verify at 375px: open `/` → Releases tab → confirm title and artist are both fully visible on every visible release card.
- [x] T021 [US2] Visual verify at 320px: confirm same, and that play button + progress bar both fit without overflow.
- [x] T022 [US2] Audio verify: tap play on a release at 375px — confirm audio plays and the player UI responds correctly (waveform, pause button). Single-play rule still enforced (only one track plays at a time).

**Checkpoint**: SoundCloud player cards are fully usable on mobile — US2 independently testable.

---

## Phase 5: User Story 3 - Mobile Visitor Uses Downloads Page (Priority: P3)

**Goal**: `/downloads` renders without overflow, file tree is legible, and `/downloads/adrift-stash-kit` stacks cover art above description on narrow screens.

**Independent Test**: Open `/downloads` at 375px and 320px — no horizontal scroll, tree connectors readable. Open `/downloads/adrift-stash-kit` at 320px — image stacks above text, no overflow.

### Implementation for User Story 3

- [x] T023 [US3] In `src/app/downloads/page.tsx`, replace the outer container's `padding: "32px 40px 80px"` inline style with `className="px-4 sm:px-10 pt-8 pb-20"`.
- [x] T024 [US3] In `src/app/downloads/page.tsx`, find the tree connector elements (using `whiteSpace: "pre"` and `fontSize: "18px"`). Change font size to `className="text-sm sm:text-lg"` (14px mobile, 18px sm+). Apply the same change to folder header text (`className="text-sm sm:text-base"`) and item names.
- [x] T025 [US3] In `src/app/downloads/adrift-stash-kit/page.tsx`, replace the outer container's `padding: "32px 40px 80px"` inline style with `className="px-4 sm:px-10 pt-8 pb-20"`.
- [x] T026 [US3] In `src/app/downloads/adrift-stash-kit/page.tsx`, change the image + description flex row container from `style={{ display: "flex", gap: "32px" }}` to `className="flex flex-col sm:flex-row gap-4 sm:gap-8"` so it stacks vertically on mobile.
- [x] T027 [US3] In `src/app/downloads/adrift-stash-kit/page.tsx`, make the cover image responsive: replace the fixed `width={280}` with `className="w-full sm:w-[280px] object-cover shrink-0"` (full width on mobile, 280px on sm+). Ensure the `<Image>` `width` and `height` props remain for Next.js optimization but the rendered CSS width is overridden by the className.
- [x] T028 [US3] In `src/app/downloads/adrift-stash-kit/page.tsx`, ensure the page title `fontSize` and any other fixed sizes are reduced for mobile (e.g., title h1 from `28px` → `className="text-xl sm:text-3xl"`).
- [x] T029 [US3] Run `npm run build` to confirm zero TypeScript errors after downloads page changes.
- [x] T030 [US3] Visual verify `/downloads` at 375px and 320px: no horizontal scroll, tree connectors legible, file items not clipped.
- [x] T031 [US3] Visual verify `/downloads/adrift-stash-kit` at 320px: cover art is full-width on top, description text flows below, download button tappable.

**Checkpoint**: Downloads pages fully usable on mobile — US3 independently testable.

---

## Phase 6: User Story 4 - Mobile Visitor Uses Tools Page (Priority: P4)

**Goal**: `/tools` and `/tools/[slug]` render legibly on 320px–375px screens. File tree connectors are smaller on mobile, tool names are not clipped.

**Independent Test**: Open `/tools` at 375px — no horizontal scroll, tree connectors and tool names both readable. Open any `/tools/[slug]` — page renders without overflow.

### Implementation for User Story 4

- [x] T032 [US4] In `src/app/tools/page.tsx`, replace the outer container's `padding: "32px 40px 80px"` inline style with `className="px-4 sm:px-10 pt-8 pb-20"`.
- [x] T033 [US4] In `src/app/tools/page.tsx`, find the tree connector elements (using `whiteSpace: "pre"` and `fontSize: "18px"`). Change font size to `className="text-sm sm:text-lg"` (14px mobile, 18px sm+). Apply the same responsive sizing to folder header text and tool item names.
- [x] T034 [US4] In `src/app/tools/page.tsx`, ensure any `gap` values between connector and tool name are reduced on mobile (e.g., `gap-2 sm:gap-3`) so the tool name has maximum available width.
- [x] T035 [US4] In `src/app/tools/[slug]/page.tsx`, replace the outer container's `padding: "48px 40px 80px"` inline style with `className="px-4 sm:px-10 pt-10 sm:pt-12 pb-20"`.
- [x] T036 [US4] In `src/app/tools/[slug]/page.tsx`, fix the hero section padding: the current `padding: "32px 32px 40px 52px"` (52px left) will overflow on mobile. Replace with `className="px-4 sm:px-8 sm:pl-[52px] pt-8 pb-10"`.
- [x] T037 [US4] Run `npm run build` to confirm zero TypeScript errors after tools page changes.
- [x] T038 [US4] Visual verify `/tools` at 375px and 320px: no horizontal scroll, tree connector characters and tool names both readable on the same line.
- [x] T039 [US4] Visual verify `/tools/[slug]` at 375px: page renders cleanly, no overflow.

**Checkpoint**: Tools pages fully usable on mobile — US4 independently testable.

---

## Phase 7: Polish & Full QA

**Purpose**: Full cross-page QA pass to catch any remaining overflow or readability issues not addressed in individual story phases.

- [x] T040 [P] Full QA pass at 375px: visit `/`, `/tools`, `/tools/[any-slug]`, `/downloads`, `/downloads/adrift-stash-kit` — confirm no horizontal scrollbars on any page.
- [x] T041 [P] Full QA pass at 320px: same five pages — confirm no layout breakage, all text readable.
- [x] T042 [P] Desktop regression check at 960px+: all five pages still look correct at desktop width (no regressions from mobile-first class changes).
- [x] T043 [P] Intermediate width check at 480px: pages look acceptable at mid-range phone width.
- [ ] T044 Verify audio playback after ReleaseCard changes: play a release track, confirm waveform renders, pause works, single-play rule intact (playing a second track stops the first).
- [x] T045 Run final `npm run build` — confirm zero TypeScript errors across all modified files.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3 (US1)**: Depends on Phase 2 completion
- **Phase 4 (US2)**: Depends on Phase 2 completion — can run in parallel with US1 if desired (different files)
- **Phase 5 (US3)**: Depends on Phase 2 completion — can run in parallel with US1/US2 (different files)
- **Phase 6 (US4)**: Depends on Phase 2 completion — can run in parallel with all other stories (different files)
- **Phase 7 (Polish)**: Depends on all desired user story phases being complete

### User Story Dependencies

- **US1 (P1)**: No dependency on US2/US3/US4 — `page.tsx` and `SiteNav.tsx` are independent
- **US2 (P2)**: No dependency on US1/US3/US4 — `ReleaseCard.tsx` and `SoundCloudPlayer.tsx` are independent
- **US3 (P3)**: No dependency on US1/US2/US4 — `downloads/*.tsx` files are independent
- **US4 (P4)**: No dependency on US1/US2/US3 — `tools/*.tsx` files are independent

### Parallel Opportunities

- After Phase 2, all four user story phases touch different files and can run in parallel:
  - US1: `SiteNav.tsx`, `page.tsx`, `BeatCard.tsx`
  - US2: `ReleaseCard.tsx`, `SoundCloudPlayer.tsx`
  - US3: `downloads/page.tsx`, `downloads/adrift-stash-kit/page.tsx`
  - US4: `tools/page.tsx`, `tools/[slug]/page.tsx`

---

## Parallel Example: Post-Foundation

```bash
# After Phase 2 (globals.css) completes, all stories can proceed simultaneously:
Task US1: "Fix SiteNav.tsx two-row mobile layout"
Task US2: "Stack artist below title in ReleaseCard.tsx"
Task US3: "Fix downloads/adrift-stash-kit/page.tsx image stack"
Task US4: "Fix tools/page.tsx tree font sizes"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational globals.css (T003–T006) — **CRITICAL**
3. Complete Phase 3: User Story 1 — homepage + navbar (T007–T014)
4. **STOP and VALIDATE**: Browse homepage at 375px — does it look good?
5. If yes, this is already a shippable improvement for the most-visited page.

### Incremental Delivery

1. Phases 1–2 → Shared panel styles fixed
2. Phase 3 → Homepage + navbar work on mobile (biggest user impact)
3. Phase 4 → SoundCloud player readable (core music feature)
4. Phase 5 → Downloads page works (conversion flow)
5. Phase 6 → Tools page works (secondary content)
6. Phase 7 → QA pass + build verification

---

## Notes

- [P] tasks = can run in parallel (different files, no shared state dependencies)
- Mobile-first approach: base Tailwind class = mobile value; `sm:` prefix = ≥640px desktop value
- Run `npm run build` after each phase to catch TypeScript errors early
- The constitution requires visual verification at BOTH ≤680px AND ≥960px — do not skip the desktop regression check in Phase 7
- Admin pages (`/admin/*`, `/login`) are explicitly out of scope per spec assumptions
