"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { TradeIcon } from "@/components/trade-icon";

export type IndustryCard = {
  href: string;
  slug: string;
  name: string;
  hook: string;
  line: string;
};

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Four white cards in a row inside the page container, one card wide on a phone: a bold
 * title, a short line that fades out, and a small round icon with the trade's name. They
 * link to the six trade pages. Our cards hold no quotes, no stars and no names of people.
 *
 * The track is a native scroller with snap points, so it swipes on a phone and every link
 * works with no JavaScript at all. The script only adds the chevrons, the arrow keys and a
 * spoken "2 of 6" line. Nothing moves on its own, and a press jumps instead of glides when
 * reduced motion is on. The cards fit inside the track, so it never widens the page.
 */
export function IndustryCarousel({ cards }: { cards: IndustryCard[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ ready: false, first: 0, visible: 1, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    if (!slides.length) return;
    const view = el.scrollLeft;
    let first = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const gap = Math.abs(slide.offsetLeft - el.offsetLeft - view);
      if (gap < best) {
        best = gap;
        first = i;
      }
    });
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth;
    const visible = Math.max(1, Math.round((el.clientWidth + (step - slides[0].offsetWidth)) / step));
    const max = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= max - 2;
    setState({
      ready: true,
      first: atEnd ? Math.max(first, slides.length - visible) : first,
      visible,
      atStart: el.scrollLeft <= 2,
      atEnd,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    // Fires once when it starts observing, which sets the first reading too.
    const observer = new ResizeObserver(onScroll);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [measure]);

  const goTo = useCallback((index: number) => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  // Tabbing to a link in a card that's cut off brings the card into view. A card
  // already in full view stays put, so tabbing on a wide screen doesn't shuffle them.
  // Keyboard focus only: a mouse press also focuses the link, and moving the card
  // between press and release would lose the click.
  function onFocus(event: FocusEvent<HTMLUListElement>) {
    const el = track.current;
    const target = event.target as HTMLElement;
    const card = target.closest("li");
    if (!el || !card || !target.matches(":focus-visible")) return;
    const view = el.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    if (box.left >= view.left - 1 && box.right <= view.right + 1) return;
    goTo(Array.from(el.children).indexOf(card));
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const moves: Record<string, number> = {
      ArrowRight: state.first + 1,
      ArrowLeft: state.first - 1,
      Home: 0,
      End: cards.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      goTo(moves[event.key]);
    }
  }

  const last = Math.min(state.first + state.visible, cards.length);
  const showing =
    state.visible > 1 ? `Showing ${state.first + 1} to ${last} of ${cards.length}` : `Showing ${state.first + 1} of ${cards.length}`;

  const chevron =
    "grid h-11 w-11 place-items-center rounded-full text-[var(--color-brand)] transition-opacity aria-disabled:opacity-30 hover:bg-[var(--color-surface-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]";

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Industries">
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Industry pages. Swipe, or use the left and right arrow keys."
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand)] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <li key={card.href} className="w-full shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]">
            <div className="group relative flex h-full min-h-[21rem] flex-col border border-[var(--color-border)] bg-white p-6 transition-[border-color,box-shadow] hover:border-[var(--color-brand)] hover:shadow-[0_24px_40px_-28px_rgba(18,7,57,0.5)] focus-within:border-[var(--color-brand)] focus-within:ring-1 focus-within:ring-[var(--color-brand)]">
              <h3 className="min-h-[3.54em] text-[1.3125rem] font-extrabold leading-[1.18] tracking-[-0.025em] text-[var(--color-ink)]">{card.hook}</h3>
              <p className="fade-out mt-3 overflow-hidden text-base leading-relaxed text-[var(--color-ink-soft)] sm:h-[8.5rem]">{card.line}</p>
              <p className="mt-auto flex items-center gap-3 pt-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-surface-raised)] text-[var(--color-brand)] transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-white">
                  <TradeIcon slug={card.slug} className="h-6 w-6" />
                </span>
                <Link
                  href={card.href}
                  className="text-[0.8125rem] font-bold uppercase leading-snug tracking-[0.1em] text-[var(--color-ink)] outline-none after:absolute after:inset-0"
                >
                  {card.name}
                </Link>
                <span aria-hidden="true" className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-panel)] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M2.5 9h12.5M10 3.75 15.25 9 10 14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        {state.ready ? showing : ""}
      </p>
      <div className={state.ready ? "mt-5 flex items-center justify-center gap-3" : "invisible mt-5 flex items-center justify-center gap-3"}>
        <button type="button" aria-label="Previous industries" aria-disabled={state.atStart} onClick={() => goTo(state.first - 1)} className={chevron}>
          <svg aria-hidden="true" width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="M12 2 2 12l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" aria-label="Next industries" aria-disabled={state.atEnd} onClick={() => goTo(state.first + 1)} className={chevron}>
          <svg aria-hidden="true" width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="m2 2 10 10L2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
