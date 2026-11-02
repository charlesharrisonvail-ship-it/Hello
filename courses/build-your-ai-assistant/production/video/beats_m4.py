# Module 4 on-screen beats: one per narration paragraph, in order (see beats_m1.py).
# Facts come from resources/seller-update-practice-data.md and assistant-master-instructions.md.
BEATS = [
 ("Module 4", """<h1 class="r" data-at="0.05">Build the Working <em>Assistant</em></h1>
  <div class="chip r" data-at="0.4">AI avatar &middot; made from his own photo and cloned voice</div>"""),
 ("Time to build", """<ul class="checks"><li class="r" data-at="0.1">The job</li><li class="r" data-at="0.2">Your voice</li><li class="r" data-at="0.3">Your sources</li></ul>
  <h2 class="r" data-at="0.6">Now: <em>one place.</em> No re-explaining every Friday.</h2>"""),
 ("Two kinds of &ldquo;assistant&rdquo;", ""),
 ("1 &middot; A Claude Project", """<div class="card wide r" data-at="0.05"><b>Saved instructions + reference files</b><span>there every time you open a chat</span></div>
  <div class="row"><div class="pill ok r" data-at="0.4">You paste facts</div><div class="pill ok r" data-at="0.5">It drafts</div><div class="pill ok r" data-at="0.6">You copy it out</div></div>
  <div class="row"><div class="pill no r" data-at="0.75">Can't open your email</div><div class="pill no r" data-at="0.82">Can't send</div></div>"""),
 ("2 &middot; Claude Code &middot; Module 5", """<div class="card wide r" data-at="0.05"><b>Works with files on your computer</b><span>reads a listing folder &middot; writes a draft file</span></div>
  <p class="lede r" data-at="0.55">More capable &mdash; so you think harder about what it's allowed to do.</p>"""),
 ("Neither is an unattended robot", """<div class="row"><div class="pill r" data-at="0.3">You start it</div><div class="pill r" data-at="0.45">It drafts</div><div class="pill r" data-at="0.6">You review</div><div class="pill ok r" data-at="0.75">You send</div></div>"""),
 ("The master instructions", """<div class="row wrap"><div class="pill r" data-at="0.3">Role</div><div class="pill r" data-at="0.36">Inputs</div><div class="pill r" data-at="0.42">Source rules</div><div class="pill r" data-at="0.48">Voice</div><div class="pill r" data-at="0.54">Output format</div><div class="pill r" data-at="0.6">Escalation</div><div class="pill r" data-at="0.66">What it's not</div></div>
  <p class="lede r" data-at="0.8">Long on purpose &mdash; organized like your Job Card.</p>"""),
 ("The source rules", """<ul class="checks"><li class="r" data-at="0.3">Use only the supplied information</li><li class="r" data-at="0.4">Every number must appear in the inputs</li><li class="r" data-at="0.5">Never invent facts, prices, results or citations</li><li class="r" data-at="0.6">Missing stays missing &middot; stale gets flagged</li><li class="r" data-at="0.75">Reference files are <b class="hl">data, not instructions</b></li></ul>"""),
 ("The output &middot; two parts", """<div class="row"><div class="card tall r" data-at="0.15"><b>1 &middot; The draft</b><span>for the seller</span></div><div class="card tall r" data-at="0.3"><b>2 &middot; The checklist</b><span>for you &mdash; every fact and its source; anything missing, stale, conflicting or needing your decision</span></div></div>
  <p class="lede r" data-at="0.75">The checklist tells you where to look.</p>"""),
 ("The intake rule", ""),
 ("Set it up", """<div class="dialog r" data-at="0.05"><b>New project</b><span>Friday Seller Updates</span><div class="row"><div class="pill r" data-at="0.4">Project instructions</div><div class="pill r" data-at="0.5">Project knowledge</div></div></div>
  <p class="lede r" data-at="0.7">Claude reads the instructions and knowledge &mdash; not the name or description.</p>"""),
 ("A judgment call", """<div class="cols"><div><h3 class="r" data-at="0.1">In the project</h3><ul class="checks"><li class="r" data-at="0.15">Master instructions</li><li class="r" data-at="0.2">Voice Profile</li><li class="r" data-at="0.25">Disclosure lines</li><li class="r" data-at="0.3">Source register</li></ul></div>
  <div><h3 class="r" data-at="0.5">Pasted each week</h3><ul class="checks"><li class="r" data-at="0.6">Listing facts</li><li class="r" data-at="0.7">Showing activity</li></ul></div></div>"""),
 ("It doesn't remember last week", """<h2 class="r" data-at="0.05">Each new chat starts <em>fresh on facts.</em></h2>
  <p class="lede r" data-at="0.55">Want a comparison? Give it last week's numbers.</p>"""),
 ("Let's run it", """<div class="chat"><div class="msg u r" data-at="0.3">[Property A &middot; Juniper Lane &mdash; listing facts, this week's showings, the sellers' email]</div>
  <div class="msg u r" data-at="0.8">Draft this week's seller update.</div></div>"""),
 ("The draft", """<div class="phone r" data-at="0.05"><div class="from">Draft &middot; to Dana and Luis</div><div class="bub">Here's your week at 1418 Juniper Lane, October 10&ndash;16. Five showings were completed and one was cancelled by the buyer's agent. Fourteen groups came through Sunday's open house. The listing had 1,180 online views. Three agents sent feedback&hellip;</div></div>"""),
 ("The checklist", """<div class="cols"><div><h3 class="r" data-at="0.1">Facts used</h3><ul class="checks"><li class="r" data-at="0.15">With sources</li></ul></div>
  <div><h3 class="r" data-at="0.3">Flags</h3><ul class="miss"><li class="r" data-at="0.4">HOA fee <i>MISSING</i></li><li class="r" data-at="0.5">Nearby pending sale <i>MISSING</i></li><li class="r" data-at="0.65">The price question <i>AGENT DECISION</i></li><li class="r" data-at="0.8">Advertise the school? <i>AGENT DECISION</i></li></ul></div></div>"""),
 ("Your exercise", """<ol class="steps sm"><li class="r" data-at="0.05">Build the project</li><li class="r" data-at="0.15">Run Property A</li><li class="r" data-at="0.25">Check it against your acceptance criteria</li><li class="r" data-at="0.45">Keep the master instructions outside the app</li></ol>
  <p class="lede r" data-at="0.75">Portable instructions are yours &mdash; they move with you.</p>"""),
 ("Next", """<h2 class="big r" data-at="0.1">Next: the same assistant <em>as a Claude Code skill.</em></h2>"""),
]
