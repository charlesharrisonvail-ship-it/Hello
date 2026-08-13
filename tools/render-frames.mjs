#!/usr/bin/env node
/**
 * Bakes the Three.js valley flythrough into WebP frame sequences.
 *
 * The runtime page never touches WebGL — it scrubs pre-rendered frames on a
 * 2D canvas, which is what keeps the scroll pinned at 60fps on hardware that
 * would choke on a live scene. This script is how those frames get made.
 *
 *   node render-frames.mjs [--frames 90] [--quality 0.72] [--out ../assets/frames]
 *
 * Output: assets/frames/<tier>/frame-####.webp plus a manifest.json the
 * client reads to decide which tier to pull.
 */

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const FRAME_COUNT = Number(arg('frames', 90));
const OUT_DIR = resolve(__dirname, arg('out', '../assets/frames'));

/**
 * Two render passes, each feeding one or more encoded tiers.
 *
 * The portrait pass exists because cover-fitting a 16:9 frame onto a
 * 390x844 phone scales by height — a 4.7x upscale of the `sm` tier. Rather
 * than ship a blurry hero, portrait gets its own render with a wider FOV,
 * which crops the valley the way a phone crop should rather than stretching
 * the landscape framing.
 *
 * Within a pass, the smaller tiers are downscales of the same drawing
 * buffer, so framing is identical across tiers and only one WebGL render is
 * paid for per pass.
 */
const PASSES = [
  {
    id: 'landscape',
    source: { width: 1600, height: 900, fov: 46 },
    tiers: [
      { id: 'lg', width: 1600, height: 900, quality: Number(arg('quality', 0.86)) },
      { id: 'md', width: 1024, height: 576, quality: Number(arg('quality-md', 0.82)) },
      { id: 'sm', width: 640,  height: 360, quality: Number(arg('quality-sm', 0.76)) }
    ]
  },
  {
    id: 'portrait',
    source: { width: 720, height: 1280, fov: 58 },
    tiers: [
      { id: 'pt', width: 720, height: 1280, quality: Number(arg('quality-pt', 0.82)) }
    ]
  }
];

const TIERS = PASSES.flatMap((p) => p.tiers.map((t) => ({ ...t, pass: p.id })));

/** Frames also used as static posters for the no-JS / reduced-motion path. */
const POSTER_FRAMES = [0, Math.floor(FRAME_COUNT * 0.5), FRAME_COUNT - 1];

/* ------------------------------------------------------------------ */
/* Static server — lets the scene use real ESM imports for three.       */
/* ------------------------------------------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function startServer() {
  const roots = {
    '/three': resolve(__dirname, 'node_modules/three'),
    '': resolve(__dirname, 'scene')
  };

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      let filePath;
      if (url.pathname.startsWith('/three/')) {
        filePath = join(roots['/three'], url.pathname.slice('/three/'.length));
      } else {
        filePath = join(roots[''], url.pathname === '/' ? '/scene.html' : url.pathname);
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });

  return new Promise((ok) => {
    server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port }));
  });
}

/* ------------------------------------------------------------------ */
/* Bake                                                                */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(4, '0');

async function main() {
  const { server, port } = await startServer();
  console.log(`[bake] scene server on :${port}`);

  // Environments that ship a pre-installed Chromium (CI containers, the
  // Claude Code sandbox) often carry a build number the npm package does not
  // expect. Point at it explicitly rather than re-downloading 150 MB.
  const explicitChrome = process.env.CHROMIUM_PATH ?? [
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/opt/pw-browsers/chromium/chrome-linux/chrome'
  ].find((p) => existsSync(p));

  const browser = await chromium.launch({
    ...(explicitChrome ? { executablePath: explicitChrome } : {}),
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-lcd-text'
    ]
  });

  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('pageerror', (e) => console.error('[scene error]', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.error('[scene console]', m.text());
  });

  await page.goto(`http://127.0.0.1:${port}/scene.html`, { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true', null, { timeout: 30_000 });
  console.log('[bake] scene ready');

  // Clean slate — stale frames from a shorter run would leave orphans that
  // the manifest no longer references but the repo still carries.
  for (const tier of TIERS) {
    const dir = join(OUT_DIR, tier.id);
    if (existsSync(dir)) await rm(dir, { recursive: true });
    await mkdir(dir, { recursive: true });
  }
  await mkdir(resolve(OUT_DIR, '../img'), { recursive: true });

  const bytes = Object.fromEntries(TIERS.map((t) => [t.id, 0]));
  const started = Date.now();

  for (let i = 0; i < FRAME_COUNT; i++) {
    const t = FRAME_COUNT === 1 ? 0 : i / (FRAME_COUNT - 1);

    for (const pass of PASSES) {
      // One WebGL render per pass; every tier in it is an encode of the same
      // drawing buffer.
      await page.evaluate(({ width, height, fov, time }) => {
        window.__setViewport(width, height, fov);
        window.__renderAt(time);
      }, { ...pass.source, time: t });

      for (const tier of pass.tiers) {
        const dataUrl = await page.evaluate(
          ({ w, h, q }) => window.__encode(w, h, q),
          { w: tier.width, h: tier.height, q: tier.quality }
        );
        const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
        bytes[tier.id] += buf.length;
        await writeFile(join(OUT_DIR, tier.id, `frame-${pad(i)}.webp`), buf);
      }
    }

    if (i % 10 === 0 || i === FRAME_COUNT - 1) {
      console.log(`[bake] frame ${i + 1}/${FRAME_COUNT}`);
    }
  }

  // Posters: full-width stills for reduced-motion, save-data and no-JS.
  for (const idx of POSTER_FRAMES) {
    const t = idx / (FRAME_COUNT - 1);
    await page.evaluate(({ time }) => {
      window.__setViewport(1600, 900, 46);
      window.__renderAt(time);
    }, { time: t });
    const dataUrl = await page.evaluate(() => window.__encode(1600, 900, 0.82));
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    await writeFile(resolve(OUT_DIR, `../img/poster-${pad(idx)}.webp`), buf);
  }

  const manifest = {
    generated: new Date().toISOString().slice(0, 10),
    frameCount: FRAME_COUNT,
    pattern: '{tier}/frame-{index}.webp',
    indexPad: 4,
    aspect: 16 / 9,
    tiers: TIERS.map((t) => ({
      id: t.id,
      width: t.width,
      height: t.height,
      orientation: t.width >= t.height ? 'landscape' : 'portrait',
      bytes: bytes[t.id],
      avgFrameBytes: Math.round(bytes[t.id] / FRAME_COUNT)
    })),
    posters: POSTER_FRAMES.map((i) => `img/poster-${pad(i)}.webp`)
  };
  await writeFile(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  await browser.close();
  server.close();

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n[bake] done in ${secs}s`);
  for (const tier of TIERS) {
    const mb = (bytes[tier.id] / 1048576).toFixed(2);
    const kb = Math.round(bytes[tier.id] / FRAME_COUNT / 1024);
    console.log(`[bake]   ${tier.id}: ${mb} MB total, ~${kb} KB/frame`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
