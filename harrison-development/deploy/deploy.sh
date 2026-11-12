#!/usr/bin/env bash
# Deploys harrison-development/ to Cloudflare Workers + KV, served at
# https://harrisondev.org (Charles's domain, Cloudflare, 2026-11-10). www and the misspelled
# harrisondevolpment.com (bought by mistake, paid to 2027-11) redirect to it.
# Run from the repo root in a Claude Code cloud session (the Cloudflare credential is
# injected by the session proxy; no API key is stored here). Usage: bash harrison-development/deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."
NAME=harrison-development
API_ROOT=https://api.cloudflare.com/client/v4
ACC=$(curl -sS "$API_ROOT/accounts" | python3 -I -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
API=$API_ROOT/accounts/$ACC
DIST=$(mktemp -d)
# 1. Public files only: never docs/, tests/, screenshots/ or deploy/
cp index.html privacy.html robots.txt sitemap.xml "$DIST"/
cp -r css js assets concepts "$DIST"/
rm -f "$DIST/assets/brand/og-source.html"
# 2. Strip internal comments from the public config
python3 -I - "$DIST/js/config.js" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p).read()
s=re.sub(r'/\*.*?\*/\s*','',s,flags=re.S)
s='\n'.join(l for l in s.splitlines() if not re.match(r'\s*//',l))
open(p,'w').write(re.sub(r'\n{3,}','\n\n',s))
PY
# 3. KV namespace (create once)
NS=$(curl -sS "$API/storage/kv/namespaces?per_page=100" | python3 -I -c "import sys,json; r=[n['id'] for n in json.load(sys.stdin)['result'] if n['title']=='$NAME-site']; print(r[0] if r else '')")
if [ -z "$NS" ]; then
  NS=$(curl -sS -X POST "$API/storage/kv/namespaces" -H 'Content-Type: application/json' --data "{\"title\":\"$NAME-site\"}" | python3 -I -c "import sys,json; print(json.load(sys.stdin)['result']['id'])")
fi
# 3b. Separate KV namespace for project inquiries (a deploy never overwrites it)
INQ=$(curl -sS "$API/storage/kv/namespaces?per_page=100" | python3 -I -c "import sys,json; r=[n['id'] for n in json.load(sys.stdin)['result'] if n['title']=='$NAME-inquiries']; print(r[0] if r else '')")
if [ -z "$INQ" ]; then
  INQ=$(curl -sS -X POST "$API/storage/kv/namespaces" -H 'Content-Type: application/json' --data "{\"title\":\"$NAME-inquiries\"}" | python3 -I -c "import sys,json; print(json.load(sys.stdin)['result']['id'])")
fi
# 4. Upload every file in one bulk request (base64)
python3 -I - "$DIST" > "$DIST.bulk.json" <<'PY'
import sys,os,json,base64
root=sys.argv[1]; out=[]
for d,_,fs in os.walk(root):
    for f in fs:
        p=os.path.join(d,f); k=os.path.relpath(p,root).replace(os.sep,'/')
        out.append({"key":k,"value":base64.b64encode(open(p,'rb').read()).decode(),"base64":True})
json.dump(out,sys.stdout)
PY
curl -sS -X PUT "$API/storage/kv/namespaces/$NS/bulk" -H 'Content-Type: application/json' --data-binary @"$DIST.bulk.json" | python3 -I -c "import sys,json; d=json.load(sys.stdin); assert d['success'], d; print('files uploaded')"
# 5. Worker script with the KV binding, then the workers.dev route
META="{\"main_module\":\"worker.js\",\"compatibility_date\":\"2025-01-01\",\"bindings\":[{\"type\":\"kv_namespace\",\"name\":\"SITE\",\"namespace_id\":\"$NS\"},{\"type\":\"kv_namespace\",\"name\":\"INQ\",\"namespace_id\":\"$INQ\"}],\"keep_bindings\":[\"secret_text\"]}"
curl -sS -X PUT "$API/workers/scripts/$NAME" -F "metadata=$META;type=application/json" -F "worker.js=@deploy/worker.js;type=application/javascript+module" | python3 -I -c "import sys,json; d=json.load(sys.stdin); assert d['success'], d; print('worker deployed')"
# 6. Custom domain only; the workers.dev address stays off
curl -sS -X POST "$API/workers/scripts/$NAME/subdomain" -H 'Content-Type: application/json' --data '{"enabled":false,"previews_enabled":false}' >/dev/null
for H in harrisondev.org www.harrisondev.org harrisondevolpment.com www.harrisondevolpment.com; do
  ZONE=$(curl -sS "$API_ROOT/zones?name=${H#www.}" | python3 -I -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
  curl -sS -X PUT "$API/workers/domains" -H 'Content-Type: application/json' --data "{\"hostname\":\"$H\",\"service\":\"$NAME\",\"environment\":\"production\",\"zone_id\":\"$ZONE\"}" | python3 -I -c "import sys,json; d=json.load(sys.stdin); assert d['success'], d; print('live at https://$H')"
done
rm -rf "$DIST" "$DIST.bulk.json"
