const placeholderLogos = [
  "Acme HVAC",
  "Northwind Plumbing",
  "BrightSpark Electric",
  "Evergreen Roofing",
  "Silverline Services",
  "Oakridge Home Co.",
];

export default function Logos() {
  return (
    <section aria-label="Customers" className="border-y border-[var(--color-border)] bg-[var(--color-surface-raised)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
          Trusted by home services operators
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {placeholderLogos.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center text-[var(--color-ink-muted)] text-sm font-medium tracking-tight py-2"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
