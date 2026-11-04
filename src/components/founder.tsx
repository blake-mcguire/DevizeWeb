import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { EMAIL, FOUNDER } from "@/lib/offer-copy";

/**
 * Blake's photo when public/blake.jpg exists, otherwise a "BM" initials circle
 * of the same size, so dropping the photo in later needs no code change.
 *
 * The check runs where the page renders. The home page is static, so that is
 * `next build` (and every request under `next dev`), where the working
 * directory is the project root. Anywhere public/ is not on disk the check
 * finds nothing and the initials show, which is the safe way to fail.
 */
function founderPhotoSrc(): string | null {
  try {
    return existsSync(path.join(process.cwd(), "public", FOUNDER.photoFile))
      ? `/${FOUNDER.photoFile}`
      : null;
  } catch {
    return null;
  }
}

export function FounderAvatar({
  size,
  className,
}: {
  /** Diameter in CSS pixels. */
  size: number;
  className?: string;
}) {
  const src = founderPhotoSrc();
  const box = cn("shrink-0 rounded-full", className);
  if (src) {
    // alt="": the name is printed right beside every avatar, so a screen
    // reader would otherwise say it twice.
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={cn(box, "object-cover")}
        style={{ width: size, height: size }}
      />
    );
  }
  // The name is always printed beside the avatar, so the initials are
  // decoration to a screen reader.
  return (
    <span
      aria-hidden="true"
      className={cn(
        box,
        "inline-flex items-center justify-center bg-[image:var(--gradient-brand)] font-[family-name:var(--font-display)] font-medium text-white tracking-wide select-none"
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {FOUNDER.initials}
    </span>
  );
}

/**
 * The line by every audit call to action: face, who runs Devize, name and town.
 * `tone` picks the text colours for a dark or light background.
 */
export function FounderChip({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <FounderAvatar size={44} className={dark ? "ring-2 ring-white/25" : "ring-2 ring-white"} />
      <p className={cn("text-sm leading-snug", dark ? "text-white/85" : "text-[var(--color-ink-soft)]")}>
        <span className={cn("block font-medium", dark ? "text-white" : "text-[var(--color-ink)]")}>
          {FOUNDER.chip}
        </span>
        {FOUNDER.townShort} · {EMAIL}
      </p>
    </div>
  );
}

/** Who's behind Devize, and the plain line that Devize is new. */
export function FounderBlock({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-5">
        <FounderAvatar size={88} />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-muted)] font-medium">
            Who&apos;s behind it
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight tracking-tight text-[var(--color-ink)] font-medium">
            {FOUNDER.name}
          </h2>
          <p className="mt-1 text-[var(--color-ink-soft)]">{FOUNDER.town}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
        {FOUNDER.bio.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-4 text-[var(--color-ink)] leading-relaxed">
        {FOUNDER.newLine}{" "}
        <Link href="/sample-audit" className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">
          the sample
        </Link>
        {", "}
        <Link href="/services" className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">
          the price
        </Link>
        {" and "}
        <Link href="/terms" className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]">
          the terms
        </Link>
        .
      </p>
      <p className="mt-6 text-[var(--color-ink)]">
        Email{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="font-medium underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)]"
        >
          {EMAIL}
        </a>
      </p>
    </div>
  );
}
