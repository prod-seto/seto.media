# Tasks: SoundCloud Autofill & Catalog Ordering

**Input**: Design documents from `/specs/004-soundcloud-autofill-ordering/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — `npm run build` is the gate per constitution.

---

## Phase 1: Setup (Schema Migration + TypeScript Types)

**Purpose**: Extend the database schema and update TypeScript types before any code is written.
The sort_order column is required by US2 and US3; the type update is required for the build to pass.

**⚠️ CRITICAL**: The Supabase SQL steps (T001) must be done manually in the Supabase dashboard
before T002 or any user story work begins.

- [x] T001 Run schema migration in Supabase SQL Editor — `ALTER TABLE releases ADD COLUMN sort_order integer NOT NULL DEFAULT 0` and `ALTER TABLE beats ADD COLUMN sort_order integer NOT NULL DEFAULT 0` (and optional initial sort_order backfill from quickstart.md)
- [x] T002 Manually add sort_order to `src/lib/database.types.ts` — add `sort_order: number` to Row, `sort_order?: number` to Insert and Update for both `releases` and `beats` tables (or run `npm run db:types` if Supabase CLI available)

**Checkpoint**: `database.types.ts` includes `sort_order` for both tables — TypeScript will compile cleanly.

---

## Phase 2: Foundational (Server Actions)

**Purpose**: The two Server Action files are shared prerequisites — soundcloud.ts is needed by
US1; ordering.ts is needed by US2 and US3. Both can be created in parallel.

**⚠️ CRITICAL**: No user story UI work can begin until these Server Actions exist.

- [x] T003 [P] Create `src/actions/soundcloud.ts` — `'use server'` file exporting `fetchSoundCloudMetadata(url: string): Promise<{ title?: string; artist?: string; coverUrl?: string; error?: string }>` that calls `https://soundcloud.com/oembed?format=json&url={encodedUrl}`, returns error strings for non-200 responses and non-track URLs (playlist/profile), returns `{ title, artist, coverUrl }` on success
- [x] T004 [P] Create `src/actions/ordering.ts` — `'use server'` file exporting `updateReleasesOrder(ids: string[]): Promise<{ success: boolean; error?: string }>` and `updateBeatsOrder(ids: string[]): Promise<{ success: boolean; error?: string }>` — each verifies owner session via `createSupabaseServerClient()` + `getUser()`, then runs individual `UPDATE releases/beats SET sort_order = (i + 1) WHERE id = ids[i]` for each position

**Checkpoint**: Both Server Action files compile cleanly with no TypeScript errors.

---

## Phase 3: User Story 1 — SoundCloud Autofill (Priority: P1) 🎯 MVP

**Goal**: Admin pastes a SoundCloud URL, clicks "Fetch Metadata", and the title/artist/cover
fields autofill. All fields remain editable before submit.

**Independent Test**: Navigate to `/admin/releases/new`. Paste a valid public SoundCloud track
URL. Click "Fetch Metadata". Confirm title and artist populate. Edit one field. Submit. Confirm
release saved with the edited value on the homepage.

### Implementation for User Story 1

- [x] T005 [US1] Modify `src/app/admin/releases/new/page.tsx` — add a URL input section above the existing form fields; add "Fetch Metadata" button that calls `fetchSoundCloudMetadata` from `src/actions/soundcloud.ts` via `startTransition`; add `isPending` loading state on the button during the fetch; on success populate `title`, `artist`, and `cover_url` form field state; on error display an inline message below the URL field; all fields remain editable regardless of autofill result

**Checkpoint**: US1 fully functional — autofill populates fields from a real SoundCloud URL,
error state shows for invalid URLs, manual override works, existing `createRelease` submit flow
is unaffected.

---

## Phase 4: User Story 2 — Reorder Releases (Priority: P2)

**Goal**: Admin visits `/admin/releases/order`, uses ↑/↓ buttons to rearrange releases, clicks
"Save Order", and the homepage reflects the new order on next load.

**Independent Test**: Navigate to `/admin/releases/order`. Move one release to a new position.
Click "Save Order". Navigate to homepage. Confirm releases appear in the saved order.

### Implementation for User Story 2

- [x] T006 [US2] Create `src/app/admin/releases/order/page.tsx` — `'use client'` component; on mount fetch all releases (visible + hidden) ordered by `sort_order ASC` from Supabase using `supabaseBrowser`; render each release as a row with title, artist, and ↑/↓ buttons; ↑/↓ buttons splice the local array state (no server call); "Save Order" button calls `updateReleasesOrder(ids)` from `src/actions/ordering.ts`; show inline success confirmation or error message after save; disable buttons during save

**Checkpoint**: US2 fully functional — reordering persists to Supabase and is visible on the
homepage after reload.

---

## Phase 5: User Story 3 — Reorder Beats (Priority: P2)

**Goal**: Admin visits `/admin/beats/order`, uses ↑/↓ buttons to rearrange beats, clicks
"Save Order", and the homepage reflects the new order on next load. Tag filtering in BeatsCatalog
remains unaffected.

**Independent Test**: Navigate to `/admin/beats/order`. Move one beat to a new position. Click
"Save Order". Navigate to homepage. Confirm beats appear in the saved order. Verify tag filtering
still works correctly within the new order.

### Implementation for User Story 3

- [x] T007 [US3] Create `src/app/admin/beats/order/page.tsx` — same pattern as T006 but for beats; fetch all beats ordered by `sort_order ASC`; render title + ↑/↓ buttons; "Save Order" calls `updateBeatsOrder(ids)`; same loading/success/error UI treatment as the releases ordering page

**Checkpoint**: US3 fully functional — beat reordering persists, homepage reflects new order,
tag filtering still works (it filters the already-ordered array).

---

## Phase 6: Polish & Integration

**Purpose**: Wire the ordering into the homepage queries and admin dashboard; run the build gate.
T008 and T009 touch different files and can be done in parallel.

- [x] T008 [P] Update `src/app/page.tsx` — change the releases query from `.order("released_at", { ascending: false }).order("created_at", { ascending: false })` to `.order("sort_order", { ascending: true })`; change the beats query from `.order("created_at", { ascending: false })` to `.order("sort_order", { ascending: true })`
- [x] T009 [P] Update `src/app/admin/page.tsx` — add two new links alongside the existing ones: "REORDER RELEASES" → `/admin/releases/order` and "REORDER BEATS" → `/admin/beats/order`, using the same styling pattern as the existing admin nav links
- [x] T010 Run `npm run build` — verify zero TypeScript errors and all routes present; resolve any type errors before marking complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 must be done in Supabase dashboard first; T002 follows immediately
- **Foundational (Phase 2)**: Depends on T002 (types must exist); T003 and T004 can run in parallel
- **US1 (Phase 3)**: Depends on T003 (soundcloud.ts) — can start as soon as T003 is done
- **US2 (Phase 4)**: Depends on T004 (ordering.ts) and T002 (sort_order in types)
- **US3 (Phase 5)**: Depends on T004 (ordering.ts) and T002 (sort_order in types); US2 and US3 can run in parallel
- **Polish (Phase 6)**: T008/T009 can run in parallel once all user stories are done; T010 must be last

### Critical Path

```
T001 (Supabase) → T002 (types) → T003 + T004 (parallel) → T005 + T006 + T007 (parallel) → T008 + T009 (parallel) → T010 (build)
```

### Parallel Opportunities

- T003 and T004 (both Server Actions, separate files)
- T006 and T007 (both ordering pages, separate files)
- T008 and T009 (homepage and admin dashboard, separate files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Schema migration + types
2. Complete Phase 2: Server Actions (T003 only strictly needed for US1, but T004 is fast)
3. Complete Phase 3: US1 autofill
4. **STOP and VALIDATE**: Test autofill with a real SoundCloud URL

### Full Delivery

1. Setup (Phase 1) → both T001 and T002
2. Foundational (Phase 2) → T003 + T004 in parallel
3. US1 (Phase 3) → T005
4. US2 + US3 (Phases 4–5) → T006 + T007 in parallel
5. Polish (Phase 6) → T008 + T009 in parallel, then T010 build gate

---

## Notes

- No new npm dependencies — Server Actions, React `useTransition`/`startTransition`, and array state are sufficient
- T001 requires manual Supabase dashboard access; it cannot be automated from code
- T002 can be replaced by `npm run db:types` if the Supabase CLI is available and authenticated
- The oEmbed fetch (T003) must be server-side — browser calls to soundcloud.com/oembed are CORS-blocked
- BeatsCatalog tag filtering is unaffected by T008 — it filters the already-sorted array returned by the query
- Total: 10 tasks across 6 phases; estimated 3 parallel execution opportunities
