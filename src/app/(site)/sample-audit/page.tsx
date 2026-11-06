import type { Metadata } from "next";
import { Eyebrow, GetInTouch, H2, H3, PageHero, Section } from "@/components/page-parts";
import { SampleMap, SampleMapLegend, SampleTag, WhoCameUpTable } from "@/components/sections/sample-audit";
import { cn } from "@/lib/cn";
import { MARKS } from "@/lib/marks";
import { SAMPLE, SAMPLE_CHECKS, SAMPLE_FIXES, SAMPLE_NOTE, SAMPLE_SKIPS, type CheckResult } from "@/lib/sample-audit";

export const metadata: Metadata = {
  title: "Sample Audit",
  description:
    "What a Devize Google Listing and Map Audit looks like: the map, who came up instead, the 21 checks and the fixes in order. The business and the numbers are made up, and every part is marked as a sample.",
  alternates: { canonical: "/sample-audit" },
};

const RESULT: Record<CheckResult, { mark: string; label: string; cls: string }> = {
  pass: { mark: "✓", label: "Pass", cls: "text-[#1F7A45] bg-[#2E9E5B]/10 border-[#2E9E5B]/30" },
  gap: { mark: "✗", label: "Gap", cls: "text-[#B3261E] bg-[#B3261E]/[0.07] border-[#B3261E]/25" },
  part: { mark: "!", label: "In part", cls: "text-[#8A5A00] bg-[#E0A500]/15 border-[#E0A500]/40" },
};

function CardHead({ title }: { title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <H3>{title}</H3>
      <SampleTag />
    </div>
  );
}

function CheckGroup({ group }: { group: (typeof SAMPLE_CHECKS)[number] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">
          {group.group} ({group.rows.length})
        </p>
        <SampleTag />
      </div>
      <ul className="mt-4 space-y-4">
        {group.rows.map((c) => {
          const r = RESULT[c.result];
          return (
            <li key={c.check} className="flex gap-3">
              <span className={cn("mt-0.5 inline-flex h-6 min-w-[4.25rem] shrink-0 items-center justify-center gap-1 rounded-full border px-2 text-xs font-medium", r.cls)}>
                <span aria-hidden="true">{r.mark}</span>
                {r.label}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-[var(--color-ink)] leading-snug">{c.check}</p>
                <p className="mt-0.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">{c.finding}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SampleAuditPage() {
  const { totals, searches, spotCount, radiusMi, spacingMi, phrases, whoCameUp } = SAMPLE;
  const leader = whoCameUp[0];
  const allChecks = SAMPLE_CHECKS.flatMap((g) => g.rows);
  const gaps = allChecks.filter((c) => c.result === "gap").length;
  const parts = allChecks.filter((c) => c.result === "part").length;

  return (
    <>
      <PageHero
        eyebrow="Sample audit"
        title="What an audit looks like."
        subhead="It shows the map, who came up instead, the 21 checks and the fixes in order."
      >
        <SampleTag className="border-white bg-white px-3 py-1 text-sm" />
      </PageHero>

      <Section className="pb-0 md:pb-0">
        <div className="rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
          <p className="text-lg text-[var(--color-ink)] leading-relaxed">{SAMPLE_NOTE}</p>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Part 1</Eyebrow>
          <H2 className="mt-4">The map, and who came up instead.</H2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          <figure className="min-w-0 rounded-lg border border-[var(--color-border)] bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                The &ldquo;{SAMPLE.drawnPhrase}&rdquo; searches, one at each of {spotCount} spots
              </p>
              <SampleTag />
            </div>
            <SampleMap className="mt-4" />
            <figcaption className="mt-4 space-y-3">
              <SampleMapLegend />
              {/* TODO(Blake): "says which spots and which day" must hold on every audit. Mixed
                  read dates are one of the four faults in the 2026-11-04 journal. (This note sat
                  on the Services page's audit block until that block came out on 5 Nov.) */}
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                In a real audit, each dot is one phone search from a set spot, and the audit
                says which spots and which day. Here the dots are {spacingMi} mile apart, out
                to {radiusMi} miles from the business.
              </p>
            </figcaption>
          </figure>

          <div className="min-w-0 space-y-6">
            <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {searches} searches: {phrases.map((p) => `“${p}”`).join(" and ")}, from {spotCount} spots
                </p>
                <SampleTag />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                {MARKS.map((m) => (
                  <div key={m.key} className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 md:p-4">
                    <dt className="flex items-start gap-1.5 text-xs leading-snug text-[var(--color-ink-soft)]">
                      <span aria-hidden="true" className="mt-[0.3em] inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} />
                      {m.label}
                    </dt>
                    <dd className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight text-[var(--color-ink)]">
                      {totals[m.key]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                {leader.name} was in the top three for {leader.top3} of the same {searches}.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--color-ink)]">Who came up instead</p>
                <SampleTag />
              </div>
              <WhoCameUpTable className="mt-3" />
              <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                The sample practice is rated about the same as the leaders and has far
                fewer reviews. A real audit shows real names.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-5 md:p-6">
          <p className="text-[var(--color-ink)] leading-relaxed">
            <span className="font-medium">What the map shows.</span>{" "}
            The dots near the business do best, and that comes down to distance. Nobody can
            move your building. In our own scans, about 6 in 10 dental top-three spots went to
            a listing within 2 miles of the searcher. Rankings also move on their own, so we
            compare the same spots month after month. The 6 in 10 comes from 7,380 spots in
            Houston, Dallas and San Antonio, daytime scans, 12 October to 4 November 2026.
          </p>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Part 2</Eyebrow>
          <H2 className="mt-4">The 21 checks, and what they found.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            In this sample, {gaps} of the 21 show a gap and {parts} pass in part.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr] items-start">
          <div className="min-w-0 space-y-5">
            <CheckGroup group={SAMPLE_CHECKS[0]} />
            <CheckGroup group={SAMPLE_CHECKS[2]} />
          </div>
          <div className="min-w-0">
            <CheckGroup group={SAMPLE_CHECKS[1]} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Part 3</Eyebrow>
          <H2 className="mt-4">What we&apos;d do first, and what we&apos;d skip.</H2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 items-start">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8">
            <CardHead title="The fixes, in order" />
            <ol className="mt-5 space-y-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {SAMPLE_FIXES.map((f, i) => (
                <li key={f} className="flex gap-3">
                  <span className="brand-text-gradient font-[family-name:var(--font-display)] font-medium">{i + 1}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8">
            <CardHead title="What we'd leave alone" />
            <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              You get this part after the audit and one call, in a one-page plan.
            </p>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {SAMPLE_SKIPS.map((s) => (
                <li key={s} className="flex gap-3">
                  <span className="brand-dot mt-[0.6em] shrink-0" aria-hidden="true" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <GetInTouch />
    </>
  );
}
