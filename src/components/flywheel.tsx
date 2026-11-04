import { cn } from "@/lib/cn";
import { FLYWHEEL } from "@/lib/tiers";

/**
 * The flywheel: five stages clockwise around a ring. The stages are real HTML in
 * an ordered list, so they read in order without the picture and stay legible on
 * a phone; the ring behind them is decoration. A solid stage has something you
 * can buy today. A dashed one is in pilot, which the words say too.
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
    arrow: `translate(${m.x.toFixed(2)} ${m.y.toFixed(2)}) rotate(${mid + 90})`,
    // The line into the next stage is solid only when that stage is on sale today.
    solid: FLYWHEEL[(i + 1) % FLYWHEEL.length].solid,
  };
});

/** Where each stage sits, as a share of the box. */
const PLACE: React.CSSProperties[] = [
  { left: "50%", top: "13.9%", transform: "translate(-50%, -50%)" },
  { right: 0, top: "40.2%", transform: "translateY(-50%)" },
  { left: "72%", top: "82.6%", transform: "translate(-50%, -50%)" },
  { left: "28%", top: "82.6%", transform: "translate(-50%, -50%)" },
  { left: 0, top: "40.2%", transform: "translateY(-50%)" },
];

export function Flywheel({ className }: { className?: string }) {
  return (
    <figure className={cn("mx-auto w-full max-w-[30rem]", className)}>
      <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
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
              <path d="M -8 5 L 0 -6 L 8 5 Z" transform={s.arrow} fill="#5A1FBF" />
            </g>
          ))}
        </svg>

        <p className="absolute left-1/2 top-[52%] w-[26%] -translate-x-1/2 -translate-y-1/2 text-center font-[family-name:var(--font-display)] text-[0.8rem] leading-tight tracking-tight text-[var(--color-ink)] sm:text-[0.95rem]">
          Without adding headcount
          <span className="mt-1 block font-[family-name:var(--font-sans)] text-[0.6875rem] tracking-normal text-[var(--color-ink-soft)]">the aim</span>
        </p>

        <ol>
          {FLYWHEEL.map((stage, i) => (
            <li
              key={stage.title}
              className={cn(
                "absolute w-[36%] rounded-xl bg-white px-2 py-2 text-center shadow-[0_8px_20px_-14px_rgba(28,42,57,0.5)] sm:px-3",
                stage.solid ? "border border-[var(--color-ink)]/25" : "border-2 border-dashed border-[var(--color-brand)]/45"
              )}
              style={PLACE[i]}
            >
              <p className="font-[family-name:var(--font-display)] text-[0.875rem] font-medium leading-tight tracking-tight text-[var(--color-ink)] sm:text-base">
                <span className="sr-only">Stage {i + 1}: </span>
                {stage.title}
              </p>
              <p className="mt-0.5 text-[0.6875rem] leading-snug text-[var(--color-ink-soft)] sm:text-xs">{stage.sub}</p>
              <p className={cn("mt-1 text-[0.6875rem] font-medium leading-tight", stage.solid ? "text-[#1F7A45]" : "text-[var(--color-brand)]")}>
                {stage.tag}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-4 text-center text-sm text-[var(--color-ink-soft)]">
        Solid: you can buy it today. Dashed: in pilot, with no client on it yet.
      </figcaption>
    </figure>
  );
}
