-- ─── Story 002: releases + beats tables ─────────────────────────────────────
-- Run this entire file in Supabase dashboard → SQL Editor

-- ─── releases ────────────────────────────────────────────────────────────────

CREATE TABLE releases (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  slug           text        UNIQUE NOT NULL,
  type           text        NOT NULL CHECK (type IN ('single', 'ep', 'album')),
  artist         text        NOT NULL,
  released_at    date,
  cover_url      text,
  soundcloud_url text,
  is_visible     boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_releases_slug        ON releases (slug);
CREATE INDEX idx_releases_released_at ON releases (released_at DESC);

-- ─── beats ───────────────────────────────────────────────────────────────────

CREATE TABLE beats (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text        NOT NULL,
  slug       text        UNIQUE NOT NULL,
  bpm        integer,
  key        text,
  genre      text,
  tags       text[]      NOT NULL DEFAULT '{}',
  baton_url  text,
  audio_url  text,
  is_visible boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_beats_slug ON beats (slug);
CREATE INDEX idx_beats_tags ON beats USING GIN (tags);  -- fast WHERE 'tag' = ANY(tags)

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE beats    ENABLE ROW LEVEL SECURITY;

-- Public: read visible rows only
CREATE POLICY "releases: public read"
  ON releases FOR SELECT
  USING (is_visible = true);

CREATE POLICY "beats: public read"
  ON beats FOR SELECT
  USING (is_visible = true);

-- Authenticated (future admin): full write access
CREATE POLICY "releases: auth write"
  ON releases FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "beats: auth write"
  ON beats FOR ALL
  USING (auth.role() = 'authenticated');

-- ─── Seed data ────────────────────────────────────────────────────────────────

INSERT INTO releases (title, slug, type, artist, released_at, soundcloud_url) VALUES
  ('Test Single', 'test-single', 'single', 'Artist Name',    '2024-01-01', 'https://soundcloud.com/placeholder'),
  ('Test EP',     'test-ep',     'ep',     'Another Artist', '2024-06-01', 'https://soundcloud.com/placeholder-2');

INSERT INTO beats (title, slug, bpm, key, genre, tags, baton_url) VALUES
  ('Dark Trap Beat', 'dark-trap-beat', 140, 'F# minor', 'Trap',  ARRAY['rage', 'dark', 'trap'],          'https://baton.media/player/placeholder'),
  ('Melodic Drill',  'melodic-drill',  145, 'G minor',  'Drill', ARRAY['drill', 'melodic', 'osamason'],  'https://baton.media/player/placeholder-2');
