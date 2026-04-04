# Feature Specification: Beats List Redesign

**Feature Branch**: `002-beats-list-redesign`
**Created**: 2026-04-03
**Status**: Draft
**Input**: User description: "The Beats list on the home page needs a redesign.
Problems: (1) tag filter bar won't scale as more tags are added, (2) per-row tags
are cramped with 2+ tags and will break with more, (3) BPM and Key metadata is too
small and hard to read. Open to a complete redesign that looks good alongside the
releases column."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Scalable Tag Filter Bar (Priority: P1)

A visitor uses the tag filter to narrow the beat list. The filter bar works well
with 5 tags today, and continues to look and function well when 10, 15, or 20 tags
are present — without overflowing its container or wrapping awkwardly.

**Why this priority**: The filter bar is the primary navigation tool for the beat
catalog. If it breaks visually as the catalog grows, the entire column becomes
unusable. This is a forward-compatibility problem that will only get worse.

**Independent Test**: View the beats column on the homepage with 5 tags. Mentally
verify the layout would hold with 3× as many tags. Confirm tags wrap cleanly or
the filter area is otherwise designed to accommodate growth without overflowing
its column.

**Acceptance Scenarios**:

1. **Given** the beats column is visible, **When** there are many tags (10+),
   **Then** the tag filter area displays all tags without overflowing its container
   or breaking the column layout.
2. **Given** some tags are active and some are not, **When** a visitor views the
   filter area, **Then** active and inactive tags are visually distinct and the
   filter remains usable.
3. **Given** the page is on mobile (≤680px), **When** the beats tab is active,
   **Then** the tag filter is usable and does not overflow the screen width.

---

### User Story 2 — Scalable Per-Row Tags (Priority: P1)

A visitor views the beat list and can read the tags associated with each beat.
The row layout accommodates beats that have 3, 4, or more tags without the row
becoming cramped or the tags overflowing.

**Why this priority**: Equal priority to the filter bar — both are currently
constrained and will break as the catalog grows. Per-row tag overflow directly
impacts readability of individual beats.

**Independent Test**: View a beat row with 2 tags. Confirm the layout would
visually hold with 4–5 tags on that same row or in a secondary position without
breaking the row's proportions.

**Acceptance Scenarios**:

1. **Given** a beat row with 4 or more tags, **When** a visitor views the row,
   **Then** all tags are visible and the row does not overflow or break its
   container.
2. **Given** a beat row with tags, **When** a visitor clicks a tag in the row,
   **Then** the tag filter activates as expected (existing filtering behavior
   is preserved).

---

### User Story 3 — Readable BPM and Key Metadata (Priority: P1)

A visitor browsing the beat list can clearly read the BPM and musical key for
each beat without straining. These are primary data points producers use to
evaluate whether a beat fits their project.

**Why this priority**: BPM and key are functional data, not decoration. A producer
looking for a 140 BPM beat in G# Minor needs to read that information instantly.
The current design buries it.

**Independent Test**: Open the homepage and locate the BPM and key data for any
beat row. Confirm it is clearly legible at normal viewing distance, visually
prominent enough to scan quickly, and proportionate to the beat title.

**Acceptance Scenarios**:

1. **Given** a beat row is visible, **When** a visitor scans the list,
   **Then** the BPM value and musical key are readable at a glance without
   requiring zoom or close inspection.
2. **Given** a beat with only BPM and no key (or vice versa), **When** the row
   renders, **Then** the available metadata displays correctly without empty
   placeholders or layout breakage.

---

### Edge Cases

- A beat with no tags must still render a valid row without empty tag areas or
  broken layout.
- A beat with no BPM or no key (either field null) must render without showing
  empty placeholders (e.g., "· " with nothing after it).
- The redesign must not break the existing play/pause, visualizer, seek, and
  single-play-at-a-time audio behaviors.
- The redesign must work at both desktop (≥960px column width ~420px) and mobile
  (≤680px full-width single column).
- The empty state ("No beats match the selected tags.") must still render correctly
  after the redesign.
- The × CLEAR filter button must remain accessible when tags are active.
- All beat rows MUST be the same height when in their resting (not playing) state.
  The current design renders the first row taller than the rest due to a layout
  workaround; this inconsistency must be eliminated in the redesign.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The tag filter bar MUST accommodate at least 20 tags without
  overflowing the column container or breaking the layout.
- **FR-002**: Each beat row MUST display all of its tags (regardless of count)
  without the row overflowing its container.
- **FR-003**: The BPM value and musical key MUST be displayed at a size and weight
  that makes them clearly legible as primary data, not secondary label chrome.
- **FR-004**: Clicking a tag in the filter bar MUST still activate/deactivate that
  tag filter (existing behavior preserved).
- **FR-005**: Clicking a tag within a beat row MUST still activate/deactivate that
  tag in the filter bar (existing behavior preserved).
- **FR-006**: The × CLEAR button MUST still be accessible and visible when one or
  more tags are active.
- **FR-007**: All audio playback behaviors (play, pause, seek, visualizer, single-
  play coordination) MUST be preserved unchanged.
- **FR-010**: All beat rows MUST render at the same height in their resting state.
  No row may receive special padding or sizing treatment.
- **FR-008**: The redesigned beats column MUST look visually cohesive alongside the
  releases column — similar visual weight, consistent use of the Contemporary Soft
  Club design system.
- **FR-009**: The redesign MUST conform to the Contemporary Soft Club design system:
  Orbitron/Exo 2/Share Tech Mono typefaces, 0px border radius, cool blue-teal
  palette, ghost-panel or tracklist-panel containers.

### Key Entities

- **Tag filter bar**: The area above the beat list containing all unique tags as
  clickable filter buttons and the × CLEAR button.
- **Beat row**: A single row in the departure-board style beat list, containing the
  play button, title, tags, BPM, key, visualizer strip, progress bar, and timestamps.
- **Beat metadata**: The BPM value and musical key associated with a beat.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The tag filter bar displays correctly with 20 tags without any
  overflow, clipping, or horizontal scrollbar at desktop column width.
- **SC-002**: A beat row with 5 tags displays all tags correctly without the row
  overflowing its container or breaking the list layout.
- **SC-003**: BPM and key values are readable without zooming at 100% browser zoom
  on desktop.
- **SC-004**: A visitor can identify a beat's BPM and key within 2 seconds of
  viewing the beat list, without prior knowledge of the layout.
- **SC-005**: All existing audio playback features (play, pause, seek, visualizer,
  tag filtering) continue to function correctly after the redesign.
- **SC-006**: The beats column and releases column look visually balanced alongside
  each other — neither column dominates or looks out of place.
- **SC-007**: The redesigned beats section passes a build check with no errors.

## Assumptions

- The redesign may change the layout of the tag filter bar and beat rows significantly
  — a complete visual redesign is in scope and expected.
- The departure-board row concept (beats as rows in a single container, not individual
  cards) is retained as the structural approach. If a better layout is found during
  design, it should be compared against the releases column for visual cohesion.
- Audio player functionality (BeatRow component internals: AudioContext, canvas
  visualizer, RAF loop, progress bar) is out of scope — only the visual layout
  and typography of the beats section changes.
- The releases column design is frozen and must not be changed. The beats column
  must be designed to complement it.
- "Scalable" means the layout holds visually for at least 20 tags in the filter bar
  and at least 5 tags per beat row. Beyond that is a future concern.
- BPM and key should be treated as equally important data points — neither should
  be subordinated to the other in the display.
