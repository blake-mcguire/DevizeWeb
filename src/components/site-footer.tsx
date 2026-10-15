import Link from "next/link";
import Logo from "@/components/logo";

const footerNav = [
  {
    heading: "The service",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#services", label: "Local SEO" },
      { href: "/#aeo", label: "AEO" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#contact", label: "Free map audit" },
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
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_repeat(2,1fr)]">
        <div className="max-w-sm">
          <Link href="/" aria-label="Devize home" className="inline-block">
            <Logo className="h-8 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Local SEO and AEO for owner-run local service businesses. We help
            the people searching near you find you, on Google&apos;s map and in
            AI answers.
          </p>
          <address className="mt-5 not-italic text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Devize, 307 Irenic Mist Court, Willis, TX 77318
            <br />
            <a
              href="mailto:admin@devize.ai"
              className="hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/20 hover:decoration-[var(--color-ink)] transition-colors"
            >
              admin@devize.ai
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
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-ink-muted)]">
          <p>© {new Date().getFullYear()} Devize. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with
            <span className="brand-dot" aria-hidden="true" />
            for local service businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
