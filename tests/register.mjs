/**
 * Lets node's own test runner load the site's TypeScript the way the bundler
 * does, with no new dependency: node strips the types itself, and this hook
 * teaches it the three things only the bundler knows.
 *
 *   "server-only"   an empty module (it exists to break client builds)
 *   "@/..."         the src/ folder (tsconfig paths)
 *   "./x"           "./x.ts" for imports inside src/ (no file extension)
 *
 * Files under src/ are ES modules, as the bundler treats them; saying so here
 * saves node from guessing.
 *
 * It also makes sure nothing loaded this way can reach a real Blob store,
 * whatever the shell exported: the run is marked as a test (the store
 * wrapper drops its mock directory when NODE_ENV is production) and the
 * Blob credentials are removed from this process before any test file runs.
 * tests/routes.test.mjs does the same for itself and checks it.
 *
 * Used as: node --import ./tests/register.mjs --test tests/
 */
import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

process.env.NODE_ENV = "test";
for (const name of ["BLOB_READ_WRITE_TOKEN", "BLOB_STORE_ID", "VERCEL_BLOB_API_URL", "VERCEL"]) delete process.env[name];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function sourceFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return { url: "data:text/javascript,export{}", shortCircuit: true };
    let base = null;
    if (specifier.startsWith("@/")) {
      base = path.join(src, specifier.slice(2));
    } else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
      // A query string (route.ts?fresh=1) asks for a second copy of a module; keep it on the URL.
      const [file, query = ""] = specifier.split("?");
      const target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), file);
      if (target.startsWith(src + path.sep)) {
        const found = sourceFile(target);
        if (found) {
          const url = pathToFileURL(found).href + (query ? `?${query}` : "");
          return { url, format: "module-typescript", shortCircuit: true };
        }
      }
    }
    const file = base && sourceFile(base);
    return file
      ? { url: pathToFileURL(file).href, format: "module-typescript", shortCircuit: true }
      : nextResolve(specifier, context);
  },
});
