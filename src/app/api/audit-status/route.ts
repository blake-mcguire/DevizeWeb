import type { NextRequest } from "next/server";
import { auditFile, loadAuditPage } from "@/lib/audit-page";
import { validToken } from "@/lib/audit-validate";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * GET /api/audit-status?token=<t>  ->  {ready: boolean}
 *
 * Whether the page's PDF is built and can be downloaded. The page polls this
 * every 2 seconds, for up to 2 minutes, while it shows "Finishing ...".
 * Asks the store itself when page.json (read through the CDN) does not name
 * the file yet, so a PDF the Mac uploaded a moment ago counts at once.
 *
 * Unknown, malformed and expired tokens get the same 404 the page gives.
 */

const json = (ready: boolean, status = 200) =>
  Response.json(
    { ready },
    { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!validToken(token)) return json(false, 404);
  // 60 polls in two minutes is the page's own pace; leave room for a reload or two.
  if (!allow(`status|${clientIp(req.headers)}|${token}`, 150)) return json(false, 429);
  const page = await loadAuditPage(token);
  if (!page) return json(false, 404);
  const file = await auditFile(page, { fresh: true });
  return json(!!file);
}
