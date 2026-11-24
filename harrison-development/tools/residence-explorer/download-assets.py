import json,urllib.request,os,sys
def get(u):
    with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'curl/8.5.0'}),timeout=90) as r: return r.read()
models=['mid_century_lounge_chair','modern_arm_chair_01','modern_ceiling_lamp_01','coffee_table_round_01','modern_wooden_cabinet','potted_plant_01','potted_plant_02','wooden_display_shelves_01','dining_chair_02','side_table_01','fir_tree_01','pine_tree_01','rock_moss_set_01','boulder_01','stone_fire_pit']
for m in models:
    d=json.loads(get(f'https://api.polyhaven.com/files/{m}'))
    g=d['gltf']['1k']['gltf'];base=f'raw/{m}/';os.makedirs(base,exist_ok=True)
    open(base+m+'.gltf','wb').write(get(g['url']))
    for rel,info in g.get('include',{}).items():
        os.makedirs(os.path.dirname(base+rel) or base,exist_ok=True);open(base+rel,'wb').write(get(info['url']))
    print('model',m,sum(os.path.getsize(os.path.join(r,f)) for r,_,fs in os.walk(base) for f in fs)//1024,'KB',flush=True)
tex={'laminate_floor_02':'floor','castle_wall_slates':'stone','black_painted_planks':'clad','corrugated_iron_02':'roof','plaster_grey_04':'plaster','dark_wooden_planks':'deck','concrete_floor_02':'patio'}
for t,n in tex.items():
    d=json.loads(get(f'https://api.polyhaven.com/files/{t}'))
    for key,suf in [('Diffuse','diff'),('nor_gl','nor'),('arm','arm')]:
        if key in d: open(f'tex/{n}_{suf}.jpg','wb').write(get(d[key]['1k']['jpg']['url']))
    print('tex',t,flush=True)
d=json.loads(get('https://api.polyhaven.com/files/evening_road_01_puresky'));open('tex/sky_1k.hdr','wb').write(get(d['hdri']['1k']['hdr']['url']));print('hdri ok')
B='https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb'
os.makedirs('raw/GlamVelvetSofa',exist_ok=True);open('raw/GlamVelvetSofa/GlamVelvetSofa.glb','wb').write(get(B));print('sofa ok')
