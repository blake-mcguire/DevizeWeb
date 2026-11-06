"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export type NavItem = { href: string; label: string };

/**
 * One dropdown in the desktop nav. The label is a real link to the section's overview,
 * and the panel opens on hover and on keyboard focus with CSS alone, so all its links
 * work with no JavaScript at all. The script adds two things: Escape closes it and puts
 * focus back on the label, and choosing a link closes it, because a client-side page
 * change would otherwise leave it open under the pointer. It also keeps aria-expanded true
 * to what's on screen, so a screen reader hears whether the menu is open.
 */
export function NavMenu({ label, href, items, allLabel }: { label: string; href: string; items: NavItem[]; allLabel: string }) {
  const root = useRef<HTMLLIElement>(null);
  const [shut, setShut] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <li
      ref={root}
      data-shut={shut ? "" : undefined}
      className="group relative"
      onMouseEnter={() => {
        setShut(false);
        setOpen(true);
      }}
      onMouseLeave={() => {
        setShut(false);
        setOpen(root.current?.contains(document.activeElement) ?? false);
      }}
      onFocus={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setShut(false);
        setOpen(true);
      }}
      onBlur={(event) => {
        // A click's own blur has nowhere to go (relatedTarget is null), and it must not reopen the panel.
        const next = event.relatedTarget as Node | null;
        if (next && !root.current?.contains(next)) {
          setShut(false);
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setShut(true);
          setOpen(false);
          root.current?.querySelector("a")?.focus();
        }
      }}
    >
      <Link href={href} aria-haspopup="true" aria-expanded={open && !shut} className="inline-flex h-20 items-center gap-1.5 font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-brand)] focus-visible:text-[var(--color-brand)]">
        {label}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5 text-[var(--color-brand)] transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
          <path d="m2.5 4.25 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 w-[20rem] -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 group-data-[shut]:!invisible group-data-[shut]:!opacity-0">
        <ul className="border-t-4 border-[var(--color-brand)] bg-white py-3 shadow-[0_24px_48px_-16px_rgba(18,7,57,0.35)]">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(event) => {
                  setShut(true);
                  event.currentTarget.blur();
                }}
                className="block px-6 py-2 text-[0.9375rem] font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-brand)] focus-visible:bg-[var(--color-surface-raised)] focus-visible:text-[var(--color-brand)] focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-[var(--color-border)] pt-2">
            <Link
              href={href}
              onClick={(event) => {
                setShut(true);
                event.currentTarget.blur();
              }}
              className="block px-6 py-2 text-[0.9375rem] font-bold text-[var(--color-brand)] hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {allLabel}
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
}
