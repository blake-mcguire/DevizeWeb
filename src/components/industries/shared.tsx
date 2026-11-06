import Link from "next/link";
import { ArrowLink, GetInTouch, Sources, type Source } from "@/components/page-parts";
import { COVERAGE_LINE } from "@/lib/offer-copy";

/**
 * All that the six trade pages share, kept small on purpose, so the pages stay free to
 * differ everywhere else. The shared fine print (not legal advice, results, the extra
 * rules for healthcare and legal) is in the footer, on every page, and not repeated here.
 */

/** The panel's link on a trade page's hero. */
export function TradeArrow() {
  return (
    <ArrowLink href="/#contact" tone="light">
      Get in touch
    </ArrowLink>
  );
}

export function Crumb({ name }: { name: string }) {
  return (
    <>
      <Link href="/industries" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
        Industries
      </Link>
      {" / "}
      {name}
    </>
  );
}

// TODO(Blake): say exactly what a plumber, vet, lawyer or clinic receives when they
// ask. truth.md says the real audit covers dentists and HVAC shops in scanned areas. Until
// 5 Nov each trade page closed on its own band, and those four said so: we read the
// listing, reviews and site, and add the rival comparison when that area is scanned. The
// close is now your one sentence on every page, which says "see where you rank against
// the competition" with no such limit. So on the six trade pages the limit prints in small
// type right under the strip (COVERAGE_LINE in src/lib/offer-copy.ts), the same line that
// sits under the form on the home page. The other inner pages show the strip alone.
export function TradeClose({ sources, read }: { sources: Source[]; read?: string }) {
  return (
    <>
      <section className="mx-auto w-full max-w-[76rem] px-5 pb-14 pt-12 md:px-6 md:pt-16">
        <Sources items={sources} read={read} />
      </section>
      <GetInTouch note={COVERAGE_LINE} />
    </>
  );
}
