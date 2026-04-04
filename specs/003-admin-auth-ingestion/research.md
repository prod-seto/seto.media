# Research: Admin Auth & Content Ingestion

**Branch**: `003-admin-auth-ingestion`
**Phase**: 0 — Research & Design Proposal

---

## Decision 1: Auth middleware package

**Decision**: `@supabase/ssr` + `createServerClient` in `src/middleware.ts`.

**Rationale**: `@supabase/auth-helpers-nextjs` is deprecated; `@supabase/ssr` is the
official replacement and the only package that correctly handles cookie mutation in
Next.js App Router middleware. It exposes `createServerClient` which accepts a cookie
adapter backed by `RequestCookies`/`ResponseCookies`. The middleware calls
`supabase.auth.getUser()` (not `getSession()` — see gotchas) on every request and
redirects unauthenticated users away from `/admin/**`.

**Critical detail**: The middleware must return the `supabaseResponse` object it
creates (not a fresh `NextResponse.next()`), or refreshed session cookies won't
propagate to the browser and the user will be logged out on the next request.

**Always use `getUser()`, never `getSession()`**: `getSession()` reads from the cookie
without re-validating with the Supabase Auth server; a forged cookie can fool it.
`getUser()` sends a network request to confirm validity.

**Alternatives considered**:
- `@supabase/auth-helpers-nextjs`: Deprecated, cookie issues in Next.js 14+.
- Rolling a custom cookie adapter with raw `supabase-js`: Possible but reimplements
  what `@supabase/ssr` already does correctly.

---

## Decision 2: Admin-only identity gating

**Decision**: Dual-layer approach — (a) `ADMIN_EMAIL` env var check in middleware,
plus (b) Supabase RLS `auth.uid() = 'owner-uuid'` policy on `releases` and `beats`
tables for all write operations.

**Rationale**: No roles table needed for a single-owner site. Two complementary layers:

**Layer 1 — Middleware (UX layer)**:
After `getUser()`, check `user.email !== process.env.ADMIN_EMAIL`. `ADMIN_EMAIL` is a
server-only env var (no `NEXT_PUBLIC_` prefix) — it never reaches the browser.

**Layer 2 — RLS (security layer, defense in depth)**:
Even if middleware is bypassed (direct API call, etc.), the database rejects writes
from any UID other than the owner's. The UUID is obtained once from the Supabase
dashboard after creating the auth account.

**Why `auth.uid()` not `auth.email()` in RLS**:
`auth.email()` is not a built-in Supabase RLS function. `auth.uid()` is stable and
is the canonical identifier.

**Why NOT the service role key for admin writes**:
The service role key bypasses RLS entirely, removing the security backstop. All admin
writes use the anon/publishable key; RLS enforces the uid check.

**Alternatives considered**:
- Roles table: Correct for multi-user apps, overkill here.
- Checking `user.id` (UUID) in middleware instead of email: Equally valid; UUID is
  more stable but less readable in the env var.

---

## Decision 3: Audio file upload approach

**Decision**: Upload directly from the browser (client component) using the existing
Supabase JS client. No Server Action or API route involved in the file transfer.

**Rationale**: Audio files are 5–50 MB. Routing through a Server Action or Next.js API
route means: browser → Vercel function → Supabase Storage. Vercel serverless functions
have a 4.5 MB body limit (6 MB on Pro) — audio uploads would be silently truncated or
rejected. Direct client upload: browser → Supabase Storage. The existing singleton
client works for storage uploads; Supabase Storage uses the same client instance and
auth session.

**Storage path pattern**: `{user_uuid}/{filename}` in the `beats-audio` bucket. The
UUID prefix enables a simple storage RLS policy:
`(storage.foldername(name))[1] = auth.uid()::text`

**Bucket visibility**: Keep `beats-audio` private. Use `createSignedUrl` to generate
time-limited playback URLs, OR set it to public if open audio access is acceptable.
Given these are beats for sale/licensing review, a signed URL or public bucket is
reasonable — public is simpler and appropriate here.

**Alternatives considered**:
- Server Action with `FormData`: Body size limit eliminates this for audio.
- Presigned upload URLs: Correct "enterprise" pattern, unnecessary complexity for a
  single-owner site.

---

## Decision 4: Form submission pattern

**Decision**: Server Actions for metadata inserts; client-side Supabase call for audio
upload. The pattern is: (1) upload audio from client → get storage path; (2) call
Server Action with metadata + path → insert DB row.

**Rationale**: Server Actions are the idiomatic App Router pattern for typed, validated
mutations. They handle CSRF automatically, run on the server, and integrate with
`useActionState` (React 19 — imported from `'react'`, not `'react-dom'`).

Routing the audio upload through a Server Action is blocked by Vercel's body size
limit. The two-step pattern (upload first, then insert) is clean and practical.

**Server Actions must**:
- Live in `'use server'` files (e.g., `src/app/actions/`)
- Call `createServerClient` (from `@supabase/ssr`) to get an auth-aware server client
- Verify `supabase.auth.getUser()` before any write (RLS is the backstop, but defense
  in depth means checking server-side too)

**`useActionState` import**: React 19 — `import { useActionState } from 'react'`
(not `'react-dom'` as in React 18's `useFormState`).

**Alternatives considered**:
- API routes: Extra indirection, no benefit over Server Actions for internal mutations.
- Direct Supabase client calls from client components for metadata: Works but bypasses
  server-side validation and loses typed action state.

---

## New dependency

- `@supabase/ssr` — required for `createServerClient` in middleware and server components.
  Install: `npm install @supabase/ssr`

## New env vars

- `ADMIN_EMAIL` — the site owner's email address, server-only (no `NEXT_PUBLIC_` prefix).
  Add to `.env.local` and Vercel environment variables (server-only).

## Supabase setup (manual, one-time)

- Create an auth user in Supabase dashboard → Authentication → Users for the owner's
  email + password.
- Add INSERT/UPDATE/DELETE RLS policies on `releases` and `beats` tables checking
  `auth.uid() = 'owner-uuid'`.
- Add a storage policy on `beats-audio` bucket allowing the owner to insert objects.

## Affected files

| File | Change |
|------|--------|
| `src/middleware.ts` | New — route protection, admin-only gate |
| `src/lib/supabase-server.ts` | New — `createServerClient` factory for server components and actions |
| `src/app/login/page.tsx` | New — sign-in form |
| `src/app/admin/page.tsx` | New — admin dashboard (links to forms) |
| `src/app/admin/releases/new/page.tsx` | New — new release form |
| `src/app/admin/beats/new/page.tsx` | New — new beat form (includes audio upload) |
| `src/app/actions/releases.ts` | New — Server Action: insert release |
| `src/app/actions/beats.ts` | New — Server Action: insert beat metadata |
| `package.json` | Add `@supabase/ssr` |
