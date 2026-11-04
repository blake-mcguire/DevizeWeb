import { Eyebrow, H2, Section } from "@/components/page-parts";
import { FIRST_30_DAYS } from "@/lib/offer-copy";

export default function First30Days({ band = false }: { band?: boolean }) {
  return (
    <Section id="how-it-works" band={band}>
      <div className="max-w-2xl">
        <Eyebrow>How it starts</Eyebrow>
        <H2 className="mt-4">Your first 30 days, in order.</H2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          This is the order of the work. It isn&apos;t a promised result, and
          no step comes with a rank or a date attached.
        </p>
      </div>

      <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {FIRST_30_DAYS.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
              {i + 1}
            </span>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] font-medium tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
