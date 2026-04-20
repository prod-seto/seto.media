# Tasks: PS2 Disc Redesign — Authentic Layout & Full Admin Configurability

**Input**: Design documents from `/specs/006-ps2-disc-redesign/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — `npm run build` + manual verification per quickstart.md is the gate.

---

## Phase 1: Setup (Schema + Types)

**Purpose**: Add the 12 new columns to the `tools` table and regenerate TypeScript types. No component work can begin until T002 is complete — DiskCard.tsx and the admin edit page both depend on the updated `Tables<"tools">` type.

**⚠️ CRITICAL**: T001 requires manual Supabase dashboard access and cannot be automated.

- [ ] T001 Run ALTER TABLE SQL + seed UPDATE in Supabase SQL Editor per `specs/006-ps2-disc-redesign/quickstart.md` (adds bg_color, bg_gradient, game_subtitle, game_font_size, esrb_rating, esrb_descriptors, catalog_number, region, rim_text, info_text, hub_color, extra_badges; seeds defaults on three tools)
- [x] T002 Run `npm run db:types` to regenerate `src/lib/database.types.ts` — verify all 12 new columns appear in the `tools` table Row type

**Checkpoint**: `database.types.ts` has all 12 new columns. TypeScript compiles cleanly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: `SetoLogo.tsx` is used inside `DiskCard.tsx` (US1). The disc zone CSS classes in `globals.css` underpin `DiskCard.tsx`. Both must exist before any story implementation begins. T003 and T004 touch different files and can run in parallel.

**⚠️ CRITICAL**: No story work can begin until T003 and T004 are complete.

- [x] T003 [P] Create `src/components/SetoLogo.tsx` — inline SVG React component accepting a `size?: number` prop (default 48, controls overall height in px); renders the SETO COMPUTER ENTERTAINMENT logo: "SETO" wordmark in bold uppercase sans-serif at top; diamond icon (rotated 45° square) with two interlocking color fills — orange-red (`#D4521A`) lower-left and gold-yellow (`#F0C030`) upper-right, divided by an S-curve path creating a stylized S shape; "COMPUTER" and "ENTERTAINMENT" stacked below in small uppercase; all elements scale proportionally to `size`; export named `SetoLogo`
- [x] T004 [P] Rebuild disc zone CSS in `src/app/globals.css` — replace existing `.disk-wrapper`, `.disk-face`, `.disk-artwork`, `.disk-hub`, `.disk-label` classes with: `.disk-wrapper` (display block, text-decoration none, position relative, cursor pointer), `.disk-face` (aspect-ratio 1, clip-path circle(50%), position relative, overflow hidden), `.disk-art-zone` (position absolute, top 0, left 0, width 100%, height 62%), `.disk-art-bg` (position absolute, inset 0, width 100%, height 100%, object-fit cover, opacity 0.85, mix-blend-mode multiply), `.disk-art-gradient` (position absolute, inset 0, background radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)), `.disk-info-band` (position absolute, top 62%, left 0, width 100%, height 28%, background rgba(0,0,0,0.72), display flex, align-items center, padding 0 6%), `.disk-brand-bar` (position absolute, top 90%, left 0, width 100%, height 10%, background #0d0d0d, display flex, align-items center, justify-content center), `.disk-hub` (position absolute, top 50%, left 50%, transform translate(-50%,-50%), width 10%, height 10%, clip-path circle(50%), border 1px solid rgba(90,158,212,0.40)), `.disk-rim` (position absolute, inset 0, clip-path none, pointer-events none — thin SVG ring or box-shadow inset 0 0 0 2px rgba(180,180,180,0.35)), `.disk-rim-text` (position absolute, inset 0, pointer-events none — SVG overlay container), `.disk-game-title` (position absolute, top 12%, width 100%, text-align center, padding 0 12%, letter-spacing 2px, text-shadow 0 1px 4px rgba(0,0,0,0.7)), `.disk-game-subtitle` (position absolute, top 24%, width 100%, text-align center, padding 0 14%, font-size 55% of title size, letter-spacing 1.5px, color rgba(255,255,255,0.75))

**Checkpoint**: `SetoLogo` compiles. Disc zone CSS classes are in `globals.css`. Build passes.

---

## Phase 3: User Story 1 — Authentic PS2 Disc Layout (Priority: P1) 🎯 MVP

**Goal**: Every disc on `/tools` renders authentic PS2 anatomy — art zone, info band, brand bar, hub ring, rim — with the tool name on the disc face, not below it.

**Independent Test**: Navigate to `/tools`. Each disc shows the tool name as text on the disc itself (not below). A darker info band is visible at the bottom of the art area. The very bottom strip reads "PlayStation®2". A center hub ring is visible. Resize to mobile — discs stack correctly, proportions preserved.

### Implementation for User Story 1

- [x] T005 [US1] Rebuild `src/components/DiskCard.tsx` — disc structure pass: render `<Link>` with `.disk-wrapper` to `/tools/${tool.slug}`; inside, `.disk-face` contains: `.disk-art-zone` div with inline `background: tool.bg_color` — if `tool.disk_image_url` set render `<img className="disk-art-bg">` — if `tool.bg_gradient` true render `.disk-art-gradient` div; `.disk-info-band` div; `.disk-brand-bar` div with hardcoded "PlayStation®2" in white Share Tech Mono ~7px letter-spacing 2px; `.disk-hub` div with inline `background: tool.hub_color`; rim ring (CSS box-shadow inset or thin absolutely-positioned ring element); when `tool.rim_text` non-null render `.disk-rim-text` SVG overlay with `<path id="rim-arc">` describing a circle at ~47% radius and `<textPath href="#rim-arc">` containing `tool.rim_text` in Share Tech Mono 6px rgba(255,255,255,0.45) — no separate `.disk-label` paragraph below the disc
- [x] T006 [US1] Add game title and subtitle to `src/components/DiskCard.tsx` — inside `.disk-art-zone`: render `.disk-game-title` element with `tool.name`, inline `fontFamily` resolved from `fontVars` record (`turret-road` → `var(--font-turret-road)`, `chakra-petch` → `var(--font-chakra-petch)`, `teko` → `var(--font-teko)`), inline `color: tool.disk_font_color`, inline `fontSize: calc(var(--disc-size, 200px) * ${tool.game_font_size / 100})` — set `--disc-size` as CSS custom property on `.disk-wrapper` via `style` prop using `ref` + `offsetWidth` or just use percent-based `font-size` relative to the wrapper (`${tool.game_font_size}cqw` if container queries supported, else `${tool.game_font_size}%` of a known base); if `tool.game_subtitle` non-null render `.disk-game-subtitle` element below title with same font family, smaller size
- [x] T007 [US1] Add info band content to `src/components/DiskCard.tsx` — inside `.disk-info-band`: left side: `<SetoLogo size={discHeight * 0.18} />` component (or fixed size ~32px, right-aligned to ~80% of band width); if `tool.esrb_rating` non-null render ESRB text badge — a small bordered box in Share Tech Mono showing the rating letter(s) with a descriptor line below in 6px text; if `tool.catalog_number` non-null render it in Share Tech Mono ~7px rgba(255,255,255,0.6); render `tool.region` badge as small uppercase mono text; if `tool.info_text` non-null render fine-print text in Share Tech Mono ~6px rgba(255,255,255,0.4); if `tool.extra_badges` non-empty render a row of badge items — each `{icon, label}` shows icon (if non-empty) and label in small mono text; cast `tool.extra_badges as Array<{icon: string; label: string}>`

**Checkpoint**: US1 fully functional — `/tools` shows authentic PS2 disc anatomy, tool names on disc face, info band with SETO logo, "PlayStation®2" brand bar, responsive at all breakpoints.

---

## Phase 4: User Story 2 — Full Admin Disc Configurability (Priority: P2)

**Goal**: Admin can edit all configurable disc properties from the edit page and see a live preview. Changes persist to the public page.

**Independent Test**: Sign in, navigate to `/admin/tools`, click EDIT on any tool. All new fields are present in the form. Change game subtitle and bg_color — preview updates immediately. Save and confirm changes appear on `/tools`.

### Implementation for User Story 2

- [x] T008 [P] [US2] Update `src/app/actions/tools.ts` — extend `updateToolDisk` `data` param type to include all 12 new columns: `bg_color?: string; bg_gradient?: boolean; game_subtitle?: string | null; game_font_size?: number; esrb_rating?: 'E' | 'T' | 'M' | 'AO' | null; esrb_descriptors?: string | null; catalog_number?: string | null; region?: 'NTSC U/C' | 'NTSC J' | 'PAL'; rim_text?: string | null; info_text?: string | null; hub_color?: string; extra_badges?: Array<{icon: string; label: string}>` — no other changes needed; the `.update(data)` call already passes all fields through to Supabase
- [x] T009 [P] [US2] Rebuild `src/app/admin/tools/[id]/edit/page.tsx` — add state variables and form controls for all 12 new columns alongside existing ones: `bgColor`/`<input type="color">` + hex text fallback, `bgGradient`/`<input type="checkbox">`, `gameSubtitle`/`<input type="text">`, `gameFontSize`/`<input type="number" min="6" max="20" step="0.5">` with label "FONT SIZE (% OF DISC)", `esrbRating`/`<select>` with options None/E/T/M/AO, `esrbDescriptors`/`<input type="text">`, `catalogNumber`/`<input type="text">`, `region`/`<select>` with options "NTSC U/C"/"NTSC J"/"PAL", `rimText`/`<input type="text">`, `infoText`/`<textarea>`, `hubColor`/`<input type="color">` + hex text fallback, `extraBadges`/`<textarea>` accepting JSON array string with parse error handling; populate all state on load from fetched tool data; update `previewTool` assembly to spread all new fields from current state; update `handleSave` call to pass all new fields to `updateToolDisk`; update local tool state on successful save to include all new fields

**Checkpoint**: US2 fully functional — admin can edit all configurable props, live preview reflects changes, save persists to Supabase, public `/tools` reflects saved changes on reload.

---

## Phase 5: Polish & Final Gate

**Purpose**: Build verification and visual confirmation.

- [x] T010 Run `npm run build` — verify zero TypeScript errors; confirm all affected routes compile: `/tools`, `/tools/[slug]`, `/admin/tools`, `/admin/tools/[id]/edit`
- [ ] T011 Manual browser verification per `specs/006-ps2-disc-redesign/quickstart.md` — complete both the US1 and US2 checklists

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 manual first; T002 runs after T001
- **Foundational (Phase 2)**: Depends on T002 (types); T003 + T004 can run in parallel
- **US1 (Phase 3)**: Depends on T003 (SetoLogo) and T004 (CSS); T005 → T006 → T007 are sequential (same file)
- **US2 (Phase 4)**: Depends on T005–T007 (DiskCard needed for live preview); T008 + T009 can run in parallel
- **Polish (Phase 5)**: T010 then T011 after all implementation complete

### Critical Path

```
T001 (Supabase SQL) → T002 (db:types) → T003 + T004 → T005 → T006 → T007 → T008 + T009 → T010 → T011
```

### Parallel Opportunities

- T003 + T004 (SetoLogo and CSS — different files)
- T008 + T009 (Server Action and admin edit page — different files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001–T002)
2. Complete Phase 2 (T003–T004)
3. Complete Phase 3 (T005–T007)
4. **STOP and VALIDATE**: Authentic disc layout visible at `/tools`, tool names on disc, all zones correct, mobile layout works
5. Deploy if ready

### Full Delivery

1. Setup (Phase 1) → T001, then T002
2. Foundational (Phase 2) → T003 + T004 in parallel
3. US1 (Phase 3) → T005 → T006 → T007 (sequential, same file)
4. US2 (Phase 4) → T008 + T009 in parallel
5. Polish (Phase 5) → T010, then T011

---

## Notes

- T001 requires manual Supabase dashboard access; cannot be run from code
- `extra_badges` in the admin form is edited as a JSON textarea — parse on save, show an error if JSON is invalid before calling `updateToolDisk`
- `game_font_size` is stored as `real` (float, % of disc diameter); render as `fontSize: \`${tool.game_font_size}cqw\`` on `.disk-game-title` (or a percentage of a fixed reference width if container queries are not available)
- The `SetoLogo` size in the info band should be calculated relative to the rendered disc width — using a fixed px size (e.g. 32px) is acceptable for the initial implementation; refine if needed
- Total: 11 tasks across 5 phases; 2 parallel opportunities
