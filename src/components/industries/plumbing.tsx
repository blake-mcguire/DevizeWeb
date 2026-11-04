import { Crumb, TradeClose } from "@/components/industries/shared";
import { Eyebrow, H2, H3, PageHero, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { GOOGLE_ADS, PRICE } from "@/lib/tiers";

// In the order the page first cites them.
const SOURCES: Source[] = [S.serviceArea, S.spam, S.fcc, S.contribution, S.ftc, S.tx36710, S.tx3679, S.gas];
const cite = citer(SOURCES);

const JOBS = [
  {
    job: "Burst pipe or backup",
    types: "emergency plumber, burst pipe, sewer backup",
    decides: "Someone answering, right now.",
    costs: "Tonight's call-out, and being the plumber whose number stays on the fridge.",
  },
  {
    job: "Water heater",
    types: "water heater leaking, water heater replacement cost, tankless water heater installer",
    decides: "A page with real jobs and honest ranges.",
    costs: "An install that was happening this week, with you or without you.",
  },
  {
    job: "Drains",
    types: "plumber near me, drain cleaning cost",
    decides: "A clear price, and reviews about showing up on time.",
    costs: "A small ticket, and the camera look that can turn into a bigger one.",
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
        lead="Nobody reads your About page with a wet floor. A burst pipe goes to whoever answers. A water heater quote goes to whoever looks trustworthy after a few minutes of reading. Same company, different jobs, won in different places."
      />

      <Section>
        <Eyebrow>Four jobs</Eyebrow>
        <H2 className="mt-4">What decides each one, and what a missed call costs.</H2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
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
        <p className="mt-4 text-sm text-[var(--color-ink-soft)]">Plain-word examples, not search volume. You know the dollar figures from your own board. We don&apos;t.</p>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Your Google listing</Eyebrow>
          <H2 className="mt-4">You&apos;re the example Google uses.</H2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            Google names plumbers as a service-area business. If customers don&apos;t come to
            you, take your address off your profile. A place with no permanent sign can&apos;t
            be listed as a storefront.{cite(S.serviceArea)}
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <H3 className="md:text-xl">One profile for the whole area</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Google allows a service-area business one profile for the area it serves.{cite(S.serviceArea)}{" "}
              That&apos;s worth knowing before anyone sells you a listing for each city.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <H3 className="md:text-xl">&ldquo;24/7&rdquo; has to be true</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              If your listing and site say 24 hours, someone has to answer at 2am. If there&apos;s
              an after-hours call-out fee, saying so on your page heads off a bad review later.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <H3 className="md:text-xl">Pages by job, not by town</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              A water heater page with real jobs, fair ranges and what happens on the visit gives
              a reader something. Forty town pages with the name swapped don&apos;t, and Google&apos;s
              spam rules name that as doorway abuse.{cite(S.spam)}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Which tier fits</Eyebrow>
            <H2 className="mt-4 md:text-4xl">It depends where you lose the job.</H2>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              If nobody finds you, or they find you and don&apos;t trust the page, that&apos;s
              Tier 1 at {PRICE.display}{" "}a month: on-site fixes, posts a person has checked,
              replies and map tracking.
            </p>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              If they call and nobody picks up, Tier 1 won&apos;t fix it. Missed-call text-back,
              speed to lead and the after-hours voice agent are aimed at that. All three are in
              pilot. Plumbing and HVAC go first, since neither carries patient records or bar rules.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              Google Ads is available now at {GOOGLE_ADS.display}{" "}a month plus ad spend paid to
              Google. If you only want it for emergencies, ask yourself who answers. Paying for a midnight click that rings out is
              the worst deal in the trade.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              A text telling a past customer their water heater is getting on in years is
              marketing, as we read it, so it needs a consent record for that number.{cite(S.fcc)}
            </p>
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
              <H3 className="md:text-xl">Your reviews</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                A bad review about price gets a general answer and an invitation to call. Never
                the invoice, and never the customer&apos;s address. If you ask for reviews yourself,
                ask everyone: Google bars asking only for good ones, and the FTC bans buying them.{cite(S.contribution, S.ftc)}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
              <H3 className="md:text-xl">Your rules</H3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Texas requires the license number in all advertisements by a plumbing company meant
                to bring in plumbing business, with a short list of exceptions, and on your service
                vehicles.{cite(S.tx36710)}{" "}A company can&apos;t advertise plumbing there unless it has
                secured a Responsible Master Plumber, as an employee or the owner.{cite(S.tx3679)}
              </p>
              <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                Gas water heaters mean the odd call about a gas smell. A voice agent gets one short
                line for it, then lets them go. CenterPoint&apos;s advice is to leave on foot, avoid
                using a phone and call once you&apos;re safe.{cite(S.gas)}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <TradeClose
        sources={SOURCES}
        title="Call your own number at midnight."
        body="If you don't like what you hear, email us. The audit is free and reads public pages only. We haven't scanned plumbers yet, so the rival comparison waits until we have the data."
      />
    </>
  );
}
