# Component Contracts: Tools Page Redesign + Site Navbar

**Branch**: `008-tools-page-redesign` | **Date**: 2026-04-18

## SiteNav

**File**: `src/components/SiteNav.tsx`  
**Type**: Client component (`"use client"`)  
**Responsibility**: Render the slim site-wide navbar — SETO.MEDIA wordmark (left) + nav links (right). Apply active-link style to the currently active route.

```typescript
// No external props — reads pathname internally via usePathname()
export function SiteNav(): JSX.Element
```

**Behavior**:
- Wordmark "SETO.MEDIA" links to `/`. Styled: Orbitron, `#2A6094` base with `#5A9ED4` accent on `.MEDIA`.
- Nav links: "HOME" → `/`, "TOOLS" → `/tools`. Styled: Share Tech Mono, uppercase, `#5A8AAA` inactive, `#2A6094` active.
- Active detection: `usePathname()` — exact match on `/` for HOME, `startsWith("/tools")` for TOOLS.
- Container: `ghost-panel` CSS class, full-width, `max-width: 960px`, centered with `0 auto` margin, flex layout.
- No decorative data-readout line.

**Rendered in**: `src/app/layout.tsx` (root layout — appears on all public pages)

---

## ToolCard

**File**: `src/components/ToolCard.tsx`  
**Type**: Server-renderable (no client hooks)  
**Responsibility**: Render a single tool as a clickable ghost-panel card.

```typescript
import type { Tables } from "@/lib/database.types";
type Tool = Tables<"tools">;

export function ToolCard({ tool }: { tool: Tool }): JSX.Element
```

**Behavior**:
- Entire card is a `<Link href={/tools/${tool.slug}}>` wrapping a `ghost-panel` div.
- Displays:
  - Label line: Share Tech Mono, 8px, `#5A8AAA`, uppercase (e.g. `PRODUCER TOOL` or a category value if available)
  - Tool name: Orbitron, `#2A6094`, uppercase, bold
  - Tagline (`game_subtitle`): Exo 2, 200 weight, italic, `#5A8AAA`, uppercase — omitted if null
  - Optional thumbnail: small `<img>` from `disk_image_url` if non-null, displayed as a square accent (e.g. 64×64px)
- Hover: subtle brightness increase via CSS `transition` (consistent with existing `disk-wrapper:hover` pattern)
- No disc-specific elements (no hub ring, no rim text, no PlayStation logo)

**Replaces**: `DiskCard` on the public `/tools` page

---

## Modified: tools/page.tsx

**File**: `src/app/tools/page.tsx`  
**Change**: Replace `<DiskCard>` import+usage with `<ToolCard>`. Remove `ghost-panel` page header (the separate hero panel for the tools page) since the site navbar now provides the top identity; add a `<Divider label="TOOLS" />` or equivalent section label above the grid instead.

**Grid class**: `.tools-grid` (updated breakpoints in `globals.css`)

---

## Modified: app/page.tsx (Homepage)

**File**: `src/app/page.tsx`  
**Changes**:
- Remove `<header className="hero-panel">` block entirely
- Remove `<Divider label="TOOLS" />` and the "VIEW TOOLS →" ghost-panel link block
- Keep `<Divider label="CATALOG" />` and `<HomeCatalog />` unchanged

---

## Modified: globals.css

**File**: `src/app/globals.css`  
**Change**: Update `.tools-grid` media query breakpoints:

```css
/* Updated from 680px/440px to 768px/680px to match spec */
@media (max-width: 768px) {
  .tools-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}
@media (max-width: 680px) {
  .tools-grid { grid-template-columns: 1fr; }
}
```
