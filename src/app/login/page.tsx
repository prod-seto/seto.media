"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};
const body: React.CSSProperties = {
  fontFamily: "var(--font-exo2), sans-serif",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/admin");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <main
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <h1
          style={{
            ...display,
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#2A6094",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          SIGN IN
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                ...mono,
                display: "block",
                fontSize: "8px",
                letterSpacing: "2px",
                color: "#5A8AAA",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
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
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                ...mono,
                display: "block",
                fontSize: "8px",
                letterSpacing: "2px",
                color: "#5A8AAA",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
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
              }}
            />
          </div>

          {error && (
            <p
              style={{
                ...mono,
                fontSize: "9px",
                letterSpacing: "1.5px",
                color: "#8898C0",
                marginBottom: "16px",
              }}
            >
              {error.toUpperCase()}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="tag"
            style={{
              ...mono,
              width: "100%",
              padding: "10px",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              background: "rgba(90,158,212,0.12)",
              borderColor: "rgba(90,158,212,0.50)",
              color: "#2A6094",
            }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </main>
  );
}
