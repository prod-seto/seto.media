# Feature Specification: BPM + Key Detector

**Feature Branch**: `009-bpm-key-detector`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "BPM + Key Detector — Drop a file → instantly returns tempo, key (C# minor, etc.), and confidence. Source reference: detect_info() from RAWMASTER_Bundle/rawmaster.py — chroma CQT + Krumhansl-Schmuckler key profiles + librosa.beat.beat_track(). Browser stack: essentia.js (WASM) or raw Web Audio API FFT."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drop File, Get Instant BPM and Key (Priority: P1)

A music producer or beat-maker drops an audio file onto the tool and immediately sees the track's tempo (BPM) and musical key (e.g., "C# minor") along with a confidence indicator — without uploading to any server.

**Why this priority**: This is the entire core value proposition. Everything else is polish. A user should be able to drop a file and get a result with no further interaction.

**Independent Test**: Drop any MP3 or WAV file onto the detector drop zone; the tool displays BPM and key within a few seconds on a typical consumer laptop, delivering the full intended value.

**Acceptance Scenarios**:

1. **Given** the tool page is open, **When** a user drops a supported audio file (MP3, WAV, FLAC, AIFF, OGG, M4A) onto the drop zone, **Then** the tool displays the detected BPM (e.g., "128.00"), musical key (e.g., "C#"), and mode (e.g., "minor") within 10 seconds for a typical 3–5 minute track.
2. **Given** detection has completed, **When** the results are displayed, **Then** a confidence score (0–100%) is shown alongside the key result so the user can judge reliability.
3. **Given** the tool page is open, **When** a user clicks the drop zone to browse files instead of dragging, **Then** a file picker opens and the same analysis flow runs after selection.

---

### User Story 2 - Copy Results for Workflow Use (Priority: P2)

A producer wants to tag their sample library or fill in metadata and needs to copy the detected BPM and key values directly into another app without retyping.

**Why this priority**: The output is only useful if it's easy to act on. One-click copy removes friction for the most common downstream action.

**Independent Test**: After analysis completes, clicking a copy button puts "128 C# minor" (or equivalent formatted string) onto the clipboard, which can be pasted directly into a DAW, file manager, or spreadsheet.

**Acceptance Scenarios**:

1. **Given** results are displayed, **When** a user clicks "Copy BPM", **Then** the BPM value is copied to clipboard as plain text.
2. **Given** results are displayed, **When** a user clicks "Copy Key", **Then** the key + mode string (e.g., "C# minor") is copied to clipboard.
3. **Given** results are displayed, **When** a user clicks "Copy All", **Then** a formatted string combining BPM and key is copied (e.g., "128 BPM · C# minor").

---

### User Story 3 - Analyze Another File Without Reloading (Priority: P3)

A producer working through a batch of samples wants to analyze multiple files in one session without refreshing the page.

**Why this priority**: Session continuity matters for productivity workflows. Previous results should be clearable so users can run a fresh analysis.

**Independent Test**: After viewing results, a user drops a second file; the UI resets, runs analysis on the new file, and displays fresh results — all without a page reload.

**Acceptance Scenarios**:

1. **Given** results from a previous file are showing, **When** a user drops a new file, **Then** the tool clears previous results and begins fresh analysis.
2. **Given** results are showing, **When** a user clicks a "Reset" or "Analyze another" button, **Then** the drop zone reappears and prior results are cleared.

---

### Edge Cases

- What happens when the user drops a non-audio file (e.g., a JPEG or PDF)? Display a clear error message; do not crash.
- What happens when the audio file is silent or nearly silent? Display "Unable to detect" with an explanation rather than showing 0 BPM or a random key.
- What happens when the file is very short (under 3 seconds)? Attempt analysis but warn that results may be unreliable below a minimum duration.
- What happens when the file is extremely large (e.g., 200MB)? The tool should display a progress indicator and complete without browser tab crash; if the file exceeds a safe threshold, display a file-size warning.
- What happens on a browser that does not support the required audio APIs? Display a clear compatibility message directing the user to a supported browser.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The tool MUST accept audio files via drag-and-drop onto a designated drop zone.
- **FR-002**: The tool MUST accept audio files via a click-to-browse file picker as an alternative to drag-and-drop.
- **FR-003**: The tool MUST detect and display the tempo of the audio as a BPM value rounded to two decimal places (e.g., 128.00).
- **FR-004**: The tool MUST detect and display the musical key of the audio using standard note names (C, C#, D, D#, E, F, F#, G, G#, A, A#, B).
- **FR-005**: The tool MUST detect and display the mode (major or minor) of the audio.
- **FR-006**: The tool MUST display a confidence percentage (0–100%) for the key detection result.
- **FR-007**: All audio processing MUST occur entirely in the user's browser — no audio data is sent to any server.
- **FR-008**: The tool MUST support the following audio file formats: MP3, WAV, FLAC, AIFF, OGG, M4A.
- **FR-009**: The tool MUST display a progress indicator while analysis is running.
- **FR-010**: The tool MUST display a user-friendly error message for unsupported file types, silent audio, and files that are too short to analyze reliably.
- **FR-011**: The tool MUST provide one-click copy for BPM, key+mode, and a combined formatted string.
- **FR-012**: The tool MUST allow the user to reset and analyze a new file without reloading the page.
- **FR-013**: The tool MUST display a warning (not an error) when a file is very short (under a minimum viable duration for accurate detection).

### Key Entities

- **AudioFile**: The file submitted by the user. Key attributes: name, format, duration, size. Processed entirely client-side — never persisted or transmitted.
- **AnalysisResult**: The output of a detection run. Attributes: BPM (numeric), key (note name), mode (major/minor), keyConfidence (0–100%). Ephemeral — exists only in the current session view.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A typical 3–5 minute audio file produces BPM and key results within 10 seconds on a consumer-grade device.
- **SC-002**: BPM detection matches manual tap-tempo measurement within ±2 BPM for 80% of test tracks.
- **SC-003**: Key detection matches known ground-truth key for 75% of test tracks with a confidence score ≥ 70%.
- **SC-004**: Zero audio data leaves the user's device — verifiable via network inspector showing no outgoing requests containing audio payloads.
- **SC-005**: The tool operates without error on the two most recent versions of Chrome, Firefox, and Safari.
- **SC-006**: Users can complete an end-to-end analysis (drop → result → copy) in under 30 seconds on first use with no instruction needed.

## Assumptions

- The tool is built as a new page or embedded section within the existing seto.media tools area, consistent with the site's current design system.
- Users are assumed to have a modern browser (Chrome, Firefox, or Safari — latest two versions); legacy browser support is out of scope.
- The Krumhansl-Schmuckler key profiles from RAWMASTER's `detect_info()` — specifically the major and minor profile arrays and the chroma correlation approach — will be ported directly to JavaScript for key detection, as the source is already clean and well-validated.
- Beat tracking follows the same approach as librosa's beat tracker in RAWMASTER, adapted for the browser audio stack (essentia.js WASM preferred; Web Audio API FFT as fallback).
- File size limit is assumed to be 50MB; files above this threshold display a warning before proceeding or block processing if the browser environment cannot handle it safely.
- No login or account is required to use the tool.
- Results are not saved between sessions; the tool is stateless.
- The confidence score is derived from the Pearson correlation value of the winning key profile match, normalized to a 0–100% scale.
