import { Crumb, TradeArrow, TradeClose } from "@/components/industries/shared";
import { Eyebrow, H2, H3, PageHero, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { SEO_REVIEWS } from "@/lib/menu";

// In the order the page first cites them.
const SOURCES: Source[] = [S.tx704, S.aba496, S.txBar, S.guidelines, S.contribution, S.tx701, S.penal3812, S.florida241, S.tx705];
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
        subhead="People find a lawyer quietly."
        lead="It might be a DUI at 2am or a will someone has put off for years, and bar rules limit what your ads and review replies can say."
      >
        <TradeArrow />
      </PageHero>

      <Section narrow>
        <Eyebrow>Before we touch anything</Eyebrow>
        <H2 className="mt-4">Three questions we need answered first.</H2>
        <ol className="mt-10 space-y-10">
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-4xl font-medium leading-none tracking-tight">1</span>
            <div>
              <H3>Who signs off?</H3>
              <p className="mt-2 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                Tell us which state bars you&apos;re licensed under and who approves advertising,
                and anything we draft goes to that person first. Texas generally
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
                can&apos;t reveal client information to answer an online review and should
                seriously consider not responding, though a generic invitation to call is
                allowed.{cite(S.aba496)}{" "}States differ, so you set the rule, and if your rule
                is no reply, we don&apos;t reply.
              </p>
            </div>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
            <span className="brand-text-gradient font-[family-name:var(--font-display)] text-4xl font-medium leading-none tracking-tight">3</span>
            <div>
              <H3>Are you comfortable with how we charge?</H3>
              <p className="mt-2 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                Nothing we charge is tied to a signed case, because Texas generally prohibits
                paying non-lawyers to solicit or refer.{cite(S.txBar)}{" "}Our ad fees can rise with
                ad spend, and on Local Services Ads Google charges per lead, so your spend rises with
                your leads. We put that in writing before anything starts.
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
          list: <Searches items={["dui lawyer near me", "lawyer open now"]} />.
          A crash case could be your best file of the year, signed somewhere
          else by morning: <Searches items={["car accident lawyer"]} />.
        </p>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          Someone weighing a divorce or a will has time and wants to know what it costs:{" "}
          <Searches items={["divorce lawyer", "how much does a will cost"]} />.
          They may call back, or they may take your silence as your answer.
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your Google listing</Eyebrow>
            <H3 className="mt-4 md:text-[1.75rem]">What Google allows on a law firm&apos;s listing.</H3>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-medium text-[var(--color-ink)]">Firm profile, lawyer profile</dt>
                <dd className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  A lawyer who deals with the public and can be reached directly at a verified
                  location can have a profile. A solo lawyer under a firm brand shares one
                  profile named &ldquo;firm: lawyer&rdquo;. Nobody gets extra profiles for
                  practice areas.{cite(S.guidelines)}
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
                  Google says adding practice areas or towns to your name can lead to suspension,
                  unless that&apos;s the name in real life.{cite(S.guidelines)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0">
            <Eyebrow>Asking for reviews</Eyebrow>
            <H3 className="mt-4 md:text-[1.75rem]">Some clients don&apos;t want anyone to know they hired you.</H3>
            <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
              So review requests start only after you&apos;ve approved who gets asked and how,
              and they still can&apos;t go only to happy clients, which Google bars.{cite(S.contribution)}
            </p>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="max-w-2xl">
          <H2>{SEO_REVIEWS.name}, with your name on the sign-off.</H2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 items-start">
          <div className="min-w-0 space-y-4 text-[var(--color-ink-soft)] leading-relaxed">
            <p className="text-lg">
              Someone at the firm reads what goes up, and replies follow your rule.
            </p>
            <p>
              Texas Rule 7.01 bars false or misleading communications, and its comments warn
              about unjustified expectations of results and comparisons that can&apos;t be
              backed up, so we write around those.{cite(S.tx701)}
            </p>
          </div>
          <div className="min-w-0 rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-surface-raised)] p-6 md:p-7">
            <H3 className="md:text-xl">Voice and text start with your sign-off</H3>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              The AI Voice Receptionist and Lead Nurture SMS need the firm&apos;s written OK, and
              then they run inbound only, because Texas restricts telephone solicitation and using
              a non-lawyer doesn&apos;t avoid the rule.{cite(S.penal3812, S.txBar)}
            </p>
            <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
              Florida&apos;s advisory Opinion 24-1 says an intake chatbot must include a
              disclaimer,{cite(S.florida241)}{" "}and Texas Opinion 705 says lawyers can&apos;t rely
              blindly on AI output,{cite(S.tx705)}{" "}so the script says it&apos;s AI and not a
              lawyer, and you sign off on it.
            </p>
          </div>
        </div>
      </Section>

      <div className="pt-14">
        <TradeClose sources={SOURCES} />
      </div>
    </>
  );
}
