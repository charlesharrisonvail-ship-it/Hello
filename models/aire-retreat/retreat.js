// Procedural rebuild of the mountain retreat in docs/media/aire-retreat-poster.jpg
// (live-site branch). Units are metres; +x runs along the front facade, +z faces the
// camera, y = 0 is the main floor / deck level.
//
// Proportions were measured off the poster and scaled so the main gable is 10 m wide.
// Anything the poster does not show (rear walls, roof backs, the far side of the
// chimney, the deck's underside supports) is inferred and marked INFERRED below.

export const DIMS = {
  main: { width: 10, depth: 14, wallH: 5.2, rise: 5.6, overhangFront: 1.4, overhangSide: 0.8, glassInset: 0.7 },
  wing: { width: 8.6, depth: 7, wallH: 3.4, pitchDeg: 16, overhangFront: 1.1, overhangEnd: 0.9 },
  deck: { extendLeft: 1.0, extendFront: 1.6, thickness: 0.45, railH: 1.05 },
  plinth: { height: 2.4 },
  chimney: { w: 2.1, d: 2.3, x: 9.2, z: -4.2, top: 12.4 },
};

// Albedo palette. The poster is lit at blue hour, so sampled pixels are far darker than
// the materials themselves; these are the daylight colours they imply.
export const PALETTE = {
  roof: 0x2a2f36, // standing-seam metal, charcoal
  frame: 0x18191d, // window frames, fascia, steel
  cedar: 0x7b4a2b, // side-wall cladding
  soffit: 0xb7773f, // tongue-and-groove gable soffit
  stone: 0x8b8781, // plinth and chimney
  stoneDark: 0x5e5b57,
  glassTint: 0x9fb4c8,
  interiorGlow: 0xffc27a, // warm lamp light behind the glass
  fire: 0xff7a2a,
  rail: 0xcfe3ee,
  rock: 0x6f7280,
  pine: 0x1d2a1a,
  ground: 0x2f3a28,
  snow: 0xe9eef5,
  mountain: 0x3b4a66,
};

function canvasTexture(THREE, w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Seeded random so every load builds the same house.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function makeMaterials(THREE) {
  const rand = rng(7);
  const cedarTex = canvasTexture(THREE, 256, 256, (g, w, h) => {
    g.fillStyle = '#7b4a2b'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) {
      const v = 0.85 + rand() * 0.3;
      g.fillStyle = `rgb(${123 * v | 0},${74 * v | 0},${43 * v | 0})`;
      g.fillRect(x, 0, 15, h);
      g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x + 15, 0, 1, h);
    }
  }, [3, 2]);
  const soffitTex = canvasTexture(THREE, 256, 64, (g, w, h) => {
    g.fillStyle = '#b7773f'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 8) { g.fillStyle = 'rgba(60,25,5,.35)'; g.fillRect(0, y, w, 1); }
  }, [1, 6]);
  const stoneTex = canvasTexture(THREE, 256, 256, (g, w, h) => {
    g.fillStyle = '#4e4b47'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 22) {
      let x = (y / 22) % 2 ? -18 : 0;
      while (x < w) {
        const sw = 26 + rand() * 30, v = 0.8 + rand() * 0.4;
        g.fillStyle = `rgb(${139 * v | 0},${135 * v | 0},${129 * v | 0})`;
        g.fillRect(x + 2, y + 2, sw - 3, 19);
        x += sw;
      }
    }
  }, [2, 1]);

  const std = (o) => new THREE.MeshStandardMaterial(o);
  return {
    roof: std({ color: PALETTE.roof, metalness: 0.6, roughness: 0.45 }),
    frame: std({ color: PALETTE.frame, metalness: 0.5, roughness: 0.5 }),
    cedar: std({ map: cedarTex, roughness: 0.85 }),
    soffit: std({ map: soffitTex, roughness: 0.7, emissive: 0x3a1a05, emissiveIntensity: 0.6 }),
    stone: std({ map: stoneTex, roughness: 0.95 }),
    glass: new THREE.MeshPhysicalMaterial({ color: PALETTE.glassTint, metalness: 0, roughness: 0.05, transmission: 0, transparent: true, opacity: 0.18 }),
    interior: std({ color: 0x3a2414, emissive: PALETTE.interiorGlow, emissiveIntensity: 0.55, roughness: 1 }),
    fire: std({ color: 0x000000, emissive: PALETTE.fire, emissiveIntensity: 2.2 }),
    rail: new THREE.MeshPhysicalMaterial({ color: PALETTE.rail, roughness: 0.05, transparent: true, opacity: 0.22 }),
    downlight: std({ color: 0xffffff, emissive: 0xffe0b0, emissiveIntensity: 3 }),
    rock: std({ color: PALETTE.rock, roughness: 1, flatShading: true }),
    pine: std({ color: PALETTE.pine, roughness: 1, flatShading: true }),
    trunk: std({ color: 0x3b2a1e, roughness: 1 }),
    ground: std({ color: PALETTE.ground, roughness: 1, flatShading: true }),
  };
}

const box = (THREE, mat, w, h, d, x, y, z) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  return m;
};

// A pitched roof built from its exact cross-section: a thin chevron with eaves,
// extruded along the ridge. Standing seams are thin copies spaced along the ridge.
function chevronRoof(THREE, mat, span, rise, overhang, thick, length, seamEvery) {
  const pitch = Math.atan2(rise, span / 2);
  const drop = overhang * Math.tan(pitch);
  const up = thick / Math.cos(pitch);
  const s = new THREE.Shape();
  s.moveTo(-overhang, -drop);
  s.lineTo(span / 2, rise);
  s.lineTo(span + overhang, -drop);
  s.lineTo(span + overhang, -drop + up);
  s.lineTo(span / 2, rise + up);
  s.lineTo(-overhang, -drop + up);
  s.closePath();
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: length, bevelEnabled: false }), mat);
  body.castShadow = body.receiveShadow = true;
  g.add(body);
  if (seamEvery) {
    const seam = new THREE.Shape();
    const u2 = up + 0.07;
    seam.moveTo(-overhang, -drop + up); seam.lineTo(span / 2, rise + up); seam.lineTo(span + overhang, -drop + up);
    seam.lineTo(span + overhang, -drop + u2); seam.lineTo(span / 2, rise + u2); seam.lineTo(-overhang, -drop + u2); seam.closePath();
    const sg = new THREE.ExtrudeGeometry(seam, { depth: 0.035, bevelEnabled: false });
    for (let z = seamEvery / 2; z < length; z += seamEvery) {
      const m = new THREE.Mesh(sg, mat); m.position.z = z; g.add(m);
    }
  }
  return g;
}

function gableShape(THREE, width, wallH, rise) {
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(width, 0); s.lineTo(width, wallH);
  s.lineTo(width / 2, wallH + rise); s.lineTo(0, wallH); s.closePath();
  return s;
}

function buildMainWing(THREE, mats) {
  const { width: W, depth: D, wallH: H, rise: R, overhangFront: OF, overhangSide: OS, glassInset: GI } = DIMS.main;
  const g = new THREE.Group();
  const halfPitch = Math.atan2(R, W / 2);
  const slopeLen = Math.hypot(W / 2 + OS, R + OS * Math.tan(halfPitch));

  // Side walls in cedar, running from the glass line back to the rear wall.
  const wallD = D - GI;
  g.add(box(THREE, mats.cedar, 0.3, H, wallD, 0.15, H / 2, -GI - wallD / 2));
  g.add(box(THREE, mats.cedar, 0.3, H, wallD, W - 0.15, H / 2, -GI - wallD / 2));

  // Rear gable wall (INFERRED: not visible in the poster).
  const rear = new THREE.Mesh(new THREE.ShapeGeometry(gableShape(THREE, W, H, R)), mats.cedar);
  rear.position.set(0, 0, -D); rear.rotation.y = Math.PI;
  rear.position.x = W;
  g.add(rear);

  // Front glazed gable: glass pane, warm interior behind, black mullion grid.
  const glassGeo = new THREE.ShapeGeometry(gableShape(THREE, W - 0.6, H, R - 0.35));
  const glass = new THREE.Mesh(glassGeo, mats.glass);
  glass.position.set(0.3, 0, -GI);
  g.add(glass);
  const glow = new THREE.Mesh(new THREE.ShapeGeometry(gableShape(THREE, W - 0.6, H, R - 0.35)), mats.interior);
  glow.position.set(0.3, 0, -GI - 2.4);
  g.add(glow);

  for (const x of [0.32, W - 0.32]) g.add(box(THREE, mats.interior, 0.04, H, 2.4, x, H / 2, -GI - 1.2));
  // Stone fireplace wall inside, centred behind the second bay, with a fire.
  g.add(box(THREE, mats.stone, 2.6, H + 1.5, 0.4, W * 0.42, (H + 1.5) / 2, -GI - 2.2));
  g.add(box(THREE, mats.fire, 1.0, 0.6, 0.05, W * 0.42, 0.9, -GI - 1.98));

  // Mullions: 4 bays across, transom at the eave line, rakes follow the roof.
  const fz = -GI + 0.05;
  for (let i = 0; i <= 4; i++) {
    const x = 0.3 + i * ((W - 0.6) / 4);
    const yTop = H + (R - 0.35) * (1 - Math.abs(x - W / 2) / ((W - 0.6) / 2));
    g.add(box(THREE, mats.frame, 0.12, yTop, 0.14, x, yTop / 2, fz));
  }
  g.add(box(THREE, mats.frame, W - 0.4, 0.16, 0.14, W / 2, H, fz));
  g.add(box(THREE, mats.frame, W - 0.4, 0.14, 0.14, W / 2, 0.07, fz));
  for (const side of [-1, 1]) {
    const rake = box(THREE, mats.frame, Math.hypot(W / 2 - 0.3, R - 0.35), 0.16, 0.14, 0, 0, fz);
    rake.position.set(W / 2 + side * (W / 2 - 0.3) / 2, H + (R - 0.35) / 2, fz);
    rake.rotation.z = side * -Math.atan2(R - 0.35, W / 2 - 0.3);
    g.add(rake);
  }

  // Roof: one chevron from the poster's 49 degree pitch, deep front overhang.
  const roof = chevronRoof(THREE, mats.roof, W, R, OS, 0.3, D + OF, 0.45);
  roof.position.set(0, H, -D);
  g.add(roof);
  // Wood soffit under the front overhang (glass line to roof edge) with downlights.
  const soffit = chevronRoof(THREE, mats.soffit, W, R, OS - 0.05, 0.06, OF + GI, 0);
  soffit.position.set(0, H - 0.08, -GI);
  g.add(soffit);
  for (const side of [-1, 1]) {
    for (let k = 1; k <= 6; k++) {
      const t = k / 7;
      const dl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mats.downlight);
      dl.position.set(W / 2 + side * t * (W / 2), H + R * (1 - t) - 0.16, OF * 0.4);
      g.add(dl);
    }
  }
  // Black fascia on the front rakes.
  const fascia = chevronRoof(THREE, mats.frame, W, R, OS, 0.34, 0.12, 0);
  fascia.position.set(0, H - 0.04, OF - 0.12);
  g.add(fascia);

  // Narrow vertical window on the right side wall, near the front.
  g.add(box(THREE, mats.interior, 0.06, 2.6, 1.0, W + 0.02, 2.2, -2.6));
  g.add(box(THREE, mats.frame, 0.08, 2.8, 0.1, W + 0.04, 2.2, -2.05));
  g.add(box(THREE, mats.frame, 0.08, 2.8, 0.1, W + 0.04, 2.2, -3.15));

  // Floor slab and the stone plinth the wing sits on.
  const P = DIMS.plinth.height;
  g.add(box(THREE, mats.frame, W + 0.6, 0.3, D + 1.0, W / 2, -0.15, -D / 2 + 0.5));
  g.add(box(THREE, mats.stone, W + 0.4, P, D + 0.6, W / 2, -0.3 - P / 2, -D / 2 + 0.6));

  // Warm interior lights so the glazing glows onto the deck.
  const lamp = new THREE.PointLight(0xffb066, 30, 18, 2);
  lamp.position.set(W / 2, 3, -GI - 2.5);
  g.add(lamp);
  return g;
}

function buildSideWing(THREE, mats) {
  const { width: SW, depth: SD, wallH: SH, pitchDeg, overhangFront: OF, overhangEnd: OE } = DIMS.wing;
  const g = new THREE.Group();
  const pitch = (pitchDeg * Math.PI) / 180;
  const rise = Math.tan(pitch) * (SD / 2);
  const x0 = -SW;

  // Fully glazed front and left end with black posts.
  const front = box(THREE, mats.glass, SW, SH, 0.04, x0 + SW / 2, SH / 2, -0.5);
  g.add(front);
  g.add(box(THREE, mats.interior, SW - 0.2, SH - 0.2, 0.05, x0 + SW / 2, SH / 2, -SD + 0.6));
  g.add(box(THREE, mats.glass, 0.04, SH, SD - 0.5, x0, SH / 2, -0.5 - (SD - 0.5) / 2));
  for (let i = 0; i <= 6; i++) g.add(box(THREE, mats.frame, 0.12, SH, 0.12, x0 + i * (SW / 6), SH / 2, -0.5));
  for (let i = 0; i <= 3; i++) g.add(box(THREE, mats.frame, 0.12, SH, 0.12, x0, SH / 2, -0.5 - i * ((SD - 0.5) / 3)));
  g.add(box(THREE, mats.frame, SW + 0.2, 0.2, 0.2, x0 + SW / 2, SH, -0.5));
  // Rear wall (INFERRED).
  g.add(box(THREE, mats.cedar, SW, SH, 0.25, x0 + SW / 2, SH / 2, -SD));

  // Furniture silhouettes and a chandelier glow behind the glass.
  g.add(box(THREE, mats.frame, 2.4, 0.75, 1.0, x0 + 2.2, 0.38, -2.5));
  g.add(box(THREE, mats.frame, 1.8, 0.8, 0.9, x0 + 5.6, 0.4, -2.2));
  const chand = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), mats.downlight);
  chand.position.set(x0 + 4.4, SH - 0.6, -3.0);
  g.add(chand);
  const lamp = new THREE.PointLight(0xffb066, 18, 12, 2);
  lamp.position.set(x0 + 4.4, 2.4, -3);
  g.add(lamp);

  // Low-pitch side-gable roof, ridge parallel to the facade, deep front overhang.
  // Built as a chevron in the z-y plane and extruded along x.
  const wr = chevronRoof(THREE, mats.roof, SD, rise, OF, 0.24, SW + OE, 0.45);
  wr.rotation.y = Math.PI / 2;
  wr.position.set(x0 - OE, SH, 0); // rotated: span runs from z = 0 back to z = -SD
  g.add(wr);
  const wf = chevronRoof(THREE, mats.frame, SD, rise, OF, 0.3, 0.12, 0);
  wf.rotation.y = Math.PI / 2;
  wf.position.set(x0 - OE - 0.02, SH - 0.03, 0);
  g.add(wf);

  // Cantilevered deck: thin slab, dark steel edge beam, frameless glass rail.
  const { extendLeft: EL, extendFront: EF, thickness: T, railH: RH } = DIMS.deck;
  const deckW = SW + EL, deckD = SD + EF;
  const dx = x0 - EL + deckW / 2, dz = EF - deckD / 2;
  g.add(box(THREE, mats.frame, deckW, T, deckD, dx, -T / 2, dz));
  g.add(box(THREE, mats.frame, deckW, 0.55, 0.25, dx, -0.55, EF - 0.12));
  g.add(box(THREE, mats.frame, 0.25, 0.55, deckD, x0 - EL + 0.12, -0.55, dz));
  g.add(box(THREE, mats.rail, deckW, RH, 0.03, dx, RH / 2, EF - 0.05));
  g.add(box(THREE, mats.rail, 0.03, RH, deckD, x0 - EL + 0.05, RH / 2, dz));
  // Steel struts back to the hillside (INFERRED: hidden in shadow in the poster).
  for (const zz of [-1.5, -5.5]) {
    const s = box(THREE, mats.frame, 0.25, 4.5, 0.25, x0 + 2.0, -2.4, zz);
    s.rotation.z = -0.5;
    g.add(s);
  }
  return g;
}

function buildChimney(THREE, mats) {
  const { w, d, x, z, top } = DIMS.chimney;
  const base = -DIMS.plinth.height - 0.3;
  const g = new THREE.Group();
  g.add(box(THREE, mats.stone, w, top - base, d, x + w / 2, base + (top - base) / 2, z));
  g.add(box(THREE, mats.frame, w + 0.35, 0.18, d + 0.35, x + w / 2, top + 0.09, z));
  g.add(box(THREE, mats.frame, w * 0.6, 0.5, d * 0.6, x + w / 2, top + 0.45, z));
  g.add(box(THREE, mats.frame, w + 0.5, 0.12, d + 0.5, x + w / 2, top + 0.76, z));
  return g;
}

function buildSite(THREE, mats) {
  const rand = rng(42);
  const g = new THREE.Group();
  // Hillside falling away to the front-left, with the house on a shelf.
  const geo = new THREE.PlaneGeometry(140, 120, 70, 60);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    let y = -2.7 - Math.max(0, z - 2) * 0.55 - Math.max(0, -x - 4) * 0.35 + (rand() - 0.5) * 0.6;
    if (x > -10 && x < 14 && z < 3 && z > -20) y = Math.max(y, -2.7);
    pos.setY(i, y);
  }
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, mats.ground);
  ground.receiveShadow = true;
  g.add(ground);

  const heightAt = (x, z) => -2.7 - Math.max(0, z - 2) * 0.55 - Math.max(0, -x - 4) * 0.35;
  // Granite boulders on the slope in front of the plinth.
  for (let i = 0; i < 26; i++) {
    const x = -14 + rand() * 32, z = 3 + rand() * 18;
    const r = 0.6 + rand() * 1.8;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), mats.rock);
    rock.scale.set(1.3, 0.6, 1);
    rock.rotation.set(rand(), rand() * 3, rand());
    rock.position.set(x, heightAt(x, z) + r * 0.2, z);
    rock.castShadow = rock.receiveShadow = true;
    g.add(rock);
  }
  // Spruce: stacked cones, denser down the valley.
  const tree = (x, z, h) => {
    const t = new THREE.Group();
    t.add(box(THREE, mats.trunk, 0.25, h * 0.2, 0.25, 0, h * 0.1, 0));
    for (let k = 0; k < 4; k++) {
      const c = new THREE.Mesh(new THREE.ConeGeometry(h * (0.26 - k * 0.05), h * 0.38, 7), mats.pine);
      c.position.y = h * (0.28 + k * 0.17);
      c.castShadow = true;
      t.add(c);
    }
    t.position.set(x, heightAt(x, z), z);
    g.add(t);
  };
  [[3, 5, 4.5], [7.5, 6, 4], [12.5, 4, 5.5], [17, -2, 13], [-8, 14, 7], [-13, 18, 9]].forEach((a) => tree(...a));
  // Valley forest below and left of the house, clear of the poster's sight line.
  for (let i = 0; i < 110; i++) {
    const x = -95 + rand() * 70, z = -40 + rand() * 60;
    tree(x, z, 7 + rand() * 9);
  }
  return g;
}

// INFERRED backdrop: the poster's snow peaks are reduced to low-poly ridges.
function buildMountains(THREE) {
  const g = new THREE.Group();
  const rand = rng(99);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 });
  for (let r = 0; r < 3; r++) {
    const geo = new THREE.PlaneGeometry(600, 160, 60, 16);
    const pos = geo.attributes.position;
    const col = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i) + 80;
      const peak = Math.abs(Math.sin(x * 0.018 + r) * 80 + Math.sin(x * 0.051 + r * 2) * 35) + 30;
      const h = Math.min(y, peak * (0.7 + rand() * 0.3));
      pos.setY(i, h);
      const snow = h > 38 + rand() * 8 ? 1 : 0;
      const c = new THREE.Color(snow ? PALETTE.snow : PALETTE.mountain).multiplyScalar(snow ? 1 : 0.8);
      col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.position.set(-150 + r * 40, -45 + r * 4, -220 - r * 45);
    m.rotation.y = 0.35;
    g.add(m);
  }
  return g;
}

export function buildRetreat(THREE) {
  const mats = makeMaterials(THREE);
  const root = new THREE.Group();
  root.name = 'aire-retreat';
  const house = new THREE.Group();
  house.name = 'house';
  house.add(buildMainWing(THREE, mats));
  house.add(buildSideWing(THREE, mats));
  house.add(buildChimney(THREE, mats));
  root.add(house);
  root.add(buildSite(THREE, mats));
  root.add(buildMountains(THREE));
  return root;
}

// Blue-hour lighting and sky to match the poster's mood.
export function lightScene(THREE, scene) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#0b2a5c');
  grad.addColorStop(0.55, '#2c4f86');
  grad.addColorStop(0.85, '#8a8fb0');
  grad.addColorStop(1, '#c9a9a0');
  g.fillStyle = grad; g.fillRect(0, 0, 4, 256);
  const sky = new THREE.CanvasTexture(c);
  sky.colorSpace = THREE.SRGBColorSpace;
  scene.background = sky;
  scene.fog = new THREE.Fog(0x2c3f66, 220, 900);
  scene.add(new THREE.HemisphereLight(0x6f8cc4, 0x1a1f14, 0.9));
  const moon = new THREE.DirectionalLight(0x9db4e0, 0.8);
  moon.position.set(-30, 40, 30);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40 });
  scene.add(moon);
}
