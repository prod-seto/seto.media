# Research: SoundCloud Autofill & Catalog Ordering

**Branch**: `004-soundcloud-autofill-ordering`
**Phase**: 0 — Research & Design Proposal

---

## Decision 1: Metadata source for SoundCloud autofill

**Decision**: SoundCloud oEmbed API, called from a Server Action.

**Endpoint**: `https://soundcloud.com/oembed?format=json&url={encodeURIComponent(trackUrl)}`

**Fields returned** (relevant subset):

| Field | Value | Maps to |
|-------|-------|---------|
| `title` | Track title (e.g., "Faith") | `releases.title` |
| `author_name` | Artist display name (e.g., "Fckmannequin") | `releases.artist` |
| `thumbnail_url` | Cover art image URL | `releases.cover_url` |

Fields NOT available from oEmbed: `released_at`, `type` (single/EP/album). Those always
require manual entry.

**Authentication**: None required for publicly accessible tracks. No API key needed.

**CORS**: The oEmbed endpoint does not send `Access-Control-Allow-Origin` headers for
arbitrary browser origins, so calling it directly from client-side JavaScript would
be blocked. Calling it from a Server Action (Node.js, server-side) has no CORS
restriction. This makes the Server Action approach mandatory, not optional.

**Rationale**: oEmbed is the simplest, no-auth approach to metadata extraction. The
SoundCloud API v2 is an alternative but requires OAuth and API key registration,
which is unnecessary overhead for a personal site fetching its own tracks.

**Alternatives considered**:
- SoundCloud API v2 with OAuth: Correct for third-party apps; unnecessary complexity
  for a single-owner tool fetching public tracks the admin already knows.
- Parsing the SoundCloud page HTML (scraping): Fragile, violates ToS, no clear benefit.
- No autofill (manual entry as-is): Works, but is the current pain point being solved.

---

## Decision 2: Ordering UI interaction model

**Decision**: Up/down arrow buttons per item, with a single "Save Order" action.

**Rationale**: The catalog has at most ~20 items, managed infrequently by a solo admin.
Up/down buttons require zero new dependencies, work on all devices including touch,
are fully keyboard-accessible, and are straightforward to implement with React state.

**Alternatives evaluated**:

| Option | Bundle Impact | Touch Support | Accessibility | Implementation |
|--------|--------------|---------------|---------------|----------------|
| HTML5 native DnD | 0 KB | ❌ No touch | Poor (no keyboard) | Complex (ghost image, drop zones) |
| @dnd-kit/sortable | ~40 KB added | ✅ | ✅ Full ARIA | Moderate (DndContext, SortableContext) |
| Up/down buttons | 0 KB | ✅ | ✅ Native buttons | Simple (array splice in state) |

**Why @dnd-kit was rejected**: Adding ~40 KB for a feature used occasionally by one
admin on a list of ≤20 items does not meet the justification threshold in the
constitution ("No new third-party JavaScript dependencies without explicit
justification"). The UX benefit of drag-and-drop over up/down arrows for this catalog
size is marginal.

**Why HTML5 native DnD was rejected**: No touch support (admin may use iPad), poor
accessibility, and significantly more complex to implement correctly in React than
up/down buttons.

---

## Decision 3: Sort order storage

**Decision**: Add `sort_order integer NOT NULL DEFAULT 0` column to both `releases`
and `beats` tables.

**Schema**:
```sql
ALTER TABLE releases ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE beats    ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
```

**Ordering convention**: `ORDER BY sort_order ASC` — lower number appears first.
Position 1 is the top of the catalog. New items receive `sort_order = 0` by default,
which places them above all existing records (effective top position) until the admin
explicitly saves a new order.

**Reorder save behavior**: When the admin saves a new order, all items in that catalog
are reassigned clean consecutive integers starting at 1. This keeps sort_order values
tidy and avoids unbounded growth.

**Alternatives considered**:
- `released_at` / `created_at` ordering (current): Not controllable by the admin.
- Float-based fractional ordering: Allows insertion without re-numbering all records,
  but adds precision risk and is harder to reason about. Unnecessary for ≤20 items
  where a full re-number on every save is trivially fast.
- Separate ordering table: Correct for complex multi-list ordering; overkill here.

---

## Decision 4: Autofill trigger mechanism

**Decision**: Explicit "Fetch Metadata" button. The admin pastes the URL and clicks
the button to trigger the Server Action.

**Rationale**: Explicit is predictable. Auto-triggering on blur or onChange would fire
partial fetches while the URL is being typed or pasted character-by-character. A single
intentional button click is clearer and generates exactly one Server Action call per
intent. It also gives the admin a moment to review the URL before the fetch runs.

**Alternatives considered**:
- Auto-trigger on paste (`onPaste` event): Would work for paste-in-one-action but
  misses typed URLs and adds complexity to avoid double-fires.
- Auto-trigger on blur: Fires when the admin tabs away from the field, which may be
  unintended (e.g., clicking a different tab to look something up).

---

## Decision 5: Type regeneration after schema change

**Decision**: After running the SQL migration in Supabase, run `npm run db:types` to
regenerate `src/lib/database.types.ts` from the live schema. `src/lib/types.ts` derives
`Release` and `Beat` from `database.types.ts` via `Tables<"releases">` and
`Tables<"beats">`, so it picks up `sort_order` automatically after regeneration.

**Command**: `npm run db:types` (already configured in package.json as
`supabase gen types typescript --project-id fiwjvdjmcxavwwgwahhy > src/lib/database.types.ts`)

**Requires**: Supabase CLI installed and authenticated. If Supabase CLI is not available,
`database.types.ts` can be updated manually by adding `sort_order` to the Row, Insert,
and Update types for both `releases` and `beats`.

---

## New dependencies

None. No new npm packages required for this feature.

## Affected files

| File | Change |
|------|--------|
| `src/app/admin/releases/new/page.tsx` | Add URL fetch step + autofill |
| `src/app/actions/soundcloud.ts` | New — Server Action to fetch oEmbed metadata |
| `src/app/admin/releases/order/page.tsx` | New — release ordering UI |
| `src/app/admin/beats/order/page.tsx` | New — beat ordering UI |
| `src/app/actions/ordering.ts` | New — Server Actions to save order |
| `src/app/admin/page.tsx` | Add links to ordering pages |
| `src/app/page.tsx` | Change ORDER BY to sort_order ASC |
| `src/lib/database.types.ts` | Regenerated — adds sort_order to both tables |
