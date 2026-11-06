import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ArrowLink, Container, Eyebrow, GetInTouch, H2, NumberBand } from "@/components/page-parts";
import { Portrait } from "@/components/people";
import { JUDGE_LINE, KEEP_PROMISE, PEOPLE, READ_BASIS, READ_COUNTS } from "@/lib/offer-copy";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind Devize: Blake McGuire and Conner Lienemann. See how we work with you, what your monthly report shows and how you can leave any month.",
  alternates: { canonical: "/about" },
};

const SITE_URL = "https://www.devize.ai";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  name: "About Devize",
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: PEOPLE.map((person) => ({
    "@type": "Person",
    name: person.name,
    worksFor: { "@id": `${SITE_URL}/#organization` },
  })),
};

// How it works with a client. Nothing here is a claim about past clients. TODO(Blake): the
// second item describes a report that isn't built yet (claim bank, section 5). It has to be
// true when the first client signs. The first item names no one on purpose: nothing on file
// says who answers what, and /a/ tells prospects "Conner or Blake" will call. It says nothing
// about taking calls because no marketing page shows a phone number.
const HOW = [
  {
    title: "You talk to a person.",
    body: "A person reads your email and writes back.",
  },
  {
    title: "You get a report every month.",
    body: "It shows the posts, review replies and fixes, plus the same map searches we ran the month before. The posts and replies are on your listing, and the report says where to find each fix.",
  },
  {
    title: "You can leave any month.",
    body: KEEP_PROMISE,
  },
];

/**
 * Blake, 2026-11-05: "The who's behind it section should also be its own page", with a
 * section for each person. Only what's on file prints: no years, titles, schools or past
 * employers. See PEOPLE in src/lib/offer-copy.ts for what Blake still has to supply.
 */
export default function AboutPage() {
  return (
    <>
      <section className="bg-white">
        <Container className="pb-10 pt-12 md:pb-14 md:pt-16">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-[2.75rem] leading-[1.05] text-[var(--color-ink)] md:text-[4.25rem] md:leading-[1.03]">
            Meet the team
          </h1>
        </Container>
      </section>

      <section aria-label="The people" className="on-navy slant bg-[var(--color-navy)]">
        <Container className="py-8 md:py-10">
          <ul className="grid max-w-[60rem] grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-16">
            {PEOPLE.map((person) => (
              <li key={person.name} className="min-w-0">
                <Portrait person={person} />
                <h2 className="mt-6 font-[family-name:var(--font-display)] text-[1.875rem] leading-tight text-[var(--color-lilac)] md:text-[2.25rem]">{person.name}</h2>
                <p className="mt-1 text-[0.9375rem] font-bold leading-snug text-white">{person.role}</p>
                <div className="mt-4 space-y-3 leading-relaxed text-white/90">
                  {person.bio.map((line) => (
                    <p key={line}>
                      {line.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="What we've checked" className="bg-white">
        <Container className="pb-4 pt-14 md:pt-20">
          <NumberBand items={READ_COUNTS} basis={READ_BASIS} />
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl">
            <Eyebrow>How we work with you</Eyebrow>
            <H2 className="mt-3">You can check our work.</H2>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {HOW.map((item, i) => (
              <li key={item.title} className={`min-w-0 lg:px-7 ${i === 0 ? "lg:pl-0" : "lg:border-l lg:border-[var(--color-border)]"}`}>
                <h3 className="text-[1.25rem] font-extrabold leading-snug tracking-[-0.025em] text-[var(--color-ink)]">{item.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 border-t border-[var(--color-border)] pt-9">
            <p className="text-[1.25rem] font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">{JUDGE_LINE}</p>
            <div className="mt-6 flex flex-col gap-5 md:flex-row md:gap-12">
              <ArrowLink href="/what-we-do">How we work</ArrowLink>
              <ArrowLink href="/terms">The terms</ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Blake, 5 Nov 2026: one small call to action after the whole about section. */}
      <GetInTouch />

      <JsonLd data={SCHEMA} />
    </>
  );
}
