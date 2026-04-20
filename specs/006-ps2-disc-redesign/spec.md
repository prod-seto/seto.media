# Feature Specification: PS2 Disc Redesign

**Feature Branch**: `006-ps2-disc-redesign`
**Created**: 2026-04-05
**Status**: Draft
**Input**: Story: stories/006-ps2-disc-redesign.md

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authentic PS2 Disc Layout (Priority: P1)

Visitors to the Tools page currently see discs that do not follow the anatomy of a real PlayStation 2 game disc. The tool name appears as a text label below the disc rather than on the disc face, and the disc lacks the correct zones (info band, brand bar, hub ring, rim ring). This story rebuilds the disc visual so every disc follows the zone layout defined in `resources/ps2-disc-spec.md`, with the tool name rendered on the disc as the game title.

**Why this priority**: The public-facing visual is wrong relative to the intended design. Visitors see something incomplete. This must be fixed before admin customization is meaningful — there is nothing correct to configure until the disc itself is right.

**Independent Test**: Navigate to `/tools`. Confirm each disc shows the tool name on the disc face (not below it), has a visible info band containing the SETO COMPUTER ENTERTAINMENT logo, a brand bar at the bottom reading "PlayStation®2", and a center hub ring. All zones should be proportioned consistently with a real PS2 disc.

**Acceptance Scenarios**:

1. **Given** I am a visitor on the Tools page, **When** the page loads, **Then** each disc displays the tool name as a title on the disc face within the upper art zone — and no separate name label appears below the disc
2. **Given** I am a visitor on the Tools page, **When** I inspect a disc, **Then** I can see a distinct info band in the lower portion of the disc containing the SETO COMPUTER ENTERTAINMENT publisher logo
3. **Given** I am a visitor on the Tools page, **When** I inspect a disc, **Then** the very bottom strip of the disc reads "PlayStation®2"
4. **Given** I am a visitor on the Tools page, **When** I inspect a disc, **Then** a center hub ring is visible at the center of the disc
5. **Given** a tool has no background image configured, **When** I view its disc, **Then** the disc renders correctly using a solid background color — no broken image, no missing zone
6. **Given** I view the Tools page on a mobile device, **When** the page loads, **Then** the discs stack into a single column and each disc maintains its correct proportions and zone layout

---

### User Story 2 - Full Admin Disc Configurability (Priority: P2)

Every visual property of a disc — as defined in the design spec at `resources/ps2-disc-spec.md` — must be editable by the admin from the tool edit page. Currently only a small subset of properties (image, font, font color) are editable. This story expands the admin controls to cover all configurable properties in the spec, with a live preview that updates as the admin makes changes.

**Why this priority**: The visual rebuild in US1 must be in place first, otherwise admin controls have nothing meaningful to configure. US2 builds on top of US1.

**Independent Test**: Sign in as admin. Navigate to `/admin/tools` and click EDIT on any tool. Confirm every configurable property from `resources/ps2-disc-spec.md` has a corresponding control on the edit page. Change the game subtitle, background color, catalog number, and ESRB rating. Confirm the live preview updates with each change without saving. Save and navigate to `/tools` to confirm the changes are reflected.

**Acceptance Scenarios**:

1. **Given** I am signed in as admin on the tool edit page, **When** I look at the form, **Then** I see controls for every configurable property in the design spec (background image, background color, gradient toggle, game subtitle, game font, game font size, game title color, ESRB rating, ESRB descriptors, catalog number, region, rim text, info band text, hub color, extra badges)
2. **Given** I am on the admin tool edit page, **When** I change any property, **Then** the disc preview on the same page updates immediately to reflect the change — without requiring a save
3. **Given** I have changed one or more properties and clicked Save, **When** I navigate to the public Tools page, **Then** the disc reflects the updated values on next load
4. **Given** I set an ESRB rating on a disc, **When** a visitor views that disc, **Then** a styled text badge showing the rating appears in the disc's info band
5. **Given** I clear the background image URL, **When** I view the preview, **Then** the disc renders using the background color instead — no broken state

---

### Edge Cases

- What happens when a disc has no background image and no background color is set? The disc should fall back to a default color and remain fully renderable.
- What happens when a game title is very long? The title text should not overflow outside the art zone boundary.
- What happens when no ESRB rating is configured? The ESRB badge area should not render — leaving clean space in the info band.
- What happens when extra badges are configured? They should render within the info band without overlapping other elements.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each tool MUST be displayed as a circular disc divided into the correct zones: art zone (top ~60%), info band (~62–90%), brand bar (~90–100%), and hub ring at the center, as proportioned in `resources/ps2-disc-spec.md`
- **FR-002**: The tool name MUST appear on the disc face as the game title, rendered within the art zone — it MUST NOT appear as a label below the disc
- **FR-003**: The disc MUST always display the "SETO COMPUTER ENTERTAINMENT" publisher logo in the info band — this logo is fixed and not configurable per disc
- **FR-004**: The disc MUST always display "PlayStation®2" in the brand bar at the bottom — this text is fixed and not configurable per disc
- **FR-005**: When an ESRB rating is configured for a disc, it MUST render as a styled text badge within the info band
- **FR-006**: When no ESRB rating is configured, no ESRB badge element MUST appear on the disc
- **FR-007**: The disc MUST fall back to the configured background color when no background image is provided — the disc MUST NOT render a broken or empty art zone
- **FR-008**: Every configurable property defined in `resources/ps2-disc-spec.md` MUST have a corresponding admin control on the tool edit page — specifically: background image, background color, background gradient toggle, game subtitle, game font, game font size, game title color, ESRB rating, ESRB descriptors, catalog number, region, rim text, info band text, hub color, and extra badges
- **FR-009**: The live preview on the admin edit page MUST reflect the current form state in real time — no save action required to see the preview update
- **FR-010**: Admin changes to disc properties MUST persist and be reflected on the public Tools page on next load, without requiring a redeployment
- **FR-011**: The disc layout MUST render correctly at all three grid breakpoints: 3-column (desktop), 2-column (tablet), and 1-column (mobile)

### Key Entities *(include if feature involves data)*

- **Disc**: The visual representation of a tool. Composed of zones (art zone, info band, brand bar, hub ring, rim ring) and a full collection of configurable display properties. The tool name is always the game title. Publisher logo and brand bar text are always fixed.
- **Tool**: The content item a disc represents. Has a name, description, and a complete set of disc configuration properties controlling its visual appearance.
- **SETO COMPUTER ENTERTAINMENT Logo**: A fixed visual asset used as the publisher logo on all discs. Modelled on the Sony Computer Entertainment diamond logo, with "SETO" replacing "SONY". Consists of the "SETO" wordmark, a diamond icon with a gradient S-shape, and "COMPUTER ENTERTAINMENT" stacked below. Not configurable per disc.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every visitor who views the Tools page can read each tool's name directly on the disc face — no tool name appears beneath a disc
- **SC-002**: All disc zones (art zone, info band, brand bar, hub ring) are visually identifiable on every disc, consistent with the anatomy of a real PS2 disc
- **SC-003**: Admin can update any configurable disc property and see the change reflected on the public Tools page without developer involvement or redeployment
- **SC-004**: The live preview on the admin edit page reflects all property changes immediately — no delay between editing a field and seeing the updated preview
- **SC-005**: All three discs render without visual errors (no broken images, no missing zones, no text overflow) in both the configured and fallback (no image) states
- **SC-006**: The disc layout and zone proportions are visually consistent across desktop, tablet, and mobile breakpoints

---

## Assumptions

- The design spec at `resources/ps2-disc-spec.md` is the complete and authoritative reference for zone proportions, configurable props, and layout measurements. No additional design decisions are needed beyond what is already defined there.
- The "SETO COMPUTER ENTERTAINMENT" logo does not yet exist as an asset and will be created (as an inline SVG) as part of this feature.
- The existing three tools (ISOtone, Mosaic, MIDIripper) are the only tools in scope. No new tools are added in this feature.
- The game title on the disc is the tool's name — it is not a separate free-text field editable independently of the tool name.
- The existing admin edit page at `/admin/tools/[id]/edit` is the entry point for all disc configuration; its URL and routing structure are not changing.
- Visitors do not need to be authenticated to view the Tools page or individual disc visuals.
- ESRB ratings are displayed as styled text badges only — no official ESRB icon assets are used.
- The brand bar text ("PlayStation®2") and publisher logo (SETO COMPUTER ENTERTAINMENT) are fixed across all discs and are not configurable per disc.
