#!/bin/bash
# End-to-end run of the voice demo routes on this machine only. Usage: bash tests/e2e/run.sh prod | dev
#
#   prod  the BUILT site (run `npm run build` first), started with `next start`. A production build never
#         uses the blob mock directory, so the real @vercel/blob SDK runs against fake-blob.mjs, a local
#         stand-in for the Blob API, and preload.mjs refuses every request that is not to this machine.
#   dev   `next dev` with the site's own blob mock directory (BLOB_MOCK_DIR), which only a dev server may use.
#
# Both use fake-vendor.mjs in place of the voice vendor, with a made-up key, assistant and webhook secret.
# Nothing here reads .env, a real key or a real store. It prints one line per case: label, HTTP status, body.
# Ports: E2E_SITE_PORT, E2E_VENDOR_PORT, E2E_BLOB_PORT (3217, 3218, 3219). Working files go to a temp folder.
set -u
MODE="${1:-prod}"
E2E="$(cd "$(dirname "$0")" && pwd)"
WEB="$(cd "$E2E/../.." && pwd)"
WORK="${E2E_WORK:-$(mktemp -d "${TMPDIR:-/tmp}/voice-e2e.XXXXXX")}"
SITE="${E2E_SITE_PORT:-3217}"
FAKE="${E2E_VENDOR_PORT:-3218}"
KEY="e2e-test-key-not-real-51c2"
ASSISTANT="aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee"
SECRET="e2e-webhook-secret-0123456789"
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1"
BASE="http://127.0.0.1:$SITE"
BLOB="$WORK/store-$MODE"
BLOBPORT="${E2E_BLOB_PORT:-3219}"
BLOCKED="$WORK/blocked-$MODE.log"
: > "$BLOCKED"
if [ "$MODE" != "prod" ] && [ "$MODE" != "dev" ]; then echo "usage: bash tests/e2e/run.sh prod | dev"; exit 2; fi
if [ "$MODE" = "prod" ] && [ ! -f "$WEB/.next/BUILD_ID" ]; then echo "no build found: run npm run build first"; exit 2; fi
for p in "$SITE" "$FAKE" "$BLOBPORT"; do
  if lsof -nP -iTCP:"$p" -sTCP:LISTEN > /dev/null 2>&1; then echo "port $p is in use; set E2E_SITE_PORT, E2E_VENDOR_PORT or E2E_BLOB_PORT"; exit 2; fi
done

rm -rf "$BLOB"; mkdir -p "$BLOB"
node "$E2E/seed.mjs" "$BLOB" > "$WORK/tokens.env" || exit 1
. "$WORK/tokens.env"

node "$E2E/fake-vendor.mjs" "$FAKE" "$KEY" > "$WORK/fake-vendor.log" 2>&1 &
FAKE_PID=$!
disown "$FAKE_PID"
cd "$WEB" || exit 1
LOG="$WORK/site-$MODE.log"
BLOB_PID=""
if [ "$MODE" = "prod" ]; then
  node "$E2E/fake-blob.mjs" "$BLOBPORT" "$BLOB" > "$WORK/fake-blob.log" 2>&1 &
  BLOB_PID=$!
  disown "$BLOB_PID"
  BLOB_READ_WRITE_TOKEN="vercel_blob_rw_e2efakestore_notarealsecret0000" VERCEL_BLOB_API_URL="http://127.0.0.1:$BLOBPORT/api" VERCEL_BLOB_RETRIES=0 \
    NODE_OPTIONS="--import \"$E2E/preload.mjs\"" E2E_FAKE_BLOB_ORIGIN="http://127.0.0.1:$BLOBPORT" E2E_BLOCKED_LOG="$BLOCKED" \
    AUTOCALLS_API_KEY="$KEY" AUTOCALLS_ASSISTANT_UUID="$ASSISTANT" AUTOCALLS_API_BASE="http://127.0.0.1:$FAKE" \
    AUTOCALLS_WEBHOOK_SECRET="$SECRET" NEXT_TELEMETRY_DISABLED=1 \
    node node_modules/next/dist/bin/next start -p "$SITE" -H 127.0.0.1 > "$LOG" 2>&1 &
else
  BLOB_MOCK_DIR="$BLOB" AUTOCALLS_API_KEY="$KEY" AUTOCALLS_ASSISTANT_UUID="$ASSISTANT" AUTOCALLS_API_BASE="http://127.0.0.1:$FAKE" \
    AUTOCALLS_WEBHOOK_SECRET="$SECRET" NEXT_TELEMETRY_DISABLED=1 \
    node node_modules/next/dist/bin/next dev -p "$SITE" -H 127.0.0.1 > "$LOG" 2>&1 &
fi
SITE_PID=$!
disown "$SITE_PID"
stop() {
  kill "$SITE_PID" "$FAKE_PID" $BLOB_PID 2>/dev/null
  for p in "$SITE" "$FAKE" "$BLOBPORT"; do lsof -ti "tcp:$p" 2>/dev/null | xargs kill 2>/dev/null; done
  local left=1 tries=0
  while [ "$left" != "0" ] && [ "$tries" -lt 25 ]; do
    left=$(lsof -nP -iTCP:"$SITE" -iTCP:"$FAKE" -iTCP:"$BLOBPORT" -sTCP:LISTEN 2>/dev/null | grep -c LISTEN)
    [ "$left" = "0" ] || sleep 0.2
    tries=$((tries + 1))
  done
  echo "servers stopped; listeners left on $SITE/$FAKE/$BLOBPORT: $left"
}
trap stop EXIT

curl -s -o /dev/null --retry 90 --retry-delay 1 --retry-connrefused "$BASE/robots.txt" || { echo "site did not start"; tail -20 "$LOG"; exit 1; }
if [ "$MODE" = "prod" ]; then
  echo "BUILT site up on $BASE (next start, NODE_ENV=production; real @vercel/blob SDK against a local fake store on 127.0.0.1:$BLOBPORT; outside requests refused), fake vendor on 127.0.0.1:$FAKE"
else
  echo "site up on $BASE (next dev, the site's blob mock directory), fake vendor on 127.0.0.1:$FAKE"
fi
echo

show() { # label, then curl args
  local label="$1"; shift
  local code
  code=$(curl -s -o "$WORK/body.txt" -w "%{http_code}" "$@")
  printf '%-58s %s  %s\n' "$label" "$code" "$(head -c 300 "$WORK/body.txt")"
}
mint() { # label, token, [extra curl args]
  local label="$1" token="$2"; shift 2
  show "$label" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$token\"}" "$@" "$BASE/api/demo-session"
}
code() { # label, then curl args: the status only
  local label="$1"; shift
  printf '%-58s %s\n' "$label" "$(curl -s -o /dev/null -w "%{http_code}" "$@")"
}
mode() { curl -s -o /dev/null -X POST -d "$1" "http://127.0.0.1:$FAKE/__mode"; }

echo "== POST /api/demo-session: refusals"
mint "bad token (too short)" "abc"
mint "bad token (a path)" "../../etc/passwd"
show "machine UA (curl's own)" -X POST -H "Content-Type: application/json" -d "{\"token\":\"$A\"}" "$BASE/api/demo-session"
show "machine UA (python-requests)" -X POST -H "Content-Type: application/json" -A "python-requests/2.32" -d "{\"token\":\"$A\"}" "$BASE/api/demo-session"
show "not JSON content type" -X POST -A "$UA" -d "token=$A" "$BASE/api/demo-session"
mint "another site's page (Sec-Fetch-Site: cross-site)" "$A" -H "Sec-Fetch-Site: cross-site"
mint "unknown token" "e2eNoSuchPage_00000000"
mint "expired page" "$EXPIRED"
mint "an audit-kind page" "$AUDIT"
show "GET is not allowed" -A "$UA" "$BASE/api/demo-session"
echo "vendor calls so far: $(curl -s "http://127.0.0.1:$FAKE/__log" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>console.log(JSON.parse(s).length))')"
echo

echo "== good mint, then the per-page daily cap (3)"
mint "page A, press 1" "$A"
mint "page A, press 2" "$A"
mint "page A, press 3" "$A"
mint "page A, press 4 (over the daily cap)" "$A"
echo "markers under demos/$A/:"; ls "$BLOB/demos/$A/" | sed 's/^/   /'
echo "one marker's body: $(cat "$BLOB/demos/$A/$(ls "$BLOB/demos/$A/" | head -1)" | tr -d '\n' | tr -s ' ')"
DAY=$(ls "$BLOB/demo-days/")
echo "day folder: demo-days/$DAY/ ($(ls "$BLOB/demo-days/$DAY" | wc -l | tr -d ' ') markers); Central date now: $(TZ=America/Chicago date +%F)"
echo "what the vendor was sent (the key is reported only as right or wrong):"
curl -s "http://127.0.0.1:$FAKE/__log" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{for(const r of JSON.parse(s))console.log("   "+JSON.stringify(r))})'
echo

echo "== the page's lifetime cap (6): page E has six markers from earlier days"
mint "page E (seventh ever)" "$E"
echo

echo "== each vendor error (page B, the vendor answers the status on the left)"
for s in 401 402 403 404 422 429 503 500; do
  mode "{\"status\":$s,\"body\":{\"error\":\"VENDOR-TEXT-$s\",\"detail\":\"Bearer $KEY refused\"}}"
  mint "vendor $s" "$B"
done
mode '{"status":200,"body":{"id":"x","url":"not a url","token":"t"}}'
mint "vendor 200 without a usable url" "$B"
mode '{}'
echo "markers under demos/$B/: $(ls "$BLOB/demos/$B" 2>/dev/null | wc -l | tr -d ' ') (no failed press wrote one)"
echo

echo "== the all-pages daily cap (25): 3 markers exist, 21 more are seeded, then two pages press"
for i in $(seq 1 21); do
  printf '{"v":1}' > "$BLOB/demo-days/$DAY/$(date -u +%Y%m%dT%H%M%SZ)-$(printf 'c%.0s' $(seq 1 30))$(printf '%02d' "$i").json"
done
echo "markers under demo-days/$DAY/: $(ls "$BLOB/demo-days/$DAY" | wc -l | tr -d ' ')"
mint "page C (the 25th of the day)" "$C"
mint "page D (the 26th of the day)" "$D"
echo "markers under demos/$D/: $(ls "$BLOB/demos/$D" 2>/dev/null | wc -l | tr -d ' ')"
echo

echo "== POST /api/autocalls-webhook"
CALL='{"id":48211,"type":"web","assistant_id":"'"$ASSISTANT"'","status":"completed","ended_by":"customer","duration":184,"created_at":"2026-11-16T21:04:11+02:00","finished_at":"2026-11-16T21:07:15+02:00","input_variables":{"lead_token":"'"$A"'","demo_mode":"yes","business_name":"Maple Creek Family Dental"},"extracted_variables":{"wants_consult":true,"consult_phone":"2815550142","consult_note":"after 3 PM","summary":"Wants a consultant to call."},"transcript":[{"role":"assistant","text":"SPOKEN-WORDS"}],"formatted_transcript":"SPOKEN-WORDS"}'
show "no secret in the URL" -X POST -H "Content-Type: application/json" -d "$CALL" "$BASE/api/autocalls-webhook"
show "a wrong secret" -X POST -H "Content-Type: application/json" -d "$CALL" "$BASE/api/autocalls-webhook?k=wrong-secret-0123456789abcdef"
show "the right secret" -X POST -H "Content-Type: application/json" -d "$CALL" "$BASE/api/autocalls-webhook?k=$SECRET"
show "the same id again" -X POST -H "Content-Type: application/json" -d "$CALL" "$BASE/api/autocalls-webhook?k=$SECRET"
show "another assistant's call" -X POST -H "Content-Type: application/json" -d "${CALL/$ASSISTANT/99999999-bbbb-4ccc-8ddd-eeeeeeeeeeee}" "$BASE/api/autocalls-webhook?k=$SECRET"
show "a body with no id" -X POST -H "Content-Type: application/json" -d '{"type":"web"}' "$BASE/api/autocalls-webhook?k=$SECRET"
show "GET with the right secret" "$BASE/api/autocalls-webhook?k=$SECRET"
echo "calls/: $(ls "$BLOB/calls" | tr '\n' ' ')"
echo "stored keys: $(node -e 'const d=JSON.parse(require("fs").readFileSync(process.argv[1]));console.log(Object.keys(d).join(", "))' "$BLOB/calls/$(ls "$BLOB/calls" | head -1)")"
echo "transcript words in the stored file: $(grep -c "SPOKEN-WORDS" "$BLOB/calls/$(ls "$BLOB/calls" | head -1)")"
echo

echo "== the pages, and the view beacon"
code "GET /a/<voice A>" -A "$UA" "$BASE/a/$A"
curl -s -A "$UA" "$BASE/a/$A" > "$WORK/voice.html"
curl -s -A "$UA" "$BASE/a/$SAMPLE" > "$WORK/sample.html"
curl -s -A "$UA" "$BASE/a/$AUDIT" > "$WORK/audit.html"
curl -s -A "$UA" "$BASE/a/$B" > "$WORK/plumbing.html"
for f in voice sample audit plumbing; do
  node -e '
    const h=require("fs").readFileSync(process.argv[1],"utf8");
    const has=(s)=>h.includes(s)?"yes":"no";
    const title=(h.match(/<title>([^<]*)<\/title>/)||[])[1];
    console.log(`${process.argv[2].padEnd(9)} title="${title}" business:${has("Maple Creek Family Dental")||""} line:${has("This is your receptionist, set up as a demo.")} button:${has("Talk to it")} sample-badge:${/>Sample</.test(h)?"yes":"no"} audit-headline:${has("near me")} audit-form:${has("Your name")} vendor-name:${/autocalls/i.test(h)?"YES":"no"} session-in-html:${/fake-session|wss:/.test(h)?"YES":"no"}`);
  ' "$WORK/$f.html" "$f"
done
show "view beacon, voice page" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$A\"}" "$BASE/api/audit-view"
show "view beacon, audit page" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$AUDIT\"}" "$BASE/api/audit-view"
echo "views/: $(ls "$BLOB/views" | sed -E 's/^[0-9TZ]+-[0-9a-f]{32}-//' | tr '\n' ' ')"
show "audit-status on the audit page (unchanged)" -A "$UA" "$BASE/api/audit-status?token=$AUDIT"
show "audit-status on a voice page (not an audit)" -A "$UA" "$BASE/api/audit-status?token=$A"
show "audit-request on a voice page (not an audit)" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$A\",\"name\":\"Pat\",\"tel\":\"7135552368\"}" "$BASE/api/audit-request"
code "GET /a/<expired voice page>" -A "$UA" "$BASE/a/$EXPIRED"
code "GET /a/<unknown>" -A "$UA" "$BASE/a/e2eNoSuchPage_00000000"
echo
echo "vendor calls in all: $(curl -s "http://127.0.0.1:$FAKE/__log" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{const l=JSON.parse(s);console.log(l.length+", key right on "+l.filter(r=>r.key==="right").length)})')"
echo "server log lines from the voice routes:"
grep -E "\[demo-session\]|\[voice-webhook\]" "$LOG" | sed 's/^/   /' | head -30
echo "key or vendor text in the server log: $(grep -c -e "$KEY" -e "VENDOR-TEXT" "$LOG")"
if [ "$MODE" = "prod" ]; then
  echo "requests the built site made to the fake blob store, by SDK call: $(curl -s "http://127.0.0.1:$BLOBPORT/__log")"
  echo "requests the built site tried to make to any host other than this machine: $(wc -l < "$BLOCKED" | tr -d ' ')"
  echo "scripts and preloads in the built voice page's HTML that are the SDK chunk:"
  grep -rl "lk.agent.state" "$WEB/.next/static" | while IFS= read -r chunk; do
    name="$(basename "$chunk")"
    echo "   SDK chunk $name ($(wc -c < "$chunk" | tr -d ' ') bytes), times named in the page's HTML: $(grep -c -F "$name" "$WORK/voice.html")"
  done
  echo "   script files the page does load at open: $(grep -o '/_next/static/chunks/[^"\\]*\.js' "$WORK/voice.html" | sort -u | wc -l | tr -d ' ')"
  echo "client bundles (.next/static) that name the vendor: $(grep -rIli "autocalls" "$WEB/.next/static" | wc -l | tr -d ' ')"
  echo "client bundles that hold a key name, the vendor's API path or the test key: $(grep -rIl -e "AUTOCALLS_" -e "api/user/realtime" -e "$KEY" "$WEB/.next/static" | wc -l | tr -d ' ')"
fi
echo "working files: $WORK"
