const stats = [
  { value: "24/7", label: "Call coverage" },
  { value: "< 2s", label: "Answer time" },
  { value: "38%", label: "More booked jobs" },
  { value: "4×", label: "Review velocity" },
];

export default function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-28">
      <div className="rounded-3xl bg-[var(--color-ink)] text-white px-8 py-16 md:py-20 md:px-14 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.25]"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 100% 100%, rgba(122,63,229,0.6) 0%, rgba(122,63,229,0) 60%), radial-gradient(ellipse 50% 60% at 0% 0%, rgba(51,0,153,0.5) 0%, rgba(51,0,153,0) 60%)",
          }}
        />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-medium">
            By the numbers
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight font-medium max-w-xl">
            A system that shows up in the P&amp;L.
          </h2>

          <div className="mt-12 grid gap-10 grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="brand-text-gradient font-[family-name:var(--font-display)] text-5xl md:text-6xl font-medium tracking-tight leading-none">
                  {s.value}
                </div>
                <p className="mt-3 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
