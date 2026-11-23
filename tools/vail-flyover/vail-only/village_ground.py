# Clean, sharp winter ground for Vail Village: plowed streets, I-70, Gore Creek, snow, forest shade; tree points for 3D trees.
import csv, json, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
from pyproj import Transformer
Image.MAX_IMAGE_PIXELS=None
SK=sys.argv[1]
E0,N0,E1,N1=20200,7000,23900,10900; W,H=4096,4318; sx=W/(E1-E0); sy=H/(N1-N0)
P=lambda e,n:((e-E0)*sx,(N1-n)*sy)
# hillshade from the 10 m DEM
dd=np.fromfile(SK+'/ddem.f32','<f4').reshape(1680,1312)
i0=int((E0-16000)/10);i1=int((E1-16000)/10)+1;j0=int((12000-N1)/10);j1=int((12000-N0)/10)+1
z=np.array(Image.fromarray(dd[j0:j1,i0:i1]).resize((W,H),Image.BICUBIC))
gy,gx=np.gradient(z,1/sy,1/sx); nx,ny=-gx,gy; L=np.array([-0.55,0.45,0.7]);L/=np.linalg.norm(L)
sh=(nx*L[0]+ny*L[1]+L[2])/np.sqrt(nx*nx+ny*ny+1)
sh=np.clip(0.97+0.45*(sh-0.82),0.72,1.03)
rng=np.random.default_rng(3)
grain=np.array(Image.fromarray((rng.random((H//2,W//2))*255).astype('u1')).resize((W,H),Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))).astype('f4')/255
snow=np.stack([0.94*sh,0.96*sh,1.0*sh],-1)*(0.975+0.05*grain[...,None])
# forest shade from the existing winter texture
dt=Image.open(SK+'/d_tex.jpg');DW,DH=dt.size
cx0=(E0-16000)/13120*DW;cx1=(E1-16000)/13120*DW;cy0=(12000-N1)/16800*DH;cy1=(12000-N0)/16800*DH
a=np.asarray(dt.crop((int(cx0),int(cy0),int(cx1),int(cy1))).resize((W,H),Image.BILINEAR)).astype('f4')/255
v=a.max(-1); forest=np.clip((0.55-v)/0.15,0,1)
forest=np.asarray(Image.fromarray((forest*255).astype('u1')).filter(ImageFilter.GaussianBlur(3))).astype('f4')/255
img=snow*(1-0.30*forest[...,None])+np.array([0.80,0.84,0.88])*0.30*forest[...,None]*sh[...,None]
im=Image.fromarray((np.clip(img,0,1)*255).astype('u1'))
# roads
t=Transformer.from_crs(4326,26913,always_xy=True)
def lines(w):
    w=w.strip()
    if w.startswith('MULTILINESTRING'): parts=w[len('MULTILINESTRING'):].strip()[1:-1].split('),')
    else: parts=[w[len('LINESTRING'):].strip()]
    for p in parts:
        pts=[tuple(map(float,q.split())) for q in p.strip().strip('()').split(',')]
        x,y=t.transform([q[0] for q in pts],[q[1] for q in pts])
        yield [P(a-360123,b-4380285) for a,b in zip(x,y)]
WID={'motorway':11,'primary':9,'secondary':8,'tertiary':7,'residential':6,'unclassified':6,'service':4,'pedestrian':6,'unknown':4}
ROWS=list(csv.DictReader(open('roads.csv')))
dr=ImageDraw.Draw(im)
order=['service','unknown','unclassified','residential','tertiary','secondary','primary','motorway','pedestrian']
for pas in ('bank','road'):
  for cl in order:
    for r in ROWS:
      if r['class']!=cl: continue
      w=WID[cl]*sx
      for L_ in lines(r['wkt']):
        if pas=='bank': dr.line(L_,fill=(250,252,255),width=int(w+2.4*sx),joint='curve')
        else:
          col=(160,150,138) if cl=="pedestrian" else (128,131,138) if cl=="motorway" else (146,149,156)
          dr.line(L_,fill=col,width=int(w),joint='curve')
# lane lines on I-70
for r in ROWS:
  if r['class']=='motorway':
    for L_ in lines(r['wkt']): dr.line(L_,fill=(205,200,170),width=max(1,int(0.35*sx)))
# footpaths: packed snow
for r in ROWS:
  if r['class'] in ('footway','path','cycleway','steps','track'):
    for L_ in lines(r['wkt']): dr.line(L_,fill=(232,236,242),width=int(1.6*sx))
# Gore Creek: open water with snowy banks
G=json.load(open(SK+'/gore.json'))
for p in G:
  L_=[P(e,n) for e,n in p]
  dr.line(L_,fill=(236,240,247),width=int(18*sx),joint='curve'); dr.line(L_,fill=(70,104,132),width=int(9*sx),joint='curve')
# building drop shadows (soft) - buildings themselves are 3D
B=json.load(open(SK+'/../data/buildings.json'))
shd=Image.new('L',(W,H),0);ds=ImageDraw.Draw(shd)
for b in B:
  r=b['r'][0]
  if not(E0<r[0][0]<E1 and N0<r[0][1]<N1): continue
  ds.polygon([P(e+2.5,n-2.5) for e,n in r],fill=90)
shd=np.asarray(shd.filter(ImageFilter.GaussianBlur(2.5))).astype('f4')/255
o=np.asarray(im).astype('f4')*(1-0.18*shd[...,None])
# feather the patch edge so it melts into the mountain texture
yy,xx=np.mgrid[0:H,0:W]; edge=np.minimum.reduce([xx,W-1-xx,yy,H-1-yy]).astype('f4')
al=np.clip(edge/(260*sx),0,1); al=al*al*(3-2*al)
Image.fromarray(np.dstack([np.clip(o,0,255).astype('u1'),(al*255).astype('u1')])).save(SK+'/v_tex.png')
# tree points: forest density, jittered grid every 7 m
pts=[]
fs=forest[::int(7*sy),::int(7*sx)]
for j in range(fs.shape[0]):
  for i in range(fs.shape[1]):
    if rng.random()<fs[j,i]*0.9:
      e=E0+(i*int(7*sx)+rng.random()*7*sx)/sx; n=N1-(j*int(7*sy)+rng.random()*7*sy)/sy
      pts.append([round(e,1),round(n,1),round(9+rng.random()*11,1)])
json.dump(pts,open(SK+'/vtrees.json','w'),separators=(',',':'))
print('trees',len(pts))
