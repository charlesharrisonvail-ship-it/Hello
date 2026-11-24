/* Residence Explorer: opens the live 3D sample home over the page (no separate page).
   The model loads only when a visitor asks for it (about 18 MB). Its Contact and
   Book a Call buttons send a message here, which closes the overlay and goes to the form. */
(function () {
  "use strict";
  var doc = document, view = doc.getElementById("rxView"), frame = doc.getElementById("rxFrame"), closeBtn = doc.getElementById("rxClose");
  var openBtn = doc.querySelector("[data-rx-open]");
  if (!view || !frame || !openBtn) return;
  var SRC = "assets/explorer/residence-explorer.html", opener = null, pushed = false;
  var outside = function () { return doc.querySelectorAll("body > header, body > main, body > footer, .motion-toggle"); };
  var open = function () {
    if (!view.hidden) return;
    opener = doc.activeElement;
    frame.setAttribute("src", SRC);
    view.hidden = false; doc.documentElement.classList.add("cv-lock");
    outside().forEach(function (el) { el.inert = true; });
    closeBtn.focus({ preventScroll: true });
    try { history.pushState({ rx: 1 }, "", "#residence-explorer-3d"); pushed = true; } catch (e) { pushed = false; }
  };
  var close = function (fromPop) {
    if (view.hidden) return;
    view.hidden = true; doc.documentElement.classList.remove("cv-lock");
    frame.removeAttribute("src");                    // stop the 3D scene; reopening loads it from the browser cache
    outside().forEach(function (el) { el.inert = false; });
    if (!fromPop && pushed) { pushed = false; try { history.replaceState(null, "", location.pathname + location.search + "#residence-explorer"); } catch (e) {} }
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  };
  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", function () { if (pushed) { pushed = false; history.back(); } else close(false); });
  window.addEventListener("popstate", function () { if (!view.hidden) close(true); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !view.hidden) closeBtn.click(); });
  window.addEventListener("message", function (e) {
    if (e.origin !== location.origin || e.source !== frame.contentWindow || !e.data || e.data.hd !== "contact") return;
    close(false);
    var c = doc.getElementById("contact");
    if (c) c.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  });
  if (location.hash === "#residence-explorer-3d") open();
})();
