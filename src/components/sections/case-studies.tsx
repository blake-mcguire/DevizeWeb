import Link from "next/link";

const cases = [
  {
    company: "Northgate Heating & Air",
    tag: "HVAC · 28 techs · Denver, CO",
    title: "Win-back to 1,800 lapsed maintenance customers",
    story: "1,800 lapsed maintenance plans. 486 renewals in 90 days.",
    metric: "+$73,000 recovered",
  },
  {
    company: "Cedar Peak Heating & Cooling",
    tag: "HVAC · 18 techs · Boise, ID",
    title: "Three years of unclosed estimates, reopened",
    story: "240 estimates dormant since 2023. 41 jobs reopened in two weeks.",
    metric: "+$57,000 recovered",
  },
  {
    company: "Fairwind Heating & Air",
    tag: "HVAC · 12 techs · Portland, OR",
    title: "Cold reactivation of one-time repair customers",
    story: "600 cold, one-repair customers. 63 tune-ups and 12 new plans in 45 days.",
    metric: "+$38,000 recovered",
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
            Reactivation, in real numbers.
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
            className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(28,42,57,0.15)] hover:border-[var(--color-ink)]/15"
          >
            {/* Visual tile with brand gradient plus company + tag overlaid */}
            <div
              className="aspect-[16/9] w-full relative"
              style={{
                background:
                  "linear-gradient(135deg, #1C2A39 0%, #330099 60%, #7A3FE5 120%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/70 font-medium">
                  {c.tag}
                </span>
                <span className="font-[family-name:var(--font-display)] text-white text-lg md:text-xl font-medium tracking-tight leading-snug">
                  {c.company}
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-1 p-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg md:text-xl text-[var(--color-ink)] font-medium leading-snug tracking-tight">
                {c.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {c.story}
              </p>
              <p className="mt-auto pt-6 font-[family-name:var(--font-display)] text-3xl md:text-4xl brand-text-gradient font-medium tracking-tight leading-none">
                {c.metric}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
