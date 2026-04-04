# Feature Specification: Producer Tools — PS2 Disk Grid

**Feature Branch**: `005-tools-ps2-grid`
**Created**: 2026-04-04
**Status**: Draft
**Input**: User description: "Build a new page for producer tools. The page will list out all the tools in a grid. Each tool in the grid, if clicked, will lead to the actual tool page. Each tool in the grid on the Tools page will look like a Playstation 2 disk. As admin, I should have control over what image is on the disk, and what fonts / font colors are used on the disk. We should add fonts specifically for these disks that are similarly to fonts that have been used on Playstation 2 disks. The grid will have 3 columns. For now we'll just focus on the UI & routing from a selected tool in the tools page to the actual tool page. The actual tools themselves will be worked on in the future. Add disks for the following tools (tool names are subject to change): ISOtone, Mosaic, and MIDIripper"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse and Navigate to a Tool (Priority: P1)

A visitor navigates to the Tools page and sees a 3-column grid of producer tools, each displayed as a PS2-style disk. Each disk shows the tool's name and custom artwork. Clicking a disk takes the visitor to that tool's dedicated page, where the tool will eventually live. For now, the tool page renders a placeholder confirming the correct tool was reached.

**Why this priority**: This is the core deliverable of the feature — a visually distinctive tools directory that routes visitors to individual tool pages. Everything else depends on this flow existing first.

**Independent Test**: Navigate to `/tools`. Confirm three disk cards are displayed in a 3-column grid. Click one disk. Confirm the browser navigates to that tool's page URL (e.g., `/tools/isotone`). Confirm the page heading identifies the correct tool.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/tools`, **When** the page loads, **Then** three disk cards are displayed in a 3-column grid layout.
2. **Given** a disk is displayed, **When** the visitor clicks it, **Then** the visitor is taken to the corresponding tool page (e.g., clicking ISOtone goes to `/tools/isotone`).
3. **Given** a tool page is reached, **When** it renders, **Then** a placeholder heading confirms the correct tool name is displayed.
4. **Given** the visitor is on a tool page, **When** they navigate back, **Then** they are returned to the tools grid.

---

### User Story 2 — Admin Customizes a Disk's Appearance (Priority: P2)

The admin can control each disk's visual appearance: the image displayed on the disk face, the font used for the tool name label, and the font color. These settings are stored per tool and reflected on the public tools page without a deployment.

**Why this priority**: The disk customization is what makes the tools grid uniquely expressive. Without it the disks are static. The grid and routing (US1) must exist first; customization layers on after.

**Independent Test**: Sign in as admin. Navigate to the admin area and find the tool management section. Change the disk image, font, and font color for one tool. Navigate to `/tools` as a visitor and confirm the disk reflects the updated appearance.

**Acceptance Scenarios**:

1. **Given** the admin is signed in, **When** they access the tool management screen, **Then** they can see all three tools listed with their current disk settings.
2. **Given** a tool is selected for editing, **When** the admin provides a new disk image URL, **Then** the disk on the public tools page displays the new image.
3. **Given** a tool is selected, **When** the admin chooses a font from the available PS2-style font options, **Then** the tool name on the disk uses that font.
4. **Given** a tool is selected, **When** the admin sets a font color, **Then** the tool name on the disk renders in that color.
5. **Given** the admin saves changes, **When** a visitor views `/tools`, **Then** the updated disk appearance is visible within one page reload — no deployment required.

---

### Edge Cases

- A tool has no custom image set — the disk renders with a default placeholder image rather than a broken image or blank area.
- A tool has no font or color configured — the disk falls back to a default PS2-style font and color rather than rendering unstyled.
- The tools page is viewed on a narrow screen where 3 columns would overflow — the grid adapts gracefully (reduces to 2 or 1 column) without breaking disk artwork proportions.
- An admin sets a very long tool name — the disk label handles overflow without breaking outside the disk boundary.
- A tool page URL is navigated to directly — it renders correctly without requiring the visitor to come from the grid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST have a dedicated Tools page at a consistent public URL that displays all tools in a 3-column grid.
- **FR-002**: Each tool in the grid MUST be rendered as a PS2-style disk, displaying the tool name and custom disk artwork.
- **FR-003**: Clicking any disk MUST navigate the visitor to that tool's dedicated page.
- **FR-004**: Each tool MUST have its own dedicated page reachable via a stable URL derived from the tool name (e.g., `/tools/isotone`).
- **FR-005**: Tool pages MUST render a placeholder experience (heading + brief description) until the tool itself is built in a future feature.
- **FR-006**: The disk label font MUST be drawn from a curated set of PS2-era-inspired typefaces added specifically for this feature; these fonts are not used elsewhere on the site.
- **FR-007**: Each tool's disk appearance (image, font, font color) MUST be configurable by the admin without requiring a code deployment.
- **FR-008**: The admin MUST be able to manage tool disk settings from the existing admin area.
- **FR-009**: The three initial tools MUST be: ISOtone, Mosaic, and MIDIripper.
- **FR-010**: The tools page MUST be reachable from the site's homepage or main navigation.

### Key Entities

- **Tool**: A producer tool entry with a name, URL slug, disk image, disk label font, disk label color, and a placeholder description. Includes an `is_visible` flag consistent with existing content types.
- **Disk**: The visual representation of a tool in the grid — a PS2-style disc shape carrying the tool's artwork and name label, styled per the tool's saved appearance settings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can navigate from the homepage to a specific tool page in 2 clicks or fewer.
- **SC-002**: All three tool disks are visible on the tools grid without scrolling on a standard desktop viewport.
- **SC-003**: Each disk click correctly routes to the corresponding tool page 100% of the time.
- **SC-004**: An admin can update a disk's image, font, and color and see the change reflected on the public tools page within one page reload — no deployment required.
- **SC-005**: The tools page and all three tool pages pass the build check with zero errors.

## Assumptions

- The actual tool functionality (ISOtone, Mosaic, MIDIripper) is explicitly out of scope for this feature; tool pages render placeholder content only.
- Tool names are the initial set; the admin may rename them through the admin tool management screen.
- The PS2-style disk visual is achieved with flat CSS/graphic design (circular card with disc-like styling and layered artwork) rather than a 3D-rendered object, in keeping with the site's flat aesthetic.
- Three or more PS2-era-inspired fonts will be sourced from open/free font libraries (specific font selection is a planning-phase decision).
- Admin font selection is a dropdown of the pre-loaded PS2-style fonts, not a free-form text input.
- Disk customization data is stored in the same Supabase database used by the rest of the site, in a new `tools` table following the same pattern as `releases` and `beats`.
- Disk image is provided as a URL (not a direct file upload) for the admin, consistent with existing cover image handling.
- Mobile layout reduces the 3-column grid to fewer columns; no separate tab-switcher pattern is introduced.
- A link to `/tools` will be added to the homepage alongside the existing CATALOG section.
