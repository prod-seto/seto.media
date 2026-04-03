<!--
SYNC IMPACT REPORT
==================
Version change: [unversioned template] → 1.0.0
New constitution — initial ratification.

Principles added:
  I.   Component Quality
  II.  Design System Fidelity
  III. Testing Standards
  IV.  Performance Requirements
  V.   Data Integrity

Sections added:
  - UX Consistency
  - Development Workflow

Templates reviewed:
  ✅ .specify/templates/plan-template.md
     Constitution Check section present; gates now derivable from this document.
  ✅ .specify/templates/spec-template.md
     No constitution references; success criteria and FR format compatible.
  ✅ .specify/templates/tasks-template.md
     Task phases and test-optional policy compatible with Principle III.

Follow-up TODOs:
  None — all placeholders resolved.
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
  query results MUST be fully typed using `src/lib/types.ts` interfaces.
- No backwards-compatibility shims for removed features. Delete cleanly.

**Rationale**: The codebase is small and solo-maintained. Premature abstraction and
accumulated dead code are the primary risks to long-term velocity.

### II. Design System Fidelity

Every UI element MUST conform to the Contemporary Soft Club design system without
exception. Non-conforming UI MUST NOT be merged.

Non-negotiable rules:
- **Border radius**: `0px` everywhere. No rounded corners under any circumstances.
- **Palette**: Cool blue-teal-lavender spectrum only. No warm tones, no black, no
  pure white solid backgrounds. Page background: `#EEF4F8`.
- **Typefaces**: Orbitron (display/headings), Exo 2 (body/subtitles),
  Share Tech Mono (labels/data/UI chrome). No other typefaces.
- **Panels**: All major panels MUST use `ghost-panel` or `tracklist-panel` CSS classes
  (semi-transparent white + border + corner brackets). No drop shadows.
- **Colour usage**: `#5A9ED4` accent appears in geometry and interactive elements;
  `#2A6094` for headings; `#5A8AAA` for labels and secondary text.

**Rationale**: Visual coherence is a primary product differentiator. Drift accumulates
fast when rules are not explicit and enforced.

### III. Testing Standards

`npm run build` MUST pass with zero TypeScript errors before any commit. This is the
minimum automated gate.

- **Visual review**: Every UI change MUST be visually verified in the browser at both
  desktop (≥960px) and mobile (≤680px) widths before the change is considered done.
- **Audio features**: Play, pause, seek, single-play coordination (only one track plays
  at a time), and visualizer activation MUST be manually verified after any change to
  audio player components.
- **No mocking audio or browser APIs** in tests. Web Audio API and SoundCloud Widget
  API have browser-specific behavior that mocks will not catch.
- Automated unit tests are optional and additive; they do not replace the build gate
  or manual verification steps above.

**Rationale**: This is a client-heavy media site. The most critical bugs (audio not
playing, visualizers dead, layout breaking on mobile) are caught by manual review, not
unit tests.

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

**Rationale**: Audio playback and real-time visualizers are performance-sensitive.
Sloppy resource management causes audible glitches and battery drain on mobile.

### V. Data Integrity

- All Supabase table queries MUST use typed interfaces from `src/lib/types.ts`.
  Raw `any` types on query results are not permitted.
- Row Level Security (RLS) MUST be enabled on all tables. Public read policies are
  scoped to `is_visible = true` rows only.
- Schema changes MUST be applied via the Supabase dashboard SQL Editor and documented
  in the relevant story file before the corresponding code change is committed.
- `audio_url` and `soundcloud_url` values in the database are the authoritative source
  of truth for media locations. Hardcoded URLs in component code are not permitted.

**Rationale**: Data bugs (wrong URLs, missing visibility flags, untyped results) are
silent failures that are hard to debug. The schema is the contract.

## UX Consistency

These rules ensure the site behaves predictably as a music player, not just a webpage.

- **Single-play**: Only one audio track (beat or release) MAY play at a time across
  the entire page. Module-level coordination variables (`currentAudio`, `currentWidget`)
  enforce this within each player type. Cross-type coordination (beat pausing a release
  and vice versa) is a known gap and MUST be addressed before any public launch.
- **Responsive layout**: The catalog grid MUST display two columns at ≥680px and a
  single column with a tab switcher at <680px. This breakpoint is defined in
  `globals.css` and MUST NOT be changed without updating both the CSS and this document.
- **Empty states**: Every catalog section MUST render a readable empty state message
  when its data array is empty. Silent blank sections are not acceptable.
- **Tag filtering**: Selecting a tag in the BeatsCatalog filter bar MUST filter the
  beat list immediately (no submit button). Clicking the same tag again deselects it.
  The × CLEAR button MUST restore the full unfiltered list.

## Development Workflow

- **Commit scope**: Each commit MUST represent a working, buildable state.
  `npm run build` passing is a prerequisite for every commit.
- **Commit message format**: `type: short description (story NNN)` where type is one
  of `feat`, `fix`, `design`, `chore`, `docs`. Story reference is optional but
  preferred for feature work.
- **Story-driven development**: New features MUST have a story file in `stories/` and
  an implementation spec before coding begins. Ad-hoc feature additions to existing
  stories are acceptable for small scope expansions discovered during implementation.
- **No force pushes to main**: `main` is the production branch (deployed to Vercel).
  Destructive git operations on `main` are prohibited.
- **Environment variables**: `NEXT_PUBLIC_` prefixed vars are safe for client-side use.
  `SUPABASE_SECRET_KEY` MUST remain server-only and MUST NOT be committed or exposed
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

**Version**: 1.0.0 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-03
