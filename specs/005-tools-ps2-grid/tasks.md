# Tasks: Producer Tools — PS2 Disk Grid

**Input**: Design documents from `/specs/005-tools-ps2-grid/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — `npm run build` + manual verification per quickstart.md is the gate.

---

## Phase 1: Setup (Schema + Types + Fonts)

**Purpose**: Establish the database schema, TypeScript types, and PS2-era fonts before any UI
or Server Action code is written. All three must be in place for the build to pass.

**⚠️ CRITICAL**: T001 requires manual Supabase dashboard access and cannot be automated.

- [x] T001 Run CREATE TABLE + RLS + seed SQL in Supabase SQL Editor per `specs/005-tools-ps2-grid/quickstart.md` (tools table, idx_tools_slug, two policies, three seed rows)
- [x] T002 Manually add `tools` table to `src/lib/database.types.ts` — add Row, Insert, Update types per `specs/005-tools-ps2-grid/data-model.md` (or run `npm run db:types` if Supabase CLI available)
- [x] T003 Add Turret Road, Chakra Petch, and Teko fonts to `src/app/layout.tsx` — import from `next/font/google`, assign CSS variables `--font-turret-road`, `--font-chakra-petch`, `--font-teko`, add to `<body>` className alongside existing font variables

**Checkpoint**: TypeScript compiles cleanly — `database.types.ts` has the `tools` table and the three new CSS font variables are available in the DOM.

---

## Phase 2: Foundational (Shared Components + Server Action)

**Purpose**: `DiskCard` is used by US1 (public grid). `tools.ts` Server Action is used by US2
(admin edit). `globals.css` disk styles underpin both. All must exist before the feature pages
can be written. T004 and T005 touch different files and can run in parallel.

**⚠️ CRITICAL**: No story page code can be written until these exist.

- [x] T004 [P] Create `src/components/DiskCard.tsx` — receives `{ tool: Tables<"tools"> }` prop; renders outer `.disk-wrapper` link to `/tools/{tool.slug}`; inner `.disk-face` with conic-gradient iridescent sheen, `clip-path: circle(50%)`; layered `<img>` for `disk_image_url` (falls back to gradient placeholder if null); `.disk-hub` center circle; `.disk-label` below disk with `fontFamily` resolved from `fontVars` mapping (`turret-road` → `var(--font-turret-road)` etc.) and `color` from `tool.disk_font_color`
- [x] T005 [P] Create `src/app/actions/tools.ts` — `'use server'`; export `updateToolDisk(toolId: string, data: { disk_image_url?: string | null; disk_font?: string; disk_font_color?: string; name?: string; is_visible?: boolean }): Promise<{ success: boolean; error?: string }>`; verify owner via `createSupabaseServerClient()` + `getUser()` + `ADMIN_EMAIL` check; run `supabase.from("tools").update(data).eq("id", toolId)`
- [x] T006 Add disk CSS classes to `src/app/globals.css` — `.disk-wrapper` (position relative, cursor pointer, text-decoration none), `.disk-face` (aspect-ratio 1, clip-path circle 50%, position relative, conic-gradient background in blue-teal palette, overflow hidden), `.disk-artwork` (absolute inset-0, width/height 100%, object-fit cover, opacity 0.85, mix-blend-mode multiply), `.disk-hub` (absolute centered, ~18% width/height, clip-path circle 50%, background rgba(255,255,255,0.55), border 1px solid rgba(90,158,212,0.40)), `.disk-label` (margin-top 12px, font-size 11px, letter-spacing 2px, text-transform uppercase, text-align center, color inherits from inline style)

**Checkpoint**: DiskCard compiles without TypeScript errors. Build passes. Disk CSS classes are in place.

---

## Phase 3: User Story 1 — Tools Grid + Routing (Priority: P1) 🎯 MVP

**Goal**: Public `/tools` page shows 3 disks in a grid; clicking any disk navigates to that
tool's placeholder page at `/tools/[slug]`.

**Independent Test**: Navigate to `/tools`, confirm 3 disks render in a 3-column grid. Click
ISOtone disk, confirm navigation to `/tools/isotone` with heading "ISOtone". Repeat for other
two tools.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create `src/app/tools/page.tsx` — async Server Component; query `supabase.from("tools").select("*").eq("is_visible", true).order("sort_order", { ascending: true })`; render 3-column grid (`display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px`) of `<DiskCard>` components; include ghost-panel wrapper, section heading "PRODUCER TOOLS" in Orbitron, empty state if no tools; responsive: 2 columns at ≤680px, 1 column at ≤440px via CSS
- [x] T008 [P] [US1] Create `src/app/tools/[slug]/page.tsx` — async Server Component; query `supabase.from("tools").select("*").eq("slug", params.slug).single()`; render tool name as Orbitron heading, `tool.description` as body text, "← TOOLS" back link to `/tools`; return 404 (notFound()) if no row found
- [x] T009 [US1] Update `src/app/page.tsx` — add a TOOLS section below the existing `<HomeCatalog>` block: a `<Divider label="TOOLS" />` followed by a `ghost-panel` link card pointing to `/tools` with label "VIEW PRODUCER TOOLS →" in Share Tech Mono style

**Checkpoint**: US1 fully functional — grid renders, all three disks clickable, each tool page shows correct name, empty state works, mobile layout adapts.

---

## Phase 4: User Story 2 — Admin Disk Customization (Priority: P2)

**Goal**: Admin can edit each tool's disk image, font, and color from `/admin/tools` → `/admin/tools/[id]/edit`, with changes reflected on `/tools` after one reload.

**Independent Test**: Sign in, navigate to `/admin/tools`, click EDIT for ISOtone, change disk font to Chakra Petch and save, navigate to `/tools` and confirm ISOtone disk label now uses Chakra Petch.

### Implementation for User Story 2

- [x] T010 [P] [US2] Create `src/app/admin/tools/page.tsx` — `'use client'`; on mount fetch all tools (all rows, no `is_visible` filter) via `supabaseBrowser`; render list of tool rows in `ghost-panel`, each showing tool name + current disk font + EDIT link to `/admin/tools/{id}/edit`; include `useEffect` auth check redirecting to `/login` if no user; include "← ADMIN" back link
- [x] T011 [P] [US2] Create `src/app/admin/tools/[id]/edit/page.tsx` — `'use client'`; on mount fetch the specific tool by id via `supabaseBrowser`; render edit form with: text input for `name`, URL text input for `disk_image_url`, `<select>` for `disk_font` (options: turret-road / chakra-petch / teko with display labels "Turret Road" / "Chakra Petch" / "Teko"), `<input type="color">` for `disk_font_color` with hex text input fallback, `is_visible` checkbox; on submit call `updateToolDisk(id, formData)` via `useActionState`; show success confirmation or error; include live disk preview using `DiskCard` styled with current form values
- [x] T012 [US2] Update `src/app/admin/page.tsx` — add "MANAGE TOOLS" link to `/admin/tools` alongside existing "+ NEW RELEASE" and "+ NEW BEAT" links, using identical `tag` className and styling

**Checkpoint**: US2 fully functional — admin can edit all three disk fields, changes persist to Supabase, public tools page reflects changes on reload.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Responsive grid breakpoints for tools, build gate.

- [x] T013 Add responsive grid breakpoints for `.tools-grid` to `src/app/globals.css` — 3 columns at ≥681px, 2 columns at ≤680px, 1 column at ≤440px; ensure disk aspect-ratio is preserved at all breakpoints
- [x] T014 Run `npm run build` — verify zero TypeScript errors; confirm all new routes present: `/tools`, `/tools/[slug]` (isotone, mosaic, midiripper), `/admin/tools`, `/admin/tools/[id]/edit`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 must be done in Supabase dashboard first; T002 and T003 can run in parallel after T001
- **Foundational (Phase 2)**: Depends on T002 (types) and T003 (fonts); T004, T005, T006 can all run in parallel
- **US1 (Phase 3)**: Depends on T004 (DiskCard) and T006 (disk CSS); T007, T008, T009 can run in parallel
- **US2 (Phase 4)**: Depends on T005 (Server Action) and T004 (DiskCard for preview); T010, T011 can run in parallel; T012 is independent
- **Polish (Phase 5)**: T013 can run any time after Phase 2; T014 must be last

### Critical Path

```
T001 (Supabase) → T002 + T003 → T004 + T005 + T006 → T007 + T008 + T009 → T010 + T011 + T012 → T013 → T014
```

### Parallel Opportunities

- T002 + T003 (types and fonts, different files)
- T004 + T005 + T006 (DiskCard, Server Action, CSS — all different files)
- T007 + T008 + T009 (tools page, slug page, homepage link — all different files)
- T010 + T011 + T012 (admin tools list, admin edit page, admin dashboard link — all different files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001–T003)
2. Complete Phase 2 (T004–T006, skip T005 for MVP)
3. Complete Phase 3 (T007–T009)
4. **STOP and VALIDATE**: Three disk cards visible at `/tools`, all routing works, mobile layout correct
5. Deploy if ready

### Full Delivery

1. Setup (Phase 1) → T001, then T002 + T003 in parallel
2. Foundational (Phase 2) → T004 + T005 + T006 in parallel
3. US1 (Phase 3) → T007 + T008 + T009 in parallel
4. US2 (Phase 4) → T010 + T011 + T012 in parallel
5. Polish (Phase 5) → T013, then T014 build gate

---

## Notes

- T001 requires manual Supabase dashboard access; cannot be run from code
- T002 can be replaced by `npm run db:types` if Supabase CLI is available and authenticated
- `DiskCard` receives `Tables<"tools">` directly — no intermediate type needed
- The live disk preview in T011 (admin edit page) is a `<DiskCard>` with `tool` prop assembled from current form state — no extra component required
- Total: 14 tasks across 5 phases; 10 parallel opportunities
