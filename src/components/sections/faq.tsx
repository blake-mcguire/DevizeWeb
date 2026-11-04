import { EMAIL, FOUNDER, GOOGLE_ADS, LABEL, LABEL_PLAIN, PRICE } from "@/lib/offer-copy";

// Feeds both the visible list below and the FAQPage JSON-LD on the home page,
// so the structured data always matches what a visitor reads.
// Rewritten 2026-11-04 from the site-seo-aeo answers, minus $750 and town pages.
// DRAFT: all of this wording is for Blake to confirm. Production builds stay
// blocked until it is (offerCopyConfirmed in src/lib/launch-gate.json).
export const faqs = [
  {
    q: "What does \"digital strategy partner\" mean here?",
    a: `${LABEL} is what we call the way we work. ${LABEL_PLAIN} It doesn't mean we buy into your business, and it has nothing to do with Google's partner program.`,
  },
  {
    q: "What's in the free audit?",
    a: "We run the searches your customers run from dozens of spots around your business and show where you came up: in the top three, fourth to twentieth, or nowhere in the first twenty, and who came up instead. Then 21 checks on your Google listing, your reviews and your website, and the fixes we'd make first, in order. We only need your business name, your town and an email to send it to. There's a sample on this site, on invented data, marked as a sample.",
  },
  {
    q: "What does it cost?",
    a: `${PRICE.headline} That's for SEO and review management. Google Ads management is an optional add-on at $150 a month, and ${GOOGLE_ADS.spend.charAt(0).toLowerCase()}${GOOGLE_ADS.spend.slice(1)} ${PRICE.term} ${PRICE.audit} There's nothing to sign to get it, and you see where you stand before you pay for anything.`,
  },
  {
    q: "Is there a contract?",
    a: `No long contract. ${PRICE.term} Tell us by email, and the cancellation takes effect at the end of the month you've already paid for. Your listing, your site and every page we wrote stay yours.`,
  },
  {
    q: "What happens if I cancel?",
    a: `${PRICE.keep} The work runs to the end of the month you've paid for. Your Google listing, your reviews and your site were always in your name. We hand over every page and file before we remove our access.`,
  },
  {
    q: "Who will I be dealing with?",
    // TODO(Blake): Conner and Jaden sign cold mail. Add a line naming them only if accurate.
    a: `${FOUNDER.name} runs Devize from ${FOUNDER.town}. Write to ${EMAIL}.`,
  },
  {
    q: "Do you have client results to show me?",
    a: "No. Devize is new, so there are no client stories here, and we won't dress anything up as one. You can judge us by the sample, the price and the terms.",
  },
  {
    q: "What about ChatGPT and Google's AI answers?",
    // TODO(Blake): does "AEO" stay named? Your new words say "SEO and Review management" only, so it appears once here and nowhere else.
    a: "When someone asks ChatGPT, Google's AI or another assistant for a local business, it answers with a few names instead of a list of links. You'll sometimes hear the work on this called AEO. It sits on the same foundations as SEO: the same facts everywhere and plain answers to common questions. Google says there's nothing extra to do to appear in its AI answers beyond the basics of good SEO. Nobody outside these companies sees exactly how they choose. We keep your facts plain in the places they may read. We don't track AI answers yet, and we can't promise one will name you.",
  },
  {
    q: "Can you guarantee I'll be in the top three?",
    a: "No, and be careful with anyone who does. Google says there's no way to pay for a better local ranking. How close you are to the person searching is part of how Google decides, and nobody can move your building. What we can promise is the work we list, done and counted each month, and an honest map of where you stand.",
  },
  {
    q: "How long until I see a difference?",
    a: "We can't give you a date, and we'd be careful of anyone who does. A wrong phone number is right the day it's fixed. A place on the map moves slowly, if it moves at all, because distance does much of the deciding. Places also shift on their own with no edits, so our note tells you what we did and what changed, and won't claim credit for every move.",
  },
  {
    q: "Do you do the work, or do I?",
    a: "We do it. There's no software to learn. Once you've added us as a manager on your Google listing, there's nothing for you to log into. Each month you get a re-run of the map, by hand for now, and a one-page note. We'll ask you for photos of your work, the few answers only you know, and your own numbers if you'll share them. You sign off once, at the start, on how we reply to reviews in your name. At the start, someone in your office sends the review requests by hand.",
  },
  {
    q: "Do I need a new website?",
    a: "Probably not. We work with the site you have and improve one page a month. If your site is broken or doesn't work on a phone, we'll tell you plainly. A rebuild isn't part of the monthly price.",
  },
  {
    q: "What goes on a better page?",
    a: "One service per page, in your own words. What you do and for whom, the questions people ask before they call, photos of real jobs, and the same name, phone and address as your Google listing. We don't copy a page and swap the town name.",
  },
  {
    q: "Do you need access to my website?",
    a: "Yes, for the monthly work, because the better page goes on your site. Either you give us a login, or we write the page and send it to the person who runs your site to put up. The free audit needs no access at all: it reads what anyone can see.",
  },
  {
    q: "Do you need access to my Google listing?",
    a: "Not for the audit. It uses what anyone can see on Google and on your website. For the monthly work you add us as a manager on your Google Business Profile. You stay the owner and can remove us any time.",
  },
  {
    q: "Do you write or buy reviews?",
    a: "No. Fake reviews, paid reviews and asking only happy customers all break Google's rules, and the FTC bans fake reviews. We help set up a routine so every customer gets asked, by hand until a tool passes our checks, and we answer every review. If you run a health practice, a privacy contract comes first.",
  },
  {
    q: "Will you run my Google Ads?",
    a: `If you want us to. It's an optional add-on with counted monthly work, inside tight limits, in your own account. ${GOOGLE_ADS.disclosure}`,
  },
  {
    q: "Do you work for Google?",
    a: "No. Devize is an independent business, and we're not a Google Partner. Google doesn't charge for a Business Profile, so if someone calls saying your listing will be removed unless you pay, it isn't Google.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-white/60 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
          Questions
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight text-[var(--color-ink)] font-medium">
          Straight answers.
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faqs.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex items-center justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-[1.05rem] md:text-lg text-[var(--color-ink)] font-medium pr-4">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-[var(--color-border)] text-[var(--color-ink-soft)] transition-transform group-open:rotate-45"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed md:pr-11">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
