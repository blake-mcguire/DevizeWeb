import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  ProseLink,
  Callout,
  ContactLine,
} from "@/components/legal-prose";

// Rewritten 2026-10-15: it covers what the site and the /a/ audit pages actually
// collect. 2026-11-04: only the service description changed. Draft wording: have
// counsel review it, including whether the Google Ads add-on changes anything. Keep it in step with /api/lead, /api/audit-request,
// /api/audit-view and the GTM snippet in the root layout.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Devize collects, uses and shares personal information on devize.ai and on Devize audit pages, including mobile numbers used for texts about your audit.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="November 4, 2026">
      <P>
        Blake Louis McGuire, doing business as Devize (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; &ldquo;our&rdquo;), operates devize.ai and provides
        SEO, review management and Google Ads management to service businesses.
        This policy explains
        what personal information we collect on this website and on Devize
        audit pages, how we use it, and who we share it with.
      </P>

      <H2>Information We Collect</H2>
      <P>
        <strong>When you ask for an audit on this website:</strong>{" "}your
        business name, town and email, and, if you add them, your name and the
        search you want to show up for. We also keep the time of the request,
        which of the page&apos;s two forms you used, and your browser&apos;s
        user agent.
      </P>
      <P>
        <strong>On a Devize audit page:</strong>{" "}your name, your mobile number,
        and a record of the consent you gave (the consent line shown next to
        the button, and when you sent the form). We also record when an audit
        page is opened.
      </P>
      <P>
        <strong>Public information about businesses:</strong>{" "}to build audits,
        we collect information businesses publish, such as Google search
        results, Google Business Profile details, reviews, photos and website
        content. To send a business its audit, we may also collect business
        contact details, such as an owner&apos;s or manager&apos;s name, work
        email and phone number, from business websites, public directories and
        business data providers.
      </P>
      <P>
        <strong>Analytics:</strong>{" "}this website&apos;s marketing pages use
        Google Tag Manager, which can load Google analytics tools that use
        cookies to measure how visitors use the site, such as pages viewed and
        the type of browser and device. Google Tag Manager does not run on
        audit pages. Like most websites, our hosting provider also keeps
        standard server logs, such as IP addresses and the pages requested.
      </P>

      <H2>How We Use Information</H2>
      <P>
        We use personal information to prepare and send your audit, to contact
        you about it and about Devize&apos;s service, and to run, secure and
        improve this website. We do not sell personal information.
      </P>

      <H2>Who We Share It With</H2>
      <P>
        We share personal information only with service providers that help us
        run Devize: hosting and storage (Vercel), analytics (Google), our email
        provider, and our phone and text provider when we call or text you. We
        may also disclose information when the law requires it.
      </P>

      <H2>Calls and Text Messages</H2>
      <P>
        If you give your mobile number on a Devize audit page and agree to the
        consent line shown there, Devize may call or text you about your audit.
        Message frequency varies. Message and data rates may apply. Reply STOP
        to opt out at any time and HELP for help. See our{" "}
        <ProseLink href="/sms-terms">SMS Terms</ProseLink>.
      </P>

      <Callout>
        No mobile information will be shared with, sold to, or rented to third
        parties or affiliates for marketing or promotional purposes at any time.
        Information may be shared only with subcontractors and service providers
        strictly to support our services (for example, our SMS delivery
        platform), and never for their own marketing. SMS opt-in consent and
        phone numbers are never shared with third parties for any purpose other
        than delivering the messages about your audit that you have agreed to
        receive.
      </Callout>

      <H2>Do Not Track</H2>
      <P>
        Some browsers send a &ldquo;Do Not Track&rdquo; signal. There is no
        common standard for how to respond to it, so this website does not
        respond to Do Not Track signals.
      </P>

      <H2>Data Retention &amp; Security</H2>
      <P>
        We retain personal information only as long as needed to provide our
        services and meet legal obligations, and we use reasonable safeguards to
        protect it.
      </P>

      <H2>Your Choices</H2>
      <P>
        You may opt out of texts at any time by replying STOP. You may ask to
        see, correct or delete your information by contacting us.
      </P>

      <H2>Changes to This Policy</H2>
      <P>
        If we change this policy, we will post the new version on this page
        with a new date.
      </P>

      <H2>Contact Us</H2>
      <ContactLine
        label="Contact"
        parts={[
          "Blake Louis McGuire",
          // TODO(Blake, counsel): keep the street address here? The footer now shows only the town.
          "307 Irenic Mist Court, Willis, TX 77318",
          "admin@devize.ai",
          "(832) 384-5632",
        ]}
      />
    </LegalPage>
  );
}
