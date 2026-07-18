import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  Quote,
  ProseLink,
  ContactLine,
} from "@/components/legal-prose";

export const metadata: Metadata = {
  title: "SMS Consent Language",
  description:
    "The exact consent disclosure customers see at the point of service before Devize sends service-related text messages on behalf of the businesses we serve.",
  alternates: { canonical: "/sms-consent" },
  robots: { index: true, follow: true },
};

export default function SmsConsentPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="SMS Consent Language"
      updated="July 8, 2026"
    >
      <H2>SMS Consent Disclosure</H2>
      <P>
        Devize sends service-related text messages on behalf of the businesses
        we serve. End users provide consent directly to those businesses at the
        point of service: when scheduling service, requesting an estimate, or
        signing a service agreement. The following disclosure appears on
        customer-facing service agreements, intake forms, and quote requests at
        the point where a customer provides their phone number:
      </P>

      <Quote>
        &ldquo;By providing your phone number, you agree that [Business Name] and
        its service providers may contact you by phone call and text message
        regarding your services, appointments, and estimates, including messages
        sent using automated technology. Consent is not a condition of purchase.
        Message frequency varies. Message and data rates may apply. Reply STOP to
        opt out at any time, or HELP for help.&rdquo;
      </Quote>

      <P>
        This consent is specific to each participating business, is not
        transferable or assignable, and applies only to service-related
        communications. Mobile opt-in information is never shared with third
        parties for marketing purposes. See our{" "}
        <ProseLink href="/privacy">Privacy Policy</ProseLink> and{" "}
        <ProseLink href="/sms-terms">SMS Terms &amp; Conditions</ProseLink>.
      </P>

      <ContactLine
        label="Contact"
        parts={[
          "Blake Louis McGuire",
          "admin@devize.ai",
          "(832) 384-5632",
        ]}
      />
    </LegalPage>
  );
}
