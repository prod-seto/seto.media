# Tasks: Beats List Redesign

**Input**: Design documents from `specs/002-beats-list-redesign/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ quickstart.md ✅

**Tests**: Not requested. Gate is `npm run build` + manual visual review per quickstart.md.

**Organization**: All 3 user stories are P1 and tightly coupled (same two files, single
integrated panel design). US1 targets `BeatsCatalog.tsx`; US2 and US3 both target
`BeatCard.tsx` (same file, sequential within Phase 3). A shared foundational phase
removes the `isFirst` prop — a prerequisite for all three stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Foundational — Remove isFirst Prop

**Purpose**: The `isFirst` prop is a layout hack that causes the first beat row to
be taller than all others (20px top padding vs 10px). Removing it is a prerequisite
for US1 (the bracket must move to the filter header) and US2 (uniform row height is
a specified requirement). Both files must be updated together to avoid a TypeScript
error from passing a removed prop.

**Independent Test**: After these tasks, `npm run build` passes with zero TS errors.
No visual change is expected yet (BeatsCatalog still uses a separate filter div).

- [x] T001 Remove `isFirst` prop from `<BeatRow>` usage in `src/components/BeatsCatalog.tsx` (remove `isFirst={index === 0}` from the JSX call site)
- [x] T002 Remove `isFirst` from the `BeatRow` props interface and replace the conditional padding `${isFirst ? 20 : 10}px 14px` with uniform `10px 14px` in `src/components/BeatCard.tsx`

**Checkpoint**: Run `npm run build` — should pass. First row still looks slightly off
(filter still outside the panel) — that is resolved in Phase 2.

---

## Phase 2: User Story 1 — Scalable Tag Filter Bar (Priority: P1)

**Goal**: Merge the filter bar and the tracklist into a single `ghost-panel`. The
corner bracket lands in the filter header zone (not over a play button). The filter
accommodates 20+ tags via `flex-wrap`.

**Independent Test**: Open homepage → beats section is one unified panel with a "FILTER"
label top-left, tags wrapping naturally in the header, a 1px divider between header and
rows, and the corner bracket visible in the top-left corner of the filter area (not
overlapping the first play button).

- [x] T003 [US1] Restructure `src/components/BeatsCatalog.tsx` to render the entire beats section as a single `ghost-panel` with: a filter header zone (`padding: 10px 14px`, `borderBottom: "1px solid rgba(90,158,212,0.20)"`) containing a "FILTER" label (Share Tech Mono 8px `#5A8AAA`), `flex-wrap` tag buttons, and the `× CLEAR` button right-aligned; followed by beat rows rendered directly inside the panel with no wrapper gap

**Checkpoint**: Open homepage — confirm a single unified panel, FILTER label visible,
tags wrap on resize, corner bracket in filter area, not over the first play button,
divider line between filter and first row.

---

## Phase 3: User Stories 2 & 3 — Scalable Per-Row Tags + Readable BPM/Key (Priority: P1)

**Goal (US2)**: Each beat row displays its tags on a dedicated wrapping line below the
title, indented to align with the title. Any number of tags renders without overflow.

**Goal (US3)**: BPM and key are displayed on their own dedicated line at Share Tech
Mono 11px, indented to align with the title — clearly readable at a glance.

**Independent Test**: Open homepage → each beat row shows 3 lines (title / BPM·key /
tags). Tags wrap if there are many. BPM and key are noticeably larger and easier to
read than before. All rows are the same height in their resting state.

> US2 and US3 both change `src/components/BeatCard.tsx` — run T004 then T005 in the
> same editing session. T004 and T003 (Phase 2) are in different files → can be run
> in parallel with Phase 2 if both files are edited simultaneously.

- [x] T004 [US2] In `src/components/BeatCard.tsx` `BeatRow`, replace the single-line flex row (play + title + tags + meta in one `div`) with a vertically stacked layout: Line 1 is `[play button] [title]` in a flex row; Line 3 is tags rendered in a `display: flex, flexWrap: wrap, gap: 4px` div with `paddingLeft` of ~38px (matching play button width) to indent level with title; tags line renders only if `beat.tags.length > 0`
- [x] T005 [US3] In `src/components/BeatCard.tsx` `BeatRow`, add Line 2 between the title line and the tags line: render BPM/key `meta` string in Share Tech Mono 11px `#5A8AAA` uppercase with the same `paddingLeft` indent as the tags line and `marginBottom: 4px`; render Line 2 only if at least one of `beat.bpm` or `beat.key` is non-null (remove the old inline `<span>` for meta)

**Checkpoint**: Open homepage — 3-line rows visible. BPM and key are clearly readable.
Tags wrap for any beat. All rows identical height at rest. Playing a beat shows
visualizer + progress below the tags line.

---

## Phase 4: Polish & Verification

**Purpose**: Build gate and cross-breakpoint visual verification.

- [x] T006 Run `npm run build` and confirm zero TypeScript errors
- [x] T007 [P] Verify desktop layout (≥960px) per checklist in `specs/002-beats-list-redesign/quickstart.md` — filter zone, row heights, BPM readability, tag click behaviour, playing state, empty state
- [x] T008 [P] Verify mobile layout (≤680px) per checklist in `specs/002-beats-list-redesign/quickstart.md` — filter tags wrap, beat rows readable, play/pause functional

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (T001–T002)**: No dependencies — run immediately; must complete before Phases 2 and 3
- **Phase 2 (T003)**: Depends on Phase 1 (isFirst removed from call site)
- **Phase 3 (T004–T005)**: Depends on Phase 1 (isFirst removed from interface); T004 precedes T005 (same file)
- **Phase 4 (T006–T008)**: Depends on Phases 2 and 3

### User Story Dependencies

- **US1 (T003)**: Depends on T001 only
- **US2 (T004)**: Depends on T002 only
- **US3 (T005)**: Depends on T004 (same file, same editing pass)

### Parallel Opportunities

```bash
# After Phase 1 completes, Phases 2 and 3 can run in parallel:
Phase 2: src/components/BeatsCatalog.tsx  ← T003
Phase 3: src/components/BeatCard.tsx      ← T004, T005

# Within Phase 3, T004 and T005 are sequential (same file):
T004 first: restructure row → 3 lines (title / placeholder / tags)
T005 second: fill in Line 2 (BPM/key) with correct typography

# Phase 4 T007 and T008 are parallel (independent viewports):
T007: desktop verification
T008: mobile verification
```

---

## Implementation Strategy

### MVP (all stories are small — complete all in one pass)

1. Complete T001–T002 in parallel (Phase 1)
2. Complete T003 and T004 in parallel (different files)
3. Complete T005 (same file as T004, immediately after)
4. Run build + visual verification (Phase 4)
5. Commit

### Incremental if needed

1. T001 + T002 → verify build → proceed
2. T003 → verify filter zone visually → proceed
3. T004 + T005 → verify rows visually → proceed
4. Build + full visual verification → commit

---

## Notes

- No new files created — all tasks are layout/typography edits to two existing components
- No CSS changes — the `ghost-panel` class already handles border, background, and corner brackets
- No data model or Supabase changes
- Audio playback logic in `BeatCard.tsx` (AudioContext, RAF loop, canvas, progress bar)
  is untouched — only the JSX layout structure changes
- `tracklist-panel` class in `globals.css` was added by a prior fix attempt but is not
  used; it is NOT referenced here and can be cleaned up in a future pass
