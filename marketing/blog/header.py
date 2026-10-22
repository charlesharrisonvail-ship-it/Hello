# Original Vail Valley dusk header for EpiVail blog posts.
# Usage: python3 header.py "Edwards" "OCTOBER 2026" > out.svg  (no args = no text)
import random, math, sys
random.seed(7)
W,H=1600,900
def ridge(base,amp,rough,seed,step=6):
    r=random.Random(seed);ph=[r.uniform(0,6.28) for _ in range(5)];n=[0]
    raw=[]
    for x in range(0,W+step,step):
        y=base-amp*(0.9*math.sin(x/310+ph[0])+0.55*math.sin(x/140+ph[1])+0.3*abs(math.sin(x/70+ph[2]))+0.15*math.sin(x/33+ph[3]))
        raw.append([x,y+r.uniform(-rough,rough)*4])
    for _ in range(2):
        raw=[raw[0]]+[[raw[i][0],(raw[i-1][1]+2*raw[i][1]+raw[i+1][1])/4] for i in range(1,len(raw)-1)]+[raw[-1]]
    return [tuple(p) for p in raw]
def poly(pts,fill,extra=''):
    d="M0,%d "%H+" ".join("L%.1f,%.1f"%p for p in pts)+" L%d,%d Z"%(W,H)
    return f'<path d="{d}" fill="{fill}" {extra}/>'
def snow(pts,depth,seed):
    r=random.Random(seed);top=" ".join("L%.1f,%.1f"%p for p in pts)
    bot=" ".join("L%.1f,%.1f"%(x,y+depth*(0.4+0.6*abs(math.sin(x/37+seed)))+r.uniform(0,8)) for x,y in reversed(pts))
    return f'<path d="M{pts[0][0]},{pts[0][1]} {top} {bot} Z" fill="url(#snow)" opacity="0.85"/>'
s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
'''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1330"/><stop offset=".3" stop-color="#232a5e"/><stop offset=".48" stop-color="#6b5590"/><stop offset=".62" stop-color="#d98f72"/><stop offset="1" stop-color="#f0b483"/></linearGradient>
<linearGradient id="snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eefc"/><stop offset="1" stop-color="#9aa6d6" stop-opacity="0"/></linearGradient>
<linearGradient id="valley" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2149"/><stop offset="1" stop-color="#0a0d22"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="bigglow"><feGaussianBlur stdDeviation="9"/></filter>
<radialGradient id="town" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb35c" stop-opacity=".55"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
</defs>''',f'<rect width="{W}" height="{H}" fill="url(#sky)"/>']
for _ in range(160):
    x,y=random.uniform(0,W),random.uniform(0,330);s.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.uniform(.5,1.6):.1f}" fill="#fff" opacity="{random.uniform(.3,.9):.2f}"/>')
layers=[(400,95,1.0,11,"#5a5a92",80),(470,70,1.2,4,"#3b3f78",60),(540,50,1.4,9,"#272c5e",40)]
for base,amp,rough,seed,col,depth in layers:
    p=ridge(base,amp,rough,seed);s.append(poly(p,col));s.append(snow(p,depth,seed))
# valley floor
vf=[(x,600+18*math.sin(x/300)) for x in range(0,W+10,10)];s.append(poly(vf,"url(#valley)"))
# foreground hills
for base,col,sd,a in [(800,"#10153a",5,25),(870,"#090c24",6,18)]:
    p=ridge(base,a,0.3,sd);s.append(poly(p,col))
# town glows and lights
def road(t):  # winding highway through valley
    x=-50+t*(W+100);y=640+70*math.sin(t*5.2)+40*math.sin(t*11)
    return x,y
for cx,cy,rad in [(380,650,150),(820,630,180),(1250,665,150)]:
    s.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rad}" ry="{rad*0.35}" fill="url(#town)"/>')
for _ in range(900):
    t=random.random();x,y=road(t);cl=random.choice([380,820,1250])
    if random.random()<.7: x=random.gauss(cl,90);y=random.gauss(650,22)
    else: y+=random.gauss(0,35)
    c=random.choice(["#ffd27a","#ffb35c","#fff1c9","#ffcf8a"])
    s.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.uniform(.8,2.2):.1f}" fill="{c}" opacity="{random.uniform(.5,1):.2f}"/>')
pts=[road(i/400) for i in range(401)];d="M"+" L".join("%.1f,%.1f"%p for p in pts)
s.append(f'<path d="{d}" stroke="#ff7a2e" stroke-width="10" fill="none" opacity=".35" filter="url(#bigglow)"/>')
s.append(f'<path d="{d}" stroke="#ff9a3c" stroke-width="3.2" fill="none" filter="url(#glow)"/>')
d2="M"+" L".join("%.1f,%.1f"%(x,y+5) for x,y in pts)
s.append(f'<path d="{d2}" stroke="#fff3d6" stroke-width="2" fill="none" filter="url(#glow)" opacity=".9"/>')
if len(sys.argv)>1:
    s.append(f'<rect x="0" y="{H-190}" width="{W}" height="190" fill="#05071a" opacity=".55"/>')
    s.append(f'<text x="70" y="{H-110}" font-family="Georgia, serif" font-size="64" fill="#ffffff">{sys.argv[1]}, CO Market Update</text>')
    s.append(f'<text x="72" y="{H-55}" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="4" fill="#d9b45a">{sys.argv[2] if len(sys.argv)>2 else ""}  ·  EPIQUE REALTY</text>')
s.append('</svg>');print("\n".join(s))
