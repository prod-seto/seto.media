# Data Model: Admin Auth & Content Ingestion

**Branch**: `003-admin-auth-ingestion`

No new tables are created by this feature. The existing `releases` and `beats` tables
receive new RLS policies for write operations. A Supabase Auth user is created manually.

---

## Existing tables (write policies added)

### `releases`

Existing schema — no column changes.

New RLS policies needed:

```sql
-- Allow owner to insert new releases
CREATE POLICY "releases: owner insert"
  ON releases FOR INSERT
  WITH CHECK (auth.uid() = '456421ea-fa21-4aa7-b6b8-f00f3f17c140');

-- Allow owner to update releases (for is_visible toggle)
CREATE POLICY "releases: owner update"
  ON releases FOR UPDATE
  USING (auth.uid() = '456421ea-fa21-4aa7-b6b8-f00f3f17c140');
```

### `beats`

Existing schema — no column changes.

New RLS policies needed:

```sql
-- Allow owner to insert new beats
CREATE POLICY "beats: owner insert"
  ON beats FOR INSERT
  WITH CHECK (auth.uid() = '456421ea-fa21-4aa7-b6b8-f00f3f17c140');

-- Allow owner to update beats (for is_visible toggle)
CREATE POLICY "beats: owner update"
  ON beats FOR UPDATE
  USING (auth.uid() = '456421ea-fa21-4aa7-b6b8-f00f3f17c140');
```

Replace `OWNER_UUID` with the actual UUID from Supabase Auth dashboard after creating
the owner account.

---

## Supabase Storage: `beats-audio` bucket

Existing bucket — no structural changes.

New storage RLS policy needed:

```sql
-- Allow owner to upload audio files
CREATE POLICY "beats-audio: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'beats-audio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

Upload path pattern: `{owner_uuid}/{filename}` where filename is derived from the
beat title (slugified) + `.mp3`.

After upload, the public URL (or signed URL) is stored in `beats.audio_url`.

---

## Supabase Auth

One auth user is created manually in the Supabase dashboard:

| Field | Value |
|-------|-------|
| Email | Site owner's email (also set as `ADMIN_EMAIL` env var) |
| Password | Set by site owner in Supabase dashboard |
| UUID | Auto-generated — note this value for use in RLS policies above |

No `users` table or profile table is needed. The auth user is the sole entity.

---

## Form field → database column mapping

### New Release form

| Form field | DB column | Required | Notes |
|------------|-----------|----------|-------|
| Title | `releases.title` | Yes | |
| Artist | `releases.artist` | Yes | |
| Type | `releases.type` | Yes | Enum: single / ep / album |
| SoundCloud URL | `releases.soundcloud_url` | No | |
| Cover image URL | `releases.cover_url` | No | |
| Release date | `releases.released_at` | No | Date input, stored as `date` |
| Visible | `releases.is_visible` | Yes | Toggle, default true |
| — | `releases.slug` | Auto | Derived from title, unique |
| — | `releases.created_at` | Auto | DB default |

### New Beat form

| Form field | DB column | Required | Notes |
|------------|-----------|----------|-------|
| Title | `beats.title` | Yes | |
| BPM | `beats.bpm` | No | Numeric |
| Key | `beats.key` | No | Text |
| Tags | `beats.tags` | No | Multi-value, stored as `text[]` |
| Audio file | `beats.audio_url` | Yes | Uploaded to storage first |
| Visible | `beats.is_visible` | Yes | Toggle, default true |
| — | `beats.slug` | Auto | Derived from title, unique |
| — | `beats.created_at` | Auto | DB default |

---

## Slug generation logic

Both forms auto-generate a slug from the title:

```
slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
```

Uniqueness check: query for existing slug before insert. If collision, append `-2`,
`-3`, etc. until unique.
