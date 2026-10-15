import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  ProseLink,
  ContactLine,
} from "@/components/legal-prose";

/**
 * Service Terms v2.0 (2026-10-15): a short version for the free audit and the
 * monthly local SEO and AEO service. It replaces v1.2 (the email reactivation
 * "Revenue Recovery Sprint", a held-back service), which is kept word for word
 * at /terms/v1-2 for anyone who accepted it. Draft wording: have counsel review
 * it before the first client signs.
 *
 * 2026-10-15, site pass 2: Blake decided the service is month to month, and
 * the site now says "Month to month. Cancel any time." Section 3.5 is the
 * DRAFT clause for that (cancellation takes effect at the end of the month
 * already paid for), and 3.1 no longer leaves the term to the Order. The fee
 * itself still lives in the Order. DRAFT: Blake and counsel to confirm 3.1
 * and 3.5, in particular billing in advance and no part-month refunds.
 *
 * Pass 2 review (2026-10-15), also DRAFT: 3.1 ties the standard fee to the
 * list published on the price card; 3.2 words the directory work the way the
 * site does (checked and corrected, the owner claims what only the owner can
 * change); 3.4 makes the review sign-off a one-time sign-off on the wording,
 * which is what lets the site promise replies within 2 business days; 3.5
 * covers a start on the 29th to 31st. Production builds stay blocked until
 * termsConfirmed is true in src/lib/launch-gate.json.
 */
export const metadata: Metadata = {
  title: "Service Terms",
  description:
    "Service Terms for Devize's free Google Listing and Map Audit and monthly local SEO and AEO service.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Service Terms"
      updated="October 15, 2026"
      version="Version 2.0"
    >
      <H2 id="s1">1. Who we are</H2>
      <P>
        &ldquo;<strong>Devize</strong>&rdquo; (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is the trade name of Blake Louis McGuire, a sole proprietor based in Willis, Texas. These Service Terms (the &ldquo;<strong>Terms</strong>&rdquo;) cover the free Google Listing and Map Audit and the monthly local SEO and AEO service Devize provides to businesses (&ldquo;<strong>Client</strong>,&rdquo; &ldquo;you&rdquo;).
      </P>

      <H2 id="s2">2. The free Google Listing and Map Audit</H2>
      <P>
        2.1 The audit is free. Asking for one, or receiving one, does not create any obligation to buy anything from Devize.
      </P>
      <P>
        2.2 The audit is built from public information: Google search results, your Google Business Profile, and your website. It shows what we found when we ran the searches. Google results change often and differ by device, place and time, so a later search can show something different.
      </P>

      <H2 id="s3">3. The monthly local SEO and AEO service</H2>
      <P>
        3.1 <strong>Your proposal or order.</strong>{" "}The monthly service is governed by the written proposal or order you accept (the &ldquo;<strong>Order</strong>&rdquo;), together with these Terms. The Order sets out the work and the flat monthly fee. The work for the standard monthly fee is the list published at devize.ai/#price on the date you accept the Order. If the Order and these Terms conflict, the Order controls, except for section 3.5: the service is month to month whatever the Order says.
      </P>
      <P>
        3.2 <strong>The work.</strong>{" "}Depending on your Order, the work can include: your Google Business Profile (categories, services, description, hours, photos, posts and questions); a routine for asking customers for reviews and replying to them; service and town pages on your website; your business details checked on the main directories and corrected where Devize can (some directories let only the owner make changes, and you make those); clear facts about your business that search engines and AI assistants can read; and a monthly rerun of the same map searches as your progress report.
      </P>
      <P>
        3.3 <strong>Access and ownership.</strong>{" "}You add Devize as a manager on your Google Business Profile, and give us access to your website or put us in touch with the person who runs it. You remain the owner of your Google Business Profile, your website and your accounts, and you can remove Devize&apos;s access at any time.
      </P>
      <P>
        3.4 <strong>Your part.</strong>{" "}You give us accurate facts about your business, photos of your work where you can, and a one-time sign-off, at the start, on how we reply to reviews in your name.
      </P>
      <P>
        3.5 <strong>Month to month, and cancelling.</strong>{" "}The monthly service runs month to month, with no minimum term. Each month of service starts on the same day of the month as the first, or on the last day of a shorter month. The flat monthly fee is charged at the start of each month of service, in advance. You or Devize can cancel at any time by email (section 7.3). A cancellation takes effect at the end of the month already paid for: the work continues until then, no further fee is charged after it, and the fee for that month is not refunded in part. When the service ends, you remove Devize as a manager of your Google Business Profile and from your website (or Devize removes itself), and everything Devize made for you, such as pages, posts and changes to your listing, stays yours.
      </P>

      <H2 id="s4">4. No guarantee of results</H2>
      <P>
        4.1 Devize does not guarantee any ranking, position on Google&apos;s map, appearance in an AI answer (including Google&apos;s AI features and assistants such as ChatGPT), number of calls, customers, or revenue. Google and the companies behind AI assistants decide what they show, and Devize does not control them.
      </P>
      <P>
        4.2 EXCEPT AS EXPRESSLY STATED IN YOUR ORDER, THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND DEVIZE DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED.
      </P>

      <H2 id="s5">5. Reviews</H2>
      <P>
        5.1 Devize will not write, buy, or post fake reviews, will not offer anything in exchange for a review, and will not ask only satisfied customers for reviews. You agree not to ask Devize to do any of these things.
      </P>

      <H2 id="s6">6. Your information</H2>
      <P>
        6.1 We handle personal information as described in our{" "}
        <ProseLink href="/privacy">Privacy Policy</ProseLink>.
      </P>

      <H2 id="s7">7. General</H2>
      <P>
        7.1 <strong>Governing law &amp; venue.</strong>{" "}Texas law governs; exclusive venue lies in Montgomery County, Texas.
      </P>
      <P>
        7.2 <strong>Changes.</strong>{" "}Devize may update these Terms by posting a new version on this page. Each engagement is governed by the version in effect when it was accepted.
      </P>
      <P>
        7.3 <strong>Notices.</strong>{" "}Email counts as written notice: to Devize at{" "}
        <ProseLink href="mailto:admin@devize.ai">admin@devize.ai</ProseLink>; to Client at the email given in the Order.
      </P>

      <ContactLine
        label="Questions"
        parts={[
          "Blake McGuire",
          "admin@devize.ai",
          "(832) 384-5632",
        ]}
      />
    </LegalPage>
  );
}
