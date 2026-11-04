import Link from "next/link";
import Logo from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/what-we-do", label: "What We Do" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/sample-audit", label: "Sample Audit" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-surface-soft)]/80 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" aria-label="Devize home" className="flex items-center -ml-1">
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/#contact" size="sm">
            Free map audit
          </Button>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
