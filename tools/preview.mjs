#!/usr/bin/env node
/**
 * Screenshots the landing page at a set of scroll positions so the film can
 * be reviewed without a browser in the loop.
 *
 *   node preview.mjs [--out <dir>] [--width 1440] [--height 900]
 *   node preview.mjs --mobile          # 390x844, DPR 3
 *   node preview.mjs --reduced-motion  # verify the static fallback
 *
 * Exits non-zero if the page logged any console error or page error, so it
 * doubles as a smoke test.
 */

import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, dirname, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(__dirname, '..');

const has = (name) => process.argv.includes(`--${name}`);
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const MOBILE = has('mobile');
const REDUCED = has('reduced-motion');
const OUT = resolve(arg('out', join(__dirname, '../.preview')));

const VIEWPORT = MOBILE
  ? { width: 390, height: 844 }
  : { width: Number(arg('width', 1440)), height: Number(arg('height', 900)) };

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      const rel = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
      const filePath = normalize(join(SITE_ROOT, rel));
      if (!filePath.startsWith(SITE_ROOT)) throw new Error('escape');
      const body = await readFile(filePath);
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((ok) => {
    server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port }));
  });
}

/** Fractions of the film's scroll span to capture. */
const FILM_STOPS = [0, 0.16, 0.33, 0.5, 0.66, 0.84, 1];

async function main() {
  const { server, port } = await startServer();
  await mkdir(OUT, { recursive: true });

  const explicitChrome = process.env.CHROMIUM_PATH ?? [
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/opt/pw-browsers/chromium/chrome-linux/chrome'
  ].find((p) => existsSync(p));

  const browser = await chromium.launch({
    ...(explicitChrome ? { executablePath: explicitChrome } : {}),
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });

  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: MOBILE ? 3 : 1,
    isMobile: MOBILE,
    hasTouch: MOBILE,
    reducedMotion: REDUCED ? 'reduce' : 'no-preference'
  });

  const problems = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text()}`);
  });
  page.on('requestfailed', (r) => {
    problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText ?? ''}`);
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });

  const suffix = MOBILE ? 'mobile' : REDUCED ? 'reduced' : 'desktop';

  const filmHeight = await page.evaluate(() => {
    const el = document.querySelector('[data-film]');
    return el ? el.getBoundingClientRect().height : 0;
  });
  const span = Math.max(1, filmHeight - VIEWPORT.height);

  for (const [i, stop] of FILM_STOPS.entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(span * stop));
    // Let the smoothed timeline settle and the target frame decode.
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, `${suffix}-film-${i}.png`) });
  }

  // The standard sections below the film. Discovered from the document
  // rather than hard-coded, so renaming a section cannot leave this silently
  // screenshotting whatever was already on screen.
  const sectionIds = await page.evaluate(() =>
    [...document.querySelectorAll('main section[id]')]
      .map((el) => el.id)
      .filter((id) => id !== 'top')
  );

  for (const id of sectionIds) {
    const found = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      return true;
    }, `#${id}`);
    if (!found) { problems.push(`missing section #${id}`); continue; }
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(OUT, `${suffix}-${id}.png`) });
  }

  // Report what the runtime actually chose.
  const chosen = await page.evaluate(() => ({
    cinema: document.documentElement.classList.contains('cinema'),
    canvasLive: document.querySelector('[data-film-canvas]')?.classList.contains('is-live'),
    backing: (() => {
      const c = document.querySelector('[data-film-canvas]');
      return c ? `${c.width}x${c.height}` : null;
    })()
  }));

  await browser.close();
  server.close();

  console.log(`[preview] ${suffix}: ${JSON.stringify(chosen)}`);
  console.log(`[preview] wrote ${FILM_STOPS.length + sectionIds.length} shots to ${OUT}`);

  if (problems.length) {
    console.error(`\n[preview] ${problems.length} problem(s):`);
    for (const p of [...new Set(problems)]) console.error('  - ' + p);
    process.exit(1);
  }
  console.log('[preview] no console errors, no failed requests');
}

main().catch((err) => { console.error(err); process.exit(1); });
