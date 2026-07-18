const statements = [
  "It's 7:04pm. Dead AC, ringing phone, and you're elbow-deep in a condenser across town. Eight in ten callers who hit voicemail never call back. They just dial the next name on Google.",
  "One missed call costs you more than one job. It's the repair, the maintenance plan, the callbacks, and ten years of referrals, all handed to whoever answered first.",
  "Good operators still lose customers to silence: the follow-up that never went out, the plan that quietly lapsed, the review nobody asked for.",
];

export default function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            The problem
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight text-[var(--color-ink)] font-medium">
            You&apos;re great at the work.
            <br />
            You&apos;re drowning in the phones.
          </h2>
        </div>

        <ul className="space-y-6">
          {statements.map((line, i) => (
            <li
              key={i}
              className="text-xl md:text-2xl leading-snug text-[var(--color-ink)] font-[family-name:var(--font-display)] font-normal"
            >
              <span className="brand-dot mr-3 align-middle" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
