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
def orbit(f0,f1,c,r,h,a0,a1,th,n=7):
    for s in range(n):
        u=s/(n-1); a=math.radians(a0+(a1-a0)*u)
        key(f0+(f1-f0)*u,(c[0]+r*math.sin(a),c[1]+r*math.cos(a),h),(c[0],c[1],th))
VG=(22400,8300)          # between Vail Village and Golden Peak
# 1 opener: high from the north, the whole front side
key(0,   (21000,16500,5600),(22200,6000,3000))
key(140, (21600,13600,4700),(22300,7600,2700))
# 2 Vail Village + Golden Peak, wide arc from the north
orbit(200,380,VG,2700,3750,-35,45,2520)
# 3 up the Golden Peak side toward the ridge
key(440, (25200,9200,4200),(22900,6300,3100))
key(510, (24600,7200,4500),(23200,4600,3250))
# 4 over the ridge: the Back Bowls, long and slow
key(590, (23000,6400,4650),(23400,3300,3250))
key(680, (25200,6300,4750),(24200,3000,3200))
key(770, (27600,5400,4750),(24600,3200,3200))
key(860, (28300,3300,4700),(23800,3700,3200))
# 5 back over the top, looking down to the village with the Gore Range behind
key(950, (24200,1800,5000),(22600,6500,3000))
key(1040,(22800,4200,4650),(22300,8500,2550))
# 6 rise for the closing card
key(1200,(22300,3000,6200),(22300,9500,2900))
json.dump(K,open('path3.json','w'))
F=[k[0] for k in K]; P=[k[1] for k in K]
def cr(f):
    i=0
    while i<len(F)-2 and f>F[i+1]: i+=1
    u=min(1,max(0,(f-F[i])/(F[i+1]-F[i])))
    p0,p1,p2,p3=P[max(0,i-1)],P[i],P[i+1],P[min(len(P)-1,i+2)]
    return [0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u**3) for a,b,c,d in zip(p0,p1,p2,p3)]
w=sorted((cr(f)[2]-ground(*cr(f)[:2]),f) for f in range(0,1201,2))
print('lowest clearance:',[(round(a),b) for a,b in w[:5]])
