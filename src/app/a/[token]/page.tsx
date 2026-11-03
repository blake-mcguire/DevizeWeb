import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { auditFile, filePlan as fileCarriesPlan, loadAuditPage } from "@/lib/audit-page";
import { auditFileUrl, sentCookieName } from "@/lib/audit-validate";
import { vslFor } from "@/lib/vsl";
import AuditForm, { type Initial } from "./audit-form";
import ViewBeacon from "./view-beacon";
import VslPlayer from "./vsl-player";
import { copy, type ErrorCode } from "./copy";

/**
 * /a/<token>: one prospect's own page, linked from their cold email.
 *
 * One simple page (Blake, 2026-11-03): his question, the answer from their
 * own searches, a video, then the form. Everything personal comes from
 * audits/<token>/page.json, which the pipeline writes before the email goes
 * out. The form asks for a name and a mobile only; the business and the
 * address the email went to show filled in from the token, never from the
 * query string. Missing, malformed and expired tokens all get the same 404.
 *
 * The PDF is built when the page is first opened (the view beacon asks for
 * it), so it is usually ready by the time the form is sent; when it is not,
 * the form waits for it (audit-form.tsx).
 */

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// No-JavaScript wait: a reload every 5 s, 24 times (the script's two minutes).
const NOSCRIPT_EVERY = 5;
const NOSCRIPT_TRIES = 24;

export default async function AuditPage({ params, searchParams }: Props) {
  const { token } = await params;
  const page = await loadAuditPage(token);
  if (!page) notFound();

  const sp = await searchParams;
  const bounced = typeof sp.e === "string" && Object.hasOwn(copy.errors, sp.e) ? (sp.e as ErrorCode) : null;
  const sent = (await cookies()).get(sentCookieName(token))?.value === "1";

  const f = { pins: page.pins, keyword: page.keyword, place_noun: page.place_noun, top3: page.top3 };
  // page.plan is false when the PDF will not carry the plan: every line that names it changes.
  const hasPlan = page.plan;
  // The one file carries the plan, unless this is a round-1 page (its plan is a second file).
  const filePlan = fileCarriesPlan(page);
  // Once this browser has sent the form, ask the store itself when page.json
  // (read through the CDN, up to a minute old) does not name the file yet: a
  // reload just after the download then shows "ready" with a link, never the
  // finishing state again (which would download it a second time; round 3).
  const ready = !!page.pdf_url || (sent && !!(await auditFile(page, { fresh: true })));
  // Without JavaScript nothing polls: while the file is being built the page
  // reloads itself every NOSCRIPT_EVERY seconds, counting in ?wait=, and says
  // what the script says after two minutes. (Each reload changes ?wait=: a
  // refresh to the same URL with a #fragment would not reload at all.)
  const waited = typeof sp.wait === "string" && /^\d{1,3}$/.test(sp.wait) ? Number(sp.wait) : 0;
  const initial: Initial = !sent
    ? null
    : ready
      ? {
          kind: "done",
          fileUrl: auditFileUrl(token),
          planUrl: page.legacy_plan_url ? auditFileUrl(token, "plan") : null,
        }
      : waited >= NOSCRIPT_TRIES
        ? { kind: "late" }
        : { kind: "finishing" };
  const nextCheck = `/a/${token}?wait=${waited + 1}#get`;
  const headline = copy.headline(page.keyword);
  const vsl = vslFor(page.trade);
  // Blake, 2026-11-03: "Get rid of the video Section for now." Off everywhere (local, preview and production) until
  // he asks for it back; the player and vsl.ts stay for then.
  const showVsl = false;

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-6 pt-6 pb-16 lg:pt-10">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-ink-muted)] font-medium">
        {page.business}
        {page.city ? ` · ${page.city}` : ""}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[1.9rem] sm:text-[2.75rem] leading-[1.08] tracking-tight font-medium text-[var(--color-ink)] text-balance">
        {/* The gradient is clipped to each line's box, so an italic letter at the end of a wrapped line loses its
            overhang; the cloned right padding gives every line, not only the last, room for it. */}
        {headline[0]}{" "}
        <em className="brand-text-gradient box-decoration-clone pr-[0.08em]">{headline[1]}</em>
        {headline[2]}{" "}
        <em className="brand-text-gradient box-decoration-clone pr-[0.08em]">{page.business}</em>
        {headline[3]}
      </h1>
      <p className="mt-4 text-[1.05rem] sm:text-lg leading-relaxed text-[var(--color-ink-soft)]">
        {copy.searched(f)} <strong className="font-semibold text-[var(--color-ink)]">{copy.result(f)}</strong>
      </p>
      {/* Only worth having with a video between here and the form. */}
      {showVsl && (
        <a
          href="#get"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] underline underline-offset-4"
        >
          {copy.jumpToForm(hasPlan)}
          <span aria-hidden="true">↓</span>
        </a>
      )}

      {showVsl && (
        <section className="mt-7" aria-label={vsl.title}>
          {vsl.src ? (
            <VslPlayer vsl={{ ...vsl, src: vsl.src }} />
          ) : (
            <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-ink)]/20 bg-white/50 px-6 text-center">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink)]/10"
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-[var(--color-ink)]/50">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
                </svg>
              </span>
              <p className="text-sm font-medium text-[var(--color-ink)]">{copy.vslMissing}</p>
              <p className="text-xs text-[var(--color-ink-soft)]">{copy.vslMissingHow}</p>
            </div>
          )}
        </section>
      )}

      <section id="get" className="mt-8 scroll-mt-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7 shadow-[0_10px_30px_-18px_rgba(28,42,57,0.35)]">
          <AuditForm
            token={token}
            personaFirst={page.persona_first}
            hasPlan={hasPlan}
            filePlan={filePlan}
            initial={initial}
            initialError={sent ? null : bounced}
          />
          {initial?.kind === "finishing" && (
            // Without JavaScript nothing polls: the page reloads itself
            // until the file is there, and the link does the same by hand.
            <noscript>
              <meta httpEquiv="refresh" content={`${NOSCRIPT_EVERY}; url=${nextCheck}`} />
              <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">{copy.finishingNoScript}</p>
              <a
                href={nextCheck}
                className="mt-4 inline-flex items-center text-sm font-medium text-[var(--color-brand)] underline underline-offset-4"
              >
                {copy.checkAgain}
              </a>
            </noscript>
          )}
        </div>
      </section>
      <ViewBeacon token={token} />
    </div>
  );
}
