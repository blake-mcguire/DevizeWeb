/**
 * The trades we write for (Blake, 2026-11-04). This file holds only what the
 * site needs to list them: name, card words and page description. Each trade's
 * page is its own component in src/components/industries/, on purpose, so that
 * no page reads as another page with the name swapped.
 *
 * Rules for those pages:
 * - Devize has no client in any of these trades. One shared line says so.
 * - No claim of experience, specialist knowledge, results or legal advice.
 * - Every outside fact carries a numbered source from `S`, read on 2026-11-04.
 *   Anything without a number is our own reasoning, written so it reads that way.
 * - No invented numbers. Searches are plain-word examples, not volume figures.
 * - What can't be sold yet comes from TRADE_ACCESS in src/lib/tiers.ts.
 *
 * Rule numbers and dollar figures are Texas or federal, because Texas is where
 * Devize scans today. A layperson read them, from public copies. A lawyer should
 * check them before launch (offerCopyConfirmed in launch-gate.json).
 *
 * TODO(Blake): all of the wording on these six pages is draft, for you to read.
 */

export type Source = { label: string; url: string };

export const S = {
  ranking: { label: "Google: How to improve your local ranking", url: "https://support.google.com/business/answer/7091" },
  guidelines: { label: "Google: Guidelines for representing your business", url: "https://support.google.com/business/answer/3038177" },
  serviceArea: { label: "Google: Manage your service area", url: "https://support.google.com/business/answer/9157481" },
  hours: { label: "Google: Set special and holiday hours", url: "https://support.google.com/business/answer/6303076" },
  contribution: { label: "Google: Maps user contributed content policy (fake engagement)", url: "https://support.google.com/contributionpolicy/answer/7400114" },
  spam: { label: "Google Search: Spam policies, including doorway abuse", url: "https://developers.google.com/search/docs/essentials/spam-policies" },
  healthAds: { label: "Google Ads policy: Health in personalized advertising", url: "https://support.google.com/adspolicy/answer/16701855" },
  ga: { label: "Google: HIPAA and Google Analytics", url: "https://support.google.com/analytics/answer/13297105" },
  ftc: { label: "FTC: Consumer Reviews and Testimonials Rule, questions and answers", url: "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers" },
  fcc: { label: "47 CFR 64.1200: FCC rules on calls and texts", url: "https://www.law.cornell.edu/cfr/text/47/64.1200" },
  gas: { label: "CenterPoint Energy: What to do if you smell natural gas", url: "https://actioncenter.centerpointenergy.com/en-us/resources/what-should-you-do-if-you-smell-natural-gas" },
  tx7571: { label: "Texas: 16 Tex. Admin. Code 75.71, HVAC contracting companies", url: "https://www.law.cornell.edu/regulations/texas/16-Tex-Admin-Code-SS-75-71" },
  tx36710: { label: "Texas: 22 Tex. Admin. Code 367.10, plumbing license number display", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-367-10" },
  tx3679: { label: "Texas: 22 Tex. Admin. Code 367.9, advertising plumbing", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-367-9" },
  elite: { label: "National Law Review: Dental practice pays $10,000 over Yelp replies", url: "https://natlawreview.com/article/dental-practice-pays-10000-hipaa-settlements-disclosing-personal-health-information" },
  igbinadolor: { label: "HHS, March 2022: Four HIPAA enforcement actions, including a $50,000 penalty on a dental practice", url: "https://www.hhs.gov/about/news/2022/03/28/four-hipaa-enforcement-actions-hold-healthcare-providers-accountable-with-compliance.html" },
  newVision: { label: "HHS: New Vision Dental settlement, $23,000", url: "https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/agreements/new-vision/index.html" },
  manasa: { label: "Nixon Peabody: HIPAA-regulated entities and online reviews", url: "https://nixonpeabody.com/insights/articles/2023/07/13/hipaa-regulated-entities-must-use-caution-responding-to-online-reviews" },
  ba: { label: "45 CFR 160.103: definition of business associate", url: "https://www.law.cornell.edu/cfr/text/45/160.103" },
  reminders: { label: "HHS: Are appointment reminders allowed under HIPAA without authorization?", url: "https://www.hhs.gov/hipaa/for-professionals/faq/286/are-appointment-reminders-allowed-under-hipaa-without-authorization/index.html" },
  ecri: { label: "Fierce Healthcare: ECRI flags misuse of AI chatbots as top health tech hazard for 2026", url: "https://www.fiercehealthcare.com/health-tech/ecri-flags-misuse-ai-chatbots-top-health-tech-hazard-2026" },
  tx10857: { label: "Texas: 22 Tex. Admin. Code 108.57, dental advertising", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-108-57" },
  tx10852: { label: "Texas: 22 Tex. Admin. Code 108.52, dental advertising under a trade name", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-108-52" },
  tx10860: { label: "Texas: 22 Tex. Admin. Code 108.60, keeping copies of dental ads", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-108-60" },
  tx101201: { label: "Texas Occupations Code 101.201: health care advertising", url: "https://texas.public.law/statutes/tex._occ._code_section_101.201" },
  aba496: { label: "ABA Journal: Formal Opinion 496 on negative online reviews", url: "https://abajournal.com/news/article/lawyers-must-use-caution-responding-to-negative-online-reviews" },
  tx701: { label: "Texas Rule 7.01: communications about a lawyer's services", url: "https://www.legalethicstexas.com/resources/rules/texas-disciplinary-rules-of-professional-conduct/communications-concerning-a-lawyers-services/" },
  tx704: { label: "Texas Rule 7.04: filing advertisements", url: "https://www.legalethicstexas.com/resources/rules/texas-disciplinary-rules-of-professional-conduct/filing-requirements-for-advertisements-and-solicitation-communications/" },
  txBar: { label: "State Bar of Texas: Solicitation and barratry", url: "https://www.texasbar.com/Content/NavigationMenu/ForLawyers/GrievanceandEthics/SolicitationandBarratry/default.htm" },
  penal3812: { label: "Texas Penal Code 38.12: barratry and solicitation", url: "https://texas.public.law/statutes/tex._penal_code_section_38.12" },
  florida241: { label: "The Florida Bar: Ethics Opinion 24-1 on generative AI", url: "https://www.floridabar.org/etopinions/opinion-24-1/" },
  tx705: { label: "Texas Professional Ethics Committee: Opinion 705 on generative AI", url: "https://legalethicstexas.com/resources/opinions/opinion-705/" },
  tx801: { label: "Texas Occupations Code 801.353: veterinarian and client confidentiality", url: "https://texas.public.law/statutes/tex._occ._code_section_801.353" },
  tx57330: { label: "Texas: 22 Tex. Admin. Code 573.30, veterinary advertising", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-573-30" },
} satisfies Record<string, Source>;

export type Industry = {
  slug: string;
  /** The nav label and the carousel card's title. */
  name: string;
  /** The page's <title>. */
  title: string;
  metaDescription: string;
  /** The carousel card's line: this trade's own bad moment. */
  hook: string;
  /** One search someone types in that moment. */
  search: string;
  /** Does the audit's rival comparison run for this trade today? */
  compared: boolean;
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "hvac",
    name: "HVAC",
    title: "HVAC Companies",
    metaDescription:
      "Where an HVAC job goes when the AC quits after hours, what your listing and reviews need, which Devize tier fits, and the Texas license number rule.",
    hook: "The AC quit after you went home.",
    search: "ac not cooling",
    compared: true,
  },
  {
    slug: "dental-clinics",
    name: "Dental Clinics",
    title: "Dental Clinics",
    metaDescription:
      "Why a review reply is where dental practices get fined, what a new-patient call is worth, and why voice, text and CRM wait for dental clinics at Devize.",
    hook: "A toothache at 7am. A new family on Saturday.",
    search: "emergency dentist near me",
    compared: true,
  },
  {
    slug: "law-firms",
    name: "Law Firms",
    title: "Law Firms",
    metaDescription:
      "What Devize needs from a law firm before touching anything: who signs off, your rule on review replies, and a flat fee. Voice and text wait for your lawyer.",
    hook: "Some of your callers will never tell anyone they called.",
    search: "dui lawyer near me",
    compared: false,
  },
  {
    slug: "walk-in-clinics",
    name: "Walk-In Clinics",
    title: "Walk-In Clinics",
    metaDescription:
      "The four questions a walk-in clinic's listing answers before anyone reads a review, what a missed search costs, and why voice and text come last here.",
    hook: "Open? Nearby? Takes my plan? Decision made.",
    search: "walk in clinic open now",
    compared: false,
  },
  {
    slug: "veterinary-clinics",
    name: "Veterinary Clinics",
    title: "Veterinary Clinics",
    metaDescription:
      "What to say after hours when the dog ate something at 9pm, what a first visit can lead to, and how to answer a review written in grief.",
    hook: "The dog ate something at 9pm.",
    search: "emergency vet near me",
    compared: false,
  },
  {
    slug: "plumbing-companies",
    name: "Plumbing Companies",
    title: "Plumbing Companies",
    metaDescription:
      "Four plumbing jobs, four searches and what a missed call costs on each, why Google allows one profile for your area, and the Texas license number rule.",
    hook: "Water is on the floor.",
    search: "emergency plumber",
    compared: false,
  },
];

export function industryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
