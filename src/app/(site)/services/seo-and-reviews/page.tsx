import type { Metadata } from "next";
import { CountList, CrossList, CtaBand, DotList, Eyebrow, H2, H3, PageHero, Section, Sources } from "@/components/page-parts";
import { LEFT_OUT, MONTHLY_WORK, PRICE, WONT_PROMISE } from "@/lib/offer-copy";

export const metadata: Metadata = {
  title: "SEO and Review Management",
  description:
    "$500 a month, flat: a review request routine, replies to new reviews, a listing and facts check, one better page, a map re-run and a one-page note with counts. Month to month.",
  alternates: { canonical: "/services/seo-and-reviews" },
};

const SOURCES = [
  { label: "Google: How to improve your local ranking", url: "https://support.google.com/business/answer/7091" },
  { label: "Google: Maps user contributed content policy (fake engagement)", url: "https://support.google.com/contributionpolicy/answer/7400114" },
  { label: "FTC: Consumer Reviews and Testimonials Rule, questions and answers", url: "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers" },
];

export default function SeoAndReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="The monthly work"
        title="SEO and Review Management"
        lead="The work that helps people find you and choose you: reviews asked for and answered, facts kept right, one better page, and a one-page note with counts."
      >
        <p className="text-lg text-white">
          <strong className="font-semibold">{PRICE.headline}</strong> {PRICE.term}
        </p>
        <p className="mt-1 text-white/80">{PRICE.scope}</p>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>What you get</Eyebrow>
            <H2 className="mt-4">Every month, counted.</H2>
            <CountList
              className="mt-8"
              items={MONTHLY_WORK.map((w) => ({ count: w.count, title: w.title, detail: w.detail, tag: w.purpose }))}
            />
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6">
              <H3>Why each item has a tag</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Google says more reviews and positive ratings can help your local
                ranking, so the review routine comes first. Most of the rest helps
                people choose you once they&apos;ve found you, or protects you. A
                lot of this work gets sold as ranking work. We don&apos;t sell it
                that way.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <H3>Done by hand, for now</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                There&apos;s no dashboard to log into. The map re-run and the note
                are done by hand, and they come to you by email. No software to
                learn.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <H3>If you run a health practice</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Review replies never confirm someone is a patient. Review requests
                wait until a privacy contract is in place and your lawyer has
                answered. We can flag these things. We can&apos;t advise you on them.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>What&apos;s left out</H3>
            <CrossList className="mt-5" items={LEFT_OUT} />
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>What isn&apos;t promised</H3>
            <CrossList className="mt-5" items={WONT_PROMISE.map((w) => `${w.title}. ${w.detail}`)} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <Eyebrow>Your part</Eyebrow>
            <H2 className="mt-4 md:text-4xl">We do the work. We&apos;ll need a few things.</H2>
            <DotList
              className="mt-6"
              items={[
                "Add us as a manager on your Google listing. You stay the owner, and you can remove us any time.",
                "Give us a login to your site, or tell us who runs it.",
                "Accurate facts about your business, and photos of your work where you can.",
                "One sign-off at the start, on how we reply to reviews in your name.",
                "Your own numbers, if you'll share them: calls, bookings and Google's report. No outside scan can see those.",
              ]}
            />
          </div>
          <div>
            <Eyebrow>When you leave</Eyebrow>
            <H2 className="mt-4 md:text-4xl">Month to month, and yours to keep.</H2>
            <p className="mt-6 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{PRICE.keep}</p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Tell us by email. It ends with the month you&apos;ve paid for, and we
              hand over every page and file before we remove our access.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <Sources items={SOURCES} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
