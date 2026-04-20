interface SetoLogoProps {
  size?: number;
}

export function SetoLogo({ size = 48 }: SetoLogoProps) {
  const gemSize = Math.round(size * 0.65);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        width: Math.round(size * 0.85),
      }}
    >
      {/* "SETO" wordmark */}
      <span
        style={{
          fontFamily: "Arial Black, 'Arial Bold', sans-serif",
          fontSize: Math.round(size * 0.20),
          fontWeight: 900,
          color: "white",
          letterSpacing: Math.round(size * 0.04),
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        SETO
      </span>

      {/* Gem PNG */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/seto-gem.png"
        alt=""
        width={gemSize}
        height={gemSize}
        style={{ display: "block" }}
      />

      {/* "COMPUTER" */}
      <span
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: Math.round(size * 0.115),
          fontWeight: 600,
          color: "white",
          letterSpacing: Math.round(size * 0.025),
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        COMPUTER
      </span>

      {/* "ENTERTAINMENT" */}
      <span
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: Math.round(size * 0.095),
          fontWeight: 600,
          color: "white",
          letterSpacing: Math.round(size * 0.018),
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        ENTERTAINMENT
      </span>
    </div>
  );
}
