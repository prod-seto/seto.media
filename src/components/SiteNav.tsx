"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

  const homeActive = pathname === "/";
  const downloadsActive = pathname.startsWith("/downloads");
  const toolsActive = pathname.startsWith("/tools");

  return (
    <div style={{ padding: "16px 0 0" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 40px" }}>
        <div
          className="ghost-panel"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 32px",
          }}
        >
          {/* Wordmark + spinning logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/seto-logo.png" alt="Seto" className="logo-spin" />
            <span className="type-display" style={{ fontSize: "28px", color: "#2A6094" }}>
              SETO<span className="type-display-italic" style={{ color: "#5A9ED4" }}>.MEDIA</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
            <Link
              href="/"
              className="type-label"
              style={{
                textDecoration: "none",
                color: homeActive ? "#2A6094" : "#5A8AAA",
              }}
            >
              home
            </Link>
            <Link
              href="/downloads"
              className="type-label"
              style={{
                textDecoration: "none",
                color: downloadsActive ? "#2A6094" : "#5A8AAA",
              }}
            >
              downloads
            </Link>
            <Link
              href="/tools"
              className="type-label"
              style={{
                textDecoration: "none",
                color: toolsActive ? "#2A6094" : "#5A8AAA",
              }}
            >
              tools
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
