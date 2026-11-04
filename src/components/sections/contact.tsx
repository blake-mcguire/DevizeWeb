import { AuditRequest } from "@/components/audit-request";
import { FounderBlock } from "@/components/founder";
import { COVERAGE } from "@/lib/offer-copy";

/** The home page's last section: who's behind Devize, and how to reach us. */
export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        <FounderBlock className="min-w-0" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Reach us
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight text-[var(--color-ink)] font-medium">
            See your own map first.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Tell us your business and your town. We&apos;ll run the searches your
            customers run, show you who comes up instead, and send the fixes
            we&apos;d make first.
          </p>
          {/* slotId "audit": the anchor older links use. */}
          <AuditRequest slotId="audit" source="contact" className="mt-6" />
          <p className="mt-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            {COVERAGE.today} {COVERAGE.others}
          </p>
        </div>
      </div>
    </section>
  );
}
