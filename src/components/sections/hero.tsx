import { DarkBand } from "@/components/page-parts";
import { Button } from "@/components/ui/button";
import { LABEL_FOR, LABEL_PLAIN, PRICE } from "@/lib/offer-copy";

export default function Hero() {
  return (
    <DarkBand>
      <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="max-w-3xl">
          <p className="reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs font-medium text-white/90">
            <span className="brand-dot" aria-hidden="true" />
            {LABEL_FOR}
          </p>

          {/* TODO(Blake): the home page headline. You have been asked; this one stays
              until you answer. */}
          {/* TODO(Blake): the old tagline "Your prospects are searching for your
              services, but are they finding you?" is gone from the marketing pages,
              per the brief. truth.md says it could stay as a line under the label
              if you want it. The /a/ pages' share image still carries it. */}
          <h1 className="reveal mt-5 font-[family-name:var(--font-display)] text-[2.6rem] sm:text-6xl lg:text-[4.5rem] leading-[1.02] tracking-tight text-white font-medium">
            Know what&apos;s worth doing online.{" "}
            <span className="block text-[#A98BF5]">Skip the rest.</span>
          </h1>

          {/* The label's plain sentence (the brief: it always sits beside the
              label), doing the job of the sentence under the headline. */}
          <p className="reveal mt-5 text-lg md:text-xl text-white/85 leading-relaxed">{LABEL_PLAIN}</p>

          <p className="reveal mt-5 text-base md:text-lg text-white">
            <strong className="font-semibold">{PRICE.headline}</strong> {PRICE.term}
          </p>

          <div className="reveal mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/#contact" size="lg" className="w-full sm:w-auto">
              Get my free map audit
            </Button>
            <Button href="/sample-audit" variant="glass" size="lg" className="w-full sm:w-auto">
              See a sample audit
            </Button>
          </div>

          <p className="reveal mt-5 text-sm text-white/75 leading-relaxed">
            {PRICE.audit} No logins, nothing to sign. Devize is independent and
            does not work for Google.
          </p>
        </div>
      </div>
    </DarkBand>
  );
}
