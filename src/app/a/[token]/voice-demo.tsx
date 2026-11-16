"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentState, RealtimeSession } from "@voice-session/web";
import { FIRST_STATE, JOIN_TIMEOUT_MS, agentJoined, joinWatch, timeoutSignal, type JoinWatch } from "./voice-call";
import { VOICE_FINAL_ERRORS, voiceCopy, voiceErrorFor, type VoiceErrorCode } from "./voice-copy";

/**
 * The voice demo block on /a/<token> (page.json of kind "voice"): the
 * business name, one plain line, and one large button that starts a live
 * call with their receptionist in the browser.
 *
 * What happens on the press, in this order, and why:
 *
 *   1. The microphone is asked for first. If the visitor says no, or there
 *      is none, the page says so and stops: no session has been asked for,
 *      so a refusal costs nothing and uses none of the page's calls.
 *   2. Only then are the voice SDK (a pinned npm dependency, split into its
 *      own file that no visitor downloads before pressing) and the session
 *      (POST /api/demo-session) fetched, side by side.
 *   3. The call starts. The line under the name follows the session's own
 *      agent_state events: connecting, listening, thinking, speaking, ended.
 *      The SDK starts out in "connecting" and so never announces it; the
 *      block shows it itself from the moment the SDK is started.
 *
 * Nothing loads and nothing is minted when the page opens. The server keeps
 * the API key, the assistant and every call variable; the browser only ever
 * holds the short-lived {url, token} of its own session.
 *
 * The call is ended when the visitor presses End call, when the assistant
 * hangs up, when the page is left or closed, and after MAX_CALL_MS whatever
 * else happens, so a tab left open cannot keep a call running. It is also
 * ended, with the did-not-connect sentence, when no assistant has joined
 * JOIN_TIMEOUT_MS after it began to connect (voice-call.ts): a network that
 * blocks the call's media would otherwise leave a spinner and nothing else.
 * End call is offered once the call is fully up (the SDK's start has
 * finished), so a press can never race the SDK while it is still taking the
 * microphone.
 *
 * Known and left as it is: a call that fails to connect has already used one
 * of the page's sessions for the day, because the session has to exist
 * before the browser can try to connect. Whether such a press should count
 * is part of the caps decision, which is Blake's.
 */

type Props = {
  token: string;
  business: string;
  city: string;
  state: string;
  sample: boolean;
};

/** idle: nothing running. starting: between the press and the session's first word. Then the session's own states. */
type Status = "idle" | "starting" | AgentState;

/**
 * The longest one call may run from this page. The assistant has its own
 * seven-minute limit; this is one minute past it, a second stop in case that
 * limit does not apply to browser calls. Engineering default, 2026-11-15.
 */
const MAX_CALL_MS = 8 * 60 * 1000;

/** How long the page waits for /api/demo-session before it gives up and says so. */
const MINT_TIMEOUT_MS = 25_000;

class DemoError extends Error {
  code: VoiceErrorCode;
  constructor(code: VoiceErrorCode) {
    super(code);
    this.code = code;
  }
}

/** Which sentence a refused or failed microphone request gets. */
function micError(err: unknown): VoiceErrorCode {
  const name = err instanceof Error ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") return "mic_denied";
  if (name === "NotFoundError" || name === "DevicesNotFoundError" || name === "OverconstrainedError") return "mic_missing";
  return "mic_failed";
}

/** Which sentence a call that would not start gets, from the SDK's own error. */
function startError(err: unknown): VoiceErrorCode {
  const message = err instanceof Error ? err.message : "";
  if (/microphone|permission/i.test(message)) return "mic_denied";
  if (/does not support/i.test(message)) return "unsupported";
  return "failed";
}

/** One session for this page, or a DemoError carrying the sentence to show. */
async function mint(token: string): Promise<{ url: string; token: string }> {
  let res: Response;
  try {
    res = await fetch("/api/demo-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: timeoutSignal(MINT_TIMEOUT_MS),
    });
  } catch {
    throw new DemoError("unavailable");
  }
  const data = (await res.json().catch(() => ({}))) as { url?: unknown; token?: unknown; error?: unknown };
  if (res.ok && typeof data.url === "string" && typeof data.token === "string") {
    return { url: data.url, token: data.token };
  }
  throw new DemoError(voiceErrorFor(res.status, data.error));
}

const talkButton =
  "inline-flex w-full items-center justify-center gap-3 rounded-full min-h-16 px-6 py-3 text-center text-lg font-medium text-white bg-[image:var(--gradient-brand)] shadow-[0_6px_18px_-6px_rgba(51,0,153,0.55)] transition-[transform,box-shadow] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] disabled:opacity-60 disabled:cursor-not-allowed";
const endButton =
  "inline-flex w-full items-center justify-center gap-2 rounded-full min-h-12 px-6 py-2 text-center text-base font-medium text-[var(--color-ink)] bg-white border border-[var(--color-ink)]/20 transition-[transform,border-color] hover:-translate-y-[1px] hover:border-[var(--color-ink)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)]";

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0 fill-none stroke-current" strokeWidth="1.8">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" strokeLinecap="round" />
    </svg>
  );
}

/** The dot beside the live state: a spinner while waiting, a soft pulse while listening, a ring while speaking. */
function Indicator({ status }: { status: Status }) {
  if (status === "listening" || status === "speaking") {
    return (
      <span aria-hidden="true" className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        {status === "speaking" && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand)]/40 animate-ping motion-reduce:animate-none" />
        )}
        <span
          className={`relative inline-flex h-3.5 w-3.5 rounded-full bg-[image:var(--gradient-brand)] ${
            status === "listening" ? "animate-pulse motion-reduce:animate-none" : ""
          }`}
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 shrink-0 rounded-full border-2 border-[var(--color-brand)]/20 border-t-[var(--color-brand)] animate-spin motion-reduce:animate-none"
    />
  );
}

/** The word shown while something is running: "Starting" until the session reports its own state. */
function stateLabel(status: Status): string {
  return status === "idle" || status === "starting" ? voiceCopy.starting : voiceCopy.states[status];
}

export default function VoiceDemo({ token, business, city, state, sample }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<VoiceErrorCode | null>(null);
  /** True once the call is fully up: only then is End call offered. */
  const [up, setUp] = useState(false);
  const sessionRef = useRef<RealtimeSession | null>(null);
  const pressing = useRef(false);
  const limit = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** The wait for the assistant to join the call that is starting. */
  const joining = useRef<JoinWatch | null>(null);
  /** True once the block has left the page: a press still in flight must not start a call nobody can see. */
  const gone = useRef(false);

  /** Ends the running call, if there is one, and shows `next` when given. Safe to call at any time. */
  const finish = useCallback(async (next: Status | null) => {
    clearTimeout(limit.current);
    joining.current?.cancel();
    joining.current = null;
    const session = sessionRef.current;
    sessionRef.current = null; // from here on this session's own events are ignored
    if (session) await session.end().catch(() => {});
    if (session && next) {
      setUp(false);
      setStatus(next);
    }
  }, []);

  // Leaving or closing the page ends the call. pagehide also fires when the page goes into the back/forward
  // cache, so a visitor who comes back sees "ended", never a live state with no call behind it.
  useEffect(() => {
    gone.current = false;
    const onHide = () => void finish("ended");
    window.addEventListener("pagehide", onHide);
    return () => {
      gone.current = true;
      window.removeEventListener("pagehide", onHide);
      void finish(null);
    };
  }, [finish]);

  async function start() {
    if (pressing.current || sessionRef.current) return;
    pressing.current = true;
    setError(null);
    setUp(false);
    setStatus("starting");
    let probe: MediaStream | null = null;
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
        throw new DemoError("unsupported");
      }
      // The microphone first: a refusal here costs no session.
      try {
        probe = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        throw new DemoError(micError(err));
      }

      // Only now: the SDK's own file and one session, side by side.
      const [sdk, minted] = await Promise.all([import("@voice-session/web"), mint(token)]);
      if (gone.current) return; // an unused session costs nothing and expires by itself
      const session = new sdk.RealtimeSession(minted);
      sessionRef.current = session;
      // The SDK is already in this state when it starts, so it never says so.
      setStatus(FIRST_STATE);
      // No assistant on the call in time: hang up and say it did not connect, whatever the SDK is doing.
      joining.current = joinWatch(JOIN_TIMEOUT_MS, () => {
        if (sessionRef.current !== session) return;
        void finish(null).then(() => {
          setUp(false);
          setStatus("idle");
          setError("failed");
        });
      });
      session.on("agent_state", (next) => {
        if (sessionRef.current !== session || next === "ended") return;
        if (agentJoined(next)) joining.current?.joined();
        setStatus(next);
      });
      session.on("ended", () => {
        if (sessionRef.current !== session) return;
        sessionRef.current = null;
        clearTimeout(limit.current);
        joining.current?.cancel();
        joining.current = null;
        setUp(false);
        setStatus("ended");
      });
      await session.start({ microphone: true });
      if (gone.current) {
        await finish(null);
      } else if (sessionRef.current === session) {
        setUp(true);
        limit.current = setTimeout(() => void finish("ended"), MAX_CALL_MS);
      }
    } catch (err) {
      // A session that connected but could not start (the microphone was refused after all) is hung up at once.
      await finish(null);
      setStatus("idle");
      setError(err instanceof DemoError ? err.code : startError(err));
    } finally {
      // The probe is kept open until the call holds the microphone itself, so no browser asks twice.
      probe?.getTracks().forEach((track) => track.stop());
      pressing.current = false;
    }
  }

  const place = [city, state].filter(Boolean).join(", ");
  const live = status !== "idle" && status !== "ended";
  const final = error !== null && VOICE_FINAL_ERRORS.includes(error);

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 pt-6 pb-16 lg:pt-10">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.16em] text-[var(--color-ink-muted)] font-medium">
        <span>
          {voiceCopy.eyebrow}
          {place ? ` · ${place}` : ""}
        </span>
        {sample && (
          <span className="rounded-full border border-[var(--color-brand)]/30 bg-white px-2.5 py-0.5 text-[0.7rem] tracking-[0.12em] text-[var(--color-brand)]">
            {voiceCopy.sampleBadge}
          </span>
        )}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[1.9rem] sm:text-[2.75rem] leading-[1.08] tracking-tight font-medium text-[var(--color-ink)] text-balance">
        <em className="brand-text-gradient box-decoration-clone pr-[0.08em]">{business}</em>
      </h1>
      <p className="mt-4 text-[1.05rem] sm:text-lg leading-relaxed text-[var(--color-ink-soft)]">{voiceCopy.line}</p>

      <section className="mt-8">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7 shadow-[0_10px_30px_-18px_rgba(28,42,57,0.35)]">
          {live ? (
            <>
              <div role="status" aria-live="polite" className="flex min-h-16 items-center justify-center gap-3">
                <Indicator status={status} />
                <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight font-medium text-[var(--color-ink)]">
                  {stateLabel(status)}
                </span>
              </div>
              {up && (
                <button type="button" onClick={() => void finish("ended")} className={`${endButton} mt-5`}>
                  {voiceCopy.endCall}
                </button>
              )}
            </>
          ) : (
            <>
              {status === "ended" && !error && (
                <p role="status" className="mb-4 text-center text-[0.95rem] leading-relaxed text-[var(--color-ink)]">
                  {voiceCopy.states.ended}
                </p>
              )}
              {error && (
                <p role="alert" className={`text-sm leading-relaxed text-[#b42318] ${final ? "" : "mb-4"}`}>
                  {voiceCopy.errors[error]}
                </p>
              )}
              {!final && (
                <button type="button" onClick={() => void start()} className={talkButton}>
                  <MicIcon />
                  {status === "ended" ? voiceCopy.talkAgain : voiceCopy.talk}
                </button>
              )}
              {status === "idle" && !error && (
                <p className="mt-3 text-center text-sm leading-relaxed text-[var(--color-ink-soft)]">{voiceCopy.micHint}</p>
              )}
              <noscript>
                <p className="mt-3 text-center text-sm leading-relaxed text-[var(--color-ink-soft)]">{voiceCopy.noScript}</p>
              </noscript>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
