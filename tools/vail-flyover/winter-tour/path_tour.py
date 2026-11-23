import math, json, numpy as np
V='/tmp/claude-0/-home-user-Hello/863116ab-2ce1-5c1d-9df8-a85b81bffc0d/scratchpad/vail/data/'
dd=np.fromfile('ddem.f32','<f4').reshape(1680,1312)
dem=np.fromfile(V+'dem.f32','<f4').reshape(688,1456)
demw=np.fromfile(V+'demw.f32','<f4').reshape(896,1152)
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
VV,LH=(21960,8453),(20750,8750)
# A opener: all three mountains
key(0,   (-6500,15000,7800),(15200,5600,2800))
key(300, (-2500,13800,7000),(16800,5700,2800))
# B along the valley toward Golden Peak
key(390, (8500,14800,6600),(21000,7600,2700))
key(470, (21000,14200,5200),(22700,8100,2550))
# C up Golden Peak along the Riva Bahn, then Northwoods to the top
key(560, (23200,9900,3700),(23300,7300,2950))
key(670, (24000,8500,3850),(24100,6141,3200))
key(770, (24600,6900,4050),(23439,4507,3450))
key(850, (23900,5300,4250),(22800,4300,3450))
# D turn at the top, come back down the front side toward the village
key(950, (22900,4300,4250),(22000,8450,2550))
key(1040,(22400,6200,3800),(21960,8453,2500))
# E circle Vail Village
orbit(1100,1340,VV,1500,3350,165,40,2500,6)
# F pan back out
key(1420,(21800,12000,4300),(21300,8700,2550))
# G turn to Lionshead and circle it
orbit(1500,1740,LH,1500,3300,25,-160,2490,6)
# H up the mountain from Lionshead to Eagle's Nest and the ridge
key(1830,(20800,6600,4050),(21300,4800,3350))
key(1920,(21700,5400,4350),(22800,3300,3150))
# I Back Bowls, east along the bowls
key(2030,(23000,5300,4400),(23400,2800,3050))
key(2140,(24600,5400,4450),(24700,2900,3050))
key(2250,(26200,5300,4450),(26000,3000,3050))
# J Blue Sky Basin
key(2360,(27200,3200,4350),(25600,800,3150))
key(2470,(26800,1000,4250),(25300,-200,3150))
key(2560,(25000,2300,4250),(25200,300,3100))
# K pull back out for the closing card, over the bowls to the valley
key(2700,(25500,-2600,6600),(22500,6500,2800))
json.dump(K,open('path_tour.json','w'))
F=[k[0] for k in K]; P=[k[1] for k in K]
def cr(f):
    i=0
    while i<len(F)-2 and f>F[i+1]: i+=1
    u=min(1,max(0,(f-F[i])/(F[i+1]-F[i])))
    p0,p1,p2,p3=P[max(0,i-1)],P[i],P[i+1],P[min(len(P)-1,i+2)]
    return [0.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u**3) for a,b,c,d in zip(p0,p1,p2,p3)]
w=sorted((cr(f)[2]-ground(*cr(f)[:2]),f) for f in range(0,2701,3))
print('lowest clearance:',[(round(a),b) for a,b in w[:8]])
