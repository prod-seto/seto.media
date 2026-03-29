import { BracketCard } from "@/components/BracketCard";
import { Divider } from "@/components/Divider";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="max-w-[900px] mx-auto px-8 py-24">

        {/* ── Hero ──────────────────────────────────────────── */}
        <header className="mb-16">
          <p
            className="font-mono text-[10px] text-faint tracking-[3px] uppercase mb-6 label-diamond"
          >
            seto.media
          </p>
          <h1
            className="font-sans font-light text-fog mb-4"
            style={{ fontSize: "42px", letterSpacing: "-0.5px", lineHeight: 1.1 }}
          >
            music releases,{" "}
            <em className="not-italic text-signal">beats,</em>
            <br />
            and producer tools.
          </h1>
          <p className="font-sans font-light text-muted text-sm leading-relaxed max-w-md mt-4">
            A catalogue of original work and utilities for producers.
            Everything released here is made under the seto.media imprint.
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
