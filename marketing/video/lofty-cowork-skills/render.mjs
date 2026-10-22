// Renders scene.html to an MP4 by stepping window.renderAt() frame by frame.
// Usage: node render.mjs [out.mp4]   (needs Playwright's Chromium and ffmpeg)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, 'lofty-cowork-skills.mp4');
const FPS = 30;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(here, 'scene.html'));
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.DURATION);

const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'ignore', 'inherit'] });

for (let f = 0; f < duration * FPS; f++) {
  await page.evaluate(t => window.renderAt(t), f / FPS);
  ff.stdin.write(await page.screenshot({ type: 'jpeg', quality: 92 }));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out);
