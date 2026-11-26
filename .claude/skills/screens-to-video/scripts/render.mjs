import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
// usage: node render.mjs <film-dir with index.html> stills <out-dir> <t>...
//        node render.mjs <film-dir> video <out.mp4> [seconds=30] [fps=30]
const [, , dir, mode, out, ...rest] = process.argv;
if (!dir || !mode || !out) { console.error('usage: render.mjs <film-dir> stills|video <out> ...'); process.exit(1); }
const pwDir = process.env.PLAYWRIGHT_DIR || path.join(homedir(), '.cache/screens-to-video/pw/node_modules/playwright');
if (!existsSync(pwDir)) { console.error('playwright missing: npm i --prefix ~/.cache/screens-to-video/pw playwright'); process.exit(1); }
const { chromium } = await import(path.join(pwDir, 'index.mjs'));
let executablePath = process.env.CHROME;
if (!executablePath) {
  const cache = path.join(homedir(), 'Library/Caches/ms-playwright');
  const shells = existsSync(cache) ? readdirSync(cache).filter(d => d.startsWith('chromium_headless_shell-')).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]) : [];
  for (const s of shells) for (const sub of readdirSync(path.join(cache, s))) {
    const p = path.join(cache, s, sub, 'chrome-headless-shell'); if (existsSync(p)) { executablePath ??= p; }
  }
}
const browser = await chromium.launch({ executablePath, args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('pageerror', e.message));
await page.goto('file://' + path.resolve(dir, 'index.html'));
await page.evaluate(() => window.ready);
if (mode === 'stills') {
  for (const t of rest) { await page.evaluate(t => window.render(t), +t); await page.screenshot({ path: path.join(out, 't' + (+t).toFixed(2).padStart(5, '0') + '.png') }); }
} else {
  const dur = +(rest[0] || 30), fps = +(rest[1] || 30), n = Math.round(fps * dur);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end(); await new Promise((resolve, reject) => ff.on('close', (code, signal) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${signal ?? 'code ' + code}`))));
}
await browser.close();
