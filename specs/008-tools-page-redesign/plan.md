# Implementation Plan: Tools Page Redesign + Site Navbar

**Branch**: `008-tools-page-redesign` | **Date**: 2026-04-18 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/008-tools-page-redesign/spec.md`

## Summary

Replace the PS2 disc grid on `/tools` with a simple ghost-panel `ToolCard` grid (3-col desktop, 2-col tablet, 1-col mobile), and add a slim site-wide `SiteNav` component to `src/app/layout.tsx` that carries the SETO.MEDIA wordmark (left) and nav links (right). The homepage hero panel and "VIEW TOOLS →" teaser are removed. No schema changes required.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router + React 19  
**Primary Dependencies**: `@supabase/supabase-js` 2.x, `@supabase/ssr`, `next/font/google` (all existing)  
**Storage**: Supabase PostgreSQL — `tools` table (no schema changes)  
**Testing**: `npm run build` (TypeScript gate) + manual visual review at desktop ≥960px and mobile ≤680px  
**Target Platform**: Web / Vercel  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Standard web — no new third-party JS, data fetching stays in async server components  
**Constraints**: 0px border radius everywhere; no new external scripts; build must pass TypeScript strict  
**Scale/Scope**: Small site — ~5–10 tools expected initially

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Quality | ✅ PASS | `SiteNav` (client — needs `usePathname`) and `ToolCard` (server-renderable) have single responsibilities. Data fetching stays in `tools/page.tsx` async server component. |
| II. Design System Fidelity | ✅ PASS | Ghost-panel, 0px border radius, Orbitron/Exo2/Share Tech Mono, blue-teal palette — all required by spec. |
| III. Testing Standards | ✅ PASS | Build gate + visual review at desktop/mobile required before merge. |
| IV. Performance | ✅ PASS | No new external JS. Supabase query stays in async server component. |
| V. Data Integrity | ✅ PASS | Tools query typed via `database.types.ts`. No RLS changes needed — `is_visible` filter already in place. |

No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/008-tools-page-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── components.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx              # MODIFY — add <SiteNav /> to root layout
│   ├── page.tsx                # MODIFY — remove hero panel + tools teaser + TOOLS divider
│   └── tools/
│       └── page.tsx            # MODIFY — replace DiskCard with ToolCard, update header
├── components/
│   ├── SiteNav.tsx             # NEW — slim site-wide navbar (client component)
│   ├── ToolCard.tsx            # NEW — simple ghost-panel tool card (server-renderable)
│   └── DiskCard.tsx            # RETIRE from public tools page (keep file; admin still references it)
└── app/
    └── globals.css             # MODIFY — update .tools-grid breakpoints to 3/2/1 col
```

**Structure Decision**: Single Next.js project (existing structure). New components follow the existing pattern in `src/components/`. `SiteNav` must be a client component for `usePathname`. `ToolCard` is a pure presentational component and can be server-renderable (no client hooks needed).

## Complexity Tracking

> No constitution violations — section not applicable.
