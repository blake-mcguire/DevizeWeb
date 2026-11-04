import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Small building blocks for the marketing pages, in the same type and colours
 * the home page has always used. Plain server components: all the words render
 * into the first HTML response.
 */

export function Eyebrow({ children, className, dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        "text-xs uppercase tracking-[0.18em] font-medium",
        dark ? "text-white/75" : "text-[var(--color-ink-muted)]",
        className
      )}
    >
      {children}
    </p>
  );
}

export function H2({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2
      id={id}
      className={cn(
        "font-[family-name:var(--font-display)] text-3xl md:text-[2.625rem] leading-[1.08] tracking-tight text-[var(--color-ink)] font-medium",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        "font-[family-name:var(--font-display)] text-xl md:text-2xl text-[var(--color-ink)] font-medium tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

/** A page section. `band` is the white wash with hairlines the home page alternates with. */
export function Section({
  id,
  band = false,
  narrow = false,
  children,
  className,
}: {
  id?: string;
  band?: boolean;
  narrow?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-16", band && "bg-white/60 border-y border-[var(--color-border)]")}>
      <div className={cn("mx-auto px-6 py-16 md:py-24", narrow ? "max-w-3xl" : "max-w-6xl", className)}>{children}</div>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7", className)}>{children}</div>
  );
}

/** The dark, purple-lined band behind the home hero and every inner page's title. */
export function DarkBand({ children }: { children: ReactNode }) {
  return (
    <section
      className="relative overflow-hidden isolate"
      style={{
        backgroundColor: "#0A0420",
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,4,32,0.95) 0%, rgba(10,4,32,0.85) 45%, rgba(10,4,32,0.55) 80%, rgba(10,4,32,0.4) 100%)",
        }}
      />
      {children}
    </section>
  );
}

/** An inner page's title band. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <DarkBand>
      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-14 md:pt-16 md:pb-20">
        <div className="max-w-3xl">
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="reveal mt-4 font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white font-medium">
            {title}
          </h1>
          {lead && <p className="reveal mt-5 text-lg md:text-xl text-white/80 leading-relaxed">{lead}</p>}
          {children && <div className="reveal mt-7">{children}</div>}
        </div>
      </div>
    </DarkBand>
  );
}

export function DotList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="brand-dot mt-[0.6em] shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A list with an X mark, for what's left out or not promised. */
export function CrossList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.2em] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#B3261E]/30 bg-[#B3261E]/[0.07] text-[#B3261E]"
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 2.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Counted deliverables: the count large, then what it is. */
export function CountList({
  items,
  className,
}: {
  items: { count: string; title: string; detail: string; tag?: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("divide-y divide-[var(--color-border)]", className)}>
      {items.map((item) => (
        <li key={item.title} className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-3 py-4 first:pt-0 last:pb-0">
          <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight leading-tight">
            {item.count}
          </span>
          <div>
            <p className="font-medium text-[var(--color-ink)] leading-snug">{item.title}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">{item.detail}</p>
            {item.tag && (
              <p className="mt-2 inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-0.5 text-xs text-[var(--color-ink-soft)]">
                {item.tag}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The closing nudge on inner pages. The form itself lives on the home page. */
export function CtaBand({
  title = "See your own map first.",
  body = "It's free, there's nothing to sign, and we only use what anyone can see on Google and on your website.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28 pt-4">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] px-8 py-12 md:px-14 md:py-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(122,63,229,0.7) 0%, rgba(122,63,229,0) 60%)",
          }}
        />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_auto] md:items-center md:gap-12">
          <div>
            <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight font-medium">
              {title}
            </p>
            <p className="mt-3 text-white/80 leading-relaxed max-w-2xl">{body}</p>
          </div>
          <Button href="/#contact" size="lg" className="w-full md:w-auto">
            Get my free map audit
          </Button>
        </div>
      </div>
    </section>
  );
}

export type Source = { label: string; url: string };

/**
 * Returns a function that prints a source's number, linked to the list at the
 * bottom of the page. Pass the same array to <Sources>, in the order the page
 * first cites them.
 */
export function citer(sources: Source[]) {
  return function Cite(...refs: Source[]) {
    return refs.map((ref) => {
      const n = sources.findIndex((s) => s.url === ref.url) + 1;
      if (n === 0) throw new Error(`Source missing from this page's list: ${ref.label}`);
      return (
        <a
          key={ref.url}
          href={`#source-${n}`}
          aria-label={`Source ${n}: ${ref.label}`}
          className="ml-0.5 text-xs font-medium text-[var(--color-brand)] no-underline hover:underline"
        >
          [{n}]
        </a>
      );
    });
  };
}

/** Example searches, as chips. Plain-word examples, never volume figures. */
export function SearchChips({ searches, className }: { searches: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {searches.map((s) => (
        <li key={s} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-sm text-[var(--color-ink)]">
          {s}
        </li>
      ))}
    </ul>
  );
}

/** Numbered sources for any outside fact on a page. */
export function Sources({ items, read = "4 November 2026" }: { items: Source[]; read?: string }) {
  if (!items.length) return null;
  return (
    <div className="border-t border-[var(--color-border)] pt-6">
      <p className="text-sm font-medium text-[var(--color-ink)]">Where the outside facts come from</p>
      <ol className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
        {items.map((s, i) => (
          <li key={s.url} id={`source-${i + 1}`} className="scroll-mt-20 flex gap-2">
            <span className="tabular-nums text-[var(--color-ink-muted)]">{i + 1}.</span>
            <a
              href={s.url}
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-[var(--color-ink)]/25 hover:decoration-[var(--color-ink)] break-words min-w-0"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-[var(--color-ink-muted)] leading-relaxed">
        Read on {read}. Rules change, so check the current version. Nothing here is legal advice.
      </p>
    </div>
  );
}
