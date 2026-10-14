import { NextResponse, type NextRequest } from "next/server";
import { copy, type ErrorCode } from "@/app/a/[token]/copy";
import { auditFile, loadAuditPage } from "@/lib/audit-page";
import {
  FIELD_NAME,
  FIELD_TEL,
  SENT_COOKIE_MAX_AGE,
  auditFileUrl,
  cleanName,
  sentCookieName,
  usMobileE164,
  validToken,
} from "@/lib/audit-validate";
import { isoCompact, putJSON } from "@/lib/blob-store";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/audit-request  {token, name, tel}
 *
 * Validates, writes submissions/<iso>-<token>.json for the pipeline (which
 * builds the PDF if the page's first view has not already, alerts Blake,
 * stops the sequence and may email a copy), sets the cookie that lets this
 * browser download the file, and says whether the file is ready:
 *
 *   {ok: true, ready: true,  plan, file_url: "/api/audit-file?token=...", plan_url}
 *   {ok: true, ready: false, plan, file_url: null, plan_url: null}
 *
 * The page then downloads at once, or shows "Finishing ..." and polls
 * /api/audit-status. plan_url is a round-1 page's separate plan (else null).
 *
 * JSON in, JSON out for the page's script. A plain form post (no JavaScript)
 * gets a 303 back to the page instead, with ?e=<code> on an error; the cookie
 * set on success makes the page show the download (or the finishing state).
 * The number may come as "tel" (the field's name, so autofill fills it) or
 * "mobile" (round 1).
 */

type Body = { token?: unknown; name?: unknown; tel?: unknown; mobile?: unknown };

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

  const name = cleanName(body[FIELD_NAME]);
  if (!name) return fail("name", 400);
  const mobile = usMobileE164(body[FIELD_TEL] ?? body.mobile);
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

  let res: NextResponse;
  if (form) {
    res = NextResponse.redirect(new URL(`/a/${token}#get`, req.url), 303);
  } else {
    const file = await auditFile(page, { fresh: true });
    const plan = file ? await auditFile(page, { part: "plan" }) : null;
    res = NextResponse.json({
      ok: true,
      ready: !!file,
      plan: page.plan,
      file_url: file ? auditFileUrl(token) : null,
      plan_url: plan ? auditFileUrl(token, "plan") : null,
    });
  }
  res.headers.set("Cache-Control", "no-store");
  res.cookies.set(sentCookieName(token), "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SENT_COOKIE_MAX_AGE,
  });
  return res;
}
