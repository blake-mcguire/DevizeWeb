/** Small line icons, drawn for the six trades. Decoration: the trade's name always prints beside one. */
const PATHS: Record<string, React.ReactNode> = {
  hvac: <path d="M12 2.5v19M3.8 7.25l16.4 9.5M20.2 7.25 3.8 16.75M9.3 4.4 12 7l2.7-2.6M9.3 19.6 12 17l2.7 2.6M3.2 11.2l3.6-.9-.9-3.6M20.8 12.8l-3.6.9.9 3.6M20.8 11.2l-3.6-.9.9-3.6M3.2 12.8l3.6.9-.9 3.6" />,
  "dental-clinics": (
    <path d="M12 5.6c-1.5-1-3-1.7-4.6-1.5C4.9 4.4 3.6 6.6 4 9.1c.3 2 1 3.4 1.4 5.4.4 2 .7 5.5 2.4 5.5 1.9 0 1.6-5 4.2-5s2.3 5 4.2 5c1.7 0 2-3.5 2.4-5.5.4-2 1.1-3.4 1.4-5.4.4-2.5-.9-4.7-3.4-5-1.6-.2-3.1.5-4.6 1.5Z" />
  ),
  "law-firms": <path d="M12 3v18M7.5 21h9M5 6.5c2.5.8 4.5.8 7 0s4.5-.8 7 0M5 6.5 2.5 13.5a3 3 0 0 0 5 0L5 6.5ZM19 6.5l-2.5 7a3 3 0 0 0 5 0L19 6.5Z" />,
  "walk-in-clinics": (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  "veterinary-clinics": (
    <>
      <circle cx="6" cy="10.5" r="1.9" />
      <circle cx="10" cy="6.3" r="1.9" />
      <circle cx="14.3" cy="6.3" r="1.9" />
      <circle cx="18.2" cy="10.5" r="1.9" />
      <path d="M12.1 11.2c-2.3 0-4.6 2.6-4.6 5.1 0 1.6 1.2 2.6 2.6 2.6 1 0 1.3-.5 2-.5s1 .5 2 .5c1.4 0 2.6-1 2.6-2.6 0-2.5-2.3-5.1-4.6-5.1Z" />
    </>
  ),
  "plumbing-companies": <path d="M12 2.8s6.6 7 6.6 11.6a6.6 6.6 0 0 1-13.2 0C5.4 9.8 12 2.8 12 2.8ZM8.9 14.6a3.2 3.2 0 0 0 3.1 3" />,
};

export function TradeIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {PATHS[slug]}
    </svg>
  );
}
