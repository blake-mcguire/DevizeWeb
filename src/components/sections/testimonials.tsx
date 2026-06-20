const testimonials = [
  {
    quote:
      "We were missing calls every night. Devize picked up the first weekend we turned it on and booked four jobs before Monday.",
    name: "Jamie R.",
    role: "Owner, HVAC shop",
  },
  {
    quote:
      "It's not a chatbot. It talks to my customers the way my best CSR does — and it never has a bad day.",
    name: "Marcus T.",
    role: "GM, Plumbing company",
  },
  {
    quote:
      "The follow-ups alone paid for the whole thing in month one. I didn't know how many jobs we were leaving on the table.",
    name: "Dee W.",
    role: "Owner, Electrical contractor",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white/60 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
          What operators say
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-white p-7"
            >
              <blockquote className="text-[1.05rem] leading-relaxed text-[var(--color-ink)]">
                <span className="brand-text-gradient font-[family-name:var(--font-display)] text-3xl leading-none mr-1">
                  &ldquo;
                </span>
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {t.name}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                  {t.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
