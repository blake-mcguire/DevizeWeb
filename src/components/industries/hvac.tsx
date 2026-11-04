import { Crumb, TradeClose } from "@/components/industries/shared";
import { Eyebrow, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { GOOGLE_ADS, PRICE } from "@/lib/tiers";

// In the order the page first cites them.
const SOURCES: Source[] = [S.serviceArea, S.guidelines, S.hours, S.contribution, S.ftc, S.fcc, S.tx7571, S.gas];
const cite = citer(SOURCES);

const EVENING = [
  {
    time: "6:40 pm",
    text: "The vents are blowing warm. They pick up a phone and type \"ac not cooling\", then \"emergency ac repair\".",
  },
  {
    time: "6:43 pm",
    text: "Your name comes up. The listing says closed. Or it says open, and the call rolls to voicemail.",
  },
  { time: "6:44 pm", text: "They tap the next name on the map." },
  { time: "7:30 pm", text: "Someone else's truck is in the driveway." },
];

export default function HvacPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="HVAC" />}
        title="The AC quit at 6:40. Your office closed at 5."
        lead="Nobody looks for AC repair on a nice day. They look when the house is hot, and they keep calling down the map until someone picks up."
      />

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
            <p className="mt-6 text-sm text-[var(--color-ink-soft)]">An example evening, not a measurement.</p>
          </div>
          <div className="min-w-0 rounded-3xl bg-[var(--color-ink)] p-7 text-white md:p-10">
            <H3 className="text-white md:text-[1.75rem] leading-tight">What that call was worth</H3>
            <p className="mt-4 text-white/85 leading-relaxed">
              Tonight&apos;s repair ticket is the small part. A homeowner who trusted
              your tech in July signs the maintenance plan in the fall, and calls you
              first when the old unit finally gives out.
            </p>
            <p className="mt-3 text-white/85 leading-relaxed">
              Miss the call and all of that goes to whoever answered. You know what
              those jobs are worth from your own books. We don&apos;t, so we won&apos;t
              put a number on it.
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
              A replacement is a different sale. The unit is old or a quote looks
              high, and they compare a few companies over days. They read your
              reviews, look for real jobs and try to work out what a system should
              cost. Tier 1&apos;s on-site fixes and posts are aimed at this buyer.
            </p>
            <SearchChips className="mt-5" searches={["ac replacement cost", "new hvac system quote", "heat pump installer", "ac tune up", "hvac maintenance plan"]} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Your listing and your reviews</Eyebrow>
          <H2 className="mt-4">An office nobody visits, with trucks everybody sees.</H2>
        </div>
        <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          <div>
            <H3 className="md:text-xl">A service area, not a shop address</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              If customers don&apos;t come to your address, Google says to remove it
              from your profile and list the areas you serve. You get up to 20 areas,
              within about 2 hours&apos; drive, and you can&apos;t draw a radius around
              your shop.{cite(S.serviceArea)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">The name on your trucks, and nothing else</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              Google doesn&apos;t allow extra words in a business name, like service
              descriptions or locations, and says it can lead to suspension.{cite(S.guidelines)}{" "}
              &ldquo;Best AC Repair&rdquo; tacked onto the end puts the listing at risk.
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Hours you really answer</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              Saying open with nobody picking up at 7pm in July loses the call and
              the trust. List the hours you answer, and confirm your holiday hours
              even when they don&apos;t change, as Google suggests.{cite(S.hours)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Categories that are true</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              As few as possible, each finishing the sentence &ldquo;this business is
              a&rdquo;. Adding more to catch more searches isn&apos;t allowed.{cite(S.guidelines)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Photos of real work</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              Your trucks, your techs and real jobs, taken this year. A stock photo
              tells a homeowner nothing about who&apos;s coming to the house.
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Replies that stay out of the house</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              A reply can say thanks and mention the kind of job. It shouldn&apos;t
              mention the street, what&apos;s in the house or what they paid. And
              everyone gets asked the same way: Google bars asking only for good
              reviews, and the FTC bans buying them.{cite(S.contribution, S.ftc)}
            </p>
          </div>
        </div>
        {/* TODO(Blake): see the listing-fixes question above TIER_1 in src/lib/tiers.ts.
            This line is the "no" answer, and it goes if listing fixes join Tier 1. */}
        <p className="mt-8 max-w-3xl font-medium text-[var(--color-ink)] leading-relaxed">
          These are yours to change. The audit flags what it can see, and we correct
          wrong facts in the first month of Tier 1.
        </p>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
          <div className="min-w-0">
            <H2 className="md:text-4xl">Start with Tier 1. The pilots are aimed at 6:40.</H2>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Tier 1, at {PRICE.display}{" "}a month, gets your site, posts and replies in
              order for the homeowner with time. It won&apos;t answer a phone after
              hours. Missed-call text-back in Tier 2 and the voice agent in Tier 3
              would. Both are in pilot, and HVAC is first in line with plumbing,
              because no patient records or bar rules stand in the way.
            </p>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Google Ads is the one Tier 2 line you can buy now: {GOOGLE_ADS.display}{" "}a
              month more, plus what you pay Google. The first test we&apos;d suggest is ads
              only in the hours someone answers, because a click that rolls to voicemail
              is money for nothing.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              We treat tune-up reminders by text as marketing. They need a consent
              record for each number, and we don&apos;t count a number on an old
              invoice as one.{cite(S.fcc)}
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
            <H3 className="md:text-xl">Your rules</H3>
            <p className="mt-4 font-medium text-[var(--color-ink)]">The license number on your ads</p>
            <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas requires the affiliated licensee&apos;s number on HVAC advertising
              meant to bring in business, with a short list of exceptions, and on both
              sides of company vehicles.{cite(S.tx7571)}{" "}That takes planning in a
              30-character ad headline. Other states have their own rules.
            </p>
            <p className="mt-5 font-medium text-[var(--color-ink)]">A caller who smells gas</p>
            <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              A voice agent would get one short line for this, then let them go.
              CenterPoint&apos;s advice is to leave on foot, avoid using a phone and
              call once you&apos;re safe.{cite(S.gas)}{" "}An agent that keeps someone
              talking does the opposite.
            </p>
            <p className="mt-5 font-medium text-[var(--color-ink)]">Your free audit</p>
            <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              The comparison with rivals runs for HVAC in Houston and Dallas, on listings
              whose main Google category is HVAC contractor, AC repair service or AC
              contractor. Anywhere else, it waits until we have the data.
            </p>
          </div>
        </div>
      </Section>

      <div className="pt-14">
        <TradeClose
          sources={SOURCES}
          title="See who gets the 6:44 call."
          body="The free audit runs the searches your customers run, from spots all around you, and shows who comes up instead. Nothing to sign."
        />
      </div>
    </>
  );
}
