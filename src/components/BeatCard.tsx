"use client";
import { useEffect, useRef, useState } from "react";
import type { Beat } from "@/lib/types";

// Module-level: only one beat plays at a time
let currentAudio: HTMLAudioElement | null = null;

const N_BARS = 64;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

const mono: React.CSSProperties = { fontFamily: "var(--font-share-tech-mono), monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-orbitron), sans-serif" };

export function BeatCard({
  beat,
  activeTags,
  onTagToggle,
}: {
  beat: Beat;
  activeTags: string[];
  onTagToggle: (tag: string) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(N_BARS) as Uint8Array<ArrayBuffer>);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isPlayingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Keep ref in sync so RAF closure always has current value
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    if (W === 0 || H === 0) {
      rafRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    // Resize canvas buffer if needed
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Pull latest frequency data from analyser (decays to 0 when paused)
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataRef.current);
    }

    ctx.clearRect(0, 0, W, H);

    const gap = 2;
    const barW = Math.max((W - (N_BARS - 1) * gap) / N_BARS, 1);

    for (let i = 0; i < N_BARS; i++) {
      const value = dataRef.current[i] / 255;
      const barH = Math.max(value * H, 2);
      const x = i * (barW + gap);
      const y = H - barH;

      if (isPlayingRef.current) {
        // Brighter bars for higher amplitude
        ctx.fillStyle = `rgba(90,158,212,${(0.25 + value * 0.6).toFixed(2)})`;
      } else {
        // Resting — bars decay via smoothingTimeConstant then sit flat
        ctx.fillStyle = `rgba(90,158,212,${Math.max(0.12, value * 0.4).toFixed(2)})`;
      }
      ctx.fillRect(x, y, barW, barH);
    }

    rafRef.current = requestAnimationFrame(drawFrame);
  }

  function initAudioContext() {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      // CORS or Web Audio not available — visualizer stays in resting state
    }
  }

  async function toggle() {
    const audio = audioRef.current;
    if (!audio || !beat.audio_url) return;

    initAudioContext();

    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
    } else {
      if (currentAudio && currentAudio !== audio) currentAudio.pause();
      currentAudio = audio;
      audio.play();
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setPosition(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setPosition(0); };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    // Start the continuous draw loop
    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const progress = duration > 0 ? position / duration : 0;
  const meta = [beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean).join(" · ");

  return (
    <div className="ghost-panel" style={{ padding: "14px 16px" }}>
      {/* Hidden audio element — crossOrigin required for Web Audio API */}
      {beat.audio_url && (
        <audio ref={audioRef} src={beat.audio_url} preload="metadata" crossOrigin="anonymous" />
      )}

      {/* Title + meta */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",
        gap: "12px", marginBottom: "8px" }}>
        <h3 style={{ ...display, fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px",
          color: "#2A6094", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap" }}>
          {beat.title}
        </h3>
        {meta && (
          <p style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA",
            textTransform: "uppercase", flexShrink: 0 }}>
            {meta}
          </p>
        )}
      </div>

      {/* Tags */}
      {beat.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
          {beat.tags.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="tag"
                style={{
                  cursor: "pointer",
                  background: active ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
                  borderColor: active ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
                  color: active ? "#2A6094" : "#5A8AAA",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Real-time FFT visualizer canvas */}
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "44px", marginBottom: "10px" }}
      />

      {/* Player row */}
      {beat.audio_url && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggle}
            className="tag"
            style={{
              cursor: "pointer",
              background: isPlaying ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
              borderColor: isPlaying ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
              color: "#2A6094",
              flexShrink: 0,
              letterSpacing: "2px",
              minWidth: "64px",
            }}
          >
            {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
          </button>

          <div style={{ flex: 1 }}>
            <div
              onClick={handleSeek}
              style={{
                height: "2px",
                background: "rgba(90,158,212,0.20)",
                cursor: duration > 0 ? "pointer" : "default",
                position: "relative",
                marginBottom: "5px",
              }}
            >
              <div style={{
                position: "absolute", left: 0, top: 0,
                height: "100%",
                width: `${progress * 100}%`,
                background: "#5A9ED4",
                transition: "width 0.1s linear",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...mono, fontSize: "8px", color: "#5A8AAA", letterSpacing: "1px" }}>
                {duration > 0 ? formatTime(position) : "—"}
              </span>
              <span style={{ ...mono, fontSize: "8px", color: "#5A8AAA", letterSpacing: "1px" }}>
                {duration > 0 ? formatTime(duration) : "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
