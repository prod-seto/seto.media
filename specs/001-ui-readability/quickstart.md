# Quickstart: Verify UI Readability Changes

**Branch**: `001-ui-readability`

## Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## Verification checklist

### Section headings
- [ ] "RELEASES" heading renders in Orbitron, bold, ~16px — clearly larger than tag labels
- [ ] "BEATS" heading renders in Orbitron, bold, ~16px — clearly larger than tag labels
- [ ] Neither heading has a numeric prefix ("01 ·" or "02 ·")

### Beat list
- [ ] Beat row titles (e.g., "outside", "no sleep") are visibly larger than before
- [ ] Tag badges in beat rows (e.g., "OSAMASON", "FAKEMINK") are legible without zoom

### Catalog divider
- [ ] No "─── CATALOG ───" divider appears between the hero and the catalog grid

### Hero banner (must not change)
- [ ] Vertical code column text is unchanged
- [ ] "PLATFORM 01 · SYS:ONLINE · 2025.03" data readout is unchanged
- [ ] SETO.MEDIA wordmark is unchanged

### Mobile (resize to ≤680px)
- [ ] Tab switcher shows "releases" / "beats" — legible
- [ ] Beat list rows readable on narrow screen

### Build gate
```bash
npm run build
# Must exit 0 with no TypeScript errors
```
