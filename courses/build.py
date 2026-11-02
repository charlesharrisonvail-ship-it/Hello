#!/usr/bin/env python3
"""Build draft previews of the two new AiRE Estate Academy courses.

    python3 courses/build.py            build courses/preview/ and the quiz JSON files
    python3 courses/build.py --check    validate manuscripts and quizzes only

Reads the Markdown manuscripts in courses/<slug>/modules/ and writes:
  courses/<slug>/quiz.json                 49 questions per course, from section 9 of each module
  courses/preview/<slug>.html              draft landing page (no prices, no checkout)
  courses/preview/<slug>-course.html       draft course reader with quizzes and capstone record
  courses/preview/catalog-cards.html       the two catalog cards, for review before release
  courses/preview/<slug>/resources/...     downloadable resources

Nothing here is published: GitHub Pages serves only docs/. The previews borrow the
look of docs/lead-to-keys.html (its <style> block and footer) and docs/modern.css.
"""
import html, json, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DOCS = ROOT.parent / "docs"
OUT = ROOT / "preview"

COURSES = [
    {
        "slug": "build-your-ai-assistant",
        "title": "Build Your AI Assistant",
        "buy": "https://buy.stripe.com/bJecN470I9B3fPxcSo2kw02",
        "sub": "Give AI your voice, your workflow, and a job to do.",
        "card": "Create a reusable AI assistant that follows your voice, uses your approved information, and helps with everyday real estate work.",
        "audience": "Agents who can use a basic AI chat but keep repeating instructions and getting generic answers.",
        "outcome": "One reusable, tested assistant for a defined real estate task, built on your own brand instructions and approved reference material. The course project is a weekly seller-update assistant.",
        "prereq": [
            "Basic computer skills and a Claude account (Projects work on free accounts; the Claude Code route needs a paid Claude plan).",
            "For the Claude Code route: AiRE's free install guide, <a href=\"/install-claude-code.html\">Install Claude Code</a>.",
            "Parts One and Two are not required.",
        ],
        "deliverables": ["Assistant Job Card", "Brand and Voice Profile", "Approved Knowledge Pack and source register",
                         "Configured assistant plus portable instructions", "Reusable /seller-update skill (Claude Code route)",
                         "Ten-case Test Log", "Assistant Operating Guide"],
        "software": "Claude is a separate service from Anthropic with its own plans and prices; Projects are available on free accounts, and Claude Code needs a paid plan. Course tuition does not include any software. Prices are set by Anthropic and change.",
        "chat_route": "A chat-only route (Claude Projects) is included. It can't read your folders, save draft files or send anything: you paste facts in and copy the draft out.",
        "honest": [
            ("It drafts. It doesn't send.", "Nothing in this course runs unattended, sends email, posts or updates your CRM. You start it, it drafts, you review, you send."),
            ("One job, not your whole business", "You build one assistant for one task and test it properly. The same pattern works for the next job, and the course shows how, but it doesn't pretend those are already built."),
            ("Tests reduce risk; they don't remove it", "You'll run ten realistic failure cases, including a seller's email that tries to slip in an unverified claim. No instruction set is a security guarantee, so you still read every draft."),
        ],
    },
    {
        "slug": "your-ai-video-spokesperson",
        "title": "Your AI Video Spokesperson",
        "sub": "Build a consistent on-camera presence with AI.",
        "card": "Create a consistent AI spokesperson and produce three short videos with clear scripts, captions, and your brand.",
        "audience": "Agents who want repeatable talking-avatar videos for educational and marketing content.",
        "outcome": "Three finished short videos, using your own authorized likeness and voice or a properly licensed fictional spokesperson. Presented by Eva Vail, AiRE Estate Academy's AI presenter.",
        "prereq": [
            "A HeyGen account (the course's primary talking-avatar workflow; it has a free tier, and plans and limits are set by HeyGen).",
            "Your own footage and consent, or a licensed fictional character and voice.",
            "A chosen publishing destination (e.g., Facebook, Instagram).",
            "Parts One and Two are not required.",
        ],
        "deliverables": ["Spokesperson Brief and Rights Checklist", "Visual Style Sheet", "Voice and Pronunciation Sheet",
                         "Approved Script Pack (three scripts)", "Three captioned 9:16 videos", "Reusable production kit and ten-topic calendar"],
        "software": "HeyGen is a separate service with its own plans, credits and limits. Optional B-roll tools are never required. Course tuition does not include any software, and render costs depend on your plan.",
        "chat_route": "",
        "honest": [
            ("Your likeness, or a licensed character. No one else.", "You never clone a colleague, a client or a public figure, and the course gives you no rights to copy AiRE Estate Academy's presenters or voices. Providers require the person's own consent video."),
            ("Every video says it's AI", "An on-screen \"Made with AI\" label and a plain caption line, on every video. Your brokerage's advertising rules still apply."),
            ("No guaranteed views or leads", "The course teaches a repeatable, honest process and basic measurement. It doesn't promise performance, because nobody can."),
        ],
    },
]

# ---------------------------------------------------------------- Markdown -----

def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2" rel="noopener" target="_blank">\1</a>', s)
    s = re.sub(r"(?<![\"'>/])(https://[A-Za-z0-9./_\-#%?=&]+[A-Za-z0-9/_\-#])", r'<a href="\1" rel="noopener" target="_blank">\1</a>', s)
    return s


def md(text):
    """Small Markdown subset: headings, paragraphs, lists, task lists, tables, quotes, code."""
    raw, lines, fence = text.split("\n"), [], False
    for ln in raw:  # a list item wrapped onto an indented next line belongs to that item
        if ln.startswith("```"): fence = not fence
        if (not fence and lines and re.match(r"^ {2,}\S", ln) and not re.match(r"^\s*([-*]|\d+\.) ", ln)
                and re.match(r"^\s*([-*]|\d+\.) ", lines[-1])):
            lines[-1] += " " + ln.strip(); continue
        lines.append(ln)
    out, i = [], 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith("```"):
            j = i + 1
            while j < len(lines) and not lines[j].startswith("```"):
                j += 1
            code = html.escape("\n".join(lines[i + 1:j]))
            out.append(f'<div class="codebox"><button type="button" class="copy">Copy</button><pre><code>{code}</code></pre></div>')
            i = j + 1
            continue
        m = re.match(r"^(#{1,4}) (.*)", ln)
        if m:
            n = len(m.group(1))
            out.append(f"<h{n + 1}>{inline(m.group(2))}</h{n + 1}>")
            i += 1
            continue
        if ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            head, body = rows[0], [r for r in rows[1:] if not all(re.fullmatch(r":?-+:?", c) for c in r)]
            t = "<div class=\"tw\"><table><thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>"
            t += "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
            out.append(t + "</tbody></table></div>")
            continue
        if ln.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i][1:].strip())
                i += 1
            paras = "\n".join(buf).split("\n\n")
            out.append("<blockquote>" + "".join(f"<p>{'<br>'.join(inline(x) for x in p.splitlines() if x)}</p>" for p in paras if p.strip()) + "</blockquote>")
            continue
        if re.match(r"^\s*([-*]|\d+\.) ", ln):
            ordered = bool(re.match(r"^\s*\d+\. ", ln))
            items = []
            while i < len(lines) and (re.match(r"^\s*([-*]|\d+\.) ", lines[i]) or (lines[i].startswith("   ") and items)):
                if re.match(r"^\s*([-*]|\d+\.) ", lines[i]):
                    items.append(re.sub(r"^\s*([-*]|\d+\.) ", "", lines[i]))
                else:
                    items[-1] += " " + lines[i].strip()
                i += 1
            lis = []
            for it in items:
                cm = re.match(r"\[( |x)\] (.*)", it)
                if cm:
                    lis.append(f'<li class="task"><label><input type="checkbox"{" checked" if cm.group(1) == "x" else ""}> {inline(cm.group(2))}</label></li>')
                else:
                    lis.append(f"<li>{inline(it)}</li>")
            tag = "ol" if ordered else "ul"
            out.append(f"<{tag}>{''.join(lis)}</{tag}>")
            continue
        if ln.strip() in ("", "---"):
            i += 1
            continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||>|```|\s*([-*]|\d+\.) )", lines[i]) and lines[i].strip() != "---":
            buf.append(lines[i])
            i += 1
        out.append(f"<p>{inline(' '.join(b.strip() for b in buf))}</p>")
    return "\n".join(out)

# ----------------------------------------------------------------- Parsing -----

def parse_module(path):
    text = path.read_text()
    title = re.match(r"# (.+)", text).group(1).strip()
    body, _, quiz = text.partition("## 9. Module check")
    if not _:
        body, _, quiz = text.partition("## 9. Check")
        quiz = ""
    qs = []
    for block in re.split(r"\n### Q\d+\. ", "\n" + quiz)[1:]:
        q_lines = block.strip().split("\n")
        question = q_lines[0].strip()
        opts = [re.sub(r"^- [A-D]\) ", "", l).strip() for l in q_lines if re.match(r"^- [A-D]\) ", l)]
        am = re.search(r"\*\*Answer:\*\* ([A-D]) — (.+)", block)
        if not am or len(opts) != 4:
            raise SystemExit(f"{path.name}: malformed question: {question[:60]}")
        qs.append({"q": question, "options": opts, "answer": "ABCD".index(am.group(1)), "why": am.group(2).strip()})
    return {"file": path.name, "title": title, "body": body, "questions": qs, "capstone": "capstone" in path.name}


def load(course):
    mods = [parse_module(p) for p in sorted((ROOT / course["slug"] / "modules").glob("*.md"))]
    return mods


def check():
    ok = True
    for c in COURSES:
        mods = load(c)
        graded = [m for m in mods if not m["capstone"]]
        n = sum(len(m["questions"]) for m in graded)
        print(f"{c['slug']}: {len(graded)} modules + {len(mods) - len(graded)} capstone, {n} questions")
        for m in graded:
            if len(m["questions"]) != 7:
                print(f"  ! {m['file']} has {len(m['questions'])} questions"); ok = False
            for part in ["## 1.", "## 2.", "## 3.", "## 4.", "## 5.", "## 6.", "## 7.", "## 8."]:
                if part not in m["body"]:
                    print(f"  ! {m['file']} missing section {part}"); ok = False
        if n != 49:
            ok = False
    print("CHECK:", "PASS" if ok else "FAIL")
    return ok

# ------------------------------------------------------------------ Pages -----

def template_parts():
    src = (DOCS / "lead-to-keys.html").read_text()
    style = re.search(r"<style>.*?</style>", src, re.S).group(0)
    lock = re.search(r'<span class="lock">.*?</span></span>', src, re.S).group(0)
    footer = re.search(r"<footer>.*?</footer>", src, re.S).group(0)
    footer = footer.replace('href="terms.html"', 'href="/terms.html"').replace('href="privacy.html"', 'href="/privacy.html"') \
                   .replace('href="install-claude-code.html"', 'href="/install-claude-code.html"').replace('href="guides/"', 'href="/guides/"')
    return style, lock, footer

EXTRA_CSS = """
<style>
.draftbar{position:sticky;top:0;z-index:200;background:#fbbf24;color:#04070d;font:700 13px/1.4 Manrope,system-ui,sans-serif;text-align:center;padding:8px 16px}
.nav{top:37px}
.pricecard .pr{font-size:clamp(1.6rem,3vw,2.2rem)}
.pricecard .btn[aria-disabled=true]{opacity:.5;pointer-events:none}
.reader{display:grid;grid-template-columns:260px minmax(0,1fr);gap:40px;max-width:1180px;margin:0 auto;padding:120px 24px 80px}
.reader>*{min-width:0}
.reader nav.toc{max-width:100%;position:sticky;top:110px;align-self:start;display:flex;flex-direction:column;gap:6px;font:500 14px/1.35 Manrope,system-ui,sans-serif}
.reader nav.toc a{color:var(--slate,#8496b2);text-decoration:none;padding:8px 12px;border-radius:10px;border:1px solid transparent}
.reader nav.toc a.on,.reader nav.toc a:hover{color:#fff;border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.04)}
.reader nav.toc a .st{float:right;font-size:12px}
.lesson h2{font-size:clamp(1.6rem,3vw,2.2rem);margin:0 0 18px}
.lesson h3{margin:40px 0 12px;font-size:1.25rem;color:#fff}
.lesson h4,.lesson h5{margin:24px 0 8px;color:#fff}
.lesson p,.lesson li{line-height:1.65}
.lesson blockquote{border-left:3px solid #38bdf8;margin:16px 0;padding:4px 18px;background:rgba(56,189,248,.06);border-radius:0 12px 12px 0}
.lesson .tw{overflow-x:auto;margin:16px 0}
.lesson table{border-collapse:collapse;width:100%;font-size:.92rem}
.lesson th,.lesson td{border:1px solid rgba(255,255,255,.12);padding:8px 10px;text-align:left;vertical-align:top}
.lesson th{background:rgba(255,255,255,.05);color:#fff}
.lesson code{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:.88em;background:rgba(255,255,255,.07);padding:1px 5px;border-radius:5px}
.codebox{position:relative;margin:16px 0}
.codebox pre{background:#0d1524;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:16px;overflow-x:auto;white-space:pre-wrap}
.codebox pre code{background:none;padding:0}
.codebox .copy{position:absolute;top:8px;right:8px;background:#38bdf8;color:#04070d;border:0;border-radius:999px;padding:5px 12px;font:700 12px Manrope,sans-serif;cursor:pointer}
.task{list-style:none;margin-left:-1.2em}
.quiz{margin-top:48px;padding:28px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(13,21,36,.6)}
.quiz fieldset{border:0;margin:0 0 22px;padding:0}
.quiz legend{font-weight:700;color:#fff;margin-bottom:10px;line-height:1.45}
.quiz label{display:block;padding:9px 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;margin:6px 0;cursor:pointer}
.quiz label.right{border-color:#34d399;background:rgba(52,211,153,.1)}
.quiz label.wrong{border-color:#f87171;background:rgba(248,113,113,.1)}
.quiz .why{display:none;margin:6px 0 0;color:#cbd5e1;font-size:.92rem}
.quiz.done .why{display:block}
.quiz .res{font-weight:700;margin:12px 0}
.downloads li a{color:#7dd3fc}
.status{font:600 13px Manrope,sans-serif;color:#8496b2}
.certbox{margin-top:40px;padding:28px;border-radius:18px;border:1px dashed rgba(251,191,36,.5)}
@media (max-width:860px){.reader{grid-template-columns:1fr;padding-top:110px}.reader nav.toc{position:static;flex-direction:row;overflow-x:auto}.reader nav.toc a{white-space:nowrap}}
</style>"""


def head(title, style):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{html.escape(title)} · Draft · AiRE Estate Academy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
{style}
<link rel="stylesheet" href="/modern.css">
{EXTRA_CSS}
</head>
<body>
<div class="draftbar">DRAFT PREVIEW &middot; not published &middot; checkout not set up yet &middot; lesson videos not yet recorded</div>
"""


def nav(lock, links):
    a = "".join(f'<a href="{h}">{t}</a>' for h, t in links)
    return f'<nav class="nav" id="nav"><a class="brand" href="/">{lock}</a><div class="navlinks">{a}</div></nav>\n'


def landing(c, mods, style, lock, footer):
    graded = [m for m in mods if not m["capstone"]]
    rt_path = ROOT / c["slug"] / "production" / "video" / "runtimes.json"
    runtimes = json.loads(rt_path.read_text()) if rt_path.exists() else {}
    secs = sum(int(v.split(":")[0]) * 60 + int(v.split(":")[1]) for v in runtimes.values())
    total = (f"{round(secs / 60)} min", "Total video, measured. Every lesson also has its read-along script") if runtimes else \
            ("45&ndash;65 min", "Target video length. Actual runtimes are measured after recording")
    cards = []
    for n, m in enumerate(mods, 1):
        name = re.sub(r"^(Module \d+ — |Capstone — )", "", m["title"])
        intro = re.search(r"\*\*By the end of this module you can\*\* ([^\n]+(?:\n[^\n]+)*?)\n\n", m["body"]) or \
                re.search(r"\*\*(?:Show that your assistant does one job reliably:|Produce three finished short videos)[^\n]*", m["body"])
        blurb = intro.group(1) if intro and intro.groups() else (intro.group(0) if intro else "")
        blurb = re.sub(r"\*\*", "", blurb).replace("\n", " ")
        num, mk = ("&#10003;", "Capstone") if m["capstone"] else (f"{n:02d}", f"Module {n:02d}")
        cards.append(f'<article class="mod"><span class="bignum">{num}</span><span class="mk">{mk}</span><h3>{html.escape(name)}</h3>'
                     f'<p>{inline(blurb[:260])}</p><span class="rt">Video &middot; {runtimes.get(f"m{n}", "runtime after recording")}</span></article>')
    honest = "".join(f'<div class="rv"><span class="tn">{i:02d}</span><h3>{html.escape(h)}</h3><p>{html.escape(p)}</p></div>'
                     for i, (h, p) in enumerate(c["honest"], 1))
    prereq = "".join(f"<li>{p}</li>" for p in c["prereq"])
    deliv = "".join(f"<li>{html.escape(d)}</li>" for d in c["deliverables"])
    chat = f'<p class="sub" style="margin-top:8px">{html.escape(c["chat_route"])}</p>' if c["chat_route"] else ""
    return head(c["title"], style) + nav(lock, [("#course", "The Course"), ("#who", "Who It's For"), ("#pricing", "Pricing"), ("#honest", "Straight Talk")]) + f"""
<header class="hero" id="top" style="min-height:auto;padding-bottom:60px">
  <div class="inner"><div class="htxt">
    <p class="htag">New course &middot; Draft</p>
    <h1>{html.escape(c['title'])}.</h1>
    <p class="hsub"><b>{html.escape(c['sub'])}</b> {html.escape(c['card'])}</p>
    <div class="hcta"><a class="btn sec" href="#course">See the seven modules</a><a class="btn sec" href="{c['slug']}-course.html">Open the draft course</a></div>
  </div></div>
</header>

<section class="band gap" id="who">
  <div class="inner">
    <p class="kick rv">Who it's for</p>
    <h2 class="rv" style="font-size:clamp(1.5rem,3.2vw,2.3rem)">{html.escape(c['audience'])}</h2>
    <p class="lede rv"><b>Outcome:</b> {html.escape(c['outcome'])}</p>
    <div class="stats rv">
      <div><b>7</b><span>Short modules, plus a self-assessed Capstone</span></div>
      <div><b>{total[0]}</b><span>{total[1]}</span></div>
      <div><b>3&ndash;5 hrs</b><span>Rough practice time, to be confirmed by pilot testing</span></div>
      <div><b>{sum(len(m['questions']) for m in graded)}</b><span>Module-check questions with answers explained</span></div>
    </div>
    <h3 class="rv" style="margin-top:36px">Before you start</h3>
    <ul class="rv">{prereq}</ul>
  </div>
</section>

<section class="rail" id="course">
  <div class="railsticky"><div class="railhd"><div class="inner" style="padding:0"><p class="kick">The course</p><h2>{html.escape(c['title'])}</h2></div></div>
    <div class="track" id="track" style="overflow-x:auto">{''.join(cards)}</div>
  </div>
</section>

<section class="band" id="deliverables">
  <div class="inner">
    <p class="kick rv">What you build</p>
    <h2 class="rv">Project <em>deliverables</em></h2>
    <ul class="rv">{deliv}</ul>
  </div>
</section>

<section class="band glow" id="pricing">
  <div class="inner">
    <p class="kick rv">Pricing</p>
    <h2 class="rv">One price. <em>Yours to keep.</em></h2>
    <div class="tiers" style="grid-template-columns:minmax(0,440px);justify-content:center">
      <div class="tier feat pricecard rv">
        <span class="flag">New</span><span class="nm">{html.escape(c['title'])}</span><div class="pr">$97</div>
        <p class="sub">Sold on its own. Parts One and Two are not required.</p>
        <p class="sub" style="margin-top:8px"><b>Software is separate.</b> {html.escape(c['software'])}</p>{chat}
        <ul><li>Seven modules and a Capstone, with read-along lesson text</li><li>Templates, checklists and fictional practice data</li>
          <li>49 module-check questions with explanations</li><li>A private Certificate of Completion</li></ul>
        <a class="btn pri" aria-disabled="true" href="#pricing">Checkout not yet available</a>
      </div>
    </div>
  </div>
</section>

<section class="band flagz" id="honest">
  <div class="inner">
    <p class="kick rv">Before you buy</p>
    <h2 class="rv">Three things we'd rather <em>tell you now</em></h2>
    <div class="truth">{honest}</div>
  </div>
</section>

<section class="band">
  <div class="inner narrow">
    <p class="kick rv">Certificate and support</p>
    <h2 class="rv">What the <em>certificate</em> means</h2>
    <p class="rv">Pass each of the seven module checks (five of seven correct; wrong answers explain why, and you can retry), and record your self-assessed Capstone. Then you can print a <b>private certificate of completion</b> from AiRE Estate Academy. It is not a license, a state-approved continuing-education credit, or a designation from any real estate commission or association.</p>
    <p class="rv"><b>Support scope (draft):</b> course access and content questions by email at <a href="mailto:hello@aireestate.com">hello@aireestate.com</a>. We teach real estate use, not software: for account, billing or technical help with Claude or HeyGen, use their help centers.</p>
  </div>
</section>
""" + footer + "\n</body>\n</html>\n"


def reader(c, mods, style, lock, footer):
    toc, secs, quizzes = [], [], {}
    for n, m in enumerate(mods, 1):
        mid = f"m{n}"
        short = re.sub(r"^(Module \d+ — )", "", m["title"])
        toc.append(f'<a href="#{mid}" data-m="{mid}">{n if not m["capstone"] else "&#10003;"}. {html.escape(short)}<span class="st" id="st-{mid}"></span></a>')
        body = md(m["body"].split("\n", 1)[1])
        quiz = ""
        if m["questions"]:
            quizzes[mid] = [{"answer": q["answer"]} for q in m["questions"]]
            fs = []
            for qi, q in enumerate(m["questions"]):
                opts = "".join(f'<label><input type="radio" name="{mid}q{qi}" value="{oi}"> {"ABCD"[oi]}) {inline(o)}</label>' for oi, o in enumerate(q["options"]))
                fs.append(f'<fieldset><legend>{qi + 1}. {inline(q["q"])}</legend>{opts}<p class="why"><b>Answer {"ABCD"[q["answer"]]}.</b> {inline(q["why"])}</p></fieldset>')
            quiz = (f'<form class="quiz" data-m="{mid}"><h3>Module check</h3><p class="status">Pass: 5 of 7. Wrong answers show why. Retry as often as you like.</p>'
                    + "".join(fs) + '<p class="res" aria-live="polite"></p><button class="btn pri" type="submit">Check my answers</button> '
                    '<button class="btn sec" type="button" data-retry>Retry</button></form>')
        elif m["capstone"]:
            quiz = (f'<div class="quiz" data-cap="{c["slug"]}"><h3>Record your capstone (self-assessed)</h3>'
                    '<p class="status">No instructor reviews this. Tick only when your rubric score meets the pass mark with no critical failure.</p>'
                    '<label><input type="checkbox" id="capdone"> I scored my capstone against the rubric, met the pass mark, and had no critical failure.</label></div>')
        secs.append(f'<section class="lesson" id="{mid}"><h2>{html.escape(m["title"])}</h2>{body}{quiz}</section><hr style="border-color:rgba(255,255,255,.08);margin:56px 0">')
    res = sorted((ROOT / c["slug"] / "resources").rglob("*"))
    dl = "".join(f'<li><a href="{c["slug"]}/resources/{p.relative_to(ROOT / c["slug"] / "resources").as_posix()}" download>{p.relative_to(ROOT / c["slug"] / "resources").as_posix()}</a></li>'
                 for p in res if p.is_file())
    graded_ids = [f"m{n}" for n, m in enumerate(mods, 1) if m["questions"]]
    script = f"""<script>
(function(){{
  "use strict";
  var KEY='aire-draft-{c["slug"]}', A={json.dumps(quizzes)}, GRADED={json.dumps(graded_ids)};
  var st={{}}; try{{st=JSON.parse(localStorage.getItem(KEY))||{{}};}}catch(e){{}}
  function save(){{try{{localStorage.setItem(KEY,JSON.stringify(st));}}catch(e){{}}}}
  function paint(){{
    GRADED.forEach(function(id){{var el=document.getElementById('st-'+id); if(el) el.textContent=st[id]?'passed':'';}});
    var cap=document.getElementById('capdone'); if(cap) cap.checked=!!st.capstone;
    var all=GRADED.every(function(id){{return st[id];}}), box=document.getElementById('cert');
    var n=GRADED.filter(function(id){{return st[id];}}).length;
    box.querySelector('.status').textContent='Module checks passed: '+n+' of '+GRADED.length+'. Capstone recorded: '+(st.capstone?'yes':'no')+'.';
    box.querySelector('[data-cert]').hidden=!(all&&st.capstone);
  }}
  document.querySelectorAll('form.quiz').forEach(function(f){{
    var id=f.getAttribute('data-m');
    f.addEventListener('submit',function(e){{
      e.preventDefault(); var right=0;
      A[id].forEach(function(q,i){{
        var pick=f.querySelector('input[name="'+id+'q'+i+'"]:checked');
        f.querySelectorAll('input[name="'+id+'q'+i+'"]').forEach(function(r){{
          var l=r.parentNode; l.classList.remove('right','wrong');
          if(+r.value===q.answer) l.classList.add('right'); else if(r.checked) l.classList.add('wrong');
        }});
        if(pick&&+pick.value===q.answer) right++;
      }});
      f.classList.add('done');
      var pass=right>=5; f.querySelector('.res').textContent=right+' of 7 correct. '+(pass?'Passed.':'Not yet: read the explanations and retry.');
      if(pass){{st[id]=true; save();}} paint();
    }});
    f.querySelector('[data-retry]').addEventListener('click',function(){{
      f.reset(); f.classList.remove('done'); f.querySelector('.res').textContent='';
      f.querySelectorAll('label').forEach(function(l){{l.classList.remove('right','wrong');}});
    }});
  }});
  var cap=document.getElementById('capdone');
  if(cap) cap.addEventListener('change',function(){{st.capstone=cap.checked; save(); paint();}});
  document.querySelectorAll('.codebox .copy').forEach(function(b){{
    b.addEventListener('click',function(){{var t=b.nextElementSibling.textContent;
      (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){{b.textContent='Copied';setTimeout(function(){{b.textContent='Copy';}},1500);}},function(){{}});}});
  }});
  document.getElementById('reset').addEventListener('click',function(){{st={{}}; save(); paint();}});
  paint();
}})();
</script>"""
    return head(c["title"] + " — Course", style) + nav(lock, [(f"{c['slug']}.html", "Course page"), ("#downloads", "Downloads"), ("#cert", "Certificate")]) + f"""
<main class="reader">
  <nav class="toc" aria-label="Modules">{''.join(toc)}<a href="#downloads">Downloads</a><a href="#cert">Certificate</a></nav>
  <div>
    <p class="status">Draft course reader. Lesson videos are not recorded yet; each module shows its narration script and shot list instead. In this preview, progress is saved only in this browser.</p>
    {''.join(secs)}
    <section class="lesson" id="downloads"><h2>Downloads</h2><ul class="downloads">{dl}</ul></section>
    <section class="certbox" id="cert"><h2>Certificate of Completion</h2>
      <p class="status"></p>
      <p>Unlocks when all seven module checks are passed <b>and</b> the capstone is recorded. It is a private certificate of completion, not a CE credit or association designation.</p>
      <div data-cert hidden><p><b>All requirements met.</b> In the released course, this is where the printable certificate appears, using the existing certificate page after it has been checked for these courses.</p></div>
      <button class="btn sec" type="button" id="reset">Reset my draft progress</button>
    </section>
  </div>
</main>
""" + footer + script + "\n</body>\n</html>\n"


def catalog(style, lock, footer):
    cards = "".join(f'<div class="tier rv" style="opacity:1"><span class="flag">New &middot; Draft</span><span class="nm">{html.escape(c["title"])}</span>'
                    f'<p class="sub">{html.escape(c["card"])}</p><p class="sub"><b>$97</b> &middot; one payment</p>'
                    f'<a class="btn sec" href="{c["slug"]}.html">Course details</a></div>' for c in COURSES)
    return head("Catalog cards", style) + nav(lock, []) + f"""
<section class="band" style="padding-top:140px"><div class="inner">
<p class="kick">Catalog cards &middot; for review</p>
<h2>Two new cards for the existing course section</h2>
<p class="lede">On release, these go into the home page's course section beside Part One and Lead to Keys, which stay exactly as they are. Not added to the live site, navigation or sitemap yet.</p>
<div class="tiers" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">{cards}</div>
</div></section>
""" + footer + "\n</body>\n</html>\n"


# ------------------------------------------------------------ Release reader -----
# python3 courses/build.py --release <slug> <outdir>
# Writes <outdir>/<slug>-course.html with every lesson, quiz answer and download locked
# with the course access code (AIRE_LOCK_CODE, via tools/course-lock/lock.mjs), in the
# live pages' format. Videos are referenced as media/<prefix>-m<n>.bin (lock those with
# `lock.mjs media`). Runtimes come from <slug>/production/video/runtimes.json.
# Nothing is written to docs/; copying the result there is the release step.

RELEASE_CSS = """
<style>
.nav{top:0}
#gate{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:30px 20px}
.gbox{width:100%;max-width:470px}
.gbox h1{font-family:Archivo,sans-serif;font-weight:800;letter-spacing:-.035em;color:#fff;font-size:clamp(1.9rem,6vw,2.5rem);line-height:1.04;margin:14px 0}
.gbox .gl{color:#8496b2;line-height:1.62;margin:0 0 26px}
.gf{display:flex;flex-direction:column;gap:11px}
.gf input{width:100%;background:#0d1524;border:1px solid rgba(255,255,255,.18);border-radius:9px;padding:16px 17px;color:#fff;font:1rem 'IBM Plex Mono',monospace;letter-spacing:.07em;box-sizing:border-box}
.gf input:focus{outline:none;border-color:#38bdf8}
.gf button{background:#38bdf8;color:#03060d;border:0;border-radius:9px;padding:16px 20px;font:600 .79rem 'IBM Plex Mono',monospace;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}
.gerr{min-height:1.4em;color:#f87171;font-size:.9rem}
#app[hidden]{display:none}
.vslot{position:relative;margin:8px 0 28px;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:#04070d;aspect-ratio:16/9}
.vslot video{width:100%;height:100%;display:block;background:#000}
.vslot .play{position:absolute;inset:0;width:100%;border:0;background:radial-gradient(circle at 50% 50%,rgba(56,189,248,.18),rgba(4,7,13,.9));color:#fff;font:700 1rem Manrope,sans-serif;cursor:pointer}
.vslot .play b{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#38bdf8;color:#04070d;font-size:1.4rem;margin-bottom:10px}
.vslot .play span{display:block;color:#cbd5e1;font-weight:600}
.ailabel{font:600 12px Manrope,sans-serif;color:#8496b2;margin:-18px 0 26px}
</style>"""


def release_reader(c, mods, style, lock, footer, prefix):
    import base64, mimetypes, os, subprocess, tempfile
    rt_path = ROOT / c["slug"] / "production" / "video" / "runtimes.json"
    runtimes = json.loads(rt_path.read_text()) if rt_path.exists() else {}
    toc, secs, quizzes = [], [], {}
    for n, m in enumerate(mods, 1):
        mid = f"m{n}"
        short = re.sub(r"^(Module \d+ — |Capstone — )", "", m["title"])
        toc.append(f'<a href="#{mid}" data-m="{mid}">{n if not m["capstone"] else "&#10003;"}. {html.escape(short)}<span class="st" id="st-{mid}"></span></a>')
        raw = m["body"].split("\n", 1)[1]
        raw = re.sub(r"^\*\*Course:\*\*[^\n]*\n", "", raw.lstrip("\n"))                 # draft status line
        raw = re.sub(r"\n\*Narrator:[^\n]*\*\n", "\n", raw)                                 # production note
        raw = re.sub(r"\n## 3\. [^\n]*\n.*?(?=\n## 4\. )", "\n", raw, flags=re.S)          # shot list is production-only
        raw = re.sub(r"\n## 2\. [^\n]*\n", "\n## 2. Read along: the lesson script\n", raw, count=1)
        body = md(raw)
        rt = runtimes.get(mid, "")
        video = (f'<div class="vslot" data-v="media/{prefix}-m{n}.bin"><button class="play" type="button"><b>&#9654;</b>'
                 f'<span>Play the lesson video{" &middot; " + rt if rt else ""}</span></button></div>'
                 '<p class="ailabel">Made with AI: the presenter is an AI avatar made from his own photo and cloned voice.</p>')
        quiz = ""
        if m["questions"]:
            quizzes[mid] = [{"answer": q["answer"]} for q in m["questions"]]
            fs = []
            for qi, q in enumerate(m["questions"]):
                opts = "".join(f'<label><input type="radio" name="{mid}q{qi}" value="{oi}"> {"ABCD"[oi]}) {inline(o)}</label>' for oi, o in enumerate(q["options"]))
                fs.append(f'<fieldset><legend>{qi + 1}. {inline(q["q"])}</legend>{opts}<p class="why"><b>Answer {"ABCD"[q["answer"]]}.</b> {inline(q["why"])}</p></fieldset>')
            quiz = (f'<form class="quiz" data-m="{mid}"><h3>Module check</h3><p class="status">Pass: 5 of 7. Wrong answers show why. Retry as often as you like.</p>'
                    + "".join(fs) + '<p class="res" aria-live="polite"></p><button class="btn pri" type="submit">Check my answers</button> '
                    '<button class="btn sec" type="button" data-retry>Retry</button></form>')
        elif m["capstone"]:
            quiz = ('<div class="quiz"><h3>Record your capstone (self-assessed)</h3>'
                    '<p class="status">No instructor reviews this. Tick only when your rubric score meets the pass mark with no critical failure.</p>'
                    '<label><input type="checkbox" id="capdone"> I scored my capstone against the rubric, met the pass mark, and had no critical failure.</label></div>')
        secs.append(f'<section class="lesson" id="{mid}"><h2>{html.escape(m["title"])}</h2>{video}{body}{quiz}</section><hr style="border-color:rgba(255,255,255,.08);margin:56px 0">')
    rdir = ROOT / c["slug"] / "resources"
    dl = []
    for f in sorted(rdir.rglob("*")):
        if f.is_file():
            rel = f.relative_to(rdir).as_posix()
            mt = mimetypes.guess_type(f.name)[0] or "text/plain"
            uri = f"data:{mt};base64," + base64.b64encode(f.read_bytes()).decode()
            dl.append(f'<li><a href="{uri}" download="{html.escape(f.name)}">{html.escape(rel)}</a></li>')
    graded_ids = [f"m{n}" for n, m in enumerate(mods, 1) if m["questions"]]
    inner = ("".join(secs) + f'<section class="lesson" id="downloads"><h2>Downloads</h2><ul class="downloads">{"".join(dl)}</ul></section>'
             + '<section class="certbox" id="cert"><h2>Certificate of Completion</h2><p class="status"></p>'
               '<p>Unlocks when all seven module checks are passed <b>and</b> the capstone is recorded. It is a private certificate of completion, not a CE credit or association designation.</p>'
               '<div data-cert hidden><p><b>All requirements met.</b> Email hello@aireestate.com from the address you bought with, and your printable certificate of completion is sent back to you.</p></div>'
               '<button class="btn sec" type="button" id="reset">Reset my progress</button></section>'
             + '<script type="application/json" id="ans">' + json.dumps({"A": quizzes, "G": graded_ids}) + '</script>')
    with tempfile.TemporaryDirectory() as td:
        ip = Path(td) / "inner.html"
        ip.write_text(inner)
        out = subprocess.run(["node", str(ROOT.parent / "tools" / "course-lock" / "lock.mjs"), "text", str(ip)],
                             capture_output=True, text=True, env=os.environ)
    if out.returncode != 0 or '"ct"' not in out.stdout:
        raise SystemExit("Locking failed: set AIRE_LOCK_CODE for this command. " + out.stderr[-300:])
    payload = out.stdout.strip().splitlines()[-1]
    skey = "aire-k-" + prefix
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{html.escape(c["title"])} · Course · AiRE Estate Academy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
{style}
<link rel="stylesheet" href="/modern.css">
{EXTRA_CSS}
{RELEASE_CSS}
</head>
<body>
<div id="gate"><div class="gbox">
  <p class="kick">{html.escape(c["title"])} &middot; Course access</p>
  <h1>Enter your access code</h1>
  <p class="gl">Your code was shown on the confirmation page right after you paid. It is not case sensitive. Once you unlock, this browser remembers it. It is not the 6-digit number Stripe&rsquo;s Link may text to your phone; that one is only for paying.</p>
  <form class="gf" id="gform" autocomplete="off">
    <input id="gin" type="text" placeholder="ACCESS CODE" aria-label="Access code" autocapitalize="characters" spellcheck="false">
    <button type="submit">Unlock the course</button>
    <div class="gerr" id="gerr" role="status" aria-live="polite"></div>
  </form>
  <p class="gl"><b>Lost your code?</b> Email hello@aireestate.com from the address you bought with, and it will be sent back to you.</p>
</div></div>
<div id="app" hidden>
{nav(lock, [(f"/{c['slug']}.html", "Course page"), ("#downloads", "Downloads"), ("#cert", "Certificate"), ("#lock", "Lock")]).replace('href="#lock"', 'href="#lock" id="lockbtn"')}
<main class="reader">
  <nav class="toc" aria-label="Modules">{''.join(toc)}<a href="#downloads">Downloads</a><a href="#cert">Certificate</a></nav>
  <div><p class="status">Your progress is saved in this browser.</p><div id="content"></div></div>
</main>
{footer}
</div>
<script>
(function(){{
  "use strict";
  var PAYLOAD={payload}, PASS='', SK='{skey}', KEY='aire-{c["slug"]}';
  function b2a(b){{var s=atob(b),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u;}}
  function dk(pass,salt,use){{return crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']).then(function(b){{
    return crypto.subtle.deriveKey({{name:'PBKDF2',salt:salt,iterations:250000,hash:'SHA-256'}},b,{{name:'AES-GCM',length:256}},false,[use]);}});}}
  function decrypt(pass){{
    if(!window.crypto||!crypto.subtle) return Promise.reject(new Error('insecure'));
    return dk(pass,b2a(PAYLOAD.salt),'decrypt').then(function(k){{return crypto.subtle.decrypt({{name:'AES-GCM',iv:b2a(PAYLOAD.iv)}},k,b2a(PAYLOAD.ct));}})
      .then(function(buf){{return new TextDecoder().decode(buf);}});
  }}
  function playLocked(slot){{
    var btn=slot.querySelector('.play'); btn.querySelector('span').textContent='Loading the video…';
    fetch(slot.getAttribute('data-v')).then(function(r){{if(!r.ok)throw 0;return r.arrayBuffer();}}).then(function(ab){{
      var u=new Uint8Array(ab);
      return dk(PASS,u.slice(0,16),'decrypt').then(function(k){{return crypto.subtle.decrypt({{name:'AES-GCM',iv:u.slice(16,28)}},k,u.slice(28));}});
    }}).then(function(buf){{
      var v=document.createElement('video'); v.controls=true; v.playsInline=true;
      v.src=URL.createObjectURL(new Blob([buf],{{type:'video/mp4'}})); btn.remove(); slot.appendChild(v); v.play().catch(function(){{}});
    }}).catch(function(){{btn.querySelector('span').textContent='This video did not load. Refresh the page, or email hello@aireestate.com.';}});
  }}
  function mount(h){{
    var box=document.getElementById('content'); box.innerHTML=h;
    var J=JSON.parse(document.getElementById('ans').textContent), A=J.A, GRADED=J.G;
    var st={{}}; try{{st=JSON.parse(localStorage.getItem(KEY))||{{}};}}catch(e){{}}
    function save(){{try{{localStorage.setItem(KEY,JSON.stringify(st));}}catch(e){{}}}}
    function paint(){{
      GRADED.forEach(function(id){{var el=document.getElementById('st-'+id); if(el) el.textContent=st[id]?'passed':'';}});
      var cap=document.getElementById('capdone'); if(cap) cap.checked=!!st.capstone;
      var all=GRADED.every(function(id){{return st[id];}}), cb=document.getElementById('cert');
      var n=GRADED.filter(function(id){{return st[id];}}).length;
      cb.querySelector('.status').textContent='Module checks passed: '+n+' of '+GRADED.length+'. Capstone recorded: '+(st.capstone?'yes':'no')+'.';
      cb.querySelector('[data-cert]').hidden=!(all&&st.capstone);
    }}
    box.querySelectorAll('form.quiz').forEach(function(f){{
      var id=f.getAttribute('data-m');
      f.addEventListener('submit',function(e){{
        e.preventDefault(); var right=0;
        A[id].forEach(function(q,i){{
          var pick=f.querySelector('input[name="'+id+'q'+i+'"]:checked');
          f.querySelectorAll('input[name="'+id+'q'+i+'"]').forEach(function(r){{
            var l=r.parentNode; l.classList.remove('right','wrong');
            if(+r.value===q.answer) l.classList.add('right'); else if(r.checked) l.classList.add('wrong');
          }});
          if(pick&&+pick.value===q.answer) right++;
        }});
        f.classList.add('done');
        var pass=right>=5; f.querySelector('.res').textContent=right+' of 7 correct. '+(pass?'Passed.':'Not yet: read the explanations and retry.');
        if(pass){{st[id]=true; save();}} paint();
      }});
      f.querySelector('[data-retry]').addEventListener('click',function(){{
        f.reset(); f.classList.remove('done'); f.querySelector('.res').textContent='';
        f.querySelectorAll('label').forEach(function(l){{l.classList.remove('right','wrong');}});
      }});
    }});
    var cap=document.getElementById('capdone');
    if(cap) cap.addEventListener('change',function(){{st.capstone=cap.checked; save(); paint();}});
    box.querySelectorAll('.codebox .copy').forEach(function(b){{
      b.addEventListener('click',function(){{var t=b.nextElementSibling.textContent;
        (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){{b.textContent='Copied';setTimeout(function(){{b.textContent='Copy';}},1500);}},function(){{}});}});
    }});
    box.querySelectorAll('.vslot .play').forEach(function(b){{b.addEventListener('click',function(){{playLocked(b.parentNode);}});}});
    document.getElementById('reset').addEventListener('click',function(){{st={{}}; save(); paint();}});
    paint();
    document.getElementById('gate').style.display='none';
    document.getElementById('app').hidden=false;
    if(location.hash){{var t=document.getElementById(location.hash.slice(1)); if(t) t.scrollIntoView();}}
  }}
  var gform=document.getElementById('gform'), gin=document.getElementById('gin'), gerr=document.getElementById('gerr');
  function attempt(code,quiet){{
    gerr.textContent=''; var btn=gform.querySelector('button'); btn.textContent='Unlocking…';
    var pass=String(code||'').trim().toUpperCase();
    return decrypt(pass).then(function(h){{
      PASS=pass; try{{localStorage.setItem(SK,pass);}}catch(e){{}} mount(h);
    }}).catch(function(err){{
      btn.textContent='Unlock the course';
      if(err&&err.message==='insecure') gerr.textContent='This page must be opened over https to unlock.';
      else if(!quiet){{gerr.textContent='That code did not work. Check your purchase confirmation, or email hello@aireestate.com.'; gin.select();}}
    }});
  }}
  gform.addEventListener('submit',function(e){{e.preventDefault(); attempt(gin.value,false);}});
  document.getElementById('lockbtn').addEventListener('click',function(e){{e.preventDefault(); try{{localStorage.removeItem(SK);}}catch(x){{}} location.href=location.pathname;}});
  var q=(location.search.match(/[?&]k=([^&]+)/)||[])[1], rem=null;
  try{{rem=localStorage.getItem(SK);}}catch(e){{}}
  var auto=q?decodeURIComponent(q):rem;
  if(auto){{attempt(auto,true).then(function(){{if(q&&history.replaceState)history.replaceState(null,'',location.pathname+location.hash);}});}} else gin.focus();
}})();
</script>
</body>
</html>
"""
    return page


def build():
    if not check():
        raise SystemExit("Fix the manuscripts first.")
    style, lock, footer = template_parts()
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for c in COURSES:
        mods = load(c)
        quiz = [{"module": m["title"], "questions": m["questions"]} for m in mods if m["questions"]]
        (ROOT / c["slug"] / "quiz.json").write_text(json.dumps(quiz, indent=1, ensure_ascii=False) + "\n")
        (OUT / f"{c['slug']}.html").write_text(landing(c, mods, style, lock, footer))
        (OUT / f"{c['slug']}-course.html").write_text(reader(c, mods, style, lock, footer))
        shutil.copytree(ROOT / c["slug"] / "resources", OUT / c["slug"] / "resources")
    (OUT / "catalog-cards.html").write_text(catalog(style, lock, footer))
    for f in ["modern.css"]:
        shutil.copy(DOCS / f, OUT / f)
    print("Built", OUT)


if __name__ == "__main__":
    if "--release" in sys.argv:
        k = sys.argv.index("--release"); slug, outdir = sys.argv[k + 1], Path(sys.argv[k + 2])
        c = next(x for x in COURSES if x["slug"] == slug)
        prefix = {"build-your-ai-assistant": "bya", "your-ai-video-spokesperson": "yavs"}[slug]
        style, lock, footer = template_parts()
        outdir.mkdir(parents=True, exist_ok=True)
        (outdir / f"{slug}-course.html").write_text(release_reader(c, load(c), style, lock, footer, prefix))
        print("Built", outdir / f"{slug}-course.html")
        if c.get("buy"):  # the sales page, with the real Stripe link and no draft markings
            page = landing(c, load(c), style, lock, footer)
            for a, b in [(" · Draft · ", " · "), ('<meta name="robots" content="noindex,nofollow">\n', ""),
                         ("New course &middot; Draft", "New course"), ("Support scope (draft):", "Support scope:"),
                         ('<a class="btn pri" aria-disabled="true" href="#pricing">Checkout not yet available</a>',
                          f'<a class="btn pri" href="{c["buy"]}">Buy the course &middot; $97</a>'),
                         (".nav{top:37px}", ".nav{top:0}"),
                         ("Open the draft course</a>", "Students: open the course</a>"),
                         ('<a class="btn sec" href="#course">See the seven modules</a>',
                          f'<a class="btn pri" href="{c["buy"]}">Buy the course &middot; $97</a><a class="btn sec" href="#course">See the seven modules</a>'),
                         ("Seven modules and a Capstone, with read-along lesson text",
                          "Seven video lessons and a Capstone (37 minutes), with read-along lesson text")]:
                assert a in page, a
                page = page.replace(a, b)
            page = re.sub(r'<div class="draftbar">.*?</div>\n', "", page)
            (outdir / f"{slug}.html").write_text(page)
            print("Built", outdir / f"{slug}.html")
    elif "--check" in sys.argv:
        check()
    else:
        build()
