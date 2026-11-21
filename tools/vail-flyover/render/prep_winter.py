"""Winterize the NAIP textures and build the 3D building list.
Local coords: metres east/north of UTM13N (360123, 4380285)."""
import json, csv, numpy as np, sys, os
from PIL import Image, ImageFilter
from pyproj import Transformer
Image.MAX_IMAGE_PIXELS = None
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data'))
csv.field_size_limit(10**9)

def load_dem(f, x0, y0, x1, y1):
    d = np.array(Image.open(f)).astype('f4')
    return d, (x0, y0, x1, y1)

MAIN = load_dem('dem.tif', 0, 0, 29120, 13764)
WIDE = load_dem('demw.tif', -20000, -20000, 49125, 33764)
VA = load_dem('va_dem.tif', 18000, 6600, 24600, 10200)
WE = load_dem('we_dem.tif', 4200, 3600, 11400, 9600)

def elev_grid(dem, ext, w, h):
    """resample a DEM covering ext to an image of w x h covering the same ext"""
    d, (a, b, c, e) = dem
    return np.array(Image.fromarray(d).resize((w, h), Image.BILINEAR))

def winterize(img, elev):
    a = np.asarray(img).astype('f4') / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    v = a.max(-1); mn = a.min(-1); sat = (v - mn) / (v + 1e-4)
    lum = 0.3 * r + 0.59 * g + 0.11 * b
    # conifer forest: dark and green-leaning
    forest = np.clip((0.40 - v) / 0.12, 0, 1) * np.clip((g - b) * 8 + 0.6, 0, 1)
    forest = np.asarray(Image.fromarray((forest * 255).astype('u1')).filter(ImageFilter.GaussianBlur(1))).astype('f4') / 255
    built = (sat < 0.09) & (v > 0.25) & (v < 0.70) & (elev < 2600)
    built = np.asarray(Image.fromarray((built * 255).astype('u1')).filter(ImageFilter.GaussianBlur(0.8))).astype('f4') / 255
    snowline = np.clip((elev - 2150) / 250, 0, 1)
    alpha = (1 - forest) * 0.97 + forest * 0.10
    alpha = alpha * (1 - built * 0.72)
    alpha = alpha * (0.82 + 0.18 * snowline)
    # snow keeps a little of the ground's shading so runs and moguls read
    snow = np.stack([0.93 + 0.06 * lum, 0.95 + 0.05 * lum, 0.99 + 0.01 * lum], -1)
    base = a * (1 - 0.22 * forest[..., None]) * np.array([0.92, 1.0, 0.98])
    out = base * (1 - alpha[..., None]) + snow * alpha[..., None]
    # winter light: cooler, a touch more contrast on the trees
    out = out * np.array([0.97, 0.99, 1.03])
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype('u1'))

def stitch(names, cols, rows, tw, th):
    m = Image.new('RGB', (tw * cols, th * rows))
    for i, n in enumerate(names):
        m.paste(Image.open(n).resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
    return m

jobs = [
    ('photo.jpg', MAIN, 'photo_w.jpg', None),
    ('photow.jpg', WIDE, 'photow_w.jpg', None),
    (stitch(['va_00.jpg', 'va_01.jpg', 'va_10.jpg', 'va_11.jpg'], 2, 2, 2200, 1200), VA, 'va_w.jpg', None),
    (stitch(['we_00.jpg', 'we_01.jpg', 'we_10.jpg', 'we_11.jpg'], 2, 2, 2000, 1667), WE, 'we_w.jpg', None),
]
for src, dem, out, _ in jobs:
    img = Image.open(src).convert('RGB') if isinstance(src, str) else src
    e = elev_grid(dem, None, img.width, img.height)
    winterize(img, e).save(out, quality=90)
    print('wrote', out, img.size)
for dem, name in [(VA, 'va_dem.f32'), (WE, 'we_dem.f32')]:
    dem[0].astype('<f4').tofile(name); print(name, dem[0].shape)

# ---------- buildings ----------
tr = Transformer.from_crs(4326, 26913, always_xy=True)
def sample(dem, x, y):
    d, (a, b, c, e) = dem
    h, w = d.shape
    i = np.clip(((x - a) / (c - a) * (w - 1)).round().astype(int), 0, w - 1)
    j = np.clip(((e - y) / (e - b) * (h - 1)).round().astype(int), 0, h - 1)
    return d[j, i]
def ground(x, y):
    for dem in (VA, WE, MAIN):
        a, b, c, e = dem[1]
        if (x.min() > a) and (x.max() < c) and (y.min() > b) and (y.max() < e):
            return float(sample(dem, x, y).min())
    return float(sample(MAIN, x, y).min())

def rings_from_wkt(w):
    w = w.strip()
    if w.startswith('MULTIPOLYGON'):
        body = w[len('MULTIPOLYGON'):].strip()[1:-1]
        polys = body.split(')),')
    else:
        polys = [w[len('POLYGON'):].strip()]
    out = []
    for p in polys:
        p = p.strip().lstrip('(').rstrip(')')
        rings = []
        for rg in p.split('),'):
            rg = rg.strip().lstrip('(').rstrip(')')
            pts = [tuple(map(float, q.split())) for q in rg.split(',') if q.strip()]
            rings.append(pts)
        out.append(rings)
    return out

blds = []
for row in csv.DictReader(open('buildings.csv')):
    for rings in rings_from_wkt(row['wkt']):
        loc = []
        for rg in rings:
            lon = np.array([p[0] for p in rg]); lat = np.array([p[1] for p in rg])
            x, y = tr.transform(lon, lat)
            loc.append(np.stack([x - 360123, y - 4380285], 1))
        outer = loc[0]
        xs, ys = outer[:, 0], outer[:, 1]
        area = 0.5 * abs(np.dot(xs, np.roll(ys, 1)) - np.dot(ys, np.roll(xs, 1)))
        if area < 25: continue
        hgt = row['height']; fl = row['num_floors']
        if hgt: h = float(hgt)
        elif fl: h = float(fl) * 3.4
        else: h = 6.5 if area < 200 else 9.5 if area < 800 else 13
        h = min(max(h, 4), 45)
        z = ground(xs, ys)
        blds.append({'z': round(z, 1), 'h': round(h, 1),
                     'r': [[[round(float(p[0]), 1), round(float(p[1]), 1)] for p in rg] for rg in loc]})
json.dump(blds, open('buildings.json', 'w'), separators=(',', ':'))
print('buildings', len(blds))
