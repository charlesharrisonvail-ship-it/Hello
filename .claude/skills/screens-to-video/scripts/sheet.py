import sys, os, glob
from PIL import Image, ImageDraw
# usage: sheet.py <dir-of-images> <out.png> [tile_height]
d, out = sys.argv[1], sys.argv[2]
th = int(sys.argv[3]) if len(sys.argv) > 3 else 600
files = sorted(f for f in glob.glob(os.path.join(d, '*')) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')))
if not files: sys.exit('no images in ' + d)
ims = [Image.open(f).convert('RGB') for f in files]
tw = max(int(th * im.width / im.height) for im in ims)
cols = max(1, min(8, 2400 // tw)); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * th), 'white'); dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    im.thumbnail((tw, th)); x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im, (x, y)); dr.rectangle([x, y, x + 40, y + 24], fill='black'); dr.text((x + 6, y + 6), str(i), fill='white')
sheet.save(out)
for i, f in enumerate(files): print(i, os.path.basename(f))
