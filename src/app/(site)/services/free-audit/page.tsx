import type { Metadata } from "next";
import Link from "next/link";
import { AuditForm } from "@/components/audit-form";
import { FounderChip } from "@/components/founder";
import { CountList, CrossList, Eyebrow, H2, H3, PageHero, Section } from "@/components/page-parts";
import { Button } from "@/components/ui/button";
import { AUDIT_CHECKS } from "@/lib/audit-checks";
import { AUDIT_NAME, COVERAGE } from "@/lib/offer-copy";

export const metadata: Metadata = {
  title: AUDIT_NAME,
  description:
    "See where you come up on Google's map and who comes up instead, with 21 checks and the fixes we'd make first. Free, no logins, nothing to sign.",
  alternates: { canonical: "/services/free-audit" },
};

const COUNTS = [
  {
    count: "2",
    title: "searches your customers really run",
    detail:
      "Like \"dentist\" and \"dentist near me\", or \"ac repair\" and \"hvac repair\". Each one is run on a phone, from dozens of spots around your business.",
  },
  {
    count: "3",
    title: "marks on every search",
    detail: "In the top three, fourth to twentieth, or nowhere in the first twenty.",
  },
  {
    count: "3",
    title: "businesses that came up most instead",
    detail: "Who they are, how they're rated, and how many searches they took.",
  },
  {
    count: "21",
    title: "checks on what Google and your customers can see",
    detail: "On your map results, your Google listing, your reviews and your website. All 21 are listed below.",
  },
  {
    count: "1",
    title: "list of fixes, in order",
    detail: "What we'd do first, and why. You can do them yourself, hire us, or do nothing.",
  },
];

export default function FreeAuditPage() {
  return (
    <>
      <PageHero
        eyebrow="Free, and the first step"
        title="Free Google Listing and Map Audit"
        lead="See who comes up when someone nearby searches for you, and what we'd fix first. No logins, and nothing to sign."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#request" size="lg" native className="w-full sm:w-auto">Get my free map audit</Button>
          <Button href="/sample-audit" size="lg" variant="glass" className="w-full sm:w-auto">See a sample audit</Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>What you get</Eyebrow>
            <H2 className="mt-4">What&apos;s in it, counted.</H2>
            <CountList className="mt-8" items={COUNTS} />
          </div>
          <div className="min-w-0 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
            <H3>Where it runs today</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink)] leading-relaxed">{COVERAGE.today}</p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{COVERAGE.others}</p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              The comparison needs enough searches for your trade and area to
              mean something, and we won&apos;t fake it.
            </p>
            {/* TODO(Blake): "says which spots and which day" must hold on every audit. Mixed read dates are one of the four faults in the 2026-11-04 journal. Fix it first. */}
            <H3 className="mt-7">Which spots, which day</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Your audit says how many spots we searched from, how far out they
              go, and when the searches ran, so you can check our work.
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>The method</Eyebrow>
          <H2 className="mt-4">All 21 checks.</H2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3 items-start">
          {AUDIT_CHECKS.map((c) => (
            <div key={c.group} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">
                {c.group} ({c.items.length})
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
          A check is a thing we look at, not a promise that fixing it moves you
          on the map. Some only help a reader decide to call.{" "}
          <Link href="/sample-audit" className="font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
            See how they read in a sample audit
          </Link>
        </p>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>What&apos;s left out</H3>
            <CrossList
              className="mt-5"
              items={[
                "Anything behind a login: your calls, your clicks and your bookings. Only you can see those.",
                "A look inside any Google Ads account.",
                "A rival comparison for trades and areas we haven't scanned.",
                "The written plan and the work. Those start only if you choose the monthly work.",
              ]}
            />
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>What isn&apos;t promised</H3>
            <CrossList
              className="mt-5"
              items={[
                "A rank or a date.",
                "That a later search shows the same thing. Results change by device, place and time.",
                "That every fix moves you on the map. Distance does a lot of the deciding, and nobody can move your building.",
              ]}
            />
          </div>
        </div>
      </Section>

      <section id="request" className="scroll-mt-20 mx-auto max-w-3xl px-6 pb-20 md:pb-28">
        <div className="text-center">
          <H2>See your own map first.</H2>
          <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
            Your business, your town and where to send it.
          </p>
        </div>
        <AuditForm slotId="audit-page-form" source="contact" className="mt-8" footer={<FounderChip />} />
      </section>
    </>
  );
}
