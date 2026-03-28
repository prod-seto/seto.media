const BRACKET_SIZE = "w-3 h-3";
const BRACKET_COLOR = "border-signal opacity-30";

function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const classes = {
    tl: `top-0 left-0 border-t border-l`,
    tr: `top-0 right-0 border-t border-r`,
    bl: `bottom-0 left-0 border-b border-l`,
    br: `bottom-0 right-0 border-b border-r`,
  }[position];

  return (
    <span
      className={`absolute ${classes} ${BRACKET_SIZE} ${BRACKET_COLOR}`}
      aria-hidden="true"
    />
  );
}

export function BracketCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-6">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
      {children}
    </div>
  );
}
