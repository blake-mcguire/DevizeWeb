import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  ProseLink,
  ContactLine,
} from "@/components/legal-prose";

/**
 * TODO(Blake, counsel): 2026-11-05, the menu replaced the tiers, and the fine print moved
 * here and to the footer. Every change is flagged with a DRAFT (2026-11-05) comment
 * beside it and none of it has been read by a lawyer: 1 (what's covered), 3.1 and 3.2 (the
 * menu's list), 3.3 (Google Business Profile is free), 3.6 (the tool caveat stays here,
 * and only works while no page claims everything stays), 3.7 (a placeholder ads clause
 * for all three ad plans, including the percentage fee), 3.8 (was "Services in pilot", now
 * add-ons, with the AI, recording and text notices), 3.9 (new: healthcare and legal, and
 * not legal advice), 4.1 (names ad platforms) and 5.1 (asks everyone the same way).
 * Counsel still needs to write real clauses for ads, percentage fees, voice, text and
 * lead data: spend and billing, who owns the account, who pays if a mistake overspends,
 * access levels. A lawyer should read percentage pricing for law firms against the Texas
 * solicitation rule. launch-gate.json's note on termsConfirmed still lists these clauses
 * by number and was left alone on purpose. For the Order or contract, not this page:
 * a separate Google account per advertiser; a monthly report with costs, clicks and
 * impressions; the owner keeps ownership of the profile, with control back within 7
 * business days, and profile data reported separately and never shared with other
 * customers; and written consent naming automatic posting if replies ever go through
 * Google's API (claim_bank.md section 4).
 *
 * 2026-11-04, the rebuild changed only what the positioning
 * made wrong: the service's name (1, 3), the list of work (3.2), a short add-on
 * clause (3.7) and the no-guarantee list (4.1). All of it is flagged, not decided.
 * Second pass, same day, for the three tiers: 3.1 points at /services, 3.2 lists
 * Tier 1 as Blake wrote it, 3.5 and 3.6 carry the changed "what stays yours" promise
 * (TODO(Blake) in offer-copy.ts), 3.7 states the fee disclosure Google's policy
 * asks for, and 3.8 is new and keeps pilots out unless an Order says otherwise.
 * Counsel still needs to write a real Google Ads clause. It should cover ad spend
 * and billing, who owns the account, who pays if a mistake overspends, access
 * levels, and no guarantee of leads, costs or positions. The website rebuild
 * clause came out on 2026-11-04, because the rebuild is not built or offered, so
 * the add-on clause moved from 3.8 to 3.7. Also decide whether /terms/v1-2 stays
 * public. The price lives on devize.ai/services and in the Order, not here.
 *
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
 * which is what lets the site promise replies within a week; 3.5
 * covers a start on the 29th to 31st. Production builds stay blocked until
 * termsConfirmed is true in src/lib/launch-gate.json.
 */
export const metadata: Metadata = {
  title: "Service Terms",
  description:
    "Service Terms for Devize's free Google Listing and Map Audit, monthly SEO and review management, ads management and add-ons.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Service Terms"
      // Published on Blake's instruction, 2026-11-05. Counsel has not read these yet.
      updated="November 5, 2026"
      version="Version 2.0"
    >
      <H2 id="s1">1. Who we are</H2>
      <P>
        {/* DRAFT (2026-11-05): covers the menu, not the old add-on. Blake and counsel to confirm. */}
        &ldquo;<strong>Devize</strong>&rdquo; (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is the trade name of Blake Louis McGuire, a sole proprietor based in Willis, Texas. These Service Terms (the &ldquo;<strong>Terms</strong>&rdquo;) cover the free Google Listing and Map Audit, the monthly SEO and review management service, and the ads management and add-on services Devize provides to businesses (&ldquo;<strong>Client</strong>,&rdquo; &ldquo;you&rdquo;).
      </P>

      <H2 id="s2">2. The free Google Listing and Map Audit</H2>
      <P>
        2.1 The audit is free. Asking for one, or receiving one, does not create any obligation to buy anything from Devize.
      </P>
      <P>
        2.2 The audit is built from public information: Google search results, your Google Business Profile, and your website. It shows what we found when we ran the searches. Google results change often and differ by device, place and time, so a later search can show something different.
      </P>

      <H2 id="s3">3. The monthly SEO and review management service</H2>
      <P>
        3.1 <strong>Your proposal or order.</strong>{" "}{/* DRAFT (2026-11-05): "Tier 1 list" became the SEO and review management list. */}The monthly service is governed by the written proposal or order you accept (the &ldquo;<strong>Order</strong>&rdquo;), together with these Terms. The Order sets out the work and the flat monthly fee. The work for the standard monthly fee is the SEO and review management list published at devize.ai/services/seo-and-review-management on the date you accept the Order. If the Order and these Terms conflict, the Order controls, except for section 3.5: the service is month to month whatever the Order says.
      </P>
      <P>
        3.2 <strong>The work.</strong>{" "}{/* DRAFT (2026-11-05): Blake and counsel to confirm. It must match SEO_LINES in src/lib/menu.ts. The count of citations or fixes is left to the Order, because the number on the menu is still TODO(Blake). */}Depending on your Order, the work can include: managing your Google Business Profile, including corrections to wrong facts and weekly posts; a review request system, with responses to reviews, which a person reads before they post; the number of citations or on-page fixes each month stated in your Order; a monthly geo-grid report showing map rank movement, from the same searches and the same spots; and a monthly count of the work done. Places on a map can move on their own, so a report shows movement, not its cause.
      </P>
      <P>
        3.3 <strong>Access and ownership.</strong>{" "}You add Devize as a manager on your Google Business Profile, and give us access to your website or put us in touch with the person who runs it. You remain the owner of your Google Business Profile, your website and your accounts, and you can remove Devize&apos;s access at any time. {/* DRAFT (2026-11-05): new sentence. Google's Business Profile third-party policy requires telling customers it's free, with the fee in writing before managing and on invoices. Blake and counsel to confirm. */}Google Business Profile is free to use. Devize&apos;s fee is for the work it does on it, and is stated in writing before that work starts and on every invoice.
      </P>
      <P>
        3.4 <strong>Your part.</strong>{" "}You give us accurate facts about your business, photos of your work where you can, and a one-time sign-off, at the start, on how we reply to reviews in your name.
      </P>
      <P>
        3.5 <strong>Month to month, and cancelling.</strong>{" "}The monthly service runs month to month, with no minimum term. Each month of service starts on the same day of the month as the first, or on the last day of a shorter month. The flat monthly fee is charged at the start of each month of service, in advance. You or Devize can cancel at any time by email (section 7.3). A cancellation takes effect at the end of the month already paid for: the work continues until then, no further fee is charged after it, and the fee for that month is not refunded in part. When the service ends, you remove Devize as a manager of your Google Business Profile and from your website (or Devize removes itself). Section 3.6 says what stays yours.
      </P>
      <P>
        3.6 <strong>Ownership and handover.</strong>{" "}{/* DRAFT (2026-10-15, checked 2026-11-05): Blake and counsel to confirm. The on-site fixes sentence is the only place this caveat prints now, so no page may claim everything stays. */}Your Google Business Profile, your reviews, your ad account, your website and every page and post Devize publishes on it stay yours. Once paid for, the pages, posts, text and other content Devize creates for your business are yours, as are any photos you supply. Devize publishes pages and posts only to places you own or control. On-site fixes that run through Devize&apos;s tools can stop when the service stops, unless they have been written into your site. When the service ends, Devize hands over every page and file it made for you before removing its access.
      </P>
      <P>
        3.7 <strong>Ads management.</strong>{" "}{/* DRAFT (2026-11-05): a placeholder for counsel's clause. It replaces the Google Ads add-on, covers all three ad plans and states the percentage fee. See the TODO at the top of this file. */}If your Order includes Google Local Services Ads, Google Search ads, or Facebook and Instagram ads, your Order sets out the monthly work and the fees: a one-time setup fee, then a monthly management fee of a flat amount or a percentage of ad spend, whichever is higher. The percentage is worked out on what the platform charged for that month. Devize&apos;s fees are separate from what the platform charges, are stated in writing before your first purchase, and appear on every invoice. Ad spend is separate, and you pay it to the platform directly. The ad account stays yours, and no budget changes without your written yes.
      </P>
      <P>
        3.8 <strong>Add-ons.</strong>{" "}{/* DRAFT (2026-11-05): replaces "Services in pilot". The AI, recording and text wording moved here from the service pages, and a lawyer words it before launch. Blake and counsel to confirm. */}A website rebuild, the AI Voice Receptionist and Lead Nurture SMS are part of the service only if your Order says so, and your Order sets out their scope and fees. The AI Voice Receptionist tells callers at the start that it is an AI system and that the call may be recorded. Lead Nurture SMS sends text messages only to people who opted in, with a consent record for each number that you supply. Message and data rates may apply, and anyone can reply STOP to opt out.
      </P>
      <P>
        3.9 <strong>Rules for your trade.</strong>{" "}{/* DRAFT (2026-11-05): new, moved from the trade pages. "Set up first" is a commitment, and no HIPAA program is on file. Blake and counsel to confirm. */}Healthcare and legal practices have extra privacy and advertising rules, and Devize sets those up first. Devize flags rules it knows about. That is not legal advice, and you and your lawyer decide what your business publishes.
      </P>

      <H2 id="s4">4. No guarantee of results</H2>
      <P>
        4.1 {/* DRAFT (2026-11-05): now names ad platforms as well as Google. Blake and counsel to confirm. */}Devize does not guarantee any ranking, position on Google&apos;s map, appearance in an AI answer (including Google&apos;s AI features and assistants such as ChatGPT), ad position, cost per click or per lead, number of calls, leads, booked jobs, customers, or revenue. Google, other ad platforms and the companies behind AI assistants decide what they show, and Devize does not control them.
      </P>
      <P>
        4.2 EXCEPT AS EXPRESSLY STATED IN YOUR ORDER, THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND DEVIZE DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED.
      </P>

      <H2 id="s5">5. Reviews</H2>
      <P>
        5.1 {/* DRAFT (2026-11-05): adds "the same way", to match the review request system on the menu. Blake and counsel to confirm. */}Devize asks every customer for a review the same way. Devize will not write, buy, or post fake reviews, will not offer anything in exchange for a review, and will not ask only satisfied customers for reviews. You agree not to ask Devize to do any of these things.
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
