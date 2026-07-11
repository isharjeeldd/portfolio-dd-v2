import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/** Site-wide OG card (FR-SEO-2): dark MS®-branded typographic card. */
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff4438";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ededed",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -2 }}>
          {site.mark}
          <span style={{ color: ACCENT, fontSize: 22, marginTop: 2 }}>®</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            {site.name}
            <span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#8a8a8a", marginTop: 20 }}>
            {site.role} · proof, not adjectives
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#4a4a4a" }}>
          <span>{new URL(site.url).host}</span>
          <span style={{ color: ACCENT }}>{site.availability.toLowerCase()}</span>
        </div>
      </div>
    ),
    size,
  );
}
