"use client";

import { useRef, useState } from "react";
import type { Vsl } from "@/lib/vsl";
import { copy } from "./copy";

/**
 * The video between the question and the form.
 *
 * A file plays in the browser's own player behind one large play button (the
 * small native one is easy to miss on a phone); once it has started, the
 * native controls take over. An embed is the host's own player in an iframe.
 *
 * The /a/ pages send no referrer (the token is in the URL), but YouTube
 * refuses to play an embed without one, so the iframe sends the origin only:
 * "devize.ai", never the path.
 */

const FRAME: Record<Vsl["aspect"], string> = {
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5] max-w-md mx-auto",
  "9/16": "aspect-[9/16] max-w-sm mx-auto",
};

export default function VslPlayer({ vsl }: { vsl: Vsl & { src: string } }) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const frame = `relative w-full overflow-hidden rounded-2xl bg-[var(--color-ink)] shadow-[0_18px_40px_-24px_rgba(28,42,57,0.6)] ${FRAME[vsl.aspect]}`;

  if (vsl.kind === "embed") {
    return (
      <div className={frame}>
        <iframe
          src={vsl.src}
          title={vsl.title}
          loading="lazy"
          referrerPolicy="strict-origin"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <video
        ref={video}
        src={vsl.src}
        poster={vsl.poster ?? undefined}
        controls={started}
        playsInline
        preload="metadata"
        aria-label={vsl.title}
        onPlay={() => setStarted(true)}
        className="absolute inset-0 h-full w-full object-cover"
      >
        {vsl.captions && <track kind="captions" src={vsl.captions} srcLang="en" label="English" default />}
      </video>
      {!started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            void video.current?.play();
          }}
          className="group absolute inset-0 flex items-center justify-center bg-[var(--color-ink)]/25 focus-visible:outline-none"
        >
          <span className="sr-only">{copy.vslPlay}</span>
          <span
            aria-hidden="true"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] shadow-[0_10px_30px_-8px_rgba(51,0,153,0.7)] ring-4 ring-white/30 transition-transform group-hover:scale-105 group-focus-visible:ring-white motion-reduce:transition-none"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-white">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
