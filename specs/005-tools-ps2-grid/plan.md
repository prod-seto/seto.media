# Implementation Plan: Producer Tools — PS2 Disk Grid

**Branch**: `005-tools-ps2-grid` | **Date**: 2026-04-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-tools-ps2-grid/spec.md`

## Summary

Add a `/tools` page displaying producer tools as PS2-style disk cards in a 3-column grid.
Clicking a disk navigates to a per-tool placeholder page at `/tools/[slug]`. The admin can
customize each disk's artwork image, label font (from three PS2-era typefaces), and label color
via a new admin screen. Tool data lives in a new `tools` Supabase table. Three PS2-era fonts
(Turret Road, Chakra Petch, Teko) are added via `next/font/google`, scoped exclusively to the
disk label component. Disk shape is achieved with `clip-path: circle()` (not `border-radius`).

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1 App Router
**Primary Dependencies**: React 19, `@supabase/supabase-js` 2.x (existing), `@supabase/ssr` (existing), `next/font/google` (existing mechanism)
**Storage**: Supabase PostgreSQL — new `tools` table
**Testing**: `npm run build` + manual verification per quickstart.md
**Target Platform**: Browser + Vercel serverless
**Project Type**: Web application — new public route + admin management screen
**Performance Goals**: Tools grid renders from a single Supabase query; disk images are externally hosted URLs (no upload pipeline)
**Constraints**: No new npm dependencies; disk fonts scoped to disk component only; `clip-path: circle()` for disk shape (not `border-radius`); tools are seeded via SQL (no admin create flow)
**Scale/Scope**: 3 tools; 1 admin user; 6 new files, 3 modified files

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. Component Quality | `DiskCard` owns disk rendering only; `tools/page.tsx` fetches data server-side; admin edit page is `'use client'`; no speculative abstractions — DiskCard is used 3× on the grid | ✅ Pass |
| II. Design System Fidelity | Ghost-panel, 0px border-radius, blue-teal palette all maintained. **Two justified exceptions** — see Complexity Tracking: (1) three new disk-scoped typefaces; (2) circular disk shape via `clip-path` | ⚠️ Justified exceptions — see below |
| III. Testing Standards | `npm run build` must pass. Disk grid, click routing, and admin edit flow manually verified at desktop + mobile. | ✅ Pass |
| IV. Performance Requirements | No new JS dependencies. Three fonts via `next/font/google` (compile-time, zero runtime JS overhead). Data fetched in async server components. | ✅ Pass |
| V. Data Integrity | `tools` table has RLS enabled; public read scoped to `is_visible = true`; all queries typed via regenerated `database.types.ts`; no hardcoded URLs in component code. | ✅ Pass |

**UX Consistency**: Tools page is a new independent section; does not affect catalog, audio players, or tag filtering.

## Project Structure

### Documentation (this feature)

```text
specs/005-tools-ps2-grid/
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
├── lib/
│   └── database.types.ts                         ← REGENERATED (adds tools table)
├── app/
│   ├── layout.tsx                                ← MODIFIED: add Turret Road, Chakra Petch, Teko fonts
│   ├── page.tsx                                  ← MODIFIED: add TOOLS link section below CATALOG
│   ├── globals.css                               ← MODIFIED: add .disk-card, .disk-face, .disk-label CSS
│   ├── tools/
│   │   ├── page.tsx                              ← NEW: tools grid (Server Component)
│   │   └── [slug]/
│   │       └── page.tsx                          ← NEW: tool placeholder page (Server Component)
│   └── admin/
│       ├── page.tsx                              ← MODIFIED: add MANAGE TOOLS link
│       └── tools/
│           ├── page.tsx                          ← NEW: list all tools for admin
│           └── [id]/
│               └── edit/
│                   └── page.tsx                  ← NEW: edit disk appearance ('use client')
├── components/
│   └── DiskCard.tsx                              ← NEW: PS2 disk card component
└── actions/
    └── tools.ts                                  ← NEW: updateToolDisk Server Action
```

## Implementation Design

### Disk visual structure

```
<div class="disk-wrapper">         ← click target + label below
  <div class="disk-face">          ← clip-path: circle(50%), iridescent gradient
    <img class="disk-artwork" />   ← absolute-positioned, covers disk face
    <div class="disk-hub" />       ← center hub hole, clip-path: circle(50%)
  </div>
  <p class="disk-label">           ← tool name, below disk face
    {tool.name}                    ← fontFamily: var(--font-{disk_font}), color: disk_font_color
  </p>
</div>
```

The iridescent DVD sheen uses a conic gradient in the icy blue-teal palette:

```css
.disk-face {
  clip-path: circle(50%);
  background: conic-gradient(
    rgba(90,158,212,0.55) 0deg,
    rgba(168,216,208,0.50) 90deg,
    rgba(200,212,240,0.60) 180deg,
    rgba(106,184,176,0.45) 270deg,
    rgba(90,158,212,0.55) 360deg
  );
  position: relative;
  aspect-ratio: 1;
}
```

### Public tools flow

```
Visitor → /tools
  ↓
tools/page.tsx (Server Component)
  supabase.from("tools").select("*").eq("is_visible", true).order("sort_order", { ascending: true })
  ↓
  Renders <DiskCard> for each tool (3-column grid)
  ↓
Visitor clicks a disk → /tools/[slug]
  ↓
tools/[slug]/page.tsx (Server Component)
  supabase.from("tools").select("*").eq("slug", slug).single()
  ↓
  Renders tool name heading + description placeholder
```

### Admin disk edit flow

```
Admin → /admin → MANAGE TOOLS → /admin/tools
  ↓
List all tools (all 3, regardless of is_visible)
  ↓
Admin clicks EDIT → /admin/tools/[id]/edit
  ↓
Edit form: disk_image_url (text), disk_font (select), disk_font_color (color input)
  ↓
Save → updateToolDisk(toolId, data) [Server Action]
  Verifies owner session → UPDATE tools SET ... WHERE id = toolId
  ↓
Success → redirect back to /admin/tools (or show confirmation)
```

### Font key → CSS variable mapping (in DiskCard)

```ts
const fontVars: Record<string, string> = {
  "turret-road":  "var(--font-turret-road)",
  "chakra-petch": "var(--font-chakra-petch)",
  "teko":         "var(--font-teko)",
};
```

### Homepage addition

`src/app/page.tsx` gains a second divider section after CATALOG:

```tsx
<Divider label="TOOLS" />
<Link href="/tools" ...>VIEW PRODUCER TOOLS →</Link>
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Three new typefaces (Principle II) | The PS2 disk concept requires period-authentic typography; the existing three fonts (Orbitron, Exo 2, Share Tech Mono) have no PS2-era aesthetic and are too associated with the site's ambient UI | Using existing fonts would make the disk label visually indistinguishable from surrounding site UI — the disk's identity depends on distinct typography |
| Circular shape (Principle II) | A disc is a circle by definition | `clip-path: circle()` is not `border-radius`; the rule targets decorative corner rounding on panels/buttons. A disc is a semantic object, not a rounded rectangle. Technically compliant. |
