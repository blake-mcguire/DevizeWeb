const statements = [
  'Search "dentist" or "ac repair" on a phone and Google shows a map with three businesses under it. Those get looked at first. Everyone else is a scroll away.',
  "Ask ChatGPT or Google's AI who to call and you get a few names, not a page of links.",
  "Good reviews alone don't put you there. Google weighs how well your listing matches the search, how close you are, and how well known you are. Two of those three can be worked on.",
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
            Google only shows a few names.
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
