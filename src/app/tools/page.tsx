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
      <div className="flex items-center gap-4 px-4 sm:px-6 py-2.5">
        <span
          className="text-sm sm:text-base shrink-0 select-none"
          style={{ ...mono, color: "rgba(90,158,212,0.40)" }}
        >
          {folderConnector}
        </span>
        <div className="flex items-center justify-between flex-1">
          <span
            className="text-sm sm:text-base"
            style={{ ...mono, letterSpacing: "2px", color: "#5A9ED4" }}
          >
            {folder.name}/
          </span>
          <span
            className="text-xs sm:text-[15px]"
            style={{ ...mono, letterSpacing: "1.5px", color: "rgba(90,158,212,0.55)" }}
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
          <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 ${tagline ? "pt-2 pb-1" : "py-2.5"}`}>
            {/* Indent prefix + item connector */}
            <span
              className="text-sm sm:text-[18px] shrink-0 whitespace-pre select-none"
              style={{ ...mono, color: "rgba(90,158,212,0.35)" }}
            >
              {childPrefix}{isLastTool ? "└──" : "├──"}
            </span>

            {/* Tool name + tagline */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                className="text-sm sm:text-[17px]"
                style={{ ...mono, letterSpacing: "1px", color: isComingSoon ? "rgba(90,158,212,0.55)" : "#2A6094" }}
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
                className="shrink-0"
                style={{ ...mono, fontSize: "12px", color: "#5A9ED4", letterSpacing: "1px" }}
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
                className="text-sm sm:text-[18px] pl-4 sm:pl-6 leading-none py-0.5 whitespace-pre select-none"
                style={{ ...mono, color: "rgba(90,158,212,0.20)" }}
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
    <main className="max-w-[960px] mx-auto px-4 sm:px-10 pt-8 pb-20">
      {totalItems === 0 ? (
        <p className="type-body" style={{ color: "#5A8AAA" }}>
          No tools available yet.
        </p>
      ) : (
        <div className="ghost-panel" style={{ overflow: "hidden" }}>
          {/* Tree root header */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-2.5"
            style={{ borderBottom: "1px solid rgba(90,158,212,0.18)" }}
          >
            <span
              className="text-sm sm:text-base"
              style={{ ...mono, letterSpacing: "2px", color: "#5A9ED4" }}
            >
              <span className="text-xl sm:text-2xl">◈</span> /producer_tools
            </span>
            <span
              className="text-xs sm:text-[15px]"
              style={{ ...mono, letterSpacing: "1.5px", color: "rgba(90,158,212,0.55)" }}
            >
              {folders.length} {folders.length === 1 ? "folder" : "folders"} · {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Folder rows */}
          <div className="py-2">
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
                    className="text-sm sm:text-[13px] pl-4 sm:pl-6 leading-none py-0.5 select-none"
                    style={{ ...mono, color: "rgba(90,158,212,0.20)" }}
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
