# Module 1 on-screen beats: one per narration paragraph, in order.
# Each beat: kicker, then HTML body. Elements with class "r" reveal in order across the
# beat (data-at = fraction of the beat). Facts come from resources/seller-update-practice-data.md.
BEATS = [
 ("Module 1", """<h1 class="r" data-at="0.02">Give Your Assistant <em>One Job</em></h1>
  <p class="lede r" data-at="0.25">Build Your AI Assistant</p>
  <div class="chip r" data-at="0.45">AI avatar &middot; made from his own photo and cloned voice</div>
  <div class="chip warn r" data-at="0.7">Everything the assistant makes is a draft a licensed human reviews</div>"""),
 ("Why assistants disappoint", """<h2 class="r" data-at="0.05">It isn't the software.</h2>
  <h2 class="r big" data-at="0.45">It's the <em>job description.</em></h2>"""),
 ("The usual first try", """<div class="chat">
   <div class="msg u r" data-at="0.03">You're my assistant. Help me run my real estate business.</div>
   <div class="msg a r" data-at="0.12">Absolutely! I can help with marketing, lead generation, client communication, scheduling&hellip;</div></div>
  <div class="grid r" data-at="0.4"><span>Listings</span><span>Leads</span><span>Showings</span><span>Comps</span><span>Contracts</span><span>Social</span><span>Email</span><span>CRM</span><span>Pricing</span><span>Open houses</span><span>Follow-up</span><span>+29 more</span></div>
  <div class="bad r" data-at="0.78">2,240 sq ft &rarr; <s>2,420 sq ft</s> &nbsp;in a seller's inbox</div>"""),
 ("The fix", """<h2 class="r" data-at="0.05">One job.</h2>
  <div class="row"><div class="pill r" data-at="0.35">Clear inputs</div><div class="pill r" data-at="0.5">Clear output</div><div class="pill r" data-at="0.65">Clear edges</div></div>"""),
 ("The job we'll build", """<h2 class="r" data-at="0.03">The weekly <em>seller update</em></h2>
  <div class="row"><div class="card r" data-at="0.25"><b>Friday</b><span>3&ndash;4 active listings</span></div>
  <div class="card r" data-at="0.4"><b>Every seller</b><span>wants to hear what happened</span></div>
  <div class="card r" data-at="0.6"><b>Same pattern</b><span>showings &middot; open house &middot; feedback &middot; next</span></div></div>"""),
 ("Define it like a new hire", """<h2 class="r" data-at="0.05">Four questions</h2>
  <ol class="steps"><li class="r" data-at="0.3">What goes in?</li><li class="r" data-at="0.42">What comes out?</li><li class="r" data-at="0.54">What does good look like?</li><li class="r" data-at="0.66">Where does the job end?</li></ol>"""),
 ("1 &middot; What goes in", """<div class="row wrap"><div class="pill ok r" data-at="0.08">Approved listing facts</div><div class="pill ok r" data-at="0.16">This week's showings</div><div class="pill ok r" data-at="0.24">Feedback received</div><div class="pill ok r" data-at="0.32">Seller's questions</div></div>
  <div class="row wrap"><div class="pill no r" data-at="0.5">The internet</div><div class="pill no r" data-at="0.58">General knowledge</div><div class="pill no r" data-at="0.66">A guess about the market</div></div>
  <p class="lede r" data-at="0.82">Not in the inputs? Not in the update.</p>"""),
 ("2 &middot; What comes out", """<div class="row"><div class="card tall r" data-at="0.1"><b>Part 1 &middot; Draft email</b><span>Short enough to read on a phone</span></div>
  <div class="card tall hi r" data-at="0.4"><b>Part 2 &middot; Your checklist</b><span>Every fact used, with its source<br>Anything that needs your decision</span></div></div>
  <p class="lede r" data-at="0.75">Part 2 keeps you out of trouble.</p>"""),
 ("3 &middot; What good looks like", """<ul class="checks"><li class="r" data-at="0.2">Every number matches the showing log</li><li class="r" data-at="0.32">Nothing about pricing strategy</li><li class="r" data-at="0.44">Missing facts flagged, not filled in</li><li class="r" data-at="0.56">Under 220 words</li></ul>
  <p class="lede r" data-at="0.72">If you can check it, you can trust it.</p>"""),
 ("4 &middot; Where it ends", """<div class="row wrap"><div class="pill ok r" data-at="0.05">Drafts</div><div class="pill no r" data-at="0.15">Sends</div><div class="pill no r" data-at="0.25">Recommends a price drop</div><div class="pill no r" data-at="0.35">Interprets the agreement</div><div class="pill no r" data-at="0.45">Promises a sale date</div></div>
  <div class="tag r" data-at="0.75">AGENT DECISION</div>"""),
 ("Practice property &middot; fictional", """<div class="card wide r" data-at="0.05"><b>1418 Juniper Lane, Willow Fork</b><span>Sellers Dana and Luis &middot; fictional practice data</span></div>
  <ol class="steps sm"><li class="r" data-at="0.45">Should we worry? A nearby house went pending in four days.</li><li class="r" data-at="0.62">Can you say the school is the best in the district?</li><li class="r" data-at="0.8">Should we drop the price?</li></ol>"""),
 ("What's actually in the file", """<div class="cols"><div><h3 class="r" data-at="0.05">In the file</h3><ul class="checks"><li class="r" data-at="0.1">Showing counts</li><li class="r" data-at="0.16">Open house sign-ins</li><li class="r" data-at="0.22">Online views</li><li class="r" data-at="0.28">Three pieces of feedback</li></ul></div>
  <div><h3 class="r" data-at="0.36">Not in the file</h3><ul class="miss"><li class="r" data-at="0.42">Data on the nearby sale <i>MISSING</i></li><li class="r" data-at="0.56">A school ranking <i>FAIR-HOUSING RISK</i></li><li class="r" data-at="0.8">The price decision <i>AGENT DECISION</i></li></ul></div></div>"""),
 ("Organize, don't invent", """<div class="quote ok r" data-at="0.15">&ldquo;Five showings were completed and fourteen groups came through Sunday's open house.&rdquo;</div>
  <div class="quote no r" data-at="0.4">&ldquo;The market is moving fast, so a small price adjustment could help.&rdquo;</div>
  <h2 class="r" data-at="0.75">One is an assistant. <em>The other is a liability with good grammar.</em></h2>"""),
 ("Your exercise", """<h2 class="r" data-at="0.03">Fill in the <em>Job Card</em></h2>
  <ol class="steps sm"><li class="r" data-at="0.3">One task you repeat every week</li><li class="r" data-at="0.45">The one-sentence job</li><li class="r" data-at="0.58">Inputs, and where each comes from</li><li class="r" data-at="0.7">The output</li><li class="r" data-at="0.82">Three acceptance criteria someone else can check</li></ol>"""),
 ("The one-sentence test", """<div class="quote r" data-at="0.1">Draft seller updates <b class="hl">and</b> buyer comparisons <b class="hl">and</b> listing copy.</div>
  <h2 class="r" data-at="0.55">Two &ldquo;and&rdquo;s? <em>Split it.</em> Build the first one first.</h2>"""),
 ("Next", """<h2 class="r" data-at="0.1">Module 2 &middot; <em>Teach It Your Voice</em></h2>
  <p class="lede r" data-at="0.4">Without letting your voice change the facts.</p>"""),
]
