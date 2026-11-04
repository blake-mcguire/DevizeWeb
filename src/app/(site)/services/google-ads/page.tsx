import type { Metadata } from "next";
import { CountList, CrossList, DotList, Eyebrow, H2, H3, PageHero, Section, Sources } from "@/components/page-parts";
import { Button } from "@/components/ui/button";
import {
  ADS_FIRST_30,
  ADS_LEFT_OUT,
  ADS_MONTHLY,
  ADS_NOT_PROMISED,
  ADS_PROMISED,
  EMAIL,
  GOOGLE_ADS,
} from "@/lib/offer-copy";

/**
 * The add-on's page. The digital strategy partner label stays off this page on
 * purpose: near ads, "partner" reads as Google's own program. Never add a claim
 * of Google Partner status, certification, ads experience or ads results. None
 * is on record, and Google's rules bar claiming a false one.
 */
export const metadata: Metadata = {
  title: "Google Ads Management",
  description:
    "An optional add-on at $150 a month, on top of the $500 monthly work: 5 new lines of ad copy, 2 search reviews, 1 test, 4 check-ins and 1 report a month. Ad spend is separate and paid to Google.",
  alternates: { canonical: "/services/google-ads" },
};

const SOURCES = [
  { label: "Google Ads: How your daily budget works", url: "https://support.google.com/google-ads/answer/6385083" },
  { label: "Google Ads policy: Third-party partners and how they must describe services, costs and results", url: "https://support.google.com/adspolicy/answer/6086450" },
];

export default function GoogleAdsPage() {
  return (
    <>
      <PageHero
        eyebrow="Optional add-on"
        title="Google Ads Management"
        lead="Counted monthly work on your own Google Ads account, inside tight limits. It's added to the monthly work when it's worth doing, and we'll tell you when it isn't."
      >
        <p className="text-lg text-white">
          <strong className="font-semibold">{GOOGLE_ADS.headline}</strong>
        </p>
        <p className="mt-1 text-white/85">{GOOGLE_ADS.spend} Month to month. Cancel any time.</p>
      </PageHero>

      <Section className="pb-0 md:pb-0">
        <div className="rounded-2xl border border-[#B3261E]/30 bg-[#B3261E]/[0.05] p-6 md:p-8">
          <H3>Read this first</H3>
          {/* TODO(Blake): the scope file says to print this in every proposal. Confirm the wording. */}
          <p className="mt-3 text-lg text-[var(--color-ink)] leading-relaxed">{GOOGLE_ADS.disclosure}</p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>What you get</Eyebrow>
            <H2 className="mt-4">Every month, counted.</H2>
            <CountList className="mt-8" items={[...ADS_MONTHLY]} />
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6">
              <H3>The limits</H3>
              <DotList className="mt-4" items={[...GOOGLE_ADS.limits]} />
              <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                Beyond these, we quote again, or tell you it isn&apos;t a job for us.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <H3>Who owns what</H3>
              <DotList
                className="mt-4"
                items={[
                  "You own the account and hold Admin, with your own Google sign-in.",
                  "You pay Google directly. We never hold your billing.",
                  "We get a user invitation: read-only first, then Standard. Never Admin, and never a shared password.",
                  "You can remove us at any time.",
                  GOOGLE_ADS.keep,
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>If you already run ads</Eyebrow>
          <H2 className="mt-4">The first 30 days, in order.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            This is the order of the work, not a promised result.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ADS_FIRST_30.map((step) => (
            <li key={step.when} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-brand)] font-medium">{step.when}</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] font-medium tracking-tight leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
          <H3>What your money can do on a given day</H3>
          <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
            Google can spend up to twice your average daily budget on one day, and
            up to 30.4 times it in a month. So a $40 daily budget can spend about
            $80 on one day, and no more than about $1,216 in a month. Your ceiling
            is written down at the start, and only you change it. This is what the
            money can do, not a forecast of what it buys.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3 items-start">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>What we do promise</H3>
            <DotList className="mt-5" items={ADS_PROMISED} />
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>What isn&apos;t promised</H3>
            <CrossList className="mt-5" items={ADS_NOT_PROMISED} />
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>What&apos;s left out</H3>
            <CrossList className="mt-5" items={ADS_LEFT_OUT} />
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_auto] md:items-center">
          <div>
            <H2 className="md:text-4xl">Start with the map, not the ads.</H2>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
              If your phone number is wrong or your reviews are thin, paying for
              clicks can wait, and we&apos;ll say so. The free audit comes first.
              Ask about the add-on after that, or email {EMAIL}.
            </p>
          </div>
          <Button href="/#contact" size="lg" className="w-full md:w-auto">Get my free map audit</Button>
        </div>

        <div className="mt-12">
          <Sources items={SOURCES} />
        </div>
      </Section>
    </>
  );
}
