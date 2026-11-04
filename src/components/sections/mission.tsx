import Link from "next/link";
import { Eyebrow, Section } from "@/components/page-parts";
import { MISSION, MISSION_GROUPS, MISSION_NOTE } from "@/lib/offer-copy";

/**
 * The mission and the services grouped by what they do for it. Blake,
 * 2026-11-04: the products are how the mission is delivered, not the mission.
 * Used on the home page and the services index.
 */
export function MissionGroups({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="grid gap-5 md:grid-cols-3">
        {MISSION_GROUPS.map((group, i) => (
          <li key={group.title} className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
              0{i + 1}
            </span>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
              {group.title}
            </h3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{group.lead}</p>
            <ul className="mt-5 space-y-2.5 text-[0.95rem] text-[var(--color-ink)]">
              {group.items.map((item) => (
                <li key={item.label} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                  <span>
                    {item.href ? (
                      <Link href={item.href} className="underline underline-offset-4 decoration-[var(--color-ink)]/20 hover:decoration-[var(--color-ink)]">
                        {item.label}
                      </Link>
                    ) : (
                      item.label
                    )}
                    {item.note && <span className="text-[var(--color-ink-soft)]"> ({item.note})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Mission() {
  return (
    <Section id="services">
      <div className="max-w-4xl">
        <Eyebrow>Why Devize exists</Eyebrow>
        <p className="mt-4 font-[family-name:var(--font-display)] text-3xl md:text-[2.625rem] leading-[1.12] tracking-tight text-[var(--color-ink)] font-medium">
          {MISSION}
        </p>
        <p className="mt-5 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">{MISSION_NOTE}</p>
      </div>
      <MissionGroups className="mt-10" />
      <p className="mt-6">
        <Link href="/services" className="text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
          See every service, with what&apos;s in it and what&apos;s left out
        </Link>
      </p>
    </Section>
  );
}
