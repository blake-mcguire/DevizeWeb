import Link from "next/link";
import { CtaBand, Sources, type Source } from "@/components/page-parts";

/**
 * All that the six trade pages share, kept small on purpose. The one repeated
 * disclaimer lives here as one short line, so no page has to say it in its own
 * words, and the pages stay free to differ everywhere else.
 */

export function Crumb({ name }: { name: string }) {
  return (
    <>
      <Link href="/industries" className="hover:text-white">
        Industries
      </Link>
      {" / "}
      {name}
    </>
  );
}

export const TRADE_LINE =
  "Devize is new: no client in this trade yet, and no client's Google Ads campaign run yet. We aren't lawyers, this isn't legal advice, and nothing here promises a rank, a date or a booked job.";

export function TradeClose({ sources, title, body }: { sources: Source[]; title: string; body: string }) {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <p className="mb-6 max-w-3xl text-[var(--color-ink)] leading-relaxed">{TRADE_LINE}</p>
        <Sources items={sources} />
      </section>
      <CtaBand title={title} body={body} />
    </>
  );
}
