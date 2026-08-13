# EpiVail — Luxury Resimercial landing page

An immersive, frame-based 3D scroll experience for **Charles Harrison |
EpiVail | Epique Mountain Collective**, covering the Vail and Beaver Creek
resort corridor.

Scrolling scrubs a pre-rendered camera flythrough of a procedurally generated
alpine valley. The background dissolves through three acts — pre-dawn ridgeline,
descent into the valley at alpenglow, and the reveal of three monoliths standing
for the Luxury Resimercial™ pillars — while the copy cross-dissolves over it.

## Running it

Any static file server will do; there is no build step for the site itself.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
index.html                  The page
assets/css/site.css         Brand tokens, static layout, pinned "cinema" layer
assets/js/
  main.js                   Composition root — decides whether cinema runs
  frame-sequence.js         Frame loading, decoding and canvas painting
  scroll-engine.js          The single rAF loop
assets/frames/<tier>/       Baked WebP sequences (90 frames x 4 tiers)
assets/img/poster-*.webp    Stills for the reduced-motion / no-JS path
tools/                      Offline bake + preview tooling (not shipped)
docs/scroll-architecture.md How and why it works
```

## Tooling

```bash
cd tools
npm install

npm run bake                      # re-render the frame sequences (~90s)
node preview.mjs                  # screenshot the page, desktop
node preview.mjs --mobile         # 390x844 @ DPR 3
node preview.mjs --reduced-motion # verify the static fallback
```

`preview.mjs` exits non-zero on any console error or failed request, so it
works as a smoke test.

## Performance and degradation

- The runtime ships **no 3D library** — Three.js is a build-time dependency
  only. Painting a frame is one `drawImage`.
- One `requestAnimationFrame` loop for the whole page; it parks itself when
  the page is stationary.
- Four resolution tiers including a dedicated **portrait** render, chosen from
  viewport, `deviceMemory`, core count and network. Only one is downloaded —
  ~2.0 MB at the largest, ~470 KB at the smallest.
- Frames are held as encoded images so the browser owns decoded-surface
  eviction; a small window ahead of the playhead is pre-decoded.
- `prefers-reduced-motion`, `Save-Data`, 2G, ≤1 GB RAM and no-JS all resolve
  to the same readable static layout — the pinned experience is opt-in.

Full rationale in [`docs/scroll-architecture.md`](docs/scroll-architecture.md).

## Before launch

`index.html` links the primary CTA to the existing site rather than carrying
`tel:` / `mailto:` values, which were not available when this was built. Swap
in the real contact details at the `TODO` in the `#connect` section.

---

Charles Harrison | EpiVail | Epique Mountain Collective
