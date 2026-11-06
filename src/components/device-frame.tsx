import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Our own CSS device frames around real screenshots of our own /sample-audit page. Its
 * business and numbers are invented, and the SAMPLE tag sits on the device itself, so a
 * screenshot of this can't read as a client result. To refresh the pictures, capture
 * /sample-audit again into public/img/sample-laptop.jpg and sample-phone.jpg.
 */
export function SampleDevices({ className, caption = true }: { className?: string; caption?: boolean }) {
  return (
    <figure className={cn("min-w-0", className)}>
      <div className="relative pr-[9%]">
        <div className="px-[4.5%]">
          <div className="rounded-t-[0.9rem] bg-[#1A1236] p-[1.8%] shadow-[0_30px_60px_-30px_rgba(18,7,57,0.55)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[0.25rem] bg-white">
              <Image
                src="/img/sample-laptop.jpg"
                alt="A sample on a laptop: a map of searches around an invented business, with the invented competitors that came up instead."
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="relative h-3.5 rounded-b-[0.9rem] bg-gradient-to-b from-[#D9D5E6] to-[#A7A1BC] md:h-4">
          <span className="absolute left-1/2 top-0 h-1.5 w-[16%] -translate-x-1/2 rounded-b-md bg-[#8F88A8]" />
        </div>
        <div className="absolute bottom-0 right-0 w-[23%] rounded-[1.1rem] bg-[#1A1236] p-[0.35rem] shadow-[0_24px_40px_-18px_rgba(18,7,57,0.6)] md:rounded-[1.5rem] md:p-2">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[0.8rem] bg-white md:rounded-[1.05rem]">
            <Image
              src="/img/sample-phone.jpg"
              alt="The same sample on a phone."
              fill
              sizes="(min-width: 1024px) 12vw, 25vw"
              className="object-cover object-top"
            />
          </div>
        </div>
        <span className="absolute right-[24%] top-[4.5%] rounded-full bg-[#B3261E] px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white shadow-md md:px-3 md:py-1 md:text-xs">
          Sample
        </span>
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          A sample: the business and the numbers are made up. Yours uses your real listing and your real competitors.
        </figcaption>
      )}
    </figure>
  );
}
