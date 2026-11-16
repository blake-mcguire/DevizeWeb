"use client";

import { useRef, useState } from "react";
import { optoutCopy } from "./optout-copy";
import { pressUnsubscribe, type PressResult } from "./optout-press";

/**
 * The opt-out page's one block: Blake's caption and one Unsubscribe button.
 * The press, and only the press, sends POST /api/unsubscribe {token}
 * (optout-press.ts, which the node tests send to the route itself); the
 * visit itself unsubscribes nobody. Once the site answers ok the caption and
 * the button give way to the one line that says it is done. A press that
 * does not go through keeps the button and says so; pressing again is
 * harmless (the route answers ok for a token already opted out).
 */

type Status = "idle" | "sending" | PressResult;

const button =
  "inline-flex w-full items-center justify-center gap-3 rounded-full min-h-14 px-6 py-3 text-center text-lg font-medium text-white bg-[image:var(--gradient-brand)] shadow-[0_6px_18px_-6px_rgba(51,0,153,0.55)] transition-[transform,box-shadow] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] disabled:opacity-60 disabled:cursor-not-allowed";

export default function OptOutButton({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const pressing = useRef(false);

  async function press() {
    if (pressing.current) return;
    pressing.current = true;
    setStatus("sending");
    try {
      setStatus(await pressUnsubscribe(token));
    } finally {
      pressing.current = false;
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="text-center text-[1.05rem] sm:text-lg leading-relaxed text-[var(--color-ink)]">
        {optoutCopy.done}
      </p>
    );
  }

  return (
    <>
      <p className="text-[1.05rem] sm:text-lg leading-relaxed text-[var(--color-ink)]">{optoutCopy.caption}</p>
      {status === "failed" && (
        <p role="alert" className="mt-4 text-sm leading-relaxed text-[#b42318]">
          {optoutCopy.failed}
        </p>
      )}
      <button type="button" onClick={() => void press()} disabled={status === "sending"} className={`${button} mt-5`}>
        {optoutCopy.button}
      </button>
      <noscript>
        <p className="mt-3 text-center text-sm leading-relaxed text-[var(--color-ink-soft)]">{optoutCopy.noScript}</p>
      </noscript>
    </>
  );
}
