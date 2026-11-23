import csv,json,numpy as np
from pyproj import Transformer
tr=Transformer.from_crs(4326,26913,always_xy=True)
dem=np.fromfile('bdem.f32','<f4').reshape(1151,1301)  # E 3500..16500, N -1500..10000, 10 m
def ground(xs,ys):
    i=np.clip(np.round((xs-3500)/10).astype(int),0,1300); j=np.clip(np.round((10000-ys)/10).astype(int),0,1150)
    return float(dem[j,i].min())
def rings_from_wkt(w):
    w=w.strip()
    polys=w[len('MULTIPOLYGON'):].strip()[1:-1].split(')),') if w.startswith('MULTIPOLYGON') else [w[len('POLYGON'):].strip()]
    out=[]
    for p in polys:
        p=p.strip().lstrip('(').rstrip(')');rings=[]
        for rg in p.split('),'):
            rg=rg.strip().lstrip('(').rstrip(')');rings.append([tuple(map(float,q.split())) for q in rg.split(',') if q.strip()])
        out.append(rings)
    return out
B=[]
for row in csv.DictReader(open('buildings.csv')):
    for rings in rings_from_wkt(row['wkt']):
        loc=[]
        for rg in rings:
            x,y=tr.transform(np.array([p[0] for p in rg]),np.array([p[1] for p in rg]));loc.append(np.stack([x-360123,y-4380285],1))
        xs,ys=loc[0][:,0],loc[0][:,1]
        if not(3600<xs.min() and xs.max()<16400 and -1400<ys.min() and ys.max()<9900):continue
        area=0.5*abs(np.dot(xs,np.roll(ys,1))-np.dot(ys,np.roll(xs,1)))
        if area<25:continue
        h=float(row['height']) if row['height'] else float(row['num_floors'])*3.4 if row['num_floors'] else (6.5 if area<200 else 9.5 if area<800 else 13)
        B.append({'z':round(ground(xs,ys),1),'h':round(min(max(h,4),45),1),'r':[[[round(float(p[0]),1),round(float(p[1]),1)] for p in rg] for rg in loc]})
json.dump(B,open('buildings.json','w'),separators=(',',':'));print(len(B))
