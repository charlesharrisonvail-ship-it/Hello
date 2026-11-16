// Renders graphics.html to video, frame by frame, with the preinstalled Playwright + ffmpeg.
//   node render.js [outDir]
// Per scene: <scene>-alpha.webm (transparent, to lay over footage) and <scene>.mp4 (on black).
// Plus reel-preview.mp4: every graphic in order on the sunset background.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const outDir = path.resolve(process.argv[2] || path.join(__dirname, 'out'));
const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'frames-'));
const ff = (...a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a]);

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'graphics.html'));
  await page.evaluate(() => document.fonts.ready);
  const { scenes, dur } = await page.evaluate(() => ({ scenes: SCENES, dur: DUR }));
  const lengthOf = s => dur[s] ?? dur.card;

  async function frames(dir, scene, omitBackground) {
    fs.mkdirSync(dir, { recursive: true });
    const n = Math.round(lengthOf(scene) * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(([s, t]) => render(s, t), [scene, i / FPS]);
      await page.screenshot({ path: path.join(dir, `${String(i).padStart(4, '0')}.png`), omitBackground });
    }
  }

  // Transparent passes
  for (const s of scenes) {
    const dir = path.join(tmp, s);
    await frames(dir, s, true);
    const input = ['-framerate', String(FPS), '-i', path.join(dir, '%04d.png')];
    ff(...input, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '4M', '-auto-alt-ref', '0',
       path.join(outDir, `${s}-alpha.webm`));
    ff('-f', 'lavfi', '-i', `color=black:s=1920x1080:r=${FPS}`, ...input,
       '-filter_complex', '[0][1]overlay=shortest=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
       '-crf', '20', path.join(outDir, `${s}.mp4`));
    console.log('rendered', s);
  }

  // Preview reel on the sunset background
  await page.evaluate(() => document.body.classList.add('preview'));
  const list = [];
  for (const s of scenes) {
    const dir = path.join(tmp, 'preview-' + s);
    await frames(dir, s, false);
    const clip = path.join(tmp, `preview-${s}.mp4`);
    ff('-framerate', String(FPS), '-i', path.join(dir, '%04d.png'),
       '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', clip);
    list.push(`file '${clip}'`);
  }
  fs.writeFileSync(path.join(tmp, 'list.txt'), list.join('\n'));
  ff('-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy',
     path.join(outDir, 'reel-preview.mp4'));
  console.log('rendered reel-preview');

  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
})();
