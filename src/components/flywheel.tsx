import { cn } from "@/lib/cn";
import { HOW_WE_DO_IT } from "@/lib/offer-copy";

/**
 * The flywheel: Blake's three stages clockwise around a ring, each one's point fitting
 * into the next one's notch, because each feeds the next. Drawn for Devize. The words
 * are in the SVG and the image's label, and every page that shows the ring also prints
 * the three stages as real text beside it.
 */

const CX = 260;
const CY = 260;
const OUTER = 236;
const INNER = 148;
const MID = (OUTER + INNER) / 2;
const TIP = 11;
const GAP = 2.5;
/** Half the height of the capitals, so the labels sit in the middle of the band. */
const CAP = 9.5;

function at(radius: number, deg: number) {
  const r = (deg * Math.PI) / 180;
  return `${(CX + radius * Math.cos(r)).toFixed(2)} ${(CY + radius * Math.sin(r)).toFixed(2)}`;
}

const SEGMENTS = [
  { from: -150, to: -30, top: true, c0: "#9A6BF5", c1: "#6A2BE0" },
  { from: -30, to: 90, top: false, c0: "#6A2BE0", c1: "#4316A0" },
  { from: 90, to: 210, top: false, c0: "#4316A0", c1: "#2A0E7A" },
].map((s, i) => {
  const start = s.from - TIP / 2 + GAP / 2;
  const notch = s.from + TIP / 2 + GAP / 2;
  const end = s.to - TIP / 2 - GAP / 2;
  const tip = s.to + TIP / 2 - GAP / 2;
  const d = [
    `M ${at(OUTER, start)}`,
    `A ${OUTER} ${OUTER} 0 0 1 ${at(OUTER, end)}`,
    `L ${at(MID, tip)}`,
    `L ${at(INNER, end)}`,
    `A ${INNER} ${INNER} 0 0 0 ${at(INNER, start)}`,
    `L ${at(MID, notch)}`,
    "Z",
  ].join(" ");
  // The label runs clockwise over the top and the other way under it, so it never reads upside down.
  const label = s.top
    ? `M ${at(MID - CAP, s.from)} A ${MID - CAP} ${MID - CAP} 0 0 1 ${at(MID - CAP, s.to)}`
    : `M ${at(MID + CAP, s.to)} A ${MID + CAP} ${MID + CAP} 0 0 0 ${at(MID + CAP, s.from)}`;
  return { ...s, d, label, id: `flywheel-${i}` };
});

export function Flywheel({ className }: { className?: string }) {
  const stages = HOW_WE_DO_IT.map((s) => s.title);
  return (
    <figure className={cn("mx-auto w-full max-w-[34rem]", className)}>
      <svg
        viewBox="0 0 520 520"
        role="img"
        aria-label={`A ring of three stages, turning clockwise, each feeding the next: ${stages.join(", ")}. In the middle: clicks into clients.`}
        className="block h-auto w-full"
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif" }}
      >
        <defs>
          {SEGMENTS.map((s) => (
            <linearGradient key={s.id} id={`${s.id}-fill`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={s.c0} />
              <stop offset="1" stopColor={s.c1} />
            </linearGradient>
          ))}
          {SEGMENTS.map((s) => (
            <path key={s.id} id={s.id} d={s.label} />
          ))}
        </defs>

        <circle cx={CX} cy={CY} r={254} fill="none" stroke="var(--color-brand)" strokeOpacity="0.28" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={INNER - 16} fill="none" stroke="var(--color-brand)" strokeOpacity="0.18" strokeWidth="1.5" />

        {SEGMENTS.map((s) => (
          <path key={s.id} d={s.d} fill={`url(#${s.id}-fill)`} />
        ))}

        {SEGMENTS.map((s, i) => (
          <text key={s.id} fill="#fff" fontSize="26" fontWeight="800" letterSpacing="2.4" textAnchor="middle">
            <textPath href={`#${s.id}`} startOffset="50%">
              {stages[i].toUpperCase()}
            </textPath>
          </text>
        ))}

        <text textAnchor="middle" fill="var(--color-ink)" fontSize="42" fontWeight="800" letterSpacing="-1.5">
          <tspan x={CX} y={CY - 24}>Clicks</tspan>
          <tspan x={CX} y={CY + 22}>into</tspan>
          <tspan x={CX} y={CY + 68}>clients</tspan>
        </text>
      </svg>
    </figure>
  );
}
