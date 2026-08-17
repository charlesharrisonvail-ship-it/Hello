/**
 * Composition root for the EpiVail landing page.
 *
 * Responsibilities, in order:
 *   1. Decide whether the pinned cinema experience should run at all.
 *   2. If it should, load the frame sequence at a tier the device can carry
 *      and bind it to a single scroll timeline.
 *   3. Fall back to the static poster layout on any refusal or failure.
 *
 * The fallback is not an error path — it is the default. `html.cinema` is
 * only ever added once we have positive confirmation that the sequence is
 * worth running, so a thrown exception anywhere below leaves a page that
 * still reads correctly.
 */

import { FrameSequence, chooseTier, chooseStride } from './frame-sequence.js';
import { ScrollEngine, band } from './scroll-engine.js';

const FRAMES_BASE = 'assets/frames/';

const prefersReducedMotion =
  matchMedia('(prefers-reduced-motion: reduce)').matches;

const root = document.documentElement;
const film = document.querySelector('[data-film]');
const canvas = document.querySelector('[data-film-canvas]');
const poster = document.querySelector('[data-film-poster]');
const wash = document.querySelector('[data-film-wash]');
const rail = document.querySelector('[data-film-rail]');
const acts = [...document.querySelectorAll('[data-act]')];
const railSteps = [...document.querySelectorAll('[data-rail-step]')];

/**
 * Cross-dissolve windows over the master timeline, one per act:
 * [fade-in start, fully in, hold until, fully out].
 *
 * They overlap deliberately — the outgoing act is still at ~35% when the
 * incoming one starts, which is what reads as a dissolve rather than a cut.
 */
const ACT_BANDS = [
  [0.00, 0.00, 0.11, 0.21],
  [0.17, 0.27, 0.38, 0.47],
  [0.44, 0.53, 0.64, 0.73],
  [0.70, 0.79, 1.00, 1.00]
];

/* ------------------------------------------------------------------ */
/* Static-path behaviour: runs regardless of whether cinema mode does   */
/* ------------------------------------------------------------------ */

function initMasthead() {
  const masthead = document.querySelector('[data-masthead]');
  if (!masthead) return;

  // A sentinel beats a scroll handler here: the observer fires twice in the
  // life of the page instead of on every scroll event.
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:80px;width:1px;pointer-events:none;';
  document.body.prepend(sentinel);

  new IntersectionObserver(
    ([entry]) => masthead.classList.toggle('is-condensed', !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
}

function initReveals() {
  const items = [...document.querySelectorAll('.reveal')];
  if (!items.length) return;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);       // one-shot; stop paying for it
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  items.forEach((el, i) => {
    // Stagger siblings so a row of cards arrives in sequence.
    el.style.setProperty('--reveal-delay', `${(i % 3) * 0.09}s`);
    io.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* Cinema mode                                                          */
/* ------------------------------------------------------------------ */

/**
 * Drives every scroll-linked visual from one progress value. Called once per
 * animation frame while the film is on screen; everything in here is a write
 * to opacity, transform or a custom property — no layout reads.
 */
function makeDirector(sequence) {
  let lastStep = -1;

  return function direct(progress) {
    // 1. The frame sequence itself.
    if (sequence) sequence.render(progress);

    // 2. Caption cross-dissolves. Each act also drifts a little against the
    //    scroll, which separates the text plane from the background plane.
    for (let i = 0; i < acts.length; i++) {
      const [a, b, c, d] = ACT_BANDS[i];
      const alpha = band(progress, a, b, c, d);
      const act = acts[i];
      act.style.opacity = alpha.toFixed(3);
      act.style.setProperty('--shift', `${(1 - alpha) * 26}px`);
      act.classList.toggle('is-active', alpha > 0.55);
      // Keep faded-out copy out of the accessibility tree and tab order.
      act.setAttribute('aria-hidden', alpha < 0.15 ? 'true' : 'false');
    }

    // 3. The gold wash swells through the middle acts and again at the
    //    reveal, tracking the sunrise baked into the frames.
    const glow = Math.max(
      band(progress, 0.25, 0.45, 0.55, 0.7) * 0.55,
      band(progress, 0.72, 0.86, 1, 1) * 0.42
    );
    root.style.setProperty('--wash-opacity', glow.toFixed(3));

    // 4. Chapter rail.
    root.style.setProperty('--film-progress', progress.toFixed(4));
    const step = Math.min(
      railSteps.length - 1,
      Math.floor(progress * railSteps.length)
    );
    if (step !== lastStep) {
      railSteps.forEach((el, i) => el.classList.toggle('is-current', i === step));
      lastStep = step;
    }
  };
}

async function initCinema() {
  if (prefersReducedMotion || !film || !canvas) return;

  // A 2D context is the one hard requirement. Everything else has a fallback.
  if (!canvas.getContext || !canvas.getContext('2d')) return;

  let manifest;
  try {
    const res = await fetch(`${FRAMES_BASE}manifest.json`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`manifest ${res.status}`);
    manifest = await res.json();
  } catch {
    return;   // stay on the poster layout
  }

  const tier = chooseTier({ reducedMotion: prefersReducedMotion, manifest });

  // Commit to the pinned layout. Captions now cross-dissolve even if we
  // decided against downloading frames — the poster stays as the backdrop.
  root.classList.add('cinema');

  let sequence = null;
  if (tier) {
    sequence = new FrameSequence(canvas, manifest, {
      basePath: FRAMES_BASE,
      tier,
      stride: chooseStride(tier),
      // The big landscape tier is already 1600px wide; pushing its backing
      // store past 1.5x DPR costs fill rate for detail the source lacks.
      maxDpr: tier === 'lg' ? 1.5 : 2
    });

    sequence.firstPaint.then(() => {
      canvas.classList.add('is-live');
      // The poster has done its job; drop it so it stops costing compositing.
      setTimeout(() => { poster.style.visibility = 'hidden'; }, 700);
    });

    sequence.load();

    // Debounced, because a mobile URL-bar collapse fires resize continuously
    // and each one reallocates the backing store.
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => sequence.resize(), 150);
    };
    addEventListener('resize', onResize);
    addEventListener('orientationchange', onResize);
  }

  const engine = new ScrollEngine({ smooth: true });
  engine.track(film, makeDirector(sequence));

  // Layout settles after webfonts swap; re-measure so act timing stays true.
  if (document.fonts?.ready) document.fonts.ready.then(() => engine.measure());
}

/* ------------------------------------------------------------------ */

initMasthead();
initReveals();
initCinema();
