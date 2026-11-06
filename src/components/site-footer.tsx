import Link from "next/link";
import Logo from "@/components/logo";
import { INDUSTRIES } from "@/lib/industries";
import { ADVERTISER_GUIDE } from "@/lib/menu";
import { EMAIL, FINE_PRINT } from "@/lib/offer-copy";
import { SERVICE_LINKS } from "@/lib/services";

const footerNav = [
  {
    heading: "What we do",
    links: [...SERVICE_LINKS, { href: "/what-we-do", label: "How we work" }],
  },
  {
    heading: "Industries",
    links: [...INDUSTRIES.map((i) => ({ href: `/industries/${i.slug}`, label: i.name })), { href: "/industries", label: "All industries" }],
  },
  {
    heading: "Devize",
    links: [
      { href: "/about", label: "About" },
      // The sample page is reachable from here only (Blake, 5 Nov: the audit isn't pushed as a product).
      { href: "/sample-audit", label: "Sample Audit" },
      { href: "/#contact", label: "Get in touch" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Service Terms" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/sms-terms", label: "SMS Terms" },
      // Google's third-party policy: this notice must be linked somewhere clearly
      // visible on the site, such as a footer.
      // TODO(Blake): which Vecteezy licence is public/hero-bg.jpg under? It's on every hero.
      // The licence PDF that came with a sibling Vecteezy file says a Free License download
      // must credit "Vecteezy.com", with a link where possible, unless you have Pro. If Free,
      // add { href: "https://www.vecteezy.com", label: "Images: Vecteezy.com" } here.
      { href: ADVERTISER_GUIDE.url, label: ADVERTISER_GUIDE.label },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="on-navy relative z-10 bg-[var(--color-navy)]">
      <div className="mx-auto grid w-full max-w-[76rem] grid-cols-1 gap-10 px-5 py-16 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.35fr_1.25fr_1fr_0.8fr_1fr]">
        <div className="max-w-xs sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Devize home" className="inline-block">
            <Logo onDark className="h-10 w-auto" />
          </Link>
          {/* The label stays out of the footer: it would sit on every page, and near
              Google Ads "partner" can read as Google's own program. */}
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/85">We help local service-based businesses turn clicks into clients.</p>
          {/* TODO(Blake): the street address may be your home, so every page shows only
              the town for now, and the home page JSON-LD drops the street and zip. Say
              if you want them shown. The privacy page's contact line and the /a/ footer
              still carry the full address. */}
          <address className="mt-5 text-[0.9375rem] not-italic leading-relaxed text-white/85">
            Devize, Willis, TX
            <br />
            <a href={`mailto:${EMAIL}`} className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
              {EMAIL}
            </a>
          </address>
        </div>

        {footerNav.map((col) => (
          <div key={col.heading}>
            <h2 className="mb-4 text-[1.0625rem] font-extrabold tracking-[-0.02em] text-white">{col.heading}</h2>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.9375rem] leading-snug text-white/85 transition-colors hover:text-white hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto w-full max-w-[76rem] px-5 py-6 text-xs text-white/70 md:px-6">
          {/* The fine print's one home on the site. The fuller versions are in Terms. */}
          <p className="mb-3 max-w-4xl leading-relaxed">{FINE_PRINT.join(" ")}</p>
          <p>© {new Date().getFullYear()} Devize. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
