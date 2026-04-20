# Tasks: Tools Page Redesign + Site Navbar

**Input**: Design documents from `/specs/008-tools-page-redesign/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/components.md ✅

**Tests**: No automated tests — constitution III requires `npm run build` gate + manual visual review only.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete siblings)
- **[Story]**: Maps to user story from spec.md (US1–US4)

---

## Phase 1: Setup

**Purpose**: Verify environment assumptions before touching production code.

- [x] T001 [P] Read `src/lib/database.types.ts` and confirm `game_subtitle` exists as a nullable text column on the `tools` table row type
- [x] T002 [P] Grep `src/` for all imports of `DiskCard` and list files found — determines which admin files must be preserved and which public imports are being replaced

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: CSS grid update that both US1 (ToolCard grid) and US4 (mobile layout) depend on.

**⚠️ CRITICAL**: Complete before US1 and US4 work begins.

- [x] T003 Update `.tools-grid` breakpoints in `src/app/globals.css` — change the two media queries so the grid is 3 columns above 768px, 2 columns at ≤768px (gap: 20px), and 1 column at ≤680px

**Checkpoint**: CSS grid now matches the clarified 3/2/1 breakpoints. US1 and US4 can begin.

---

## Phase 3: User Story 1 — Browse Tools List (Priority: P1) 🎯 MVP

**Goal**: Replace the PS2 disc grid with a ghost-panel `ToolCard` grid on `/tools`. Every tool renders correctly with only `name`, `slug`, and `is_visible` populated.

**Independent Test**: Navigate to `/tools` — 3+ tool cards visible in a 3-column grid, all styled as ghost-panels with Orbitron name, no disc elements, no broken images.

- [x] T004 [US1] Create `src/components/ToolCard.tsx` — server-renderable component; accepts `tool: Tables<"tools">`; renders a `<Link href={/tools/${tool.slug}}>` wrapping a `ghost-panel` div; inside: Share Tech Mono label line ("PRODUCER TOOL"), Orbitron tool name (`#2A6094`, uppercase, bold), optional Exo 2 italic tagline from `game_subtitle` (omit if null), optional 64×64 thumbnail from `disk_image_url` (omit if null); 0px border radius everywhere; no disc-specific markup
- [x] T005 [US1] Update `src/app/tools/page.tsx` — remove `DiskCard` import and usage; import and use `ToolCard` instead; remove the separate ghost-panel header block (the `<div className="ghost-panel">` with the PRODUCER TOOLS label and h1); replace with a simple inline section label using Share Tech Mono (the navbar now provides site identity); wrap the tool list in `<div className="tools-grid">`

**Checkpoint**: `/tools` shows ghost-panel tool cards in the updated grid. `DiskCard` is gone from the public tools page. `npm run build` passes.

---

## Phase 4: User Story 2 — Site-Wide Navigation (Priority: P1)

**Goal**: Slim `SiteNav` bar with SETO.MEDIA wordmark (left) and HOME/TOOLS links (right) appears on every public page. Homepage hero panel and TOOLS teaser are removed.

**Independent Test**: Visit `/`, `/tools`, and `/tools/[any-slug]` — SiteNav is at the top of all three. Active link is visually distinguished. Old hero panel and tools teaser are gone from the homepage.

- [x] T006 [US2] Create `src/components/SiteNav.tsx` — `"use client"` component; imports `usePathname` from `next/navigation` and `Link` from `next/link`; renders a `ghost-panel` bar (flex, space-between, `max-width: 960px`, `margin: 0 auto`, `padding: 16px 40px`); left side: SETO<span style teal>.MEDIA</span> wordmark in Orbitron 700 linking to `/`; right side: HOME and TOOLS links in Share Tech Mono uppercase, `#5A8AAA` inactive, `#2A6094` active; active detection: exact match `pathname === "/"` for HOME, `pathname.startsWith("/tools")` for TOOLS; no data-readout line; 0px border radius
- [x] T007 [P] [US2] Update `src/app/layout.tsx` — import `SiteNav` and render `<SiteNav />` inside `<body>` above the `{children}` slot; wrap in a `<div>` or pass through directly — keep existing font variable classes and metadata unchanged
- [x] T008 [P] [US2] Update `src/app/page.tsx` — remove the entire `<header className="hero-panel">` block; remove `<Divider label="TOOLS" />` and the "VIEW TOOLS →" ghost-panel `<Link>` block below it; keep `<Divider label="CATALOG" />` and `<HomeCatalog />` intact

**Checkpoint**: Homepage shows SiteNav at top, catalog below, no hero, no tools teaser. Tools page shows same SiteNav. `npm run build` passes.

---

## Phase 5: User Story 3 — Click Through to a Tool (Priority: P2)

**Goal**: Verify that clicking a `ToolCard` routes to a valid `/tools/[slug]` page.

**Independent Test**: Click each tool card — browser routes to `/tools/[slug]` without a 404. Page renders the tool name at minimum.

- [x] T009 [US3] Read `src/app/tools/[slug]/page.tsx` and confirm it queries the `tools` table by `slug`, handles the not-found case (returns 404 or redirects), and renders the tool `name` — no code changes needed unless the file is broken or missing

**Checkpoint**: All tool card links resolve to working detail pages.

---

## Phase 6: User Story 4 — Mobile Layout (Priority: P3)

**Goal**: All pages render without horizontal overflow or broken alignment at 375px. SiteNav readable at all widths.

**Independent Test**: Open browser DevTools → 375px viewport → visit `/` and `/tools` — single column stack, no scroll, navbar fully readable.

- [ ] T010 [P] [US4] Visual review: open `http://localhost:3000/tools` at 375px — confirm cards stack single-column, no horizontal scroll, `ghost-panel` cards full width
- [ ] T011 [P] [US4] Visual review: open `http://localhost:3000` at 375px — confirm SiteNav wordmark and links fit without overflow, catalog remains single-column with tab switcher
- [ ] T012 [P] [US4] Visual review: resize from 375px → 768px → 960px on `/tools` — confirm grid transitions from 1 → 2 → 3 columns at correct breakpoints

**Checkpoint**: All viewports verified. No layout regressions.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Build gate, final desktop verification, and cleanup.

- [x] T013 Run `npm run build` from repo root — fix any TypeScript errors before marking this phase complete; check for unused imports (`DiskCard`, removed variables from page.tsx edits)
- [ ] T014 [P] Visual review at desktop (≥960px): `/tools` shows 3-column grid of ghost-panel cards, SiteNav is slim and aligned, no disc elements visible; `/` shows SiteNav + CATALOG section only (no hero, no tools teaser)
- [x] T015 [P] Confirm `DiskCard.tsx` is not imported in `src/app/tools/page.tsx` or `src/app/layout.tsx` — if `DiskCard` is still referenced only in admin pages (`src/app/admin/`), leave the file in place; if unreferenced anywhere, delete it

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — run T001 and T002 in parallel immediately
- **Foundational (Phase 2)**: No dependency on Phase 1 results — T003 can start immediately
- **US1 (Phase 3)**: Depends on T003 (grid CSS) — start after T003
- **US2 (Phase 4)**: No dependency on US1 — can start as soon as Phase 1 confirms the layout.tsx structure
- **US3 (Phase 5)**: Depends on US1 (T005 must be done so ToolCard links are in place)
- **US4 (Phase 6)**: Depends on US1 + US2 complete (both page changes + navbar needed to review mobile)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Can start after T003
- **US2 (P1)**: Can start immediately (parallel with US1 — touches different files)
- **US3 (P2)**: Depends on US1 completion (T004, T005)
- **US4 (P3)**: Depends on US1 + US2 completion

### Within Each Story

- T004 before T005 (must have ToolCard component before referencing it in page.tsx)
- T006 before T007/T008 (must have SiteNav before adding it to layout.tsx)
- T007 and T008 can run in parallel (different files, no shared dependency)
- T010, T011, T012 all run in parallel (different pages/viewports)
- T014, T015 run in parallel (different concerns)

### Parallel Opportunities

```bash
# Phase 1 — run together:
T001: Read database.types.ts for game_subtitle
T002: Grep DiskCard imports

# Phase 3+4 can overlap — different files:
T004: Create ToolCard.tsx
T006: Create SiteNav.tsx

# Phase 4 after T006:
T007: Update layout.tsx       (parallel)
T008: Update page.tsx         (parallel)

# Phase 6 — all visual reviews together:
T010: /tools at 375px
T011: / at 375px
T012: /tools breakpoint sweep
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1 + Phase 2 (setup + CSS grid)
2. Complete Phase 3 (US1 — ToolCard + tools page)
3. Complete Phase 4 (US2 — SiteNav + layout + homepage cleanup)
4. Run `npm run build` — fix TypeScript errors
5. **STOP and VALIDATE**: Visit `/tools` and `/` in browser at desktop width
6. Deploy if validated

### Incremental Delivery

1. T003 → CSS grid ready
2. T004 + T005 → Tools page redesigned (US1 MVP)
3. T006 + T007 + T008 → Navbar live, homepage cleaned up (US2)
4. T009 → Click-through verified (US3)
5. T010–T012 → Mobile confirmed (US4)
6. T013–T015 → Build passes, desktop verified, cleanup done

---

## Notes

- No schema changes — `game_subtitle` and `disk_image_url` already exist; just consume them differently
- Constitution II: 0px border radius everywhere, no drop shadows, ghost-panel class required
- Constitution I: `SiteNav` is "use client" (needs `usePathname`); `ToolCard` is server-renderable (no hooks) — keep the boundary clean
- `DiskCard.tsx` stays on disk until T015 confirms it is safe to delete
- Visual review at both desktop and mobile is required by Constitution III before any merge
