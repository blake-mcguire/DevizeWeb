import { Crumb, TradeArrow, TradeClose } from "@/components/industries/shared";
import { Eyebrow, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { SEO_REVIEWS } from "@/lib/menu";

// In the order the page first cites them.
const SOURCES: Source[] = [S.tx801, S.contribution, S.guidelines, S.tx57330, S.fcc];
const cite = citer(SOURCES);

const THREE_PLACES = [
  {
    place: "Your listing",
    line: "List hours that are true, and add a line to your description: \"After hours, we send emergencies to [clinic name].\"",
  },
  {
    place: "Your site",
    line: "Add a short emergency page that says what you see, what you don't and where to go instead, with the address and the number.",
  },
  {
    place: "Your phone message",
    line: "Make this the first sentence: \"If this is an emergency, call [clinic name] at [number].\" Your hours can come after.",
  },
];

export default function VeterinaryPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Veterinary clinics" />}
        title="The dog ate something at 9pm."
        subhead="The owner is scared and on a phone."
        lead="If you see emergencies, they need to know now. If you don't, the kindest thing your listing can do is say where to go instead."
      >
        <TradeArrow />
      </PageHero>

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>After hours</Eyebrow>
          <H2 className="mt-4">Say the same thing in three places.</H2>
          <SearchChips className="mt-5" searches={["emergency vet near me", "vet open now", "dog ate chocolate"]} />
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {THREE_PLACES.map((row) => (
            <li key={row.place} className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <H3 className="md:text-xl">{row.place}</H3>
              <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">{row.line}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 max-w-3xl text-sm text-[var(--color-ink-soft)] leading-relaxed">
          This is example wording. If you do see emergencies, say so, and say until when.
        </p>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>What a first call is worth</Eyebrow>
            <p className="mt-4 font-[family-name:var(--font-display)] text-2xl md:text-[2rem] leading-snug tracking-tight text-[var(--color-ink)] font-medium">
              A new kitten means shots, a spay, dentals and years of checkups, then the hardest
              appointment of all, and often the next pet.
            </p>
            <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Miss the first call and all of those years start at someone else&apos;s clinic.
            </p>
          </div>
          <div className="min-w-0">
            <H3 className="md:text-xl">What they type</H3>
            <SearchChips className="mt-4" searches={["puppy shots cost", "cat friendly vet", "exotic pet vet"]} />
          </div>
        </div>
      </Section>

      <Section narrow>
        <Eyebrow>Your reviews</Eyebrow>
        <H2 className="mt-4">Some of your reviews are written in grief.</H2>
        <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          For those we draft something short and kind, and send it to you before anything
          goes up.
        </p>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          Texas law says a veterinarian &ldquo;may not violate the confidential
          relationship&rdquo; with a client,{cite(S.tx801)}{" "}so no reply discusses the
          animal&apos;s care or the bill, even when the review does. Other states have their own rules.
        </p>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          Review requests shouldn&apos;t go out the day after a pet was put to sleep. You can
          set that exception, as long as it doesn&apos;t turn into asking only the happy
          clients, which Google bars.{cite(S.contribution)}
        </p>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your Google listing</Eyebrow>
            <H3 className="mt-4 md:text-[1.75rem]">Two things to get right on your listing.</H3>
            <ul className="mt-6 space-y-5">
              <li>
                <p className="font-medium text-[var(--color-ink)]">Which animals you see</p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  Google says not to use categories to say you see rabbits, or only cats,{cite(S.guidelines)}{" "}
                  so put that in your description and on your page.
                </p>
              </li>
              <li>
                <p className="font-medium text-[var(--color-ink)]">Grooming and boarding</p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  Google allows a separate profile only for a department that works as its own
                  public-facing business,{cite(S.guidelines)}{" "}and a grooming table in the back
                  probably doesn&apos;t qualify.
                </p>
              </li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-[var(--color-border)] bg-white p-6 md:p-8">
            <H3 className="md:text-[1.75rem]">{SEO_REVIEWS.name} works here as it is.</H3>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              Any ads we write follow the Texas board&apos;s rule, which
              bars guarantees of satisfaction or a cure, claims of better quality the public
              can&apos;t reasonably verify, and calling yourself a specialist unless you&apos;re
              board certified through the AVMA.{cite(S.tx57330)}
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              HIPAA covers people&apos;s health and the Texas confidentiality rule covers your
              clients, so a lawyer signs off before any vendor holds your client records.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              The AI Voice Receptionist never judges how sick an animal is. It gives the emergency
              clinic&apos;s name and number, as you supply them, and takes a message. Texts to
              past clients need a consent record for each number.{cite(S.fcc)}
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
