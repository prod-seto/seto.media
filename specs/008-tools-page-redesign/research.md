# Research: Tools Page Redesign + Site Navbar

**Branch**: `008-tools-page-redesign` | **Date**: 2026-04-18

## Decision 1: Navbar Placement in Next.js App Router

**Decision**: Place `<SiteNav />` in `src/app/layout.tsx` — the root layout that wraps all public routes.

**Rationale**: The root layout renders once and wraps every page automatically. Adding the navbar here guarantees it appears on `/`, `/tools`, `/tools/[slug]`, and any future routes without touching individual page files. This is the canonical Next.js App Router pattern.

**Alternatives considered**:
- Per-page import: Rejected — duplicates the import on every page file, violates DRY, and risks being omitted from future pages.
- Nested layout for `/(public)/`: Rejected — unnecessary complexity for a site with a single nav. All pages are public-facing.

## Decision 2: Active Link Detection

**Decision**: Use `usePathname()` from `next/navigation` inside `SiteNav`. Because `usePathname` is a client hook, `SiteNav` must be a `"use client"` component.

**Rationale**: `usePathname()` returns the current pathname and re-renders when the route changes. It's the documented Next.js App Router way to implement active link styles. The navbar has no data-fetching needs so the client boundary cost is negligible.

**Alternatives considered**:
- Server-side pathname via `headers()`: Rejected — headers-based pathname reading is fragile and not officially supported for this use case.
- Link `aria-current` + CSS `:is([aria-current])`: Possible but `usePathname` + conditional className is simpler and already used by the ecosystem.

**Implementation note**: `SiteNav` itself is `"use client"`. It is imported directly in `layout.tsx` (which is a server component). Next.js handles the server→client boundary automatically.

## Decision 3: Tool Card Tagline Field

**Decision**: Use `game_subtitle` as the short tagline/description on `ToolCard`. Render it only when non-null.

**Rationale**: `game_subtitle` already exists on the `tools` table (confirmed in existing `DiskCard.tsx` usage). No schema migration needed. If null, the card simply omits the description line — the name alone is sufficient for a readable card.

**Alternatives considered**:
- Adding a new `description` column: Rejected — schema change not warranted when `game_subtitle` already serves this role.
- Using `rim_text`: Rejected — semantically wrong; rim_text is disc-decoration copy, not a user-readable description.

## Decision 4: Tools Grid CSS

**Decision**: Update the existing `.tools-grid` class in `globals.css` to use the clarified breakpoints: 3 columns desktop (≥769px), 2 columns tablet (≤768px), 1 column mobile (≤680px).

**Current state**: `.tools-grid` already exists at 3/2/1 columns but breakpoints are 680px and 440px. Needs updating to match the clarified 768px/680px breakpoints.

**Rationale**: Reusing the existing CSS class keeps the change minimal. The breakpoint adjustment is a one-line change per media query.

## Decision 5: DiskCard Retirement

**Decision**: Remove `DiskCard` from the public tools page only. The component file is retained because the admin edit page at `/admin/tools/[id]/edit/page.tsx` may still reference it for preview purposes. A follow-up cleanup task can remove it entirely if confirmed unused in admin.

**Rationale**: Clean deletion is preferred (Constitution I) but the admin dependency must be verified before deleting the file. Keeping the file avoids a broken build if admin still imports it.
