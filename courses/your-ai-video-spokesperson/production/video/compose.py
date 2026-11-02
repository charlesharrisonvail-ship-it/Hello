"""compose.py <n> <open.mp4> <close.mp4|-> : Eva's presenter track for module n.
Eva talks on camera (HeyGen lip-sync) for the opening and the closing; in between, a slow push-in on her
portrait while her voice narrates the slides. Audio is always the full approved narration m<n>.wav.
Writes m<n>-avatar.mp4 (1080x1920, 25 fps)."""
import subprocess, sys, json
n, op, cl = sys.argv[1], sys.argv[2], sys.argv[3]
dur = lambda f: float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]))
total = dur(f"m{n}.wav"); a = dur(op); b = dur(cl) if cl != "-" else 0
mid = total - a - b
X = 0.4  # crossfade
V = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=25,format=yuv420p,setsar=1"
f = (f"[0:v]{V},trim=0:{a},setpts=PTS-STARTPTS[o];"
     f"[1:v]scale=2160:-2,crop=2160:3840,zoompan=z='1+0.06*on/({int((mid+2*X)*25)})':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
     f":d={int((mid+2*X)*25)}:s=1080x1920:fps=25,format=yuv420p,setsar=1[m];"
     f"[o][m]xfade=transition=fade:duration={X}:offset={a-X}[om]")
ins = ["-i", op, "-i", "eva-black.png"]
if b:
    ins += ["-i", cl]
    f += f";[2:v]{V},trim=0:{b},setpts=PTS-STARTPTS[c];[om][c]xfade=transition=fade:duration={X}:offset={a+mid}[v]"
else:
    f += ";[om]null[v]"
k = len([x for x in ins if x == "-i"])
cmd = ["ffmpeg","-loglevel","error","-y",*ins,"-i",f"m{n}.wav","-filter_complex",f,"-map","[v]","-map",f"{k}:a",
       "-c:v","libx264","-crf","18","-preset","veryfast","-c:a","aac","-b:a","192k","-t",str(total),f"m{n}-avatar.mp4"]
subprocess.check_call(cmd)
print(f"m{n}-avatar.mp4", round(dur(f"m{n}-avatar.mp4"),2), "open", round(a,2), "mid", round(mid,2), "close", round(b,2), "audio", round(total,2))
