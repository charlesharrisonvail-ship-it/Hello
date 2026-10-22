"""Download AWS Terrain Tiles (terrarium, zoom 14) for the Vail box and stitch them into raw/dem.npy."""
import math, subprocess, os, numpy as np
from PIL import Image
S,W,N,E = 39.555,-106.45,39.66,-106.27
z=14
def tile(lat,lon):
    n=2**z; x=(lon+180)/360*n
    y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n
    return x,y
x0,y0=tile(N,W); x1,y1=tile(S,E)
tx=range(int(x0),int(x1)+1); ty=range(int(y0),int(y1)+1)
HERE=os.path.dirname(os.path.abspath(__file__)); os.makedirs(os.path.join(HERE,"raw","tiles"),exist_ok=True)
rows=[]
for y in ty:
    row=[]
    for x in tx:
        f=os.path.join(HERE,"raw","tiles",f"{z}_{x}_{y}.png")
        if not os.path.exists(f):
            subprocess.run(["curl","-s","--max-time","40","-o",f,f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"])
        a=np.asarray(Image.open(f).convert("RGB")).astype(np.float64)
        row.append(a[:,:,0]*256+a[:,:,1]+a[:,:,2]/256-32768)
    rows.append(np.hstack(row))
h=np.vstack(rows)
# crop to bbox in pixel space
px0=int((x0-tx[0])*256); px1=int((x1-tx[0])*256); py0=int((y0-ty[0])*256); py1=int((y1-ty[0])*256)
h=h[py0:py1,px0:px1]
print(h.shape,h.min(),h.max())
np.save(os.path.join(HERE,"raw","dem.npy"),h)
