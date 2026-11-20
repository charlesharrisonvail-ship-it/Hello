# Camera keys for the Vail -> Minturn -> Meadow Mountain -> Beaver Creek concept flyover (1260 frames, 42 s)
import math, json, sys, numpy as np
S=sys.argv[1]
dd=np.fromfile(S+'/ski/ddem.f32','<f4').reshape(1680,1312)
dem=np.fromfile(S+'/data/dem.f32','<f4').reshape(688,1456)
demw=np.fromfile(S+'/data/demw.f32','<f4').reshape(896,1152)
def ground(e,n):
    if 16000<e<29120 and -4800<n<12000: return dd[int(round((12000-n)/16800*1679)),int(round((e-16000)/13120*1311))]
    if 0<e<29120 and 0<n<13764: return dem[int(round((13764-n)/13764*687)),int(round(e/29120*1455))]
    return demw[int(round((33764-n)/53764*895)),int(round((e+20000)/69125*1151))]
K=[]
def key(f,p,t): K.append((f,p,t))
def orbit(f0,f1,c,r,h,a0,a1,th,n):
    for s in range(n):
        u=s/(n-1); a=math.radians(a0+(a1-a0)*u)
        key(round(f0+(f1-f0)*u),(c[0]+r*math.sin(a),c[1]+r*math.cos(a),h),(c[0],c[1],th))
MIN=(16950,3100)
key(0,   (30500,10500,8400),(12500,3800,2700))      # up-valley view: Vail near, Minturn, Beaver Creek beyond
key(130, (27500,9800,7000),(14300,4200,2800))
key(220, (22600,10000,4900),(20900,5600,3000))      # Eagle's Nest
key(320, (21000,7700,5300),(19800,4700,2900))       # down Game Creek (Minturn Mile)
key(410, (18900,6900,5000),(17800,4000,2600))
orbit(470,640,MIN,1700,3500,35,-55,2400,5)          # around Minturn, over the Eagle River
key(700, (15800,3750,3050),(14700,2830,2800))       # close along the gondola
key(790, (14100,3550,3200),(13200,2650,3000))       # up Meadow Mountain
key(860, (13300,3800,3400),(12500,2480,3050))
key(930, (12200,5800,4100),(11000,3000,2900))       # over to Beaver Creek
key(1000,(11300,7300,4000),(9800,4400,2500))        # Beaver Creek Village
key(1110,(20000,9500,6400),(13500,3700,2700))
key(1260,(29500,10800,8400),(13500,3600,2700))      # pull back, whole route
json.dump(K,open(S+'/ski/path_connect.json','w'))
F=[k[0] for k in K]; P=[k[1] for k in K]
def cr(f):
    i=0
    while i<len(F)-2 and f>F[i+1]: i+=1
    u=min(1,max(0,(f-F[i])/(F[i+1]-F[i])))
    p0,p1,p2,p3=P[max(0,i-1)],P[i],P[i+1],P[min(len(P)-1,i+2)]
    return [0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u**3) for a,b,c,d in zip(p0,p1,p2,p3)]
w=sorted((cr(f)[2]-ground(*cr(f)[:2]),f) for f in range(0,1261,3))
print('lowest clearance:',[(round(a),b) for a,b in w[:6]])
