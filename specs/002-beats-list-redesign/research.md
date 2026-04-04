# Research: Beats List Redesign

**Branch**: `002-beats-list-redesign`
**Phase**: 0 — Research & Design Proposal

No external unknowns. All decisions are derived from reading the existing source files
and designing against the Contemporary Soft Club system.

---

## Root Cause Analysis

**Problem 1 — Tag filter bar scalability**
`BeatsCatalog.tsx` renders tags as a `flex-wrap` row above the tracklist panel. This
already wraps, so it handles growth technically — but visually, a loose pile of tags
floating above the list with no container looks messy at 10+ tags. There's no visual
boundary separating the filter area from the beats list below it.

**Problem 2 — Per-row tag overflow**
`BeatRow` renders tags in a `flexShrink: 0` inline div alongside the title and metadata
in a single row. With 2 tags this is tolerable; with 3+ tags the title gets squeezed off
the row. There is no wrapping fallback.

**Problem 3 — BPM/key illegibility**
BPM and key are rendered as a single `<span>` at `fontSize: "8px"` Share Tech Mono,
tucked at the far right of the row alongside tags. At this size and position they are
effectively decorative, not functional data.

**Problem 4 — Inconsistent first row height**
`BeatRow` receives an `isFirst` prop that sets `paddingTop: 20px` on the first row
vs `10px` on all others, to avoid the `ghost-panel::before` corner bracket overlapping
the first play button. This is a layout hack, not a design decision.

---

## Proposed Design: Integrated Filter + Tracklist Panel

The core structural change is merging the filter bar and the tracklist into a single
`ghost-panel`, and redesigning each beat row from a single-line layout to a
stacked three-line layout.

### Panel structure

```
┌─ ghost-panel ────────────────────────────────────────────────┐  ← bracket in corner,
│  FILTER   [osamason] [fakemink] [ksuuvi] [surf gang] ...    │    above filter content,
│           [sexy drill]                         × CLEAR      │    not over a play button
├──────────────────────────────────────────────────────────────┤  ← 1px divider
│ [▶]  outside                                                 │
│      165 BPM · G# MINOR                                      │
│      [osamason]                                              │
├──────────────────────────────────────────────────────────────┤
│ [▶]  no sleep                                                │
│      190 BPM · G MINOR                                       │
│      [fakemink]  [ksuuvi]                                    │
├──────────────────────────────────────────────────────────────┤
│ [⏸]  speakerz                              ← active row     │
│      200 BPM · D MINOR                                       │
│      [fakemink]  [ksuuvi]                                    │
│      ▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← canvas          │
│      ══════════════░░░░░░░░░░░░░░░░░░░░  ← progress        │
│      0:32                            1:45                    │
└──────────────────────────────────────────────────────────────┘
```

### Zone 1 — Filter header

- Container: `padding: 10px 14px`, `borderBottom: "1px solid rgba(90,158,212,0.20)"`
- Left label: Share Tech Mono 8px, `#5A8AAA`, "FILTER" — gives the area a clear identity
- Tags: `display: flex, flexWrap: wrap, gap: 6px` — naturally accommodates any count
- × CLEAR: right-aligned, only shown when tags are active
- The `ghost-panel::before` bracket sits at `top: 6px, left: 6px` in the corner above
  this zone — no interactive element underneath it

### Zone 2 — Beat rows (3-line layout)

Each row has three lines, stacked vertically, padded uniformly at `10px 14px`:

**Line 1 — Play + Title**
```
[▶]  title text here
```
- Play button: existing `.tag` button style, `flexShrink: 0`
- Title: Orbitron 700 13px, `#3A7AAA` resting / `#2A6094` playing, `flex: 1` with ellipsis

**Line 2 — BPM · KEY** (indented to align with title)
```
     165 BPM · G# MINOR
```
- Indented by play button width (~38px) using `paddingLeft`
- Share Tech Mono 11px, `#5A8AAA` — 37% larger than current 8px, clearly readable
- Rendered only if at least one of `bpm` or `key` is present; handles null gracefully
- `marginBottom: 4px`

**Line 3 — Tags** (indented, wrapping)
```
     [osamason]  [fakemink]  [ksuuvi]
```
- Same `paddingLeft` indentation as BPM/key line
- `display: flex, flexWrap: wrap, gap: 4px` — wraps to multiple lines with any tag count
- Existing `.tag` button style, 9px — same as current
- Rendered only if `beat.tags.length > 0`

**Playing state** (appended below line 3, inside same padding):
```
     ▓▓▓▒▒░░░░░░░░░░  ← canvas 24px
     ════════░░░░░░░░  ← progress 2px
     0:32        1:45  ← times
```

### Fix for uniform row height

`isFirst` and `isFirst` props are removed from `BeatRow`. All rows use uniform
`padding: 10px 14px`. The bracket overlap problem is solved structurally: the bracket
now sits over the filter header zone, not over a beat row.

`isLast` prop is retained — still needed to suppress the bottom border on the last row.

---

## Decision 1: Single integrated panel vs separate filter + list

**Decision**: Single `ghost-panel` with filter header zone + rows.

**Rationale**: Unifies the two visually disconnected elements into one cohesive block.
The corner bracket lands in the filter area (not over a play button), which naturally
resolves the `isFirst` hack. Visual weight matches the release cards — both sections
are a single contained panel.

**Alternatives considered**:
- Keep filter separate, redesign rows only — doesn't fix the filter scalability concern
  at 10+ tags, and the visual disconnection between filter and list persists.
- Collapsible/scrollable filter — over-engineered for the current scale; wrapping is
  sufficient and simpler.

---

## Decision 2: 3-line row layout vs single-line with overflow handling

**Decision**: 3-line stacked layout (title / BPM·key / tags).

**Rationale**: Tags and metadata each get dedicated horizontal space with no competition.
Tags wrap naturally. BPM/key is promoted to its own line where it can be larger and
readable. The row is taller but visually richer — each beat gets the same amount of
vertical space, making the list feel consistent and browsable.

**Alternatives considered**:
- Tags below title, BPM/key right-aligned on title line — still competes for horizontal
  space between title and BPM/key.
- Truncate tags with "+N more" overflow — hides information; tags are clickable filters,
  not decorative, so hiding them breaks functionality.

---

## Decision 3: BPM/key typography

**Decision**: Share Tech Mono 11px, `#5A8AAA`, uppercase.

**Rationale**: Share Tech Mono is the correct typeface for data/labels per the design
system. 11px is 37% larger than the current 8px — clearly readable at a glance. Using
the same color as other secondary data keeps the visual hierarchy coherent (title most
prominent, metadata secondary).

**Alternatives considered**:
- Orbitron for BPM numbers — too heavy, competes with the title.
- 13px — starts to compete with title size (also 13px).

---

## Affected files

| File | Change |
|------|--------|
| `src/components/BeatsCatalog.tsx` | Merge filter into single ghost-panel; restructure filter zone |
| `src/components/BeatCard.tsx` | 3-line row layout; remove `isFirst` prop; keep `isLast` |

No CSS changes needed. No Supabase changes. No new dependencies.
