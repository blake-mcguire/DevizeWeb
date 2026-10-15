import { EMAIL, FOUNDER, PRICE } from "@/lib/offer-copy";

// Feeds both the visible list below and the FAQPage JSON-LD on the home page,
// so the structured data always matches what a visitor reads.
// New or changed on 2026-10-15 (site pass 2): cost, contract, who you deal
// with, website access, and what goes on a page. The answers marked DRAFT are
// wording for Blake to confirm; the price and month-to-month lines come from
// src/lib/offer-copy.ts. Production builds stay blocked until they are
// confirmed (offerCopyConfirmed in src/lib/launch-gate.json).
export const faqs = [
  {
    q: "What's in the free audit?",
    a: "We run the searches your customers run from dozens of spots around your business and show where you came up: in the top three, fourth to twentieth, or nowhere in the first twenty, and who came up instead. Then 21 checks on your Google listing, your reviews and your website, and the fixes we'd make first, in order. We only need your business name, your town and an email to send it to. There's a real one, with the names taken out, in the sample audit on this page.",
  },
  {
    q: "What does it cost?",
    // DRAFT (wording; the price is Blake's decision)
    a: `${PRICE.headline} ${PRICE.included} ${PRICE.term} ${PRICE.audit} There's nothing to sign to get it, and you see where you stand before you pay for anything.`,
  },
  {
    q: "Is there a contract?",
    // DRAFT (wording; month to month is Blake's decision, and /terms v2.0 says so)
    a: `No long contract. ${PRICE.term} Tell us by email, and the cancellation takes effect at the end of the month you've already paid for. Your listing, your site and every page we wrote stay yours.`,
  },
  {
    q: "Who will I be dealing with?",
    // DRAFT
    // "He runs every audit himself" holds while the reply funnel is in draft
    // mode; see FOUNDER.chip in src/lib/offer-copy.ts before switching to auto.
    a: `${FOUNDER.name}, who runs Devize from ${FOUNDER.town}. He runs every audit himself. Write to him at ${EMAIL}.`,
  },
  {
    q: "What is AEO, and how is it different from SEO?",
    a: "AEO stands for answer engine optimization. When someone asks ChatGPT, Google's AI or another assistant for a local business, it answers with a few names instead of a list of links. AEO is making your business easy for those tools to read and trust: the same facts everywhere, plain answers to common questions, and consistent listings on the sites they already use. It sits on the same foundations as SEO. Google says there's nothing extra to do to appear in its AI answers beyond the basics of good SEO.",
  },
  {
    q: "Can you guarantee I'll be in the top three?",
    a: "No, and be careful with anyone who does. Google says there's no way to pay for a better local ranking. How close you are to the person searching is part of how Google decides, and nobody can move your building. What we can promise is the work, done every month, and an honest map of where you stand.",
  },
  {
    q: "How long until I see a difference?",
    a: "Months, not weeks. Moving up near your business comes first. Farther out, distance counts for more, and every gain is slower. Each month we rerun the same searches, so you can see what moved.",
  },
  {
    q: "Do you do the work, or do I?",
    a: "We do it. There's no software to learn. Once you've added us as a manager on your Google listing, there's nothing for you to log into. Each month you get the new Google map and a short note on what we did. We don't track AI answers yet. We'll ask you for photos of your work and the few answers only you know, and you sign off once, at the start, on how we reply to reviews in your name.",
  },
  {
    q: "Do I need a new website?",
    a: "Probably not. We work with the site you have: a useful page for each service and town you serve, built up over the months (up to 2 a month), and the same phone and address as your listing. If your site can't be edited or doesn't work on a phone, the audit will show it, and we'll talk it through.",
  },
  {
    q: "Do you need access to my website?",
    // DRAFT
    a: "Yes, for the monthly work, because the service and town pages go on your site. Either you give us a login, or we write the pages and send them to the person who runs your site to put up. The free audit needs no access at all: it reads what anyone can see.",
  },
  {
    q: "What goes on a service or town page?",
    // DRAFT
    a: "One service, or one town, per page. What you do there and for whom, the questions people ask before they call, photos of real jobs, and the same name, phone and address as your Google listing. Each page is written for that service or town. We never copy one page and swap the town name.",
  },
  {
    q: "Do you need access to my Google listing?",
    a: "Not for the audit. It uses what anyone can see on Google and on your website. For the monthly work you add us as a manager on your Google Business Profile. You stay the owner and can remove us any time.",
  },
  {
    q: "Do you write or buy reviews?",
    a: "No. Fake reviews, paid reviews and asking only happy customers all break Google's rules, and the FTC bans fake reviews. We set up a simple routine so every customer gets asked and every review gets a reply.",
  },
  {
    q: "Do you work for Google?",
    a: "No. Devize is an independent company. Google doesn't charge for a Business Profile, so if someone calls saying your listing will be removed unless you pay, it isn't Google.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-white/60 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-28">
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
              <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed pr-11">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
