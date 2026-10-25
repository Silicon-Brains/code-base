import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = "SiliconBrains custom software development studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "linear-gradient(135deg, #051f20 0%, #123b38 55%, #d8ede2 100%)",
          color: "#ffffff",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 12, textTransform: "uppercase", color: "#b8d9c9" }}>
          {SITE_NAME}
        </div>
        <div style={{ marginTop: 32, fontSize: 72, fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>
          Custom software, engineered for impact.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#e2eee7" }}>
          Web platforms · Android apps · Backend systems
        </div>
      </div>
    ),
    size,
  );
}
