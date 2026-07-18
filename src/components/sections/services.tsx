const pillars = [
  {
    number: "01",
    title: "Revenue Recovery",
    summary: "Catch every call",
    body:
      "Every inbound call answered in about two rings, 24/7: after hours, weekends, when every line is lit and your techs are in attics and crawlspaces. It qualifies the caller and books the job straight into your schedule, so the caller hangs up with an appointment.",
    items: [
      "Answers in about two rings, 24/7",
      "Qualifies the caller: emergency, service, or tire-kicker",
      "Books the job straight into your schedule",
      "Live transfer to your team",
    ],
  },
  {
    number: "02",
    title: "Revenue Retention",
    summary: "Keep every customer",
    body:
      "You already paid to win these customers. Retention keeps them: post-job follow-up, review capture, appointment reminders, and win-back nudges when a maintenance plan lapses. Existing customers are the cheapest revenue you'll ever book, and this makes sure they book it with you.",
    items: [
      "Post-job follow-up and review capture",
      "Appointment reminders and confirmations",
      "Lapsed maintenance-plan win-back by text and call",
      "Referral capture from happy customers",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            The systems
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            Recover the calls.
            <br />
            Keep the customers.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Two systems, one job: stop revenue from leaking out of a good
            business. Devize runs alongside the CRM and field software you
            already use.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
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
