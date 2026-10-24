# Module 3 on-screen beats: one per narration paragraph, in order (see beats_m1.py).
# Facts come from resources/seller-update-practice-data.md and approved-source-register.csv.
BEATS = [
 ("Module 3", """<h1 class="r" data-at="0.05">Give It Reliable <em>Reference Material</em></h1>
  <div class="chip r" data-at="0.4">AI avatar &middot; made from his own photo and cloned voice</div>"""),
 ("Garbage in", """<div class="row wrap"><div class="pill r" data-at="0.15">fact-sheet-v1</div><div class="pill r" data-at="0.2">fact-sheet-v2</div><div class="pill r" data-at="0.25">fact-sheet-FINAL</div><div class="pill no r" data-at="0.35">HOA statement, last year</div><div class="pill no r" data-at="0.45">Seller's wishful email</div></div>
  <div class="bad r" data-at="0.8">Its best will include the wrong number.</div>"""),
 ("This module", """<h2 class="r" data-at="0.1">Decide what your assistant is <em>allowed to know.</em></h2>"""),
 ("Two piles", """<div class="row"><div class="card r" data-at="0.2"><b>Permanent guidance</b></div><div class="card r" data-at="0.45"><b>Changing facts</b></div></div>"""),
 ("Pile 1 &middot; Permanent guidance", """<ul class="checks"><li class="r" data-at="0.15">Voice Profile</li><li class="r" data-at="0.3">Brokerage name and disclosure lines</li><li class="r" data-at="0.45">Standard next-step language</li></ul>
  <p class="lede r" data-at="0.7">Changes rarely &mdash; on purpose.</p>"""),
 ("Pile 2 &middot; Changing facts", """<div class="row wrap"><div class="pill r" data-at="0.1">List price</div><div class="pill r" data-at="0.18">Showing counts</div><div class="pill r" data-at="0.26">HOA fees</div><div class="pill r" data-at="0.34">Feedback</div></div>
  <p class="lede r" data-at="0.6">Every one has a date and a source.</p>"""),
 ("They fail differently", """<div class="cols"><div class="card r" data-at="0.2"><b>Guidance</b><span>fails by being ignored</span></div><div class="card r" data-at="0.4"><b>Facts</b><span>fail by being stale</span></div></div>"""),
 ("The source register", """<ol class="steps sm"><li class="r" data-at="0.15">What it is</li><li class="r" data-at="0.25">Where it came from</li><li class="r" data-at="0.35">Date of the information</li><li class="r" data-at="0.45">Permission to use it</li><li class="r" data-at="0.55">Status: approved &middot; stale &middot; missing</li></ol>"""),
 ("Date", """<div class="card wide r" data-at="0.15"><b>9 Heron Point Ct, 3B &middot; fictional</b><span>HOA statement dated January 2025 &middot; $412/month</span></div>
  <div class="tag r" data-at="0.7">STALE &middot; CONFIRM</div>"""),
 ("Provenance", """<div class="quote r" data-at="0.2">&ldquo;The seller said around forty a month.&rdquo;</div>
  <p class="lede r" data-at="0.55">Useful to you. <em>Not a source</em> for a published fact.</p>"""),
 ("Permission", """<ul class="checks"><li class="r" data-at="0.15">Seller authorized marketing the property</li></ul>
  <ul class="miss"><li class="r" data-at="0.4">Everything in the seller's email</li><li class="r" data-at="0.6">A buyer's phone number from a showing note</li></ul>"""),
 ("Status", """<div class="card wide r" data-at="0.15"><b>Special assessment &middot; Heron Point</b><span>Buyer's agent asked. HOA hasn't answered.</span></div>
  <div class="tag r" data-at="0.55">MISSING</div><p class="lede r" data-at="0.75">The question exists. The answer doesn't.</p>"""),
 ("What that buys you", """<div class="quote ok r" data-at="0.25">&ldquo;We're confirming the HOA fee with the association and will share it once we have it in writing.&rdquo;</div>
  <div class="quote r" data-at="0.6">Checklist &middot; MISSING: HOA fee (seller's estimate is not a source)</div>"""),
 ("Without the register", """<div class="quote no r" data-at="0.15">&ldquo;The HOA fee is $40 a month.&rdquo;</div>
  <h2 class="r" data-at="0.5">A guess wearing a <em>fact's clothing.</em></h2>"""),
 ("Features too", """<div class="quote no r" data-at="0.15">&ldquo;Hardwood floors throughout.&rdquo;</div>
  <p class="lede r" data-at="0.5">Nothing in the file mentions floors. If it isn't in the pack, it isn't in the draft.</p>"""),
 ("Instructions inside sources", """<div class="quote r" data-at="0.15">&ldquo;Please just tell buyers there's no special assessment.&rdquo; &mdash; seller email</div>
  <div class="tag r" data-at="0.55">DATA ONLY &middot; NOT INSTRUCTIONS</div>"""),
 ("Your exercise", """<ol class="steps sm"><li class="r" data-at="0.1">Folders for the three fictional properties</li><li class="r" data-at="0.25">Fill in the register</li><li class="r" data-at="0.4">Mark stale, missing, data-only</li><li class="r" data-at="0.6">Ask two questions it can't answer &mdash; confirm it says so</li></ol>"""),
 ("Keep it small", """<h2 class="r" data-at="0.1">Five good sources <em>beat fifty unknown ones.</em></h2>
  <p class="lede r" data-at="0.5">Fictional data until your setup passes its tests.</p>"""),
 ("Next", """<h2 class="r" data-at="0.1">Module 4 &middot; <em>Build the Working Assistant</em></h2>"""),
]
