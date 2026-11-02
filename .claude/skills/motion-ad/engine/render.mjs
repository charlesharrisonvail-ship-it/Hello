#!/usr/bin/env node
// Render a motion-ad spec to MP4, a standalone HTML preview, and/or stills.
//
//   node render.mjs <spec.json> [--out ad.mp4] [--html ad.html] [--stills dir] [--check]
//
// Needs Node 18+, Playwright (with Chromium) and ffmpeg on PATH for --out.
// Brand guards run first; a spec that breaks one is refused before anything renders.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const specPath = args[0];
if (!specPath || specPath.startsWith('--')) {
  console.error('usage: node render.mjs <spec.json> [--out ad.mp4] [--html ad.html] [--stills dir] [--check]');
  process.exit(2);
}

const spec = JSON.parse(await readFile(specPath, 'utf8'));
if (!spec.brand) fail('spec has no "brand" - pick exactly one: "epivail" or "aire-estate"');
const brand = JSON.parse(await readFile(path.join(here, '..', 'brands', spec.brand + '.json'), 'utf8').catch(() => fail(`unknown brand "${spec.brand}"`)));

// The real logo file, inlined so the preview HTML stands alone.
if (brand.logo) {
  const png = await readFile(path.join(here, '..', 'brands', brand.logo)).catch(() => fail(`logo file missing: brands/${brand.logo} - use the real file, never redraw it`));
  brand.logoSrc = 'data:image/png;base64,' + png.toString('base64');
}

if (brand.parent) {
  const load = f => readFile(path.join(here, '..', 'brands', f)).then(b => 'data:image/png;base64,' + b.toString('base64')).catch(() => fail(`logo file missing: brands/${f}`));
  brand.parentLogoSrc = await load(brand.parent.logo);
  brand.parentMarkSrc = await load(brand.parent.mark);
}

// QR code for the brand's link (e.g. the live avatar card), drawn by segno.
if (brand.qr) {
  const { execFileSync } = await import('node:child_process');
  const png = execFileSync('python3', ['-c', "import segno,sys,io; b=io.BytesIO(); segno.make(sys.argv[1], error='m').save(b, kind='png', scale=12, border=2, dark='#0a1628', light='#ffffff'); sys.stdout.buffer.write(b.getvalue())", brand.qr.url]);
  brand.qrSrc = 'data:image/png;base64,' + png.toString('base64');
}

// --- brand guards -----------------------------------------------------------
const copy = JSON.stringify(spec.scenes);
const problems = [];
for (const b of brand.guards.banned) if (copy.includes(b)) problems.push(`"${b}" is not allowed in ${brand.id} videos`);
for (const rule of brand.guards.ifMentions) {
  let text = copy;
  for (const e of rule.except || []) text = text.split(e).join('');
  if (text.includes(rule.text) && !copy.includes(rule.require)) problems.push(`mentions "${rule.text}" without "${rule.require}"`);
}
if (spec.brand === 'epivail' && !['agent-attraction', 'luxury-resimercial'].includes(spec.audience))
  problems.push('EpiVail spec needs "audience": "agent-attraction" or "luxury-resimercial" (one audience per piece, never both)');
if (!spec.scenes?.length) problems.push('no scenes');
if (problems.length) fail('brand check failed:\n  - ' + problems.join('\n  - '));
const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
console.log(`brand check passed: ${brand.id}, ${spec.scenes.length} scenes, ${total.toFixed(1)}s`);
if (args.includes('--check')) process.exit(0);

const engine = await readFile(path.join(here, 'motion-ad.html'), 'utf8');
const inject = `<script>window.SPEC=${JSON.stringify(spec)};window.BRAND=${JSON.stringify(brand)};</script>`;
const standalone = engine.replace('<div id="stage"></div>', '<div id="stage"></div>\n' + inject);

const htmlOut = opt('--html');
if (htmlOut) { await writeFile(htmlOut, standalone); console.log('wrote', htmlOut); }

const out = opt('--out'), stills = opt('--stills');
if (!out && !stills) process.exit(0);

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const vertical = spec.format === 'vertical';
const W = vertical ? 1080 : 1920, H = vertical ? 1920 : 1080;
const page = await browser.newPage({ viewport: { width: W, height: H } });
const tmp = path.join(os.tmpdir(), `motion-ad-${process.pid}.html`);
await writeFile(tmp, standalone.replace('<script>window.SPEC', '<script>window.RENDER=true;window.SPEC'));
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
// Touch every scene once so each font face is requested, then wait for them.
const scenes = await page.evaluate(() => MOTION.scenes);
for (const s of scenes) await page.evaluate(t => MOTION.seek(t), s.start + s.dur / 2);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

if (stills) {
  await mkdir(stills, { recursive: true });
  for (const [i, s] of scenes.entries()) {
    await page.evaluate(t => MOTION.seek(t), s.start + s.dur - .45);
    const f = path.join(stills, `${String(i + 1).padStart(2, '0')}-${s.label.replace(/\W+/g, '-').toLowerCase()}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 90 });
  }
  console.log('wrote stills to', stills);
}

if (out) {
  const fps = spec.fps || 30, frames = Math.round(total * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg exited ' + c)) : res()));
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => MOTION.seek(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % (fps * 5) === 0) process.stdout.write(`\rframe ${i}/${frames}`);
  }
  ff.stdin.end();
  await done;
  console.log(`\rwrote ${out} (${frames} frames, ${total.toFixed(1)}s @ ${fps}fps)`);
}
await browser.close();
await import('node:fs/promises').then(fs => fs.unlink(tmp)).catch(() => {});

function fail(msg) { console.error(msg); process.exit(1); }
