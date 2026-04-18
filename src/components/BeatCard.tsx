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


export function BeatRow({
  beat,
  activeTags,
  onTagToggle,
  isLast,
}: {
  beat: Beat;
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  isLast: boolean;
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

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) {
      rafRef.current = requestAnimationFrame(drawFrame);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    if (W === 0 || H === 0) {
      rafRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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
      ctx.fillStyle = `rgba(90,158,212,${(0.25 + value * 0.6).toFixed(2)})`;
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
      // CORS or Web Audio not available
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

    // Metadata may have already loaded before listener was attached
    if (audio.readyState >= 1) setDuration(audio.duration);

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
    <div style={{
      borderBottom: isLast ? "none" : "1px solid rgba(90,158,212,0.12)",
      background: isPlaying ? "rgba(90,158,212,0.05)" : "transparent",
      transition: "background 0.25s ease",
    }}>
      {beat.audio_url && (
        <audio ref={audioRef} src={beat.audio_url} preload="metadata" crossOrigin="anonymous" />
      )}

      {/* Lines 1–3 share outer padding */}
      <div style={{ padding: isPlaying ? "10px 14px 8px" : "10px 14px" }}>

        {/* Line 1: play button + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggle}
            className="tag"
            style={{
              cursor: beat.audio_url ? "pointer" : "default",
              opacity: beat.audio_url ? 1 : 0.35,
              background: isPlaying ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
              borderColor: isPlaying ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
              color: "#2A6094",
              flexShrink: 0,
              padding: "2px 7px",
              letterSpacing: "2px",
              fontSize: "9px",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <h3 className="type-subheading" style={{
            fontSize: "18px",
            color: isPlaying ? "#2A6094" : "#3A7AAA",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.25s ease",
            margin: 0,
          }}>
            {beat.title}
          </h3>
        </div>

        {/* Line 2: BPM · KEY — indented to align with title */}
        {meta && (
          <div className="type-label" style={{
            color: "#5A8AAA",
            paddingLeft: "36px",
            marginTop: "4px",
            marginBottom: "4px",
          }}>
            {meta}
          </div>
        )}

        {/* Line 3: tags — indented, wrapping */}
        {beat.tags.length > 0 && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            paddingLeft: "36px",
            marginTop: meta ? "0" : "4px",
          }}>
            {beat.tags.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className="tag"
                  style={{
                    cursor: "pointer",
                    background: active ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.06)",
                    borderColor: active ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.25)",
                    color: active ? "#2A6094" : "#7AAAC4",
                    padding: "2px 7px",
                    fontSize: "9px",
                    letterSpacing: "1.5px",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Visualizer + progress — only shown when playing */}
      {isPlaying && (
        <div style={{ padding: "0 14px 10px" }}>
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "24px", marginBottom: "6px" }}
          />
          <div
            onClick={handleSeek}
            style={{
              height: "2px",
              background: "rgba(90,158,212,0.20)",
              cursor: duration > 0 ? "pointer" : "default",
              position: "relative",
              marginBottom: "4px",
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
            <span className="type-label" style={{ fontSize: "13px", color: "#5A8AAA" }}>
              {duration > 0 ? formatTime(position) : "—"}
            </span>
            <span className="type-label" style={{ fontSize: "13px", color: "#5A8AAA" }}>
              {duration > 0 ? formatTime(duration) : "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
