import type { Metadata } from "next";
import {
  LegalPage,
  H2,
  P,
  ProseLink,
  Code,
  TableOfContents,
  ContactLine,
} from "@/components/legal-prose";

export const metadata: Metadata = {
  title: "Service Terms",
  description:
    "Service Terms governing every Revenue Recovery Sprint and related service Devize provides to a business client.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const sections = [
  { id: "s1", label: "1. Who we are; these Terms" },
  { id: "s2", label: "2. How the agreement forms; your Order" },
  { id: "s3", label: "3. The Services" },
  { id: "s4", label: "4. Term" },
  { id: "s5", label: "5. Fees & payment" },
  { id: "s6", label: "6. Viability audit & deposit refund" },
  { id: "s7", label: "7. Client responsibilities" },
  { id: "s8", label: "8. Consent, list provenance & compliance" },
  { id: "s9", label: "9. Data rights & ownership" },
  { id: "s10", label: "10. Reporting & attribution" },
  { id: "s11", label: "11. Service-area exclusivity" },
  { id: "s12", label: "12. Founding Partner engagements" },
  { id: "s13", label: "13. No results guarantee; disclaimer" },
  { id: "s14", label: "14. Termination" },
  { id: "s15", label: "15. Indemnification" },
  { id: "s16", label: "16. Limitation of liability" },
  { id: "s17", label: "17. Confidentiality" },
  { id: "s18", label: "18. General" },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Service Terms"
      updated="July 18, 2026"
      version="Version 1.2"
    >
      <TableOfContents items={sections} />

      <H2 id="s1">1. Who we are; these Terms</H2>
      <P>
        &ldquo;<strong>Devize</strong>&rdquo; (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is the trade name of Blake McGuire, a sole proprietor based in Willis, Texas. These Service Terms (the &ldquo;<strong>Terms</strong>&rdquo;) govern every Revenue Recovery Sprint and related service we provide to a business client (&ldquo;<strong>Client</strong>,&rdquo; &ldquo;you&rdquo;). The Terms, together with your Order (Section 2), form a binding agreement between you and Devize (the &ldquo;<strong>Agreement</strong>&rdquo;).
      </P>

      <H2 id="s2">2. How the agreement forms; your Order</H2>
      <P>
        2.1 <strong>Acceptance.</strong> You accept these Terms, and the Agreement is formed, when you do any of the following, whichever occurs first: (a) check the box indicating acceptance of these Terms at checkout; (b) pay the Deposit; or (c) submit our client intake form. Each of these constitutes your electronic signature and agreement to be bound.
      </P>
      <P>
        2.2 <strong>Your Order.</strong> The &ldquo;<strong>Order</strong>&rdquo; consists of (a) the service and fees presented on the checkout page at the time of purchase, and (b) the information you submit in our client intake form, including your legal business name, physical address, service-area ZIP codes, offer terms, and the compliance attestation described in Section 8. The Order is incorporated into the Agreement.
      </P>
      <P>
        2.3 <strong>Authority.</strong> The individual accepting these Terms represents that they are authorized to bind the Client business.
      </P>
      <P>
        2.4 <strong>Electronic contracting.</strong> You consent to transact electronically, to sign by electronic means (including typed-name signatures), and to receive all notices, invoices, and documents by email.
      </P>

      <H2 id="s3">3. The Services</H2>
      <P>
        3.1 Devize will perform a <strong>Revenue Recovery Sprint</strong> (the &ldquo;Sprint&rdquo;): a done-for-you email reactivation campaign directed at Client&apos;s past customers and qualified inquiries, consisting of: (a) a dormant-revenue audit and compliance scrub of Client&apos;s contact list; (b) an approximately 30-day, multi-touch email sequence sent in warmed waves from a dedicated subdomain of Client&apos;s domain (e.g., <Code>mail.clientdomain.com</Code>); (c) a Day-14 Recovery Report delivered by call and written summary; and (d) a Day-30 Final Report with a 30-minute retention strategy call. Booking links direct to Client&apos;s own booking mechanism; all customer inquiries are handled by Client.
      </P>
      <P>
        3.2 The Sprint is delivered by <strong>email only</strong>. SMS, voice, and other channels are out of scope and, if later offered, will be added only by a written addendum or a separate order accepted by both parties.
      </P>
      <P>
        3.3 All campaign content promotes Client&apos;s services under Client&apos;s brand.
      </P>

      <H2 id="s4">4. Term</H2>
      <P>
        4.1 The Agreement begins on the date of acceptance (Section 2.1) and continues until the later of (a) 45 days after acceptance, or (b) completion of the 30-day send sequence and delivery of the Final Report, unless terminated earlier under Section 14.
      </P>

      <H2 id="s5">5. Fees &amp; payment</H2>
      <P>
        5.1 <strong>Deposit.</strong> You will pay the deposit stated on the checkout page (the &ldquo;<strong>Deposit</strong>&rdquo;) at the time of purchase. The Deposit is <strong>non-refundable except</strong> as provided in Section 6.
      </P>
      <P>
        5.2 <strong>Milestone Payment.</strong> You will pay the milestone amount stated on the checkout page or order materials (the &ldquo;<strong>Milestone Payment</strong>&rdquo;), invoiced upon Devize&apos;s delivery of the Day-14 Recovery Report. Payment is due within seven (7) days of invoice. Overdue balances accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is less.
      </P>
      <P>
        5.3 <strong>Fixed fees.</strong> Fees are fixed as stated at purchase. No revenue share, commission, or per-booking fee applies. All revenue generated by the Sprint belongs solely to Client. No additional fees will be charged without Client&apos;s prior written approval.
      </P>

      <H2 id="s6">6. Viability audit &amp; deposit refund</H2>
      <P>
        6.1 Before any campaign send, Devize will perform a compliance scrub and viability audit of Client&apos;s contact list.
      </P>
      <P>
        6.2 If <strong>fewer than 500 eligible contacts</strong> remain after the compliance scrub, either party may terminate the Agreement by written notice, and Devize will refund the Deposit in full within seven (7) days.
      </P>
      <P>
        6.3 If Client elects to proceed despite an audit result below that threshold, the Deposit becomes non-refundable and Section 13 applies with emphasis.
      </P>

      <H2 id="s7">7. Client responsibilities</H2>
      <P>
        Client will, at its own expense: (a) provide a customer contact export from its CRM/FSM system within seven (7) days of acceptance, in a format reasonably requested by Devize; (b) participate in one onboarding call (approximately 45 minutes) and cooperate in configuring DNS records on Client&apos;s domain for the sending subdomain; (c) handle all inbound customer replies, calls, and booking requests generated by the Sprint promptly and professionally, since the speed of Client&apos;s response materially affects results; (d) provide a simple weekly booking log in the format Devize supplies, for reporting purposes only; (e) maintain a working booking mechanism (webpage, phone line, or scheduler) throughout the Term; and (f) designate one primary point of contact with authority to approve campaign content.
      </P>

      <H2 id="s8">8. Consent, list provenance &amp; compliance</H2>
      <P>
        8.1 <strong>Client attestation.</strong> Client represents and warrants that every contact on the provided list is (a) a past customer of Client, or (b) a person who made a qualified inquiry to Client, in either case within the eighteen (18) months preceding acceptance, <em>or</em> a person from whom Client holds express written consent to receive commercial email; and that Client has the legal right to direct commercial email to those contacts. This attestation is affirmed by typed-name electronic signature in the intake form, and the electronic record (timestamp, form execution ID, and submitted data) is preserved by Devize as a compliance record. This attestation is a material inducement to Devize entering the Agreement.
      </P>
      <P>
        8.2 <strong>Sender of record.</strong> Campaign messages promote Client&apos;s products and services and are sent on Client&apos;s behalf; Client is the &ldquo;sender&rdquo; for purposes of the CAN-SPAM Act, and each party will comply with its respective obligations under CAN-SPAM.
      </P>
      <P>
        8.3 <strong>Devize compliance operations.</strong> Devize will: (a) include Client&apos;s physical postal address and a functioning unsubscribe mechanism in every email; (b) process every opt-out within the legally required window; (c) maintain suppression records; and (d) refuse to send to any contact that fails its compliance scrub.
      </P>
      <P>
        8.4 <strong>Global suppression.</strong> Any contact who opts out is suppressed <strong>permanently and globally</strong> across Devize&apos;s systems, including for any future engagement, and Devize will not reverse a suppression at Client&apos;s request.
      </P>

      <H2 id="s9">9. Data rights &amp; ownership</H2>
      <P>
        9.1 <strong>Client Data.</strong> Client owns its customer list and all personally identifying information within it (&ldquo;Client Data&rdquo;). Devize uses Client Data solely to perform the Services and will not sell Client Data or provide it to any third party except subprocessors used to deliver the Services (e.g., email infrastructure and list-validation providers).
      </P>
      <P>
        9.2 <strong>Campaign Data.</strong> Devize owns the campaign infrastructure, templates, sequences, and systems used to deliver the Services, and all send, delivery, engagement, and response event data generated by operating them (&ldquo;Campaign Data&rdquo;).
      </P>
      <P>
        9.3 <strong>Aggregated benchmarking.</strong> Devize may retain and use Campaign Data in anonymized and aggregated form, stripped of Client Data and any information identifying Client or its customers, for benchmarking, service improvement, and product development. This right survives termination.
      </P>
      <P>
        9.4 <strong>Deletion.</strong> Upon written request following termination, Devize will delete Client Data within thirty (30) days, except suppression records (retained permanently for legal compliance) and records required by law.
      </P>

      <H2 id="s10">10. Reporting &amp; attribution</H2>
      <P>
        10.1 Devize will deliver a Day-14 Recovery Report and a Day-30 Final Report summarizing sends, deliveries, engagement, replies, and booking correlation using a tiered methodology (attributed / correlated / influenced), based on Devize&apos;s tracking data and Client&apos;s booking log.
      </P>
      <P>
        10.2 Reports are <strong>informational</strong>. Fees are fixed and are not contingent on any attribution outcome, booking count, or revenue figure.
      </P>

      <H2 id="s11">11. Service-area exclusivity</H2>
      <P>
        11.1 During the Term and for thirty (30) days after, Devize will not perform reactivation campaign services for another company in Client&apos;s primary trade within the ZIP codes specified in Client&apos;s intake form.
      </P>

      <H2 id="s12">12. Founding Partner engagements</H2>
      <P>
        12.1 If Client&apos;s Order is designated a Founding Partner engagement, the discounted rate is provided in consideration of: (a) one post-Sprint feedback call of up to 30 minutes; and (b) Devize&apos;s use of anonymized Sprint results (trade, region, and outcome metrics, without Client&apos;s name) in Devize&apos;s marketing.
      </P>
      <P>
        12.2 Use of Client&apos;s <strong>name or logo</strong> in a case study or testimonial requires Client&apos;s separate prior written approval, which Client may withhold for any reason.
      </P>
      <P>
        12.3 <strong>Right of first offer.</strong> If Devize launches an ongoing retainer program within twelve (12) months after the Term, Devize will offer Client enrollment at founding-partner pricing before offering retainer services to any other company in Client&apos;s trade within Client&apos;s specified ZIP codes. This right expires thirty (30) days after Devize delivers the written offer.
      </P>

      <H2 id="s13">13. No results guarantee; disclaimer</H2>
      <P>13.1 Each party warrants it has the authority to enter the Agreement.</P>
      <P>
        13.2 Devize does not warrant any specific number of opens, replies, bookings, or revenue. Marketing outcomes depend on factors outside Devize&apos;s control, including list quality, offer strength, seasonality, and Client&apos;s responsiveness to inquiries. EXCEPT AS EXPRESSLY STATED, THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND DEVIZE DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED.
      </P>

      <H2 id="s14">14. Termination</H2>
      <P>
        14.1 Client may terminate at any time on written notice. The Deposit is retained by Devize (except under Section 6.2). If termination occurs after delivery of the Day-14 Recovery Report, the Milestone Payment remains due.
      </P>
      <P>
        14.2 Devize may terminate if Client fails to provide the contact list or complete DNS onboarding within fourteen (14) days of acceptance, or materially breaches Section 8. In such case the Deposit is retained as liquidated compensation for work performed.
      </P>
      <P>
        14.3 Sections 8.4, 9, 10.2, 13, 15, 16, 17, and 18 survive termination.
      </P>

      <H2 id="s15">15. Indemnification</H2>
      <P>
        15.1 <strong>By Client.</strong> Client will defend and indemnify Devize against third-party claims (including regulatory actions) arising from breach of Client&apos;s attestations in Section 8.1 or from the content of offers Client directs Devize to promote.
      </P>
      <P>
        15.2 <strong>By Devize.</strong> Devize will defend and indemnify Client against third-party claims arising from Devize&apos;s failure to perform the compliance operations described in Section 8.3.
      </P>

      <H2 id="s16">16. Limitation of liability</H2>
      <P>
        16.1 NEITHER PARTY IS LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. EACH PARTY&apos;S TOTAL LIABILITY UNDER THE AGREEMENT IS CAPPED AT THE FEES PAID OR PAYABLE BY CLIENT HEREUNDER, EXCEPT FOR LIABILITY ARISING UNDER SECTION 15 OR FROM WILLFUL MISCONDUCT.
      </P>

      <H2 id="s17">17. Confidentiality</H2>
      <P>
        17.1 Each party will keep the other&apos;s non-public business information confidential and use it only to perform the Agreement, during the Term and for two (2) years after. Client&apos;s customer list is Client&apos;s Confidential Information; Devize&apos;s systems, pricing, and methods are Devize&apos;s Confidential Information.
      </P>

      <H2 id="s18">18. General</H2>
      <P>
        18.1 <strong>Governing law &amp; venue.</strong> Texas law governs; exclusive venue lies in Montgomery County, Texas.
      </P>
      <P>
        18.2 <strong>Independent contractor.</strong> Devize is an independent contractor; nothing creates a partnership or agency.
      </P>
      <P>
        18.3 <strong>Entire agreement; amendments.</strong> These Terms plus your Order are the entire agreement. Devize may update these Terms prospectively by posting a new version at this page; each engagement is governed by the version in effect when it was accepted.
      </P>
      <P>
        18.4 <strong>Assignment.</strong> Neither party may assign without the other&apos;s consent, except Devize may assign to a successor in a sale of its business.
      </P>
      <P>
        18.5 <strong>Notices.</strong> Email constitutes written notice, to Devize at{" "}
        <ProseLink href="mailto:admin@devize.ai">admin@devize.ai</ProseLink>; to Client at the email provided in the Order.
      </P>
      <P>
        18.6 <strong>Severability; waiver.</strong> If any provision is unenforceable, the remainder stands. Failure to enforce a provision is not a waiver of it.
      </P>
      <P>
        18.7 <strong>Force majeure.</strong> Neither party is liable for delay or failure caused by events beyond its reasonable control, excluding payment obligations.
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
