import { copy } from "./copy";

/**
 * The one answer for a missing, malformed or expired token. Same words for
 * all three, so the page never says which tokens exist.
 */
export default function AuditNotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 sm:px-6 py-24">
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight font-medium text-[var(--color-ink)]">
        {copy.notFoundHeading}
      </h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{copy.notFoundBody}</p>
    </div>
  );
}
