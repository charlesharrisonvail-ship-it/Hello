import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope/wght.css';
import './style.css';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Header turns solid once the hero is behind it.
const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');
new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-solid', !entry.isIntersecting);
}, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);

// Mobile navigation.
const toggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
function setNav(open) {
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
}
toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setNav(false); toggle.focus(); }
});

// Accessible tabs: arrow keys, Home/End, automatic activation.
function tabs(tabList, onSelect) {
  const list = [...tabList.querySelectorAll('[role="tab"]')];
  const vertical = tabList.getAttribute('aria-orientation') === 'vertical';
  function select(tab, focus) {
    list.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    onSelect?.(tab);
  }
  list.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const next = vertical ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight', 'ArrowDown'];
      const prev = vertical ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft', 'ArrowUp'];
      let j = null;
      if (next.includes(e.key)) j = (i + 1) % list.length;
      else if (prev.includes(e.key)) j = (i - 1 + list.length) % list.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = list.length - 1;
      if (j === null) return;
      e.preventDefault();
      select(list[j], true);
    });
  });
}

const aerial = document.querySelector('[data-aerial]');
tabs(document.querySelector('.phases__tabs'), (tab) => {
  aerial.dataset.phase = tab.dataset.phaseTab;
});
tabs(document.querySelector('.docs__list'));

// Gentle reveal on scroll; skipped entirely for reduced motion.
const reveals = document.querySelectorAll('.reveal');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('can-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
}

// Reel: plays silently on its own while on screen, pauses when scrolled away.
// Reduced-motion visitors get the poster and the play button instead.
const reel = document.querySelector('[data-reel]');
if (reel) {
  reel.muted = true;
  if (reduceMotion.matches) {
    reel.removeAttribute('autoplay');
    reel.pause();
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reel.play().catch(() => {});
      else reel.pause();
    }, { threshold: 0.35 }).observe(reel);
  }
}
