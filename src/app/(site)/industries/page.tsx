import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, Eyebrow, H2, PageHero, Section } from "@/components/page-parts";
import { COVERAGE, EMAIL } from "@/lib/offer-copy";
import { INDUSTRIES } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Devize is for service businesses that sell to people: HVAC, dental clinics, law firms, walk-in clinics, veterinary clinics, plumbing and others. A page for each, and no client stories yet.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries we serve"
        title="Service businesses that people search for nearby."
        lead="If someone searches for what you do before they call, this is for you. Each trade below has its own page, because each one has its own searches, its own reviews and its own rules."
      />

      <Section>
        <div className="grid gap-5 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="font-medium text-[var(--color-ink)]">Where the audit stands</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {COVERAGE.today} {COVERAGE.others}
            </p>
          </div>
          <div>
            <p className="font-medium text-[var(--color-ink)]">What we don&apos;t have yet</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Client stories, in any of these trades. Devize is new. These pages
              say what we&apos;d look at and what limits apply. They don&apos;t
              claim experience, specialist knowledge or results.
            </p>
          </div>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug} className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
                <Link href={`/industries/${industry.slug}`} className="hover:underline underline-offset-4">
                  {industry.name}
                </Link>
              </h2>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{industry.urgent.intro}</p>
              <p className="mt-4 inline-flex self-start items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-0.5 text-xs text-[var(--color-ink-soft)]">
                {industry.compared ? "Rival comparison runs today" : "Rival comparison waits for data"}
              </p>
              <p className="mt-auto pt-5">
                <Link href={`/industries/${industry.slug}`} className="text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
                  Read the page
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section band narrow className="text-center">
        <Eyebrow>Not on the list?</Eyebrow>
        <H2 className="mt-4 md:text-4xl">Other service businesses that sell to people are welcome.</H2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          Email{" "}
          <a href={`mailto:${EMAIL}`} className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">
            {EMAIL}
          </a>{" "}
          and tell us what you do. We&apos;ll tell you plainly what we can and
          can&apos;t show you today.
        </p>
      </Section>

      <div className="pt-16 md:pt-24">
        <CtaBand />
      </div>
    </>
  );
}
