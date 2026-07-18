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
      <body className="min-h-full flex flex-col antialiased">
        <SiteHeader />
        <main className="relative flex-1 z-0">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
