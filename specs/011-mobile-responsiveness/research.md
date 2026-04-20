# Research: Mobile Responsiveness Fixes

**Branch**: `011-mobile-responsiveness` | **Phase**: 0 | **Date**: 2026-04-20

---

## Decision 1: How to apply responsive styles to components using inline `style` props

**Decision**: Convert inline `style` props to Tailwind `className` strings for any property that needs to change at a responsive breakpoint. For properties that must remain dynamic (e.g., dependent on React state like `isPlaying`), extract the non-dynamic portions into Tailwind classes and keep only the state-driven values in `style` props. Where a component has too many inline styles to convert cleanly in one pass, a targeted CSS media query in `globals.css` can override, using the component's existing CSS class as a hook.

**Rationale**: Tailwind's responsive prefixes (`sm:`, `md:`) only work in `className` strings — they are inert inside `style={{}}` objects. Inline styles are used pervasively throughout the codebase (often for values that are not state-dependent), so the conversion is necessary for responsive behavior. Dynamic/state-driven values that are genuinely few can remain inline.

**Alternatives considered**:
- CSS-in-JS breakpoints (rejected: not used in this project, would be a new dependency)
- A custom `useWindowWidth` hook + conditional style objects (rejected: adds JS runtime overhead, violates Constitution IV on no blocking renders)
- Media queries only in `globals.css` (workable for shared classes like `.ghost-panel` but not scalable for component-specific layout changes)

---

## Decision 2: Tailwind v4 responsive breakpoint configuration

**Decision**: Use Tailwind v4's built-in responsive utilities with the default breakpoints. The project already uses `@theme` in `globals.css` for custom design tokens. Responsive variants (`sm:`, `md:`, `lg:`) work identically to Tailwind v3 in className strings. The existing constitution-mandated breakpoint of `680px` (catalog grid) falls between `sm` (640px) and `md` (768px). For new responsive rules affecting layout at 640px and below, use `sm:` as the "above mobile" breakpoint, meaning styles without a prefix apply to mobile-first (i.e., base = mobile, `sm:` = ≥640px).

**Rationale**: Mobile-first Tailwind (base styles = mobile, sm/md = progressively larger) is the idiomatic approach and requires the least class-count to implement. Most existing code was written desktop-first (styles target desktop, no mobile override), so conversion means: take the current desktop value, make it the `sm:` or `md:` value, and set the mobile (base) value to the smaller/simpler layout.

**Alternatives considered**:
- Custom `@theme` breakpoints matching the constitution's 680px exactly (rejected: adds complexity for marginal benefit; 640px is close enough for layout purposes)
- max-width media queries in globals.css (rejected: conflicts with mobile-first convention)

---

## Decision 3: Navbar mobile strategy (no hamburger menu)

**Decision**: On small screens (below `sm`/640px), the navbar collapses to two rows: top row contains the site logo, bottom row contains the navigation links at reduced font size and tighter spacing. The outer padding shrinks from 40px to 16px on mobile. No hamburger or drawer is needed given the small number of navigation items (≤5 links).

**Rationale**: The spec explicitly rules out a hamburger menu. The design system (Orbitron headings, Share Tech Mono labels) should be preserved. With ≤5 short nav labels (e.g., "RELEASES", "BEATS", "TOOLS", "DOWNLOADS"), they can fit on one line at ~11px font with 12px gaps even on a 320px screen, or on two lines without breaking the UX.

**Alternatives considered**:
- Single-row compressed navbar (possible but logo + all links in one row risks overflow below 375px)
- Hiding nav links entirely and relying on in-page navigation (rejected: breaks discoverability)

---

## Decision 4: SoundCloud player — artist name layout on mobile

**Decision**: In `ReleaseCard.tsx`, the title + artist inline layout (currently: `[Title] — [Artist]` on one line with a dash separator) will change on mobile to a stacked layout: title on its own line, artist in smaller text directly below. This is achieved by wrapping the title/artist block in a flex column container with a responsive `flex-direction` change. The dash separator is hidden on mobile.

**Rationale**: The user explicitly called out that most of the artist name is cut off by ellipsis on mobile. Stacking is the cleanest solution that preserves both values without truncation.

**Alternatives considered**:
- Smaller font size for the combined line (rejected: already small, would be unreadable)
- Scrolling marquee for long titles (rejected: adds complexity, distracting UX)
- Truncating only the artist (rejected: artist attribution matters for a music site)

---

## Decision 5: Downloads kit page — image + description stacking

**Decision**: In `/downloads/adrift-stash-kit/page.tsx`, the flex row containing the 280px cover image and the description text will switch to `flex-col` on screens below `sm` (640px). The image will be full-width on mobile (max-width: 100%, height auto). The layout becomes: image on top, then description text below.

**Rationale**: A 280px fixed-width image in a flex row with 40px horizontal padding exceeds the total width of a 320px screen. Stacking is the correct fix.

**Alternatives considered**:
- Shrinking the image to ~100px thumbnail on mobile (rejected: too small for cover art, loses visual impact)
- Hiding the image on mobile (rejected: cover art is part of the brand identity)

---

## Decision 6: File tree (Tools + Downloads) — mobile font size strategy

**Decision**: The monospace tree connector characters (├──, │, └──) and their container will use a smaller `font-size` on mobile (14px vs 18px on desktop). Tool/folder names will similarly reduce from 16–17px to 14px. This will be implemented by adding responsive Tailwind classes when converting from inline styles, or via targeted media query in `globals.css` if the rendering uses a shared class.

**Rationale**: The fixed 18px monospace connector glyphs are wide and leave insufficient space for item names on narrow viewports. 14px reduces the glyph width enough to prevent overflow while remaining legible.

**Alternatives considered**:
- Hiding connectors on mobile (rejected: loses the distinctive "file tree" aesthetic)
- Replacing connectors with a flat list on mobile (rejected: over-engineering for this feature scope)

---

## Summary of resolved unknowns

| Unknown | Resolution |
|---------|------------|
| How to make inline styles responsive | Convert to Tailwind className; globals.css for shared classes |
| Tailwind v4 breakpoint approach | Mobile-first; base = mobile, sm: = ≥640px |
| Navbar mobile pattern | Two-row stack; no hamburger |
| SoundCloud artist truncation | Stack artist below title on mobile |
| Downloads kit image overflow | Switch to flex-col + full-width image on mobile |
| File tree readability | Reduce font-size to 14px on mobile via responsive classes |
