import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

/**
 * The marketing site's chrome. It used to sit in the root layout; it moved
 * here (2026-10-14) so the prospect pages under /a/ render without the
 * marketing nav. URLs and markup are unchanged: route groups add no path
 * segment, and the fragment puts header, main and footer directly in <body>
 * exactly as before.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="relative flex-1 z-0">{children}</main>
      <SiteFooter />
    </>
  );
}
