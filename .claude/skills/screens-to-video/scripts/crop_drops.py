import sys, os, re, json, colorsys
import numpy as np
from PIL import Image
from scipy import ndimage
# usage: crop_drops.py <out-dir> <screenshot>...   crop image cards off a light canvas
#        crop_drops.py --meta <drops-dir>          write meta.json + meta.js (size, avg colour)
# options: --top N --bottom N  px of chrome to ignore (default 260 / 330 at 1080x2400), --min N  smallest side (180)
args = sys.argv[1:]
def opt(name, d):
    if name in args: i = args.index(name); v = int(args[i + 1]); del args[i:i + 2]; return v
    return d
top, bottom, mn = opt('--top', 260), opt('--bottom', 330), opt('--min', 180)
if args[0] == '--meta':
    d = args[1]; meta = {}
    for f in sorted(os.listdir(d)):
        if not f.lower().endswith(('.jpg', '.png')): continue
        im = Image.open(os.path.join(d, f)).convert('RGB'); s = im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
        h, sa, v = colorsys.rgb_to_hsv(*[c / 255 for c in s])
        meta[os.path.splitext(f)[0]] = {'w': im.width, 'h': im.height, 'rgb': s, 'hue': round(h, 3), 'sat': round(sa, 3), 'val': round(v, 3)}
    json.dump(meta, open(os.path.join(d, 'meta.json'), 'w'))
    open(os.path.join(d, 'meta.js'), 'w').write('window.META=' + json.dumps(meta) + ';')
    print(len(meta), 'images'); sys.exit()
out = args[0]; os.makedirs(out, exist_ok=True)
k = max([int(f[1:4]) + 1 for f in os.listdir(out) if re.fullmatch(r'd\d{3}\.jpg', f)], default=0)
for f in args[1:]:
    im = Image.open(f).convert('RGB'); a = np.asarray(im).astype(int); H, W = a.shape[:2]
    m = (255 - a).sum(axis=2) > 60; m[:top, :] = False; m[H - bottom:, :] = False
    m = ndimage.binary_fill_holes(ndimage.binary_closing(ndimage.binary_opening(m, iterations=2), iterations=6))
    lab, _ = ndimage.label(m)
    for sl in ndimage.find_objects(lab):
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if min(x1 - x0, y1 - y0) < mn or x0 <= 2 or x1 >= W - 2 or m[y0:y1, x0:x1].mean() < .85: continue
        im.crop((x0 + 3, y0 + 3, x1 - 3, y1 - 3)).save(os.path.join(out, 'd%03d.jpg' % k), quality=92); k += 1
print(k, 'crops ->', out)
