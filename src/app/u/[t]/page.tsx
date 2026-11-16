import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import ViewBeacon from "@/app/a/[token]/view-beacon";
import { optoutState } from "@/lib/audit-page";
import { OPTOUT_BODY_FIELD, OPTOUT_PAGE_SHOWS, OPTOUT_VIEW_ENDPOINT, OPTOUT_VIEW_KEY } from "@/lib/voice-link";
import OptOutButton from "./optout-button";
import { optoutCopy } from "./optout-copy";

/**
 * /u/<t>: the opt-out page the footer of every voice email links to (voice
 * build contract 8.5, 2026-11-16), https://<sending domain>/u/<t>.
 *
 * t is the page's OPT-OUT token, not the page token (contract 8.6, after the
 * website review): a readable /for/ slug can be guessed from the business
 * name and that page hands the browser the page token, so the opt-out link
 * has a secret of its own. t is resolved by audit-page.resolveOptout, the one
 * resolver the beacon and the button's route share: optout-links/<t>.json
 * names the page token, and audits/<page token>/page.json must be a voice
 * page, EXPIRED OR NOT (an opt-out must work long after the demo has gone). A
 * page token in the address is the plain 404, like any other unknown t.
 *
 * It is the demo page's style in the /a/ chrome (the logo), with Blake's
 * caption and one Unsubscribe button. Opening it unsubscribes nobody: only
 * the press does (POST /api/unsubscribe {t}). The visit is recorded by the
 * same once-per-session beacon the demo page uses, sent to /api/optout-view as
 * {t}, which skips machines. The browser is handed t and nothing else: only
 * the state of the resolution is read here, so the page token never reaches
 * the HTML or the page's payload, and neither does the business.
 *
 * A malformed or unknown t, a link file that is not right, and a page that is
 * missing or not a voice page get the same 404 as /a/. A store that cannot be
 * read shows the button all the same (voice-link OPTOUT_PAGE_SHOWS): the press
 * then says try again, so a real recipient is never told the page is gone.
 * Nothing here names the voice vendor.
 */

type Props = { params: Promise<{ t: string }> };

// One resolution per request, shared by the tab title and the page.
const getState = cache(optoutState);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { t } = await params;
  return OPTOUT_PAGE_SHOWS[await getState(t)] ? { title: { absolute: `${optoutCopy.pageTitle} · Devize` } } : {};
}

export default async function OptOutPage({ params }: Props) {
  // Read at the visit, never at build time.
  await connection();
  const { t } = await params;
  if (!OPTOUT_PAGE_SHOWS[await getState(t)]) notFound();
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 pt-6 pb-16 lg:pt-10">
      <section className="mt-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7 shadow-[0_10px_30px_-18px_rgba(28,42,57,0.35)]">
          <OptOutButton t={t} />
        </div>
      </section>
      <ViewBeacon token={t} endpoint={OPTOUT_VIEW_ENDPOINT} storageKey={OPTOUT_VIEW_KEY} field={OPTOUT_BODY_FIELD} />
    </div>
  );
}
