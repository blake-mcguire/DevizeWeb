import type { ComponentProps } from "react";
import Link from "next/link";
import { AuditForm } from "@/components/audit-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import gate from "@/lib/launch-gate.json";
import { EMAIL } from "@/lib/offer-copy";

/**
 * Whether the site offers its audit request form. It follows the launch gate:
 * while nothing tells a person about a stored request, the form would promise
 * something that doesn't happen, so people get an email link instead. Setting
 * leadFormReachesPerson to true in launch-gate.json brings the form back.
 */
export const LEAD_FORM_LIVE: boolean = gate.leadFormReachesPerson === true;

const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Free map audit")}&body=${encodeURIComponent(
  "Business name:\nTown:\n"
)}`;

/** The audit request box: the form once it reaches a person, an email link until then. */
export function AuditRequest(props: ComponentProps<typeof AuditForm>) {
  if (LEAD_FORM_LIVE) return <AuditForm {...props} />;

  const { slotId, footer, className } = props;
  return (
    <div id={slotId} className={cn("scroll-mt-24", className)}>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8 text-left shadow-[0_24px_60px_-30px_rgba(10,4,32,0.45)]">
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
          Ask for it by email
        </h3>
        <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
          Send your business name and your town to{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]"
          >
            {EMAIL}
          </a>
          , and we&apos;ll answer that email.
        </p>
        <div className="mt-6">
          <Button href={MAILTO} native size="lg" className="w-full sm:w-auto">
            Email us for my audit
          </Button>
        </div>
        <p className="mt-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          Free, nothing to sign. We use your details only to send your audit and talk to
          you about it.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
            Privacy Policy
          </Link>
        </p>
        {footer && <div className="mt-5 border-t border-[var(--color-border)] pt-5">{footer}</div>}
      </div>
    </div>
  );
}
