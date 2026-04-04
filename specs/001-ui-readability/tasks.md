# Tasks: UI Readability & Spacing

**Input**: Design documents from `specs/001-ui-readability/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ quickstart.md ✅

**Tests**: Not requested. Gate is `npm run build` + manual visual review per quickstart.md.

**Organization**: Tasks grouped by user story. All stories are independent — no
foundational phase needed (pure inline style changes, no shared infrastructure).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: User Stories 1 & 2 — Readable Section Titles + Beat List Text (P1)

**Goal**: Upgrade section headings and beat row text to be clearly legible.
Both stories touch different files and can be implemented in parallel.

**Independent Test** (US1): Open homepage → "RELEASES" and "BEATS" headings are
visibly prominent, no numeric prefix, rendered in Orbitron bold.

**Independent Test** (US2): Open homepage → beat row titles read comfortably;
tag badges (e.g., "OSAMASON") are legible without zooming.

- [x] T001 [P] [US1] Remove "01 ·" prefix and upgrade heading to Orbitron 700 16px `#2A6094` in `src/components/ReleasesCatalog.tsx` (change `<p>` → `<h2>`, size 8px → 16px)
- [x] T002 [P] [US1] Remove "02 ·" prefix and upgrade heading to Orbitron 700 16px `#2A6094` in `src/components/BeatsCatalog.tsx` (change `<p>` → `<h2>`, size 8px → 16px); remove unused `mono` style constant if no longer referenced
- [x] T003 [P] [US2] Increase beat row title font size from 11px to 13px in `src/components/BeatCard.tsx` (`<h3>` inside `BeatRow`)
- [x] T004 [P] [US2] Increase beat row tag badge font size from 7px to 9px and letter-spacing from 1px to 1.5px in `src/components/BeatCard.tsx` (tag `<button>` elements inside `BeatRow`)

**Checkpoint**: Run `npm run build`. Open homepage at desktop width — confirm both
headings and beat list text are visibly improved before proceeding.

---

## Phase 2: User Story 3 — Remove Catalog Divider (P2)

**Goal**: Remove the "─── CATALOG ───" divider between hero and catalog grid.

**Independent Test**: Open homepage → catalog grid begins immediately after hero
panel with no divider or horizontal rule in between.

**Prerequisite**: Phase 1 complete (so visual result of removing divider is seen
in context of the improved headings).

- [x] T005 [US3] Remove `<Divider label="CATALOG" />` line from `src/app/page.tsx`; remove `Divider` import if it is no longer used in that file

**Checkpoint**: Confirm no divider appears between hero and catalog on homepage.

---

## Phase 3: Polish & Verification

**Purpose**: Build gate and cross-breakpoint visual verification.

- [x] T006 Run `npm run build` and confirm zero TypeScript errors
- [ ] T007 [P] Verify desktop layout (≥960px) per checklist in `specs/001-ui-readability/quickstart.md`
- [ ] T008 [P] Verify mobile layout (≤680px) per checklist in `specs/001-ui-readability/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (T001–T004)**: No dependencies — all 4 tasks touch different files, run in parallel
- **Phase 2 (T005)**: Depends on Phase 1 completion for meaningful visual context
- **Phase 3 (T006–T008)**: Depends on Phase 2 completion

### User Story Dependencies

- **US1 (T001, T002)**: Independent — no dependency on US2 or US3
- **US2 (T003, T004)**: Independent — no dependency on US1 or US3
- **US3 (T005)**: Can technically run independently, but recommended after Phase 1

### Parallel Opportunities

All Phase 1 tasks (T001, T002, T003, T004) touch different files with no shared
dependencies — they can all run simultaneously.

```bash
# All Phase 1 tasks in parallel:
Task T001: src/components/ReleasesCatalog.tsx
Task T002: src/components/BeatsCatalog.tsx
Task T003: src/components/BeatCard.tsx  ← title
Task T004: src/components/BeatCard.tsx  ← tags (same file as T003, sequence these two)
```

Note: T003 and T004 are both in `BeatCard.tsx` — sequence them within the same
editing pass rather than truly parallel.

---

## Implementation Strategy

### MVP (All stories are small — complete all in one pass)

1. Complete T001–T004 in parallel (Phase 1)
2. Complete T005 (Phase 2)
3. Run build + visual verification (Phase 3)
4. Commit

### Incremental if needed

1. T001 + T002 → verify headings → commit
2. T003 + T004 → verify beat list → commit
3. T005 → verify no divider → commit

---

## Notes

- No new files created — all tasks are inline style edits to existing components
- No data model or Supabase changes
- The `Divider` component itself (`src/components/Divider.tsx`) is NOT deleted —
  it may be used elsewhere in the future. Only the call site in `page.tsx` is removed.
- Hero banner decorative text (data readouts, code column) is explicitly out of scope
