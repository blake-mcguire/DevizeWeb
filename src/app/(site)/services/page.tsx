import type { Metadata } from "next";
import Link from "next/link";
import { FounderChip } from "@/components/founder";
import { JsonLd } from "@/components/json-ld";
import { CountList, CrossList, CtaBand, DotList, Eyebrow, H2, H3, PageHero, Section, Sources, type Source } from "@/components/page-parts";
import { AccessPill, StatusPill } from "@/components/tier-parts";
import { Button } from "@/components/ui/button";
import { AUDIT_CHECKS } from "@/lib/audit-checks";
import { cn } from "@/lib/cn";
import { INDUSTRIES, S } from "@/lib/industries";
import { AUDIT_COUNTS, AUDIT_NAME, COVERAGE, EMAIL, KEEP_PROMISE } from "@/lib/offer-copy";
import {
  ADS_FIRST_30,
  ADS_LEFT_OUT,
  ADS_MONTHLY,
  ADS_NOT_PROMISED,
  ADS_OWNERSHIP,
  GOOGLE_ADS,
  PILOT_NOTE,
  PRICE,
  TIERS,
  TIER_1_LEFT_OUT,
  TIER_1_YOUR_PART,
  TIER_ITEMS,
  TRADE_ACCESS,
  type Tier,
} from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Services",
  description:
    "A free map audit, then three tiers side by side. Tier 1 is $500 a month, flat, and available now. Google Ads is a $150 a month add-on, with ad spend paid to Google. The rest is in pilot.",
  alternates: { canonical: "/services" },
};

const ASK_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Where do the pilots stand?")}&body=${encodeURIComponent("Business name:\nTrade:\nTown:\nWhich tier or line I'm asking about:\n")}`;

const LINK = "font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]";

// No part of "digital strategy partner" appears on this page: the Google Ads
// section lives here, and near ads "partner" reads as Google's own program. The
// one exception is the required line that says we aren't a Google Partner.

// DRAFT: for Blake to confirm. These are only the questions no page answers
// elsewhere. It feeds both the list below and the FAQPage JSON-LD.
const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "Can I buy Tier 2 or Tier 3 today?",
    a: `Google Ads management, yes, as the ${GOOGLE_ADS.display} a month add-on. The rest is in pilot: no client is on it and the price isn't set. Email ${EMAIL} and we'll tell you where it stands for your trade.`,
  },
  {
    q: "What happens if I cancel?",
    a: `${PRICE.term} Tell us by email, and the service ends with the month you've paid for. ${KEEP_PROMISE} We hand over every page and file before we remove our access.`,
  },
  {
    q: "Do you write or buy reviews?",
    a: "No. Fake reviews, paid reviews and asking only happy customers all break Google's rules, and the FTC bans fake reviews. The automation in Tier 1 is in drafting replies, and a person still approves each one.",
  },
  {
    q: "Do I need a new website?",
    a: "Probably not. We work with the site you have. If it's broken or doesn't work on a phone, we'll tell you, but a rebuild isn't part of any tier.",
  },
  {
    q: "What about ChatGPT and Google's AI answers?",
    // TODO(Blake): does "AEO" stay named? It appears here and nowhere else.
    a: "You'll sometimes hear this work called AEO. It sits on the same foundations as SEO: the same facts everywhere and plain answers to common questions. Nobody outside these companies sees exactly how they choose. We don't track AI answers yet, and we can't promise one will name you. On-site fixes that run through our tools may not reach those assistants at all unless they've been written into your site.",
  },
  {
    q: "Do you work for Google?",
    a: "No. Devize is an independent business, and we're not a Google Partner. Google doesn't charge for a Business Profile, so if someone calls saying your listing will be removed unless you pay, it isn't Google. Our fee is for the work.",
  },
];

const SOURCES: Source[] = [
  S.spam,
  S.contribution,
  S.ftc,
  { label: "Google: Guidelines for third parties managing Business Profiles", url: "https://support.google.com/business/answer/7353941" },
  { label: "Google Ads: Transparency requirements for third parties", url: "https://support.google.com/adspolicy/answer/16489093" },
  { label: "Google Ads policy: Third-party partners", url: "https://support.google.com/adspolicy/answer/6086450" },
];

const SITE_URL = "https://www.devize.ai";
const ORG_ID = `${SITE_URL}/#organization`;
const US = { "@type": "Country", name: "United States" };

function monthly(amount: number, currency: string) {
  return {
    "@type": "Offer",
    url: `${SITE_URL}/services`,
    price: String(amount),
    priceCurrency: currency,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(amount),
      priceCurrency: currency,
      unitCode: "MON",
      unitText: "month",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
  };
}

// Only what can be bought today. Nothing in pilot goes in structured data.
const SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: AUDIT_NAME,
    serviceType: "Local search audit",
    description:
      "We run the searches your customers run from dozens of spots around your business, show where you come up on Google's map and who comes up instead, check 21 things on your Google listing, reviews and website, and list the fixes we'd make first, in order.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    url: `${SITE_URL}/services#free-audit`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: TIERS[0].name,
    serviceType: "Local search engine optimization and review management",
    description:
      "On-site SEO fixes, blog posts checked by a person, Google post scheduling, review replies drafted and approved before posting, map tracking and a monthly note with counts. Month to month.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    url: `${SITE_URL}/services#tier-1`,
    offers: monthly(PRICE.amount, PRICE.currency),
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Google Ads Management",
    serviceType: "Search advertising management",
    description:
      "An add-on with counted monthly work, inside stated limits, in the client's own account. Ad spend is separate and paid to Google. Devize has not run a client's Google Ads before and is not a Google Partner.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    url: `${SITE_URL}/services#google-ads`,
    offers: monthly(GOOGLE_ADS.amount, GOOGLE_ADS.currency),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const dark = tier.status === "available";
  return (
    <li
      id={`card-${tier.id}`}
      className={cn(
        "flex flex-col rounded-3xl p-6 md:p-8",
        dark ? "bg-[var(--color-ink)] text-white" : "border-2 border-dashed border-[var(--color-brand)]/30 bg-white"
      )}
    >
      <p className={cn("text-xs uppercase tracking-[0.14em] font-medium", dark ? "text-white/70" : "text-[var(--color-ink-muted)]")}>Tier {tier.number}</p>
      <h3 className={cn("mt-3 font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] font-medium leading-tight tracking-tight", dark ? "text-white" : "text-[var(--color-ink)]")}>
        {tier.name}
      </h3>
      <p className={cn("mt-5 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight", dark ? "text-white" : "text-[var(--color-ink)]")}>{tier.price}</p>
      <p className={cn("mt-1 text-sm leading-relaxed", dark ? "text-white/75" : "text-[var(--color-ink-soft)]")}>{tier.priceNote}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tier.pills.map((pill) => (
          <StatusPill key={pill.label} status={pill.status} label={pill.label} onDark={dark} />
        ))}
      </div>

      <p className={cn("mt-6 text-sm font-medium", dark ? "text-white" : "text-[var(--color-ink)]")}>{tier.listLead}:</p>
      <ul className="mt-3 space-y-3">
        {tier.items.map((item) => (
          <li key={item.id} className="flex gap-2.5">
            {item.status === "available" ? (
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" className={cn("mt-[0.15em] shrink-0", dark ? "text-[#A98BF5]" : "text-[#1F7A45]")}>
                <path d="M3 8.5l3 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span aria-hidden="true" className="mt-[0.3em] inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-dashed border-[var(--color-brand)]/60" />
            )}
            <div className="min-w-0">
              <p className={cn("text-[0.95rem] leading-snug", dark ? "text-white" : "text-[var(--color-ink)]")}>{item.title}</p>
              {item.note && <p className="mt-1 text-sm leading-snug text-[#1F7A45]">{item.note}</p>}
              {!dark && item.status === "pilot" && <p className="mt-0.5 text-xs font-medium text-[var(--color-brand)]">In pilot, ask us</p>}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        {dark ? (
          <Button href="#free-audit" native size="lg" className="w-full">
            Start with the free audit
          </Button>
        ) : (
          <Button href={ASK_MAILTO} native size="lg" variant="secondary" className="w-full">
            Ask us
          </Button>
        )}
      </div>
    </li>
  );
}

export default function ServicesPage() {
  const tier1 = TIERS[0];
  const pilots = TIER_ITEMS.filter((i) => i.status === "pilot");

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Three tiers. Each one adds to the last."
        lead="The free audit comes first, and it costs nothing. Tier 1 is for sale today at one flat price. Most of Tiers 2 and 3 is still in pilot, and we mark it line by line."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#free-audit" native size="lg" className="w-full sm:w-auto">Start with the free audit</Button>
          <Button href="#tiers" native size="lg" variant="glass" className="w-full sm:w-auto">Compare the tiers</Button>
        </div>
      </PageHero>

      <Section id="free-audit">
        <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)] lg:gap-14">
          <div className="min-w-0">
            <Eyebrow>Step one, free</Eyebrow>
            <H2 className="mt-4">See your own map before you buy anything.</H2>
            <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              We run the searches your customers run and show you who comes up
              instead, with the fixes we&apos;d make first. No logins, nothing to sign,
              and you can stop there.
            </p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {COVERAGE.today} {COVERAGE.others}
            </p>
          </div>
          <div className="min-w-0 flex flex-col gap-3">
            <Button href="/#contact" size="lg" className="w-full">Get my free map audit</Button>
            <Button href="/sample-audit" size="lg" variant="secondary" className="w-full">See a sample audit</Button>
          </div>
        </div>

        <details className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white/60 p-5 md:p-6">
          <summary className="cursor-pointer font-medium text-[var(--color-ink)]">What&apos;s in the audit, counted, and what it can&apos;t see</summary>
          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
            <CountList className="min-w-0" items={AUDIT_COUNTS} />
            <div className="min-w-0">
              <p className="font-medium text-[var(--color-ink)]">What it can&apos;t see</p>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Anything behind a login: your calls, your clicks, your bookings, or the
                inside of a Google Ads account. Only you can see those.
              </p>
              {/* TODO(Blake): "says which spots and which day" must hold on every audit.
                  Mixed read dates are one of the four faults in the 2026-11-04 journal. */}
              <p className="mt-5 font-medium text-[var(--color-ink)]">How you can check it</p>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Your audit says how many spots we searched from, how far out they go and
                when the searches ran.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 border-t border-[var(--color-border)] pt-6 md:grid-cols-3">
            {AUDIT_CHECKS.map((c) => (
              <div key={c.group}>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">
                  {c.group} ({c.items.length})
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                  {c.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            A check is a thing we look at, not a promise that fixing it moves you on the
            map. Some only help a reader decide to call.
          </p>
        </details>
      </Section>

      <Section id="tiers" band>
        <div className="max-w-2xl">
          <Eyebrow>Step two, if you want it</Eyebrow>
          <H2 className="mt-4">The three tiers, side by side.</H2>
        </div>
        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-[var(--color-ink-soft)] leading-relaxed">{PILOT_NOTE}</p>
      </Section>

      <Section id="tier-1">
        <div className="max-w-2xl">
          <Eyebrow>Tier 1, line by line</Eyebrow>
          <H2 className="mt-4">What {PRICE.display} a month buys.</H2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <ul className="divide-y divide-[var(--color-border)]">
              {tier1.items.map((item) => (
                <li key={item.id} className="py-5 first:pt-0 last:pb-0">
                  <H3 className="md:text-xl leading-snug">{item.title}</H3>
                  <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6">
              <H3 className="md:text-xl">If you leave</H3>
              <p className="mt-3 text-[var(--color-ink)] leading-relaxed">{KEEP_PROMISE}</p>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                {PRICE.term} It ends with the month you&apos;ve paid for. The full wording is in the{" "}
                <Link href="/terms" className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">Service Terms</Link>.
              </p>
            </div>
            <FounderChip className="mt-6" />
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
              <H3 className="md:text-xl">Your part</H3>
              <DotList className="mt-4" items={TIER_1_YOUR_PART} />
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
              <H3 className="md:text-xl">What&apos;s left out</H3>
              <CrossList className="mt-4" items={TIER_1_LEFT_OUT} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="google-ads" band>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Tier 2&apos;s one available line</Eyebrow>
            <H2 className="mt-4">{GOOGLE_ADS.title}</H2>
            <p className="mt-5 text-xl font-medium text-[var(--color-ink)]">{GOOGLE_ADS.headline}</p>
            <p className="mt-1 text-[var(--color-ink-soft)]">{GOOGLE_ADS.spend} {PRICE.term}</p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{GOOGLE_ADS.fee}</p>
            <div className="mt-6 rounded-2xl border border-[#B3261E]/30 bg-[#B3261E]/[0.05] p-5">
              <p className="font-medium text-[var(--color-ink)]">No client campaign has been run yet.</p>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink)] leading-relaxed">{GOOGLE_ADS.disclosure}</p>
            </div>
            <p className="mt-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              Google publishes a guide for anyone hiring a third party to run their
              ads. Read it before you hire us, or anyone else:{" "}
              <a href={GOOGLE_ADS.guide.url} rel="noopener noreferrer" className={LINK}>{GOOGLE_ADS.guide.label}</a>.
            </p>
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
              <H3 className="md:text-xl">Every month after the first 30 days</H3>
              <CountList className="mt-5" items={ADS_MONTHLY} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                <H3 className="md:text-xl">The limits</H3>
                <DotList className="mt-4" items={[...GOOGLE_ADS.limits]} />
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                <H3 className="md:text-xl">Who owns what</H3>
                <DotList className="mt-4" items={ADS_OWNERSHIP} />
              </div>
            </div>
          </div>
        </div>

        <ol className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ADS_FIRST_30.map((step) => (
            <li key={step.when} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-brand)] font-medium">{step.when}</p>
              <p className="mt-2 font-medium text-[var(--color-ink)] leading-snug">{step.title}</p>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid gap-5 md:grid-cols-2 items-start">
          <details className="rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
            <summary className="cursor-pointer font-medium text-[var(--color-ink)]">What isn&apos;t promised</summary>
            <CrossList className="mt-4" items={ADS_NOT_PROMISED} />
          </details>
          <details className="rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
            <summary className="cursor-pointer font-medium text-[var(--color-ink)]">What&apos;s left out</summary>
            <CrossList className="mt-4" items={ADS_LEFT_OUT} />
          </details>
        </div>
      </Section>

      <Section id="pilots">
        <div className="max-w-2xl">
          <Eyebrow>Tiers 2 and 3</Eyebrow>
          <H2 className="mt-4">What each pilot does, and what it has to meet first.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            None of these is on a client today. Most of them send messages or take
            calls from real people, so the rules come first.
          </p>
        </div>
        <ul className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {pilots.map((item) => (
            <li key={item.id} className="border-t border-[var(--color-border)] pt-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <H3 className="md:text-xl leading-snug">{item.title}</H3>
                <StatusPill status="pilot" />
              </div>
              <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="open-to" band>
        <div className="max-w-2xl">
          <Eyebrow>By trade</Eyebrow>
          <H2 className="mt-4">The tiers aren&apos;t open to every trade yet.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            A voice agent answering a plumber&apos;s phone and one answering a
            clinic&apos;s phone face different rules. So each trade has its own answer.
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <div className="hidden grid-cols-[1fr_1.2fr_1.2fr_1.2fr] gap-5 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-ink-soft)] font-medium md:grid" aria-hidden="true">
            <span>Trade</span>
            <span>Tier 1</span>
            <span>Google Ads add-on</span>
            <span>The pilots in Tiers 2 and 3</span>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {INDUSTRIES.map((i) => {
              const a = TRADE_ACCESS[i.slug];
              const cells = [
                { label: "Tier 1", ...a.tier1 },
                { label: "Google Ads add-on", ...a.ads },
                { label: "The pilots in Tiers 2 and 3", ...a.pilots },
              ];
              return (
                <li key={i.slug} className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[1fr_1.2fr_1.2fr_1.2fr] md:gap-5">
                  <p className="font-medium text-[var(--color-ink)]">
                    <Link href={`/industries/${i.slug}`} className="underline underline-offset-4 decoration-[var(--color-ink)]/25 hover:decoration-[var(--color-ink)]">{i.name}</Link>
                  </p>
                  {cells.map((c) => (
                    <div key={c.label}>
                      <p className="mb-1.5 text-xs uppercase tracking-[0.1em] text-[var(--color-ink-muted)] font-medium md:sr-only">{c.label}</p>
                      <AccessPill state={c.state} />
                      <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-5 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
          Texting or AI-calling an old customer list waits in every trade until there&apos;s
          a consent record for each number. Other service businesses that sell to
          people can ask at {EMAIL}.
        </p>
      </Section>

      <Section id="questions" narrow>
        <Eyebrow>Questions</Eyebrow>
        <H2 className="mt-4 md:text-4xl">The ones this page hasn&apos;t answered.</H2>
        <div className="mt-8 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex items-center justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-[1.05rem] text-[var(--color-ink)] font-medium">{item.q}</span>
                <span aria-hidden="true" className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-[var(--color-border)] text-[var(--color-ink-soft)] transition-transform group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10">
          <Sources items={SOURCES} />
        </div>
      </Section>

      <CtaBand />
      <JsonLd data={SCHEMAS} />
    </>
  );
}
