# Residence Explorer (source)

The live file is `assets/explorer/residence-explorer.html`: one self-contained page
(three.js r170, models, textures and fonts inlined), opened over the homepage from the
Concepts section by `js/explorer.js`. The home is a sample and says so on screen.

This folder is not deployed. It holds what is needed to rebuild the page:

- `main.js` - the scene, UI and camera code (esbuild entry). It imports `./assets.js`,
  a generated index that maps each asset name to its file (inlined as data URLs).
- `template.html` - page shell and CSS; `{{BUNDLE}}`, `{{SG}}` and `{{INTER}}` are
  replaced at build time with the bundle and the two HD fonts.
- `download-assets.py` - fetches the Poly Haven models, textures and dusk HDRI (CC0)
  and the Khronos GlamVelvetSofa (CC BY 4.0, credit Eric Chadwick / Khronos).
- `sprite.html` + `sprites.cjs` - render the Poly Haven fir and pine models once into
  cut-out tree images (the source trees are millions of triangles).

Rebuild outline: download assets; compress models with
`gltf-transform optimize ... --texture-compress webp --texture-size 512`; convert
textures to 512-1024 px WebP; render tree cut-outs; generate `assets.js`; bundle with
`esbuild main.js --bundle --format=iife --minify --loader:.webp=dataurl --loader:.glb=dataurl --loader:.hdr=dataurl`;
fill the template. In an embedded page, Contact and Book a Call post `{hd:'contact'}`
to the homepage, which closes the overlay and scrolls to the form.

Credits that must stay visible on the page: Poly Haven (CC0) and the velvet sofa line.
