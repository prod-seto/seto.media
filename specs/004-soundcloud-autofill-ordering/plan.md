# Implementation Plan: SoundCloud Autofill & Catalog Ordering

**Branch**: `004-soundcloud-autofill-ordering` | **Date**: 2026-04-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-soundcloud-autofill-ordering/spec.md`

## Summary

Improve the release ingestion workflow by fetching metadata from a SoundCloud track
URL and autofilling the form, eliminating repetitive manual data entry. Add explicit
admin control over the display order of both releases and beats via up/down reordering
screens. Uses the SoundCloud oEmbed API (server-side, no auth) for metadata, a new
`sort_order` integer column on both tables, and Server Actions for saving order changes.
No new npm dependencies.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router
**Primary Dependencies**: React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (existing)
**Storage**: Supabase PostgreSQL (existing `releases` + `beats` tables, each gains `sort_order`)
**Testing**: `npm run build` + manual verification per quickstart.md
**Target Platform**: Browser + Vercel serverless (Server Actions)
**Project Type**: Web application — admin UX enhancement + schema migration
**Performance Goals**: oEmbed fetch under 3 seconds (single HTTP request from Vercel serverless); ordering save is a batch UPDATE of ≤20 rows
**Constraints**: No new third-party JS dependencies (constitution IV); Server Action required for oEmbed fetch (CORS blocks browser-side calls to soundcloud.com/oembed)
**Scale/Scope**: Single admin user; ~20 items in each catalog; 5 new files, 3 modified files

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. Component Quality | Server Actions for mutations; client components for UI state; no new abstractions for one-off operations. | ✅ Pass — oEmbed fetch and order saves are Server Actions; ordering pages are client components owning local array state. |
| II. Design System Fidelity | `ghost-panel`, Orbitron/Exo 2/Share Tech Mono, 0px border radius, blue-teal palette. | ✅ Pass — ordering and autofill UI use existing admin panel pattern. |
| III. Testing Standards | `npm run build` must pass. Autofill, ordering, and homepage display manually verified. | ✅ Pass — quickstart.md covers all three user stories. |
| IV. Performance Requirements | No new external JS; oEmbed called server-side only (triggered by user action, not on page load). | ✅ Pass — zero new client-side dependencies. oEmbed fetch is an on-demand Server Action. |
| V. Data Integrity | `sort_order` typed via regenerated `database.types.ts`; RLS unchanged (existing owner update policies cover the new column). | ✅ Pass — `npm run db:types` regenerates types; no raw `any`. |

**UX Consistency**: Tag filtering in BeatsCatalog is unaffected — it filters the
already-ordered array. Single-play coordination is unaffected.

## Project Structure

### Documentation (this feature)

```text
specs/004-soundcloud-autofill-ordering/
├── plan.md              ← this file
├── spec.md              ← feature specification
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
└── checklists/
    └── requirements.md
```

### Source Code (new and modified files)

```text
src/
├── proxy.ts                                        ← unchanged
├── lib/
│   ├── database.types.ts                           ← REGENERATED (adds sort_order)
│   ├── supabase.ts                                 ← unchanged
│   ├── supabase-server.ts                          ← unchanged
│   └── supabase-browser.ts                         ← unchanged
├── app/
│   ├── page.tsx                                    ← MODIFIED: ORDER BY sort_order ASC
│   └── admin/
│       ├── page.tsx                                ← MODIFIED: add ordering links
│       ├── releases/
│       │   ├── new/
│       │   │   └── page.tsx                        ← MODIFIED: add URL fetch + autofill step
│       │   └── order/
│       │       └── page.tsx                        ← NEW: release ordering UI
│       └── beats/
│           └── order/
│               └── page.tsx                        ← NEW: beat ordering UI
└── actions/
    ├── soundcloud.ts                               ← NEW: fetchSoundCloudMetadata Server Action
    ├── ordering.ts                                 ← NEW: updateReleasesOrder + updateBeatsOrder
    ├── releases.ts                                 ← unchanged
    └── beats.ts                                    ← unchanged
```

## Implementation Design

### SoundCloud autofill flow

```
Admin pastes URL → clicks "Fetch Metadata"
  ↓
fetchSoundCloudMetadata(url) [Server Action]
  ↓
  fetch(`https://soundcloud.com/oembed?format=json&url=${encodedUrl}`)
  ├── HTTP error / non-200 → return { error: "Could not fetch track metadata" }
  ├── URL is not a track (playlist, profile) → return { error: "URL must be a track" }
  └── Success → return { title, artist, coverUrl }
  ↓
Form fields populated with returned values (title, artist, cover_url)
Admin reviews, edits if needed, submits normally via existing createRelease action
```

The `fetchSoundCloudMetadata` action is called via `startTransition` with a loading
state shown while the fetch runs. On error, an inline message appears below the URL
field; all form fields remain editable.

### Ordering flow

```
Admin navigates to /admin/releases/order (or /admin/beats/order)
  ↓
Page loads all items (visible + hidden) ordered by sort_order ASC
  ↓
Admin uses ↑/↓ buttons to rearrange local state (array splice, no server call yet)
  ↓
Admin clicks "Save Order"
  ↓
updateReleasesOrder(ids) [Server Action]
  ids = array of IDs in desired order
  ↓
  For each id at index i: UPDATE releases SET sort_order = (i + 1) WHERE id = id
  ↓
  Return { success: true } or { success: false; error: string }
  ↓
Success: show confirmation; state reflects saved order
```

### Homepage query change

```ts
// Before:
.order("released_at", { ascending: false })
.order("created_at", { ascending: false })

// After:
.order("sort_order", { ascending: true })
```

Applied to both releases and beats queries in `src/app/page.tsx`.

### Admin dashboard additions

`src/app/admin/page.tsx` gains two new links alongside the existing ones:
- "REORDER RELEASES" → `/admin/releases/order`
- "REORDER BEATS" → `/admin/beats/order`

## Complexity Tracking

No constitution violations. The only notable decision is the choice of up/down buttons
over drag-and-drop (justified in research.md Decision 2 — @dnd-kit rejected due to
the no-new-dependencies constraint; native DnD rejected due to poor touch and
accessibility support).
