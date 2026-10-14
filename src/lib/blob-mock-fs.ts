import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * The BLOB_MOCK_DIR stand-in for the Blob store: the same relative pathnames,
 * as files under one directory. Development only. blob-store.ts loads this
 * module behind a NODE_ENV check, so a production build never contains it
 * (and the file tracer never sees these dynamic paths).
 */

const SAFE_PATHNAME = /^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/;

function root(): string | null {
  const dir = process.env.BLOB_MOCK_DIR?.trim();
  return dir ? path.resolve(dir) : null;
}

/** Absolute path of a mock file, or null if the mock is off or the path is unsafe or escapes the directory. */
export function mockFilePath(pathname: string): string | null {
  const dir = root();
  if (!dir) return null;
  if (!SAFE_PATHNAME.test(pathname) || pathname.split("/").some((s) => s === "." || s === "..")) {
    return null;
  }
  const full = path.resolve(dir, pathname);
  if (full !== dir && !full.startsWith(dir + path.sep)) return null;
  return full;
}

function need(pathname: string): string {
  const file = mockFilePath(pathname);
  if (!file) throw new Error(`blob-mock: unusable pathname ${JSON.stringify(pathname)}`);
  return file;
}

export async function readText(pathname: string): Promise<string | null> {
  try {
    return await fs.readFile(need(pathname), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function readBytes(pathname: string): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await fs.readFile(need(pathname)));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeText(pathname: string, body: string, allowOverwrite: boolean): Promise<void> {
  const file = need(pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  if (!allowOverwrite) {
    const exists = await fs
      .access(file)
      .then(() => true)
      .catch(() => false);
    if (exists) throw new Error(`blob-mock: ${pathname} already exists`);
  }
  // Write-then-rename, so a reader never sees half a file.
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, file);
}

async function walk(dir: string, base: string, out: string[]): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, base, out);
    else if (e.isFile() && !e.name.endsWith(".tmp")) out.push(path.relative(base, full).split(path.sep).join("/"));
  }
}

/** Every file whose pathname starts with `prefix`, sorted, with size and mtime. */
export async function listFiles(
  prefix: string,
): Promise<Array<{ pathname: string; size: number; uploadedAt: Date }>> {
  const dir = root();
  if (!dir) return [];
  // The prefix may end mid-segment ("submissions/2026"), so walk its folder and filter.
  const folder = prefix.includes("/") ? prefix.slice(0, prefix.lastIndexOf("/")) : "";
  const start = folder ? mockFilePath(folder) : dir;
  if (!start) return [];
  const found: string[] = [];
  await walk(start, dir, found);
  const matching = found.filter((p) => p.startsWith(prefix)).sort();
  return Promise.all(
    matching.map(async (p) => {
      const st = await fs.stat(path.join(dir, p));
      return { pathname: p, size: st.size, uploadedAt: st.mtime };
    }),
  );
}
