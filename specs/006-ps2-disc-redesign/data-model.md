# Data Model: PS2 Disc Redesign

## Existing `tools` Table — Columns Unchanged

These columns exist from feature 005 and require no changes:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `name` | `text NOT NULL` | Tool name; rendered on disc as game title |
| `slug` | `text UNIQUE NOT NULL` | URL slug |
| `description` | `text` | Tool description for `/tools/[slug]` page |
| `disk_image_url` | `text` | Art zone background image URL; null = use `bg_color` |
| `disk_font` | `text NOT NULL` | PS2 font key: `'turret-road'` \| `'chakra-petch'` \| `'teko'` |
| `disk_font_color` | `text NOT NULL` | Game title color (maps to `gameTitleColor` in spec) |
| `is_visible` | `boolean NOT NULL DEFAULT true` | Public visibility toggle |
| `sort_order` | `integer NOT NULL DEFAULT 0` | Grid display order |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | Creation timestamp |

---

## New Columns — `ALTER TABLE tools ADD COLUMN …`

```sql
ALTER TABLE tools
  ADD COLUMN bg_color         text             NOT NULL DEFAULT '#1a2744',
  ADD COLUMN bg_gradient      boolean          NOT NULL DEFAULT false,
  ADD COLUMN game_subtitle    text,
  ADD COLUMN game_font_size   real             NOT NULL DEFAULT 10,
  ADD COLUMN esrb_rating      text             CHECK (esrb_rating IN ('E', 'T', 'M', 'AO')),
  ADD COLUMN esrb_descriptors text,
  ADD COLUMN catalog_number   text,
  ADD COLUMN region           text             NOT NULL DEFAULT 'NTSC U/C'
                                               CHECK (region IN ('NTSC U/C', 'NTSC J', 'PAL')),
  ADD COLUMN rim_text         text,
  ADD COLUMN info_text        text,
  ADD COLUMN hub_color        text             NOT NULL DEFAULT 'rgba(255,255,255,0.55)',
  ADD COLUMN extra_badges     jsonb            NOT NULL DEFAULT '[]'::jsonb;
```

After running, regenerate TypeScript types:
```bash
npm run db:types
```

### New columns reference

| Column | Type | Default | Spec prop | Notes |
|---|---|---|---|---|
| `bg_color` | `text` | `'#1a2744'` | `bgColor` | Art zone fill when no image set |
| `bg_gradient` | `boolean` | `false` | `bgGradient` | Radial vignette overlay on art zone |
| `game_subtitle` | `text` | null | `gameSubtitle` | Second title line; e.g. "Sons of Liberty" |
| `game_font_size` | `real` | `10` | `gameFontSize` | % of disc diameter; typical 8–14 |
| `esrb_rating` | `text` | null | `esrbRating` | `'E'` / `'T'` / `'M'` / `'AO'` or null |
| `esrb_descriptors` | `text` | null | `esrbDescriptors` | e.g. "Blood and Gore, Violence" |
| `catalog_number` | `text` | null | `catalogNumber` | e.g. "SLUS 21134" |
| `region` | `text` | `'NTSC U/C'` | `region` | `'NTSC U/C'` / `'NTSC J'` / `'PAL'` |
| `rim_text` | `text` | null | `rimText` | Legal/copyright text on inner rim arc |
| `info_text` | `text` | null | `infoText` | Copyright body text in info band |
| `hub_color` | `text` | `'rgba(255,255,255,0.55)'` | `hubColor` | Spindle area fill |
| `extra_badges` | `jsonb` | `'[]'` | `extraBadges` | Array of `{icon: string, label: string}` |

---

## Fixed Fields (no columns — hardcoded in component)

| Value | Notes |
|---|---|
| `"PlayStation®2"` | Brand bar text — always fixed |
| SETO CE logo | Publisher logo — rendered by `SetoLogo` SVG component |

---

## TypeScript Type Additions

After running `npm run db:types`, `src/lib/database.types.ts` will reflect all new columns.
The `Tables<"tools">` type used throughout the codebase will pick them up automatically.

The `extra_badges` JSONB column will type as `Json` in the generated types.
Define a local badge type in `DiskCard.tsx`:

```ts
type DiscBadge = { icon: string; label: string };
```

Cast with: `(tool.extra_badges as DiscBadge[]) ?? []`

---

## Seed Data Updates

After adding columns, update seed rows to set representative default values for the three existing tools.

```sql
UPDATE tools SET
  bg_color        = '#1a2744',
  bg_gradient     = false,
  game_font_size  = 10,
  region          = 'NTSC U/C',
  hub_color       = 'rgba(255,255,255,0.55)',
  extra_badges    = '[]'::jsonb
WHERE slug IN ('isotone', 'mosaic', 'midiripper');
```

---

## Component Prop Mapping

`DiskCard.tsx` and `SetoLogo.tsx` are the only components that consume these columns.

| DB column | Spec prop | Used in |
|---|---|---|
| `name` | `gameName` | DiskCard — game title text |
| `disk_font` | `gameFont` | DiskCard — fontVars lookup |
| `disk_font_color` | `gameTitleColor` | DiskCard — inline color style |
| `game_subtitle` | `gameSubtitle` | DiskCard — subtitle line |
| `game_font_size` | `gameFontSize` | DiskCard — calc() size |
| `disk_image_url` | `bgImage` | DiskCard — art zone img src |
| `bg_color` | `bgColor` | DiskCard — art zone background |
| `bg_gradient` | `bgGradient` | DiskCard — vignette overlay |
| `esrb_rating` | `esrbRating` | DiskCard — badge text |
| `esrb_descriptors` | `esrbDescriptors` | DiskCard — badge subtext |
| `catalog_number` | `catalogNumber` | DiskCard — info band mono text |
| `region` | `region` | DiskCard — info band badge |
| `rim_text` | `rimText` | DiskCard — SVG textPath |
| `info_text` | `infoText` | DiskCard — info band fine print |
| `hub_color` | `hubColor` | DiskCard — hub ring fill |
| `extra_badges` | `extraBadges` | DiskCard — badge row |
| — | `publisherLogo` | SetoLogo (hardcoded) |
| — | `brandBarText` | DiskCard (hardcoded "PlayStation®2") |
