# Tasks: Admin Auth & Content Ingestion

**Input**: Design documents from `specs/003-admin-auth-ingestion/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

**Tests**: Not requested. Gate is `npm run build` + manual verification per quickstart.md.

**Organization**: US1 (auth) is foundational — US2 and US3 depend on it. Once US1 is
complete, US2 (release form) and US3 (beat form) can be implemented in parallel since
they touch different files. Within each story, the Server Action must be written before
the form that calls it.

**Important pre-implementation steps**: The one-time Supabase setup in quickstart.md
(create auth user, run RLS policies, storage policy) must be completed before US1 can
be tested end-to-end.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Install the one new package and add the required server-only env var.

- [x] T001 Install `@supabase/ssr` by running `npm install @supabase/ssr` and verifying it appears in `package.json` dependencies
- [x] T002 Add `ADMIN_EMAIL=<your-email>` to `.env.local` (server-only, no `NEXT_PUBLIC_` prefix); confirm `.env.local` is in `.gitignore`

**Checkpoint**: `npm run build` must still pass after T001.

---

## Phase 2: Foundational — Server Client + Middleware

**Purpose**: The `createSupabaseServerClient` factory and the route-guard middleware
are shared infrastructure required by all three user stories. No story work can begin
until both are in place.

**⚠️ CRITICAL**: US1, US2, and US3 all depend on this phase being complete.

- [x] T003 Create `src/lib/supabase-server.ts` — export a `createSupabaseServerClient()` function that uses `createServerClient` from `@supabase/ssr` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; the cookie adapter must call `cookies()` from `next/headers` using `getAll`/`setAll` methods; this factory is used in middleware and Server Actions only (never in client components)
- [x] T004 Create `src/middleware.ts` at the repo `src/` root — import `createServerClient` from `@supabase/ssr`; on every request to `/admin/:path*`, call `supabase.auth.getUser()`; if no user redirect to `/login`; if `user.email !== process.env.ADMIN_EMAIL` redirect to `/`; otherwise return the supabaseResponse object (not a new `NextResponse.next()`); set `export const config = { matcher: ['/admin/:path*'] }`

**Checkpoint**: With T003 and T004 in place, navigating to `/admin` while signed out
must redirect to `/login`. `npm run build` must pass.

---

## Phase 3: User Story 1 — Admin Sign-In (Priority: P1)

**Goal**: The site owner can sign in at `/login`, reach `/admin`, and sign out. All
other visitors are blocked from `/admin`.

**Independent Test**: Navigate to `/admin` while signed out → redirected to `/login`.
Sign in with owner credentials → lands on `/admin`. Sign out → blocked again.

- [x] T005 [US1] Create `src/app/login/page.tsx` — `'use client'` component with a `ghost-panel` form containing email input, password input, and a submit button styled per the design system; on submit call `supabase.auth.signInWithPassword({ email, password })` using the existing singleton client from `src/lib/supabase.ts`; on success `router.push('/admin')`; on error display an inline error message below the form; the page must not be accessible (redirect to `/admin`) if the user is already signed in
- [x] T006 [US1] Create `src/app/admin/page.tsx` — async server component; fetch the current user via `createSupabaseServerClient()` and `supabase.auth.getUser()`; render an admin dashboard `ghost-panel` with: an Orbitron heading "ADMIN", two navigation links to `/admin/releases/new` and `/admin/beats/new` styled as `.tag` buttons, and a `SignOutButton` client component island (defined inline or in a sibling file) that calls `supabase.auth.signOut()` on the existing singleton client and then `router.push('/login')`

**Checkpoint**: Full auth flow works end-to-end per quickstart.md US1 checklist.

---

## Phase 4: User Story 2 — Add a New Release (Priority: P2)

**Goal**: The admin can fill out the new release form and have it appear on the homepage.

**Independent Test**: Sign in → `/admin/releases/new` → submit all fields → navigate
to homepage → release appears in releases column.

> T007 (Server Action) and T009 (beats Server Action in Phase 5) touch different files
> — they can be written in parallel.

- [x] T007 [US2] Create `src/app/actions/releases.ts` — `'use server'` file; export `createRelease(prevState: unknown, formData: FormData)` async function; call `createSupabaseServerClient()` and verify `supabase.auth.getUser()` returns the owner (return error state if not); extract title, artist, type, soundcloud_url, cover_url, released_at, is_visible from formData; validate title and artist are non-empty (return field-level error state if not); generate a unique slug from the title (lowercase + hyphens; check for collision in `releases` table and append `-2`, `-3` etc. if needed); insert into `releases` table using the server client; return success state with the new record id
- [x] T008 [US2] Create `src/app/admin/releases/new/page.tsx` — `'use client'` component; use `useActionState(createRelease, null)` (imported from `'react'`) to wire the form to the Server Action; render a `ghost-panel` form with labeled inputs for all fields per `data-model.md` (title required, artist required, type select with options single/ep/album, SoundCloud URL optional, cover URL optional, release date optional, is_visible checkbox defaulting to true); show inline field errors from action state; on success state show a confirmation message with a link to the homepage; all inputs use Share Tech Mono or Exo 2 styling per the design system

**Checkpoint**: Submit the form → release appears on homepage. Empty title → inline
error shown, not submitted.

---

## Phase 5: User Story 3 — Add a New Beat (Priority: P2)

**Goal**: The admin can fill out the new beat form, upload an MP3, and have the beat
appear as a playable row on the homepage.

**Independent Test**: Sign in → `/admin/beats/new` → submit with title, BPM, key,
tags, and MP3 file → navigate to homepage → beat appears, is playable, tags show in
filter bar.

> T009 can be written in parallel with T007 (Phase 4). T010 depends on T009.

- [x] T009 [US3] Create `src/app/actions/beats.ts` — `'use server'` file; export `createBeat(prevState: unknown, formData: FormData)` async function; call `createSupabaseServerClient()` and verify the owner session; extract title, bpm, key, tags (comma-separated string → split into `string[]`), audio_url (already-uploaded storage path passed by client), is_visible from formData; validate title is non-empty and audio_url is present; generate a unique slug; insert into `beats` table; return success or error state
- [x] T010 [US3] Create `src/app/admin/beats/new/page.tsx` — `'use client'` component; maintain local state for: the selected `File` object, upload error, and uploading flag; render a `ghost-panel` form with labeled inputs for title (required), BPM (number, optional), key (text, optional), tags (text, optional — comma-separated hint), is_visible checkbox, and a file input restricted to `accept="audio/*"`; on form submit: (1) validate title non-empty and file selected, (2) upload the file via `supabase.storage.from('beats-audio').upload(\`${userId}/${slugifiedTitle}.mp3\`, file, { upsert: false })` from the existing singleton client — show uploading state and handle errors, (3) on successful upload call `createBeat` Server Action via `startTransition` passing the storage path as `audio_url`; show inline errors and success confirmation with homepage link

**Checkpoint**: Full beat flow works end-to-end per quickstart.md US3 checklist.
Non-audio file upload is rejected. Beat is playable on homepage.

---

## Phase 6: Polish & Verification

- [x] T011 Run `npm run build` and confirm zero TypeScript errors
- [x] T012 [P] Verify auth flow (US1) per `specs/003-admin-auth-ingestion/quickstart.md` — all US1 checklist items
- [x] T013 [P] Verify release form (US2) per `specs/003-admin-auth-ingestion/quickstart.md` — all US2 checklist items
- [x] T014 [P] Verify beat form (US3) per `specs/003-admin-auth-ingestion/quickstart.md` — all US3 checklist items

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (T001–T002)**: No dependencies — run immediately
- **Phase 2 (T003–T004)**: Depends on T001 (package must be installed); T004 depends on T003
- **Phase 3 (T005–T006)**: Depends on Phase 2
- **Phase 4 (T007–T008)**: Depends on Phase 2; T008 depends on T007
- **Phase 5 (T009–T010)**: Depends on Phase 2; T010 depends on T009
- **Phase 6 (T011–T014)**: Depends on Phases 3, 4, and 5

### Parallel Opportunities

```bash
# After Phase 2 completes, US2 and US3 Server Actions can be written together:
T007: src/app/actions/releases.ts   [US2]
T009: src/app/actions/beats.ts      [US3]  ← parallel with T007

# After T007 and T009 complete, forms can be written in parallel:
T008: src/app/admin/releases/new/page.tsx  [US2]
T010: src/app/admin/beats/new/page.tsx     [US3]  ← parallel with T008

# Verification tasks are all parallel:
T012, T013, T014  ← run after T011 build gate
```

---

## Implementation Strategy

### MVP (US1 only — auth gate)

1. T001 + T002 (setup)
2. T003 + T004 (foundational)
3. T005 + T006 (US1 login + dashboard)
4. T011 build + T012 auth verification
5. **STOP** — admin area is secured. Content ingestion comes next.

### Full delivery

1. Setup + Foundational (T001–T004)
2. US1 (T005–T006) → verify auth
3. US2 + US3 in parallel (T007 ‖ T009, then T008 ‖ T010)
4. Build gate + full verification (T011–T014)

---

## Notes

- `src/lib/supabase-server.ts` uses `@supabase/ssr` `createServerClient`; the existing
  `src/lib/supabase.ts` singleton is unchanged and still used for all client-side and
  public server reads
- Audio upload goes directly browser → Supabase Storage (not through a Server Action)
  due to Vercel's 4.5 MB function body limit — see research.md Decision 3
- `useActionState` is imported from `'react'` (React 19), not `'react-dom'`
- The middleware must return the `supabaseResponse` object it creates — returning a
  fresh `NextResponse.next()` will break session refresh and log users out
- Always call `supabase.auth.getUser()`, never `getSession()`, in server-side code
- `@supabase/storage-js` `FileOptions` does not include `onUploadProgress` in v0.10 —
  upload progress is shown as a simple loading state, not a percentage bar
