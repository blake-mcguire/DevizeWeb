import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { loadAuditPage } from "@/lib/audit-page";
import { sentCookieName } from "@/lib/audit-validate";
import AuditForm from "./audit-form";
import ViewBeacon from "./view-beacon";
import { copy, type ErrorCode } from "./copy";

/**
 * /a/<token>: one prospect's own page, linked from their cold email.
 *
 * Everything on it comes from audits/<token>/page.json, which the pipeline
 * writes before the email goes out. The page asks for a name and a mobile
 * only; the business, its email and its audit are already known from the
 * token. Missing, malformed and expired tokens all get the same 404.
 */

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// The map's own pin colours (grid_map.py COLOURS), so the counts match the picture.
const BAND_DOT = { top3: "#2E9E5B", mid: "#E0A500", absent: "#8E8A80" } as const;

export default async function AuditPage({ params, searchParams }: Props) {
  const { token } = await params;
  const page = await loadAuditPage(token);
  if (!page) notFound();

  const sp = await searchParams;
  const bounced = typeof sp.e === "string" && sp.e in copy.errors ? (sp.e as ErrorCode) : null;
  const sent = (await cookies()).get(sentCookieName(token))?.value === "1";

  const f = {
    pins: page.pins,
    keyword: page.keyword,
    place_noun: page.place_noun,
    top3: page.top3,
    mid: page.mid,
    absent: page.absent,
    business: page.business,
  };
  const cols = copy.tableColumns(page.place_noun);
  const bands = [
    { key: "top3", n: page.top3 },
    { key: "mid", n: page.mid },
    { key: "absent", n: page.absent },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-6 pt-6 pb-16 lg:pt-10">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 lg:items-start">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-ink-muted)] font-medium">
            {page.business}
            {page.city ? ` · ${page.city}` : ""}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[1.7rem] sm:text-4xl leading-[1.15] tracking-tight font-medium text-[var(--color-ink)]">
            {copy.headline(f)}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{copy.byline(page)}</p>
          <a
            href="#get"
            className="lg:hidden mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] underline underline-offset-4"
          >
            {copy.jumpToForm}
            <span aria-hidden="true">↓</span>
          </a>

          <figure className="mt-6">
            {page.map_url ? (
              // A plain <img>: the map is one fixed-size PNG on the Blob store, and
              // next/image would add a remote-host config and an optimizer hop for nothing.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.map_url}
                width={560}
                height={450}
                alt={copy.mapAlt(f)}
                loading="eager"
                fetchPriority="high"
                className="block w-full h-auto rounded-xl border border-[var(--color-border)] bg-white"
              />
            ) : (
              <p className="text-sm text-[var(--color-ink-soft)]">{copy.mapMissing}</p>
            )}
            <figcaption className="mt-4">
              <dl className="grid grid-cols-3 gap-2">
                {bands.map((b) => (
                  <div
                    key={b.key}
                    className="flex flex-col-reverse justify-end rounded-xl bg-white/70 border border-[var(--color-border)] px-3 py-2.5"
                  >
                    {/* dt before dd for screen readers; flex-col-reverse puts the number on top so the three line up. */}
                    <dt className="mt-1 flex items-start gap-1.5 text-[0.7rem] leading-snug text-[var(--color-ink-soft)]">
                      <span
                        aria-hidden="true"
                        className="mt-[0.2rem] inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ background: BAND_DOT[b.key] }}
                      />
                      {copy.bands[b.key]}
                    </dt>
                    <dd className="font-[family-name:var(--font-display)] text-xl font-medium text-[var(--color-ink)]">
                      {b.n}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{copy.legend(f)}</p>
            </figcaption>
          </figure>

          {page.rows.length > 0 && (
            <section className="mt-10">
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight font-medium text-[var(--color-ink)]">
                {copy.tableHeading}
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[var(--color-ink-muted)]">
                      <th scope="col" className="py-2 pr-2 font-medium">{cols.name}</th>
                      <th scope="col" className="py-2 px-2 font-medium text-right">{cols.stars}</th>
                      <th scope="col" className="py-2 px-2 font-medium text-right">{cols.reviews}</th>
                      <th scope="col" className="py-2 pl-2 font-medium text-right">{cols.top3}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.rows.map((r, i) => (
                      <tr
                        key={i}
                        className={
                          r.me
                            ? "border-t border-[var(--color-ink)]/25 font-semibold text-[var(--color-ink)]"
                            : "border-t border-[var(--color-border)] text-[var(--color-ink-soft)]"
                        }
                      >
                        <th scope="row" className={`py-2.5 pr-2 text-left align-top ${r.me ? "font-semibold" : "font-normal"}`}>
                          {r.me ? copy.youPrefix : ""}
                          {r.name}
                        </th>
                        <td className="py-2.5 px-2 text-right align-top tabular-nums">
                          {r.rating === null ? "-" : r.rating.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 text-right align-top tabular-nums">{r.reviews_display || "-"}</td>
                        <td className="py-2.5 pl-2 text-right align-top tabular-nums whitespace-nowrap">
                          {copy.top3Cell(r.top3, page.pins)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {page.typical_line && (
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">{page.typical_line}</p>
              )}
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight font-medium text-[var(--color-ink)]">
              {copy.coverHeading}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {copy.coverBullets(page.place_noun).map((b) => (
                <li key={b} className="flex gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink)]">
                  <span className="brand-dot mt-[0.55rem] shrink-0" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside id="get" className="mt-10 lg:mt-0 lg:sticky lg:top-6 scroll-mt-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-6 shadow-[0_10px_30px_-18px_rgba(28,42,57,0.35)]">
            <AuditForm
              token={token}
              personaFirst={page.persona_first}
              initialLinks={sent ? { audit: page.audit_pdf_url, plan: page.plan_pdf_url } : null}
              initialError={sent ? null : bounced}
            />
          </div>
        </aside>
      </div>
      <ViewBeacon token={token} />
    </div>
  );
}
