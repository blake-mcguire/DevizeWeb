import { DarkBand } from "@/components/page-parts";
import { Button } from "@/components/ui/button";
import { BOOKING_OS, LABEL } from "@/lib/offer-copy";
import { PRICE } from "@/lib/tiers";

export default function Hero() {
  return (
    <DarkBand>
      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div>
          {/* TODO(Blake): confirm the headline. It's the example from your brief, built
              on the mission, and it reads as an instruction rather than a promise.
              The old tagline "Your prospects are searching for your services, but are
              they finding you?" stays off the marketing pages. The /a/ pages' share
              image still carries it. */}
          <h1 className="reveal max-w-5xl font-[family-name:var(--font-display)] text-[2.6rem] sm:text-6xl lg:text-[4.5rem] leading-[1.02] tracking-tight text-white font-medium">
            Convert clicks into clients{" "}
            <span className="block text-[#A98BF5]">without adding headcount.</span>
          </h1>

          <p className="reveal mt-6 max-w-3xl text-lg md:text-xl text-white/85 leading-relaxed">
            Devize is a {LABEL}{" "}for service businesses that sell to people, like
            plumbers, HVAC shops, dentists, vets, law firms and walk-in clinics. We
            manage your SEO and your ad spend to bring in the clicks. {BOOKING_OS}, in
            pilot, is meant to take in each lead and help you book it and keep it.
          </p>

          <div className="reveal mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/#audit" size="lg" className="w-full sm:w-auto">
              Get my free map audit
            </Button>
            <Button href="/what-we-do" variant="glass" size="lg" className="w-full sm:w-auto">
              See how it works
            </Button>
          </div>

          {/* TODO(Blake): this price sits on the first screen, so it's only true to print
              once paymentPathReady is true in src/lib/launch-gate.json. */}
          <p className="reveal mt-5 text-sm text-white/75 leading-relaxed">
            SEO and review work is {PRICE.display}{" "}a month, flat. {PRICE.audit}{" "}No logins,
            nothing to sign. We promise the work, never a rank, a date or a lead count.
          </p>
        </div>
      </div>
    </DarkBand>
  );
}
