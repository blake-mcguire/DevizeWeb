import Link from "next/link";

/**
 * Shared prose primitives for long-form legal / compliance pages
 * (Privacy, SMS Terms, SMS Consent, Service Terms). Styling mirrors the MDX
 * article components so these content pages match the rest of the site.
 *
 * These are plain server components. The body text renders into the
 * initial HTML response (no client-side JS required), which the A2P
 * 10DLC carrier vetting requires.
 */

export function LegalPage({
  eyebrow,
  title,
  updated,
  version,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  version?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-surface)]">
      <article className="mx-auto max-w-2xl px-6 py-24 md:py-32">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-tight text-[var(--color-ink)] font-medium leading-[1.1]">
          {title}
        </h1>
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          {version ? `${version} · Effective ${updated}` : `Last updated: ${updated}`}
        </p>
        <div className="mt-10">{children}</div>
      </article>
    </div>
  );
}

export function H2({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight text-[var(--color-ink)] font-medium mt-12 mb-4 leading-tight scroll-mt-24"
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[1.05rem] leading-[1.75] text-[var(--color-ink-soft)] my-5">
      {children}
    </p>
  );
}

/** Emphasised callout paragraph used for the verbatim non-sharing sentence. */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5 text-[1.05rem] leading-[1.75] font-semibold text-[var(--color-ink)]">
      {children}
    </p>
  );
}

/** Indented block quote used for the exact consent disclosure copy. */
export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-8 border-l-2 border-[var(--color-brand)] pl-6 text-lg italic text-[var(--color-ink)] leading-relaxed">
      {children}
    </blockquote>
  );
}

export function ProseLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)] transition"
    >
      {children}
    </Link>
  );
}

/** Inline code, used sparingly for domain or config examples. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[var(--color-ink)]/5 px-1.5 py-0.5 text-[0.9em] font-mono text-[var(--color-ink)]">
      {children}
    </code>
  );
}

/** Table of contents for long legal documents. Anchors to H2 ids. */
export function TableOfContents({
  items,
}: {
  items: Array<{ id: string; label: string }>;
}) {
  return (
    <nav
      aria-label="Contents"
      className="my-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5"
    >
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium mb-4">
        Contents
      </p>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[0.9375rem] leading-snug list-none p-0">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[var(--color-ink-soft)] hover:text-[var(--color-brand)] transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Contact line rendered at the foot of each legal page. */
export function ContactLine({
  label = "Contact",
  parts,
}: {
  label?: string;
  parts: string[];
}) {
  return (
    <p className="mt-8 text-[1.05rem] leading-[1.75] text-[var(--color-ink-soft)]">
      <span className="font-semibold text-[var(--color-ink)]">{label}: </span>
      {parts.join(" · ")}
    </p>
  );
}
