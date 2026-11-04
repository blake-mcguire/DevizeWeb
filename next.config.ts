import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Launch gate (2026-10-15, site pass 2 review). A Vercel production build
 * fails while any flag in src/lib/launch-gate.json is not true: the offer's
 * DRAFT wording, the DRAFT terms, and the sample audit's source practice not
 * yet suppressed in the outreach pipeline. Each flag's condition is written
 * beside it in that file. Preview and local builds are not blocked, so the
 * branch can still be reviewed; DEVIZE_LAUNCH_CHECK=1 runs the check anywhere.
 * Read with fs (not an import) so it works under every next.config resolver.
 */
function launchGate() {
  if (process.env.VERCEL_ENV !== "production" && process.env.DEVIZE_LAUNCH_CHECK !== "1") return;
  const file = path.join(process.cwd(), "src", "lib", "launch-gate.json");
  const gate = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  const open = Object.keys(gate).filter((k) => !k.startsWith("_") && gate[k] !== true);
  if (open.length) {
    throw new Error(
      `Launch gate: not ready for production (${open.join(", ")}). ` +
        "See src/lib/launch-gate.json for what each flag needs before it is set to true."
    );
  }
}
launchGate();

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      // The articles section was unpublished on 2026-10-15 (it described the
      // old offer). The live sitemap listed /articles and /articles/welcome,
      // so send those URLs home instead of to a 404.
      { source: "/articles", destination: "/", permanent: true },
      { source: "/articles/:path*", destination: "/", permanent: true },
      // 2026-11-04: one Services page replaced the separate service pages, and
      // What We Do replaced How We Work. Specific paths first, then anything else
      // under /services, including the old live site's service pages.
      { source: "/how-we-work", destination: "/what-we-do", permanent: true },
      { source: "/services/free-audit", destination: "/services#free-audit", permanent: true },
      { source: "/services/seo-and-reviews", destination: "/services#tier-1", permanent: true },
      { source: "/services/google-ads", destination: "/services#google-ads", permanent: true },
      { source: "/services/:path+", destination: "/services", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // The prospect audit pages (/a/<token>): never indexed, and the token in
        // the URL is not sent on as a referrer.
        source: "/a/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
