# Quickstart: SoundCloud Autofill & Catalog Ordering Verification

**Branch**: `004-soundcloud-autofill-ordering`
**Gate**: `npm run build` + manual verification

---

## One-time Supabase setup (before running locally)

### 1. Run schema migration (SQL Editor)

```sql
-- Add sort_order to releases
ALTER TABLE releases ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Add sort_order to beats
ALTER TABLE beats ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
```

### 2. (Recommended) Set initial sort_order from current display order

```sql
-- Releases: preserve current released_at DESC order
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY released_at DESC NULLS LAST, created_at DESC) AS rn
  FROM releases
)
UPDATE releases SET sort_order = ranked.rn
FROM ranked WHERE releases.id = ranked.id;

-- Beats: preserve current created_at DESC order
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM beats
)
UPDATE beats SET sort_order = ranked.rn
FROM ranked WHERE beats.id = ranked.id;
```

### 3. Regenerate TypeScript types

```bash
npm run db:types
```

Verify `src/lib/database.types.ts` now includes `sort_order: number` in the Row
types for both `releases` and `beats`.

---

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## US1 — SoundCloud autofill verification

- [ ] Sign in, navigate to `/admin/releases/new`
- [ ] Paste a valid public SoundCloud track URL into the URL field and click "Fetch Metadata"
- [ ] Confirm the title and artist fields populate automatically
- [ ] Confirm cover URL field populates if the track has artwork
- [ ] Edit one autofilled field (e.g., change the artist name)
- [ ] Submit — confirm the release saves with the edited value, not the original autofilled value
- [ ] Paste a second URL — confirm fields update to reflect the new track
- [ ] Paste an invalid URL (e.g., `https://example.com`) and click "Fetch Metadata" — confirm inline error message, fields remain editable
- [ ] Navigate to homepage — confirm the autofilled release appears correctly

---

## US2 — Release ordering verification

- [ ] Sign in, navigate to `/admin/releases/order` (or via "Reorder Releases" link on admin dashboard)
- [ ] Confirm all releases are listed (visible and hidden)
- [ ] Move one release from its current position to a different position using ↑/↓ buttons
- [ ] Click "Save Order"
- [ ] Navigate to homepage — confirm releases appear in the new order
- [ ] Return to ordering page — confirm the saved order is still reflected (not reset to original)
- [ ] Add a new release via `/admin/releases/new` — confirm it appears at the top of the homepage catalog (sort_order = 0 defaults to top)

---

## US3 — Beat ordering verification

- [ ] Sign in, navigate to `/admin/beats/order` (or via "Reorder Beats" link on admin dashboard)
- [ ] Confirm all beats are listed
- [ ] Move one beat to a different position using ↑/↓ buttons
- [ ] Click "Save Order"
- [ ] Navigate to homepage — confirm beats appear in the new order
- [ ] Confirm tag filtering still works correctly after reordering (filter by a tag — beats should filter and remain in their new sort order within the filtered results)
- [ ] Add a new beat — confirm it appears at the top of the beats catalog

---

## Build gate

```bash
npm run build
```

Expected: zero TypeScript errors, build completes successfully, all routes present.
