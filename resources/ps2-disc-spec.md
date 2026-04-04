# Anatomy — zone breakdown

## Disc body

Full circular container — 1:1 aspect ratio. Clip all content to a circle (clip-path or border-radius 50%).

## Art zone

Roughly the top 55–60% of the disc. Background image, character art, or thematic illustration. Gradient overlay beneath text for legibility.

## Info band

Lower 30–35% strip. Holds PS logo, publisher logo, ESRB rating, region code, catalog number, and fine-print text.

## Brand bar

Bottom 8% – dark strip with white "PlayStation®2" logotype. Consistent across all discs.

## Hub ring

Center spindle hole — ~10% of disc diameter. White or semi-transparent circle. Inner ring ~5% diameter for the actual hole.

## Rim ring

Thin metallic border around the outer edge. ~2px stroke in a silver/dark tone. Contains legal text along the inner rim path.

## Game title

Positioned in the art zone, typically upper-center or upper-left. Custom font per game, often italic or stylized.

---

# Configurable props

| Prop | Type / values | Notes |
|------|---------------|-------|
| `discSize` | number (px) | Width = height. All internals scale proportionally. |
| `bgImage` | url \| null | Art zone background. Falls back to bgColor if null. |
| `bgColor` | CSS color string | Base color when no image. RE4 = dark blue, GT3 = electric blue. |
| `bgGradient` | boolean | Radial vignette overlay on art zone for depth. |
| `gameName` | string | Primary title text rendered in the art zone. |
| `gameSubtitle` | string \| null | Secondary line — e.g. "Sons of Liberty", "A-Spec". |
| `gameFont` | CSS font-family | Per-game custom font. Load via Google Fonts / @font-face. |
| `gameFontSize` | number (% of disc diameter) | Relative sizing — ~8–14% of disc width is typical. |
| `gameTitleColor` | CSS color string | Usually white or near-white. Some games use gold. |
| `publisherLogo` | url \| null | SVG or PNG. Positioned right-center of info band. |
| `publisherName` | string | Fallback text if no logo image. |
| `esrbRating` | `'E'` \| `'T'` \| `'M'` \| `'AO'` \| null | Renders official ESRB box icon in info band. |
| `esrbDescriptors` | string | e.g. "Blood and Gore, Violence". |
| `catalogNumber` | string | e.g. "SLUS 21134". Displayed in small mono text. |
| `region` | `'NTSC U/C'` \| `'NTSC J'` \| `'PAL'` | Shown as badge in info band. |
| `rimText` | string \| null | Legal / copyright text along the inner rim arc. |
| `infoText` | string \| null | Copyright body text block in info band. |
| `brandBarText` | string | Defaults to "PlayStation®2". |
| `brandBarColor` | CSS color string | Near-black — #0a0a0a or #111. |
| `hubColor` | CSS color string | Central spindle area. Usually white or light gray. |
| `extraBadges` | array of {icon, label} | e.g. Dolby Pro Logic II, DVD-ROM logo. |

---

# Layout measurements (as % of disc diameter)

## Hub hole

| Property | Value |
|----------|-------|
| diameter | ~10% |
| inner hole | ~5% |

## Art zone height

| Property | Value |
|----------|-------|
| top | 0% |
| bottom | ~62% down |

## Info band

| Property | Value |
|----------|-------|
| top | ~62% |
| bottom | ~90% |

## Brand bar

| Property | Value |
|----------|-------|
| top | ~90% |
| bottom | 100% |

## Rim border

| Property | Value |
|----------|-------|
| stroke | ~1.5% of diameter |
| position | inset from edge |

## PS logo (info band)

| Property | Value |
|----------|-------|
| left | ~8% |
| size | ~13% of diameter |

## ESRB box

| Property | Value |
|----------|-------|
| width | ~9% |
| left | ~25–28% |

## Publisher logo

| Property | Value |
|----------|-------|
| right | ~8% |
| width | ~18–22% |
