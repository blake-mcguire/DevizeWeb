import { ImageResponse } from "next/og";

/**
 * The share image for the marketing pages. It lives in (site) so that the root
 * image, which the /a/ prospect pages inherit, stays as it was.
 */
export const alt = "Devize: Know what's worth doing online. Skip the rest.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0A0420 0%, #1D1042 40%, #3A1E7A 75%, #5A1FBF 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>devize</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 84, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: 1000 }}>
            Know what&apos;s worth doing online. Skip the rest.
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.72)", fontWeight: 400 }}>
            $500 a month, flat. Everything stays in your name. Cancel any time.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
