"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FIELD_NAME, FIELD_TEL, auditFileUrl } from "@/lib/audit-validate";
import { copy, type ErrorCode } from "./copy";

/**
 * The page's one form and what follows it.
 *
 *   form       Name + Mobile, one button ("Get the plan now").
 *   finishing  sent, but the PDF is not built yet: "Finishing your plan, a few
 *              seconds…", polling /api/audit-status every 2 s for up to 2 min.
 *              The download starts by itself only when THIS visit's own
 *              submit led here (`auto`); a later visit that finds the page
 *              still finishing gets the link when it is ready, never a second
 *              download by itself (round 3).
 *   done       the download has started (or, on a later visit, is a tap away).
 *   late       2 min without the file: it comes by email, and who will call.
 *
 * What the file holds ("your plan" or "your audit") follows what the server
 * last said: page.json at load time, then POST /api/audit-request's `plan`,
 * then /api/audit-status's `plan` (the pipeline rewrites it with what it
 * actually built), so the done line never promises a plan the file lacks.
 *
 * The two fields are plain, visible, labelled inputs in a real <form>, named
 * and typed so a phone or browser offers the saved contact in one tap
 * (autocomplete name / tel, type tel). Without JavaScript the form still
 * posts; the page then shows the finishing state (and reloads itself) or the
 * download link.
 */

export type Initial =
  | { kind: "finishing" }
  | { kind: "late" }
  | { kind: "done"; fileUrl: string; planUrl: string | null }
  | null;

type Stage =
  | { kind: "form" }
  /** auto: this visit sent the form, so the download starts by itself when the file is ready. */
  | { kind: "finishing"; auto: boolean }
  | { kind: "late" }
  | { kind: "done"; started: boolean; fileUrl: string; planUrl: string | null };

type Props = {
  token: string;
  personaFirst: string;
  /** Whether this page hands over the plan as well: picks the form's wording. */
  hasPlan: boolean;
  /** Whether the one file itself carries the plan (a round-1 page's plan is a second file), as page.json said at load. */
  filePlan: boolean;
  /** Set when this browser already sent the form (the cookie). */
  initial: Initial;
  /** Set when a no-JavaScript post bounced back with ?e=<code>. */
  initialError: ErrorCode | null;
};

const POLL_EVERY_MS = 2000;
const POLL_FOR_MS = 120_000;

const input =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition";
const label = "block text-sm font-medium text-[var(--color-ink)] mb-1.5";
const primary =
  "inline-flex w-full items-center justify-center gap-2 rounded-full min-h-12 px-6 py-2 text-center text-base font-medium text-white bg-[image:var(--gradient-brand)] shadow-[0_6px_18px_-6px_rgba(51,0,153,0.55)] transition-[transform,box-shadow] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] disabled:opacity-60 disabled:cursor-not-allowed";
const secondary =
  "inline-flex w-full items-center justify-center gap-2 rounded-full min-h-12 px-6 py-2 text-center text-base font-medium text-[var(--color-ink)] bg-white border border-[var(--color-ink)]/20 transition-[transform,border-color] hover:-translate-y-[1px] hover:border-[var(--color-ink)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)]";
const heading =
  "font-[family-name:var(--font-display)] text-2xl tracking-tight font-medium text-[var(--color-ink)] focus:outline-none";
const body = "text-[0.95rem] leading-relaxed text-[var(--color-ink)]";

/** Starts a download of a same-origin URL; the server's Content-Disposition names the file. */
function startDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// True once this runs in the browser with JavaScript (false on the server and while hydrating).
const noop = () => () => {};
const useHasJs = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

function initialStage(initial: Initial): Stage {
  if (!initial) return { kind: "form" };
  // A page that opens already finishing was sent on an earlier visit: no download starts by itself.
  if (initial.kind === "finishing") return { kind: "finishing", auto: false };
  if (initial.kind === "late") return { kind: "late" };
  return { kind: "done", started: false, fileUrl: initial.fileUrl, planUrl: initial.planUrl };
}

export default function AuditForm({ token, personaFirst, hasPlan, filePlan, initial, initialError }: Props) {
  const [stage, setStage] = useState<Stage>(() => initialStage(initial));
  // Whether the file carries the plan, as the server last said (see the top of this file).
  const [plan, setPlan] = useState(filePlan);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ? copy.errors[initialError] : null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // focus follows the stage only after this visit changed it
  const sentHere = useRef(false); // this visit sent the form (only then may a download start by itself)
  const hasJs = useHasJs();
  const who = { persona_first: personaFirst };

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [stage.kind]);

  // While finishing: ask every 2 s whether the file is built. When it is: download it at once if this visit sent
  // the form (auto), else show the link (a reload after the download must not start a second one).
  const finishing = stage.kind === "finishing";
  const auto = stage.kind === "finishing" && stage.auto;
  useEffect(() => {
    if (!finishing) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = Date.now() + POLL_FOR_MS;
    const tick = async () => {
      let ready = false;
      try {
        const res = await fetch(`/api/audit-status?token=${encodeURIComponent(token)}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { ready?: unknown; plan?: unknown };
          ready = !!data.ready;
          if (!stopped && typeof data.plan === "boolean") setPlan(data.plan);
        }
      } catch {
        // offline for a moment: ask again next tick
      }
      if (stopped) return;
      if (ready) {
        const fileUrl = auditFileUrl(token);
        if (auto) startDownload(fileUrl);
        moved.current = true;
        setStage({ kind: "done", started: auto, fileUrl, planUrl: null });
      } else if (Date.now() >= deadline) {
        moved.current = true;
        setStage({ kind: "late" });
      } else {
        timer = setTimeout(tick, POLL_EVERY_MS);
      }
    };
    timer = setTimeout(tick, POLL_EVERY_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [finishing, auto, token]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const fd = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, [FIELD_NAME]: fd.get(FIELD_NAME), [FIELD_TEL]: fd.get(FIELD_TEL) }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: ErrorCode;
        ready?: boolean;
        plan?: boolean;
        file_url?: string | null;
        plan_url?: string | null;
      };
      if (res.ok && data.ok) {
        moved.current = true;
        sentHere.current = true;
        if (typeof data.plan === "boolean") setPlan(data.plan);
        if (data.ready && data.file_url) {
          startDownload(data.file_url);
          setStage({ kind: "done", started: true, fileUrl: data.file_url, planUrl: data.plan_url || null });
        } else {
          setStage({ kind: "finishing", auto: true });
        }
        return;
      }
      setError(copy.errors[data.error && data.error in copy.errors ? data.error : "server"]);
    } catch {
      setError(copy.errors.server);
    } finally {
      setBusy(false);
    }
  }

  if (stage.kind === "finishing") {
    return (
      <div role="status" aria-live="polite">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 inline-block h-5 w-5 shrink-0 rounded-full border-2 border-[var(--color-brand)]/20 border-t-[var(--color-brand)] animate-spin motion-reduce:animate-none"
          />
          <h2 ref={headingRef} tabIndex={-1} className={heading}>
            {copy.finishing(plan)}
          </h2>
        </div>
        {hasJs && <p className={`mt-4 ${body}`}>{stage.auto ? copy.finishingNote : copy.finishingNoteLink}</p>}
        <p className={`mt-4 ${body}`}>{copy.doneCall(who)}</p>
      </div>
    );
  }

  if (stage.kind === "late") {
    return (
      <div aria-live="polite">
        <h2 ref={headingRef} tabIndex={-1} className={heading}>
          {copy.lateHeading}
        </h2>
        <p className={`mt-4 ${body}`}>{copy.lateBody(plan, who)}</p>
        {/* A link, so it also works without JavaScript (a fresh look at the page). */}
        <a
          href={`/a/${token}#get`}
          onClick={(e) => {
            e.preventDefault();
            moved.current = true;
            setStage({ kind: "finishing", auto: sentHere.current });
          }}
          className={`${secondary} mt-5`}
        >
          {copy.checkAgain}
        </a>
      </div>
    );
  }

  if (stage.kind === "done") {
    return (
      <div aria-live="polite">
        <h2 ref={headingRef} tabIndex={-1} className={heading}>
          {copy.doneHeading(plan, stage.started)}
        </h2>
        <div className="mt-5 grid gap-3">
          <a href={stage.fileUrl} download className={stage.started ? secondary : primary}>
            {copy.download(plan)}
          </a>
          {stage.planUrl && (
            <a href={stage.planUrl} download className={secondary}>
              {copy.downloadPlan}
            </a>
          )}
        </div>
        <p className={`mt-5 ${body}`}>
          {copy.doneCall(who)} {copy.doneEmail}
        </p>
      </div>
    );
  }

  return (
    // method/action make a no-JavaScript submit a POST (never a GET with the
    // number in the URL); the route answers that with a redirect back here.
    <form method="post" action="/api/audit-request" onSubmit={onSubmit}>
      <h2 className={heading}>{copy.formHeading(hasPlan)}</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{copy.formIntro(hasPlan)}</p>

      <input type="hidden" name="token" value={token} />
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="audit-name" className={label}>
            {copy.nameLabel}
          </label>
          <input
            id="audit-name"
            name={FIELD_NAME}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            required
            maxLength={80}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="audit-tel" className={label}>
            {copy.mobileLabel}
          </label>
          <input
            id="audit-tel"
            name={FIELD_TEL}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="send"
            required
            maxLength={32}
            className={input}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-[#b42318]">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className={`${primary} mt-5`}>
        {busy ? copy.submitting : copy.submit(hasPlan)}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {copy.consent(who)}{" "}
        <a href="/sms-terms" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
          {copy.legalLinks.smsTerms}
        </a>
        {" · "}
        <a href="/privacy" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
          {copy.legalLinks.privacy}
        </a>
        {" · "}
        <a href="/terms" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
          {copy.legalLinks.terms}
        </a>
      </p>
    </form>
  );
}
