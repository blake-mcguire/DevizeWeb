import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Problem from "@/components/sections/problem";
import HowItWorks from "@/components/sections/how-it-works";
import Services from "@/components/sections/services";
import WhoItsFor from "@/components/sections/who-its-for";
import Faq, { faqs } from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SITE_URL = "https://www.devize.ai";
const ORG_ID = `${SITE_URL}/#organization`;
const US = { "@type": "Country", name: "United States" };

// The brand's facts live on the home page (moved from the root layout on
// 2026-10-15) so the prospect pages under /a/ carry none of the marketing
// structured data.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Devize",
  url: SITE_URL,
  logo: `${SITE_URL}/devize-logo.svg`,
  description:
    "Devize does local SEO and AEO (answer engine optimization) for owner-run local service businesses such as dentists and HVAC companies: Google Business Profile work, reviews, service and town pages, consistent listings, and clear facts AI assistants can read.",
  email: "admin@devize.ai",
  address: {
    "@type": "PostalAddress",
    streetAddress: "307 Irenic Mist Court",
    addressLocality: "Willis",
    addressRegion: "TX",
    postalCode: "77318",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "admin@devize.ai",
    availableLanguage: "English",
  },
  areaServed: US,
  founder: { "@type": "Person", name: "Blake McGuire" },
  knowsAbout: [
    "Local search engine optimization",
    "Answer engine optimization",
    "Google Business Profile",
    "Online reviews",
    "Structured data",
  ],
};

const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Google Listing and Map Audit",
    serviceType: "Local search audit",
    description:
      "We run the searches your customers run from dozens of spots around your business, show where you come up on Google's map and who comes up instead, check 21 things on your Google listing, reviews and website, and list the fixes we'd make first, in order.",
    provider: { "@id": ORG_ID },
    areaServed: US,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Local SEO and AEO",
    serviceType: "Local search engine optimization",
    description:
      "Monthly work on your Google Business Profile, reviews, service and town pages, listings across directories, and facts AI assistants can read, with the same map searches rerun each month.",
    provider: { "@id": ORG_ID },
    areaServed: US,
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

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Services />
      <WhoItsFor />
      <Faq />
      <Contact />
      <JsonLd
        data={[organizationSchema, ...serviceSchemas, websiteSchema, faqSchema]}
      />
    </>
  );
}
