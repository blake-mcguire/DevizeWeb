import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, DotList, Eyebrow, H2, H3, PageHero, PartnerLabel, Section, Sources } from "@/components/page-parts";
import First30Days from "@/components/sections/first-30-days";
import Price from "@/components/sections/price";
import WontPromise from "@/components/sections/wont-promise";
import { DISTANCE_RATES, SEARCH_COUNT, WHAT_DOESNT_WORK } from "@/lib/offer-copy";

export const metadata: Metadata = {
  title: "How We Work and Price",
  description:
    "See it, decide, do it, report. The first 30 days in order, $500 a month flat for SEO and review management, Google Ads as a $150 add-on, and what doesn't work.",
  alternates: { canonical: "/how-we-work" },
};

const LOOP = [
  {
    title: "See it",
    body: "The free audit. We run the searches your customers run and show you who comes up. No logins.",
  },
  {
    title: "Decide",
    body: "One call and one written page: what to fix first, what to leave alone, and whether any of our add-ons are worth it for you.",
  },
  {
    title: "Do it",
    body: "We do the agreed work each month, in your accounts, under your name. Nothing we do needs you to learn software.",
  },
  {
    title: "Report",
    body: "A one-page note with counts, and a re-run of the same map, by hand for now. Places shift on their own, so the note says what we did and doesn't take credit for every move.",
  },
];

const SOURCES = [
  { label: "Google: How to improve your local ranking", url: "https://support.google.com/business/answer/7091" },
  { label: "Google Search: Spam policies, doorway abuse", url: "https://developers.google.com/search/docs/essentials/spam-policies" },
];

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero eyebrow="How we work and price" title="See it. Decide. Do it. Report.">
        <PartnerLabel />
      </PageHero>

      <Section>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {LOOP.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
                0{i + 1}
              </span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
                {step.title}
              </h2>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <First30Days band />

      <Price />

      <Section band id="what-doesnt-work">
        <div className="max-w-2xl">
          <Eyebrow>Straight talk</Eyebrow>
          <H2 className="mt-4">What doesn&apos;t work, and what can&apos;t be moved.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            We&apos;d rather tell you now than sell it to you later.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {WHAT_DOESNT_WORK.map((w) => (
            <li key={w.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
              <H3 className="md:text-xl leading-snug">{w.title}</H3>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{w.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* TODO(Blake): publish these two sets of figures? truth.md defaults to yes,
          with date and basis. An older note kept them internal. They are kept
          away from any service claim on purpose: they describe the method and the
          market, and no client is behind them. */}
      <Section id="method">
        <div className="max-w-2xl">
          <Eyebrow>Where we get this from</Eyebrow>
          <H2 className="mt-4">Our own searches.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink)] leading-relaxed">{SEARCH_COUNT.line}</p>
          <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">{SEARCH_COUNT.basis}</p>
        </div>
        <div className="mt-10 max-w-2xl rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
          <H3 className="md:text-xl leading-snug">{DISTANCE_RATES.title}</H3>
          <table className="mt-5 w-full text-[0.95rem]">
            <thead className="sr-only">
              <tr>
                <th scope="col">Distance from the searcher</th>
                <th scope="col">Rate</th>
              </tr>
            </thead>
            <tbody>
              {DISTANCE_RATES.rows.map((r) => (
                <tr key={r.distance} className="border-t border-[var(--color-border)] first:border-t-0">
                  <th scope="row" className="py-2.5 pr-4 text-left font-normal text-[var(--color-ink-soft)]">{r.distance}</th>
                  <td className="py-2.5 text-right font-medium tabular-nums text-[var(--color-ink)]">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">{DISTANCE_RATES.basis}</p>
        </div>
        <p className="mt-6 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
          Devize has no client results to show, so these numbers are about Google&apos;s
          map and not about anything we&apos;ve done for anyone.{" "}
          <Link href="/sample-audit" className="font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
            See a sample audit
          </Link>
        </p>
      </Section>

      <WontPromise />

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>The terms, in plain words</Eyebrow>
          <H2 className="mt-4 md:text-4xl">Month to month, and you can read them first.</H2>
          <DotList
            className="mt-6"
            items={[
              "No minimum term. Cancel by email at any time.",
              "It ends with the month you've paid for, with no part-month refund.",
              "You stay the owner of your listing, your site and your accounts.",
              "Everything we make for you is yours once it's paid for.",
              <>
                The full wording is in the{" "}
                <Link href="/terms" className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">
                  Service Terms
                </Link>
                .
              </>,
            ]}
          />
        </div>
        <div className="mt-12">
          <Sources items={SOURCES} />
        </div>
      </Section>

      <div className="pt-16 md:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
