// Functional + layout checks for the Harrison Development preview.
// Run:  python3 -m http.server 8765 --directory harrison-development &  node harrison-development/tests/check.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765';
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
const results = []; const log = (ok, name, extra = '') => { results.push(ok); console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); };
const NOANIM = '.rv,.hero-in,.wi,.hero-logo,.hero-glow,.map .state,.map .town,.progress,.study-art .draw,.study-art .blocks rect,.ticker-track,.ticker,.tile .media,.backdrop img{animation:none!important}.rv-js{opacity:1!important;translate:none!important}.study-art .draw{stroke-dashoffset:0!important}';

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
  await page.goto(BASE + '/index.html'); await page.waitForTimeout(1800); // let entrance animations finish
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    h1: document.querySelectorAll('h1').length,
    clipped: [...document.querySelectorAll('h1,h2,h3,p,a,button,label,li,summary')].filter(e => !e.closest('.hp') && !e.closest('[hidden]') && !e.classList.contains('skip') && e.offsetParent !== null).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1); }).length,
    minBody: Math.min(...[...document.querySelectorAll('p,li,dd,summary')].filter(e => e.offsetParent).map(e => parseFloat(getComputedStyle(e).fontSize))),
    ctaVisible: (() => { const r = document.querySelector('.hero .btn-light').getBoundingClientRect(); return r.bottom <= window.innerHeight; })()
  }));
  log(m.sw <= m.iw, `${w}px no horizontal overflow`, `scrollWidth ${m.sw}`);
  log(m.clipped === 0, `${w}px no clipped elements`, `${m.clipped}`);
  log(m.h1 === 1, `${w}px exactly one H1`);
  log(m.minBody >= 14, `${w}px smallest text >= 14px`, `min ${m.minBody}px`);
  if (w <= 390) log(m.ctaVisible, `${w}px primary CTA visible without scrolling (hero)`);
  await page.screenshot({ path: `${SHOTS}home-${w}-top.png` });
  await page.addStyleTag({ content: NOANIM });
  await page.waitForTimeout(300);
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

// Keyboard order + visible focus + scrollspy + motion wiring (desktop)
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(BASE + '/index.html'); await page.waitForTimeout(1500);
  await page.keyboard.press('Tab');
  log(await page.evaluate(() => document.activeElement.className) === 'skip', 'first Tab stop is skip link');
  let focusOK = true, n = 0;
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); n++;
    const o = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; });
    if (!o) focusOK = false; }
  log(focusOK, `visible focus ring on ${n} consecutive tab stops`);
  const bad = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(a => a.getAttribute('href').length > 1 && !document.querySelector(a.getAttribute('href'))).map(a => a.getAttribute('href')));
  log(bad.length === 0, 'all in-page links resolve', bad.join(','));
  // native scroll-driven animations wired up (Chromium supports them)
  const anim = await page.evaluate(() => ({ rv: getComputedStyle(document.querySelector('.rv')).animationName, tl: getComputedStyle(document.querySelector('.progress')).animationName, hero: getComputedStyle(document.querySelector('.hero-in')).animationName, words: document.querySelectorAll('#hero-title .wi').length }));
  log(anim.rv.includes('rv-in') && anim.tl === 'grow-progress', 'scroll-driven reveal and progress bar are active', JSON.stringify(anim));
  log(anim.words >= 8, 'hero headline split into animated words', String(anim.words));
  // scrolling brings a reveal element to full opacity and moves the scroll progress bar
  await page.evaluate(() => document.querySelector('#services').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(500);
  const op = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.services li')).opacity));
  log(op > 0.95, 'reveal elements are fully visible once scrolled into view', String(op));
  const prog = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.progress')).transform).a);
  log(prog > 0.05 && prog < 1, 'scroll progress bar grows with scrolling', String(prog.toFixed(2)));
  await page.evaluate(() => document.querySelector('#markets').scrollIntoView({ behavior: 'instant', block: 'center' })); await page.waitForTimeout(400);
  log(await page.locator('.site-nav a[href="#markets"]').getAttribute('aria-current') === 'true', 'scrollspy marks the Markets link when its section is in view');
  await ctx.close(); }

// Concept studies, markets, FAQ, booking, download
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(BASE + '/index.html'); await page.addStyleTag({ content: NOANIM });
  const txt = await page.locator('body').innerText();
  log(/Not client work/.test(txt) && /not engaged by, affiliated with, or endorsed by/i.test(txt) && /EpiVail/.test(txt), 'concept studies carry a prominent not-client-work disclaimer and name EpiVail');
  log(!/Griffin|Tres Birds|Corum|Beaver Capital/i.test(txt), 'no third-party developer or architect names on the page');
  log(!/Rocky Mountain region/.test(txt) && /Colorado statewide/.test(txt), 'service area is Colorado statewide (no other-state claim)');
  await page.locator('#concepts').scrollIntoViewIfNeeded();
  log(await page.locator('[role=tab]').count() === 0 && await page.locator('#study-dowd').isVisible() && await page.locator('#study-rmr').isVisible(), 'both concept studies are on the homepage together, with no tabs');
  const sb = await page.evaluate(() => [...document.querySelectorAll('.scroll-box')].map(e => ({ tab: e.tabIndex, role: e.getAttribute('role'), label: !!e.getAttribute('aria-label'), scrolls: e.scrollHeight > e.clientHeight + 100 })));
  log(sb.length === 2 && sb.every(x => x.tab === 0 && x.role === 'region' && x.label), 'previews are keyboard-focusable regions with labels', JSON.stringify(sb));
  await page.locator('.browser-scroll img').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
  log((await page.evaluate(() => [...document.querySelectorAll('.scroll-box')].every(e => e.scrollHeight > e.clientHeight + 100))), 'the Dowd page and Red Mountain mobile previews scroll inside their frames');
  const reel = await page.evaluate(() => { const v = document.getElementById('rmrReel'); return { controls: v.controls, preload: v.preload, poster: !!v.poster, auto: v.autoplay }; });
  log(reel.controls && reel.preload === 'none' && reel.poster && !reel.auto, 'reel has controls and a poster, is lazy and does not autoplay', JSON.stringify(reel));
  log(/Jeffrey Beall, CC BY 4\.0/.test(await page.locator('#concepts').innerText()), 'photo credit (CC BY 4.0) is shown beside the studies');
  await page.locator('#concepts').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
  await page.screenshot({ path: SHOTS + 'concepts-1440.png' });
  await page.locator('#study-rmr').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
  await page.screenshot({ path: SHOTS + 'concepts-rmr-1440.png' });
  await page.locator('#markets').scrollIntoViewIfNeeded();
  const b = page.locator('.region-btn[data-region="vail"]'); await b.click();
  log(await b.getAttribute('aria-pressed') === 'true' && await page.locator('.map .town[data-region="vail"].active').count() === 1, 'region button marks that region on the map');
  await page.screenshot({ path: SHOTS + 'markets-1440.png' });
  await b.click();
  log(await b.getAttribute('aria-pressed') === 'false' && await page.locator('.map .town.active').count() === 0, 'clicking the region again clears it');
  const sum = page.locator('#faq summary').first(); await sum.click();
  log(await page.locator('#faq details').first().evaluate(e => e.open), 'FAQ item opens');
  await page.locator('#faq').scrollIntoViewIfNeeded(); await page.screenshot({ path: SHOTS + 'faq-1440.png' });
  // booking: default honest state
  log(/not set up yet/i.test(await page.locator('#bookingText').innerText()) && await page.locator('#bookBtn').isHidden(), 'no Epique booking link: booking says scheduling is not set up and shows no button');
  const r = await page.request.get(BASE + '/assets/downloads/launch-readiness-checklist.pdf');
  log(r.status() === 200 && /pdf/.test(r.headers()['content-type'] || ''), 'checklist PDF downloads', r.headers()['content-type']);
  await ctx.close(); }
{ // portrait: shown when configured, hidden (no placeholder) when not
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.addInitScript(() => { let c; Object.defineProperty(window, 'HD_CONFIG', { configurable: true, set(v) { c = Object.assign(v, { portrait: { src: '', alt: '' } }); }, get() { return c; } }); });
  await page.goto(BASE + '/index.html');
  log(await page.locator('#portrait').isHidden(), 'no portrait shown when no photo is configured (no placeholder)');
  await ctx.close();
  const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const p2 = await c2.newPage();
  await p2.addInitScript(() => { let c; Object.defineProperty(window, 'HD_CONFIG', { configurable: true, set(v) { c = Object.assign(v, { portrait: { src: 'assets/brand/og-image.png', alt: 'Portrait of Charles Harrison' } }); }, get() { return c; } }); });
  await p2.goto(BASE + '/index.html'); await p2.addStyleTag({ content: NOANIM });
  await p2.waitForTimeout(500);
  const ok = await p2.evaluate(() => { const i = document.getElementById('portraitImg'); return i && i.complete && i.naturalWidth > 600; });
  log(await p2.locator('#portrait').isVisible() && ok && await p2.locator('#portraitImg').getAttribute('alt') === 'Portrait of Charles Harrison', 'configured portrait loads and has alt text');
  
  await c2.close(); }
{ // with no booking URL, the site says so honestly and shows no button
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.addInitScript(() => { let c; Object.defineProperty(window, 'HD_CONFIG', { configurable: true, set(v) { c = Object.assign(v, { bookingUrl: '' }); }, get() { return c; } }); });
  await page.goto(BASE + '/index.html');
  log(/not set up yet/i.test(await page.locator('#bookingText').innerText()) && await page.locator('#bookBtn').isHidden(), 'no booking URL: site says scheduling is not set up and shows no button (no invented link)');
  await ctx.close(); }
{ // configured booking URL and hidden concepts are honored
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.addInitScript(() => { let c; Object.defineProperty(window, 'HD_CONFIG', { configurable: true, set(v) { c = Object.assign(v, { bookingUrl: 'https://booking.example.test/hd', showConcepts: false }); }, get() { return c; } }); });
  await page.goto(BASE + '/index.html');
  const a = page.locator('#bookBtn');
  log(await a.isVisible() && await a.getAttribute('href') === 'https://booking.example.test/hd' && await a.getAttribute('rel') === 'noopener' && await a.getAttribute('target') === '_blank', 'booking button appears only when bookingUrl is configured');
  log(await page.locator('#concepts').isHidden() && await page.locator('[data-concepts-nav]').isHidden(), 'showConcepts:false hides the section and its nav link');
  await ctx.close(); }

// Cinematic layer: hero film, ticker, gallery, backdrops, pause control
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(BASE + '/index.html'); await page.waitForTimeout(1200);
  const hp = await page.evaluate(() => { const i = document.querySelector('.hero-photo img'); return { loaded: i.complete && i.naturalWidth > 1000, anim: getComputedStyle(i).animationName, hidden: document.querySelector('.hero-photo').getAttribute('aria-hidden'), credit: /Jeffrey Beall, CC BY 4\.0/.test(document.querySelector('.hero-credit').textContent), noFilm: !document.querySelector('.film, video.hero-bg') }; });
  log(hp.loaded && hp.anim === 'kenburns' && hp.hidden === 'true' && hp.credit && hp.noFilm, 'hero is a real, credited river photo with a slow Ken Burns drift; the AI mountain film is gone', JSON.stringify(hp));
  log(await page.locator('.ticker').getAttribute('aria-hidden') === 'true' && (await page.evaluate(() => getComputedStyle(document.querySelector('.ticker-track')).animationName)).split(',')[0].trim() === 'tick', 'word ticker is animated and decorative');
  const tiles = await page.evaluate(() => [...document.querySelectorAll('.bento .tile')].map(t => ({ credit: !!t.querySelector('.tile-credit') && t.querySelector('.tile-credit').textContent.length > 5, alt: t.querySelector('img') ? !!t.querySelector('img').alt : !!t.querySelector('video').getAttribute('aria-label') })));
  log(tiles.length === 6 && tiles.every(x => x.credit && x.alt), 'places gallery has 6 tiles, each credited and described', JSON.stringify(tiles.length));
  const offscreen = await page.evaluate(() => [...document.querySelectorAll('.bento video source')].every(s => !s.getAttribute('src')));
  log(offscreen, 'gallery footage does not download until scrolled into view');
  const btn = page.locator('#motionToggle');
  log(await btn.isVisible() && await btn.getAttribute('aria-pressed') === 'false', 'a visible Pause motion control is offered');
  await btn.click(); await page.waitForTimeout(200);
  const pausedState = await page.evaluate(() => ({ cls: document.documentElement.classList.contains('motion-paused'), ps: getComputedStyle(document.querySelector('.ticker-track')).animationPlayState, vids: [...document.querySelectorAll('video[data-bg]')].every(v => v.paused) }));
  log(pausedState.cls && pausedState.ps.split(',').every(x => x.trim() === 'paused') && pausedState.vids && await btn.getAttribute('aria-pressed') === 'true', 'Pause motion stops the ticker and every background video', JSON.stringify(pausedState));
  await btn.click();
  log(/Jeffrey Beall, CC BY 4\.0/.test(await page.locator('.site-footer').innerText()) && /USGS, public domain/.test(await page.locator('.site-footer').innerText()), 'footer credits the photographer and USGS');
  await ctx.close();
  const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p2 = await c2.newPage();
  await p2.goto(BASE + '/index.html'); await p2.waitForTimeout(800);
  await p2.locator('#places').scrollIntoViewIfNeeded(); await p2.waitForTimeout(800);
  const rm = await p2.evaluate(() => ({ vids: [...document.querySelectorAll('video[data-bg]')].every(v => v.paused), tick: getComputedStyle(document.querySelector('.ticker-track')).animationName, toggle: document.getElementById('motionToggle').hidden }));
  log(rm.vids && rm.tick === 'none' && rm.toggle, 'reduced motion: no footage plays and the ticker stands still', JSON.stringify(rm));
  await c2.close(); }

// Nothing on the site may send visitors to Epique or EpiVail (Charles, 2026-11-09)
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  for (const pg of ['/index.html', '/privacy.html']) {
    await page.goto(BASE + pg); await page.waitForTimeout(400);
    const bad = await page.evaluate(() => {
      const urls = [...document.querySelectorAll('[href],[src],[data-src],[action],[poster]')].flatMap(e => ['href','src','data-src','action','poster'].map(a => e.getAttribute(a)).filter(Boolean));
      const cfg = window.HD_CONFIG ? JSON.stringify(Object.fromEntries(Object.entries(window.HD_CONFIG).filter(([k]) => k !== 'contact'))) : '';
      return urls.filter(u => !/^mailto:/i.test(u) && /epique|epivail/i.test(u)).concat(/https?:\/\/[^"]*(epique|epivail)/i.test(cfg) ? ['config: ' + cfg.match(/https?:\/\/[^"]*(epique|epivail)[^"]*/i)[0]] : []);
    });
    log(bad.length === 0, `${pg}: no link or setting points to an Epique or EpiVail website`, bad.join(' '));
  }
  await ctx.close(); }

// Form behaviour
async function formPage(viewport, cfgPatch) {
  const ctx = await browser.newContext({ viewport }); const page = await ctx.newPage();
  if (cfgPatch) await page.addInitScript(p => { window.__patch = p; Object.defineProperty(window, 'HD_CONFIG', { configurable: true, set(v) { this._c = Object.assign(v, window.__patch); }, get() { return this._c; } }); }, cfgPatch);
  await page.goto(BASE + '/index.html'); await page.addStyleTag({ content: NOANIM }); return { ctx, page };
}
async function fillValid(page) {
  await page.fill('#f-name', 'Test Person'); await page.fill('#f-email', 'test@example.com');
  await page.selectOption('#f-role', 'Developer'); await page.fill('#f-location', 'Gypsum, CO');
  await page.selectOption('#f-stage', 'Planning or entitlement'); await page.fill('#f-desc', 'Test description of a small project.');
}
{ // live site with no form service: the form opens the visitor's own email app, and says so
  const { ctx, page } = await formPage({ width: 390, height: 900 });
  const st = await page.locator('#formState').textContent();
  log(/your own email app opens/i.test(st) && !/PREVIEW/.test(st), 'live form says plainly that it opens your email app', st);
  await fillValid(page); await page.click('#submitBtn'); await page.waitForTimeout(300);
  const r = await page.locator('#formResult').innerText();
  log(/email app should open/i.test(r) && !/thank you|received|was sent/i.test(r), 'live submit hands off to email and never claims delivery');
  await ctx.close(); }
{ const { ctx, page } = await formPage({ width: 390, height: 900 }, { previewBanner: true });
  const state = await page.locator('#formState').textContent();
  log(/PREVIEW ONLY/.test(state), 'form labelled preview-only when no endpoint');
  await page.click('#submitBtn');
  log(await page.locator('#errorSummary').isVisible() && await page.evaluate(() => document.activeElement.id) === 'errorSummary', 'empty submit shows error summary and moves focus to it');
  log(await page.locator('#f-name').getAttribute('aria-invalid') === 'true', 'invalid fields flagged with aria-invalid');
  const labelled = await page.evaluate(() => [...document.querySelectorAll('#contactForm input:not([name=website]),#contactForm select,#contactForm textarea')].every(e => document.querySelector(`label[for="${e.id}"]`)));
  log(labelled, 'every form control has a programmatic label');
  await page.screenshot({ path: SHOTS + 'form-errors-390.png', fullPage: false });
  await fillValid(page); await page.selectOption('#f-connect', 'Video call'); await page.fill('#f-times', 'Weekday mornings'); await page.click('#submitBtn');
  const rr = await page.locator('#formResult').innerText();
  log(/Preview only\. Nothing was sent/.test(rr) && !/thank you|received/i.test(rr), 'valid submit in preview mode shows NO success message');
  const href = decodeURIComponent(await page.locator('#formResult a').getAttribute('href'));
  log(href.startsWith('mailto:') && /Video call/.test(href) && /Weekday mornings/.test(href), 'mailto fallback labelled, opens email app, carries the new fields');
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
  await page.goto(BASE + '/index.html'); await page.waitForTimeout(300);
  const info = await page.evaluate(() => ({
    rvjs: document.querySelectorAll('.rv-js').length, sb: getComputedStyle(document.documentElement).scrollBehavior,
    heroAnim: getComputedStyle(document.querySelector('.hero-in')).animationName, wordAnim: getComputedStyle(document.querySelector('#hero-title .wi')).animationName,
    rvAnim: getComputedStyle(document.querySelector('.rv')).animationName, logoAnim: getComputedStyle(document.querySelector('.hero-logo')).animationName, photoAnim: getComputedStyle(document.querySelector('.hero-photo img')).animationName,
    progress: getComputedStyle(document.querySelector('.progress')).display, op: getComputedStyle(document.querySelector('.services li')).opacity }));
  log(info.rvjs === 0 && info.sb === 'auto' && info.heroAnim === 'none' && info.wordAnim === 'none' && info.rvAnim === 'none' && info.logoAnim === 'none' && info.photoAnim === 'none' && info.progress === 'none' && info.op === '1', 'reduced motion: every animation off, content fully visible', JSON.stringify(info));
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
