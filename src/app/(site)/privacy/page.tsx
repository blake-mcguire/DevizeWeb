import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  Callout,
  ContactLine,
} from "@/components/legal-prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Devize collects, uses, and protects personal information, including information used for text messaging (SMS).",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="July 8, 2026">
      <P>
        Blake Louis McGuire, doing business as Devize (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; &ldquo;our&rdquo;), operates devize.ai and provides
        customer communication services on behalf of the businesses we serve.
        This policy explains how we collect, use, and protect personal
        information, including information used for text messaging (SMS).
      </P>

      <H2>Information We Collect</H2>
      <P>
        We may collect: name, mobile phone number, email address, service
        history, and appointment details. Phone numbers used for SMS are
        collected either directly from you or from the business you are a
        customer of, on whose behalf we send service-related messages.
      </P>

      <H2>How We Use Information</H2>
      <P>
        We use personal information to send service notifications, appointment
        reminders, estimate updates, and related communications; to respond to
        inquiries; and to operate and improve our services.
      </P>

      <H2>SMS / Text Messaging</H2>
      <P>
        When you provide your mobile number to a business we serve, you may
        receive SMS messages related to your service, appointments, and
        estimates. Message frequency varies. Message and data rates may apply.
        Reply STOP to opt out at any time and HELP for help.
      </P>

      <Callout>
        No mobile information will be shared with, sold to, or rented to third
        parties or affiliates for marketing or promotional purposes at any time.
        Information may be shared only with subcontractors and service providers
        strictly to support our services (for example, our SMS delivery
        platform), and never for their own marketing. SMS opt-in consent and
        phone numbers are never shared with third parties for any purpose other
        than delivering the messages you have agreed to receive.
      </Callout>

      <H2>Data Retention &amp; Security</H2>
      <P>
        We retain personal information only as long as needed to provide our
        services and meet legal obligations, and we use reasonable safeguards to
        protect it.
      </P>

      <H2>Your Choices</H2>
      <P>
        You may opt out of SMS at any time by replying STOP. You may request
        access to or deletion of your information by contacting us.
      </P>

      <H2>Contact Us</H2>
      <ContactLine
        label="Contact"
        parts={[
          "Blake Louis McGuire",
          "307 Irenic Mist Court, Willis, TX 77318",
          "admin@devize.ai",
          "(832) 384-5632",
        ]}
      />
    </LegalPage>
  );
}
