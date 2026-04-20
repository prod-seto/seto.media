// BPM + Key Detector — browser-side audio analysis
// Key detection: JS port of detect_info() from RAWMASTER_Bundle/rawmaster.py (lines 656–685)
// Algorithm: Krumhansl-Schmuckler key profiles + energy-based BPM via autocorrelation

// ─── Types ────────────────────────────────────────────────────────────────────

export type AudioFormat = 'mp3' | 'wav' | 'flac' | 'aiff' | 'aif' | 'ogg' | 'm4a'
export type NoteClass = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
export type AnalysisPhase = 'idle' | 'decoding' | 'analyzing' | 'done' | 'error'

export interface AnalysisResult {
  bpm: number
  key: NoteClass
  mode: 'major' | 'minor'
  keyConfidence: number
  fileName: string
  duration: number
}

export interface AnalysisState {
  phase: AnalysisPhase
  result: AnalysisResult | null
  errorMessage: string | null
  warningMessage: string | null
}

export type AnalysisErrorCode =
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'DECODE_FAILED'
  | 'SILENT_AUDIO'
  | 'TOO_SHORT'

export class AnalysisError extends Error {
  constructor(public readonly code: AnalysisErrorCode, message: string) {
    super(message)
    this.name = 'AnalysisError'
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const MIN_DURATION_WARN = 10 // seconds — warn below this

const MAX_FILE_SIZE = 52_428_800 // 50 MB
const MIN_DURATION = 3 // seconds — error below this
const SILENT_RMS_THRESHOLD = 0.001
const SUPPORTED_EXTS = new Set<string>(['mp3', 'wav', 'flac', 'aiff', 'aif', 'ogg', 'm4a'])

const KEYS: NoteClass[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Krumhansl-Schmuckler profiles — ported verbatim from rawmaster.py lines 671–672
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]

// ─── FFT — in-place radix-2 Cooley-Tukey ─────────────────────────────────────

function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length
  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t
      t = im[i]; im[i] = im[j]; im[j] = t
    }
  }
  // Butterfly
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len
    const wRe = Math.cos(ang)
    const wIm = Math.sin(ang)
    const half = len >> 1
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0
      for (let j = 0; j < half; j++) {
        const uRe = re[i + j], uIm = im[i + j]
        const vRe = re[i + j + half] * curRe - im[i + j + half] * curIm
        const vIm = re[i + j + half] * curIm + im[i + j + half] * curRe
        re[i + j] = uRe + vRe
        im[i + j] = uIm + vIm
        re[i + j + half] = uRe - vRe
        im[i + j + half] = uIm - vIm
        const nextRe = curRe * wRe - curIm * wIm
        curIm = curRe * wIm + curIm * wRe
        curRe = nextRe
      }
    }
  }
}

// ─── Chroma extraction ────────────────────────────────────────────────────────

// Returns 12-element normalised chroma vector (sum = 1).
// N=4096 gives ~10.8 Hz/bin at 44100 Hz — resolves C/C# even at C3 (gap ~8 Hz).
// Gaussian spreading (σ≈0.5 semitones) across ±1 neighbour avoids hard-rounding errors.
// Per-frame L1 normalisation prevents loud sections from dominating.
// Frequency range 110–3520 Hz (A2–A7) covers most tonal content.
export function extractChromaMean(buffer: AudioBuffer): number[] {
  const sr = buffer.sampleRate
  const samples = buffer.getChannelData(0)
  const N = 4096
  const hop = 2048
  const chroma = new Float64Array(12)
  let frameCount = 0

  // Hann window
  const win = new Float32Array(N)
  for (let i = 0; i < N; i++) win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / N))

  const re = new Float32Array(N)
  const im = new Float32Array(N)

  for (let start = 0; start + N <= samples.length; start += hop) {
    for (let i = 0; i < N; i++) { re[i] = samples[start + i] * win[i]; im[i] = 0 }
    fft(re, im)

    const frameChroma = new Float64Array(12)
    for (let k = 1; k < N / 2; k++) {
      const freq = (k * sr) / N
      if (freq < 110 || freq > 3520) continue
      const mag2 = re[k] * re[k] + im[k] * im[k]
      if (mag2 < 1e-12) continue
      const semitones = 12 * Math.log2(freq / 261.63)
      // Gaussian spreading across ±1 semitone neighbour (σ = 0.5 → exp(-2·d²))
      const nearest = Math.round(semitones)
      for (let offset = -1; offset <= 1; offset++) {
        const pc = (((nearest + offset) % 12) + 12) % 12
        const dist = semitones - (nearest + offset)
        frameChroma[pc] += mag2 * Math.exp(-2 * dist * dist)
      }
    }

    // Per-frame L1 normalisation
    const frameSum = frameChroma.reduce((a, b) => a + b, 0)
    if (frameSum > 0) {
      for (let i = 0; i < 12; i++) chroma[i] += frameChroma[i] / frameSum
      frameCount++
    }
  }

  if (frameCount === 0) return Array.from({ length: 12 }, () => 1 / 12)
  const sum = chroma.reduce((a, b) => a + b, 0)
  return Array.from(chroma).map(v => v / sum)
}

// ─── Pearson correlation + profile rotation ───────────────────────────────────

function pearsonCorr(x: number[], y: number[]): number {
  const n = x.length
  const mx = x.reduce((s, v) => s + v, 0) / n
  const my = y.reduce((s, v) => s + v, 0) / n
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx, dy = y[i] - my
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy
  }
  return dx2 === 0 || dy2 === 0 ? 0 : num / Math.sqrt(dx2 * dy2)
}

// Rotate right by k: element at position 0 moves to position k
// rollRight(profile, k)[k] === profile[0]  (tonic at position k)
function rollRight(arr: number[], k: number): number[] {
  const n = arr.length
  const s = ((k % n) + n) % n
  return [...arr.slice(n - s), ...arr.slice(0, n - s)]
}

// ─── Key detection — Krumhansl-Schmuckler (exhaustive 24-key search) ──────────

// Ported from rawmaster.py detect_info() lines 668–684.
// Exhaustive search over all 12 keys × major/minor, picks highest Pearson correlation.
export function detectKey(chromaMean: number[]): {
  key: NoteClass
  mode: 'major' | 'minor'
  confidence: number
} {
  let bestCorr = -Infinity, bestKey = 0
  let bestMode: 'major' | 'minor' = 'major'

  for (let k = 0; k < 12; k++) {
    const majCorr = pearsonCorr(rollRight(MAJOR_PROFILE, k), chromaMean)
    const minCorr = pearsonCorr(rollRight(MINOR_PROFILE, k), chromaMean)
    if (majCorr > bestCorr) { bestCorr = majCorr; bestKey = k; bestMode = 'major' }
    if (minCorr > bestCorr) { bestCorr = minCorr; bestKey = k; bestMode = 'minor' }
  }

  return {
    key: KEYS[bestKey],
    mode: bestMode,
    confidence: Math.round(Math.max(0, bestCorr) * 100),
  }
}

// ─── BPM detection — energy onset + autocorrelation ──────────────────────────

// Covers 40–250 BPM. Multi-candidate harmonic scoring replaces simple octave
// correction: generates hypotheses at ×0.25/0.5/1/2/4 of the raw peak, scores
// each by summing its own autocorrelation plus 0.5× sub- and super-harmonic
// support, then picks the winner before applying parabolic interpolation.
export function detectBpm(buffer: AudioBuffer): number {
  const sr = buffer.sampleRate
  const samples = buffer.getChannelData(0)
  const frameSize = 2048
  const hop = 512
  const frameCount = Math.floor((samples.length - frameSize) / hop) + 1

  if (frameCount < 10) return 120

  // RMS energy per frame
  const rms = new Float32Array(frameCount)
  for (let i = 0; i < frameCount; i++) {
    const start = i * hop
    let sum = 0
    for (let j = 0; j < frameSize && start + j < samples.length; j++) {
      sum += samples[start + j] * samples[start + j]
    }
    rms[i] = Math.sqrt(sum / frameSize)
  }

  // Onset strength = positive energy flux
  const onset = new Float32Array(frameCount)
  for (let i = 1; i < frameCount; i++) {
    onset[i] = Math.max(0, rms[i] - rms[i - 1])
  }

  // Cover 40–250 BPM
  const frameRate = sr / hop
  const minLag = Math.max(1, Math.round((frameRate * 60) / 250))
  const maxLag = Math.round((frameRate * 60) / 40)
  const usable = frameCount - maxLag

  if (usable < 1) return 120

  // Build full autocorrelation over the search range
  const corrArr = new Float64Array(maxLag + 2)
  let rawBestCorr = -Infinity
  let rawBestLag = Math.round((frameRate * 60) / 120)
  for (let lag = minLag; lag <= maxLag && lag < frameCount; lag++) {
    let corr = 0
    for (let i = 0; i < usable; i++) corr += onset[i] * onset[i + lag]
    corrArr[lag] = corr
    if (corr > rawBestCorr) { rawBestCorr = corr; rawBestLag = lag }
  }

  // Score octave candidates with harmonic support. The fundamental period
  // scores higher because sub-harmonics (double-time) reinforce it.
  let bestLag = rawBestLag
  let bestScore = -Infinity
  for (const factor of [1, 2, 0.5, 4, 0.25]) {
    const lag = Math.round(rawBestLag * factor)
    if (lag < minLag || lag > maxLag) continue
    let score = corrArr[lag]
    const subLag = Math.round(lag / 2)
    if (subLag >= minLag && subLag <= maxLag) score += 0.5 * corrArr[subLag]
    const superLag = lag * 2
    if (superLag <= maxLag) score += 0.5 * corrArr[superLag]
    if (score > bestScore) { bestScore = score; bestLag = lag }
  }

  // Parabolic interpolation for sub-lag precision
  let refinedLag = bestLag
  if (bestLag > minLag && bestLag < maxLag) {
    const y0 = corrArr[bestLag - 1], y1 = corrArr[bestLag], y2 = corrArr[bestLag + 1]
    const denom = y0 - 2 * y1 + y2
    if (denom < 0) refinedLag = bestLag + 0.5 * (y0 - y2) / denom
  }

  return Math.round((frameRate * 60 / refinedLag) * 100) / 100
}

// ─── Decode audio file (call from a user-gesture handler) ────────────────────

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!SUPPORTED_EXTS.has(ext)) {
    throw new AnalysisError('UNSUPPORTED_FORMAT', `unsupported format: .${ext}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new AnalysisError('FILE_TOO_LARGE', `file too large (${Math.round(file.size / 1_048_576)} mb)`)
  }

  const arrayBuffer = await file.arrayBuffer()

  const AudioCtx = (
    typeof window !== 'undefined'
      ? window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : null
  )
  if (!AudioCtx) throw new AnalysisError('DECODE_FAILED', 'web audio not supported in this browser')

  const ctx = new AudioCtx()
  try {
    const buffer = await ctx.decodeAudioData(arrayBuffer)
    if (buffer.duration < MIN_DURATION) {
      throw new AnalysisError(
        'TOO_SHORT',
        `file too short (${buffer.duration.toFixed(1)}s — need at least ${MIN_DURATION}s)`
      )
    }
    // Silence check on a 1000-sample subset
    const ch = buffer.getChannelData(0)
    const step = Math.max(1, Math.floor(ch.length / 1000))
    let sumSq = 0
    for (let i = 0; i < ch.length; i += step) sumSq += ch[i] * ch[i]
    if (Math.sqrt(sumSq / Math.ceil(ch.length / step)) < SILENT_RMS_THRESHOLD) {
      throw new AnalysisError('SILENT_AUDIO', 'audio appears silent or nearly silent')
    }
    return buffer
  } catch (err) {
    if (err instanceof AnalysisError) throw err
    throw new AnalysisError('DECODE_FAILED', 'could not decode this audio file')
  } finally {
    await ctx.close()
  }
}

// ─── Synchronous analysis pass ────────────────────────────────────────────────

export function analyzeBuffer(buffer: AudioBuffer, fileName: string): AnalysisResult {
  const rawChroma = extractChromaMean(buffer)
  // Mild log compression reduces dominance of strong partials so the KS
  // correlation draws more signal from weaker-but-informative pitch classes.
  const compressed = rawChroma.map(c => Math.log1p(10 * c))
  const csum = compressed.reduce((a, b) => a + b, 0)
  const chroma = csum > 0 ? compressed.map(v => v / csum) : rawChroma
  const { key, mode, confidence } = detectKey(chroma)
  const bpm = detectBpm(buffer)
  return { bpm, key, mode, keyConfidence: confidence, fileName, duration: buffer.duration }
}
