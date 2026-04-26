const mono: React.CSSProperties = {
  fontFamily: "'Unifont', monospace",
  fontWeight: 400,
};

const CONTENTS = [
  "16 808's",
  "16 claps",
  "8 crashes",
  "16 hi hats",
  "16 open hats",
  "16 snares",
  "16 counter snares",
  "50 fx from Tony Hawk's American Wasteland \u00ae",
];

export default function AdriftStashKitPage() {
  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-10 pt-8 pb-20">
      <div className="ghost-panel p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 sm:items-start">
          {/* Cover art */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/downloads/adrift-stash-kit-cover.jpg"
            alt="◈ adrift stash kit cover art"
            width={280}
            height={280}
            className="w-full sm:w-[280px] sm:h-[280px] block object-cover shrink-0"
          />

          {/* Info column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Title */}
            <h1
              className="type-display text-[22px] sm:text-[28px]"
              style={{ color: "#2A6094", margin: 0 }}
            >
              ◈ adrift stash kit
            </h1>

            {/* Byline */}
            <p
              className="type-label"
              style={{
                fontSize: "11px",
                color: "#5A8AAA",
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              FREE DRUM KIT — @PROD_SETO
            </p>

            {/* Description */}
            <p
              className="type-body"
              style={{
                fontSize: "15px",
                color: "#2E6080",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              All sounds in the kit have either been morphed or processed with
              different fx, so no sounds are recycled.
            </p>

            {/* Contents list */}
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {CONTENTS.map((line) => (
                <li
                  key={line}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      ...mono,
                      fontSize: "12px",
                      color: "#5A9ED4",
                      flexShrink: 0,
                    }}
                  >
                    ◈
                  </span>
                  <span
                    className="type-body"
                    style={{ fontSize: "14px", color: "#5A8AAA" }}
                  >
                    {line}
                  </span>
                </li>
              ))}
            </ul>

            {/* Download button */}
            <div className="flex justify-end items-center gap-4 mt-1">
              <div style={{ textAlign: "right" }}>
                <span
                  className="type-label"
                  style={{
                    ...mono,
                    display: "block",
                    fontSize: "11px",
                    color: "#5A8AAA",
                    letterSpacing: "2px",
                  }}
                >
                  V2
                </span>
                <span
                  className="type-label"
                  style={{
                    ...mono,
                    display: "block",
                    fontSize: "10px",
                    color: "#8AAABB",
                    letterSpacing: "1px",
                  }}
                >
                  UPDATED 04.26.2026
                </span>
              </div>
              <a
                href="/downloads/adrift-stash-kit.zip"
                download
                className="tag"
                style={{
                  ...mono,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "rgba(90,158,212,0.08)",
                  borderColor: "rgba(90,158,212,0.35)",
                  color: "#2A6094",
                  letterSpacing: "2px",
                  padding: "8px 24px",
                  fontSize: "13px",
                }}
              >
                DOWNLOAD
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
