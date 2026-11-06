import { Crumb, TradeArrow, TradeClose } from "@/components/industries/shared";
import { ArrowLink, Eyebrow, Findings, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { SEO_REVIEWS } from "@/lib/menu";

// In the order the page first cites them.
const SOURCES: Source[] = [S.serviceArea, S.guidelines, S.contribution, S.ftc, S.fcc, S.tx7571, S.gas];
const cite = citer(SOURCES);

const EVENING = [
  {
    time: "6:40pm",
    text: "The vents are blowing warm, so they type \"ac not cooling\", then \"emergency ac repair\".",
  },
  {
    time: "6:43pm",
    text: "Your name comes up, but the listing says closed, or it says open and the call rolls to voicemail.",
  },
  { time: "6:44pm", text: "They tap the next name on the map." },
  { time: "7:30pm", text: "Someone else's truck is in the driveway." },
];

// Claim bank D1, D4 and D5, HVAC only. Recounted 5 Nov. These don't hold for dental, and
// the dental numbers don't hold here. Never say why a listing came up.
const FINDINGS = [
  {
    count: "37%",
    title: "Shops with fewer reviews still reach the top three.",
    detail: "When the searcher is 1 to 2 miles away, shops with 100 to 229 reviews reached the top three 37% of the time in Houston and 25% in Dallas. In dental it's 3 to 4%.",
  },
  {
    count: "41%",
    title: "Shops at 4.9 stars or better show up more than shops at 4.4 to 4.7.",
    detail: "When the searcher is 1 to 2 miles away, they reached the top three 41% of the time in Houston and 33% in Dallas, against 14% and 13% at 4.4 to 4.7.",
  },
  {
    count: "82%",
    title: "Listings marked open 24 hours hold most of the top spots at night.",
    detail: "They held 82% of top-three spots at 9pm in Houston, against 38% in the morning.",
  },
];

export default function HvacPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="HVAC" />}
        title="The AC quit at 6:40. Your office closed at 5."
        subhead="The job goes to whoever picks up."
        lead="Nobody looks for AC repair on a nice day. They look when the house is hot, and they keep calling until someone answers."
      >
        <TradeArrow />
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>One July evening</Eyebrow>
            <H2 className="mt-4">Where the job goes.</H2>
            <ol className="mt-8 border-l-2 border-[var(--color-brand)]/25">
              {EVENING.map((beat) => (
                <li key={beat.time} className="relative pb-7 pl-6 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[0.4375rem] top-[0.35em] h-3 w-3 rounded-full bg-[var(--color-brand)]" />
                  <p className="font-[family-name:var(--font-display)] text-sm font-medium tracking-tight text-[var(--color-brand)]">{beat.time}</p>
                  <p className="mt-1 text-lg text-[var(--color-ink)] leading-relaxed">{beat.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-[var(--color-ink-soft)]">This is an example evening.</p>
          </div>
          <div className="min-w-0 rounded-lg bg-[var(--color-ink)] p-7 text-white md:p-10">
            <H3 className="text-white md:text-[1.75rem] leading-tight">What that call was worth</H3>
            <p className="mt-4 text-white/85 leading-relaxed">
              Tonight&apos;s repair ticket is the small part, because a homeowner who trusts
              your tech in July signs the maintenance plan in the fall and calls you first
              when the old unit gives out.
            </p>
            <p className="mt-3 text-white/85 leading-relaxed">
              Miss the call and all of that goes to whoever answered. You know what
              those jobs are worth from your own books.
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
          <div className="min-w-0">
            <Eyebrow>The other search</Eyebrow>
            <H2 className="mt-4 md:text-4xl">The homeowner with time.</H2>
          </div>
          <div className="min-w-0">
            <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Replacement buyers take days and compare a few companies, so the weekly
              posts, review replies and on-page fixes in {SEO_REVIEWS.name} are aimed at them.
            </p>
            <SearchChips className="mt-5" searches={["ac replacement cost", "new hvac system quote", "hvac maintenance plan"]} />
          </div>
        </div>
      </Section>

      <Section>
        <Findings
          eyebrow="What our HVAC scans show"
          title="HVAC numbers look nothing like dental numbers."
          items={FINDINGS}
          basis="From our own phone searches from set spots: morning scans in Houston (12 October 2026) and Dallas (16 October 2026), and the 9pm scan in Houston (Friday 18 September 2026) against that Houston morning. Each figure compares different shops at the time of the scan. Distances are approximate where a shop hides its address. The Houston 14% rests on only 44 results."
        />
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Your listing and your reviews</Eyebrow>
          <H2 className="mt-4">Set up your listing for customers who never come to your office.</H2>
        </div>
        <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          <div>
            <H3 className="md:text-xl">List the areas you serve</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              If customers don&apos;t come to your address, Google says to take it off your
              profile and list up to 20 areas, within about 2 hours&apos; drive.{cite(S.serviceArea)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">The name on your trucks, and nothing else</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              Google says extra words in a business name can lead to suspension, so
              &ldquo;Best AC Repair&rdquo; on the end puts the listing at risk. It also bars
              adding categories to catch more searches.{cite(S.guidelines)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Hours you answer</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              List the hours someone picks up, so the listing never says open while the call
              rolls to voicemail.
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">What a review reply can say</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              A reply can say thanks and mention the kind of job, and it leaves out the
              street and what they paid. Everyone gets asked the same way, because Google bars
              asking only for good reviews and the FTC bans buying them.{cite(S.contribution, S.ftc)}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
          <div className="min-w-0">
            <H2 className="md:text-4xl">The listing work is for the homeowner with time. The receptionist is for 6:40.</H2>
            {/* TODO(Blake): the AI Voice Receptionist isn't built. See ADD_ONS in src/lib/menu.ts. */}
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              The AI Voice Receptionist picks up after-hours and overflow calls, so the 6:40
              call doesn&apos;t roll to voicemail.
            </p>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              If you try ads, run them first only in the hours someone answers, because a click
              nobody answers is wasted money.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-10">
              <ArrowLink href="/services/google-local-services-ads">Google Local Services Ads</ArrowLink>
              <ArrowLink href="/services/google-search-ads">Google Search ads</ArrowLink>
            </div>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              We treat tune-up reminders by text as marketing, so each number needs a consent
              record.{cite(S.fcc)}
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
            <H3 className="md:text-xl">Your rules</H3>
            <p className="mt-4 font-medium text-[var(--color-ink)]">The license number on your ads</p>
            <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas requires your licensee&apos;s number on HVAC ads
              meant to bring in business, with a short list of exceptions, and on both
              sides of company vehicles.{cite(S.tx7571)}{" "}That takes planning in a
              30-character ad headline. Other states have their own rules.
            </p>
            <p className="mt-5 font-medium text-[var(--color-ink)]">A caller who smells gas</p>
            <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              CenterPoint&apos;s advice is to leave on foot, avoid using a phone and call once
              you&apos;re safe,{cite(S.gas)}{" "}so the AI Voice Receptionist gives one short line
              and lets them go.
            </p>
          </div>
        </div>
      </Section>

      <TradeClose sources={SOURCES} read="4 and 5 November 2026" />
    </>
  );
}
