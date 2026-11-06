import { cn } from "@/lib/cn";
import { MARKS } from "@/lib/marks";
import { SAMPLE } from "@/lib/sample-audit";

/**
 * The sample audit's pieces. All of it is invented data (src/lib/sample-audit.ts), and every piece carries a SAMPLE tag
 * so that no card can be read, or screenshotted, without it.
 */

const COLORS = Object.fromEntries(MARKS.map((m) => [m.key, m.color]));

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#B3261E]/35 bg-[#B3261E]/[0.08] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#B3261E]",
        className
      )}
    >
      Sample
    </span>
  );
}

export function SampleMapLegend({ className }: { className?: string }) {
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
        The business
      </li>
    </ul>
  );
}

/**
 * The picture: one search at each spot around an invented business. No street
 * map under it, because it is nowhere. SAMPLE is drawn into the image itself.
 */
export function SampleMap({ className }: { className?: string }) {
  const W = 560;
  const H = 450;
  const cx = W / 2;
  const cy = H / 2;
  const perMile = 40;
  const label = `Sample map. Each dot is one invented search for "${SAMPLE.drawnPhrase}", ${SAMPLE.spacingMi} mile apart, out to ${SAMPLE.radiusMi} miles from an invented business. Dots near the business are in the top three, a ring further out is fourth to twentieth, and the outer dots are nowhere in the first twenty.`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className={cn("block w-full h-auto rounded-xl bg-[#F5F2FD]", className)}
    >
      {/* Rings at 1, 3 and 5 miles. Named in the corner: on the ring they sit under the dots. */}
      {[1, 3, 5].map((mi) => (
        <circle key={mi} cx={cx} cy={cy} r={mi * perMile} fill="none" stroke="#1C2A39" strokeOpacity="0.14" strokeDasharray="3 5" />
      ))}
      <text x={W - 12} y={H - 12} textAnchor="end" fontSize="11" fill="#56606E">
        Rings at 1, 3 and 5 miles
      </text>

      {/* One dot per search */}
      {SAMPLE.spots.map((s) => {
        if (s.x === 0 && s.y === 0) return null;
        return (
          <circle
            key={`${s.x},${s.y}`}
            cx={cx + s.x * perMile}
            cy={cy + s.y * perMile}
            r="9"
            fill={COLORS[s.mark]}
            fillOpacity={s.mark === "absent" ? 0.75 : 0.95}
            stroke="#fff"
            strokeWidth="1.5"
          />
        );
      })}

      {/* The business */}
      <circle cx={cx} cy={cy} r="20" fill="#7A3FE5" fillOpacity="0.18" />
      <circle cx={cx} cy={cy} r="11" fill="#7A3FE5" stroke="#fff" strokeWidth="2.5" />

      {/* SAMPLE in the picture itself, so a screenshot keeps it */}
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontSize="86"
        fontWeight="700"
        letterSpacing="10"
        fill="#B3261E"
        fillOpacity="0.13"
        transform={`rotate(-24 ${cx} ${cy})`}
        style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, sans-serif" }}
      >
        SAMPLE
      </text>
      <g>
        <rect x="12" y="12" width="84" height="26" rx="13" fill="#B3261E" />
        <text
          x="54"
          y="29.5"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          letterSpacing="1.6"
          fill="#fff"
          style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif" }}
        >
          SAMPLE
        </text>
      </g>
    </svg>
  );
}

export function WhoCameUpTable({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-[0.8125rem] sm:text-sm">
        <caption className="sr-only">
          These three invented practices held the top three most often, shown next to the invented sample practice.
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
          {SAMPLE.whoCameUp.map((r) => (
            <tr
              key={r.name}
              className={cn(
                "border-t border-[var(--color-border)]",
                r.isSample && "bg-[var(--color-brand)]/[0.06] font-medium"
              )}
            >
              <th scope="row" className="py-2.5 pr-2 sm:pr-3 text-left font-[inherit] text-[var(--color-ink)]">
                {r.isSample ? "The sample practice" : r.name}
              </th>
              <td className="py-2.5 px-2 sm:px-3 text-right tabular-nums text-[var(--color-ink)]">{r.stars.toFixed(1)}</td>
              <td className="py-2.5 px-2 sm:px-3 text-right tabular-nums text-[var(--color-ink)]">{r.reviews}</td>
              <td className="py-2.5 pl-2 sm:pl-3 text-right tabular-nums text-[var(--color-ink)] whitespace-nowrap">
                {r.top3} of {SAMPLE.searches}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
