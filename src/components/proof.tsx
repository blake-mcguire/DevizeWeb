import Image from "next/image";
import { Card, Container, H2 } from "@/components/page-parts";
import { photoSrc } from "@/components/people";
import { READ_BASIS, READ_COUNTS, REVIEWS, type Review } from "@/lib/offer-copy";

/**
 * Proof > Promises on the home page. Two parts, kept apart on purpose: the band is our own
 * counts and is never styled as a review, and the cards print only real reviews that have
 * a source and permission. With no such review, no card markup renders at all.
 *
 * The band shows READ_COUNTS only, because the home page's navy band already prints
 * MEASURED_COUNTS and each number should print once. The basis sits under the band.
 */

/** One run of the numbers. The motion and the wrapped fallback are .proof-* in globals.css. */
function ProofGroup({ copy = false }: { copy?: boolean }) {
  return (
    <ul className={copy ? "proof-group proof-copy" : "proof-group"} aria-hidden={copy || undefined}>
      {READ_COUNTS.map((item) => (
        <li key={item.count} className="proof-cell flex flex-col items-center px-3 text-center">
          <span className="brand-text-gradient font-[family-name:var(--font-display)] text-[clamp(2rem,10.2vw,2.5rem)] leading-[1.05] sm:text-[3.25rem] xl:text-[4rem]">
            {item.count}
          </span>
          <span className="mt-2 text-[0.9375rem] font-bold leading-snug text-[var(--color-ink)] md:text-base">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Stars({ stars }: { stars: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(stars)));
  return (
    <div role="img" aria-label={`${filled} out of 5 stars`} className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={i < filled ? "text-[var(--color-brand)]" : "text-[var(--color-border)]"}
        >
          <path d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const src = review.photoFile ? photoSrc(review.photoFile) : null;
  const initials = review.name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Card className="h-full md:p-7">
      <figure className="flex h-full flex-col">
        <Stars stars={review.stars} />
        <blockquote className="mt-4 flex-1 leading-relaxed text-[var(--color-ink)]">&ldquo;{review.quote}&rdquo;</blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
          {/* alt="": the name is printed right beside the picture. */}
          {src ? (
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-panel)]">
              <Image src={src} alt="" fill sizes="3rem" className="object-cover" />
            </span>
          ) : (
            <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-surface-raised)] font-bold text-[var(--color-brand)]">
              {initials}
            </span>
          )}
          <span className="min-w-0">
            <span className="block font-bold leading-snug text-[var(--color-ink)]">{review.name}</span>
            {review.business ? <span className="block text-sm leading-snug text-[var(--color-ink-soft)]">{review.business}</span> : null}
            <span className="mt-0.5 block text-sm leading-snug text-[var(--color-ink-muted)]">Source: {review.source}</span>
          </span>
        </figcaption>
      </figure>
    </Card>
  );
}

export function Proof() {
  const reviews = REVIEWS.filter((review) => review.source.trim() && review.permission.trim());
  return (
    <section id="proof" aria-labelledby="proof-heading" className="scroll-mt-24 pb-16 md:pb-24">
      <Container>
        <H2 id="proof-heading">{"Proof > Promises"}</H2>
      </Container>

      {/* tabIndex: nothing inside can take focus, and keyboard users need a way to pause it. */}
      <div tabIndex={0} role="group" aria-labelledby="proof-heading" className="proof-band mt-10 border-y border-[var(--color-border)] md:mt-12">
        <div className="proof-window py-8 md:py-10">
          <div className="proof-track">
            <ProofGroup />
            <ProofGroup copy />
          </div>
        </div>
      </div>

      <Container>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-[var(--color-ink-soft)]">{READ_BASIS}</p>

        {reviews.length > 0 && (
          <ul className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <li key={`${review.name}-${review.business}`} className="min-w-0">
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
