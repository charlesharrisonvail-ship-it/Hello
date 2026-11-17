/* Eva, the Harrison Development AI assistant (Charles, 2026-11-17).
   Eva answers ONLY with wording already published on this site. Questions are
   matched to those answers here in the visitor's browser: nothing is sent to a
   server and nothing is stored. Anything she can't answer goes to the project
   form. Never add a price, promise, result, client or timeline she can't
   point to on the page. Eva's face is from the AiRE Estate sample video. */
(function () {
  'use strict';
  if (window.__evaChat) return;
  window.__evaChat = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each answer: words that point to it, the text (site wording), and an optional link on this page.
  var A = [
    { id: 'about-hd', k: 'what do you do|who are you|harrison development|services|offer|help with|do for|overview',
      t: 'We help developers, builders and landowners position and launch projects, then carry the sales through to closing. That means market research, project branding and launch materials, AI-assisted marketing content, inquiry follow-up, and licensed real estate sales representation.',
      link: ['#services', 'See the five services'] },
    { id: 'research', k: 'research|feasibility|comps|comparable|market study|buyer profile|pricing|appraisal|demand study',
      t: 'Market & Feasibility Insight: comparable sales, competitive research, buyer profiles, and pricing recommendations to inform your project’s market strategy. This is market-side research, not an appraisal, engineering, financial feasibility or entitlement service. You get comparable-property research, a competitive overview, buyer profiles and a written positioning brief, with pricing recommendations within licensed scope.',
      link: ['#services', 'Services'] },
    { id: 'launch', k: 'brand|branding|name|identity|website|brochure|presentation|launch|positioning|logo',
      t: 'Project Positioning & Launch: a cohesive project identity, website, presentation materials, and launch plan built around the property and its intended buyers. You get a project name and identity, a project website, a brochure or presentation, and a launch calendar.',
      link: ['#services', 'Services'] },
    { id: 'ai', k: '\\bai\\b|artificial|rendering|renderings|video|reel|creative|content|images|imagery|who checks',
      t: 'AI helps with production and analysis, such as visual concepts, copy drafts and inquiry patterns. Charles reviews every output. Conceptual or AI-generated imagery is labeled, and never implies that unapproved features are real or approved. With AI-Assisted Creative you get reviewed renderings and visual concepts, short videos and reels, and campaign copy, each labeled where AI is used.',
      link: ['#services', 'Services'] },
    { id: 'pipeline', k: 'lead|leads|inquir|follow up|follow-up|crm|report|reporting|pipeline|appointment|qualif',
      t: 'Buyer Pipeline & Reporting: inquiry capture, organized follow-up, qualification, appointments, and useful feedback to the development team. You get inquiry capture, an organized follow-up plan, appointment setting, buyer feedback and a regular report to the development team.',
      link: ['#services', 'Services'] },
    { id: 'sales', k: 'sell|sales|selling|list|listing|showing|negotiat|contract|closing|broker|realtor|agent|licensed',
      t: 'New-Development Sales: showings, negotiations, contracts and closing coordination through Epique Realty. The marketing scope is documented separately from brokerage services, and brokerage services and any compensation are covered only by a brokerage agreement through the brokerage.',
      link: ['#services', 'Services'] },
    { id: 'cost', k: 'cost|price|fee|fees|charge|commission|how much|rate|rates|pay|budget|compensation',
      t: 'Terms are discussed in a consultation. Brokerage services and any compensation are covered only by a brokerage agreement through the brokerage, and the marketing scope is documented separately. An initial conversation carries no obligation.',
      link: ['#contact', 'Request a project consultation'] },
    { id: 'guarantee', k: 'guarantee|promise|results|how fast|sell out|sellout|return|roi|sales pace|demand',
      t: 'No. We do not promise sales pace, pricing or returns. We aim to give your project a clear story, a defined buyer and consistent follow-up.' },
    { id: 'where', k: 'where|area|areas|market|markets|colorado|town|towns|vail|beaver creek|avon|edwards|eagle|gypsum|minturn|summit|breckenridge|frisco|keystone|dillon|silverthorne|aspen|snowmass|basalt|carbondale|glenwood|steamboat|winter park|granby|fraser|crested butte|gunnison|telluride|ouray|durango|denver|boulder|fort collins|colorado springs|state',
      t: 'Charles is licensed to represent clients throughout the state of Colorado. The focus is the mountain communities: the Vail Valley and Eagle County, Summit County, the Roaring Fork Valley, Steamboat and the northern mountains, Gunnison and the San Juans, plus the Front Range and Denver metro.',
      link: ['#markets', 'See the markets'] },
    { id: 'land', k: 'land|landowner|own land|acre|acres|lot|parcel|ranch|not decided|undecided',
      t: 'Yes, let’s talk. An initial conversation about your goals, the market context and possible next steps carries no obligation.',
      link: ['#contact', 'Start a project conversation'] },
    { id: 'process', k: 'process|how does it work|how it works|steps|approach|start|begin|first step|timeline|what happens',
      t: 'How a project moves from first call to closing: 1. Understand the project: goals, site, status, timeline and existing team. 2. Shape the strategy: research, buyer needs, positioning and sales approach. 3. Launch and follow through: approved marketing, inquiry handling, showings and brokerage services. 4. Review and refine, using qualified inquiry and buyer feedback.',
      link: ['#approach', 'See the approach'] },
    { id: 'charles', k: 'charles|harrison|who runs|owner|ceo|background|experience|about you|team',
      t: 'Charles Harrison, Owner, CEO, is an AI real estate industry leader who teaches AI to real estate professionals. A licensed agent with a landscape architecture background, he brings Colorado mountain-market knowledge and AI-assisted marketing to a project, and stays with it through negotiation and closing. He is based in the Vail Valley and handles the relationship and the sales work himself.',
      link: ['#about', 'About Charles'] },
    { id: 'contact', k: 'contact|call|phone|email|reach|talk|speak|meet|meeting|consult|consultation|schedule|book|appointment',
      t: 'Send the project form with a few details and the times that suit you, and Charles will reply personally to confirm a time. You can also call 970-904-0600 or email charlesharrison@epique.me.',
      link: ['#contact', 'Request a project consultation'] },
    { id: 'send', k: 'send before|what should i send|documents|financials|prepare|bring',
      t: 'A short description of the project is plenty. Please do not send confidential financial information or sensitive documents. We will tell you what we need once we have spoken.',
      link: ['#contact', 'Project form'] },
    { id: 'work', k: 'example|examples|portfolio|past work|projects|case study|concept|concepts|study|studies|red mountain|dowd',
      t: 'The site shows two real concept studies, Red Mountain Ranch and Dowd Junction, built by Charles under the EpiVail name from public information to show how we think about a launch. They are independent studies, not client work.',
      link: ['#concepts', 'See the concept studies'] }
  ];
  var FALLBACK = { t: 'I can only answer from what’s on this site, and I don’t want to guess. The quickest way is a short note through the project form. Charles will reply personally.', link: ['#contact', 'Start a project conversation'] };
  var CHIPS = ['What do you do?', 'Where do you work?', 'How does it start?', 'What does it cost?'];

  // Clearly off-topic questions get the honest fallback rather than a near miss.
  var OFF = /\b(weather|snow|ski|skiing|mortgage|loan|interest rate|job|jobs|hiring|restaurant|hotel|rent an?|vacation rental|lift ticket)\b/;
  function pick(q) {
    if (OFF.test(q.toLowerCase())) return FALLBACK;
    q = ' ' + q.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    var best = null, score = 0;
    A.forEach(function (a) {
      var s = 0;
      a.k.split('|').forEach(function (w) {
        var re = w.indexOf('\\b') !== -1 ? new RegExp(w) : null;
        if (re ? re.test(q) : q.indexOf(w.length < 5 ? ' ' + w : w) !== -1) s += w.length > 6 ? 2 : 1;
      });
      if (s > score) { score = s; best = a; }
    });
    return best || FALLBACK;
  }

  var css = '' +
    '#eva-btn{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:72;width:60px;height:60px;padding:0;border-radius:50%;border:2px solid #DFFF1A;background:#0E1114;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.5);transition:opacity .3s,translate .3s cubic-bezier(.23,1,.32,1);-webkit-tap-highlight-color:transparent;touch-action:manipulation}' +
    '#eva-btn img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}' +
    '#eva-btn .ai{position:absolute;right:-4px;bottom:-4px;padding:2px 5px;border-radius:999px;background:#DFFF1A;color:#14181C;border:2px solid #0E1114;font:800 10px/1 Inter,system-ui,sans-serif;letter-spacing:.04em}' +
    '#eva-btn:active{transform:scale(.96)}' +
    '#eva-btn:focus-visible,#eva button:focus-visible,#eva input:focus-visible,#eva a:focus-visible{outline:3px solid #DFFF1A;outline-offset:3px}' +
    '#eva-btn.away{opacity:0;translate:0 10px;pointer-events:none}' +
    'body:has(#navToggle[aria-expanded="true"]) #eva-btn{opacity:0;pointer-events:none}' +
    '#eva{position:fixed;right:16px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:73;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100vh - 120px));display:none;flex-direction:column;background:#14181C;border:1px solid rgba(238,241,243,.16);border-radius:16px;box-shadow:0 30px 70px rgba(0,0,0,.6);overflow:hidden;font:400 15px/1.5 Inter,system-ui,sans-serif;color:#EEF1F3;transform-origin:bottom right}' +
    '#eva.open{display:flex}' +
    '#eva .hd{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px;border-bottom:1px solid rgba(238,241,243,.1)}' +
    '#eva .hd img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #DFFF1A}' +
    '#eva .hd strong{display:block;font:500 16px/1.2 "Space Grotesk",Inter,system-ui,sans-serif;color:#fff}' +
    '#eva .hd small{color:#A9B1B7;font-size:12px}' +
    '#eva .x{margin-left:auto;background:none;border:0;color:#A9B1B7;font-size:24px;line-height:1;cursor:pointer;padding:6px 10px;border-radius:8px}' +
    '#eva .log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}' +
    '#eva .m{padding:10px 13px;border-radius:13px;background:#1A2026;max-width:92%}' +
    '#eva .m.u{align-self:flex-end;background:rgba(223,255,26,.14);color:#fff}' +
    '#eva .m a{display:inline-block;margin-top:8px;font-weight:600;color:#DFFF1A}' +
    '#eva .chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}' +
    '#eva .chips button{background:transparent;border:1px solid rgba(238,241,243,.2);color:#EEF1F3;border-radius:999px;padding:8px 12px;font:500 13px/1 Inter,system-ui,sans-serif;cursor:pointer}' +
    '#eva form{display:flex;gap:8px;padding:10px 14px 6px;border-top:1px solid rgba(238,241,243,.1)}' +
    '#eva input{flex:1;min-width:0;background:#0E1114;border:1px solid rgba(238,241,243,.2);color:#fff;border-radius:10px;padding:11px 12px;font:16px/1.2 Inter,system-ui,sans-serif}' +
    '#eva .send{background:#DFFF1A;color:#14181C;border:0;border-radius:10px;padding:0 16px;font:700 14px/1 Inter,system-ui,sans-serif;cursor:pointer}' +
    '#eva .note{margin:0;padding:4px 14px 12px;font-size:11.5px;color:#A9B1B7}' +
    '@media (prefers-reduced-motion:no-preference){#eva.open{animation:eva-in .28s cubic-bezier(.23,1,.32,1)}@keyframes eva-in{from{opacity:0;transform:translateY(8px) scale(.97)}}}' +
    'html.motion-paused #eva.open{animation:none}' +
    '@media (max-width:899px){#eva-btn{width:52px;height:52px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px))}#eva{right:8px;left:8px;width:auto;bottom:calc(76px + env(safe-area-inset-bottom,0px));height:calc(100dvh - 150px)}}' +
    '@media (hover:none){#eva .chips button:hover{background:transparent}}';

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    document.head.appendChild(el('style', {}, css));
    var face = 'assets/media/eva-avatar.jpg';
    var btn = el('button', { id: 'eva-btn', type: 'button', 'aria-label': 'Ask Eva, our AI assistant', 'aria-expanded': 'false', 'aria-controls': 'eva' },
      '<img src="' + face + '" alt="" width="60" height="60" decoding="async"><span class="ai" aria-hidden="true">AI</span>');
    var panel = el('section', { id: 'eva', role: 'dialog', 'aria-label': 'Eva, AI assistant' },
      '<div class="hd"><img src="' + face + '" alt="" width="40" height="40"><div><strong>Eva</strong><small>AI assistant &middot; Harrison Development</small></div><button class="x" type="button" aria-label="Close">&times;</button></div>' +
      '<div class="log" aria-live="polite"></div>' +
      '<div class="chips"></div>' +
      '<form autocomplete="off"><label for="eva-q" class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Your question</label><input id="eva-q" type="text" maxlength="200" placeholder="Ask about services, markets, getting started"><button class="send" type="submit">Ask</button></form>' +
      '<p class="note">Eva is an AI assistant. She answers only from this site and does not store what you type.</p>');
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    var log = panel.querySelector('.log'), input = panel.querySelector('input'), chipBox = panel.querySelector('.chips');
    CHIPS.forEach(function (c) { var b = el('button', { type: 'button' }); b.textContent = c; chipBox.appendChild(b); });

    function say(text, user, link) {
      var m = el('div', { 'class': 'm' + (user ? ' u' : '') });
      m.textContent = text;
      if (link) { var a = el('a', { href: link[0] }); a.textContent = link[1] + ' →'; m.appendChild(document.createElement('br')); m.appendChild(a); }
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    }
    var greeted = false;
    function open() {
      panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); place();
      if (!greeted) { greeted = true; say('Hi, I’m Eva, an AI assistant for Harrison Development. I can tell you about our services, the markets we cover, and how a project gets started.'); }
      input.focus({ preventScroll: true });
    }
    function close(focusBtn) { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); if (focusBtn !== false) btn.focus({ preventScroll: true }); place(); }
    function ask(q) {
      q = (q || '').trim(); if (!q) return;
      say(q, true); input.value = '';
      var a = pick(q);
      setTimeout(function () { say(a.t, false, a.link); }, reduce ? 0 : 250);
    }
    btn.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
    panel.querySelector('.x').addEventListener('click', function () { close(); });
    panel.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    chipBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ask(b.textContent); });
    // A link in an answer closes the panel so the page can scroll to it.
    log.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
    btn.querySelector('img').addEventListener('error', function () { btn.innerHTML = '<span style="font:700 15px Inter,sans-serif;color:#DFFF1A">Eva</span>'; });

    // Phones: like the Pause control, Eva waits until the visitor is past the opening screen.
    var hero = document.getElementById('hero');
    var phone = window.matchMedia ? window.matchMedia('(max-width: 899px)') : { matches: false };
    function place() {
      var away = phone.matches && hero && window.scrollY < hero.offsetHeight * 0.6 && !panel.classList.contains('open');
      btn.classList.toggle('away', !!away);
    }
    window.addEventListener('scroll', place, { passive: true });
    if (phone.addEventListener) phone.addEventListener('change', place);
    place();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
