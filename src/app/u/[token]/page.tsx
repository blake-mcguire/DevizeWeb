import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import ViewBeacon from "@/app/a/[token]/view-beacon";
import { optoutPageState } from "@/lib/audit-page";
import { OPTOUT_VIEW_ENDPOINT, OPTOUT_VIEW_KEY } from "@/lib/voice-link";
import OptOutButton from "./optout-button";
import { optoutCopy } from "./optout-copy";

/**
 * /u/<token>: the opt-out page the footer of every voice email links to
 * (voice build contract 8.5, 2026-11-16), https://<sending domain>/u/<token>
 * with the page token.
 *
 * Shown for a token whose audits/<token>/page.json is a voice page, EXPIRED
 * OR NOT: an opt-out must work long after the demo has gone. It is the demo
 * page's style in the /a/ chrome (the logo), with Blake's caption and one
 * Unsubscribe button. Opening it unsubscribes nobody: only the press does
 * (POST /api/unsubscribe). The visit is recorded by the same once-per-session
 * beacon the demo page uses, sent to /api/optout-view, which skips machines.
 *
 * A missing, malformed or non-voice token, or a store that cannot be read,
 * gets the same 404 as /a/. Nothing here names the voice vendor or the
 * business: a forwarded link shows only the caption and the button.
 */

type Props = { params: Promise<{ token: string }> };

// One read of page.json per request, shared by the tab title and the page.
const getState = cache(optoutPageState);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { token } = await params;
  return (await getState(token)) === "yes" ? { title: { absolute: `${optoutCopy.pageTitle} · Devize` } } : {};
}

export default async function OptOutPage({ params }: Props) {
  // Read at the visit, never at build time.
  await connection();
  const { token } = await params;
  if ((await getState(token)) !== "yes") notFound();
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 pt-6 pb-16 lg:pt-10">
      <section className="mt-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7 shadow-[0_10px_30px_-18px_rgba(28,42,57,0.35)]">
          <OptOutButton token={token} />
        </div>
      </section>
      <ViewBeacon token={token} endpoint={OPTOUT_VIEW_ENDPOINT} storageKey={OPTOUT_VIEW_KEY} />
    </div>
  );
}
