"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";

export type IndustryCard = {
  href: string;
  name: string;
  hook: string;
  search: string;
};

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One card per trade. The track is a native scroller with snap points, so it
 * swipes on a phone and every link works with no JavaScript at all. The script
 * only adds the buttons, the arrow keys and the "2 of 6" line. Nothing moves on
 * its own, and a button press jumps instead of glides when reduced motion is on.
 * The track bleeds to the page edge on a phone through its own negative margin,
 * so it never widens the page.
 */
export function IndustryCarousel({ cards }: { cards: IndustryCard[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ ready: false, first: 0, visible: 1, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    if (!slides.length) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const view = el.scrollLeft + pad;
    let first = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const gap = Math.abs(slide.offsetLeft - view);
      if (gap < best) {
        best = gap;
        first = i;
      }
    });
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth;
    const visible = Math.max(1, Math.floor((el.clientWidth - pad) / step));
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
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    el.scrollTo({ left: slide.offsetLeft - pad, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

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

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Industries">
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Industry pages. Swipe, or use the left and right arrow keys."
        onKeyDown={onKeyDown}
        className="relative -mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto overscroll-x-contain px-6 pb-3 pt-1 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] lg:mx-0 lg:scroll-pl-0 lg:gap-5 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <li key={card.href} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
            <div className="group relative flex h-full min-h-[17rem] flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(28,42,57,0.45)] focus-within:ring-2 focus-within:ring-[var(--color-brand)]">
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">{card.name}</h3>
              <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-medium leading-[1.15] tracking-tight text-[var(--color-ink)]">
                {card.hook}
              </p>
              <p className="mt-4 self-start rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1 text-sm text-[var(--color-ink-soft)]">
                <span className="sr-only">Example search: </span>
                {card.search}
              </p>
              <p className="mt-auto pt-6">
                <Link
                  href={card.href}
                  className="text-sm font-medium text-[var(--color-brand)] underline underline-offset-4 decoration-[var(--color-brand)]/30 outline-none after:absolute after:inset-0 after:rounded-2xl group-hover:decoration-[var(--color-brand)]"
                >
                  Read the {card.name} page
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className={state.ready ? "mt-4 flex items-center justify-between gap-4" : "invisible mt-4 flex items-center justify-between gap-4"}>
        <p aria-live="polite" className="text-sm text-[var(--color-ink-soft)]">
          {showing}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous industries"
            aria-disabled={state.atStart}
            onClick={() => goTo(state.first - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-ink)]/20 bg-white text-[var(--color-ink)] transition-opacity aria-disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next industries"
            aria-disabled={state.atEnd}
            onClick={() => goTo(state.first + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-ink)]/20 bg-white text-[var(--color-ink)] transition-opacity aria-disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
