import Link from "next/link";
import Logo from "@/components/logo";

const footerNav = [
  {
    heading: "Product",
    links: [
      { href: "/#services", label: "Services" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/#about", label: "About" },
      { href: "/articles", label: "Articles" },
      { href: "/#contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Link href="/" aria-label="Devize — home" className="inline-block">
            <Logo className="h-8 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            AI operating systems for home services. Voice, dispatch, follow-up,
            and reviews — working while you sleep.
          </p>
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
            for the trades.
          </p>
        </div>
      </div>
    </footer>
  );
}
