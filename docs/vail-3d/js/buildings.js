// Mountain buildings for Vail 3D, built procedurally from docs/media/aire-retreat-poster.jpg.
// Measured from the poster: main wing gable ~48 deg, gable face ~1.06 x wall-to-ridge height,
// eave at ~42% of ridge height, low wing ~0.75 of main width at ~85% of the main eave,
// fieldstone plinth ~0.5 of eave height, chimney rising ~1.2 m past the ridge.
// Units are metres; +z is the glazed front, which the game turns to face downhill.
import * as THREE from 'three';

// Daylight albedos. The poster is shot at dusk, so each sampled colour keeps its hue
// and is lifted to a daylight value (see the report in vail-3d/README.md).
export const LODGE_PALETTE = {
  roof: 0x2b2e36,      // charcoal standing-seam metal   (sampled #262634)
  cedar: 0x8a5a3a,     // warm cedar siding              (sampled #361a0a)
  soffit: 0xa06e45,    // tongue-and-groove soffit       (sampled #392118)
  stone: 0x8b8780,     // grey fieldstone                (sampled #35373a)
  mullion: 0x1c1f26,   // black steel window frames      (sampled #191e2b)
  beam: 0x2a3140,      // dark steel deck beam           (sampled #1d2737)
  glow: 0xffb15c,      // interior lamplight             (sampled #734829)
  snow: 0xf7faff,      // winter load on the roofs (added for Vail; not in the poster)
};

const mats = {};
// how brightly the interiors glow: full at dusk (the poster), softer in daylight
export const GLOW = { value: 0.55 };
export function setDaylight(day) { GLOW.value = day ? 0.32 : 0.9; for (const k of ['glass', 'glassGable']) if (mats[k]) mats[k].emissiveIntensity = GLOW.value; }
function M(key) {
  if (mats[key]) return mats[key];
  const P = LODGE_PALETTE;
  const def = {
    roof: { color: P.roof, roughness: 0.45, metalness: 0.55 },
    cedar: { color: P.cedar, roughness: 0.85 },
    soffit: { color: P.soffit, roughness: 0.7 },
    stone: { color: P.stone, roughness: 0.95, map: stoneTexture() },
    mullion: { color: P.mullion, roughness: 0.4, metalness: 0.6 },
    beam: { color: P.beam, roughness: 0.5, metalness: 0.5 },
    glass: { color: 0x22303d, roughness: 0.06, metalness: 0.55, emissive: 0xffffff, emissiveMap: interiorTexture(1, 1, 0), emissiveIntensity: GLOW.value },
    glassGable: { color: 0x22303d, roughness: 0.06, metalness: 0.55, emissive: 0xffffff, emissiveMap: interiorTexture(1 / 11.7, 1 / 11.2, 0.5), emissiveIntensity: GLOW.value },
    rail: { color: 0x9fc7dd, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.28, depthWrite: false },
    snow: { color: P.snow, roughness: 0.9 },
    concrete: { color: 0xb9b6ae, roughness: 0.9 },
    steel: { color: 0x8d96a0, roughness: 0.4, metalness: 0.65 },
    wheel: { color: 0xd9452b, roughness: 0.5, metalness: 0.3 },
  }[key];
  return (mats[key] = new THREE.MeshStandardMaterial(def));
}
function interiorTexture(rx, ry, ox) {
  // what the poster shows through the glass: warm timber ceiling, pendant lamps,
  // a stone fireplace with a fire, sofas along the floor
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#b97a3e'); g.addColorStop(0.55, '#7a4a24'); g.addColorStop(1, '#3a2414');
  x.fillStyle = g; x.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 512; i += 18) { x.fillStyle = 'rgba(60,30,10,.18)'; x.fillRect(i, 0, 3, 140); }        // ceiling boards
  x.fillStyle = '#6b6560'; x.fillRect(220, 95, 74, 120);                                                   // fireplace stone
  const f = x.createRadialGradient(257, 185, 4, 257, 185, 30); f.addColorStop(0, '#fff2b0'); f.addColorStop(1, 'rgba(255,120,30,0)');
  x.fillStyle = '#2a1a10'; x.fillRect(237, 165, 40, 32); x.fillStyle = f; x.fillRect(222, 150, 70, 60);
  for (const lx of [90, 160, 360, 430]) {                                                                // pendants
    const l = x.createRadialGradient(lx, 70, 2, lx, 70, 40); l.addColorStop(0, 'rgba(255,240,200,1)'); l.addColorStop(1, 'rgba(255,200,120,0)');
    x.fillStyle = l; x.fillRect(lx - 40, 30, 80, 80); x.fillStyle = '#1a120c'; x.fillRect(lx - 1, 0, 2, 62);
  }
  x.fillStyle = 'rgba(40,28,22,.9)';
  for (const [sx, w] of [[30, 150], [320, 170]]) { x.beginPath(); x.roundRect(sx, 205, w, 40, 8); x.fill(); }   // sofas
  x.fillStyle = 'rgba(20,14,10,.95)'; x.fillRect(0, 244, 512, 12);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.repeat.set(rx, ry); t.offset.set(ox, 0); return t;
}
function stoneTexture() {
  // irregular fieldstone courses, like the plinth and chimney in the poster
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'); let seed = 9; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  x.fillStyle = '#6f6b65'; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) {
    const cx = r() * 256, cy = r() * 256, rx = 9 + r() * 16, ry = 6 + r() * 10, v = 105 + r() * 85 | 0;
    x.fillStyle = `rgb(${v},${v - 3},${v - 9})`;
    x.beginPath(); x.ellipse(cx, cy, rx, ry, r() * 0.6 - 0.3, 0, 7); x.fill();
    x.strokeStyle = 'rgba(40,38,35,.55)'; x.lineWidth = 2; x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); return t;
}

const box = (w, h, d, mat, x, y, z, parent) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(mat)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };

// a pitched roof: two slabs meeting at the ridge, metal on top, wood soffit beneath, snow on top
function gableRoof(g, W, D, eave, pitchDeg, over, snow) {
  const p = THREE.MathUtils.degToRad(pitchDeg), half = W / 2 + over;
  const slab = half / Math.cos(p), rise = (W / 2) * Math.tan(p);
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(0, eave + rise, 0); pivot.rotation.z = -s * p; g.add(pivot);
    box(slab, 0.22, D + over * 2, 'roof', s * slab / 2, 0.11, 0, pivot);
    box(slab - 0.1, 0.06, D + over * 2 - 0.1, 'soffit', s * slab / 2, -0.04, 0, pivot);
    if (snow) box(slab - 0.25, 0.32, D + over * 2 - 0.3, 'snow', s * slab / 2, 0.36, 0, pivot);
  }
  return eave + rise;
}
// a glazed gable end: pentagon of glass with a 4 x 2 mullion grid and verticals into the peak
function glazedGable(g, W, eave, ridge, z, cols = 4) {
  const sh = new THREE.Shape();
  sh.moveTo(-W / 2, 0); sh.lineTo(W / 2, 0); sh.lineTo(W / 2, eave); sh.lineTo(0, ridge); sh.lineTo(-W / 2, eave); sh.closePath();
  const glass = new THREE.Mesh(new THREE.ShapeGeometry(sh), M('glassGable')); glass.position.z = z; g.add(glass);
  const roofY = (x) => eave + (ridge - eave) * (1 - Math.abs(x) / (W / 2));
  for (let i = 0; i <= cols; i++) {
    const x = -W / 2 + (i * W) / cols, h = roofY(x);
    box(0.14, h, 0.16, 'mullion', x, h / 2, z + 0.05, g);
  }
  for (const y of [0.08, eave * 0.5, eave]) box(W, 0.14, 0.16, 'mullion', 0, y, z + 0.05, g);
  // the raking frame under the roof edges
  const rake = Math.hypot(W / 2, ridge - eave), ang = Math.atan2(ridge - eave, W / 2);
  for (const s of [-1, 1]) { const m = box(rake, 0.16, 0.16, 'mullion', s * W / 4, (eave + ridge) / 2, z + 0.05, g); m.rotation.z = -s * ang; }
}

export function buildLodge({ snow = true } = {}) {
  const g = new THREE.Group();
  // main wing (poster right): 12 m gable face, 14 m deep (depth inferred), 4.8 m to the eave, 48 deg pitch
  const W = 12, D = 14, eave = 4.8;
  const main = new THREE.Group(); main.position.x = 2.5; g.add(main);
  box(W + 0.4, 2.4, D + 0.4, 'stone', 0, -1.2, 0, main);                    // fieldstone plinth
  box(0.3, eave, D, 'cedar', -W / 2 + 0.15, eave / 2, 0, main);               // cedar side walls
  box(0.3, eave, D, 'cedar', W / 2 - 0.15, eave / 2, 0, main);
  const ridge = gableRoof(main, W, D, eave, 48, 0.9, snow);
  glazedGable(main, W - 0.3, eave, ridge - 0.3, D / 2, 4);
  // rear gable in cedar (inferred: the poster shows only the front)
  const back = new THREE.Shape(); back.moveTo(-W / 2, 0); back.lineTo(W / 2, 0); back.lineTo(W / 2, eave); back.lineTo(0, ridge - 0.2); back.lineTo(-W / 2, eave); back.closePath();
  const bk = new THREE.Mesh(new THREE.ShapeGeometry(back), M('cedar')); bk.position.z = -D / 2; bk.rotation.y = Math.PI; main.add(bk);
  // fieldstone chimney on the right slope, near the front, 1.2 m past the ridge
  const chTop = ridge + 1.6;
  // exterior fieldstone chimney climbing the right side wall, as in the poster
  const ch = box(1.8, chTop + 2.4, 1.8, 'stone', W / 2 + 0.75, (chTop - 2.4) / 2, D / 2 - 4.5, main);
  box(2.2, 0.2, 2.2, 'mullion', ch.position.x, chTop + 0.1, ch.position.z, main);
  box(1.3, 0.55, 1.3, 'mullion', ch.position.x, chTop + 0.48, ch.position.z, main);

  // low wing (poster left): 9 m wide, 8 m deep, eave at 4.0 m, 15 deg roof, glass on the front and the open side
  const lw = new THREE.Group(); lw.position.set(2.5 - W / 2 - 4.5, 0, D / 2 - 4); g.add(lw);
  const LW = 9, LD = 8, le = 4.0;
  box(LW, le, 0.3, 'cedar', 0, le / 2, -LD / 2 + 0.15, lw);
  const lr = new THREE.Group(); lr.position.set(0, le, 0); lr.rotation.x = -THREE.MathUtils.degToRad(8); lw.add(lr);
  box(LW + 1.4, 0.24, LD + 1.6, 'roof', 0, 0.3, 0.2, lr); box(LW + 1.3, 0.06, LD + 1.5, 'soffit', 0, 0.15, 0.2, lr);
  if (snow) box(LW + 1.0, 0.3, LD + 1.2, 'snow', 0, 0.55, 0.2, lr);
  for (const [w, x, z, ry] of [[LW, 0, LD / 2, 0], [LD, -LW / 2, 0, Math.PI / 2]]) {
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, le), M('glass')); glass.position.set(x, le / 2, z); glass.rotation.y = ry === 0 ? 0 : -ry; lw.add(glass);
    for (let i = 0; i <= 4; i++) { const t = -w / 2 + (i * w) / 4; box(0.14, le, 0.14, 'mullion', ry ? x : t, le / 2, ry ? t : z, lw); }
    box(ry ? 0.14 : w, 0.14, ry ? w : 0.14, 'mullion', x, le - 0.07, z, lw);
  }
  // cantilevered deck with a glass railing on a dark steel beam
  box(LW + 2.2, 0.35, 3.2, 'beam', -0.6, -0.2, LD / 2 + 1.6, lw);
  box(LW + 2.2, 0.9, 0.5, 'beam', -0.6, -0.9, LD / 2 + 0.6, lw);
  const rail = new THREE.Mesh(new THREE.PlaneGeometry(LW + 2.2, 1.1), M('rail')); rail.position.set(-0.6, 0.55, LD / 2 + 3.2); lw.add(rail);
  box(LW + 2.2, 0.06, 0.08, 'mullion', -0.6, 1.1, LD / 2 + 3.2, lw);
  box(1.6, 2.4, LD, 'stone', 2.0, -1.2, 0, lw);
  g.userData = { footprint: [[-12, -7.5], [9, 7.5]], height: chTop + 0.8 };
  return g;
}

// a patrol hut or ski shack from the same kit: one small cedar wing, glazed door, snow-loaded roof
export function buildShack({ snow = true } = {}) {
  const g = new THREE.Group(), W = 4.4, D = 5.2, eave = 2.6;
  box(W + 0.3, 0.8, D + 0.3, 'stone', 0, -0.4, 0, g);
  box(W, eave, D, 'cedar', 0, eave / 2, 0, g);
  const ridge = gableRoof(g, W, D, eave, 45, 0.5, snow);
  const sh = new THREE.Shape(); sh.moveTo(-W / 2, 0); sh.lineTo(W / 2, 0); sh.lineTo(W / 2, eave); sh.lineTo(0, ridge - 0.1); sh.lineTo(-W / 2, eave); sh.closePath();
  const face = new THREE.Mesh(new THREE.ShapeGeometry(sh), M('cedar')); face.position.z = D / 2 + 0.01; g.add(face);
  box(1.0, 2.0, 0.08, 'glass', -0.8, 1.0, D / 2 + 0.05, g); box(1.1, 0.8, 0.08, 'glass', 1.1, 1.5, D / 2 + 0.05, g);
  for (const x of [-1.33, -0.27]) box(0.1, 2.05, 0.12, 'mullion', x, 1.02, D / 2 + 0.08, g);
  g.userData = { footprint: [[-2.6, -3], [2.6, 3]], height: ridge };
  return g;
}

// a detachable-chair terminal: concrete pad, steel frame, red bullwheel, snow on the canopy
export function buildTerminal({ snow = true } = {}) {
  const g = new THREE.Group();
  box(9, 1.2, 16, 'concrete', 0, -0.2, 0, g);
  for (const [x, z] of [[-3.6, -6], [3.6, -6], [-3.6, 6], [3.6, 6]]) box(0.5, 6.5, 0.5, 'steel', x, 3.25, z, g);
  box(9.6, 0.5, 17, 'roof', 0, 6.7, 0, g);
  if (snow) box(9.2, 0.35, 16.6, 'snow', 0, 7.1, 0, g);
  box(8, 1.6, 14, 'steel', 0, 5.6, 0, g);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.18, 8, 28), M('wheel')); wheel.rotation.x = Math.PI / 2; wheel.position.set(0, 5.0, 5.2); g.add(wheel);
  box(2.4, 2.2, 2.4, 'cedar', 6.4, 1.1, -5.5, g);        // the lifty hut, clear of the frame
  box(2.8, 0.2, 2.8, 'roof', 6.4, 2.3, -5.5, g);
  box(2.6, 0.25, 2.6, 'snow', 6.4, 2.5, -5.5, g);
  g.userData = { footprint: [[-4.8, -8.5], [7.8, 8.5]], height: 7.3 };
  return g;
}
