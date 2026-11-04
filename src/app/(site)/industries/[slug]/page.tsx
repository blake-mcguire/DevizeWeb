import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, Eyebrow, H2, H3, PageHero, Section, Sources } from "@/components/page-parts";
import { COVERAGE, missionFor } from "@/lib/offer-copy";
import { INDUSTRIES, industryBySlug, sourcesFor, type Point, type Source } from "@/lib/industries";

type Props = { params: Promise<{ slug: string }> };

/** Only the listed trades exist; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) return {};
  return {
    title: industry.name,
    description: industry.metaDescription,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

function SearchChips({ searches }: { searches: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {searches.map((s) => (
        <li key={s} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-sm text-[var(--color-ink)]">
          {s}
        </li>
      ))}
    </ul>
  );
}

function Points({ points, sources }: { points: Point[]; sources: Source[] }) {
  return (
    <ul className="mt-6 space-y-5">
      {points.map((p) => (
        <li key={p.title} className="flex gap-3">
          <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-medium text-[var(--color-ink)] leading-snug">{p.title}</p>
            <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {p.body}
              {(p.refs ?? []).map((ref) => {
                const n = sources.findIndex((s) => s.url === ref.url) + 1;
                return (
                  <a
                    key={ref.url}
                    href={`#source-${n}`}
                    aria-label={`Source ${n}: ${ref.label}`}
                    className="ml-1 text-xs font-medium text-[var(--color-brand)] no-underline hover:underline"
                  >
                    [{n}]
                  </a>
                );
              })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const sources = sourcesFor(industry);

  return (
    <>
      <PageHero eyebrow={<Link href="/industries" className="hover:text-white">Industries we serve</Link>} title={industry.name} lead={industry.lead} />

      <Section className="pb-0 md:pb-0">
        <div className="grid gap-5 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="font-medium text-[var(--color-ink)]">Where the free audit stands for {industry.trade}</p>
            {industry.compared ? (
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                {COVERAGE.today} {industry.comparedNote}{" "}
                Outside those areas, we&apos;ll tell you plainly that your comparison waits until we
                have the data.
              </p>
            ) : (
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                The rival comparison doesn&apos;t run for {industry.trade}{" "}
                yet. It runs today only for dental and HVAC, in the areas we&apos;ve
                scanned. Yours waits until we have the data, and we&apos;ll tell
                you so plainly if you ask.
              </p>
            )}
          </div>
          <div>
            <p className="font-medium text-[var(--color-ink)]">What we don&apos;t have yet</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Client stories from {industry.trade}, or from anyone else. Devize is
              new. This page says what we&apos;d look at and what limits apply. It
              isn&apos;t a claim of experience or specialist knowledge.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>What people search for</Eyebrow>
          <H2 className="mt-4">Two different moments.</H2>
          <p className="mt-4 text-sm text-[var(--color-ink-muted)] leading-relaxed">
            Plain-word examples of what people type, not search volume figures.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>When it can&apos;t wait</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{industry.urgent.intro}</p>
            <SearchChips searches={industry.urgent.searches} />
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>When it can</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">{industry.planned.intro}</p>
            <SearchChips searches={industry.planned.searches} />
          </div>
        </div>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your Google listing</Eyebrow>
            <H2 className="mt-4 md:text-4xl">What matters on it.</H2>
            <Points points={industry.listing} sources={sources} />
          </div>
          <div className="min-w-0">
            <Eyebrow>Your reviews</Eyebrow>
            <H2 className="mt-4 md:text-4xl">What matters in them.</H2>
            <Points points={industry.reviews} sources={sources} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
            <Eyebrow>Your limits</Eyebrow>
            <H3 className="mt-3 md:text-[1.75rem]">The rules that shape the work.</H3>
            <Points points={industry.limits} sources={sources} />
          </div>
          <div className="min-w-0">
            <Eyebrow>Where we&apos;d start</Eyebrow>
            <H3 className="mt-3 md:text-[1.75rem]">What we&apos;d ask you first.</H3>
            <ul className="mt-6 space-y-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {industry.asks.map((q) => (
                <li key={q} className="flex gap-3">
                  <span className="brand-dot mt-[0.6em] shrink-0" aria-hidden="true" />
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[var(--color-ink)] leading-relaxed">
              <span className="font-medium">What we work toward:</span>{" "}
              {missionFor(industry.trade, industry.word)}{" "}
              <span className="text-[var(--color-ink-soft)]">That&apos;s a purpose, not a promised result.</span>
            </p>
            <p className="mt-4">
              <Link href="/how-we-work#price" className="text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]">
                How we work, and the price
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-12">
          <Sources items={sources} />
        </div>
      </Section>

      <CtaBand
        title={industry.compared ? "See your own map first." : "Want to know where you stand?"}
        body={
          industry.compared
            ? "It's free, there's nothing to sign, and we only use what anyone can see on Google and on your website."
            : `Ask anyway. It's free and there's nothing to sign. We'll tell you plainly what we can show ${industry.trade} today, and that the rival comparison waits until we have the data.`
        }
      />
    </>
  );
}
