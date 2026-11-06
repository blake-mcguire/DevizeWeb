import { Crumb, TradeArrow, TradeClose } from "@/components/industries/shared";
import { DotList, Eyebrow, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { ADS, SEO_REVIEWS } from "@/lib/menu";

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
          Put your late nights, weekends and holidays up front, and confirm holidays even when
          nothing changes, as Google suggests.{cite(S.hours)}{" "}Get a Sunday wrong and a sick person drives to a
          locked door, and you can guess the review.
        </>
      ),
    },
    {
      q: "Can you treat this?",
      searches: ["strep test near me", "stitches walk in"],
      a: (
        <>
          Use the category that finishes the sentence &ldquo;this business is a&rdquo;, as Google asks.{cite(S.guidelines)}{" "}
          Then say on your listing and your site what you treat, what you don&apos;t and when
          to call 911.
        </>
      ),
    },
    {
      q: "Do you take my plan? What will it cost?",
      searches: ["urgent care that takes my insurance"],
      a: "If you post prices and plans, keep them right. If you don't, make sure the desk can answer in one sentence.",
    },
    {
      q: "Which one is closest?",
      searches: ["walk in clinic near me", "x-ray walk in clinic"],
      a: (
        <>
          Nobody can move your building, so each location&apos;s facts have to be right, and
          each location has its own profile.{cite(S.guidelines)}
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Walk-in clinics" />}
        title="People check if you're open, close by and take their plan."
        subhead="Your listing answers that before anyone reads a review."
        lead="Someone with a sore throat on a Sunday checks those facts on a phone and goes."
      >
        <TradeArrow />
      </PageHero>

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
              School and work paperwork, shots and simple tests are visits you can steer toward
              your slow hours, so each is worth its own page on your site.
            </p>
            <SearchChips className="mt-4" searches={["sports physical walk in", "flu shot near me"]} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your reviews</Eyebrow>
            <H2 className="mt-4 md:text-4xl">A review may name a diagnosis, but your reply can&apos;t.</H2>
            <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
              In 2023 a psychiatric practice paid $30,000 to federal health regulators over
              replies to Google reviews that disclosed patient information.{cite(S.manasa)}{" "}
              The same rule covers a clinic, so a person approves every reply.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              If your reviews keep mentioning waits or billing, we&apos;ll show you how often,
              and that fix is yours to make.
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
            <H3 className="md:text-xl">The trackers on your site</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Google says it doesn&apos;t offer a business associate agreement for Analytics,
              and it advises keeping its tags off pages covered by HIPAA. It says public pages
              tied to health care services are more likely to be covered.{cite(S.ga)}{" "}If your
              site carries ad or analytics tags, we&apos;ll flag each one.
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <H2>We set up your listing, posts and replies for a clinic.</H2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8">
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {SEO_REVIEWS.name}, set up this way:
            </p>
            {/* TODO(Blake): confirm the tool can exclude chosen pages, and get the vendor's
                written answer on a privacy contract before connecting any clinic listing
                (search-atlas.md section 7). This box is only true once both are done. */}
            <DotList
              className="mt-4"
              items={[
                "A clinician reads any health claim in a post.",
                "Any tools we add to your website stay off patient logins, check-in and intake pages.",
                "Our tool vendor signs a privacy contract before it touches your listing.",
              ]}
            />
            <p className="mt-5 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              {ADS.search.name}, with your state&apos;s health care ad rules checked first.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
            <H3>Anything that talks to a patient</H3>
            {/* TODO(Blake): no HIPAA program is on file. See FINE_PRINT in src/lib/offer-copy.ts. */}
            <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
              A sick caller is the hardest call an AI agent can get, so the AI Voice Receptionist
              and Lead Nurture SMS start after your listing work is running.
            </p>
            <DotList
              className="mt-5"
              items={[
                <>
                  These tools touch patient information, so a privacy program and a signed
                  agreement with each vendor come first.{cite(S.ba)}
                </>,
                <>
                  The patient-safety group ECRI named misuse of AI chatbots its top health
                  technology hazard for 2026.{cite(S.ecri)}{" "}It tested general chatbots, and we
                  apply the same caution to phone agents.
                </>,
                <>
                  Texas health care ads can&apos;t carry testimonials or comparisons that can&apos;t
                  be backed up,{cite(S.tx101201)}{" "}so we won&apos;t write &ldquo;Best urgent care in town&rdquo;.
                </>,
              ]}
            />
          </div>
        </div>
      </Section>

      <div className="pt-14">
        <TradeClose sources={SOURCES} />
      </div>
    </>
  );
}
