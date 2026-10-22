// Vail 3D look: horizon ranges, clouds, snow-laden spruce, the rider, and the film finish.
// Gameplay lives in game.js; everything here is presentation.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const rndGen = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// ---------- film finish: bloom on the sun and snow glare, then grade + vignette ----------
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, sat: { value: 1.12 }, vig: { value: 0.32 }, cool: { value: 0.04 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float sat, vig, cool; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.299,0.587,0.114));
      c.rgb = mix(vec3(l), c.rgb, sat);
      c.rgb += vec3(-cool*0.5, 0.0, cool) * (1.0 - l);          // cool the shadows, keep highlights clean
      vec2 d = vUv - 0.5; c.rgb *= 1.0 - vig * smoothstep(0.25, 0.85, dot(d,d) * 2.2);
      gl_FragColor = c;
    }`,
};
export function makeComposer(renderer, scene, camera, low) {
  const comp = new EffectComposer(renderer);
  comp.addPass(new RenderPass(scene, camera));
  if (!low) comp.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.22, 0.5, 0.95));
  comp.addPass(new OutputPass());
  comp.addPass(new ShaderPass(GradeShader));
  return comp;
}

// ---------- the ranges around Vail ----------
export async function buildFar(scene, nearT, heightAt) {
  const meta = await (await fetch('data/far.json')).json();
  const bmp = await createImageBitmap(await (await fetch('data/far.png')).blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
  const cv = new OffscreenCanvas(bmp.width, bmp.height), cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(bmp, 0, 0);
  const px = cx.getImageData(0, 0, bmp.width, bmp.height).data;
  const tex = await new THREE.TextureLoader().loadAsync('data/far.jpg');
  tex.colorSpace = THREE.SRGBColorSpace;
  const N = meta.n, cell = meta.cell, half = (N - 1) * cell / 2;
  const pos = new Float32Array(N * N * 3), uv = new Float32Array(N * N * 2), hts = new Float32Array(N * N);
  const nx0 = nearT.x0 + 60, nx1 = -nearT.x0 - 60, nz0 = nearT.z0 + 60, nz1 = -nearT.z0 - 60;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i;
    const h = meta.minE + ((px[k * 4] << 8) | px[k * 4 + 1]) * 2;
    const x = i * cell - half - meta.offX, z = j * cell - half - meta.offZ;
    // under the detailed mountain, sink the far mesh so the two never fight
    const inside = x > nx0 && x < nx1 && z > nz0 && z < nz1;
    hts[k] = h;
    pos[k * 3] = x; pos[k * 3 + 1] = inside ? Math.min(h, heightAt(x, z)) - 90 : h; pos[k * 3 + 2] = z;
    uv[k * 2] = i / (N - 1); uv[k * 2 + 1] = 1 - j / (N - 1);
  }
  const idx = new Uint32Array((N - 1) * (N - 1) * 6); let n = 0;
  for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    const a = j * N + i, b = a + 1, d = a + N, c = d + 1;
    idx[n++] = a; idx[n++] = d; idx[n++] = b; idx[n++] = b; idx[n++] = d; idx[n++] = c;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ map: tex }));
  mesh.renderOrder = -1;
  scene.add(mesh);
  return { meta, hts, N, cell, half, at: (x, z) => {
    const i = Math.round((x + meta.offX + half) / cell), j = Math.round((z + meta.offZ + half) / cell);
    return i < 0 || j < 0 || i >= N || j >= N ? null : hts[j * N + i];
  } };
}

// ---------- clouds: cumulus overhead and a sea of cloud in the far valleys ----------
function cloudTexture(seed) {
  // billowing cumulus: many overlapping puffs, bright sunlit tops, cool grey bellies
  const s = 512, c = document.createElement('canvas'); c.width = s; c.height = s / 2;
  const x = c.getContext('2d'), rnd = rndGen(seed), H = s / 2;
  const puffs = [];
  for (let i = 0; i < 46; i++) {
    const t = rnd(), cx = s * (0.12 + t * 0.76), r = s * (0.05 + rnd() * 0.09) * (1 - Math.abs(t - 0.5));
    puffs.push([cx, H * 0.68 - rnd() * H * 0.38 * (1 - Math.abs(t - 0.5) * 1.6), r + s * 0.03]);
  }
  for (const [cx, cy, r] of puffs) {
    const g = x.createRadialGradient(cx - r * 0.25, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.55, 'rgba(236,242,250,0.8)'); g.addColorStop(1, 'rgba(225,233,245,0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  }
  const b = x.createLinearGradient(0, H * 0.35, 0, H * 0.85);
  b.addColorStop(0, 'rgba(0,0,0,0)'); b.addColorStop(1, 'rgba(150,170,200,0.55)');
  x.globalCompositeOperation = 'source-atop'; x.fillStyle = b; x.fillRect(0, 0, s, H);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function buildClouds(scene, far, low) {
  const group = new THREE.Group(); const rnd = rndGen(21);
  const texes = [1, 2, 3, 4].map(cloudTexture);
  const n = low ? 10 : 22;
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, d = 22000 + rnd() * 30000;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texes[i % 4], transparent: true, depthWrite: false, fog: false, opacity: 0.75 }));
    const w = 5000 + rnd() * 6000; sp.scale.set(w, w * 0.5, 1);
    sp.position.set(Math.cos(a) * d, 6500 + rnd() * 2500, Math.sin(a) * d);
    group.add(sp);
  }
  // valley cloud sea: only where the far ground sits low, so the peaks poke through
  if (far) {
    let placed = 0;
    for (let tries = 0; tries < 4000 && placed < (low ? 40 : 110); tries++) {
      const x = (rnd() - 0.5) * 60000, z = (rnd() - 0.5) * 60000;
      if (Math.abs(x) < 9000 && Math.abs(z) < 7000) continue;
      const h = far.at(x, z); if (h === null || h > 2700) continue;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texes[placed % 4], transparent: true, depthWrite: false, opacity: 0.9 }));
      const w = 2200 + rnd() * 2800; sp.scale.set(w, w * 0.4, 1);
      sp.position.set(x, 2780 + rnd() * 160, z);
      group.add(sp); placed++;
    }
  }
  scene.add(group);
  return group;
}

// ---------- spruce: tiers of drooping branch skirts, snow on top, dark green below ----------
export function spruceGeometry(tiers, segs) {
  const pos = [], col = [];
  const green = new THREE.Color(0x2d5a37), deep = new THREE.Color(0x173323), snow = new THREE.Color(0xffffff);
  const push = (p, c) => { pos.push(p.x, p.y, p.z); col.push(c.r, c.g, c.b); };
  const rnd = rndGen(3 + tiers * 7 + segs);
  for (let t = 0; t < tiers; t++) {
    const f = t / tiers;
    const y0 = 0.1 + f * 0.78, r = 0.46 * (1 - f) + 0.06, top = y0 + 0.2 * (1 - f * 0.4);
    const apex = new THREE.Vector3(0, top, 0);
    const ring = [];
    for (let s = 0; s < segs; s++) {
      const a = (s / segs) * Math.PI * 2 + t * 0.4, rr = r * (s % 2 ? 0.68 : 1) * (0.9 + rnd() * 0.2);
      ring.push(new THREE.Vector3(Math.cos(a) * rr, y0 - (s % 2 ? 0 : 0.05), Math.sin(a) * rr));
    }
    const under = new THREE.Vector3(0, y0 + 0.04, 0);
    for (let s = 0; s < segs; s++) {
      const p = ring[s], q = ring[(s + 1) % segs];
      // top surface: snow loads the outer branch tips, needles show near the trunk
      const cTop = green.clone().lerp(snow, 0.5 + rnd() * 0.35), cIn = green.clone().lerp(snow, 0.1);
      push(apex, cIn); push(q, cTop); push(p, cTop);
      // underside: deep shade
      push(under, deep); push(p, green); push(q, green);
    }
  }
  // trunk stub
  const tr = 0.035, ty = 0.14;
  for (let s = 0; s < 5; s++) {
    const a = s / 5 * Math.PI * 2, b = (s + 1) / 5 * Math.PI * 2, brown = new THREE.Color(0x3a2a1f);
    const p0 = new THREE.Vector3(Math.cos(a) * tr, 0, Math.sin(a) * tr), p1 = new THREE.Vector3(Math.cos(b) * tr, 0, Math.sin(b) * tr);
    const p2 = p1.clone().setY(ty), p3 = p0.clone().setY(ty);
    push(p0, brown); push(p2, brown); push(p1, brown); push(p0, brown); push(p3, brown); push(p2, brown);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

// ---------- the rider ----------
export const OUTFITS = {
  ember: { label: 'Ember', jacket: 0xff6a1a, pants: 0x2b2f36, helmet: 0x111418, accent: 0xffd23f, board: ['#0f1c2e', '#ff6a1a', '#ffd23f'] },
  glacier: { label: 'Glacier', jacket: 0x9fe3ff, pants: 0x1a1e24, helmet: 0xf2f2f2, accent: 0x38bdf8, board: ['#f4f7fb', '#38bdf8', '#0f1c2e'] },
  scarlet: { label: 'Scarlet', jacket: 0xd7263d, pants: 0xe9e4da, helmet: 0xf5f5f5, accent: 0x111111, board: ['#d7263d', '#111111', '#f4f7fb'] },
  moss: { label: 'Moss', jacket: 0x5a6b3a, pants: 0xcfbf9f, helmet: 0x2a2a2a, accent: 0xff8a00, board: ['#2a2a2a', '#cfbf9f', '#ff8a00'] },
};
function boardTexture(colors, ski) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = colors[0]; x.fillRect(0, 0, 64, 512);
  x.fillStyle = colors[1];
  for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(0, 120 + i * 60); x.lineTo(64, 60 + i * 60); x.lineTo(64, 84 + i * 60); x.lineTo(0, 144 + i * 60); x.fill(); }
  x.fillStyle = colors[2]; x.beginPath(); x.moveTo(8, 470); x.lineTo(32, 400); x.lineTo(56, 470); x.fill();
  if (!ski) { x.fillStyle = colors[2]; x.fillRect(0, 0, 64, 10); x.fillRect(0, 502, 64, 10); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function lathe(profile, segs = 16) { return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segs); }
const taper = (r0, r1, len, segs = 12) => new THREE.CylinderGeometry(r1, r0, len, segs, 1).translate(0, -len / 2, 0);

export class Rider {
  constructor(gear, outfitKey) {
    this.gear = gear;
    const o = OUTFITS[outfitKey] || OUTFITS.ember;
    const fabric = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82, metalness: 0 });
    const jacket = fabric(o.jacket), pants = fabric(o.pants), dark = fabric(0x15171b);
    const helmet = new THREE.MeshStandardMaterial({ color: o.helmet, roughness: 0.35, metalness: 0.05 });
    const lens = new THREE.MeshStandardMaterial({ color: 0xffb347, roughness: 0.08, metalness: 0.9, emissive: 0x3a1d00 });
    const accent = fabric(o.accent);
    this.root = new THREE.Group();
    const mk = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
    const G = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };

    // gear
    const gearMat = new THREE.MeshStandardMaterial({ map: boardTexture(o.board, gear === 'ski'), roughness: 0.4, metalness: 0.1 });
    if (gear === 'board') {
      const shape = new THREE.Shape(); const L = 0.78, Wd = 0.135, R = 0.12;
      shape.moveTo(-Wd, -L + R); shape.quadraticCurveTo(-Wd, -L, -Wd + R, -L); shape.lineTo(Wd - R, -L); shape.quadraticCurveTo(Wd, -L, Wd, -L + R);
      shape.lineTo(Wd * 0.92, 0); shape.lineTo(Wd, L - R); shape.quadraticCurveTo(Wd, L, Wd - R, L); shape.lineTo(-Wd + R, L);
      shape.quadraticCurveTo(-Wd, L, -Wd, L - R); shape.lineTo(-Wd * 0.92, 0); shape.closePath();
      const bg = new THREE.ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.004, bevelSegments: 1 });
      bg.rotateX(-Math.PI / 2); bg.translate(0, 0.012, 0);
      // map the graphic along the board's length
      const p = bg.attributes.position, uvA = bg.attributes.uv;
      for (let i = 0; i < p.count; i++) uvA.setXY(i, (p.getX(i) / Wd + 1) / 2, (p.getZ(i) / L + 1) / 2);
      mk(bg, gearMat, this.root);
      for (const z of [-0.25, 0.25]) mk(new THREE.BoxGeometry(0.2, 0.05, 0.12), dark, this.root, 0, 0.05, z);
    } else {
      this.skis = [];
      for (const sx of [-0.12, 0.12]) {
        const ski = G(this.root, sx, 0.015, -0.05);
        mk(new THREE.BoxGeometry(0.085, 0.016, 1.7), gearMat, ski);
        const tip = mk(new THREE.BoxGeometry(0.085, 0.016, 0.16), gearMat, ski, 0, 0.03, -0.9); tip.rotation.x = 0.45;
        mk(new THREE.BoxGeometry(0.1, 0.04, 0.2), dark, ski, 0, 0.03, 0.05);
        this.skis.push(ski);
      }
    }

    // body: the whole figure turns sideways on a board
    this.body = G(this.root);
    this.hips = G(this.body, 0, 0.95, 0);
    mk(lathe([[0.001, -0.08], [0.17, -0.06], [0.19, 0.04], [0.18, 0.12]]), pants, this.hips).scale.z = 0.78;
    this.legs = [-1, 1].map((side) => {
      const thigh = G(this.hips, side * 0.1, 0, 0);
      mk(taper(0.095, 0.085, 0.47), pants, thigh);
      const shin = G(thigh, 0, -0.45, 0);
      mk(taper(0.088, 0.095, 0.4), pants, shin);                      // baggy pants flare over the boot
      const foot = G(shin, 0, -0.42, 0);
      const boot = mk(new THREE.BoxGeometry(0.13, 0.12, gear === 'board' ? 0.3 : 0.32), dark, foot, 0, -0.01, -0.04);
      boot.geometry.translate(0, 0, 0);
      return { thigh, shin, foot, side };
    });
    this.spine = G(this.hips, 0, 0.1, 0);
    // puffy jacket with a hem that hangs past the hips
    const coat = mk(lathe([[0.001, -0.2], [0.2, -0.19], [0.215, -0.05], [0.22, 0.1], [0.21, 0.28], [0.18, 0.4], [0.1, 0.47], [0.001, 0.48]], 18), jacket, this.spine);
    coat.scale.z = 0.74;
    mk(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), jacket, this.spine, 0, 0.42, 0.1).scale.set(1, 0.8, 0.7); // hood
    mk(new THREE.BoxGeometry(0.44, 0.03, 0.31), accent, this.spine, 0, 0.05, 0).visible = true;                                        // stripe
    this.neck = G(this.spine, 0, 0.5, 0);
    this.head = G(this.neck, 0, 0.13, 0);
    mk(new THREE.SphereGeometry(0.085, 12, 10), fabric(0x1a1a1a), this.head, 0, -0.04, -0.01);                              // balaclava
    mk(new THREE.SphereGeometry(0.135, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), helmet, this.head, 0, 0.0, 0.01);
    const gog = mk(new THREE.CylinderGeometry(0.128, 0.128, 0.065, 20, 1, true, Math.PI * 0.6, Math.PI * 0.8), lens, this.head, 0, -0.02, 0);
    gog.rotation.y = Math.PI * 0.5; gog.scale.set(1, 1, 0.92);
    mk(new THREE.TorusGeometry(0.133, 0.012, 6, 24), dark, this.head, 0, -0.02, 0).rotation.x = Math.PI / 2;                // strap
    this.arms = [-1, 1].map((side) => {
      const sh = G(this.spine, side * 0.22, 0.38, 0);
      mk(taper(0.075, 0.068, 0.3), jacket, sh);
      const fore = G(sh, 0, -0.29, 0);
      mk(taper(0.068, 0.066, 0.27), jacket, fore);
      const hand = G(fore, 0, -0.29, 0);
      mk(new THREE.SphereGeometry(0.058, 10, 8), dark, hand).scale.set(0.9, 1.15, 1);
      if (gear === 'ski') { const pole = mk(new THREE.CylinderGeometry(0.009, 0.009, 1.15, 5), fabric(0x9aa3ad), hand, 0, -0.5, 0); pole.rotation.x = 0.3; }
      return { sh, fore, hand, side };
    });
    if (gear === 'board') this.body.rotation.y = -Math.PI / 2;  // stand sideways, regular stance
    this.t = 0;
  }

  // crouch 0..1, lean -1..1 (into the turn), tuck/brake/air flags, spin for air rotation
  pose(dt, s) {
    this.t += dt;
    const board = this.gear === 'board';
    const crouch = THREE.MathUtils.clamp(s.crouch, 0, 1);
    const a = 0.25 + crouch * 0.75;                // knee flexion
    const legLen = 0.45 + 0.43;
    this.hips.position.y = 0.07 + legLen * Math.cos(a) * 0.98 + 0.04;
    for (const L of this.legs) {
      const splay = board ? L.side * 0.2 : 0;
      L.thigh.rotation.set(a, 0, splay);
      L.shin.rotation.set(-2 * a, 0, -splay * 0.6);
      L.foot.rotation.set(a, 0, -splay * 0.4);
    }
    // upper body: riders look down the hill and keep their hands quiet
    const fwd = board ? 0.18 + crouch * 0.35 : 0.3 + crouch * 0.55 + (s.tuck ? 0.25 : 0);
    this.spine.rotation.set(-fwd, board ? 0.5 : 0, 0);
    this.head.rotation.set(fwd * 0.7, board ? 0.85 : 0, 0);
    const sway = Math.sin(this.t * 2.2) * 0.05;
    for (const A of this.arms) {
      if (board) {
        const grab = s.air && s.airT > 0.2 && A.side > 0;
        if (grab) { A.sh.rotation.set(0.3, 0, -0.2); A.fore.rotation.set(-0.2, 0, 0); }
        else { A.sh.rotation.set(0.35 + sway, 0, A.side * (0.75 + Math.abs(s.lean) * 0.3)); A.fore.rotation.set(-0.5, 0, 0); }
      } else if (s.tuck) { A.sh.rotation.set(1.25, 0, A.side * 0.25); A.fore.rotation.set(-1.3, 0, 0); }
      else { A.sh.rotation.set(0.55 + sway, 0, A.side * 0.32); A.fore.rotation.set(-0.7, 0, 0); }
    }
    // the whole rider rolls into the carve; skis stay parallel and edge with it
    this.root.rotation.z = -s.lean * (board ? 0.42 : 0.35);
    if (this.skis) for (const k of this.skis) k.rotation.y = s.brake ? 0.35 * Math.sign(k.position.x) : 0;
    if (board) this.body.rotation.y = -Math.PI / 2 + (s.brake ? 0.25 : 0);
  }
}

// ---------- soft round particle for snow spray and powder ----------
export function softDot() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); return t;
}
