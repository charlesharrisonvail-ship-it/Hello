# Builds the Vail -> Minturn -> Meadow Mountain -> Beaver Creek route on USGS terrain.
# Coordinates: metres east/north of UTM 13N (360123, 4380285). Place positions from USGS GNIS.
import heapq, json, math, numpy as np, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
S=sys.argv[1]  # scratchpad vail dir
dd=np.fromfile(S+'/ski/ddem.f32','<f4').reshape(1680,1312)      # 10 m, D=[16000,-4800,29120,12000]
dm=np.fromfile(S+'/data/dem.f32','<f4').reshape(688,1456)        # 20 m, MAIN=[0,0,29120,13764]
def ground(e,n):
    if 16000<e<29120 and -4800<n<12000: return float(dd[int(round((12000-n)/16800*1679)),int(round((e-16000)/13120*1311))])
    return float(dm[int(round((13764-n)/13764*687)),int(round(e/29120*1455))])
MT=np.asarray(Image.open(S+'/ski/m_tex.jpg').convert('L'),dtype=np.float32)/255  # winter map: runs bright, timber dark
def tree(e,n):
    H,W=MT.shape; i=int(e/29120*(W-1)); j=int((13764-n)/13764*(H-1))
    return float(MT[max(0,j-2):j+3,max(0,i-2):i+3].mean()<0.55)
def route(a,b,box,step,climb=40.0,low=0.0,trees=0.0):
    """least-cost walk: distance + penalty for climbing (+ optional preference for valley floors)"""
    x0,y0,x1,y1=box; nx,ny=int((x1-x0)/step)+1,int((y1-y0)/step)+1
    Z=np.array([[ground(x0+i*step,y0+j*step) for i in range(nx)] for j in range(ny)])
    T=np.array([[tree(x0+i*step,y0+j*step) for i in range(nx)] for j in range(ny)])
    s=(round((a[1]-y0)/step),round((a[0]-x0)/step)); t=(round((b[1]-y0)/step),round((b[0]-x0)/step))
    D={s:0}; P={}; q=[(0,s)]
    nb=[(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]
    while q:
        d,u=heapq.heappop(q)
        if u==t: break
        if d>D[u]: continue
        for dj,di in nb:
            v=(u[0]+dj,u[1]+di)
            if not(0<=v[0]<ny and 0<=v[1]<nx): continue
            L=math.hypot(dj,di)*step; dz=Z[v]-Z[u]
            c=L*(1+trees*T[v])+climb*max(0,dz)
            if d+c<D.get(v,1e18): D[v]=d+c; P[v]=u; heapq.heappush(q,(d+c,v))
    p=[t]
    while p[-1]!=s: p.append(P[p[-1]])
    pts=[(x0+i*step,y0+j*step) for j,i in reversed(p)]
    # smooth
    for _ in range(4): pts=[pts[0]]+[((pts[k-1][0]+2*pts[k][0]+pts[k+1][0])/4,(pts[k-1][1]+2*pts[k][1]+pts[k+1][1])/4) for k in range(1,len(pts)-1)]+[pts[-1]]
    return pts
def line(a,b,n=60): return [(a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n) for k in range(n+1)]
EN=(20893,6027); GCB=(21091,4947); MIN=(16950,3200); MTOP=(12600,2500); LARK=(11342,2914); BCV=(9786,4718)
seg=[
 dict(name='Minturn Mile',kind='existing',pts=line(EN,GCB,20)+route(GCB,MIN,(16400,2400,21600,5600),20,climb=60)[1:]),
 dict(name='Gondola',kind='proposed',pts=line(MIN,MTOP,80)),
 dict(name='Meadow Mountain to Beaver Creek',kind='proposed',pts=route(MTOP,LARK,(10600,1800,13200,3600),20,climb=60,trees=4)),
 dict(name='Down to Beaver Creek Village',kind='existing',pts=route(LARK,BCV,(9000,1500,11800,5200),20,climb=60,trees=6)[1:]),
]
tot=0
for s in seg:
    s['pts']=[[round(e),round(n),round(ground(e,n))] for e,n in s['pts']]
    L=sum(math.dist(a[:2],b[:2]) for a,b in zip(s['pts'],s['pts'][1:])); tot+=L
    print(f"{s['name']:34s} {L/1000:5.1f} km  {s['pts'][0][2]} -> {s['pts'][-1][2]} m  min {min(p[2] for p in s['pts'])} max {max(p[2] for p in s['pts'])}")
print('total km',round(tot/1000,1),'miles',round(tot/1609,1))
json.dump(seg,open(S+'/ski/route.json','w'))
