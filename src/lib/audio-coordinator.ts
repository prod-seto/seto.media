let pauseBeats: (() => void) | null = null;
let pauseReleases: (() => void) | null = null;

export function registerBeatPause(fn: () => void): void { pauseBeats = fn; }
export function registerReleasePause(fn: () => void): void { pauseReleases = fn; }
export function notifyBeatPlay(): void { try { pauseReleases?.(); } catch { /* stale widget ref after navigation */ } }
export function notifyReleasePlay(): void { try { pauseBeats?.(); } catch { /* stale audio ref after navigation */ } }
