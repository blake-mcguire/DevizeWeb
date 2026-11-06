import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Small building blocks for the marketing pages. Plain server components: all the
 * words render into the first HTML response. The look lives in the .site-chrome part
 * of globals.css, scoped so that the prospect pages under /a/ never get it.
 */

export const CONTAINER = "mx-auto w-full max-w-[76rem] px-5 md:px-6";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(CONTAINER, className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M2.5 9h12.5M10 3.75 15.25 9 10 14.25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The site's standard link: a round arrow and a bold label. `tone="light"` is for
 * navy and the purple panel, `tone="brand"` for white. A hash-only link stays a plain
 * <a>, so the browser's own scroll and :target both work.
 */
export function ArrowLink({
  href,
  children,
  tone = "brand",
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  tone?: "brand" | "light";
  className?: string;
  /** For a link whose words repeat down a page, like "Read the page". */
  ariaLabel?: string;
}) {
  const light = tone === "light";
  const inner = (
    <>
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-transform duration-200 group-hover:translate-x-1",
          light ? "bg-white text-[#330099]" : "bg-[var(--color-panel)] text-white"
        )}
      >
        <ArrowIcon />
      </span>
      <span className={cn("font-bold leading-snug tracking-[-0.015em]", light ? "text-white" : "text-[var(--color-brand)]")}>{children}</span>
    </>
  );
  const classes = cn(
    "group inline-flex items-center gap-3.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-4",
    light ? "focus-visible:ring-white focus-visible:ring-offset-transparent" : "focus-visible:ring-[var(--color-brand)]",
    className
  );
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} aria-label={ariaLabel} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={classes}>
      {inner}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

/** The bold short line above a heading or above body text. */
export function Eyebrow({ children, className, dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        "text-[1.0625rem] font-bold leading-snug tracking-[-0.015em] md:text-xl",
        dark ? "text-white" : "text-[var(--color-brand)]",
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
        "font-[family-name:var(--font-display)] text-[2.125rem] md:text-[3rem] leading-[1.06] text-[var(--color-ink)]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("font-[family-name:var(--font-display)] text-[1.375rem] md:text-[1.625rem] leading-[1.18] text-[var(--color-ink)]", className)}>
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/**
 * A page section. `band` is a deep navy block with slanted edges, `tint` a faint lilac
 * one, and plain is white. A band flips the colour tokens, so what's inside needs no
 * colours of its own.
 */
export function Section({
  id,
  band = false,
  tint = false,
  narrow = false,
  children,
  className,
}: {
  id?: string;
  band?: boolean;
  tint?: boolean;
  narrow?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24",
        band && "on-navy slant bg-[var(--color-navy)]",
        tint && "bg-[var(--color-surface-raised)]"
      )}
    >
      <div className={cn("mx-auto w-full px-5 md:px-6", band ? "py-10 md:py-14" : "py-16 md:py-24", narrow ? "max-w-3xl" : "max-w-[76rem]", className)}>{children}</div>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8", className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Heroes
// ---------------------------------------------------------------------------

/** A full-bleed licensed brand image, darkened on the side the words sit on. */
export function HeroImage({ src, top = false }: { src: string; top?: boolean }) {
  return (
    <>
      {/* scale-[1.12]: hero-bg.jpg has small grey tick marks near its edges. This crops them out. */}
      <Image src={src} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className={cn("-z-20 scale-[1.12] object-cover", top && "object-[50%_18%]")} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#120739]/75 via-[#120739]/35 to-transparent" />
    </>
  );
}

/**
 * The solid purple panel that overlaps a hero's lower edge, on every width. On a wide
 * screen it runs off the page's right edge, and `corner` fills the white space left of it.
 */
export function HeroPanel({ children, corner }: { children: ReactNode; corner?: ReactNode }) {
  return (
    <div className="relative z-10 mx-5 -mt-20 md:mx-6 md:-mt-32 lg:mx-0">
      {corner && (
        <div className="absolute bottom-0 left-0 top-32 hidden w-[33%] items-center pr-6 lg:flex lg:pl-[max(1.5rem,calc((100vw-76rem)/2+1.5rem))]">{corner}</div>
      )}
      <div className="on-navy bg-[var(--color-panel)] lg:ml-[33%]">
        <div className="px-5 py-9 md:px-14 md:py-12 lg:pr-[max(3.5rem,calc((100vw-76rem)/2+1.5rem))]">{children}</div>
      </div>
    </div>
  );
}

/**
 * A page's opening: the image, a big white line, and the panel with a bold subhead, one
 * short paragraph and whatever comes after them. With nothing for the panel, no panel.
 */
export function PageHero({
  eyebrow,
  title,
  subhead,
  lead,
  imageTop = false,
  corner,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subhead?: ReactNode;
  lead?: ReactNode;
  /** What sits in the white corner beside the panel on a wide screen. Nothing unless a page passes it. */
  corner?: ReactNode;
  /** Show the top of the image, so its busiest part sits behind the panel and not the words. */
  imageTop?: boolean;
  children?: ReactNode;
}) {
  const panel = Boolean(subhead || lead || children);
  return (
    <section>
      <div className="relative isolate overflow-hidden bg-[var(--color-navy)]">
        {/* Blake, 5 Nov 2026: every hero keeps the original image, public/hero-bg.jpg. Do not swap it per page. */}
        <HeroImage src="/hero-bg.jpg" top={imageTop} />
        <Container className={cn("pt-14 md:pt-24", panel ? "pb-32 md:pb-52" : "pb-24 md:pb-36")}>
          {eyebrow && <div className="mb-5 text-[1.0625rem] font-bold text-white/90 md:text-xl">{eyebrow}</div>}
          <h1 className="reveal max-w-5xl font-[family-name:var(--font-display)] text-[2.625rem] leading-[1.05] text-white md:text-[4.25rem] md:leading-[1.03]">
            {title}
          </h1>
        </Container>
      </div>
      {panel && (
        <HeroPanel corner={corner}>
          {subhead && <p className="text-[1.375rem] font-extrabold leading-snug tracking-[-0.025em] text-white [text-wrap:balance] md:text-[1.75rem]">{subhead}</p>}
          {lead && <p className="mt-3 max-w-2xl text-white/90 leading-relaxed">{lead}</p>}
          {children && <div className="mt-6">{children}</div>}
        </HeroPanel>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Lists and numbers
// ---------------------------------------------------------------------------

export function DotList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("space-y-3 text-[var(--color-ink-soft)] leading-relaxed", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="brand-dot mt-[0.62em] shrink-0" aria-hidden="true" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Gradient text only paints inside its own box, so a number wider than its column gets
 * its digits cut off. These sizes hold down to 320 wide: four numbers go two by two until
 * there's room for four across, and three across shrink with the screen.
 */
const BAND_LAYOUT: Record<number, { grid: string; number: string; cell: (i: number) => string }> = {
  2: {
    grid: "grid-cols-1 gap-y-9 sm:grid-cols-2",
    number: "text-[3.25rem] md:text-[4rem]",
    cell: (i) => (i === 0 ? "sm:pr-8" : "sm:border-l sm:border-[var(--color-border)] sm:pl-8"),
  },
  3: {
    grid: "grid-cols-1 gap-y-9 md:grid-cols-3",
    number: "text-[3.25rem] md:text-[clamp(2.75rem,5.4vw,4rem)]",
    cell: (i) => (i === 0 ? "md:pr-6 lg:pr-8" : "md:border-l md:border-[var(--color-border)] md:px-6 lg:px-8"),
  },
  4: {
    grid: "grid-cols-2 gap-x-5 gap-y-8 md:gap-x-8 md:gap-y-10 xl:grid-cols-4 xl:gap-x-0",
    number: "text-[clamp(2rem,10.2vw,2.5rem)] sm:text-[3.25rem] md:text-[4rem]",
    cell: (i) => (i === 0 ? "xl:pr-8" : "xl:border-l xl:border-[var(--color-border)] xl:px-8"),
  },
};

/**
 * Big numbers with short labels and thin rules between them. A number never prints
 * without its basis: date, place and trade (FTC substantiation statement).
 */
export function NumberBand({
  items,
  basis,
  className,
}: {
  items: { count: string; label: ReactNode }[];
  basis: ReactNode;
  className?: string;
}) {
  const layout = BAND_LAYOUT[items.length] ?? BAND_LAYOUT[3];
  return (
    <div className={className}>
      <dl className={cn("grid", layout.grid)}>
        {items.map((item, i) => (
          <div key={item.count} className={cn("flex min-w-0 flex-col-reverse justify-end", layout.cell(i))}>
            <dt className="mt-2 font-bold leading-snug text-[var(--color-ink)]">{item.label}</dt>
            <dd className={cn("brand-text-gradient font-[family-name:var(--font-display)] leading-[1.05]", layout.number)}>{item.count}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-4xl text-sm leading-relaxed text-[var(--color-ink-soft)]">{basis}</p>
    </div>
  );
}

/**
 * Our own counted findings: the number large, what it is, and the basis right under
 * them. A number never prints without its date, place and trade.
 */
export function Findings({
  eyebrow,
  title,
  items,
  basis,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  items: { count: string; title: ReactNode; detail: ReactNode }[];
  basis: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H2 className="mt-3">{title}</H2>
      </div>
      <ul className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.count} className={cn("min-w-0", BAND_LAYOUT[3].cell(i))}>
            <p className={cn("brand-text-gradient font-[family-name:var(--font-display)] leading-[1.05]", BAND_LAYOUT[3].number)}>{item.count}</p>
            <p className="mt-3 font-bold leading-snug text-[var(--color-ink)]">{item.title}</p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{item.detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-4xl text-sm leading-relaxed text-[var(--color-ink-soft)]">{basis}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The close
// ---------------------------------------------------------------------------

/**
 * Blake, 5 Nov 2026: the audit is not a product and is not pushed as one. One small call to
 * action after a page's content, in his words (punctuation only). Keep as written.
 */
export const GET_IN_TOUCH =
  "Get in touch with the team and get a free, no-strings-attached audit and marketing roadmap, so you can see where you rank against the competition and have the tools to win your market.";

/**
 * The close on every inner page: one modest strip, and the form itself is on the home page
 * (/#contact). It has no top padding of its own, because the white section above it
 * usually brings enough. After a navy band, pass the space in `className`.
 * `note` prints in small type under the strip. The trade pages use it for where the
 * comparison with rivals runs, because the sentence promises one and four of the six
 * trades have none yet.
 */
export function GetInTouch({ className, note }: { className?: string; note?: ReactNode }) {
  return (
    <section aria-label="Get in touch" className={cn("bg-white", className)}>
      <Container className="pb-16 md:pb-24">
        <div className="on-navy flex flex-col gap-6 bg-[var(--color-panel)] px-6 py-7 md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 md:py-9">
          <p className="max-w-3xl text-[1.0625rem] font-medium leading-relaxed text-white [text-wrap:pretty] md:text-[1.1875rem]">{GET_IN_TOUCH}</p>
          <Button href="/#contact" variant="white" className="shrink-0 self-start md:self-auto">
            Get in touch
          </Button>
        </div>
        {note && <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--color-ink-soft)]">{note}</p>}
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export type Source = { label: string; url: string };

/**
 * Returns a function that prints a source's number, linked to the list at the
 * bottom of the page. Pass the same array to <Sources>, in the order the page
 * first cites them.
 */
export function citer(sources: Source[]) {
  return function Cite(...refs: Source[]) {
    return refs.map((ref, i) => {
      const n = sources.findIndex((s) => s.url === ref.url) + 1;
      if (n === 0) throw new Error(`Source missing from this page's list: ${ref.label}`);
      return (
        <sup key={ref.url} className="ml-px font-semibold">
          {i > 0 && ","}
          <a href={`#source-${n}`} aria-label={`Source ${n}: ${ref.label}`} className="text-[var(--color-brand)] no-underline hover:underline">
            {n}
          </a>
        </sup>
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
export function Sources({
  items,
  read = "4 and 5 November 2026",
}: {
  items: Source[];
  read?: string;
}) {
  if (!items.length) return null;
  return (
    <div className="border-t border-[var(--color-border)] pt-6">
      <p className="text-sm font-bold text-[var(--color-ink)]">Where the outside facts come from</p>
      <ol className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
        {items.map((s, i) => (
          <li key={s.url} id={`source-${i + 1}`} className="flex scroll-mt-24 gap-2">
            <span className="tabular-nums text-[var(--color-ink-muted)]">{i + 1}.</span>
            <a
              href={s.url}
              rel="noopener noreferrer"
              className="min-w-0 break-words underline decoration-[var(--color-ink)]/25 underline-offset-2 hover:decoration-[var(--color-ink)]"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">We checked these on {read}.</p>
    </div>
  );
}
