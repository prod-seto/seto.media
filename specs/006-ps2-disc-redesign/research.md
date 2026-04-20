# Research: PS2 Disc Redesign

## Decision 1: SETO Computer Entertainment Logo — delivery format

**Decision**: Inline SVG React component at `src/components/SetoLogo.tsx`

**Rationale**: An inline SVG component can accept width/height props for responsive sizing, be referenced directly in JSX without an `<img>` tag, requires no additional HTTP request, and allows gradient definitions (`<linearGradient>`, `<radialGradient>`) to be scoped inside the SVG element. The diamond shape and S-gradient require precise SVG path data that cannot be achieved with CSS alone.

**Alternatives considered**:
- `public/seto-logo.svg` + `<Image>` — rejected: no control over internal colors or sizing via props; adds complexity for something rendered inline on every disc
- CSS-only diamond with clip-path — rejected: cannot replicate the orange/gold gradient S-shape authentically

**Implementation notes**:
- The logo structure (top to bottom): "SETO" wordmark in bold sans-serif uppercase → rotated diamond shape with orange-gold gradient → "COMPUTER" / "ENTERTAINMENT" stacked in small caps
- The diamond's gradient follows the Sony CE reference: orange lower-left quadrant, gold upper-right, with an S-curve dividing them
- Accept a `size` prop (number, pixels) that controls the overall height; all internal measurements scale proportionally

---

## Decision 2: Disc zone layout — CSS approach

**Decision**: Absolute positioning within a `position: relative` circular container, using percentage-based `top` and `height` values matching `resources/ps2-disc-spec.md`

**Rationale**: The disc face is already `position: relative` with `clip-path: circle(50%)` from feature 005. All content within automatically clips to the circle. Zone elements use `position: absolute; left: 0; width: 100%` and `top`/`height` derived from spec percentages. This is simpler than SVG layout and consistent with existing CSS patterns in the codebase.

**Zone measurements** (from `resources/ps2-disc-spec.md`):
| Zone | top | height |
|---|---|---|
| Art zone | 0% | 62% |
| Info band | 62% | 28% |
| Brand bar | 90% | 10% |
| Hub ring | centered | ~10% of diameter |

**Alternatives considered**:
- Full SVG disc — rejected: much higher complexity, no benefit over CSS for rectangular zones
- CSS Grid inside the circle — rejected: grid does not mix well with `clip-path` overflow and the zones need to overlap the hub ring

---

## Decision 3: Rim text — SVG textPath

**Decision**: Render rim text using an inline `<svg>` element with a circular `<path>` and `<textPath>` when `rim_text` is non-null. The SVG is absolutely positioned at `inset: 0`, spanning the full disc face as an overlay.

**Rationale**: Circular text along a path is not achievable with CSS. SVG `textPath` with a circular arc is the standard browser-native approach. The SVG is transparent except for the text characters, so it overlays all other zones without hiding them.

**Alternatives considered**:
- CSS `writing-mode` rotated text — rejected: produces a vertical strip, not an arc
- Skip rim text — rejected: it is a named configurable prop in the spec and meaningful for authenticity
- JavaScript canvas — rejected: too heavy for decorative text; not SSR-friendly

**Implementation notes**:
- Path radius: ~47% of disc diameter (just inside the rim stroke)
- Text flows clockwise from the left side, matching real PS2 disc conventions
- Font: Share Tech Mono, ~6px, color: rgba(255,255,255,0.5) — matches real disc fine print

---

## Decision 4: Game title sizing — `game_font_size` column as `real`

**Decision**: Store `game_font_size` as Postgres `real` column (floating-point number). Render using CSS `calc(var(--disc-size, 200px) * 0.XX)` — where the multiplier is the stored percentage divided by 100. Since disc size is fluid (controlled by grid), the component uses a CSS custom property set via inline style on the wrapper.

**Rationale**: The spec defines font size as "% of disc diameter" (typical range 8–14%). Storing as a float and converting to CSS `calc()` keeps sizing relative to disc width at all screen sizes.

**Alternatives considered**:
- Store as integer (whole %) — rejected: less precision than needed for fine-grained control
- Store as text CSS value — rejected: too unconstrained; validation and preview become harder

---

## Decision 5: `extra_badges` column type — jsonb

**Decision**: `extra_badges jsonb NOT NULL DEFAULT '[]'` — stores an array of `{icon: string, label: string}` objects.

**Rationale**: The spec defines extra badges as an array of icon+label pairs. JSONB is the right Postgres type for structured arrays with named fields. It supports GIN indexing if needed later, validates JSON structure, and maps cleanly to `Array<{icon: string; label: string}>` in TypeScript.

**Alternatives considered**:
- Separate `extra_badges` table — rejected: over-engineered for what amounts to 0–3 badge definitions per disc; no join needed
- `text[]` for labels only — rejected: loses the icon field; the spec explicitly has both

---

## Decision 6: New vs existing admin action

**Decision**: Update the existing `updateToolDisk` Server Action in `src/app/actions/tools.ts` to accept all new disc columns in its `data` parameter. Do not create a second action.

**Rationale**: The action already has the correct auth pattern (getUser + ADMIN_EMAIL check) and runs a generic `.update(data)`. Adding more accepted fields to the type signature is the minimal change.

**Alternatives considered**:
- New `updateToolFull` action — rejected: duplicate auth logic, no benefit

---

## Decision 7: `disk_font_color` column — keep as-is

**Decision**: The existing `disk_font_color` text column serves as `gameTitleColor`. No rename, no migration beyond adding the new columns.

**Rationale**: Renaming would require an additional migration and all references in existing code (admin edit page, DiskCard) would break. The semantic meaning is the same. The mapping is documented.

---

## Decision 8: Fixed fields — no columns added

**Decision**: `brandBarText` ("PlayStation®2") and the publisher logo (SETO CE) are hardcoded in the component. No database columns are added for them.

**Rationale**: These are explicitly fixed per the business rules. Adding configurable columns would invite accidental misconfiguration. The component is the single source of truth for these values.

---

## Decision 9: `bg_color` default value

**Decision**: Default `bg_color` to `'#1a2744'` (deep navy-blue), matching the dark blue tone used on classic PS2 game discs.

**Rationale**: Every disc must render without a background image. A dark blue default is visually consistent with real PS2 discs and compatible with white/light game title text.

---

## Decision 10: Database column additions — no renames to existing columns

**Decision**: All 12 new columns are additive `ALTER TABLE … ADD COLUMN` statements. The existing columns (`disk_image_url`, `disk_font`, `disk_font_color`, `is_visible`, `sort_order`) are unchanged.

**Rationale**: Additive schema changes are backwards-compatible. The existing feature 005 code continues to work while new columns are added and `npm run db:types` picks them all up.
