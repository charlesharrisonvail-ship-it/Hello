// Vail 3D: a free-ride game laid over real Vail Mountain terrain.
// World units are meters. +x is east, -z is north, +y is up.
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);
const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
if (IS_TOUCH) document.body.classList.add('touch');
const LOW = IS_TOUCH || Math.min(screen.width, screen.height) < 700;

const DIFF = {
  green: { c: '#2fb344', label: 'Easiest' },
  blue: { c: '#1f6fe0', label: 'More difficult' },
  black: { c: '#111111', label: 'Most difficult' },
  dbl: { c: '#111111', label: 'Experts only' },
  park: { c: '#ff8a00', label: 'Terrain park' },
};
const M2FT = 3.28084, MS2MPH = 2.23694;

// ---------- loading ----------
const loadbar = $('loadbar').firstElementChild, loadtxt = $('loadtxt');
function progress(p, t) { loadbar.style.width = (p * 100).toFixed(0) + '%'; if (t) loadtxt.textContent = t; }

async function loadData() {
  progress(0.05, 'Loading elevation…');
  const meta = await (await fetch('data/meta.json')).json();
  const hb = await (await fetch('data/height.bin')).arrayBuffer();
  progress(0.35, 'Loading runs and lifts…');
  const map = await (await fetch('data/map.json')).json();
  const mb = await (await fetch('data/mask.bin')).arrayBuffer();
  progress(0.5, 'Painting snow…');
  const tex = await new THREE.TextureLoader().loadAsync(LOW ? 'data/terrain_2k.jpg' : 'data/terrain.jpg');
  progress(0.8, 'Planting trees…');
  return { meta, heights: new Uint16Array(hb), mask: new Uint8Array(mb), map, tex };
}

// ---------- terrain sampling ----------
let T; // terrain info
function makeTerrain(meta, raw, mask) {
  const { cols, rows, cell, minE, scale } = meta;
  const h = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i++) h[i] = minE + raw[i] / scale;
  const W = (cols - 1) * cell, D = (rows - 1) * cell;
  return { cols, rows, cell, h, mask, W, D, x0: -W / 2, z0: -D / 2, minE };
}
function gridAt(x, z) {
  const gx = Math.min(Math.max((x - T.x0) / T.cell, 0), T.cols - 1.001);
  const gz = Math.min(Math.max((z - T.z0) / T.cell, 0), T.rows - 1.001);
  return [gx, gz];
}
// matches the triangle split used by the mesh, so the rider sits exactly on the visible surface
function heightAt(x, z) {
  const [gx, gz] = gridAt(x, z);
  const i = gx | 0, j = gz | 0, fx = gx - i, fz = gz - j, c = T.cols, h = T.h;
  const h00 = h[j * c + i], h10 = h[j * c + i + 1], h01 = h[(j + 1) * c + i], h11 = h[(j + 1) * c + i + 1];
  if (fx + fz <= 1) return h00 + (h10 - h00) * fx + (h01 - h00) * fz;
  return h11 + (h01 - h11) * (1 - fx) + (h10 - h11) * (1 - fz);
}
const _n = new THREE.Vector3();
function normalAt(x, z, out = _n) {
  const e = T.cell * 0.75;
  const hl = heightAt(x - e, z), hr = heightAt(x + e, z), hd = heightAt(x, z - e), hu = heightAt(x, z + e);
  return out.set(hl - hr, 2 * e, hd - hu).normalize();
}
function maskAt(x, z) {
  const [gx, gz] = gridAt(x, z);
  return T.mask[Math.round(gz) * T.cols + Math.round(gx)];
}
const inBounds = (x, z) => x > T.x0 + 20 && x < -T.x0 - 20 && z > T.z0 + 20 && z < -T.z0 - 20;

// ---------- renderer & scene ----------
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.72;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xb9cde6, 0.000065);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 1, 60000);

const sky = new Sky();
sky.scale.setScalar(50000);
scene.add(sky);
const sun = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(58), THREE.MathUtils.degToRad(200));
sky.material.uniforms.turbidity.value = 1.6;
sky.material.uniforms.rayleigh.value = 2.2;
sky.material.uniforms.mieCoefficient.value = 0.004;
sky.material.uniforms.mieDirectionalG.value = 0.8;
sky.material.uniforms.sunPosition.value.copy(sun);

scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x6f7f99, 1.25));
const sunLight = new THREE.DirectionalLight(0xfff3e0, 3.2);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048);
Object.assign(sunLight.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 600 });
sunLight.shadow.bias = -0.0008;
scene.add(sunLight, sunLight.target);

// ---------- world building ----------
function buildTerrainMesh(tex) {
  const { cols, rows, cell, h } = T;
  const pos = new Float32Array(cols * rows * 3), uv = new Float32Array(cols * rows * 2);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = j * cols + i;
    pos[k * 3] = T.x0 + i * cell; pos[k * 3 + 1] = h[k]; pos[k * 3 + 2] = T.z0 + j * cell;
    uv[k * 2] = i / (cols - 1); uv[k * 2 + 1] = 1 - j / (rows - 1);
  }
  const idx = new Uint32Array((cols - 1) * (rows - 1) * 6);
  let n = 0;
  for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
    const a = j * cols + i, b = a + 1, d = a + cols, c = d + 1;
    idx[n++] = a; idx[n++] = d; idx[n++] = b; // split along b-d, as heightAt assumes
    idx[n++] = b; idx[n++] = d; idx[n++] = c;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.88, metalness: 0, normalMap: snowNormal(), normalScale: new THREE.Vector2(0.55, 0.55) });
  const mesh = new THREE.Mesh(g, m);
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// fine wind-packed snow detail, tiled every 6 m so the surface reads up close
function snowNormal() {
  const N = 256, hgt = new Float32Array(N * N);
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let o = 0; o < 4; o++) {
    const f = 4 << o, amp = 1 / (o + 1);
    const g = Array.from({ length: (f + 1) * (f + 1) }, rnd);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const gx = x / N * f, gy = y / N * f, i = gx | 0, j = gy | 0, u = gx - i, v = gy - j;
      const at = (a, b) => g[(b % f) * (f + 1) + (a % f)];
      const s = (t) => t * t * (3 - 2 * t);
      hgt[y * N + x] += amp * ((at(i, j) * (1 - s(u)) + at(i + 1, j) * s(u)) * (1 - s(v)) + (at(i, j + 1) * (1 - s(u)) + at(i + 1, j + 1) * s(u)) * s(v));
    }
  }
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = hgt[y * N + (x + 1) % N] - hgt[y * N + (x + N - 1) % N];
    const dy = hgt[((y + 1) % N) * N + x] - hgt[((y + N - 1) % N) * N + x];
    const k = (y * N + x) * 4;
    data[k] = 128 + dx * 90; data[k + 1] = 128 + dy * 90; data[k + 2] = 255; data[k + 3] = 255;
  }
  const t = new THREE.DataTexture(data, N, N);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(T.W / 6, T.D / 6);
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

function buildTrees() {
  // conifers on every forest cell, jittered, denser on north-facing slopes
  const max = LOW ? 16000 : 52000;
  const pts = [];
  const { cols, rows, cell, mask } = T;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const step = LOW ? 2 : 1;
  for (let j = 1; j < rows - 1; j += step) for (let i = 1; i < cols - 1; i += step) {
    if (!(mask[j * cols + i] & 1)) continue;
    const x = T.x0 + (i + rnd() - 0.5) * cell, z = T.z0 + (j + rnd() - 0.5) * cell;
    if (rnd() < 0.35) continue;
    pts.push(x, z);
  }
  const count = Math.min(max, pts.length / 2);
  const stride = pts.length / 2 / count;
  const foliage = new THREE.ConeGeometry(1, 1, 7, 1);
  foliage.translate(0, 0.5, 0);
  const geoA = foliage.clone().scale(1, 0.72, 1).translate(0, 0.28, 0);
  const geoB = foliage.clone().scale(0.68, 0.6, 0.68).translate(0, 0.6, 0);
  const trunk = new THREE.CylinderGeometry(0.08, 0.1, 0.32, 5).translate(0, 0.16, 0);
  const merged = mergeGeos([geoA, geoB]);
  const matF = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  const matT = new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 1 });
  const imF = new THREE.InstancedMesh(merged, matF, count), imT = new THREE.InstancedMesh(trunk, matT, count);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
  for (let k = 0; k < count; k++) {
    const t = Math.floor(k * stride) * 2;
    const x = pts[t], z = pts[t + 1], y = heightAt(x, z) - 0.4;
    const ht = 9 + rnd() * 14, w = ht * (0.24 + rnd() * 0.08);
    q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, rnd() * 6.28);
    m4.compose(p.set(x, y, z), q, s.set(w, ht, w));
    imF.setMatrixAt(k, m4); imT.setMatrixAt(k, m4);
    // a dusting of snow on some crowns
    col.setHSL(0.36 + rnd() * 0.06, 0.32 + rnd() * 0.18, 0.2 + rnd() * 0.12);
    if (rnd() < 0.45) col.lerp(new THREE.Color(0xe6eef5), 0.25 + rnd() * 0.25);
    imF.setColorAt(k, col);
  }
  imF.instanceMatrix.needsUpdate = true;
  imF.frustumCulled = imT.frustumCulled = false;
  scene.add(imF, imT);
}
function mergeGeos(list) {
  let vc = 0, ic = 0;
  for (const g of list) { vc += g.attributes.position.count; ic += g.index.count; }
  const pos = new Float32Array(vc * 3), nor = new Float32Array(vc * 3), idx = new Uint32Array(ic);
  let vo = 0, io = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3);
    for (let i = 0; i < g.index.count; i++) idx[io + i] = g.index.array[i] + vo;
    vo += g.attributes.position.count; io += g.index.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

// lifts: cable, towers, terminals and moving chairs/cabins
const lifts = [];
function buildLifts(list) {
  const towerGeo = new THREE.BoxGeometry(0.9, 1, 0.9).translate(0, 0.5, 0);
  const armGeo = new THREE.BoxGeometry(6, 0.5, 0.5);
  const termGeo = mergeGeos([new THREE.BoxGeometry(9, 4.5, 14).translate(0, 2.25, 0),
    new THREE.CylinderGeometry(0.01, 7.5, 2.6, 4, 1).rotateY(Math.PI / 4).scale(1, 1, 1.5).translate(0, 5.8, 0)]);
  const chairGeo = new THREE.BoxGeometry(2.4, 1.6, 1.4);
  const cabinGeo = new THREE.BoxGeometry(2.2, 2.4, 2.4);
  const metal = new THREE.MeshStandardMaterial({ color: 0x5b6470, roughness: 0.6, metalness: 0.5 });
  const termMat = new THREE.MeshStandardMaterial({ color: 0x8a6a4f, roughness: 0.85 });
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.6 });
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xd8382b, roughness: 0.5 });
  const cableMat = new THREE.LineBasicMaterial({ color: 0x1a1a1a });
  const towers = [], terms = [];
  for (const L of list) {
    // densify every 20 m and hold the cable ~11 m over the snow, as the towers do
    const p = L.p; const pts = [];
    for (let i = 0; i + 3 < p.length; i += 2) {
      const ax = p[i], az = p[i + 1], bx = p[i + 2], bz = p[i + 3], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 20));
      for (let k = 0; k < n; k++) { const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n; pts.push(new THREE.Vector3(x, heightAt(x, z) + 11, z)); }
    }
    if (p.length >= 2) pts.push(new THREE.Vector3(p[p.length - 2], heightAt(p[p.length - 2], p[p.length - 1]) + 11, p[p.length - 1]));
    if (pts.length < 2) continue;
    for (let pass = 0; pass < 3; pass++) for (let i = 1; i < pts.length - 1; i++) {
      const y = (pts[i - 1].y + pts[i].y * 2 + pts[i + 1].y) / 4;
      pts[i].y = Math.max(y, heightAt(pts[i].x, pts[i].z) + 7);
    }
    // ride from the low end to the high end
    if (pts[0].y > pts[pts.length - 1].y) pts.reverse();
    const lens = [0];
    for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + pts[i].distanceTo(pts[i - 1]));
    const len = lens[lens.length - 1];
    if (len < 60) continue;
    const lift = { name: L.n, type: L.t, pts, lens, len, bottom: pts[0], top: pts[pts.length - 1], cabin: /gondola|cable_car/.test(L.t) };
    lift.at = (d) => {
      d = Math.max(0, Math.min(len, d));
      let i = 1; while (i < lens.length - 1 && lens[i] < d) i++;
      const t = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
      return new THREE.Vector3().lerpVectors(pts[i - 1], pts[i], t);
    };
    lifts.push(lift);
    // two cables, offset either side
    const dir = new THREE.Vector3().subVectors(lift.top, lift.bottom).setY(0).normalize();
    const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(2.6);
    lift.side = side; lift.dir = dir;
    for (const sgn of [1, -1]) {
      const g = new THREE.BufferGeometry().setFromPoints(pts.map((v) => v.clone().addScaledVector(side, sgn)));
      scene.add(new THREE.Line(g, cableMat));
    }
    for (let d = 0; d <= len; d += 95) towers.push({ v: lift.at(d), dir });
    terms.push({ v: lift.bottom, dir }, { v: lift.top, dir });
  }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  const imT = new THREE.InstancedMesh(towerGeo, metal, towers.length), imA = new THREE.InstancedMesh(armGeo, metal, towers.length);
  towers.forEach((t, k) => {
    const g = heightAt(t.v.x, t.v.z);
    q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, Math.atan2(t.dir.x, t.dir.z));
    m4.compose(new THREE.Vector3(t.v.x, g, t.v.z), q, s.set(1, t.v.y - g + 0.6, 1)); imT.setMatrixAt(k, m4);
    m4.compose(new THREE.Vector3(t.v.x, t.v.y + 0.4, t.v.z), q, s.set(1, 1, 1)); imA.setMatrixAt(k, m4);
  });
  const imTe = new THREE.InstancedMesh(termGeo, termMat, terms.length);
  terms.forEach((t, k) => {
    q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, Math.atan2(t.dir.x, t.dir.z));
    m4.compose(new THREE.Vector3(t.v.x, heightAt(t.v.x, t.v.z) - 1, t.v.z), q, s.set(1, 1, 1)); imTe.setMatrixAt(k, m4);
  });
  imT.castShadow = imTe.castShadow = true;
  scene.add(imT, imA, imTe);
  // carriers
  let nChair = 0, nCab = 0;
  for (const l of lifts) { l.spacing = l.cabin ? 70 : 32; l.n = Math.floor(l.len / l.spacing); if (l.cabin) nCab += l.n * 2; else nChair += l.n * 2; }
  chairs = new THREE.InstancedMesh(chairGeo, chairMat, Math.max(1, nChair));
  cabins = new THREE.InstancedMesh(cabinGeo, cabinMat, Math.max(1, nCab));
  chairs.frustumCulled = cabins.frustumCulled = false;
  scene.add(chairs, cabins);
}
let chairs, cabins, liftClock = 0;
function animateLifts(dt) {
  liftClock += dt * 5; // 5 m/s cable speed
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();
  let ic = 0, ib = 0;
  for (const l of lifts) {
    q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, Math.atan2(l.dir.x, l.dir.z));
    for (let k = 0; k < l.n; k++) {
      const d = (k * l.spacing + liftClock) % l.len;
      for (const [dd, sgn] of [[d, 1], [l.len - d, -1]]) {
        v.copy(l.at(dd)).addScaledVector(l.side, sgn); v.y -= l.cabin ? 2.2 : 1.6;
        m4.compose(v, q, s);
        if (l.cabin) cabins.setMatrixAt(ib++, m4); else chairs.setMatrixAt(ic++, m4);
      }
    }
  }
  chairs.instanceMatrix.needsUpdate = cabins.instanceMatrix.needsUpdate = true;
}

// floating run signs, made on demand near the rider
const signCache = new Map();
function makeSign(text, diff) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 112;
  const x = c.getContext('2d');
  x.fillStyle = 'rgba(8,14,28,.78)'; roundRect(x, 4, 8, 504, 96, 18); x.fill();
  drawBadge(x, 56, 56, 30, diff);
  x.fillStyle = '#fff'; x.font = '800 42px Inter, sans-serif'; x.textBaseline = 'middle';
  let t = text; while (x.measureText(t).width > 400 && t.length > 4) t = t.slice(0, -2) + '…';
  x.fillText(t, 100, 58);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, fog: false }));
  sp.scale.set(46, 10, 1);
  return sp;
}
function roundRect(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function drawBadge(x, cx, cy, r, d) {
  x.save(); x.translate(cx, cy);
  x.lineWidth = r * 0.14; x.strokeStyle = '#fff';
  if (d === 'green') { x.fillStyle = DIFF.green.c; x.beginPath(); x.arc(0, 0, r * 0.8, 0, 7); x.fill(); x.stroke(); }
  else if (d === 'blue') { x.fillStyle = DIFF.blue.c; x.beginPath(); x.rect(-r * 0.72, -r * 0.72, r * 1.44, r * 1.44); x.fill(); x.stroke(); }
  else if (d === 'park') { x.fillStyle = DIFF.park.c; x.beginPath(); x.roundRect(-r * 0.8, -r * 0.6, r * 1.6, r * 1.2, r * 0.3); x.fill(); x.stroke(); }
  else {
    const one = (ox) => { x.beginPath(); x.moveTo(ox, -r * 0.85); x.lineTo(ox + r * 0.6, 0); x.lineTo(ox, r * 0.85); x.lineTo(ox - r * 0.6, 0); x.closePath(); x.fillStyle = '#000'; x.fill(); x.stroke(); };
    if (d === 'dbl') { one(-r * 0.5); one(r * 0.5); } else one(0);
  }
  x.restore();
}
function badgeSVG(d) {
  const c = document.createElement('canvas'); c.width = c.height = 44; drawBadge(c.getContext('2d'), 22, 22, 18, d);
  return `<img src="${c.toDataURL()}" width="22" height="22" alt="${DIFF[d]?.label || ''}">`;
}

// ---------- rider ----------
const rider = new THREE.Group();
const body = new THREE.Group(); rider.add(body);
let gear = 'ski';
function buildRider() {
  body.clear();
  const jacket = new THREE.MeshStandardMaterial({ color: 0xff3b2f, roughness: 0.55 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x1b2433, roughness: 0.8 });
  const helmet = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3, metalness: 0.1 });
  const goggle = new THREE.MeshStandardMaterial({ color: 0xffb000, roughness: 0.1, metalness: 0.8, emissive: 0x442200 });
  const gearMat = new THREE.MeshStandardMaterial({ color: gear === 'ski' ? 0x111111 : 0x1d6cf0, roughness: 0.4 });
  const add = (geo, mat, x, y, z, parent = body) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const torso = add(new THREE.CapsuleGeometry(0.24, 0.5, 4, 8), jacket, 0, 1.28, 0);
  torso.name = 'torso';
  add(new THREE.SphereGeometry(0.17, 12, 10), helmet, 0, 1.8, 0);
  add(new THREE.BoxGeometry(0.26, 0.08, 0.1), goggle, 0, 1.79, -0.14);
  // skiers stand with feet side by side; riders stand sideways, feet along the board
  const ski = gear === 'ski';
  add(new THREE.CapsuleGeometry(0.1, 0.55, 4, 6), pants, ski ? -0.14 : 0, 0.42, ski ? 0 : -0.25).name = 'leg';
  add(new THREE.CapsuleGeometry(0.1, 0.55, 4, 6), pants, ski ? 0.14 : 0, 0.42, ski ? 0 : 0.25).name = 'leg';
  const armL = add(new THREE.CapsuleGeometry(0.07, 0.45, 4, 6), jacket, -0.33, 1.25, -0.05); armL.rotation.z = 0.5;
  const armR = add(new THREE.CapsuleGeometry(0.07, 0.45, 4, 6), jacket, 0.33, 1.25, -0.05); armR.rotation.z = -0.5;
  if (gear === 'ski') {
    add(new THREE.BoxGeometry(0.09, 0.03, 1.75), gearMat, -0.14, 0.03, -0.1);
    add(new THREE.BoxGeometry(0.09, 0.03, 1.75), gearMat, 0.14, 0.03, -0.1);
    const pole = new THREE.CylinderGeometry(0.012, 0.012, 1.15, 4);
    const pl = add(pole, pants, -0.45, 0.75, 0.15); pl.rotation.x = 0.4;
    const pr = add(pole, pants, 0.45, 0.75, 0.15); pr.rotation.x = 0.4;
  } else {
    add(new THREE.BoxGeometry(0.28, 0.03, 1.55), gearMat, 0, 0.03, 0);
    // stand sideways on the board, shoulders opened a little toward the fall line
    body.children.forEach((m) => { if (m.name === 'leg') m.rotation.x = (m.position.z > 0 ? 1 : -1) * 0.2; });
    const turn = new THREE.Group(); turn.rotation.y = Math.PI / 2 - 0.5;
    for (const m of [...body.children]) if (m.position.y > 0.9) { turn.add(m); }
    body.add(turn);
  }
}
scene.add(rider);

// snow spray
const SPRAY = 500;
const sprayGeo = new THREE.BufferGeometry();
const sprayPos = new Float32Array(SPRAY * 3), sprayVel = new Float32Array(SPRAY * 3), sprayLife = new Float32Array(SPRAY);
sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
const spray = new THREE.Points(sprayGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, transparent: true, opacity: 0.85, depthWrite: false }));
spray.frustumCulled = false; scene.add(spray);
let sprayIdx = 0;
function emitSpray(pos, vel, n) {
  for (let k = 0; k < n; k++) {
    const i = sprayIdx = (sprayIdx + 1) % SPRAY;
    sprayPos[i * 3] = pos.x + (Math.random() - 0.5) * 0.6; sprayPos[i * 3 + 1] = pos.y + 0.1; sprayPos[i * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.6;
    sprayVel[i * 3] = vel.x + (Math.random() - 0.5) * 3; sprayVel[i * 3 + 1] = 1.5 + Math.random() * 3; sprayVel[i * 3 + 2] = vel.z + (Math.random() - 0.5) * 3;
    sprayLife[i] = 0.6 + Math.random() * 0.5;
  }
}
function updateSpray(dt) {
  for (let i = 0; i < SPRAY; i++) {
    if (sprayLife[i] <= 0) { sprayPos[i * 3 + 1] = -1e5; continue; }
    sprayLife[i] -= dt; sprayVel[i * 3 + 1] -= 9.8 * dt;
    sprayPos[i * 3] += sprayVel[i * 3] * dt; sprayPos[i * 3 + 1] += sprayVel[i * 3 + 1] * dt; sprayPos[i * 3 + 2] += sprayVel[i * 3 + 2] * dt;
  }
  sprayGeo.attributes.position.needsUpdate = true;
}

// falling snow around the camera
const FLAKES = LOW ? 1500 : 4000;
const flakeGeo = new THREE.BufferGeometry();
const flakePos = new Float32Array(FLAKES * 3);
for (let i = 0; i < FLAKES * 3; i++) flakePos[i] = (Math.random() - 0.5) * 120;
flakeGeo.setAttribute('position', new THREE.BufferAttribute(flakePos, 3));
const flakes = new THREE.Points(flakeGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.8, depthWrite: false }));
flakes.frustumCulled = false; scene.add(flakes);

// ---------- game state ----------
const S = {
  mode: 'menu', // menu | ride | lift | fly
  pos: new THREE.Vector3(), vel: new THREE.Vector3(), heading: 0, air: false, airT: 0, spin: 0,
  cam: 'chase', lift: null, liftD: 0, topSpeed: 0, vert: 0, bestAir: 0, lastY: 0,
  run: null, zone: null, waypoint: null, lean: 0,
};
const keys = {};
let MAP, spawnList = [];

function spawnAt(sp) {
  // start at the head of the biggest named run near the lift top, pointed down it
  let x = sp.x, z = sp.z, head = null, bd = 0;
  for (const r of MAP.runs) {
    if (!r.n || !r.top || r.area) continue;
    const d = Math.hypot(r.top[0] - sp.x, r.top[1] - sp.z);
    if (d < 220 && r.drop > bd) { bd = r.drop; head = r; }
  }
  S.heading = fallLineHeading(x, z);
  if (head) {
    const p = head.p, i = head.topI;
    const j = i + 3 >= p.length || (i >= 2 && heightAt(p[i - 2], p[i - 1]) < heightAt(p[i + 2], p[i + 3])) ? i - 2 : i + 2;
    x = head.top[0]; z = head.top[1];
    if (j >= 0 && j + 1 < p.length) S.heading = Math.atan2(p[j] - x, -(p[j + 1] - z));
  }
  S.pos.set(x, heightAt(x, z), z);
  S.vel.set(0, 0, 0);
  S.air = false; S.mode = 'ride'; S.lift = null;
  S.lastY = S.pos.y; S.run = undefined; S.zone = undefined; hudT = 1;
  banner(sp.n, 'Drop in');
}
function fallLineHeading(x, z) {
  const n = normalAt(x, z, new THREE.Vector3());
  if (Math.hypot(n.x, n.z) < 0.02) return 0;
  return Math.atan2(n.x, -n.z); // heading 0 = north (-z); downhill follows the normal's horizontal part
}
const headingVec = (h, out = new THREE.Vector3()) => out.set(Math.sin(h), 0, -Math.cos(h));

const G = 9.81;
const _f = new THREE.Vector3(), _s = new THREE.Vector3(), _g = new THREE.Vector3(), _t = new THREE.Vector3();
function stepRide(dt) {
  const steer = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0) + touchSteer;
  const tuck = keys.w || keys.arrowup || touchTuck;
  const brake = keys.s || keys.arrowdown || touchBrake;
  const speed = S.vel.length();

  if (S.air) {
    S.vel.y -= G * dt;
    S.heading += steer * 6 * dt; S.spin += steer * 6 * dt;
    S.pos.addScaledVector(S.vel, dt);
    S.airT += dt;
    const gy = heightAt(S.pos.x, S.pos.z);
    if (S.pos.y <= gy) land(gy);
  } else {
    const n = normalAt(S.pos.x, S.pos.z, new THREE.Vector3());
    // gravity along the slope
    _g.set(0, -G, 0).addScaledVector(n, G * n.y);
    S.vel.addScaledVector(_g, dt);
    S.vel.addScaledVector(n, -S.vel.dot(n));
    // steering: quicker at low speed, carving radius widens with speed
    const turnRate = (brake ? 2.6 : 1.9) / (1 + speed * 0.035);
    S.heading += steer * turnRate * dt;
    // arcade assist: with no steering input, drift gently toward the fall line
    if (Math.abs(steer) < 0.1 && n.y < 0.995) {
      const fl = Math.atan2(n.x, -n.z);
      const diff = Math.atan2(Math.sin(fl - S.heading), Math.cos(fl - S.heading));
      S.heading += diff * Math.min(1, dt * 0.6);
    }
    S.lean += ((-steer * Math.min(1, speed / 12)) - S.lean) * Math.min(1, dt * 6);
    // facing direction on the slope, and the edge-grip side vector
    headingVec(S.heading, _f).addScaledVector(n, -headingVec(S.heading, _t).dot(n)).normalize();
    _s.crossVectors(n, _f).normalize();
    let vf = S.vel.dot(_f), vs = S.vel.dot(_s);
    const grip = brake ? 3.5 : 7;
    const lost = Math.abs(vs) * (1 - Math.exp(-grip * dt));
    vs *= Math.exp(-grip * dt);
    if (brake) vf *= Math.exp(-1.4 * dt);
    S.vel.copy(_f).multiplyScalar(vf).addScaledVector(_s, vs);
    // snow friction, air drag and deep-tree snow
    const sp = S.vel.length();
    const forest = maskAt(S.pos.x, S.pos.z) & 1;
    const drag = (tuck ? 0.0011 : 0.0028) * sp * sp + 0.03 * G * n.y + (forest ? 0.2 * sp : 0);
    if (sp > 0) S.vel.multiplyScalar(Math.max(0, sp - drag * dt) / sp);
    // skate on the flats (never uphill)
    if (tuck && sp < 4 && _f.y < 0.08) S.vel.addScaledVector(_f, 2.5 * dt);
    // turn around automatically when sliding backwards
    if (vf < -1 && sp > 1.5) S.heading += Math.sign(steer || 1) * 2.5 * dt;
    if (S.vel.length() > 31) S.vel.setLength(31);
    // move, then decide whether the ground fell away (air) or we stay planted
    const prevY = S.pos.y;
    S.pos.x += S.vel.x * dt; S.pos.z += S.vel.z * dt;
    const gy = heightAt(S.pos.x, S.pos.z);
    const flyY = prevY + S.vel.y * dt;
    if (gy < flyY - 0.35 && sp > 9) { S.air = true; S.airT = 0; S.spin = 0; S.pos.y = flyY; }
    else S.pos.y = gy;
    if (jumpQueued) { S.air = true; S.airT = 0; S.spin = 0; S.vel.y = Math.max(S.vel.y, 0) + 5.5; S.pos.y += 0.05; }
    if (sp > 6 && (Math.abs(steer) > 0.3 || brake)) emitSpray(S.pos, S.vel.clone().multiplyScalar(0.3), brake ? 5 : 2);
  }
  jumpQueued = false;
  if (!inBounds(S.pos.x, S.pos.z)) { S.pos.x = Math.max(T.x0 + 25, Math.min(-T.x0 - 25, S.pos.x)); S.pos.z = Math.max(T.z0 + 25, Math.min(-T.z0 - 25, S.pos.z)); S.vel.set(0, 0, 0); }
  // stats
  const v = S.vel.length() * MS2MPH;
  if (v > S.topSpeed) S.topSpeed = v;
  if (S.pos.y < S.lastY) S.vert += (S.lastY - S.pos.y) * M2FT;
  S.lastY = S.pos.y;
}
let jumpQueued = false;
function land(gy) {
  S.pos.y = gy; S.air = false;
  const n = normalAt(S.pos.x, S.pos.z, new THREE.Vector3());
  const into = -S.vel.dot(n);
  S.vel.addScaledVector(n, into);
  const spins = Math.round(Math.abs(S.spin) / Math.PI) * 180;
  const dirV = Math.atan2(S.vel.x, -S.vel.z);
  let off = Math.abs(((S.heading - dirV + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI);
  if (S.vel.length() < 2) off = 0;
  if (S.airT > S.bestAir) S.bestAir = S.airT;
  if (off > 1.4 && spins % 360 !== 0 || into > 14) {
    S.vel.multiplyScalar(0.25); S.heading = dirV; trick('WIPEOUT', '#ff4a3d');
  } else {
    if (spins >= 180) S.heading = dirV + (off > 1.6 ? Math.PI : 0) * 0;
    if (spins >= 180) trick(spins + '!', '#ffcf3f');
    else if (S.airT > 0.7) trick(S.airT.toFixed(1) + 's AIR', '#ffcf3f');
    emitSpray(S.pos, S.vel.clone().multiplyScalar(0.2), 30);
  }
}

function stepLift(dt) {
  const l = S.lift;
  S.liftD += dt * (keys.shift ? 60 : 18); // time-compressed ride
  const p = l.at(S.liftD);
  S.pos.copy(p).addScaledVector(l.side, 1); S.pos.y -= 2;
  S.heading = Math.atan2(l.dir.x, -l.dir.z);
  if (S.liftD >= l.len) {
    // unload just past the top terminal
    const off = l.top.clone().addScaledVector(l.dir, 26);
    S.pos.set(off.x, heightAt(off.x, off.z), off.z);
    S.heading = fallLineHeading(off.x, off.z); S.vel.set(0, 0, 0);
    S.mode = 'ride'; S.lift = null; S.lastY = S.pos.y;
    banner(l.name, 'Top of the lift');
  }
}

// ---------- camera ----------
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
let orbit;
function updateCamera(dt, snap) {
  const back = headingVec(S.heading, new THREE.Vector3());
  const sp = S.vel.length();
  let want, look;
  if (S.mode === 'lift') {
    want = S.pos.clone().addScaledVector(S.lift.side, 9).addScaledVector(S.lift.dir, -14); want.y += 5;
    look = S.pos.clone().addScaledVector(S.lift.dir, 30);
  } else if (S.cam === 'pov') {
    want = S.pos.clone().addScaledVector(back, 0.4); want.y += 1.75;
    look = S.pos.clone().addScaledVector(back, 20); look.y += 0.6 - 4;
  } else {
    const dist = 7.5 + sp * 0.12, up = 2.6 + sp * 0.03;
    want = S.pos.clone().addScaledVector(back, -dist); want.y += up;
    const gy = heightAt(want.x, want.z) + 1.5; if (want.y < gy) want.y = gy;
    look = S.pos.clone().addScaledVector(back, 6); look.y += 1.2;
  }
  const k = snap ? 1 : 1 - Math.exp(-dt * (S.cam === 'pov' ? 20 : 5));
  camPos.lerp(want, k); camLook.lerp(look, snap ? 1 : 1 - Math.exp(-dt * 8));
  camera.position.copy(camPos); camera.lookAt(camLook);
  camera.fov += ((S.cam === 'pov' ? 75 : 60 + Math.min(sp, 30) * 0.5) - camera.fov) * Math.min(1, dt * 3);
  camera.updateProjectionMatrix();
}

// ---------- HUD ----------
let bannerTimer = 0;
function banner(t, s) {
  $('bannerT').textContent = t; $('bannerS').textContent = s || '';
  $('banner').style.opacity = 1; clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => ($('banner').style.opacity = 0), 2600);
}
let trickTimer = 0;
function trick(t, c) {
  const el = $('trick'); el.textContent = t; el.style.color = c; el.style.opacity = 1;
  clearTimeout(trickTimer); trickTimer = setTimeout(() => (el.style.opacity = 0), 1200);
}

// nearest-run lookup on a coarse spatial hash
let runHash = new Map();
const HC = 120;
function indexRuns() {
  MAP.runs.forEach((r, ri) => {
    const p = r.p;
    for (let i = 0; i < p.length - 2; i += 2) {
      const ax = p[i], az = p[i + 1], bx = p[i + 2], bz = p[i + 3];
      const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / (HC / 2)) + 1;
      for (let s = 0; s <= steps; s++) {
        const x = ax + (bx - ax) * s / steps, z = az + (bz - az) * s / steps;
        const key = Math.floor(x / HC) + ',' + Math.floor(z / HC);
        if (!runHash.has(key)) runHash.set(key, new Set());
        runHash.get(key).add(ri);
      }
    }
    // a sign at the top of each named run
    let best = 0, by = -1e9, lo = 1e9;
    for (let i = 0; i < p.length; i += 2) { const y = heightAt(p[i], p[i + 1]); if (y > by) { by = y; best = i; } lo = Math.min(lo, y); }
    r.top = [p[best], p[best + 1]]; r.topI = best; r.drop = by - lo;
  });
}
function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, l = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l));
  return Math.hypot(px - ax - t * dx, pz - az - t * dz);
}
function nearestRun(x, z) {
  let best = null, bd = 1e9;
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
    const set = runHash.get((Math.floor(x / HC) + a) + ',' + (Math.floor(z / HC) + b));
    if (!set) continue;
    for (const ri of set) {
      const p = MAP.runs[ri].p, lim = MAP.runs[ri].area ? 60 : 40;
      for (let i = 0; i < p.length - 2; i += 2) {
        const d = segDist(x, z, p[i], p[i + 1], p[i + 2], p[i + 3]) - (MAP.runs[ri].area ? 25 : 0);
        if (d < bd && d < lim) { bd = d; best = MAP.runs[ri]; }
      }
    }
  }
  return best;
}
function nearestZone(x, z) {
  let best = null, bd = 1e9;
  for (const zn of MAP.zones) { const d = Math.hypot(x - zn.x, z - zn.z) / zn.r; if (d < 1 && d < bd) { bd = d; best = zn; } }
  return best;
}

let hudT = 0;
function updateHUD(dt) {
  hudT += dt;
  $('spd').textContent = Math.round(S.vel.length() * MS2MPH * (S.mode === 'lift' ? 0 : 1));
  if (hudT < 0.2) return;
  hudT = 0;
  $('elev').textContent = Math.round(S.pos.y * M2FT).toLocaleString();
  $('top').textContent = Math.round(S.topSpeed);
  $('vert').textContent = Math.round(S.vert).toLocaleString();
  $('air').textContent = S.bestAir.toFixed(1);
  const run = S.mode === 'lift' ? null : nearestRun(S.pos.x, S.pos.z);
  if (S.mode === 'lift') { $('runName').textContent = S.lift.name; $('runBadge').innerHTML = ''; }
  else if (run !== S.run) {
    S.run = run;
    $('runName').textContent = run ? (run.n || DIFF[run.d].label + ' connector') : 'Off piste';
    $('runBadge').innerHTML = run ? badgeSVG(run.d) : '';
  }
  const zone = nearestZone(S.pos.x, S.pos.z);
  if (zone !== S.zone) {
    S.zone = zone;
    $('zoneName').textContent = zone ? zone.n.toUpperCase() : 'VAIL MOUNTAIN';
    if (zone && S.mode === 'ride') banner(zone.n, zone.s || '');
  }
  // lift prompt
  const pr = $('prompt');
  nearLift = null;
  if (S.mode === 'ride' && S.vel.length() < 9) {
    for (const l of lifts) if (Math.hypot(l.bottom.x - S.pos.x, l.bottom.z - S.pos.z) < 45) { nearLift = l; break; }
  }
  if (nearLift) { pr.innerHTML = `<kbd>${IS_TOUCH ? 'RIDE' : 'E'}</kbd>Ride ${nearLift.name}`; pr.style.display = 'block'; }
  else pr.style.display = 'none';
  updateSigns();
}
let nearLift = null;
function updateSigns() {
  const keep = new Set();
  for (const r of MAP.runs) {
    if (!r.n || !r.top) continue;
    const d = Math.hypot(r.top[0] - S.pos.x, r.top[1] - S.pos.z);
    if (d > 650 || d < 35) continue;
    keep.add(r);
    if (!signCache.has(r)) {
      const sp = makeSign(r.n, r.d);
      sp.position.set(r.top[0], heightAt(r.top[0], r.top[1]) + 15, r.top[1]);
      scene.add(sp); signCache.set(r, sp);
    }
  }
  for (const [r, sp] of signCache) if (!keep.has(r)) { scene.remove(sp); sp.material.map.dispose(); sp.material.dispose(); signCache.delete(r); }
}

// ---------- 2D maps ----------
let mapCanvas, mapScale; // pixels per meter of the pre-rendered map
function buildMapCanvas(tex) {
  const w = 2400, h = Math.round(w * T.D / T.W);
  mapScale = w / T.W;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.drawImage(tex.image, 0, 0, w, h);
  x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(0, 0, w, h);
  x.lineCap = x.lineJoin = 'round';
  const toPx = (px, pz) => [(px - T.x0) * mapScale, (pz - T.z0) * mapScale];
  for (const r of MAP.runs) {
    x.beginPath();
    for (let i = 0; i < r.p.length; i += 2) { const [a, b] = toPx(r.p[i], r.p[i + 1]); i ? x.lineTo(a, b) : x.moveTo(a, b); }
    if (r.area) { x.closePath(); x.fillStyle = (DIFF[r.d]?.c || '#000') + '33'; x.fill(); continue; }
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 6; x.stroke();
    x.strokeStyle = DIFF[r.d]?.c || '#000'; x.lineWidth = 3.2; x.stroke();
  }
  x.setLineDash([10, 6]);
  for (const l of lifts) {
    x.beginPath(); const [a, b] = toPx(l.bottom.x, l.bottom.z), [c2, d2] = toPx(l.top.x, l.top.z);
    x.moveTo(a, b); x.lineTo(c2, d2); x.strokeStyle = '#e8452c'; x.lineWidth = 3; x.stroke();
  }
  x.setLineDash([]);
  mapCanvas = c;
}
const miniCtx = $('mini').firstElementChild.getContext('2d');
function drawMini() {
  const c = miniCtx, W = 420, R = W / 2, zoom = 0.9; // map px per screen px
  c.clearRect(0, 0, W, W);
  c.save(); c.translate(R, R); c.rotate(-S.heading); c.scale(1 / zoom * 1.6, 1 / zoom * 1.6);
  const px = (S.pos.x - T.x0) * mapScale, pz = (S.pos.z - T.z0) * mapScale;
  c.drawImage(mapCanvas, -px, -pz);
  if (S.waypoint) {
    const wx = (S.waypoint.x - T.x0) * mapScale - px, wz = (S.waypoint.z - T.z0) * mapScale - pz;
    c.fillStyle = '#ffcf3f'; c.beginPath(); c.arc(wx, wz, 9, 0, 7); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 2; c.stroke();
  }
  c.restore();
  // rider arrow
  c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(R, R - 18); c.lineTo(R + 12, R + 14); c.lineTo(R, R + 7); c.lineTo(R - 12, R + 14); c.closePath(); c.stroke(); c.fill();
  // north marker on the rim
  const a = -S.heading - Math.PI / 2;
  c.fillStyle = '#000'; c.beginPath(); c.arc(R + Math.cos(a) * (R - 22), R + Math.sin(a) * (R - 22), 16, 0, 7); c.fill();
  c.fillStyle = '#fff'; c.font = '400 22px Bebas Neue'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('N', R + Math.cos(a) * (R - 22), R + Math.sin(a) * (R - 22) + 1);
  if (S.waypoint) {
    const d = Math.hypot(S.waypoint.x - S.pos.x, S.waypoint.z - S.pos.z);
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(R - 52, W - 58, 104, 28);
    c.fillStyle = '#ffcf3f'; c.font = '400 22px Bebas Neue'; c.fillText(Math.round(d * M2FT).toLocaleString() + ' FT', R, W - 43);
  }
}

// full-screen trail map
const mapEl = $('map'), mapCv = mapEl.querySelector('canvas');
let mapView = { s: 1, ox: 0, oy: 0 };
function openMap() {
  mapEl.classList.add('on');
  const dpr = devicePixelRatio || 1;
  mapCv.width = innerWidth * dpr; mapCv.height = innerHeight * dpr;
  const b = MAP.bounds, bw = (b[2] - b[0]) * mapScale, bh = (b[3] - b[1]) * mapScale;
  const s = Math.min(mapCv.width / bw, (mapCv.height - 70 * dpr) / bh);
  mapView = { s, ox: mapCv.width / 2 - ((b[0] + b[2]) / 2 - T.x0) * mapScale * s, oy: (mapCv.height + 50 * dpr) / 2 - ((b[1] + b[3]) / 2 - T.z0) * mapScale * s };
  drawBigMap();
}
function drawBigMap() {
  const c = mapCv.getContext('2d'), { s, ox, oy } = mapView, dpr = devicePixelRatio || 1;
  c.fillStyle = '#060b16'; c.fillRect(0, 0, mapCv.width, mapCv.height);
  c.drawImage(mapCanvas, ox, oy, mapCanvas.width * s, mapCanvas.height * s);
  const P = (x, z) => [ox + (x - T.x0) * mapScale * s, oy + (z - T.z0) * mapScale * s];
  c.textAlign = 'center'; c.textBaseline = 'middle';
  const placed = [];
  const free = (x, y, w, h) => { if (placed.some((r) => x < r[0] + r[2] && x + w > r[0] && y < r[1] + r[3] && y + h > r[1])) return false; placed.push([x, y, w, h]); return true; };
  // area names claim their space first (biggest areas first); they are painted after the lifts
  const zoneLabels = [];
  for (const zn of [...MAP.zones].sort((p, q) => q.r - p.r)) {
    const [a, b] = P(zn.x, zn.z), t = zn.n.toUpperCase();
    c.font = `400 ${Math.round(Math.min(26, 13 + 6 * s) * dpr)}px Bebas Neue`;
    const tw = c.measureText(t).width, th = 18 * dpr;
    if (free(a - tw / 2, b - th / 2, tw, th)) zoneLabels.push([t, a, b, c.font]);
  }
  for (const l of lifts) {
    const [a, b] = P(l.top.x, l.top.z);
    c.fillStyle = '#e8452c'; c.beginPath(); c.arc(a, b, 6 * dpr, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2 * dpr; c.stroke();
    c.font = `700 ${Math.round(10 * dpr)}px Inter`;
    const tw = c.measureText(l.name).width;
    if (!free(a - tw / 2, b - 20 * dpr, tw, 14 * dpr)) continue;
    c.lineWidth = 3 * dpr; c.strokeStyle = 'rgba(0,0,0,.8)';
    c.strokeText(l.name, a, b - 12 * dpr); c.fillStyle = '#fff'; c.fillText(l.name, a, b - 12 * dpr);
  }
  for (const [t, a, b, f] of zoneLabels) {
    c.font = f; c.lineWidth = 4 * dpr; c.strokeStyle = 'rgba(0,0,0,.75)';
    c.strokeText(t, a, b); c.fillStyle = '#fff'; c.fillText(t, a, b);
  }
  if (S.mode !== 'menu') {
    const [a, b] = P(S.pos.x, S.pos.z);
    c.save(); c.translate(a, b); c.rotate(S.heading);
    c.fillStyle = '#ffcf3f'; c.strokeStyle = '#000'; c.lineWidth = 2 * dpr;
    c.beginPath(); c.moveTo(0, -12 * dpr); c.lineTo(8 * dpr, 9 * dpr); c.lineTo(0, 4 * dpr); c.lineTo(-8 * dpr, 9 * dpr); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
  if (S.waypoint) { const [a, b] = P(S.waypoint.x, S.waypoint.z); c.fillStyle = '#ffcf3f'; c.beginPath(); c.arc(a, b, 7 * dpr, 0, 7); c.fill(); }
}
// drag to pan, wheel or pinch to zoom
const ptrs = new Map(); let dragged = 0, pinch0 = 0;
mapCv.addEventListener('pointerdown', (e) => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); dragged = 0; mapCv.setPointerCapture(e.pointerId); });
mapCv.addEventListener('pointermove', (e) => {
  if (!ptrs.has(e.pointerId)) return;
  const dpr = devicePixelRatio || 1, [px, py] = ptrs.get(e.pointerId);
  if (ptrs.size === 1) {
    mapView.ox += (e.clientX - px) * dpr; mapView.oy += (e.clientY - py) * dpr; dragged += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
  }
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 2) {
    const [[ax, ay], [bx, by]] = [...ptrs.values()], d = Math.hypot(ax - bx, ay - by);
    if (pinch0) zoomMap(d / pinch0, (ax + bx) / 2 * dpr, (ay + by) / 2 * dpr);
    pinch0 = d; dragged = 99;
  }
  drawBigMap();
});
const ptrEnd = (e) => { ptrs.delete(e.pointerId); pinch0 = 0; };
mapCv.addEventListener('pointerup', ptrEnd); mapCv.addEventListener('pointercancel', ptrEnd);
mapCv.addEventListener('wheel', (e) => { e.preventDefault(); const dpr = devicePixelRatio || 1; zoomMap(Math.exp(-e.deltaY * 0.0015), e.clientX * dpr, e.clientY * dpr); drawBigMap(); }, { passive: false });
function zoomMap(f, cx, cy) {
  const s2 = Math.max(0.05, Math.min(4, mapView.s * f)); f = s2 / mapView.s;
  mapView.ox = cx - (cx - mapView.ox) * f; mapView.oy = cy - (cy - mapView.oy) * f; mapView.s = s2;
}
mapCv.addEventListener('click', (e) => {
  if (dragged > 6) return;
  const dpr = devicePixelRatio || 1, { s, ox, oy } = mapView;
  const mx = e.clientX * dpr, my = e.clientY * dpr;
  const x = (mx - ox) / (mapScale * s) + T.x0, z = (my - oy) / (mapScale * s) + T.z0;
  for (const l of lifts) {
    const px = ox + (l.top.x - T.x0) * mapScale * s, py = oy + (l.top.z - T.z0) * mapScale * s;
    if (Math.hypot(px - mx, py - my) < 14 * dpr) {
      const off = l.top.clone().addScaledVector(l.dir, 26);
      closeMap(); startRide({ n: l.name, x: off.x, z: off.z }); return;
    }
  }
  if (inBounds(x, z)) { S.waypoint = { x, z }; drawBigMap(); }
});
function closeMap() { mapEl.classList.remove('on'); }
$('mapClose').onclick = closeMap;

// ---------- input ----------
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === ' ') { if (S.mode === 'ride' && !S.air) jumpQueued = true; e.preventDefault(); }
  if (k === 'e' && nearLift) boardLift(nearLift);
  if (k === 'm' && S.mode !== 'menu') mapEl.classList.contains('on') ? closeMap() : openMap();
  if (k === 'c') S.cam = S.cam === 'chase' ? 'pov' : 'chase';
  if (k === 'r' && S.mode === 'ride' && lastSpawn) spawnAt(lastSpawn);
  if (k === 'escape') { closeMap(); showMenu(); }
});
addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
function boardLift(l) { S.mode = 'lift'; S.lift = l; S.liftD = 0; S.vel.set(0, 0, 0); banner(l.name, 'Riding up · hold Shift to hurry'); }

let touchSteer = 0, touchTuck = false, touchBrake = false;
if (IS_TOUCH) {
  const st = $('stick'), knob = st.firstElementChild;
  let id = null, cx = 0, cy = 0;
  st.addEventListener('pointerdown', (e) => { id = e.pointerId; const r = st.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; st.setPointerCapture(id); });
  st.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    const dx = Math.max(-45, Math.min(45, e.clientX - cx)), dy = Math.max(-45, Math.min(45, e.clientY - cy));
    knob.style.transform = `translate(${dx}px,${dy}px)`;
    touchSteer = dx / 45; touchTuck = dy < -22; touchBrake = dy > 22;
  });
  const end = () => { id = null; knob.style.transform = ''; touchSteer = 0; touchTuck = touchBrake = false; };
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
  const hold = (el, on, off) => { el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointerleave', off); };
  hold($('tTuck'), () => (touchTuck = true), () => (touchTuck = false));
  hold($('tBrake'), () => (touchBrake = true), () => (touchBrake = false));
  $('tJump').onpointerdown = () => { if (S.mode === 'ride' && !S.air) jumpQueued = true; };
  $('tRide').onpointerdown = () => { if (nearLift) boardLift(nearLift); };
  $('tMap').onpointerdown = () => (mapEl.classList.contains('on') ? closeMap() : openMap());
}

// ---------- menu ----------
let lastSpawn = null;
function showMenu() { $('start').classList.add('on'); S.mode = 'menu'; if (orbit) orbit.enabled = false; }
function startRide(sp) {
  lastSpawn = sp; $('start').classList.remove('on');
  if (orbit) orbit.enabled = false;
  buildRider(); spawnAt(sp); updateCamera(0, true);
}
function startFly() {
  $('start').classList.remove('on');
  S.mode = 'fly';
  if (!orbit) { orbit = new OrbitControls(camera, canvas); orbit.enableDamping = true; orbit.maxPolarAngle = 1.45; orbit.maxDistance = 22000; }
  orbit.enabled = true;
  const c = MAP.center;
  orbit.target.set(c.x, heightAt(c.x, c.z), c.z);
  camera.position.set(c.x + 2500, heightAt(c.x, c.z) + 3800, c.z - 7500); // from the north, over Vail Village
  camera.fov = 50; camera.updateProjectionMatrix();
  banner('Vail Mountain', 'Drag to orbit · scroll to zoom · Esc for menu');
}
document.querySelectorAll('#gear .btn').forEach((b) => b.onclick = () => {
  document.querySelectorAll('#gear .btn').forEach((x) => x.classList.remove('sel'));
  b.classList.add('sel'); gear = b.dataset.gear;
});

// ---------- main ----------
const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 1 / 20);
  if (S.mode === 'ride') { for (let i = 0; i < 4; i++) stepRide(dt / 4); }
  else if (S.mode === 'lift') stepLift(dt);
  if (lifts.length) animateLifts(dt);
  if (S.mode === 'ride' || S.mode === 'lift') {
    rider.visible = true;
    rider.position.copy(S.pos);
    const n = S.air ? THREE.Object3D.DEFAULT_UP : normalAt(S.pos.x, S.pos.z, new THREE.Vector3());
    const q = new THREE.Quaternion().setFromUnitVectors(THREE.Object3D.DEFAULT_UP, n);
    const qh = new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -S.heading);
    rider.quaternion.copy(q).multiply(qh);
    const tuck = keys.w || keys.arrowup || touchTuck;
    body.rotation.z = S.lean * 0.55;
    body.scale.y += ((tuck ? 0.72 : 1) - body.scale.y) * Math.min(1, dt * 8);
    body.position.y = S.mode === 'lift' ? -0.6 : 0;
    updateCamera(dt);
    updateHUD(dt);
    drawMini();
    sunLight.position.copy(S.pos).addScaledVector(sun, 300);
    sunLight.target.position.copy(S.pos);
  } else {
    rider.visible = false;
    if (orbit && orbit.enabled) orbit.update();
    sunLight.position.copy(camera.position).addScaledVector(sun, 300);
    sunLight.target.position.copy(camera.position);
  }
  updateSpray(dt);
  // snow drifts with the camera
  const p = flakeGeo.attributes.position.array;
  for (let i = 0; i < FLAKES; i++) {
    p[i * 3 + 1] -= dt * 1.6;
    let dx = p[i * 3] - camera.position.x, dy = p[i * 3 + 1] - camera.position.y, dz = p[i * 3 + 2] - camera.position.z;
    if (dy < -40) dy += 80; if (dy > 40) dy -= 80; if (dx < -60) dx += 120; if (dx > 60) dx -= 120; if (dz < -60) dz += 120; if (dz > 60) dz -= 120;
    p[i * 3] = camera.position.x + dx; p[i * 3 + 1] = camera.position.y + dy; p[i * 3 + 2] = camera.position.z + dz;
  }
  flakeGeo.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  if (mapEl.classList.contains('on')) openMap();
});

// test hook for automated checks
window.__vail = { S, step: (sec) => { for (let t = 0; t < sec; t += 1 / 240) stepRide(1 / 240); }, keys, heightAt, lifts, boardLift };

(async function init() {
  try {
    const d = await loadData();
    T = makeTerrain(d.meta, d.heights, d.mask);
    MAP = d.map;
    buildTerrainMesh(d.tex);
    await new Promise((r) => setTimeout(r, 0));
    buildTrees();
    buildLifts(MAP.lifts);
    indexRuns();
    buildMapCanvas(d.tex);
    progress(1, `${MAP.runs.filter((r) => r.n).length} named runs · ${lifts.length} lifts · ready`);
    // spawn buttons
    spawnList = MAP.spawns;
    const box = $('spawns');
    spawnList.forEach((sp, i) => {
      const b = document.createElement('button'); b.className = 'btn' + (i === 0 ? ' sel' : ''); b.textContent = sp.n; b.title = sp.s || '';
      b.onclick = () => { box.querySelectorAll('.btn').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); chosen = sp; };
      box.appendChild(b);
    });
    let chosen = spawnList[0];
    const play = $('play'); play.disabled = false; play.textContent = 'Drop in';
    play.onclick = () => startRide(chosen);
    $('fly').disabled = false; $('fly').onclick = startFly;
    $('openMap').disabled = false; $('openMap').onclick = () => { openMap(); };
    // menu backdrop: a slow orbit over the mountain
    startFly(); $('start').classList.add('on'); S.mode = 'menu'; orbit.autoRotate = true; orbit.autoRotateSpeed = 0.25; orbit.enabled = true;
    play.addEventListener('click', () => { orbit.autoRotate = false; }, { once: true });
    frame();
  } catch (err) {
    console.error(err);
    progress(0, 'Could not load the mountain: ' + err.message);
  }
})();
