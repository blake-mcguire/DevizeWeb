const pillars = [
  {
    number: "01",
    title: "Answer",
    summary: "AI voice agents",
    body:
      "Every call answered in two rings, 24/7. Quotes, bookings, and intake — handled without hiring a receptionist or losing jobs to voicemail.",
    items: ["Inbound voice agent", "Call qualification", "Live transfer to techs"],
  },
  {
    number: "02",
    title: "Dispatch",
    summary: "Schedule + route",
    body:
      "Jobs routed to the right tech, with the right parts, in the right window. Your schedule fills itself while you focus on the work.",
    items: ["Smart scheduling", "Tech dispatch", "ETA + status texts"],
  },
  {
    number: "03",
    title: "Follow through",
    summary: "Reviews + reactivation",
    body:
      "Every job ends with a review request, a follow-up, and a plan to bring them back. The customers you already have become the customers you keep.",
    items: ["Review capture", "Reactivation campaigns", "Upsell triggers"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            The system
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            Three layers.
            <br />
            One operating system.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Devize runs alongside your existing CRM and field software. You
            don&apos;t rip anything out — you just stop losing jobs.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.number}
              className="group relative rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(28,42,57,0.15)] hover:border-[var(--color-ink)]/15"
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
                  <li key={item} className="flex items-center gap-2">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
