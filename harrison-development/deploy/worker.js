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
export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const url = new URL(request.url);
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
      "Cache-Control": ext === "html" ? "public, max-age=300" : "public, max-age=604800",
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
