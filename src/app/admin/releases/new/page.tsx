"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { createRelease } from "@/app/actions/releases";
import { fetchSoundCloudMetadata } from "@/app/actions/soundcloud";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

const labelStyle: React.CSSProperties = {
  ...mono,
  display: "block",
  fontSize: "8px",
  letterSpacing: "2px",
  color: "#5A8AAA",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  ...body,
  width: "100%",
  padding: "9px 12px",
  background: "rgba(255,255,255,0.50)",
  border: "1px solid rgba(90,158,212,0.35)",
  color: "#1A3A50",
  fontSize: "13px",
  fontWeight: 300,
  outline: "none",
  boxSizing: "border-box",
};

const fieldErrorStyle: React.CSSProperties = {
  ...mono,
  fontSize: "8px",
  letterSpacing: "1.5px",
  color: "#8898C0",
  marginTop: "4px",
};

export default function NewReleasePage() {
  const [state, formAction, isPending] = useActionState(createRelease, null);

  const [scUrl, setScUrl] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, startFetch] = useTransition();

  // Controlled values for autofill fields
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  function handleFetch() {
    setFetchError(null);
    startFetch(async () => {
      const result = await fetchSoundCloudMetadata(scUrl);
      if (result.error) {
        setFetchError(result.error);
      } else {
        if (result.title !== undefined) setTitle(result.title);
        if (result.artist !== undefined) setArtist(result.artist);
        if (result.coverUrl !== undefined) setCoverUrl(result.coverUrl);
      }
    });
  }

  if (state && state.success) {
    return (
      <main style={{ maxWidth: "600px", margin: "80px auto", padding: "0 24px" }}>
        <div className="ghost-panel" style={{ padding: "32px 28px" }}>
          <h1
            style={{
              ...display,
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#2A6094",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            RELEASE ADDED
          </h1>
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#2E6080", marginBottom: "20px" }}>
            Release saved successfully.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/"
              className="tag"
              style={{
                ...mono,
                fontSize: "9px",
                letterSpacing: "2px",
                textDecoration: "none",
                padding: "8px 14px",
                background: "rgba(90,158,212,0.08)",
                borderColor: "rgba(90,158,212,0.35)",
                color: "#2A6094",
              }}
            >
              VIEW HOMEPAGE
            </Link>
            <Link
              href="/admin/releases/new"
              className="tag"
              style={{
                ...mono,
                fontSize: "9px",
                letterSpacing: "2px",
                textDecoration: "none",
                padding: "8px 14px",
                background: "transparent",
                borderColor: "rgba(90,158,212,0.25)",
                color: "#5A8AAA",
              }}
            >
              ADD ANOTHER
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fields = state && !state.success ? state.fields : undefined;
  const globalError = state && !state.success && !state.fields ? state.error : undefined;

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto", padding: "0 24px" }}>
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <h1
            style={{
              ...display,
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#2A6094",
              textTransform: "uppercase",
            }}
          >
            NEW RELEASE
          </h1>
          <Link
            href="/admin"
            style={{
              ...mono,
              fontSize: "8px",
              letterSpacing: "2px",
              color: "#5A8AAA",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ← ADMIN
          </Link>
        </div>

        {/* ── SoundCloud autofill ────────────────────────────── */}
        <div
          style={{
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(90,158,212,0.20)",
          }}
        >
          <label style={labelStyle}>SOUNDCLOUD TRACK URL</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="url"
              value={scUrl}
              onChange={(e) => setScUrl(e.target.value)}
              placeholder="https://soundcloud.com/..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={handleFetch}
              disabled={isFetching || !scUrl}
              className="tag"
              style={{
                ...mono,
                fontSize: "8px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                padding: "0 14px",
                cursor: isFetching || !scUrl ? "not-allowed" : "pointer",
                background: "rgba(90,158,212,0.10)",
                borderColor: "rgba(90,158,212,0.40)",
                color: "#2A6094",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {isFetching ? "FETCHING..." : "FETCH METADATA"}
            </button>
          </div>
          {fetchError && (
            <p style={{ ...fieldErrorStyle, marginTop: "6px" }}>
              {fetchError.toUpperCase()}
            </p>
          )}
        </div>

        {/* ── Release fields ─────────────────────────────────── */}
        <form action={formAction}>
          {/* Pass the SoundCloud URL through to the action */}
          <input type="hidden" name="soundcloud_url" value={scUrl} />
          <input type="hidden" name="is_visible" value="true" />

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>TITLE *</label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
              {fields?.title && <p style={fieldErrorStyle}>{fields.title.toUpperCase()}</p>}
            </div>

            {/* Artist */}
            <div>
              <label style={labelStyle}>ARTIST *</label>
              <input
                type="text"
                name="artist"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                style={inputStyle}
              />
              {fields?.artist && <p style={fieldErrorStyle}>{fields.artist.toUpperCase()}</p>}
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>TYPE *</label>
              <select
                name="type"
                defaultValue="single"
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </select>
            </div>

            {/* Cover URL */}
            <div>
              <label style={labelStyle}>COVER IMAGE URL</label>
              <input
                type="url"
                name="cover_url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Release date */}
            <div>
              <label style={labelStyle}>RELEASE DATE</label>
              <input type="date" name="released_at" style={inputStyle} />
            </div>

            {/* is_visible toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                name="is_visible"
                id="is_visible"
                value="true"
                defaultChecked
                onChange={(e) => {
                  const hidden = e.currentTarget.form?.elements.namedItem("is_visible") as HTMLInputElement | null;
                  if (hidden && hidden !== e.currentTarget) hidden.value = e.currentTarget.checked ? "true" : "false";
                }}
                style={{ accentColor: "#5A9ED4", width: "14px", height: "14px" }}
              />
              <label
                htmlFor="is_visible"
                style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A8AAA", textTransform: "uppercase", cursor: "pointer" }}
              >
                VISIBLE ON HOMEPAGE
              </label>
            </div>

            {globalError && (
              <p style={{ ...mono, fontSize: "9px", letterSpacing: "1.5px", color: "#8898C0" }}>
                {globalError.toUpperCase()}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="tag"
              style={{
                ...mono,
                width: "100%",
                padding: "10px",
                fontSize: "10px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: isPending ? "not-allowed" : "pointer",
                background: "rgba(90,158,212,0.12)",
                borderColor: "rgba(90,158,212,0.50)",
                color: "#2A6094",
              }}
            >
              {isPending ? "SAVING..." : "ADD RELEASE"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
