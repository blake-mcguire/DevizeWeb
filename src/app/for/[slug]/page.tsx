import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import VoiceView, { voiceMetadata } from "@/app/a/[token]/voice-view";
import { loadPageForSlug } from "@/lib/audit-page";
import { chooseView } from "@/lib/prospect-view";

/**
 * /for/<slug>: the readable demo link the cold email carries (voice build
 * contract 8.4, 2026-11-16), https://<sending domain>/for/<slug>.
 *
 * The slug is checked against the contract's shape, links/<slug>.json is read
 * from the Blob store and must be {v: 1, slug: this slug, token: 22 letters
 * and digits}, and then the page renders exactly what /a/<token> renders for
 * that token's voice page: the same loader, the same choice
 * (prospect-view.chooseView) and the same component (voice-view.tsx). No
 * redirect, so the address bar keeps the readable link. The demo block still
 * mints with the page token, so the caps and the session route are
 * unchanged, and the view beacon reports the open under the page token.
 *
 * A malformed or unknown slug, a link file that is not right, and a page that
 * is missing, expired, broken or not a voice page all get the same 404 as /a/.
 */

type Props = { params: Promise<{ slug: string }> };

// One read of the link and the page per request, shared by the tab title and the page.
const getPage = cache(loadPageForSlug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const view = chooseView(await getPage(slug), "for");
  return view.kind === "voice" ? voiceMetadata : {};
}

export default async function ReadableLinkPage({ params }: Props) {
  // Read at the visit, never at build time: the link and the page's expiry are the store's, not the build's.
  await connection();
  const { slug } = await params;
  const view = chooseView(await getPage(slug), "for");
  if (view.kind !== "voice") notFound();
  return <VoiceView page={view.page} />;
}
