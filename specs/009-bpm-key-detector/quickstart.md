# Quickstart: BPM + Key Detector

**Feature**: 009-bpm-key-detector  
**Date**: 2026-04-18

---

## What's being built

A client-side audio analysis page at `/tools/bpm-key`. Drop an audio file → the browser decodes it, runs a JS port of RAWMASTER's `detect_info()` algorithm, and displays BPM + musical key + confidence. No server, no upload, no external dependencies.

---

## New files

```
src/
├── app/
│   └── tools/
│       └── bpm-key/
│           └── page.tsx           ← server shell (metadata + layout)
├── components/
│   └── BpmKeyDetector.tsx         ← 'use client' — all state + UI
└── lib/
    └── bpm-key-analysis.ts        ← pure analysis engine (no React)
```

---

## Algorithm origin

The key detection in `bpm-key-analysis.ts` is a direct JS port of `detect_info()` in `/Users/seto/projects/RAWMASTER_Bundle/rawmaster.py` (lines 656–685):

```python
# rawmaster.py — this is what we're porting
chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
chroma_mean = chroma.mean(axis=1)
# ...
major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
idx = keys.index(key)
maj_corr = np.corrcoef(np.roll(major_profile, -idx), chroma_mean)[0, 1]
min_corr = np.corrcoef(np.roll(minor_profile, -idx), chroma_mean)[0, 1]
mode = "major" if maj_corr > min_corr else "minor"
```

In JS, `np.corrcoef` becomes a manual Pearson correlation helper; `np.roll` becomes an array rotation helper. Both are ~5 lines each.

---

## Analysis pipeline

```
File (drag/click)
  → FileReader.readAsArrayBuffer()
  → AudioContext.decodeAudioData()          [browser decodes mp3/wav/etc]
  → extractChromaMean(audioBuffer)          [FFT → 12-bin chroma vector]
  → detectKey(chromaMean)                   [KS correlation → key + mode + confidence]
  → detectBpm(audioBuffer)                  [energy onset → autocorrelation → BPM]
  → AnalysisResult
```

---

## Dev setup

```bash
# No new dependencies — uses existing Web Audio API
npm run dev
# Navigate to http://localhost:3000/tools/bpm-key
# Drop any MP3/WAV to test
```

---

## Key constraints (from constitution)

- `AudioContext` MUST be created inside a user-gesture handler (the drop/click event), not on component mount
- No new npm dependencies — all analysis is pure JS + browser APIs
- `'use client'` on `BpmKeyDetector.tsx` only; `page.tsx` is a server component
- Visual verify at ≥960px and ≤680px before marking done
- `npm run build` must pass with zero TypeScript errors
