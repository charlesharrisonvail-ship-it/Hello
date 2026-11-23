# Beaver Creek: village, Birds of Prey, summit, Rose Bowl, Grouse, Larkspur, Bachelor Gulch, Arrowhead. 3600 frames, 120 s.
import math, json, numpy as np
d=np.fromfile('bdem.f32','<f4').reshape(1151,1301)
dem=np.fromfile('../vail/data/dem.f32','<f4').reshape(688,1456)
def ground(e,n):
    if 3500<e<16500 and -1500<n<10000: return float(d[int(round((10000-n)/10)),int(round((e-3500)/10))])
    return float(dem[int(round((13764-n)/13764*687)),int(round(e/29120*1455))])
K=[]
def key(f,p,t): K.append((f,list(p),list(t)))
def orbit(f0,f1,c,r,h,a0,a1,th,n):
    for s in range(n):
        u=s/(n-1); a=math.radians(a0+(a1-a0)*u)
        key(round(f0+(f1-f0)*u),(c[0]+r*math.sin(a),c[1]+r*math.cos(a),h),(c[0],c[1],th))
key(0,   (9300,12500,4300),(9900,2600,2900))        # whole mountain from over the valley
key(170, (9500,8600,3500),(9650,4700,2500))
key(290, (9620,6100,3150),(9640,4620,2470))         # drop toward the village
VC=(9640,4580)
orbit(360,900,VC,620,3080,10,-150,2470,10)          # slow orbit around Beaver Creek Village
key(960, (9500,4000,3080),(10244,2250,3050))        # turn up the hill
key(1060,(9800,3300,3380),(10244,2250,3100))        # up Centennial
key(1150,(10350,2700,3530),(9600,1500,3100))        # over Spruce Saddle, look at Birds of Prey
key(1260,(9000,3000,3280),(9700,1500,3150))         # Birds of Prey, looking up the course
key(1380,(9450,2300,3480),(10100,1000,3350))
key(1500,(10000,1600,3850),(10301,421,3450))        # climb to the summit
key(1620,(10600,500,3950),(11050,2200,3000))        # over the top, Rose Bowl below
key(1760,(11900,1300,3780),(10950,2300,3050))       # Rose Bowl
key(1880,(11300,600,3980),(9200,1300,3150))         # swing west toward Grouse
key(2000,(9900,900,3830),(8950,1700,3050))          # Grouse Mountain
key(2120,(9300,2400,3630),(8900,1500,3150))
key(2240,(8700,1400,3630),(7800,2350,3000))         # Larkspur Bowl
key(2340,(7900,3600,3480),(7500,5900,2700))         # down toward Bachelor Gulch
BG=(7570,6740)
orbit(2420,2800,BG,620,3090,170,40,2480,7)          # orbit Bachelor Gulch Village
key(2870,(6900,7400,3050),(5850,7900,2300))         # west to Arrowhead
AH=(5830,7880)
orbit(2940,3200,AH,600,2880,110,-10,2270,5)         # orbit Arrowhead Village
key(3330,(7000,10500,3700),(8500,4300,2700))        # pull back over the valley
key(3600,(7700,12800,4700),(9000,2800,2900))        # the whole resort for the close
json.dump(K,open('ski/path_bc.json','w'))
F=[k[0] for k in K]; P=[k[1] for k in K]
def cr(f):
    i=0
    while i<len(F)-2 and f>F[i+1]: i+=1
    u=min(1,max(0,(f-F[i])/(F[i+1]-F[i])))
    p0,p1,p2,p3=P[max(0,i-1)],P[i],P[i+1],P[min(len(P)-1,i+2)]
    return [0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d_)*u*u+(-a+3*b-3*c+d_)*u**3) for a,b,c,d_ in zip(p0,p1,p2,p3)]
w=sorted((cr(f)[2]-ground(*cr(f)[:2]),f) for f in range(0,3601,3))
print('lowest clearance:',[(round(a),b) for a,b in w[:8]])
