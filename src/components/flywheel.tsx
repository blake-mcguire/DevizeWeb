import { cn } from "@/lib/cn";
import { FLYWHEEL } from "@/lib/tiers";

/**
 * The flywheel: five stages clockwise around a ring. The stages are real HTML in
 * an ordered list, so they read in order without the picture and stay legible on
 * a phone; the ring behind them is decoration. A solid stage can all be bought
 * today. A dashed one can't yet, which the words say too. Below 360px wide the
 * boxes would cover the ring and each other, so the same list stacks instead, with
 * the numbers showing and the ring hidden.
 */

const W = 400;
const H = 395;
const CX = 200;
const CY = 205;
const R = 150;
const ANGLES = [-90, -18, 54, 126, 198];

function at(deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(r), y: CY + R * Math.sin(r) };
}

const SEGMENTS = ANGLES.map((from, i) => {
  const to = i === ANGLES.length - 1 ? ANGLES[0] + 360 : ANGLES[i + 1];
  const a = at(from);
  const b = at(to);
  const mid = (from + to) / 2;
  const m = at(mid);
  return {
    d: `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`,
    // The head's tip points up at rotate(0). Going clockwise along the ring at angle
    // `mid` means heading (-sin mid, cos mid), which is rotate(mid + 180).
    arrow: `translate(${m.x.toFixed(2)} ${m.y.toFixed(2)}) rotate(${mid + 180})`,
    // A line runs today only when the stages at both ends of it can be bought today.
    solid: FLYWHEEL[i].solid && FLYWHEEL[(i + 1) % FLYWHEEL.length].solid,
  };
});

/** Where each stage sits on the ring, as a share of the box. On a phone the side boxes wrap taller, so they sit a little lower to clear the top one. */
const PLACE = [
  "min-[360px]:left-1/2 min-[360px]:top-[13.9%] min-[360px]:-translate-x-1/2 min-[360px]:-translate-y-1/2",
  "min-[360px]:right-0 min-[360px]:top-[43%] min-[360px]:-translate-y-1/2 sm:top-[40.2%]",
  "min-[360px]:left-[72%] min-[360px]:top-[82.6%] min-[360px]:-translate-x-1/2 min-[360px]:-translate-y-1/2",
  "min-[360px]:left-[28%] min-[360px]:top-[82.6%] min-[360px]:-translate-x-1/2 min-[360px]:-translate-y-1/2",
  "min-[360px]:left-0 min-[360px]:top-[43%] min-[360px]:-translate-y-1/2 sm:top-[40.2%]",
];

export function Flywheel({ className }: { className?: string }) {
  return (
    <figure className={cn("mx-auto w-full max-w-[30rem]", className)}>
      <div className="relative min-[360px]:aspect-[400/395]">
        <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 hidden h-full w-full min-[360px]:block">
          {SEGMENTS.map((s) => (
            <g key={s.d}>
              <path
                d={s.d}
                fill="none"
                stroke="#5A1FBF"
                strokeOpacity={s.solid ? 0.8 : 0.55}
                strokeWidth="2.5"
                strokeDasharray={s.solid ? undefined : "2 7"}
                strokeLinecap="round"
              />
              <path d="M -5 6 L 0 -7 L 5 6 Z" transform={s.arrow} fill="#5A1FBF" />
            </g>
          ))}
        </svg>

        <ol className="space-y-2 min-[360px]:space-y-0">
          {FLYWHEEL.map((stage, i) => (
            <li
              key={stage.title}
              className={cn(
                "w-full rounded-xl bg-white px-3 py-2 shadow-[0_8px_20px_-14px_rgba(28,42,57,0.5)] min-[360px]:absolute min-[360px]:w-[36%] min-[360px]:px-1.5 min-[360px]:text-center sm:px-3",
                stage.solid ? "border border-[var(--color-ink)]/25" : "border-2 border-dashed border-[var(--color-brand)]/45",
                PLACE[i]
              )}
            >
              <p className="font-[family-name:var(--font-display)] text-[0.875rem] font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-base">
                <span className="min-[360px]:sr-only">Stage {i + 1}: </span>
                {stage.title}
              </p>
              <p className="mt-0.5 text-[0.6875rem] leading-snug text-[var(--color-ink-soft)] sm:text-xs">{stage.sub}</p>
              <p className={cn("mt-1 text-[0.6875rem] font-medium leading-tight", stage.solid ? "text-[#1F7A45]" : "text-[var(--color-brand)]")}>
                {stage.tag}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-center font-[family-name:var(--font-display)] text-[0.95rem] leading-tight tracking-tight text-[var(--color-ink)] min-[360px]:absolute min-[360px]:left-1/2 min-[360px]:top-[52%] min-[360px]:mt-0 min-[360px]:w-[26%] min-[360px]:-translate-x-1/2 min-[360px]:-translate-y-1/2 min-[360px]:text-[0.8rem] sm:text-[0.95rem]">
          Without adding headcount
          <span className="mt-1 block font-[family-name:var(--font-sans)] text-[0.6875rem] tracking-normal text-[var(--color-ink-soft)]">the aim</span>
        </p>
      </div>
      <figcaption className="mt-4 text-center text-sm text-[var(--color-ink-soft)]">
        Solid: you can buy it today. Dashed: not all on sale yet. In pilot means no client is on it.
      </figcaption>
    </figure>
  );
}
