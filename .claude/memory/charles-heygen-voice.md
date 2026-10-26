---
name: charles-heygen-voice
description: Charles's real HeyGen voice is the "Charles Harrison" clone on the Starfish engine only (other engines and script-to-video renders sound Australian); make Starfish audio first, then lip-sync the avatar to it
---

2026-10-23: the Module 1 sample of Build Your AI Assistant used HeyGen voice
"Charles Harrison" (b5bd92d295f34bc4aa1496105d476570, Starfish engine), the default voice
on his "Charles2" avatar. Charles: "that is NOT my voice!! that voice is Australian."

2026-10-24: Charles listened to the stored previews and said **"A is my voice"** — i.e. the
"Charles Harrison" clone (b5bd92d…) IS his. So the clone is right; the Australian sound came
from how the sample render synthesized it (engine/settings). Three test clips of the same line
were made (Starfish, HeyGen Voice, ElevenLabs multilingual v2) for him to pick by ear.

2026-10-24: Charles picked **Test 1 = Starfish** ("test 1 starfish is me... all the others
are Australian"). HeyGen Voice and ElevenLabs renders of the same clone sound Australian, and
so did the Avatar IV video render from script. **Method:** synthesize the narration with
`create_speech` engine "starfish", then make the avatar video from that audio (`audioUrl`),
never from `script` + voiceId.

Other saved voice: "CHAiRLES" (bb8c375509e74fe780dcd327101dd027, ElevenLabs).
Not yet confirmed either.

Rule: before any render with Charles's avatar, play him a short preview of the exact
voice and engine and get a yes. A voice's name, or being an avatar's default, is not proof
it's his. If neither voice is right, he records a fresh voice sample (his own) in HeyGen.

2026-10-26: the ORIGINAL course videos (Listing Media Without the Invoice; the welcome,
Module 1, is his suit avatar) use a voice that is NOT his and not the Starfish one. I re-cut
that welcome over its old narration and sent it; Charles: "That is not my voice, nor the same
one we used in the last modules!!! wtf". Rule: never reuse an existing narration track
of his avatar unless he has confirmed it by ear. Re-voice old videos with Starfish first,
sample to him, then lip-sync.
