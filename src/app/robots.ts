import type { MetadataRoute } from "next";

const SITE_URL = "https://www.devize.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /a/ holds one page per prospect, keyed by a secret token: never crawled.
        // /_next/ is not blocked: Google needs those files to render the pages.
        disallow: ["/api/", "/a/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
