"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Get in touch
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            Let&apos;s run the numbers
            <br />
            on your shop.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-md">
            Tell us about your business. We&apos;ll come back with a short
            estimate of recovered revenue and a 30-minute walkthrough.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-[var(--color-ink-soft)]">
            <li className="flex items-center gap-3">
              <span className="brand-dot" aria-hidden="true" />
              No commitments. No sales pitch.
            </li>
            <li className="flex items-center gap-3">
              <span className="brand-dot" aria-hidden="true" />
              We respond within one business day.
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your name" name="name" required />
            <Field label="Company" name="company" required />
          </div>
          <Field label="Work email" name="email" type="email" required />
          <Field label="Trade" name="trade" placeholder="HVAC, plumbing, electrical, …" />
          <Field label="Monthly call volume" name="callVolume" placeholder="e.g. ~600" />

          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium mb-2">
              What are you hoping to solve?
            </label>
            <textarea
              name="message"
              rows={4}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-[0.95rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition"
              placeholder="Missed calls, slow follow-up, something else…"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--color-ink-muted)]">
              We&apos;ll never share your info.
            </p>
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send inquiry"}
            </Button>
          </div>

          {status === "success" && (
            <p className="text-sm text-[var(--color-brand)] font-medium pt-2">
              Got it. We&apos;ll be in touch within a business day.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 pt-2">{errorMsg}</p>
          )}
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
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
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
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-[0.95rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition"
      />
    </div>
  );
}
