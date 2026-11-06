import { ArrowLink, PageHero } from "@/components/page-parts";
import { LABEL } from "@/lib/offer-copy";

export default function Hero() {
  return (
    <PageHero
      // TODO(Blake): confirm the headline. It's the example from your brief, built on the
      // mission, and it reads as an instruction rather than a promise. The old tagline
      // "Your prospects are searching for your services, but are they finding you?" stays
      // off the marketing pages. The /a/ pages' share image still carries it.
      title={
        <>
          Convert clicks into clients <span className="block text-[var(--color-lilac)]">without adding headcount.</span>
        </>
      }
      imageTop
      // Blake, 5 Nov 2026, his words. Keep as written. The "AI-powered" and "white-glove"
      // wording is not a hero statement.
      subhead="You run the business. We run the ads, the SEO and the pipeline, so you can run your local market."
      lead={`Devize is a ${LABEL} for local service-based businesses. We look at your market, tell you what to do first and what to skip, then run it with you.`}
    >
      <ArrowLink href="#contact" tone="light">
        Get in touch
      </ArrowLink>
    </PageHero>
  );
}
