import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero, Section } from "@/components/page-parts";
import { COVERAGE, EMAIL } from "@/lib/offer-copy";
import { INDUSTRIES } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "HVAC, dental clinics, law firms, walk-in clinics, veterinary clinics and plumbing companies. A page for each, with what its customers search, what a missed call costs and what we can sell it today.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Six trades, six different problems."
        lead="If people search for what you do before they call, Devize is built for you. Devize is new, so these pages say what we'd look at and what the rules allow. They aren't a claim that we've done it for anyone."
      />

      <Section>
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug} className="group relative grid gap-2 py-6 md:grid-cols-[14rem_minmax(0,1fr)_auto] md:items-baseline md:gap-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
                <Link href={`/industries/${industry.slug}`} className="after:absolute after:inset-0 group-hover:underline underline-offset-4">
                  {industry.name}
                </Link>
              </h2>
              <p className="text-lg text-[var(--color-ink-soft)] leading-snug">{industry.hook}</p>
              <p className="text-sm text-[var(--color-ink-muted)]">
                {industry.compared ? "Rival comparison runs today" : "Rival comparison waits for data"}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            {COVERAGE.today} {COVERAGE.others}
          </p>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Not on the list? Other service businesses that sell to people are welcome.
            Email{" "}
            <a href={`mailto:${EMAIL}`} className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">
              {EMAIL}
            </a>{" "}
            and tell us what you do. We&apos;ll tell you what we can and can&apos;t show you today.
          </p>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
