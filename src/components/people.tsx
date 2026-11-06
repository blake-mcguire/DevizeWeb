import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Person } from "@/lib/offer-copy";

/**
 * A person's photo when public/<photoFile> exists, as a full 4:5 portrait. Until then, a
 * small square monogram, so a missing photo isn't the largest thing on the page. Dropping
 * the photo in later needs no code change.
 *
 * The check runs where the page renders. /about is static, so that is `next build` (and
 * every request under `next dev`), where the working directory is the project root.
 * Anywhere public/ is not on disk the check finds nothing and the monogram shows, which
 * is the safe way to fail.
 */
export function photoSrc(file: string): string | null {
  try {
    return existsSync(path.join(process.cwd(), "public", file)) ? `/${file}` : null;
  } catch {
    return null;
  }
}

export function Portrait({ person, className }: { person: Person; className?: string }) {
  const src = photoSrc(person.photoFile);
  if (src) {
    // alt="": the name is printed right under every portrait, so a screen reader would
    // otherwise say it twice.
    return (
      <span className={cn("relative block aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-2xl bg-[var(--color-panel)]", className)}>
        <Image src={src} alt="" fill sizes="(min-width: 640px) 18rem, 90vw" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-40 w-40 place-items-center rounded-2xl bg-gradient-to-br from-[#6A2BE0] to-[#2A0E7A] font-[family-name:var(--font-display)] text-[3.5rem] leading-none text-white",
        className
      )}
    >
      {person.initials}
    </span>
  );
}
