import type { Metadata } from "next";
import Link from "next/link";
import { LEAD_ERRORS, LEAD_THANKS, isLeadErrorCode } from "@/lib/lead-copy";

/**
 * Where the homepage form lands when it was sent without JavaScript:
 * /api/lead answers a plain form post with a 303 here, with ?e=<code> when
 * something was missing. With JavaScript the form shows the same lines in
 * place and never comes here. Not for search, and not in the sitemap.
 */
export const metadata: Metadata = {
  title: "Audit request",
  robots: { index: false, follow: true },
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { e } = await searchParams;
  const error = isLeadErrorCode(e) ? LEAD_ERRORS[e] : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
        Free map audit
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-tight text-[var(--color-ink)] font-medium leading-tight">
        {error ?? LEAD_THANKS}
      </h1>
      <p className="mt-8">
        <Link
          href={error ? "/#contact" : "/"}
          className="text-sm text-[var(--color-ink-soft)] underline underline-offset-4 hover:text-[var(--color-ink)]"
        >
          {error ? "Back to the form" : "Back to the homepage"}
        </Link>
      </p>
    </div>
  );
}
