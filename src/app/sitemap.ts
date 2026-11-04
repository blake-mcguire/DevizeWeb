import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/lib/industries";

const SITE_URL = "https://www.devize.ai";

// Never list /a/<token> here: those are private prospect pages (noindex, and
// disallowed in robots.ts). This sitemap is an explicit list, so they stay out.
// The articles section was unpublished on 2026-10-15 (it described the old
// offer); add its URLs back here when a new piece is published.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const marketing = [
    { path: "/", priority: 1.0 },
    { path: "/what-we-do", priority: 0.9 },
    { path: "/services", priority: 0.9 },
    { path: "/sample-audit", priority: 0.8 },
    { path: "/industries", priority: 0.8 },
    ...INDUSTRIES.map((i) => ({ path: `/industries/${i.slug}`, priority: 0.7 })),
  ];

  return [
    ...marketing.map((page) => ({
      url: `${SITE_URL}${page.path === "/" ? "/" : page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    // Left out on purpose: /sms-consent and /terms/v1-2 (both noindex) and
    // /thanks (the no-JavaScript form confirmation).
    ...[
      { path: "/terms", updated: "2026-11-04" },
      { path: "/privacy", updated: "2026-11-04" },
      { path: "/sms-terms", updated: "2026-10-15" },
    ].map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
