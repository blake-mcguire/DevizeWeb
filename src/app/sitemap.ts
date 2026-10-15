import type { MetadataRoute } from "next";

const SITE_URL = "https://www.devize.ai";

// Never list /a/<token> here: those are private prospect pages (noindex, and
// disallowed in robots.ts). This sitemap is an explicit list, so they stay out.
// The articles section was unpublished on 2026-10-15 (it described the old
// offer); add its URLs back here when a new piece is published.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Legal pages, rewritten 2026-10-15 for the local SEO and AEO offer.
    // Left out on purpose: /sms-consent and /terms/v1-2 (both noindex) and
    // /thanks (the no-JavaScript form confirmation).
    ...[
      { path: "/terms", updated: "2026-10-15" },
      { path: "/privacy", updated: "2026-10-15" },
      { path: "/sms-terms", updated: "2026-10-15" },
    ].map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
