# Quickstart: Beats List Redesign Verification

**Branch**: `002-beats-list-redesign`
**Gate**: `npm run build` + manual visual review (desktop + mobile)

## Run the app locally

```bash
npm run dev
```

Open `http://localhost:3000` in Chrome or Safari.

---

## Desktop verification (≥960px)

Open browser to full width (≥960px).

### Filter zone

- [ ] The beats section is a **single** `ghost-panel` containing both the filter header and the beat rows
- [ ] The top-left corner bracket of the panel sits in the filter header area — not overlapping any play button
- [ ] A "FILTER" label (small monospace, grey) appears at the left of the filter header
- [ ] All tags are visible as buttons in the filter header; they wrap to a second line naturally if needed
- [ ] Active tags have a blue tinted background; inactive tags are faint
- [ ] The × CLEAR button appears only when at least one tag is active; clicking it deactivates all tags
- [ ] A 1px divider separates the filter header from the first beat row

### Beat rows

- [ ] Every row has the same vertical height in its resting (not playing) state — no row is taller than another
- [ ] **Line 1**: Play button + title on the same line; title uses Orbitron bold, blue
- [ ] **Line 2**: BPM and key on their own line, indented to align with the title, clearly readable (≥11px)
- [ ] **Line 3**: Tags on their own wrapping line, indented — clicking a tag toggles the filter
- [ ] A beat with no tags renders correctly without an empty tag area
- [ ] A beat with only BPM (no key) or only key (no BPM) renders without "· " orphan punctuation

### Playing state

- [ ] Click ▶ on a beat — the row expands with canvas visualizer, progress bar, and timestamps
- [ ] The visualizer reacts to audio frequencies in real time
- [ ] Clicking the progress bar seeks to that position; timestamps update
- [ ] Click ▶ on a second beat while the first is playing — the first stops, the second starts
- [ ] Click ⏸ — the track pauses; row collapses; play button resets to ▶

### Empty state

- [ ] Activate tags that match no beats — "No beats match the selected tags." message appears
- [ ] Deactivate tags or click × CLEAR — the full list reappears

---

## Mobile verification (≤680px)

Resize browser to ≤680px (or DevTools mobile simulation).

- [ ] The beats tab is accessible via the tab switcher at the top
- [ ] When beats tab is active: the single ghost-panel filter + list renders full width
- [ ] Filter tags wrap without overflowing the screen
- [ ] Beat rows are readable; BPM/key line is visible without zooming
- [ ] Tag filter and play/pause work the same as desktop

---

## Build gate

```bash
npm run build
```

Expected: zero TypeScript errors, build completes successfully.
