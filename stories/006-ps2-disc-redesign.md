# Story: PS2 Disc Redesign — Authentic Layout & Full Admin Configurability

## Problem Statement

The disc visuals on the Tools page were built as a first pass and do not match the anatomy of a real PlayStation 2 disc. A design reference spec has since been written (`resources/ps2-disc-spec.md`) that defines the correct zones, proportions, and configurable properties of an authentic PS2 disc. The discs need to be rebuilt to follow that spec. Additionally, every relevant visual property of the disc must be editable by the admin, and tool names must appear on the disc itself — not beneath it.

## Users & Stakeholders

- **Primary user (viewer)**: Any visitor to the Tools page who sees the disc grid.
- **Primary user (editor)**: The site admin, who controls the appearance of each disc.
- **Out of scope users**: No other roles interact with this feature.

## User Scenarios

### Primary scenario — visitor views the tools page

**As a** visitor to the Tools page,
**I want to** see disc cards that look like authentic PS2 game discs,
**so that** the visual design matches the retro PS2 aesthetic the site is going for.

**Given** I navigate to the Tools page
**When** the page loads
**Then** I see each tool displayed as a disc with:
  - The tool name appearing on the disc itself as the game title (not below it)
  - A recognisable art/illustration zone in the upper portion of the disc
  - An info band in the lower portion containing the SETO COMPUTER ENTERTAINMENT publisher logo, the ESRB rating badge (if set), and the catalog number
  - A brand bar at the very bottom reading "PlayStation®2"
  - A center hub ring
  - All zones sized and positioned consistently with a real PS2 disc

---

### Secondary scenario — admin customises a disc's appearance

**As a** site admin,
**I want to** edit the visual properties of a disc from the admin panel,
**so that** each tool's disc can have its own unique look.

**Given** I am signed in as admin and navigate to the edit page for a tool
**When** I update any editable disc property (title, subtitle, background, fonts, colors, etc.)
**Then** the edit page shows a live preview of the disc reflecting my changes
**And** when I save, the public tools page reflects the updated disc on next load

---

### Secondary scenario — tool name appears on the disc, not beneath it

**As a** visitor,
**I want to** read the tool's name directly on the disc face,
**so that** the disc looks like a real PS2 game case rather than a labelled image.

**Given** I view any disc on the Tools page
**When** the page renders
**Then** the tool name is displayed within the disc's art zone as the game title
**And** there is no separate label rendered below the disc

---

### Error / failure scenario — disc has no background image set

**Given** a disc has no background image configured
**When** a visitor views that disc
**Then** the disc renders using the configured background color as a fallback, with no broken image or missing zone

---

## Business Rules

- The tool name must appear on the disc face as the game title. It must not appear as a separate label below the disc.
- The disc layout must follow the zone structure defined in `resources/ps2-disc-spec.md`: art zone (top ~60%), info band (~62–90%), brand bar (~90–100%), hub ring (~10% diameter), and rim ring.
- The brand bar at the bottom of every disc must always display "PlayStation®2". It is not configurable per disc.
- ESRB ratings are displayed as styled text badges. Official ESRB icon assets are not used.
- The publisher logo displayed in the info band is always the "SETO COMPUTER ENTERTAINMENT" logo — a custom logo that follows the visual style of the Sony Computer Entertainment logo (diamond icon with gradient, brand name above, "COMPUTER ENTERTAINMENT" below), but with "SETO" in place of "SONY". This logo is fixed and is not configurable per disc.
- All other visual properties defined in `resources/ps2-disc-spec.md` are configurable per disc by the admin. This includes (but is not limited to): background image, background color, background gradient toggle, game title text, game subtitle text, game font, game font size, game title color, ESRB rating, ESRB descriptors, catalog number, region, rim text, info band text, hub color, and any extra badges.
- Only the admin can edit disc properties. Visitors can only view.
- Changes to a disc's properties must be reflected on the public Tools page without requiring a redeployment.

## Acceptance Criteria

- [ ] Each disc on the Tools page displays the tool name as a title rendered on the disc, within the art zone — not as a label below the disc
- [ ] The disc is visually divided into the correct zones: art zone on top, info band below it, brand bar at the bottom, hub ring in the center
- [ ] The brand bar on every disc always reads "PlayStation®2"
- [ ] The info band always shows the "SETO COMPUTER ENTERTAINMENT" logo (diamond-icon style, "SETO" replacing "SONY")
- [ ] ESRB ratings, when set, appear as styled text badges in the info band
- [ ] The admin edit page exposes a control for every configurable property listed in the design spec (excluding brand bar text and publisher logo, which are fixed)
- [ ] Changing any property on the admin edit page updates the live preview immediately (no save required to see the preview)
- [ ] Saving changes causes the updated disc appearance to show on the public Tools page on next load
- [ ] If no background image is set for a disc, the disc still renders correctly using the background color
- [ ] The disc renders correctly at all grid sizes (desktop 3-column, tablet 2-column, mobile 1-column)

## Scope

### In scope
- Rebuilding the disc component to follow the zone anatomy in `resources/ps2-disc-spec.md`
- Moving the tool name from below the disc to on the disc as the game title
- The fixed "SETO COMPUTER ENTERTAINMENT" publisher logo in the info band
- The fixed "PlayStation®2" brand bar
- ESRB rating as a styled text badge
- Admin controls for all configurable properties
- Live preview on the admin edit page

### Out of scope
- Adding new tools (the three existing tools are sufficient for this story)
- Changing the routing or URL structure of the tools pages
- Building the actual tool functionality behind each disc
- Animated or interactive disc effects (spin, hover flip, etc.)
- Using official ESRB icon assets
- Making the brand bar text or publisher logo configurable per disc

## Priority & Context

The initial disc implementation was intentionally a first pass. Now that a proper PS2 disc design spec has been written, the discs need to be brought in line with it before the tools page is considered production-ready. Getting the visual right now prevents rework later as more tools are added.

## Dependencies

- `resources/ps2-disc-spec.md` is the authoritative reference for the disc layout and configurable properties. It must be read in full before any design or implementation decisions are made.
- The existing admin edit page for tools (`/admin/tools/[id]/edit`) will be the base for the expanded admin controls.
- The "SETO COMPUTER ENTERTAINMENT" logo needs to be created as a custom asset (SVG preferred) before the disc component can be built. It follows the Sony Computer Entertainment visual style: brand name at top in bold, a diamond icon with a gradient "S" shape in the center, "COMPUTER" and "ENTERTAINMENT" stacked below.

## Open Questions

None — all questions resolved.

### Resolved

- **Should the brand bar text be configurable?** No — it always displays "PlayStation®2".
- **Are ESRB icons official assets or styled badges?** Styled text badges only.
- **What is the publisher logo?** Always the "SETO COMPUTER ENTERTAINMENT" logo (custom asset modelled on the Sony Computer Entertainment diamond logo, with "SETO" replacing "SONY"). Fixed across all discs.
