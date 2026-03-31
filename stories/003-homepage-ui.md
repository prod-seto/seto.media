# Story 003 — Homepage UI

## Objective
Replace the homepage placeholder stubs with real, data-driven
beats and releases columns — so visitors can browse and play
content directly from the seto.media homepage.

## Scope
**In scope:**
- Two-column layout: Beats (right), Releases (left)
- Beats column: list of beat cards with tags, filterable by
tag
- Releases column: list of release cards
- Data fetched from Supabase `beats` and `releases` tables

**Out of scope:**
- Tools section (later story)
- Auth / admin (later story)
- Beat purchase / licensing flow (later story)

## Data
- Source: `beats` and `releases` tables (story 002)
- Types: `Beat`, `Release` from `src/lib/types.ts`
- Fetch pattern: Supabase client in Next.js server component
  (see `src/lib/supabase.ts`)

## UI / UX

### Layout
- Desktop: two equal columns side by side, independently
scrollable
- Mobile: [single column stacked? beats on top? or tabs?] Let's go with tabs
- Max width: 960px (matches current layout)
- The seto.media hero header stays

### Beat card
Each beat card should show:
- Title
- BPM · Key · Genre
- Tags (clickable, filter the beats column)
- Play button
- Cover image (cover_url is in schema, not sure if in schema yet)

### Release card
Each release card should show:
- Title
- Artist name
- Type (single / EP / album)
- Play button
- Cover image (cover_url is in schema, currently null in seed
  data)

### Tag filtering
- Clicking a tag filters the beats column to show only beats
  with that tag
- Client-side filter
- How to clear the filter?
  - Selected tags should appear above list. Can all be removed with one button click, or remove one tag at a time by clicking each tag separately

### Playback
- [ ] Custom player inside beat card
- [ ] Custom player inside release card
- [ ] Custom play button plays music directly on the homepage

## Reference Files
- `src/lib/supabase.ts` — data fetching client
- `src/lib/types.ts` — Beat and Release types
- `src/app/page.tsx` — current homepage structure to build on
- `src/components/BracketCard.tsx` — ghost panel pattern
- `src/components/Divider.tsx` — divider pattern
- `resources/contemporary-soft-club-full-spec.md` — design
system

## Design
- Ghost panels (`rgba(255,255,255,0.40)`) for each card
- Beat cards: Share Tech Mono overline, Orbitron title, Exo 2
body
- Tags: `.tag` CSS class (already defined in globals.css)
- Active tag: blue accent border + background tint
- All uppercase display text, 0px border radius everywhere

## Integration Points
- [ ] No new routes — all on homepage `/`
- [ ] No new env vars
- [ ] No schema changes

## Acceptance Criteria
- [ ] Homepage shows real beats from Supabase
- [ ] Homepage shows real releases from Supabase
- [ ] Clicking a tag filters the beats list
- [ ] Clearing the tag filter restores full list
- [ ] Empty state handled (no beats / no releases)
- [ ] `npm run build` passes

## Out of Scope / Follow-on
- Pagination (if catalog grows large)
- Sorting / ordering controls
- Individual beat or release detail pages
