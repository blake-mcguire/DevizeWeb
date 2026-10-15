import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "See it",
    body: 'We run the search your customers run, like "dentist" or "ac repair", from dozens of spots around your business. You see where you came up at each one, and who came up instead.',
  },
  {
    number: "02",
    title: "Fix it",
    body: "We do the local SEO and AEO work every month: your Google listing, your reviews, your website, and your listings everywhere else.",
  },
  {
    number: "03",
    title: "See it again",
    body: "Each month we rerun the same searches from the same spots and send you the new map, so you can see what moved.",
  },
];

// The same three labels and colours the audit page (/a/<token>) uses.
const MARKS = [
  { key: "top3", label: "In the top three", color: "#2E9E5B" },
  { key: "mid", label: "Fourth to twentieth", color: "#E0A500" },
  { key: "absent", label: "Nowhere in the first twenty", color: "#8E8A80" },
] as const;

// The audit's 21 checks (completeness.CHECKS in the audit pipeline): 1 + 15 + 5.
// Add none and drop none without changing the audit itself.
const CHECKS = [
  {
    group: "The map",
    items: ["In the top three where people search"],
  },
  {
    group: "Your Google listing",
    items: [
      "The right main category",
      "Extra categories, next to the businesses that lead your map",
      "Verified",
      "Rated 4.5 or better",
      "20 or more reviews",
      "A review in the last 90 days",
      "A new review every month",
      "You answer your reviews",
      "You answer them within a week",
      "Photos, next to similar businesses near you",
      "A photo of your own from this year",
      "Hours for all seven days",
      "A description",
      "Posts",
      "No customer question left unanswered",
    ],
  },
  {
    group: "Your website",
    items: [
      "Your listing opens a working site",
      "The site works on a phone",
      "The site shows the same number as your listing",
      "The home page says what you do and where",
      "A page for each service and town",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-white/60 border-y border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            How it works
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] font-medium">
            See it. Fix it. See it again.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            It starts with a free Google Listing and Map Audit, so you see where
            you stand before you pay for anything.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.number}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-7"
            >
              <div className="flex items-center justify-between">
                <span className="brand-text-gradient font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
                  {s.number}
                </span>
                <span className="brand-dot" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid gap-10 rounded-2xl border border-[var(--color-border)] bg-white p-7 md:p-10 md:grid-cols-[3fr_2fr] md:gap-14 items-start">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] text-[var(--color-ink)] font-medium tracking-tight">
              What&apos;s in the free audit
            </h3>

            <ul className="mt-6 space-y-5 text-[0.95rem] text-[var(--color-ink)] leading-relaxed">
              <li className="flex gap-3">
                <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                <div>
                  Every search, marked one of three ways:
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {MARKS.map((m) => (
                      <li
                        key={m.key}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-sm text-[var(--color-ink-soft)]"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: m.color }}
                        />
                        {m.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                <span>Who came up instead of you.</span>
              </li>
              <li className="flex gap-3">
                <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  21 checks on what Google and your customers can see.
                  <details className="group mt-3">
                    <summary className="inline-flex items-center gap-2 cursor-pointer list-none text-sm font-medium text-[var(--color-brand)] [&::-webkit-details-marker]:hidden">
                      See all 21 checks
                      <svg
                        aria-hidden="true"
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="transition-transform group-open:rotate-45"
                      >
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </summary>
                    {/* Two columns from sm up: the map and website groups on the left,
                        the long listing group spanning both rows on the right.
                        The 1fr second row takes the listing's extra height, so
                        the website group sits right under the map group. */}
                    <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:grid-rows-[auto_1fr]">
                      {CHECKS.map((c) => (
                        <div
                          key={c.group}
                          className={
                            c.items.length > 5
                              ? "sm:col-start-2 sm:row-start-1 sm:row-span-2"
                              : undefined
                          }
                        >
                          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">
                            {c.group} ({c.items.length})
                          </p>
                          <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
                            {c.items.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                <span>The fixes we&apos;d make first, in order.</span>
              </li>
            </ul>

            <p className="mt-8 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed max-w-lg">
              It&apos;s free and there&apos;s nothing to sign. We only use what
              anyone can see on Google, so there&apos;s nothing to log into.
            </p>
            <div className="mt-6">
              <Button href="/#contact">Get my free map audit</Button>
            </div>
          </div>

          <MapGrid />
        </div>
      </div>
    </section>
  );
}

/**
 * An abstract grid of search spots around one business, each dot in one of
 * the three mark colours. Not a real or invented business: no names, no
 * place, no numbers.
 */
function MapGrid() {
  const cols = 7;
  const rows = 7;
  const gap = 40;
  const pad = 30;
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const size = pad * 2 + gap * (cols - 1);

  const dots: { x: number; y: number; color: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Closer to the business means more likely to come up near the top,
      // nudged off-centre so the pattern does not look drawn with a compass.
      const d = Math.hypot(c - cx - 0.6, (r - cy + 0.4) * 1.15);
      const mark = d < 1.6 ? MARKS[0] : d < 3.1 ? MARKS[1] : MARKS[2];
      dots.push({ x: pad + c * gap, y: pad + r * gap, color: mark.color });
    }
  }

  return (
    <figure className="mx-auto w-full max-w-xs md:max-w-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="block w-full h-auto rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
      >
        {/* A plain map shape: two soft roads and a river, nothing real. */}
        <path
          d={`M0 ${size * 0.62} C ${size * 0.3} ${size * 0.55}, ${size * 0.55} ${size * 0.75}, ${size} ${size * 0.68}`}
          stroke="rgba(28,42,57,0.08)"
          strokeWidth="14"
          fill="none"
        />
        <path
          d={`M${size * 0.38} 0 C ${size * 0.42} ${size * 0.35}, ${size * 0.3} ${size * 0.6}, ${size * 0.36} ${size}`}
          stroke="rgba(28,42,57,0.06)"
          strokeWidth="10"
          fill="none"
        />
        <path
          d={`M${size} ${size * 0.12} C ${size * 0.75} ${size * 0.2}, ${size * 0.7} ${size * 0.05}, ${size * 0.5} 0`}
          stroke="rgba(90,31,191,0.08)"
          strokeWidth="12"
          fill="none"
        />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="9" fill={d.color} fillOpacity="0.9" />
        ))}
        {/* The business itself */}
        <circle
          cx={pad + (cx + 0.6) * gap}
          cy={pad + (cy - 0.4) * gap}
          r="7"
          fill="#FFFFFF"
          stroke="#5A1FBF"
          strokeWidth="3"
        />
      </svg>
      <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Illustration
      </figcaption>
    </figure>
  );
}
