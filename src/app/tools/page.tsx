import { Fragment } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/database.types";

type Tool = Tables<"tools">;
type Folder = { name: string; tools: Tool[]; isComingSoon: boolean };

const mono: React.CSSProperties = { fontFamily: "'Unifont', monospace", fontWeight: 400 };

function FolderSection({ folder, isLast }: { folder: Folder; isLast: boolean; }) {
  const { isComingSoon } = folder;
  const folderConnector = isLast ? "└──" : "├──";
  // children indent: if folder is last root item, no continuation pipe; otherwise show │
  const childPrefix = isLast ? "    " : "│   ";

  return (
    <>
      {/* Folder header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "10px 24px",
        }}
      >
        <span
          style={{
            ...mono,
            fontSize: "16px",
            color: "rgba(90,158,212,0.40)",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          {folderConnector}
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
          <span
            style={{
              ...mono,
              fontSize: "16px",
              letterSpacing: "2px",
              color: "#5A9ED4",
            }}
          >
            {folder.name}/
          </span>
          <span
            style={{
              ...mono,
              fontSize: "15px",
              letterSpacing: "1.5px",
              color: "rgba(90,158,212,0.55)",
            }}
          >
            {folder.tools.length} {folder.tools.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Tools inside folder */}
      {folder.tools.map((tool, i) => {
        const isLastTool = i === folder.tools.length - 1;
        const tagline = isComingSoon ? undefined : tool.description;

        const rowContent = (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: tagline ? "9px 24px 5px" : "10px 24px",
            }}
          >
            {/* Indent prefix + item connector */}
            <span
              style={{
                ...mono,
                fontSize: "18px",
                color: "rgba(90,158,212,0.35)",
                flexShrink: 0,
                whiteSpace: "pre",
                userSelect: "none",
              }}
            >
              {childPrefix}{isLastTool ? "└──" : "├──"}
            </span>

            {/* Tool name + tagline */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  ...mono,
                  fontSize: "17px",
                  letterSpacing: "1px",
                  color: isComingSoon ? "rgba(90,158,212,0.55)" : "#2A6094",
                }}
              >
                {tool.name.toLowerCase().replace(/[\s-]/g, "_")}
              </span>
              {tagline && (
                <p
                  className="type-display-italic"
                  style={{ fontSize: "15px", color: "#5A8AAA", marginTop: "2px" }}
                >
                  {tagline}
                </p>
              )}
            </div>

            {/* Arrow — hidden for coming_soon */}
            {!isComingSoon && (
              <span
                style={{
                  ...mono,
                  fontSize: "12px",
                  color: "#5A9ED4",
                  flexShrink: 0,
                  letterSpacing: "1px",
                }}
              >
                →
              </span>
            )}
          </div>
        );

        return (
          <div key={tool.id}>
            {isComingSoon ? (
              <div>{rowContent}</div>
            ) : (
              <Link href={`/tools/${tool.slug}`} className="tool-tree-row">
                {rowContent}
              </Link>
            )}

            {/* Vertical connector between tools inside the folder */}
            {!isLastTool && (
              <div
                aria-hidden
                style={{
                  ...mono,
                  fontSize: "18px",
                  color: "rgba(90,158,212,0.20)",
                  paddingLeft: "24px",
                  lineHeight: "1",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  whiteSpace: "pre",
                  userSelect: "none",
                }}
              >
                {childPrefix}│
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default async function ToolsPage() {
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  // Folder layout — add new folders here as needed
  const folders: Folder[] = [
    { name: "coming_soon", tools: tools ?? [], isComingSoon: true },
  ];

  const totalItems = folders.reduce((sum, f) => sum + f.tools.length, 0);

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 40px 80px" }}>
      {totalItems === 0 ? (
        <p className="type-body" style={{ color: "#5A8AAA" }}>
          No tools available yet.
        </p>
      ) : (
        <div className="ghost-panel" style={{ overflow: "hidden" }}>
          {/* Tree root header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 24px",
              borderBottom: "1px solid rgba(90,158,212,0.18)",
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: "16px",
                letterSpacing: "2px",
                color: "#5A9ED4",
              }}
            >
              <span style={{ fontSize: "24px" }}>◈</span> /producer_tools
            </span>
            <span
              style={{
                ...mono,
                fontSize: "15px",
                letterSpacing: "1.5px",
                color: "rgba(90,158,212,0.55)",
              }}
            >
              {folders.length} {folders.length === 1 ? "folder" : "folders"} · {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Folder rows */}
          <div style={{ padding: "8px 0" }}>
            {folders.map((folder, i) => (
              <Fragment key={folder.name}>
                <FolderSection
                  folder={folder}
                  isLast={i === folders.length - 1}
                />
                {/* Vertical connector between folders */}
                {i < folders.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      ...mono,
                      fontSize: "13px",
                      color: "rgba(90,158,212,0.20)",
                      paddingLeft: "24px",
                      lineHeight: "1",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      userSelect: "none",
                    }}
                  >
                    │
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
