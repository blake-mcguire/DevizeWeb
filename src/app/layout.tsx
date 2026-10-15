import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://www.devize.ai"),
  title: {
    default: "Local SEO and AEO for Local Service Businesses · Devize",
    template: "%s · Devize",
  },
  description:
    "Devize does local SEO and AEO for dentists, HVAC companies and other local service businesses. See where you show up with a free map audit.",
  openGraph: {
    title:
      "Your prospects are searching for your services, but are they finding you?",
    description:
      "Local SEO and AEO for dentists, HVAC companies and other local service businesses. Start with a free Google map audit.",
    url: "https://www.devize.ai",
    siteName: "Devize",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Your prospects are searching for your services, but are they finding you?",
    description:
      "Local SEO and AEO for dentists, HVAC companies and other local service businesses. Start with a free Google map audit.",
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
      </body>
    </html>
  );
}
