import type { NextRequest } from "next/server";
import { auditFile, loadAuditPage } from "@/lib/audit-page";
import { sentCookieName, validToken } from "@/lib/audit-validate";
import { openStream } from "@/lib/blob-store";
import { attachmentHeader } from "@/lib/download-name";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * GET /api/audit-file?token=<t>
 *
 * The page's one PDF (audits/<token>/plan.pdf: the audit, then the plan when
 * it travels), streamed from the Blob store as a download named
 * "<Business> - Google Map Audit and Plan.pdf" (or "... Google Map Audit.pdf").
 *
 * Only for a browser that has sent this token's form (the cookie
 * /api/audit-request sets); without it, and for an unknown, expired or
 * not-yet-built page, the same plain 404. Never cached by anything shared.
 *
 * &part=plan is a round-1 page's separate plan.pdf.
 */

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!validToken(token)) return notFound();
  if (req.cookies.get(sentCookieName(token))?.value !== "1") return notFound();
  if (!allow(`file|${clientIp(req.headers)}|${token}`, 30)) {
    return new Response("Too many requests", { status: 429, headers: { "Cache-Control": "no-store" } });
  }

  const page = await loadAuditPage(token);
  if (!page) return notFound();
  const part = req.nextUrl.searchParams.get("part") === "plan" ? "plan" : "main";
  const file = await auditFile(page, { fresh: true, part });
  if (!file) return notFound();

  let blob: Awaited<ReturnType<typeof openStream>>;
  try {
    blob = await openStream(file.pathname);
  } catch (err) {
    console.error("[audit-file] read failed", err instanceof Error ? err.message : err);
    return new Response("Something went wrong", { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  if (!blob) return notFound();
  console.log("[audit-file] sent", file.pathname);

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": attachmentHeader(file.filename),
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
    "Referrer-Policy": "no-referrer",
  });
  if (blob.size) headers.set("Content-Length", String(blob.size));
  return new Response(blob.stream, { status: 200, headers });
}
