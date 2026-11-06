import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SampleDevices } from "@/components/device-frame";
import { JsonLd } from "@/components/json-ld";
import { ArrowLink, Container, DotList, Eyebrow, GetInTouch, H2, NumberBand, Section, Sources, citer } from "@/components/page-parts";
import { ServiceSample } from "@/components/service-samples";
import { cn } from "@/lib/cn";
import { SERVICE_PAGES, servicePageBySlug, type ServiceItem } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

/** Only the seven pages exist; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/services/${page.slug}` },
  };
}

const SITE_URL = "https://www.devize.ai";

// No Offer and no price field: nothing on these pages is for sale off a list.
function schemaFor(page: NonNullable<ReturnType<typeof servicePageBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.name,
    serviceType: page.serviceType,
    description: page.description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United States" },
    url: `${SITE_URL}/services/${page.slug}`,
  };
}

function Check() {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-surface-raised)] text-[var(--color-brand)]">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5l3 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

/**
 * One route, seven pages: why it matters, numbers where the claim bank has one that fits,
 * what we do, how it runs and what we need. These are parts of one plan, not things to buy,
 * so no price prints and no page offers the other six as a row to choose from (Blake, 5 Nov
 * 2026). All seven end on the same small close. Each page has its own heads and its own
 * invented example. The words and figures are in src/lib/services.ts.
 */
export default async function ServicePageRoute({ params }: Props) {
  const { slug } = await params;
  const page = servicePageBySlug(slug);
  if (!page) notFound();

  const cite = citer(page.sources);
  const counted = page.get.every((item) => item.count);
  const sampleBeside = page.sample?.place === "beside";

  const item = (entry: ServiceItem) => (
    <>
      {entry.detail}
      {entry.sources && cite(...entry.sources)}
    </>
  );

  return (
    <>
      <section>
        <div className="relative isolate h-[13rem] overflow-hidden bg-[var(--color-navy)] md:h-[25rem]">
          <Image src="/hero-bg.jpg" alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-10 scale-[1.12] object-cover" />
        </div>
        <Container className="relative z-10 -mt-20 md:-mt-52">
          <div className="on-navy grid grid-cols-1 gap-7 bg-[var(--color-panel)] px-6 py-9 md:px-14 md:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="min-w-0">
              <p className="text-[1.0625rem] font-bold leading-snug text-white">
                <Link href="/what-we-do" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  What We Do
                </Link>{" "}
                / {page.stage}
              </p>
              <h1 className="reveal mt-3 font-[family-name:var(--font-display)] text-[clamp(2.25rem,11vw,2.625rem)] leading-[1.05] text-white md:text-[3.5rem]">{page.name}</h1>
            </div>
            <div className="min-w-0">
              <p className="text-[1.375rem] font-extrabold leading-snug tracking-[-0.025em] text-white [text-wrap:balance] md:text-[1.75rem]">{page.pitchHead}</p>
              <p className="mt-4 leading-relaxed text-white/90">{page.pitch}</p>
              <ArrowLink href="/#contact" tone="light" className="mt-7">
                Get in touch
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      <div className="pt-14 md:pt-20">
        <Section band>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <H2>{page.why.head}</H2>
            </div>
            <div className="min-w-0">
              <div className="space-y-4 leading-relaxed text-white/90">
                {page.why.body.map((para) => (
                  <p key={para.text}>
                    {para.text}
                    {para.sources && cite(...para.sources)}
                  </p>
                ))}
              </div>
              {page.why.caption && <p className="mt-3 text-sm leading-relaxed text-white/75">{page.why.caption}</p>}
            </div>
          </div>
          {page.sample?.place === "why" && (
            <div className="mt-12">
              <ServiceSample kind={page.sample.kind} />
            </div>
          )}
          {page.why.checks && (
            <div className="mt-12 border-t border-[var(--color-border)] pt-9">
              <p className="text-[1.25rem] font-extrabold tracking-[-0.025em] text-white">What we check first, in any account</p>
              <ul className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-3">
                {page.why.checks.map((check, i) => (
                  <li key={check.text} className={cn("min-w-0 text-[0.95rem] leading-relaxed text-white/90 md:px-7", i === 0 ? "md:pl-0" : "md:border-l md:border-[var(--color-border)]")}>
                    {check.text}
                    {check.sources && cite(...check.sources)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      </div>

      {page.band && (
        <section aria-label="The numbers">
          <Container className="pt-14 md:pt-20">
            <NumberBand items={page.band.items} basis={page.band.basis} />
          </Container>
        </section>
      )}

      <Section id="the-work">
        <div className="max-w-3xl">
          <Eyebrow>What we do</Eyebrow>
          <H2 className="mt-3">{page.getHead}</H2>
        </div>
        {page.device ? (
          <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <ul className="min-w-0 space-y-7">
              {page.get.map((entry) => (
                <li key={entry.title} className="flex gap-4">
                  <Check />
                  <div className="min-w-0">
                    <p className="font-bold leading-snug text-[var(--color-ink)]">{entry.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{item(entry)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <SampleDevices />
          </div>
        ) : counted ? (
          <ul className="mt-12 grid grid-cols-1 lg:grid-cols-5">
            {page.get.map((entry, i) => (
              <li
                key={entry.title}
                className={cn(
                  "grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-3 border-t border-[var(--color-border)] py-6 lg:block lg:border-t-0 lg:py-0",
                  i === 0 ? "lg:pr-5" : "lg:border-l lg:px-5",
                  i === page.get.length - 1 && "lg:pr-0"
                )}
              >
                <span className="brand-text-gradient block font-[family-name:var(--font-display)] text-[3rem] leading-none lg:text-[4rem]">{entry.count}</span>
                <div className="min-w-0 lg:mt-3">
                  <p className="font-bold leading-snug text-[var(--color-ink)]">{entry.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">{item(entry)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : sampleBeside ? (
          <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <ul className="min-w-0 space-y-7">
              {page.get.map((entry) => (
                <li key={entry.title} className="flex gap-4">
                  <Check />
                  <div className="min-w-0">
                    <p className="font-bold leading-snug text-[var(--color-ink)]">{entry.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{item(entry)}</p>
                  </div>
                </li>
              ))}
            </ul>
            {page.sample && (
              <div className="min-w-0 lg:sticky lg:top-28">
                <ServiceSample kind={page.sample.kind} />
              </div>
            )}
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-2">
            {page.get.map((entry) => (
              <li key={entry.title} className="flex gap-4">
                <Check />
                <div className="min-w-0">
                  <p className="font-bold leading-snug text-[var(--color-ink)]">{entry.title}</p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">{item(entry)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {page.sample?.place === "below" && (
          <div className="mt-14">
            <ServiceSample kind={page.sample.kind} />
          </div>
        )}
        {page.getNote && (
          <p className="mt-10 max-w-3xl text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
            {page.getNote.text}
            {page.getNote.sources && cite(...page.getNote.sources)}
          </p>
        )}
      </Section>

      <Section id="how-it-runs" tint>
        <div className="max-w-3xl">
          <Eyebrow>How it runs</Eyebrow>
          <H2 className="mt-3">{page.stepsHead}</H2>
        </div>
        <ol className="mt-12 grid grid-cols-1 gap-y-10 lg:grid-cols-3">
          {page.steps.map((step, i) => (
            <li key={step.when} className={cn("min-w-0 lg:px-9", i === 0 ? "lg:pl-0" : "lg:border-l lg:border-[var(--color-border)]", i === page.steps.length - 1 && "lg:pr-0")}>
              <h3 className="flex items-center gap-3 text-[1.375rem] font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-panel)] text-base text-white">{i + 1}</span>
                {step.when}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {step.items.map((line) => (
                  <li key={line} className="text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                    {line}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="what-we-need">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <H2 className="min-w-0">{NUMBER_WORDS[page.need.length]} things we need from you.</H2>
          <div className="min-w-0">
            <DotList items={page.need} />
            {page.owns && (
              <div className="mt-12">
                <p className="text-[1.25rem] font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">Who owns what</p>
                <DotList className="mt-5" items={page.owns} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--color-border)] pt-9">
          <ArrowLink href="/what-we-do">See how we work</ArrowLink>
        </div>

        {page.sources.length > 0 && (
          <div className="mt-14">
            <Sources items={page.sources} />
          </div>
        )}
      </Section>

      <GetInTouch />

      <JsonLd data={schemaFor(page)} />
    </>
  );
}
