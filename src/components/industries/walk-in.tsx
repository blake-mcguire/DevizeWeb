import { Crumb, TradeClose } from "@/components/industries/shared";
import { CrossList, DotList, Eyebrow, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { BOOKING_OS } from "@/lib/offer-copy";
import { GOOGLE_ADS, PRICE } from "@/lib/tiers";

// In the order the page first cites them.
const SOURCES: Source[] = [S.hours, S.guidelines, S.manasa, S.ga, S.ba, S.ecri, S.tx101201];
const cite = citer(SOURCES);

export default function WalkInPage() {
  const QUESTIONS = [
    {
      q: "Are you open right now?",
      searches: ["walk in clinic open now", "clinic open sunday"],
      a: (
        <>
          Your hours are your headline: late nights, weekends, holidays. Special hours
          let you change one day without touching the rest, and Google suggests
          confirming holidays even when nothing changes.{cite(S.hours)}{" "}Get a Sunday wrong
          and a sick person drives to a locked door, and you can guess the review.
        </>
      ),
    },
    {
      q: "Can you treat this?",
      searches: ["urgent care near me", "strep test near me", "stitches walk in"],
      a: (
        <>
          Google asks for the category that finishes &ldquo;this business is a&rdquo;.{cite(S.guidelines)}{" "}
          A walk-in clinic isn&apos;t a hospital or an emergency room, so your listing and
          your site shouldn&apos;t leave people guessing. Say what you treat, what you
          don&apos;t, and when to call 911.
        </>
      ),
    },
    {
      q: "Do you take my plan? What will it cost?",
      searches: ["urgent care that takes my insurance"],
      a: "If you post prices and plans, keep them right. A wrong one can turn a good visit into a bad review. If you don't post them, make sure the desk can answer in one sentence.",
    },
    {
      q: "Which one is closest?",
      searches: ["walk in clinic near me", "x-ray walk in clinic"],
      a: (
        <>
          Nobody can move your building, so each location&apos;s facts have to be right. Each
          has its own profile. Where several clinicians share a location, Google asks for
          one profile for the location, and any clinician&apos;s own profile uses only their
          name.{cite(S.guidelines)}
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Walk-in clinics" />}
        title="Open? Nearby? Takes my plan? Decision made."
        lead="Someone with a sore throat on a Sunday checks a few facts on a phone and goes. Your listing has answered before anyone gets to a review."
      />

      <Section>
        <Eyebrow>What your listing has to answer</Eyebrow>
        <ol className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {QUESTIONS.map((row) => (
            <li key={row.q} className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-12">
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-[2.5rem] leading-[1.1] tracking-tight text-[var(--color-ink)] font-medium">
                {row.q}
              </h2>
              <div className="min-w-0">
                <p className="text-[var(--color-ink-soft)] leading-relaxed">{row.a}</p>
                <SearchChips className="mt-4" searches={row.searches} />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>What a missed search costs</Eyebrow>
            <H2 className="mt-4 md:text-4xl">Nobody books a sore throat for next Tuesday.</H2>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              There&apos;s no callback to win. If they can&apos;t tell you&apos;re open, the
              visit goes elsewhere today, at an hour you had staff standing by and paid for.
            </p>
          </div>
          <div className="min-w-0">
            <H3 className="md:text-xl">The visits that can wait until lunch</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              School and work paperwork, shots and simple tests are planned. They&apos;re
              also the visits you could steer toward your slow hours, which makes them
              worth a page each on your site.
            </p>
            <SearchChips className="mt-4" searches={["sports physical walk in", "flu shot near me", "dot physical near me", "tb test near me"]} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your reviews</Eyebrow>
            <H2 className="mt-4 md:text-4xl">A review may name a diagnosis. A reply can&apos;t.</H2>
            <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
              In 2023 a psychiatric practice paid $30,000 to federal health regulators over
              replies to Google reviews that disclosed patient information.{cite(S.manasa)}{" "}
              Different kind of practice, same rule. So a person approves every reply, and
              every reply stays general.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              If your reviews keep mentioning waits or billing, we&apos;ll say so. We can&apos;t
              fix that part, and a better listing won&apos;t hide it. You can.
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
            <H3 className="md:text-xl">The trackers on your site</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Google says it doesn&apos;t offer a business associate agreement for Analytics,
              advises keeping its tags off pages covered by HIPAA, and says public pages tied
              to health care services are more likely to be covered.{cite(S.ga)}{" "}If your site
              carries ad or analytics tags, we&apos;ll flag it and you ask your lawyer.
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Which tier fits</Eyebrow>
          <H2 className="mt-4">Tier 1 is all we&apos;d sell a walk-in clinic today.</H2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              Your site, your posts and your replies, at {PRICE.display}{" "}a month, with these
              conditions:
            </p>
            {/* TODO(Blake): confirm the tool can exclude chosen pages, and get the vendor's
                written answer on a privacy contract before connecting any clinic listing
                (search-atlas.md section 7). This box is only true once both are done. */}
            <DotList
              className="mt-4"
              items={[
                "A person approves every reply.",
                "A clinician reads any health claim in a post.",
                "Our on-site tools stay off patient logins, check-in and intake pages.",
                "The privacy paperwork comes first. If it isn't settled, our tools don't touch your listing.",
              ]}
            />
            <p className="mt-5 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Google Ads, at {GOOGLE_ADS.display}{" "}a month plus ad spend paid to Google, can
              follow once your lawyer has answered.
            </p>
          </div>
          <div className="rounded-3xl border-2 border-dashed border-[#B3261E]/30 bg-white p-6 md:p-8">
            <H3>Everything that talks to a patient waits</H3>
            <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
              Voice, text and CRM: all of {BOOKING_OS}{" "}apart from Google Ads. Walk-in clinics
              come last of all our trades, because a sick caller is the worst case for an AI
              agent.
            </p>
            <CrossList
              className="mt-5"
              items={[
                <>
                  Whoever handles patient information for a clinic can count as a business
                  associate.{cite(S.ba)}{" "}We&apos;d need a privacy program of our own and a signed
                  agreement at every link first.
                </>,
                <>
                  The patient-safety group ECRI named misuse of AI chatbots its top health
                  technology hazard for 2026.{cite(S.ecri)}{" "}It tested general chatbots rather
                  than phone agents. That&apos;s still reason enough to be in no hurry.
                </>,
                <>
                  Texas health care ads can&apos;t be false, misleading or hard to verify, and
                  can&apos;t carry testimonials or comparisons that can&apos;t be backed up.{cite(S.tx101201)}{" "}
                  &ldquo;Best urgent care in town&rdquo; doesn&apos;t go on a page from us without
                  your lawyer&apos;s OK.
                </>,
              ]}
            />
          </div>
        </div>
      </Section>

      <div className="pt-14">
        <TradeClose
          sources={SOURCES}
          title="Check your Sunday hours first."
          body="Then ask for the audit. It reads public pages only and touches no patient data. We haven't scanned walk-in clinics yet, so the rival comparison waits until we have the data."
        />
      </div>
    </>
  );
}
