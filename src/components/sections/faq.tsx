export const faqs = [
  {
    q: "Is this a tool or a managed service?",
    a: "Both. We build the system on top of your existing stack — voice, CRM, dispatch — and operate it with you. You get the platform plus the setup and tuning.",
  },
  {
    q: "Do I have to replace my current software?",
    a: "No. Devize integrates with what you already use (ServiceTitan, Housecall Pro, Jobber, and others). We add a layer, not a replacement.",
  },
  {
    q: "How fast can we be live?",
    a: "Most shops are taking real calls through Devize within two weeks. Full rollout across dispatch and follow-up typically lands inside 30–45 days.",
  },
  {
    q: "What if the AI gets something wrong?",
    a: "Every call is transcribed and reviewed. We tune the agent weekly. For anything outside its scope, it transfers live to your team — never stuck in a dead-end.",
  },
  {
    q: "What does it cost?",
    a: "Pricing is a function of call volume and scope. Most customers see payback inside the first month from recovered missed calls alone. We'll run the numbers together.",
  },
];

export default function Faq() {
  return (
    <section className="bg-white/60 border-y border-[var(--color-border)]">
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
