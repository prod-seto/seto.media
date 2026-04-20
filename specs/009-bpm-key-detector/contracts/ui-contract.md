# UI Contract: BpmKeyDetector

**Feature**: 009-bpm-key-detector  
**Date**: 2026-04-18

---

## Component: `<BpmKeyDetector />`

The single client component that owns the entire tool interaction. No props — it is self-contained.

```typescript
// src/components/BpmKeyDetector.tsx
'use client'

export default function BpmKeyDetector(): React.JSX.Element
```

---

## Component: `<BpmKeyDetectorPage />` (page shell)

```typescript
// src/app/tools/bpm-key/page.tsx
// Server component — renders SiteNav (already in layout) + BpmKeyDetector

export default function BpmKeyPage(): React.JSX.Element
```

---

## Analysis Engine: `analyzeBpmAndKey()`

The pure analysis function. No React dependency — importable independently for testing.

```typescript
// src/lib/bpm-key-analysis.ts

export async function analyzeBpmAndKey(
  file: File
): Promise<AnalysisResult>
```

**Throws** `AnalysisError` (see below) on:
- Unsupported format
- File too large (> 50MB)
- Decode failure
- Silent/near-silent audio

```typescript
export class AnalysisError extends Error {
  constructor(
    public readonly code: AnalysisErrorCode,
    message: string
  ) { super(message) }
}

export type AnalysisErrorCode =
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'DECODE_FAILED'
  | 'SILENT_AUDIO'
  | 'TOO_SHORT'
```

---

## Rendered State Contract

| `AnalysisPhase` | What user sees |
|-----------------|----------------|
| `idle` | Ghost-panel drop zone with `.type-label` instruction text |
| `decoding` | Animated indicator, `.type-label` status "decoding audio…" |
| `analyzing` | Animated indicator, `.type-label` status "detecting bpm + key…" |
| `done` | Results ghost-panel: BPM value, key+mode, confidence bar, copy buttons |
| `error` | Error ghost-panel with `.type-body` message, reset button |

---

## Copy Button Contract

Three buttons rendered in the `done` phase:

| Button label | Clipboard payload | Example |
|---|---|---|
| `copy bpm` | BPM as string, two decimal places | `"128.00"` |
| `copy key` | Key + mode, lowercase | `"c# minor"` |
| `copy all` | Combined formatted | `"128.00 bpm · c# minor"` |

Labels MUST be lowercase in JSX (`.type-label` handles uppercase transform via CSS).

---

## Design System Compliance

| Requirement | Implementation |
|---|---|
| Typography | `.type-display` for BPM/key values, `.type-label` for all labels and button text, `.type-body` for instructions |
| Container | `.ghost-panel` for drop zone and results panel |
| Palette | `#2A6094` heading text, `#5A9ED4` accent/border, `#5A8AAA` secondary/labels |
| Border radius | 0px — no rounding anywhere |
| Shadows | None |
| Bold | Not used (max weight 400) |
| Uppercase | Only via `.type-label` CSS class — never inline `text-transform` |

---

## Tool Card Entry (tools grid)

The existing tools page at `/tools` MUST have a card added for this tool. The `DiskCard` component renders each tool. A new database row in the `tools` table will point to `/tools/bpm-key`.

[NEEDS IMPLEMENTATION NOTE: The `tools` table row is created via the admin panel, not hardcoded. The tool page is navigable directly at `/tools/bpm-key` regardless of whether the card row exists.]
