import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  ProseLink,
  ContactLine,
} from "@/components/legal-prose";

// Sections 1 and 2 rewritten 2026-10-15 to describe the texts Devize sends
// about an owner's own audit (the /a/ consent line links this page).
// Sections 3 to 8 are the standard carrier clauses, unchanged.
export const metadata: Metadata = {
  title: "SMS Terms & Conditions",
  description:
    "Terms for the text messages Devize sends business owners about their Google Listing and Map Audit: message types, frequency, costs, STOP/HELP, and opt-out.",
  alternates: { canonical: "/sms-terms" },
  robots: { index: true, follow: true },
};

// TODO(Blake, counsel): section 1 still says "local SEO and AEO service". Left as
// is on purpose in the 2026-11-04 rebuild, because this wording may need to match
// the texting program's carrier registration. Check that before changing it.
export default function SmsTermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="SMS Terms & Conditions"
      updated="October 15, 2026"
    >
      <H2>1. Program Description</H2>
      <P>
        Devize (Blake Louis McGuire) texts business owners and managers who ask
        for their Google Listing and Map Audit on a Devize audit page. Messages
        are about your audit: that it is ready, how to get it, and a follow-up
        about Devize&apos;s local SEO and AEO service.
      </P>

      <H2>2. Consent</H2>
      <P>
        You are enrolled only when you enter your mobile number on a Devize
        audit page and agree to the consent line shown there. Consent is not a
        condition of any purchase.
      </P>

      <H2>3. Message Frequency</H2>
      <P>Message frequency varies.</P>

      <H2>4. Costs</H2>
      <P>
        Message and data rates may apply, according to the terms of your mobile
        carrier plan.
      </P>

      <H2>5. Opt-Out</H2>
      <P>
        You can cancel SMS messages at any time by replying <strong>STOP</strong>
        . After you reply STOP, we will send one confirmation message, and you
        will receive no further messages. To resubscribe, reply START.
      </P>

      <H2>6. Help</H2>
      <P>
        Reply <strong>HELP</strong> for assistance, or contact us at
        admin@devize.ai or (832) 384-5632.
      </P>

      <H2>7. Carrier Liability</H2>
      <P>Carriers are not liable for delayed or undelivered messages.</P>

      <H2>8. Privacy</H2>
      <P>
        Your information is handled in accordance with our{" "}
        <ProseLink href="/privacy">Privacy Policy</ProseLink>. No mobile
        information will be shared with third parties or affiliates for marketing
        or promotional purposes.
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
