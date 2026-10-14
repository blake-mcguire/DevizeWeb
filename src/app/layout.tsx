import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devize.ai"),
  title: {
    default: "Devize: Revenue Recovery & Retention for home services",
    template: "%s · Devize",
  },
  description:
    "Devize builds Revenue Recovery and Revenue Retention systems for home-service businesses: every call answered 24/7 and booked into the schedule, every customer followed up and won back.",
  openGraph: {
    title: "Devize: Revenue Recovery & Retention for home services",
    description:
      "Every call answered and booked, 24/7. Every customer followed up and kept. Built for HVAC, plumbing, electrical, and the rest of the trades.",
    url: "https://devize.ai",
    siteName: "Devize",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devize: Revenue Recovery & Retention for home services",
    description:
      "Every call answered and booked, 24/7. Every customer followed up and kept. Built for HVAC, plumbing, electrical, and the rest of the trades.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const GTM_ID = "GTM-NMJGLMFD";

// Skipped on /a/<token> (the prospect audit pages): the token in that URL is
// the only key to the page, so it is not handed to analytics, and the page
// stays light. The page's own view beacon measures visits there.
const gtmScript = `(function(w,d,s,l,i){if(w.location.pathname.indexOf('/a/')===0)return;w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Devize",
  url: "https://devize.ai",
  logo: "https://devize.ai/devize-logo.svg",
  description:
    "Devize builds Revenue Recovery and Revenue Retention systems for home-service businesses: 24/7 AI call answering that qualifies callers and books jobs into the schedule, plus post-job follow-up, review capture, appointment reminders, and maintenance-plan reactivation.",
  email: "admin@devize.ai",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Site chrome (header, main, footer) lives in (site)/layout.tsx so the
            prospect pages under /a/ can render without the marketing nav. */}
        {children}
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
