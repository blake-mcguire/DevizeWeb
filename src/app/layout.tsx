import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
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
    default: "Devize — AI operating systems for home services",
    template: "%s · Devize",
  },
  description:
    "Devize builds AI operating systems for home services businesses — voice agents, dispatch, follow-up, and reviews that run 24/7.",
  openGraph: {
    title: "Devize — AI operating systems for home services",
    description:
      "Voice agents, dispatch, follow-up, reviews. Built for HVAC, plumbing, electrical, and the rest of the trades.",
    url: "https://devize.ai",
    siteName: "Devize",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devize — AI operating systems for home services",
    description:
      "Voice agents, dispatch, follow-up, reviews. Built for HVAC, plumbing, electrical, and the rest of the trades.",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Devize",
  url: "https://devize.ai",
  logo: "https://devize.ai/devize-logo.svg",
  description:
    "AI operating systems for home services businesses — voice agents, dispatch, follow-up, and reviews.",
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
      <body className="min-h-full flex flex-col antialiased">
        <SiteHeader />
        <main className="relative flex-1 z-0">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
