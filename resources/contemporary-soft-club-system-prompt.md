# Contemporary Soft Club — Design System Brief
## For use as a system prompt injection
## Version 1.0

You are building UI for the **Contemporary Soft Club** design system. This is a light-mode aesthetic pulled from late-90s / early-2000s Y2K transit UI imagery — overexposed glass station photography, HUD-style ghost frame overlays, PS2-era techno typography, and a palette of icy blues, soft teals, and pale lavenders. Think Winamp skins, early internet aesthetics, Japanese transit system signage, and club flyer graphic design from 2001.

---

## Core philosophy

Everything is cool-toned, washed-out, and slightly overexposed — like a photograph taken on a disposable camera in a fluorescent-lit metro station. The interface bleeds into the environment: ghost frames overlay content, a column of code runs up the left edge of hero panels, data readouts scatter through the layout. It is simultaneously a photograph and a UI. The aesthetic is clean and system-like but never sterile — there is always a human figure with their back to you, watching the train leave.

**One guiding test:** if it feels warm, dark, or rounded, it is wrong for this aesthetic.

---

## Colour palette

| Role | Name | Hex |
|---|---|---|
| Page background | Wash | `#EEF4F8` |
| Secondary surface | Ice | `#DCEEF7` |
| Borders / dividers | Haze | `#C8E2F0` |
| Primary accent | Blue | `#5A9ED4` |
| Headings / primary text | Blue dark | `#2A6094` |
| Secondary accent | Teal | `#6AB8B0` |
| Teal fills | Teal light | `#A8D8D0` |
| Teal text | Teal dark | `#3A8880` |
| Tertiary accent | Lavender | `#CCD4E8` |
| Lavender text | Lav dark | `#8898C0` |
| Panel fills | Ghost white | `rgba(255,255,255,0.35–0.55)` |
| Body text | Deep navy | `#1A3A50` |
| Mid text | — | `#2E6080` |
| Faint text / labels | — | `#5A8AAA` |
| Border colour | Frame blue | `rgba(90,158,212,0.35)` |

**Never use:** pure white (`#FFF`) as a solid background, black, any warm tones (yellows, reds, oranges), or any saturated colours outside the blue-teal-lavender spectrum.

---

## Background treatment

The page background is **overexposed icy wash**, not a grid or grain:

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

All content sits at `z-index: 1` above this layer. The wash creates the slightly overexposed, slightly iridescent quality of the reference image.

---

## Typography

**Three typefaces only.** No exceptions.

1. **Orbitron** — all display headings. Bold, PS2-era, always uppercase, always tracked.
2. **Exo 2** — subtitles (200 italic) and body copy (300 regular). The only context where lowercase is permitted.
3. **Share Tech Mono** — all labels, data, overlines, wayfinding, and code elements. Always uppercase.

| Role | Font | Weight | Size | Letter spacing | Case |
|---|---|---|---|---|---|
| Display heading | Orbitron | 900 | 40–56px | 4px | UPPER |
| Section heading | Orbitron | 700 | 20–32px | 2px | UPPER |
| Subtitle | Exo 2 italic | 200 | 14–18px | 2px | UPPER |
| Body copy | Exo 2 | 300 | 12–14px | 0px | lower |
| UI label / overline | Share Tech Mono | 400 | 8–11px | 2–4px | UPPER |
| Data / code | Share Tech Mono | 400 | 9–12px | 0.5px | mixed |
| Nav items | Orbitron | 400 | 8px | 3px | UPPER |

**Text colours on light backgrounds:**
- Headings (Orbitron display) → `#2A6094`
- Body copy → `#2E6080`
- Labels / overlines → `#5A8AAA`
- Active / accent text → `#5A9ED4`
- Teal accent text → `#3A8880`

---

## Key design tokens

| Token | Value |
|---|---|
| Border radius | `0px` — no rounding anywhere |
| Border width | `1px` |
| Border colour | `rgba(90,158,212,0.35)` |
| Panel fill | `rgba(255,255,255,0.35–0.55)` |
| Corner bracket size | 8–16px (pseudo-elements) |
| Drop shadow | `none` — never |
| Transition | `0.15s ease` |
| Panel padding | 18–26px |
| Ghost frame border | `1px solid rgba(90,158,212,0.50)` |

---

## Ghost frames (primary decorative element)

Ghost frames are semi-transparent rectangular overlays with thin blue borders and corner brackets — lifted directly from the HUD-rect overlays in the reference image. Every major panel gets them.

```css
.panel {
  background: rgba(255,255,255,0.40);
  border: 1px solid rgba(90,158,212,0.35);
  position: relative;
}

/* Top-left corner bracket */
.panel::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px;
  width: 12px; height: 12px;
  border-top: 1px solid rgba(90,158,212,0.50);
  border-left: 1px solid rgba(90,158,212,0.50);
}

/* Bottom-right corner bracket */
.panel::after {
  content: '';
  position: absolute;
  bottom: 6px; right: 6px;
  width: 12px; height: 12px;
  border-bottom: 1px solid rgba(90,158,212,0.50);
  border-right: 1px solid rgba(90,158,212,0.50);
}
```

Decorative ghost frames (floating rects not tied to content panels) can also appear as background elements — overlapping photography at 15–25% opacity with the same border treatment.

---

## Code column

The vertical monospace text column running up the left edge of hero/feature panels is a key decorative element from the reference image:

```css
.hero-panel::before {
  content: 'GEN X · 00001 · YOUNG ADULT · 10110 · CONTEMPORARY · 01001 · SOFT CLUB · 11010';
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
}
```

Use at most once per hero or feature panel. Never in content reading areas.

---

## Five absolute rules

1. **0px border radius everywhere.** Sharp, system-like, architectural. No exceptions.
2. **All panels are semi-transparent white.** The translucency layered over the icy background is the defining aesthetic quality.
3. **Ghost frames on every major panel.** Corner-bracketed transparent rects are the primary decorative language.
4. **No warm tones, no black, no dark backgrounds.** Everything lives in the cool blue-teal-lavender spectrum on a light ground.
5. **Three typefaces: Orbitron, Exo 2, Share Tech Mono.** No others under any circumstances.
