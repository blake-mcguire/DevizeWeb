import type { NextRequest } from "next/server";
import { mockFs } from "@/lib/blob-store";

/**
 * GET /blob-mock/<path>: serves a file from BLOB_MOCK_DIR, the local stand-in
 * for the public Blob store. Development only: a production build answers
 * 404 whatever the environment says (mockFs() is null there).
 */

const TYPES: Record<string, string> = {
  json: "application/json; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  txt: "text/plain; charset=utf-8",
};

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  if (process.env.NODE_ENV === "production") return notFound();
  const mock = await mockFs();
  if (!mock) return notFound();
  const { path: parts } = await ctx.params;
  // The mock accepts only [A-Za-z0-9_.-] segments, so nothing here needs decoding.
  const pathname = parts.join("/");
  let data: Uint8Array | null = null;
  try {
    data = await mock.readBytes(pathname);
  } catch {
    data = null;
  }
  if (!data) return notFound();
  const ext = pathname.slice(pathname.lastIndexOf(".") + 1).toLowerCase();
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
