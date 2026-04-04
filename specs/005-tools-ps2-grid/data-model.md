# Data Model: Producer Tools — PS2 Disk Grid

**Branch**: `005-tools-ps2-grid`

One new table. `database.types.ts` must be regenerated after the migration.

---

## Schema

### `tools` table

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
```

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NOT NULL | gen_random_uuid() | Primary key |
| name | text | NOT NULL | — | Display name (e.g., "ISOtone") |
| slug | text | NOT NULL, UNIQUE | — | URL key (e.g., "isotone") |
| description | text | nullable | — | Short placeholder copy for the tool page |
| disk_image_url | text | nullable | — | Full URL to the disk artwork image |
| disk_font | text | NOT NULL | 'turret-road' | CSS key: 'turret-road' \| 'chakra-petch' \| 'teko' |
| disk_font_color | text | NOT NULL | '#2A6094' | Hex string (e.g., '#FFFFFF') |
| is_visible | boolean | NOT NULL | true | Controls public visibility |
| sort_order | integer | NOT NULL | 0 | Display order on tools grid |
| created_at | timestamptz | NOT NULL | now() | Row creation timestamp |

---

## RLS Policies

```sql
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Public visitors can read visible tools
CREATE POLICY "tools: public read"
  ON tools FOR SELECT
  USING (is_visible = true);

-- Only authenticated owner can write
CREATE POLICY "tools: owner update"
  ON tools FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## Seed data

```sql
INSERT INTO tools (name, slug, description, disk_font, disk_font_color, sort_order) VALUES
  (
    'ISOtone',
    'isotone',
    'A producer tool. Coming soon.',
    'turret-road',
    '#2A6094',
    1
  ),
  (
    'Mosaic',
    'mosaic',
    'A producer tool. Coming soon.',
    'chakra-petch',
    '#2A6094',
    2
  ),
  (
    'MIDIripper',
    'midiripper',
    'A producer tool. Coming soon.',
    'teko',
    '#2A6094',
    3
  );
```

---

## TypeScript types

After running the migration, regenerate with `npm run db:types`.

If Supabase CLI is unavailable, manually add to `database.types.ts`:

```ts
// tools Row:
tools: {
  Row: {
    id: string
    name: string
    slug: string
    description: string | null
    disk_image_url: string | null
    disk_font: string
    disk_font_color: string
    is_visible: boolean
    sort_order: number
    created_at: string
  }
  Insert: {
    id?: string
    name: string
    slug: string
    description?: string | null
    disk_image_url?: string | null
    disk_font?: string
    disk_font_color?: string
    is_visible?: boolean
    sort_order?: number
    created_at?: string
  }
  Update: {
    id?: string
    name?: string
    slug?: string
    description?: string | null
    disk_image_url?: string | null
    disk_font?: string
    disk_font_color?: string
    is_visible?: boolean
    sort_order?: number
    created_at?: string
  }
  Relationships: []
}
```

---

## Disk font key mapping

The `disk_font` column stores a CSS key that maps to a CSS variable in `layout.tsx`:

| DB value | CSS variable | Font family |
|----------|-------------|-------------|
| `turret-road` | `--font-turret-road` | Turret Road |
| `chakra-petch` | `--font-chakra-petch` | Chakra Petch |
| `teko` | `--font-teko` | Teko |

The `DiskCard` component resolves this mapping to inject the correct `fontFamily` inline style.

---

## Server Action contract

```ts
// src/app/actions/tools.ts

updateToolDisk(
  toolId: string,
  data: {
    disk_image_url?: string | null;
    disk_font?: string;
    disk_font_color?: string;
    name?: string;
    is_visible?: boolean;
  }
): Promise<{ success: boolean; error?: string }>
// Verifies owner session, then UPDATEs the tools row for toolId.
```
