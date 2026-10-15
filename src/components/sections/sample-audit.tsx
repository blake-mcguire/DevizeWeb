import { MARKS } from "@/lib/marks";
import { cn } from "@/lib/cn";
// The anonymised sample (2026-10-15): a real scan of one Houston-area general
// dentist, with every name removed, built and checked by the sample pass
// (outside this repo). src/data/sample.json holds only the fields this file
// reads; it is imported at build time and never served. The PDF and the map
// PNGs are in public/sample/. Review counts are banded (the sample's "under
// 100", the others' to the nearest 100) and photo and category counts are
// ranges, so no practice can be picked out from a listing export.
//
// Never swap in an invented business: replace these files with another real,
// anonymised scan. Whatever practice a sample comes from must first be
// suppressed in the outreach pipeline so it can never be emailed and then
// find its own numbers here: that is `sampleSourceSuppressed` in
// src/lib/launch-gate.json, which blocks production builds until it is true.
// The practice's id is kept in the pipeline's suppression list and the sample
// pass, never in this repo.
import sample from "@/data/sample.json";

export const SAMPLE_LABEL = sample.label; // "Real scan, names removed"
const PDF_URL = "/sample/sample-audit.pdf";
const PDF_SIZE = "1 MB";

const scan = sample.scan;
const practice = sample.practice;

/** The three marks, counted over every search in the scan (both phrases). */
const counts = {
  top3: sample.per_phrase.reduce((n, p) => n + p.top3, 0),
  mid: sample.per_phrase.reduce((n, p) => n + p.fourth_to_twentieth, 0),
  absent: sample.per_phrase.reduce((n, p) => n + p.not_in_first_twenty, 0),
};

const phrases = scan.phrases.map((p) => `“${p}”`).join(" and ");

const NOT_A_CLIENT = "The practice is not a Devize client.";

const mapAlt = `Map of ${sample.map.pins} search spots within ${scan.radius_miles} miles of a dental practice, ${scan.spacing_miles} miles apart. Every pin is grey: the practice was not in the first twenty at any of them.`;

function SampleMapImage({
  hero = false,
  className,
}: {
  /** The hero card: loaded eagerly, and the PNG without the in-image ring
      label, which renders at 5-6px there (the caption says "within 10 miles"). */
  hero?: boolean;
  className?: string;
}) {
  const [w, h] = sample.map.size_css_px;
  const files = hero ? sample.map.hero_files : sample.map.files;
  return (
    // A plain <img>: one small PNG at 1x and 2x, the same choice the audit
    // page makes for its map. next/image would add an optimizer hop for
    // nothing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/sample/${files["1x"]}`}
      srcSet={`/sample/${files["1x"]} ${w}w, /sample/${files["2x"]} ${w * 2}w`}
      sizes="(min-width: 1024px) 480px, 100vw"
      width={w}
      height={h}
      alt={mapAlt}
      loading={hero ? "eager" : "lazy"}
      className={cn("block w-full h-auto rounded-xl bg-[#F3F0E8]", className)}
    />
  );
}

function LabelChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-brand)]/25 bg-[var(--color-brand)]/[0.07] px-2.5 py-0.5 text-xs font-medium text-[var(--color-brand)]",
        className
      )}
    >
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {SAMPLE_LABEL}
    </span>
  );
}

function Legend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[var(--color-ink-soft)]", className)}>
      {MARKS.map((m) => (
        <li key={m.key} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
          {m.label}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-[#7A3FE5]" />
        The practice
      </li>
    </ul>
  );
}

/** The hero's picture of the deliverable: the sample's real map, with its label. */
export function SampleMapCard() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-white p-4 md:p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)] font-medium">
          Sample audit
        </p>
        <LabelChip />
      </div>
      <SampleMapImage hero className="mt-3" />
      <figcaption className="mt-3">
        <p className="text-[0.95rem] leading-snug text-[var(--color-ink)]">
          A Houston-area dentist rated {practice.stars.toFixed(1)} stars on{" "}
          {practice.reviews} reviews. In the top three at{" "}
          <strong className="font-semibold">
            {sample.headline.top3} of {sample.headline.of}
          </strong>{" "}
          searches within {scan.radius_miles} miles.{" "}
          <span className="text-[var(--color-ink-soft)]">{NOT_A_CLIENT}</span>
        </p>
        <Legend className="mt-2.5" />
        <a
          href="#sample"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 hover:decoration-[var(--color-brand)]"
        >
          See the whole sample audit
          <span aria-hidden="true">↓</span>
        </a>
      </figcaption>
    </figure>
  );
}

const RESULT = {
  pass: { mark: "✓", label: "Pass", cls: "text-[#1F7A45] bg-[#2E9E5B]/10 border-[#2E9E5B]/30" },
  fail: { mark: "✗", label: "Gap", cls: "text-[#B3261E] bg-[#B3261E]/[0.07] border-[#B3261E]/25" },
  partial: { mark: "!", label: "In part", cls: "text-[#8A5A00] bg-[#E0A500]/15 border-[#E0A500]/40" },
} as const;

type Result = keyof typeof RESULT;

export default function SampleAudit() {
  const rows = sample.who_came_up.rows;
  return (
    <section id="sample" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Sample audit
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            A real audit, with the names taken out.
          </h2>
          <LabelChip className="mt-5" />
          <p className="mt-5 max-w-3xl text-lg text-[var(--color-ink-soft)] leading-relaxed">
            This is a real Google Listing and Map Audit of a general dentist in
            the Houston area, run on a phone on Monday, 12 October 2026, by the
            same code that builds every audit. We took out the practice&apos;s
            name, address, phone and website, and the names of the other
            practices. So that no practice can be picked out, review counts are
            rounded (the sample&apos;s shown as under 100, the others&apos; to
            the nearest 100) and photo counts are shown as ranges. Stars,
            searches and every check result are as measured. {NOT_A_CLIENT} This
            is not a before-and-after.
          </p>
        </div>

        {/* grid-cols-1 is minmax(0,1fr): without it the table's minimum width
            (inside overflow-x-auto) pushed the column, and the page scrolled
            sideways below 352px. min-w-0 on the children does the same at lg. */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          {/* The map */}
          <figure className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">
              The “{sample.map.phrase_drawn}” searches, one at each of {sample.map.pins} spots
            </p>
            <SampleMapImage className="mt-4" />
            <figcaption className="mt-4 space-y-3">
              <Legend />
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {`Each pin is one real Google search on a phone, ${scan.spacing_miles} miles apart, within ${scan.radius_miles} miles of the practice (purple). Every pin here is grey. The street map under the pins is taken out, so the pattern can't place the practice.`}
              </p>
            </figcaption>
          </figure>

          <div className="min-w-0 space-y-6">
            {/* The three counts */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {scan.searches_total} searches: {phrases}, from {scan.spots} spots
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                {MARKS.map((m) => (
                  <div
                    key={m.key}
                    className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 md:p-4"
                  >
                    <dt className="flex items-start gap-1.5 text-xs leading-snug text-[var(--color-ink-soft)]">
                      <span
                        aria-hidden="true"
                        className="mt-[0.3em] inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: m.color }}
                      />
                      {m.label}
                    </dt>
                    <dd className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium tracking-tight text-[var(--color-ink)]">
                      {counts[m.key]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                {sample.headline.leader_sentence}
              </p>
            </div>

            {/* Who came up instead */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
              <p className="text-sm font-medium text-[var(--color-ink)]">Who came up instead</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-[0.8125rem] sm:text-sm">
                  <caption className="sr-only">
                    The three practices that held the top three most often near the sample practice, against the sample practice
                  </caption>
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.1em] text-[var(--color-ink-soft)]">
                      <th scope="col" className="py-2 pr-2 sm:pr-3 font-medium">Practice</th>
                      <th scope="col" className="py-2 px-2 sm:px-3 font-medium text-right">Stars</th>
                      <th scope="col" className="py-2 px-2 sm:px-3 font-medium text-right">Reviews</th>
                      <th scope="col" className="py-2 pl-2 sm:pl-3 font-medium text-right">Top three</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const self = "is_sample" in r && r.is_sample;
                      return (
                        <tr
                          key={r.practice}
                          className={cn(
                            "border-t border-[var(--color-border)]",
                            self && "bg-[var(--color-brand)]/[0.06] font-medium"
                          )}
                        >
                          <th scope="row" className={cn("py-2.5 pr-2 sm:pr-3 text-left font-[inherit] text-[var(--color-ink)]", !self && "whitespace-nowrap")}>
                            {self ? "The sample practice" : r.practice}
                          </th>
                          <td className="py-2.5 px-2 sm:px-3 text-right tabular-nums text-[var(--color-ink)]">
                            {r.stars.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-2 sm:px-3 text-right tabular-nums text-[var(--color-ink)] whitespace-nowrap">
                            {r.reviews}
                          </td>
                          <td className="py-2.5 pl-2 sm:pl-3 text-right tabular-nums text-[var(--color-ink)] whitespace-nowrap">
                            {r.top3} of {r.of}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                The sample practice has the best rating of the four and the
                fewest reviews. Review counts are rounded so no practice can be
                picked out.
              </p>
            </div>
          </div>
        </div>

        {/* Eight of the checks */}
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-8">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
            {sample.site_section_checks.length} of the checks, and what the audit found
          </h3>
          <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {sample.site_section_checks.map((c) => {
              const r = RESULT[c.result as Result];
              return (
                <li key={c.check} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-6 min-w-[4.25rem] shrink-0 items-center justify-center gap-1 rounded-full border px-2 text-xs font-medium",
                      r.cls
                    )}
                  >
                    <span aria-hidden="true">{r.mark}</span>
                    {r.label}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-ink)] leading-snug">{c.check}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">{c.finding}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 text-[0.95rem] text-[var(--color-ink)]">
            In all, {sample.checks_summary.replace(/^(\d+) of the (\d+) things we checked on your listing and site/, "$1 of the $2 things the audit checked on the listing and site")}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            That&apos;s the 21 checks under How it works, plus three
            side-by-side comparisons with the practices that came up instead:
            stars, reviews and photos.
          </p>

          <div className="mt-8 border-t border-[var(--color-border)] pt-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">The fixes the audit put first, in order</p>
            <ol className="mt-3 space-y-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {sample.recommended_fixes.map((f, i) => (
                <li key={f.fix} className="flex gap-3">
                  <span className="brand-text-gradient font-[family-name:var(--font-display)] font-medium">
                    {i + 1}
                  </span>
                  <span>{f.how}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={PDF_URL}
              download="devize-sample-audit.pdf"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-white bg-[image:var(--gradient-brand)] shadow-[0_6px_18px_-6px_rgba(51,0,153,0.55)] hover:-translate-y-[1px] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)]"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download the sample audit
            </a>
            <p className="text-sm text-[var(--color-ink-soft)]">
              PDF, {sample.pdf.pages} pages, {PDF_SIZE}. {SAMPLE_LABEL}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
