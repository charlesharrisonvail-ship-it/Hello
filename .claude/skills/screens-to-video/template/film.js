(() => {
const M = window.META;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  inC: t => t * t * t,
  outC: t => 1 - Math.pow(1 - t, 3),
  outQ: t => 1 - Math.pow(1 - t, 5),
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  ioQ: t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2,
  outBack: t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
const seg = (t, a, b, e = E.lin) => e(clamp((t - a) / (b - a)));
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      const k = (e || E.io)((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k);
    }
  }
  return keys[keys.length - 1][1];
}
let seed = 7;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const $ = id => document.getElementById(id);

const SW = 412, SH = 914;
const SUN = [160, 50], EYE = [10, 280];
const sizeOf = (name, w) => { const m = M[name]; let h = w * m.h / m.w; if (h > w * 1.35) { w = w * 1.35 * w / h; h = w * m.h / m.w; } return [w, h]; };

// ---------- camera, phone ----------
const PX = [[0, 960], [7.6, 960], [8.6, 1240], [18.2, 1240], [19.6, 960], [23.6, 960], [24.8, 1240]];
const PY = [[0, 1760], [4.0, 1760], [5.4, 540, E.outQ]];
const PS = [[0, 1.0], [7.6, 1.0], [8.6, 0.93], [18.5, 0.93], [19.7, 1.75, E.inC], [23.5, 1.75], [24.8, 0.93, E.outC]];
const PO = [[0, 1], [18.55, 1], [19.05, 0, E.lin], [24.15, 0], [24.6, 1, E.lin], [26.9, 1], [27.4, 0, E.lin]];
const CB = [[0, 1.0], [7.6, 1.0], [8.6, 0.93]];
const CLIP = [[0, 0], [18.45, 0], [19.75, 1], [23.45, 1], [24.75, 0]];
const ZOOM = [[0, 1], [18.0, 1], [21.9, 0.2], [23.3, 0.175, E.lin], [24.9, 1]];
const MAPC = [EYE[0] + 40, EYE[1] - 40];
const CAM = [[0, [0, 0]], [10.0, [0, 0]], [11.6, [20, 170]], [12.95, [20, 170]], [13.9, SUN], [15.85, SUN], [16.65, EYE], [18.0, EYE], [21.9, MAPC], [23.3, [MAPC[0] + 70, MAPC[1] + 10], E.lin], [24.9, EYE]];

const phoneAt = t => ({ x: kf(t, PX), y: kf(t, PY), s: kf(t, PS) });
const screenToStage = (t, sx, sy) => { const p = phoneAt(t); return [p.x + p.s * (sx - SW / 2), p.y + p.s * (sy - SH / 2)]; };
const canvasAt = t => { const p = phoneAt(t); const z = kf(t, ZOOM); return { ax: p.x, ay: p.y, s: kf(t, CB) * z, z, cam: kf(t, CAM) }; };
const canvasToScreen = (t, x, y) => { const c = canvasAt(t); const s = c.s / kf(t, CB); return [SW / 2 + (x - c.cam[0]) * s, SH / 2 + (y - c.cam[1]) * s]; };

// ---------- detail layout ----------
const dImgW = 312, dImgH = Math.min(560, dImgW * M.clouds.h / M.clouds.w), dImgTop = 104;
$('detailImg').style.cssText += ';top:' + dImgTop + 'px;height:' + dImgH + 'px';
const below = dImgTop + dImgH;
$('dTitle').style.top = (below + 26) + 'px';
$('dWho').style.top = (below + 58) + 'px';
$('dNote').style.top = (below + 104) + 'px';

// ---------- rings ----------
const SLOTS = [
  [-160, -330, 120], [160, -320, 124], [0, -335, 128],
  [-165, -150, 112], [168, -140, 112],
  [-160, 40, 124], [160, 50, 118],
  [-150, 230, 120], [165, 240, 124], [0, 330, 128],
  [-160, 410, 116], [155, 420, 112], [0, 520, 120],
  [-330, -250, 120], [330, -60, 120], [-330, 150, 120], [330, 330, 120], [-330, -480, 110], [330, -420, 110],
  [-320, 470, 110], [320, 560, 110], [0, -560, 120], [-170, 620, 110], [170, -560, 110], [170, 700, 110], [-170, -640, 110],
];
const RA = ['wrath', 'tree', 'birds', 'feet', 'swimmer', 'field', 'sun', 'pinkfield', 'pebbles', 'island', 'hand', 'geo', 'bluegrad', 'forest', 'collage', 'underwater', 'greenman', 'ski', 'beach', 'serena', 'knight', 'flowers', 'dog', 'sketch', 'illus', 'moto'];
const RB = ['bluegrad', 'beach', 'flowers', 'pebbles', 'illus', 'forest', 'subway', 'eye', 'swirl', 'field', 'moto', 'island', 'tennis', 'woman', 'toy', 'ski', 'swimmer', 'pinkfield', 'greenman', 'hand', 'group', 'birds', 'feet', 'tree', 'collage', 'geo'];
const RC = ['woman', 'swirl', 'group', 'gym', 'toy', 'sketch', 'knight', 'warrior', 'dog', 'moto', 'subway', 'flowers', 'tennis', 'serena', 'illus', 'collage', 'wrath', 'beach', 'birds', 'hand', 'field', 'pebbles', 'island', 'tree', 'geo', 'forest'];

const rect = (x, y, w, h, m = 0) => [x - w / 2 - m, y - h / 2 - m, x + w / 2 + m, y + h / 2 + m];
const hit = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const ringsEl = $('rings');
const actors = [];
function mk(name, cls) { const im = document.createElement('img'); im.src = 'drops/' + name + '.jpg'; im.className = 'drop' + (cls ? ' ' + cls : ''); return im; }

const [cw, ch] = [170, 170 * M.clouds.h / M.clouds.w];
const heroW = n => 170, trailW = 130;
const trails = { clouds: [0, 0], sun: SUN, eye: EYE };

function buildRing(center, names, bloom, scatter, nextHero, avoid) {
  SLOTS.forEach((s, i) => {
    const name = names[i]; if (!name) return;
    const [w, h] = sizeOf(name, s[2]);
    const x = center[0] + s[0], y = center[1] + s[1];
    if (name !== nextHero && avoid.some(r => hit(r, rect(x, y, w, h, 8)))) return;
    const d = Math.hypot(s[0], s[1]) || 1;
    const el = mk(name); ringsEl.appendChild(el);
    actors.push({ el, name, x, y, w, h, dir: [s[0] / d, s[1] / d], d,
      tb: bloom + 0.42 * Math.min(1.4, d / 600) + rnd() * 0.08, r0: (rnd() - .5) * 26,
      ts: name === nextHero ? null : scatter + (scatter ? rnd() * 0.12 + 0.12 * Math.min(1, d / 500) : 0),
      hero: name === nextHero });
  });
}
const cloudsTrail = () => rect(0, 0, trailW, trailW * M.clouds.h / M.clouds.w, 0);
const sunTrail = () => { const [w, h] = sizeOf('sun', trailW); return rect(SUN[0], SUN[1], w, h); };
buildRing([0, 0], RA, 7.25, 13.0, 'sun', [rect(0, 0, cw, ch, 6)]);
buildRing(SUN, RB, 13.75, 15.9, 'eye', [cloudsTrail(), rect(SUN[0], SUN[1], ...sizeOf('sun', 170), 10)]);
buildRing(EYE, RC, 16.55, null, null, [cloudsTrail(), sunTrail(), rect(EYE[0], EYE[1], ...sizeOf('eye', 170), 10)]);
const ringC = actors.filter(a => a.tb > 16);

const cloudsEl = mk('clouds'); ringsEl.appendChild(cloudsEl);
const sunA = actors.find(a => a.name === 'sun' && a.hero), eyeA = actors.find(a => a.name === 'eye' && a.hero);

// ---------- map ----------
const groups = { blue: [], green: [], warm: [], neutral: [] };
for (const [n, m] of Object.entries(M)) {
  if (n === 'hero-clouds') continue;
  const g = m.sat <= .15 ? 'neutral' : (m.hue >= .45 && m.hue <= .75) ? 'blue' : (m.hue >= .17 && m.hue < .45) ? 'green' : 'warm';
  groups[g].push(n);
}
const gNames = ['blue', 'green', 'warm', 'neutral'];
const seeds = [];
const gw = ['blue', 'neutral', 'warm', 'blue', 'green', 'neutral', 'warm', 'neutral', 'blue', 'green', 'warm', 'neutral', 'blue', 'warm'];
for (let i = 0; i < gw.length; i++) seeds.push([(rnd() - .5) * 11000 + MAPC[0], (rnd() - .5) * 6400 + MAPC[1], gw[i]]);
seeds.push([MAPC[0] - 900, MAPC[1] - 300, 'blue'], [MAPC[0] + 900, MAPC[1] + 400, 'green']);
const excl = [rect(EYE[0], EYE[1], 450, 960), cloudsTrail(), sunTrail(), ...ringC.map(a => rect(a.x, a.y, a.w, a.h, 24))];
const mapEl = $('map'); const mapActors = [];
const CELL = 232;
for (let gx = -26; gx <= 26; gx++) for (let gy = -15; gy <= 15; gy++) {
  if (rnd() < .1) continue;
  const x = MAPC[0] + gx * CELL + (rnd() - .5) * 110, y = MAPC[1] + gy * CELL + (rnd() - .5) * 110;
  let best = null, bd = 1e12; for (const s of seeds) { const d = (s[0] - x) ** 2 + (s[1] - y) ** 2; if (d < bd) { bd = d; best = s; } }
  const pool = groups[best[2]].length ? groups[best[2]] : groups.neutral;
  const name = pool[Math.floor(rnd() * pool.length)];
  const [w, h] = sizeOf(name, 86 + Math.pow(rnd(), 1.6) * 110);
  if (excl.some(r => hit(r, rect(x, y, w, h, 16)))) continue;
  const el = mk(name); el.style.width = w + 'px'; el.style.height = h + 'px'; mapEl.appendChild(el);
  mapActors.push({ el, x, y, w, h, tm: 18.35 + Math.hypot(x - EYE[0], (y - EYE[1]) * 1.4) / 6500 * 2.3 + rnd() * .15 });
}

// ---------- texts ----------
const textsEl = $('texts');
function block(lines, opts) {
  const el = document.createElement('div'); el.className = 'tblock';
  el.style.cssText = 'font-size:' + opts.size + 'px;font-weight:500;letter-spacing:-.035em;line-height:1.06;';
  const words = [];
  lines.forEach(line => { const l = document.createElement('span'); l.className = 'line';
    line.split(' ').forEach(w => { const s = document.createElement('span'); s.className = 'w' + (w.startsWith('*') ? ' acc' : ''); s.textContent = w.replace('*', ''); l.appendChild(s); words.push(s); });
    el.appendChild(l); });
  (opts.parent || textsEl).appendChild(el);
  return { el, words, ...opts };
}
const BL = [
  block(['You found one you *love.'], { size: 92, x: 960, y: 540, center: true, tin: 0.3, tout: 2.3 }),
  block(['Now find everything', 'that *feels *like *it.'], { size: 74, x: 196, y: 560, tin: 8.75, tout: 12.35 }),
  block(['Tap any image', 'to *follow *it.'], { size: 74, x: 196, y: 560, tin: 12.95, tout: 15.3 }),
  block(['And the *next.', 'And the *next.'], { size: 74, x: 196, y: 560, tin: 15.8, tout: 17.75 }),
  block(['Every image is a way in.'], { size: 60, parent: $('cap'), tin: 20.55, tout: 23.0, inline: true }),
  block(['Same Mood'], { size: 168, parent: $('endT'), tin: 27.45, tout: 99, inline: true }),
];
BL[4].el.style.position = BL[5].el.style.position = 'static';
BL[5].el.style.letterSpacing = '-.045em';
const endDot = document.createElement('span'); endDot.id = 'endDot'; $('endT').appendChild(endDot);
for (const b of BL) if (b.inline) b.words[b.words.length - 1].style.marginRight = '0';
function animWords(t, b) {
  b.words.forEach((w, i) => {
    const k = seg(t, b.tin + i * 0.085, b.tin + i * 0.085 + 0.65, E.outC);
    const ko = seg(t, b.tout + i * 0.035, b.tout + i * 0.035 + 0.42, E.inC);
    w.style.opacity = (k * (1 - ko)).toFixed(3);
    const bl = 16 * (1 - k) + 14 * ko;
    w.style.filter = bl > .05 ? 'blur(' + bl.toFixed(2) + 'px)' : 'none';
    w.style.transform = 'translateY(' + (24 * (1 - k) - 16 * ko).toFixed(2) + 'px)';
  });
  if (!b.inline) {
    const r = b.el.getBoundingClientRect();
    b.el.style.left = (b.center ? b.x - b.el.offsetWidth / 2 : b.x) + 'px';
    b.el.style.top = (b.y - b.el.offsetHeight / 2) + 'px';
  }
}

// ---------- touches ----------
const touchesEl = $('touches');
function touch() { const t = document.createElement('div'); t.className = 'abs touch'; const r = document.createElement('div'); r.className = 'abs ripple'; touchesEl.append(r, t); return { t, r }; }
const TOUCH = [
  { at: [[5.95, [287, 870]], [6.75, [287, 870]]], press: 6.25 },
  { at: [[9.85, [300, 650]], [10.0, [300, 650]], [11.6, [300, 480]], [11.85, [300, 480]]], press: null },
  { at: [[12.6, null], [13.05, null]], press: 12.82, target: () => sunA },
  { at: [[15.4, null], [15.85, null]], press: 15.62, target: () => eyeA },
  { at: [[17.35, [116, 300]], [17.6, [116, 300]], [18.3, [176, 400]], [18.5, [176, 400]]], press: null },
  { at: [[17.35, [296, 640]], [17.6, [296, 640]], [18.3, [236, 540]], [18.5, [236, 540]]], press: null },
  { at: [[24.95, [348, 865]], [25.45, [348, 865]]], press: 25.15 },
];
TOUCH.forEach(T => Object.assign(T, touch()));
function renderTouch(t, T) {
  const t0 = T.at[0][0], t1 = T.at[T.at.length - 1][0];
  const vis = seg(t, t0, t0 + .15) * (1 - seg(t, t1 - .15, t1));
  if (vis <= 0) { T.t.style.opacity = 0; T.r.style.opacity = 0; return; }
  let sp;
  if (T.target) { const a = T.target(); sp = canvasToScreen(T.press, a.x, a.y); }
  else { const keys = T.at.map(([tt, p]) => [tt, p, E.io]); sp = kf(t, keys); }
  const [x, y] = screenToStage(t, sp[0], sp[1]);
  const ps = phoneAt(t).s;
  let sc = lerp(.6, 1, seg(t, t0, t0 + .2, E.outC));
  if (T.press) sc *= 1 - .18 * Math.sin(Math.PI * seg(t, T.press - .12, T.press + .18));
  T.t.style.opacity = vis; T.t.style.transform = 'translate(' + (x - 29) + 'px,' + (y - 29) + 'px) scale(' + (sc * ps) + ')';
  if (T.press) { const k = seg(t, T.press, T.press + .55, E.outC); T.r.style.opacity = (k > 0 && k < 1) ? .9 * (1 - k) : 0; T.r.style.transform = 'translate(' + (x - 29) + 'px,' + (y - 29) + 'px) scale(' + (ps * (1 + 1.5 * k)) + ')'; }
  else T.r.style.opacity = 0;
}

// ---------- drops ----------
function place(el, x, y, w, h, o, sc = 1, rot = 0, blur = 0) {
  el.style.width = w + 'px'; el.style.height = h + 'px';
  el.style.opacity = o.toFixed(3);
  el.style.transform = 'translate(' + (x - w / 2).toFixed(2) + 'px,' + (y - h / 2).toFixed(2) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
  el.style.filter = blur > .05 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
}
function renderActor(t, a) {
  const kb = seg(t, a.tb, a.tb + 1.15);
  if (kb <= 0) { a.el.style.opacity = 0; return; }
  const kp = E.outQ(kb);
  let x = lerp(a.x + a.dir[0] * 680, a.x, kp), y = lerp(a.y + a.dir[1] * 680, a.y, kp);
  let sc = lerp(.55, 1, E.outC(kb)), rot = lerp(a.r0, 0, kp), blur = 11 * (1 - seg(t, a.tb, a.tb + .65, E.outC));
  let o = seg(t, a.tb, a.tb + .3);
  let w = a.w, h = a.h;
  if (a.ts) { const ks = seg(t, a.ts, a.ts + .75, E.inC); x += a.dir[0] * 700 * ks; y += a.dir[1] * 700 * ks; o *= 1 - seg(t, a.ts + .12, a.ts + .72); blur += 7 * ks; sc *= 1 - .15 * ks; }
  if (a.hero) {
    const pr = a.name === 'sun' ? 13.0 : 15.85, dm = a.name === 'sun' ? 15.85 : 99;
    const [hw] = sizeOf(a.name, 170), [tw] = sizeOf(a.name, trailW);
    const ww = lerp(lerp(a.w, hw, seg(t, pr, pr + .9, E.io)), tw, seg(t, dm, dm + .9, E.io));
    h = ww * a.h / a.w; w = ww;
  }
  if (o <= .001) { a.el.style.opacity = 0; return; }
  place(a.el, x, y, w, h, o, sc, rot, blur);
}

// ---------- main render ----------
const canvasEl = $('canvas'), clipEl = $('clip'), phoneEl = $('phone'), dotsEl = $('dots');
let mapShown = null;
window.render = function (t) {
  const p = phoneAt(t), po = kf(t, PO);
  phoneEl.style.transform = 'translate(' + (p.x - 218) + 'px,' + (p.y - 469) + 'px) scale(' + p.s + ')';
  phoneEl.style.opacity = po;
  const pb = 12 * seg(t, 26.9, 27.4);
  phoneEl.style.filter = pb > .05 ? 'blur(' + pb + 'px)' : 'none';

  // canvas
  const c = canvasAt(t);
  canvasEl.style.transform = 'translate(' + c.ax + 'px,' + c.ay + 'px) scale(' + c.s + ') translate(' + (-c.cam[0]) + 'px,' + (-c.cam[1]) + 'px)';
  const k = kf(t, CLIP);
  const hw = SW / 2 * p.s, hh = SH / 2 * p.s;
  const top = lerp(p.y - hh, 0, k), bottom = lerp(1080 - (p.y + hh), 0, k), left = lerp(p.x - hw, 0, k), right = lerp(1920 - (p.x + hw), 0, k);
  clipEl.style.clipPath = 'inset(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px round ' + lerp(50 * p.s, 0, k) + 'px)';
  const co = (t >= 6.6 ? 1 : 0) * (1 - seg(t, 26.9, 27.4));
  clipEl.style.opacity = co;
  clipEl.style.filter = t > 26.9 ? 'blur(' + (12 * seg(t, 26.9, 27.4)) + 'px)' : 'none';
  dotsEl.style.opacity = clamp((c.z - .3) / .35);

  // detail screen + intro card
  $('detail').style.opacity = 1 - seg(t, 6.6, 7.0);
  $('detailImg').style.visibility = (t >= 5.5 && t < 6.6) ? 'visible' : 'hidden';
  const ic = $('introCard');
  if (t >= 2.85 && t < 5.5) {
    const kin = seg(t, 2.85, 3.85, E.outC), kfl = seg(t, 4.0, 5.5, E.ioQ);
    const w0 = 360, h0 = w0 * M.clouds.h / M.clouds.w;
    const [tx, ty] = screenToStage(t, 50, dImgTop), tw = dImgW * p.s, th = dImgH * p.s;
    const x = lerp(960 - w0 / 2, tx, kfl), y = lerp(540 - h0 / 2 + 50 * (1 - kin), ty, kfl), w = lerp(w0, tw, kfl), h = lerp(h0, th, kfl);
    ic.style.display = 'block'; ic.style.width = w + 'px'; ic.style.height = h + 'px';
    ic.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + lerp(-5 * (1 - kin), 0, kfl) + 'deg) scale(' + lerp(.9, 1, kin) + ')';
    ic.style.opacity = seg(t, 2.85, 3.2); ic.style.filter = kin < 1 ? 'blur(' + 16 * (1 - kin) + 'px)' : 'none';
    ic.style.boxShadow = 'rgba(20,20,40,' + (.18 * (1 - kfl)) + ') 0 40px 80px, rgba(20,20,40,' + (.1 * (1 - kfl)) + ') 0 10px 22px';
  } else ic.style.display = 'none';
  // Related pill press
  const sp = 1 - .07 * Math.sin(Math.PI * seg(t, 6.13, 6.43));
  $('simPill').style.transform = 'scale(' + sp + ')';
  $('simPill').style.background = t > 6.25 && t < 6.7 ? '#e6e6e3' : '#f2f2f0';

  // same mood chrome
  const so = seg(t, 7.0, 7.5);
  $('sv').style.opacity = so;
  $('svPill').style.transform = 'translateX(-50%) translateY(' + (-16 * (1 - seg(t, 7.1, 7.7, E.outQ))) + 'px)';
  const unsaved = t >= 16.2 && t < 25.15;
  $('saveIcon').textContent = unsaved ? '+' : '✓'; $('saveIcon').style.color = unsaved ? '#2a2a2a' : '#e5572b';
  $('saveTxt').textContent = unsaved ? 'Save' : 'Saved';
  $('svSave').style.transform = 'scale(' + (1 + .08 * Math.sin(Math.PI * seg(t, 25.15, 25.45))) + ')';
  $('hint').style.opacity = seg(t, 7.6, 8.1) * (1 - seg(t, 12.6, 13.0));

  // clouds hero
  {
    const kk = seg(t, 6.6, 7.45, E.io);
    const x = 0, y = lerp(dImgTop + dImgH / 2 - SH / 2, 0, kk);
    let w = lerp(dImgW, cw, kk);
    w = lerp(w, trailW, seg(t, 13.0, 13.9, E.io));
    place(cloudsEl, x, y, w, w * M.clouds.h / M.clouds.w, t >= 6.6 ? 1 : 0);
    cloudsEl.style.boxShadow = 'rgba(0,0,0,' + (.10 * kk) + ') 0 6px 16px, rgba(0,0,0,' + (.08 * kk) + ') 0 1px 3px';
  }
  for (const a of actors) renderActor(t, a);
  // tap to open
  {
    const tto = $('tapToOpen');
    const phases = [[7.5, 12.95, [0, 0], 'clouds'], [13.9, 15.8, SUN, 'sun'], [16.65, 18.1, EYE, 'eye']];
    let o = 0, pos = [0, 0], nm = 'clouds';
    for (const [a, b, c2, n] of phases) { const v = seg(t, a, a + .3) * (1 - seg(t, b - .2, b)); if (v > o) { o = v; pos = c2; nm = n; } }
    const [w, h] = sizeOf(nm, 170);
    tto.style.opacity = o;
    tto.style.transform = 'translate(' + pos[0] + 'px,' + (pos[1] + h / 2 + 20) + 'px) translateX(-50%)';
  }
  // map
  const showMap = t >= 18.2 && t < 25.2;
  if (showMap !== mapShown) { mapEl.style.display = showMap ? 'block' : 'none'; mapShown = showMap; }
  if (showMap) for (const a of mapActors) {
    const kk = seg(t, a.tm, a.tm + .55, E.outC);
    a.el.style.opacity = kk.toFixed(3);
    a.el.style.transform = 'translate(' + (a.x - a.w / 2) + 'px,' + (a.y - a.h / 2) + 'px) scale(' + lerp(.8, 1, kk).toFixed(3) + ')';
  }

  // texts
  for (const b of BL) animWords(t, b);
  const lab = $('label');
  const lo = seg(t, 8.55, 9.1, E.outC) * (1 - seg(t, 17.75, 18.2));
  lab.style.opacity = lo; lab.style.filter = lo < 1 ? 'blur(' + 10 * (1 - lo) + 'px)' : 'none';
  lab.style.transform = 'translate(198px,' + (440 - 12 * (1 - lo)) + 'px)';
  const cap = $('cap');
  const capO = seg(t, 20.3, 20.8, E.outC) * (1 - seg(t, 23.1, 23.5));
  cap.style.opacity = capO; cap.style.transform = 'translate(-50%,-50%) scale(' + lerp(.92, 1, seg(t, 20.3, 21.0, E.outC)) + ')';
  // chip
  const chip = $('chip');
  {
    const kc = seg(t, 25.3, 26.15, E.outQ), ko = seg(t, 26.85, 27.3, E.inC);
    const [sx, sy] = screenToStage(t, 348, 865);
    const x = lerp(sx, 700, kc), y = lerp(sy, 600, kc);
    chip.style.opacity = seg(t, 25.3, 25.5) * (1 - ko);
    chip.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) scale(' + lerp(.35, 1, kc) + ')';
    const bl = 8 * (1 - seg(t, 25.3, 25.9)) + 10 * ko;
    chip.style.filter = bl > .05 ? 'blur(' + bl + 'px)' : 'none';
  }
  // end
  const ed = seg(t, 28.05, 28.6, E.outBack);
  endDot.style.transform = 'scale(' + ed + ')';
  const es = seg(t, 28.3, 28.95, E.outC);
  $('endSub').style.opacity = es; $('endSub').style.filter = es < 1 ? 'blur(' + 10 * (1 - es) + 'px)' : 'none';
  $('end').style.transform = 'translate(-50%,-50%) scale(' + lerp(1.0, 1.035, seg(t, 27.4, 30, E.outC)) + ')';
  $('end').style.opacity = t > 27.3 ? 1 : 0;

  for (const T of TOUCH) renderTouch(t, T);
};

window.ready = (async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  window.render(0);
  return true;
})();
const q = new URLSearchParams(location.search);
if (q.has('play')) { const t0 = performance.now(); const loop = () => { const t = ((performance.now() - t0) / 1000) % 30; window.render(t); requestAnimationFrame(loop); }; window.ready.then(loop); }
else if (q.has('t')) window.ready.then(() => window.render(+q.get('t')));
})();
