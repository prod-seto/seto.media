# Implementation Plan: PS2 Disc Redesign

**Branch**: `006-ps2-disc-redesign` | **Date**: 2026-04-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-ps2-disc-redesign/spec.md`

## Summary

Rebuild `DiskCard.tsx` to render authentic PS2 disc anatomy (art zone, info band, brand bar, hub ring, rim ring) using `resources/ps2-disc-spec.md` as the authoritative layout reference. Tool names move from below the disc to on-disc as the game title. A new `SetoLogo.tsx` inline SVG component provides the fixed SETO COMPUTER ENTERTAINMENT publisher logo. Twelve new columns are added to the `tools` table to support all configurable props. The `updateToolDisk` Server Action and admin edit page are updated to handle the full set of configurable fields.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router + React 19
**Primary Dependencies**: `@supabase/supabase-js` 2.x, `@supabase/ssr`, `next/font/google` (all existing)
**Storage**: Supabase PostgreSQL — `tools` table (12 new columns via ALTER TABLE)
**Testing**: `npm run build` (zero TypeScript errors) + manual browser verification per `quickstart.md`
**Target Platform**: Web — Vercel deployment, modern browsers
**Project Type**: Web application (Next.js)
**Performance Goals**: Standard web page load; disc images loaded via native `<img>` with no blocking
**Constraints**: No new third-party JS dependencies; constitution compliance required
**Scale/Scope**: 3 tools currently; disc component and admin page touch single feature area

**Files to rebuild (not greenfield)**:
- `src/components/DiskCard.tsx` — full rewrite; was a placeholder with label below disc
- `src/app/actions/tools.ts` (`updateToolDisk`) — extend data type to accept 12 new fields
- `src/app/admin/tools/[id]/edit/page.tsx` — add controls for all new configurable props

**New files**:
- `src/components/SetoLogo.tsx` — inline SVG React component for the publisher logo

**Supabase client patterns** (same as feature 005):
- `src/lib/supabase.ts` — anonymous reads in Server Components (`/tools`, `/tools/[slug]`)
- `src/lib/supabase-browser.ts` — auth check in `'use client'` admin pages
- `src/lib/supabase-server.ts` — authenticated writes in Server Actions

## Constitution Check

*Gate: Must pass before Phase 0. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Component Quality | ✅ PASS | DiskCard has one responsibility (render disc); Server/client split preserved |
| II. Design System Fidelity | ✅ PASS (with justified exceptions — see below) | |
| III. Testing Standards | ✅ PASS | `npm run build` + manual visual verification required |
| IV. Performance Requirements | ✅ PASS | Server component data fetch unchanged; no new third-party deps |
| V. Data Integrity | ✅ PASS | ALTER TABLE + `npm run db:types`; RLS unchanged; typed via `Tables<"tools">` |

**Justified exceptions to Principle II**:

1. **Warm tones in SetoLogo.tsx**: The SETO COMPUTER ENTERTAINMENT logo uses orange/gold gradient inside the diamond icon, replicating the Sony Computer Entertainment visual identity. This warm palette is isolated to `SetoLogo.tsx` and rendered only inside the disc's info band. It does not appear in any site panel, page background, or navigation element. Exception justified: brand asset with intentional distinct identity.

2. **Dark backgrounds inside disc zones**: `resources/ps2-disc-spec.md` specifies `brandBarColor: #0a0a0a` (near-black) for the brand bar and a dark background for the info band. These are interior to the disc element, which is a self-contained PS2-reference artifact. The disc's zones follow the PS2 design spec intentionally and do not affect the site's panel or page palette. Exception justified: the disc is a thematic artifact, not a site UI panel.

3. **clip-path: circle(50%)**: Established as a justified exception in feature 005. A disc is a semantic circle, not a decorative rounded corner. `clip-path` is not `border-radius`. Exception already documented.

4. **PS2 typefaces (Turret Road, Chakra Petch, Teko)**: Established as justified exceptions in feature 005. Scoped exclusively to the disc component via inline `fontFamily` styles. Already loaded as CSS variables in `layout.tsx`. Exception already documented.

## Project Structure

### Documentation (this feature)

```text
specs/006-ps2-disc-redesign/
├── plan.md              ← this file
├── research.md          ← Phase 0 output (10 decisions)
├── data-model.md        ← Phase 1 output (schema + mapping)
├── quickstart.md        ← Phase 1 output (SQL + verification checklists)
├── checklists/
│   └── requirements.md
└── tasks.md             ← Phase 2 output (created by /speckit-tasks)
```

### Source Code (affected files)

```text
src/
├── components/
│   ├── DiskCard.tsx              ← REBUILD — full zone anatomy
│   └── SetoLogo.tsx              ← NEW — inline SVG publisher logo
├── app/
│   ├── actions/
│   │   └── tools.ts              ← EXTEND — updateToolDisk accepts 12 new fields
│   └── admin/
│       └── tools/
│           └── [id]/
│               └── edit/
│                   └── page.tsx  ← EXTEND — all new configurable prop controls
└── app/
    └── globals.css               ← EXTEND — disc zone CSS classes

src/lib/
└── database.types.ts             ← REGENERATED via npm run db:types after ALTER TABLE
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Warm tones in SetoLogo (Principle II) | SETO CE logo is a brand asset replicating Sony CE style with orange/gold gradient | A cool-toned logo would not match the source material; the logo is semantically a parody of a specific real-world brand identity |
| Dark backgrounds in disc zones (Principle II) | PS2 disc spec mandates near-black brand bar (`#0a0a0a`) and dark info band | Using the site's pale palette inside disc zones would make the disc look nothing like a real PS2 disc — defeating the purpose of this feature |
