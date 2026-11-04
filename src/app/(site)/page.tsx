import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Problem from "@/components/sections/problem";
import Services from "@/components/sections/services";
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
      <Problem />
      <Services />
      <Faq />
      <Contact />
      <JsonLd data={[websiteSchema, faqSchema]} />
    </>
  );
}
