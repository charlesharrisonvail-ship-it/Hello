# Module 2 on-screen beats: one per narration paragraph, in order (see beats_m1.py).
# Facts come from resources/seller-update-practice-data.md (Property B) and agent-voice-profile.md.
BEATS = [
 ("Module 2", """<h1 class="r" data-at="0.05">Teach It <em>Your Voice</em></h1>
  <div class="chip r" data-at="0.4">AI avatar &middot; made from his own photo and cloned voice</div>"""),
 ("A test you can run now", """<div class="chat"><div class="msg a r" data-at="0.15">I hope this message finds you well!</div>
   <div class="msg a r" data-at="0.4">I wanted to take a moment to provide you with an update.</div></div>
  <h2 class="r" data-at="0.75">It sounds like <em>everyone.</em></h2>"""),
 ("Why AI sounds generic", """<h2 class="r" data-at="0.1">No instructions &rarr; the <em>average</em> voice.</h2>
  <p class="lede r" data-at="0.55">This module replaces the guess with a profile.</p>"""),
 ("Brand File + Voice Profile", """<div class="row"><div class="card r" data-at="0.15"><b>Agent Brand File</b><span>Who you are &middot; who you serve</span></div>
  <div class="card hi r" data-at="0.4"><b>+ Voice Profile</b><span>How you actually write: sentences, greeting, sign-off, phrases</span></div></div>"""),
 ("The profile", """<ol class="steps"><li class="r" data-at="0.1">Reader</li><li class="r" data-at="0.25">Tone</li><li class="r" data-at="0.4">Sentence style</li><li class="r" data-at="0.55">Phrases: use / never</li><li class="r" data-at="0.7">Rules that beat voice</li><li class="r" data-at="0.85">Samples</li></ol>"""),
 ("1 &middot; Your reader", """<div class="quote r" data-at="0.15">&ldquo;Busy sellers, mostly 40&ndash;70, reading on a phone between other things.&rdquo;</div>
  <p class="lede r" data-at="0.6">Lead with what happened. Short paragraphs. No throat-clearing.</p>"""),
 ("2 &middot; Tone in three words", """<div class="row"><div class="pill r" data-at="0.1">Calm</div><div class="pill r" data-at="0.18">Direct</div><div class="pill r" data-at="0.26">Warm</div></div>
  <p class="lede r" data-at="0.6">&ldquo;Friendly&rdquo; means something different to everyone. Be specific.</p>"""),
 ("3 &middot; Sentence style", """<ul class="checks"><li class="r" data-at="0.1">Short sentences?</li><li class="r" data-at="0.2">Contractions?</li><li class="r" data-at="0.3">Bullets or paragraphs?</li><li class="r" data-at="0.45">Your real greeting: &ldquo;Hi Dana and Luis,&rdquo;</li><li class="r" data-at="0.65">Your real sign-off</li></ul>"""),
 ("4 &middot; Phrases", """<div class="cols"><div><h3 class="r" data-at="0.05">Use</h3><ul class="checks"><li class="r" data-at="0.1">Here's your week</li><li class="r" data-at="0.15">Talk soon</li></ul></div>
  <div><h3 class="r" data-at="0.2">Never</h3><ul class="miss"><li class="r" data-at="0.3">&ldquo;Hot market&rdquo;</li><li class="r" data-at="0.38">&ldquo;Won't last&rdquo;</li><li class="r" data-at="0.46">&ldquo;Act now&rdquo;</li><li class="r" data-at="0.6">&ldquo;Guaranteed&rdquo; / &ldquo;Will sell&rdquo;</li></ul></div></div>"""),
 ("5 &middot; Rules that beat voice", """<ol class="steps sm"><li class="r" data-at="0.15">Facts come only from the supplied sources</li><li class="r" data-at="0.3">Missing facts stay missing</li><li class="r" data-at="0.45">No protected-class, school or &ldquo;neighborhood type&rdquo; language</li><li class="r" data-at="0.6">No promises about price, timing or results</li></ol>
  <div class="tag r" data-at="0.8">THE RULES WIN</div>"""),
 ("Why it matters", """<div class="quote r" data-at="0.15">Profile: &ldquo;warm and reassuring.&rdquo; Seller: worried. Facts: thin.</div>
  <div class="quote no r" data-at="0.5">&ldquo;Buyers are really responding to your home!&rdquo;</div>
  <div class="bad r" data-at="0.75">Nobody said that. The voice made it up.</div>"""),
 ("6 &middot; Your samples", """<div class="quote r" data-at="0.15">Hi [SELLER], here's your week at [ADDRESS]. [N] showings&hellip;</div>
  <ul class="checks"><li class="r" data-at="0.4">Three short messages you wrote</li><li class="r" data-at="0.55">Names, addresses, phones, prices replaced</li><li class="r" data-at="0.75">Style only &mdash; never facts</li></ul>"""),
 ("Same update, twice", """<div class="card wide r" data-at="0.15"><b>77 Copper Bend Road &middot; fictional</b><span>Seller Margaret &middot; week three felt quiet &middot; her sister says switch agents</span></div>"""),
 ("Generic", """<div class="quote no r" data-at="0.1">&ldquo;I hope this message finds you well&hellip; a productive week&hellip; rest assured we are doing everything we can.&rdquo;</div>
  <h2 class="r" data-at="0.65">Nice words. <em>No information.</em></h2>"""),
 ("Profiled", """<div class="phone r" data-at="0.06"><div class="from">Your agent &middot; Friday</div><div class="bub">Hi Margaret, three showings this week. Online views were 410, down from 655. Two agents gave feedback: buyers liked the updates; some mentioned road noise. One may write something &mdash; no written offer yet.</div></div>
  <p class="lede r" data-at="0.7">Calm because it's specific. Then: next steps and an offer to talk.</p>"""),
 ("Your exercise", """<ol class="steps sm"><li class="r" data-at="0.1">Fill in the Voice Profile</li><li class="r" data-at="0.25">Add three sanitized samples</li><li class="r" data-at="0.4">Ask Claude for a voice guide (prompt in the lesson)</li><li class="r" data-at="0.55">Edit it &mdash; you're the authority</li><li class="r" data-at="0.7">Before-and-after test on Property B</li></ol>"""),
 ("Next", """<h2 class="r" data-at="0.1">Module 3 &middot; <em>Reliable Reference Material</em></h2>
  <p class="lede r" data-at="0.4">And what to do when a fact isn't there.</p>"""),
]
