'use client'

import { useRef, useState } from 'react'
import {
  type AnalysisResult,
  type AnalysisState,
  AnalysisError,
  MIN_DURATION_WARN,
  decodeAudioFile,
  analyzeBuffer,
} from '@/lib/bpm-key-analysis'

const IDLE_STATE: AnalysisState = {
  phase: 'idle',
  result: null,
  errorMessage: null,
  warningMessage: null,
}

const ERROR_MESSAGES: Record<string, string> = {
  UNSUPPORTED_FORMAT: 'unsupported file type — try mp3, wav, ogg, or m4a',
  FILE_TOO_LARGE: 'file too large — maximum 50 mb',
  DECODE_FAILED: 'could not read this file — it may be corrupt or an unsupported format',
  SILENT_AUDIO: 'audio appears silent — nothing to analyze',
  TOO_SHORT: 'file too short — need at least 3 seconds of audio',
}

export default function BpmKeyDetector() {
  const [state, setState] = useState<AnalysisState>(IDLE_STATE)
  const [isDragging, setIsDragging] = useState(false)
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── File intake ─────────────────────────────────────────────────────────

  async function handleFile(file: File) {
    setState({ phase: 'decoding', result: null, errorMessage: null, warningMessage: null })
    setIsDragging(false)

    let buffer: AudioBuffer
    try {
      buffer = await decodeAudioFile(file)
    } catch (err) {
      const msg =
        err instanceof AnalysisError
          ? (ERROR_MESSAGES[err.code] ?? err.message)
          : 'an unexpected error occurred'
      setState({ phase: 'error', result: null, errorMessage: msg, warningMessage: null })
      return
    }

    setState(prev => ({ ...prev, phase: 'analyzing' }))
    // Yield to React so the 'analyzing' label renders before the CPU-intensive pass
    await new Promise<void>(r => setTimeout(r, 50))

    let result: AnalysisResult
    try {
      result = analyzeBuffer(buffer, file.name)
    } catch (err) {
      const msg = err instanceof AnalysisError ? (ERROR_MESSAGES[err.code] ?? err.message) : 'analysis failed'
      setState({ phase: 'error', result: null, errorMessage: msg, warningMessage: null })
      return
    }

    const warning =
      result.duration < MIN_DURATION_WARN
        ? `short file (${result.duration.toFixed(1)}s) — results may be less accurate`
        : null

    setState({ phase: 'done', result, errorMessage: null, warningMessage: warning })
  }

  // ─── Drag-and-drop ───────────────────────────────────────────────────────

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  // ─── Copy ────────────────────────────────────────────────────────────────

  function copyText(label: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLabel(label)
      setTimeout(() => setCopiedLabel(null), 1200)
    })
  }

  function reset() {
    setState(IDLE_STATE)
    setIsDragging(false)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const { phase, result, errorMessage, warningMessage } = state

  return (
    <>
      <style>{`
        @keyframes bkd-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .bkd-copy-btn {
          background: transparent;
          border: 1px solid rgba(90,158,212,0.40);
          color: #5A8AAA;
          cursor: pointer;
          padding: 7px 16px;
          font-family: 'Unifont', monospace;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .bkd-copy-btn:hover {
          border-color: rgba(90,158,212,0.75);
          color: #2A6094;
        }
        .bkd-ghost-link {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'Unifont', monospace;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(90,158,212,0.55);
        }
        .bkd-ghost-link:hover { color: #5A9ED4; }
      `}</style>

      <div
        className="ghost-panel"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: '48px 40px',
          outline: isDragging ? '2px solid rgba(90,158,212,0.70)' : 'none',
          outlineOffset: '-2px',
          transition: 'outline 0.1s',
          minHeight: '240px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {/* ── Idle ── */}
        {phase === 'idle' && (
          <button
            onClick={openFilePicker}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <span
                className="type-display"
                style={{ fontSize: '40px', color: 'rgba(90,158,212,0.35)', lineHeight: 1 }}
              >
                ◈
              </span>
            </div>
            <p className="type-body" style={{ color: '#2E6080', marginBottom: '8px' }}>
              {isDragging ? 'release to analyze' : 'drop an audio file to analyze'}
            </p>
            <p className="type-label" style={{ color: '#5A8AAA' }}>
              or click to select
            </p>
            <p
              className="type-label"
              style={{ color: 'rgba(90,158,212,0.40)', marginTop: '20px', fontSize: '13px' }}
            >
              mp3 · wav · flac · aiff · ogg · m4a
            </p>
          </button>
        )}

        {/* ── Decoding / Analyzing ── */}
        {(phase === 'decoding' || phase === 'analyzing') && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  background: '#5A9ED4',
                  animation: 'bkd-pulse 1.2s ease-in-out infinite',
                }}
              />
            </div>
            <p className="type-label" style={{ color: '#5A8AAA' }}>
              {phase === 'decoding' ? 'decoding audio…' : 'detecting bpm + key…'}
            </p>
          </div>
        )}

        {/* ── Done ── */}
        {phase === 'done' && result && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* File name */}
            <p className="type-label" style={{ color: 'rgba(90,158,212,0.50)', marginBottom: '32px' }}>
              {result.fileName}
            </p>

            {/* Results row */}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                marginBottom: '40px',
              }}
            >
              {/* BPM */}
              <div>
                <p
                  className="type-display"
                  style={{ fontSize: 'clamp(48px, 7vw, 80px)', color: '#1A3A50', lineHeight: 1, marginBottom: '6px' }}
                >
                  {result.bpm.toFixed(2)}
                </p>
                <p className="type-label" style={{ color: '#5A8AAA' }}>bpm</p>
              </div>

              {/* Divider */}
              <div
                style={{ width: '1px', background: 'rgba(90,158,212,0.20)', alignSelf: 'stretch', minHeight: '60px' }}
                aria-hidden
              />

              {/* Key + mode */}
              <div>
                <p
                  className="type-display"
                  style={{ fontSize: 'clamp(48px, 7vw, 80px)', color: '#1A3A50', lineHeight: 1, marginBottom: '6px' }}
                >
                  {result.key.toLowerCase()} {result.mode}
                </p>
                <p className="type-label" style={{ color: '#5A8AAA' }}>
                  key · {result.keyConfidence}% confidence
                </p>
              </div>
            </div>

            {/* Warning */}
            {warningMessage && (
              <p className="type-label" style={{ color: '#5A8AAA', marginBottom: '24px', fontSize: '13px' }}>
                ⚠ {warningMessage}
              </p>
            )}

            {/* Copy buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <button
                className="bkd-copy-btn"
                onClick={() => copyText('bpm', result.bpm.toFixed(2))}
              >
                {copiedLabel === 'bpm' ? 'copied!' : 'copy bpm'}
              </button>
              <button
                className="bkd-copy-btn"
                onClick={() => copyText('key', `${result.key} ${result.mode}`)}
              >
                {copiedLabel === 'key' ? 'copied!' : 'copy key'}
              </button>
              <button
                className="bkd-copy-btn"
                onClick={() =>
                  copyText('all', `${result.bpm.toFixed(2)} bpm · ${result.key} ${result.mode}`)
                }
              >
                {copiedLabel === 'all' ? 'copied!' : 'copy all'}
              </button>
            </div>

            {/* Reset */}
            <button className="bkd-ghost-link" onClick={reset}>
              analyze another file
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {phase === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <p
              className="type-display"
              style={{ fontSize: '32px', color: 'rgba(90,158,212,0.35)', marginBottom: '16px' }}
            >
              ×
            </p>
            <p className="type-body" style={{ color: '#2E6080', marginBottom: '24px' }}>
              {errorMessage ?? 'an unexpected error occurred'}
            </p>
            <button className="bkd-ghost-link" onClick={reset}>
              try another file
            </button>
          </div>
        )}
      </div>
    </>
  )
}
