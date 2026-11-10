/* Harrison Development: 3D Colorado terrain map.
   Real elevation and USGS satellite imagery (built by tools/build-terrain.py), rendered with
   three.js (self-hosted, MIT). Loads only when the map nears the screen. Without WebGL the
   pre-rendered still stays, with labels at their saved positions. */
(function () {
  "use strict";
  var stage = document.getElementById("mapStage");
  if (!stage) return;
  var labels = [].slice.call(stage.querySelectorAll("[data-lon]"));
  var html = document.documentElement;

  function place(el, x, y, show) {
    el.style.left = x + "%"; el.style.top = y + "%";
    el.style.visibility = show === false ? "hidden" : "";
  }
  labels.forEach(function (el) { place(el, +el.dataset.x, +el.dataset.y); });

  // Colorado bounds (must match tools/build-terrain.py)
  var W = -109.06, E = -102.04, S = 36.99, N = 41.0;
  var SX = 10, SZ = 10 * 1506 / 2048, HSCALE = 0.42, BASE = -0.22;
  function merc(lat) { var r = lat * Math.PI / 180; return Math.log(Math.tan(Math.PI / 4 + r / 2)); }
  function toXZ(lon, lat) {
    return [(lon - W) / (E - W) * SX - SX / 2, (merc(N) - merc(lat)) / (merc(N) - merc(S)) * SZ - SZ / 2];
  }

  function reduced() {
    return html.classList.contains("motion-paused") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function loadImage(src) {
    return new Promise(function (ok, bad) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = bad; i.src = src; });
  }

  function start() {
    Promise.all([import("./vendor/three.module.min.js"), loadImage("assets/map/colorado-height.png")]).then(function (r) {
      build(r[0], r[1]);
    }).catch(function () { /* keep the still image */ });
  }

  function build(T, himg) {
    var renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return; }
    if (!renderer.getContext()) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    var canvas = renderer.domElement;
    canvas.className = "map-canvas";
    canvas.setAttribute("aria-hidden", "true");
    stage.insertBefore(canvas, stage.querySelector(".map-labels"));

    // Height samples
    var hc = document.createElement("canvas"); hc.width = himg.width; hc.height = himg.height;
    var hx = hc.getContext("2d"); hx.drawImage(himg, 0, 0);
    var hd = hx.getImageData(0, 0, hc.width, hc.height).data, HW = hc.width, HH = hc.height;
    function hAt(u, v) { // u,v in 0..1, bilinear
      var x = Math.min(Math.max(u, 0), 1) * (HW - 1), y = Math.min(Math.max(v, 0), 1) * (HH - 1);
      var x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, HW - 1), y1 = Math.min(y0 + 1, HH - 1);
      var fx = x - x0, fy = y - y0;
      function g(a, b) { return hd[(b * HW + a) * 4] / 255; }
      return ((g(x0, y0) * (1 - fx) + g(x1, y0) * fx) * (1 - fy) + (g(x0, y1) * (1 - fx) + g(x1, y1) * fx) * fy) * HSCALE;
    }
    function hXZ(x, z) { return hAt((x + SX / 2) / SX, (z + SZ / 2) / SZ); }

    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(32, 1, 0.1, 100);

    // Terrain
    var SEGX = 320, SEGZ = Math.round(SEGX * SZ / SX);
    var geo = new T.PlaneGeometry(SX, SZ, SEGX, SEGZ);
    geo.rotateX(-Math.PI / 2);
    var pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) pos.setY(i, hXZ(pos.getX(i), pos.getZ(i)));
    geo.computeVertexNormals();
    var tex = new T.TextureLoader().load("assets/map/colorado-imagery.webp", function () { needs = true; });
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var land = new T.Mesh(geo, new T.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 }));
    scene.add(land);

    // Walls around the slab, and a neon rim on the state line
    var rim = [], wall = [], steps = 400;
    function edge(ax, az, bx, bz) {
      for (var k = 0; k <= steps; k++) {
        var t = k / steps, x = ax + (bx - ax) * t, z = az + (bz - az) * t, y = hXZ(x, z);
        rim.push(x, y + 0.004, z);
        if (k < steps) {
          var t2 = (k + 1) / steps, x2 = ax + (bx - ax) * t2, z2 = az + (bz - az) * t2, y2 = hXZ(x2, z2);
          wall.push(x, y, z, x, BASE, z, x2, y2, z2, x2, y2, z2, x, BASE, z, x2, BASE, z2);
        }
      }
    }
    var hx2 = SX / 2, hz2 = SZ / 2;
    edge(-hx2, -hz2, hx2, -hz2); edge(hx2, -hz2, hx2, hz2); edge(hx2, hz2, -hx2, hz2); edge(-hx2, hz2, -hx2, -hz2);
    var wg = new T.BufferGeometry(); wg.setAttribute("position", new T.Float32BufferAttribute(wall, 3)); wg.computeVertexNormals();
    scene.add(new T.Mesh(wg, new T.MeshStandardMaterial({ color: 0x161b20, roughness: 1, side: T.DoubleSide })));
    var accent = new T.Color(getComputedStyle(html).getPropertyValue("--accent").trim() || "#DFFF1A");
    var rg = new T.BufferGeometry(); rg.setAttribute("position", new T.Float32BufferAttribute(rim, 3));
    scene.add(new T.Line(rg, new T.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.85 })));
    var floor = new T.Mesh(new T.PlaneGeometry(SX * 1.04, SZ * 1.06), new T.MeshBasicMaterial({ color: 0x0b0d10 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = BASE - 0.001; scene.add(floor);

    // Light: low sun from the northwest to rake the ridges
    scene.add(new T.HemisphereLight(0xdfe8ff, 0x1a1f24, 1.3));
    var sun = new T.DirectionalLight(0xfff4e0, 2.4); sun.position.set(-6, 5, -4); scene.add(sun);

    // Pins
    var dotTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64; var x = c.getContext("2d");
      var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.28, "rgba(255,255,255,1)");
      g.addColorStop(0.36, "rgba(255,255,255,.5)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(0, 0, 64, 64); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
    })();
    var pins = labels.map(function (el) {
      var xz = toXZ(+el.dataset.lon, +el.dataset.lat), ground = hXZ(xz[0], xz[1]);
      var major = el.classList.contains("town"), top = ground + (major ? 0.42 : 0.03);
      var mat = new T.SpriteMaterial({ map: dotTex, color: major ? 0xffffff : 0xeef1f3, transparent: true, depthTest: false });
      var s = new T.Sprite(mat); s.position.set(xz[0], top, xz[1]); s.renderOrder = 3;
      var base = major ? 0.2 : 0.09; s.scale.setScalar(base); scene.add(s);
      var line = null;
      if (major) {
        var lg = new T.BufferGeometry().setFromPoints([new T.Vector3(xz[0], ground, xz[1]), new T.Vector3(xz[0], top, xz[1])]);
        line = new T.Line(lg, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
        scene.add(line);
      }
      return { el: el, sprite: s, line: line, base: base, region: el.dataset.region, major: major, top: new T.Vector3(xz[0], top, xz[1]) };
    });
    var white = new T.Color(0xffffff);

    // Camera rig: spherical around a target, eased toward goals
    var overview = { tx: 0, tz: 0.5, dist: 17.5, polar: 0.78, az: -0.1 };
    var cur = Object.assign({}, overview), goal = Object.assign({}, overview);
    var drag = 0, t0 = performance.now(), needs = true, visible = false;
    function focusFor(region) {
      var ps = pins.filter(function (p) { return p.region === region && p.major; });
      if (!ps.length) return overview;
      var p = ps[0].top;
      return { tx: p.x, tz: p.z + 0.2, dist: 6.2, polar: 0.92, az: overview.az };
    }
    var activeRegion = null;
    function readActive() {
      var a = stage.querySelector(".town.active");
      return a ? a.dataset.region : null;
    }

    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      camera.fov = w / h < 1.1 ? 40 : 32; camera.updateProjectionMatrix(); needs = true;
    }
    new ResizeObserver(resize).observe(stage); resize();

    // Horizontal drag to turn the map
    var lastX = null;
    canvas.addEventListener("pointerdown", function (e) { lastX = e.clientX; canvas.setPointerCapture(e.pointerId); stage.classList.add("dragging"); });
    canvas.addEventListener("pointermove", function (e) {
      if (lastX === null) return; drag += (e.clientX - lastX) * 0.006; lastX = e.clientX; needs = true;
    });
    function up() { lastX = null; stage.classList.remove("dragging"); }
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);

    var v = new T.Vector3();
    function frame(now) {
      if (!visible) { raf = 0; return; }
      raf = requestAnimationFrame(frame);
      var r = readActive();
      if (r !== activeRegion) { activeRegion = r; goal = r ? focusFor(r) : Object.assign({}, overview); needs = true; }
      var still = reduced();
      var k = still ? 1 : 0.06;
      ["tx", "tz", "dist", "polar", "az"].forEach(function (key) {
        var d = goal[key] - cur[key]; if (Math.abs(d) > 1e-4) { cur[key] += d * k; needs = true; } else cur[key] = goal[key];
      });
      var sway = still ? 0 : Math.sin((now - t0) / 9000) * (activeRegion ? 0.25 : 0.12);
      if (!still) needs = true;
      if (!needs) return;
      needs = false;
      var az = cur.az + sway + drag, ty = 0.12;
      camera.position.set(
        cur.tx + cur.dist * Math.sin(cur.polar) * Math.sin(az),
        ty + cur.dist * Math.cos(cur.polar),
        cur.tz + cur.dist * Math.sin(cur.polar) * Math.cos(az));
      camera.lookAt(cur.tx, ty, cur.tz);

      var anyHot = !!stage.querySelector(".town.active,.town.hover");
      var pulse = still ? 1 : 1 + 0.18 * Math.sin(now / 260);
      pins.forEach(function (p) {
        var hot = stage.querySelector('.town.active[data-region="' + p.region + '"],.town.hover[data-region="' + p.region + '"]');
        var col = hot ? accent : white;
        p.sprite.material.color.copy(col);
        p.sprite.material.opacity = anyHot && !hot ? 0.35 : 1;
        p.sprite.scale.setScalar(p.base * (hot ? 1.5 * pulse : 1));
        if (p.line) { p.line.material.color.copy(col); p.line.material.opacity = anyHot && !hot ? 0.25 : 0.8; }
        v.copy(p.top).project(camera);
        place(p.el, (v.x + 1) * 50, (1 - v.y) * 50, v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05);
      });
      renderer.render(scene, camera);
      if (!stage.classList.contains("live")) { stage.classList.add("live"); window.__hdMapReady = true; }
    }
    var raf = 0;
    function wake() { needs = true; if (visible && !raf) raf = requestAnimationFrame(frame); }
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting && !document.hidden; wake(); }).observe(stage);
    document.addEventListener("visibilitychange", function () { visible = !document.hidden && visible; wake(); });
    new MutationObserver(wake).observe(stage, { subtree: true, attributes: true, attributeFilter: ["class"] });
    new MutationObserver(wake).observe(html, { attributes: true, attributeFilter: ["class"] });
    visible = true; wake();
  }

  /* Google photorealistic 3D map, used when a key is set in config. Falls back to the
     self-hosted map if the key or the API fails. */
  function startGoogle(key) {
    var done = false;
    function fail() { if (done) return; done = true; stage.classList.remove("google"); var g = stage.querySelector("gmp-map-3d"); if (g) g.remove(); start(); }
    window.gm_authFailure = fail;
    window.__hdGmaps = function () {
      google.maps.importLibrary("maps3d").then(function (lib) {
        var towns = [].slice.call(stage.querySelectorAll(".town"));
        var overview = { center: { lat: 39.05, lng: -106.0, altitude: 0 }, range: 560000, tilt: 52, heading: 0 };
        var map = new lib.Map3DElement(Object.assign({ mode: "HYBRID" }, overview));
        map.className = "map-google";
        stage.insertBefore(map, stage.querySelector(".map-labels"));
        stage.classList.add("google", "live");
        // A bad or unauthorised key never reaches a steady view: fall back after 15 s.
        var ok = false, guard = setTimeout(function () { if (!ok) { done = false; fail(); } }, 15000);
        map.addEventListener("gmp-steadychange", function () { ok = true; clearTimeout(guard); });
        towns.forEach(function (el) {
          map.append(new lib.Marker3DElement({
            position: { lat: +el.dataset.lat, lng: +el.dataset.lon, altitude: 2500 },
            altitudeMode: "RELATIVE_TO_GROUND", extruded: true, label: el.textContent.trim()
          }));
        });
        var cap = stage.parentNode.querySelector("figcaption");
        if (cap) cap.textContent = "Colorado in 3D, Google Maps. Choose a region to fly to it; drag to look around.";
        var active = null;
        function sync() {
          var a = stage.querySelector(".town.active"), r = a ? a.dataset.region : null;
          if (r === active) return; active = r;
          var cam = a ? { center: { lat: +a.dataset.lat, lng: +a.dataset.lon, altitude: 0 }, range: 32000, tilt: 66, heading: 20 } : overview;
          if (reduced()) { Object.assign(map, cam); return; }
          map.flyCameraTo({ endCamera: cam, durationMillis: 3500 });
        }
        new MutationObserver(sync).observe(stage, { subtree: true, attributes: true, attributeFilter: ["class"] });
        done = true;
      }).catch(fail);
    };
    var s = document.createElement("script");
    s.async = true; s.onerror = fail;
    s.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) + "&v=weekly&libraries=maps3d&loading=async&callback=__hdGmaps";
    document.head.appendChild(s);
  }

  if (!("IntersectionObserver" in window)) return;
  var gkey = (window.HD_CONFIG || {}).googleMapsKey;
  var io = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { io.disconnect(); if (gkey) startGoogle(gkey); else start(); }
  }, { rootMargin: "600px 0px" });
  io.observe(stage);
})();
