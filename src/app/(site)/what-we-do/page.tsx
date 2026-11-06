import type { Metadata } from "next";
import Link from "next/link";
import { Flywheel } from "@/components/flywheel";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, Findings, GetInTouch, H2, H3, PageHero, Section, Sources, citer, type Source } from "@/components/page-parts";
import { cn } from "@/lib/cn";
import { INDUSTRIES, S } from "@/lib/industries";
import { SEO_REVIEWS } from "@/lib/menu";
import {
  EMAIL,
  HOW_WE_DO_IT,
  HOW_WE_DO_IT_HEADING,
  MEASURED_FINDINGS,
  MEASURED_FINDINGS_NOTE,
  WHAT_WE_DO_HEADER,
} from "@/lib/offer-copy";
import { SERVICE_PAGES, STAGES } from "@/lib/services";

export const metadata: Metadata = {
  title: "What We Do and How It Works",
  description: "We help local service-based businesses turn clicks into clients. We look at your market, tell you what to do first and what to skip, then run it with you.",
  alternates: { canonical: "/what-we-do" },
};

const GBP_THIRD_PARTY: Source = { label: "Google: Guidelines for third parties managing Business Profiles", url: "https://support.google.com/business/answer/7353941" };

// In the order the page first cites them. Google's guide tells owners to look for
// citations to its documentation, so the list stays. The two Google Ads rules behind the
// footer's fine print and Terms (support.google.com/adspolicy/answer/16489093 and 6086450)
// are off this list because nothing on this page cites them. S.seoGuide ("Do you need an SEO?") is off
// this page on purpose (v4 review, 5 Nov). If an owner asks about track record, the
// person answers straight: copy-research/copy_evidence.md, rule 12.
const SOURCES: Source[] = [
  S.contribution,
  S.ftc,
  GBP_THIRD_PARTY,
];
const cite = citer(SOURCES);

/** Moved here from /services on 5 Nov 2026. DRAFT: for Blake to confirm. It feeds both the list and the FAQPage JSON-LD. */
const QUESTIONS: { q: string; a: string; sources?: Source[] }[] = [
  {
    q: "What happens if I cancel?",
    a: `${SEO_REVIEWS.term} Tell us by email, and the service ends with the month you've paid for. We hand over every page and file before we remove our access. The full wording is in the Service Terms.`,
  },
  {
    q: "Do you write or buy reviews?",
    a: "No. Fake reviews, paid reviews and asking only happy customers all break Google's rules, and the FTC bans fake reviews. We ask every customer the same way, and a person reads every reply we write to a review.",
    sources: [S.contribution, S.ftc],
  },
  {
    q: "Do I need a new website?",
    a: "Probably not. If your site is broken or doesn't work on a phone, we'll say so, and a rebuild goes in your plan.",
  },
  {
    q: "What about ChatGPT and Google's AI answers?",
    // Claim bank C16, one run per engine, one neighborhood. Never say an AI will name a client.
    a: "Answer engine optimization starts from the same work as SEO: the same facts everywhere and plain answers to common questions. In one dental neighborhood in November 2026, we ran each AI engine once, and 9 of the 12 top listings on the map weren't recommended in any of 16 AI answers, so doing well on the map doesn't always carry over.",
  },
  {
    q: "Do you work for Google?",
    a: "No. Devize is independent. Google Business Profile is free, and our fee is for the work we do on it.",
    sources: [GBP_THIRD_PARTY],
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const HOW_WE_WORK: { title: string; body: string }[] = [
  {
    title: "We look at your market.",
    body: "We go through your map results, reviews and website, and we see who comes up instead of you.",
  },
  {
    title: "We build the plan.",
    body: "What to do first, what can wait, and what you can skip.",
  },
  {
    title: "We run it with you.",
    body: "We do what the plan calls for, and you get a report of the work every month.",
  },
  {
    title: "We change it as your market moves.",
    body: "We go back over the plan as the numbers come in.",
  },
];

/** Links from the old /services page keep landing somewhere sensible. A server redirect can't see a #fragment, and the browser carries it across. */
function OldAnchor({ id }: { id: string }) {
  return <span id={id} aria-hidden="true" className="block scroll-mt-24" />;
}

/**
 * Blake, 2026-11-05: his header, nothing under it, then his three sections word for word.
 * The words live in src/lib/offer-copy.ts, with what has to be true before launch beside
 * them. The steps start right under the header because the space under a lone headline
 * needs something close below it. Then how we work, what can be part of a plan and the
 * questions owners ask, all moved here when /services went (Blake, 5 Nov: "WE are strategic
 * marketing partners not order and go marketers"). No price prints here or on the seven
 * pages. src/lib/menu.ts is the private list. Then what we've measured and the small close.
 */
export default function WhatWeDoPage() {
  return (
    <>
      <PageHero title={WHAT_WE_DO_HEADER} />

      <Section id="how-we-do-it">
        <H2>{HOW_WE_DO_IT_HEADING}</H2>
        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <ol className="min-w-0 divide-y divide-[var(--color-border)]">
            {HOW_WE_DO_IT.map((stage, i) => (
              <li key={stage.title} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 py-8 first:pt-0 last:pb-0 md:grid-cols-[3.5rem_minmax(0,1fr)] md:items-start">
                <span className="brand-text-gradient font-[family-name:var(--font-display)] text-[2.5rem] leading-none md:row-span-2 md:text-[3rem]">{i + 1}</span>
                <H3 className="md:text-[2rem]">{stage.title}</H3>
                <p className="col-span-2 mt-3 text-lg leading-relaxed text-[var(--color-ink-soft)] md:col-span-1 md:col-start-2">{stage.body}</p>
              </li>
            ))}
          </ol>
          <div className="min-w-0 lg:sticky lg:top-28">
            <Flywheel />
          </div>
        </div>
      </Section>

      <Section id="how-we-work" tint>
        <div className="max-w-3xl">
          <Eyebrow>How we work with you</Eyebrow>
          <H2 className="mt-3">We tell you what to do first and what to skip.</H2>
        </div>
        <ol className="mt-12 grid grid-cols-1 gap-y-9 md:grid-cols-2 md:gap-x-10 xl:grid-cols-4 xl:gap-x-0">
          {HOW_WE_WORK.map((step, i) => (
            <li key={step.title} className={cn("min-w-0 xl:px-7", i === 0 ? "xl:pl-0" : "xl:border-l xl:border-[var(--color-border)]", i === HOW_WE_WORK.length - 1 && "xl:pr-0")}>
              <span className="brand-text-gradient block font-[family-name:var(--font-display)] text-[3rem] leading-none">{i + 1}</span>
              <h3 className="mt-3 text-[1.25rem] font-extrabold leading-snug tracking-[-0.025em] text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="your-plan">
        <OldAnchor id="menu" />
        <OldAnchor id="tiers" />
        <OldAnchor id="tier-1" />
        <OldAnchor id="ads" />
        <OldAnchor id="google-ads" />
        <OldAnchor id="add-ons" />
        <H2>What can be part of your plan.</H2>
        <div className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-3">
          {STAGES.map((stage, i) => (
            <div key={stage} className={cn("min-w-0 md:px-8", i === 0 ? "md:pl-0" : "md:border-l md:border-[var(--color-border)]", i === STAGES.length - 1 && "md:pr-0")}>
              <H3>{stage}</H3>
              <ul className="mt-5 space-y-3">
                {SERVICE_PAGES.filter((page) => page.stage === stage).map((page) => (
                  <li key={page.slug} id={page.anchor} className="scroll-mt-24">
                    <Link href={`/services/${page.slug}`} className="font-bold leading-snug text-[var(--color-brand)] underline decoration-[var(--color-brand)]/30 underline-offset-4 hover:decoration-[var(--color-brand)]">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="questions" narrow className="pt-0 md:pt-0">
        <OldAnchor id="open-to" />
        <OldAnchor id="if-you-leave" />
        <H2>Questions you&apos;ll probably have.</H2>
        <div className="mt-9 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <span className="text-[1.125rem] font-bold leading-snug text-[var(--color-ink)]">{item.q}</span>
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-brand)] text-[var(--color-brand)] transition-transform group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-[var(--color-ink-soft)]">
                {item.a}
                {item.sources && cite(...item.sources)}
              </p>
            </details>
          ))}
        </div>
        <p className="mt-8 leading-relaxed text-[var(--color-ink-soft)]">
          Your business has its own rules:{" "}
          {INDUSTRIES.map((i, n) => (
            <span key={i.slug}>
              <Link href={`/industries/${i.slug}`} className="underline decoration-[var(--color-ink)]/25 underline-offset-4 hover:decoration-[var(--color-ink)]">{i.name}</Link>
              {n < INDUSTRIES.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          If yours isn&apos;t listed, email{" "}
          <a href={`mailto:${EMAIL}`} className="underline decoration-[var(--color-ink)]/25 underline-offset-4 hover:decoration-[var(--color-ink)]">{EMAIL}</a>.
        </p>
        <div className="mt-10">
          <Sources items={SOURCES} read="4 and 5 November 2026" />
        </div>
      </Section>

      <Section id="measured" band>
        <Findings
          eyebrow="What we've measured"
          title="We've run 7,822 local map searches, so our advice starts with numbers."
          items={MEASURED_FINDINGS}
          basis={MEASURED_FINDINGS_NOTE}
        />
      </Section>

      {/* The free audit had a block on /services until 5 Nov. Old links to it land on the strip. */}
      <OldAnchor id="free-audit" />
      <GetInTouch className="pt-14 md:pt-20" />

      <JsonLd data={FAQ_SCHEMA} />
    </>
  );
}
