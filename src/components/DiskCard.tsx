import Link from "next/link";
import type { Tables } from "@/lib/database.types";

type Tool = Tables<"tools">;

const fontVars: Record<string, string> = {
  "turret-road":  "var(--font-turret-road), monospace",
  "chakra-petch": "var(--font-chakra-petch), sans-serif",
  "teko":         "var(--font-teko), sans-serif",
};

export function DiskCard({ tool }: { tool: Tool }) {
  const fontFamily = fontVars[tool.disk_font] ?? fontVars["turret-road"];

  return (
    <Link href={`/tools/${tool.slug}`} className="disk-wrapper" style={{ textDecoration: "none", display: "block" }}>
      <div className="disk-face">
        {tool.disk_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.disk_image_url}
            alt=""
            className="disk-artwork"
          />
        )}
        <div className="disk-hub" />
      </div>
      <p
        className="disk-label"
        style={{
          fontFamily,
          color: tool.disk_font_color,
        }}
      >
        {tool.name}
      </p>
    </Link>
  );
}
