# Quickstart: Mobile Responsiveness Fixes

**Branch**: `011-mobile-responsiveness`

## What This Feature Does

Makes every public page of seto.media usable on mobile screens (320px–375px). The current site was built desktop-first with fixed 40px horizontal padding and many inline `style` props that cannot respond to viewport width. This feature converts those to Tailwind responsive classes and adds targeted CSS media queries for shared panel styles.

## Dev Environment

```bash
npm run dev          # http://localhost:3000
npm run build        # TypeScript gate — must pass before committing
```

Open Chrome DevTools → Toggle Device Toolbar → set to 375px (iPhone SE) and 320px for testing.

## Key Files

| File | What changes |
|------|-------------|
| `src/app/globals.css` | Add `@media (max-width: 639px)` rules for `.ghost-panel` and `.tracklist-panel` padding |
| `src/app/page.tsx` | Outer padding: `px-4 sm:px-10 pt-8 pb-20` |
| `src/app/tools/page.tsx` | Outer padding + file tree font sizes to `text-sm sm:text-lg` |
| `src/app/tools/[slug]/page.tsx` | Outer + hero padding |
| `src/app/downloads/page.tsx` | Outer padding + file tree font sizes |
| `src/app/downloads/adrift-stash-kit/page.tsx` | `flex-col sm:flex-row`, responsive image |
| `src/components/SiteNav.tsx` | Two-row navbar on mobile: `flex-col sm:flex-row`, reduced padding/font |
| `src/components/ReleaseCard.tsx` | Artist stacks below title on mobile; image 64px→88px responsive |
| `src/components/SoundCloudPlayer.tsx` | Play button width: `w-20 sm:w-[88px]` |
| `src/components/BeatCard.tsx` | Verify fits at 320px; reduce gap if needed |

## Approach

- **Mobile-first Tailwind**: Base className = mobile styles. Add `sm:` prefix for ≥640px (desktop) values.
- **Inline styles → className**: Non-dynamic inline styles become Tailwind classes. State-driven styles (e.g., `isPlaying`) keep their `style` prop for the dynamic part only.
- **No new dependencies, no schema changes, no new components.**

## Testing Checklist

After each file change, verify in browser at 375px and 320px:

- [ ] No horizontal scrollbar on the page
- [ ] All text is readable (not clipped, not overflowing)
- [ ] All buttons are tappable (≥44px touch target)
- [ ] `npm run build` passes with zero TypeScript errors

Pages to verify:
- [ ] `/` — homepage catalog, navbar
- [ ] `/tools` — file tree
- [ ] `/tools/[any-slug]` — tool detail
- [ ] `/downloads` — file tree
- [ ] `/downloads/adrift-stash-kit` — image stack layout

## Constitution Reminders

- 0px border radius everywhere — do not add `rounded` classes
- Only palette colors — do not add arbitrary color values
- After all changes: visual verify at BOTH desktop (≥960px) and mobile (≤680px)
- `npm run build` must pass before every commit
