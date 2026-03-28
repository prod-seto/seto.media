import { BracketCard } from "@/components/BracketCard";
import { Divider } from "@/components/Divider";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-8 py-24">
      <header className="mb-16">
        <h1 className="font-serif text-4xl text-ink tracking-tight mb-3">
          seto.media
        </h1>
        <p className="font-sans text-sm text-mist tracking-widest uppercase">
          music releases · beats · producer tools
        </p>
      </header>

      <Divider />

      <section className="my-4">
        <BracketCard>
          <h2 className="font-serif text-xl text-ink mb-2">Releases</h2>
          <p className="font-sans text-sm text-mist">
            Music coming soon.
          </p>
        </BracketCard>
      </section>

      <Divider />

      <section className="my-4">
        <BracketCard>
          <h2 className="font-serif text-xl text-ink mb-2">Beats</h2>
          <p className="font-sans text-sm text-mist">
            Beat catalog coming soon.
          </p>
        </BracketCard>
      </section>

      <Divider />

      <section className="my-4">
        <BracketCard>
          <h2 className="font-serif text-xl text-ink mb-2">Tools</h2>
          <p className="font-sans text-sm text-mist">
            Producer tools coming soon.
          </p>
        </BracketCard>
      </section>
    </main>
  );
}
