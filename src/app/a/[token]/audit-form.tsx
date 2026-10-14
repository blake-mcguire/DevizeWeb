"use client";

import { useRef, useState } from "react";
import { copy, type ErrorCode } from "./copy";

/** plan is null when the page carries no plan (page.json plan_pdf_url null). */
type Links = { audit: string; plan: string | null };

type Props = {
  token: string;
  personaFirst: string;
  /** Whether this page hands over a plan as well as the audit: picks the form's wording. */
  hasPlan: boolean;
  /** Set when this browser already sent the form (the cookie), so a reload shows the buttons. */
  initialLinks: Links | null;
  /** Set when a no-JavaScript post bounced back with ?e=<code>. */
  initialError: ErrorCode | null;
};

const input =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition";
const label = "block text-sm font-medium text-[var(--color-ink)] mb-1.5";
const primary =
  "inline-flex w-full items-center justify-center gap-2 rounded-full h-12 px-6 text-base font-medium text-white bg-[image:var(--gradient-brand)] shadow-[0_6px_18px_-6px_rgba(51,0,153,0.55)] transition-[transform,box-shadow] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] disabled:opacity-60 disabled:cursor-not-allowed";
const secondary =
  "inline-flex w-full items-center justify-center gap-2 rounded-full h-12 px-6 text-base font-medium text-[var(--color-ink)] bg-white border border-[var(--color-ink)]/20 transition-[transform,border-color] hover:-translate-y-[1px] hover:border-[var(--color-ink)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)]";

export default function AuditForm({ token, personaFirst, hasPlan, initialLinks, initialError }: Props) {
  const [links, setLinks] = useState<Links | null>(initialLinks);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ? copy.errors[initialError] : null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const who = { persona_first: personaFirst };

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
        body: JSON.stringify({ token, name: fd.get("name"), mobile: fd.get("mobile") }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: ErrorCode;
        audit_pdf_url?: string;
        plan_pdf_url?: string | null;
      };
      // The audit is always there; the plan only when the page has one.
      if (res.ok && data.ok && data.audit_pdf_url) {
        setLinks({ audit: data.audit_pdf_url, plan: data.plan_pdf_url || null });
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      setError(copy.errors[data.error && data.error in copy.errors ? data.error : "server"]);
    } catch {
      setError(copy.errors.server);
    } finally {
      setBusy(false);
    }
  }

  if (links) {
    return (
      <div aria-live="polite">
        <h2
          ref={doneRef}
          tabIndex={-1}
          className="font-[family-name:var(--font-display)] text-2xl tracking-tight font-medium text-[var(--color-ink)] focus:outline-none"
        >
          {copy.doneHeading(!!links.plan)}
        </h2>
        <div className="mt-5 grid gap-3">
          <a href={links.audit} target="_blank" rel="noopener" className={primary}>
            {copy.viewAudit}
          </a>
          {links.plan && (
            <a href={links.plan} target="_blank" rel="noopener" className={secondary}>
              {copy.viewPlan}
            </a>
          )}
        </div>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">
          {copy.doneCall(who)} {copy.doneEmail}
        </p>
      </div>
    );
  }

  return (
    // method/action make a no-JavaScript submit a POST (never a GET with the
    // number in the URL); the route answers that with a redirect back here.
    <form method="post" action="/api/audit-request" onSubmit={onSubmit}>
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight font-medium text-[var(--color-ink)]">
        {copy.formHeading(hasPlan)}
      </h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{copy.formIntro(hasPlan)}</p>

      <input type="hidden" name="token" value={token} />
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="audit-name" className={label}>
            {copy.nameLabel}
          </label>
          <input
            id="audit-name"
            name="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            required
            maxLength={80}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="audit-mobile" className={label}>
            {copy.mobileLabel}
          </label>
          <input
            id="audit-mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
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
