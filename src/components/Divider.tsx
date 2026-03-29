export function Divider() {
  return (
    <div className="flex items-center gap-4 py-10">
      <div className="flex-1 h-px bg-charcoal" />
      <div
        className="w-[5px] h-[5px] rotate-45 shrink-0"
        style={{ border: "1px solid rgba(122,176,196,0.45)" }}
        aria-hidden="true"
      />
      <div className="flex-1 h-px bg-charcoal" />
    </div>
  );
}
