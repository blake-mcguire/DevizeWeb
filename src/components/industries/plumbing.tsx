import { Crumb, TradeArrow, TradeClose } from "@/components/industries/shared";
import { ArrowLink, Eyebrow, H2, H3, PageHero, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { SEO_REVIEWS } from "@/lib/menu";

// In the order the page first cites them.
const SOURCES: Source[] = [S.serviceArea, S.spam, S.lsaMove, S.fcc, S.contribution, S.ftc, S.tx36710, S.tx3679, S.gas];
const cite = citer(SOURCES);

const JOBS = [
  {
    job: "Burst pipe or backup",
    types: "emergency plumber, burst pipe, sewer backup",
    decides: "Someone answering, right now.",
    costs: "Tonight's service call, and being the plumber whose number stays on the fridge.",
  },
  {
    job: "Water heater",
    types: "water heater leaking, water heater replacement cost",
    decides: "A page with real jobs and fair price ranges.",
    costs: "An install that was happening this week, with you or without you.",
  },
  {
    job: "Drains",
    types: "plumber near me, drain cleaning cost",
    decides: "A clear price, and reviews about showing up on time.",
    costs: "A small ticket, and the camera inspection that can turn into a bigger one.",
  },
  {
    job: "Repipe or remodel",
    types: "repipe quote, bathroom remodel plumber",
    decides: "Your license, your reviews and a quote that comes back.",
    costs: "The biggest job on your board, to whoever returned the call.",
  },
];

export default function PlumbingPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Plumbing companies" />}
        title="Water is on the floor."
        subhead="Nobody reads your About page with a wet floor."
        lead="A burst pipe goes to whoever answers, and a water heater quote goes to whoever looks trustworthy after a few minutes of reading."
      >
        <TradeArrow />
      </PageHero>

      <Section>
        <Eyebrow>Four jobs</Eyebrow>
        <H2 className="mt-4">What decides each one, and what a missed call costs.</H2>
        <div className="mt-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
          <div aria-hidden="true" className="hidden grid-cols-[0.8fr_1.1fr_1fr_1.2fr] gap-6 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-3 text-xs uppercase tracking-[0.1em] text-[var(--color-ink-soft)] font-medium lg:grid">
            <span>The job</span>
            <span>What they type</span>
            <span>What decides it</span>
            <span>What a missed call costs</span>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {JOBS.map((row) => (
              <li key={row.job} className="grid grid-cols-1 gap-3 px-6 py-6 lg:grid-cols-[0.8fr_1.1fr_1fr_1.2fr] lg:gap-6">
                <H3 className="md:text-xl leading-snug">{row.job}</H3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  <span className="lg:sr-only font-medium text-[var(--color-ink)]">They type: </span>
                  <span className="italic">{row.types}</span>
                </p>
                <p className="text-[0.95rem] text-[var(--color-ink)] leading-relaxed">
                  <span className="lg:sr-only font-medium">What decides it: </span>
                  {row.decides}
                </p>
                <p className="text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  <span className="lg:sr-only font-medium text-[var(--color-ink)]">A missed call costs: </span>
                  {row.costs}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-[var(--color-ink-soft)]">You know the dollar figures from your own board.</p>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Your Google listing</Eyebrow>
          <H2 className="mt-4">Google lists plumbers as an example of a service-area business.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            If customers don&apos;t come to you, take your address off your profile. A place
            with no permanent sign can&apos;t be listed as a storefront.{cite(S.serviceArea)}
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <H3 className="md:text-xl">One profile for the whole area</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Google allows a service-area business one profile for the area it serves,{cite(S.serviceArea)}{" "}
              so you don&apos;t need anyone selling you a listing for each city.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <H3 className="md:text-xl">&ldquo;24/7&rdquo; has to be true</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              If your listing and site say 24 hours, someone has to answer at 2am, and any
              after-hours fee belongs on your page.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <H3 className="md:text-xl">Build pages around jobs</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              A water heater page should show real jobs and fair price ranges. Google&apos;s spam rules
              ban town pages with only the name swapped.{cite(S.spam)}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <H2 className="md:text-4xl">What we do depends on where you lose the job.</H2>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              If nobody finds you, or they find you and don&apos;t trust the page, that&apos;s
              {" "}{SEO_REVIEWS.name}.
            </p>
            {/* TODO(Blake): the AI Voice Receptionist isn't built. See ADD_ONS in src/lib/menu.ts. */}
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              If they call and nobody picks up, listing work won&apos;t help, so the AI Voice
              Receptionist handles after-hours and overflow calls.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              On Local Services Ads you pay Google for each valid lead, and Google is changing how
              these ads work, with plumbing among the first.{cite(S.lsaMove)}{" "}If you want
              ads for emergencies, make sure someone answers at midnight.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-10">
              <ArrowLink href="/services/google-local-services-ads">Google Local Services Ads</ArrowLink>
              <ArrowLink href="/services/google-search-ads">Google Search ads</ArrowLink>
            </div>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              A text telling a past customer their water heater is getting on in years counts
              as marketing, so it needs a consent record for that number.{cite(S.fcc)}
            </p>
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-7">
              <H3 className="md:text-xl">Your reviews</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                A bad review about price gets a general answer and an invitation to call, with no
                invoice details and no customer address. Ask everyone or no one, and never pay for
                a review.{cite(S.contribution, S.ftc)}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
              <H3 className="md:text-xl">Your rules</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Texas requires the license number on all your ads meant to bring in plumbing
                business, with a short list of exceptions, and on your service
                vehicles.{cite(S.tx36710)}{" "}A company can&apos;t advertise plumbing in Texas unless it has
                a Responsible Master Plumber, as an employee or the owner.{cite(S.tx3679)}
              </p>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                If a caller smells gas, the AI Voice Receptionist tells them to leave and call from
                outside.{cite(S.gas)}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <TradeClose sources={SOURCES} read="4 and 5 November 2026" />
    </>
  );
}
