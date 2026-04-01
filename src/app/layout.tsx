import type { Metadata } from "next";
import { Orbitron, Exo_2, Share_Tech_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["200", "300"],
  style: ["normal", "italic"],
  variable: "--font-exo2",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech-mono",
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
        className={`${orbitron.variable} ${exo2.variable} ${shareTechMono.variable} antialiased`}
        style={{ background: "#EEF4F8", color: "#2E6080" }}
      >
        {/* z-index: 1 keeps content above the body::before wash overlay */}
        <Script src="https://w.soundcloud.com/player/api.js" strategy="afterInteractive" />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
