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
      <div className="flex items-center gap-4 px-4 sm:px-6 py-2.5">
        <span
          className="text-sm sm:text-base shrink-0 select-none"
          style={{ ...mono, color: "rgba(90,158,212,0.40)" }}
        >
          {folderConnector}
        </span>
        <div className="flex items-center justify-between flex-1">
          <span className="text-sm sm:text-base" style={{ ...mono, letterSpacing: "2px", color: "#5A9ED4" }}>
            {folder.kind}/
          </span>
          <span className="text-xs sm:text-[15px]" style={{ ...mono, letterSpacing: "1.5px", color: "rgba(90,158,212,0.55)" }}>
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
                  <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5">
                    <span
                      className="text-sm sm:text-[18px] shrink-0 whitespace-pre select-none"
                      style={{ ...mono, color: "rgba(90,158,212,0.35)" }}
                    >
                      {childPrefix}{isLastItem ? "└──" : "├──"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="text-sm sm:text-[17px]" style={{ ...mono, letterSpacing: "1px", color: "#2A6094" }}>
                        {item.name}
                      </span>
                    </div>
                    <span className="shrink-0" style={{ ...mono, fontSize: "12px", color: "#5A9ED4", letterSpacing: "1px" }}>
                      →
                    </span>
                  </div>
                </Link>
                {!isLastItem && (
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
          })
        : folder.items.map((item, i) => {
            const isLastItem = i === folder.items.length - 1;
            return (
              <div key={item.name}>
                <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5">
                  <span
                    className="text-sm sm:text-[18px] shrink-0 whitespace-pre select-none"
                    style={{ ...mono, color: "rgba(90,158,212,0.35)" }}
                  >
                    {childPrefix}{isLastItem ? "└──" : "├──"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="text-sm sm:text-[17px]" style={{ ...mono, letterSpacing: "1px", color: "rgba(90,158,212,0.55)" }}>
                      {item.name}
                    </span>
                  </div>
                </div>
                {!isLastItem && (
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

export default function DownloadsPage() {
  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-10 pt-8 pb-20">
      <div className="ghost-panel" style={{ overflow: "hidden" }}>
        {/* Tree root header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-2.5"
          style={{ borderBottom: "1px solid rgba(90,158,212,0.18)" }}
        >
          <span className="text-sm sm:text-base" style={{ ...mono, letterSpacing: "2px", color: "#5A9ED4" }}>
            <span className="text-xl sm:text-2xl">◈</span> /downloads
          </span>
          <span className="text-xs sm:text-[15px]" style={{ ...mono, letterSpacing: "1.5px", color: "rgba(90,158,212,0.55)" }}>
            {folders.length} {folders.length === 1 ? "folder" : "folders"} · {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Folder rows */}
        <div className="py-2">
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
