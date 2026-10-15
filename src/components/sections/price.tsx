import { Button } from "@/components/ui/button";
import { FounderChip } from "@/components/founder";
import { MONTHLY_WORK, PRICE, REBUILD } from "@/lib/offer-copy";

/**
 * The price card and what it buys (2026-10-15, Blake: show the price). Every
 * string and quantity comes from src/lib/offer-copy.ts, where the drafts are
 * marked for Blake.
 */
export default function Price() {
  return (
    <section id="price" className="scroll-mt-16 bg-white/60 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Price
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            One price,
            <br />
            and what it buys.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start">
          {/* The price card */}
          <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] p-8 md:p-10 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.3]"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 100% 0%, rgba(122,63,229,0.7) 0%, rgba(122,63,229,0) 60%)",
              }}
            />
            <div className="relative">
              <p className="text-sm font-medium text-white/80">Local SEO and AEO, every month</p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-6xl md:text-7xl font-medium tracking-tight">
                  {PRICE.display}
                </span>
                <span className="text-lg text-white/80">a month</span>
              </p>
              <ul className="mt-6 space-y-3 text-[1.05rem] leading-snug">
                {[
                  `Flat. ${PRICE.included}`,
                  PRICE.term,
                  PRICE.keepShort,
                  PRICE.audit + " See where you stand before you pay for anything.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" className="mt-[0.15em] shrink-0 text-[#A98BF5]">
                      <path d="M3 8.5l3 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-white/75 leading-relaxed">{PRICE.why}</p>
              <div className="mt-8">
                <Button href="/#contact" size="lg" className="w-full sm:w-auto">
                  Get my free map audit
                </Button>
              </div>
              <FounderChip tone="dark" className="mt-6" />
            </div>
          </div>

          {/* What you get each month */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 md:p-10">
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] text-[var(--color-ink)] font-medium tracking-tight">
              What you get each month
            </h3>
            <ul className="mt-6 divide-y divide-[var(--color-border)]">
              {MONTHLY_WORK.map((item) => (
                <li key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[var(--color-ink)] leading-snug">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Optional add-on (Blake, 2026-10-15) */}
        <div id="rebuild" className="mt-5 scroll-mt-16 rounded-3xl border border-[var(--color-border)] bg-white p-8 md:p-10 grid gap-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] text-[var(--color-ink)] font-medium tracking-tight">
              {REBUILD.title}
            </h3>
            <p className="mt-2 text-lg font-medium text-[var(--color-ink)]">{REBUILD.priceLine}</p>
          </div>
          <p className="text-[var(--color-ink-soft)] leading-relaxed">{REBUILD.detail}</p>
        </div>
      </div>
    </section>
  );
}
