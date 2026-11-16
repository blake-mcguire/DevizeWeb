import type { Metadata } from "next";
import type { VoicePage } from "@/lib/voice-page";
import ViewBeacon from "./view-beacon";
import VoiceDemo from "./voice-demo";
import { voiceCopy } from "./voice-copy";

/**
 * The voice demo page's body and tab title, rendered by both of its
 * addresses: /a/<token> and the readable /for/<slug> (voice build contract
 * 8.4, 2026-11-16). One component and one metadata object, so the two cannot
 * drift: the same block (voice-demo.tsx, which mints with the page token),
 * and the same view beacon, which reports the open to views/ under the page
 * token whichever address was used.
 *
 * The root layout's " · Devize" template stops at /a/layout.tsx (which sets a
 * title of its own, and which /for/ shares), so it is written out here.
 */
export const voiceMetadata: Metadata = { title: { absolute: `${voiceCopy.pageTitle} · Devize` } };

export default function VoiceView({ page }: { page: VoicePage }) {
  return (
    <>
      <VoiceDemo token={page.token} business={page.business} city={page.city} state={page.state} sample={page.sample} />
      <ViewBeacon token={page.token} />
    </>
  );
}
