/* AiRE chat launcher: a small AiRE button on public pages that opens the
   course assistant. Answers come from the AiRE Worker, which only returns
   approved course information. No keys or codes live in this file. */
(function () {
  'use strict';
  var WORKER_URL = 'https://aire-course-assistant.charlesharrisonvail.workers.dev';
  if (window.__aireChat) return;
  window.__aireChat = true;

  var css = '' +
    '#aire-chat-btn{position:fixed;right:18px;bottom:18px;z-index:90;width:60px;height:60px;border-radius:50%;border:1px solid rgba(56,189,248,.45);background:#080e18;box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 4px rgba(56,189,248,.12);cursor:pointer;display:grid;place-items:center;padding:0;opacity:0;transform:translateY(12px) scale(.9);transition:opacity .5s,transform .5s}' +
    '#aire-chat-btn.in{opacity:1;transform:none}' +
    '#aire-chat-btn:hover{box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 6px rgba(56,189,248,.22)}' +
    '#aire-chat-btn:focus-visible,#aire-chat button:focus-visible,#aire-chat input:focus-visible{outline:3px solid #7dd3fc;outline-offset:3px}' +
    '#aire-chat-tip{position:fixed;right:88px;bottom:28px;z-index:90;max-width:230px;background:#0d1524;color:#dbe2ec;border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:10px 32px 10px 14px;font:500 14px/1.4 Manrope,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;transform:translateX(8px);transition:opacity .4s,transform .4s;pointer-events:none}' +
    '#aire-chat-tip.in{opacity:1;transform:none;pointer-events:auto}' +
    '#aire-chat-tip b{color:#7dd3fc}' +
    '#aire-chat-tip button{position:absolute;top:4px;right:6px;background:none;border:0;color:#8496b2;font-size:18px;cursor:pointer;line-height:1;padding:4px}' +
    '#aire-chat{position:fixed;right:18px;bottom:88px;z-index:91;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100vh - 120px));display:none;flex-direction:column;background:#080e18;border:1px solid rgba(255,255,255,.18);border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.55);overflow:hidden;font:400 15px/1.5 Manrope,system-ui,sans-serif;color:#dbe2ec}' +
    '#aire-chat.open{display:flex}' +
    '#aire-chat .hd{display:flex;align-items:center;gap:10px;padding:14px 14px 12px;border-bottom:1px solid rgba(255,255,255,.09)}' +
    '#aire-chat .hd strong{display:block;color:#fff;font:700 15px/1.2 Archivo,system-ui,sans-serif}' +
    '#aire-chat .hd small{color:#8496b2;font-size:12px}' +
    '#aire-chat .hd .x{margin-left:auto;background:none;border:0;color:#8496b2;font-size:22px;cursor:pointer;padding:4px 8px}' +
    '#aire-chat .log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}' +
    '#aire-chat .m{padding:10px 13px;border-radius:13px;background:#111b2c;max-width:92%;white-space:pre-wrap;overflow-wrap:anywhere}' +
    '#aire-chat .m.u{align-self:flex-end;background:rgba(56,189,248,.18);color:#fff}' +
    '#aire-chat .m a{display:block;margin-top:6px;font-size:12px;color:#7dd3fc}' +
    '#aire-chat .chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}' +
    '#aire-chat .chips button{background:transparent;border:1px solid rgba(255,255,255,.18);color:#dbe2ec;border-radius:999px;padding:6px 11px;font:500 12px/1 Manrope,system-ui,sans-serif;cursor:pointer}' +
    '#aire-chat form{display:flex;gap:8px;padding:10px 14px 6px;border-top:1px solid rgba(255,255,255,.09)}' +
    '#aire-chat input{flex:1;min-width:0;background:#04070d;border:1px solid rgba(255,255,255,.18);color:#fff;border-radius:10px;padding:10px 12px;font:inherit}' +
    '#aire-chat .send{background:#38bdf8;color:#04070d;border:0;border-radius:10px;padding:0 14px;font:700 14px/1 Archivo,system-ui,sans-serif;cursor:pointer}' +
    '#aire-chat button:disabled{opacity:.5;cursor:wait}' +
    '#aire-chat .note{margin:0;padding:4px 14px 12px;font-size:11px;color:#5a6a85}' +
    '#aire-chat .note a{color:#8496b2}' +
    '@media (max-width:480px){#aire-chat{right:8px;left:8px;width:auto;bottom:84px;height:calc(100vh - 110px)}#aire-chat-tip{right:84px;max-width:170px}}' +
    '@media (prefers-reduced-motion:reduce){#aire-chat-btn,#aire-chat-tip{transition:none}}';

  var mark = '<svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">' +
    '<path d="M13 9.5A13 13 0 1 0 27 9.5" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="20" cy="22" r="5" fill="#38bdf8"/></svg>';

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function store(key, val) {
    try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; }
  }

  function init() {
    var style = el('style', {}, css);
    document.head.appendChild(style);

    var btn = el('button', { id: 'aire-chat-btn', type: 'button', 'aria-label': 'Ask AiRE, our AI assistant', 'aria-expanded': 'false', 'aria-controls': 'aire-chat' }, mark);
    var tip = el('div', { id: 'aire-chat-tip', role: 'status' }, 'Questions about the courses? <b>Ask AiRE.</b><button type="button" aria-label="Dismiss">&times;</button>');
    var panel = el('section', { id: 'aire-chat', role: 'dialog', 'aria-label': 'AiRE course assistant' },
      '<div class="hd">' + mark + '<div><strong>AiRE</strong><small>AI assistant &middot; course questions</small></div><button class="x" type="button" aria-label="Close">&times;</button></div>' +
      '<div class="log" role="log" aria-live="polite"></div>' +
      '<div class="chips"><button type="button">What do the courses cost?</button><button type="button">Which course should I choose?</button><button type="button">Where is my access code?</button></div>' +
      '<form><label for="aire-q" style="position:absolute;left:-9999px">Your question</label><input id="aire-q" maxlength="600" autocomplete="off" placeholder="Ask about the courses&hellip;"><button class="send" type="submit">Ask</button></form>' +
      '<p class="note">AI answers from approved course info only. Don&rsquo;t type access codes, payment or client details. <a href="/privacy.html">Privacy</a> &middot; <a href="mailto:hello@aireestate.com">hello@aireestate.com</a></p>');
    document.body.appendChild(tip);
    document.body.appendChild(panel);
    document.body.appendChild(btn);

    var log = panel.querySelector('.log');
    var input = panel.querySelector('input');
    var send = panel.querySelector('.send');
    var chips = panel.querySelectorAll('.chips button');
    var greeted = false, busy = false;

    function say(text, user, source) {
      var m = el('div', { class: 'm' + (user ? ' u' : '') });
      m.textContent = text;
      if (source) {
        try {
          var u = new URL(source);
          if (u.origin === 'https://learn.aireestate.com') {
            var a = el('a', { href: u.href }); a.textContent = 'Read more on the site';
            m.appendChild(a);
          }
        } catch (e) {}
      }
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    }
    function open() {
      hideTip(true);
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      if (!greeted) { greeted = true; say('Hi, I’m AiRE, an AI assistant. Ask me about the courses, prices, or getting access.'); }
      input.focus();
    }
    function close() {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
    function hideTip(forGood) {
      tip.classList.remove('in');
      if (forGood) store('aireTipSeen', '1');
    }
    function setBusy(b) {
      busy = b; send.disabled = b;
      for (var i = 0; i < chips.length; i++) chips[i].disabled = b;
    }
    function ask(q) {
      q = (q || '').trim();
      if (!q || busy) return;
      say(q, true);
      input.value = '';
      setBusy(true);
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
      fetch(WORKER_URL + '/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }), credentials: 'omit', signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d || typeof d.answer !== 'string') throw new Error('bad');
        say(d.answer, false, d.source);
      }).catch(function () {
        say('AiRE is unavailable right now. Please email hello@aireestate.com.');
      }).then(function () { clearTimeout(timer); setBusy(false); input.focus(); });
    }

    btn.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
    panel.querySelector('.x').addEventListener('click', close);
    panel.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    for (var i = 0; i < chips.length; i++) chips[i].addEventListener('click', function () { ask(this.textContent); });
    tip.querySelector('button').addEventListener('click', function (e) { e.stopPropagation(); hideTip(true); });
    tip.addEventListener('click', open);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
    // Any link marked data-ask-aire opens the assistant here instead of leaving the page.
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-ask-aire]') : null;
      if (!t) return;
      e.preventDefault();
      btn.classList.add('in');
      open();
    });

    // The button eases in shortly after the page opens.
    setTimeout(function () { btn.classList.add('in'); }, 900);

    // Once per visit, a small greeting appears after the reader scrolls a bit.
    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0 || window.scrollY / max < 0.25) return;
      window.removeEventListener('scroll', onScroll);
      if (store('aireTipSeen') || panel.classList.contains('open')) return;
      tip.classList.add('in');
      setTimeout(function () { hideTip(false); }, 12000);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
