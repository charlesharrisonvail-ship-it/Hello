# Vail Village ground from real NAIP aerial photos, winterized: real roofs, plowed streets, conifers, snow.
import csv, json, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
from pyproj import Transformer
Image.MAX_IMAGE_PIXELS=None
SK=sys.argv[1]; NA=sys.argv[2]
E0,N0,E1,N1=20200,7000,23900,10900; W,H=6144,6476; sx=W/(E1-E0); sy=H/(N1-N0)
P=lambda e,n:((e-E0)*sx,(N1-n)*sy)
m=Image.open(NA)  # covers E0..E0+3900, N0..N0+3900 at 6144 px
ph=m.crop((0,0,int(3700/3900*6144),6144)).resize((W,H),Image.LANCZOS)
a=np.asarray(ph).astype('f4')/255
r,g,b=a[...,0],a[...,1],a[...,2]
v=a.max(-1); mn=a.min(-1); sat=(v-mn)/(v+1e-4); lum=0.3*r+0.59*g+0.11*b
blur=lambda x,s:np.asarray(Image.fromarray((np.clip(x,0,1)*255).astype('u1')).filter(ImageFilter.GaussianBlur(s))).astype('f4')/255
# conifers: dark, green-leaning, not blue/grey (shadows on roofs are grey)
con=np.clip((0.44-v)/0.12,0,1)*np.clip((g-b)*10+0.6,0,1)*np.clip((g-r)*6+1.0,0,1)
con=np.clip(blur(con,1.6)*1.25,0,1)
# masks from map data: building roofs and streets
t=Transformer.from_crs(4326,26913,always_xy=True)
B=json.load(open(SK+'/../data/buildings.json'))
bm=Image.new('L',(W,H),0); db=ImageDraw.Draw(bm)
for bb in B:
  rr=bb['r'][0]
  if E0-50<rr[0][0]<E1+50 and N0-50<rr[0][1]<N1+50: db.polygon([P(e,n) for e,n in rr],fill=255)
bm=blur(np.asarray(bm).astype('f4')/255,1.0)
def lines(w):
    w=w.strip()
    parts=w[len('MULTILINESTRING'):].strip()[1:-1].split('),') if w.startswith('MULTILINESTRING') else [w[len('LINESTRING'):].strip()]
    for p in parts:
        pts=[tuple(map(float,q.split())) for q in p.strip().strip('()').split(',')]
        x,y=t.transform([q[0] for q in pts],[q[1] for q in pts])
        yield [P(a_-360123,b_-4380285) for a_,b_ in zip(x,y)]
WID={'motorway':12,'primary':10,'secondary':9,'tertiary':8,'residential':7,'unclassified':7,'service':5,'pedestrian':7,'unknown':5}
rm=Image.new('L',(W,H),0); drm=ImageDraw.Draw(rm)
ROWS=list(csv.DictReader(open('roads.csv')))
for row in ROWS:
  if row['class'] in WID:
    for L_ in lines(row['wkt']): drm.line(L_,fill=255,width=int(WID[row['class']]*sx),joint='curve')
rm=blur(np.asarray(rm).astype('f4')/255,1.5)
# pavement seen in the photo (grey, low saturation) near roads also stays plowed
pave=np.clip((0.12-sat)/0.06,0,1)*np.clip((v-0.25)/0.1,0,1)*(1-bm)
pave=pave*blur(np.clip(rm*4,0,1),6)
road=np.clip(np.maximum(rm,pave*0.8),0,1)*(1-bm)
# snow: keeps a little of the ground's texture and shading
snow=np.stack([0.93+0.05*lum,0.945+0.045*lum,0.98+0.02*lum],-1)
# winter roofs: real roof colour, lightened with a dusting of snow
roof=a*0.62+snow*0.38
roof=np.clip((roof-0.5)*1.08+0.52,0,1)
# conifers: real crowns, a touch of frost, cooler
tree=a*np.array([0.85,0.95,0.95])+0.06
# plowed street: real asphalt, slightly cool, with snowbank edges handled by the snow around it
lq=np.clip(lum,0.30,0.62); st=(0.50+0.35*(lq-0.45))[...,None]*np.array([0.97,0.99,1.04])
o=snow.copy()
o=o*(1-con[...,None])+tree*con[...,None]
con=con*(1-road)*(1-bm)
o=o*(1-con[...,None])+0  if False else o
o=o*(1-road[...,None])+st*road[...,None]
o=o*(1-bm[...,None])+roof*bm[...,None]
# Gore Creek: open water with snowy banks
im=Image.fromarray((np.clip(o,0,1)*255).astype('u1')); dr=ImageDraw.Draw(im)
for p in json.load(open(SK+'/gore.json')):
  L_=[P(e,n) for e,n in p]
  dr.line(L_,fill=(234,238,245),width=int(14*sx),joint='curve'); dr.line(L_,fill=(62,92,116),width=int(7*sx),joint='curve')
o=np.asarray(im).astype('f4')
yy,xx=np.mgrid[0:H,0:W]; edge=np.minimum.reduce([xx,W-1-xx,yy,H-1-yy]).astype('f4')
al=np.clip(edge/(260*sx),0,1); al=al*al*(3-2*al)
Image.fromarray(np.dstack([np.clip(o,0,255).astype('u1'),(al*255).astype('u1')])).save(SK+'/v_tex.png')
Image.fromarray(np.clip(o,0,255).astype('u1')).crop((2330,3580,3530,4500)).save('chk.jpg',quality=90)
# 3D evergreens where the photo shows conifer crowns
rng=np.random.default_rng(3); pts=[]; s=int(6*sx)
cs=blur(con,3)[::s,::s]
for j in range(cs.shape[0]):
  for i in range(cs.shape[1]):
    if cs[j,i]>0.45 and rng.random()<cs[j,i]*0.2:
      e=E0+(i*s+rng.random()*s)/sx; n=N1-(j*s+rng.random()*s)/sy
      pts.append([round(e,1),round(n,1),round(9+rng.random()*10,1)])
json.dump(pts,open(SK+'/vtrees.json','w'),separators=(',',':'))
print('trees',len(pts))
