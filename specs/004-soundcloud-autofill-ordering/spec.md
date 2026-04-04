# Feature Specification: SoundCloud Autofill & Catalog Ordering

**Feature Branch**: `004-soundcloud-autofill-ordering`
**Created**: 2026-04-04
**Status**: Draft
**Input**: User description: "1. When ingesting a new release, the process could be improved by having it just take in the URL of the song on SoundCloud first. Doing so would kick off processing that would lead to the rest of the fields being autofilled. I would then be able to adjust any of those fields before I click the submit button. 2. I should be able to adjust the order that releases appear in the releases column. 3. I should be able to adjust the order that the beats appear in the beats column."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — SoundCloud URL Autofill for New Releases (Priority: P1)

When adding a new release, the admin pastes a SoundCloud track URL into a single
input field. The form fetches available metadata from that URL and populates the
title, artist, and cover image fields automatically. The admin reviews all fields,
adjusts anything that was filled incorrectly or left blank (such as release type and
date), then submits.

**Why this priority**: This is the highest-friction part of the existing ingestion
workflow. Every release requires manually copying over data that is already available
on SoundCloud. Automating this eliminates repetitive data entry and reduces the chance
of typos. It also changes the mental model of the form — the URL is the starting
point, not an optional extra.

**Independent Test**: Navigate to `/admin/releases/new`. Paste a valid SoundCloud
track URL. Confirm that the title and artist fields populate automatically without
manual input. Edit one field. Submit. Confirm the release appears on the homepage with
the correct data (including the manually-edited field).

**Acceptance Scenarios**:

1. **Given** the new release form is open, **When** the admin pastes a valid SoundCloud
   track URL, **Then** the title, artist, and cover image fields are populated
   automatically within a few seconds.
2. **Given** the fields have been autofilled, **When** the admin edits any field before
   submitting, **Then** the submitted values reflect the admin's edits, not the
   originally fetched values.
3. **Given** a SoundCloud URL that returns partial metadata, **When** autofill runs,
   **Then** available fields are populated and empty fields remain blank for manual
   entry — the form does not show an error.
4. **Given** an invalid or non-SoundCloud URL is pasted, **When** autofill runs,
   **Then** a clear inline message indicates the URL could not be fetched, and all
   fields remain editable for manual input.
5. **Given** autofill has populated fields, **When** the admin clears the URL input
   and pastes a different URL, **Then** the fields update to reflect the new URL's
   metadata.

---

### User Story 2 — Reorder Releases in the Catalog (Priority: P2)

The admin can change the order in which releases appear in the releases column on the
homepage. The order is controlled explicitly by the admin rather than being driven
solely by release date. New releases are added at the top of the order by default, and
the admin can drag them or use controls to rearrange them at any time.

**Why this priority**: The current order is fixed by release date descending. The admin
may want to promote certain releases to the top regardless of when they were added —
for example, to feature a recent collaboration or a flagship project. Explicit ordering
gives the admin creative control over the catalog presentation.

**Independent Test**: Navigate to an ordering management screen for releases. Change
the position of two releases. Navigate to the homepage and confirm the releases appear
in the new order.

**Acceptance Scenarios**:

1. **Given** multiple releases exist, **When** the admin accesses the releases ordering
   view and rearranges them, **Then** the homepage reflects the new order on the next
   page load.
2. **Given** a newly added release, **When** it is saved, **Then** it appears at the
   top of the releases column by default (before any manual reordering).
3. **Given** releases with `is_visible = false`, **When** ordering is adjusted,
   **Then** hidden releases can still be repositioned, but do not appear on the
   homepage regardless of their position.
4. **Given** the admin saves a new order, **When** another admin session views the
   homepage, **Then** the same order is reflected — order changes are persistent.

---

### User Story 3 — Reorder Beats in the Catalog (Priority: P2)

The admin can change the order in which beats appear in the beats catalog on the
homepage. As with releases, the order is explicitly controlled by the admin and is
independent of upload date. New beats are added at the top of the order by default.

**Why this priority**: Equal priority to release ordering. The beats catalog is the
primary product showcase, and the ability to surface specific beats — such as the
most relevant or recently promoted — gives the admin control over what visitors
experience first.

**Independent Test**: Navigate to an ordering management screen for beats. Change the
position of two beats. Navigate to the homepage and confirm the beats appear in the
new order.

**Acceptance Scenarios**:

1. **Given** multiple beats exist, **When** the admin accesses the beats ordering view
   and rearranges them, **Then** the homepage reflects the new order on the next page
   load.
2. **Given** a newly added beat, **When** it is saved, **Then** it appears at the top
   of the beats catalog by default.
3. **Given** beats with `is_visible = false`, **When** ordering is adjusted, **Then**
   hidden beats can be repositioned but do not appear on the homepage.
4. **Given** the admin saves a new order, **Then** the order is persisted and consistent
   across page loads and sessions.

---

### Edge Cases

- A SoundCloud URL where the track is private or has been deleted — autofill should
  fail gracefully with a clear message; the form remains fully usable for manual entry.
- Autofill running while the user is already typing in a field — the in-progress
  autofill result should not overwrite content the user has typed since starting to
  edit that field.
- Reordering while a new release or beat is being saved simultaneously — the ordering
  state should remain consistent; no items should silently disappear from the order.
- Attempting to reorder when only one item exists — the ordering UI should still render
  without errors, even if no reordering is possible.
- A SoundCloud URL that belongs to a playlist or user profile rather than a track —
  autofill should indicate it needs a track URL and not attempt to populate fields with
  playlist-level data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The new release form MUST present a SoundCloud URL input as the first
  step; entering a valid track URL MUST trigger an automatic metadata fetch that
  populates available fields without requiring a page reload.
- **FR-002**: Autofilled fields MUST remain fully editable; the admin MUST be able to
  override any autofilled value before submission.
- **FR-003**: If metadata fetch fails (invalid URL, private track, network error), the
  form MUST display an inline message and allow the admin to proceed with manual entry.
- **FR-004**: The SoundCloud URL field MUST remain part of the saved release record
  (it is already a required field in the existing schema).
- **FR-005**: Each release MUST have an explicit sort position that controls its order
  in the homepage releases column.
- **FR-006**: Each beat MUST have an explicit sort position that controls its order in
  the homepage beats catalog.
- **FR-007**: The admin MUST be able to reorder releases via a dedicated ordering
  interface accessible from the admin area.
- **FR-008**: The admin MUST be able to reorder beats via a dedicated ordering
  interface accessible from the admin area.
- **FR-009**: When a new release or beat is saved, it MUST be assigned a sort position
  that places it at the top of its respective catalog by default.
- **FR-010**: Sort position changes MUST take effect on the homepage on the next page
  load without a deployment.

### Key Entities

- **Release sort position**: An explicit numeric rank assigned to each release that
  determines its display order in the releases column. Independent of release date.
- **Beat sort position**: An explicit numeric rank assigned to each beat that determines
  its display order in the beats catalog. Independent of upload date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Adding a new release via SoundCloud URL autofill takes under 60 seconds
  end-to-end (paste URL, review prefilled fields, adjust if needed, submit) — compared
  to manually filling all fields.
- **SC-002**: After autofill, at least 2 fields (title and artist) are populated
  without any manual input for a standard public SoundCloud track.
- **SC-003**: A reordering change made in the admin area is reflected on the homepage
  within one page reload — no deployment required.
- **SC-004**: The ordering UI allows the admin to move any item to any position in a
  single interaction (not requiring multiple incremental moves).
- **SC-005**: All three features pass a build check with zero errors.

## Assumptions

- SoundCloud track URLs are publicly accessible; the autofill does not require the
  admin to authenticate with SoundCloud separately.
- The metadata available from a public SoundCloud track URL is sufficient to populate
  at least the title and artist fields; cover image population is best-effort.
- Release type (single/EP/album) and release date are not available from SoundCloud
  metadata and will always require manual entry.
- Drag-and-drop is the primary reordering interaction. A fallback (up/down controls)
  is not required for v1 but is a reasonable enhancement if drag-and-drop proves
  difficult on touch devices.
- The ordering interface is accessible from the admin area but is a separate screen
  from the new release / new beat creation forms.
- Both releases and beats already exist in the database; the ordering feature adds a
  sort position to existing records. New items added before ordering is set up default
  to appearing at the top.
- The `is_visible` flag and sort position are independent — hidden items hold their
  position and become visible in that position if toggled back on.
