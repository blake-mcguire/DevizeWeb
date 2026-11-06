"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { NavItem } from "@/components/site-nav";

function Chevron() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 12 12" fill="none" className="text-[var(--color-brand)] transition-transform group-open/sub:rotate-180">
      <path d="m2.5 4.25 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The phone menu. Plain <details>, so every link works without JavaScript. The script
 * only closes it: after a tap on a link, since a client-side page change would otherwise
 * leave it open, on Escape, and on a tap outside it. What We Do and Industries open in place,
 * so all thirteen pages are two taps away. The button at the bottom goes to the form on
 * the home page.
 */
export function MobileNav({
  menus,
  links,
  cta,
}: {
  menus: { label: string; href: string; allLabel: string; items: NavItem[] }[];
  links: NavItem[];
  cta: NavItem;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu.current?.open) return;
      menu.current.open = false;
      menu.current.querySelector("summary")?.focus();
    };
    const onPress = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, []);
  return (
    <details ref={menu} className="group lg:hidden">
      <summary
        aria-label="Menu"
        className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-[var(--color-brand)] text-[var(--color-brand)] [&::-webkit-details-marker]:hidden"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="group-open:hidden" />
          <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="hidden group-open:block" />
        </svg>
      </summary>
      <nav aria-label="Menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[var(--color-border)] bg-white shadow-[0_24px_40px_-20px_rgba(18,7,57,0.4)]">
        <ul className="px-5 py-2">
          {menus.map((m) => (
            <li key={m.href} className="border-b border-[var(--color-border)]">
              <details className="group/sub">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[1.0625rem] font-bold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                  {m.label}
                  <Chevron />
                </summary>
                <ul className="pb-3">
                  {m.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={close} className="block py-2.5 pl-3 text-base text-[var(--color-ink-soft)]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={m.href} onClick={close} className="block py-2.5 pl-3 text-base font-bold text-[var(--color-brand)]">
                      {m.allLabel}
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
          ))}
          {links.map((link) => (
            <li key={link.href} className="border-b border-[var(--color-border)] last:border-b-0">
              <Link href={link.href} onClick={close} className="block py-4 text-[1.0625rem] font-bold text-[var(--color-ink)]">
                {link.label}
              </Link>
            </li>
          ))}
          <li className="py-4">
            {/* A plain <a>, like the header button: on the home page it has to scroll to the
                form every time it's tapped, and next/link only does that the first time. */}
            <a href={cta.href} onClick={close} className="flex h-12 items-center justify-center rounded-full bg-[var(--color-brand)] font-bold text-white">
              {cta.label}
            </a>
          </li>
        </ul>
      </nav>
    </details>
  );
}
