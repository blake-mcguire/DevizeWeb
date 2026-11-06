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
      // What We Do replaced How We Work on 2026-11-04. On 2026-11-05 each line of work got
      // its own page under /services, and the /services overview went the same day (Blake:
      // no picking off a menu), so it redirects to /what-we-do. That rule is exact, so the
      // seven pages keep their URLs. The old pages go to their closest new page, and any
      // other old address under /services is a plain 404. Old #fragments (#menu, #tiers,
      // #tier-1, #google-ads, #free-audit, #open-to, #if-you-leave) never reach a server
      // redirect, and the browser carries them across, so /what-we-do keeps them as anchors.
      // The free audit has no page or section of its own since 2026-11-05, so its old address
      // goes to the form on the home page. Every destination here is a final page: no chains.
      { source: "/how-we-work", destination: "/what-we-do", permanent: true },
      { source: "/services", destination: "/what-we-do", permanent: true },
      { source: "/services/free-audit", destination: "/#contact", permanent: true },
      { source: "/services/seo-and-reviews", destination: "/services/seo-and-review-management", permanent: true },
      { source: "/services/google-ads", destination: "/services/google-search-ads", permanent: true },
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
