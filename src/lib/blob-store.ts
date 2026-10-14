import "server-only";

import { BlobNotFoundError, get, head, list as blobList, put } from "@vercel/blob";

/**
 * One storage layer for the audit funnel, shared by the page, the route
 * handlers and the dev-only /blob-mock route.
 *
 * The contract with the pipeline ("Devize Audit Scraper"), which writes and
 * reads the same relative pathnames:
 *
 *   audits/<token>/page.json        written by the pipeline, read here
 *   audits/<token>/map.png          written by the pipeline ahead of the email
 *   audits/<token>/plan.pdf         the ONE file handed over: the audit, then
 *                                   the plan when it travels. Built by the
 *                                   pipeline on the first view or submission,
 *                                   streamed here by /api/audit-file; page.json
 *                                   is then rewritten with pdf_url (2026-10-14,
 *                                   round 2)
 *   audits/<token>/audit.pdf        round 1 only (pages that still name it)
 *   submissions/<iso>-<token>.json  written here, read by the pipeline
 *   views/<iso>-<token>.json        written here, read by the pipeline (a view
 *                                   is also what asks for the PDF to be built)
 *   leads/<iso>-<rand>.json         written here (the homepage demo form)
 *
 * <iso> is isoCompact(): UTC, basic ISO 8601, to the second (20261014T153012Z).
 *
 * Production: a PUBLIC Vercel Blob store, fixed pathnames, no random suffix.
 * The 128-bit token in the path is the secret. Auth is BLOB_READ_WRITE_TOKEN,
 * which Vercel injects once a Blob store is connected to the project.
 *
 * Local: under `next dev`, when BLOB_MOCK_DIR is set, every call reads and
 * writes the same relative paths under that directory instead (blob-mock-fs),
 * and blobUrl() points at /blob-mock/<path>, which the dev server serves. A
 * production build never uses the mock, whatever the environment says: the
 * check below is on NODE_ENV, which the build inlines, so the filesystem code
 * is not even in the bundle.
 */

const SAFE_PATHNAME = /^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/;

/** Throws on anything that is not a plain relative path of safe segments. */
export function assertSafePathname(pathname: string): void {
  if (
    !SAFE_PATHNAME.test(pathname) ||
    pathname.split("/").some((seg) => seg === "." || seg === "..")
  ) {
    throw new Error(`blob-store: unsafe pathname ${JSON.stringify(pathname)}`);
  }
}

/** True when this process reads and writes BLOB_MOCK_DIR instead of Vercel Blob. */
export function isMock(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    !process.env.VERCEL &&
    !!process.env.BLOB_MOCK_DIR?.trim()
  );
}

type MockFs = typeof import("./blob-mock-fs");

/** The filesystem mock, or null. Only `next dev` can ever load it. */
export async function mockFs(): Promise<MockFs | null> {
  if (process.env.NODE_ENV === "production") return null;
  return isMock() ? import("./blob-mock-fs") : null;
}

/** UTC timestamp in basic ISO 8601, to the second: 20261014T153012Z. */
export function isoCompact(d: Date = new Date()): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
}

function storeId(): string | null {
  const explicit = process.env.BLOB_STORE_ID?.trim();
  if (explicit) return explicit.replace(/^store_/, "");
  // vercel_blob_rw_<storeId>_<secret>, the same split @vercel/blob uses.
  const rw = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!rw) return null;
  return rw.split("_")[3] || null;
}

/** The public URL of a pathname, or null when no store is configured. */
export function blobUrl(pathname: string): string | null {
  assertSafePathname(pathname);
  if (isMock()) return `/blob-mock/${pathname}`;
  const id = storeId();
  return id ? `https://${id}.public.blob.vercel-storage.com/${pathname}` : null;
}

/** Reads a JSON document. Null when it does not exist. Throws on bad JSON or a storage error. */
export async function getJSON<T = unknown>(pathname: string): Promise<T | null> {
  assertSafePathname(pathname);
  const mock = await mockFs();
  if (mock) {
    const text = await mock.readText(pathname);
    return text === null ? null : (JSON.parse(text) as T);
  }
  const res = await get(pathname, { access: "public" });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text()) as T;
}

/** Writes a JSON document at a fixed pathname. Returns its URL. */
export async function putJSON(
  pathname: string,
  data: unknown,
  { allowOverwrite = false }: { allowOverwrite?: boolean } = {},
): Promise<{ pathname: string; url: string }> {
  assertSafePathname(pathname);
  const body = JSON.stringify(data, null, 2) + "\n";
  const mock = await mockFs();
  if (mock) {
    await mock.writeText(pathname, body, allowOverwrite);
    return { pathname, url: `/blob-mock/${pathname}` };
  }
  const res = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return { pathname: res.pathname, url: res.url };
}

/**
 * Size and upload time of a blob, asked of the store itself rather than the
 * CDN (head(), not the public URL), so a file uploaded a moment ago is seen
 * at once. Null when there is no such blob. Throws on a storage error.
 */
export async function stat(pathname: string): Promise<{ size: number; uploadedAt: Date } | null> {
  assertSafePathname(pathname);
  const mock = await mockFs();
  if (mock) return mock.statFile(pathname);
  try {
    const res = await head(pathname);
    return { size: res.size, uploadedAt: res.uploadedAt };
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

/** A blob's bytes as a stream (for a route to pass straight on), or null when there is none. size only when exact. */
export async function openStream(
  pathname: string,
): Promise<{ stream: ReadableStream<Uint8Array>; size: number | null } | null> {
  assertSafePathname(pathname);
  const mock = await mockFs();
  if (mock) {
    const bytes = await mock.readBytes(pathname);
    if (!bytes) return null;
    const stream = new Response(new Uint8Array(bytes)).body;
    return stream ? { stream, size: bytes.byteLength } : null;
  }
  const res = await get(pathname, { access: "public" });
  if (!res || res.statusCode !== 200 || !res.stream) return null;
  // No size: the fetch underneath undoes any content-encoding, so the CDN's
  // content-length may not be the length of this stream.
  return { stream: res.stream as ReadableStream<Uint8Array>, size: null };
}

/**
 * The store pathname a URL in page.json points at (a public Blob URL of this
 * store, or the dev mock's /blob-mock/<path>), or null when it points
 * anywhere else.
 */
export function pathnameOfUrl(url: string): string | null {
  let pathname: string | null = null;
  if (url.startsWith("/blob-mock/")) {
    pathname = isMock() ? url.slice("/blob-mock/".length) : null;
  } else {
    try {
      const u = new URL(url);
      const id = storeId();
      if (u.protocol === "https:" && id && u.hostname === `${id}.public.blob.vercel-storage.com`.toLowerCase()) {
        pathname = decodeURIComponent(u.pathname.slice(1));
      }
    } catch {
      pathname = null;
    }
  }
  if (!pathname) return null;
  try {
    assertSafePathname(pathname);
  } catch {
    return null;
  }
  return pathname;
}

export type ListedBlob = { pathname: string; url: string; size: number; uploadedAt: Date };
export type ListResult = { blobs: ListedBlob[]; cursor?: string; hasMore: boolean };

/** Lists blobs whose pathname starts with `prefix`, in pathname order. */
export async function list(
  prefix: string,
  { limit = 1000, cursor }: { limit?: number; cursor?: string } = {},
): Promise<ListResult> {
  const mock = await mockFs();
  if (mock) {
    const all = await mock.listFiles(prefix);
    const start = cursor ? Number(cursor) || 0 : 0;
    const page = all.slice(start, start + limit);
    const blobs = page.map((b) => ({ ...b, url: `/blob-mock/${b.pathname}` }));
    const next = start + page.length;
    return next < all.length ? { blobs, cursor: String(next), hasMore: true } : { blobs, hasMore: false };
  }
  const res = await blobList({ prefix, limit, cursor });
  return {
    blobs: res.blobs.map((b) => ({
      pathname: b.pathname,
      url: b.url,
      size: b.size,
      uploadedAt: b.uploadedAt,
    })),
    cursor: res.cursor,
    hasMore: res.hasMore,
  };
}
