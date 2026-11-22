# Beaver Creek, Bachelor Gulch and Arrowhead ground from real NAIP aerial photos, winterized.
import csv, json, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
from pyproj import Transformer
Image.MAX_IMAGE_PIXELS=None
GX,GY,T,PX=5100,3500,1300,2048          # tile grid origin, tile metres, tile pixels
mos=Image.new('RGB',(5*PX,4*PX))
for r in range(4):
    for c in range(5): mos.paste(Image.open(f'dl/v_{r}_{c}.jpg'),(c*PX,(3-r)*PX))
nmos=Image.new('L',(5*1024,4*1024))
for r in range(4):
    for c in range(5): nmos.paste(Image.open(f'dl/n_{r}_{c}.jpg').convert('L'),(c*1024,(3-r)*1024))
nmos=nmos.resize(mos.size,Image.BILINEAR)
GN1=GY+4*T; MPM=PX/T                     # mosaic top north, px per metre
PATCH={'a':(7800,3500,10900,5600),'b':(6700,5600,8500,7400),'c':(5100,7000,6800,8700)}
t=Transformer.from_crs(4326,26913,always_xy=True)
B=json.load(open('buildings.json'))
ROWS=[r for r in csv.DictReader(open('roads.csv'))]
RIV=json.load(open('rivers.json'))
WID={'motorway':12,'trunk':11,'primary':10,'secondary':9,'tertiary':8,'residential':7,'unclassified':7,'living_street':6,'service':5,'pedestrian':6,'unknown':5}
RL=[]
for row in ROWS:
    if row['class'] not in WID: continue
    w=row['wkt'].strip()
    parts=w[len('MULTILINESTRING'):].strip()[1:-1].split('),') if w.startswith('MULTILINESTRING') else [w[len('LINESTRING'):].strip()]
    for p in parts:
        pts=[tuple(map(float,q.split())) for q in p.strip().strip('()').split(',')]
        x,y=t.transform([q[0] for q in pts],[q[1] for q in pts])
        RL.append((WID[row['class']],[(a-360123,b-4380285) for a,b in zip(x,y)]))
blur=lambda x,s:np.asarray(Image.fromarray((np.clip(x,0,1)*255).astype('u1')).filter(ImageFilter.GaussianBlur(s))).astype('f4')/255
alltrees={}
for key,(E0,N0,E1,N1) in PATCH.items():
    sc=1.6; W,H=int((E1-E0)*sc),int((N1-N0)*sc); sx=sy=sc
    P=lambda e,n:((e-E0)*sx,(N1-n)*sy)
    ph=mos.crop((int((E0-GX)*MPM),int((GN1-N1)*MPM),int((E1-GX)*MPM),int((GN1-N0)*MPM))).resize((W,H),Image.LANCZOS)
    a=np.asarray(ph).astype('f4')/255; r,g,b=a[...,0],a[...,1],a[...,2]
    v=a.max(-1); mn=a.min(-1); sat=(v-mn)/(v+1e-4); lum=0.3*r+0.59*g+0.11*b
    box=(int((E0-GX)*MPM),int((GN1-N1)*MPM),int((E1-GX)*MPM),int((GN1-N0)*MPM))
    nir=np.asarray(nmos.crop(box).resize((W,H),Image.BILINEAR)).astype('f4')/255
    nd=(nir-r)/(nir+r+1e-3); nb=blur(nir,1.5)
    veg=np.clip((nd-0.25)/0.1,0,1)
    con=np.clip(blur(veg*np.clip((0.47-nb)/0.09,0,1),1.4)*1.25,0,1)
    dec=np.clip(blur(veg*np.clip((nb-0.45)/0.08,0,1),1.2),0,1)*(1-con)
    bm=Image.new('L',(W,H),0); db=ImageDraw.Draw(bm)
    for bb in B:
        rr=bb['r'][0]
        if E0-60<rr[0][0]<E1+60 and N0-60<rr[0][1]<N1+60: db.polygon([P(e,n) for e,n in rr],fill=255)
    bm=blur(np.asarray(bm).astype('f4')/255,1.0)
    rm=Image.new('L',(W,H),0); drm=ImageDraw.Draw(rm)
    for wd,L in RL:
        if any(E0-50<e<E1+50 and N0-50<n<N1+50 for e,n in L): drm.line([P(e,n) for e,n in L],fill=255,width=int(wd*sx),joint='curve')
    rm=blur(np.asarray(rm).astype('f4')/255,1.5)
    pave=np.clip((0.12-sat)/0.06,0,1)*np.clip((v-0.25)/0.1,0,1)*(1-bm)*blur(np.clip(rm*4,0,1),6)
    road=np.clip(np.maximum(rm,pave*0.8),0,1)*(1-bm)
    snow=np.stack([0.93+0.05*lum,0.945+0.045*lum,0.98+0.02*lum],-1)
    roof=np.clip((a*0.62+snow*0.38-0.5)*1.08+0.52,0,1)
    tree=a*np.array([0.98,1.12,1.05])+0.075
    lq=np.clip(lum,0.30,0.62); st=(0.50+0.35*(lq-0.45))[...,None]*np.array([0.97,0.99,1.04])
    # bare aspen groves: grey twig texture over snow
    det=np.clip((lum-blur(lum,3))*3+0.5,0,1)
    asp=snow*0.86+(0.06+0.10*det)[...,None]*np.array([0.66,0.60,0.55])
    o=snow*(1-dec[...,None]*0.75)+asp*(dec[...,None]*0.75)
    o=o*(1-con[...,None])+tree*con[...,None]
    o=o*(1-road[...,None])+st*road[...,None]
    o=o*(1-bm[...,None])+roof*bm[...,None]
    im=Image.fromarray((np.clip(o,0,1)*255).astype('u1')); dr=ImageDraw.Draw(im)
    for rv in RIV:
        if rv['n'] not in ('Beaver Creek','Eagle River'): continue
        L=[P(e,n) for e,n in rv['c']]; big=rv['n']=='Eagle River'
        dr.line(L,fill=(234,238,245),width=int((26 if big else 9)*sx),joint='curve'); dr.line(L,fill=(86,114,134),width=int((16 if big else 3)*sx),joint='curve')
    o=np.asarray(im).astype('f4')
    yy,xx=np.mgrid[0:H,0:W]; edge=np.minimum.reduce([xx,W-1-xx,yy,H-1-yy]).astype('f4')
    al=np.clip(edge/(220*sx),0,1); al=al*al*(3-2*al)
    Image.fromarray(np.dstack([np.clip(o,0,255).astype('u1'),(al*255).astype('u1')])).save(f'ski/v_{key}.png')
    Image.fromarray(np.clip(o,0,255).astype('u1')).resize((W//4,H//4)).save(f'chk_{key}.jpg',quality=88)
    rng=np.random.default_rng(3); s=int(6*sx); cs=blur(con*(1-road)*(1-bm),3)[::s,::s]; pts=[]
    for j in range(cs.shape[0]):
        for i in range(cs.shape[1]):
            if cs[j,i]>0.45 and rng.random()<cs[j,i]*0.35:
                pts.append([round(E0+(i*s+rng.random()*s)/sx,1),round(N1-(j*s+rng.random()*s)/sy,1),round(9+rng.random()*10,1)])
    alltrees[key]=pts; print(key,W,H,'trees',len(pts),flush=True)
json.dump(sum(alltrees.values(),[]),open('ski/vtrees.json','w'),separators=(',',':'))
