import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  Quote,
  ProseLink,
  ContactLine,
} from "@/components/legal-prose";

/**
 * Rewritten 2026-10-15. It used to show a "[Business Name]" opt-in for texts
 * sent on behalf of client businesses, a flow that does not exist. It now
 * shows the consent line the /a/ audit form displays (copy.consent in
 * src/app/a/[token]/copy.ts), word for word. Keep the two in step.
 *
 * Kept live but noindex and out of the sitemap and footer, in case a Twilio
 * 10DLC campaign cites this URL as opt-in proof. Check the Twilio console: if
 * a campaign cites it, update the campaign description to match; if nothing
 * does, delete this route.
 */
export const metadata: Metadata = {
  title: "SMS Consent Language",
  description:
    "The consent line a business owner sees on a Devize audit page before Devize calls or texts about their audit.",
  alternates: { canonical: "/sms-consent" },
  robots: { index: false, follow: true },
};

export default function SmsConsentPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="SMS Consent Language"
      updated="October 15, 2026"
    >
      <H2>SMS Consent Disclosure</H2>
      <P>
        Devize texts business owners and managers only after they ask for their
        Google Listing and Map Audit on a Devize audit page. The form there asks
        for a name and a mobile number, and shows this line under the button,
        followed by links to our SMS Terms, Privacy Policy and Service Terms:
      </P>

      <Quote>
        &ldquo;By sending this, you agree that Blake McGuire from Devize may call
        or text you about your audit. Message and data rates may apply; reply
        STOP to opt out of texts.&rdquo;
      </Quote>

      <P>
        On some audit pages the line also names the person at Devize who sent
        the audit, in the form &ldquo;[First name] or Blake McGuire from
        Devize.&rdquo; Mobile opt-in information is never shared with third
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
