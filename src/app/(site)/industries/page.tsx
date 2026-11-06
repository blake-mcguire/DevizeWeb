import type { Metadata } from "next";
import { ArrowLink, GetInTouch, H2, PageHero, Section } from "@/components/page-parts";
import { TradeIcon } from "@/components/trade-icon";
import { INDUSTRIES } from "@/lib/industries";
import { EMAIL } from "@/lib/offer-copy";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "HVAC, dental clinics, law firms, walk-in clinics, veterinary clinics and plumbing companies. A page for each, with what its customers search, what a missed call costs and the rules its ads and replies have to follow.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Every business here has its own customers and its own rules."
        subhead="If people search for what you do before they call, Devize is built for you."
        lead="Each page covers how your customers search, what a missed call costs, and the rules your ads and replies have to follow."
      />

      <div className="pt-14 md:pt-20">
        <Section band>
          <H2 className="sr-only">The six kinds of business</H2>
          <ul className="grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
            {INDUSTRIES.map((industry, i) => (
              <li key={industry.slug} className={`flex min-w-0 flex-col lg:px-9 ${i % 3 === 0 ? "lg:pl-0" : "lg:border-l lg:border-[var(--color-border)]"}`}>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-[var(--color-lilac)]">
                  <TradeIcon slug={industry.slug} className="h-7 w-7" />
                </span>
                <h2 className="mt-5 font-[family-name:var(--font-display)] text-[1.75rem] leading-[1.12] text-white">{industry.name}</h2>
                <p className="mt-3 text-[1.1875rem] font-bold leading-snug text-[var(--color-lilac)]">{industry.hook}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/85">{industry.line}</p>
                <div className="mt-auto pt-6">
                  <ArrowLink href={`/industries/${industry.slug}`} tone="light" ariaLabel={`Read the ${industry.name} page`}>
                    Read the page
                  </ArrowLink>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Full width with a capped line, so the paragraph starts on the same left edge as the strip under it. */}
      <Section className="py-12 md:py-16">
        <p className="max-w-3xl leading-relaxed text-[var(--color-ink-soft)]">
          If you run another service business that serves the public, email{" "}
          <a href={`mailto:${EMAIL}`} className="font-bold text-[var(--color-brand)] underline decoration-[var(--color-brand)]/30 underline-offset-4 hover:decoration-[var(--color-brand)]">
            {EMAIL}
          </a>{" "}
          and tell us what you do, and we&apos;ll tell you what we look at first.
        </p>
      </Section>

      <GetInTouch />
    </>
  );
}
