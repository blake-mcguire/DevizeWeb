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
    // Legal / A2P compliance pages. Carriers fetch these during 10DLC vetting.
    ...[
      { path: "/terms", updated: "2026-07-18" },
      { path: "/privacy", updated: "2026-07-08" },
      { path: "/sms-terms", updated: "2026-07-08" },
      { path: "/sms-consent", updated: "2026-07-08" },
    ].map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
