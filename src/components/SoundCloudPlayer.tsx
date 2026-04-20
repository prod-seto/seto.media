"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { registerReleasePause, notifyReleasePlay } from "@/lib/audio-coordinator";

declare global {
  interface Window { SC: any }
}

let currentWidget: any = null;

registerReleasePause(() => { currentWidget?.pause(); });

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

const mono: React.CSSProperties = { fontFamily: "'Unifont', monospace" };

export interface SoundCloudPlayerRef {
  seek: (pct: number) => void;
  toggle: () => void;
}

interface Props {
  url: string;
  hideButton?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  onWaveformUrl?: (url: string) => void;
  onProgress?: (relativePosition: number) => void;
  onReadyChange?: (ready: boolean) => void;
}

export const SoundCloudPlayer = forwardRef<SoundCloudPlayerRef, Props>(
  function SoundCloudPlayer({ url, hideButton, onPlayStateChange, onWaveformUrl, onProgress, onReadyChange }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const widgetRef = useRef<any>(null);
    const durationRef = useRef<number>(0);
    const isPlayingRef = useRef(false); // mirror of isPlaying for use inside event callbacks
    const seekingWhilePaused = useRef(false); // suppress PLAY event fired by seekTo
    const [ready, setReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useImperativeHandle(ref, () => ({
      seek(pct: number) {
        if (widgetRef.current && durationRef.current) {
          // seekTo triggers a PLAY event from the SC widget even when paused.
          // Set flag so the PLAY handler knows to re-pause instead of updating state.
          if (!isPlayingRef.current) seekingWhilePaused.current = true;
          widgetRef.current.seekTo(Math.floor(pct * durationRef.current));
        }
      },
      toggle() {
        doToggle();
      },
    }));

    useEffect(() => {
      let attempts = 0;
      const init = setInterval(() => {
        if (window.SC && iframeRef.current) {
          clearInterval(init);
          const widget = window.SC.Widget(iframeRef.current);
          widgetRef.current = widget;

          widget.bind(window.SC.Widget.Events.READY, () => {
            widget.getDuration((d: number) => {
              setDuration(d);
              durationRef.current = d;
            });
            widget.getCurrentSound((sound: any) => {
              if (sound?.waveform_url) onWaveformUrl?.(sound.waveform_url);
            });
            setReady(true);
            onReadyChange?.(true);
          });
          widget.bind(window.SC.Widget.Events.PLAY, () => {
            if (seekingWhilePaused.current) {
              // SC fired PLAY as a side-effect of seekTo while paused — re-pause immediately
              seekingWhilePaused.current = false;
              widget.pause();
              return;
            }
            isPlayingRef.current = true;
            setIsPlaying(true);
            onPlayStateChange?.(true);
          });
          widget.bind(window.SC.Widget.Events.PAUSE, () => {
            isPlayingRef.current = false;
            setIsPlaying(false);
            onPlayStateChange?.(false);
          });
          widget.bind(window.SC.Widget.Events.FINISH, () => {
            isPlayingRef.current = false;
            setIsPlaying(false);
            onPlayStateChange?.(false);
            setPosition(0);
            onProgress?.(0);
          });
          widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
            setPosition(e.currentPosition);
            onProgress?.(e.relativePosition);
          });
        }
        if (++attempts > 50) clearInterval(init);
      }, 100);

      return () => {
        clearInterval(init);
        // Clear stale module-level reference on unmount so navigation doesn't leave
        // a detached widget that throws when pause() is called via the coordinator
        if (currentWidget === widgetRef.current) currentWidget = null;
      };
    }, []);

    function doToggle() {
      if (!widgetRef.current || !ready) return;
      // User explicitly acting — cancel any pending seek suppression
      seekingWhilePaused.current = false;
      if (!isPlayingRef.current && currentWidget && currentWidget !== widgetRef.current) {
        try { currentWidget.pause(); } catch { /* stale reference from prior navigation */ }
      }
      if (!isPlayingRef.current) {
        currentWidget = widgetRef.current;
        notifyReleasePlay();
        // Use explicit play()/pause() instead of toggle() so the call is deterministic
        // regardless of the widget's intermediate buffering/seeking state.
        widgetRef.current.play();
      } else {
        widgetRef.current.pause();
      }
    }

    function seekFromBar(e: React.MouseEvent<HTMLDivElement>) {
      if (!widgetRef.current || !durationRef.current || !ready) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      widgetRef.current.seekTo(Math.floor(pct * durationRef.current));
    }

    const progress = duration > 0 ? (position / duration) * 100 : 0;

    return (
      <div style={{ position: "relative" }}>
        <iframe
          ref={iframeRef}
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false`}
          style={{ position: "absolute", width: 0, height: 0, border: 0 }}
          allow="autoplay"
        />

        <div style={{ display: "flex", alignItems: "center", gap: hideButton ? 0 : "12px" }}>
          {/* Play / Pause — omitted when parent renders an external button */}
          {!hideButton && (
            <button
              onClick={doToggle}
              disabled={!ready}
              className="tag w-8 sm:w-[88px] shrink-0"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: ready ? "pointer" : "default",
                opacity: ready ? 1 : 0.35,
                background: isPlaying ? "rgba(90,158,212,0.20)" : "rgba(90,158,212,0.08)",
                borderColor: isPlaying ? "rgba(90,158,212,0.70)" : "rgba(90,158,212,0.35)",
                color: "#2A6094",
                letterSpacing: "2px",
              }}
            >
              <span className="sm:hidden">{isPlaying ? "⏸" : "▶"}</span>
              <span className="hidden sm:inline">{isPlaying ? "⏸ PAUSE" : "▶ PLAY"}</span>
            </button>
          )}

          {/* Progress bar + times */}
          <div style={{ flex: 1 }}>
            {/* Clickable line */}
            <div
              onClick={seekFromBar}
              style={{
                height: "2px",
                background: "rgba(90,158,212,0.20)",
                cursor: ready && duration > 0 ? "pointer" : "default",
                position: "relative",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0, top: 0,
                  height: "100%",
                  width: `${progress}%`,
                  background: "#5A9ED4",
                  transition: "width 0.25s linear",
                }}
              />
            </div>
            {/* Times */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...mono, fontSize: "11px", color: "#5A8AAA", letterSpacing: "1px" }}>
                {duration > 0 ? formatTime(position) : "—"}
              </span>
              <span style={{ ...mono, fontSize: "11px", color: "#5A8AAA", letterSpacing: "1px" }}>
                {duration > 0 ? formatTime(duration) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
