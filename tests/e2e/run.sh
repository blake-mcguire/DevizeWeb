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
# Every case has an expected status (and, where there is one, an expected error code or count). A case that
# answers anything else prints a MISMATCH line, and the script then exits 1; it exits 0 only when every check
# held. So a later change that breaks a cap, an error mapping or a file name cannot pass this run unseen.
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

CHECKS=0
FAILS=0
miss() { FAILS=$((FAILS + 1)); echo "   MISMATCH: $1"; }
expect() { # what, got, want
  CHECKS=$((CHECKS + 1))
  [ "$2" = "$3" ] || miss "$1: got '$2', expected '$3'"
}
show() { # label, expected status, text the body must contain ("" for none), then curl args
  local label="$1" want="$2" has="$3"; shift 3
  local code
  code=$(curl -s -o "$WORK/body.txt" -w "%{http_code}" "$@")
  printf '%-58s %s  %s\n' "$label" "$code" "$(head -c 300 "$WORK/body.txt")"
  expect "$label: status" "$code" "$want"
  if [ -n "$has" ]; then
    CHECKS=$((CHECKS + 1))
    grep -q -F -- "$has" "$WORK/body.txt" || miss "$label: the body does not contain $has"
  fi
  # No answer of any route may carry the key, the vendor's own words or the vendor's name.
  CHECKS=$((CHECKS + 1))
  if grep -q -i -e "$KEY" -e "VENDOR-TEXT" -e "autocalls" "$WORK/body.txt"; then miss "$label: the body leaks the key or the vendor"; fi
}
mint() { # label, expected status, text the body must contain, token, [extra curl args]
  local label="$1" want="$2" has="$3" token="$4"; shift 4
  show "$label" "$want" "$has" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$token\"}" "$@" "$BASE/api/demo-session"
}
code() { # label, expected status, then curl args: the status only
  local label="$1" want="$2"; shift 2
  local got
  got=$(curl -s -o /dev/null -w "%{http_code}" "$@")
  printf '%-58s %s\n' "$label" "$got"
  expect "$label: status" "$got" "$want"
}
count() { ls "$1" 2>/dev/null | wc -l | tr -d ' '; }
mode() { curl -s -o /dev/null -X POST -d "$1" "http://127.0.0.1:$FAKE/__mode"; }
vendor_log() { curl -s "http://127.0.0.1:$FAKE/__log" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{const l=JSON.parse(s);console.log(eval(process.argv[1]))})' "$1"; }
# The secret part of a call's file name, worked out here on its own: HMAC-SHA256(webhook secret, call id), 32 hex.
tag() { node -e 'console.log(require("crypto").createHmac("sha256",process.argv[1]).update(process.argv[2]).digest("hex").slice(0,32))' "$SECRET" "$1"; }
GONE='"error":"gone"'
GOOD='{"url":"wss://media.invalid/rtc","token":"fake-session-token"}'

echo "== POST /api/demo-session: refusals"
mint "bad token (too short)" 404 "$GONE" "abc"
mint "bad token (a path)" 404 "$GONE" "../../etc/passwd"
show "machine UA (curl's own)" 403 '"error":"forbidden"' -X POST -H "Content-Type: application/json" -d "{\"token\":\"$A\"}" "$BASE/api/demo-session"
show "machine UA (python-requests)" 403 '"error":"forbidden"' -X POST -H "Content-Type: application/json" -A "python-requests/2.32" -d "{\"token\":\"$A\"}" "$BASE/api/demo-session"
show "not JSON content type" 400 '"error":"bad_request"' -X POST -A "$UA" -d "token=$A" "$BASE/api/demo-session"
mint "another site's page (Sec-Fetch-Site: cross-site)" 403 '"error":"forbidden"' "$A" -H "Sec-Fetch-Site: cross-site"
mint "unknown token" 404 "$GONE" "e2eNoSuchPage_00000000"
mint "expired page" 404 "$GONE" "$EXPIRED"
mint "an audit-kind page" 404 "$GONE" "$AUDIT"
show "GET is not allowed" 405 "" -A "$UA" "$BASE/api/demo-session"
echo "vendor calls so far: $(vendor_log 'l.length')"
expect "vendor calls after the refusals" "$(vendor_log 'l.length')" 0
echo

echo "== good mint, then the per-page daily cap (3)"
mint "page A, press 1" 200 "$GOOD" "$A"
mint "page A, press 2" 200 "$GOOD" "$A"
mint "page A, press 3" 200 "$GOOD" "$A"
mint "page A, press 4 (over the daily cap)" 429 '"error":"page_day"' "$A"
echo "markers under demos/$A/:"; ls "$BLOB/demos/$A/" | sed 's/^/   /'
expect "markers under demos/A" "$(count "$BLOB/demos/$A")" 3
expect "marker names are <iso>-<32 hex>.json" "$(ls "$BLOB/demos/$A/" | grep -c -E '^[0-9]{8}T[0-9]{6}Z-[0-9a-f]{32}\.json$')" 3
echo "one marker's body: $(cat "$BLOB/demos/$A/$(ls "$BLOB/demos/$A/" | head -1)" | tr -d '\n' | tr -s ' ')"
DAY=$(ls "$BLOB/demo-days/")
echo "day folder: demo-days/$DAY/ ($(count "$BLOB/demo-days/$DAY") markers); Central date now: $(TZ=America/Chicago date +%F)"
expect "markers under demo-days/<today>" "$(count "$BLOB/demo-days/$DAY")" 3
echo "what the vendor was sent (the key is reported only as right or wrong):"
curl -s "http://127.0.0.1:$FAKE/__log" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{for(const r of JSON.parse(s))console.log("   "+JSON.stringify(r))})'
expect "vendor calls after three presses" "$(vendor_log 'l.length')" 3
expect "vendor calls that named page A and our assistant" "$(vendor_log "l.filter(r=>r.external_identifier==='$A'&&r.assistant_id==='$ASSISTANT'&&r.key==='right').length")" 3
expect "vendor calls with the three clock keys set" "$(vendor_log "l.filter(r=>['yes','no'].includes(r.clock.after_hours)&&r.clock.next_open_day&&r.clock.appt_windows&&r.variable_count<=50).length")" 3
echo

echo "== the page's lifetime cap (6): page E has six markers from earlier days"
mint "page E (seventh ever)" 429 '"error":"page_life"' "$E"
expect "markers under demos/E (no seventh)" "$(count "$BLOB/demos/$E")" 6
echo

echo "== each vendor error (page B, the vendor answers the status on the left)"
for pair in 401:503:unavailable 402:402:balance 403:503:unavailable 404:503:unavailable 422:503:unavailable 429:429:busy 503:503:unavailable 500:503:unavailable; do
  s="${pair%%:*}"; rest="${pair#*:}"; want="${rest%%:*}"; err="${rest#*:}"
  mode "{\"status\":$s,\"body\":{\"error\":\"VENDOR-TEXT-$s\",\"detail\":\"Bearer $KEY refused\"}}"
  mint "vendor $s" "$want" "\"error\":\"$err\"" "$B"
done
mode '{"status":200,"body":{"id":"x","url":"not a url","token":"t"}}'
mint "vendor 200 without a usable url" 503 '"error":"unavailable"' "$B"
mode '{}'
echo "markers under demos/$B/: $(count "$BLOB/demos/$B") (no failed press wrote one)"
expect "markers under demos/B" "$(count "$BLOB/demos/$B")" 0
echo "demo-alerts/$DAY/: $(ls "$BLOB/demo-alerts/$DAY" 2>/dev/null | tr '\n' ' ')(the 402 left one file for the pipeline)"
expect "alert files after the vendor errors" "$(ls "$BLOB/demo-alerts/$DAY" 2>/dev/null | tr '\n' ' ')" "balance.json "
echo

echo "== the all-pages daily cap (25): 3 markers exist, 21 more are seeded, then two pages press"
for i in $(seq 1 21); do
  printf '{"v":1}' > "$BLOB/demo-days/$DAY/$(date -u +%Y%m%dT%H%M%SZ)-$(printf 'c%.0s' $(seq 1 30))$(printf '%02d' "$i").json"
done
echo "markers under demo-days/$DAY/: $(count "$BLOB/demo-days/$DAY")"
mint "page C (the 25th of the day)" 200 "$GOOD" "$C"
mint "page D (the 26th of the day)" 429 '"error":"day_full"' "$D"
CHECKS=$((CHECKS + 1)); grep -q -i "tomorrow" "$WORK/body.txt" || miss "the day_full answer does not say tomorrow"
mint "page D again" 429 '"error":"day_full"' "$D"
echo "markers under demos/$D/: $(count "$BLOB/demos/$D")"
expect "markers under demos/D" "$(count "$BLOB/demos/$D")" 0
echo "demo-alerts/$DAY/: $(ls "$BLOB/demo-alerts/$DAY" 2>/dev/null | tr '\n' ' ')"
expect "alert files after the all-pages cap" "$(ls "$BLOB/demo-alerts/$DAY" 2>/dev/null | tr '\n' ' ')" "balance.json day_full.json "
echo "the day_full alert: $(tr -d '\n' < "$BLOB/demo-alerts/$DAY/day_full.json" 2>/dev/null | tr -s ' ')"
echo

echo "== POST /api/autocalls-webhook"
CALL='{"id":48211,"type":"web","assistant_id":"'"$ASSISTANT"'","status":"completed","ended_by":"customer","duration":184,"created_at":"2026-11-16T21:04:11+02:00","finished_at":"2026-11-16T21:07:15+02:00","input_variables":{"lead_token":"'"$A"'","demo_mode":"yes","business_name":"Maple Creek Family Dental"},"extracted_variables":{"wants_consult":true,"consult_phone":"2815550142","consult_note":"after 3 PM","summary":"Wants a consultant to call."},"transcript":[{"role":"assistant","text":"SPOKEN-WORDS"}],"formatted_transcript":"SPOKEN-WORDS"}'
EARLY='{"id":48212,"type":"web","assistant_id":"'"$ASSISTANT"'","status":"completed","duration":90,"created_at":"2026-11-16T21:10:00+02:00","input_variables":{"lead_token":"'"$A"'","demo_mode":"yes"},"extracted_variables":{}}'
LATE='{"id":48212,"type":"web","assistant_id":"'"$ASSISTANT"'","status":"completed","duration":90,"created_at":"2026-11-16T21:10:00+02:00","input_variables":{"lead_token":"'"$A"'","demo_mode":"yes"},"extracted_variables":{"wants_consult":true,"consult_phone":"2815550143"}}'
HOOK="$BASE/api/autocalls-webhook"
show "no secret in the URL" 404 "" -X POST -H "Content-Type: application/json" -d "$CALL" "$HOOK"
show "a wrong secret" 404 "" -X POST -H "Content-Type: application/json" -d "$CALL" "$HOOK?k=wrong-secret-0123456789abcdef"
show "the right secret" 200 '"stored":true' -X POST -H "Content-Type: application/json" -d "$CALL" "$HOOK?k=$SECRET"
show "the same id again" 200 '"duplicate":true' -X POST -H "Content-Type: application/json" -d "$CALL" "$HOOK?k=$SECRET"
show "another assistant's call" 200 '"ignored":true' -X POST -H "Content-Type: application/json" -d "${CALL/$ASSISTANT/99999999-bbbb-4ccc-8ddd-eeeeeeeeeeee}" "$HOOK?k=$SECRET"
show "a body with no id" 400 '"error":"bad_request"' -X POST -H "Content-Type: application/json" -d '{"type":"web"}' "$HOOK?k=$SECRET"
show "GET with the right secret" 405 "" "$HOOK?k=$SECRET"
show "a call sent before its evaluation" 200 '"stored":true' -X POST -H "Content-Type: application/json" -d "$EARLY" "$HOOK?k=$SECRET"
show "the same call again, now evaluated" 200 '"updated":true' -X POST -H "Content-Type: application/json" -d "$LATE" "$HOOK?k=$SECRET"
show "and once more" 200 '"duplicate":true' -X POST -H "Content-Type: application/json" -d "$LATE" "$HOOK?k=$SECRET"
echo "calls/: $(ls "$BLOB/calls" | tr '\n' ' ')"
FIRST="20261116T190411Z-48211-$(tag 48211).json"
SECOND="20261116T191000Z-48212-$(tag 48212).json"
expect "files under calls/ (a time, the id, then 32 hex from the secret)" "$(ls "$BLOB/calls" | tr '\n' ' ')" "$FIRST $SECOND "
expect "a call file named by time and id alone" "$(ls "$BLOB/calls" | grep -c -E '^[0-9TZ]+-[0-9]+\.json$')" 0
echo "stored keys: $(node -e 'const d=JSON.parse(require("fs").readFileSync(process.argv[1]));console.log(Object.keys(d).join(", "))' "$BLOB/calls/$FIRST")"
expect "stored keys" "$(node -e 'const d=JSON.parse(require("fs").readFileSync(process.argv[1]));console.log(Object.keys(d).join(","))' "$BLOB/calls/$FIRST")" "v,id,received_at,type,assistant_id,status,ended_by,duration,created_at,finished_at,lead_token,input_variables,extracted_variables"
echo "transcript words in the stored files: $(cat "$BLOB/calls/"* | grep -c "SPOKEN-WORDS")"
expect "transcript words in the stored files" "$(cat "$BLOB/calls/"* | grep -c "SPOKEN-WORDS")" 0
expect "the evaluated copy replaced the early one" "$(node -e 'const d=JSON.parse(require("fs").readFileSync(process.argv[1]));console.log(d.extracted_variables.consult_phone)' "$BLOB/calls/$SECOND")" "2815550143"
echo

echo "== the pages, and the view beacon"
code "GET /a/<voice A>" 200 -A "$UA" "$BASE/a/$A"
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
  ' "$WORK/$f.html" "$f" | tee "$WORK/$f.line"
done
expect "the voice page" "$(sed -E 's/^[a-z]+ +//' "$WORK/voice.line")" 'title="Your receptionist demo · Devize" business:yes line:yes button:yes sample-badge:no audit-headline:no audit-form:no vendor-name:no session-in-html:no'
expect "the sample page" "$(sed -E 's/^[a-z]+ +//' "$WORK/sample.line")" 'title="Your receptionist demo · Devize" business:no line:yes button:yes sample-badge:yes audit-headline:no audit-form:no vendor-name:no session-in-html:no'
expect "the audit page (unchanged)" "$(sed -E 's/^[a-z]+ +//' "$WORK/audit.line")" 'title="Your audit · Devize" business:no line:no button:no sample-badge:no audit-headline:yes audit-form:yes vendor-name:no session-in-html:no'
expect "the plumbing page" "$(sed -E 's/^[a-z]+ +//' "$WORK/plumbing.line")" 'title="Your receptionist demo · Devize" business:no line:yes button:yes sample-badge:no audit-headline:no audit-form:no vendor-name:no session-in-html:no'
show "view beacon, voice page" 204 "" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$A\"}" "$BASE/api/audit-view"
show "view beacon, audit page" 204 "" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$AUDIT\"}" "$BASE/api/audit-view"
echo "views/: $(ls "$BLOB/views" | sed -E 's/^[0-9TZ]+-[0-9a-f]{32}-//' | tr '\n' ' ')"
expect "views/" "$(ls "$BLOB/views" | sed -E 's/^[0-9TZ]+-[0-9a-f]{32}-//' | sort | tr '\n' ' ')" "$(printf '%s\n' "$A.json" "$AUDIT.json" | sort | tr '\n' ' ')"
show "audit-status on the audit page (unchanged)" 200 '"ready":false' -A "$UA" "$BASE/api/audit-status?token=$AUDIT"
show "audit-status on a voice page (not an audit)" 404 "" -A "$UA" "$BASE/api/audit-status?token=$A"
show "audit-request on a voice page (not an audit)" 404 "$GONE" -X POST -H "Content-Type: application/json" -A "$UA" -d "{\"token\":\"$A\",\"name\":\"Pat\",\"tel\":\"7135552368\"}" "$BASE/api/audit-request"
code "GET /a/<expired voice page>" 404 -A "$UA" "$BASE/a/$EXPIRED"
code "GET /a/<unknown>" 404 -A "$UA" "$BASE/a/e2eNoSuchPage_00000000"
echo
echo "vendor calls in all: $(vendor_log 'l.length+", key right on "+l.filter(r=>r.key==="right").length')"
expect "vendor calls in all, and with the right key" "$(vendor_log 'l.length+" "+l.filter(r=>r.key==="right").length')" "13 13"
echo "server log lines from the voice routes:"
grep -E "\[demo-session\]|\[voice-webhook\]" "$LOG" | sed 's/^/   /' | head -30
echo "key or vendor text in the server log: $(grep -c -e "$KEY" -e "VENDOR-TEXT" "$LOG")"
expect "key or vendor text in the server log" "$(grep -c -e "$KEY" -e "VENDOR-TEXT" "$LOG")" 0
if [ "$MODE" = "prod" ]; then
  echo "requests the built site made to the fake blob store, by SDK call: $(curl -s "http://127.0.0.1:$BLOBPORT/__log")"
  echo "requests the built site tried to make to any host other than this machine: $(wc -l < "$BLOCKED" | tr -d ' ')"
  expect "requests to any host other than this machine" "$(wc -l < "$BLOCKED" | tr -d ' ')" 0
  echo "scripts and preloads in the built voice page's HTML that are the SDK chunk:"
  grep -rl "lk.agent.state" "$WEB/.next/static" > "$WORK/sdk-chunks.txt"
  SDK_NAMED=0
  while IFS= read -r chunk; do
    name="$(basename "$chunk")"
    hits=$(grep -c -F "$name" "$WORK/voice.html")
    echo "   SDK chunk $name ($(wc -c < "$chunk" | tr -d ' ') bytes), times named in the page's HTML: $hits"
    SDK_NAMED=$((SDK_NAMED + hits))
  done < "$WORK/sdk-chunks.txt"
  expect "an SDK chunk exists in the build" "$([ -s "$WORK/sdk-chunks.txt" ] && echo yes || echo no)" yes
  expect "times the SDK chunk is named in the page's HTML (it loads only after the press)" "$SDK_NAMED" 0
  echo "   script files the page does load at open: $(grep -o '/_next/static/chunks/[^"\\]*\.js' "$WORK/voice.html" | sort -u | wc -l | tr -d ' ')"
  echo "client bundles (.next/static) that name the vendor: $(grep -rIli "autocalls" "$WEB/.next/static" | wc -l | tr -d ' ')"
  expect "client bundles that name the vendor" "$(grep -rIli "autocalls" "$WEB/.next/static" | wc -l | tr -d ' ')" 0
  echo "client bundles that hold a key name, the vendor's API path or the test key: $(grep -rIl -e "AUTOCALLS_" -e "api/user/realtime" -e "$KEY" "$WEB/.next/static" | wc -l | tr -d ' ')"
  expect "client bundles that hold a key name, the vendor's API path or the test key" "$(grep -rIl -e "AUTOCALLS_" -e "api/user/realtime" -e "$KEY" "$WEB/.next/static" | wc -l | tr -d ' ')" 0
fi
echo "working files: $WORK"
echo
if [ "$FAILS" = "0" ]; then
  echo "RESULT: all $CHECKS checks held"
else
  echo "RESULT: $FAILS of $CHECKS checks did not hold (see the MISMATCH lines above)"
  exit 1
fi
