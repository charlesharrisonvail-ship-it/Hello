import urllib.request, urllib.parse, os, time
from concurrent.futures import ThreadPoolExecutor
X0,Y0=360123,4380285
NA='https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage'
def job(rc):
    r,c=rc; out=f'dl/n_{r}_{c}.jpg'
    if os.path.exists(out): return
    e0=5100+c*1300; n0=3500+r*1300
    q=dict(bbox=f'{X0+e0},{Y0+n0},{X0+e0+1300},{Y0+n0+1300}',bboxSR=26913,imageSR=26913,size='1024,1024',format='jpg',bandIds=3,compressionQuality=92,f='image')
    for k in range(10):
        try:
            d=urllib.request.urlopen(NA+'?'+urllib.parse.urlencode(q),timeout=180).read()
            if len(d)>5000: open(out,'wb').write(d); print('ok',out,flush=True); return
        except Exception as e: print('retry',out,e,flush=True)
        time.sleep(5+k*3)
    print('FAIL',out,flush=True)
with ThreadPoolExecutor(4) as ex: list(ex.map(job,[(r,c) for r in range(4) for c in range(5)]))
print('DONE')
