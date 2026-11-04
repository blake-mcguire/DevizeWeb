import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import MapStory from "@/components/sections/sample-audit";
import Mission from "@/components/sections/mission";
import PartnerMeans from "@/components/sections/partner-means";
import First30Days from "@/components/sections/first-30-days";
import Price from "@/components/sections/price";
import WontPromise from "@/components/sections/wont-promise";
import Faq, { faqs } from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import { FounderSection } from "@/components/founder";
import { JsonLd } from "@/components/json-ld";
import { AUDIT_NAME, EMAIL, FOUNDER, GOOGLE_ADS, LABEL_FOR, MISSION, PRICE } from "@/lib/offer-copy";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SITE_URL = "https://www.devize.ai";
const ORG_ID = `${SITE_URL}/#organization`;
const US = { "@type": "Country", name: "United States" };

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
  description: `${LABEL_FOR}: Devize says what's worth doing to get found and chosen online, does the agreed work each month, and shows what got done. ${MISSION}`,
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
  areaServed: US,
  founder: { "@type": "Person", name: FOUNDER.name },
  knowsAbout: ["Local search engine optimization", "Google Business Profile", "Online reviews"],
};

function monthly(amount: number, currency: string, url: string) {
  return {
    "@type": "Offer",
    url,
    price: String(amount),
    priceCurrency: currency,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(amount),
      priceCurrency: currency,
      unitCode: "MON",
      unitText: "month",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
  };
}

const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: AUDIT_NAME,
    serviceType: "Local search audit",
    description:
      "We run the searches your customers run from dozens of spots around your business, show where you come up on Google's map and who comes up instead, check 21 things on your Google listing, reviews and website, and list the fixes we'd make first, in order.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    url: `${SITE_URL}/services/free-audit`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "SEO and Review Management",
    serviceType: "Local search engine optimization and review management",
    description:
      "Monthly work with counts: a review request routine, replies to new reviews, a listing check, a facts check, one better page, a map re-run and a one-page note. Month to month.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    url: `${SITE_URL}/services/seo-and-reviews`,
    offers: monthly(PRICE.amount, PRICE.currency, `${SITE_URL}/#price`),
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Google Ads Management",
    serviceType: "Search advertising management",
    description:
      "An optional add-on with counted monthly work, inside stated limits, in the client's own account. Ad spend is separate and paid to Google. Devize has not run a client's Google Ads before and is not a Google Partner.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    url: `${SITE_URL}/services/google-ads`,
    offers: monthly(GOOGLE_ADS.amount, GOOGLE_ADS.currency, `${SITE_URL}/services/google-ads`),
  },
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Devize",
  url: SITE_URL,
  publisher: { "@id": ORG_ID },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

/**
 * The order comes from the positioning brief, with the mission block added after
 * the map. The map stays high because people arrive here from the audit emails.
 * There is no proof section, and nothing replaces the old reviews.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <MapStory />
      <Mission />
      <PartnerMeans />
      <First30Days />
      <Price band />
      <WontPromise />
      <FounderSection />
      <Faq />
      <Contact />
      <JsonLd data={[organizationSchema, ...serviceSchemas, websiteSchema, faqSchema]} />
    </>
  );
}
