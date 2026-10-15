import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

/**
 * The marketing site's chrome. It used to sit in the root layout; it moved
 * here (2026-10-14) so the prospect pages under /a/ render without the
 * marketing nav. URLs are unchanged: route groups add no path segment.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // `contents` gives the wrapper no box, so header, main and footer still lay
  // out as direct flex children of <body>. It is there only to carry
  // .site-chrome (the darker muted grey, see globals.css) to the marketing
  // pages and not to /a/.
  return (
    <div className="site-chrome contents">
      <SiteHeader />
      <main className="relative flex-1 z-0">{children}</main>
      <SiteFooter />
    </div>
  );
}
