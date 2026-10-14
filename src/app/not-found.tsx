import Link from "next/link";

/**
 * 404 for URLs that match no route. Deliberately small: Next ships this tree
 * in every page's payload as the root not-found fallback, so the full site
 * header and footer do not belong here. (/a/<token> has its own not-found.)
 */
export default function NotFound() {
  return (
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
  );
}
