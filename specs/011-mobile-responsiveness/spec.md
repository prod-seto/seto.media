# Feature Specification: Mobile Responsiveness Fixes

**Feature Branch**: `011-mobile-responsiveness`  
**Created**: 2026-04-20  
**Status**: Draft  
**Input**: User description: "We need to release this website publicly ASAP. Mobile UI is broken in many areas — navbar, downloads page ghost panel children, file tree UI, SoundCloud ghost panels, and more."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile Visitor Browses Catalog (Priority: P1)

A first-time visitor opens seto.media on their phone (iPhone SE, ~375px wide). They land on the homepage, see the navbar and catalog clearly without horizontal scrolling, tap between the Releases and Beats tabs, and scroll through the content comfortably.

**Why this priority**: This is the primary use case — most traffic is on mobile. A broken homepage immediately loses visitors at the critical public launch.

**Independent Test**: Open the homepage on a 375px-wide screen (or device emulator). Navigate between tabs, scroll through the catalog. No horizontal overflow, no clipped text, no broken layout.

**Acceptance Scenarios**:

1. **Given** a 375px-wide phone, **When** the homepage loads, **Then** the navbar fits within the viewport with no horizontal scroll and all navigation links are accessible.
2. **Given** the homepage on mobile, **When** the user scrolls the catalog, **Then** release cards and beat rows display full titles and artist names without awkward truncation.
3. **Given** the homepage on a 320px-wide screen, **When** the user views the page, **Then** padding does not cause content to overflow the viewport.

---

### User Story 2 - Mobile Visitor Uses SoundCloud Player (Priority: P2)

A visitor on a phone plays a release or beat. The SoundCloud player controls, song title, and artist name are fully readable and usable. On narrow screens, the artist name appears below the song title rather than being cut off with ellipsis.

**Why this priority**: Audio is a core feature of the site. An unreadable player kills the music experience.

**Independent Test**: Load a release with the SoundCloud player on a 375px device. Confirm the title and artist are both fully visible, the play button is tappable, and the waveform/progress bar fits within the screen.

**Acceptance Scenarios**:

1. **Given** a 375px screen with a SoundCloud player visible, **When** the track is loaded, **Then** the full song title and artist name are readable — artist wraps below title on small screens, no key text is truncated.
2. **Given** a 320px screen, **When** the player controls render, **Then** the play button and progress bar are both visible and the layout does not overflow horizontally.
3. **Given** any mobile screen, **When** the waveform renders, **Then** it fits within the card without clipping.

---

### User Story 3 - Mobile Visitor Uses Downloads Page (Priority: P3)

A visitor navigates to the Downloads page on their phone. The ghost panel, file tree (folder/item listings), and download links are all clearly legible and usable. The drum kit cover art and description text stack vertically rather than overflowing a narrow row.

**Why this priority**: Downloads are a key conversion point. Broken layout here loses a direct user action.

**Independent Test**: Open /downloads and /downloads/adrift-stash-kit on a 375px and 320px device. Confirm no horizontal overflow, cover art stacks vertically with description, and tree connectors and text are legible.

**Acceptance Scenarios**:

1. **Given** the /downloads page on a 375px screen, **When** the page loads, **Then** the file tree structure is readable with no overflow or cramped connector characters.
2. **Given** /downloads/adrift-stash-kit on a 320px screen, **When** the page renders, **Then** the cover art and description stack vertically, and no content overflows the viewport.
3. **Given** any mobile screen on the downloads page, **Then** ghost panel padding is proportional and the download button is easily tappable.

---

### User Story 4 - Mobile Visitor Uses Tools Page (Priority: P4)

A visitor browses the Tools page on their phone. The tools file tree grid and individual tool entries render legibly with appropriate font sizes and spacing. The tree connector characters (├──, │) do not crowd the tool names.

**Why this priority**: Secondary content but part of public release. Should be clean.

**Independent Test**: Open /tools on a 375px device. Confirm tree connectors and tool names are both readable, grid collapses to single column appropriately.

**Acceptance Scenarios**:

1. **Given** the /tools page on a 375px screen, **When** the page loads, **Then** the tree connector font size is readable and tool names are not clipped.
2. **Given** the /tools page on a 320px screen, **Then** the page does not overflow horizontally and ghost panel padding is proportional.

---

### Edge Cases

- What happens on a 320px screen (iPhone SE 1st gen) — the narrowest commonly used device?
- How do catalog cards behave at intermediate widths (480px–640px, e.g. large phones in landscape)?
- How does the SoundCloud player handle very long track titles (>40 characters) on mobile?
- How does the navbar behave if the user's font scaling is increased in accessibility settings?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site navbar MUST be fully usable and readable on screens 320px wide and above, with all navigation links accessible without horizontal scrolling.
- **FR-002**: Every page's outer container padding MUST scale down on screens below 640px so content does not overflow the viewport (current 40px horizontal padding is too wide for 320px–375px devices).
- **FR-003**: The SoundCloud player card MUST display the artist name below the song title on screens below 640px, replacing the current layout that cuts off the artist name with ellipsis.
- **FR-004**: The Downloads page ghost panel and file tree MUST display without horizontal overflow on screens 320px and above, with tree connector characters at a legible reduced size on mobile.
- **FR-005**: The /downloads/adrift-stash-kit page MUST stack the cover art image and description text vertically on screens below 640px (currently the image overflows a 320px screen).
- **FR-006**: The Tools page file tree MUST display legibly on screens 320px and above, with connector characters and tool name text at appropriate reduced sizes.
- **FR-007**: Release card images MUST scale responsively on narrow screens rather than holding a fixed 88px width that crowds text content.
- **FR-008**: All tappable elements (play buttons, download links, nav links) MUST meet a minimum 44×44px tap target size on mobile.
- **FR-009**: The homepage catalog grid MUST collapse to a single-column layout on screens below 640px.
- **FR-010**: SoundCloud player controls MUST remain usable on screens 320px wide (play button and progress bar both visible).

### Key Entities

- **Viewport breakpoints**: Primary breakpoints are `<640px` (mobile), `640px–768px` (large mobile/tablet), `768px+` (desktop).
- **Ghost panel**: The site's primary container component class; padding inside ghost panels must respond to viewport width.
- **SoundCloud player card**: Compound component (title + artist + waveform + controls) that must reflow on narrow screens.
- **File tree UI**: Used on /tools and /downloads pages — folder headers and item rows with monospace connector characters.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a 375px-wide screen, no page on the public site produces horizontal scrollbars or content overflow.
- **SC-002**: On a 320px-wide screen, the homepage, downloads, and tools pages all render without layout breakage.
- **SC-003**: A user on a 375px device can read both the song title and artist name in every SoundCloud player card without any text being cut off by ellipsis (where both values are present).
- **SC-004**: All tappable controls on the site (nav links, play buttons, download buttons) are reachable and usable with a thumb tap on a standard mobile device.
- **SC-005**: The cover art + description layout on /downloads/adrift-stash-kit does not overflow on any screen 320px or wider.
- **SC-006**: The file tree on /tools and /downloads is readable on a 375px device with no horizontal overflow.

## Assumptions

- Mobile responsiveness is targeted at screens 320px wide and above (iPhone SE 1st gen is the minimum supported device).
- The admin pages (/admin/*) are explicitly out of scope — they are internal-only and not part of the public release audience.
- The login page (/login) is low priority since it is not a primary public flow, but should not be visually broken.
- The design system (Contemporary Soft Club — Orbitron, Exo 2, Share Tech Mono) is preserved; font families do not change, only sizes and layout rules adapt.
- No hamburger menu is required for the navbar; instead, the navigation links will be arranged to fit within the available horizontal space on mobile (e.g., reduced font size, tighter spacing, or wrapping to a second row).
- Tailwind CSS v4 `@theme` tokens and existing CSS classes (`.ghost-panel`, `.tracklist-panel`, `.tag`) will be extended with responsive rules rather than replaced.
- Inline `style` props throughout the codebase will be migrated to Tailwind classes where needed to enable responsive breakpoints, or media queries will be added to globals.css for cases where inline styles cannot easily be made responsive.
