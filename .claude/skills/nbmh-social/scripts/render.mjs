// Render an NBMH post layout to a standard 1080 x 1350 (4:5) JPEG.
//
//   NODE_PATH=/opt/node22/lib/node_modules node scripts/render.mjs <in.html> <out.jpg>
//
// The HTML is loaded from disk so it can reference ../assets via relative
// file:// URLs. Output dimensions are fixed by the guidelines and are asserted
// after the screenshot is taken.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { statSync, readFileSync } from 'node:fs';

// Playwright lives in the global node prefix here, and ESM `import` does not
// honour NODE_PATH, so resolve it through require against the global root.
const require = createRequire(import.meta.url);
const roots = (process.env.NODE_PATH || '').split(':').filter(Boolean)
  .concat(['/opt/node22/lib/node_modules']);
let chromium;
for (const root of ['', ...roots]) {
  try { ({ chromium } = require(root ? resolve(root, 'playwright') : 'playwright')); break; }
  catch { /* try the next root */ }
}
if (!chromium) {
  console.error('playwright not found; install it or set NODE_PATH to the global node_modules');
  process.exit(1);
}

const W = 1080, H = 1350, QUALITY = 92;

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: render.mjs <in.html> <out.jpg>');
  process.exit(2);
}

const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
await page.goto('file://' + resolve(input), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: output,
  type: 'jpeg',
  quality: QUALITY,
  clip: { x: 0, y: 0, width: W, height: H },
  scale: 'css',
});
await browser.close();

// Assert the JPEG really is 1080 x 1350 by reading its SOF marker.
const buf = readFileSync(output);
let i = 2, dims = null;
while (i < buf.length - 9) {
  if (buf[i] !== 0xff) { i++; continue; }
  const marker = buf[i + 1];
  if (marker >= 0xc0 && marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)) {
    dims = { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    break;
  }
  i += 2 + buf.readUInt16BE(i + 2);
}
if (!dims || dims.width !== W || dims.height !== H) {
  console.error(`FAIL: expected ${W}x${H}, got ${dims ? `${dims.width}x${dims.height}` : 'unknown'}`);
  process.exit(1);
}
console.log(`${output}  ${dims.width}x${dims.height} JPEG  ${(statSync(output).size / 1024).toFixed(0)} KB`);
