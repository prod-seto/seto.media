# Quickstart: PS2 Disc Redesign

## Prerequisites

- Feature 005 complete and verified (tools table exists, three tools seeded)
- Access to Supabase SQL Editor

---

## Step 1 — Run ALTER TABLE in Supabase SQL Editor

Open the Supabase dashboard → SQL Editor. Run the following:

```sql
-- Add all new configurable disc columns
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

Then set representative seed values on the three existing tools:

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

**Verify**: In Supabase Table Editor, open the `tools` table and confirm the 12 new columns exist with the expected defaults.

---

## Step 2 — Regenerate TypeScript Types

```bash
npm run db:types
```

**Verify**: `src/lib/database.types.ts` now includes all 12 new columns in the `tools` table Row type.

---

## Step 3 — Build Gate

```bash
npm run build
```

Must pass with zero TypeScript errors before any component work begins.

---

## Verification Checklists

### US1: Authentic PS2 Disc Layout

Navigate to `http://localhost:3000/tools`

- [ ] Each disc is circular and has no label below it
- [ ] The tool name appears as text ON the disc face, within the upper portion
- [ ] The lower portion of the disc shows a distinct info band (darker background)
- [ ] The bottom strip of the disc reads "PlayStation®2" in white text
- [ ] The info band contains the SETO COMPUTER ENTERTAINMENT logo on the right side
- [ ] A center hub ring (semi-transparent white circle) is visible at the disc center
- [ ] A thin rim ring is visible at the outer edge of the disc
- [ ] Resize to ≤680px — discs stack to 2 columns then 1 column; proportions preserved

### US1: Fallback state (no image)

- [ ] In Supabase: temporarily set `disk_image_url = null` on one tool
- [ ] Navigate to `/tools` and confirm the disc renders with a solid `bg_color` background — no broken element, no missing zone
- [ ] Restore `disk_image_url` after verifying

### US2: Admin full configurability

Sign in at `/login`, then navigate to `/admin/tools`

- [ ] Each tool row shows in the list
- [ ] Click EDIT on ISOtone → confirm all new fields appear in the form:
  - Background color picker
  - Background gradient toggle
  - Game subtitle text input
  - Font size input (numeric, % of disc)
  - ESRB rating select (E / T / M / AO / None)
  - ESRB descriptors text input
  - Catalog number text input
  - Region select (NTSC U/C / NTSC J / PAL)
  - Rim text input
  - Info band text input
  - Hub color picker
  - Extra badges editor
- [ ] Change the game subtitle → confirm the disc preview updates immediately
- [ ] Change the background color → confirm the disc preview updates immediately
- [ ] Set an ESRB rating → confirm a text badge appears in the preview's info band
- [ ] Clear the ESRB rating → confirm the badge disappears
- [ ] Click SAVE → navigate to `/tools` and confirm the changes are visible on the disc

### US2: SETO CE logo

- [ ] In the info band on `/tools`, the SETO COMPUTER ENTERTAINMENT logo is visible on the right side
- [ ] Logo shows "SETO" at top, diamond icon with orange/gold gradient in center, "COMPUTER ENTERTAINMENT" stacked below
- [ ] Logo is present on all three disc cards

---

## Rollback

If the schema change needs to be undone:

```sql
ALTER TABLE tools
  DROP COLUMN IF EXISTS bg_color,
  DROP COLUMN IF EXISTS bg_gradient,
  DROP COLUMN IF EXISTS game_subtitle,
  DROP COLUMN IF EXISTS game_font_size,
  DROP COLUMN IF EXISTS esrb_rating,
  DROP COLUMN IF EXISTS esrb_descriptors,
  DROP COLUMN IF EXISTS catalog_number,
  DROP COLUMN IF EXISTS region,
  DROP COLUMN IF EXISTS rim_text,
  DROP COLUMN IF EXISTS info_text,
  DROP COLUMN IF EXISTS hub_color,
  DROP COLUMN IF EXISTS extra_badges;
```
