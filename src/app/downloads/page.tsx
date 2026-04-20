import { Fragment } from "react";
import Link from "next/link";

const mono: React.CSSProperties = { fontFamily: "'Unifont', monospace", fontWeight: 400 };

type DownloadItem = { slug: string; name: string };
type PlaceholderItem = { name: string };
type ReleasedFolder = { kind: "released"; items: DownloadItem[] };
type ComingSoonFolder = { kind: "coming_soon"; items: PlaceholderItem[] };
type Folder = ReleasedFolder | ComingSoonFolder;

const folders: Folder[] = [
  { kind: "released", items: [{ slug: "adrift-stash-kit", name: "◈ adrift stash kit" }] },
  { kind: "coming_soon", items: [{ name: "round_robin.vst3" }] },
];

const totalItems = folders.reduce((sum, f) => sum + f.items.length, 0);

function FolderSection({ folder, isLast }: { folder: Folder; isLast: boolean }) {
  const folderConnector = isLast ? "└──" : "├──";
  const childPrefix = "    ";
  const isComingSoon = folder.kind === "coming_soon";

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
          <span style={{ ...mono, fontSize: "16px", letterSpacing: "2px", color: "#5A9ED4" }}>
            {folder.kind}/
          </span>
          <span style={{ ...mono, fontSize: "15px", letterSpacing: "1.5px", color: "rgba(90,158,212,0.55)" }}>
            {folder.items.length} {folder.items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Items inside folder */}
      {folder.kind === "released"
        ? folder.items.map((item, i) => {
            const isLastItem = i === folder.items.length - 1;
            return (
              <div key={item.slug}>
                <Link href={`/downloads/${item.slug}`} className="tool-tree-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 24px",
                    }}
                  >
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
                      {childPrefix}{isLastItem ? "└──" : "├──"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ ...mono, fontSize: "17px", letterSpacing: "1px", color: "#2A6094" }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{ ...mono, fontSize: "12px", color: "#5A9ED4", flexShrink: 0, letterSpacing: "1px" }}>
                      →
                    </span>
                  </div>
                </Link>
                {!isLastItem && (
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
          })
        : folder.items.map((item, i) => {
            const isLastItem = i === folder.items.length - 1;
            return (
              <div key={item.name}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 24px",
                  }}
                >
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
                    {childPrefix}{isLastItem ? "└──" : "├──"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ ...mono, fontSize: "17px", letterSpacing: "1px", color: "rgba(90,158,212,0.55)" }}>
                      {item.name}
                    </span>
                  </div>
                </div>
                {!isLastItem && (
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

export default function DownloadsPage() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 40px 80px" }}>
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
          <span style={{ ...mono, fontSize: "16px", letterSpacing: "2px", color: "#5A9ED4" }}>
            <span style={{ fontSize: "24px" }}>◈</span> /downloads
          </span>
          <span style={{ ...mono, fontSize: "15px", letterSpacing: "1.5px", color: "rgba(90,158,212,0.55)" }}>
            {folders.length} {folders.length === 1 ? "folder" : "folders"} · {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Folder rows */}
        <div style={{ padding: "8px 0" }}>
          {folders.map((folder, i) => (
            <Fragment key={folder.kind}>
              <FolderSection folder={folder} isLast={i === folders.length - 1} />
            </Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
