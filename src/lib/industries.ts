/**
 * Industries We Serve (Blake, 2026-11-04: "HVAC, Law Firms, Dental Clinics,
 * Walk In Clinics, Veterinarian clinics, Plumbing Companies etc.").
 *
 * Each page is written for its own trade: what its customers search for in an
 * urgent or a planned moment, what matters on its listing and in its reviews,
 * and the trade's own limits. No page is another page with the name swapped.
 *
 * DRAFT: all wording is for Blake to confirm.
 *
 * Rules for this file:
 * - Devize has no client in any of these trades, and every page says so.
 * - No claim of experience, specialist knowledge, results or legal advice.
 * - Every outside fact carries a source in `refs`, read on 2026-11-04. Anything
 *   without a ref is our own reasoning, written so it reads that way.
 * - The searches listed are plain-word examples, not volume figures.
 *
 * Rule numbers and dollar figures below are Texas or federal, because Texas is
 * where Devize scans today. A layperson read them, from public copies. A lawyer
 * should check them before launch (offerCopyConfirmed in launch-gate.json).
 */

export type Source = { label: string; url: string };

const S = {
  ranking: { label: "Google: How to improve your local ranking", url: "https://support.google.com/business/answer/7091" },
  guidelines: { label: "Google: Guidelines for representing your business", url: "https://support.google.com/business/answer/3038177" },
  serviceArea: { label: "Google: Manage your service area", url: "https://support.google.com/business/answer/9157481" },
  hours: { label: "Google: Set special and holiday hours", url: "https://support.google.com/business/answer/6303076" },
  contribution: { label: "Google: Maps user contributed content policy (fake engagement)", url: "https://support.google.com/contributionpolicy/answer/7400114" },
  ftc: { label: "FTC: Consumer Reviews and Testimonials Rule, questions and answers", url: "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers" },
  tx7571: { label: "Texas: 16 Tex. Admin. Code 75.71, HVAC contracting companies", url: "https://www.law.cornell.edu/regulations/texas/16-Tex-Admin-Code-SS-75-71" },
  tx36710: { label: "Texas: 22 Tex. Admin. Code 367.10, plumbing license number display", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-367-10" },
  tx3679: { label: "Texas: 22 Tex. Admin. Code 367.9, advertising plumbing", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-367-9" },
  elite: { label: "National Law Review: Dental practice pays $10,000 over Yelp replies", url: "https://natlawreview.com/article/dental-practice-pays-10000-hipaa-settlements-disclosing-personal-health-information" },
  manasa: { label: "Nixon Peabody: HIPAA-regulated entities and online reviews", url: "https://nixonpeabody.com/insights/articles/2023/07/13/hipaa-regulated-entities-must-use-caution-responding-to-online-reviews" },
  ba: { label: "45 CFR 160.103: definition of business associate", url: "https://www.law.cornell.edu/cfr/text/45/160.103" },
  tx10857: { label: "Texas: 22 Tex. Admin. Code 108.57, dental advertising", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-108-57" },
  tx101201: { label: "Texas Occupations Code 101.201: health care advertising", url: "https://texas.public.law/statutes/tex._occ._code_section_101.201" },
  ga: { label: "Google: HIPAA and Google Analytics", url: "https://support.google.com/analytics/answer/13297105" },
  aba496: { label: "ABA Journal: Formal Opinion 496 on negative online reviews", url: "https://abajournal.com/news/article/lawyers-must-use-caution-responding-to-negative-online-reviews" },
  tx701: { label: "Texas Rule 7.01: communications about a lawyer's services", url: "https://www.legalethicstexas.com/resources/rules/texas-disciplinary-rules-of-professional-conduct/communications-concerning-a-lawyers-services/" },
  tx704: { label: "Texas Rule 7.04: filing advertisements", url: "https://www.legalethicstexas.com/resources/rules/texas-disciplinary-rules-of-professional-conduct/filing-requirements-for-advertisements-and-solicitation-communications/" },
  tx801: { label: "Texas Occupations Code 801.353: veterinarian and client confidentiality", url: "https://texas.public.law/statutes/tex._occ._code_section_801.353" },
  tx57330: { label: "Texas: 22 Tex. Admin. Code 573.30, veterinary advertising", url: "https://www.law.cornell.edu/regulations/texas/22-Tex-Admin-Code-SS-573-30" },
} satisfies Record<string, Source>;

export type Point = { title: string; body: string; refs?: Source[] };

export type Industry = {
  slug: string;
  /** The page title and the nav label. */
  name: string;
  /** Lower case, for sentences: "dental clinics". */
  trade: string;
  /** The trade's own word for "clients", for the mission line. */
  word: string;
  metaDescription: string;
  lead: string;
  /** Does the audit's rival comparison run for this trade today? */
  compared: boolean;
  /** Which listings the comparison covers, for the trades it runs for. */
  comparedNote?: string;
  urgent: { intro: string; searches: string[] };
  planned: { intro: string; searches: string[] };
  listing: Point[];
  reviews: Point[];
  limits: Point[];
  asks: string[];
};

const NOT_ADVICE =
  "We're not lawyers, and this isn't legal advice. If something on a page or a listing looks like it touches these rules, we ask you. Your licensing board and your lawyer have the last word.";

export const INDUSTRIES: Industry[] = [
  {
    slug: "hvac",
    name: "HVAC Companies",
    trade: "HVAC companies",
    word: "customers",
    metaDescription:
      "What people search for when the AC quits, what matters on an HVAC company's Google listing, and the Texas license number rule. No client stories yet, and we say so.",
    lead: "When the AC quits in August, people want someone who can come today. When a system is getting old, they take their time and read. Those are different searches, and your Google listing has to answer both.",
    compared: true,
    comparedNote:
      "The comparison covers listings whose main Google category is HVAC contractor, AC repair service or AC contractor.",
    urgent: {
      intro: "The system is down and the house is hot. They're on a phone and want a yes.",
      searches: ["ac repair near me", "ac not cooling", "emergency ac repair", "furnace not working", "hvac repair open now"],
    },
    planned: {
      intro: "The unit is old, a quote looks high, or they want a second opinion. They compare a few companies.",
      searches: ["ac replacement cost", "new hvac system quote", "heat pump installer", "ac tune up", "hvac maintenance plan"],
    },
    listing: [
      {
        title: "A service area, not a shop address",
        body: "If customers don't come to your address, Google says to remove it from your profile and list the areas you serve. You get up to 20 areas, within about 2 hours' drive, and you can't draw a radius around your shop.",
        refs: [S.serviceArea],
      },
      {
        title: "The name on your trucks, and nothing else",
        body: "Google doesn't allow extra words in a business name, like service descriptions or locations, and says it can lead to suspension. Adding \"Best AC Repair\" to the name is the kind of thing that puts a listing at risk.",
        refs: [S.guidelines],
      },
      {
        title: "Hours you really answer",
        body: "A listing that says open, with nobody picking up at 7pm in July, loses that call. List the hours you answer. Google suggests confirming your holiday hours too, even when they don't change.",
        refs: [S.hours],
      },
      {
        title: "Categories that are true",
        body: "Google asks for as few categories as possible, each finishing the sentence \"this business is a\". Adding more just to catch more searches isn't allowed.",
        refs: [S.guidelines],
      },
      {
        title: "Photos of real work",
        body: "Your trucks, your techs and real jobs, taken this year. A stock photo tells a homeowner nothing about who's coming to the house.",
      },
    ],
    reviews: [
      {
        title: "Ask every customer, not only the happy ones",
        body: "Google bars asking only for good reviews, and removes reviews that were paid for or rewarded. The FTC bans fake reviews and buying good ones. So the ask goes out after every job, the same way.",
        refs: [S.contribution, S.ftc],
      },
      {
        title: "Keep the customer's home out of your reply",
        body: "A reply can say thanks and mention the kind of job. It shouldn't mention their street, what's in the house or what they paid.",
      },
      {
        title: "A routine that runs all year",
        body: "A request that goes out after every job doesn't depend on someone remembering in the busiest week of summer.",
      },
    ],
    limits: [
      {
        title: "The license number on your ads (Texas)",
        body: "Texas requires the affiliated licensee's license number on HVAC contractors' advertising meant to bring in business, with a short list of exceptions, and on both sides of company vehicles. A page or an ad we write for you would need checking against this. Other states have their own rules.",
        refs: [S.tx7571],
      },
      { title: "We flag. You decide.", body: NOT_ADVICE },
    ],
    asks: [
      "Which work do you want more of: repairs, replacements or maintenance plans?",
      "How far will you really drive in a heat wave?",
      "Do customers ever come to your address?",
      "Who answers after hours today, if anyone?",
      "Who holds the login to your Google listing?",
    ],
  },
  {
    slug: "dental-clinics",
    name: "Dental Clinics",
    trade: "dental clinics",
    word: "patients",
    metaDescription:
      "How patients search for a dentist, what matters on a dental clinic's Google listing, and why a review reply can't confirm someone is a patient. No client stories yet, and we say so.",
    lead: "Someone with a toothache at 7am searches differently from a family picking a dentist after a move. One needs a yes today. The other reads reviews and checks insurance. And when you answer a review, privacy law limits what you can say.",
    compared: true,
    comparedNote: "The comparison covers listings whose main Google category is Dentist or Dental clinic.",
    urgent: {
      intro: "The tooth hurts now. They want an office that's open and can see them.",
      searches: ["emergency dentist near me", "dentist open today", "tooth pain dentist", "broken tooth dentist", "dentist open saturday"],
    },
    planned: {
      intro: "A move, new insurance, or a dentist who retired. They read, compare and ask around.",
      searches: ["dentist near me", "family dentist", "dentist that takes my insurance", "teeth cleaning cost", "kids dentist"],
    },
    listing: [
      {
        title: "Who the listing belongs to",
        body: "Google's rules separate an office's profile from a dentist's own. Several dentists at one location means one profile for the office, and each dentist's profile uses only their name. A solo dentist under a practice brand shares one profile named \"brand: dentist name\". No extra profiles for different specialties.",
        refs: [S.guidelines],
      },
      {
        title: "Hours the desk really answers",
        body: "A search at 7am goes nowhere if the listing says open and the line goes to voicemail. Google also suggests confirming your holiday hours, even when they don't change.",
        refs: [S.hours],
      },
      {
        title: "A booking link that goes somewhere",
        body: "If booking runs through an outside service, try the link from your listing and your site on a phone. It's a quick check, and it's easy to miss.",
      },
      {
        title: "Insurance in plain words",
        body: "It's one of the first things a family wants to know. Put the plans you take on your site, in plain words, and keep the list current.",
      },
      {
        title: "Old copies of your site",
        body: "If an old vendor's copy of your site is still online, people can find it, and the wrong phone number with it.",
      },
    ],
    reviews: [
      {
        title: "Never confirm someone is a patient",
        body: "A reply that says \"sorry about your crown\" tells the world that person is your patient. In 2019 a Dallas dental practice paid $10,000 to federal health regulators over Yelp replies that included a patient's last name and health details.",
        refs: [S.elite],
      },
      {
        title: "One set of wording, signed off once",
        body: "General thanks, no details, and an invitation to call the office. You approve the wording at the start, so no reply waits on you.",
      },
      {
        title: "A privacy contract comes first",
        body: "Asking every patient means a tool or a person handles patient contact details. Under federal rules, someone who handles patient information for a practice can count as a business associate. We don't start review requests until your lawyer has told you what that needs.",
        refs: [S.ba],
      },
      {
        title: "Everyone gets asked",
        body: "Google bars asking only for good reviews, so there's no star screen first.",
        refs: [S.contribution],
      },
    ],
    limits: [
      {
        title: "Texas dental advertising rules",
        body: "Ads can't be false, misleading or hard to verify. The Texas rule bars implying superior services, comparisons that can't be backed up, guarantees of success, and claims of work without pain. So \"best dentist\", \"#1\" or \"pain-free\" goes to your lawyer before it goes on a page or a listing.",
        refs: [S.tx10857],
      },
      {
        title: "Testimonials",
        body: "The dental rule limits testimonials to patients of record, with disclosures, and the general Texas health care advertising law lists them too. Showing reviews on your own site is a question for your lawyer.",
        refs: [S.tx10857, S.tx101201],
      },
      {
        title: "What \"partner\" doesn't mean here",
        body: "In dentistry the word can mean selling a stake in your practice. We don't buy practices or take a stake in them. It means how we work with you, and nothing more.",
      },
      { title: "We flag. You decide.", body: NOT_ADVICE },
    ],
    asks: [
      "How many new patients do you see in a month, and how do you know?",
      "Does the front desk ask \"how did you find us?\"",
      "Which treatments do you want more of, and which insurance do you take?",
      "Is an old website or an old vendor still holding anything in your name?",
      "Who holds the login to your Google listing?",
    ],
  },
  {
    slug: "law-firms",
    name: "Law Firms",
    trade: "law firms",
    word: "clients",
    metaDescription:
      "How people search for a lawyer, what Google's rules say about firm and lawyer profiles, and why a review reply may be no reply at all. No client stories yet, and we say so.",
    lead: "People look for a lawyer at two very different moments: right after an arrest or a crash, and over weeks while sorting out a will or a divorce. Both read reviews. And what a firm can say back, in a reply or in an ad, is limited by bar rules.",
    compared: false,
    urgent: {
      intro: "Something just happened and they need to talk to someone today.",
      searches: ["dui lawyer near me", "criminal defense attorney", "car accident lawyer", "lawyer open now", "emergency custody lawyer"],
    },
    planned: {
      intro: "They have time, and some worry. They compare a few firms and want to know what it costs.",
      searches: ["estate planning attorney", "divorce lawyer", "how much does a will cost", "immigration lawyer consultation", "small business lawyer"],
    },
    listing: [
      {
        title: "Firm profile, lawyer profile",
        body: "Google lets a lawyer who deals with the public, and can be reached directly at a verified location, have a profile. A solo lawyer under a firm brand shares one profile named \"firm: lawyer\". Nobody gets extra profiles for different practice areas.",
        refs: [S.guidelines],
      },
      {
        title: "An office Google will accept",
        body: "Google says virtual offices aren't eligible unless they're staffed during business hours. A shared suite with nobody in it can put a listing at risk.",
        refs: [S.guidelines],
      },
      {
        title: "The firm's real name",
        body: "No practice areas or towns added to the name, unless that's the name in real life. Google says it can lead to suspension.",
        refs: [S.guidelines],
      },
      {
        title: "Who picks up",
        body: "A listing can't fix a phone nobody answers at 6pm. If the moment that matters to someone is tonight, what they get when they call matters as much as where you show up.",
      },
    ],
    reviews: [
      {
        title: "The reply may be no reply",
        body: "A 2021 American Bar Association ethics opinion says a lawyer generally can't reveal client information to answer an online review, and should seriously consider not responding at all. One allowed reply is a generic invitation to call. States differ. So our usual \"every review answered\" doesn't apply as written. You set the rule for your firm.",
        refs: [S.aba496],
      },
      {
        title: "Asking for reviews takes care",
        body: "Some clients won't want anyone to know they hired a lawyer. Any routine needs your OK on who gets asked and how. It still can't screen for happy clients, which Google bars.",
        refs: [S.contribution],
      },
    ],
    limits: [
      {
        title: "Bar rules on what ads can say",
        body: "Texas Rule 7.01 bars false or misleading communications. Its comments warn about unjustified expectations of results and comparisons that can't be backed up, and limit claiming credit for past results. Your state's rules may differ.",
        refs: [S.tx701],
      },
      {
        title: "Filing ads in Texas",
        body: "Texas generally requires a lawyer to file an ad with the State Bar's Advertising Review Committee no later than 10 days after it runs, unless it's exempt. So anything we draft comes to you first, and you decide what gets filed.",
        refs: [S.tx704],
      },
      {
        title: "Not legal advice",
        body: "We're not lawyers, and nothing here is legal or ethics advice. You're the one with the license, so you sign off.",
      },
    ],
    asks: [
      "Which state bars are you licensed under, and who signs off on advertising?",
      "Which matters do you want more of, and which do you turn away?",
      "Who answers a new client call at 6pm or on a Saturday?",
      "How do you count signed clients, and where did they come from?",
      "Does each lawyer have a profile, and who controls it?",
    ],
  },
  {
    slug: "walk-in-clinics",
    name: "Walk-In Clinics",
    trade: "walk-in clinics",
    word: "patients",
    metaDescription:
      "How people choose a walk-in clinic in a few minutes, why hours matter so much on the listing, and what patient privacy means for review replies. No client stories yet, and we say so.",
    lead: "A walk-in clinic often gets chosen in a few minutes: who's open, how close, do they take my insurance, can they treat this. Your hours and your facts do a lot of the work before anyone reads a review.",
    compared: false,
    urgent: {
      intro: "A sore throat on a Sunday, or a cut that may need stitches. They want to know you're open and can help.",
      searches: ["urgent care near me", "walk in clinic open now", "clinic open sunday", "strep test near me", "stitches walk in"],
    },
    planned: {
      intro: "School and work paperwork, shots and simple tests that can wait until lunch.",
      searches: ["sports physical walk in", "flu shot near me", "dot physical near me", "tb test near me", "x-ray walk in clinic"],
    },
    listing: [
      {
        title: "Your hours are your headline",
        body: "Late nights, weekends and holidays. Special hours let you change a day without touching your regular hours, and Google suggests confirming holidays even when nothing changes.",
        refs: [S.hours],
      },
      {
        title: "Say what you are",
        body: "Google asks for the category that finishes \"this business is a\". A walk-in clinic isn't a hospital or an emergency room, and neither your listing nor your site should leave people guessing. Say what you treat, what you don't, and when to call 911.",
        refs: [S.guidelines],
      },
      {
        title: "More than one clinic",
        body: "Each location has its own facts and its own profile. Where several clinicians share a location, Google asks for one profile for the location, and any clinician's own profile uses only their name.",
        refs: [S.guidelines],
      },
      {
        title: "Prices and insurance, if you post them",
        body: "Keep them right. A wrong price or plan on your site can turn a visit into a bad review.",
      },
    ],
    reviews: [
      {
        title: "Replies stay general, even when a review doesn't",
        body: "A review may name a diagnosis. A reply can't. In 2023 a psychiatric practice paid $30,000 to federal health regulators over replies to Google reviews that disclosed patient information. Different kind of practice, same rule.",
        refs: [S.manasa],
      },
      {
        title: "If reviews keep mentioning waits or billing",
        body: "We'll tell you. We can't fix that part, and a better listing won't hide it. You can.",
      },
      {
        title: "A privacy contract comes first",
        body: "Review requests go to patients, so a tool or a person handles their contact details. Someone who handles patient information for a clinic can count as a business associate. We don't start until your lawyer has told you what that needs.",
        refs: [S.ba],
      },
    ],
    limits: [
      {
        title: "Privacy on your pages, too",
        body: "Google says it doesn't offer a business associate agreement for Analytics and advises keeping its tags off pages covered by HIPAA, and says public pages tied to health care services are more likely to be covered. If your site carries ad or analytics tags, we'll flag it and you ask your lawyer.",
        refs: [S.ga],
      },
      {
        title: "Texas health care advertising",
        body: "Texas law bars health care ads that are false, misleading or hard to verify, ads that contain a testimonial, comparisons that can't be backed up, and claims likely to create unjustified expectations about results. So \"best urgent care in town\" doesn't go on a page from us without your lawyer's OK.",
        refs: [S.tx101201],
      },
      { title: "We flag. You decide.", body: NOT_ADVICE },
    ],
    asks: [
      "Which hours are slow, and would you want more visits then?",
      "What do you treat, and what do you send elsewhere?",
      "Who owns the listing for each location?",
      "How long is the wait at your busiest times?",
      "Do you ask new patients how they found you?",
    ],
  },
  {
    slug: "veterinary-clinics",
    name: "Veterinary Clinics",
    trade: "veterinary clinics",
    word: "clients",
    metaDescription:
      "How pet owners search for a vet, what to say about emergencies on your listing, and how confidentiality shapes a review reply. No client stories yet, and we say so.",
    lead: "Pet owners search one way when the dog ate something at 9pm, and another way when they've just brought home a kitten. The first needs to know if you're open or where to go instead. The second reads how you treat animals and how you explain a bill.",
    compared: false,
    urgent: {
      intro: "An animal is hurt or sick, and the owner is scared.",
      searches: ["emergency vet near me", "vet open now", "24 hour vet", "dog ate chocolate", "cat not eating vet"],
    },
    planned: {
      intro: "A new pet, a move, or a bill that made them look elsewhere.",
      searches: ["vet near me", "puppy shots cost", "spay and neuter near me", "cat friendly vet", "exotic pet vet"],
    },
    listing: [
      {
        title: "Say what happens after hours",
        body: "If you don't see emergencies, make that clear and say where you send people. Your listing, your site and your phone message should all tell the same story.",
      },
      {
        title: "Say which animals you see",
        body: "A category won't tell someone you see rabbits, or only cats, and Google says not to use categories that way. Your description and your page can.",
        refs: [S.guidelines],
      },
      {
        title: "Grooming and boarding",
        body: "Google allows a separate profile only for a department that works as its own public-facing business, usually with its own entrance and a different category. A grooming table in the back probably isn't one.",
        refs: [S.guidelines],
      },
      {
        title: "A name that matches the sign",
        body: "If the clinic changed hands or names, your listing should say what's on the building today.",
      },
    ],
    reviews: [
      {
        title: "Confidential, even when the review isn't",
        body: "Texas law says a veterinarian \"may not violate the confidential relationship\" with a client. So replies don't discuss the animal's care or the bill, even if the review does. Other states have their own rules.",
        refs: [S.tx801],
      },
      {
        title: "Hard reviews get a person",
        body: "Some reviews are written in grief. We'd draft a short, kind reply and send it to you first, rather than use the standard wording.",
      },
      {
        title: "Asking, with care",
        body: "A request shouldn't go out the day after a pet was put to sleep, and you can set that exception. It can't become a way of asking only happy clients, which Google bars.",
        refs: [S.contribution],
      },
    ],
    limits: [
      {
        title: "Texas veterinary advertising",
        body: "The Texas board's rule bars false, deceptive or misleading ads. It names guarantees of satisfaction or a cure, claims of better quality the public can't reasonably verify, and calling yourself a specialist unless you're board certified in that specialty through the AVMA.",
        refs: [S.tx57330],
      },
      { title: "We flag. You decide.", body: NOT_ADVICE },
    ],
    asks: [
      "Do you see emergencies? If not, where do you send people?",
      "Which animals and services do you want more of?",
      "How do you count new clients in a month?",
      "Has the clinic changed names or owners?",
      "Who holds the login to your Google listing?",
    ],
  },
  {
    slug: "plumbing-companies",
    name: "Plumbing Companies",
    trade: "plumbing companies",
    word: "customers",
    metaDescription:
      "How people search for a plumber, why Google allows one profile for your whole area, and the Texas license number rule for ads. No client stories yet, and we say so.",
    lead: "A burst pipe at midnight and a water heater quote are two different jobs. The first goes to whoever answers. The second goes to whoever looks trustworthy after a few minutes of reading. And since customers don't come to you, Google treats your listing differently from a shop's.",
    compared: false,
    urgent: {
      intro: "Water is on the floor.",
      searches: ["plumber near me", "emergency plumber", "burst pipe", "water heater leaking", "sewer backup"],
    },
    planned: {
      intro: "A slow drain, a quote to compare, or a remodel coming up.",
      searches: ["water heater replacement cost", "tankless water heater installer", "repipe quote", "bathroom remodel plumber", "drain cleaning cost"],
    },
    listing: [
      {
        title: "You're the example Google uses",
        body: "Google names plumbers as a service-area business. If customers don't come to you, remove your address from your profile. A place with no permanent sign can't be listed as a storefront.",
        refs: [S.serviceArea],
      },
      {
        title: "One profile for the whole area",
        body: "Google allows a service-area business one profile for the area it serves. That's worth knowing before anyone sells you a listing for each city.",
        refs: [S.serviceArea],
      },
      {
        title: "\"24/7\" has to be true",
        body: "If your listing and site say 24 hours, someone has to answer at 2am. If there's an after-hours call-out fee, saying so on your page heads off a bad review later.",
      },
      {
        title: "Pages by job, not by town",
        body: "A page about water heaters with real jobs, fair ranges and what happens on the visit gives a reader something. Forty town pages with the name swapped don't.",
      },
    ],
    reviews: [
      {
        title: "Ask the same day, every time",
        body: "People remember who showed up. Ask right after the job, and ask everyone. Google bars asking only for good reviews, and the FTC bans fake reviews and buying good ones.",
        refs: [S.contribution, S.ftc],
      },
      {
        title: "Answering a bad review about price",
        body: "Say what you can in general terms and invite a call. Don't post the invoice or the customer's address.",
      },
    ],
    limits: [
      {
        title: "The license number on your ads (Texas)",
        body: "Texas requires the license number in all advertisements by a plumbing company designed to bring in plumbing business, whatever the media, with a short list of exceptions. It also goes on your service vehicles.",
        refs: [S.tx36710],
      },
      {
        title: "Who can advertise plumbing (Texas)",
        body: "A Texas company can't advertise plumbing unless it has secured a Responsible Master Plumber, as an employee or the owner. Other states have their own rules.",
        refs: [S.tx3679],
      },
      { title: "We flag. You decide.", body: NOT_ADVICE },
    ],
    asks: [
      "Which jobs make you money: drains, water heaters or repipes?",
      "What share of your calls come after hours, and who takes them?",
      "Whose license is on the trucks, and is the number on your site?",
      "Do you charge a call-out fee, and do you want it on your page?",
      "How do you count the jobs that came from Google today?",
    ],
  },
];

export function industryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

/** Every source a page cites, in the order the page cites them. */
export function sourcesFor(industry: Industry): Source[] {
  const seen = new Map<string, Source>();
  for (const point of [...industry.listing, ...industry.reviews, ...industry.limits]) {
    for (const ref of point.refs ?? []) if (!seen.has(ref.url)) seen.set(ref.url, ref);
  }
  return [...seen.values()];
}
