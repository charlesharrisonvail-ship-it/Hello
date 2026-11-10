(function () {
  "use strict";
  var cfg = window.HD_CONFIG || {};
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");
  if (cfg.accent === "pink") root.setAttribute("data-accent", "pink");

  function $(id) { return doc.getElementById(id); }
  function text(el, v) { if (el && v) el.textContent = v; }
  function esc(s) { var d = doc.createElement("div"); d.textContent = s; return d.innerHTML; }

  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var supportsView = !!(window.CSS && CSS.supports && CSS.supports("(animation-timeline: view()) and (animation-range: entry)"));
  var supportsScroll = !!(window.CSS && CSS.supports && CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)"));
  var finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  /* ---------- Config-driven content ---------- */
  if (cfg.previewBanner) { var pb = $("previewBanner"); if (pb) pb.hidden = false; }
  text($("attribution"), cfg.attribution);
  text($("footAttribution"), cfg.attribution);
  text($("serviceArea"), cfg.serviceArea);
  if (cfg.credentials && cfg.credentials.length) text($("credentials"), cfg.credentials.join(" · "));

  var c = cfg.contact || {};
  var list = $("contactList");
  var foot = $("footContact");
  if (list) {
    var items = [];
    if (c.phone) items.push('<li><span class="k">Phone</span><a href="tel:' + esc(c.phone.replace(/[^\d+]/g, "")) + '">' + esc(c.phone) + "</a></li>");
    if (c.email) items.push('<li><span class="k">Email</span><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a></li>");
    if (cfg.serviceArea) items.push('<li><span class="k">Service area</span>' + esc(cfg.serviceArea) + "</li>");
    list.innerHTML = items.join("");
  }
  if (foot) {
    var parts = [];
    if (c.phone) parts.push(esc(c.phone));
    if (c.email) parts.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>");
    foot.innerHTML = parts.length ? parts.join("<br>") : "Contact details will appear here once confirmed.";
  }

  // Portrait: shown only when a real photo is configured.
  var pf = $("portrait"), pimg = $("portraitImg"), pc = cfg.portrait || {};
  if (pf && pimg && pc.src) { pimg.src = pc.src; pimg.alt = pc.alt || "Portrait of Charles Harrison"; pf.hidden = false; }

  // Concept studies can be switched off in config.
  if (cfg.showConcepts === false) {
    doc.querySelectorAll("[data-concepts], [data-concepts-nav]").forEach(function (el) { el.hidden = true; });
  }

  // Booking link: only ever the configured URL. Never invented.
  var bookBtn = $("bookBtn"), bookText = $("bookingText");
  if (cfg.bookingUrl && bookBtn) {
    bookBtn.href = cfg.bookingUrl; bookBtn.target = "_blank"; bookBtn.rel = "noopener";
    bookBtn.hidden = false;
    bookBtn.textContent = "Choose a time";
    if (bookText) bookText.textContent = "Pick a time that suits you. The scheduling page opens in a new tab.";
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = $("navToggle"), nav = $("siteNav");
  if (toggle && nav) {
    var setOpen = function (open) { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); };
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Hero headline: word-by-word entrance (CSS only animates when motion is allowed) ---------- */
  var h1 = $("hero-title");
  if (h1 && !h1.querySelector(".w")) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.textContent = "";
    words.forEach(function (w, i) {
      var outer = doc.createElement("span"); outer.className = "w";
      var inner = doc.createElement("span"); inner.className = "wi"; inner.style.setProperty("--i", i); inner.textContent = w;
      outer.appendChild(inner); h1.appendChild(outer);
      if (i < words.length - 1) h1.appendChild(doc.createTextNode(" "));
    });
  }

  /* ---------- Reveal fallback (only where native scroll-driven animations are missing) ---------- */
  if (!reduce && !supportsView && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    doc.querySelectorAll(".rv").forEach(function (el) { el.classList.add("rv-js"); io.observe(el); });
  }

  /* ---------- Header + progress fallback (only where native scroll timelines are missing) ---------- */
  var header = doc.querySelector(".site-header"), bar = doc.querySelector(".progress");
  if (!supportsScroll) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY || 0;
      if (header) header.classList.toggle("scrolled", y > 24);
      if (bar && !reduce) {
        var max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
        bar.style.transform = "scaleX(" + Math.min(1, y / max) + ")";
      }
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Hero spotlight and magnetic buttons (fine pointers, motion allowed) ---------- */
  var hero = $("hero");
  if (hero && finePointer && !reduce) {
    var raf = 0, mx = 0, my = 0;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; hero.style.setProperty("--mx", mx + "px"); hero.style.setProperty("--my", my + "px"); });
    }, { passive: true });
    doc.querySelectorAll(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.setProperty("--tx", (dx * 10).toFixed(1) + "px"); b.style.setProperty("--ty", (dy * 8).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", function () { b.style.removeProperty("--tx"); b.style.removeProperty("--ty"); });
    });
  }

  /* ---------- Scrollspy: mark the nav link for the section in view ---------- */
  if ("IntersectionObserver" in window && nav) {
    var links = {};
    nav.querySelectorAll('a[href^="#"]:not(.nav-cta)').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        var a = links[en.target.id]; if (a) a.setAttribute("aria-current", "true"); // sections without a nav link simply clear it
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    doc.querySelectorAll("main section[id], main .hero").forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- Background footage: lazy, muted, plays only in view; one switch pauses all motion ---------- */
  var bgVideos = Array.prototype.slice.call(doc.querySelectorAll("video[data-bg]"));
  var motionToggle = $("motionToggle");
  var motionPaused = false;
  try { motionPaused = localStorage.getItem("hdMotion") === "paused"; } catch (e) {}
  var inView = [];
  var loadVid = function (v) {
    if (v.getAttribute("data-loaded")) return;
    v.setAttribute("data-loaded", "1");
    v.querySelectorAll("source[data-src]").forEach(function (src) { src.src = src.getAttribute("data-src"); });
    v.load();
  };
  var syncVideos = function () {
    bgVideos.forEach(function (v) {
      var on = !reduce && !motionPaused && inView.indexOf(v) !== -1;
      if (on) { loadVid(v); var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else if (!v.paused) { v.pause(); }
    });
  };
  var applyMotion = function (p, save) {
    motionPaused = p;
    root.classList.toggle("motion-paused", p);
    if (motionToggle) { motionToggle.setAttribute("aria-pressed", String(p)); motionToggle.textContent = p ? "Play motion" : "Pause motion"; }
    if (save) { try { localStorage.setItem("hdMotion", p ? "paused" : "on"); } catch (e) {} }
    syncVideos();
  };
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var i = inView.indexOf(en.target);
        if (en.isIntersecting && i === -1) inView.push(en.target);
        if (!en.isIntersecting && i !== -1) inView.splice(i, 1);
      });
      syncVideos();
    }, { threshold: 0.2 });
    bgVideos.forEach(function (v) { vio.observe(v); });
  }
  if (motionToggle && !reduce) {
    motionToggle.hidden = false;
    motionToggle.addEventListener("click", function () { applyMotion(!motionPaused, true); });
  }
  applyMotion(motionPaused, false);

  /* ---------- Markets: region buttons mark the map ---------- */
  var towns = doc.querySelectorAll(".map .town"), rbtns = doc.querySelectorAll(".region-btn");
  function townFor(r) { return doc.querySelector('.map .town[data-region="' + r + '"]'); }
  rbtns.forEach(function (b) {
    var r = b.getAttribute("data-region");
    function hov(on) { var t = townFor(r); if (t) t.classList.toggle("hover", on); }
    b.addEventListener("mouseenter", function () { hov(true); });
    b.addEventListener("mouseleave", function () { hov(false); });
    b.addEventListener("focus", function () { hov(true); });
    b.addEventListener("blur", function () { hov(false); });
    b.addEventListener("click", function () {
      var was = b.getAttribute("aria-pressed") === "true";
      rbtns.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      towns.forEach(function (t) { t.classList.remove("active"); });
      if (!was) { b.setAttribute("aria-pressed", "true"); var t = townFor(r); if (t) t.classList.add("active"); }
    });
  });

  /* ---------- Motion pack 2: scroll-lit statement, headline reveals, spotlight cards, hover media ---------- */
  var paused = function () { return root.classList.contains("motion-paused"); };
  // Statement lights up word by word as it scrolls through the screen
  doc.querySelectorAll(".scrub").forEach(function (p) {
    var hot = /^(research|presentation|follow-up|licensed|sales|closing)/i;
    p.innerHTML = p.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="sw' + (hot.test(w) ? " hot-w" : "") + '">' + w + "</span>";
    }).join(" ");
    var ws = p.querySelectorAll(".sw");
    var lit = function () {
      var r = p.getBoundingClientRect(), vh = window.innerHeight;
      var t = reduce ? 1 : Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      var n = Math.round(t * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle("on", i < n); w.classList.toggle("hot", i < n && w.classList.contains("hot-w")); });
    };
    var tk = false;
    window.addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(function () { tk = false; lit(); }); } }, { passive: true });
    lit();
  });
  // Section headlines rise word by word out of a mask
  if (!reduce && "IntersectionObserver" in window) {
    var hio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); hio.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px" });
    doc.querySelectorAll("main h2").forEach(function (h) {
      if (h.children.length) return;
      var words = h.textContent.trim().split(/\s+/);
      h.setAttribute("aria-label", h.textContent.trim());
      h.innerHTML = words.map(function (w, i) {
        return '<span class="w" aria-hidden="true"><span style="transition-delay:' + (i * 45) + 'ms">' + w + "</span></span>";
      }).join(" ");
      h.classList.add("wr", "wr-js"); hio.observe(h);
    });
  }
  // Cursor spotlight on cards
  if (finePointer) {
    doc.querySelectorAll(".who.cards .card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--cx", (e.clientX - r.left) + "px"); c.style.setProperty("--cy", (e.clientY - r.top) + "px");
      }, { passive: true });
    });
  }
  // Services: a photo or clip follows the cursor over each row
  var hm = doc.querySelector(".hover-media");
  if (hm && finePointer && !reduce) {
    var hx = 0, hy = 0, tx = 0, ty = 0, hraf = 0, cur = "";
    var follow = function () {
      hx += (tx - hx) * 0.16; hy += (ty - hy) * 0.16;
      hm.style.transform = "translate(" + (hx + 28) + "px," + (hy - 105) + "px)";
      hraf = Math.abs(tx - hx) + Math.abs(ty - hy) > 0.5 ? requestAnimationFrame(follow) : 0;
    };
    doc.querySelectorAll(".services li[data-media]").forEach(function (li) {
      li.addEventListener("pointerenter", function (e) {
        if (paused()) return;
        var src = li.getAttribute("data-media");
        if (src !== cur) {
          cur = src;
          hm.innerHTML = /\.mp4$/.test(src) ? '<video src="' + src + '" muted loop playsinline autoplay></video>' : '<img src="' + src + '" alt="">';
        }
        if (!hm.classList.contains("on")) { hx = tx = e.clientX; hy = ty = e.clientY; }
        hm.classList.add("on");
      });
      li.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; if (!hraf) hraf = requestAnimationFrame(follow); }, { passive: true });
      li.addEventListener("pointerleave", function () { hm.classList.remove("on"); });
    });
  }

  /* ---------- Contact form ---------- */
  var form = $("contactForm");
  if (!form) return;
  var state = $("formState"), summary = $("errorSummary"), result = $("formResult"), btn = $("submitBtn");
  var live = !!cfg.formEndpoint;
  var submitting = false, lastSent = "";

  var emailMode = !live && !cfg.previewBanner && cfg.mailtoFallback && c.email;
  state.textContent = live
    ? "Tell us about your project and we will follow up personally."
    : emailMode
      ? "When you press the button, your own email app opens with your details addressed to Charles. Press send there. Nothing is stored on this site."
      : "PREVIEW ONLY: this form does not send anything yet. Nothing you type is transmitted or saved.";

  var rules = {
    name:        function (v) { return v.trim() ? "" : "Please enter your name."; },
    email:       function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com."; },
    phone:       function (v) { return !v.trim() || v.replace(/\D/g, "").length >= 7 ? "" : "Please enter a phone number with at least 7 digits, or leave it blank."; },
    role:        function (v) { return v ? "" : "Please choose the role that fits you best."; },
    location:    function (v) { return v.trim() ? "" : "Please tell us where the project is."; },
    stage:       function (v) { return v ? "" : "Please choose the project stage."; },
    description: function (v) { return v.trim().length >= 10 ? "" : "Please add a short description (at least 10 characters)."; }
  };
  var ids = { name: "f-name", email: "f-email", phone: "f-phone", role: "f-role", location: "f-location", stage: "f-stage", description: "f-desc" };
  var errIds = { name: "e-name", email: "e-email", phone: "e-phone", role: "e-role", location: "e-location", stage: "e-stage", description: "e-desc" };
  var labels = { name: "Name", email: "Email", phone: "Phone", role: "I am a", location: "Project location", stage: "Project stage", description: "Short project description" };

  function validate() {
    var errors = [];
    Object.keys(rules).forEach(function (k) {
      var el = $(ids[k]), er = $(errIds[k]), msg = rules[k](el.value);
      if (msg) { el.setAttribute("aria-invalid", "true"); er.textContent = msg; er.hidden = false; errors.push({ k: k, msg: msg }); }
      else { el.removeAttribute("aria-invalid"); er.hidden = true; er.textContent = ""; }
    });
    return errors;
  }
  function showSummary(errors) {
    if (!errors.length) { summary.hidden = true; summary.innerHTML = ""; return; }
    var h = "<strong>Please fix " + errors.length + (errors.length === 1 ? " item:" : " items:") + "</strong><ul>";
    errors.forEach(function (e) { h += '<li><a href="#' + ids[e.k] + '">' + esc(labels[e.k]) + "</a>: " + esc(e.msg) + "</li>"; });
    summary.innerHTML = h + "</ul>"; summary.hidden = false;
  }
  Object.keys(ids).forEach(function (k) {
    // Clear an error while the person is typing or choosing (not on blur, which shifts layout under a tap).
    ["input", "change"].forEach(function (ev) {
      $(ids[k]).addEventListener(ev, function () {
        var el = $(ids[k]), er = $(errIds[k]);
        if (el.getAttribute("aria-invalid") === "true" && !rules[k](el.value)) { el.removeAttribute("aria-invalid"); er.hidden = true; }
      });
    });
  });
  summary.addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (!a) return;
    e.preventDefault(); var t = doc.querySelector(a.getAttribute("href")); if (t) t.focus();
  });

  function box(msg, fail) { result.innerHTML = '<div class="box' + (fail ? " fail" : "") + '">' + msg + "</div>"; }

  function mailtoLink(d) {
    var body = ["Name: " + d.name, "Email: " + d.email, "Phone: " + (d.phone || "(not provided)"), "Role: " + d.role,
      "Project location: " + d.location, "Project stage: " + d.stage,
      "Preferred way to connect: " + (d.connect || "(no preference)"), "Best days or times: " + (d.times || "(not provided)"), "", d.description].join("\n");
    return "mailto:" + encodeURIComponent(c.email) + "?subject=" + encodeURIComponent("Project conversation") + "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitting) return;
    result.innerHTML = "";
    var errors = validate(); showSummary(errors);
    if (errors.length) { summary.focus(); return; }
    if (form.elements.website && form.elements.website.value) { return; } // honeypot: silently ignore bots

    var data = {
      name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), phone: form.elements.phone.value.trim(),
      role: form.elements.role.value, location: form.elements.location.value.trim(), stage: form.elements.stage.value,
      description: form.elements.description.value.trim(),
      connect: form.elements.connect.value, times: form.elements.times.value.trim()
    };

    if (emailMode) {
      // Live site without a form service: hand off to the visitor's email app. Never claim it was sent.
      box("<strong>Your email app should open now</strong> with your details addressed to Charles. Press send there to reach him." +
          '<a class="btn" href="' + mailtoLink(data) + '">Open my email app again</a>', false);
      window.location.href = mailtoLink(data);
      return;
    }

    if (!live) {
      // No approved endpoint: never simulate delivery.
      var msg = "<strong>Preview only. Nothing was sent.</strong> Your details were not transmitted or saved.";
      if (cfg.mailtoFallback && c.email) {
        msg += '<br>You can still reach out by email.<a class="btn" href="' + mailtoLink(data) + '">Open in my email app</a>' +
               '<br><span class="hint">This opens a draft in your own email app. You must press send there.</span>';
      }
      box(msg, false); return;
    }

    var payload = JSON.stringify(data);
    if (payload === lastSent) { box("You already sent this request. We have it and will follow up personally.", false); return; }
    submitting = true; btn.disabled = true; btn.textContent = "Sending…";
    var ctl = new AbortController(), timer = setTimeout(function () { ctl.abort(); }, 15000);
    fetch(cfg.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: payload, signal: ctl.signal })
      .then(function (r) {
        if (!r.ok) throw new Error("status " + r.status);
        lastSent = payload; form.reset(); // success is shown only after the server accepted it
        box("<strong>Thank you.</strong> Your request was received. We will follow up personally.", false);
      })
      .catch(function () {
        box("<strong>We could not send your request.</strong> Nothing was received. Please try again" + (c.email ? ", or email " + esc(c.email) : "") + ".", true);
      })
      .then(function () { clearTimeout(timer); submitting = false; btn.disabled = false; btn.textContent = "Start a Project Conversation"; });
  });
})();
