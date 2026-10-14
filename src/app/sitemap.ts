import type { MetadataRoute } from "next";

const SITE_URL = "https://devize.ai";

// Ordered newest-first. When adding articles, extend this list, or swap to a
// fs.readdir scan once there are more than a handful.
const articles: Array<{ slug: string; lastModified: string }> = [
  { slug: "welcome", lastModified: "2026-04-22" },
];

// Never list /a/<token> here: those are private prospect pages (noindex, and
// disallowed in robots.ts). This sitemap is an explicit list, so they stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...articles.map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: new Date(a.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
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
