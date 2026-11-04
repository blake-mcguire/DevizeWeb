import { Crumb, TradeClose } from "@/components/industries/shared";
import { Eyebrow, H2, H3, PageHero, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { GOOGLE_ADS, PRICE } from "@/lib/tiers";

// In the order the page first cites them.
const SOURCES: Source[] = [S.tx704, S.aba496, S.txBar, S.guidelines, S.contribution, S.tx701, S.florida241, S.tx705, S.penal3812];
const cite = citer(SOURCES);

function Searches({ items }: { items: string[] }) {
  return (
    <span className="text-[var(--color-ink)]">
      {items.map((s, i) => (
        <span key={s}>
          <span className="whitespace-nowrap italic">{s}</span>
          {i < items.length - 1 ? ", " : ""}
        </span>
      ))}
    </span>
  );
}

export default function LawPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Law firms" />}
        title="Some of your callers will never tell anyone they called."
        lead="A DUI at 2am. A custody order. A will someone has put off for years. People find a lawyer quietly, and most of what a firm can say back, in a reply or an ad, answers to a bar rule first."
      />

      <Section narrow>
        <Eyebrow>Before we touch anything</Eyebrow>
        <H2 className="mt-4">Three questions we need answered first.</H2>
        <ol className="mt-10 space-y-10">
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-4xl font-medium leading-none tracking-tight">1</span>
            <div>
              <H3>Who signs off?</H3>
              <p className="mt-2 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                Which state bars are you licensed under, and who approves advertising at
                the firm? Anything we draft goes to that person first. Texas generally
                requires a lawyer to file an ad with the State Bar&apos;s Advertising Review
                Committee no later than 10 days after it runs, unless it&apos;s
                exempt.{cite(S.tx704)} You decide what gets filed.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-4xl font-medium leading-none tracking-tight">2</span>
            <div>
              <H3>What&apos;s your rule on review replies?</H3>
              <p className="mt-2 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                A 2021 American Bar Association ethics opinion says a lawyer generally
                can&apos;t reveal client information to answer an online review, and should
                seriously consider not responding at all. One allowed reply is a generic
                invitation to call.{cite(S.aba496)}{" "}States differ, so you set the rule. If
                your rule is no reply, Tier 1&apos;s replies stay off, and that&apos;s a fine
                answer.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-4xl font-medium leading-none tracking-tight">3</span>
            <div>
              <H3>Are you comfortable with how we charge?</H3>
              <p className="mt-2 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                A flat fee, and nothing tied to a lead or a signed case. Paying non-lawyers
                to solicit or refer is generally prohibited in Texas,{cite(S.txBar)}{" "}and we
                want no part of a structure that gets close to it.
              </p>
            </div>
          </li>
        </ol>
      </Section>

      <Section band narrow>
        <Eyebrow>What a missed call costs a firm</Eyebrow>
        <H2 className="mt-4 md:text-4xl">You never learn what it was.</H2>
        <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          A criminal matter needs someone tonight, and the caller keeps going down the
          list: <Searches items={["dui lawyer near me", "criminal defense attorney", "lawyer open now"]} />.
          A crash case could be the best file you&apos;d have had all year, signed somewhere
          else by morning: <Searches items={["car accident lawyer", "emergency custody lawyer"]} />.
        </p>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          The slow matters fail differently. Someone weighing a divorce or a will has
          time, and some worry, and they want to know what it costs:{" "}
          <Searches items={["estate planning attorney", "divorce lawyer", "how much does a will cost", "immigration lawyer consultation", "small business lawyer"]} />.
          They might call back. They might also take your silence as your answer.
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your Google listing</Eyebrow>
            <H3 className="mt-4 md:text-[1.75rem]">Three rules, one phone.</H3>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-medium text-[var(--color-ink)]">Firm profile, lawyer profile</dt>
                <dd className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  Google lets a lawyer who deals with the public, and can be reached
                  directly at a verified location, have a profile. A solo lawyer under a
                  firm brand shares one profile named &ldquo;firm: lawyer&rdquo;. Nobody
                  gets extra profiles for practice areas.{cite(S.guidelines)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-ink)]">An office Google will accept</dt>
                <dd className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  A rented mailing address you don&apos;t work from isn&apos;t eligible. A
                  co-working office needs clear signage, customers during business hours
                  and your own staff there.{cite(S.guidelines)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-ink)]">The firm&apos;s real name</dt>
                <dd className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  No practice areas or towns added, unless that&apos;s the name in real life.
                  Google says it can lead to suspension.{cite(S.guidelines)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--color-ink)]">Who picks up at 6pm</dt>
                <dd className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  A listing can&apos;t fix a phone nobody answers. If tonight is the moment
                  that matters to someone, what they get when they call matters as much as
                  where you show up.
                </dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0">
            <Eyebrow>Asking for reviews</Eyebrow>
            <H3 className="mt-4 md:text-[1.75rem]">Harder here than anywhere.</H3>
            <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
              Some clients don&apos;t want anyone to know they hired a lawyer. So any
              routine needs your OK on who gets asked and how. It still can&apos;t screen
              for happy clients, which Google bars.{cite(S.contribution)}{" "}None of this is
              in Tier 1 today, and we wouldn&apos;t start it without your say.
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <Eyebrow>Which tier fits</Eyebrow>
          <H2 className="mt-4">Tier 1, with your name on the sign-off.</H2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0 space-y-4 text-[var(--color-ink-soft)] leading-relaxed">
            <p className="text-lg">
              At {PRICE.display}{" "}a month, the useful parts are on-site fixes and blog posts
              that someone at the firm reads before they go up. Replies follow your rule.
            </p>
            <p>
              Google Ads is available at {GOOGLE_ADS.display}{" "}a month plus ad spend paid to
              Google. Your lawyer reviews the copy and any filing.
            </p>
            <p>
              Texas Rule 7.01 bars false or misleading communications, and its comments warn
              about unjustified expectations of results and comparisons that can&apos;t be
              backed up.{cite(S.tx701)}{" "}Your state&apos;s rules may differ. Your free audit
              won&apos;t show a rival comparison yet, because we haven&apos;t scanned law firms.
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border-2 border-dashed border-[#B3261E]/30 bg-white p-6 md:p-7">
            <H3 className="md:text-xl">Voice and text wait</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              The voice agent, missed-call text-back, speed-to-lead texts and follow-ups:
              none of these goes near a law firm until your own lawyer signs off in writing.
            </p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Florida&apos;s Opinion 24-1 says an intake chatbot must include a disclaimer,
              and warns about bots giving legal advice or creating a client relationship by
              accident.{cite(S.florida241)}{" "}It&apos;s advisory, and it&apos;s Florida. Texas
              Opinion 705 says lawyers can&apos;t rely blindly on AI output.{cite(S.tx705)}
            </p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              If your lawyer says yes, it would be inbound only. Texas restricts telephone
              solicitation, and using a non-lawyer doesn&apos;t avoid the rule.{cite(S.penal3812, S.txBar)}
            </p>
          </div>
        </div>
      </Section>

      <div className="pt-14">
        <TradeClose
          sources={SOURCES}
          title="Want to see what we'd look at?"
          body="Ask for the audit anyway. It's free, it reads only public pages, and it touches nothing of your clients'. We'll tell you up front what it can't show a law firm yet."
        />
      </div>
    </>
  );
}
