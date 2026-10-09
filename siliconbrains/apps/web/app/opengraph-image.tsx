import { ImageResponse } from "next/og";

// Default social-share card for every page. (Colors here mirror styles/tokens.css — next/og can't read CSS variables.)
export const alt = "SiliconBrains — Engineering Software with Sovereign Rigor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#051F20",
          color: "#DFF3E3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 600 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 8l10 6 10-6-10-6z" stroke="#A9D2B6" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M2 16l10 6 10-6" stroke="#A9D2B6" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          SiliconBrains
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          <span>Engineering Software with</span>
          <span style={{ color: "#A9D2B6" }}>Sovereign Rigor.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#8EB69B" }}>
          Full-stack web · Native Android · Cloud &amp; AI — 100% client IP ownership
        </div>
      </div>
    ),
    size,
  );
}
