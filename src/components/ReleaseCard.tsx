"use client";
import { useRef, useState, useEffect } from "react";
import type { Release } from "@/lib/types";
import { SoundCloudPlayer, SoundCloudPlayerRef } from "./SoundCloudPlayer";


const N_BARS = 80;

function downsample(samples: number[], max: number): number[] {
  const out: number[] = [];
  const groupSize = samples.length / N_BARS;
  for (let i = 0; i < N_BARS; i++) {
    const start = Math.floor(i * groupSize);
    const end = Math.floor((i + 1) * groupSize);
    let peak = 0;
    for (let j = start; j < end; j++) peak = Math.max(peak, samples[j]);
    out.push(peak / max);
  }
  return out;
}

function Waveform({ bars, progress, onSeek }: {
  bars: number[];
  progress: number;
  onSeek: (pct: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W_css = canvas.offsetWidth;
    const H_css = canvas.offsetHeight;
    if (W_css === 0 || H_css === 0) return;

    const W = Math.round(W_css * dpr);
    const H = Math.round(H_css * dpr);

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    // Work directly in device pixels — no CSS-pixel transform.
    // This lets us use exact float bar widths so every bar is mathematically
    // identical in width, with no rounding accumulation.
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const N = bars.length;
    const GAP = Math.max(1, Math.round(dpr)); // 1 CSS px in device pixels
    const barW = (W - (N - 1) * GAP) / N;    // exact float — same for every bar
    const playedIdx = Math.floor(progress * N);

    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const x = i * (barW + GAP);             // no rounding — positions are exact
      const barH = Math.max(bars[i] * H, 2);
      ctx.fillStyle = i < playedIdx ? "rgba(90,158,212,0.75)" : "rgba(90,158,212,0.18)";
      ctx.fillRect(x, H - barH, barW, barH);
    }
  }, [bars, progress]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek((e.clientX - rect.left) / rect.width);
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ display: "block", width: "100%", height: "40px", cursor: "pointer" }}
    />
  );
}

// Animated fallback shown while waveform data loads
const FALLBACK_BARS = [
  { h: 20, d: 0.50, delay: -0.10 }, { h: 28, d: 0.62, delay: -0.32 },
  { h: 36, d: 0.44, delay: -0.05 }, { h: 32, d: 0.70, delay: -0.41 },
  { h: 40, d: 0.54, delay: -0.18 }, { h: 34, d: 0.66, delay: -0.27 },
  { h: 44, d: 0.48, delay: -0.08 }, { h: 38, d: 0.58, delay: -0.35 },
  { h: 42, d: 0.52, delay: -0.22 }, { h: 36, d: 0.72, delay: -0.46 },
  { h: 44, d: 0.46, delay: -0.13 }, { h: 30, d: 0.60, delay: -0.38 },
  { h: 38, d: 0.56, delay: -0.24 }, { h: 32, d: 0.50, delay: -0.07 },
  { h: 26, d: 0.64, delay: -0.30 }, { h: 22, d: 0.68, delay: -0.19 },
  { h: 30, d: 0.47, delay: -0.43 }, { h: 24, d: 0.60, delay: -0.28 },
];

function FallbackVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "40px", overflow: "hidden" }}>
      {FALLBACK_BARS.map((bar, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: bar.h,
            background: isPlaying ? "rgba(90,158,212,0.50)" : "rgba(90,158,212,0.15)",
            transformOrigin: "bottom",
            transform: isPlaying ? undefined : "scaleY(0.08)",
            animationName: isPlaying ? "vizbar" : "none",
            animationDuration: `${bar.d}s`,
            animationDelay: `${bar.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            transition: isPlaying ? "none" : "transform 0.4s ease, background 0.4s ease",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function ReleaseCard({ release: r }: { release: Release }) {
  const playerRef = useRef<SoundCloudPlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[] | null>(null);

  function handleWaveformUrl(url: string) {
    fetch(url)
      .then((res) => res.json())
      .then((data: { samples: number[]; height: number }) => {
        setWaveformBars(downsample(data.samples, data.height));
      })
      .catch(() => {/* stay on fallback */});
  }

  function handleSeek(pct: number) {
    playerRef.current?.seek(pct);
    setProgress(pct);
  }

  return (
    <div className="ghost-panel" style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: r.soundcloud_url ? "12px" : "0" }}>
        {/* Cover art */}
        {r.cover_url ? (
          <img
            src={r.cover_url}
            alt={r.title}
            width={88}
            height={88}
            style={{ flexShrink: 0, display: "block", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 88, height: 88, flexShrink: 0,
            background: "rgba(90,158,212,0.08)",
            border: "1px solid rgba(90,158,212,0.25)",
          }} />
        )}

        {/* Right column: title row + waveform */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Title — Artist inline */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", minWidth: 0 }}>
            <h3 className="type-subheading" style={{
              fontSize: "18px",
              color: "#2A6094",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flexShrink: 1,
              minWidth: 0,
              margin: 0,
            }}>
              {r.title}
            </h3>
            <span className="type-label" style={{
              fontSize: "10px",
              color: "#5A8AAA",
              flexShrink: 0,
            }}>
              —
            </span>
            <span className="type-body" style={{
              fontSize: "16px",
              color: "#5A8AAA",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
              {r.artist}
            </span>
          </div>

          {/* Waveform full width */}
          {waveformBars ? (
            <Waveform bars={waveformBars} progress={progress} onSeek={handleSeek} />
          ) : (
            <FallbackVisualizer isPlaying={isPlaying} />
          )}
        </div>
      </div>

      {/* Player row */}
      {r.soundcloud_url && (
        <SoundCloudPlayer
          ref={playerRef}
          url={r.soundcloud_url}
          onPlayStateChange={setIsPlaying}
          onWaveformUrl={handleWaveformUrl}
          onProgress={setProgress}
        />
      )}
    </div>
  );
}
