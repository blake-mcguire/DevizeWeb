import { Crumb, TradeArrow, TradeClose } from "@/components/industries/shared";
import { DotList, Eyebrow, Findings, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { ADS, SEO_REVIEWS } from "@/lib/menu";

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
  S.tx10860,
];
const cite = citer(SOURCES);

// Claim bank C1, C2 and C5, dental only. These don't hold for HVAC (about twice the odds
// fails in Dallas HVAC, 0.87). No listing was changed and re-measured, so never say more
// reviews will move a listing. Keep distance out of the lead.
const FINDINGS = [
  {
    count: "35%",
    title: "The most-reviewed listings still show up for searchers 1 to 2 miles away.",
    detail: "At that distance, listings with over 1,000 reviews reached the top three about 35% of the time, against about 3 to 4% for those with 100 to 229.",
  },
  {
    count: "About 2x",
    title: "Listings with 350 to 599 reviews beat those with 230 to 349.",
    detail: "They had about twice the odds of a top-three spot in the same search.",
  },
  {
    count: "84%",
    title: "Showing as closed doesn't keep a listing out of the evening top three.",
    detail: "At 7:39pm in Houston, 84% of top-three spots went to listings showing as closed, when nearly every office is closed.",
  },
];

export default function DentalPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Dental clinics" />}
        title="One patient has a toothache at 7am, and a new family is looking on Saturday."
        subhead="Both of them can read how you answer your last unhappy patient."
        lead="The first needs to be seen today, and the second reads your reviews first. Federal privacy law limits what your reply can say."
      >
        <TradeArrow />
      </PageHero>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>It hurts now</H3>
            <SearchChips className="mt-4" searches={["emergency dentist near me", "dentist open today", "dentist open saturday"]} />
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-7">
            <H3>They need a new dentist</H3>
            <SearchChips className="mt-4" searches={["family dentist", "dentist that takes my insurance", "kids dentist"]} />
          </div>
        </div>
        <p className="mt-8 max-w-3xl font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-snug tracking-tight text-[var(--color-ink)] font-medium">
          A missed call here costs more than one filling, because a new patient means
          cleanings and recalls for years, the crown you catch at an exam and often the
          rest of the household.
        </p>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Your reviews</Eyebrow>
          <H2 className="mt-4">The sentence that gets practices fined.</H2>
        </div>
        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <figure className="min-w-0 rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8">
            <blockquote className="text-lg text-[var(--color-ink)] leading-relaxed">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] font-medium">A review</p>
              <p className="mt-2">&ldquo;They rushed my crown and it still hurts.&rdquo;</p>
            </blockquote>
            <div className="mt-6 rounded-xl border border-[#B3261E]/30 bg-[#B3261E]/[0.05] p-4">
              <p className="text-sm font-medium text-[#B3261E]">This reply confirms they&apos;re your patient</p>
              <p className="mt-1.5 text-[var(--color-ink)] leading-relaxed">
                &ldquo;We&apos;re sorry about your crown. Our records show you skipped your
                follow-up visit.&rdquo;
              </p>
            </div>
            <div className="mt-3 rounded-xl border border-[#2E9E5B]/30 bg-[#2E9E5B]/[0.07] p-4">
              <p className="text-sm font-medium text-[#1F7A45]">This reply doesn&apos;t</p>
              <p className="mt-1.5 text-[var(--color-ink)] leading-relaxed">
                &ldquo;We take every comment seriously, and privacy rules keep us from
                discussing anyone&apos;s care here. Please call the office and ask for
                the manager.&rdquo;
              </p>
            </div>
            <figcaption className="mt-4 text-sm text-[var(--color-ink-soft)]">
              These are invented examples. You sign off on the real wording once, at the start.
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
              make the same mistake faster, so a person approves every dental reply before
              it posts.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <Findings
          eyebrow="What our dental scans show"
          title="Dental listings with more reviews reach the top three more often."
          items={FINDINGS}
          basis="From our own phone searches from set spots. The first two are daytime scans in Houston (12 October 2026) and Dallas (15 October 2026), and the twice-the-odds pattern also shows in San Antonio (4 November 2026). The evening figure is one Houston scan, Wednesday 30 September 2026. Each figure compares different practices at the time of the scan."
        />
      </Section>

      <Section narrow band>
        <Eyebrow>Your Google listing</Eyebrow>
        <H2 className="mt-4 md:text-4xl">Three things worth checking this week.</H2>
        <ol className="mt-8 space-y-6">
          <li>
            <p className="font-medium text-[var(--color-ink)]">Who the listing belongs to</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              Dentists who share an office share one profile for the practice, and any dentist
              with a profile of their own lists only their name.{cite(S.guidelines)}
            </p>
          </li>
          <li>
            <p className="font-medium text-[var(--color-ink)]">Hours the desk answers</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              List the hours someone picks up, and confirm holiday hours even when they
              don&apos;t change, as Google suggests.{cite(S.hours)}
            </p>
          </li>
          <li>
            <p className="font-medium text-[var(--color-ink)]">Insurance in plain words</p>
            <p className="mt-1 text-[var(--color-ink-soft)] leading-relaxed">
              List the plans you take on your site, and keep the list current.
            </p>
          </li>
        </ol>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <H2>What we do for a dental practice, and in what order.</H2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2 items-start">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3>First: your listing and your reviews</H3>
            <p className="mt-4 font-medium text-[var(--color-ink)]">{SEO_REVIEWS.name}, set up this way</p>
            {/* TODO(Blake): confirm the tool can exclude chosen pages, and get the vendor's
                written answer on a privacy contract before connecting any dental listing
                (search-atlas.md section 7). This box is only true once both are done. The
                review request system also needs a tool whose maker signs a privacy contract,
                and none is chosen. Your only live lead is a dental practice. */}
            <DotList
              className="mt-3"
              items={[
                "A dentist signs off on any claim in a post before it goes up.",
                "Any tools we add to your website stay off patient logins, booking and intake pages.",
                "Review requests go through a tool whose maker signs a privacy contract.",
              ]}
            />
            <p className="mt-6 font-medium text-[var(--color-ink)]">{ADS.search.name}, with your state&apos;s ad rules checked first</p>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas says a trade-name ad must prominently name the owners and at least
              one dentist practicing there,{cite(S.tx10852)}{" "}and an ad line is 30 characters.
              We don&apos;t run ads that follow past visitors, and no patient list ever leaves
              your practice, because we treat dental as covered by Google&apos;s health rule
              for personalized ads.{cite(S.healthAds)}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-8">
            <H3>Then: the AI Voice Receptionist and Lead Nurture SMS</H3>
            {/* TODO(Blake): no HIPAA program is on file. A risk review, policies, training,
                a breach plan and signed agreements at every link come before any of this.
                The vendor note says to refer dental to a dental voice product. */}
            <p className="mt-4 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              These tools touch patient information, so none of them starts until a privacy
              program is in place and you, we and each vendor have signed an agreement.{cite(S.ba)}{" "}
              Reminders are allowed without a patient&apos;s authorization, but a sales
              follow-up isn&apos;t a reminder.{cite(S.reminders)}
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-3">
          <div>
            <H3 className="md:text-xl">&ldquo;Best&rdquo;, &ldquo;#1&rdquo;, &ldquo;pain-free&rdquo;</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas bars dental ads that imply superior services, make comparisons that
              can&apos;t be backed up, guarantee success or claim work without pain, so we
              write around those words.{cite(S.tx10857)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Showing off your reviews</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas limits testimonials to patients of record, with disclosures, so your
              reviews stay on Google unless you clear them for your site.{cite(S.tx10857)}
            </p>
          </div>
          <div>
            <H3 className="md:text-xl">Keeping your ads</H3>
            <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Texas wants copies of electronic ads kept for 4 years from when they last
              ran, so the copies live in your own Drive.{cite(S.tx10860)}
            </p>
          </div>
        </div>
      </Section>

      <TradeClose sources={SOURCES} />
    </>
  );
}
