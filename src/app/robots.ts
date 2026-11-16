import type { MetadataRoute } from "next";

const SITE_URL = "https://www.devize.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /a/ holds one page per prospect, keyed by a secret token: never crawled.
        // /for/ (a voice page's readable link) and /u/ (its opt-out page) are the
        // same prospect pages under other addresses (2026-11-16): never crawled either.
        // /_next/ is not blocked: Google needs those files to render the pages.
        disallow: ["/api/", "/a/", "/for/", "/u/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
