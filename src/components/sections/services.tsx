import { PRICE, WONT_DO } from "@/lib/offer-copy";

type Pillar = {
  id?: string;
  number: string;
  title: string;
  summary: string;
  body: string;
  items: string[];
  footnote?: string;
  /** A small tag under the title. */
  tag?: string;
};

const pillars: Pillar[] = [
  {
    number: "01",
    title: "Local SEO",
    tag: `Included in the ${PRICE.display} monthly fee`,
    summary: "Show up on the map",
    body:
      "Google picks the names on its map by how well a listing matches the search, how close it is, and how well known the business is. We work on the parts you can change, starting with your Google listing, your Google Business Profile.",
    items: [
      "Your Google listing: categories, services, hours, photos, posts and questions",
      "A routine to ask every customer for a review, and a reply to every review",
      "A useful page for each service and town you serve, built up over the months (up to 2 a month)",
      "Your details checked on the main directories and corrected where we can, with you claiming any that only the owner can change",
    ],
  },
  {
    id: "aeo",
    number: "02",
    title: "AEO",
    summary: "Be the answer",
    body:
      "Ask ChatGPT or Google's AI for a dentist or an AC company nearby and it names a few. Google's AI reads your Google listing and your website. ChatGPT and other assistants search the web: your site, your reviews, and directories like Yelp. We work to make all of them say the same clear things about you.",
    items: [
      "Facts machines can read: services, hours, towns served, structured data",
      "Plain answers to the questions customers ask before they call",
      "Your details checked on the directories AI answers often draw from, and corrected where we can",
    ],
    footnote:
      "Nobody outside these companies sees exactly how they choose. We work on what they read.",
    tag: `Included in the ${PRICE.display} monthly fee`,
  },
];

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            The work
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            Local SEO and AEO,
            <br />
            done for you.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Local SEO is the work that helps you show up on Google&apos;s map.
            AEO, answer engine optimization, is the work that helps AI
            assistants name you when someone nearby asks who to call. Most of
            it is the same groundwork.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {pillars.map((p) => (
            <article
              key={p.number}
              id={p.id}
              className="group relative scroll-mt-24 flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(28,42,57,0.15)] hover:border-[var(--color-ink)]/15"
            >
              <div className="flex items-center justify-between">
                <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
                  {p.number}
                </span>
                <span className="brand-dot" aria-hidden="true" />
              </div>

              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] text-[var(--color-ink)] font-medium tracking-tight">
                {p.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)] uppercase tracking-[0.12em]">
                {p.summary}
              </p>
              {p.tag && (
                <p className="mt-3 inline-flex self-start items-center gap-1.5 rounded-full border border-[var(--color-brand)]/25 bg-[var(--color-brand)]/[0.07] px-2.5 py-0.5 text-xs font-medium text-[var(--color-brand)]">
                  {p.tag}
                </p>
              )}

              <p className="mt-5 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                {p.body}
              </p>

              <ul className="mt-6 space-y-2 text-sm text-[var(--color-ink)]/80">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {p.footnote && (
                <p className="mt-auto pt-6 text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  {p.footnote}
                </p>
              )}
            </article>
          ))}
        </div>

        {/* What we won't do: the line that used to sit small and grey under
            the cards, now a block a careful owner can't miss. Wording in
            src/lib/offer-copy.ts (DRAFT). */}
        <div id="wont-do" className="mt-5 scroll-mt-24 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-7 md:p-10">
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] text-[var(--color-ink)] font-medium tracking-tight">
            What we won&apos;t do
          </h3>
          <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
            {WONT_DO.map((w) => (
              <li key={w.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#B3261E]/30 bg-[#B3261E]/[0.07] text-[#B3261E]"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 2.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-[var(--color-ink)] leading-snug">{w.title}</p>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">{w.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
