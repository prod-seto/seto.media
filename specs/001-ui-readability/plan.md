# Implementation Plan: UI Readability & Spacing

**Branch**: `001-ui-readability` | **Date**: 2026-04-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-ui-readability/spec.md`

## Summary

Improve readability of the catalog section headings, beat row titles, and beat row tag
badges by promoting font sizes and removing decorative numeric prefixes. Remove the
"CATALOG" divider between the hero and the catalog grid. No data model or API changes
required — this is a pure frontend typography and layout adjustment across 4 files.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16.2.1
**Primary Dependencies**: React 19, Tailwind CSS v4 (`@theme` directive)
**Storage**: N/A — no data changes
**Testing**: `npm run build` (TypeScript gate) + manual browser verification
**Target Platform**: Web — desktop ≥960px and mobile ≤680px
**Project Type**: Next.js web application (App Router)
**Performance Goals**: No render performance impact — changes are CSS/inline style only
**Constraints**: All changes MUST conform to Contemporary Soft Club design system
**Scale/Scope**: 4 files, ~10 lines changed total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Component Quality | No new components; modifying inline styles only. No abstractions introduced. | ✅ PASS |
| II. Design System Fidelity | Heading upgrade uses Orbitron (correct display typeface). Tag increase stays at Share Tech Mono 9px (`.tag` default). No palette changes. 0px radius unchanged. | ✅ PASS |
| III. Testing Standards | `npm run build` + manual visual review at desktop and mobile required. No audio changes — audio verification not required. | ✅ PASS |
| IV. Performance Requirements | Inline style changes only. No new components, hooks, or renders. | ✅ PASS |
| V. Data Integrity | No Supabase queries or schema changes. | ✅ PASS |

**Post-design re-check**: All gates still pass. No complexity violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-ui-readability/
├── plan.md           ✅ this file
├── research.md       ✅ Phase 0 complete
├── quickstart.md     ✅ verification steps
└── tasks.md          ⬜ Phase 2 — /speckit-tasks
```

### Source Code (affected files only)

```text
src/
├── app/
│   └── page.tsx                    # Remove <Divider label="CATALOG" />
└── components/
    ├── ReleasesCatalog.tsx          # Section heading: remove "01 ·", Orbitron 700 16px
    ├── BeatsCatalog.tsx             # Section heading: remove "02 ·", Orbitron 700 16px
    └── BeatCard.tsx                 # Title 11→13px; tag badges 7→9px
```

**Structure Decision**: Single Next.js project; all changes are in `src/`. No new
files created.

## Implementation Steps

### Step 1 — Remove CATALOG divider (`src/app/page.tsx`)

Remove the `<Divider label="CATALOG" />` line (currently line 75). The `<HomeCatalog>`
component follows the hero `<header>` directly. The hero's existing
`marginBottom: "48px"` provides sufficient vertical separation.

**Before**:
```tsx
<Divider label="CATALOG" />
<HomeCatalog beats={beats ?? []} releases={releases ?? []} />
```

**After**:
```tsx
<HomeCatalog beats={beats ?? []} releases={releases ?? []} />
```

The `Divider` import can be removed if it is no longer used elsewhere in the file.

---

### Step 2 — Upgrade RELEASES heading (`src/components/ReleasesCatalog.tsx`)

Replace the `<p>` overline element with a proper section heading.

**Before** (line ~33):
```tsx
<p style={{ ...mono, fontSize: "8px", letterSpacing: "3px", color: "#5A8AAA",
  textTransform: "uppercase", marginBottom: "16px" }}>
  01 · RELEASES
</p>
```

**After**:
```tsx
<h2 style={{ fontFamily: "var(--font-orbitron), sans-serif", fontSize: "16px",
  fontWeight: 700, letterSpacing: "2px", color: "#2A6094",
  textTransform: "uppercase", marginBottom: "16px" }}>
  RELEASES
</h2>
```

Changes: element `<p>` → `<h2>`, typeface Share Tech Mono → Orbitron, size 8px → 16px,
color `#5A8AAA` → `#2A6094` (heading colour per design system), remove "01 ·" prefix.

---

### Step 3 — Upgrade BEATS heading (`src/components/BeatsCatalog.tsx`)

Same treatment as Step 2.

**Before** (line ~33):
```tsx
<p style={{ ...mono, fontSize: "8px", letterSpacing: "3px", color: "#5A8AAA",
  textTransform: "uppercase", marginBottom: "16px" }}>
  02 · BEATS
</p>
```

**After**:
```tsx
<h2 style={{ fontFamily: "var(--font-orbitron), sans-serif", fontSize: "16px",
  fontWeight: 700, letterSpacing: "2px", color: "#2A6094",
  textTransform: "uppercase", marginBottom: "16px" }}>
  BEATS
</h2>
```

The `mono` style constant can be removed from `BeatsCatalog.tsx` if it is no longer
referenced after this change (check usages before removing).

---

### Step 4 — Increase beat row title size (`src/components/BeatCard.tsx`)

In the `<h3>` for the beat title in `BeatRow`, change `fontSize` from `"11px"` to
`"13px"`.

**Before**:
```tsx
fontSize: "11px",
```

**After**:
```tsx
fontSize: "13px",
```

---

### Step 5 — Increase beat row tag badge size (`src/components/BeatCard.tsx`)

In the tag `<button>` elements rendered inside the beat row (not the filter bar —
those are already 9px), change `fontSize` from `"7px"` to `"9px"`.

**Before**:
```tsx
fontSize: "7px",
letterSpacing: "1px",
```

**After**:
```tsx
fontSize: "9px",
letterSpacing: "1.5px",
```

---

### Step 6 — Build gate + visual verification

```bash
npm run build
```

Then verify in browser per `quickstart.md`.
