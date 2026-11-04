import { AuditForm } from "@/components/audit-form";
import { FounderChip } from "@/components/founder";
import { COVERAGE, EMAIL, PRICE } from "@/lib/offer-copy";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-start">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Free map audit
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            See your own map first.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-md">
            Tell us your business, your town and where to send it. We&apos;ll
            run the searches your customers run, show you where you come up and
            who comes up instead, and send you the fixes we&apos;d make first.
          </p>

          <ul className="mt-8 space-y-3 text-[0.95rem] text-[var(--color-ink-soft)]">
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              {PRICE.audit} Nothing to sign.
            </li>
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              No logins. We only use what anyone can see on Google and on your
              website.
            </li>
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              <span>{COVERAGE.today} {COVERAGE.others}</span>
            </li>
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              {PRICE.ctaLine}
            </li>
            <li className="flex gap-3">
              <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
              <span>
                Rather write? Email{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]"
                >
                  {EMAIL}
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* slotId "audit": the anchor older links and the header button use. */}
        <AuditForm
          slotId="audit"
          source="contact"
          className="min-w-0"
          footer={<FounderChip />}
        />
      </div>
    </section>
  );
}
