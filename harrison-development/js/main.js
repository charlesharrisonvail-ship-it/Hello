(function () {
  "use strict";
  var cfg = window.HD_CONFIG || {};
  var doc = document;
  doc.documentElement.classList.add("js");

  function $(id) { return doc.getElementById(id); }
  function text(el, v) { if (el && v) el.textContent = v; }

  /* ---------- Config-driven content ---------- */
  if (cfg.previewBanner) { var pb = $("previewBanner"); if (pb) pb.hidden = false; }
  text($("attribution"), cfg.attribution);
  text($("footAttribution"), cfg.attribution);
  text($("serviceArea"), cfg.serviceArea);
  if (cfg.credentials && cfg.credentials.length) text($("credentials"), cfg.credentials.join(" · "));

  var c = cfg.contact || {};
  var list = $("contactList");
  var foot = $("footContact");
  function esc(s) { var d = doc.createElement("div"); d.textContent = s; return d.innerHTML; }
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

  /* ---------- Mobile navigation ---------- */
  var toggle = $("navToggle"), nav = $("siteNav");
  if (toggle && nav) {
    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Gentle reveal (skipped for reduced motion) ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var targets = doc.querySelectorAll(".services li, .who > div, .steps li, .value .split > *");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  /* ---------- Contact form ---------- */
  var form = $("contactForm");
  if (!form) return;
  var state = $("formState"), summary = $("errorSummary"), result = $("formResult"), btn = $("submitBtn");
  var live = !!cfg.formEndpoint;
  var submitting = false, lastSent = "";

  state.textContent = live
    ? "Tell us about your project and we will follow up personally."
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
      if (msg) {
        el.setAttribute("aria-invalid", "true"); er.textContent = msg; er.hidden = false;
        errors.push({ k: k, msg: msg });
      } else { el.removeAttribute("aria-invalid"); er.hidden = true; er.textContent = ""; }
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

  function mailtoLink(data) {
    var body = ["Name: " + data.name, "Email: " + data.email, "Phone: " + (data.phone || "(not provided)"), "Role: " + data.role,
      "Project location: " + data.location, "Project stage: " + data.stage, "", data.description].join("\n");
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
      description: form.elements.description.value.trim()
    };

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
