"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { LEAD_ERRORS, LEAD_THANKS } from "@/lib/lead-copy";

type Status = "idle" | "submitting" | "success" | "error";

const FALLBACK_ERROR =
  "Something went wrong. Please try again, or email admin@devize.ai.";

const OPEN_LABEL = "Get in touch";

/**
 * The contact form: three fields (business name, town, email), with
 * your name and the search you want to show up for as optional extras behind
 * a toggle. No phone field. Used twice on the home page: in the hero
 * (source "hero") and in the contact section (source "contact").
 *
 * `collapsible` (the hero): on a phone the form starts closed behind one
 * button and opens in place, right where the button was. From lg up it is
 * always open. Without JavaScript the button is a plain link to `#<slotId>`,
 * and globals.css opens the slot with :target, so it still works; the header
 * button links to the same anchor (as a plain <a>, so :target and hashchange
 * fire).
 *
 * Without JavaScript (or before the script loads) the form posts itself to
 * /api/lead, which answers with a 303 to /thanks. With JavaScript,
 * handleSubmit posts JSON and shows the result in place. A bad email from the
 * server (one the browser accepted, like owner@localhost) marks and focuses
 * the email field; after a send, editing any field makes the button live
 * again, so a second location can be sent without a reload.
 *
 * `layout="hero"` (2026-10-15, pass 2 review): from lg up the submit button
 * shares a row with the optional extras' toggle, right under the three
 * fields, and `footer` (the founder line and the price line) sits inside the
 * card under it, so all of it fits a 1366x657 laptop window. On a phone, while the form is closed, `closedFooter` (the same two
 * lines, in the hero's colours) shows right under the open button.
 */
export function AuditForm({
  slotId,
  source,
  collapsible = false,
  layout = "stacked",
  footer,
  closedFooter,
  className,
}: {
  /** The wrapper's id: the anchor the open button and the header link use. */
  slotId: string;
  source: "hero" | "contact";
  collapsible?: boolean;
  /** "hero": business name, town and email on one row from lg up, then the toggle and the button. */
  layout?: "hero" | "stacked";
  /** Shown under the form inside the card: the founder line and the price line. */
  footer?: ReactNode;
  /**
   * With `collapsible`: shown under the open button while the form is closed
   * (below lg), styled for the background it sits on.
   */
  closedFooter?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(!collapsible);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);
  const emailField = useRef<HTMLInputElement>(null);

  // Open when the page is at #<slotId>: on load (a link from another page)
  // and on a later hash change (the header button on this page).
  useEffect(() => {
    if (!collapsible) return;
    const check = () => {
      if (window.location.hash === `#${slotId}`) setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [collapsible, slotId]);

  function openInPlace(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setOpen(true);
    // After the form is shown: focus the first field, which also brings it
    // into view and, on a phone, the keyboard up.
    requestAnimationFrame(() => firstField.current?.focus());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Held before the await: React clears event.currentTarget once the
    // handler yields, so reading it after the fetch would throw.
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMsg(null);
    setEmailInvalid(false);

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // The API's own 400 and 429 messages are written for the visitor;
        // anything else (a 500, a proxy page) gets the fallback.
        const body = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(typeof body.error === "string" ? body.error : FALLBACK_ERROR);
        if (res.status === 400 && body.error === LEAD_ERRORS.email) {
          setEmailInvalid(true);
          emailField.current?.focus();
        }
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      // Offline, or the request never reached the server.
      setStatus("error");
      setErrorMsg(FALLBACK_ERROR);
    }
  }

  const id = (name: string) => `${slotId}-${name}`;
  const hero = layout === "hero";
  const statusId = id("status");

  /** Any edit after a send or an error: the button is live again. */
  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    if (status === "success" || status === "error") setStatus("idle");
    if (emailInvalid && (event.target as HTMLElement).id === id("email")) setEmailInvalid(false);
  }

  return (
    <div id={slotId} className={cn("audit-slot scroll-mt-24", className)}>
      {collapsible && !open && (
        <a
          href={`#${slotId}`}
          onClick={openInPlace}
          aria-controls={id("form")}
          aria-expanded={false}
          className="audit-open lg:hidden inline-flex w-full sm:w-auto items-center justify-center gap-2 h-12 px-6 rounded-full text-base font-medium text-white bg-[image:var(--gradient-brand)] shadow-[0_6px_18px_-6px_rgba(51,0,153,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
        >
          {OPEN_LABEL}
        </a>
      )}
      {collapsible && !open && closedFooter && (
        // The founder and price lines by the button while the form is closed
        // on a phone (inside the card, as `footer`, once it opens). globals.css
        // hides this on :target, when the form opens without JavaScript.
        <div className="audit-closed-extra lg:hidden mt-3">{closedFooter}</div>
      )}

      <div
        className={cn(
          "audit-body rounded-2xl border border-[var(--color-border)] bg-white text-left shadow-[0_24px_60px_-30px_rgba(10,4,32,0.45)]",
          hero ? "p-5 md:p-6" : "p-6 md:p-8",
          collapsible && !open && "hidden lg:block"
        )}
      >
        {/* method and action are the no-JavaScript path (or a submit before
            the script loads): a plain POST to /api/lead, which answers with
            a 303 to /thanks. */}
        <form
          id={id("form")}
          method="post"
          action="/api/lead"
          onSubmit={handleSubmit}
          onInput={handleInput}
          className="space-y-4"
        >
          <input type="hidden" name="source" value={source} />

          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", hero && "lg:grid-cols-3 lg:gap-x-3")}>
            <Field
              ref={firstField}
              id={id("company")}
              label="Business name"
              name="company"
              autoComplete="organization"
              required
            />
            <Field
              id={id("town")}
              label="Town"
              name="town"
              placeholder="e.g. Conroe, TX"
              autoComplete="address-level2"
              required
            />
            <Field
              ref={emailField}
              id={id("email")}
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              invalid={emailInvalid}
              describedBy={emailInvalid ? statusId : undefined}
              className={hero ? "sm:col-span-2 lg:col-span-1" : "sm:col-span-2"}
            />
          </div>

          {hero ? (
            // From lg up the optional extras' toggle and the button share one
            // row, which saves a row of height in the first screen. When the
            // extras open, their two fields appear under the toggle and the
            // button stays where it was.
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
              <OptionalExtras id={id} className="lg:flex-1 lg:min-w-0 lg:pt-3.5" />
              <SubmitButton status={status} className="w-full shrink-0 lg:w-auto" />
            </div>
          ) : (
            <OptionalExtras id={id} />
          )}

          {/* Honeypot: hidden from people and screen readers. /api/lead drops
              any submission that fills it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={id("website")}>Leave this empty</label>
            <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* One wrapper, so the empty status region adds no space (space-y
              spaces the form's children, and this is the last one). */}
          <div>
            {hero ? (
              <PrivacyLine className="text-[0.8125rem]" />
            ) : (
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                <PrivacyLine className="order-2 text-sm sm:text-right" />
                <SubmitButton status={status} className="order-1 w-full shrink-0 sm:w-auto" />
              </div>
            )}
            <div id={statusId} role="status" aria-live="polite" className="[&:not(:empty)]:mt-3">
              {status === "success" && (
                <p className="text-sm text-[var(--color-brand)] font-medium">{LEAD_THANKS}</p>
              )}
              {status === "error" && <p className="text-sm text-red-700">{errorMsg}</p>}
            </div>
          </div>
        </form>

        {footer && (
          <div className={cn("border-t border-[var(--color-border)]", hero ? "mt-3 pt-3" : "mt-5 pt-5")}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Your name and the search you want to show up for: optional, behind a toggle. */
function OptionalExtras({ id, className }: { id: (name: string) => string; className?: string }) {
  return (
    <details className={cn("group", className)}>
      <summary className="inline-flex items-center gap-2 cursor-pointer list-none text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          className="transition-transform group-open:rotate-45"
        >
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add your name or the search you want to show up for (optional)
      </summary>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id={id("name")} label="Your name" name="name" autoComplete="name" />
        <Field
          id={id("message")}
          label="The search you want to show up for"
          name="message"
          placeholder="e.g. dentist near me, ac repair"
        />
      </div>
    </details>
  );
}

function PrivacyLine({ className }: { className?: string }) {
  return (
    <p className={cn("text-[var(--color-ink-soft)] leading-relaxed", className)}>
      We use your details only to send your audit and talk to you about it.{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
        Privacy Policy
      </Link>
    </p>
  );
}

function SubmitButton({ status, className }: { status: Status; className?: string }) {
  // Disabled once sent, so a second click can't send the same request twice;
  // editing any field makes it live again (handleInput).
  return (
    <Button
      type="submit"
      size="lg"
      disabled={status === "submitting" || status === "success"}
      className={className}
    >
      {status === "submitting" ? "Sending…" : status === "success" ? "Sent" : "Send"}
    </Button>
  );
}

function Field({
  ref,
  id,
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  invalid,
  describedBy,
  className,
}: {
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
  /** The server rejected this value: aria-invalid, and the message's id. */
  invalid?: boolean;
  describedBy?: string;
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)] font-medium mb-2"
      >
        {label}
        {required ? (
          <span className="text-[var(--color-brand)] ml-1" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 normal-case tracking-normal text-[var(--color-ink-muted)]">(optional)</span>
        )}
      </label>
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="w-full h-12 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] px-4 text-[1rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 aria-[invalid=true]:border-red-700 transition"
      />
    </div>
  );
}
