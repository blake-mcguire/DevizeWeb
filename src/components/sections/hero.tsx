import { Button } from "@/components/ui/button";

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
      {/* Left-to-right darkening overlay, purple-tinted to blend with the image, strongest where text sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,4,32,0.94) 0%, rgba(10,4,32,0.78) 30%, rgba(10,4,32,0.40) 60%, rgba(10,4,32,0.10) 90%)",
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


      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-28 md:pt-40 md:pb-36">
        <div className="max-w-3xl">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1 text-xs font-medium text-white/80">
            <span className="brand-dot" aria-hidden="true" />
            Local SEO and AEO for local service businesses
          </div>

          <h1 className="reveal mt-6 font-[family-name:var(--font-display)] text-4xl md:text-6xl leading-[1.05] tracking-tight text-white font-medium">
            Your prospects are searching for your services,{" "}
            <br className="hidden md:block" />
            <span className="text-[var(--color-brand-end)]">but are they finding you?</span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-lg text-white/70 leading-relaxed">
            When someone near you searches for what you do, Google shows a
            short list on its map, and AI assistants like ChatGPT name just a
            few. Devize does the local SEO and AEO work to get your business on
            those lists.
          </p>

          <div className="reveal mt-8 flex flex-col sm:flex-row gap-3">
            <Button href="/#contact" size="lg">
              Get my free map audit
            </Button>
            <Button href="/#how-it-works" size="lg" variant="glass">
              See how it works
            </Button>
          </div>

          <p className="reveal mt-5 text-sm text-white/70">
            Or email{" "}
            <a
              href="mailto:admin@devize.ai"
              className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
            >
              admin@devize.ai
            </a>
          </p>
          <p className="reveal mt-2 text-xs text-white/55">
            No logins, nothing to sign. Devize is independent and does not work
            for Google.
          </p>
        </div>
      </div>
    </section>
  );
}
