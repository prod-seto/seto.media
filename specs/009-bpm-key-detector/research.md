# Research: BPM + Key Detector

**Feature**: 009-bpm-key-detector  
**Date**: 2026-04-18

---

## Decision 1: Browser Audio Processing Stack

**Decision**: Raw Web Audio API + custom JS implementation (no essentia.js)

**Rationale**:
- Constitution Principle IV prohibits new third-party JS dependencies without explicit justification. essentia.js WASM is ~8MB and would violate the spirit of this rule.
- The `detect_info()` function in `rawmaster.py` uses only ~20 lines of meaningful algorithm code once you strip librosa boilerplate. The Krumhansl-Schmuckler key detection is pure linear algebra (dot products and correlations) — trivially portable to JS.
- The Web Audio API's `AudioContext.decodeAudioData()` provides the decoded PCM float32 samples needed as input. No WASM required.
- Beat tracking: a simplified energy-based onset detector (sub-band energy peaks) is sufficient to produce ±2 BPM accuracy for typical music. This is a well-understood algorithm implementable in ~50 lines of JS.

**Alternatives considered**:
- **essentia.js WASM**: More accurate beat tracking, but ~8MB download, WASM startup cost, and violates the no-new-deps rule without strong justification. Rejected.
- **Meyda.js**: Smaller audio feature library, but still an external dependency and overkill for two features. Rejected.
- **Custom + Web Workers**: Future improvement for non-blocking analysis, deferred to v2.

---

## Decision 2: Chroma Feature Extraction

**Decision**: Custom 12-bin chroma extraction via the Web Audio API AnalyserNode + manual pitch-class binning

**Rationale**:
The rawmaster.py implementation uses `librosa.feature.chroma_cqt()` — a Constant-Q Transform chroma. The CQT provides better low-frequency resolution but requires significant implementation effort in the browser.

A simpler and well-validated alternative is Short-Time Fourier Transform (STFT) chroma:
1. Decode the audio file to float32 PCM via `AudioContext.decodeAudioData()`
2. Compute FFT frames across the signal (via OfflineAudioContext + AnalyserNode, or a manual Cooley-Tukey FFT)
3. Map each FFT bin to a pitch class (0–11) using the formula `pitch_class = round(12 * log2(bin_freq / A4_ref)) % 12`
4. Accumulate energy per pitch class to build the 12-bin chroma vector
5. Mean across all frames → 12-element chroma mean (equivalent to `chroma.mean(axis=1)` in rawmaster.py)

The key detection layer (Krumhansl-Schmuckler correlation) is identical to rawmaster.py and ports verbatim.

**Alternatives considered**:
- **Full CQT in JS**: More accurate, especially for bass-heavy tracks. ~150 lines of additional implementation. Deferred to v2 if accuracy issues arise.
- **essentia.js CQT**: Accurate but large dependency. Rejected (see Decision 1).

---

## Decision 3: BPM Detection Algorithm

**Decision**: Energy-based onset detection with autocorrelation tempo estimation

**Rationale**:
`librosa.beat.beat_track()` uses a complex dynamic programming approach. A simpler approach that achieves ±2 BPM for typical music:
1. Compute RMS energy in overlapping frames (~23ms hop, ~46ms window)
2. Compute onset strength as positive flux (energy increase between frames)
3. Find dominant periodicity via autocorrelation of the onset strength signal
4. Resolve the tempo from the dominant autocorrelation peak (with octave-error correction: prefer 80–160 BPM range)

This approach is sufficient for the SC-002 success criterion (±2 BPM for 80% of tracks) and requires no external libraries.

**Alternatives considered**:
- **essentia.js BeatTracker**: Matches librosa accuracy but requires the WASM bundle. Rejected.
- **Simple peak picking**: Less accurate, doesn't handle syncopated or complex rhythms. Rejected.

---

## Decision 4: File Decoding

**Decision**: `AudioContext.decodeAudioData()` for all supported formats

**Rationale**:
- Chrome, Firefox, and Safari all support MP3, WAV, OGG, and M4A natively via `decodeAudioData()`
- FLAC and AIFF support varies; we validate the format before attempting decode and display a browser-specific fallback message if decoding fails
- The file is read as an `ArrayBuffer` via `FileReader.readAsArrayBuffer()` — no server upload at any point

---

## Decision 5: Tool Page Route

**Decision**: New route at `/tools/bpm-key` (file: `src/app/tools/bpm-key/page.tsx`)

**Rationale**:
- Consistent with the existing `/tools` section
- The tools page at `/tools` already renders a grid of tool cards (DiskCard components); the BPM + Key Detector is the first functional tool that has its own dedicated page
- The new page is a server component shell (for SiteNav + metadata) wrapping a client component `<BpmKeyDetector />` that handles all state and Web Audio processing

---

## Decision 6: Confidence Score Calculation

**Decision**: Normalize the winning Pearson correlation to 0–100%

**Rationale**:
The rawmaster.py code computes `np.corrcoef()` — the Pearson correlation between the rolled Krumhansl-Schmuckler profile and the chroma mean. The correlation value is in [−1, +1]. We map it to confidence as:
```
confidence = Math.round(Math.max(0, winningCorrelation) * 100)
```
A correlation of 0.0 or below = 0% confidence; 1.0 = 100%. In practice, clear tonal tracks score 0.85–0.95 (85–95%).

---

## Resolved Clarifications

All NEEDS CLARIFICATION markers from the spec have been resolved:

| Question | Resolution |
|----------|-----------|
| Audio processing stack | Web Audio API + custom JS (no external deps) |
| Confidence score definition | Pearson correlation of winning KS profile, mapped 0–100% |
| File size hard limit | 50MB — warn above 25MB, block above 50MB |
| Minimum file duration | 3 seconds minimum for analysis; warn < 10 seconds |
| Supported formats in practice | MP3, WAV, OGG, M4A (universal); FLAC/AIFF with graceful fallback |
