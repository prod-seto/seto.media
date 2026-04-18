import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import Script from "next/script";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "seto.media",
  description: "Music releases, beats, and producer tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased`}
        style={{ background: "#EEF4F8", color: "#2E6080" }}
      >
        {/* z-index: 1 keeps content above the body::before wash overlay */}
        <Script src="https://w.soundcloud.com/player/api.js" strategy="afterInteractive" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SiteNav />
          {children}
        </div>
      </body>
    </html>
  );
}
