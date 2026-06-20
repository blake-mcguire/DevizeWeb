import Link from "next/link";

const cases = [
  {
    tag: "HVAC · 22 techs",
    title: "Answered every after-hours call. Booked 37 new jobs in 60 days.",
    metric: "+$184k pipeline",
  },
  {
    tag: "Plumbing · 8 trucks",
    title: "Cut dispatcher overhead in half without losing a single job.",
    metric: "−52% admin time",
  },
  {
    tag: "Electric · multi-branch",
    title: "Turned post-job follow-up into a repeatable revenue channel.",
    metric: "2.3× review volume",
  },
];

export default function CaseStudies() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            In the field
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight text-[var(--color-ink)] font-medium">
            Real shops. Real numbers.
          </h2>
        </div>
        <Link
          href="/articles"
          className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
        >
          Read the writeups →
        </Link>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cases.map((c, i) => (
          <article
            key={i}
            className="group rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(28,42,57,0.15)] hover:border-[var(--color-ink)]/15"
          >
            {/* Placeholder visual — gradient tile */}
            <div
              className="aspect-[4/3] w-full relative"
              style={{
                background:
                  "linear-gradient(135deg, #1C2A39 0%, #330099 60%, #7A3FE5 120%)",
              }}
            >
              <div className="absolute inset-0 flex items-end p-5">
                <span className="text-xs uppercase tracking-[0.14em] text-white/80 font-medium">
                  {c.tag}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg md:text-xl text-[var(--color-ink)] font-medium leading-snug tracking-tight">
                {c.title}
              </h3>
              <p className="mt-4 text-sm brand-text-gradient font-medium">
                {c.metric}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
