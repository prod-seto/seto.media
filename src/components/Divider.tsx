export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 py-10">
      <div className="flex-1 h-px" style={{ background: "rgba(90,158,212,0.35)" }} />
      {label && (
        <span
          style={{
            fontFamily: "var(--font-share-tech-mono), monospace",
            fontSize: "8px",
            letterSpacing: "2.5px",
            color: "#5A8AAA",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: "rgba(90,158,212,0.35)" }} />
    </div>
  );
}
