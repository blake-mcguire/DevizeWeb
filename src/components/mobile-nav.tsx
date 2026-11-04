"use client";

import { useRef } from "react";
import Link from "next/link";

/**
 * The phone menu. A plain <details>, so the links work without JavaScript. The
 * script only closes it after a tap, since a client-side page change would
 * otherwise leave it open.
 */
export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={menu} className="group lg:hidden">
      <summary
        aria-label="Menu"
        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-ink)] [&::-webkit-details-marker]:hidden"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="group-open:hidden" />
          <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="hidden group-open:block" />
        </svg>
      </summary>
      <nav className="absolute inset-x-0 top-16 border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] shadow-[0_18px_30px_-20px_rgba(28,42,57,0.35)]">
        <ul className="mx-auto max-w-6xl px-6 py-2">
          {links.map((link) => (
            <li key={link.href} className="border-b border-[var(--color-border)] last:border-b-0">
              <Link
                href={link.href}
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                }}
                className="block py-3.5 text-[0.95rem] text-[var(--color-ink)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
