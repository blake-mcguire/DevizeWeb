import { NextResponse, type NextRequest } from "next/server";
import { copy, type ErrorCode } from "@/app/a/[token]/copy";
import { loadAuditPage } from "@/lib/audit-page";
import { cleanName, sentCookieName, usMobileE164, validToken } from "@/lib/audit-validate";
import { isoCompact, putJSON } from "@/lib/blob-store";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/audit-request  {token, name, mobile}
 *
 * Validates, writes submissions/<iso>-<token>.json for the pipeline (which
 * emails the copy, alerts Blake and stops the sequence), and returns the two
 * PDF links so the page can show them at once.
 *
 * JSON in, JSON out for the page's script. A plain form post (no JavaScript)
 * gets a 303 back to the page instead, with ?e=<code> on an error; the
 * cookie set on success makes the page show the buttons.
 */

type Body = { token?: unknown; name?: unknown; mobile?: unknown };

async function readBody(req: NextRequest): Promise<{ body: Body; form: boolean }> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    try {
      const fd = await req.formData();
      const body: Record<string, string> = {};
      for (const [k, v] of fd.entries()) if (typeof v === "string") body[k] = v;
      return { body, form: true };
    } catch {
      return { body: {}, form: true };
    }
  }
  try {
    const parsed: unknown = JSON.parse(await req.text());
    return { body: parsed && typeof parsed === "object" ? (parsed as Body) : {}, form: false };
  } catch {
    return { body: {}, form: false };
  }
}

export async function POST(req: NextRequest) {
  const { body, form } = await readBody(req);
  const token = body.token;

  const fail = (code: ErrorCode, status: number) => {
    if (form && validToken(token)) {
      return NextResponse.redirect(new URL(`/a/${token}?e=${code}#get`, req.url), 303);
    }
    return NextResponse.json({ ok: false, error: code, message: copy.errors[code] }, { status });
  };

  if (!validToken(token)) return fail("gone", 404);
  if (!allow(`req|${clientIp(req.headers)}|${token}`)) return fail("rate", 429);

  const page = await loadAuditPage(token);
  if (!page) return fail("gone", 404);

  const name = cleanName(body.name);
  if (!name) return fail("name", 400);
  const mobile = usMobileE164(body.mobile);
  if (!mobile) return fail("mobile", 400);

  const now = new Date();
  const pathname = `submissions/${isoCompact(now)}-${token}.json`;
  try {
    await putJSON(
      pathname,
      {
        v: 1,
        token,
        name,
        mobile_e164: mobile,
        submitted_at: now.toISOString(),
        user_agent: (req.headers.get("user-agent") ?? "").slice(0, 400),
      },
      // Two sends in the same second are the same person double-tapping.
      { allowOverwrite: true },
    );
  } catch (err) {
    console.error("[audit-request] write failed", err instanceof Error ? err.message : err);
    return fail("server", 500);
  }
  console.log("[audit-request] stored", pathname);

  const res = form
    ? NextResponse.redirect(new URL(`/a/${token}#get`, req.url), 303)
    : NextResponse.json({
        ok: true,
        audit_pdf_url: page.audit_pdf_url,
        plan_pdf_url: page.plan_pdf_url,
      });
  res.cookies.set(sentCookieName(token), "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/a/${token}`,
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
