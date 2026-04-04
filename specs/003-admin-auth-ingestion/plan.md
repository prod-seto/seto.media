# Implementation Plan: Admin Auth & Content Ingestion

**Branch**: `003-admin-auth-ingestion` | **Date**: 2026-04-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-admin-auth-ingestion/spec.md`

## Summary

Add email/password authentication with a middleware-enforced admin-only gate on
`/admin/**`, then build two content ingestion forms behind that gate: one for releases
(text fields only) and one for beats (text fields + audio file upload to Supabase
Storage). Uses `@supabase/ssr` for server-side auth, Server Actions for metadata
inserts, and direct browser-to-storage upload for audio files.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router
**Primary Dependencies**: React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (new)
**Storage**: Supabase PostgreSQL (existing `releases` + `beats` tables) + Supabase Storage (`beats-audio` bucket)
**Testing**: `npm run build` + manual verification per quickstart.md
**Target Platform**: Browser + Vercel serverless (middleware)
**Project Type**: Web application — auth + server-side forms + file upload
**Performance Goals**: Audio upload direct browser→Supabase (no Vercel intermediary)
**Constraints**: Vercel function body limit (4.5 MB) prohibits routing audio through Server Actions or API routes
**Scale/Scope**: Single admin user; 8 new files, 1 new npm package

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. Component Quality | Server components fetch data; client components handle state. Server Actions in `'use server'` files. No new abstractions for one-off operations. | ✅ Pass — login page and admin forms are client components owning form state; Server Actions handle DB writes; middleware is server-only. |
| II. Design System Fidelity | `ghost-panel` CSS class, Orbitron/Share Tech Mono/Exo 2 typefaces, 0px border radius, cool blue-teal palette. | ✅ Pass — admin pages use `ghost-panel` panels, Share Tech Mono labels, Orbitron headings. Functional clarity takes priority per spec assumption, but design system is followed. |
| III. Testing Standards | `npm run build` must pass. Auth flow, form submissions, and audio playback of ingested beats must be manually verified. | ✅ Pass — quickstart.md covers full auth flow + both forms including file upload and homepage appearance. |
| IV. Performance Requirements | No blocking renders; data fetching in async server components. Audio upload must NOT route through Vercel functions. | ✅ Pass — audio upload goes directly browser→Supabase Storage. Metadata inserts via Server Actions are not file transfers. |
| V. Data Integrity | All Supabase queries use typed interfaces. RLS enabled on all tables. Schema changes documented before code. | ✅ Pass — new RLS policies documented in data-model.md. No new tables. Typed interfaces via existing `src/lib/types.ts`. |

**UX Consistency**: Single-play and tag filter behaviors are unaffected. Admin pages are separate routes.

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-auth-ingestion/
├── plan.md              ← this file
├── spec.md              ← feature specification
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
└── checklists/
    └── requirements.md
```

### Source Code (new files)

```text
src/
├── middleware.ts                          ← NEW: route guard for /admin/**
├── lib/
│   └── supabase-server.ts                 ← NEW: createServerClient factory
├── app/
│   ├── login/
│   │   └── page.tsx                       ← NEW: sign-in form
│   └── admin/
│       ├── page.tsx                       ← NEW: admin dashboard
│       ├── releases/
│       │   └── new/
│       │       └── page.tsx               ← NEW: new release form
│       └── beats/
│           └── new/
│               └── page.tsx              ← NEW: new beat form (audio upload)
└── actions/
    ├── releases.ts                        ← NEW: Server Action — insert release
    └── beats.ts                           ← NEW: Server Action — insert beat metadata
```

### Modified files

```text
package.json   ← add @supabase/ssr
.env.local     ← add ADMIN_EMAIL (not committed)
```

## Implementation Design

### Middleware flow

```
Request to /admin/**
  ↓
createServerClient (using request cookies)
  ↓
supabase.auth.getUser()
  ├── No user → redirect /login
  ├── user.email !== ADMIN_EMAIL → redirect /
  └── Valid owner → pass through (return supabaseResponse)
```

`src/middleware.ts` matcher: `['/admin/:path*']`

### Login page (`/login`)

Client component. Email + password inputs. Calls
`supabase.auth.signInWithPassword({ email, password })` directly from the browser
using the existing singleton client. On success, redirects to `/admin`. On error,
shows inline message. No Server Action needed — Supabase Auth client handles session
cookie setting automatically via `@supabase/ssr`.

### Admin dashboard (`/admin`)

Simple server component. Links to `/admin/releases/new` and `/admin/beats/new`.
Shows a sign-out button (client component island with `supabase.auth.signOut()`).

### New Release form

Client component at `/admin/releases/new`. Fields: title, artist, type (select),
SoundCloud URL, cover URL, release date, is_visible toggle. On submit:
1. Client-side validation (required fields)
2. Calls `createRelease` Server Action with form data
3. Server Action: verifies auth, generates slug, inserts into `releases`
4. On success: show confirmation + link to homepage

### New Beat form

Client component at `/admin/beats/new`. Fields: title, BPM, key, tags (comma-separated
or add-one-at-a-time input), audio file picker, is_visible toggle. On submit:
1. Client-side validation (title required, file required, file type must be audio/*)
2. Upload audio file via `supabase.storage.from('beats-audio').upload(...)` from client
3. On upload success: call `createBeat` Server Action with metadata + storage path
4. Server Action: verifies auth, generates slug, inserts into `beats`
5. On success: show confirmation + link to homepage

### Server-side Supabase client

`src/lib/supabase-server.ts` exports a `createClient()` factory (different name from
existing singleton) that creates a `@supabase/ssr` server client using Next.js cookies.
Used in middleware and Server Actions only. Not used in client components.

## Complexity Tracking

No constitution violations. The audio upload bypasses Server Actions due to Vercel's
4.5 MB body limit — this is a justified architectural constraint, not a complexity
violation. Documented in research.md Decision 3.
