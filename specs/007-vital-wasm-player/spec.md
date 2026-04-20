# Feature Specification: Vital WASM Player

**Feature Branch**: `007-vital-wasm-player`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "Vital Web Engine — embed WASM-compiled Vital audio engine into tools page for browser-based preset auditioning with virtual keyboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activate Audio and Play a Note (Priority: P1)

A visitor on the tools page wants to hear what a Vital preset sounds like. They click "Activate Audio" to initialise the audio system, then click a key on the virtual keyboard. A note plays, rendered accurately by the Vital engine loaded with the current preset.

**Why this priority**: This is the core value proposition — hearing a preset in the browser with no plugins or downloads. Nothing else matters if this does not work.

**Independent Test**: Load the page with any preset prop, click "Activate Audio", click a piano key, hear a note. This standalone interaction is the entire MVP.

**Acceptance Scenarios**:

1. **Given** the tools page is open and audio has not been activated, **When** the user clicks "Activate Audio", **Then** the button disappears and the keyboard becomes playable.
2. **Given** audio is activated, **When** the user clicks a key on the virtual keyboard, **Then** the Vital engine plays the corresponding note at a default velocity.
3. **Given** audio is activated and a key is held, **When** the user releases the key, **Then** the note stops (respecting the preset's release envelope).

---

### User Story 2 - Load a New Preset Without Reloading the Page (Priority: P2)

A developer has integrated `<VitalPlayer />` into the preset pack generator. The user browses presets; each selection passes a new preset JSON to the component. The engine re-initialises with the new preset within a second, and the next keypress plays the new sound.

**Why this priority**: Preset-switching is the core interaction of the preset generator use case — the component has no practical value as an audition tool if changing the preset requires a page reload.

**Independent Test**: Render the component twice with different preset props (or swap the prop in state), click a key after each swap, confirm different sounds play.

**Acceptance Scenarios**:

1. **Given** a preset is loaded and playing, **When** the `preset` prop changes, **Then** the engine reloads within 100ms and the keyboard remains playable.
2. **Given** a new preset has been loaded, **When** the user plays a note, **Then** the sound reflects the new preset, not the previous one.

---

### User Story 3 - Computer Keyboard Input (Priority: P3)

A power user prefers typing on their keyboard to clicking a mouse. They use the home row (A, S, D, F, G, H, J, K, L) and adjacent rows as a piano keyboard layout, playing notes without touching the mouse.

**Why this priority**: Computer keyboard input significantly improves playability for users who want to test melodic or harmonic content quickly. It does not affect the core audio path and can be added after the mouse/touch path works.

**Independent Test**: Focus the page, press and release a mapped key, confirm a note plays and stops.

**Acceptance Scenarios**:

1. **Given** audio is activated, **When** the user presses a key mapped to a piano note, **Then** the corresponding key visually highlights and the note plays.
2. **Given** a note is playing via keyboard, **When** the user releases the key, **Then** the note stops.
3. **Given** the user holds multiple keys simultaneously, **Then** all corresponding notes play concurrently (up to the engine's polyphony limit).

---

### User Story 4 - Touch Input on Mobile (Priority: P4)

A mobile visitor taps keys on the virtual keyboard. Notes play on touch-down and stop on touch-release, behaving the same as mouse interaction.

**Why this priority**: The site is mobile-responsive. The keyboard must be usable on touch devices, but this is lower priority than desktop playability.

**Independent Test**: On a touch device, tap and release a key; confirm note-on and note-off behaviour.

**Acceptance Scenarios**:

1. **Given** audio is activated on a touch device, **When** the user taps a key, **Then** a note plays.
2. **Given** a note is playing, **When** the user lifts their finger, **Then** the note stops.

---

### Edge Cases

- What happens when the browser does not support WebAssembly? The player displays a "Browser not supported" message and hides the keyboard.
- What happens if the WASM binary fails to load (network error, corrupt file)? The player shows an error state with a user-readable message; no crash propagates to the parent page.
- What happens if the `preset` prop is `null` or undefined? The engine uses a silent/default state; no error is thrown.
- What happens if "Activate Audio" is never clicked and a key is pressed programmatically? No audio plays; the audio context remains suspended.
- What happens if the component is unmounted while a note is sustaining? All active notes are silenced and the audio engine is disposed cleanly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The player MUST display an "Activate Audio" prompt on first render; audio MUST NOT start until this prompt is explicitly acknowledged by the user.
- **FR-002**: After activation, users MUST be able to trigger notes by clicking virtual piano keys with a mouse or pointer device.
- **FR-003**: Users MUST be able to trigger notes by touching virtual piano keys on a touch-enabled device.
- **FR-004**: Users MUST be able to trigger notes by pressing mapped computer keyboard keys while the player is in focus.
- **FR-005**: The virtual keyboard MUST cover a minimum of 2 octaves (24 semitones).
- **FR-006**: The player MUST accept a preset data object as a configuration input; the preset determines the sound engine parameters.
- **FR-007**: When the preset input changes, the sound engine MUST reload with the new preset within 100ms without requiring user interaction.
- **FR-008**: The audio engine MUST be loaded on demand (when the user first interacts with the tools page), not on application startup.
- **FR-009**: Notes MUST stop when the triggering input is released (mouse-up, touch-end, keyboard key-up).
- **FR-010**: The player MUST handle audio engine load failure gracefully, showing a readable error state without crashing the surrounding page.
- **FR-011**: The player MUST handle unsupported browsers gracefully (no WebAssembly support), showing a "Browser not supported" message.
- **FR-012**: When the player component is removed from the page, all active notes MUST be silenced and all audio resources MUST be released.
- **FR-013**: The page hosting the player MUST display a GPL-3.0 attribution notice for Vital, including a visible link to the Vital source repository (https://github.com/mtytel/vital).

### Key Entities

- **Preset**: A structured data object that defines all synthesis parameters for a sound. Contains settings for oscillators, filters, envelopes, effects, and modulation. Loaded into the engine to determine what notes sound like.
- **Virtual Keyboard**: The UI element representing piano keys. Receives user input (mouse, touch, keyboard) and translates it to note-on/note-off events with pitch and velocity values.
- **Audio Engine**: The WASM-compiled audio synthesis module. Accepts note events and preset data; outputs audio to the browser's audio system.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can go from page load to hearing a note in 3 or fewer interactions (e.g., click Activate Audio → click a key).
- **SC-002**: When the preset is changed, the next note played reflects the new preset — verified by the user hearing a different sound.
- **SC-003**: The audio engine loading does not increase the initial page load time measurably (engine is loaded lazily, not at startup).
- **SC-004**: Notes respond to input within 50ms of a user gesture, with no perceptible lag between key press and sound onset.
- **SC-005**: The component can be dropped into any location in the tools section by a developer and functions without additional configuration.
- **SC-006**: On a touch device, tapping and releasing a key produces a note-on and note-off as reliably as mouse interaction.

## Assumptions

- Users are visiting on a modern browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+) that supports WebAssembly and the Web Audio API.
- The Vital WASM binary and its JavaScript glue code are produced by a **separate prerequisite story** (Vital → WASM compilation spike). This story depends on that artifact being available in `/public/vital-engine/` before implementation begins. The compilation work — including Emscripten toolchain setup, JUCE audio backend replacement, and binary size optimisation — is explicitly out of scope here.
- Preset data objects conform to the existing Vital JSON schema — no preset format conversion is required within this feature.
- Polyphony is managed internally by the audio engine; the number of simultaneous voices is not configurable by the user in this story.
- MIDI device input (hardware keyboards, controllers) is explicitly out of scope.
- Saving or recording audio output is explicitly out of scope.
- The component does not display synthesis controls (knobs, sliders, modulation view, wavetable editor) — audio preview only.
- The tools page is an existing page in the application; this feature adds the player component to it, not a new page.

## Clarifications

### Session 2026-04-15

- Q: Is WASM compilation work in scope for this story, or should it be treated as a separate prerequisite task/story? → A: Separate prerequisite story — WASM compilation is its own story/spike; this story consumes its artifact.
- Q: How should the spec treat GPL-3.0 compliance for the distributed WASM binary? → A: Add as a spec constraint — the page serving the player MUST display a GPL-3.0 attribution notice linking to the Vital source repo.
