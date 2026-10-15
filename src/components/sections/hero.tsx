import { AuditForm } from "@/components/audit-form";
import { FounderChip } from "@/components/founder";
import { SampleMapCard } from "@/components/sections/sample-audit";
import { EMAIL, PRICE } from "@/lib/offer-copy";

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

      <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-12 md:pb-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12 items-start">
          <div>
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs font-medium text-white/90">
              <span className="brand-dot" aria-hidden="true" />
              Local SEO and AEO for local service businesses
            </div>

            <h1 className="reveal mt-5 font-[family-name:var(--font-display)] text-[2.25rem] sm:text-5xl lg:text-[2.75rem] xl:text-[3rem] leading-[1.05] tracking-tight text-white font-medium">
              Your prospects are searching for your services,{" "}
              <br className="hidden lg:block" />
              <span className="text-[#A98BF5]">but are they finding you?</span>
            </h1>

            <p className="reveal mt-5 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
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
              className="reveal mt-7"
            />

            <div className="reveal mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <FounderChip tone="dark" />
              <p className="text-sm text-white/80">
                Or email{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
                >
                  {EMAIL}
                </a>
              </p>
            </div>

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
                <span>{PRICE.ctaLine}</span>
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
