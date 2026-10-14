import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  ProseLink,
  ContactLine,
} from "@/components/legal-prose";

export const metadata: Metadata = {
  title: "SMS Terms & Conditions",
  description:
    "Terms for the SMS text-message program Devize operates on behalf of the businesses we serve: message types, frequency, costs, STOP/HELP, and opt-out.",
  alternates: { canonical: "/sms-terms" },
  robots: { index: true, follow: true },
};

export default function SmsTermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="SMS Terms & Conditions"
      updated="July 8, 2026"
    >
      <H2>1. Program Description</H2>
      <P>
        Blake Louis McGuire (&ldquo;Devize&rdquo;) sends SMS text messages on
        behalf of the businesses we serve. Messages are informational and
        service-related, including appointment scheduling and reminders,
        service-plan status, estimate follow-ups, and confirmations, sent to
        existing customers of those businesses who have provided their mobile
        number.
      </P>

      <H2>2. Consent</H2>
      <P>
        You are enrolled only after providing your mobile number to a
        participating business and agreeing to receive calls and texts about
        your services. Consent to receive messages is not a condition of any
        purchase.
      </P>

      <H2>3. Message Frequency</H2>
      <P>
        Message frequency varies based on your service activity and
        interactions.
      </P>

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
