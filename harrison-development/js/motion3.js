// Motion Prompt #152 #007 #080 #153 #087 #161 #160 #156 · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/
// Motion pack 3 for harrisondev.org (2026-11-18). Ported from the Motion Prompt library's Canvas specs:
// durations, delays, easing and amounts are the library's; words, colours and photos are Harrison Development's.
// Runs after main.js (it relies on main.js having split the section headlines into words).
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var mm = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var reduce = mm("(prefers-reduced-motion: reduce)");
  var fine = mm("(hover: hover) and (pointer: fine)");
  var paused = function () { return root.classList.contains("motion-paused"); };
  var clamp = function (x, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, x)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var eIO = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }; // cubic ease-in-out
  var eOut = function (x) { return 1 - Math.pow(1 - x, 3); };                                   // cubic ease-out
  var onScroll = function (fn) {
    var tk = false;
    var run = function () { tk = false; fn(); };
    window.addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(run); } }, { passive: true });
    window.addEventListener("resize", function () { if (!tk) { tk = true; requestAnimationFrame(run); } });
    fn();
  };
  var seen = function (el, margin, fn) {
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { rootMargin: "0px 0px " + margin + " 0px" });
    io.observe(el);
  };

  /* ---------- #152 Zoom on scroll: the Red Mountain Ranch page grows to fill the window ---------- */
  (function () {
    var stage = doc.querySelector("[data-zoom]");
    if (!stage || reduce) return;
    var pin = stage.querySelector(".zstage-pin"), frame = stage.querySelector(".zstage-frame");
    var kick = stage.querySelector(".zstage-kicker"), cap = stage.querySelector(".zstage-cap"), head = stage.querySelector(".zstage-head");
    var on = false, placed = false;
    var bleed = function () {  // full-bleed without counting the scrollbar (100vw would)
      var wrap = stage.parentElement, wr = wrap.getBoundingClientRect(), pl = parseFloat(getComputedStyle(wrap).paddingLeft) || 0;
      stage.style.width = root.clientWidth + "px";
      stage.style.marginLeft = -(wr.left + pl) + "px";
    };
    window.addEventListener("resize", function () { if (on) bleed(); });
    var setOn = function (v) {
      if (v === on) return; on = v;
      root.classList.toggle("zoom-on", v);
      placed = false;
      if (v) bleed(); else stage.style.width = stage.style.marginLeft = "";
      if (!v) { ["left", "top", "width", "height", "borderRadius"].forEach(function (k) { frame.style[k] = ""; }); kick.style.opacity = cap.style.opacity = head.style.opacity = ""; }
    };
    var update = function () {
      setOn(!paused());
      if (!on) { head.style.opacity = "1"; return; }
      var W = pin.clientWidth, H = pin.clientHeight;
      var r = stage.getBoundingClientRect(), dist = Math.max(1, r.height - H);
      if (placed && (r.bottom < -200 || r.top > H + 200)) return;  // off screen: nothing to do
      placed = true;
      // p runs 0 → 1 over the first 70% of the pinned scroll, then holds while the headline sits on the photo
      var p = clamp(-r.top / (dist * 0.7));
      var w0 = Math.min(560, W * 0.78), h0 = w0 / 1.6, x0 = (W - w0) / 2, y0 = (H - h0) / 2;
      frame.style.left = lerp(x0, 0, p) + "px"; frame.style.top = lerp(y0, 0, p) + "px";
      frame.style.width = lerp(w0, W, p) + "px"; frame.style.height = lerp(h0, H, p) + "px";
      frame.style.borderRadius = lerp(8, 0, p) + "px";
      var a = 1 - clamp(p * 2.2);                        // surrounding text fades while p goes 0 → 0.45
      kick.style.opacity = cap.style.opacity = a;
      kick.style.top = Math.max(16, y0 - 48) + "px"; cap.style.top = (y0 + h0 + 22) + "px";
      head.style.opacity = clamp((p - 0.7) / 0.3);       // headline fades in while p goes 0.7 → 1
    };
    onScroll(update);
    new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ["class"] });
  })();

  /* ---------- #080 Highlighter: a neon marker is drawn under the key words ---------- */
  (function () {
    var marks = [["value-title", "site to sell-out."], ["trio-title", "one point of contact."], ["about-title", "Carries the sale."]];
    marks.forEach(function (m) {
      var h = doc.getElementById(m[0]); if (!h) return;
      var target = m[1].split(/\s+/), run;
      var ws = h.querySelectorAll(".w");
      if (ws.length) {
        // Headline already split into masked words by main.js: wrap the matching run of words (and the spaces between them)
        var texts = Array.prototype.map.call(ws, function (w) { return w.textContent; });
        for (var i = 0; i + target.length <= texts.length; i++) {
          if (target.every(function (t, j) { return texts[i + j] === t; })) {
            run = doc.createElement("span");
            ws[i].parentNode.insertBefore(run, ws[i]);
            var end = ws[i + target.length - 1], n = run.nextSibling;
            while (n) { var nx = n.nextSibling; run.appendChild(n); if (n === end) break; n = nx; }
            break;
          }
        }
      } else {
        var txt = h.textContent, at = txt.lastIndexOf(m[1]);
        if (at < 0) return;
        h.textContent = txt.slice(0, at);
        run = doc.createElement("span"); run.textContent = m[1]; h.appendChild(run);
        if (at + m[1].length < txt.length) h.appendChild(doc.createTextNode(txt.slice(at + m[1].length)));
      }
      if (!run) return;
      run.className = "hl";
      if (reduce) return;                               // static marker
      run.classList.add("hl-js");
      seen(h, "-20%", function () { run.classList.add("on"); });
    });
  })();

  /* ---------- #007 Count-up: the sample report figures race up and lock in ---------- */
  (function () {
    var dds = doc.querySelectorAll(".report-kpis dd[data-count]");
    if (!dds.length) return;
    var max = 0;
    dds.forEach(function (dd) { max = Math.max(max, +dd.getAttribute("data-count")); });
    var items = Array.prototype.map.call(dds, function (dd) {
      var T = +dd.getAttribute("data-count");
      dd.innerHTML = '<span class="sr-only">' + T + '</span><span class="cu-num" aria-hidden="true" style="min-width:' + String(T).length + 'ch">' + T + '</span><span class="cu-bar" aria-hidden="true"><i></i></span>';
      var bar = dd.querySelector(".cu-bar i");
      bar.style.setProperty("--f", (T / max).toFixed(3));
      return { dd: dd, T: T, num: dd.querySelector(".cu-num"), bar: bar };
    });
    if (reduce || paused()) return;                    // figures stay at their final values
    var fig = doc.querySelector(".report");
    items.forEach(function (it) { it.num.textContent = "0"; it.bar.style.setProperty("--f", 0); it.dd.classList.add("cu-run"); });
    seen(fig, "-20%", function () {
      var t0 = performance.now();
      var tick = function (now) {
        var u = (now - t0) / 1000, done = true;
        if (paused()) u = 9;
        items.forEach(function (it) {
          var p = clamp((u - 0.45) / 2.45);              // 0.45 – 2.9 s
          var v = Math.round(it.T * (1 - Math.pow(1 - p, 4)));
          it.num.textContent = v;
          it.bar.style.setProperty("--f", (v / max).toFixed(3));
          var land = u - 2.9;
          if (land > 0) {
            it.dd.classList.remove("cu-run");
            var pop = 1 + 0.07 * Math.exp(-7 * land) * Math.cos(15 * land);
            it.num.style.setProperty("--pop", pop.toFixed(4));
            if (land < 1.2) done = false;
          } else done = false;
        });
        if (!done) requestAnimationFrame(tick); else items.forEach(function (it) { it.num.style.removeProperty("--pop"); });
      };
      requestAnimationFrame(tick);
    });
  })();

  /* ---------- #153 3D tilt with glare on the concept previews ---------- */
  (function () {
    if (!fine || reduce) return;
    var targets = [];
    doc.querySelectorAll("#concepts .phone-screen").forEach(function (s) {
      var w = doc.createElement("div"); w.className = "tilt";
      s.parentNode.insertBefore(w, s); w.appendChild(s); targets.push(w);
    });
    doc.querySelectorAll("#concepts .browser").forEach(function (b) { b.classList.add("tilt"); targets.push(b); });
    var MAXA = 0.32;
    targets.forEach(function (el) {
      var q = 0, from = 0, to = 0, t0 = 0, nx = 0, ny = 0, raf = 0, rect = null;
      var paint = function () {
        var max = MAXA * (el.classList.contains("browser") ? 0.5 : 1); // the wide browser frame tips half as far so its text stays readable
        el.style.setProperty("--ry", (nx * max * q).toFixed(4) + "rad");
        el.style.setProperty("--rx", (-ny * max * q).toFixed(4) + "rad");
        el.style.setProperty("--gx", ((nx * 0.5 + 0.5) * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", ((ny * 0.5 + 0.5) * 100).toFixed(1) + "%");
        el.style.setProperty("--ga", (0.42 * q).toFixed(3));
        el.style.setProperty("--sx", (-nx * 10 * q).toFixed(1));
        el.style.setProperty("--q", q.toFixed(3));
      };
      var loop = function (now) {
        var k = clamp((now - t0) / 400);                 // 0.4 s ramp, cubic ease-out
        q = lerp(from, to, eOut(k)); paint();
        raf = k < 1 ? requestAnimationFrame(loop) : 0;
      };
      var ramp = function (v) { from = q; to = v; t0 = performance.now(); if (!raf) raf = requestAnimationFrame(loop); };
      var size = function () {
        rect = el.getBoundingClientRect();
        el.style.setProperty("--persp", Math.round(rect.width * 2.36) + "px");  // 520 px for a 220 px card
        el.style.setProperty("--gr", Math.round(rect.width * 0.59) + "px");     // glare radius 130 px for 220 px
      };
      el.addEventListener("pointerenter", function () { if (paused()) return; size(); ramp(1); });
      el.addEventListener("pointermove", function (e) {
        if (paused() || !rect) return;
        nx = clamp((e.clientX - rect.left) / (rect.width / 2) - 1, -1, 1);
        ny = clamp((e.clientY - rect.top) / (rect.height / 2) - 1, -1, 1);
        if (!raf) paint();
      }, { passive: true });
      el.addEventListener("pointerleave", function () { ramp(0); });
      el.addEventListener("wheel", function () { rect = el.getBoundingClientRect(); }, { passive: true });
    });
  })();

  /* ---------- #087 Before/after slider ---------- */
  (function () {
    doc.querySelectorAll(".ba-frame").forEach(function (f) {
      var r = f.querySelector(".ba-range"), touched = false;
      var set = function (v) { f.style.setProperty("--pos", v + "%"); };
      r.addEventListener("input", function () { touched = true; set(r.value); });
      if (reduce) return;
      // Once, as it comes into view, the divider shows how it moves: 50 → 20 → 82 → 50 % (cubic ease-in-out)
      var keys = [[0.75, 50], [1.55, 20], [2.65, 82], [3.55, 50]];
      seen(f, "-25%", function () {
        if (paused()) return;
        var t0 = performance.now();
        var tick = function (now) {
          if (touched || paused()) return;
          var u = (now - t0) / 1000, v = 50;
          for (var i = 1; i < keys.length; i++) {
            if (u <= keys[i][0]) { v = lerp(keys[i - 1][1], keys[i][1], eIO(clamp((u - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])))); break; }
          }
          if (u < keys[0][0]) v = 50;
          set(v.toFixed(2)); r.value = Math.round(v);
          if (u < keys[keys.length - 1][0]) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
  })();

  /* ---------- #161 View transition: a concept preview grows into its detail view ---------- */
  (function () {
    var view = doc.getElementById("conceptView"); if (!view) return;
    var heroImg = view.querySelector(".cv-hero img"), body = view.querySelector(".cv-body"), back = view.querySelector(".cv-back");
    var studies = {
      rmr: { article: doc.querySelector('[aria-labelledby="study-rmr"]'), shared: function (a) { var s = a.querySelectorAll(".phone-screen"); return s[s.length - 1]; } },
      dowd: { article: doc.querySelector('[aria-labelledby="study-dowd"]'), shared: function (a) { return a.querySelector(".browser"); } }
    };
    var current = null, opener = null, pushed = false;
    var outside = function () { return doc.querySelectorAll("body > header, body > main, body > footer, .motion-toggle"); };
    var vt = function (fn) {
      if (doc.startViewTransition && !reduce && !paused()) {
        var t = doc.startViewTransition(fn);
        t.ready.catch(function () {});                  // a skipped transition still runs fn; nothing to report
        return t.finished.catch(function () {});
      }
      fn(); return Promise.resolve();
    };
    var fill = function (id) {
      var a = studies[id].article, copy = a.querySelector(".study-copy"), img = studies[id].shared(a).querySelector("img");
      heroImg.src = img.currentSrc || img.src; heroImg.alt = img.alt;
      body.innerHTML = "";
      Array.prototype.forEach.call(copy.children, function (c) {
        var n = c.cloneNode(true);
        if (/^H3$/.test(n.tagName)) { var h = doc.createElement("h2"); h.id = "cv-title"; h.textContent = n.textContent; n = h; }
        body.appendChild(n);
      });
      var t = body.querySelector("h2"); if (t) t.id = "cv-title";
      body.querySelectorAll('a[href="#contact"]').forEach(function (l) {
        l.addEventListener("click", function (e) {
          e.preventDefault();
          close(false).then(function () { var c = doc.getElementById("contact"); if (c) c.scrollIntoView({ behavior: reduce || paused() ? "instant" : "smooth" }); });
        });
      });
    };
    var open = function (id, btn) {
      if (current) return;
      var s = studies[id]; if (!s || !s.article) return;
      current = id; opener = btn; fill(id);
      var src = s.shared(s.article);
      src.style.viewTransitionName = "cv-photo";
      vt(function () {
        src.style.viewTransitionName = "";
        heroImg.parentNode.style.viewTransitionName = "cv-photo";
        view.hidden = false; root.classList.add("cv-lock");
        outside().forEach(function (el) { el.inert = true; });
        view.scrollTop = 0; back.focus({ preventScroll: true });
      }).then(function () { heroImg.parentNode.style.viewTransitionName = ""; });
      try { history.pushState({ cv: id }, "", "#concept-" + id); pushed = true; } catch (e) { pushed = false; }
    };
    var close = function (fromPop) {
      if (!current) return Promise.resolve();
      var s = studies[current], src = s.shared(s.article);
      heroImg.parentNode.style.viewTransitionName = "cv-photo";
      var done = vt(function () {
        heroImg.parentNode.style.viewTransitionName = "";
        view.hidden = true; root.classList.remove("cv-lock");
        outside().forEach(function (el) { el.inert = false; });
        src.style.viewTransitionName = "cv-photo";
        if (opener) opener.focus({ preventScroll: true });
      });
      done = done.then(function () { src.style.viewTransitionName = ""; });
      current = null;
      if (!fromPop && pushed) { pushed = false; try { history.replaceState(null, "", location.pathname + location.search + "#concepts"); } catch (e) {} }
      return done;
    };
    doc.querySelectorAll(".cv-open").forEach(function (b) {
      b.hidden = false;
      b.addEventListener("click", function () { open(b.getAttribute("data-cv"), b); });
    });
    back.addEventListener("click", function () { if (pushed) { pushed = false; history.back(); } else close(false); });
    window.addEventListener("popstate", function () { if (current) close(true); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && current) back.click(); });
  })();

  /* ---------- #156 Text roll on hover: nav links and the hero buttons ---------- */
  (function () {
    if (!fine || reduce) return;
    doc.querySelectorAll(".site-nav a:not(.nav-cta), .hero .cta-row .btn").forEach(function (a) {
      var label = a.textContent.trim(); if (!label || a.children.length) return;
      var chars = Array.from(label).map(function (ch, i) { return '<span style="--i:' + i + '">' + (ch === " " ? "&nbsp;" : ch.replace(/&/g, "&amp;").replace(/</g, "&lt;")) + "</span>"; }).join("");
      a.setAttribute("aria-label", label);
      a.innerHTML = '<span class="roll" aria-hidden="true"><span class="roll-row">' + chars + '</span><span class="roll-row roll-b">' + chars + "</span></span>";
      a.classList.add("roll-on");
    });
  })();
})();
