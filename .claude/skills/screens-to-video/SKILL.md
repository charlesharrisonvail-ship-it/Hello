---
name: screens-to-video
description: "Make a ~30s launch film for one feature of a mobile app: pull the feature's screens from the app's Revyl Atlas, script it as a referenced beat-by-beat brief sourced from the mobile-motion are.na channel, build it in Stewdio (installing Stewdio's MCP server if it is missing), and hand over the File for an mp4 export. Use for \"launch film\", \"launch video\", \"feature film\", \"promo for <feature> in <app>\", or whenever a feature of an app in Revyl needs a launch video rather than a demo walkthrough."
---

# Screens to video

A feature, an app in Revyl, ~30s, 16:9. Three phases, in order, each ending in a check.
The worked example is `template/`: the Same Mood film for tidepool (`BRIEF.md` is its
script, `film.js` its timeline; it was built in HTML before this skill moved to Stewdio, and
before briefs carried a camera ref and a shot list, so it has neither).

**A launch film, not a walkthrough.** It sells one idea: a hook line before any UI, the
feature doing its own mechanism two or three times with rising pace, one turn where the
feature becomes bigger than the phone, and an end card. Screens are props in that arc;
never tour every screen, and never show settings, empty states, errors or system UI.

**The camera is half the film.** The channel's films never park a whole phone in the
middle of the frame. They cut between a macro on one control, the screen filling the
frame and the whole phone about every two seconds, with the phone laid back and rolled.
So the script carries a shot list, `scripts/camera.py` turns it into the whole camera rig
(the keyframes, a shaded phone that turns with them, cuts that sit inside one eased move) and
checks it against numbers measured from the references, and a film that fails those
checks is not done.

## Before you start: Stewdio

The film is built in Stewdio, a motion-graphics editor driven over MCP. Check for it
first, so an install can be approved while phases 1-2 run.

- **Claude Code**, in this order:
  1. Already there: Stewdio's tools are in the session, or `claude mcp list` shows it. Done.
  2. The connector, when Claude Code is signed in with a Claude account: the user connects
     Stewdio from Claude's connector directory (on Team and Enterprise plans an admin adds it
     for the organization), then runs `/mcp`, where Stewdio is listed under claude.ai. One
     sign-in then covers Claude on the web, desktop and Claude Code.
  3. The official plugin, when the connector can't load (Claude Code authenticates with
     `ANTHROPIC_API_KEY`, an `apiKeyHelper`, Bedrock or Vertex, or a `claude setup-token`
     token) or the user can't add it:
     `claude plugin marketplace add StewdioAI/plugin && claude plugin install stewdio@stewdio --scope user`,
     then the user runs `/mcp`, selects Stewdio and signs in.

  Both reach the same server with the same tools; never install the plugin on top of a
  working connector. If it is unclear how Claude Code is signed in, ask instead of guessing.
- **Codex:** `codex mcp list`; if missing, `codex mcp add stewdio --url https://mcp.stewdio.ai/mcp`,
  then `codex mcp login stewdio` for the user's browser sign-in.
- **Other agents:** add the remote server `https://mcp.stewdio.ai/mcp` (HTTP, OAuth sign-in)
  through the agent's own MCP setup, or ask the user to add it. Tell the user to approve it
  and sign in to Stewdio, then carry on with phases 1-2; only phase 3 waits.
- It needs a Stewdio account; the desktop app is optional. The Free plan allows 30
  content-changing MCP calls a week and puts a small "Made with Stewdio" mark on exports;
  Premium removes both. Mention this when installing.
- Connected means `read_documentation({ topic: "overview" })` returns and `list_files`
  answers (an empty list is fine). Tool names here are the server's; some agents list
  them in camelCase (`read_xml` is `tools.stewdio.readXml`).

If the user declines, ask whether to build in HTML instead (`template/film.js` +
`scripts/render.mjs`, the original path). Never switch silently.

## 1. Screens: Revyl Atlas, laser-focused

The CLI is `~/.revyl/bin/revyl` (already authenticated; `revyl auth login` otherwise).
Pass `--all-branches` to every atlas command.

```
revyl app list                                                   # app name + id
revyl atlas brief --app <id> --all-branches                      # areas, anchors
revyl atlas search "<feature words>" --app <id> --all-branches   # try 2-3 phrasings
revyl atlas screen <screen-id> --app <id> --all-branches         # summary, actions, in/out edges
revyl atlas neighbors <screen-id> --app <id> --all-branches      # entry points and exits
revyl atlas observations <screen-id> --app <id> --all-branches --screenshots --screenshot-dir atlas/<screen-name>
```

- Keep the feature's own screens, the one or two entry points that lead into it (the
  button or row a user taps) and the one outcome it ends on (saved, sent, shared). Drop
  everything else, even when it is connected.
- Read the edge labels: they name the exact control (`Same mood menu item`) and the
  gestures the feature answers to (swipe, pinch). Those gestures become beats.
- Sheet every screen folder (`python3 scripts/sheet.py atlas/<name> .scratch/sheet-<name>.png`)
  and look at all of them, then one full-size screenshot per screen for type, spacing
  and chrome. Screenshots are 1080x2400 Android: 1dp = 2.625px, screen = 412x914dp.
- Real content goes in one-to-one: `python3 scripts/crop_drops.py film/drops atlas/<screen>/*.jpg`
  cuts the image cards off a light canvas (skips status/nav chrome and edge-cut cards).
  Sheet the crops and keep the sharp unique ones; crop a hero by hand when detection
  merges two cards. The same card turns up in many screenshots: keep one of each.
- Tell the user which screens were found before scripting (one line).

## 2. Script: a referenced brief from the mobile-motion channel

**References come before beats.** The source is the are.na channel
`mobile-motion-mnpotx847ma` (https://www.are.na/blake-shao/mobile-motion-mnpotx847ma):
the look stays inside it and every motion ref comes from it. Go outside it only for a
role it cannot fill, and say so.

1. **List and look.** `python3 scripts/arena.py channel mobile-motion-mnpotx847ma .context/refs/<topic>`
   lists every block and writes numbered sheets; read all of them. `references/channel-notes.md`
   has the blocks already vetted and what each is good for; start there, but check for
   new ones (the channel grows, newest first).
2. **Vet 10-15 candidates for real.** `arena.py get <media> .context/refs/<topic>/cand/cN.mp4`,
   then `arena.py sheet <mp4> <png> 9` and read the sheet. A tile is not a reference: keep
   it only if the move happens on screen as more than a cut or fade. Pick the most striking
   move that could carry the feature over the one that shows a similar screen.
3. **Nine references, one job each.**
   - a1-a5, stills grabbed from the channel's clips (`arena.py still <mp4> <t> a1.jpg`),
     one aesthetic: a1 overall look (the floating phone), a2 palette (backdrop + one
     accent), a3 material (frosted glass, shadow), a4 composition (title / end card), a5 a
     detail (a label floating off the ui).
   - m1-m3, clips, numbered in beat order: the main mechanic, the turn, the titles or the
     exit. A motion ref gives mechanic and timing only; the subject is always swapped.
   - k1, a clip, the camera: how the frame and the phone move. Pick it for its moves, not
     its screen, and sheet it densely (`arena.py sheet <mp4> <png> 36`) so the cuts show.
     It sets the grammar of the shot list: how long a shot lasts, which framings
     alternate, how far the phone is laid back and rolled, and how one shot becomes the
     next: look at the four frames either side of every cut, because the references never
     cut between two frames at rest (the camera is travelling on both sides of the cut, or
     the phone turns to its next pose). Take the travel, not a clip's flash or blur. `references/channel-notes.md` has those numbers for the vetted camera clips;
     measure a new clip the same way. A 3D tilt in the clip is rebuilt with the Tilt rig
     (phase 3), never flattened to a small roll.
   - u-refs: the Atlas screen folders, rebuilt one-to-one. c-refs: the cropped content,
     used as-is.
   - Each ref states the beat it feeds and exactly what is taken, with a time range for
     clips (`m2 0-5s: images gathering around one center and scattering, subject swapped
     for drops`). A ref with no beat is cut.
4. **Beats.** Numbered, a time anchor on each, each one = subject + action + what it
   reveals or becomes. A beat is two to four shots, not one; the shots go in the shot
   list (step 5). Default skeleton (fit the seconds to the feature):
   1. 0-3 hook line, words blur into focus one at a time (m1), no ui yet
   2. 3-7 the subject arrives, the phone rises around it, a tap on the entry point
   3. 7-13 the feature's main mechanic inside the phone, a title on the side
   4. 13-18 the mechanic again, faster, chained
   5. 18-24 **the turn**: the feature outgrows the phone (spills past the bezel, zooms
      out to the whole, becomes the frame) + one line on frosted glass. The biggest beat;
      one turn, no second metaphor
   6. 24-27 the outcome (saved / sent) as a chip floating out of the phone
   7. 27-30 end card: feature name + the app's accent dot, mono "now in <app>"
5. **Shots: the camera, as a list.** Write `film/shots.json` (the format is at the top
   of `scripts/camera.py`): one entry per shot with the time it starts, how it starts,
   what it looks at, zoom, roll and the phone's tilt. Zoom 1 is the wide shot, the whole
   phone at 80% of the frame height. Four framings:

   | framing | zoom | the phone | roll | used for |
   |---|---|---|---|---|
   | wide | 0.5-1.1 | whole and upright, room for a title | 0-4deg | the hook, one establishing shot, the pull-back, the end card |
   | medium | 1.3-1.8 | cut off by the frame top and bottom, leaning | 5-10deg | arriving, seeing what a tap did |
   | close | 2-2.7 | one region of the screen | 8-15deg | the hero content |
   | macro | 3.2-5 | one control, the bezel crossing the frame as a diagonal, laid back | 15-25deg | every tap, every detail |

   The default 30s track, about fifteen shots (adapt it, keep the rhythm):

   | beat | shots |
   |---|---|
   | 1 hook | wide, creeping in 1.0 -> 1.06 |
   | 2 arrival | push to medium 1.4, `lean-right`, roll -8 as the phone rises; cut to macro 3.4, `laid-right`, roll -18 on the entry control 0.3s before the tap |
   | 3 mechanic | cut to wide, flat, the phone placed right of centre for the title; a slow push (1.7s, starting once the title has left) to close 1.9, `lean-left`, roll 12 on the hero; cut to a macro 3.0, `laid-right`, roll -22 that tracks across the content (`drift.to`) |
   | 4 chained | each tap is its own macro, cut in 0.3s before it lands, alternating `laid-left` and `laid-right`; a cut out to medium 1.6 between them to show what the tap did |
   | 5 turn | cut to 4 on the gesture with the phone flat, a glide back to 0.5 over 2.3s (the one fast move of the film), cut to a medium 1.3, roll -10, drifting across what the feature became |
   | 6 outcome | cut to macro 3.3, `laid-left`, roll 16 on the save control; cut to medium, drifting after the chip |
   | 7 end card | cut to wide, creeping in 1.0 -> 1.04 |

   Rules, from the references' numbers (`camera.py build` enforces them):
   - a new shot every 1.2-2.5s, none longer than 3.5s, twelve or more in 30s
   - wide for at most 40% of the film, hook and end card included; macro for at least 2.5s
   - the phone laid back in two shots or more, rolled 10deg in three or more, 18deg in one
   - four cuts or more, and a cut changes the zoom 1.5x, the tilt, or the roll by 15deg;
     a cut into nearly the same framing is a jump cut
   - calm beats lively. The camera is never snappy: outside the turn nothing in the
     frame travels faster than 50px a frame, and around a cut about 8. A film that
     passes every other check and feels fast is wrong
   - a transition is a plain hard cut inside one long, slow eased move, most of the
     time: two cuts or more for every move. `"in": "cut"` does it: the shot before
     eases in (quadratic) over up to its last second, so it is travelling, gently, when
     the picture changes, and the new shot starts at that same speed and eases out
     (quadratic) over up to 1.2s into its drift. The picture itself only cuts: no
     flash, no dip, no overshoot, no quick settle, which read as explosive and bouncy.
     Each shot is one move in one direction, a little faster at its ends than in the
     middle
   - `"in": "fade"` is the same move with the picture fading to the backdrop and back
     over 0.9s. It marks a change of chapter (out of the turn, into the end card): two
     a film at most, never more than one cut in four
   - a cut between two frames at rest reads as a slideshow. `"in": "hard"` makes one,
     for a montage of flashes only, twice a film at most
   - `"carry"` at the top of `shots.json` scales how fast the camera is travelling at
     every cut (1 by default; 0.6 when the film should feel calmer, 1.5 harder). Change
     it when the user asks for softer or stronger transitions, not shot by shot
   - a move is rare and slow: `push` (1.4s) and `glide` (2s) are one continuous move,
     eased in and out, in which the phone turns from its old pose to the new one while
     the camera travels. Two to four a film, two of them changing the tilt, and only
     between framings that are close to each other (wide to medium, medium to close).
     A change of 2x in zoom or more is a cut, because a move that has to cover it in a
     second or two is the snap this skill avoids; the build's "calm moves" check says
     which move is too fast, and a longer `dur` or a cut fixes it. The one exception is
     the turn's pull-back, which may run faster
   - a shot starts on an action: cut to the macro 0.3-0.5s before the tap so the tap
     lands as the ease runs out, push as the phone lands, cut when the result appears
   - nothing holds still: every shot drifts from the frame it lands on to its last (3%
     of zoom and 0.7deg of roll a second by default, or a track across the ui with
     `drift.to`)
   - a macro is full of phone: the phone covers half the frame or more. A control near
     the screen's edge goes off-centre toward that edge with `place`, and a laid-back
     phone is narrower than a flat one, so it takes more zoom. The build names the
     `place` and zoom that fix a shot with too much backdrop
   - the turn happens with the phone flat: a handoff rect is only identical without tilt
   - no title over a macro: when a line is up, the shot is wide or medium and `place`
     moves the phone off-centre to make room

   Run `python3 scripts/camera.py build film/shots.json` until every check passes. It
   writes `film/rig.xml` (the Camera composition with every keyframe and the phone, for
   phase 3) and prints the shot table, one capture time per shot, and the eight frame
   times of one cut.
6. **Write mechanisms, not adjectives.** "related drops fly in from off-frame and settle
   around the clouds" gets built right; "a dynamic reveal" does not. Animate the feature's
   own contraption (tap -> follow, pinch -> zoom out, save -> chip), never a generic
   draw-in. Transformations are in-place morphs and handoffs, not cut-and-rebuild.
7. **Film frame, not a web page.** The world is laid out for the wide shot (the phone
   ~80% of the frame height), and the film spends most of its time closer than that;
   titles are 60px+ at 1080p; one hero per shot.
8. **House shape**, lowercase, imperative, numbered, no filler, under ~240 words above
   `camera:`. The first line names the channel's aesthetic, not the app's (`in soft-white
   studio launch film`); the app's palette survives inside the phone and as the accent.

```
in stewdio, new file <feature>-launch, create a 30s launch film for <app>'s <feature>, in <aesthetic from a1>, the ui rebuilt one-to-one from u1-uN with the real content (c1):

1. 0-3s: <hook line> blurs into focus word by word like m1, on a2's <backdrop>
2. 3-7s: <subject> ... the phone rises like a1 ... a tap hits "<entry control>"
3. ...
5. 18-24s, the turn: <how the feature outgrows the phone>, like m3 <range> <reversed?>
...
<pace in words>; 16:9, 1920x1080, 30fps, no music

camera: cut like k1 <range>, film/shots.json
<the shot table camera.py build printed: #, t, in, framing, zoom, roll, tilt, name>

refs:
- a1 <path>: look, <what it sets, which beats> (<block url>, channel mobile-motion-mnpotx847ma)
- ... a2-a5, m1-m3 the same way
- k1 <path>: camera, <shot length, framings, tilt and roll taken, with numbers>, shots <n-m>, <range> (<block url>, channel mobile-motion-mnpotx847ma)
- u1 atlas/<screen>/: ui, <screen>, one-to-one (revyl atlas, <app>, screen <id>)
- c1 film/drops/: copy, the real content cropped from the atlas, one-to-one
```

Save it as `film/BRIEF.md` with at most three fill-ins (the creative forks you chose, each
with the one alternative). `template/BRIEF.md` is a finished one. Do not stop for approval
unless the user asked to see the script first; go straight to phase 3.

## 3. Build: the film in Stewdio

**Read first, every time.** `read_documentation` for `overview`, `xml` and `graphic` (the
XML is strict: unknown elements and attributes are rejected), then `list_skills`: the
user's own Stewdio skills win where they conflict with this section. `template/film.js`
is the worked example's timeline at 1920x1080 (keyframe times, easings, positions,
handoffs): port its timing, not its code.

The `xml` page is long and a tool result can cut its end off. What it says there: a
string input carries its value as element text (`<input key="copy" type="string">words</input>`),
number, color and boolean inputs use `value=`, asset inputs `ref=`; a keyframe's
`easing` shapes the segment that starts at it; `size` can be keyframed like any box
field. A group's box is fitted to its children and their positions are measured from
its top-left corner, so lay a group's children out from `0 0`; a new group's
`position` is read before the box is fitted, so read the group back and set its
position with `edit_xml`. Inside a clipped node, keyframe time 0 is its `clip-start`:
keep `clip-start="0"` and cut with `clip-trim`, and the keyframes stay on the film's
clock. A field shows its first keyframe's value before that keyframe, so anything that
appears mid-film starts with a keyframe at 0 that hides it.

1. **File.** `create_file({ name: "<feature>-launch" })` once; keep `id` and `url` exactly
   as returned. After a failed or timed-out call, `list_files` before creating again.
2. **Assets.** Upload the kept crops and nothing else (the ui is rebuilt, not screenshotted):
   `create_assets({ fileId, uploads: [{ name: "c1-<n>" }, ...] })`, then POST each file to
   its single-use url within the hour: `curl --data-binary @film/drops/<n>.jpg "<url>"`.
   Save every returned `hash`, width and height to `film/drops/assets.json`; images are
   placed by hash at their native aspect ratio.
3. **Layers**, split wherever someone would edit independently, back to front, with
   descriptive names. One root `<composition name="<feature> launch" duration="30"
   size="1920 1080" background="<a2 backdrop>">` holding:
   - `Backdrop` Graphic when a2's backdrop is a gradient, moves or has grain; a flat
     colour is the composition's background.
   - `Camera` composition (background `#00000000`, size 5760x3240, position 960 540):
     the world. Everything the camera can look at is a child, laid out in world px with
     the wide shot's frame in the middle (the centre is 2880 1620). It is never written
     by hand: `camera.py build` writes it whole to `film/rig.xml`, with the shot list
     as keyframes (`anchor` is the point the camera looks at, `scale` the zoom,
     `rotation` the roll, `position` where that point sits in the frame, `opacity` the
     fades), the `Tilt` rig and the phone. Your layers go in through four
     files beside `shots.json`, which the build splices in at its markers:
     `film/screens.xml` (one composition per screen, between the phone's body and its
     glass), `film/below.xml` and `film/above.xml` (world layers behind and in front
     of the phone) and `film/tilt.xml` (`<animation>` blocks for `Tilt`: the
     `position` keyframes of the phone rising in, and `position` or `opacity` taking it
     away before the end card; it rests at `phone.at`).
     Each file is a run of sibling elements with no wrapper. Every composition that
     holds a keyframe needs `duration="30"`.
   - The phone is `template/phone.xml`, placed by the build and never redrawn: a
     `Tilt` composition (1600x1600, at `phone.at`) holding the `Phone shadow` Graphic
     and the `Phone` composition, which holds `Phone body`, the screens and
     `Phone glass`. Stewdio is 2D, so the build lays the phone back the way a long
     lens would draw it: `Tilt`'s `scale` and `rotation` and the `Phone`'s
     `rotation` squash the screen, and the three Graphics take the same pose through
     `lay` and `yaw` inputs and draw what a flat shape cannot: a metal frame with its
     thickness swept back from the glass and lit along one edge, side buttons, speaker
     holes and a port on the bottom wall, a thin black bezel whose inner corners round
     the screen (a composition crops square), the camera cutout, a sheen across the
     glass, and a contact shadow under a long soft one. A rounded rect with a stroke
     reads as a sticker; the references are lit renders, and this stands in for one.
     Set it in `phone` of `shots.json`: `screen` is the screenshot's size in dp;
     `frame` the metal's colour, chosen against a2's backdrop so the edge shows
     (`#B9B5AD` natural, `#3A3A3C` graphite, `#E3E1DC` silver); `cutout` follows the
     screenshots (`punch` for Android, `island` for iOS, `none`); `shadow` its
     strength (1.6; in the first wide capture the phone has to sit on the floor, not
     float over it, so raise it on a pale backdrop and drop it on a dark one); `radius`,
     `bezel`, `band` and `depth` only when the device differs, with `radius` at
     most 2.3x `bezel` + `band` or the screen's square corners show.
   - Screens, in `film/screens.xml`: one composition per screen (`Screen: <name>`,
     with the `size` and `position` the SCREENS marker in `rig.xml` names,
     `duration="30"`, background the app's surface and never transparent). Each holds
     a `<name> ui` Graphic drawing the chrome one-to-one from the screenshot (bars, mono
     labels, pills, icon weight; fonts as font inputs), the drops as native `image`
     layers, and the touches as `vector` ellipses on top. Keep the status bar clear of
     the cutout, as the screenshot does. Graphics and text stay sharp at macro zoom;
     images are as sharp as their crop. The screen composition crops to the screen,
     which is what lets content be clipped inside the phone and released for the turn.
   - Stage-level copies of the drops that escape in the turn, as `image` layers in
     `film/above.xml`, outside the phone, and the `Saved chip` group, which the camera follows
     out of the phone. Image layers cannot blur: a blur-in taken from a motion ref
     becomes opacity and scale. When content has to grow out of the screen without
     popping at its edge, put it in a `Turn window` composition that starts on the
     screen's rect and keyframes its `size` open, with the content counter-moving
     inside it.
   - Anything the camera should not move sits after the Camera, in frame px: the titles,
     the frost pill, the end card. A title stays level while the phone rolls under it.
   - Titles: one Graphic per line (`Hook`, `Title <n>`, `Turn line`) for the
     word-by-word blur, with a `copy` string input, a font input (`Geist` from Google
     Fonts, or the app's own), size and color inputs, and `progress` and `exit` number
     inputs keyframed 0->1, so a line's way in and way out are timed apart. A title with no blur is native `text`.
   - `Frost pill` (translucent white rect vector with a hairline stroke) behind the
     turn line, and an `End card` group (native text name, the accent dot as a vector,
     mono "now in <app>").
4. **Motion.** Position, scale, rotation and opacity are field keyframes on the layers
   (`<animation field="position">`, `easing="bezier(x1 y1 x2 y2)"`); custom effects are
   input keyframes on Graphics. Nothing is timed inside a script: every Graphic draws
   from its inputs and `graphic.size` alone, so any frame renders on its own. Clips
   (`clip-start`, `clip-duration`, `clip-trim`, always together) sequence screens and
   titles. The rules that made the worked example read well still hold:
   - the camera is built, not written: to change a shot, the phone or a layer inside
     the Camera, edit `film/shots.json` or the part file and build again; a keyframe
     nudged in the File is lost at the next build
   - a cut is one frame, and the camera is at its fastest on both sides of it: a
     screen swap belongs on the cut frame, and anything that has to be read lands 0.3s
     or more after it, as the ease runs out. A fade hides the picture for 0.3s either
     side of `t`
   - touches are timed to the shot list: a tap lands 0.3-0.5s after its macro cuts in
   - handoffs between layers happen on one frame at an identical rect (in-screen drop
     -> stage drop for the turn); `camera.py point film/shots.json <shot> <x> <y>` turns
     a screen point in dp into world px for that shot. Never crossfade two copies of the
     same thing
   - ~0.5s between an outgoing title and the next one; overlapping blurred words read
     as a glitch
   - touches live inside the screen composition so they ride the moving phone: press is
     scale 1 -> 0.85, the ripple a second ellipse scaling up while it fades
5. **Write in few calls.** One `write_xml` per top-level piece (the root composition
   with its backdrop, then `film/rig.xml` whole with the root as `parentId`, then each
   title, in that order: a new node lands on top, and a write takes one root element. A
   Camera written after the titles is moved `before` the first of them with `edit_xml`),
   never one per layer:
   the Free plan counts every content-changing call. On diagnostics fix every listed
   line and write again; after a failed creation, `read_xml` with `depth: 1` before
   retrying so nothing is created twice. Later fixes go through `edit_xml` on the node
   you just read. After a rebuild, write the new `rig.xml` into the root, then in one
   `edit_xml` `move` it `before` the first title and `remove` the old Camera.
6. **Check with capture.** `capture` renders in the user's open Stewdio session, so
   the File has to be open in a tab that is in front: on the user's own computer `open "<url>"` and
   wait ~10s, otherwise give the user the url and ask. A tab that has gone to the
   background stops answering ("did not respond"): `open -g "<url>"` loads a fresh one
   without taking the person's focus; close your own older tabs of the File as you go
   instead of leaving a stack of them in the person's browser. When a time has hundreds of layers on screen
   (the turn), capture 2 times per call instead of 8. If the tab says the File is
   unavailable, the browser is signed in to another Stewdio account than the MCP: ask
   the user to open the url in a session on that account, keep building, and report
   plainly that nothing has been seen yet. The first capture after a large write can time out once
   while the session loads it; capture one time again before concluding anything.
   Capture the root composition once per shot, at the times `camera.py build`
   printed, at most 8 per call, then one earlier time again (which shows no frame
   depends on the one before). Then capture the eight times around one cut that it printed: the framing
   changes a little between the first three (the ease-in), most between the two either
   side of the cut, and less and less after it (the ease-out), always in one direction.
   A frame that jumps back, flashes or looks the same as its neighbour at the cut is
   wrong. Look at the phone in one wide and
   one macro capture: a lit metal edge, a shadow under it, and rounded screen corners
   with nothing of the screen poking out of them. In every capture check that the thing the shot looks at
   sits where `place` put it, the touch is inside its macro, no text overlaps, nothing
   clips at a motion extreme, the edge of the world never shows, the turn reads as a
   turn, and every element is still its own selectable layer. Then save `read_xml` of
   the Camera node to `film/camera.xml` and run
   `python3 scripts/camera.py check film/camera.xml`: it samples every frame of what
   is really in the File and has to pass like the build did. Fix and capture again.
   Captures are previews, not the export; never report them as the final video.
7. **Export is the user's click**; Stewdio has no export tool. In Stewdio Studio: select
   the root composition -> Export in the inspector -> MP4 (H.264), Size 100%, 30 fps ->
   Export video (mute the composition's Sound first for a silent film). Suggest saving to
   `film/out/<feature>-launch.mp4`; once it is there,
   `python3 scripts/arena.py sheet <mp4> <png> 25` checks continuity.

## Deliver

The Stewdio File `url` exactly as returned, two captured frames (the mechanic, the turn),
the beats with their times one line each, the export steps above, and the open choices:
copy, music, anything the Atlas did not cover. Point at `film/BRIEF.md` for script edits
and `film/shots.json` for the camera (edit a shot, build, write `film/rig.xml` again);
layout and timing edits happen in Stewdio, by hand or by asking.
