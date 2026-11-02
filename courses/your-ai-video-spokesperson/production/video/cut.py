"""cut.py <n> <from> <to>: remove a voice slip from m<n>.wav (backup m<n>-raw.wav) and shift later slide starts."""
import json, subprocess, sys, shutil, os
n, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
if not os.path.exists(f"m{n}-raw.wav"): shutil.copy(f"m{n}.wav", f"m{n}-raw.wav")
subprocess.check_call(["ffmpeg","-loglevel","error","-y","-i",f"m{n}.wav","-filter_complex",
  f"[0:a]atrim=0:{a},asetpts=PTS-STARTPTS,afade=t=out:st={a-0.03}:d=0.03[x];[0:a]atrim={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.03[y];[x][y]concat=n=2:v=0:a=1[o]",
  "-map","[o]","-ar","48000",f"m{n}-cut.wav"])
os.replace(f"m{n}-cut.wav", f"m{n}.wav")
s = json.load(open(f"m{n}-starts.json")); d = b - a
s = [x if x is None or x < b else round(x - d, 2) for x in s]
json.dump(s, open(f"m{n}-starts.json", "w")); print(n, "cut", round(d,2), s)
