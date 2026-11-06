import Link from "next/link";
import Logo from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { NavMenu } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/lib/industries";
import { EMAIL } from "@/lib/offer-copy";
import { SERVICE_LINKS } from "@/lib/services";

const MENUS = [
  { label: "What We Do", href: "/what-we-do", allLabel: "How we work", items: SERVICE_LINKS },
  {
    label: "Industries",
    href: "/industries",
    allLabel: "All industries",
    items: INDUSTRIES.map((i) => ({ href: `/industries/${i.slug}`, label: i.name })),
  },
];

const LINKS = [{ href: "/about", label: "About" }];

// The form lives in one place: the last section of the home page.
const CTA = { href: "/#contact", label: "Get in touch" };

export default function SiteHeader() {
  return (
    <>
      {/* Thin bar first, so the white nav under it can stay stuck to the top on scroll. */}
      <div className="bg-[var(--color-navy)] text-white">
        <div className="mx-auto flex h-9 w-full max-w-[76rem] items-center justify-between gap-4 px-5 text-[0.8125rem] md:px-6">
          <p className="text-white/80">Willis, Texas</p>
          <a href={`mailto:${EMAIL}`} className="font-medium hover:underline hover:underline-offset-4">
            {EMAIL}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex h-[4.25rem] w-full max-w-[76rem] items-center justify-between gap-6 px-5 md:px-6 lg:h-20">
          <Link href="/" aria-label="Devize home" className="flex items-center">
            <Logo className="h-9 w-auto lg:h-11" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {MENUS.map((m) => (
                <NavMenu key={m.href} {...m} />
              ))}
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-brand)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* native: a plain <a>. On the home page a next/link to /#contact scrolls only the
                first time, because a second click finds the address already there and does
                nothing. The browser's own anchor scrolls every time. */}
            <Button href={CTA.href} native size="sm" className="max-[367px]:!hidden lg:h-12 lg:px-6 lg:text-base">
              {CTA.label}
            </Button>
            <MobileNav menus={MENUS} links={LINKS} cta={CTA} />
          </div>
        </div>
      </header>
    </>
  );
}
