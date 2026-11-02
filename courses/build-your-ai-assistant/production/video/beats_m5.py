# Module 5 on-screen beats: one per narration paragraph, in order (see beats_m1.py).
# Facts come from resources/reusable-skill/seller-update/SKILL.md and seller-update-practice-data.md.
BEATS = [
 ("Module 5", """<h1 class="r" data-at="0.05">Turn the Workflow into a <em>Reusable Skill</em></h1>
  <div class="chip r" data-at="0.4">AI avatar &middot; made from his own photo and cloned voice</div>"""),
 ("Five listings, five rounds of pasting", ""),
 ("Point it at the folder", """<div class="row"><div class="card tall r" data-at="0.1"><b>listings/1418-juniper</b><span>facts &middot; showings &middot; seller email</span></div><div class="card tall r" data-at="0.4"><b>drafts/</b><span>a draft file for you to review</span></div></div>
  <p class="lede r" data-at="0.75">The package for that is called a <b class="hl">skill.</b></p>"""),
 ("What a skill is", """<div class="term r" data-at="0.05"><div class="tbar"><i></i><i></i><i></i>seller-update/SKILL.md</div>
   <div class="ln">---</div><div class="ln">name: seller-update</div><div class="ln">description: Draft a weekly seller update&hellip;</div><div class="ln">---</div>
   <div class="ln r" data-at="0.5"><span class="cm"># instructions, in plain English</span></div></div>
  <div class="chip r" data-at="0.8">Folder name = the command &middot; /seller-update</div>"""),
 ("Each setting is a decision", """<h2 class="big r" data-at="0.15">Each setting <em>is a decision.</em></h2>"""),
 ("description", """<div class="term r" data-at="0.05"><div class="tbar"><i></i><i></i><i></i>SKILL.md</div><div class="ln">description: what it does and when to use it</div></div>
  <p class="lede r" data-at="0.45">Claude uses it to recognize when the skill is relevant.</p>"""),
 ("disable-model-invocation: true", """<div class="term r" data-at="0.05"><div class="tbar"><i></i><i></i><i></i>SKILL.md</div><div class="ln">disable-model-invocation: true</div></div>
  <h2 class="r" data-at="0.45">It runs only <em>when you type the command.</em></h2>
  <p class="lede r" data-at="0.75">For client communication, you want that.</p>"""),
 ("allowed-tools", ""),
 ("The argument", """<div class="term r" data-at="0.05"><div class="tbar"><i></i><i></i><i></i>Claude Code</div><div class="ln"><span class="pr">&gt;</span> /seller-update 1418-juniper</div>
   <div class="ln r" data-at="0.5"><span class="cm"># lands wherever the skill says $ARGUMENTS</span></div></div>
  <p class="lede r" data-at="0.8">One skill, every listing folder.</p>"""),
 ("Two new details", """<ol class="steps"><li class="r" data-at="0.3">Reads only the listing folder you named &mdash; no leaking between listings</li><li class="r" data-at="0.6">Never overwrites a draft &mdash; it adds a number</li></ol>"""),
 ("Where the skill lives", """<div class="term r" data-at="0.1"><div class="tbar"><i></i><i></i><i></i>seller-updates</div><div class="ln">.claude/</div><div class="ln">&nbsp;&nbsp;skills/</div><div class="ln">&nbsp;&nbsp;&nbsp;&nbsp;seller-update/SKILL.md</div></div>
  <p class="lede r" data-at="0.6">Project location &mdash; loads when you start Claude Code in that folder.</p>"""),
 ("Let's run it", """<div class="term r" data-at="0.3"><div class="tbar"><i></i><i></i><i></i>Claude Code &middot; seller-updates</div><div class="ln"><span class="pr">&gt;</span> /</div><div class="ln r" data-at="0.6">&nbsp;&nbsp;seller-update</div><div class="ln r" data-at="0.85"><span class="pr">&gt;</span> /seller-update 1418-juniper</div></div>"""),
 ("Permission prompts", """<div class="dialog r" data-at="0.05"><b>Allow?</b><span>Read files in this folder &middot; write into drafts/</span><div class="row"><div class="pill ok r" data-at="0.4">Yes</div></div></div>
  <div class="row"><div class="pill no r" data-at="0.7">Anything that would send or post &mdash; say no</div></div>"""),
 ("It reports back", """<div class="chat"><div class="msg a r" data-at="0.4">Draft written: drafts/1418-juniper-update.md &middot; 3 items need you &middot; <b>nothing was sent.</b></div></div>"""),
 ("Three properties, three drafts", """<ul class="checks"><li class="r" data-at="0.4">Copper Bend: verbal interest described as <b>not an offer?</b></li><li class="r" data-at="0.6">Heron Point: HOA fee <b>flagged as stale?</b></li><li class="r" data-at="0.8">The special-assessment instruction <b>refused and reported?</b></li></ul>"""),
 ("The beginner project, on purpose", ""),
]
