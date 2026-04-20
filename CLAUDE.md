# seto-blog Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-19

## Active Technologies
- TypeScript 5 / Next.js 16.2.1 App Router + React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (existing) (004-soundcloud-autofill-ordering)
- Supabase PostgreSQL (existing `releases` + `beats` tables, each gains `sort_order`) (004-soundcloud-autofill-ordering)
- TypeScript 5 / Next.js 16.2.1 App Router + React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (existing), `next/font/google` (existing mechanism) (005-tools-ps2-grid)
- Supabase PostgreSQL — new `tools` table (005-tools-ps2-grid)
- TypeScript 5 / Next.js 16.2.1 App Router + React 19 + `@supabase/supabase-js` 2.x (existing, tools only), native Web APIs (HTMLAudioElement, SoundCloud Widget API) (010-public-release-prep)
- Static files in `public/downloads/` for drum kit zip and cover ar (010-public-release-prep)

- TypeScript 5 / Next.js 16.2.1 App Router + React 19, Tailwind CSS v4 (`@theme` directive), `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (new) (003-admin-auth-ingestion)
- Supabase (no schema changes in this feature) (002-beats-list-redesign)

## Project Structure

```text
src/
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5 / Next.js 16.2.1 App Router: Follow standard conventions

## Recent Changes
- 010-public-release-prep: Added TypeScript 5 / Next.js 16.2.1 App Router + React 19 + `@supabase/supabase-js` 2.x (existing, tools only), native Web APIs (HTMLAudioElement, SoundCloud Widget API)
- 005-tools-ps2-grid: Added TypeScript 5 / Next.js 16.2.1 App Router + React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (existing), `next/font/google` (existing mechanism)
- 004-soundcloud-autofill-ordering: Added TypeScript 5 / Next.js 16.2.1 App Router + React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (existing)


<!-- MANUAL ADDITIONS START -->
TypeScript 5 / Next.js 16.2.1: Follow standard conventions

## Recent Changes
- 010-public-release-prep: Added TypeScript 5 / Next.js 16.2.1 App Router + React 19 + `@supabase/supabase-js` 2.x (existing, tools only), native Web APIs (HTMLAudioElement, SoundCloud Widget API)


<!-- MANUAL ADDITIONS START -->
## Actual Project Structure

```text
src/
├── app/
│   ├── page.tsx          # Async server component — homepage, Supabase data fetch
│   ├── layout.tsx        # Root layout, Google Fonts, SoundCloud Widget API script
│   └── globals.css       # Tailwind v4 @theme tokens + ghost-panel, tracklist-panel, tag CSS
└── components/
    ├── HomeCatalog.tsx    # Client — mobile tab state
    ├── ReleasesCatalog.tsx / ReleaseCard.tsx / SoundCloudPlayer.tsx
    └── BeatsCatalog.tsx / BeatCard.tsx (exports BeatRow)
src/lib/
    ├── supabase.ts        # Supabase client (publishable key)
    └── types.ts           # Beat, Release TypeScript interfaces

specs/                     # speckit feature specs and plans
.specify/                  # speckit configuration and templates
```

## Actual Commands

```bash
npm run dev          # local dev server → http://localhost:3000
npm run build        # production build (TypeScript gate — must pass before commits)
```

## Design System

Contemporary Soft Club: Orbitron (headings), Exo 2 (body), Share Tech Mono (labels).
0px border radius everywhere. Palette: #EEF4F8 background, #2A6094 headings, #5A8AAA labels.
Use .ghost-panel or .tracklist-panel CSS classes for all containers.
<!-- MANUAL ADDITIONS END -->
