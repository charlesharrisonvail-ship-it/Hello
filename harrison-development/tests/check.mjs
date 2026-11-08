// Functional + layout checks for the Harrison Development preview.
// Run:  python3 -m http.server 8765 --directory harrison-development &  node harrison-development/tests/check.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765';
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
const results = []; const log = (ok, name, extra = '') => { results.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); };

const browser = await chromium.launch();
const external = new Set();

// social preview image from the editable source
{ const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto(BASE + '/assets/brand/og-source.html'); await p.waitForTimeout(400);
  await p.screenshot({ path: new URL('../assets/brand/og-image.png', import.meta.url).pathname }); await p.close(); }

for (const w of [360, 390, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: w < 800 ? 2 : 1 });
  const page = await ctx.newPage();
  page.on('request', r => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) external.add(r.url()); });
  await page.goto(BASE + '/index.html'); await page.waitForTimeout(500);
  // reveal everything for full-page shots
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
  await page.waitForTimeout(700);
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    h1: document.querySelectorAll('h1').length,
    clipped: [...document.querySelectorAll('h1,h2,h3,p,a,button,label,li')].filter(e => !e.closest('.hp') && !e.classList.contains('skip') && e.offsetParent !== null).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1); }).length,
    minBody: Math.min(...[...document.querySelectorAll('p,li,dd')].filter(e=>e.offsetParent).map(e => parseFloat(getComputedStyle(e).fontSize))),
    h1size: getComputedStyle(document.querySelector('h1')).fontSize,
    ctaVisible: (() => { const r = document.querySelector('.hero .btn-light').getBoundingClientRect(); return r.bottom <= window.innerHeight; })()
  }));
  log(m.sw <= m.iw, `${w}px no horizontal overflow`, `scrollWidth ${m.sw}`);
  log(m.clipped === 0, `${w}px no clipped elements`);
  log(m.h1 === 1, `${w}px exactly one H1`);
  log(m.minBody >= 14, `${w}px smallest text >= 14px`, `min ${m.minBody}px`);
  if (w <= 390) log(m.ctaVisible, `${w}px primary CTA visible without scrolling (hero)`);
  await page.screenshot({ path: `${SHOTS}home-${w}-top.png` });
  await page.screenshot({ path: `${SHOTS}home-${w}-full.png`, fullPage: true });
  await ctx.close();
}

// Mobile nav + keyboard
{ const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }); const page = await ctx.newPage();
  await page.goto(BASE + '/index.html');
  const t = page.locator('#navToggle');
  log(await t.getAttribute('aria-expanded') === 'false', 'mobile nav starts closed');
  await t.focus(); await page.keyboard.press('Enter');
  log(await t.getAttribute('aria-expanded') === 'true' && await page.locator('#siteNav').isVisible(), 'mobile nav opens via keyboard');
  await page.screenshot({ path: SHOTS + 'mobile-nav-open-390.png' });
  await page.keyboard.press('Escape');
  log(await t.getAttribute('aria-expanded') === 'false', 'Escape closes mobile nav');
  await ctx.close(); }

// Keyboard order + visible focus (desktop)
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(BASE + '/index.html');
  await page.keyboard.press('Tab');
  log(await page.evaluate(() => document.activeElement.className) === 'skip', 'first Tab stop is skip link');
  let focusOK = true, n = 0;
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); n++;
    const o = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; });
    if (!o) focusOK = false; }
  log(focusOK, `visible focus ring on ${n} consecutive tab stops`);
  // all in-page anchors resolve
  const bad = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(a => a.getAttribute('href').length > 1 && !document.querySelector(a.getAttribute('href'))).map(a => a.getAttribute('href')));
  log(bad.length === 0, 'all in-page links resolve', bad.join(','));
  await ctx.close(); }

// Form behaviour
async function formPage(viewport, cfgPatch) {
  const ctx = await browser.newContext({ viewport }); const page = await ctx.newPage();
  if (cfgPatch) await page.addInitScript(p => { window.__patch = p; Object.defineProperty(window, 'HD_CONFIG', { configurable: true, set(v) { this._c = Object.assign(v, window.__patch); }, get() { return this._c; } }); }, cfgPatch);
  await page.goto(BASE + '/index.html'); return { ctx, page };
}
async function fillValid(page) {
  await page.fill('#f-name', 'Test Person'); await page.fill('#f-email', 'test@example.com');
  await page.selectOption('#f-role', 'Developer'); await page.fill('#f-location', 'Gypsum, CO');
  await page.selectOption('#f-stage', 'Planning or entitlement'); await page.fill('#f-desc', 'Test description of a small project.');
}
{ const { ctx, page } = await formPage({ width: 390, height: 900 });
  const state = await page.locator('#formState').textContent();
  log(/PREVIEW ONLY/.test(state), 'form labelled preview-only when no endpoint');
  await page.click('#submitBtn');
  const summaryVisible = await page.locator('#errorSummary').isVisible();
  log(summaryVisible && await page.evaluate(() => document.activeElement.id) === 'errorSummary', 'empty submit shows error summary and moves focus to it');
  log(await page.locator('#f-name').getAttribute('aria-invalid') === 'true', 'invalid fields flagged with aria-invalid');
  const labelled = await page.evaluate(() => [...document.querySelectorAll('#contactForm input:not([name=website]),#contactForm select,#contactForm textarea')].every(e => document.querySelector(`label[for="${e.id}"]`)));
  log(labelled, 'every form control has a programmatic label');
  await page.screenshot({ path: SHOTS + 'form-errors-390.png', fullPage: false });
  await fillValid(page); await page.click('#submitBtn');
  const r = await page.locator('#formResult').innerText();
  log(/Preview only\. Nothing was sent/.test(r) && !/thank you|received/i.test(r), 'valid submit in preview mode shows NO success message');
  const href = await page.locator('#formResult a').getAttribute('href');
  log(href.startsWith('mailto:'), 'mailto fallback labelled and offered', 'opens email app');
  await page.locator('#formResult').scrollIntoViewIfNeeded();
  await page.screenshot({ path: SHOTS + 'form-preview-result-390.png' });
  await ctx.close(); }
{ const { ctx, page } = await formPage({ width: 1440, height: 900 }, { formEndpoint: 'https://endpoint.test/submit' });
  await page.route('https://endpoint.test/**', r => r.fulfill({ status: 500, body: 'no' }));
  await fillValid(page); await page.click('#submitBtn');
  await page.waitForSelector('#formResult .box');
  log(/could not send/i.test(await page.locator('#formResult').innerText()), 'endpoint failure (500) shows failure, not success');
  await page.unroute('https://endpoint.test/**');
  await page.route('https://endpoint.test/**', r => r.fulfill({ status: 200, body: '{}' }));
  await page.click('#submitBtn'); await page.waitForFunction(() => /Thank you/.test(document.getElementById('formResult').innerText));
  log(true, 'success shown only after endpoint accepted (200)');
  await ctx.close(); }

// Reduced motion
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const page = await ctx.newPage();
  await page.goto(BASE + '/index.html');
  const info = await page.evaluate(() => ({ reveal: document.querySelectorAll('.reveal').length, tr: getComputedStyle(document.querySelector('.btn')).transitionDuration, sb: getComputedStyle(document.documentElement).scrollBehavior }));
  log(info.reveal === 0 && info.sb === 'auto', 'reduced motion: no reveal animation, no smooth scroll', JSON.stringify(info));
  await ctx.close(); }

// Staging safety + disclosure
{ const ctx = await browser.newContext(); const page = await ctx.newPage(); await page.goto(BASE + '/index.html');
  log(await page.locator('meta[name=robots]').getAttribute('content') === 'noindex, nofollow', 'staging noindex meta present');
  const txt = await page.locator('body').innerText();
  log(/Real estate brokerage services provided through Epique Realty/.test(txt), 'brokerage attribution visible in body copy');
  log(!/LLC|guarantee(d)? (approval|sales)/i.test(txt.replace(/No guarantee of buyer demand[^.]*\./, '')), 'no LLC claim / no guarantee claims');
  await ctx.close(); }
log(external.size === 0, 'no third-party network requests (no trackers, no CDN)', [...external].join(' '));

await browser.close();
const failed = results.filter(r => !r).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
