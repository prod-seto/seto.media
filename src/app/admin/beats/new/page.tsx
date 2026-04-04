"use client";

import { useActionState, useTransition, useState } from "react";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import { createBeat } from "@/app/actions/beats";

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

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewBeatPage() {
  const [beatState, beatAction] = useActionState(createBeat, null);
  const [, startTransition] = useTransition();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (beatState && beatState.success) {
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
            BEAT ADDED
          </h1>
          <p style={{ ...body, fontSize: "13px", fontWeight: 300, color: "#2E6080", marginBottom: "20px" }}>
            Beat saved successfully.
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
              href="/admin/beats/new"
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    setValidationErrors({});

    const form = e.currentTarget;
    const title = ((form.elements.namedItem("title") as HTMLInputElement)?.value ?? "").trim();
    const errors: Record<string, string> = {};

    if (!title) errors.title = "TITLE IS REQUIRED";
    if (!selectedFile) errors.audio = "AUDIO FILE IS REQUIRED";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Get current user for storage path
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploadError("NOT SIGNED IN");
      return;
    }

    const filename = `${slugify(title)}.mp3`;
    const storagePath = `${user.id}/${filename}`;

    setIsUploading(true);

    const { error: storageError } = await supabase.storage
      .from("beats-audio")
      .upload(storagePath, selectedFile!, { upsert: false });

    setIsUploading(false);

    if (storageError) {
      setUploadError(storageError.message.toUpperCase());
      return;
    }

    // Build FormData for the Server Action
    const formData = new FormData(form);
    formData.set("audio_url", storagePath);
    // Ensure is_visible is correctly set
    const isVisibleCheckbox = form.elements.namedItem("is_visible") as HTMLInputElement;
    formData.set("is_visible", isVisibleCheckbox?.checked ? "true" : "false");

    startTransition(() => {
      beatAction(formData);
    });
  }

  const serverFieldErrors = beatState && !beatState.success ? beatState.fields : undefined;
  const globalError = beatState && !beatState.success && !beatState.fields ? beatState.error : undefined;

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto", padding: "0 24px" }}>
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
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
            NEW BEAT
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>TITLE *</label>
              <input type="text" name="title" style={inputStyle} />
              {(validationErrors.title || serverFieldErrors?.title) && (
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#8898C0", marginTop: "4px" }}>
                  {(validationErrors.title || serverFieldErrors?.title)}
                </p>
              )}
            </div>

            {/* BPM */}
            <div>
              <label style={labelStyle}>BPM</label>
              <input type="number" name="bpm" min="1" max="999" style={inputStyle} />
            </div>

            {/* Key */}
            <div>
              <label style={labelStyle}>KEY</label>
              <input type="text" name="key" placeholder="e.g. F# Minor" style={{ ...inputStyle, color: "#1A3A50" }} />
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>TAGS</label>
              <input
                type="text"
                name="tags"
                placeholder="comma-separated, e.g. rage, osamason"
                style={{ ...inputStyle, color: "#1A3A50" }}
              />
              <p style={{ ...mono, fontSize: "7px", letterSpacing: "1px", color: "#5A8AAA", marginTop: "4px" }}>
                SEPARATE WITH COMMAS
              </p>
            </div>

            {/* Audio file */}
            <div>
              <label style={labelStyle}>AUDIO FILE *</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file && !file.type.startsWith("audio/")) {
                    setValidationErrors((prev) => ({ ...prev, audio: "FILE MUST BE AUDIO" }));
                    e.target.value = "";
                    setSelectedFile(null);
                  } else {
                    setSelectedFile(file);
                    setValidationErrors((prev) => {
                      const next = { ...prev };
                      delete next.audio;
                      return next;
                    });
                  }
                }}
                style={{
                  ...body,
                  width: "100%",
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.50)",
                  border: "1px solid rgba(90,158,212,0.35)",
                  color: "#5A8AAA",
                  fontSize: "12px",
                  fontWeight: 300,
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              />
              {(validationErrors.audio || serverFieldErrors?.audio_url) && (
                <p style={{ ...mono, fontSize: "8px", letterSpacing: "1.5px", color: "#8898C0", marginTop: "4px" }}>
                  {validationErrors.audio || serverFieldErrors?.audio_url}
                </p>
              )}
            </div>

            {/* Upload progress */}
            {isUploading && (
              <p style={{ ...mono, fontSize: "8px", letterSpacing: "2px", color: "#5A9ED4" }}>
                UPLOADING...
              </p>
            )}

            {uploadError && (
              <p style={{ ...mono, fontSize: "9px", letterSpacing: "1.5px", color: "#8898C0" }}>
                UPLOAD ERROR: {uploadError}
              </p>
            )}

            {/* is_visible */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                name="is_visible"
                id="is_visible_beat"
                defaultChecked
                style={{ accentColor: "#5A9ED4", width: "14px", height: "14px" }}
              />
              <label
                htmlFor="is_visible_beat"
                style={{
                  ...mono,
                  fontSize: "8px",
                  letterSpacing: "2px",
                  color: "#5A8AAA",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
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
              disabled={isUploading}
              className="tag"
              style={{
                ...mono,
                width: "100%",
                padding: "10px",
                fontSize: "10px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: isUploading ? "not-allowed" : "pointer",
                background: "rgba(90,158,212,0.12)",
                borderColor: "rgba(90,158,212,0.50)",
                color: "#2A6094",
              }}
            >
              {isUploading ? `UPLOADING ${uploadProgress}%` : "ADD BEAT"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
