import { Crumb, TradeClose } from "@/components/industries/shared";
import { Eyebrow, H2, H3, PageHero, SearchChips, Section, citer, type Source } from "@/components/page-parts";
import { S } from "@/lib/industries";
import { BOOKING_OS } from "@/lib/offer-copy";
import { GOOGLE_ADS, PRICE } from "@/lib/tiers";

// In the order the page first cites them.
const SOURCES: Source[] = [S.tx801, S.contribution, S.guidelines, S.tx57330, S.fcc];
const cite = citer(SOURCES);

const THREE_PLACES = [
  {
    place: "Your listing",
    line: "Hours that are true, and a line in your description: \"After hours, we send emergencies to [clinic name].\"",
  },
  {
    place: "Your site",
    line: "A short emergency page: what you see, what you don't, where to go instead, with the address and the number.",
  },
  {
    place: "Your phone message",
    line: "The first sentence: \"If this is an emergency, call [clinic name] at [number].\" Your hours can come after.",
  },
];

export default function VeterinaryPage() {
  return (
    <>
      <PageHero
        eyebrow={<Crumb name="Veterinary clinics" />}
        title="The dog ate something at 9pm."
        lead="The owner is scared and on a phone. If you see emergencies, they need to know now. If you don't, the kindest thing your listing can do is say where to go instead."
      />

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>After hours</Eyebrow>
          <H2 className="mt-4">Say the same thing in three places.</H2>
          <SearchChips className="mt-5" searches={["emergency vet near me", "vet open now", "24 hour vet", "dog ate chocolate", "cat not eating vet"]} />
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {THREE_PLACES.map((row) => (
            <li key={row.place} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <H3 className="md:text-xl">{row.place}</H3>
              <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">{row.line}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 max-w-3xl text-sm text-[var(--color-ink-soft)] leading-relaxed">
          Example wording, for your own words and the clinic you really send people to. If
          you do see emergencies, say so, and say until when.
        </p>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>What a first call is worth</Eyebrow>
            <p className="mt-4 font-[family-name:var(--font-display)] text-2xl md:text-[2rem] leading-snug tracking-tight text-[var(--color-ink)] font-medium">
              A new kitten is shots, a spay, dentals and a long run of checkups. Then the
              hardest appointment of all, which people never forget. Then, often, the next
              pet.
            </p>
            <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Miss the first call and that whole stretch of years starts at someone
              else&apos;s clinic. A new pet, a move, or a bill that made them look around:
              these people read how you treat animals and how you explain a charge.
            </p>
          </div>
          <div className="min-w-0">
            <H3 className="md:text-xl">What they type</H3>
            <SearchChips className="mt-4" searches={["vet near me", "puppy shots cost", "spay and neuter near me", "cat friendly vet", "exotic pet vet"]} />
          </div>
        </div>
      </Section>

      <Section narrow>
        <Eyebrow>Your reviews</Eyebrow>
        <H2 className="mt-4">Some of them are written in grief.</H2>
        <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          A template has no business answering those. We&apos;d draft something short and
          kind, and send it to you before anything goes up.
        </p>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          The rest of your replies have a limit too. Texas law says a veterinarian
          &ldquo;may not violate the confidential relationship&rdquo; with a client,{cite(S.tx801)}{" "}
          so a reply doesn&apos;t discuss the animal&apos;s care or the bill, even when the
          review does. Other states have their own rules.
        </p>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          And if you ever start asking clients for reviews, nothing should go out the day
          after a pet was put to sleep. You can set that exception. It can&apos;t turn into
          asking only the happy clients, which Google bars.{cite(S.contribution)}
        </p>
      </Section>

      <Section band>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <Eyebrow>Your Google listing</Eyebrow>
            <H3 className="mt-4 md:text-[1.75rem]">Three things a category can&apos;t say.</H3>
            <ul className="mt-6 space-y-5">
              <li>
                <p className="font-medium text-[var(--color-ink)]">Which animals you see</p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  A category won&apos;t tell someone you see rabbits, or only cats, and Google
                  says not to use categories that way.{cite(S.guidelines)}{" "}Your description and
                  your page can.
                </p>
              </li>
              <li>
                <p className="font-medium text-[var(--color-ink)]">Grooming and boarding</p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  Google allows a separate profile only for a department that works as its own
                  public-facing business, usually with its own entrance.{cite(S.guidelines)}{" "}A
                  grooming table in the back probably isn&apos;t one.
                </p>
              </li>
              <li>
                <p className="font-medium text-[var(--color-ink)]">The name on the building</p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-ink-soft)] leading-relaxed">
                  If the clinic changed hands or names, your listing should say what&apos;s on
                  the sign today.
                </p>
              </li>
            </ul>
          </div>
          <div className="min-w-0 rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <Eyebrow>Which tier fits</Eyebrow>
            <H3 className="mt-3 md:text-[1.75rem]">Tier 1 fits as it stands.</H3>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              At {PRICE.display}{" "}a month you get your site, your posts, your replies and your
              map. Google Ads is available at {GOOGLE_ADS.display}{" "}a month plus ad spend paid
              to Google. Claims stay
              inside the board&apos;s rule: it bars guarantees of satisfaction or a cure, claims
              of better quality the public can&apos;t reasonably verify, and calling yourself a
              specialist unless you&apos;re board certified through the AVMA.{cite(S.tx57330)}
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              {BOOKING_OS}{" "}is a closer call. HIPAA is about people&apos;s health, as we read it,
              so what holds back dental clinics doesn&apos;t apply the same way. The Texas
              confidentiality rule still does, so a lawyer should answer before any vendor holds
              your client records. Ask us, and expect that question first.
            </p>
            <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
              A voice agent would never judge how sick an animal is. It gives the emergency
              clinic&apos;s name and number, as you supply them, and takes a message. Texts to
              past clients need a consent record for each number and a lawyer&apos;s OK.{cite(S.fcc)}
            </p>
          </div>
        </div>
      </Section>

      <div className="pt-14">
        <TradeClose
          sources={SOURCES}
          title="Look up your own clinic at 9pm."
          body="See what a scared owner sees, then ask us for the audit. We haven't scanned vet clinics yet, so the rival comparison waits until we have the data. We'll tell you what we can show you today."
        />
      </div>
    </>
  );
}
