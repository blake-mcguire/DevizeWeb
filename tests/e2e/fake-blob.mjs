// A local stand-in for the Vercel Blob API and its public file host, backed by a directory. Test only.
// It answers the requests @vercel/blob 2.8.0 makes (read from the SDK's own source):
//   PUT  /api/?pathname=<p>        put()   headers x-allow-overwrite, x-add-random-suffix
//   GET  /api?url=<pathname|url>   head()
//   GET  /api?prefix=&limit=&cursor=   list()
//   GET  /_public/<pathname>       the public file host (requests are rerouted here by preload.mjs)
//   GET  /__log                    what it was asked, by operation
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const port = Number(process.argv[2]);
const root = path.resolve(process.argv[3]);
const STORE = "https://e2efakestore.public.blob.vercel-storage.com";
const SAFE = /^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/;
const log = { put: 0, head: 0, list: 0, get: 0, refused: 0 };

const fileOf = (pathname) => (SAFE.test(pathname) && !pathname.split("/").includes("..") ? path.join(root, pathname) : null);
async function walk(dir, out = []) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {}
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else out.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return out;
}
const record = async (pathname) => {
  const st = await stat(path.join(root, pathname));
  return {
    url: `${STORE}/${pathname}`,
    downloadUrl: `${STORE}/${pathname}?download=1`,
    pathname,
    size: st.size,
    uploadedAt: st.mtime.toISOString(),
    contentType: "application/json",
    contentDisposition: `inline; filename="${path.basename(pathname)}"`,
    cacheControl: "public, max-age=60",
    etag: `"${st.size}-${st.mtimeMs}"`,
  };
};

http
  .createServer((req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", async () => {
      const send = (status, obj) => {
        res.writeHead(status, { "content-type": "application/json" });
        res.end(JSON.stringify(obj));
      };
      const fail = (status, code, message) => {
        log.refused += 1;
        send(status, { error: { code, message } });
      };
      try {
        const url = new URL(req.url, "http://fake");
        if (url.pathname === "/__log") return send(200, log);
        if (url.pathname.startsWith("/_public/")) {
          log.get += 1;
          const file = fileOf(decodeURIComponent(url.pathname.slice("/_public/".length)));
          if (!file) return fail(404, "not_found", "Not found");
          try {
            const data = await readFile(file);
            res.writeHead(200, { "content-type": "application/json", "content-length": data.length });
            return res.end(data);
          } catch {
            res.writeHead(404, { "content-type": "text/plain" });
            return res.end("Not found");
          }
        }
        if (!url.pathname.startsWith("/api")) return fail(404, "not_found", "no such path on the fake");
        if (!/^Bearer vercel_blob_rw_e2efakestore_/.test(req.headers.authorization ?? "")) return fail(403, "forbidden", "no token");
        if (req.method === "PUT") {
          log.put += 1;
          const pathname = url.searchParams.get("pathname") ?? "";
          const file = fileOf(pathname);
          if (!file) return fail(400, "bad_request", "bad pathname");
          if (req.headers["x-add-random-suffix"] === "1") return fail(400, "bad_request", "the fake has no random suffix");
          const exists = await stat(file).then(() => true, () => false);
          if (exists && req.headers["x-allow-overwrite"] !== "1") {
            return fail(400, "bad_request", "This blob already exists, use allowOverwrite: true if you want to overwrite it.");
          }
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(file, Buffer.concat(chunks));
          return send(200, await record(pathname));
        }
        if (req.method === "GET" && url.searchParams.has("url")) {
          log.head += 1;
          let pathname = url.searchParams.get("url");
          if (pathname.startsWith("https://")) pathname = new URL(pathname).pathname.slice(1);
          const file = fileOf(pathname);
          const exists = file && (await stat(file).then((s) => s.isFile(), () => false));
          return exists ? send(200, await record(pathname)) : fail(404, "not_found", "The requested blob does not exist");
        }
        if (req.method === "GET") {
          log.list += 1;
          const prefix = url.searchParams.get("prefix") ?? "";
          const limit = Number(url.searchParams.get("limit") ?? 1000);
          const start = Number(url.searchParams.get("cursor") ?? 0);
          const all = (await walk(root)).filter((p) => p.startsWith(prefix)).sort();
          const page = all.slice(start, start + limit);
          const next = start + page.length;
          return send(200, {
            blobs: await Promise.all(page.map(record)),
            hasMore: next < all.length,
            ...(next < all.length ? { cursor: String(next) } : {}),
          });
        }
        return fail(405, "bad_request", "method");
      } catch (err) {
        send(500, { error: { code: "internal_server_error", message: String(err?.message ?? err) } });
      }
    });
  })
  .listen(port, "127.0.0.1", () => console.log(`fake blob store on 127.0.0.1:${port}, files in ${root}`));
