const trades = [
  "Dentists",
  "HVAC",
  "Plumbers",
  "Roofers",
  "Electricians",
  "And businesses like them",
];

export default function WhoItsFor() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-28">
      <div className="rounded-3xl bg-[var(--color-ink)] text-white px-8 py-14 md:py-16 md:px-14 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.25]"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 100% 100%, rgba(122,63,229,0.6) 0%, rgba(122,63,229,0) 60%), radial-gradient(ellipse 50% 60% at 0% 0%, rgba(51,0,153,0.5) 0%, rgba(51,0,153,0) 60%)",
          }}
        />

        <div className="relative grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-medium">
              Who it&apos;s for
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight font-medium">
              Owner-run businesses that people search for nearby.
            </h2>
          </div>

          <div>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              If people near you search for what you do before they call, this
              is for you.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {trades.map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/85"
                >
                  <span className="brand-dot" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.95rem] text-white/65 leading-relaxed">
              For a practice, the search is &ldquo;dentist&rdquo; or
              &ldquo;dentist near me&rdquo;, and the people searching are new
              patients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
