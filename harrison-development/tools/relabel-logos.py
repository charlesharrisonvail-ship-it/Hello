#!/usr/bin/env python3
"""Re-letters the descriptor line on the Harrison Development logo files.

Charles asked (2026-11-12) for every logo to read "Development Advisory & Project Sales"
instead of "Development Marketing & Sales". The monogram, mountains, name and web address
are untouched: only the descriptor line(s) are painted out and set again.

Usage: python3 harrison-development/tools/relabel-logos.py <source dir of original logos> <font.woff or .ttf>
Font: Montserrat (SIL OFL), the closest match to the original lettering.
Each entry below gives the pixel boxes (y0, y1, x0, x1) of the old descriptor line(s).
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

SRC, FONT = sys.argv[1], sys.argv[2]
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "brand")
ONE = "DEVELOPMENT ADVISORY & PROJECT SALES"
TWO = ("DEVELOPMENT ADVISORY", "& PROJECT SALES")
SS = 4  # supersampling

# file: (out path, kind, boxes). kind "1" = one line with side rules; "2" = two lines.
JOBS = {
    "hd-banner-1500x500.png": ("1", [(256, 270, 705, 1368)]),
    "hd-banner-1584x396.png": ("1", [(201, 213, 960, 1530)]),
    "hd-banner.png": ("1", [(131, 143, 916, 1461)]),
    "hd-title-card-1280x720.png": ("1", [(357, 369, 544, 1058)]),
    "hd-title-card-2560x1440.png": ("1", [(715, 736, 1108, 2033)]),
    "hd-logo-stacked.png": ("1", [(1003, 1028, 69, 1186)]),
    "hd-logo-stacked.webp": ("1", [(1003, 1028, 69, 1186)]),
    "hd-square-1080.png": ("1", [(864, 885, 60, 1022)]),
    "hd-logo-horizontal.png": ("2", [(244, 267, 606, 1094), (283, 307, 606, 1094)]),
    "hd-logo-horizontal-small.png": ("2", [(122, 133, 303, 547), (142, 153, 303, 547)]),
    "hd-share-card-1200x630.png": ("2", [(324, 342, 639, 1101), (359, 377, 639, 1101)]),
    "hd-social-card.png": ("2", [(441, 465, 873, 1503), (488, 512, 873, 1503)]),
    "hd-post-frame-1080x1350.png": ("2", [(1117, 1149, 150, 930), (1173, 1205, 150, 930)]),
    "hd-poster-1000x1500.png": ("2", [(972, 996, 191, 810), (1016, 1040, 191, 810)]),
    "hd-story-1080x1920.png": ("2", [(1243, 1275, 144, 937), (1300, 1330, 144, 937)]),
}
EXTRA = {  # older working files outside official/
    "../hd-logo-light-transparent.png": ("1", [(608, 628, 55, 946)]),
    "../hd-logo-approved-original.png": ("1", [(1003, 1028, 69, 1186)]),
}

def text_width(font, s, track):
    return sum(font.getlength(c) for c in s) + track * (len(s) - 1)

def fit(s, cap, maxw):
    """Font whose capital height is `cap`, shrunk if the tracked line would exceed maxw."""
    size = cap / 0.70
    while True:
        f = ImageFont.truetype(FONT, max(4, round(size)))
        track = size * 0.20
        w = text_width(f, s, track)
        if w <= maxw or size < 6:
            return f, track, w
        size *= maxw / w * 0.995

def draw_line(layer, s, f, track, cx, cy):
    d = ImageDraw.Draw(layer)
    w = text_width(f, s, track)
    top, bottom = f.getbbox("H")[1], f.getbbox("H")[3]
    x, y = cx - w / 2, cy - (top + bottom) / 2
    for c in s:
        d.text((x, y), c, font=f, fill=255)
        x += f.getlength(c) + track
    return w

def process(src, dst, kind, boxes):
    im = Image.open(src)
    rgba = im.mode == "RGBA"
    im = im.convert("RGBA")
    W, H = im.size
    # paint out the old descriptor
    d = ImageDraw.Draw(im)
    for y0, y1, x0, x1 in boxes:
        pad = max(3, (y1 - y0) // 3)
        d.rectangle([x0 - pad, y0 - pad, x1 + pad, y1 + pad], fill=(0, 0, 0, 0 if rgba else 255))
    mask = Image.new("L", (W * SS, H * SS), 0)
    md = ImageDraw.Draw(mask)
    cap = (boxes[0][1] - boxes[0][0]) * SS
    cx = (boxes[0][2] + boxes[0][3]) / 2 * SS
    span = (boxes[0][3] - boxes[0][2]) * SS
    if kind == "1":
        y0, y1 = boxes[0][0] * SS, boxes[0][1] * SS
        f, track, w = fit(ONE, cap, span * 0.84)
        cy = (y0 + y1) / 2
        draw_line(mask, ONE, f, track, cx, cy)
        gap = span * 0.022
        t = max(SS, round((f.getbbox("H")[3] - f.getbbox("H")[1]) * 0.09))
        for a, b in ((boxes[0][2] * SS, cx - w / 2 - gap), (cx + w / 2 + gap, boxes[0][3] * SS)):
            if b - a > span * 0.02:
                md.rectangle([a, cy - t / 2, b, cy + t / 2], fill=255)
    else:
        f, track, _ = fit(TWO[0], cap, span * 0.98)
        for s, (y0, y1, _, _) in zip(TWO, boxes):
            draw_line(mask, s, f, track, cx, (y0 + y1) / 2 * SS)
    mask = mask.resize((W, H), Image.LANCZOS)
    # soft silver, lighter at the top like the original lettering
    grad = Image.new("RGBA", (W, H))
    gd = ImageDraw.Draw(grad)
    top, bot = min(b[0] for b in boxes), max(b[1] for b in boxes)
    for y in range(max(0, top - 6), min(H, bot + 6)):
        k = 0.5
        for y0, y1, _, _ in boxes:
            if y0 - 6 <= y <= y1 + 6:
                k = min(1, max(0, (y - y0) / max(1, y1 - y0)))
        v = round(244 - 46 * k)
        gd.line([(0, y), (W, y)], fill=(v, v, v + 2 if v < 253 else v, 255))
    im.paste(grad, (0, 0), mask)
    if not rgba:
        im = im.convert("RGB")
    if dst.endswith(".webp"):
        im.save(dst, quality=92)
    else:
        im.save(dst, optimize=True)
    print("ok", os.path.relpath(dst, OUT))

for name, (kind, boxes) in {**JOBS, **EXTRA}.items():
    process(os.path.join(SRC, name), os.path.normpath(os.path.join(OUT, "official", name)), kind, boxes)
