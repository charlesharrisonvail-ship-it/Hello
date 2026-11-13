// Serves the Harrison Development static site from Workers KV (binding: SITE).
// Supports byte ranges so video plays on iOS Safari.
const TYPES = {
  html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "application/javascript; charset=utf-8",
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml",
  woff2: "font/woff2", mp4: "video/mp4", webm: "video/webm", pdf: "application/pdf", txt: "text/plain; charset=utf-8"
};
const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};
// ---------- Project inquiries ----------
// POST /api/inquiry stores a validated inquiry in the INQ KV namespace (never the site files).
// GET /inbox?key=... lists them for Charles; the key is a Worker secret (INBOX_KEY), never in this repo.
const ROLES = ["", "Developer", "Builder", "Landowner", "Other"];
const STAGES = ["Land or early idea", "Planning or entitlement", "Approved, pre-construction", "Under construction", "Complete or nearly complete", "Not sure"];
const CONNECT = ["", "Phone call", "Video call", "Email", "In person"];
const LIMITS = { name: 100, email: 200, phone: 40, location: 150, description: 800, times: 120 };
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...SECURITY } });
}
function clean(v, max) { return typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : ""; }
async function hash(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function inquiry(request, env) {
  if (!env.INQ) return json({ ok: false, error: "unavailable" }, 503);
  const origin = request.headers.get("Origin") || "";
  if (origin && !/^https:\/\/(www\.)?harrisondev\.org$/.test(origin)) return json({ ok: false, error: "origin" }, 403);
  if ((request.headers.get("Content-Type") || "").indexOf("application/json") !== 0) return json({ ok: false, error: "type" }, 415);
  const raw = await request.text();
  if (raw.length > 6000) return json({ ok: false, error: "too large" }, 413);
  let b; try { b = JSON.parse(raw); } catch { return json({ ok: false, error: "bad json" }, 400); }
  if (b.website) return json({ ok: true }, 200); // honeypot: accept quietly, store nothing
  const d = {
    name: clean(b.name, LIMITS.name), email: clean(b.email, LIMITS.email), phone: clean(b.phone, LIMITS.phone),
    role: clean(b.role, 20), location: clean(b.location, LIMITS.location), stage: clean(b.stage, 40),
    description: clean(b.description, LIMITS.description), connect: clean(b.connect, 20), times: clean(b.times, LIMITS.times)
  };
  const bad = [];
  if (!d.name) bad.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) bad.push("email");
  if (d.phone && d.phone.replace(/\D/g, "").length < 7) bad.push("phone");
  if (!ROLES.includes(d.role)) bad.push("role");
  if (!d.location) bad.push("location");
  if (!STAGES.includes(d.stage)) bad.push("stage");
  if (d.description.length < 10) bad.push("description");
  if (!CONNECT.includes(d.connect)) bad.push("connect");
  if (bad.length) return json({ ok: false, error: "invalid", fields: bad }, 422);
  // Light rate limit: 5 per hour per visitor (hashed address, kept one hour).
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const rl = "rl:" + (await hash(ip + "|" + new Date().toISOString().slice(0, 13)));
  const n = Number(await env.INQ.get(rl)) || 0;
  if (n >= 5) return json({ ok: false, error: "rate" }, 429);
  await env.INQ.put(rl, String(n + 1), { expirationTtl: 3600 });
  const at = new Date().toISOString();
  const key = "inq:" + at + ":" + crypto.randomUUID().slice(0, 8);
  await env.INQ.put(key, JSON.stringify({ at, ...d }), { expirationTtl: 60 * 60 * 24 * 365 });
  return json({ ok: true }, 200);
}
function escHtml(s) { return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
async function inbox(url, env) {
  const deny = new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", ...SECURITY } });
  if (!env.INQ || !env.INBOX_KEY || url.searchParams.get("key") !== env.INBOX_KEY) return deny;
  const list = await env.INQ.list({ prefix: "inq:", limit: 1000 });
  const rows = [];
  for (const k of list.keys.reverse()) {
    const v = await env.INQ.get(k.name, { type: "json" });
    if (!v) continue;
    const when = new Date(v.at).toLocaleString("en-US", { timeZone: "America/Denver" });
    rows.push(`<article><h2>${escHtml(v.name)} <small>${escHtml(when)} MT</small></h2><p><a href="mailto:${escHtml(v.email)}">${escHtml(v.email)}</a>${v.phone ? " · " + escHtml(v.phone) : ""}${v.role ? " · " + escHtml(v.role) : ""}</p><p><b>${escHtml(v.location)}</b> · ${escHtml(v.stage)}${v.connect ? " · prefers " + escHtml(v.connect) : ""}${v.times ? " · " + escHtml(v.times) : ""}</p><p class="d">${escHtml(v.description)}</p></article>`);
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Inquiries | Harrison Development</title><style>body{margin:0;background:#14181C;color:#EEF1F3;font:16px/1.55 system-ui,sans-serif}main{max-width:820px;margin:0 auto;padding:28px 18px}h1{font-weight:500}article{border:1px solid #2C353D;border-left:3px solid #DFFF1A;padding:14px 16px;margin:0 0 14px;background:#1A2026}h2{font-size:18px;margin:0 0 6px}small{color:#A9B1B7;font-weight:400;font-size:13px}p{margin:4px 0}a{color:#DFFF1A}.d{white-space:pre-wrap;margin-top:8px}</style></head><body><main><h1>Project inquiries (${rows.length})</h1><p>Newest first. Kept for 12 months. Private page: do not share this link.</p>${rows.join("") || "<p>No inquiries yet.</p>"}</main></body></html>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...SECURITY } });
}

export default {
  async fetch(request, env) {
    const u0 = new URL(request.url);
    if (u0.pathname === "/api/inquiry") {
      if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);
      try { return await inquiry(request, env); } catch (e) { return json({ ok: false, error: "server" }, 500); }
    }
    if (u0.pathname === "/inbox") return inbox(u0, env);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const url = new URL(request.url);
    // One home: www and the misspelled harrisondevolpment.com both send visitors to harrisondev.org
    if (/(^www\.|harrisondevolpment\.com$)/.test(url.hostname)) { url.hostname = "harrisondev.org"; return Response.redirect(url.toString(), 301); }
    let key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    if (key === "" || key.endsWith("/")) key += "index.html";
    if (key.includes("..")) return new Response("Not found", { status: 404 });
    let body = await env.SITE.get(key, { type: "arrayBuffer" });
    if (!body && !key.includes(".")) { key += ".html"; body = await env.SITE.get(key, { type: "arrayBuffer" }); }
    if (!body) {
      return new Response("Page not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", ...SECURITY } });
    }
    const ext = key.split(".").pop().toLowerCase();
    const headers = new Headers({
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === "html" ? "public, max-age=300" : (ext === "css" || ext === "js") ? "public, max-age=600" : "public, max-age=604800",
      "Accept-Ranges": "bytes",
      ...SECURITY
    });
    const size = body.byteLength;
    const range = request.headers.get("Range");
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m) {
      let start = m[1] === "" ? size - Number(m[2]) : Number(m[1]);
      let end = m[1] !== "" && m[2] !== "" ? Number(m[2]) : size - 1;
      if (start < 0) start = 0;
      if (end >= size) end = size - 1;
      if (start > end || start >= size) {
        headers.set("Content-Range", `bytes */${size}`);
        return new Response(null, { status: 416, headers });
      }
      headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
      headers.set("Content-Length", String(end - start + 1));
      return new Response(request.method === "HEAD" ? null : body.slice(start, end + 1), { status: 206, headers });
    }
    headers.set("Content-Length", String(size));
    return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
  }
};
