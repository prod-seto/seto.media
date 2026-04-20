"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

  const homeActive = pathname === "/";
  const downloadsActive = pathname.startsWith("/downloads");
  const toolsActive = pathname.startsWith("/tools");

  return (
    <div className="pt-4">
      <div className="max-w-[960px] mx-auto px-4 sm:px-10">
        <div className="ghost-panel flex flex-col gap-3 sm:flex-row sm:gap-0 sm:items-center sm:justify-between px-4 py-4 sm:px-8 sm:py-5">
          {/* Wordmark + spinning logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/seto-logo.png" alt="Seto" className="logo-spin" />
            <span className="type-display text-[22px] sm:text-[28px]" style={{ color: "#2A6094" }}>
              SETO<span className="type-display-italic" style={{ color: "#5A9ED4" }}>.MEDIA</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="site-nav flex gap-3 sm:gap-9 items-center justify-end">
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
            <a
              href="https://www.instagram.com/prod_seto/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5A8AAA", display: "flex", alignItems: "center" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
