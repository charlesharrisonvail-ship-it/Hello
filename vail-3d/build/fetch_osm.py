"""Download Vail pistes, lifts, woods and restaurants from OpenStreetMap (Overpass), in small tiles.
Output: raw/osm/*.json. Re-run before each season to pick up new runs and lifts."""
import json, subprocess, time, os
from concurrent.futures import ThreadPoolExecutor
S, W, N, E = 39.555, -106.45, 39.66, -106.27
ny, nx = 8, 10
os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), "raw", "osm"), exist_ok=True)

def job(ij):
    i, j = ij
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), "raw", "osm", f"{i}_{j}.json")
    if os.path.exists(f):
        return
    s = S + (N - S) * i / ny; n = S + (N - S) * (i + 1) / ny
    w = W + (E - W) * j / nx; e = W + (E - W) * (j + 1) / nx
    bb = f"{s:.5f},{w:.5f},{n:.5f},{e:.5f}"
    q = (f'[out:json][timeout:50];(way["piste:type"="downhill"]({bb});way["aerialway"]({bb});'
         f'node["amenity"~"restaurant|cafe|bar"]({bb});way["natural"="wood"]({bb});'
         f'way["landuse"="forest"]({bb});way["highway"="motorway"]({bb}););out body geom;')
    for _ in range(6):
        r = subprocess.run(["curl", "-s", "--max-time", "80", "-G", "--data-urlencode", "data=" + q,
                            "https://maps.mail.ru/osm/tools/overpass/api/interpreter"],
                           capture_output=True, text=True)
        try:
            els = json.loads(r.stdout)["elements"]
            json.dump(els, open(f, "w"))
            print(bb, len(els), flush=True)
            return
        except Exception:
            time.sleep(5)
    print(bb, "FAIL", flush=True)

with ThreadPoolExecutor(4) as ex:
    list(ex.map(job, [(i, j) for i in range(ny) for j in range(nx)]))
