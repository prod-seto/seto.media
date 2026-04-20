# Implementation Plan: Mobile Responsiveness Fixes

**Branch**: `011-mobile-responsiveness` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/011-mobile-responsiveness/spec.md`

## Summary

Make every public-facing page of seto.media fully usable on screens 320px–375px wide. The primary issues are: (1) fixed 40px horizontal padding overflows narrow viewports site-wide, (2) the navbar does not adapt to small screens, (3) the SoundCloud player card truncates artist names, (4) the downloads kit page overflows 320px screens due to a fixed 280px image, and (5) file tree UIs use oversized monospace fonts on mobile. The fix is CSS/Tailwind-only — no new dependencies, no schema changes.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router + React 19  
**Primary Dependencies**: Tailwind CSS v4 (`@theme` directive in `globals.css`), inline `style` props (pervasive — must be converted to Tailwind classes for responsive behavior)  
**Storage**: N/A — no schema changes  
**Testing**: `npm run build` (zero TypeScript errors) + manual browser verification at 375px and 320px widths (Constitution III)  
**Target Platform**: Web browser, mobile-first (320px minimum supported width)  
**Project Type**: web-application  
**Performance Goals**: CSS-only changes; no new JavaScript loaded  
**Constraints**: Design system (Contemporary Soft Club) is immutable — 0px border radius, palette, typefaces unchanged. No hamburger menu. Admin pages excluded from scope.  
**Scale/Scope**: 6 public pages — `/`, `/tools`, `/tools/[slug]`, `/downloads`, `/downloads/adrift-stash-kit`, plus shared components (SiteNav, ReleaseCard, SoundCloudPlayer, BeatCard)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status | Notes |
|-----------|------|--------|-------|
| I. Component Quality | No new abstractions unless used 3+ places; no dead code | ✅ PASS | Converting inline styles to Tailwind classes; no new helper components |
| II. Design System Fidelity | 0px radius, palette, typefaces preserved | ✅ PASS | Only layout/spacing/sizing changes; no visual design changes |
| III. Testing Standards | Build passes; visual review at desktop + mobile | ✅ PASS | Manual browser verification required after all changes |
| IV. Performance Requirements | No new JS dependencies | ✅ PASS | CSS/Tailwind changes only |
| V. Data Integrity | No schema changes | ✅ PASS | N/A |
| UX Consistency | Catalog grid: 2 cols ≥680px, 1 col <680px (already correct) | ✅ PASS | Existing breakpoint preserved; no change to grid logic |

**Post-design re-check**: All gates still pass. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/011-mobile-responsiveness/
├── plan.md              # This file
├── research.md          # Phase 0 output ✅
├── data-model.md        # N/A — no data model changes
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A — no external interfaces
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (files to be modified)

```text
src/
├── app/
│   ├── globals.css                              # Add responsive padding to .ghost-panel, .tracklist-panel; reduce outer page padding
│   ├── page.tsx                                 # Responsive outer padding (40px → 16px on mobile)
│   ├── tools/
│   │   ├── page.tsx                             # Responsive padding + tree font sizes
│   │   └── [slug]/page.tsx                      # Responsive padding + hero padding
│   └── downloads/
│       ├── page.tsx                             # Responsive padding + tree font sizes
│       └── adrift-stash-kit/page.tsx            # Stack image+text vertically on mobile; responsive padding
└── components/
    ├── SiteNav.tsx                              # Two-row navbar on mobile; reduced padding + font sizes
    ├── ReleaseCard.tsx                          # Stack artist below title on mobile; responsive image size
    ├── SoundCloudPlayer.tsx                     # Ensure play button + progress bar fit on 320px
    └── BeatCard.tsx                             # Minor: ensure no overflow at 320px
```

**Structure Decision**: Single project (Next.js App Router). All changes are within the existing `src/` tree. No new files, no new components.

## Phase 0: Research

See [research.md](./research.md) for full decision rationale. Key resolutions:

1. **Inline styles → Tailwind classes**: Convert non-dynamic inline styles to `className` strings. Keep only state-driven values in `style` props. Use `globals.css` media queries for shared CSS classes.
2. **Mobile-first Tailwind**: Base styles = mobile; `sm:` (≥640px) = larger screens. Current desktop styles become `sm:` prefixed values.
3. **Navbar**: Two-row stack on mobile (logo row + links row). Padding 40px → 16px. No hamburger.
4. **SoundCloud artist**: Stack artist below title on screens below 640px in `ReleaseCard.tsx`.
5. **Downloads kit image**: Switch to `flex-col` on mobile; image goes full-width above description.
6. **File tree font sizes**: Reduce connector and item font from 18px → 14px on mobile.

## Phase 1: Design

### 1. Shared styles — `globals.css`

Add responsive padding rules to `.ghost-panel` and the outer page containers. The existing catalog grid breakpoints at 680px and 768px are preserved unchanged.

**Changes**:
- Add `@media (max-width: 639px)` rule that reduces `.ghost-panel` padding to `12px 16px` (from `20px 32px`)
- Add `@media (max-width: 639px)` rule for `.tracklist-panel` horizontal padding reduction
- These cover any ghost panel content children site-wide (downloads, tools, releases)

### 2. Outer page padding — `page.tsx`, `tools/page.tsx`, `tools/[slug]/page.tsx`, `downloads/page.tsx`, `downloads/adrift-stash-kit/page.tsx`

All five pages use `padding: "32px 40px 80px"` or similar with 40px horizontal. The outer wrapper's inline style must become Tailwind classes:

```
className="px-4 sm:px-10 pt-8 pb-20"
```

(16px on mobile, 40px on sm+)

For `tools/[slug]/page.tsx`, the hero section has `padding: "32px 32px 40px 52px"` (52px left on desktop). On mobile: `padding: "24px 16px 32px 16px"`.

### 3. SiteNav — `SiteNav.tsx`

Current: single row, `padding: "0 40px"`, logo + links side by side, `gap: "36px"` between links, `fontSize: "28px"` logo.

Mobile target: 
- Outer padding: `px-4 sm:px-10`
- Layout: `flex-col sm:flex-row` — logo on its own row, links below (or side by side on sm+)
- Logo font: `text-xl sm:text-2xl` (shrink slightly on mobile)
- Link gaps: `gap-3 sm:gap-9`
- Link font size: `text-[10px] sm:text-xs` 

### 4. ReleaseCard — `ReleaseCard.tsx`

Title/artist block: On mobile, change the layout so artist appears below title.

Current: `[Title] — [Artist]` in a single flex row.

Mobile target:
- Wrap title and artist in a `flex flex-col sm:flex-row` container
- Hide the dash separator on mobile (`hidden sm:inline`)
- Artist: `text-sm sm:text-base` and `mt-0.5 sm:mt-0` 

Image: Change from fixed `width={88}` to responsive:
- On mobile: `width={64}` equivalent via CSS (or use `className="w-16 sm:w-22"`)

### 5. SoundCloudPlayer — `SoundCloudPlayer.tsx`

Play button: `width: "88px"` → `className="w-20 sm:w-22"` (80px mobile, 88px sm+)

The player control row (`flex` with button + progress bar) should remain single-row since 80px + gap + progress bar will fit at 320px once outer padding is reduced. Verify after global padding fix.

### 6. Downloads kit page — `adrift-stash-kit/page.tsx`

Cover image + description container:

```
// Before: flex row, gap 32px, image width 280
// After:
className="flex flex-col sm:flex-row gap-4 sm:gap-8"
// Image: full width on mobile, fixed 280px on sm+
className="w-full sm:w-[280px] object-cover"
```

### 7. File tree — `tools/page.tsx`, `downloads/page.tsx`

Tree connector characters use `fontSize: "18px"` and `whiteSpace: "pre"`.

On mobile: `className="text-sm sm:text-lg"` (14px mobile, 18px sm+)  
Folder header text: `className="text-sm sm:text-base"` (14px mobile, 16px sm+)  
Item names: `className="text-sm sm:text-base"` (14px mobile, 17px sm+)

### 8. BeatCard — `BeatCard.tsx`

Minor: Verify at 320px that play button (28px) + gap (12px) + title fits. The outer padding reduction in step 1 gives ~20px more width, which should resolve any squeeze. If still cramped, reduce gap to 8px on mobile.

## Complexity Tracking

> No constitution violations — table not required.

## Implementation Order (for `/speckit.tasks`)

1. `globals.css` — shared responsive padding (unlocks correct width for all components)
2. All page outer padding (`page.tsx`, `tools/page.tsx`, `tools/[slug]/page.tsx`, `downloads/page.tsx`, `downloads/adrift-stash-kit/page.tsx`)
3. `SiteNav.tsx` — navbar two-row mobile layout
4. `ReleaseCard.tsx` — artist stacking + responsive image
5. `SoundCloudPlayer.tsx` — verify/fix play button + progress bar at 320px
6. `downloads/adrift-stash-kit/page.tsx` — image stack layout
7. `tools/page.tsx` + `downloads/page.tsx` — file tree font sizes
8. `BeatCard.tsx` — verify + minor fix if needed
9. Full manual browser QA at 375px and 320px across all public pages
