# Feature Specification: Public Release Prep

**Feature Branch**: `010-public-release-prep`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "We need to get the website ready for public release tonight..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Downloads Page with Free Content (Priority: P1)

A visitor discovers seto.media and wants to get free producer resources. They navigate to the Downloads page via the navbar, browse a file tree rooted at `/downloads`, find the "adrift stash kit" drum kit inside the `released/` folder, click on it, and land on a detail page with cover art and a download button. They download the zip and leave happy.

**Why this priority**: The Downloads page is a net-new feature and the primary public-facing value-add for launch night. Without it, there's nothing free to offer visitors.

**Independent Test**: Navigate to /downloads, expand the `released/` folder, click the drum kit entry, verify a detail page loads with cover art and a functional download link.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they click DOWNLOADS in the navbar, **Then** they land on `/downloads` showing the file tree with `/downloads` as the root label.
2. **Given** the downloads page is loaded, **When** they expand the tree, **Then** they see a `released/` folder containing "◈ adrift stash kit" and a `coming_soon/` folder containing `round_robin.vst3`.
3. **Given** the tree is expanded, **When** they click on "◈ adrift stash kit", **Then** they are taken to a dedicated page showing the drum kit cover art, name, and a download button.
4. **Given** they are on the drum kit detail page, **When** they click download, **Then** the browser downloads the drum kit as a zip file.
5. **Given** the tree is expanded, **When** they see `round_robin.vst3` under `coming_soon/`, **Then** it is not a clickable link and has no subtitle.

---

### User Story 2 - Mutually Exclusive Audio Playback (Priority: P1)

A visitor plays a track in the "Produced by me" column, then clicks play on a Beat. The first track automatically pauses as the Beat starts. The reverse also works: playing from "Produced by me" pauses any active Beat.

**Why this priority**: Simultaneous audio from two players is disorienting and a clear UX bug for launch.

**Independent Test**: Play a track, then play a beat — first track stops. Play a beat, then play a track — beat stops.

**Acceptance Scenarios**:

1. **Given** a "Produced by me" track is playing, **When** the visitor plays a Beat, **Then** the "Produced by me" track pauses and the Beat begins playing.
2. **Given** a Beat is playing, **When** the visitor plays a "Produced by me" track, **Then** the Beat pauses and the "Produced by me" track begins playing.

---

### User Story 3 - Navbar Navigation with Downloads Link (Priority: P2)

A visitor lands on any page and needs to navigate the site. The navbar displays three links in order: HOME, DOWNLOADS, TOOLS — making all major sections immediately accessible.

**Why this priority**: Proper navigation is a prerequisite for discoverability of the Downloads page.

**Independent Test**: Load any page, verify the navbar shows HOME, DOWNLOADS, TOOLS in that order, and each link routes correctly.

**Acceptance Scenarios**:

1. **Given** any page is loaded, **When** the visitor views the navbar, **Then** the links appear in order: HOME, DOWNLOADS, TOOLS.
2. **Given** the navbar is visible, **When** DOWNLOADS is clicked, **Then** the visitor is taken to `/downloads`.

---

### User Story 4 - "Produced by me" Column Header & Visual Polish (Priority: P2)

A visitor views the homepage. The left music column header reads "Produced by me". Waveform bars are all equal width. Play/Pause button content is centered in both columns.

**Why this priority**: Messaging accuracy and visual polish directly visible at launch.

**Independent Test**: Load the homepage, verify column header, inspect waveform bars and button alignment.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** the visitor views the left music column, **Then** the header reads "Produced by me".
2. **Given** a track is playing or paused in the "Produced by me" column, **When** the visitor inspects the waveform, **Then** all vertical bars are equal width.
3. **Given** the homepage is loaded, **When** a visitor views any Play or Pause button in either column, **Then** the button content is centered both vertically and horizontally.

---

### User Story 5 - Tools Page Root Label Fix & Coming Soon Rules (Priority: P3)

A visitor browses the tools file tree. The root folder label reads `/producer_tools`. Coming soon items have no subtitle and are not clickable.

**Why this priority**: Small correctness fixes visible on a launch-night page.

**Independent Test**: Navigate to /tools, verify root label and coming_soon item behavior.

**Acceptance Scenarios**:

1. **Given** the tools page is loaded, **When** the visitor views the file tree root, **Then** the label reads `/producer_tools`.
2. **Given** any item is inside `coming_soon/` on the tools page, **When** a visitor views it, **Then** it displays no subtitle and is not a clickable link.
3. **Given** any item is inside `coming_soon/` on the downloads page, **When** a visitor views it, **Then** it displays no subtitle and is not a clickable link.

---

### Edge Cases

- What if the drum kit zip file is unavailable from storage? The detail page should show an error state rather than a broken download button.
- What if the visitor rapidly switches between columns triggering multiple play events? Only the most recently clicked track should play; all others must be paused.
- What if a visitor navigates directly to a coming_soon tool's URL (e.g. via bookmark)? The page should redirect to the parent section index or show a "not yet available" state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `/downloads` page with a file tree UI matching the visual style of the tools page.
- **FR-002**: The downloads file tree root label MUST read `/downloads`.
- **FR-003**: The downloads file tree MUST contain a `released/` folder with the "◈ adrift stash kit" drum kit entry, and a `coming_soon/` folder with a `round_robin.vst3` entry.
- **FR-004**: Clicking the drum kit entry MUST navigate to a dedicated detail page displaying the drum kit cover art image and a download button.
- **FR-005**: The download button on the drum kit detail page MUST trigger a download of the drum kit as a zipped archive.
- **FR-006**: The `round_robin.vst3` entry MUST be non-clickable and display no subtitle.
- **FR-007**: The navbar MUST contain links in order: HOME, DOWNLOADS, TOOLS.
- **FR-008**: The tools page file tree root label MUST read `/producer_tools` (underscore, not hyphen).
- **FR-009**: All items nested under any `coming_soon/` folder on both the tools and downloads pages MUST display no subtitle text.
- **FR-010**: All items nested under the `coming_soon/` folder on the tools page MUST NOT be clickable links.
- **FR-011**: All waveform visualization bars in the "Produced by me" column MUST render at equal width.
- **FR-012**: Play and Pause button content MUST be centered both horizontally and vertically in both the "Produced by me" and Beats columns.
- **FR-013**: The left music column header on the homepage MUST read "Produced by me".
- **FR-014**: When a track begins playing in the "Produced by me" column, any currently playing Beat MUST be paused automatically, and vice versa.

### Key Entities

- **Drum Kit**: A downloadable asset with a name, cover art image, and a downloadable zip file.
- **File Tree Node**: An entry in the file tree; can be a folder (expandable) or a leaf item. Leaf items have an optional subtitle and a clickable/non-clickable state.
- **Coming Soon Item**: A file tree leaf with no subtitle and no navigation target — display only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 feature items are fully functional with no regressions on existing pages.
- **SC-002**: A visitor can discover, navigate to, and download the drum kit in 4 clicks or fewer from the homepage.
- **SC-003**: Playing audio in one column automatically pauses the other column 100% of the time with no manual intervention.
- **SC-004**: All waveform bars in the "Produced by me" column are visually identical in width when viewed at any standard browser width.
- **SC-005**: Play/Pause button content is centered in all modern desktop browsers (Chrome, Firefox, Safari) without visual offset.

## Assumptions

- The drum kit folder at "/Volumes/SSK SSD/seto sound bank/◈ adrift stash kit - @prod_seto" contains a JPEG cover art file; the implementation agent will identify it by extension.
- The drum kit will be zipped and hosted as a static file (e.g. in Supabase storage or the public directory) for browser download.
- The downloads page reuses the existing file tree component from the tools page with no net-new component architecture required.
- "Produced by me" uses sentence-case: capital P for "Produced", lowercase for "by me" — consistent with the design brief's typographic style.
- The SoundCloud player and the Beats player each expose a programmatic pause method via their existing integration; no new third-party libraries are needed.
- Mobile layout is in scope and should follow existing responsive patterns established on the tools page.
