import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/hero";
import Contact from "@/components/sections/contact";
import { Flywheel } from "@/components/flywheel";
import { IndustryCarousel } from "@/components/industry-carousel";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, H2, Section } from "@/components/page-parts";
import { StatusPill } from "@/components/tier-parts";
import { cn } from "@/lib/cn";
import { INDUSTRIES } from "@/lib/industries";
import { BOOKING_OS, EMAIL, FOUNDER, LABEL, MISSION } from "@/lib/offer-copy";
import { TIERS } from "@/lib/tiers";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SITE_URL = "https://www.devize.ai";
const ORG_ID = `${SITE_URL}/#organization`;

// The brand's facts live on the home page so the prospect pages under /a/ carry
// none of the marketing structured data. No review, rating, client count or
// award field: Devize has none.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Devize",
  url: SITE_URL,
  logo: `${SITE_URL}/devize-logo.svg`,
  description: `Devize is a ${LABEL} for service businesses that sell to people. ${MISSION}`,
  email: EMAIL,
  // TODO(Blake): no street or zip until you confirm the address should be public
  // (see the note in site-footer.tsx).
  address: {
    "@type": "PostalAddress",
    addressLocality: "Willis",
    addressRegion: "TX",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: EMAIL,
    availableLanguage: "English",
  },
  areaServed: { "@type": "Country", name: "United States" },
  founder: { "@type": "Person", name: FOUNDER.name },
  knowsAbout: ["Local search engine optimization", "Google Business Profile", "Online reviews"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Devize",
  url: SITE_URL,
  publisher: { "@id": ORG_ID },
};

const CARDS = INDUSTRIES.map((i) => ({
  href: `/industries/${i.slug}`,
  name: i.name,
  hook: i.hook,
  search: i.search,
}));

/**
 * Short on purpose (Blake, 2026-11-04: "Very repetive pages"). Hero, the loop, the
 * tiers, the trades, who's behind it. Everything longer has one home elsewhere:
 * the explanation on /what-we-do, the tier contents on /services, the trades on
 * their own pages. No section here repeats another page, and there's no proof
 * section, because Devize has no clients to prove anything with.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <Section id="how-it-works">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>How it works</Eyebrow>
            <H2 className="mt-4">One loop, and each turn feeds the next.</H2>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Search and ads bring people to you. {BOOKING_OS}, still in pilot, is
              there to catch each one, so a click has a better shot at becoming a
              client and a client has a reason to come back. Their reviews and
              repeat visits bring in the next round of clicks.
            </p>
            <p className="mt-6">
              <Link
                href="/what-we-do"
                className="font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]"
              >
                What we do, and what&apos;s running today
              </Link>
            </p>
          </div>
          <Flywheel className="min-w-0" />
        </div>
      </Section>

      <Section id="tiers" band>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>Services</Eyebrow>
            <H2 className="mt-4">Three tiers, after one free audit.</H2>
          </div>
          <Link
            href="/services"
            className="font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]"
          >
            Compare them side by side
          </Link>
        </div>
        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <li
              key={tier.id}
              className={cn(
                "flex flex-col rounded-2xl p-6 md:p-7",
                tier.status === "available"
                  ? "bg-[var(--color-ink)] text-white"
                  : "border-2 border-dashed border-[var(--color-brand)]/30 bg-white"
              )}
            >
              <p className={cn("text-xs uppercase tracking-[0.14em] font-medium", tier.status === "available" ? "text-white/70" : "text-[var(--color-ink-muted)]")}>
                Tier {tier.number}
              </p>
              <h3 className={cn("mt-3 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight leading-snug", tier.status === "available" ? "text-white" : "text-[var(--color-ink)]")}>
                {tier.name}
              </h3>
              <p className={cn("mt-3 text-[0.95rem] leading-relaxed", tier.status === "available" ? "text-white/80" : "text-[var(--color-ink-soft)]")}>
                {tier.brief}
              </p>
              <div className="mt-auto pt-6">
                <p className={cn("font-[family-name:var(--font-display)] text-xl font-medium tracking-tight", tier.status === "available" ? "text-white" : "text-[var(--color-ink)]")}>
                  {tier.price}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tier.pills.map((pill) => (
                    <StatusPill key={pill.label} status={pill.status} label={pill.label} onDark={tier.status === "available"} />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="industries">
        <div className="max-w-2xl">
          <Eyebrow>Industries</Eyebrow>
          <H2 className="mt-4">Every trade loses a call in its own way.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Pick yours. Each page covers how its customers search, what a missed
            call costs, and what the rules let us sell you.
          </p>
        </div>
        <div className="mt-10">
          <IndustryCarousel cards={CARDS} />
        </div>
      </Section>

      <div className="border-t border-[var(--color-border)] bg-white/60">
        <Contact />
      </div>

      <JsonLd data={[organizationSchema, websiteSchema]} />
    </>
  );
}
