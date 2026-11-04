import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

// The tab reads "Page not found · Devize" instead of the site's default title.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 for URLs that match no route. Unmatched URLs render here, outside the
 * (site) route group, so this page brings the site's header and footer itself:
 * a broken link on the marketing site keeps its nav, as it did before the
 * chrome moved into (site)/layout.tsx. The wrapper is the same one that layout
 * uses, for the marketing pages' muted grey. Next also ships this tree in every
 * page's payload, /a/ included. /a/<token> has its own not-found.
 */
export default function NotFound() {
  return (
    <div className="site-chrome contents">
      <SiteHeader />
      <main className="relative flex-1 z-0">
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            404
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--color-ink)] font-medium">
            This page could not be found.
          </h1>
          <p className="mt-6">
            <Link
              href="/"
              className="text-sm text-[var(--color-ink-soft)] underline underline-offset-4 hover:text-[var(--color-ink)]"
            >
              Back to the homepage
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
