import { ImageResponse } from "next/og";

export const alt = "Devize — AI operating systems for home services";
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
          background:
            "linear-gradient(135deg, #0A0420 0%, #1D1042 40%, #3A1E7A 75%, #5A1FBF 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top row: logo mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <svg
            width="52"
            height="52"
            viewBox="260 540 310 420"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g" x1="280" y1="900" x2="560" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#C084FC" />
                <stop offset="1" stopColor="#F5E8FF" />
              </linearGradient>
            </defs>
            <g fill="url(#g)">
              <polygon points="434.3,705.3 411.6,690.1 411.6,614.1 380.9,592.3 393.9,573.8 434.3,602.3" />
              <polygon points="434.3,834 411.6,818.8 411.6,727.6 342.4,677.8 355.6,659.4 434.3,716" />
              <polygon points="434.3,843.6 434.3,917.9 411.6,946.3 411.6,854.9 301.7,772.2 315.3,754.1" />
              <polygon points="537.5,702.1 477.6,769.2 477.6,863.8 454.9,892.2 454.9,760.6 520.6,687" />
              <polygon points="476.9,723.9 454.3,750.3 454.3,663.5 486.7,623.6 504.3,637.9 476.9,671.6" />
              <circle cx="338.6" cy="659.1" r="16" />
              <circle cx="377" cy="575.9" r="16" />
              <circle cx="503.6" cy="621.2" r="16" />
              <circle cx="298.1" cy="755.4" r="16" />
              <circle cx="536.8" cy="686.3" r="16" />
            </g>
          </svg>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>
            devize
          </div>
        </div>

        {/* Bottom block: headline + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: 1000,
            }}
          >
            AI operating systems for home services.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.72)",
              fontWeight: 400,
            }}
          >
            Answer every call. Book every job. Never lose a customer.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
