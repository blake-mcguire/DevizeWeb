import type { MetadataRoute } from "next";

const SITE_URL = "https://devize.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /a/ holds one page per prospect, keyed by a secret token: never crawled.
        disallow: ["/api/", "/_next/", "/a/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
