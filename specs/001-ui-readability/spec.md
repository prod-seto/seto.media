# Feature Specification: UI Readability & Spacing

**Feature Branch**: `001-ui-readability`
**Created**: 2026-04-03
**Status**: Draft
**Input**: User description: "Update the UI to have better readability and spacing.
Many headers and titles in the current UI are small and hard to read. Tags in the
beat list are hard to read as well due to their small font size. There doesn't need
to be a ----- CATALOG ---- header above the two columns on the homepage. There
doesn't need to be numbers that prepend titles, like the RELEASES and BEATS titles.
Any text that is decorative and therefore small is fine - text like this appears in
the SETO.MEDIA banner, and doesn't need to be changed."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Readable Section Titles (Priority: P1)

A visitor lands on the homepage and can immediately orient themselves within the
catalog. The "RELEASES" and "BEATS" column headings are prominent and easy to read
as section labels, not decorative UI chrome.

**Why this priority**: Section titles are primary navigation landmarks. If they are
illegible or visually indistinct from label text, the visitor cannot orient themselves
in the layout.

**Independent Test**: Open the homepage. Confirm "RELEASES" and "BEATS" appear as
clear, prominent headings without numeric prefixes (no "01 ·" or "02 ·"). Confirm the
headings are visually larger and more prominent than tag labels.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** a visitor views the catalog columns,
   **Then** each column has a clearly readable heading ("RELEASES" and "BEATS")
   without numeric prefixes.
2. **Given** the homepage is loaded, **When** a visitor scans the page top to bottom,
   **Then** the "RELEASES" and "BEATS" headings are visually distinct from surrounding
   label and metadata text.

---

### User Story 2 — Readable Beat List Text (Priority: P1)

A visitor browsing the beat list can read beat titles and tag badges without straining.
Title text in each beat row is large enough to read at a glance, and tags are legible.

**Why this priority**: Beat titles are the primary identifier for each track. Tags
are interactive filters — if they cannot be read, the filtering feature is unusable.

**Independent Test**: Open the homepage, locate the beats list. Confirm beat titles
(e.g., "outside", "no sleep") are clearly legible without zooming. Confirm tag badges
(e.g., "OSAMASON", "FAKEMINK") are readable as interactive labels.

**Acceptance Scenarios**:

1. **Given** the beats list is visible, **When** a visitor reads a beat row,
   **Then** the beat title is large enough to read at normal viewing distance on both
   desktop and mobile.
2. **Given** the beats list is visible, **When** a visitor looks at the tag badges,
   **Then** the tag text is legible and not uncomfortably small.

---

### User Story 3 — Removed Catalog Divider (Priority: P2)

The decorative "─── CATALOG ───" section divider above the two-column grid is removed.
The catalog columns begin immediately after the hero banner.

**Why this priority**: The divider adds visual noise without aiding navigation. The
section titles already orient the visitor once they are made readable.

**Independent Test**: Open the homepage. Confirm there is no "CATALOG" labeled divider
or horizontal rule between the hero banner and the catalog grid.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** a visitor scrolls past the hero,
   **Then** the catalog grid begins immediately with no intermediate divider or label.

---

### Edge Cases

- Decorative small text in the hero banner (data readout strings, vertical code column,
  system label fragments) MUST NOT change in size, weight, or style.
- Mobile layout (≤680px): all readability improvements apply at mobile widths too.
- Empty catalog states (no releases or no beats) MUST still render without errors
  after heading text changes.
- The tab switcher labels ("releases" / "beats") on mobile also use the section title
  text — they should remain readable after any heading changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "RELEASES" column heading MUST NOT include a numeric prefix
  (remove "01 ·").
- **FR-002**: The "BEATS" column heading MUST NOT include a numeric prefix
  (remove "02 ·").
- **FR-003**: The "RELEASES" and "BEATS" headings MUST be rendered at a font size and
  weight that makes them clearly legible as section titles rather than label chrome.
- **FR-004**: Beat row titles MUST be rendered at a font size large enough to read
  comfortably at normal viewing distance on desktop and mobile.
- **FR-005**: Beat row tag badges MUST be rendered at a font size that is legible
  without strain.
- **FR-006**: The "─── CATALOG ───" divider between the hero and catalog grid MUST be
  removed from the homepage.
- **FR-007**: All changes MUST preserve the Contemporary Soft Club design system:
  Orbitron/Exo 2/Share Tech Mono typefaces, 0px border radius, cool blue-teal palette.
- **FR-008**: Decorative small text in the hero banner MUST remain unchanged.

### Key Entities

- **Section heading**: The "RELEASES" and "BEATS" labels at the top of each catalog
  column. Currently rendered as monospace overline labels with numeric prefixes.
- **Beat row title**: The track name in each row of the beats tracklist.
- **Beat row tag badge**: The clickable genre/artist tags shown inline in each beat
  row (e.g., "OSAMASON", "FAKEMINK", "KSUUVI").
- **Catalog divider**: The decorative horizontal rule with "CATALOG" label between
  the hero section and the two-column catalog grid.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify the "RELEASES" and "BEATS" sections
  within 3 seconds of the page loading, without prior knowledge of the layout.
- **SC-002**: Beat titles are readable without zooming at 100% browser zoom on a
  standard desktop display and on a 375px wide mobile screen.
- **SC-003**: Tag badge text in beat rows is readable without zooming at 100% browser
  zoom on desktop.
- **SC-004**: The homepage renders with no "CATALOG" divider between the hero and the
  catalog grid.
- **SC-005**: No decorative text in the hero banner changes size, weight, or style.
- **SC-006**: The homepage passes a build check with no errors after all changes.

## Assumptions

- "Decorative and therefore small" text refers specifically to: the vertical code
  column in the hero panel, data readout strings, system label fragments like
  "GEN X · 00001", and Share Tech Mono overline text that is part of the background
  aesthetic rather than content the user needs to read.
- The "─── CATALOG ───" divider is the `<Divider label="CATALOG" />` component
  currently rendered in the homepage between the hero and the catalog grid.
- Increasing font sizes stays within the Contemporary Soft Club type scale. Larger
  sizes use the same typefaces at higher size and/or weight — no new fonts.
- The beats tracklist uses a departure-board row layout. Readability improvements
  apply to that layout; the row design is not being replaced.
- Release card title and artist text is already reasonably sized; the primary concerns
  are section headings and beat list text.
