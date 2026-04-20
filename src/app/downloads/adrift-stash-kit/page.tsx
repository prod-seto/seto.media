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
  "50 fx from Tony Hawk's American Wasteland \u00ae",
];

export default function AdriftStashKitPage() {
  return (
    <main
      style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 40px 80px" }}
    >
      <div className="ghost-panel" style={{ padding: "32px" }}>
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          {/* Cover art */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/downloads/adrift-stash-kit-cover.jpg"
            alt="◈ adrift stash kit cover art"
            width={280}
            height={280}
            style={{ display: "block", objectFit: "cover", flexShrink: 0 }}
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
              className="type-display"
              style={{ fontSize: "28px", color: "#2A6094", margin: 0 }}
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
            <div style={{ marginTop: "4px" }}>
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
