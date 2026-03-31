Implementation Spec: Data Model — Tracks & Beats

Source: stories/002-data-model-tracks-and-beats.md

Objective

Create the releases and beats Supabase tables with full
schemas, RLS policies, TypeScript types, and seed data — so
the Next.js app can query real content for the homepage
catalog.

Pre-Conditions

- Supabase project exists at
https://fiwjvdjmcxavwwgwahhy.supabase.co
- Access to Supabase dashboard SQL editor (Table Editor or SQL
  Editor)
- .env.local has NEXT_PUBLIC_SUPABASE_URL and
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY set

Reference Files — Read First

┌─────────────────────┬────────────────────────────────────┐
│        File         │                Why                 │
├─────────────────────┼────────────────────────────────────┤
│ src/lib/supabase.ts │ Client import pattern for data     │
│                     │ fetching                           │
├─────────────────────┼────────────────────────────────────┤
│ src/app/page.tsx    │ Where the test query will be added │
│                     │  temporarily                       │
└─────────────────────┴────────────────────────────────────┘

---
Data Model

Table: releases

CREATE TABLE releases (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  slug         text UNIQUE NOT NULL,
  type         text NOT NULL CHECK (type IN ('single', 'ep',
'album')),
  artist       text NOT NULL,
  released_at  date,
  cover_url    text,
  soundcloud_url text,
  is_visible   boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_releases_slug        ON releases (slug);
CREATE INDEX idx_releases_released_at ON releases (released_at
  DESC);

Table: beats

CREATE TABLE beats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  slug       text UNIQUE NOT NULL,
  bpm        integer,
  key        text,
  genre      text,
  tags       text[] NOT NULL DEFAULT '{}',
  baton_url  text,
  audio_url  text,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_beats_slug ON beats (slug);
CREATE INDEX idx_beats_tags ON beats USING GIN (tags);

The GIN index on tags makes WHERE 'rage' = ANY(tags) fast —
needed for the tag filter in story 003.

Row Level Security

-- Enable RLS
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE beats    ENABLE ROW LEVEL SECURITY;

-- Public can read visible rows
CREATE POLICY "releases: public read"
  ON releases FOR SELECT
  USING (is_visible = true);

CREATE POLICY "beats: public read"
  ON beats FOR SELECT
  USING (is_visible = true);

-- Only authenticated users can write (admin, future story)
CREATE POLICY "releases: auth write"
  ON releases FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "beats: auth write"
  ON beats FOR ALL
  USING (auth.role() = 'authenticated');

Seed Data

INSERT INTO releases (title, slug, type, artist, released_at,
soundcloud_url, cover_url) VALUES
  (
    'Test Single',
    'test-single',
    'single',
    'Artist Name',
    '2024-01-01',
    'https://soundcloud.com/placeholder',
    null
  ),
  (
    'Test EP',
    'test-ep',
    'ep',
    'Another Artist',
    '2024-06-01',
    'https://soundcloud.com/placeholder-2',
    null
  );

INSERT INTO beats (title, slug, bpm, key, genre, tags,
baton_url) VALUES
  (
    'Dark Trap Beat',
    'dark-trap-beat',
    140,
    'F# minor',
    'Trap',
    ARRAY['rage', 'dark', 'trap'],
    'https://baton.media/player/placeholder'
  ),
  (
    'Melodic Drill',
    'melodic-drill',
    145,
    'G minor',
    'Drill',
    ARRAY['drill', 'melodic', 'osamason'],
    'https://baton.media/player/placeholder-2'
  );

---
Implementation Steps

Step 1 — Run SQL in Supabase Dashboard

- Go to Supabase dashboard → SQL Editor
- Run the CREATE TABLE statements for releases and beats
- Run the index creation statements
- Run the RLS ALTER TABLE and CREATE POLICY statements
- Run the seed INSERT statements
- Verify in Table Editor that both tables exist with correct
columns and seed rows

Step 2 — TypeScript Types

- File to create: src/lib/types.ts
export type ReleaseType = 'single' | 'ep' | 'album'

export interface Release {
  id: string
  title: string
  slug: string
  type: ReleaseType
  artist: string
  released_at: string | null
  cover_url: string | null
  soundcloud_url: string | null
  is_visible: boolean
  created_at: string
}

export interface Beat {
  id: string
  title: string
  slug: string
  bpm: number | null
  key: string | null
  genre: string | null
  tags: string[]
  baton_url: string | null
  audio_url: string | null
  is_visible: boolean
  created_at: string
}

Step 3 — Verify Connection with Test Query

- Temporarily add to src/app/page.tsx (server component, top
of function body):
import { supabase } from '@/lib/supabase'
import type { Release, Beat } from '@/lib/types'

const { data: releases, error: rErr } = await supabase
  .from('releases')
  .select('*')
  .eq('is_visible', true)
  .order('released_at', { ascending: false })

const { data: beats, error: bErr } = await supabase
  .from('beats')
  .select('*')
  .eq('is_visible', true)
  .order('created_at', { ascending: false })

console.log('releases:', releases, rErr)
console.log('beats:', beats, bErr)
- Run npm run dev, open browser, check terminal for logged
rows
- Expected: 2 releases and 2 beats logged with no errors
- Remove the test code after confirming

Step 4 — Clean Up and Commit

- Remove test console.log code from page.tsx
- Keep src/lib/types.ts — it will be used in story 003

---
Registration & Wiring

- No env var changes needed
- No new routes or nav items
- src/lib/types.ts is a new file — commit it

Definition of Done

- releases table exists in Supabase with correct schema and
RLS
- beats table exists in Supabase with correct schema, GIN
index on tags, and RLS
- Seed data present: 2 releases, 2 beats
- Test query from src/app/page.tsx returns seeded rows with no
  errors
- src/lib/types.ts committed with Release and Beat interfaces
- Test code removed before final commit
- npm run build passes
