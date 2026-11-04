import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FounderChip } from "@/components/founder";
import { CountList, CrossList, Eyebrow, H2, H3 } from "@/components/page-parts";
import { ADS_MONTHLY, GOOGLE_ADS, LEFT_OUT, MONTHLY_WORK, PRICE } from "@/lib/offer-copy";

/**
 * The price and what it buys (Blake, 2026-11-04). Every string and quantity
 * comes from src/lib/offer-copy.ts, where the drafts are marked.
 */
export default function Price({ band = false }: { band?: boolean }) {
  return (
    <section id="price" className={band ? "scroll-mt-16 bg-white/60 border-y border-[var(--color-border)]" : "scroll-mt-16"}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <Eyebrow>Price</Eyebrow>
          <H2 className="mt-4">$500 a month. Here&apos;s what it buys.</H2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start">
          <div className="min-w-0 space-y-5">
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
                <p className="text-sm font-medium text-white/80">{PRICE.service}</p>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-display)] text-6xl md:text-7xl font-medium tracking-tight">
                    {PRICE.display}
                  </span>
                  <span className="text-lg text-white/80">a month</span>
                </p>
                <ul className="mt-6 space-y-3 text-[1.05rem] leading-snug">
                  {["Flat. Not a percent of your ad spend or sales.", PRICE.term, PRICE.keepShort, PRICE.scope, `${PRICE.audit} See where you stand before you pay for anything.`].map((line) => (
                    <li key={line} className="flex gap-3">
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" className="mt-[0.15em] shrink-0 text-[#A98BF5]">
                        <path d="M3 8.5l3 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href="/#contact" size="lg" className="w-full sm:w-auto">
                    Get my free map audit
                  </Button>
                </div>
                <FounderChip tone="dark" className="mt-6" />
              </div>
            </div>

            {/* What's left out */}
            <div className="rounded-3xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
              <H3>What&apos;s left out</H3>
              <CrossList className="mt-5" items={LEFT_OUT} />
            </div>
          </div>

          {/* What $500 buys */}
          <div className="min-w-0 rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-10">
            <H3 className="md:text-[1.75rem]">Every month</H3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              Each item says what it&apos;s for. Only one of them is tied to the
              map, and we can&apos;t promise that one either.
            </p>
            <CountList
              className="mt-6"
              items={MONTHLY_WORK.map((w) => ({ count: w.count, title: w.title, detail: w.detail, tag: w.purpose }))}
            />
          </div>
        </div>

        {/* The Google Ads add-on */}
        <div id="google-ads" className="mt-5 scroll-mt-20 grid grid-cols-1 gap-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Optional add-on</Eyebrow>
            <H3 className="mt-3 md:text-[1.75rem]">{GOOGLE_ADS.title}</H3>
            <p className="mt-3 text-lg font-medium text-[var(--color-ink)]">{GOOGLE_ADS.headline}</p>
            <p className="mt-1 text-[var(--color-ink-soft)]">{GOOGLE_ADS.spend}</p>
            <p className="mt-5 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-4 text-sm text-[var(--color-ink)] leading-relaxed">
              {GOOGLE_ADS.disclosure}
            </p>
            <p className="mt-4">
              <Link href="/services/google-ads" className="text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
                The limits, the first 30 days and what&apos;s left out
              </Link>
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-ink)]">After the first 30 days:</p>
            <CountList className="mt-4" items={[...ADS_MONTHLY]} />
          </div>
        </div>
      </div>
    </section>
  );
}
