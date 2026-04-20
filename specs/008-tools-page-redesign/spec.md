# Feature Specification: Tools Page Redesign + Site Navbar

**Feature Branch**: `008-tools-page-redesign`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Redesign the tools page. For now the PS2 disc idea is too complex, I need simpler UI that looks aesthetically pleasing and matches the vibe of the UI on the homepage. Also turn the seto.media banner on the homepage into a navbar for the whole website."

## Clarifications

### Session 2026-04-18

- Q: Does the homepage hero panel stay, or does the navbar replace it entirely? → A: Hero panel is removed from the homepage; the navbar fully takes over site identity at the top of every page.
- Q: Should tool cards be a single-column list or a grid? → A: Three-column grid on desktop, two columns on tablet, one column on mobile.
- Q: Should the existing "VIEW TOOLS →" teaser panel at the bottom of the homepage be removed? → A: Yes, remove it — the navbar covers navigation to Tools.
- Q: Should the navbar include the decorative data-readout line or be a slim wordmark + links bar? → A: Slim bar — wordmark left, nav links right, no decorative data-readout line.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Tools List (Priority: P1)

A visitor navigates to `/tools` and sees all available producer tools presented in a visually cohesive list or grid that feels consistent with the site — ghost-panel cards, the same typography hierarchy (Orbitron headings, Exo 2 body, Share Tech Mono labels), and the same icy wash palette. No circular disc artwork, no PlayStation branding, no custom per-tool assets required to look good.

**Why this priority**: Core purpose of the page. Every other story depends on this working first. Removes the current complexity barrier where every tool needs PS2 disc metadata to render properly.

**Independent Test**: Navigate to `/tools` with 3+ tools in the database. All tools display without errors regardless of how many image/disc fields are populated.

**Acceptance Scenarios**:

1. **Given** the tools page is loaded, **When** a visitor views it, **Then** each tool is presented in a ghost-panel card with the tool name (Orbitron), a short description, and a category label (Share Tech Mono) — matching the aesthetic register of the release cards on the homepage.
2. **Given** a tool has no cover image or custom disc metadata, **When** it renders, **Then** it still looks intentional and polished — no broken images, no empty rectangles, no layout collapse.
3. **Given** the page loads, **When** viewed on desktop, **Then** the layout matches the site max-width (960px), padding, and vertical rhythm.

---

### User Story 2 - Site-Wide Navigation (Priority: P1)

A visitor on any page — homepage or tools — can see the SETO.MEDIA navbar at the top and click between sections without using the browser back button.

**Why this priority**: Co-equal with the tools list. The navbar is the connective tissue of the redesign. Previously, the homepage hero was only on the homepage; now the navbar persists across all pages. The existing homepage hero panel is removed and replaced by this navbar.

**Independent Test**: View the homepage and tools page. The navbar appears at the top of both. Clicking "Tools" from the homepage goes to `/tools`; clicking the wordmark from `/tools` goes to `/`.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they view the top of the page, **Then** they see the SETO.MEDIA navbar with links to Home and Tools — and the old hero panel is gone.
2. **Given** a visitor is on `/tools`, **When** they look at the top of the page, **Then** the same navbar appears with the same links.
3. **Given** the visitor is on the active page (e.g., currently on `/tools`), **When** the navbar renders, **Then** the active link is visually distinguished from the inactive one.

---

### User Story 3 - Click Through to a Tool (Priority: P2)

A visitor clicks a tool card and is taken to the tool's detail page at `/tools/[slug]`.

**Why this priority**: Navigation is the core action once the list is visible. Without it the page is a dead end.

**Independent Test**: Click any tool card and confirm the route `/tools/[slug]` loads without a 404.

**Acceptance Scenarios**:

1. **Given** a tool card is visible, **When** the visitor clicks it, **Then** they are routed to `/tools/[slug]`.
2. **Given** the tool card has a name and description, **When** rendered, **Then** the clickable area is clearly the whole card (not just the title text).

---

### User Story 4 - Mobile Layout (Priority: P3)

On a narrow viewport the tools list stacks to a single column and the navbar remains usable without horizontal overflow.

**Why this priority**: Matches existing responsive behavior on the homepage catalog.

**Independent Test**: View both the homepage and tools page at 375px width — navbar readable, tools cards stack vertically, no horizontal scroll.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (≤ 680px), **When** the tools page loads, **Then** cards stack vertically with appropriate padding.
2. **Given** a mobile viewport (≤ 680px), **When** either page loads, **Then** the navbar is fully readable with no overflow or broken alignment.

---

### Edge Cases

- What happens when the tools table has zero visible rows? Show the existing "No tools available yet." empty state.
- What happens when a tool has no description? Card renders gracefully with just the name and category label.
- What happens when a tool name is very long? Text truncates or wraps without breaking the card layout.
- What happens on a page with no matching nav link (e.g., an admin page or tool detail)? No nav link is marked active; the navbar still renders.

## Requirements *(mandatory)*

### Functional Requirements

**Navbar**

- **FR-001**: A site-wide navbar MUST appear at the top of every public-facing page (homepage, tools index, tool detail pages).
- **FR-002**: The navbar MUST display the SETO.MEDIA wordmark (Orbitron, styled to match the existing hero panel typography) as the site identity, linking back to `/`.
- **FR-003**: The navbar MUST include navigation links for at minimum: Home (`/`) and Tools (`/tools`).
- **FR-004**: The currently active route MUST be visually distinguished in the navbar (e.g., different color or underline on the active link).
- **FR-005**: The existing homepage hero panel MUST be removed; the navbar takes over as the sole site-identity element at the top of the homepage.
- **FR-005b**: The existing "VIEW TOOLS →" teaser panel at the bottom of the homepage MUST be removed along with its associated "TOOLS" divider label; navigation to `/tools` is provided exclusively by the navbar.
- **FR-006**: The navbar MUST be a slim bar: SETO.MEDIA wordmark (Orbitron) on the left, nav links (Share Tech Mono) on the right — no decorative data-readout line. Styled using the existing ghost-panel aesthetic and icy wash palette.
- **FR-007**: On viewports ≤ 680px the navbar MUST remain fully readable and functional (horizontal links acceptable at mobile sizes given the small number of nav items).

**Tools Page Cards**

- **FR-008**: The tools page MUST render each visible tool as a ghost-panel card matching the site aesthetic — same background, border, and corner bracket decorations.
- **FR-009**: Each tool card MUST display the tool name in Orbitron display font, an optional category/type label in Share Tech Mono, and an optional short description in Exo 2.
- **FR-010**: Each tool card MUST be fully clickable and link to `/tools/[slug]`.
- **FR-011**: The tools page layout MUST use the site max-width (960px), horizontal padding (40px), and vertical rhythm consistent with the rest of the site.
- **FR-012**: The page MUST display correctly with no disc-specific fields populated — `name`, `slug`, and `is_visible` are the only required fields for a card to render.
- **FR-013**: Tool cards MUST be displayed in a three-column grid on desktop (≥ 769px), a two-column grid on tablet (≤ 768px), and a single-column stack on mobile (≤ 680px).
- **FR-014**: The `DiskCard` component MUST be replaced on the public tools page by a new simpler card component; disc-specific CSS and markup MUST NOT appear on the public page.

### Key Entities

- **Tool**: A producer tool record from the `tools` table. Key display fields: `name`, `slug`, `game_subtitle` (repurposed as short tagline), `is_visible`, `sort_order`. Optional accent: a small cover image if `disk_image_url` is populated.
- **Navbar**: A shared layout component rendered on all public pages. Contains the SETO.MEDIA wordmark and nav links.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every tool card renders correctly with only `name`, `slug`, and `is_visible` populated — zero broken or blank card states in testing.
- **SC-002**: A first-time visitor can identify and click through to any tool within 5 seconds of the page loading.
- **SC-003**: The tools page and homepage pass a visual side-by-side comparison: same font families, same panel style, same color palette — no visual inconsistency apparent to a sighted reviewer.
- **SC-004**: All pages render without layout issues at 375px, 768px, and 1280px viewports.
- **SC-005**: No PS2 / PlayStation branded assets (disc images, hub rings, rim text, PlayStation logo) appear on the public tools page.
- **SC-006**: The navbar appears on the homepage, tools index, and tool detail pages — verified by visiting all three routes.
- **SC-007**: The homepage no longer renders the hero panel — verified by inspecting the DOM.

## Assumptions

- The `tools` table already has columns for `name`, `slug`, `is_visible`, and `sort_order` — no schema migration is needed for this redesign.
- `game_subtitle` is the available short-text field on the `tools` table used as the card tagline; if null, the description line is omitted.
- A category or genre label for each tool may exist in a column on the `tools` table; if not, the label row is omitted from the card.
- The disc-specific columns (`disk_image_url`, `hub_color`, `rim_text`, `disk_font`, etc.) remain in the database schema but are not consumed by the new public card — retained for future use or admin tooling.
- The `/tools/[slug]` detail page layout is in scope for adding the navbar (it needs the shared layout component) but its content is otherwise unchanged.
- The admin tools pages (`/admin/tools`) are out of scope — navbar is public-facing only.
- The navbar is implemented as a Next.js shared layout component in `src/app/layout.tsx` or an equivalent root layout mechanism so it renders on all public pages without duplication.
- An optional small thumbnail accent using `disk_image_url` is in scope if trivial to add, but the card must look complete without it.
