import type { Metadata } from "next";
import { AuditRequest } from "@/components/audit-request";
import { Flywheel } from "@/components/flywheel";
import { IndustryCarousel } from "@/components/industry-carousel";
import { JsonLd } from "@/components/json-ld";
import { ArrowLink, Container, Eyebrow, GET_IN_TOUCH, H2, NumberBand, Section } from "@/components/page-parts";
import { Proof } from "@/components/proof";
import Hero from "@/components/sections/hero";
import { INDUSTRIES } from "@/lib/industries";
import { COVERAGE_LINE, EMAIL, FOUNDER, LABEL, MEASURED_BASIS, MEASURED_COUNTS } from "@/lib/offer-copy";

export const metadata: Metadata = {
  description:
    "Devize helps local service-based businesses turn clicks into clients. We look at your market, tell you what to do first and what to skip, then run it with you.",
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
  description: `Devize is a ${LABEL} for local service-based businesses. We help them turn clicks into clients.`,
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
  slug: i.slug,
  name: i.name,
  hook: i.hook,
  line: i.line,
}));

// Blake's three stages, cut down for the home page. His own words print in full on
// /what-we-do and stay there. This summary doesn't name BookingOS or say a system exists:
// the Conversion line says what the plan covers. See BOOKING_OS in src/lib/offer-copy.ts.
const STAGES = [
  {
    title: "Clicks",
    sub: "SEO, AI answers and paid ads",
    body: "We work on what people see when they search for what you do: your map listing, your website and your ads.",
  },
  {
    title: "Conversion",
    sub: "From click to calendar",
    body: "A click is worth nothing until it's on the calendar. So the plan also covers what happens next: your website, your calls and your follow-up.",
  },
  {
    title: "The Flywheel",
    sub: "Reviews and repeat clients",
    body: "After each job we ask for a review and stay in touch, so each customer helps bring in the next one.",
  },
];

/**
 * In the order Blake set on 5 Nov: hero, the numbers, who it's for, the proof, how we do it, what
 * we'll tell you to skip, then the one place the form lives. The audit has no section of its own
 * (Blake, 5 Nov: it isn't a product), so it appears only in his sentence above the form.
 * Everything longer has one home elsewhere: the explanation on /what-we-do, each service
 * on its own page, the people on /about. The numbers are our own scans with their basis
 * beside them; the proof rule is in src/lib/menu.ts.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <section aria-labelledby="counted" className="on-navy slant mt-14 bg-[var(--color-navy)] md:mt-20">
        <Container className="py-10 md:py-14">
          <h2 id="counted" className="max-w-3xl font-[family-name:var(--font-display)] text-[2.125rem] leading-[1.06] text-white md:text-[3rem]">
            Our advice starts with searches we&apos;ve run ourselves.
          </h2>
          <NumberBand className="mt-12 md:mt-16" items={MEASURED_COUNTS} basis={MEASURED_BASIS} />
          <ArrowLink href="/about" tone="light" className="mt-8">
            See who does this work
          </ArrowLink>
        </Container>
      </section>

      {/* "Who it's built for", not "who we work with": copy_evidence and clickhere.md both
          say to write "built for", because "worked with" can imply past clients. */}
      <Section id="industries">
        <div className="max-w-3xl">
          <Eyebrow>Who it&apos;s built for</Eyebrow>
          <H2 className="mt-3">What a missed call looks like in your business.</H2>
        </div>
        <div className="mt-12">
          <IndustryCarousel cards={CARDS} />
        </div>
      </Section>

      <Proof />

      <Section id="how-it-works" tint>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <Flywheel className="order-2 min-w-0 lg:order-1" />
          <div className="order-1 min-w-0 lg:order-2">
            <Eyebrow>How we do it</Eyebrow>
            <H2 className="mt-3">We work on getting found, getting booked and getting customers back.</H2>
            <ol className="mt-9 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {STAGES.map((stage) => (
                <li key={stage.title} className="py-5">
                  <h3 className="text-[1.25rem] font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">
                    {stage.title} <span className="ml-1 text-[0.9375rem] font-bold tracking-[-0.01em] text-[var(--color-brand)]">{stage.sub}</span>
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-[var(--color-ink-soft)]">{stage.body}</p>
                </li>
              ))}
            </ol>
            <ArrowLink href="/what-we-do" className="mt-8">
              What we do and how it works
            </ArrowLink>
          </div>
        </div>
      </Section>

      {/* Old links to #menu and #tiers on the home page keep landing here. slant-top: the lower edge is
          square, because the dark contact section comes right after it and a slant would
          leave a wedge of white between the two. The wrapper puts the lilac of the section
          above behind the slanted top, where the white page used to show as a wedge. */}
      <div className="bg-[var(--color-surface-raised)]">
        <section id="menu" className="on-navy slant-top scroll-mt-24 bg-[var(--color-navy)]">
          <span id="tiers" aria-hidden="true" className="block scroll-mt-24" />
          <Container className="py-10 text-center md:py-14">
            <H2 className="mx-auto max-w-3xl">We&apos;ll tell you what to skip.</H2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/90 md:text-xl">
              We look at your market first, then build one plan: what to do first, what can wait and what you can skip.
            </p>
          </Container>
        </section>
      </div>

      {/* The one place the form lives. Every "Get in touch" on the site lands here. No
          scroll-mt: the page's own scroll-padding already clears the sticky header, and more
          would land the reader on the tail of the section above. -mt-px: the section above
          ends on a part pixel, and without the overlap a pale line shows at the join. */}
      <section id="contact" className="cta-diagonal on-navy -mt-px">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            {/* Not "Get in touch.": Blake's sentence under it opens with the same three words. */}
            <H2>Contact us.</H2>
            {/* Blake's sentence, from page-parts.tsx. Keep as written. */}
            <p className="mt-5 leading-relaxed text-white/90 md:text-xl">{GET_IN_TOUCH}</p>
            <div className="mt-9 md:mt-10">
              {/* slotId "audit": the form keeps its old anchor, so any #audit link still out there lands on it. */}
              <AuditRequest slotId="audit" source="contact" />
              <p className="mt-6 text-sm leading-relaxed text-white/80">{COVERAGE_LINE}</p>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={[organizationSchema, websiteSchema]} />
    </>
  );
}
