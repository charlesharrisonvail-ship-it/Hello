# Vail only: village (covered bridge + clock tower), then every Back Bowl, then Blue Sky Basin. 2700 frames, 90 s.
# Positions: lift ends from OpenSkiMap (OSM), bowls from OSM/GNIS, checked against Vail's 2026-27 trail maps.
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
CB=(22025,8568)
key(0,   (22000,15500,5300),(23200,5000,3000))      # all of Vail Mountain from the north
key(140, (22300,12000,4100),(22100,8600,2600))
key(250, (22150,9900,3350),(22020,8380,2500))      # come down over the village, still high
VC=(22020,8380)                                     # heart of the village, just south of the bridge
orbit(320,600,VC,450,3150,25,-35,2500,7)
key(660, (22150,8000,3350),(22600,5800,3250))       # rise up the hill out of the village
key(700, (22500,7600,3500),(22900,5300,3300))       # up the front side
key(800, (22200,5300,4700),(22300,3000,3100))       # over the top
key(900, (21000,1800,4450),(21400,4700,3150))       # Game Creek Bowl
key(1060,(22300,900,4400),(22560,3800,3150))        # Sun Down Bowl
key(1240,(23750,900,4400),(23950,3900,3200))        # Sun Up Bowl
key(1410,(24600,700,4400),(24750,3300,3150))        # Tea Cup Bowl
key(1570,(25500,900,4450),(25700,3900,3250))        # China Bowl
key(1730,(26400,1000,4450),(26530,3700,3250))       # Siberia Bowl
key(1880,(27300,1000,4450),(27400,3450,3200))       # Inner Mongolia
key(2020,(28050,1100,4450),(27900,3250,3200))       # Outer Mongolia
key(2130,(27700,3300,4550),(26400,600,3300))        # turn to Blue Sky Basin
key(2240,(27500,3000,4450),(27150,750,3350))        # Pete's Bowl
key(2350,(26600,2900,4350),(26150,900,3250))        # Big Rock Park, Lover's Leap
key(2450,(25950,2500,4350),(25731,-111,3450))       # Belle's Camp
key(2560,(24900,2400,4350),(25050,250,3300))        # Earl's Bowl
key(2700,(23800,5200,6300),(25300,1500,3200))       # pull back for the close
json.dump(K,open(S+'/ski/path_vail.json','w'))
F=[k[0] for k in K]; P=[k[1] for k in K]
def cr(f):
    i=0
    while i<len(F)-2 and f>F[i+1]: i+=1
    u=min(1,max(0,(f-F[i])/(F[i+1]-F[i])))
    p0,p1,p2,p3=P[max(0,i-1)],P[i],P[i+1],P[min(len(P)-1,i+2)]
    return [0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u**3) for a,b,c,d in zip(p0,p1,p2,p3)]
w=sorted((cr(f)[2]-ground(*cr(f)[:2]),f) for f in range(0,2701,3))
print('lowest clearance:',[(round(a),b) for a,b in w[:6]])
w2=sorted((cr(f)[2]-ground(*cr(f)[:2]),f) for f in range(650,2701,3))
print('lowest after village:',[(round(a),b) for a,b in w2[:4]])
