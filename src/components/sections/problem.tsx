const statements = [
  "You're not short on leads. You're short on the systems that turn them into jobs.",
  "Every missed call is a competitor's win.",
  "Good operators lose customers to bad follow-up — not bad work.",
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
            You&apos;re not behind.
            <br />
            You&apos;re just stuck in the phones.
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
