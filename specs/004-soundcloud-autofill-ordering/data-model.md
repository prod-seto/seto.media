# Data Model: SoundCloud Autofill & Catalog Ordering

**Branch**: `004-soundcloud-autofill-ordering`

No new tables. The existing `releases` and `beats` tables each gain one column.
`database.types.ts` must be regenerated after the migration.

---

## Schema changes

### `releases` — add `sort_order`

```sql
ALTER TABLE releases ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
```

New column behavior:
- `DEFAULT 0` — all existing releases and every newly inserted release start at
  sort_order 0, which sorts to the top of the catalog.
- The homepage query changes from `ORDER BY released_at DESC` to
  `ORDER BY sort_order ASC`.
- When the admin saves a reordered list, all releases are re-assigned clean integers
  1, 2, 3… in the new order.

Updated `releases` table (changed row only):

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| sort_order | integer | NOT NULL | 0 | Display position; lower = higher in list |

### `beats` — add `sort_order`

```sql
ALTER TABLE beats ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
```

Same behavior as releases. Homepage query changes from `ORDER BY created_at DESC`
to `ORDER BY sort_order ASC`.

---

## RLS policies

No changes needed. The existing `releases: owner update` and `beats: owner update`
policies already allow the owner to update any column on those tables, including
`sort_order`. The bulk re-ordering Server Action uses those existing policies.

---

## Initial data migration

After adding the columns, existing records all have `sort_order = 0`. The homepage
will show them in undefined order until the admin visits the ordering screens. To
pre-populate a sensible initial order (matching the current display order), run:

```sql
-- Set initial sort_order for releases (preserves current released_at DESC order)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY released_at DESC NULLS LAST, created_at DESC) AS rn
  FROM releases
)
UPDATE releases SET sort_order = ranked.rn
FROM ranked WHERE releases.id = ranked.id;

-- Set initial sort_order for beats (preserves current created_at DESC order)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM beats
)
UPDATE beats SET sort_order = ranked.rn
FROM ranked WHERE beats.id = ranked.id;
```

This is recommended but optional — if skipped, the homepage shows records in
undefined order until the admin explicitly saves an order.

---

## TypeScript types

After running the SQL migration, regenerate `database.types.ts`:

```bash
npm run db:types
```

This updates `database.types.ts` to include `sort_order` in the Row, Insert, and
Update types for both tables. Because `src/lib/types.ts` derives `Release` and `Beat`
via `Tables<"releases">` / `Tables<"beats">`, those types pick up `sort_order`
automatically.

If the Supabase CLI is not available, manually add to `database.types.ts`:

```ts
// releases Row:
sort_order: number

// releases Insert:
sort_order?: number

// releases Update:
sort_order?: number

// beats Row:
sort_order: number

// beats Insert:
sort_order?: number

// beats Update:
sort_order?: number
```

---

## SoundCloud oEmbed response shape

The `fetchSoundCloudMetadata` Server Action calls:

```
GET https://soundcloud.com/oembed?format=json&url={encodedUrl}
```

Relevant fields from the JSON response:

| Field | Type | Maps to |
|-------|------|---------|
| `title` | string | `releases.title` |
| `author_name` | string | `releases.artist` |
| `thumbnail_url` | string \| null | `releases.cover_url` |

The action returns `{ title, artist, coverUrl }` or an error string. Fields not
available from oEmbed (`released_at`, `type`) remain blank for manual entry.

---

## Ordering Server Action contract

```ts
// src/app/actions/ordering.ts

updateReleasesOrder(ids: string[]): Promise<{ success: boolean; error?: string }>
// ids = release IDs in desired display order (first element = top of catalog)
// Sets sort_order = 1 for ids[0], 2 for ids[1], etc.

updateBeatsOrder(ids: string[]): Promise<{ success: boolean; error?: string }>
// Same pattern for beats
```

Both actions call `createSupabaseServerClient()`, verify the owner session, then
perform individual UPDATE calls for each id/position pair.
