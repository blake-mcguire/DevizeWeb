import type { Metadata } from "next";
import Logo from "@/components/logo";
import { copy } from "./[token]/copy";

/**
 * The prospect audit pages' own chrome: the logo, the content, the postal
 * address. No marketing nav and no link into the homepage, which still
 * carries placeholder clients and the old offer.
 *
 * Kept out of search three ways: this metadata, the X-Robots-Tag header in
 * next.config.ts, and the /a/ disallow in robots.ts.
 */
export const metadata: Metadata = {
  title: copy.pageTitle,
  description: null,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
  openGraph: { title: "Devize", siteName: "Devize", type: "website" },
  twitter: null,
  alternates: null,
};

const LEGAL = [
  { href: "/privacy", label: copy.legalLinks.privacy },
  { href: "/terms", label: copy.legalLinks.terms },
  { href: "/sms-terms", label: copy.legalLinks.smsTerms },
];

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="relative z-10">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 pt-5 pb-1">
          <Logo className="h-7 w-auto" />
        </div>
      </header>
      <main className="relative flex-1 z-0">{children}</main>
      <footer className="relative z-10 border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[var(--color-ink-muted)]">
          <p>{copy.footerAddress}</p>
          <nav className="flex gap-4">
            {LEGAL.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="hover:text-[var(--color-ink)] underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
