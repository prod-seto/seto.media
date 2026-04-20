# Data Model: BPM + Key Detector

**Feature**: 009-bpm-key-detector  
**Date**: 2026-04-18

---

## Overview

This feature is entirely client-side and stateless. There is no Supabase schema change and no server-side persistence. All entities exist only in browser memory during an active session.

---

## Entities

### AudioFile

Represents the file the user submits for analysis. Never leaves the browser.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `name` | `string` | `File.name` | Display name (e.g., "track.mp3") |
| `size` | `number` | `File.size` | Bytes |
| `format` | `AudioFormat` | Derived from extension | One of: mp3, wav, flac, aiff, ogg, m4a |
| `duration` | `number \| null` | Post-decode | Seconds; null until decoded |
| `buffer` | `AudioBuffer \| null` | Post-decode | Raw decoded PCM; released after analysis |

```typescript
type AudioFormat = 'mp3' | 'wav' | 'flac' | 'aiff' | 'ogg' | 'm4a'

interface AudioFile {
  name: string
  size: number
  format: AudioFormat
  duration: number | null
  buffer: AudioBuffer | null
}
```

**Validation rules**:
- `size` MUST be ≤ 52,428,800 bytes (50MB); error if exceeded
- `format` MUST be in the allowed set; error if unrecognised extension
- `duration` MUST be ≥ 3 seconds; warn if < 10 seconds

---

### AnalysisResult

The output produced after processing an `AudioFile`. Ephemeral — exists only for the current session view.

| Field | Type | Notes |
|-------|------|-------|
| `bpm` | `number` | Tempo in beats per minute, two decimal places |
| `key` | `NoteClass` | Detected root note (C through B with sharps) |
| `mode` | `'major' \| 'minor'` | Detected tonality |
| `keyConfidence` | `number` | Pearson correlation → 0–100 integer |
| `fileName` | `string` | Source file name, for display |

```typescript
type NoteClass = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

interface AnalysisResult {
  bpm: number
  key: NoteClass
  mode: 'major' | 'minor'
  keyConfidence: number
  fileName: string
}
```

---

### AnalysisState

Tracks the UI lifecycle of a single analysis session. Drives the component's rendered state.

```typescript
type AnalysisPhase = 'idle' | 'decoding' | 'analyzing' | 'done' | 'error'

interface AnalysisState {
  phase: AnalysisPhase
  result: AnalysisResult | null
  errorMessage: string | null
  warningMessage: string | null
}
```

| Phase | Rendered UI |
|-------|-------------|
| `idle` | Drop zone with instructions |
| `decoding` | Progress indicator, "Decoding audio…" |
| `analyzing` | Progress indicator, "Detecting BPM and key…" |
| `done` | Results panel with copy buttons |
| `error` | Error message + reset button |

---

## Algorithm Constants (from rawmaster.py)

These are ported directly from `RAWMASTER_Bundle/rawmaster.py` — `detect_info()`:

```typescript
const KEYS: NoteClass[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
```

These constants do not live in the data model layer — they are implementation details of the analysis engine — but are documented here for traceability back to the source reference.

---

## No Schema Changes

This feature makes no changes to the Supabase `tools` table or any other table. `database.types.ts` does not need regeneration.
