// Ghost panel — rgba(255,255,255,0.40) surface with blue ghost frame.
// Corner brackets are applied via .ghost-panel CSS pseudo-elements in globals.css.
export function BracketCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="ghost-panel" style={{ padding: "22px 24px" }}>
      {children}
    </div>
  );
}
