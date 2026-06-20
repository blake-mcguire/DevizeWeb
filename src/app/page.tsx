import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Logos from "@/components/sections/logos";
import Problem from "@/components/sections/problem";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/testimonials";
import Stats from "@/components/sections/stats";
import CaseStudies from "@/components/sections/case-studies";
import Faq, { faqs } from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Devize",
  url: "https://devize.ai",
  publisher: {
    "@type": "Organization",
    name: "Devize",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <Problem />
      <Services />
      <Testimonials />
      <Stats />
      <CaseStudies />
      <Faq />
      <Contact />
      <JsonLd data={[websiteSchema, faqSchema]} />
    </>
  );
}
