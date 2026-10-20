/* Motion layer for the modern AiRE Estate look: a glowing aurora, a scroll
   progress bar, cursor-lit cards, and particle bursts ("explosions") when
   buttons are pressed, headings arrive and prices come into view.
   Respects the page's Motion toggle and the visitor's reduced-motion setting. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function motionOff() { return reduce || root.getAttribute('data-motion') === 'off'; }
  var COLORS = ['#38bdf8', '#7dd3fc', '#e0f2fe', '#f472b6', '#fbbf24', '#a78bfa'];

  function init() {
    // Aurora behind everything, and a progress bar along the top.
    var aurora = document.createElement('div');
    aurora.className = 'mx-aurora';
    aurora.innerHTML = '<i></i><i></i><i></i>';
    document.body.appendChild(aurora);
    var bar = document.createElement('div');
    bar.className = 'mx-progress';
    document.body.appendChild(bar);

    // Particle canvas for bursts.
    var cv = document.createElement('canvas');
    cv.className = 'mx-burst';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    size();
    window.addEventListener('resize', size);

    var parts = [], rings = [], running = false;
    function burst(x, y, opts) {
      if (motionOff()) return;
      opts = opts || {};
      var n = opts.count || 70, power = opts.power || 7;
      var palette = opts.colors || COLORS;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * Math.PI * 2, s = (0.35 + Math.random()) * power;
        parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - power * 0.25,
          life: 1, decay: 0.012 + Math.random() * 0.018, r: 1.2 + Math.random() * 2.6,
          c: palette[(Math.random() * palette.length) | 0], spark: Math.random() < 0.35 });
      }
      rings.push({ x: x, y: y, r: 4, life: 1, c: palette[0] });
      if (!running) { running = true; requestAnimationFrame(tick); }
    }
    function tick() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = rings.length - 1; i >= 0; i--) {
        var g = rings[i];
        g.r += 7; g.life -= 0.035;
        if (g.life <= 0) { rings.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.strokeStyle = g.c; ctx.globalAlpha = g.life * 0.6; ctx.lineWidth = 2; ctx.stroke();
      }
      for (var j = parts.length - 1; j >= 0; j--) {
        var p = parts[j];
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.12; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(j, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        if (p.spark) {
          ctx.strokeStyle = p.c; ctx.lineWidth = p.r * 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      if (parts.length || rings.length) requestAnimationFrame(tick);
      else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    window.aireBurst = burst;

    // Scroll progress.
    function onScroll() {
      var max = root.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Cards light up and tilt toward the cursor (mouse and trackpad only).
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.card,.tier,.mod,.pc,.quote,.truth,.svc>div,.grid>div').forEach(function (el) {
        el.classList.add('mx-lit');
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          el.style.setProperty('--mx', x + 'px');
          el.style.setProperty('--my', y + 'px');
          if (motionOff()) return;
          var rx = ((y / r.height) - 0.5) * -5, ry = ((x / r.width) - 0.5) * 5;
          el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-3px)';
        });
        el.addEventListener('pointerleave', function () { el.style.transform = ''; });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
