"""All-winter, trail-map-style textures for the Vail flyover.
Snow everywhere, painterly blue shadows from the DEM, dark frosted timber from the
NAIP forest mask, runs (OpenSkiMap/OSM) cleared white, lifts drawn as dark lines."""
import json, numpy as np, os
from PIL import Image, ImageDraw, ImageFilter
Image.MAX_IMAGE_PIXELS=None
V='/tmp/claude-0/-home-user-Hello/863116ab-2ce1-5c1d-9df8-a85b81bffc0d/scratchpad/vail/data/'
ski=json.load(open('../ski/ski_local.json'))
rng=np.random.default_rng(7)

def stylize(rgb, dem, ext, out, px_m):
    x0,y0,x1,y1=ext; H,W=rgb.shape[:2]
    a=rgb.astype('f4')/255; r,g,b=a[...,0],a[...,1],a[...,2]; v=a.max(-1); sat0=(v-a.min(-1))/(v+1e-4)
    e=np.array(Image.fromarray(dem).resize((W,H),Image.BILINEAR))
    # hillshade
    gy,gx=np.gradient(e,px_m); az,alt=np.radians(300),np.radians(38)
    slope=np.arctan(np.hypot(gx,gy)); aspect=np.arctan2(-gx,gy)
    hs=np.sin(alt)*np.cos(slope)+np.cos(alt)*np.sin(slope)*np.cos(az-aspect)
    hs=np.clip((hs-0.15)/0.85,0,1)
    # forest from summer photo: dark and green-leaning
    vb=np.asarray(Image.fromarray((v*255).astype('u1')).filter(ImageFilter.GaussianBlur(max(1,3/px_m)))).astype('f4')/255
    low=e<3500
    thr=np.percentile(vb[low],38) if low.any() else 0.2
    forest=np.clip((thr-vb)/0.035+0.5,0,1)*np.clip((g-b)*8+0.8,0,1)
    forest[e>3500]=0
    forest[(e<2560)&(sat0<0.12)]=0
    fm=Image.fromarray((forest*255).astype('u1'))
    # clear runs
    d=ImageDraw.Draw(fm)
    P=lambda p:((p[0]-x0)/(x1-x0)*W,(y1-p[1])/(y1-y0)*H)
    for f in ski['runs']:
        if f['t']=='Polygon':
            d.polygon([P(p) for p in f['c'][0]],fill=0)
        elif f['t']=='LineString':
            d.line([P(p) for p in f['c']],fill=0,width=max(2,int(28/px_m)))
    fm=fm.filter(ImageFilter.GaussianBlur(max(0.6,1.2/px_m)))
    forest=np.asarray(fm).astype('f4')/255
    # tree texture: speckled dark timber with frosted highlights
    n=rng.random((H,W)).astype('f4')
    tree=np.stack([0.06+0.04*n,0.13+0.05*n,0.10+0.04*n],-1)*(0.7+0.6*hs[...,None])
    frost=(n>0.86).astype('f4')[...,None]*0.35
    tree=tree*(1-frost)+np.array([0.85,0.9,0.95])*frost
    snow_lit=np.array([0.98,0.985,1.0]); snow_sh=np.array([0.58,0.67,0.84])
    snow=snow_sh+(snow_lit-snow_sh)*(hs[...,None]**0.8)
    # valley floor: plowed roads/town in soft grey where the photo is grey and low
    sat=(v-a.min(-1))/(v+1e-4)
    built=((sat<0.10)&(v>0.30)&(v<0.75)&(e<2600)).astype('f4')
    built=np.asarray(Image.fromarray((built*255).astype('u1')).filter(ImageFilter.GaussianBlur(1))).astype('f4')/255*0.55
    col=snow*(1-forest[...,None])+tree*forest[...,None]
    col=col*(1-built[...,None])+np.array([0.74,0.76,0.80])*hs[...,None]**0.5*built[...,None]
    img=Image.fromarray((np.clip(col,0,1)*255).astype('u1'))
    d=ImageDraw.Draw(img)
    for f in ski['lifts']:
        if f['t']=='LineString':
            d.line([P(p) for p in f['c']],fill=(38,40,48),width=max(2,int(4/px_m)))
    img.save(out,quality=92); print('wrote',out,img.size)


# Beaver Creek detail layer: E 3500..15500, N -1500..10000, 2 m photo, 10 m DEM
mos=Image.new('RGB',(6144,6144))
for r in range(3):
    for c in range(3): mos.paste(Image.open(f'dl/m_{r}_{c}.jpg'),(c*2048,(2-r)*2048))
mos=mos.crop((0,394,6000,6144))
dem=np.fromfile('bdem.f32','<f4').reshape(1151,1301)[:,:1201].copy()
dem.astype('<f4').tofile('ski/bdem_d.f32'); print('dem',dem.shape)
stylize(np.asarray(mos),dem,(3500,-1500,15500,10000),'ski/b_tex.jpg',2.0)
