import Link from "next/link";
import Logo from "@/components/logo";
import { EMAIL, SERVICES } from "@/lib/offer-copy";
import { INDUSTRIES } from "@/lib/industries";

const footerNav = [
  {
    heading: "Services",
    links: [
      { href: "/services", label: "All services" },
      ...SERVICES.map((s) => ({ href: s.href, label: s.title })),
      { href: "/how-we-work", label: "How We Work and Price" },
      { href: "/sample-audit", label: "Sample Audit" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { href: "/industries", label: "All industries" },
      ...INDUSTRIES.map((i) => ({ href: `/industries/${i.slug}`, label: i.name })),
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Service Terms" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/sms-terms", label: "SMS Terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-sm sm:col-span-2 md:col-span-1">
          <Link href="/" aria-label="Devize home" className="inline-block">
            <Logo className="h-8 w-auto" />
          </Link>
          {/* The label stays out of the footer: it sits on every page, including
              the Google Ads one, and always needs its plain sentence beside it. */}
          <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            We tell service businesses what&apos;s worth doing to get found and
            chosen online, do the agreed work each month, and show you what got
            done. Independent. Not connected to Google.
          </p>
          {/* TODO(Blake): this street address may be your home. Confirm you want it on every page. */}
          <address className="mt-5 not-italic text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Devize, 307 Irenic Mist Court, Willis, TX 77318
            <br />
            <a
              href={`mailto:${EMAIL}`}
              className="hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/20 hover:decoration-[var(--color-ink)] transition-colors"
            >
              {EMAIL}
            </a>
          </address>
        </div>

        {footerNav.map((col) => (
          <div key={col.heading}>
            <h4 className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium mb-4">
              {col.heading}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-[var(--color-ink-muted)]">
          <p>© {new Date().getFullYear()} Devize. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
