# Story 002 — Data Model: Tracks & Beats

  ## Objective
  Define and create the Supabase tables for releases and beats
  so that the releases and beats displays on the homepage have real data to display.

  ## Scope
  **In scope:**
  - `releases` table (finished music — singles, EPs, albums)
  - `beats` table (instrumentals available for download)
  - Verify tables are queryable from the Next.js app

  **Out of scope:**
  - Admin UI to manage content (later story, after auth)
  - Audio file upload/storage (later story)
  - Beat licensing / purchasing flow (later story)

  ## Data Model

  ### releases table
  SUBJECT TO CHANGE:
  | Column | Type | Notes |
  |---|---|---|
  | id | uuid | primary key, default gen_random_uuid() |
  | title | text | |
  | slug | text | unique, used in URL |
  | type | text | e.g. 'single', 'ep', 'album' |
  | released_at | date | |
  | cover_url | text | image URL (placeholder for now) |
  | [???] | | What else does a release need? |
  
  Additions to releases table:
  - soundcloud_url text — the SoundCloud track URL for embed
   - artist text — the rapper/artist name (you're the producer,
   not always the artist)
  
  All my released music can be found on Soundcloud. Maybe we can fetch the releases from there?
  I want them to be displayed and playable on my homepage.

  ### beats table
  | Column | Type | Notes |
  |---|---|---|
  | id | uuid | primary key |
  | title | text | |
  | slug | text | unique |
  | bpm | integer | |
  | key | text | e.g. 'F# minor' |
  | genre | text | |
  | [???] | | Is there a status? (available, sold, etc.) |
  | [???] | | Price? Tags? |
  | created_at | timestamptz | |
  
  Addition to beats table:
  - baton_url text — the Baton player URL for embed
  - audio_url text - option to self-host later without a schema migration (nullable for now)
  
  All my beats are currently free for download. I host them here: https://baton.media/player/spaces/2ff439251272485a93758e5aab1e78c53a7675a6
  
  I want them displayed and playable on my homepage.
  
  #### Tags schema
  
  PostgreSQL array (simpler, recommended for now):
    tags text[] DEFAULT '{}'
    -- query: WHERE 'rage' = ANY(tags)

  ## Questions to answer before implementing
  - Are releases and beats the same table with a `type` column,
    or separate tables? (separate is cleaner if they diverge)
    - Lets separate them just to make the categorization of them easier.
  - What makes a release "published" vs a draft?
    (a `published_at` nullable column? a boolean
  `is_published`?)
    - There will not be any draft releases. All releases are published/released in full.
  - Same question for beats — do you need a draft/published
  state?
    - Only need published state, I won't be displaying beat drafts.
  - For beats: is there a concept of "sold" or "exclusive"?
    - Right now, all my beats are free for profit. I might sell them in the future, but not right now.
  - What genres/tags matter to you? Free text or a fixed list?
    - Its common to tag beats with genres and also what type of artist the beat is for. An example could be #osamason, #rage

  ## API / Interface
  - No custom API routes — query Supabase client directly from
    Next.js server components
  - Both tables are read-only from the public (no auth required
    to read published records)
  - Row Level Security: SELECT allowed for all,
  INSERT/UPDATE/DELETE
    requires auth (set up now even though admin UI comes later)

  ## UI / UX
  - I would like two independently scrollable columns on the homepage. One for 'Beats' (left column), the other for 'Produced by me' (releases, right column)
  - Do we use Soundcloud and Baton embeds? Do we make custom UI? We might want to use custom UI so that I can display tags. It would be cool to filter by tags. For instance, if one of the beats has a #rage tag, then if I click the rage tag, the beats column list will update to only show beats with the #rage tag.

  ## Reference Files
  - `src/lib/supabase.ts` — client to use for test queries

  ## Integration Points
  - [ ] Create tables via Supabase dashboard SQL editor
  - [ ] Enable Row Level Security on both tables
  - [ ] Add RLS policy: public SELECT on published rows
  - [ ] Seed 2–3 test rows manually in Supabase dashboard
  - [ ] Add test query to home page, confirm data loads, then
  remove

  ## Acceptance Criteria
  - [ ] `releases` table exists with correct schema
  - [ ] `beats` table exists with correct schema
  - [ ] RLS enabled on both tables with public read policy
  - [ ] Test query from Next.js returns seeded rows without
  error
  - [ ] `npm run build` passes

  ## Out of Scope / Follow-on
  - Audio file storage (Supabase Storage setup — later)
  - Admin CRUD interface (requires auth — later)
  - Public catalog pages displaying this data (story 003)

  The most important questions to answer before we spec this out
   properly:

  1. Releases vs beats — in your head, what's the difference? Is
   a beat something you're selling/licensing to other producers,
   while a release is your finished music? Or is a beat just an
  instrumental version of a release?
  - A beat is an instrumental that is a free for profit download. A release is a song a rapper has released, and the beat they are rapping on is produced by me.
  2. Published/draft state — do you need to hide unreleased
  content from the public, or is everything in the DB
  automatically public?
  - Everything in the db is finished state, and public. We might want the ability to "private" a release or beat in the admin view of the app though.
  3. Beats status — do beats get "sold" or marked "exclusive"?
  Or are they always available?
  - Beats are always available for download, free for profit
