import type { Metadata } from "next";
import Link from "next/link";
import { Flywheel } from "@/components/flywheel";
import { CtaBand, Eyebrow, H2, H3, PageHero, Section, Sources, citer, type Source } from "@/components/page-parts";
import { StatusPill } from "@/components/tier-parts";
import { S } from "@/lib/industries";
import { BOOKING_OS, LABEL, MISSION, MISSION_NOTE, NOT_GOOGLE, NOT_INVESTOR, PARTNER_MEANS } from "@/lib/offer-copy";
import { FLYWHEEL, PILOT_NOTE } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "What We Do and How It Works",
  description: `We manage your ad spend and SEO, organic and paid bring the clicks, and ${BOOKING_OS}, in pilot, is meant to help convert and retain them without more labor hours. What's running today, and what isn't yet.`,
  alternates: { canonical: "/what-we-do" },
};

const HART_URL = "https://doi.org/10.1287/mnsc.2024.06185";

// In the order the page first cites them. The speed figure prints its source right
// beside it instead.
const SOURCES: Source[] = [S.ranking];
const cite = citer(SOURCES);

// In the same order as FLYWHEEL, whose stages supply each status pill. These words
// stay manual: when a line goes live, its "would" goes too.
const STAGES: { title: string; body: React.ReactNode }[] = [
  {
    title: "Clicks",
    body: (
      <>
        Organic search brings people who were already looking. Paid ads put you
        in front of them where organic can&apos;t reach yet. We manage both and
        look at where they overlap, so you can see what you&apos;re paying for.
      </>
    ),
  },
  {
    title: `${BOOKING_OS} would take it in`,
    body: "A form, a call, a missed call or a message would land in one place, and the right person would be told right away. Each lead would be on the list, including the ones nobody answered.",
  },
  {
    title: "Converted",
    body: "The lead would get an answer and a time on your calendar: speed to lead, missed-call text-back, online booking. Overflow and after-hours calls would go to a voice agent that says it's an AI.",
  },
  {
    title: "Retained",
    body: "Would send reminders so people show up, a follow-up on the estimate that went quiet, and a reason for last year's customer to come back, only where the consent is on record.",
  },
  {
    title: "Reviews and repeat business",
    body: (
      <>
        Google says reviews and ratings can help local ranking,{cite(S.ranking)}{" "}and
        someone choosing between two listings reads them either way. Repeat
        customers don&apos;t need finding twice. That&apos;s where the loop closes.
      </>
    ),
  },
];

const LINK = "text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]";

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do and how it works"
        title={`We run your SEO and ads. ${BOOKING_OS}, in pilot, aims to turn those clicks into clients.`}
        lead={`Organic search and paid ads bring the clicks. ${BOOKING_OS} is meant to take in each lead and help you convert and retain customers without more labor hours.`}
      >
        <p className="text-white/80 leading-relaxed">
          <span className="font-medium text-white">{MISSION}</span> {MISSION_NOTE}
        </p>
      </PageHero>

      <Section id="flywheel">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-24">
            <Eyebrow>The flywheel</Eyebrow>
            <H2 className="mt-4">How the five stages connect.</H2>
            <Flywheel className="mt-8" />
          </div>
          <ol className="min-w-0 divide-y divide-[var(--color-border)]">
            {STAGES.map((stage, i) => (
              <li key={stage.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 py-6 first:pt-0 last:pb-0">
                <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium leading-tight tracking-tight">{i + 1}</span>
                <div>
                  <H3 className="md:text-[1.375rem] leading-snug">{stage.title}</H3>
                  <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">{stage.body}</p>
                  <p className="mt-3">
                    <StatusPill status={FLYWHEEL[i].pill.status} label={FLYWHEEL[i].pill.label} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="manage" band>
        <div className="max-w-2xl">
          <Eyebrow>The clicks</Eyebrow>
          <H2 className="mt-4">What &ldquo;manage&rdquo; means for each.</H2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>Your SEO</H3>
            <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
              We fix what&apos;s wrong on your site, keep posts going out that a
              person has read, answer your reviews and watch your map. Then we
              count it, so you can see what got done. We can&apos;t buy you
              a spot. How close you are to the person searching does a lot of the
              deciding, and nobody can move your building.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>Your ad spend</H3>
            <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
              The money is yours and goes straight to Google. We work out with you
              where it should go, block the searches that waste it and write the
              copy. Your ceiling stays put unless you change it in writing. Devize
              hasn&apos;t run a client&apos;s campaign before, and we say so before
              you buy.
            </p>
          </div>
        </div>
      </Section>

      <Section id="bookingos">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 items-start">
          <div className="min-w-0">
            <Eyebrow>The conversion</Eyebrow>
            <H2 className="mt-4">Where the labor hours go.</H2>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Plenty of lost leads are nobody&apos;s fault. The phone was busy. The
              estimate went out and nobody circled back. A customer from two years
              ago never heard from you again. Each one takes a person&apos;s time to
              fix, which is exactly why it doesn&apos;t get done.
            </p>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              {BOOKING_OS}{" "}is meant to take the repetitive part: taking in the lead, holding
              the reminder, flagging the follow-up. Your people keep the judgment
              and the conversation. The aim is more leads handled in the same hours.
              We can&apos;t show you that result yet, because no client is on it.
            </p>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              It&apos;s our name for a lead system we&apos;d set up on established software,
              around each business: your hours, your calendar, your wording, the
              rules of your trade.
            </p>
          </div>
          {/* TODO(Blake): your call whether this prints. It is the one allowed speed
              figure, word for word, and truth.md records speed-to-lead as held back
              from public copy until now. evidence.py's register would need the new
              wording too. Never move it next to an automated reply: the same study
              says the benefit fades when a reply looks automated. */}
          <aside className="min-w-0 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
            <H3 className="md:text-xl leading-snug">On speed, the evidence is narrower than you&apos;ve been told.</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              We found no published study of this for local service trades. The
              closest large one comes from freelance hiring.
            </p>
            <p className="mt-3 text-[var(--color-ink)] leading-relaxed">
              On Fiverr, a one-hour delay in replying was linked to a 46% lower
              likelihood of being hired, and a full-day delay to about 90% lower.
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              Source:{" "}
              <a href={HART_URL} rel="noopener noreferrer" className="underline underline-offset-2 decoration-[var(--color-ink)]/25 hover:decoration-[var(--color-ink)]">
                Hart, VanEpps, Sezer and Amir, &ldquo;Speed Is a Signal,&rdquo; Management Science, 2026
              </a>
              .
            </p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              That study also says the benefit fades when a reply looks automated.
              So we read it as a reason to get a real person onto a lead quickly, in
              your words. It&apos;s no case for instant robot replies.
            </p>
          </aside>
        </div>
      </Section>

      <Section id="today" band>
        <div className="max-w-2xl">
          <Eyebrow>Today</Eyebrow>
          <H2 className="mt-4">What&apos;s running today, and what&apos;s in pilot.</H2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3 items-start">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3 className="md:text-xl">Running today</H3>
            <p className="mt-3 text-[0.95rem] font-medium text-[var(--color-ink)]">The free map audit.</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Dental and HVAC get a comparison with rivals today, in the areas
              we&apos;ve scanned.{" "}
              <Link href="/services#free-audit" className={LINK}>Services has the detail</Link>.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3 className="md:text-xl">Available now</H3>
            <p className="mt-3 text-[0.95rem] font-medium text-[var(--color-ink)]">
              SEO and review work, and Google Ads as an add-on.{" "}
              <Link href="/services" className={LINK}>Every line is on Services</Link>.
            </p>
            {/* TODO(Blake): "You can buy these today" is only true once paymentPathReady
                is true in src/lib/launch-gate.json. No order form or way to pay exists yet. */}
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              You can buy these today. Devize is new, so no client has been through
              them yet. Map tracking and the monthly note are done by hand for now.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-dashed border-[var(--color-brand)]/30 bg-white p-6 md:p-7">
            <H3 className="md:text-xl">In pilot</H3>
            <p className="mt-3 text-[0.95rem] font-medium text-[var(--color-ink)]">
              <Link href="/services#tiers" className={LINK}>Everything else in Tiers 2 and 3</Link>.
            </p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {PILOT_NOTE} Some trades have to wait,{" "}
              <Link href="/services#open-to" className={LINK}>
                and we list which
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section id="partner">
        <div className="max-w-2xl">
          <Eyebrow>Partner</Eyebrow>
          <H2 className="mt-4">What &ldquo;partner&rdquo; means here.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            We call Devize a {LABEL}. Plenty of firms use the word, so this is all
            we mean by it. It&apos;s how we work, and it says nothing about who
            we&apos;ve worked with.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PARTNER_MEANS.map((item) => (
            <li key={item.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <span className="brand-dot" aria-hidden="true" />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] font-medium tracking-tight leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-4 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:grid-cols-2 md:p-7">
          <p className="text-[var(--color-ink)] leading-relaxed">{NOT_INVESTOR}</p>
          <p className="text-[var(--color-ink)] leading-relaxed">{NOT_GOOGLE}</p>
        </div>
      </Section>

      {/* The first 30 days and the search figures came off this page. Both wait on Blake
          (TODOs in src/lib/offer-copy.ts). */}
      <Section id="limits" band narrow>
        <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-snug tracking-tight text-[var(--color-ink)] font-medium">
          We promise the work. No rank, no date, no lead count, no long contract.
        </p>
        <div className="mt-10">
          <Sources items={SOURCES} legalNote />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
