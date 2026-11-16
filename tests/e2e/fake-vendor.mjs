// A tiny local stand-in for the voice vendor's realtime session API. Test only.
//   POST /api/user/realtime/session  -> whatever /__mode last set (default: 200 with a url and token)
//   POST /__mode {status, body}      -> sets the next answers
//   GET  /__log                      -> what it has been sent (the key is shown only as right or wrong)
import http from "node:http";

const port = Number(process.argv[2]);
const expectKey = process.argv[3];
const GOOD = { status: 200, body: { id: "fake-session-id", url: "wss://media.invalid/rtc", token: "fake-session-token", expires_in: 900 } };
let mode = GOOD;
const log = [];

http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const send = (status, obj) => {
        res.writeHead(status, { "content-type": "application/json" });
        res.end(JSON.stringify(obj));
      };
      if (req.url === "/__mode" && req.method === "POST") {
        const next = JSON.parse(body || "{}");
        mode = next.status ? next : GOOD;
        return send(200, { ok: true });
      }
      if (req.url === "/__log") return send(200, log);
      if (req.url === "/api/user/realtime/session" && req.method === "POST") {
        let parsed = {};
        try {
          parsed = JSON.parse(body);
        } catch {}
        log.push({
          key: req.headers.authorization === `Bearer ${expectKey}` ? "right" : "wrong",
          assistant_id: parsed.assistant_id,
          external_identifier: parsed.external_identifier,
          variable_count: Object.keys(parsed.variables ?? {}).length,
          clock: {
            after_hours: parsed.variables?.after_hours,
            next_open_day: parsed.variables?.next_open_day,
            appt_windows: parsed.variables?.appt_windows,
          },
          answered: mode.status,
        });
        return send(mode.status, mode.body);
      }
      send(404, { error: "no such path on the fake" });
    });
  })
  .listen(port, "127.0.0.1", () => console.log(`fake vendor on 127.0.0.1:${port}`));
