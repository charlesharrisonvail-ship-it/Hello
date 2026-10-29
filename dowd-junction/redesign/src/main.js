import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import './style.css';
import { DOCS } from './docs.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Navigation: solid background once past the hero; menu disclosure on small screens.
const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');
const menu = document.getElementById('nav-menu');

const setScrolled = () => nav.classList.toggle('is-solid', window.scrollY > 40);
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

const closeMenu = () => {
  toggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
};
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  if (open) menu.querySelector('a').focus();
});
menu.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
});

// Tabs with roving tabindex and automatic activation (WAI-ARIA tabs pattern).
function initTabs(tablist, onSelect) {
  const tabs = () => [...tablist.querySelectorAll('[role="tab"]')];
  const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
  const select = (tab, focus = true) => {
    tabs().forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    onSelect(tab);
  };
  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab, false);
  });
  tablist.addEventListener('keydown', (e) => {
    const list = tabs();
    const i = list.indexOf(document.activeElement);
    if (i < 0) return;
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    let j = null;
    if (e.key === next || (!vertical && e.key === 'ArrowDown') || (vertical && e.key === 'ArrowRight')) j = (i + 1) % list.length;
    else if (e.key === prev || (!vertical && e.key === 'ArrowUp') || (vertical && e.key === 'ArrowLeft')) j = (i - 1 + list.length) % list.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = list.length - 1;
    if (j === null) return;
    e.preventDefault();
    select(list[j]);
  });
  return select;
}

// Development phases.
const phaseList = document.querySelector('.phases__tabs');
initTabs(phaseList, (tab) => {
  document.querySelectorAll('.phase').forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute('aria-controls');
  });
});

// Source document viewer.
const docsRoot = document.querySelector('[data-docs]');
const docsList = docsRoot.querySelector('.docs__list');
const docsPanel = docsRoot.querySelector('.docs__panel');

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

DOCS.forEach((doc, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.id = `doc-tab-${doc.id}`;
  b.setAttribute('aria-controls', 'doc-panel');
  b.setAttribute('aria-selected', String(i === 0));
  b.tabIndex = i === 0 ? 0 : -1;
  b.dataset.doc = doc.id;
  b.innerHTML = `<span class="docs__date">${esc(doc.date)}</span><span class="docs__name">${esc(doc.title)}</span>`;
  docsList.append(b);
});
docsPanel.id = 'doc-panel';

const renderDoc = (id) => {
  const d = DOCS.find((x) => x.id === id);
  docsPanel.setAttribute('aria-labelledby', `doc-tab-${d.id}`);
  docsPanel.innerHTML = `
    <p class="docs__kind">${esc(d.kind)} · ${esc(d.publisher)}</p>
    <h3 class="docs__title">${esc(d.title)}</h3>
    <dl class="docs__meta">
      <div><dt>Date</dt><dd>${esc(d.date)}</dd></div>
      <div><dt>Where to look</dt><dd>${esc(d.pointer)}</dd></div>
    </dl>
    <div class="docs__cols">
      <div><h4>What it establishes</h4><ul>${d.establishes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><h4>What it does not</h4><ul>${d.limits.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    </div>
    <a class="btn btn--dark" href="${esc(d.url)}" rel="noopener" target="_blank">Open the document <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
};
renderDoc(DOCS[0].id);
initTabs(docsList, (tab) => renderDoc(tab.dataset.doc));

// Gentle reveal on scroll; skipped entirely for reduced motion.
const reveals = document.querySelectorAll('.reveal');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('has-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
}
