"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { LEAD_THANKS } from "@/lib/lead-copy";

type Status = "idle" | "submitting" | "success" | "error";

const FALLBACK_ERROR =
  "Something went wrong. Please try again, or email admin@devize.ai.";

const OPEN_LABEL = "Get my free map audit";

/**
 * The audit request form: three fields (business name, town, email), with
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
 * handleSubmit posts JSON and shows the result in place.
 */
export function AuditForm({
  slotId,
  source,
  collapsible = false,
  layout = "stacked",
  footer,
  className,
}: {
  /** The wrapper's id: the anchor the open button and the header link use. */
  slotId: string;
  source: "hero" | "contact";
  collapsible?: boolean;
  /** "hero": business name, town and email on one row from lg up. */
  layout?: "hero" | "stacked";
  /** Shown under the form inside the card: the founder line and the price line. */
  footer?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(!collapsible);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

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
          className="space-y-4"
        >
          <input type="hidden" name="source" value={source} />

          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", hero && "lg:grid-cols-3")}>
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
              id={id("email")}
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={hero ? "sm:col-span-2 lg:col-span-1" : "sm:col-span-2"}
            />
          </div>

          <details className="group">
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

          {/* Honeypot: hidden from people and screen readers. /api/lead drops
              any submission that fills it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={id("website")}>Leave this empty</label>
            <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <p className="order-2 text-sm text-[var(--color-ink-soft)] leading-relaxed sm:text-right">
              Free, nothing to sign. We use your details only to send your
              audit and talk to you about it.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-[var(--color-ink)]"
              >
                Privacy Policy
              </Link>
            </p>
            <SubmitButton status={status} className="order-1 w-full shrink-0 sm:w-auto" />
          </div>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="text-sm text-[var(--color-brand)] font-medium">{LEAD_THANKS}</p>
            )}
            {status === "error" && <p className="text-sm text-red-700">{errorMsg}</p>}
          </div>
        </form>

        {footer && (
          <div className="mt-5 border-t border-[var(--color-border)] pt-5">{footer}</div>
        )}
      </div>
    </div>
  );
}

function SubmitButton({ status, className }: { status: Status; className?: string }) {
  // Disabled once sent, so a second click can't send the same request twice.
  return (
    <Button
      type="submit"
      size="lg"
      disabled={status === "submitting" || status === "success"}
      className={className}
    >
      {status === "submitting" ? "Sending…" : status === "success" ? "Sent" : "Send me my audit"}
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
  className,
}: {
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
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
        className="w-full h-12 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] px-4 text-[1rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition"
      />
    </div>
  );
}
