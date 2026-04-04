"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-share-tech-mono), monospace",
};
const display: React.CSSProperties = {
  fontFamily: "var(--font-orbitron), sans-serif",
};

function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="tag"
      style={{
        ...mono,
        fontSize: "9px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        cursor: "pointer",
        background: "rgba(90,158,212,0.08)",
        borderColor: "rgba(90,158,212,0.35)",
        color: "#5A8AAA",
        padding: "6px 12px",
      }}
    >
      SIGN OUT
    </button>
  );
}

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
    });
  }, [router]);

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <div className="ghost-panel" style={{ padding: "32px 28px" }}>
        <h1
          style={{
            ...display,
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "4px",
            color: "#2A6094",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          ADMIN
        </h1>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}
        >
          <Link
            href="/admin/releases/new"
            className="tag"
            style={{
              ...mono,
              display: "inline-block",
              fontSize: "10px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "10px 16px",
              textDecoration: "none",
              background: "rgba(90,158,212,0.08)",
              borderColor: "rgba(90,158,212,0.35)",
              color: "#2A6094",
              width: "fit-content",
            }}
          >
            + NEW RELEASE
          </Link>

          <Link
            href="/admin/beats/new"
            className="tag"
            style={{
              ...mono,
              display: "inline-block",
              fontSize: "10px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "10px 16px",
              textDecoration: "none",
              background: "rgba(90,158,212,0.08)",
              borderColor: "rgba(90,158,212,0.35)",
              color: "#2A6094",
              width: "fit-content",
            }}
          >
            + NEW BEAT
          </Link>

          <Link
            href="/admin/tools"
            className="tag"
            style={{
              ...mono,
              display: "inline-block",
              fontSize: "10px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "10px 16px",
              textDecoration: "none",
              background: "rgba(90,158,212,0.08)",
              borderColor: "rgba(90,158,212,0.35)",
              color: "#2A6094",
              width: "fit-content",
            }}
          >
            MANAGE TOOLS
          </Link>

          <Link
            href="/admin/releases/order"
            className="tag"
            style={{
              ...mono,
              display: "inline-block",
              fontSize: "10px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "10px 16px",
              textDecoration: "none",
              background: "rgba(90,158,212,0.08)",
              borderColor: "rgba(90,158,212,0.35)",
              color: "#2A6094",
              width: "fit-content",
            }}
          >
            REORDER RELEASES
          </Link>

          <Link
            href="/admin/beats/order"
            className="tag"
            style={{
              ...mono,
              display: "inline-block",
              fontSize: "10px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              padding: "10px 16px",
              textDecoration: "none",
              background: "rgba(90,158,212,0.08)",
              borderColor: "rgba(90,158,212,0.35)",
              color: "#2A6094",
              width: "fit-content",
            }}
          >
            REORDER BEATS
          </Link>
        </div>

        <SignOutButton />
      </div>
    </main>
  );
}
