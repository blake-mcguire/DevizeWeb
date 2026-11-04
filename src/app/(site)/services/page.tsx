import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, Eyebrow, H2, PageHero, PartnerLabel, Section } from "@/components/page-parts";
import { MissionGroups } from "@/components/sections/mission";
import { MISSION, MISSION_NOTE, SERVICES } from "@/lib/offer-copy";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Three services, with what's in each, what's left out and what isn't promised: a free Google listing and map audit, SEO and review management at $500 a month, and Google Ads as a $150 add-on.",
  alternates: { canonical: "/services" },
};

// TODO(Blake): After-Hours Scheduling (voice) gets a card and its own page here
// once you confirm the product is ready. Until then it stays off the site.
export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Get the click. Turn it into a client. Without adding headcount."
      >
        <PartnerLabel />
      </PageHero>

      <Section>
        <div className="max-w-4xl">
          <Eyebrow>Why Devize exists</Eyebrow>
          <p className="mt-4 font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-snug tracking-tight text-[var(--color-ink)] font-medium">
            {MISSION}
          </p>
          <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">{MISSION_NOTE}</p>
        </div>
        <MissionGroups className="mt-10" />
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>What you can buy</Eyebrow>
          <H2 className="mt-4">Three services. Each one says what&apos;s in it.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Each page lists what you get, in counts, what&apos;s left out and
            what isn&apos;t promised. If something isn&apos;t listed, we don&apos;t
            sell it today.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.href} className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">{s.group}</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight leading-snug">
                <Link href={s.href} className="hover:underline underline-offset-4">{s.title}</Link>
              </h3>
              <p className="mt-2 font-medium text-[var(--color-ink)]">{s.price}</p>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{s.summary}</p>
              <p className="mt-auto pt-5">
                <Link href={s.href} className="text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
                  What&apos;s in it
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="pt-16 md:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
