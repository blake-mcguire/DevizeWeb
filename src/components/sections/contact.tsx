"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LEAD_THANKS } from "@/lib/lead-copy";

type Status = "idle" | "submitting" | "success" | "error";

const FALLBACK_ERROR =
  "Something went wrong. Please try again, or email admin@devize.ai.";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Held before the await: React clears event.currentTarget once the
    // handler yields, so reading it after the fetch would throw.
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMsg(null);

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // The API's own 400 messages are written for the visitor; anything
        // else (a 500, a proxy page) gets the fallback.
        const body = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(typeof body.error === "string" ? body.error : FALLBACK_ERROR);
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      // Offline or the request never reached the server.
      setStatus("error");
      setErrorMsg(FALLBACK_ERROR);
    }
  }

  return (
    <section id="contact" className="scroll-mt-16 mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Free map audit
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            See the map
            <br />
            your customers see.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-md">
            Tell us your business and your town. We&apos;ll run the searches
            your customers run, show you where you come up and who comes up
            instead, and send you the fixes we&apos;d make first.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-[var(--color-ink-soft)]">
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              Free. Nothing to sign.
            </li>
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              No logins. We only use what anyone can see on Google and on your
              website.
            </li>
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              <span>
                Rather write? Email{" "}
                <a
                  href="mailto:admin@devize.ai"
                  className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]"
                >
                  admin@devize.ai
                </a>
              </span>
            </li>
          </ul>

          <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
            Devize is owned and run by Blake McGuire in Willis, Texas.
          </p>
        </div>

        {/* method and action are the no-JavaScript path (or a submit before the
            script loads): a plain POST to /api/lead, which answers with a 303
            to /thanks. Without them the browser would GET the homepage with
            the visitor's details in the URL. With JavaScript, handleSubmit
            calls preventDefault and posts JSON instead. */}
        <form
          method="post"
          action="/api/lead"
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your name" name="name" autoComplete="name" required />
            <Field label="Business name" name="company" autoComplete="organization" required />
          </div>
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="What you do"
              name="trade"
              placeholder="e.g. dentist, HVAC"
            />
            <Field
              label="Town"
              name="town"
              placeholder="e.g. Conroe, TX"
              autoComplete="address-level2"
              required
            />
          </div>

          {/* Honeypot: hidden from people and screen readers. /api/lead drops
              any submission that fills it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Leave this empty</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium mb-2"
            >
              The search you most want to show up for
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-[0.95rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition"
              placeholder="e.g. dentist near me, ac repair"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
              We use this only to send your audit and talk to you about it. We
              don&apos;t sell it.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-[var(--color-ink)]"
              >
                Privacy Policy
              </Link>
            </p>
            {/* Disabled once sent, so a second click can't send the same
                request twice. */}
            <Button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="shrink-0"
            >
              {status === "submitting"
                ? "Sending…"
                : status === "success"
                  ? "Sent"
                  : "Send me my audit"}
            </Button>
          </div>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="text-sm text-[var(--color-brand)] font-medium pt-2">
                {LEAD_THANKS}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600 pt-2">{errorMsg}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium mb-2"
      >
        {label}
        {required && <span className="text-[var(--color-brand)] ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-[0.95rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition"
      />
    </div>
  );
}
