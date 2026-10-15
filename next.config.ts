import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      // The articles section was unpublished on 2026-10-15 (it described the
      // old offer). The live sitemap listed /articles and /articles/welcome,
      // so send those URLs home instead of to a 404.
      { source: "/articles", destination: "/", permanent: true },
      { source: "/articles/:path*", destination: "/", permanent: true },
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
