# Data Model: Public Release Prep

**Feature**: 010-public-release-prep  
**Date**: 2026-04-19

---

## No Schema Changes

This feature introduces no Supabase schema changes. The downloads page uses static, hardcoded data defined in the source code.

---

## New TypeScript Types

### `DownloadItem`

Represents a single downloadable item in the file tree. Defined inline in `src/app/downloads/page.tsx` (not exported — only one consumer).

```typescript
type DownloadItem = {
  slug: string;          // URL-safe identifier, e.g. "adrift-stash-kit"
  name: string;          // Display name in file tree, e.g. "◈ adrift stash kit"
  description?: string;  // Optional subtitle — omitted for coming_soon items
  coverArt: string;      // Path to cover art image, e.g. "/downloads/adrift-stash-kit-cover.jpg"
  zipPath: string;       // Path to zip file, e.g. "/downloads/adrift-stash-kit.zip"
};
```

### `DownloadFolder`

Represents a folder in the downloads file tree.

```typescript
type DownloadFolder = {
  name: string;          // Folder label, e.g. "released", "coming_soon"
  items: DownloadItem[]; // Items inside; coming_soon items have no description
  comingSoon: boolean;   // When true, items are non-clickable and have no subtitle
};
```

### `ComingSoonItem`

Represents a named placeholder (not downloadable). Used for `coming_soon` entries that have no slug or zip.

```typescript
type ComingSoonItem = {
  name: string;          // Display name only, e.g. "round_robin.vst3"
};
```

---

## Static Data (hardcoded in source)

```typescript
// src/app/downloads/page.tsx

const RELEASED_ITEMS: DownloadItem[] = [
  {
    slug: "adrift-stash-kit",
    name: "◈ adrift stash kit",
    coverArt: "/downloads/adrift-stash-kit-cover.jpg",
    zipPath: "/downloads/adrift-stash-kit.zip",
  },
];

const COMING_SOON_ITEMS: ComingSoonItem[] = [
  { name: "round_robin.vst3" },
];
```

---

## Audio Coordinator Module

New module at `src/lib/audio-coordinator.ts`. Module-level (not React state, not Supabase).

```typescript
// src/lib/audio-coordinator.ts

let pauseBeats: (() => void) | null = null;
let pauseReleases: (() => void) | null = null;

export function registerBeatPause(fn: () => void): void;
export function registerReleasePause(fn: () => void): void;
export function notifyBeatPlay(): void;    // called when a beat starts; triggers pauseReleases
export function notifyReleasePlay(): void; // called when a release starts; triggers pauseBeats
```

**Registrations** (called once at module initialization level, not inside React components):
- `BeatCard.tsx`: `registerBeatPause(() => { currentAudio?.pause(); currentAudio = null; })`
- `SoundCloudPlayer.tsx`: `registerReleasePause(() => { currentWidget?.pause(); })`

**Notifications** (called inside event handlers):
- `BeatCard.tsx` play handler: `notifyBeatPlay()`
- `SoundCloudPlayer.tsx` `toggle()` when `!isPlaying`: `notifyReleasePlay()`

---

## Static Assets

These files must be prepared and placed in `public/downloads/` before the first deploy of this branch:

| File | Source | Notes |
|------|--------|-------|
| `adrift-stash-kit.zip` | `/Volumes/SSK SSD/seto sound bank/◈ adrift stash kit - @prod_seto/` | Zip the entire folder |
| `adrift-stash-kit-cover.jpg` | JPEG inside the above folder | Copy as-is |
