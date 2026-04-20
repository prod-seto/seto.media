# Quickstart: Public Release Prep

**Feature**: 010-public-release-prep

---

## Pre-Code Steps (do these first)

### 1. Prepare the drum kit files

Before writing any code, prepare the static assets:

```bash
# Zip the drum kit folder (replace paths as needed)
cd "/Volumes/SSK SSD/seto sound bank"
zip -r adrift-stash-kit.zip "◈ adrift stash kit - @prod_seto"

# Copy the zip and cover art into the project
cp adrift-stash-kit.zip /Users/seto/projects/seto-blog/public/downloads/
```

Then find the cover art JPEG inside the folder and copy it:
```bash
# Find the JPEG (adjust filename after inspecting the folder)
ls "/Volumes/SSK SSD/seto sound bank/◈ adrift stash kit - @prod_seto/"
# Copy it
cp "/Volumes/SSK SSD/seto sound bank/◈ adrift stash kit - @prod_seto/<cover-art>.jpg" \
   /Users/seto/projects/seto-blog/public/downloads/adrift-stash-kit-cover.jpg
```

---

## Implementation Order

Work top-down — lower-risk fixes first, new page last.

### Step 1 — Surgical text/style fixes (no new files)

1. `src/app/tools/page.tsx` line 199: `/producer-tools` → `/producer_tools`
2. `src/components/ReleasesCatalog.tsx`: `"Releases"` → `"Produced by me"`
3. `src/components/SiteNav.tsx`: add DOWNLOADS link between HOME and TOOLS

### Step 2 — UI polish fixes

4. `src/components/ReleaseCard.tsx` — `Waveform` component: change flex to grid (see `contracts/ui-contract.md`)
5. `src/components/SoundCloudPlayer.tsx` — play button: add `display: "inline-flex", alignItems: "center", justifyContent: "center"`
6. `src/components/BeatCard.tsx` — play button: same centering fix

### Step 3 — Cross-column audio coordination

7. Create `src/lib/audio-coordinator.ts` (see `data-model.md` for full type signatures)
8. Edit `src/components/BeatCard.tsx`: import coordinator, register pause, notify on play
9. Edit `src/components/SoundCloudPlayer.tsx`: import coordinator, register pause, notify on play

### Step 4 — Tools page coming-soon rules

10. Edit `src/app/tools/page.tsx`: add `isComingSoon` prop to `FolderSection`, suppress Link/subtitle/arrow for coming_soon items

### Step 5 — Downloads page (new files)

11. Create `src/app/downloads/page.tsx` — file tree with static data
12. Create `src/app/downloads/[slug]/page.tsx` — detail page with cover art + download button

---

## Adding New Downloads in the Future

1. Zip and upload the new asset to `public/downloads/`
2. Add a new entry to `RELEASED_ITEMS` in `src/app/downloads/page.tsx`
3. Add a new case to the slug lookup in `src/app/downloads/[slug]/page.tsx`

No database changes needed.

---

## Verification Checklist (manual)

- [ ] `/tools` root label shows `/producer_tools`
- [ ] Coming_soon tools on `/tools` are not clickable and have no subtitle
- [ ] Navbar shows HOME, DOWNLOADS, TOOLS in that order
- [ ] DOWNLOADS link is active (dark color) when on `/downloads`
- [ ] Homepage left column header reads "Produced by me"
- [ ] Waveform bars are all equal width when a release is loaded
- [ ] Play/Pause buttons are vertically and horizontally centered in both columns
- [ ] Playing a release pauses any active beat
- [ ] Playing a beat pauses any active release
- [ ] `/downloads` page renders the file tree correctly
- [ ] Coming_soon items on `/downloads` are not clickable and have no subtitle
- [ ] Clicking "◈ adrift stash kit" navigates to `/downloads/adrift-stash-kit`
- [ ] Cover art renders on detail page
- [ ] Download button triggers zip file download
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] All above verified at ≥960px and ≤680px viewport widths
