/**
 * Zero-dependency static file server for the demo site in `site/`.
 * Playwright starts this automatically via the `webServer` block in
 * playwright.config.ts; run it by hand with `npm run serve`.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site', import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? '127.0.0.1';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}:${port}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  if (!extname(pathname)) pathname += '.html';

  // Contain every request inside `site/`, no matter what path is requested.
  const filePath = join(root, normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    const notFound = await readFile(join(root, '404.html')).catch(() => '404 Not Found');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(notFound);
  }
});

server.listen(port, host, () => {
  console.log(`serving ${root} at http://${host}:${port}`);
});
