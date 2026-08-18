#!/usr/bin/env node
/**
 * Bundles the landing page into a single self-contained HTML file.
 *
 * The published-artifact host serves one file under a strict CSP: no relative
 * asset fetches, no external hosts except Google Fonts. So the stylesheet,
 * the three ES modules, the frame manifest and the frames themselves all have
 * to travel inside the document as data URIs.
 *
 *   node build-artifact.mjs [--tiers lg,pt] [--out ../dist]
 *
 * Writes two files:
 *   dist/artifact.html          the fragment to publish (no doctype/head/body,
 *                               since the host wraps it)
 *   dist/artifact-preview.html  the same fragment wrapped in a full document,
 *                               so preview.mjs can verify it locally
 *
 * Only a subset of tiers is inlined — every byte is paid up front here, with
 * none of the progressive loading the real site gets. `lg` + `pt` covers
 * desktop and portrait; chooseTier's fallback chain resolves the missing
 * tiers to `lg` on its own.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const TIERS = arg('tiers', 'lg,pt').split(',').map((s) => s.trim());
const OUT = resolve(arg('out', join(ROOT, 'dist')));
const POSTER = 'poster-0000.webp';

const pad = (n, w) => String(n).padStart(w, '0');

/** Replace an exact substring, failing loudly if the anchor has drifted. */
function swap(source, from, to, label) {
  if (!source.includes(from)) {
    throw new Error(`build-artifact: anchor not found in ${label}:\n${from.slice(0, 160)}`);
  }
  return source.split(from).join(to);
}

async function dataUri(absPath, mime = 'image/webp') {
  const buf = await readFile(absPath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

async function main() {
  const manifest = JSON.parse(
    await readFile(join(ROOT, 'assets/frames/manifest.json'), 'utf8')
  );

  // ---- Frames ---------------------------------------------------------
  const frames = {};
  let rawBytes = 0;
  for (const tier of TIERS) {
    if (!manifest.tiers.some((t) => t.id === tier)) {
      throw new Error(`build-artifact: manifest has no tier "${tier}"`);
    }
    frames[tier] = [];
    for (let i = 0; i < manifest.frameCount; i++) {
      const file = join(ROOT, `assets/frames/${tier}/frame-${pad(i, manifest.indexPad)}.webp`);
      const buf = await readFile(file);
      rawBytes += buf.length;
      frames[tier].push(`data:image/webp;base64,${buf.toString('base64')}`);
    }
  }

  // The manifest the page sees must advertise only what is actually embedded,
  // or chooseTier will pick a tier whose frames are not here.
  const inlineManifest = {
    ...manifest,
    tiers: manifest.tiers.filter((t) => TIERS.includes(t.id))
  };

  const posterUri = await dataUri(join(ROOT, 'assets/img', POSTER));

  // ---- Stylesheet -----------------------------------------------------
  const css = await readFile(join(ROOT, 'assets/css/site.css'), 'utf8');

  // ---- Scripts --------------------------------------------------------
  let frameSeq = await readFile(join(ROOT, 'assets/js/frame-sequence.js'), 'utf8');
  let scrollEngine = await readFile(join(ROOT, 'assets/js/scroll-engine.js'), 'utf8');
  let main = await readFile(join(ROOT, 'assets/js/main.js'), 'utf8');

  frameSeq = swap(
    frameSeq,
    '  url(sourceIndex) {\n' +
    '    return `${this.basePath}${this.tier}/frame-${pad(sourceIndex, this.manifest.indexPad)}.webp`;\n' +
    '  }',
    '  url(sourceIndex) {\n' +
    '    // Bundled build: frames are data URIs carried in the document.\n' +
    '    return INLINE_FRAMES[this.tier][sourceIndex];\n' +
    '  }',
    'frame-sequence.js url()'
  );

  main = swap(
    main,
    '  let manifest;\n' +
    '  try {\n' +
    '    const res = await fetch(`${FRAMES_BASE}manifest.json`, { cache: \'force-cache\' });\n' +
    '    if (!res.ok) throw new Error(`manifest ${res.status}`);\n' +
    '    manifest = await res.json();\n' +
    '  } catch {\n' +
    '    return;   // stay on the poster layout\n' +
    '  }',
    '  const manifest = INLINE_MANIFEST;',
    'main.js manifest fetch'
  );

  // Flatten the modules into one script. Order matters: definitions before use.
  const stripExports = (src) =>
    src
      .replace(/^export (class|function|const|let) /gm, '$1 ')
      .replace(/^export \{[^}]*\};?\s*$/gm, '');

  const stripImports = (src) =>
    src.replace(/^import [\s\S]*?from '[^']*';\s*$/gm, '');

  const bundle = [
    `const INLINE_MANIFEST = ${JSON.stringify(inlineManifest)};`,
    `const INLINE_FRAMES = ${JSON.stringify(frames)};`,
    stripExports(frameSeq),
    stripExports(scrollEngine),
    stripImports(main)
  ].join('\n\n');

  // ---- HTML -----------------------------------------------------------
  const html = await readFile(join(ROOT, 'index.html'), 'utf8');

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (!bodyMatch) throw new Error('build-artifact: could not find <body>');

  let body = bodyMatch[1];
  body = swap(
    body,
    '<script type="module" src="assets/js/main.js"></script>',
    '',
    'index.html module tag'
  );
  body = swap(body, 'src="assets/img/poster-0000.webp"', `src="${posterUri}"`, 'poster src');

  const fontsLink = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/)[0];

  const fragment = `<title>EpiVail Attraction Engine</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontsLink}
<style>
${css}
</style>
<script>document.documentElement.classList.add('js');</script>
${body}
<script type="module">
${bundle}
</script>
`;

  await mkdir(OUT, { recursive: true });
  await writeFile(join(OUT, 'artifact.html'), fragment);

  // A wrapped copy so the existing preview harness can drive it unchanged.
  await writeFile(
    join(OUT, 'artifact-preview.html'),
    `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    `</head>\n<body>\n${fragment}\n</body>\n</html>\n`
  );

  const mb = (n) => (n / 1048576).toFixed(2);
  console.log(`[artifact] tiers inlined: ${TIERS.join(', ')}`);
  console.log(`[artifact] frame bytes:   ${mb(rawBytes)} MB raw`);
  console.log(`[artifact] fragment:      ${mb(Buffer.byteLength(fragment))} MB`);
  if (Buffer.byteLength(fragment) > 15 * 1048576) {
    console.error('[artifact] OVER the 16 MB artifact ceiling — drop a tier');
    process.exit(1);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
