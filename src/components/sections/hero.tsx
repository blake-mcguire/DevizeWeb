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
            Revenue Recovery &amp; Retention for home services
          </div>

          <h1 className="reveal mt-6 font-[family-name:var(--font-display)] text-5xl md:text-7xl leading-[1.02] tracking-tight text-white font-medium">
            Answer every call.
            <br />
            Book every job.
            <br />
            <span className="text-[var(--color-brand-end)]">Keep every customer.</span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-lg text-white/70 leading-relaxed">
            Two systems for the shop that&apos;s slammed: Revenue Recovery
            answers every call in about two rings and books the job. Revenue
            Retention keeps the customers you already paid to win.
          </p>

          <div className="reveal mt-8 flex flex-col sm:flex-row gap-3">
            <Button href="/#contact" size="lg">
              Book a demo
            </Button>
            <Button href="/#how-it-works" size="lg" variant="glass">
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
