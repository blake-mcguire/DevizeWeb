import { AuditForm } from "@/components/audit-form";
import { FounderChip } from "@/components/founder";
import { SampleMapCard } from "@/components/sections/sample-audit";
import { cn } from "@/lib/cn";
import { EMAIL, PRICE } from "@/lib/offer-copy";

/**
 * The founder line and the price line, right by the audit call to action
 * (Blake, 2026-10-15). Inside the form card from lg up and once the form is
 * open; under the open button, on the dark hero, while it is closed on a phone.
 */
function ByTheButton({ tone }: { tone: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <FounderChip tone={tone} />
      <p
        className={cn(
          "text-sm leading-snug sm:max-w-[19rem] sm:text-right",
          dark ? "text-white/80" : "text-[var(--color-ink-soft)]"
        )}
      >
        <strong className={cn("font-semibold", dark ? "text-white" : "text-[var(--color-ink)]")}>
          {PRICE.headline}
        </strong>{" "}
        for the monthly work. {PRICE.term}
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden isolate"
      style={{
        backgroundColor: "#0A0420",
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Darkening overlay, purple-tinted to blend with the image. Stronger
          than before on the right too, now that the sample map sits there. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,4,32,0.95) 0%, rgba(10,4,32,0.85) 40%, rgba(10,4,32,0.60) 75%, rgba(10,4,32,0.45) 100%)",
        }}
      />

      {/* Soft top fade so the sticky header doesn't cut a hard line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,4,32,0.7) 0%, rgba(10,4,32,0) 100%)",
        }}
      />

      {/* Tight top padding (pass 2 review): the form, its button, the founder
          line and the price line all sit inside a 1366x657 laptop window, and
          the open button inside an iPhone SE's 375x548. */}
      <div className="relative mx-auto max-w-6xl px-6 pt-5 pb-14 md:pt-6 md:pb-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-10 items-start">
          <div>
            {/* Not on a phone: the paragraph under the tagline says the same,
                and the room goes to the founder and price lines by the button. */}
            <div className="reveal hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs font-medium text-white/90">
              <span className="brand-dot" aria-hidden="true" />
              Local SEO and AEO for local service businesses
            </div>

            {/* The wording is fixed (Blake). From lg up "but are they finding
                you?" gets its own line and the first half is balanced over
                two, since it is too long for one line at a hero size. */}
            <h1 className="reveal sm:mt-4 font-[family-name:var(--font-display)] text-[1.9rem] sm:text-5xl lg:text-[2.375rem] xl:text-[2.5rem] leading-[1.05] tracking-tight text-white font-medium">
              <span className="lg:block lg:text-balance">Your prospects are searching for your services,</span>{" "}
              <span className="lg:block text-[#A98BF5]">but are they finding you?</span>
            </h1>

            <p className="reveal mt-4 max-w-2xl text-[0.95rem] sm:text-base md:text-lg text-white/80 leading-normal sm:leading-relaxed">
              When someone near you searches for what you do, Google shows a
              short list on its map, and AI assistants like ChatGPT name just a
              few. Devize does the local SEO and AEO work that helps your
              business make those lists.
            </p>

            <AuditForm
              slotId="audit"
              source="hero"
              collapsible
              layout="hero"
              footer={<ByTheButton tone="light" />}
              closedFooter={<ByTheButton tone="dark" />}
              className="reveal mt-5"
            />

            <ul className="reveal mt-5 space-y-1.5 text-sm text-white/80 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                <span>
                  {PRICE.audit} No logins, nothing to sign. Devize is
                  independent and does not work for Google.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="brand-dot mt-[0.55em] shrink-0" aria-hidden="true" />
                <span>
                  Or email{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
                  >
                    {EMAIL}
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="reveal lg:mt-14">
            <SampleMapCard />
          </div>
        </div>
      </div>
    </section>
  );
}
