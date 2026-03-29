// Corner bracket sizing and opacity per Soft Signal Inverted spec:
// 10px brackets at rgba(122,176,196,0.45) — 6px inset from card edge
const B = "absolute w-[10px] h-[10px]";
const C = "border-signal/45";

function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: "top-[6px] left-[6px] border-t border-l",
    tr: "top-[6px] right-[6px] border-t border-r",
    bl: "bottom-[6px] left-[6px] border-b border-l",
    br: "bottom-[6px] right-[6px] border-b border-r",
  }[position];

  return <span className={`${B} ${pos} ${C}`} aria-hidden="true" />;
}

export function BracketCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative p-5 bg-deep"
      style={{ border: "1px solid #3A3834" }}
    >
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
      {children}
    </div>
  );
}
