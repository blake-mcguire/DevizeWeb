type Pillar = {
  id?: string;
  number: string;
  title: string;
  summary: string;
  body: string;
  items: string[];
  footnote?: string;
};

const pillars: Pillar[] = [
  {
    number: "01",
    title: "Local SEO",
    summary: "Show up on the map",
    body:
      "Google picks the names on its map by how well a listing matches the search, how close it is, and how well known the business is. We work on the parts you can change, starting with your Google listing, your Google Business Profile.",
    items: [
      "Your Google listing: categories, services, hours, photos, posts and questions",
      "A routine to ask every customer for a review, and a reply to every review",
      "A useful page on your site for each service and each town you serve",
      "The same name, address and phone everywhere you're listed",
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
      "Your business listed, and mentioned, on the directories and local sites AI answers often draw from",
    ],
    footnote:
      "Nobody outside these companies sees exactly how they choose. We work on what they read.",
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

        <p className="mt-8 text-center text-sm text-[var(--color-ink-muted)] max-w-2xl mx-auto">
          We won&apos;t promise a guaranteed spot or results in weeks, and we
          won&apos;t do anything that breaks Google&apos;s rules for listings.
        </p>
      </div>
    </section>
  );
}
