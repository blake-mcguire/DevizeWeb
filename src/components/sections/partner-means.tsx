import { Eyebrow, H2, Section } from "@/components/page-parts";
import { NOT_GOOGLE, NOT_INVESTOR, PARTNER_MEANS } from "@/lib/offer-copy";

export default function PartnerMeans() {
  return (
    <Section id="partner" band>
      <div className="max-w-2xl">
        <Eyebrow>Plain words</Eyebrow>
        <H2 className="mt-4">What &ldquo;partner&rdquo; means here.</H2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          Plenty of firms use the word. This is all we mean by it, and it&apos;s
          how we work, not who we&apos;ve worked with.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PARTNER_MEANS.map((item) => (
          <li key={item.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <span className="brand-dot" aria-hidden="true" />
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] font-medium tracking-tight leading-snug">
              {item.title}
            </h3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{item.detail}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:grid-cols-2 md:p-7">
        <p className="text-[var(--color-ink)] leading-relaxed">{NOT_INVESTOR}</p>
        <p className="text-[var(--color-ink)] leading-relaxed">{NOT_GOOGLE}</p>
      </div>
    </Section>
  );
}
