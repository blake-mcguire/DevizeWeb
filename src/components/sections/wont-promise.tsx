import { Eyebrow, H2, H3, Section } from "@/components/page-parts";
import { WONT_DO, WONT_PROMISE } from "@/lib/offer-copy";

function XMark() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#B3261E]/30 bg-[#B3261E]/[0.07] text-[#B3261E]"
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 2.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function WontPromise() {
  return (
    <Section id="wont-promise">
      <div className="max-w-2xl">
        <Eyebrow>Limits</Eyebrow>
        <H2 className="mt-4">What we won&apos;t promise.</H2>
      </div>

      <ul className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {WONT_PROMISE.map((w) => (
          <li key={w.title} className="flex gap-3">
            <XMark />
            <div>
              <p className="font-medium text-[var(--color-ink)] leading-snug">{w.title}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">{w.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
        <H3>And what we won&apos;t do</H3>
        <ul className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-3">
          {WONT_DO.map((w) => (
            <li key={w.title} className="flex gap-3">
              <XMark />
              <div>
                <p className="font-medium text-[var(--color-ink)] leading-snug">{w.title}</p>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">{w.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
