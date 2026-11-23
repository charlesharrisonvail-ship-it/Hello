import math, json, numpy as np
dem=np.fromfile('data/dem.f32','<f4').reshape(688,1456)
demw=np.fromfile('data/demw.f32','<f4').reshape(896,1152)
def ground(e,n):
    if 0<e<29120 and 0<n<13764:
        return dem[int(round((13764-n)/13764*687)), int(round(e/29120*1455))]
    x0,y0,x1,y1=-20000,-20000,49125,33764
    return demw[int(round((y1-n)/(y1-y0)*895)), int(round((e-x0)/(x1-x0)*1151))]
K=[]
def key(f,p,t): K.append((f,p,t))
def orbit(f0,f1,c,r,h,a0,a1,th,n=8):
    for s in range(n):
        u=s/(n-1); a=math.radians(a0+(a1-a0)*u)
        key(f0+(f1-f0)*u,(c[0]+r*math.sin(a),c[1]+r*math.cos(a),h),(c[0],c[1],th))
VV,BC,AH,BB=(21960,8453),(9682,4642),(5748,8074),(23500,3200)
key(0,   (9000,17000,6200),(21500,6500,3000))
key(120, (15500,14200,5200),(21000,7000,2900))
orbit(220,420,VV,2800,3800,-50,60,2490)
key(470, (25600,9600,4500),(BB[0],BB[1],3300))
key(545, (26800,6900,4700),(23000,2600,3200))
key(615, (22000,10600,5000),(12000,5500,2700))
key(685, (14500,10300,4300),(BC[0],BC[1],2470))
orbit(720,890,BC,2700,3800,25,-45,2470)
key(950, (6500,10600,3600),(AH[0],AH[1],2250))
key(1020,(3600,10900,3500),(6000,7500,2300))
key(1110,(2000,14500,5500),(14000,6000,2800))
key(1260,(-1500,18500,8000),(15000,6000,2800))
json.dump(K,open('path2.json','w'))
# clearance along Catmull-Rom
F=[k[0] for k in K]; P=[k[1] for k in K]
def cr(f):
    i=0
    while i<len(F)-2 and f>F[i+1]: i+=1
    u=min(1,max(0,(f-F[i])/(F[i+1]-F[i])))
    p0,p1,p2,p3=P[max(0,i-1)],P[i],P[i+1],P[min(len(P)-1,i+2)]
    return [0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u**3) for a,b,c,d in zip(p0,p1,p2,p3)]
worst=[]
for f in range(0,1261,2):
    e,n,h=cr(f); worst.append((h-ground(e,n),f))
worst.sort(); print('lowest clearance (m above ground, frame):',[(round(a),b) for a,b in worst[:6]])
