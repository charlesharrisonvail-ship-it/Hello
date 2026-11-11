// Renders the 3D map's fallback still and saves label positions into index.html.
// Usage: python3 -m http.server 8765 --directory harrison-development & node harrison-development/tools/map-still.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.goto('http://localhost:8765/#markets');
  await p.locator('#mapStage').scrollIntoViewIfNeeded();
  await p.waitForFunction(() => window.__hdMapReady, null, { timeout: 60000 });
  await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '.map-labels{display:none!important}.map-stage{border-radius:0!important;box-shadow:none!important}' });
  const out = path.join(__dirname, '..', 'assets', 'map', 'colorado-3d.png');
  await p.locator('#mapStage').screenshot({ path: out });
  const pos = await p.evaluate(() => [...document.querySelectorAll('#mapStage [data-lon]')].map(e => [e.style.left, e.style.top]));
  await b.close();
  const f = path.join(__dirname, '..', 'index.html'); let s = fs.readFileSync(f, 'utf8'); let i = 0;
  s = s.replace(/data-x="[\d.]+" data-y="[\d.]+"/g, () => { const [x, y] = pos[i++]; return `data-x="${parseFloat(x).toFixed(1)}" data-y="${parseFloat(y).toFixed(1)}"`; });
  fs.writeFileSync(f, s); console.log('labels', i, out);
})();
