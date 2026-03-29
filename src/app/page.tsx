import { BracketCard } from "@/components/BracketCard";
import { Divider } from "@/components/Divider";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="max-w-[900px] mx-auto px-8 py-24">

        {/* ── Hero ──────────────────────────────────────────── */}
        <header className="mb-16">
          <h1
            className="font-sans font-light text-fog mb-5"
            style={{ fontSize: "52px", letterSpacing: "-0.5px", lineHeight: 1.1 }}
          >
            seto<em style={{ fontStyle: "italic", color: "#7AB0C4" }}>.media</em>
          </h1>
          <p className="font-mono text-[10px] text-faint tracking-[3px] uppercase label-diamond">
            music releases · beats · producer tools
          </p>
        </header>

        <Divider />

        {/* ── Releases ──────────────────────────────────────── */}
        <section className="my-12">
          <BracketCard>
            <p className="font-mono text-[9px] text-faint tracking-[2.5px] uppercase mb-4 label-diamond">
              Releases
            </p>
            <h2
              className="font-sans font-light text-fog mb-3"
              style={{ fontSize: "22px", letterSpacing: "-0.3px" }}
            >
              Music
            </h2>
            <p className="font-sans font-light text-body text-sm leading-[1.75]">
              Original releases coming soon.
            </p>
          </BracketCard>
        </section>

        <Divider />

        {/* ── Beats ─────────────────────────────────────────── */}
        <section className="my-12">
          <BracketCard>
            <p className="font-mono text-[9px] text-faint tracking-[2.5px] uppercase mb-4 label-diamond">
              Beats
            </p>
            <h2
              className="font-sans font-light text-fog mb-3"
              style={{ fontSize: "22px", letterSpacing: "-0.3px" }}
            >
              Beat Catalog
            </h2>
            <p className="font-sans font-light text-body text-sm leading-[1.75]">
              Instrumentals and beat packs coming soon.
            </p>
          </BracketCard>
        </section>

        <Divider />

        {/* ── Tools ─────────────────────────────────────────── */}
        <section className="my-12">
          <BracketCard>
            <p className="font-mono text-[9px] text-faint tracking-[2.5px] uppercase mb-4 label-diamond">
              Tools
            </p>
            <h2
              className="font-sans font-light text-fog mb-3"
              style={{ fontSize: "22px", letterSpacing: "-0.3px" }}
            >
              Producer Tools
            </h2>
            <p className="font-sans font-light text-body text-sm leading-[1.75]">
              Utilities for music production coming soon.
            </p>
          </BracketCard>
        </section>

      </main>
    </div>
  );
}
