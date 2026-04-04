# Quickstart: Producer Tools PS2 Grid Verification

**Branch**: `005-tools-ps2-grid`
**Gate**: `npm run build` + manual verification

---

## One-time Supabase setup (before running locally)

### 1. Run schema migration (SQL Editor)

```sql
CREATE TABLE tools (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  slug             text UNIQUE NOT NULL,
  description      text,
  disk_image_url   text,
  disk_font        text NOT NULL DEFAULT 'turret-road',
  disk_font_color  text NOT NULL DEFAULT '#2A6094',
  is_visible       boolean NOT NULL DEFAULT true,
  sort_order       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tools_slug ON tools (slug);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tools: public read"
  ON tools FOR SELECT
  USING (is_visible = true);

CREATE POLICY "tools: owner update"
  ON tools FOR ALL
  USING (auth.role() = 'authenticated');
```

### 2. Seed the three tools

```sql
INSERT INTO tools (name, slug, description, disk_font, disk_font_color, sort_order) VALUES
  ('ISOtone',    'isotone',    'A producer tool. Coming soon.', 'turret-road',  '#2A6094', 1),
  ('Mosaic',     'mosaic',     'A producer tool. Coming soon.', 'chakra-petch', '#2A6094', 2),
  ('MIDIripper', 'midiripper', 'A producer tool. Coming soon.', 'teko',         '#2A6094', 3);
```

### 3. Regenerate TypeScript types

```bash
npm run db:types
```

Verify `src/lib/database.types.ts` now includes the `tools` table with all columns.

---

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## US1 — Tools grid + routing verification

- [ ] Navigate to `/tools` — confirm three disk cards are displayed in a 3-column grid
- [ ] Confirm each disk shows the tool name rendered in a PS2-era font
- [ ] Confirm disks without a custom image show a default placeholder (no broken image)
- [ ] Click the ISOtone disk — confirm navigation to `/tools/isotone`
- [ ] Confirm `/tools/isotone` renders a heading with "ISOtone" and placeholder text
- [ ] Click the browser back button — confirm return to `/tools`
- [ ] Repeat click test for Mosaic (`/tools/mosaic`) and MIDIripper (`/tools/midiripper`)
- [ ] Navigate directly to `/tools/isotone` via URL bar — confirm it renders correctly
- [ ] Resize to ≤680px width — confirm the grid adapts (fewer columns, disks don't overflow)
- [ ] Navigate to homepage — confirm a TOOLS link/section is present and leads to `/tools`

---

## US2 — Admin disk customization verification

- [ ] Sign in, navigate to `/admin`
- [ ] Confirm a "MANAGE TOOLS" link is present
- [ ] Click it — navigate to `/admin/tools`
- [ ] Confirm all three tools (ISOtone, Mosaic, MIDIripper) are listed
- [ ] Click "EDIT" for ISOtone — navigate to `/admin/tools/[id]/edit`
- [ ] Change the disk image URL to a valid image URL and save
- [ ] Navigate to `/tools` — confirm the ISOtone disk now shows the new image
- [ ] Return to edit, change the disk font to a different option (e.g., Chakra Petch)
- [ ] Navigate to `/tools` — confirm the ISOtone disk name renders in the new font
- [ ] Return to edit, change the disk font color using the color picker
- [ ] Navigate to `/tools` — confirm the ISOtone disk name renders in the new color
- [ ] Return to edit, clear the disk image URL (leave blank) and save
- [ ] Navigate to `/tools` — confirm the disk falls back to the default placeholder, no broken image

---

## Build gate

```bash
npm run build
```

Expected: zero TypeScript errors, all routes present (`/tools`, `/tools/isotone`,
`/tools/mosaic`, `/tools/midiripper`, `/admin/tools`, `/admin/tools/[id]/edit`).
