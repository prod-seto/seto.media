<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0

MAJOR changes (breaking redefinition of non-negotiable rules):
  - Principle II: Typography completely replaced.
    Orbitron + Exo 2 + Share Tech Mono → Unifont (single self-hosted typeface).
    New type scale system with five CSS classes replaces inline font style objects.
    Capitalisation rules introduced (uppercase only on .type-label).

MINOR changes (new guidance added):
  - Principle II: Panel inventory updated; hero-panel documented as defined but inactive.
  - Principle V: Updated to reflect database.types.ts as the generated type source.
  - UX Consistency: SiteNav documented; homepage structure updated.
  - Development Workflow: speckit workflow and branch naming convention added.

PATCH changes (clarifications and corrections):
  - HomeCatalog.tsx noted as retaining a stale font reference (known gap).
  - Responsive breakpoints documented for both catalog grid and tools grid.
  - Admin section acknowledged.

Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check section still compatible.
  ✅ .specify/templates/spec-template.md — No constitution references; compatible.
  ✅ .specify/templates/tasks-template.md — Task phases compatible with Principle III.

Follow-up TODOs:
  None — all known gaps resolved.
-->

# seto.media Constitution

## Core Principles

### I. Component Quality

Every component MUST have a single, clearly stated responsibility. Components that mix
data-fetching, layout, and interaction logic MUST be split. Server components handle
data; client components handle state and interaction.

- No speculative abstractions: helpers and utilities are created only when used in 3+
  places. A one-off operation lives inline.
- No dead code: unused imports, props, variables, and exports MUST be removed.
- TypeScript strict mode is non-negotiable. All props, return types, and Supabase
  query results MUST be fully typed. Use the `Tables<"table_name">` utility from
  `src/lib/database.types.ts`, or the re-exported aliases in `src/lib/types.ts`
  (`Release`, `Beat`). Raw `any` types on query results are not permitted.
- No backwards-compatibility shims for removed features. Delete cleanly.

**Rationale**: The codebase is small and solo-maintained. Premature abstraction and
accumulated dead code are the primary risks to long-term velocity.

### II. Design System Fidelity

Every UI element MUST conform to the seto.media design system without exception.
Non-conforming UI MUST NOT be merged.

#### Palette
Cool blue-teal-lavender spectrum only. No warm tones, no black, no pure white solid
backgrounds.

| Token | Hex | Usage |
|---|---|---|
| Page background | `#EEF4F8` | `body` background |
| Accent | `#5A9ED4` | Geometry, interactive elements, borders |
| Heading | `#2A6094` | Primary text, headings |
| Label / secondary | `#5A8AAA` | Labels, secondary text, metadata |
| Mid | `#2E6080` | Body copy |

#### Typography — Unifont

The site uses **Unifont** as its sole typeface, self-hosted from
`/public/fonts/unifont-17.0.04.otf` and loaded via `@font-face` in `globals.css`.
No other typefaces may be introduced.

The five type scale classes MUST be used for all text. Direct `fontFamily` inline
styles are not permitted in new code; existing stale inline references MUST be
migrated to these classes:

| Class | Font | Weight | Size | Usage |
|---|---|---|---|---|
| `.type-display` | Unifont | 400 | contextual | Page-level and section display headings |
| `.type-display-italic` | Unifont | 400 italic | contextual | Atmospheric / emotional emphasis only |
| `.type-subheading` | Unifont | 400 | 14–24px | Section titles, card titles, item names |
| `.type-body` | Unifont | 400 | 18px | Body copy, descriptions, empty states |
| `.type-label` | Unifont | 400 | 15px | Mono labels, metadata, wayfinding, tags |

**Capitalisation rules** — these are non-negotiable:
- `text-transform: uppercase` is ONLY permitted on elements using `.type-label`.
  All other elements MUST NOT have uppercase transforms.
- Headings use sentence case (first letter capitalised, rest lowercase).
- The `.type-label` class handles uppercasing automatically — text content in label
  elements MUST be written in lowercase in JSX so the rule is explicit.
- Brand name "SETO" in the navbar is exempt as a proper noun / logotype.

**Weight rule**: No `fontWeight` above 400 on any heading, title, or display element.
Bold is not part of the type system.

**Italic rule**: Italic is stylistic and atmospheric only. Never use italic on UI
labels, buttons, or navigation elements.

#### Panels

All major content containers MUST use one of these CSS classes:

| Class | Usage |
|---|---|
| `.ghost-panel` | Default card / panel (semi-transparent white + border + TL/BR corner brackets) |
| `.tracklist-panel` | Beat list panel (same as ghost-panel, larger TL bracket to frame play column) |

No drop shadows anywhere. No rounded corners (`border-radius: 0px` everywhere).

#### Responsive breakpoints

| Grid | Rule |
|---|---|
| `.catalog-grid` | 2 columns ≥ 680px; 1 column + tab switcher < 680px |
| `.tools-grid` | 3 columns > 768px; 2 columns ≤ 768px; 1 column ≤ 680px |
| Max content width | `960px`, centred, `padding: 0 40px` |

### III. Testing Standards

`npm run build` MUST pass with zero TypeScript errors before any commit. This is the
minimum automated gate.

- **Visual review**: Every UI change MUST be visually verified in the browser at both
  desktop (≥960px) and mobile (≤680px) widths before the change is considered done.
- **Audio features**: Play, pause, seek, single-play coordination (only one track plays
  at a time), and visualizer activation MUST be manually verified after any change to
  audio player components.
- **No mocking audio or browser APIs** in tests. Web Audio API and SoundCloud Widget
  API have browser-specific behaviour that mocks will not catch.
- Automated unit tests are optional and additive; they do not replace the build gate
  or manual verification steps above.

**Rationale**: This is a client-heavy media site. The most critical bugs (audio not
playing, visualizers dead, layout breaking on mobile) are caught by manual review,
not unit tests.

### IV. Performance Requirements

- **No blocking renders**: Data fetching MUST occur in async server components.
  Client components receive pre-fetched data as props.
- **Audio context laziness**: `AudioContext` and `AnalyserNode` MUST be initialized
  only inside a user-gesture handler (first play), never on mount. This satisfies
  browser autoplay policies.
- **RAF loop hygiene**: Every `requestAnimationFrame` loop started on mount MUST be
  cancelled in the `useEffect` cleanup function. Loops MUST re-queue even when their
  canvas target is null, so they remain alive across conditional renders.
- **Asset sizing**: Audio files served from Supabase Storage MUST be MP3 format,
  encoded at VBR ~190 kbps (`-qscale:a 2`). No WAV or lossless formats in production.
- **Page weight**: No new third-party JavaScript dependencies may be added without
  explicit justification. The SoundCloud Widget API script is loaded via
  `next/script strategy="afterInteractive"` and is the only permitted external script.
  Unifont is self-hosted and does not count as an external dependency.

**Rationale**: Audio playback and real-time visualisers are performance-sensitive.
Sloppy resource management causes audible glitches and battery drain on mobile.

### V. Data Integrity

- All Supabase table queries MUST use generated types from `src/lib/database.types.ts`
  via the `Tables<"table_name">` utility. Re-exported aliases (`Release`, `Beat` from
  `src/lib/types.ts`) are preferred for brevity in component code.
- `database.types.ts` is generated from the live Supabase schema. It MUST be
  regenerated and committed whenever the schema changes. Never edit it manually.
- Row Level Security (RLS) MUST be enabled on all tables. Public read policies are
  scoped to `is_visible = true` rows only.
- Schema changes MUST be applied via the Supabase dashboard SQL Editor and
  `database.types.ts` regenerated before the corresponding code change is committed.
  A type error in production caused by a schema/types mismatch is a process failure.
- `audio_url` and `soundcloud_url` values in the database are the authoritative source
  of truth for media locations. Hardcoded URLs in component code are not permitted.

**Rationale**: Data bugs (wrong URLs, missing visibility flags, untyped results,
schema/types skew) are silent failures that are hard to debug. The generated schema
is the contract.

## UX Consistency

These rules ensure the site behaves predictably and cohesively across all pages.

### Site Navigation

Every public page MUST render `<SiteNav />` above its content. SiteNav is a
`"use client"` component that uses `usePathname()` for active link detection.

- Left side: SETO logotype (spinning logo + wordmark). "SETO" in `.type-display`;
  ".MEDIA" in `.type-display-italic` styled in the accent colour `#5A9ED4`.
- Right side: HOME and TOOLS nav links using `.type-label` (DM Mono uppercase).
  Active link colour: `#2A6094`. Inactive: `#5A8AAA`.
- SiteNav MUST be added to `src/app/layout.tsx`, not repeated in individual pages.
- Admin pages at `/admin/**` and the login page at `/login` are exempt from SiteNav.

### Homepage

The homepage renders only `<SiteNav />` and `<HomeCatalog />`. There is no hero
panel, no tools teaser, and no promotional sections. The catalog is the homepage.

### Audio playback

- **Single-play**: Only one audio track (beat or release) MAY play at a time across
  the entire page. Module-level coordination variables (`currentAudio`, `currentWidget`)
  enforce this within each player type. Cross-type coordination (beat pausing a release
  and vice versa) is a known gap and MUST be addressed before any public launch.
- **Empty states**: Every catalog section MUST render a readable empty-state message
  when its data array is empty. Silent blank sections are not acceptable.

### Beat tag filtering

Selecting a tag in the BeatsCatalog filter bar MUST filter the beat list immediately
(no submit button). Clicking the same tag again deselects it. The "× clear" button
MUST restore the full unfiltered list.

## Admin Section

The admin section at `/admin` is a separate, authenticated surface for content
management (tools, beats, releases). It is protected by the login page at `/login`.

- Admin pages do not use `SiteNav` and are exempt from the public design system rules,
  though they should use the same palette and ghost-panel components where practical.
- Admin Server Actions live in `src/app/actions/`. They use the server-side Supabase
  client (`src/lib/supabase-server.ts`) and MUST NOT be called from public pages.
- The admin surface is not indexed and not linked from any public page.

## Development Workflow

### Feature development — speckit

All non-trivial features MUST follow the speckit workflow:
1. `/speckit.specify` — write the feature spec
2. `/speckit.clarify` — resolve ambiguities
3. `/speckit.plan` — produce the implementation plan, data model, and contracts
4. `/speckit.tasks` — generate the task breakdown
5. `/speckit.implement` — execute tasks in phase order

Specs, plans, and task files live in `specs/NNN-feature-name/`. Do not commit
implementation code without a corresponding spec unless the change is a trivial fix.

### Branch naming

Feature branches follow the pattern `NNN-short-feature-name` where `NNN` is the
next sequential feature number (e.g., `008-tools-page-redesign`). Branch numbers
are assigned by the speckit `create-new-feature` script and MUST NOT be reused.

### Commits and pushes

- Each commit MUST represent a working, buildable state (`npm run build` passing).
- Commit message format: `type: short description (feature NNN)` where type is one
  of `feat`, `fix`, `design`, `chore`, `docs`. Feature reference preferred.
- **No force pushes to main**: `main` is the production branch (deployed to Vercel).
  Destructive git operations on `main` are prohibited.

### Environment variables

- `NEXT_PUBLIC_` prefixed vars are safe for client-side use.
- `SUPABASE_SECRET_KEY` MUST remain server-only and MUST NOT be committed or exposed
  in client bundles.

## Governance

This constitution supersedes all other informal conventions. When a conflict exists
between a code pattern in the repository and a rule stated here, this document wins
and the code MUST be updated.

**Amendment procedure**:
1. Identify the principle or section to change and the reason.
2. Update this file, increment the version per semantic versioning rules.
3. Update `LAST_AMENDED_DATE` to the amendment date.
4. Commit with message: `docs: amend constitution to vX.Y.Z — <summary>`.

**Versioning policy**:
- MAJOR: A principle is removed or its non-negotiable rules are redefined incompatibly.
- MINOR: A new principle or section is added, or existing guidance is materially expanded.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance**: All implementation work (plan, spec, tasks) MUST reference the
Constitution Check section in `plan-template.md` and verify gates before Phase 0.

**Version**: 2.0.0 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-18
