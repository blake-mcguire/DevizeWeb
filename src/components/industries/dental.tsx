import { Crumb, TradeClose } from "@/components/industries/shared";
import { CrossList, DotList, Eyebrow, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { BOOKING_OS } from "@/lib/offer-copy";
import { GOOGLE_ADS, PRICE } from "@/lib/tiers";

// In the order the page first cites them. The two HHS pages returned 403 when the
// research ran, so those two facts rest on search extracts (search-atlas.md section 7).
const SOURCES: Source[] = [
  S.elite,
  S.igbinadolor,
  S.newVision,
  S.guidelines,
  S.hours,
  S.tx10852,
  S.healthAds,
  S.ba,
  S.reminders,
  S.tx10857,
  S.tx101201,
  S.tx10860,
];
const cite = citer(SOURCES);

export default function DentalPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Dental clinics" />}
        title="A toothache at 7am. A new family on Saturday."
        lead="The first wants a yes today. The second wants to know you take their insurance, and reads your reviews first. Both can see what you wrote back to your last unhappy patient, and federal privacy law limits what that can say."
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>It hurts now</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">They need an open office and a person on the line.</p>
            <SearchChips className="mt-4" searches={["emergency dentist near me", "dentist open today", "tooth pain dentist", "broken tooth dentist", "dentist open saturday"]} />
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>They just moved</H3>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">Or the plan changed, or a dentist retired. They read, compare and ask around.</p>
            <SearchChips className="mt-4" searches={["dentist near me", "family dentist", "dentist that takes my insurance", "teeth cleaning cost", "kids dentist"]} />
          </div>
        </div>
        <p className="mt-8 max-w-3xl font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-snug tracking-tight text-[var(--color-ink)] font-medium">
          A missed call here isn&apos;t one filling. It&apos;s a new chart: cleanings and
          recalls for years, the crown you catch at an exam, often the rest of the
          household. You&apos;d never know it was yours to lose.
        </p>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Your reviews</Eyebrow>
          <H2 className="mt-4">The sentence that gets practices fined.</H2>
        </div>
        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <figure className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <blockquote className="text-lg text-[var(--color-ink)] leading-relaxed">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">A review</p>
              <p className="mt-2">&ldquo;They rushed my crown and it still hurts.&rdquo;</p>
            </blockquote>
            <div className="mt-6 rounded-xl border border-[#B3261E]/30 bg-[#B3261E]/[0.05] p-4">
              <p className="text-sm font-medium text-[#B3261E]">A reply that tells the world this is your patient</p>
              <p className="mt-1.5 text-[var(--color-ink)] leading-relaxed">
                &ldquo;We&apos;re sorry about your crown. Our records show you skipped your
                follow-up visit.&rdquo;
              </p>
            </div>
            <div className="mt-3 rounded-xl border border-[#2E9E5B]/30 bg-[#2E9E5B]/[0.07] p-4">
              <p className="text-sm font-medium text-[#1F7A45]">A reply that doesn&apos;t</p>
              <p className="mt-1.5 text-[var(--color-ink)] leading-relaxed">
                &ldquo;We take every comment seriously, and privacy rules keep us from
                discussing anyone&apos;s care here. Please call the office and ask for
                the manager.&rdquo;
              </p>
            </div>
            <figcaption className="mt-4 text-sm text-[var(--color-ink-soft)]">
              Invented examples. Your lawyer signs off on the real wording.
            </figcaption>
          </figure>
          <div className="min-w-0">
            <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Federal regulators have acted against at least three dental practices
              over what they wrote back to online reviews: $10,000 in 2019,{cite(S.elite)}{" "}
              $50,000 in 2022,{cite(S.igbinadolor)} and $23,000 later that year.{cite(S.newVision)}
            </p>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Those were people typing. Software that echoes a reviewer&apos;s words can
              make the same mistake faster. So for a dental client, a person approves
              every reply before it posts, inside wording you&apos;ve signed off once.
            </p>
          </div>
        </div>
      </Section>

      <Section narrow>
        <Eyebrow>Your Google listing</Eyebrow>
        <H2 className="mt-4 md:text-4xl">Five things worth checking this week.</H2>
        <ol className="mt-8 space-y-6">
          <li>
            <p className="font-medium text-[var(--color-ink)]">Who the listing belongs to</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              Google separates an office&apos;s profile from a dentist&apos;s own. Several
              dentists at one location means one profile for the office, and each
              dentist&apos;s profile uses only their name. A solo dentist under a practice
              brand shares one profile named &ldquo;brand: dentist name&rdquo;. No extra
              profiles for specialties.{cite(S.guidelines)}
            </p>
          </li>
          <li>
            <p className="font-medium text-[var(--color-ink)]">Hours the desk really answers</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              A search at 7am goes nowhere if the listing says open and the line goes
              to voicemail. Google also suggests confirming holiday hours, even when
              they don&apos;t change.{cite(S.hours)}
            </p>
          </li>
          <li>
            <p className="font-medium text-[var(--color-ink)]">A booking link that goes somewhere</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              If booking runs through an outside service, try the link from your
              listing and your site on a phone. It takes a minute, and it&apos;s easy to miss.
            </p>
          </li>
          <li>
            <p className="font-medium text-[var(--color-ink)]">Insurance in plain words</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              It&apos;s one of the first things a family wants to know. List the plans
              you take on your site, and keep the list current.
            </p>
          </li>
          <li>
            <p className="font-medium text-[var(--color-ink)]">Old copies of your site</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              If an old vendor&apos;s copy is still online, people can find it, and the
              wrong phone number with it.
            </p>
          </li>
        </ol>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Which tier fits</Eyebrow>
          <H2 className="mt-4">What we can sell a dental practice today, and what has to wait.</H2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2 items-start">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>Today</H3>
            <p className="mt-4 font-medium text-[var(--color-ink)]">Tier 1, at {PRICE.display} a month, with four conditions</p>
            {/* TODO(Blake): confirm the tool can exclude chosen pages, and get the vendor's
                written answer on a privacy contract before connecting any dental listing
                (search-atlas.md section 7). This box is only true once both are done. */}
            <DotList
              className="mt-3"
              items={[
                "A person approves every review reply.",
                "Any claim in a blog post gets a dentist's sign-off before it goes up.",
                "Our on-site tools stay off patient logins, booking and intake pages.",
                "The privacy paperwork comes first. If it isn't settled, our tools don't touch your listing.",
              ]}
            />
            <p className="mt-6 font-medium text-[var(--color-ink)]">Google Ads, at {GOOGLE_ADS.display} a month plus ad spend paid to Google, once your lawyer answers a few questions</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas says a trade-name ad must prominently name the owners and at least
              one dentist practicing there,{cite(S.tx10852)}{" "}and an ad line is 30 characters.
              No ads that follow past visitors and no uploaded lists: Google
              treats health as a sensitive category for personalized ads, and although
              dental isn&apos;t named, we treat it as covered.{cite(S.healthAds)}{" "}No patient
              list ever leaves your practice.
            </p>
          </div>
          <div className="rounded-3xl border-2 border-dashed border-[#B3261E]/30 bg-white p-6 md:p-8">
            <H3>Waits</H3>
            <p className="mt-4 font-medium text-[var(--color-ink)]">Voice, text and CRM</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              That&apos;s all of {BOOKING_OS}: everything in Tier 2 except Google Ads, and
              all of Tier 3. Each one handles patient information, and whoever handles
              that for a practice can count as a business associate.{cite(S.ba)}{" "}Doing it
              properly takes a privacy program of our own and a signed agreement at
              every link: you to us, us to each vendor. We don&apos;t have that yet, so we
              won&apos;t sell it yet.
            </p>
            <CrossList
              className="mt-5"
              items={[
                "Asking patients for reviews waits with it, because a tool or a person ends up holding their contact details.",
                <>
                  Reminders are allowed without a patient&apos;s authorization, but a sales
                  follow-up isn&apos;t a reminder.{cite(S.reminders)}{" "}When this opens up, your
                  lawyer draws that line.
                </>,
              ]}
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-3">
          <div>
            <H3 className="md:text-xl">&ldquo;Best&rdquo;, &ldquo;#1&rdquo;, &ldquo;pain-free&rdquo;</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas dental ads can&apos;t be false, misleading or hard to verify. The rule
              bars implying superior services, comparisons that can&apos;t be backed up,
              guarantees of success and claims of work without pain.{cite(S.tx10857)}{" "}Those
              words go to your lawyer before they go on a page.
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Showing off your reviews</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              The dental rule limits testimonials to patients of record, with
              disclosures, and the general Texas health care advertising law lists them
              too.{cite(S.tx10857, S.tx101201)}{" "}Putting reviews on your own site is a
              question for your lawyer.
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Keeping your ads</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas wants copies of electronic ads kept for 4 years from when they last
              ran.{cite(S.tx10860)}{" "}If we run your ads, the copy sheet lives in your own
              Drive for that reason.
            </p>
          </div>
        </div>
      </Section>

      <TradeClose
        sources={SOURCES}
        title="See who gets the 7am search."
        body="The rival comparison runs for dental in Houston, Dallas and San Antonio, on listings whose main category is Dentist or Dental clinic. It reads only what anyone can see on Google and on your website, so it touches no patient data."
      />
    </>
  );
}
