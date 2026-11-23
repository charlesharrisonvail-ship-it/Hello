// usage: node render.js <from> <to> <stepEvery> <outdir>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const [from, to, every, out] = [+process.argv[2], +process.argv[3], +(process.argv[4] || 1), process.argv[5] || 'frames'];
const root = __dirname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.f32': 'application/octet-stream' };
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); } });
}).listen(0, async () => {
  const port = srv.address().port;
  fs.mkdirSync(path.join(root, out), { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', m => console.log('page:', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`http://localhost:${port}/scene.html`);
  await p.waitForFunction('window.ready === true', null, { timeout: 180000 });
  const t0 = Date.now();
  for (let f = from; f < to; f += every) {
    await p.evaluate(f => window.renderFrame(f), f);
    await p.screenshot({ path: path.join(root, out, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    if (f % 60 === 0) console.log('frame', f, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  await b.close(); srv.close();
});
