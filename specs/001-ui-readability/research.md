# Research: UI Readability & Spacing

**Branch**: `001-ui-readability`
**Phase**: 0 — Research

No external unknowns required investigation. All decisions were resolved by reading
the current source files directly.

---

## Decision 1: Section heading typeface and size

**Decision**: Upgrade "RELEASES" and "BEATS" headings from Share Tech Mono 8px
(overline/label style) to Orbitron 700 at 16px with 2px letter spacing.

**Rationale**: The constitution's type scale specifies Orbitron 700 at 20–32px for
section headings. 16px is appropriate for the column-constrained context (each column
is ~420px wide on desktop) while still being a clear visual promotion from label chrome.
Share Tech Mono at 8px places these headings at the same visual weight as data readouts
and tag labels — they read as decorative, not navigational.

**Alternatives considered**:
- Keep Share Tech Mono, just increase size — rejected. Share Tech Mono at any size
  reads as UI data/label chrome, not as a section heading. Orbitron signals hierarchy.
- Use 20px Orbitron — would work but feels heavy for the column layout. 16px is the
  right balance between prominence and proportion.

---

## Decision 2: Beat row title size

**Decision**: Increase from 11px to 13px (Orbitron 700, same as current).

**Rationale**: 11px Orbitron is at the lower limit of comfortable reading for a bold
display typeface. 13px is the same size as release card titles — consistent and
readable without disrupting the compact row aesthetic.

**Alternatives considered**:
- 12px — marginal improvement, not enough.
- 14px — slightly disrupts the compact departure-board row proportion.

---

## Decision 3: Beat row tag badge size

**Decision**: Increase from 7px to 9px.

**Rationale**: 7px is below the practical minimum for legible text. The `.tag` CSS
class defaults to 9px Share Tech Mono — matching that makes in-row tags visually
consistent with the filter bar tags above the list.

**Alternatives considered**:
- 8px — still uncomfortably small on mobile.
- 10px — tags start to compete visually with the beat title at 13px.

---

## Decision 4: Catalog divider removal

**Decision**: Remove `<Divider label="CATALOG" />` from `src/app/page.tsx`. The
`<HomeCatalog>` component follows the hero header directly, with only the existing
`marginBottom: "48px"` on the header providing spacing.

**Rationale**: The section headings within the catalog columns ("RELEASES", "BEATS")
now provide sufficient orientation after their visual upgrade. The divider added visual
noise without informational value. The hero's `marginBottom: 48px` provides adequate
separation.

**Alternatives considered**:
- Keep divider, remove label text — still adds noise without value.
- Replace with a smaller spacer — the hero margin already handles spacing.

---

## Affected files (complete list)

| File | Change |
|------|--------|
| `src/app/page.tsx` | Remove `<Divider label="CATALOG" />` line |
| `src/components/ReleasesCatalog.tsx` | Heading: remove "01 ·", change to Orbitron 700 16px |
| `src/components/BeatsCatalog.tsx` | Heading: remove "02 ·", change to Orbitron 700 16px |
| `src/components/BeatCard.tsx` | Title: 11px → 13px; tags: 7px → 9px |

No data model changes. No Supabase changes. No new dependencies.
