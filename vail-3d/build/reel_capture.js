// Records real gameplay frame by frame (fixed 1/30 s steps) from the AiRE copy of Vail 3D.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const OUT = '/tmp/claude-0/-home-user-Hello/c50d89cf-8d23-5f11-8425-ce4a2e60c0ba/scratchpad/reel/frames/';
const only = process.argv[2] ? process.argv[2].split(',') : null, limit = +process.argv[3] || 0;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  p.setDefaultTimeout(300000);
  p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('http://localhost:8766/vail-3d/');
  await p.waitForFunction(() => !document.getElementById('play').disabled, null, { timeout: 300000 });
  await p.addStyleTag({ content: '#keys,#touch,#prompt{display:none!important}' });
  await p.evaluate(() => window.__vail.record(true));
  const grab = async (shot, n, perFrame) => {
    fs.mkdirSync(OUT + shot, { recursive: true });
    const N = limit || n, t0 = Date.now();
    for (let f = 0; f < N; f++) {
      await p.evaluate(([f, src]) => { (new Function('f', src))(f); window.__vail.tick(1 / 30); }, [f, perFrame || '']);
      await p.screenshot({ path: `${OUT}${shot}/${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    }
    console.log(shot, N, 'frames', ((Date.now() - t0) / N / 1000).toFixed(2), 's/frame');
  };
  const setup = (src) => p.evaluate((src) => (new Function(src))(), src);
  const shots = {
    // A. aerial over the Front Side, drifting toward the summit
    flyover: async () => {
      await setup(`document.getElementById('start').classList.remove('on'); const v = window.__vail; v.orbit().enabled = false; v.S.mode = 'fly'; document.querySelectorAll('.hud').forEach((e) => e.style.visibility = 'hidden');`);
      await grab('flyover', 105, `const v = window.__vail, c = v.MAP().center, t = f / 105;
        const H = v.heightAt(c.x, c.z);
        v.camera.position.set(c.x - 2600 + t * 900, H + 2200 - t * 500, c.z - 7600 + t * 2200);
        v.camera.lookAt(c.x + 200, H + 300, c.z - 600); v.camera.fov = 48; v.camera.updateProjectionMatrix();`);
      await setup(`document.querySelectorAll('.hud').forEach((e) => e.style.visibility = '');`);
    },
    // B. snowboard, filmer cam, Blue Sky Basin
    board: async () => {
      await setup(`const v = window.__vail; document.getElementById('start').classList.add('on');`);
      await p.click('#gear .btn:nth-child(2)'); await p.click('#outfit .btn:nth-child(2)'); await p.click('#spawns .btn:nth-child(5)'); await p.click('#play');
      await setup(`const v = window.__vail; v.S.cam = 'filmer'; v.keys.w = true; for (let i = 0; i < 300; i++) v.tick(1/30); v.snapCam();`);
      await grab('board', 120, `const v = window.__vail; v.keys.w = true; v.keys.d = Math.sin(f / 18) > 0.7; v.keys.a = Math.sin(f / 18) < -0.7;`);
    },
    // C. skier through the Mid-Vail spruce, chase cam
    ski: async () => {
      await setup(`document.getElementById('start').classList.add('on');`);
      await p.click('#gear .btn:nth-child(1)'); await p.click('#outfit .btn:nth-child(1)'); await p.click('#spawns .btn:nth-child(8)'); await p.click('#play');
      await setup(`const v = window.__vail; v.S.cam = 'chase'; v.keys.w = true; for (let i = 0; i < 300; i++) v.tick(1/30); v.snapCam();`);
      await grab('ski', 120, `const v = window.__vail; v.keys.w = true; v.keys.d = Math.sin(f / 18) > 0.7; v.keys.a = Math.sin(f / 18) < -0.7;`);
    },
    // D. riding Mountaintop Express
    lift: async () => {
      await setup(`document.getElementById('start').classList.add('on');`);
      await p.click('#gear .btn:nth-child(1)'); await p.click('#outfit .btn:nth-child(4)'); await p.click('#spawns .btn:nth-child(1)'); await p.click('#play');
      await setup(`const v = window.__vail; const l = v.lifts.find((l) => /Mountain Top/.test(l.name)); v.boardLift(l); v.S.liftD = l.len * 0.35; v.tick(1/30); v.snapCam();`);
      await grab('lift', 90);
    },
    // E. a jump with a spin in the Back Bowls
    air: async () => {
      await setup(`document.getElementById('start').classList.add('on');`);
      await p.click('#gear .btn:nth-child(1)'); await p.click('#outfit .btn:nth-child(3)'); await p.click('#spawns .btn:nth-child(4)'); await p.click('#play');
      await setup(`const v = window.__vail; v.S.cam = 'chase'; v.keys.w = true; for (let i = 0; i < 280; i++) v.tick(1/30); v.snapCam();`);
      await grab('air', 90, `const v = window.__vail; if (f === 8) v.jump(); v.keys.w = f < 8 || f > 45; v.keys.d = f > 10 && f < 38;`);
    },
    // F. the trail map
    map: async () => {
      await setup(`const v = window.__vail; v.S.mode = 'ride'; v.openMap();`);
      fs.mkdirSync(OUT + 'map', { recursive: true });
      await p.screenshot({ path: OUT + 'map/0000.jpg', type: 'jpeg', quality: 95 });
      await setup(`window.__vail.closeMap();`);
    },
  };
  for (const [k, fn] of Object.entries(shots)) if (!only || only.includes(k)) await fn();
  await b.close();
})();
