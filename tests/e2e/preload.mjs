// Loaded into the built site's process for the local end-to-end run only (NODE_OPTIONS=--import, see run.sh).
// Every fetch in that process, the Blob SDK's included, goes through undici's global dispatcher. This one:
//   - sends requests for the public Blob file host to the local fake store instead, and
//   - refuses any other request that is not to this machine, and writes it down.
// So the built site cannot reach Vercel Blob, the voice vendor or anything else while it is being tested.
import fs from "node:fs";
import undici from "undici";

const agent = new undici.Agent();
const FAKE = process.env.E2E_FAKE_BLOB_ORIGIN;
const BLOCKED = process.env.E2E_BLOCKED_LOG;
const LOCAL = new Set(["127.0.0.1", "localhost", "[::1]"]);

const dispatcher = {
  dispatch(opts, handler) {
    const origin = new URL(String(opts.origin));
    if (origin.hostname.endsWith(".public.blob.vercel-storage.com")) {
      opts = { ...opts, origin: FAKE, path: `/_public${opts.path}` };
    } else if (!LOCAL.has(origin.hostname)) {
      if (BLOCKED) fs.appendFileSync(BLOCKED, `${new Date().toISOString()} ${origin.host}\n`);
      const err = new Error(`e2e tripwire: refused a request to ${origin.host}`);
      if (typeof handler.onError === "function") {
        handler.onError(err);
        return false;
      }
      throw err;
    }
    return agent.dispatch(opts, handler);
  },
  close: () => agent.close(),
  destroy: () => agent.destroy(),
};
Object.defineProperty(globalThis, Symbol.for("undici.globalDispatcher.1"), {
  value: dispatcher,
  writable: true,
  enumerable: false,
  configurable: false,
});
