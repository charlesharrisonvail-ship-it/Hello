/* Phone menu for AiRE Estate pages. Under 860px the top bar hides its links;
   this gives them back. Pages with several links get a Menu button that drops
   a panel down from the bar; a page with a single link just keeps it visible.
   The panel is built from the page's own links, so it never says anything the
   page doesn't. Styles are in modern.css ("Phone menu"). */
(function () {
  'use strict';
  var nav = document.querySelector('.nav .navlinks');
  if (!nav) return;
  var links = [].slice.call(nav.querySelectorAll('a:not(.apply)'));
  if (!links.length) return;

  // One link: no menu needed, keep it in the bar.
  if (links.length === 1) { links[0].classList.add('mx-solo'); return; }

  var mq = window.matchMedia('(max-width: 860px)');
  var root = document.documentElement;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mx-menubtn';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'mx-menu');
  btn.setAttribute('aria-label', 'Menu');
  btn.innerHTML = '<span class="mx-burger" aria-hidden="true"><i></i><i></i></span><span class="mx-menulabel" aria-hidden="true">Menu</span>';
  var apply = nav.querySelector('.apply');
  nav.insertBefore(btn, apply || null);

  var scrim = document.createElement('div');
  scrim.className = 'mx-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  var panel = document.createElement('div');
  panel.className = 'mx-menu';
  panel.id = 'mx-menu';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Site menu');
  var list = document.createElement('nav');
  list.setAttribute('aria-label', 'Page sections');
  links.forEach(function (a) {
    var c = document.createElement('a');
    c.href = a.getAttribute('href');
    c.textContent = a.textContent;
    list.appendChild(c);
  });
  panel.appendChild(list);

  // The Motion switch is hidden on phones too; offer it here, driving the real one.
  var mt = document.getElementById('mtoggle');
  var mrow = null;
  if (mt) {
    mrow = document.createElement('button');
    mrow.type = 'button';
    mrow.className = 'mx-menumotion';
    mrow.addEventListener('click', function () { mt.click(); syncMotion(); });
    panel.appendChild(mrow);
  }
  function syncMotion() {
    if (!mrow) return;
    var on = root.getAttribute('data-motion') !== 'off';
    mrow.setAttribute('aria-pressed', on ? 'true' : 'false');
    mrow.innerHTML = '<i aria-hidden="true"></i>Motion ' + (on ? 'on' : 'off');
  }

  document.body.appendChild(scrim);
  document.body.appendChild(panel);

  var open = false;
  function items() { return [].slice.call(panel.querySelectorAll('a,button')); }
  function setOpen(v, restoreFocus) {
    if (v === open) return;
    open = v;
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    root.classList.toggle('mx-menu-open', v);
    if (v) {
      syncMotion();
      var first = items()[0];
      if (first) first.focus({ preventScroll: true });
    } else if (restoreFocus !== false) {
      btn.focus({ preventScroll: true });
    }
  }

  btn.addEventListener('click', function () { setOpen(!open); });
  scrim.addEventListener('click', function () { setOpen(false); });
  // A link closes the menu and then the page jumps to it as normal.
  list.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false, false);
  });
  document.addEventListener('keydown', function (e) {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key === 'Tab') {
      var f = items(), i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  // Rotating to a wide screen brings the full bar back; close the menu.
  function onWidth() { if (!mq.matches) setOpen(false, false); }
  if (mq.addEventListener) mq.addEventListener('change', onWidth);
  else if (mq.addListener) mq.addListener(onWidth);
})();
