/**
 * ScrollEngine — one rAF loop for the whole page.
 *
 * Three rules keep this fast:
 *
 *  1. One loop. Every scroll-driven effect on the page is a subscriber here.
 *     N independent rAF loops means N layout reads per frame.
 *  2. Read then write, never interleaved. Geometry is measured once per
 *     resize into a cached rect, so a frame never reads layout after writing
 *     to it — that interleaving is what produces forced synchronous layout.
 *  3. Idle at zero cost. The loop parks itself once motion settles and no
 *     scroll has arrived, so a stationary page burns no CPU.
 */

/**
 * Exponential smoothing toward the scroll target. Raw scrollY jumps in
 * coarse steps on a wheel or trackpad; interpolating gives the sequence the
 * continuous feel of a scrubbed video rather than a slideshow.
 *
 * Framerate-independent: the factor is derived from elapsed time, so the
 * easing takes the same wall-clock duration at 60 Hz and 120 Hz.
 */
const SMOOTHING_HALF_LIFE = 0.075; // seconds to close half the gap
const SETTLE_EPSILON = 0.00025;    // progress delta below which we call it done
const IDLE_FRAMES = 8;             // frames to keep running after settling

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export class ScrollEngine {
  constructor({ smooth = true } = {}) {
    this.tracks = [];
    this.smooth = smooth;
    this.running = false;
    this.rafId = 0;
    this.lastTime = 0;
    this.idle = 0;

    this._onScroll = () => this.wake();
    this._onResize = () => { this.measure(); this.wake(); };

    addEventListener('scroll', this._onScroll, { passive: true });
    addEventListener('resize', this._onResize);
    addEventListener('orientationchange', this._onResize);
  }

  /**
   * Register an element whose scroll span drives a callback.
   *
   * @param {Element} element
   * @param {(progress: number, track: object) => void} onUpdate
   * @param {object} [opts]
   * @param {boolean} [opts.smooth]  interpolate this track's progress
   * @param {number}  [opts.offset]  shift the start, in viewport heights
   */
  track(element, onUpdate, opts = {}) {
    const track = {
      element,
      onUpdate,
      smooth: opts.smooth ?? this.smooth,
      offset: opts.offset ?? 0,
      top: 0,
      span: 1,
      target: 0,
      current: 0,
      visible: true
    };
    this.tracks.push(track);

    // Skip work entirely while a track is off screen. The captions below the
    // fold do not need updating until they are close to entering.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => { track.visible = entry.isIntersecting; if (track.visible) this.wake(); },
        { rootMargin: '25% 0px' }
      );
      io.observe(element);
      track.observer = io;
    }

    this.measureTrack(track);
    this.wake();
    return track;
  }

  measureTrack(track) {
    const rect = track.element.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    track.top = rect.top + scrollY + track.offset * innerHeight;
    // The span is how far the page scrolls while the element is pinned: its
    // own height minus the one viewport it occupies.
    track.span = Math.max(1, rect.height - innerHeight);
  }

  measure() {
    for (const track of this.tracks) this.measureTrack(track);
  }

  wake() {
    this.idle = 0;
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick = (now) => {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000) || 0.016;
    this.lastTime = now;

    // --- Read phase: one scroll read for the entire frame. ---------------
    const scrollY = window.scrollY || window.pageYOffset;

    // Framerate-independent exponential decay.
    const alpha = 1 - Math.pow(0.5, dt / SMOOTHING_HALF_LIFE);

    let moving = false;

    // --- Write phase -----------------------------------------------------
    for (const track of this.tracks) {
      if (!track.visible) continue;

      track.target = clamp01((scrollY - track.top) / track.span);

      if (track.smooth) {
        const delta = track.target - track.current;
        if (Math.abs(delta) > SETTLE_EPSILON) {
          track.current += delta * alpha;
          moving = true;
        } else {
          track.current = track.target;
        }
      } else {
        if (Math.abs(track.target - track.current) > SETTLE_EPSILON) moving = true;
        track.current = track.target;
      }

      track.onUpdate(track.current, track);
    }

    this.idle = moving ? 0 : this.idle + 1;
    if (this.idle > IDLE_FRAMES) {
      this.running = false;
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  destroy() {
    cancelAnimationFrame(this.rafId);
    removeEventListener('scroll', this._onScroll);
    removeEventListener('resize', this._onResize);
    removeEventListener('orientationchange', this._onResize);
    for (const track of this.tracks) track.observer?.disconnect();
    this.tracks.length = 0;
  }
}

/* ------------------------------------------------------------------ */
/* Easing / ramp helpers shared by the scene director                   */
/* ------------------------------------------------------------------ */

/** Progress of `t` through the sub-range [a, b], clamped to 0..1. */
export const range = (t, a, b) => clamp01((t - a) / (b - a));

/**
 * A trapezoidal window: 0 before `inA`, 1 across the plateau, 0 after `outB`.
 * This is the shape every cross-dissolve on the page uses — copy fades up,
 * holds while it is being read, then fades out as the next act arrives.
 */
export function band(t, inA, inB, outA, outB) {
  // Zero-width edges are meaningful: the opening act starts already at full
  // opacity (inA === inB === 0) and the closing act never fades out
  // (outA === outB === 1). Treat those as steps rather than dividing by zero.
  const rise = inB > inA
    ? smoothstep(range(t, inA, inB))
    : (t >= inA ? 1 : 0);
  const fall = outB > outA
    ? 1 - smoothstep(range(t, outA, outB))
    : (t <= outB ? 1 : 0);
  return Math.min(rise, fall);
}

export const smoothstep = (t) => t * t * (3 - 2 * t);
export { clamp01 };
