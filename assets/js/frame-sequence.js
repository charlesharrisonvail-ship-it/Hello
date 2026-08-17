/**
 * FrameSequence — scrubs a pre-rendered image sequence onto a 2D canvas.
 *
 * Why images and not live WebGL: the flythrough is baked once (see
 * tools/render-frames.mjs), so painting a frame costs one drawImage. That is
 * a few hundred microseconds on a phone, versus a full scene graph traversal
 * and draw-call flush every frame. It is the difference between a scroll that
 * tracks the finger and one that lurches.
 *
 * Memory is the real trap with frame sequences. 90 frames decoded to RGBA at
 * 1600x900 is ~518 MB, which will kill a phone tab outright. So we hold
 * HTMLImageElements — a few KB of encoded data each — and let the browser own
 * the decoded-surface cache, which it evicts under pressure and we cannot.
 * We only steer it, by calling decode() on a small window of frames ahead of
 * the playhead in the direction of travel.
 */

/** Frames to pre-decode ahead of the playhead, per direction of travel. */
const DECODE_AHEAD = 6;
/** Parallel network requests. Above ~6 we just queue in the browser anyway. */
const FETCH_CONCURRENCY = 6;

const pad = (n, width) => String(n).padStart(width, '0');

/**
 * Load order: both ends first, then progressively halving strides. The
 * sequence becomes scrubbable across its whole length almost immediately and
 * sharpens in place, instead of being unusable until frame 90 arrives.
 */
function priorityOrder(count) {
  const order = [];
  const seen = new Set();
  const push = (i) => {
    if (i >= 0 && i < count && !seen.has(i)) { seen.add(i); order.push(i); }
  };
  push(0);
  push(count - 1);
  for (let step = 16; step >= 1; step = Math.floor(step / 2)) {
    for (let i = 0; i < count; i += step) push(i);
    if (step === 1) break;
  }
  return order;
}

export class FrameSequence {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} manifest  parsed assets/frames/manifest.json
   * @param {object} options
   * @param {string} options.basePath   e.g. 'assets/frames/'
   * @param {string} options.tier       'sm' | 'md' | 'lg'
   * @param {number} [options.stride]   sample every Nth source frame
   * @param {number} [options.maxDpr]   backing-store DPR ceiling
   */
  constructor(canvas, manifest, { basePath, tier, stride = 1, maxDpr = 1.5 }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.manifest = manifest;
    this.basePath = basePath;
    this.tier = tier;
    this.stride = Math.max(1, stride);
    this.maxDpr = maxDpr;

    /** Source frame indices this instance actually uses. */
    this.indices = [];
    for (let i = 0; i < manifest.frameCount; i += this.stride) this.indices.push(i);
    // Always finish on the last frame, or the reveal never fully lands.
    const last = manifest.frameCount - 1;
    if (this.indices[this.indices.length - 1] !== last) this.indices.push(last);

    this.count = this.indices.length;
    this.images = new Array(this.count).fill(null);
    this.ready = new Array(this.count).fill(false);

    this.painted = -1;
    this.lastRequested = 0;
    this.direction = 1;
    this.firstPaint = null;   // resolves once something is on screen
    this._resolveFirstPaint = null;
    this.firstPaint = new Promise((r) => { this._resolveFirstPaint = r; });

    this._aborted = false;
    this.resize();
  }

  url(sourceIndex) {
    return `${this.basePath}${this.tier}/frame-${pad(sourceIndex, this.manifest.indexPad)}.webp`;
  }

  /**
   * Match the backing store to the element's box, capped at maxDpr. A hero
   * backdrop at DPR 3 costs 4x the fill rate of DPR 1.5 and nobody can tell —
   * it is a photographic image, not text.
   */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (w === this.canvas.width && h === this.canvas.height) return;

    this.canvas.width = w;
    this.canvas.height = h;
    // Resizing clears the surface, so the current frame must be repainted.
    const wasPainted = this.painted;
    this.painted = -1;
    if (wasPainted >= 0) this.paint(wasPainted);
  }

  /** Kick off progressive loading. Resolves when every frame is in. */
  async load() {
    const queue = priorityOrder(this.count);
    let cursor = 0;

    const worker = async () => {
      while (cursor < queue.length && !this._aborted) {
        const slot = queue[cursor++];
        try {
          await this.fetchFrame(slot);
        } catch {
          // A single dropped frame is survivable — nearestReady() will step
          // over the hole. Failing the whole sequence would not be.
        }
        // The first usable frame should reach the screen immediately.
        if (this.painted === -1 && this.ready[slot]) this.paint(this.lastRequested);
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(FETCH_CONCURRENCY, queue.length) }, worker)
    );
  }

  fetchFrame(slot) {
    if (this.images[slot]) return Promise.resolve();
    const img = new Image();
    img.decoding = 'async';
    img.src = this.url(this.indices[slot]);
    this.images[slot] = img;

    return img.decode()
      .then(() => { this.ready[slot] = true; })
      .catch(() => {
        // Safari rejects decode() on some cached images that are in fact
        // usable; fall back to the load event before giving up.
        return new Promise((resolve, reject) => {
          if (img.complete && img.naturalWidth) { this.ready[slot] = true; resolve(); }
          else {
            img.onload = () => { this.ready[slot] = true; resolve(); };
            img.onerror = reject;
          }
        });
      });
  }

  /** Nearest loaded slot to `slot`, searching outward. */
  nearestReady(slot) {
    if (this.ready[slot]) return slot;
    for (let d = 1; d < this.count; d++) {
      if (this.ready[slot - d]) return slot - d;
      if (this.ready[slot + d]) return slot + d;
    }
    return -1;
  }

  /**
   * Paint the frame for a 0..1 progress value. Cheap to call every rAF —
   * it early-outs unless the resolved frame actually changed.
   */
  render(progress) {
    const slot = Math.min(
      this.count - 1,
      Math.max(0, Math.round(progress * (this.count - 1)))
    );
    if (slot !== this.lastRequested) {
      this.direction = Math.sign(slot - this.lastRequested) || this.direction;
      this.lastRequested = slot;
    }
    this.paint(slot);
    this.warm(slot);
  }

  paint(slot) {
    const resolved = this.nearestReady(slot);
    if (resolved < 0 || resolved === this.painted) return;

    const img = this.images[resolved];
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    if (!cw || !ch) return;

    // Cover-fit. The bake is composed centre-weighted precisely so this crop
    // stays legible from ultrawide down to a portrait phone.
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    this.ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

    this.painted = resolved;
    if (this._resolveFirstPaint) {
      this._resolveFirstPaint();
      this._resolveFirstPaint = null;
    }
  }

  /**
   * Nudge the browser to keep frames just ahead of the playhead decoded.
   * Without this, a frame evicted from the decoded-surface cache costs a
   * synchronous decode inside drawImage and drops the frame.
   */
  warm(slot) {
    for (let i = 1; i <= DECODE_AHEAD; i++) {
      const s = slot + i * this.direction;
      if (s < 0 || s >= this.count) break;
      const img = this.images[s];
      if (img && this.ready[s] && img.decode) img.decode().catch(() => {});
    }
  }

  destroy() {
    this._aborted = true;
    this.images.length = 0;
  }
}

/**
 * Pick a tier from what the device and network can actually afford.
 * Returns null when we should not download a sequence at all — the poster
 * path takes over.
 */
export function chooseTier({ reducedMotion, manifest }) {
  if (reducedMotion) return null;

  const conn = navigator.connection || navigator.webkitConnection || {};
  if (conn.saveData) return null;
  if (/(^|-)2g$/.test(conn.effectiveType || '')) return null;

  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  if (memory <= 1) return null;

  const available = new Set(manifest.tiers.map((t) => t.id));
  const pick = (...ids) => ids.find((id) => available.has(id)) ?? null;

  // Portrait viewports cover-fit by height, so a landscape tier would be
  // upscaled several times over. The portrait bake is the correct source
  // there, and it is smaller than the landscape tier it replaces.
  //
  // The tier is chosen once and kept: re-picking on rotation would mean
  // re-downloading the whole sequence to fix softness nobody asked about.
  const isPortrait = window.innerWidth / window.innerHeight < 0.95;
  if (isPortrait && window.innerWidth <= 900) {
    const portrait = pick('pt');
    if (portrait) return portrait;
  }

  const effectiveWidth = window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5);

  if (memory <= 2 || cores <= 2 || effectiveWidth <= 820) return pick('sm', 'md', 'lg');
  if (memory <= 4 || effectiveWidth <= 1500 || /3g/.test(conn.effectiveType || '')) {
    return pick('md', 'sm', 'lg');
  }
  return pick('lg', 'md', 'sm');
}

/**
 * Halve the frame count on the weakest devices. 45 frames over a 4-screen
 * scroll is still ~1 frame per 9 vh — below the threshold where stepping
 * becomes visible, and half the memory and requests.
 */
export function chooseStride(tier) {
  const memory = navigator.deviceMemory || 4;
  if (memory <= 2 && (tier === 'sm' || tier === 'pt')) return 2;
  return 1;
}
