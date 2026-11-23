import urllib.request, urllib.parse, os, time, sys
X0,Y0=360123,4380285
NA='https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage'
DE='https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/exportImage'
def get(url,q,out):
    if os.path.exists(out) and os.path.getsize(out)>5000: return
    for k in range(8):
        try:
            d=urllib.request.urlopen(url+'?'+urllib.parse.urlencode(q),timeout=180).read()
            if len(d)>5000: open(out,'wb').write(d); print('ok',out,len(d),flush=True); return
        except Exception as e: print('retry',out,e,flush=True)
        time.sleep(5+k*5)
    print('FAIL',out,flush=True)
# detail DEM, 10 m: E 3500..16500, N -1500..10000
get(DE,dict(bbox=f'{X0+3500},{Y0-1500},{X0+16500},{Y0+10000}',bboxSR=26913,imageSR=26913,size='1301,1151',format='tiff',pixelType='F32',interpolation='RSP_BilinearInterpolation',f='image'),'dl/bdem.tif')
# mountain photo, 2 m: 4x3 tiles of 4096 m from (3500,-1500)
for r in range(3):
  for c in range(3):
    e0=3500+c*4096; n0=-1500+r*4096
    get(NA,dict(bbox=f'{X0+e0},{Y0+n0},{X0+e0+4096},{Y0+n0+4096}',bboxSR=26913,imageSR=26913,size='2048,2048',format='jpg',compressionQuality=92,f='image'),f'dl/m_{r}_{c}.jpg')
# villages, 0.63 m: 5x4 tiles of 1300 m from (5100,3500)
for r in range(4):
  for c in range(5):
    e0=5100+c*1300; n0=3500+r*1300
    get(NA,dict(bbox=f'{X0+e0},{Y0+n0},{X0+e0+1300},{Y0+n0+1300}',bboxSR=26913,imageSR=26913,size='2048,2048',format='jpg',compressionQuality=92,f='image'),f'dl/v_{r}_{c}.jpg')
print('DONE')
