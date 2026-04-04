# Research: Producer Tools — PS2 Disk Grid

**Branch**: `005-tools-ps2-grid`
**Phase**: 0 — Research & Design Proposal

---

## Decision 1: PS2-era font selection

**Decision**: Three fonts from Google Fonts — **Turret Road**, **Chakra Petch**, and **Teko**.

| Font | Character | Maps to |
|------|-----------|---------|
| Turret Road | Y2K tech, angular, early-2000s UI aesthetic | Primary disk label font |
| Chakra Petch | Technical/industrial, close to optical disc label typography | Secondary disk label option |
| Teko | Bold condensed, game case / manual typography | Tertiary disk label option |

All three are available via `next/font/google`, loaded with the same pattern as the existing
three fonts in `layout.tsx`. Each becomes a CSS variable (`--font-turret-road`,
`--font-chakra-petch`, `--font-teko`) available site-wide but applied only within `.disk-label`.

**Rationale**: These three represent distinct typographic moods found on genuine PS2 media
(disc labels, case spines, manual covers). Giving the admin three choices instead of one adds
creative range without adding disproportionate complexity (three font loads vs. one).

**Alternatives considered**:
- Orbitron (already in use): Too closely associated with the site's existing display heading
  style; using it on disks would dilute both contexts.
- Custom/hosted font files: Would require Vercel asset management and CORS handling. Google Fonts
  via next/font is already the established pattern on this project.
- Single font: Limits admin creative control for no technical gain.

---

## Decision 2: Disk circular shape — clip-path vs. border-radius

**Decision**: Use `clip-path: circle(50%)` for the circular disk shape, not `border-radius`.

**Rationale**: The constitution mandates `border-radius: 0px` everywhere. `clip-path: circle()`
is a distinct CSS property that achieves a circular clip without using border-radius. It is
technically compliant and semantically correct — a disc is a fundamental circular object, not a
decorative rounded corner. The clip also provides sharper performance on GPU-composited layers
than border-radius in some browsers.

The full disk structure uses nested elements:
- Outer wrapper: fixed aspect-ratio square, provides click target and label area below the disk
- Disk face: `clip-path: circle(50%)` + conic/radial gradient for iridescent DVD sheen
- Disk image: absolute-positioned within the disk face, also clipped
- Hub hole: a small absolutely-positioned circle (`clip-path: circle(50%)`) in the center

**Alternatives considered**:
- `border-radius: 50%`: Violates constitution Principle II. Rejected.
- Square card with disk-face artwork: Loses the disk silhouette identity. Rejected.
- SVG circle element: Valid, but harder to layer CSS gradients and background images on without
  additional markup. clip-path on a div is simpler and equally effective.

---

## Decision 3: Admin disk management — single list page with per-tool edit

**Decision**: `/admin/tools` lists all tools; `/admin/tools/[id]/edit` handles per-tool editing.

**Rationale**: Follows the established admin pattern. The tools list gives the admin a quick
overview of all three tools before diving into any one. The edit page reuses the same
`ghost-panel` + form + Server Action pattern already used for releases and beats.

Since tools are seeded (not created by the admin), there is no "new tool" form — only an edit
form for existing tools. The `tools` table is populated via SQL seed, and the admin only ever
edits `disk_image_url`, `disk_font`, `disk_font_color`, and optionally `name` and `is_visible`.

**Alternatives considered**:
- Inline editing on the tools list page: Would require client state per row. More complex for
  three tools; the dedicated edit page is clearer and consistent with the project's pattern.
- Edit tools from the same page as the tools grid: Mixes admin and public concerns.

---

## Decision 4: Font color input — native `<input type="color">`

**Decision**: Admin sets disk font color via `<input type="color">` (native browser color picker),
storing the result as a hex string in the database.

**Rationale**: Zero implementation cost. The native color picker works across all modern browsers,
requires no additional JS, and produces a valid hex value that can be stored directly in
`disk_font_color`. The admin can also type a hex value directly into the text fallback.

**Alternatives considered**:
- Predefined palette swatches: Constrains creative choice unnecessarily for a solo admin tool.
- Custom color picker component: Would add client-side complexity and bundle weight with no
  meaningful UX gain for a single user.

---

## Decision 5: Disk image — URL input (no upload)

**Decision**: Admin provides the disk artwork as a URL, stored in `disk_image_url`. No file upload.

**Rationale**: Consistent with the existing `cover_url` field on releases. The admin is a single
technical user who can host images in Supabase Storage or elsewhere and paste the URL. Adding
a file upload path would require storage bucket configuration and increases scope with no
spec requirement for it.

**Alternatives considered**:
- Supabase Storage upload from admin: Valid for a future iteration; out of scope for this feature.
- Embedded base64 images: Not suitable for database storage.

---

## Decision 6: Tools seeded in DB, not created via admin form

**Decision**: ISOtone, Mosaic, and MIDIripper are inserted via a SQL seed in the Supabase
dashboard. No admin "create tool" flow exists for this feature.

**Rationale**: The spec calls for exactly three known tools. A create form would add spec work,
a new Server Action, and a new page for a feature that isn't needed yet. New tools can be added
by the developer directly in the DB when they're ready to be built. The admin edit flow is
sufficient for the current scope.

---

## Decision 7: Homepage integration — Tools link in hero / after catalog

**Decision**: Add a "TOOLS" navigation link to the homepage, placed after the CATALOG section
as a second `<Divider>` section with a link card pointing to `/tools`.

**Rationale**: The existing homepage has a single CATALOG divider. Adding a TOOLS section below
it maintains the page's vertical rhythm without altering the hero or adding a persistent nav bar
(which is out of scope). The link uses the existing `ghost-panel` + `tag` link pattern.

---

## Constitution Compliance Notes

**Principle II — New typefaces (justified exception)**:
Turret Road, Chakra Petch, and Teko are added exclusively for disk label use. They are scoped
via CSS to `.disk-label` only and are not added to `--font-display`, `--font-sans`, or
`--font-mono` tokens. The constitution's typeface rule targets the site's ambient typography;
the disk is a distinct artifact (a product card, not a UI panel) that requires period-authentic
typography to fulfill its core visual concept.

**Principle II — clip-path circle (compliant)**:
`clip-path: circle()` is not `border-radius`. The constitution targets decorative corner rounding
on panels and interactive elements. A disc is a geometric circle by definition; clip-path
achieves this without violating the 0px border-radius rule.

---

## New dependencies

None. Turret Road, Chakra Petch, and Teko are loaded via the existing `next/font/google`
mechanism. No new npm packages required.
