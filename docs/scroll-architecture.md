# Frame-based 3D scroll architecture

How the EpiVail landing page turns scroll position into a 3D flythrough, and
why each piece is built the way it is.

---

## 1. The shape of the thing

```
tools/scene/scene.html      Three.js scene — the only place 3D exists
        │  (offline, once)
        ▼
tools/render-frames.mjs     Headless Chromium bakes it to WebP sequences
        │
        ▼
assets/frames/<tier>/       90 frames x 4 tiers + manifest.json
        │  (runtime)
        ▼
assets/js/frame-sequence.js Loads + paints frames onto a 2D canvas
assets/js/scroll-engine.js  One rAF loop, one scroll read per frame
assets/js/main.js           Binds progress to frames, dissolves, chapter rail
```

The runtime ships **no 3D library and no WebGL context**. Three.js is a build
dependency in `tools/`, not a page dependency.

---

## 2. Why baked frames instead of live WebGL

A live scene has to traverse a scene graph, upload uniforms and flush draw
calls on every animation frame, and its cost scales with whatever GPU the
visitor happens to have. A baked sequence collapses all of that to a single
`drawImage` of an already-decoded bitmap — a fixed, tiny cost that is the same
on a MacBook Pro and a four-year-old Android.

That trade buys determinism. The expensive, variable work happens once on a
build machine; the visitor pays only for compositing. It costs flexibility —
the camera path is fixed at bake time — which is the right trade for a
landing page where the camera path is a design decision, not a user input.

### Re-baking

```bash
cd tools
npm install
npm run bake                 # 90 frames, all tiers, ~90s
node render-frames.mjs --frames 120 --quality 0.9
```

The terrain is generated from a seeded integer-lattice hash (`SEED` in
`scene.html`), so a re-bake is byte-identical unless the scene is edited.
`CHROMIUM_PATH` overrides browser discovery for CI images that ship their own.

---

## 3. The three acts

The camera flies a Catmull-Rom spline down a procedurally generated valley,
retimed so each act has its own pace.

| Progress | Act | What moves |
|---|---|---|
| 0.00 – 0.36 | **Ascent** | Aerial above the ridgeline. Starfield dissolves out, key light climbs from pre-dawn to alpenglow, sky glow ramps up. |
| 0.30 – 0.72 | **The Valley** | Camera descends into the corridor. Fog density drops — the "dissolve" is an atmospheric ramp, not a crossfade. |
| 0.66 – 1.00 | **The Engine** | Three monoliths rise from the valley floor on a stagger, gold edges igniting — Identify, Engage, Onboard. FOV tightens 46° → 41°. |

Acts overlap deliberately. Ranges that share a boundary produce a cut; ranges
that overlap produce a dissolve.

---

## 4. Runtime: what happens per scrolled pixel

`ScrollEngine` runs **one** `requestAnimationFrame` loop for the whole page.

1. **One scroll read per frame**, at the top of the tick, before any writes.
   Reading `scrollY` after writing to layout forces a synchronous reflow; the
   read/write split is what prevents it.
2. **Geometry is cached.** Element offsets are measured on resize and on
   `document.fonts.ready`, never inside the tick.
3. **Progress is smoothed** with a framerate-independent exponential decay
   (half-life 75 ms). Raw `scrollY` arrives in coarse wheel-sized jumps; the
   interpolation is what makes the sequence feel scrubbed rather than stepped.
4. **The loop parks itself.** After progress settles and no scroll has
   arrived for 8 frames, the rAF chain stops. A stationary page costs nothing.
5. **Off-screen tracks are skipped** via `IntersectionObserver`.

Everything the director writes is `opacity`, `transform` or a custom property —
compositor-only work, no layout, no paint.

---

## 5. Memory: the real constraint

Ninety frames decoded to RGBA at 1600×900 is **~518 MB**. That is not a
tuning problem, it is a crashed tab.

So `FrameSequence` holds `HTMLImageElement`s — a few KB of *encoded* data
each — and lets the browser own the decoded-surface cache, which it evicts
under memory pressure and we cannot. We steer it rather than replace it, by
calling `decode()` on a six-frame window ahead of the playhead in the current
direction of travel.

The alternative, `createImageBitmap`, guarantees no decode inside `drawImage`
but pins raw pixels in JS heap where nothing can reclaim them. For a
background flythrough, browser-managed eviction is the better failure mode:
worst case is one soft frame, not a dead tab.

### Loading order

Both ends first, then progressively halving strides (16, 8, 4, 2, 1). The
sequence is scrubbable across its full length almost immediately and sharpens
in place, rather than being unusable until the last frame lands. `paint()`
falls back to the nearest loaded frame, so scrubbing never blocks on a fetch.

---

## 6. Tiers and degradation

Four tiers from two render passes:

| Tier | Source | Size | Used when |
|---|---|---|---|
| `lg` | landscape | 1600×900 | Desktop, ≥4 GB RAM |
| `md` | landscape | 1024×576 | Mid-range, 3G, ≤1500 effective px |
| `sm` | landscape | 640×360 | ≤2 GB RAM, ≤2 cores, small landscape |
| `pt` | portrait | 720×1280 | Portrait viewports ≤900 px wide |

The portrait tier exists because cover-fitting a 16:9 frame onto a 390×844
phone scales *by height* — a 4.7× upscale of `sm`. It is a genuinely separate
render with a wider FOV (58° vs 46°), so a phone gets a crop composed for a
phone rather than a stretched landscape frame.

Total payload is ~2.0 MB for the largest tier and ~470 KB for the smallest —
and only one tier is ever downloaded.

### The degradation ladder

Every refusal lands on the same static poster layout, because the pinned
experience is opt-in: `html.cinema` is added only after the runtime has
positively confirmed it should run.

| Condition | Result |
|---|---|
| `prefers-reduced-motion: reduce` | No sequence fetched. Acts flow as normal stacked sections over a static poster. |
| JavaScript off / module error | Identical to the above — the base stylesheet *is* the fallback. |
| `Save-Data`, `2g`, ≤1 GB RAM | Pinned layout with cross-dissolving copy, poster backdrop, no sequence. |
| `manifest.json` unreachable | Falls back before `html.cinema` is ever added. |
| ≤2 GB RAM on `sm`/`pt` | Stride 2 — 45 frames, half the memory and requests. |
| No 2D canvas context | Static path. |

Because reduced-motion and no-JS resolve to the same CSS, there is one
fallback to maintain, not three.

### Other budget controls

- Backing store capped at 1.5× DPR on `lg`, 2× elsewhere. A photographic
  backdrop at DPR 3 costs 4× the fill rate of DPR 1.5 for detail the 1600 px
  source does not contain.
- Resize is debounced 150 ms — a mobile URL-bar collapse fires `resize`
  continuously and each one reallocates the backing store.
- The poster is set to `visibility: hidden` once the canvas is live, so it
  stops costing compositing work.
- Reveal observers are one-shot (`unobserve` on first intersection).
- The masthead condense state uses a sentinel element and an
  `IntersectionObserver`, so it fires twice in the life of the page instead
  of on every scroll event.

---

## 7. Retiming the piece

- **Overall pace** — `.cinema .film { height: 460vh }` in `site.css`. The
  engine derives its scroll span from the element, so this is the only knob.
- **Caption timing** — `ACT_BANDS` in `main.js`: `[fade-in start, fully in,
  hold until, fully out]` over the master 0–1 timeline.
- **Camera path** — `flightPath` / `lookPath` in `scene.html`, then re-bake.
- **Smoothing feel** — `SMOOTHING_HALF_LIFE` in `scroll-engine.js`. Larger is
  more languid; too large and the frames lag the finger on touch.

---

## 8. Previewing

```bash
cd tools
node preview.mjs                    # desktop 1440x900
node preview.mjs --mobile           # 390x844 @ DPR 3
node preview.mjs --reduced-motion   # verifies the static fallback
```

Writes screenshots at seven points across the film plus each content section
to `.preview/`, reports the tier the runtime actually chose, and **exits
non-zero on any console error or failed request** — so it doubles as a smoke
test in CI.
