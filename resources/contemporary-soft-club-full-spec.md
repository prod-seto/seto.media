# Contemporary Soft Club — Full Design Reference Spec
**Version 1.0**
*Y2K Transit UI · Overexposed Light-Mode · PS2-Era Techno Typography*

---

## 1. Aesthetic overview

**Contemporary Soft Club** is a light-mode design system pulled directly from a specific moment in late-90s / early-2000s visual culture: club flyers, early internet aesthetics, PS2 system interfaces, Japanese transit signage, and Winamp skin design. The reference image captures it precisely — a motion-blurred metro platform, a figure with their back to the viewer, layered ghost-frame rectangles, a column of binary code running up the left edge, and typography borrowed from the PlayStation 2 era.

The palette is entirely cool: icy blues, soft teals, pale lavender-whites, and mint greens. The overall mood is washed-out and slightly overexposed, like a faded memory captured on a disposable camera under fluorescent station lighting.

The interface and the environment are the same thing. Ghost frames overlay photography. Data readouts scatter through layouts. The UI does not sit on top of the world — it is embedded in it.

**The single guiding test:** does this feel like it could appear on a Japanese transit platform screen in 2001? If it feels warm, dark, rounded, or contemporary, it is wrong.

---

## 2. Philosophy and constraints

### Everything is overexposed and cool-toned
The entire visual system operates in a narrow band of icy, desaturated cool tones. No warm colours enter the palette. The background is never pure white — always a slightly blue-tinted icy wash. Surfaces are semi-transparent, layered, and slightly iridescent.

### The interface is a layer, not a container
Panels do not contain content in the traditional sense — they are ghost frames, semi-transparent rectangles floating over the icy background. Content sits inside translucent white panels that you can almost see through. This creates the layered, HUD-over-photography quality of the reference image.

### Typography is system typography
All display text uses fonts from the PS2/transit-display tradition — geometric, rounded in a mechanical way, designed for screens and signage rather than print. Orbitron for the bold headline face, Exo 2 for the lighter subtitle and body, Share Tech Mono for all data and label elements. Everything display is uppercase. The system never whispers — it announces.

### Decoration comes from the interface, not from illustration
The decorative language is all UI-derived: ghost frames, corner brackets, data readouts, code columns, motion-blur photography. There is no illustration, no iconography beyond minimal geometric marks, no decorative borders that are not also structural.

---

## 3. Colour palette

### Background and surface colours

| Name | Hex | Role |
|---|---|---|
| Wash | `#EEF4F8` | Page background — overexposed icy base |
| Ice | `#DCEEF7` | Secondary surface |
| Haze | `#C8E2F0` | Borders, dividers, subtle separators |
| Mist | `#B0D2E8` | Deeper haze — section separators |

All surfaces are layered on the wash background. The overexposed quality comes from the semi-transparent white overlay (see section 4). Never use pure white `#FFFFFF` as a solid background.

### Accent colours

| Name | Hex | Light | Dark | Use |
|---|---|---|---|---|
| Blue | `#5A9ED4` | `#B8D4F0` | `#2A6094` | Primary accent — borders, active states, headings |
| Teal | `#6AB8B0` | `#A8D8D0` | `#3A8880` | Secondary — botanical, transit green elements |
| Lavender | `#8898C0` | `#CCD4E8` | `#4A5888` | Tertiary — atmospheric, ghost elements |
| Mint | `#5AAA90` | `#C0E8DC` | `#2A7060` | Quaternary — used very sparingly |

**Accent colour rules:**
- Blue is the dominant accent — use for all borders, primary UI, active states, display headings
- Teal is the secondary accent — use for nature/transit/environmental content zones
- Lavender is atmospheric — use for ghost elements, secondary overlays, faint data
- Mint is the rarest — at most once per screen as a counterpoint

### Text colours

| Role | Hex |
|---|---|
| Primary headings | `#2A6094` |
| Body copy | `#2E6080` |
| Secondary / mid | `#5A8AAA` |
| Faint / labels | `#5A8AAA` at reduced opacity, or `#8AAAC0` |
| Active / accent | `#5A9ED4` |

**Never use black or near-black for text.** All text lives in the deep navy → mid blue range. The darkest text is `#1A3A50`. This is what makes the aesthetic feel washed-out and cool rather than crisp and dark.

### Panel fills

All panels use semi-transparent white over the icy background:
- Default panel: `rgba(255,255,255,0.40)`
- Elevated / featured panel: `rgba(255,255,255,0.55)`
- Ghost overlay frame: `rgba(255,255,255,0.15)`
- Teal-tinted panel: `rgba(168,216,208,0.35)`
- Blue-tinted panel: `rgba(184,212,240,0.35)`
- Lavender-tinted panel: `rgba(204,212,232,0.40)`

### Border colour
All borders use frame blue: `rgba(90,158,212,0.35)` — always 1px, always at this opacity or slightly higher (0.45–0.55) for emphasis. Never solid colour borders.

---

## 4. Background treatment

The page background is a two-layer system: a solid icy base colour plus a semi-transparent gradient overlay that creates the overexposed, slightly iridescent quality.

```css
body {
  background: #EEF4F8;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.45) 0%,
    rgba(200,230,248,0.30) 40%,
    rgba(168,216,208,0.25) 70%,
    rgba(200,212,240,0.30) 100%
  );
}
```

All page content sits at `z-index: 1` above this layer.

**Do not use:** grids, grain textures, scan lines, or any other background pattern at the page level. The overexposed wash is the background treatment. It should feel like light diffusing through frosted glass, not a designed texture.

---

## 5. Typography

### Typeface stack
**Three typefaces only.** No exceptions, no substitutions.

1. **Orbitron** — all display headings, navigation, and feature labels. The PS2/transit-display face.
2. **Exo 2** — subtitles at weight 200 italic, body copy at weight 300. The only context for lowercase text.
3. **Share Tech Mono** — all labels, overlines, data readouts, code elements, and wayfinding text. Always uppercase.

Google Fonts import:
```
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,200;0,300;1,200;1,300&family=Share+Tech+Mono&display=swap');
```

### Type scale

| Role | Font | Weight | Size | Line height | Letter spacing | Case |
|---|---|---|---|---|---|---|
| Hero display | Orbitron | 900 | 48–64px | 1.0 | 4–6px | UPPER |
| Display heading | Orbitron | 900 | 36–48px | 1.0 | 3–4px | UPPER |
| Section heading | Orbitron | 700 | 20–28px | 1.2 | 2px | UPPER |
| Feature subtitle | Exo 2 italic | 200 | 14–18px | 1.4 | 2–3px | UPPER |
| Body copy | Exo 2 | 300 | 12–14px | 1.75 | 0px | lower |
| UI overline | Share Tech Mono | 400 | 8–10px | — | 3–4px | UPPER |
| Data / readout | Share Tech Mono | 400 | 9–12px | 1.6 | 0.5–1px | mixed |
| Nav item | Orbitron | 400 | 8px | — | 3px | UPPER |
| Active nav | Orbitron | 700 | 8px | — | 3px | UPPER |

### Typography rules

**Uppercase is the default for display.** Every heading, nav item, label, and data element is uppercase. The only exception is body copy in Exo 2 300.

**Italic is structural, not atmospheric.** Exo 2 italic is used specifically for the subtitle/tagline role — the "Contemporary Soft Club" position under the main heading. It is not used for emphasis within body copy.

**Orbitron is never used at small sizes.** Below 14px, Orbitron becomes illegible. Use Share Tech Mono for small uppercase text.

**Letter spacing is always generous on display text.** Orbitron at 3–6px tracking, Share Tech Mono at 2–4px for labels. This spacing is part of the transit-signage quality of the aesthetic.

---

## 6. Layout and spacing

### Grid
Single-column layout with max-width 960px, centred. Two-column layouts permitted for side-by-side content. Content always has at least 40px padding from page edges.

### Spacing scale
- Page padding: 40–48px
- Section vertical rhythm: 48–60px
- Panel internal padding: 18–26px
- Label-to-content gap: 8–12px
- Ghost frame offset from panel edge: 5–8px

### Border radius
**0px everywhere.** Sharp, system-like, architectural. This is the single most important structural rule — the aesthetic is defined by its angularity. Pill shapes, rounded inputs, and rounded cards are all incorrect.

### Shadows
**None.** Depth comes from opacity layering (more opaque panels sit "above" less opaque ones) and border colour intensity. Drop shadows belong to a different aesthetic entirely.

---

## 7. Ghost frames and overlay language

Ghost frames are the primary decorative and structural element — semi-transparent rectangular panels with thin blue borders and corner bracket pseudo-elements. They are lifted directly from the HUD-rect overlays in the reference image.

### Standard panel / ghost frame

```css
.panel {
  background: rgba(255,255,255,0.40);
  border: 1px solid rgba(90,158,212,0.35);
  position: relative;
}

.panel::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px;
  width: 12px; height: 12px;
  border-top: 1px solid rgba(90,158,212,0.50);
  border-left: 1px solid rgba(90,158,212,0.50);
}

.panel::after {
  content: '';
  position: absolute;
  bottom: 6px; right: 6px;
  width: 12px; height: 12px;
  border-bottom: 1px solid rgba(90,158,212,0.50);
  border-right: 1px solid rgba(90,158,212,0.50);
}
```

### Corner bracket sizes
- Small (cards, data cells): 8–10px
- Standard (panels, sections): 12–14px
- Large (hero panels, feature sections): 16–20px

### Decorative floating ghost frames
Standalone ghost frames — not attached to content panels — can be used as background overlay elements on photography or tinted surfaces. These sit at 15–25% fill opacity and 50% border opacity. They reference the overlapping UI rectangles in the reference image. Use 2–3 overlapping at different sizes and slight offsets for the full effect.

### Data readout elements
Small clusters of monospace text simulating system readouts or transit information displays:
- Font: Share Tech Mono, 8–9px, letter-spacing 1px
- Colour: `#5A9ED4` at 45% opacity
- Content: platform numbers, coordinates, timestamps, system status codes
- Used as background decoration in hero/feature panels, never in reading areas

---

## 8. Code column

The vertical monospace text column is a key decorative element from the reference image — the binary/alphanumeric characters running up the left edge.

```css
.feature-panel {
  position: relative;
  overflow: hidden;
}

.feature-panel::before {
  content: 'GEN X · 00001 · YOUNG ADULT · 10110 · CONTEMPORARY · 01001 · SOFT CLUB · 11010 · TRANSIT · 00110 · SIGNAL · 10001 · PLATFORM · 01110 · 2001 · 11001';
  position: absolute;
  top: 0; left: 0;
  width: 28px;
  height: 100%;
  font-family: 'Share Tech Mono', monospace;
  font-size: 7px;
  color: #5A9ED4;
  opacity: 0.35;
  writing-mode: vertical-rl;
  overflow: hidden;
  letter-spacing: 1px;
  padding: 4px 2px;
  word-break: break-all;
  line-height: 1.2;
  pointer-events: none;
}
```

**Usage rules:**
- Maximum one code column per panel
- Only used in hero sections and large feature panels
- Never in content reading areas, cards, or data sections
- Content offset from code column: `padding-left: 36px` on inner content
- The column width is always 28px

---

## 9. Surface treatments

Six defined surfaces, all built on the icy wash background:

| Surface | Background | Border | Use |
|---|---|---|---|
| Wash | `#EEF4F8` + gradient overlay | — | Page background |
| Ice | `#DCEEF7` | `rgba(200,226,240,0.5)` | Secondary surface areas |
| Ghost white | `rgba(255,255,255,0.40)` | `rgba(90,158,212,0.35)` | Standard panels and cards |
| Teal wash | `rgba(168,216,208,0.35)` | `rgba(106,184,176,0.40)` | Nature / transit / environmental |
| Blue wash | `rgba(184,212,240,0.35)` | `rgba(90,158,212,0.40)` | Data / HUD / technical panels |
| Lavender wash | `rgba(204,212,232,0.40)` | `rgba(136,152,192,0.40)` | Atmospheric / tertiary zones |

All surface swatches have ghost frame corner brackets (pseudo-elements). This is applied universally — it is not optional decoration.

---

## 10. UI component patterns

### Navigation
- Container: full-width bottom border `1px solid rgba(90,158,212,0.35)`
- Items: Orbitron 400, 8px, letter-spacing 3px, uppercase, colour `#5A8AAA`
- Active item: Orbitron 700, colour `#2A6094`, bottom border `2px solid #5A9ED4`
- Background: none (transparent against panel)

### Cards
- Background: `rgba(255,255,255,0.35)`
- Border: `1px solid rgba(90,158,212,0.35)`
- Corner brackets: 10px, `rgba(90,158,212,0.50)`
- Overline: Share Tech Mono 400, 9px, `#5A8AAA`, letter-spacing 2.5px, uppercase
- Title: Orbitron 700, 14px, `#2A6094`, letter-spacing 1px, uppercase
- Body: Exo 2 300, 12px, `#2E6080`, line-height 1.75
- Footer separator: `1px solid rgba(90,158,212,0.25)`

### HUD / stat panels
- Container: grid with `1px rgba(90,158,212,0.35)` gaps
- Cell background: `rgba(255,255,255,0.40)`
- Label: Share Tech Mono 400, 8px, `#5A8AAA`, letter-spacing 2.5px, uppercase
- Value: Orbitron 700, 18–22px, `#2A6094`
- Data bar: 1px height, `#C8E2F0` background, `#5A9ED4` fill at 50% opacity

### Tags / badges
```
font-family: Share Tech Mono
font-size: 9px
letter-spacing: 1.5px
text-transform: uppercase
padding: 3px 10px
border-radius: 0px
border: 1px solid rgba(90,158,212,0.35)
background: rgba(90,158,212,0.10)
color: #2A6094
```

Teal variant: `rgba(106,184,176,0.40)` border, `rgba(106,184,176,0.10)` bg, `#3A8880` text.
Lavender variant: `rgba(136,152,192,0.40)` border, `rgba(136,152,192,0.10)` bg, `#8898C0` text.

### Border variants

| Variant | CSS |
|---|---|
| Default | `border: 1px solid rgba(90,158,212,0.35)` |
| Emphasis | `border: 1px solid rgba(90,158,212,0.55)` |
| Teal | `border: 1px solid rgba(106,184,176,0.45)` |
| Lavender | `border: 1px solid rgba(136,152,192,0.45)` |
| Ghost | `border: 1px solid rgba(255,255,255,0.70)` |
| Left rule | `border-left: 2px solid #5A9ED4` |

---

## 11. Photography guidelines

Photography is a core element of this aesthetic — the reference image is built around a motion-blurred metro scene.

### Required treatment
- **Horizontal motion blur** — applied to the primary subject or background. The train, the city, the infrastructure moves. The human figure is still.
- **Cool colour grade** — desaturate 20–30%, shift hue toward blue. Increase blue channel slightly. Target the look of a slightly underexposed shot under fluorescent tube lighting.
- **Slight overexposure** — highlights should be near-blown. The image should feel like too much light, not too little.

### Subject matter
Use freely: metro platforms and underground stations, glass-and-steel transit infrastructure, city skylines reflected in glass, airports and departure halls, figures with their backs to the viewer (never posed, never facing camera), rain-slicked urban streets at night, monochrome signage systems.

### Avoid
Warm-toned photography, natural daylight scenes, rural or natural settings, portrait photography (subjects facing camera), any photography with high colour saturation.

### Ghost frame overlay on photography
When photography is used as a background, layer 2–3 ghost frames of varying sizes over it at `rgba(255,255,255,0.15)` fill with `rgba(90,158,212,0.45)` borders. Add data readout elements. This completes the HUD-over-photography effect.

---

## 12. Motion

| Type | Value | Notes |
|---|---|---|
| Page transition | `opacity 0.25s ease` | Clean input-switch fade |
| Panel hover | `0.15s ease` | Fill brightens to rgba white 0.55; border to 0.55 opacity |
| Ghost frame drift | `8s ease-in-out infinite` | Optional slow 4px translation on decorative overlay frames |
| Data counter | `1.0s ease-out` | Numeric values count up on entry |
| Default | No animation | Stillness is correct; motion is the exception |

**Motion blur is a photography treatment only** — never apply CSS blur or motion effects to UI elements, text, or interface components. The blur in the aesthetic lives in the images, not the interface.

---

## 13. Hard rules

1. **0px border radius everywhere.** Sharp, system-like, architectural. No exceptions.
2. **All panels are semi-transparent white (35–55% opacity).** The translucency over the icy background is the defining aesthetic quality. Solid opaque panels are incorrect.
3. **Ghost frames on every major panel.** Corner-bracketed transparent rects are the primary decorative language — applied universally via pseudo-elements.
4. **No warm tones, no black, no dark backgrounds.** Everything lives in the cool blue-teal-lavender spectrum on a light ground.
5. **Three typefaces: Orbitron, Exo 2, Share Tech Mono.** No other fonts under any circumstances.
6. **All display text is uppercase.** Body copy in Exo 2 300 is the only exception.
7. **No drop shadows.** Depth from opacity and layering only.
8. **Photography must have horizontal motion blur and cool colour treatment.** Sharp, warm, or posed photography is wrong for this aesthetic.
9. **The code column appears at most once per hero panel.** Never in content areas, cards, or data sections.
10. **Never use pure white as a solid background.** The page background is always the icy wash `#EEF4F8` plus the gradient overlay.

---

## 14. Quick-reference decision tree

**Choosing a text colour:**
- Display headings (Orbitron) → `#2A6094`
- Body copy (Exo 2) → `#2E6080`
- Labels / overlines (Share Tech Mono) → `#5A8AAA`
- Active / accent text → `#5A9ED4`
- Teal zone text → `#3A8880`

**Choosing a surface:**
- Page / canvas → Wash `#EEF4F8` + gradient overlay
- Standard panel or card → Ghost white `rgba(255,255,255,0.40)`
- Elevated / featured panel → Ghost white `rgba(255,255,255,0.55)`
- Data / HUD section → Blue wash `rgba(184,212,240,0.35)`
- Environmental / transit zone → Teal wash `rgba(168,216,208,0.35)`
- Atmospheric / secondary → Lavender wash `rgba(204,212,232,0.40)`

**Choosing a border:**
- Default → `1px solid rgba(90,158,212,0.35)`
- Emphasis / hover → `1px solid rgba(90,158,212,0.55)`
- Teal panel → `1px solid rgba(106,184,176,0.45)`
- Lavender panel → `1px solid rgba(136,152,192,0.45)`
- Ghost overlay → `1px solid rgba(255,255,255,0.70)`
- Callout left rule → `border-left: 2px solid #5A9ED4`

**Choosing a typeface:**
- Display heading, nav, feature label → Orbitron
- Subtitle, body copy, editorial → Exo 2
- Label, overline, data, code, wayfinding → Share Tech Mono

**Background texture decision:**
- Page background → overexposed gradient wash only. No grid, no grain, no other pattern.
- Hero/feature panel → may have code column (left edge) and ghost frame overlays
- Content panel → ghost frame only (corner brackets via pseudo-elements)
- Data panel → blue wash tint + ghost frame
