import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/examples/jsm/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {A,SPR} from './assets.js';

const QS=new URLSearchParams(location.search);const CAPTURE=QS.has('capture');const EMBED=window.parent!==window;const LIGHT=!CAPTURE&&(matchMedia('(max-width: 760px)').matches||(navigator.hardwareConcurrency||8)<=4);const Q=(QS.get('q')||'').split(',').concat(LIGHT?['nomsaa','noao']:[]);
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s);
const canvas=$('#c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(CAPTURE?1:Math.min(devicePixelRatio,1.5));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(32,1,1.5,1200);
const snapCam=new THREE.PerspectiveCamera(60,4/3,0.1,1200);

function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=rng(11);
// The front yard: one gently curving dry-stack wall line, west end by the wing to east end by the entry.
const YC=new THREE.CatmullRomCurve3([[-8.0,3.5],[-9.7,8.2],[-7.6,12.3],[-3.0,13.9],[1.8,13.3],[6.6,14.1],[11.2,12.6],[14.0,8.6],[13.4,3.2],[10.6,-1.8]].map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal');
const YP=YC.getSpacedPoints(420).map(v=>[v.x,v.z]);
const YCUM=[0];for(let i=1;i<YP.length;i++)YCUM.push(YCUM[i-1]+Math.hypot(YP[i][0]-YP[i-1][0],YP[i][1]-YP[i-1][1]));const YLEN=YCUM[YCUM.length-1];
function yardInfo(x,z){let best=1e9,cr=0,si=0;for(let i=0;i<YP.length-1;i++){const[ax,az]=YP[i],[bx2,bz]=YP[i+1];const dx=bx2-ax,dz=bz-az;let u=((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz);u=Math.max(0,Math.min(1,u));const px=ax+dx*u,pz=az+dz*u;const d=(x-px)**2+(z-pz)**2;if(d<best){best=d;cr=dx*(z-az)-dz*(x-ax);si=YCUM[i]+u*Math.hypot(dx,dz)}}return{d:Math.sqrt(best),inside:cr<0,s:si}}
function atS(s){let i=1;while(i<YP.length-1&&YCUM[i]<s)i++;const u=(s-YCUM[i-1])/((YCUM[i]-YCUM[i-1])||1);const tx=YP[i][0]-YP[i-1][0],tz=YP[i][1]-YP[i-1][1],l=Math.hypot(tx,tz);return{x:YP[i-1][0]+tx*u,z:YP[i-1][1]+tz*u,tx:tx/l,tz:tz/l,nx:-tz/l,nz:tx/l}}

// ---------- asset loading ----------
const texL=new THREE.TextureLoader();const TX={};
async function loadTex(k,srgb){const t=await texL.loadAsync(A[k]);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(srgb)t.colorSpace=THREE.SRGBColorSpace;return t}
async function pbrSet(name,tile,rot=0){const s={};for(const[k,srgb]of[['diff',1],['nor',0],['arm',0]]){const t=await loadTex(`${name}_${k}`,srgb);t.repeat.set(1/tile,1/tile);if(rot){t.center.set(.5,.5);t.rotation=rot}s[k]=t}TX[name]=s}
const M={};
async function loadModels(){const gl=new GLTFLoader();await Promise.all(['mid_century_lounge_chair','modern_arm_chair_01','modern_ceiling_lamp_01','coffee_table_round_01','modern_wooden_cabinet','potted_plant_01','potted_plant_02','wooden_display_shelves_01','dining_chair_02','side_table_01','rock_moss_set_01','boulder_01','stone_fire_pit','grass_medium_01','fern_02','velvet_sofa'].map(async k=>{const g=await gl.loadAsync(A[k]);g.scene.traverse(o=>{if(o.isLight)o.visible=false});M[k]=g.scene}))}

// ---------- geometry helpers ----------
function boxGeo(w,h,d){const g=new THREE.BoxGeometry(w,h,d);const uv=g.attributes.uv;const dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let i=0;i<4;i++){const k=f*4+i;uv.setXY(k,uv.getX(k)*dims[f][0],uv.getY(k)*dims[f][1])}return g}
function bx(g,x0,x1,y0,y1,z0,z1,mat,cast=true){const me=new THREE.Mesh(boxGeo(Math.abs(x1-x0),Math.abs(y1-y0),Math.abs(z1-z0)),mat);me.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);me.castShadow=cast;me.receiveShadow=true;g.add(me);return me}
function rbx(g,x0,x1,y0,y1,z0,z1,mat,r=.06){const w=Math.abs(x1-x0),h=Math.abs(y1-y0),d=Math.abs(z1-z0);const me=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/2.01,h/2.01,d/2.01)),mat);me.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);me.castShadow=true;me.receiveShadow=true;g.add(me);return me}
function cyl(g,r,h,x,y,z,mat,seg=24,rt){const me=new THREE.Mesh(new THREE.CylinderGeometry(rt??r,r,h,seg),mat);me.position.set(x,y+h/2,z);me.castShadow=true;me.receiveShadow=true;g.add(me);return me}
function sph(g,r,x,y,z,mat){const me=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat);me.position.set(x,y,z);g.add(me);return me}
function piece(g,x,z,rot,fn){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=rot;fn(p);g.add(p);return p}
const T2=.11;
function wallX(g,x0,x1,z,h,mat,gaps=[]){let a=x0;for(const[g0,g1]of[...gaps,[x1,x1]]){if(g0>a)bx(g,a,g0,0,h,z-T2,z+T2,mat);if(g1>g0&&g1<x1)bx(g,g0,g1,2.2,h,z-T2,z+T2,mat);a=g1}}
function wallZ(g,z0,z1,x,h,mat,gaps=[]){let a=z0;for(const[g0,g1]of[...gaps,[z1,z1]]){if(g0>a)bx(g,x-T2,x+T2,0,h,a,g0,mat);if(g1>g0&&g1<z1)bx(g,x-T2,x+T2,2.2,h,g0,g1,mat);a=g1}}
function glassX(g,x0,x1,z,y0,y1,L,step=1.75){bx(g,x0,x1,y0,y1,z-.02,z+.02,L.glass,false);const n=Math.max(1,Math.round((x1-x0)/step));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;bx(g,x-.04,x+.04,y0,y1,z-.07,z+.07,L.mull)}bx(g,x0,x1,y1-.08,y1,z-.08,z+.08,L.mull);bx(g,x0,x1,y0,y0+.06,z-.08,z+.08,L.mull)}
function cableX(g,x0,x1,z,L){const n=Math.max(1,Math.round((x1-x0)/1.6));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;bx(g,x-.035,x+.035,0,1.05,z-.035,z+.035,L.blackM)}bx(g,x0,x1,1.0,1.07,z-.06,z+.06,L.oak);for(const y of[.18,.38,.58,.78])bx(g,x0,x1,y,y+.012,z-.006,z+.006,L.brass,false)}
function cableZ(g,z0,z1,x,L){const n=Math.max(1,Math.round((z1-z0)/1.6));for(let i=0;i<=n;i++){const z=z0+(z1-z0)*i/n;bx(g,x-.035,x+.035,0,1.05,z-.035,z+.035,L.blackM)}bx(g,x-.06,x+.06,1.0,1.07,z0,z1,L.oak);for(const y of[.18,.38,.58,.78])bx(g,x-.006,x+.006,y,y+.012,z0,z1,L.brass,false)}
function glassZ(g,z0,z1,x,y0,y1,L,step=1.75){bx(g,x-.02,x+.02,y0,y1,z0,z1,L.glass,false);const n=Math.max(1,Math.round((z1-z0)/step));for(let i=0;i<=n;i++){const z=z0+(z1-z0)*i/n;bx(g,x-.07,x+.07,y0,y1,z-.04,z+.04,L.mull)}bx(g,x-.08,x+.08,y1-.08,y1,z0,z1,L.mull);bx(g,x-.08,x+.08,y0,y0+.06,z0,z1,L.mull)}
function shapeWall(g,pts,z,depth,mat){const s=new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],p[1])));const geo=depth>0?new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false}):new THREE.ShapeGeometry(s);const me=new THREE.Mesh(geo,mat);me.position.z=z-(depth>0?depth/2:0);me.castShadow=depth>0;me.receiveShadow=true;g.add(me);return me}

// ---------- materials ----------
function makeMats(){
  const list=[];const m=(o,C=THREE.MeshStandardMaterial)=>{const x=new C(o);x.userData.op=o.opacity??1;x.userData.tr=!!o.transparent;list.push(x);return x};
  const P=(n,o={})=>({map:TX[n].diff,normalMap:TX[n].nor,roughnessMap:TX[n].arm,aoMap:TX[n].arm,...o});
  const fab=(c,sh=0xffffff)=>m({color:c,roughness:.95,sheen:1,sheenRoughness:.55,sheenColor:new THREE.Color(sh)},THREE.MeshPhysicalMaterial);
  return{list,m,
    stone:m(P('stone',{normalScale:new THREE.Vector2(1.4,1.4)})),clad:m(P('clad',{color:0x8c939a})),plaster:m({color:0xd6d2cb,roughness:.92,normalMap:TX.plaster.nor,normalScale:new THREE.Vector2(.12,.12)}),
    floor:m(P('floor',{color:0xf4efe8})),slab:m({color:0x2a2e33,roughness:.9}),deck:m(P('deck',{color:0x9c9590})),patio:m(P('patio',{color:0x8a8782})),
    roof:m(P('roof',{color:0x3a4047,metalness:.65,metalnessMap:TX.roof.arm})),
    glass:m({color:0xbfd3e6,transparent:true,opacity:.12,roughness:.02,metalness:.0,emissive:0xffb46b,emissiveIntensity:.04,depthWrite:false,side:THREE.DoubleSide,envMapIntensity:1.1}),
    mull:m({color:0x111315,roughness:.35,metalness:.6}),dark:m({color:0x1e2226,roughness:.6}),
    boucle:fab(0xd9d4cb),charF:fab(0x4a4f56,0x9aa3ad),slateF:fab(0x56708a,0xa9c0d6),sageF:fab(0x7d9078,0xd0dcc8),sandF:fab(0xb7a58c,0xf0e2cc),
    linen:fab(0xf0eee9),white:m({color:0xf4f5f6,roughness:.25,clearcoat:.6},THREE.MeshPhysicalMaterial),
    oak:m(P('floor',{color:0xd9c3a2})),walnut:m({color:0x4a3a2e,roughness:.45}),
    quartz:m({color:0xeceeef,roughness:.12,clearcoat:1,clearcoatRoughness:.08},THREE.MeshPhysicalMaterial),
    rugA:m({color:0x8e98a2,roughness:1}),rugB:m({color:0x3f4c5a,roughness:1}),rugC:m({color:0xc9c3b8,roughness:1}),
    shade:m({color:0xfff3dc,emissive:0xffc27a,emissiveIntensity:1.7}),fire:m({color:0xff8a3d,emissive:0xff6a1a,emissiveIntensity:7}),
    brass:m({color:0xc8a462,metalness:1,roughness:.28}),blackM:m({color:0x16181a,metalness:.7,roughness:.35}),
    wine:m({color:0x4d1420,roughness:.2,emissive:0x2a0508,emissiveIntensity:.5}),screen:m({color:0x050608,roughness:.08,metalness:.4}),
    felt:m({color:0x2c5c4a,roughness:1}),strip:m({color:0xffffff,emissive:0xffcf8f,emissiveIntensity:4}),puck:m({color:0xffffff,emissive:0xffd59a,emissiveIntensity:10}),
    soffit:m(P('floor',{color:0xe2cfae})),concrete:m(P('patio',{color:0x8d9196})),
    bookA:m({color:0x7c3434}),bookB:m({color:0x34507c}),bookC:m({color:0xc4ad74})}
}
let CUR=null; // current level mats, for model clones
function gl(p,name,x=0,y=0,z=0,ry=0,s=1,node){const src=node?M[name].getObjectByName(node):M[name];const o=src.clone(true);if(node){o.position.set(0,0,0);o.rotation.set(0,0,0);o.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(o);const c=bb.getCenter(new THREE.Vector3());o.position.set(-c.x,-bb.min.y,-c.z)}
 const w=new THREE.Group();w.add(o);w.position.set(x,y,z);w.rotation.y=ry;w.scale.setScalar(s);
 o.traverse(c=>{if(c.isMesh){c.castShadow=true;c.receiveShadow=true;if(CUR){const ms=Array.isArray(c.material)?c.material:[c.material];const cl=ms.map(mm=>{const k=mm.clone();k.userData.op=mm.opacity;k.userData.tr=mm.transparent;CUR.list.push(k);return k});c.material=Array.isArray(c.material)?cl:cl[0]}}});p.add(w);return w}

// ---------- modern furniture (front faces +z) ----------
function sofa(p,w,L,f){bx(p,-w/2+.08,w/2-.08,0,.12,-.4,.38,L.blackM);rbx(p,-w/2,w/2,.12,.42,-.48,.48,f,.08);const n=Math.max(2,Math.round(w/1));for(let i=0;i<n;i++){const a=-w/2+.18+(w-.36)*i/n,b=-w/2+.18+(w-.36)*(i+1)/n;rbx(p,a+.01,b-.01,.42,.56,-.3,.47,f,.07);rbx(p,a+.02,b-.02,.42,.88,-.48,-.24,f,.1)}rbx(p,-w/2,-w/2+.18,.12,.64,-.48,.48,f,.07);rbx(p,w/2-.18,w/2,.12,.64,-.48,.48,f,.07);rbx(p,-w/2+.35,-w/2+.75,.56,.9,-.26,-.14,L.sandF,.06);rbx(p,w/2-.75,w/2-.35,.56,.9,-.26,-.14,L.linen,.06)}
function bed(p,w,l,L,duv){rbx(p,-w/2-.06,w/2+.06,.02,.34,-l/2,l/2+.06,L.charF,.08);rbx(p,-w/2,w/2,.34,.58,-l/2+.04,l/2,L.linen,.07);rbx(p,-w/2-.02,w/2+.02,.5,.64,-l/2+.8,l/2+.03,duv,.06);rbx(p,-w/2-.03,w/2+.03,.62,.67,l/2-.62,l/2+.04,L.linen,.03);const pw=(w-.3)/2;rbx(p,-w/2+.12,-w/2+.12+pw,.56,.78,-l/2+.12,-l/2+.5,L.linen,.1);rbx(p,w/2-.12-pw,w/2-.12,.56,.78,-l/2+.12,-l/2+.5,L.linen,.1);rbx(p,-w/2+.3,w/2-.3,.6,.86,-l/2+.5,-l/2+.72,L.sandF,.1);rbx(p,-w/2-.18,w/2+.18,0,1.3,-l/2-.14,-l/2+.02,L.charF,.07)}
function lamp(p,L,h=1.7){cyl(p,.15,.025,0,0,0,L.blackM,20);cyl(p,.012,h,0,0,0,L.brass,8);sph(p,.13,0,h+.1,0,L.shade)}
function arcLamp(p,L){cyl(p,.2,.05,0,0,0,L.blackM,24);const c=new THREE.Mesh(new THREE.TorusGeometry(1.1,.018,8,40,Math.PI*.62),L.brass);c.rotation.z=Math.PI*.12;c.position.set(.95,1.05,0);p.add(c);sph(p,.15,1.55,1.55,0,L.shade)}
function tlamp(p,L,y=.55){cyl(p,.06,.22,0,y,0,L.brass,16);sph(p,.13,0,y+.34,0,L.shade)}
const rug=(p,w,d,c)=>rbx(p,-w/2,w/2,.002,.022,-d/2,d/2,c,.01);
function table(p,w,d,L,n){rbx(p,-w/2,w/2,.7,.77,-d/2,d/2,L.oak,.02);for(const a of[-1,1])bx(p,a*(w/2-.35)-.04,a*(w/2-.35)+.04,0,.7,-d/2+.12,d/2-.12,L.oak);for(let i=0;i<n;i++){const x=-w/2+w*(i+.5)/n;gl(p,'dining_chair_02',x,0,d/2+.38,Math.PI);gl(p,'dining_chair_02',x,0,-d/2-.38,0)}}
function stool(p,L){cyl(p,.2,.06,0,.66,0,L.charF,24);for(let i=0;i<3;i++){const a=i/3*Math.PI*2;const me=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.7,6),L.brass);me.position.set(Math.cos(a)*.13,.33,Math.sin(a)*.13);me.rotation.set(Math.sin(a)*.18,0,-Math.cos(a)*.18);p.add(me)}cyl(p,.15,.015,0,.25,0,L.brass,20)}
function island(p,w,d,L){rbx(p,-w/2+.05,w/2-.05,0,.88,-d/2+.06,d/2-.2,L.walnut,.02);bx(p,-w/2,w/2,.88,.94,-d/2,d/2,L.quartz);bx(p,-w/2,-w/2+.06,0,.88,-d/2,d/2,L.quartz);bx(p,w/2-.06,w/2,0,.88,-d/2,d/2,L.quartz);for(let i=0;i<3;i++)piece(p,-w/2+w*(i+.5)/3,d/2+.42,0,q=>stool(q,L))}
function counter(p,w,L){bx(p,-w/2,w/2,0,.88,-.32,.32,L.walnut);bx(p,-w/2,w/2,.88,.92,-.34,.34,L.quartz);bx(p,-w/2,w/2,.92,1.5,-.34,-.32,L.quartz);bx(p,-w/2,w/2,1.5,2.35,-.34,-.02,L.walnut);bx(p,-w/2,w/2,1.47,1.5,-.3,-.04,L.strip,false);bx(p,w/2,w/2+.92,0,2.35,-.34,.34,L.metal||L.blackM);bx(p,-1.6,-.8,.94,1.05,-.3,-.02,L.blackM)}
function shelf(p,w,h,L){bx(p,-w/2,w/2,0,h,-.18,.18,L.walnut);const r=rng(w*100|0);for(let y=.35;y<h-.2;y+=.42){bx(p,-w/2+.05,w/2-.05,y,y+.03,-.16,.16,L.oak);let x=-w/2+.1;while(x<w/2-.2){const bw=.04+r()*.05;bx(p,x,x+bw,y+.03,y+.3+r()*.06,-.12,.1,[L.bookA,L.bookB,L.bookC,L.linen][r()*4|0],false);x+=bw+.005}}}
function wineRack(p,w,L){bx(p,-w/2,w/2,0,2.4,-.25,.05,L.blackM);bx(p,-w/2+.05,w/2-.05,.1,2.3,-.24,-.2,L.strip,false);for(let y=.2;y<2.2;y+=.22)for(let x=-w/2+.15;x<w/2-.1;x+=.14){const b=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.24,10),L.wine);b.rotation.x=Math.PI/2;b.position.set(x,y+.04,-.08);p.add(b)}bx(p,-w/2-.05,w/2+.05,2.3,2.4,-.27,.1,L.walnut)}
function bunk(p,L){for(const y of[0,1.25]){const q=new THREE.Group();q.position.y=y;bed(q,1,2,L,L.slateF);p.add(q)}for(const[a,b]of[[-.62,-1.1],[.62,-1.1],[-.62,1.06],[.62,1.06]])bx(p,a-.04,a+.04,0,2.15,b-.04,b+.04,L.oak)}
function desk(p,L){rbx(p,-.8,.8,.72,.77,-.35,.35,L.oak,.015);bx(p,-.78,-.74,0,.72,-.33,.33,L.blackM);bx(p,.74,.78,0,.72,-.33,.33,L.blackM);rbx(p,-.32,.32,.85,1.2,-.24,-.21,L.screen,.01);bx(p,-.03,.03,.77,.86,-.24,-.2,L.blackM);gl(p,'modern_arm_chair_01',0,0,.75,Math.PI,.9)}
function tub(p,L){const me=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.9,8,20),L.white);me.rotation.z=Math.PI/2;me.scale.set(1,1,.95);me.position.y=.36;me.castShadow=true;p.add(me);const w=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.85,6,16),new THREE.MeshPhysicalMaterial({color:0xbfd8e6,roughness:.05,transmission:0,opacity:.6,transparent:true}));w.rotation.z=Math.PI/2;w.scale.set(1,.15,.85);w.position.y=.58;p.add(w)}
function vanity(p,w,L){rbx(p,-w/2,w/2,.25,.85,-.3,.25,L.walnut,.02);bx(p,-w/2,w/2,.85,.9,-.32,.27,L.quartz);for(const x of[-w/4,w/4]){const s=new THREE.Mesh(new THREE.CylinderGeometry(.22,.17,.14,28),L.white);s.position.set(x,.97,0);p.add(s);const mi=new THREE.Mesh(new THREE.CircleGeometry(.42,40),L.screen);mi.position.set(x,1.7,-.29);p.add(mi);const ring=new THREE.Mesh(new THREE.TorusGeometry(.43,.015,8,48),L.strip);ring.position.set(x,1.7,-.28);p.add(ring)}}
function lounger(p,L){bx(p,-.36,-.32,0,.28,-.95,.75,L.walnut);bx(p,.32,.36,0,.28,-.95,.75,L.walnut);rbx(p,-.34,.34,.24,.36,-.55,.75,L.linen,.05);const b=rbx(p,-.34,.34,.3,1.05,-1.0,-.86,L.linen,.05);b.rotation.x=-.55;b.position.z+=.2}
function chandelier(p,L,y){cyl(p,.008,.75,-.9,y-.75,0,L.blackM,4);cyl(p,.008,.75,.9,y-.75,0,L.blackM,4);const bar=rbx(p,-1.3,1.3,y-.82,y-.76,-.05,.05,L.brass,.02);bx(p,-1.25,1.25,y-.84,y-.82,-.03,.03,L.strip,false)}
function pendant(p,L,y){gl(p,'modern_ceiling_lamp_01',0,y-1.17,0,0,.85);sph(p,.09,0,y-.97,0,L.shade)}
function plantP(p,big){gl(p,big?'potted_plant_01':'potted_plant_02',0,0,0,R()*6,big?1.25:1.1)}
function planter(p,L,w,d,h){rbx(p,-w/2,w/2,0,h,-d/2,d/2,L.concrete,.04)}

// ---------- terrain & setting ----------
function gNat(x,z){const pad=Math.min(1,(Math.max(0,Math.abs(x)-10)+Math.max(0,Math.abs(z)-10))/6);let h=-0.6*Math.max(0,-x-8.6)-0.22*Math.max(0,z-10.5)+0.32*Math.max(0,-z-7)-0.12*Math.max(0,x-12);h+=pad*(1.4*Math.sin(x*.11+z*.07)*Math.cos(z*.09-x*.04)+.5*Math.sin(x*.37+1)*Math.sin(z*.29));if(x<-8.6&&z>-6&&z<7)h=Math.min(h,-0.6*(-x-8.6));return h}
function gH(x,z){if(x>-7.7&&x<7.7&&z>-5.4&&z<9.1)return -0.45;let h=gNat(x,z);if(x>-16&&x<20&&z>-3&&z<24){const y=yardInfo(x,z);if(y.inside)return 0;h=Math.min(h,0)-1.25*Math.exp(-Math.max(0,y.d-.25)/4.2)}return h}
const TREES=[];
function setting(){
  const geo=new THREE.PlaneGeometry(320,320,420,420);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position,uv=geo.attributes.uv;const col=[];const r=rng(2);
  for(let i=0;i<pos.count;i++){let x=pos.getX(i),z=pos.getZ(i);if(x>-16&&x<20&&z>-3&&z<24&&!(x>-7.7&&x<7.7&&z<9.1)){const yi=yardInfo(x,z);if(yi.d<.95){const q=atS(yi.s);const off=yi.inside?-.24:.2;x=q.x+q.nx*off;z=q.z+q.nz*off;pos.setX(i,x);pos.setZ(i,z)}}const y=gH(x,z);pos.setY(i,y);uv.setXY(i,uv.getX(i)*320,uv.getY(i)*320);const v=.75+r()*.3;const c=new THREE.Color(v,v,v*1.02);col.push(c.r,c.g,c.b)}
  geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.computeVertexNormals();
  const gm=new THREE.MeshStandardMaterial({map:TX.ground.diff,normalMap:TX.ground.nor,roughnessMap:TX.ground.arm,aoMap:TX.ground.arm,vertexColors:true,color:0x8f9a93});
  const g=new THREE.Mesh(geo,gm);g.receiveShadow=true;scene.add(g);
  // gravel beds along the walkout patio and stone base
  const grav=new THREE.MeshStandardMaterial({map:TX.gravel.diff,normalMap:TX.gravel.nor,roughnessMap:TX.gravel.arm,color:0x6a6e73});
  const pat=new THREE.MeshStandardMaterial({map:TX.patio.diff,normalMap:TX.patio.nor,roughnessMap:TX.patio.arm,color:0x8a8782});
  // boulders and mossy rocks
  const rockNames=['rock_moss_set_01_rock01','rock_moss_set_01_rock02','rock_moss_set_01_rock03','rock_moss_set_01_rock04','rock_moss_set_01_rock05','rock_moss_set_01_rock06'];
  const placeRock=(x,z,s,b)=>{const o=b?gl(scene,'boulder_01',x,gH(x,z)-.25*s,z,R()*6,s):gl(scene,'rock_moss_set_01',x,gH(x,z)-.15*s,z,R()*6,s,rockNames[R()*6|0]);o.rotation.x=(R()-.5)*.15};
  for(const[x,z,s,b]of[[-8.8,-5.2,.8,0],[11.5,-2,.9,0],[-12.6,9,1.4,1],[16.2,9,1.2,0],[-20,-6,1.8,1],[-23,4,1.5,0],[18,2,1.6,1],[-6,17.5,1.0,0],[9,18.5,1.3,1],[24,-10,2,1],[-30,-2,2.2,0],[-16,12,1.2,0]])placeRock(x,z,s,b);
  for(let i=0;i<26;i++){const a=R()*Math.PI*2,d=16+R()*45;const x=Math.cos(a)*d-4,z=Math.sin(a)*d;if(x>-17&&x<21&&z>-9&&z<20)continue;placeRock(x,z,.5+R()*1.4,R()<.4)}
  // ornamental grasses and ferns in the beds
  const grassN=[];M.grass_medium_01.children.forEach(c=>grassN.push(c.name));
  const tuft=(x,z,s)=>gl(scene,'grass_medium_01',x,gH(x,z)-.02,z,R()*6,s*2.1,grassN[R()*grassN.length|0]);
  for(let i=0;i<8;i++){tuft(-8.6+R()*.6,-5+i*.85,1.7+R()*.6);tuft(8.4+R()*1.2,-5+i*.6,1.7+R()*.6)}
  for(let i=0;i<40;i++){const a=R()*Math.PI*2,d=12+R()*22;const x=Math.cos(a)*d-4,z=Math.sin(a)*d;if(x>-17&&x<21&&z>-8&&z<19)continue;tuft(x,z,1.1+R()*.8)}
  const fernN=M.fern_02.children.map(c=>c.name);
  for(let i=0;i<10;i++){const x=-8.3-R()*.9,z=-5+i*1.3;gl(scene,'fern_02',x,gH(x,z),z,R()*6,2.2,fernN[i%4])}
  // path lights
  const bol=new THREE.MeshStandardMaterial({color:0x1b1e21,metalness:.6,roughness:.4}),glow=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffd29a,emissiveIntensity:8});
  yard(bol,glow,grassN);
  // planters on the walkout patio
  const PL={concrete:new THREE.MeshStandardMaterial({map:TX.patio.diff,normalMap:TX.patio.nor,color:0x7e8287,roughness:.9})};
  for(const[x,z]of[[-6.4,7.6],[6.4,7.6]]){piece(scene,x,z,0,p=>{planter(p,PL,1.2,1.2,.6);gl(p,'grass_medium_01',0,.58,0,0,3.6,grassN[3]);gl(p,'grass_medium_01',.25,.58,.2,2,3.2,grassN[4])})}
  piece(scene,-2.6,7.9,0,p=>plantP(p,true));piece(scene,2.6,7.9,0,p=>plantP(p,true));
  // trees: real conifers rendered from Poly Haven models, planted as cut-outs
  const spruce=Object.keys(SPR).filter(k=>k.startsWith('fir_sapling')),pine=Object.keys(SPR).filter(k=>k.startsWith('pine'));
  const sprMat={};for(const k of Object.keys(SPR)){sprMat[k]=new THREE.MeshStandardMaterial({map:null,alphaTest:.45,side:THREE.DoubleSide,roughness:1,color:k.startsWith('pinon')?0xc4d0b8:k.startsWith('pine')?0x9aa898:0xb3bfb0})}
  return(async()=>{for(const k of Object.keys(SPR)){const t=await loadTex(k.replace('.webp',''),1);t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;sprMat[k].map=t;sprMat[k].needsUpdate=true}
    const plant=(x,z,k,hgt,lift=0)=>{const m=SPR[k];const s=hgt/m.h;const w=m.w*s;const geo=new THREE.PlaneGeometry(w,hgt);geo.translate(0,hgt/2,0);const me=new THREE.Mesh(geo,sprMat[k]);me.position.set(x,gH(x,z)-.3+lift,z);if(lift){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.09,.16,lift+.4,8),new THREE.MeshStandardMaterial({color:0x4a3b30,roughness:1}));tr.position.set(x,gH(x,z)+lift/2-.1,z);tr.castShadow=true;scene.add(tr)}me.castShadow=hgt<12;me.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:sprMat[k].map,alphaTest:.45});scene.add(me);TREES.push(me)};
    let n=0;while(n<150){const x=(R()-.5)*190-6,z=(R()-.5)*170-14;if(Math.abs(x+3)<18&&z>-11&&z<13)continue;if(z>6&&x>-60&&x<18&&Math.hypot(x+4,z)<75)continue;if(z<-9&&x>-40&&x<34&&Math.hypot(x,z)<70&&R()<.8)continue;const isP=R()<.45;plant(x,z,isP?pine[R()*3|0]:spruce[R()*3|0],isP?14+R()*9:10+R()*8);n++}
    for(const[x,z,h]of[[16.4,6,6.5],[12.6,-4,7],[-9.8,-7.6,6],[-25,9,7.5],[-13.2,16.4,4.4],[17.5,15,5]])plant(x,z,spruce[Math.abs(Math.round(x*7))%3],h);
    for(const[x,z,h]of[[-7.4,11.0,4.4],[11.6,10.6,5.0],[1.2,12.1,3.9],[12.4,4.6,4.6]])plant(x,z,'pinon.webp',h,1.0);
  })();
}
function hash3(x,y,z,k){const s=Math.sin(x*127.1+y*311.7+z*74.7+k*19.3)*43758.5453;return s-Math.floor(s)}
function jitterGeo(g,a){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(1+(hash3(x,y,z,1)-.5)*a),y*(1+(hash3(x,y,z,2)-.5)*a*1.6),z*(1+(hash3(x,y,z,3)-.5)*a))}g.computeVertexNormals();return g}
function slabGeo(w,d,t,seed){const r=rng(seed);const pts=[];const n=12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+r()*.15;const cx=Math.cos(a),cz=Math.sin(a);pts.push(new THREE.Vector2(Math.sign(cx)*Math.pow(Math.abs(cx),.5)*w/2*(.88+r()*.14),Math.sign(cz)*Math.pow(Math.abs(cz),.5)*d/2*(.88+r()*.14)))}const g=new THREE.ExtrudeGeometry(new THREE.Shape(pts),{depth:t-.03,bevelEnabled:true,bevelThickness:.015,bevelSize:.025,bevelSegments:2});g.rotateX(-Math.PI/2);g.translate(0,.015,0);return g}
const SILO=[0xd9b58d,0xc99f7a,0xe3c8a3,0xbf9877,0xd8ab8e,0xcdb08e,0xe0bc98];
function yard(bol,glow,grassN){
  const r=rng(77);
  const silo=new THREE.MeshStandardMaterial({map:TX.patio.diff,normalMap:TX.patio.nor,roughnessMap:TX.patio.arm,color:0xffffff,roughness:1});
  const tint=c=>new THREE.Color(c).multiplyScalar(.95);
  // bark-mulch bed inside the wall, around the house and patio
  const out=YP.map(([x,z])=>new THREE.Vector2(x,-z));out.push(new THREE.Vector2(10.4,6),new THREE.Vector2(-8.4,6));
  const sh=new THREE.Shape(out);sh.holes.push(new THREE.Path([[-7.7,-9.1],[7.7,-9.1],[7.7,5.4],[-7.7,5.4]].map(([x,y])=>new THREE.Vector2(x,y))));
  const mg=new THREE.ShapeGeometry(sh,2);mg.rotateX(-Math.PI/2);const uv=mg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/2.5,uv.getY(i)/2.5);
  const mulch=new THREE.Mesh(mg,new THREE.MeshStandardMaterial({map:TX.ground.diff,normalMap:TX.ground.nor,color:0x6b5442,roughness:1}));mulch.position.y=.015;mulch.receiveShadow=true;scene.add(mulch);
  // Siloam flagstone patio, ashlar pattern
  const pv=[];let z=5.18;while(z<9.0){const d=Math.min(.42+r()*.38,9.05-z);let x=-7.55+r()*.25;while(x<7.5){const w=Math.min(.55+r()*.85,7.55-x);if(w>.18)pv.push([x+w/2,z+d/2,w-.03,d-.03]);x+=w}z+=d}
  const pg=jitterGeo(new THREE.BoxGeometry(1,1,1,2,1,2),.04);const pim=new THREE.InstancedMesh(pg,silo,pv.length);const o=new THREE.Object3D();
  pv.forEach(([x,z,w,d],i)=>{o.position.set(x,.02,z);o.rotation.set(0,(r()-.5)*.01,0);o.scale.set(w,.07,d);o.updateMatrix();pim.setMatrixAt(i,o.matrix);pim.setColorAt(i,tint(SILO[r()*SILO.length|0]))});pim.receiveShadow=true;pim.castShadow=true;scene.add(pim);
  // stair gap where the wall meets the steppers
  let sGap=0,bd=1e9;for(let s=0;s<YLEN;s+=.05){const p=atS(s);const d=Math.hypot(p.x-4.3,p.z-13.8);if(d<bd){bd=d;sGap=s}}
  // dry-stack Siloam retaining wall: coursed, battered back, capped
  const st=[];const ch=[];let top=.1;for(let k=0;k<26;k++){const h=.1+r()*.08;ch.push([top-h,top]);top-=h}
  const baseAt=s=>{const p=atS(s);return Math.min(gH(p.x+p.nx*1.3,p.z+p.nz*1.3),gH(p.x+p.nx*.7,p.z+p.nz*.7))-.55};
  ch.forEach(([y0,y1],k)=>{let s=.2+r()*.3;while(s<YLEN-.2){const L=.32+r()*.42;const sm=s+L/2;if(Math.abs(sm-sGap)>.95&&y1>baseAt(sm)){const p=atS(sm);const bat=(.1-y1)*.05;st.push({x:p.x+p.nx*(.05-bat),z:p.z+p.nz*(.05-bat),y:(y0+y1)/2,ry:-Math.atan2(p.tz,p.tx)+(r()-.5)*.05,sx:L-.025,sy:(y1-y0)-.012,sz:.42+r()*.12,c:SILO[r()*SILO.length|0]})}s+=L}});
  {let s=.1;while(s<YLEN-.1){const L=.7+r()*.45;const sm=s+L/2;if(Math.abs(sm-sGap)>.95){const p=atS(sm);st.push({x:p.x+p.nx*.02,z:p.z+p.nz*.02,y:.16,ry:-Math.atan2(p.tz,p.tx)+(r()-.5)*.06,sx:L-.03,sy:.11,sz:.66,c:0xe6cdaa})}s+=L}}
  const wg=jitterGeo(new THREE.BoxGeometry(1,1,1,3,2,2),.07);const wim=new THREE.InstancedMesh(wg,silo,st.length);
  st.forEach((q,i)=>{o.position.set(q.x,q.y,q.z);o.rotation.set((r()-.5)*.03,q.ry,(r()-.5)*.03);o.scale.set(q.sx,q.sy,q.sz);o.updateMatrix();wim.setMatrixAt(i,o.matrix);wim.setColorAt(i,tint(q.c))});wim.castShadow=true;wim.receiveShadow=true;scene.add(wim);
  // 7-inch (0.178 m) Siloam steppers: across the bed at grade, then down through the wall as steps, then on down the hill
  const G=atS(sGap);const path=[];const P0=[4.2,9.45];const nIn=5;
  for(let i=0;i<nIn;i++){const u=(i+.5)/nIn;const x=P0[0]+(G.x-P0[0])*u+Math.sin(u*Math.PI)*.35,z=P0[1]+(G.z-P0[1])*u;path.push({x,z,top:.12,ry:Math.atan2(G.x-P0[0],G.z-P0[1])})}
  let dir=Math.atan2(G.nx,G.nz),px=G.x,pz=G.z,yTop=.12;for(let i=1;i<30;i++){px+=Math.sin(dir)*.46;pz+=Math.cos(dir)*.46;const gnd=gH(px,pz);if(yTop-.178>gnd+.08){yTop-=.178;path.push({x:px,z:pz,top:yTop,ry:dir,step:1,gnd})}else break}
  for(let i=0;i<7;i++){dir+=.11;px+=Math.sin(dir)*.95;pz+=Math.cos(dir)*.95;path.push({x:px,z:pz,top:gH(px,pz)+.07,ry:dir})}
  const blk=new THREE.MeshStandardMaterial({map:TX.patio.diff,normalMap:TX.patio.nor,color:0xb8956f,roughness:1});
  path.forEach((q,i)=>{const sm=new THREE.Mesh(slabGeo(1.25+r()*.2,q.step?.62:.72,.178,40+i),new THREE.MeshStandardMaterial({map:TX.patio.diff,normalMap:TX.patio.nor,color:tint(SILO[i%SILO.length]),roughness:1}));sm.position.set(q.x,q.top-.178,q.z);sm.rotation.y=q.ry+(r()-.5)*.12;sm.castShadow=true;sm.receiveShadow=true;scene.add(sm);
    if(q.step&&q.top-.178>q.gnd){const h=q.top-.178-q.gnd+.1;const b=new THREE.Mesh(jitterGeo(new THREE.BoxGeometry(1,1,1,2,2,2),.06),blk);b.position.set(q.x,q.gnd-.1+h/2,q.z);b.rotation.y=q.ry;b.scale.set(1.15,h,.5);b.castShadow=true;b.receiveShadow=true;scene.add(b)}});
  for(const sgn of[-1,1]){const p=atS(sGap+sgn*1.05);cyl(scene,.06,.5,p.x+p.nx*.55,gH(p.x+p.nx*.55,p.z+p.nz*.55),p.z+p.nz*.55,bol,12);cyl(scene,.065,.06,p.x+p.nx*.55,gH(p.x+p.nx*.55,p.z+p.nz*.55)+.38,p.z+p.nz*.55,glow,12);const sl=new THREE.PointLight(0xffd29a,5,4.5,1.6);sl.position.set(p.x+p.nx*.8,.2,p.z+p.nz*.8);scene.add(sl)}
  for(let i=nIn+2;i<path.length;i+=3){const q=path[i];cyl(scene,.05,.45,q.x+.8,gH(q.x+.8,q.z),q.z,bol,12);cyl(scene,.055,.05,q.x+.8,gH(q.x+.8,q.z)+.34,q.z,glow,12)}
  // planting: perennial drifts, annual edging, globe blue spruce, grasses
  const onPath=(x,z)=>path.some(q=>Math.hypot(q.x-x,q.z-z)<.85);
  const fol=[],heads=[],spikes=[],globes=[];const FOL=[0x4f6b3e,0x5d7a46,0x6b8a52,0x7d9a8a,0x56733f];
  const SP=[{n:'russian sage',h:.85,r:.42,fol:0x8fa39a,spike:0x9c8fd0,k:'s'},{n:'salvia',h:.5,r:.3,fol:0x4f6b3e,spike:0x5e3fa6,k:'s'},{n:'black-eyed susan',h:.55,r:.32,fol:0x56733f,head:0xd9a21c,k:'d'},{n:'coneflower',h:.65,r:.32,fol:0x5d7a46,head:0xc0628a,k:'d'},{n:'blue fescue',h:.25,r:.22,fol:0x5f7e86,k:'g'},{n:'reed grass',k:'grass'}];
  const ANN=[0xe9e3e9,0xc94a62,0xd97a52,0xb8479a];
  for(let x=-9.5;x<14.6;x+=.5)for(let z=-1.2;z<14.6;z+=.5){const jx=x+(r()-.5)*.32,jz=z+(r()-.5)*.32;if(jx>-7.85&&jx<7.85&&jz<9.25)continue;const y=yardInfo(jx,jz);if(!y.inside||y.d<.55)continue;if(onPath(jx,jz))continue;
    const edge=(jz<10.0&&jx>-8&&jx<8)||y.d<1.0;
    if(edge){fol.push([jx,jz,.24,.2,FOL[r()*5|0]]);const c=ANN[Math.floor((jx+20)/2.2)%4];for(let k=0;k<12;k++){const a=r()*6.28,rr=Math.sqrt(r())*.21;heads.push([jx+Math.cos(a)*rr,.17+r()*.06,jz+Math.sin(a)*rr,.034,.03,c])}continue}
    const v=Math.sin(jx*.55+1.3)*Math.cos(jz*.62-.4)+.65*Math.sin((jx-jz)*.31);const sp=SP[Math.min(5,Math.max(0,Math.floor((v+1.65)/3.3*6)))];
    if(sp.k==='grass'){if(r()<.55)gl(scene,'grass_medium_01',jx,0,jz,r()*6,2.8+r(),grassN[r()*grassN.length|0]);continue}
    fol.push([jx,jz,sp.r,sp.h*.62,sp.fol]);
    if(sp.k==='s')for(let k=0;k<9;k++){const a=r()*6.28,rr=Math.sqrt(r())*sp.r*.8;spikes.push([jx+Math.cos(a)*rr,sp.h*.55,jz+Math.sin(a)*rr,.03,sp.h*.55,sp.spike])}
    if(sp.k==='d')for(let k=0;k<11;k++){const a=r()*6.28,rr=Math.sqrt(r())*sp.r*.85;heads.push([jx+Math.cos(a)*rr,sp.h*.62+r()*.12,jz+Math.sin(a)*rr,.05,.022,sp.head])}}
  for(const[x,z,s]of[[-8.3,6.2,.62],[-8.7,9.4,.7],[-5.6,11.2,.66],[-1.6,12.2,.6],[7.4,12.0,.72],[9.6,10.4,.6],[12.6,7.6,.7],[11.0,1.4,.66],[9.8,-.6,.55],[-8.6,1.8,.6]]){if(!onPath(x,z))globes.push([x,z,s])}
  const inst=(geo,mat,arr,fn)=>{const im=new THREE.InstancedMesh(geo,mat,arr.length);arr.forEach((a,i)=>{fn(a);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,new THREE.Color(a[a.length-1]))});im.castShadow=true;im.receiveShadow=true;scene.add(im);return im};
  inst(jitterGeo(new THREE.IcosahedronGeometry(1,2),.22),new THREE.MeshStandardMaterial({roughness:.95}),fol,([x,z,rr,h])=>{o.position.set(x,h*.45,z);o.rotation.set(0,r()*6,0);o.scale.set(rr,h*.62,rr)});
  inst(new THREE.SphereGeometry(1,8,6),new THREE.MeshStandardMaterial({roughness:.75,emissive:0x0d0a08}),heads,([x,y,z,s,t])=>{o.position.set(x,y,z);o.rotation.set((r()-.5)*.5,0,(r()-.5)*.5);o.scale.set(s,t,s)});
  const cg=new THREE.ConeGeometry(1,1,6);cg.translate(0,.5,0);
  inst(cg,new THREE.MeshStandardMaterial({roughness:.8,emissive:0x0a0814}),spikes,([x,y,z,s,h])=>{o.position.set(x,y,z);o.rotation.set((r()-.5)*.35,0,(r()-.5)*.35);o.scale.set(s,h,s)});
  const gg=jitterGeo(new THREE.IcosahedronGeometry(1,5),.28);
  const gim=new THREE.InstancedMesh(gg,new THREE.MeshStandardMaterial({color:0x3f5f63,roughness:1,normalMap:TX.ground.nor,normalScale:new THREE.Vector2(3,3)}),globes.length);
  globes.forEach(([x,z,s],i)=>{o.position.set(x,s*.78,z);o.rotation.set(0,r()*6,0);o.scale.set(s,s*.86,s);o.updateMatrix();gim.setMatrixAt(i,o.matrix)});gim.castShadow=true;gim.receiveShadow=true;scene.add(gim);
  // soft downlights from under the deck onto the bed
  for(const[x,tx]of[[-3.5,-3.5],[4.5,6]]){const sp=new THREE.SpotLight(0xffe0b4,55,20,.75,.6,1.3);sp.position.set(x,2.85,7.6);sp.target.position.set(tx,0,11.8);scene.add(sp,sp.target)}
}
function mountains(){const r=rng(99);const ph=[...Array(8)].map(()=>r()*6.28);const NA=720,NR=48,R0=165,R1=460;const pos=[],col=[],idx=[];
  const rock=new THREE.Color(0x232c3d),rock2=new THREE.Color(0x313c50),forest=new THREE.Color(0x15231f),snow=new THREE.Color(0xe6edf6);
  const hAt=(a,rr)=>{let n=0,amp=1,f=3;for(let o=0;o<6;o++){n+=amp*(1-Math.abs(Math.sin(a*f+ph[o]+rr*.004*o)));amp*=.5;f*=2.07}const env=Math.min(1,Math.max(0,(rr-R0)/110));return Math.pow(n/1.9,1.6)*env*(230+90*Math.sin(a*2+ph[7]))};
  for(let j=0;j<=NR;j++)for(let i=0;i<=NA;i++){const a=i/NA*Math.PI*2,rr=R0+(R1-R0)*Math.pow(j/NR,1.3);const h=hAt(a,rr);const x=Math.cos(a)*rr-4,z=Math.sin(a)*rr;pos.push(x,h-14,z);
    const snowLine=110+22*Math.sin(a*7+ph[3])+r()*12;let c=h>snowLine?snow.clone().lerp(rock2,Math.max(0,.35-(h-snowLine)*.02)):(h<55?forest.clone().lerp(rock,h/55):rock.clone().lerp(rock2,r()));col.push(c.r,c.g,c.b)}
  for(let j=0;j<NR;j++)for(let i=0;i<NA;i++){const a=j*(NA+1)+i,b=a+NA+1;idx.push(a,b,a+1,b,b+1,a+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
  const me=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,envMapIntensity:0,color:0x7d8796}));scene.add(me)}

// ---------- the house ----------
const LV=[];
function level(base,lift){const g=new THREE.Group();g.position.y=base;scene.add(g);const L=makeMats();const o={g,L,base,lift:0,liftMax:lift,lights:[]};LV.push(o);CUR=L;return o}
function plight(o,x,y,z,i=16,d=11){i*=.72;const l=new THREE.PointLight(0xffb878,i,d,1.6);l.position.set(x,y,z);o.g.add(l);o.lights.push([l,i])}
const sH=x=>1.2+(7-Math.abs(x))*(4.8/7);
function house(){
{const o=level(0,24),g=o.g,L=o.L;
 bx(g,-7.2,7.2,-1.6,-.015,-5.2,5.2,L.stone);bx(g,-7,7,-.01,0,-5,5,L.floor,false);
 bx(g,-7.6,7.6,-.3,-.005,5,9.05,L.slab,false);
 wallX(g,-7,7,-5,3,L.stone);wallZ(g,-5,5,-7,3,L.stone);wallZ(g,-5,5,7,3,L.stone);
 bx(g,-7.2,-6.2,0,3,4.8,5.2,L.stone);bx(g,6.2,7.2,0,3,4.8,5.2,L.stone);bx(g,-6.2,-5.6,0,3,4.8,5.2,L.stone);glassX(g,-5.6,-1.6,5,0,2.6,L,1.35);bx(g,-5.6,-1.6,2.6,3,4.8,5.2,L.stone);bx(g,-1.6,1.2,0,3,4.8,5.2,L.stone);glassX(g,1.2,4.8,5,0,2.6,L,1.2);bx(g,1.2,4.8,2.6,3,4.8,5.2,L.stone);bx(g,4.8,6.2,0,3,4.8,5.2,L.stone);
 wallX(g,-7,7,0,2.9,L.plaster,[[-1.5,-.5],[3.6,4.6]]);wallZ(g,0,5,2,2.9,L.plaster,[[.4,1.4]]);wallZ(g,-5,0,0,2.9,L.plaster);
 bx(g,7,8.4,-1.6,3,1.2,2.8,L.stone);
 piece(g,-3,2.7,0,p=>rug(p,4.4,3,L.rugB));piece(g,-3,.18,0,p=>{bx(p,-1.15,1.15,1.0,1.65,-.05,0,L.screen);rbx(p,-1.6,1.6,0,.42,-.05,.42,L.walnut,.02)});piece(g,-3,3.55,Math.PI,p=>sofa(p,3,L,L.charF));piece(g,-3,2.25,0,p=>gl(p,'coffee_table_round_01',0,0,0,0,.85));
 piece(g,-5.4,3.75,Math.PI,p=>gl(p,'side_table_01'));piece(g,-.6,3.75,Math.PI,p=>gl(p,'side_table_01'));
 piece(g,.4,3.1,Math.PI/2,p=>{rbx(p,-1.2,1.2,.62,.86,-.7,.7,L.walnut,.03);bx(p,-1.08,1.08,.86,.87,-.58,.58,L.felt);bx(p,-.95,.95,0,.62,-.5,.5,L.blackM)});
 piece(g,-6.3,4.4,0,p=>plantP(p,1));piece(g,-6.3,1.0,0,p=>lamp(p,L));
 piece(g,6.75,2.6,-Math.PI/2,p=>wineRack(p,4,L));piece(g,4.4,.2,0,p=>wineRack(p,3.2,L));piece(g,4.3,3.1,0,p=>{rbx(p,-.95,.95,.98,1.05,-.45,.45,L.quartz,.02);bx(p,-.15,.15,0,.98,-.15,.15,L.blackM);for(const x of[-.55,0,.55]){piece(p,x,.75,0,q=>stool(q,L));piece(p,x,-.75,Math.PI,q=>stool(q,L))}});
 piece(g,-3.5,-3.75,0,p=>bed(p,1.6,2.1,L,L.sageF));piece(g,-4.8,-4.55,0,p=>{gl(p,'side_table_01');tlamp(p,L)});piece(g,-2.2,-4.55,0,p=>{gl(p,'side_table_01');tlamp(p,L)});piece(g,-3.5,-2.75,0,p=>rug(p,2.8,2.6,L.rugC));piece(g,-6,-1,Math.PI*.75,p=>gl(p,'mid_century_lounge_chair'));
 piece(g,1.4,-3.8,0,p=>bunk(p,L));piece(g,3.15,-3.8,0,p=>bunk(p,L));piece(g,6.35,-2.4,-Math.PI/2,p=>desk(p,L));piece(g,3,-1.3,0,p=>rug(p,3.4,1.6,L.rugA));piece(g,5.1,-4.75,0,p=>gl(p,'wooden_display_shelves_01',0,0,0,Math.PI/2));
 plight(o,-3,2.4,2.5);plight(o,4.5,2.4,2.5);plight(o,-3.5,2.4,-2.5,12);plight(o,3.5,2.4,-2.5,12);
}
{const o=level(3.2,22),g=o.g,L=o.L;
 bx(g,-7.2,7.2,-.22,-.015,-5.2,5.2,L.slab);bx(g,-7,7,-.01,0,-5,5,L.floor,false);bx(g,-14.1,-7,-.22,-.015,-3.6,3.6,L.slab);bx(g,-14,-7,-.01,0,-3.5,3.5,L.floor,false);
 bx(g,-14,7,-.22,-.02,5,7.2,L.deck);bx(g,-14,-7,-.22,-.02,3.5,5,L.deck);bx(g,-18.2,-14,-.24,-.02,-3.6,7.2,L.deck);
 cableX(g,-18.2,7,7.2,L);cableZ(g,-3.6,7.2,-18.2,L);cableX(g,-18.2,-14,-3.6,L);
 for(const x of[-11,-3,3,6.6])bx(g,x-.1,x+.1,-3.2,-.22,6.9,7.1,L.blackM);bx(g,-9.6,-9.3,-4.8,-.22,-3,-2.7,L.blackM);bx(g,-9.6,-9.3,-4.8,-.22,2.7,3,L.blackM);bx(g,-14,-7,-.5,-.22,-3.5,3.5,L.blackM);bx(g,-18.2,-14,-.55,-.22,-.3,.3,L.blackM);
 for(let i=0;i<10;i++){const me=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),L.puck);me.position.set(-17.6+i*2.6,-.25,7.1);g.add(me)}
 wallX(g,-7,7,-5,3,L.clad,[[1.2,2.4]]);wallZ(g,-5,5,7,3,L.clad);wallZ(g,-5,-3.5,-7,3,L.clad);wallZ(g,3.5,5,-7,3,L.clad);
 bx(g,-7,-1,0,.95,4.89,5.11,L.clad);bx(g,-7,-1,2.35,3,4.89,5.11,L.clad);bx(g,-7,-6.4,.95,2.35,4.89,5.11,L.clad);bx(g,-1.6,-1,.95,2.35,4.89,5.11,L.clad);glassX(g,-6.4,-1.6,5,.95,2.35,L,1.6);glassX(g,-1,7,5,0,3,L,1.6);glassX(g,-14,-7,3.5,0,3,L);wallX(g,-14,-7,-3.5,3,L.clad);glassZ(g,-3.5,3.5,-14,0,3,L);
 wallX(g,-7,7,-1,2.9,L.plaster,[[-3.1,-2.1],[.9,2.1]]);wallZ(g,-5,-1,0,2.9,L.plaster);
 bx(g,7,8.4,-.22,3,1.2,2.8,L.stone);
 piece(g,6.6,2,-Math.PI/2,p=>{bx(p,-1.5,1.5,0,3,-.5,-.05,L.stone);bx(p,-.8,.8,.42,1.0,-.06,-.02,L.fire);bx(p,-.82,.82,.4,1.02,-.07,-.05,L.blackM);rbx(p,-1.7,1.7,0,.4,-.5,.38,L.concrete,.02);for(let i=0;i<5;i++){const lg=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.6,8),L.walnut);lg.rotation.z=Math.PI/2;lg.position.set(-.3+i*.15,.48,-.2);p.add(lg)}});
 piece(g,3.7,2,0,p=>rug(p,3.8,3.6,L.rugC));piece(g,2.0,2,Math.PI/2,p=>sofa(p,2.9,L,L.boucle));piece(g,4.15,.5,Math.PI*.15,p=>gl(p,'mid_century_lounge_chair'));piece(g,4.15,3.5,Math.PI*.85,p=>gl(p,'mid_century_lounge_chair'));piece(g,3.75,2,0,p=>gl(p,'coffee_table_round_01',0,0,0,0,.95));piece(g,1.0,4.3,-Math.PI/2,p=>arcLamp(p,L));piece(g,6.2,4.4,0,p=>plantP(p,1));piece(g,1.0,-.45,0,p=>gl(p,'side_table_01'));
 piece(g,-4.3,-.62,0,p=>counter(p,4.6,L));piece(g,-4.1,1.9,0,p=>island(p,3.1,1.15,L));for(const x of[-5.1,-4.1,-3.1])piece(g,x,1.9,0,p=>pendant(p,L,3));
 piece(g,-3.5,-4.45,0,p=>desk(p,L));piece(g,-6.75,-2.2,0,p=>gl(p,'wooden_display_shelves_01'));piece(g,-6.75,-3.4,0,p=>gl(p,'wooden_display_shelves_01'));piece(g,-1.2,-1.95,-Math.PI*.75,p=>gl(p,'modern_arm_chair_01'));piece(g,-3.3,-3,0,p=>rug(p,3,2.2,L.rugB));piece(g,-.7,-4.4,0,p=>lamp(p,L));
 piece(g,1.6,-4.62,0,p=>{rbx(p,-.9,.9,0,.45,-.2,.22,L.oak,.02);rbx(p,-.75,.75,.45,.53,-.18,.2,L.charF,.03);bx(p,-1,1,.53,2.4,-.35,-.31,L.oak);for(const x of[-.6,0,.6])bx(p,x-.04,x+.04,1.6,1.9,-.31,-.24,L.brass)});piece(g,2.6,-2.6,0,p=>rug(p,1.1,2.6,L.rugA));piece(g,.7,-1.7,0,p=>plantP(p,0));
 piece(g,5.4,-1.3,0,p=>{for(let i=0;i<11;i++)rbx(p,-1.05,1.05,.27*i+.2,.27*(i+1),-.27*(i+1)-.02,-.27*i,L.oak,.015);bx(p,-1.05,1.05,0,.2,-3,0,L.walnut);bx(p,1.05,1.1,0,3,-3.1,0,L.blackM)});
 piece(g,-10.5,0,Math.PI/2,p=>{rug(p,4.8,2.8,L.rugA);table(p,3.6,1.1,L,4)});piece(g,-10.5,0,Math.PI/2,p=>chandelier(p,L,2.95));piece(g,-10.5,-3.15,0,p=>{gl(p,'modern_wooden_cabinet',0,0,0,0,.95);piece(p,-.75,0,0,q=>tlamp(q,L,.65))});piece(g,-13.4,-3,0,p=>plantP(p,1));
 piece(g,-16.1,.6,0,p=>{gl(p,'stone_fire_pit',0,.15,0,0,1.1);const f=new THREE.Mesh(new THREE.ConeGeometry(.3,.5,10),L.fire);f.position.y=.38;p.add(f)});for(const[x,z,r]of[[-16.1,-.9,0],[-16.1,2.1,Math.PI],[-17.4,.6,Math.PI/2],[-14.8,.6,-Math.PI/2]])piece(g,x,z,r,p=>gl(p,'modern_arm_chair_01'));
 piece(g,-16.9,4.9,Math.PI*.15,p=>lounger(p,L));piece(g,-15.2,5.4,Math.PI*.05,p=>lounger(p,L));piece(g,-11.6,5.4,0,p=>lounger(p,L));piece(g,-9.6,5.4,0,p=>lounger(p,L));
 for(const[x,z,b]of[[-17.6,6.6,1],[-13.4,6.6,0],[-7.6,6.6,1],[6.4,6.6,1],[-17.6,-3,0]])piece(g,x,z,0,p=>plantP(p,b));piece(g,2.6,6.1,0,p=>table(p,1.5,.9,L,2));
 plight(o,3.5,2.5,2);plight(o,-4,2.5,2);plight(o,-3.5,2.4,-3,10);plight(o,3.5,2.4,-3,10);plight(o,-10.5,2.4,0,18);plight(o,-16,1.2,.6,10,7);
}
{const o=level(6.4,20),g=o.g,L=o.L;
 bx(g,-7.2,7.2,-.22,-.015,-5.2,5.2,L.slab);bx(g,-7,7,-.01,0,-5,5,L.floor,false);
 wallZ(g,-5,5,-7,1.2,L.clad);wallZ(g,-5,5,7,1.2,L.clad);
 shapeWall(g,[[-7,0],[7,0],[7,1.2],[4.96,2.6],[-4.96,2.6],[-7,1.2]],-5,.22,L.clad);
 bx(g,-7,7,0,1.1,4.89,5.11,L.clad);
 const pw=(x0,x1,z)=>{const pts=[[x0,0],[x1,0]];for(let i=16;i>=0;i--){const x=x0+(x1-x0)*i/16;pts.push([x,Math.min(2.5,sH(x)-.12)])}shapeWall(g,pts,z,.16,L.plaster)};
 pw(-7,-.6,1);pw(1.5,7,1);wallZ(g,-5,1,1.5,2.5,L.plaster,[[-.4,.6]]);
 bx(g,7,8.4,-.22,2,1.2,2.8,L.stone);
 piece(g,0,2.1,0,p=>gl(p,'velvet_sofa',0,0,0,0,1.25));piece(g,0,3.2,0,p=>rug(p,4.4,2.8,L.rugB));piece(g,0,3.35,0,p=>gl(p,'coffee_table_round_01',0,0,0,0,.8));piece(g,-2.9,3.7,Math.PI*.62,p=>gl(p,'modern_arm_chair_01'));piece(g,2.9,3.7,-Math.PI*.62,p=>gl(p,'modern_arm_chair_01'));piece(g,-4.4,1.9,0,p=>lamp(p,L,1.4));piece(g,4.4,1.9,0,p=>lamp(p,L,1.4));piece(g,5.6,4.3,0,p=>plantP(p,0));piece(g,-5.6,4.3,0,p=>plantP(p,1));
 piece(g,-2.4,-3.7,0,p=>bed(p,2,2.2,L,L.charF));piece(g,-3.85,-4.55,0,p=>{gl(p,'side_table_01');tlamp(p,L)});piece(g,-.95,-4.55,0,p=>{gl(p,'side_table_01');tlamp(p,L)});piece(g,-2.4,-2.55,0,p=>rug(p,3.4,2.8,L.rugC));piece(g,-2.4,-2.0,0,p=>rbx(p,-.8,.8,0,.45,-.22,.22,L.sandF,.06));piece(g,-5.5,.1,Math.PI*.7,p=>gl(p,'mid_century_lounge_chair'));
 bx(g,1.6,6.9,0,.012,-4.9,.9,L.quartz,false);piece(g,3.9,-.6,0,p=>tub(p,L));piece(g,1.95,-2.6,Math.PI/2,p=>vanity(p,2.4,L));
 piece(g,5.3,-4.15,0,p=>{bx(p,-.75,.75,0,.06,-.7,.7,L.white);bx(p,-.77,.77,0,2.2,.7,.72,L.glass,false);bx(p,-.77,-.75,0,2.2,-.7,.72,L.glass,false);cyl(p,.12,.02,0,2.1,0,L.brass)});piece(g,6.2,-1.8,0,p=>plantP(p,0));
 plight(o,0,2.2,3);plight(o,-2.4,2.2,-2.5,12);plight(o,3.8,2.2,-2,12);
}
{const o=level(6.4,30),g=o.g,L=o.L;
 for(const s of[1,-1]){const q=new THREE.Group();q.position.set(s*3.87,3.35+.16,0);q.rotation.z=-s*0.601;g.add(q);bx(q,-4.7,4.7,.02,.2,-5.7,6.4,L.roof);bx(q,-4.7,4.7,-.06,.02,-5.7,6.4,L.soffit);bx(q,-4.7,4.7,-.06,.22,6.38,6.48,L.blackM)}
 bx(g,-.15,.15,5.75,6.25,-5.7,6.45,L.blackM);
 shapeWall(g,[[-4.96,2.6],[4.96,2.6],[0,6.0]],-5,.22,L.clad);
 shapeWall(g,[[-7,1.1],[7,1.1],[7,1.2],[0,6],[-7,1.2]],5,0,L.glass);
 for(let x=-5.6;x<=5.61;x+=1.4){bx(g,x-.04,x+.04,1.1,sH(x),4.94,5.06,L.mull)}bx(g,-4.08,4.08,3.2,3.27,4.94,5.06,L.mull);
 for(const s of[1,-1]){const e=new THREE.Group();e.position.set(s*3.5,3.6,5.05);e.rotation.z=-s*.601;g.add(e);bx(e,-4.3,4.3,-.05,.05,-.04,.04,L.mull)}
 for(let i=1;i<=7;i++)for(const s of[1,-1]){const x=s*(i*0.95),y=sH(x)+.02;const me=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),L.puck);me.position.set(x,y,5.9);g.add(me)}
 bx(g,-14.6,-6.8,-.2,.12,-4.1,4.3,L.roof);bx(g,-14.6,-6.8,-.28,-.2,-4.1,4.3,L.soffit);bx(g,-14.6,-6.8,-.28,.14,4.28,4.36,L.blackM);bx(g,-18.5,-14,-.2,.1,-3.9,1.8,L.roof);
 bx(g,7,8.4,0,7.6,1.2,2.8,L.stone);bx(g,6.85,8.55,7.6,7.8,1.05,2.95,L.blackM);
 for(let i=1;i<=8;i++){const me=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),L.puck);me.position.set(-14.4+i*.9,-.3,4.2);g.add(me)}
}
CUR=null}

const ROOMS=[
 {id:'101',lv:1,name:'Family + game room',r:[-7,2,0,5],faces:'Valley, south',feat:'Walkout glass'},
 {id:'102',lv:1,name:'Wine + tasting room',r:[2,7,0,5],faces:'Valley, south',feat:'Backlit wine walls'},
 {id:'103',lv:1,name:'Guest suite',r:[-7,0,-5,0],faces:'Hillside',feat:'Queen bed'},
 {id:'104',lv:1,name:'Bunk room',r:[0,7,-5,0],faces:'Hillside',feat:'Sleeps four'},
 {id:'201',lv:2,name:'Great room + fireplace',r:[-1,7,-1,5],faces:'Valley, south',feat:'Stone hearth'},
 {id:'202',lv:2,name:"Chef's kitchen",r:[-7,-1,-1,5],faces:'Valley, south',feat:'Waterfall island'},
 {id:'203',lv:2,name:'Den + office',r:[-7,0,-5,-1],faces:'Forest, north',feat:'Built-in shelves'},
 {id:'204',lv:2,name:'Entry + stair',r:[0,7,-5,-1],faces:'Forest, north',feat:'Mudroom bench'},
 {id:'205',lv:2,name:'Dining pavilion',r:[-14,-7,-3.5,3.5],faces:'Peaks, west',feat:'Three glass walls'},
 {id:'206',lv:2,name:'Cantilever deck',r:[-18.2,-14,-3.6,7.2],faces:'Valley, 180°',feat:'Stone fire pit'},
 {id:'301',lv:3,name:'Gable loft',r:[-6,6,1,5],faces:'Valley, south',feat:'Vaulted glass'},
 {id:'302',lv:3,name:'Primary suite',r:[-6,1.5,-5,1],faces:'Forest, north',feat:'King bed'},
 {id:'303',lv:3,name:'Primary bath',r:[1.5,7,-5,1],faces:'Forest, north',feat:'Soaking tub'}];
const LEVELN={1:'Level 1 · Walkout',2:'Level 2 · Main living',3:'Level 3 · Loft + suite'};

// ---------- post-processing ----------
let composer,renderPass,gtao,bloom;
function setupPost(){const rt=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,samples:Q.includes('nomsaa')?0:4});composer=new EffectComposer(renderer,rt);renderPass=new RenderPass(scene,camera);composer.addPass(renderPass);
 gtao=new GTAOPass(scene,camera,1,1);gtao.updateGtaoMaterial({radius:.6,distanceExponent:1.4,thickness:1.2,scale:1.1,samples:12});gtao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:12});gtao.blendIntensity=.9;if(!Q.includes('noao'))composer.addPass(gtao);
 if(Q.includes('nomsaa'))composer.addPass(new SMAAPass(1,1));bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.38,.5,.92);if(!Q.includes('nobloom'))composer.addPass(bloom);composer.addPass(new OutputPass())}
function draw(cam){renderPass.camera=cam;gtao.camera=cam;faceTrees(cam);composer.render()}
function faceTrees(cam){for(const t of TREES)t.rotation.y=Math.atan2(cam.position.x-t.position.x,cam.position.z-t.position.z)}

// ---------- time, tweens, UI (same behaviour as before) ----------
let T=0;const TW=[],TIMERS=[];
const eio=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,eout=p=>1-Math.pow(1-p,3);
function tween(key,dur,fn,ease=eio){for(let i=TW.length-1;i>=0;i--)if(TW[i].key===key)TW.splice(i,1);if(REDUCED&&!CAPTURE)dur=.001;TW.push({key,s:T,dur,fn,ease})}
function after(dt,fn){TIMERS.push({t:T+dt,fn})}
function stepTweens(){for(let i=TW.length-1;i>=0;i--){const k=TW[i];const p=Math.min(1,(T-k.s)/k.dur);k.fn(k.ease(p));if(p>=1)TW.splice(TW.indexOf(k),1)}for(let i=TIMERS.length-1;i>=0;i--)if(T>=TIMERS[i].t){const f=TIMERS[i].fn;TIMERS.splice(i,1);f()}}
function lerpTo(key,obj,goal,dur,ease){const from={...obj};tween(key,dur,p=>{for(const k in goal)obj[k]=from[k]+(goal[k]-from[k])*p},ease)}
const cam={az:-.62,el:.1,dist:50,tx:-4.5,ty:6.4,tz:0,sway:1};
const ui={card:0,vo:0,lvo:0,pins:0,intro:1,toast:0};
let curLevel=0,curRoom=null,unit='ft';
function applyLift(o,v){o.g.position.y=o.base+v*o.liftMax;o.g.visible=v<.995;for(const m of o.L.list){const tr=m.userData.tr||v>.001;if(m.transparent!==tr){m.transparent=tr;m.needsUpdate=true}m.opacity=m.userData.op*(1-v)}for(const[l,i]of o.lights)l.intensity=i*(1-v)}
function setLevel(n){curLevel=n;LV.forEach((o,i)=>{const goal=n===0?0:(i+1>n?1:0);if(goal===o.lift)return;const delay=n===0?(3-i)*.12:i*.1;after(delay,()=>{const from=o.lift;tween('lv'+i,1.5,p=>{o.lift=from+(goal-from)*p})})});
 document.querySelectorAll('#levels button').forEach(b=>b.classList.toggle('on',+b.dataset.l===n));
 ROOMS.forEach(r=>{r.el.style.pointerEvents=r.lv===n?'auto':'none'});
 lerpTo('pins',ui,{pins:0},.25,eout);if(n)after(1.3,()=>lerpTo('pins',ui,{pins:1},.5,eout));setIntro(n)}
const LVIEW={9:{az:-.12,el:.27,dist:31,tx:2.5,ty:-.3,tz:10.5,sway:.35},0:{az:-.62,el:.1,dist:50,tx:-4.5,ty:6.4,tz:0,sway:1},1:{az:-.42,el:.98,dist:34,tx:-1,ty:0,tz:.5,sway:0},2:{az:-.42,el:.92,dist:46,tx:-5.5,ty:3.2,tz:1.2,sway:0},3:{az:-.42,el:.95,dist:38,tx:-1.5,ty:6.4,tz:.5,sway:0}};
function goLevel(n){if(curRoom)closeCard(false);const lv=n===9?0:n;setLevel(lv);if(n===9)after(.36,()=>{$('#introK').textContent='The grounds';$('#introH').innerHTML='Built into<br>the hillside.';$('#introP').textContent='Dry-stack Siloam wall, 7-inch Siloam steppers, perennial beds, piñon pine and globe spruce.'});document.querySelectorAll('#levels button').forEach(b=>b.classList.toggle('on',+b.dataset.l===n));lerpTo('cam',cam,LVIEW[n],2.2);lerpTo('lvo',ui,{lvo:lv?1:0},1.9);document.body.classList.toggle('inlevel',!!lv)}
function levelLine(n){const rs=ROOMS.filter(r=>r.lv===n);return `${rs.length} spaces · ${fmt(rs.reduce((a,r)=>a+r.sq,0))} on this level. Tap a number.`}
function setIntro(n){const k=$('#introK'),h=$('#introH'),p=$('#introP');lerpTo('intro',ui,{intro:0},.25,eout);after(.3,()=>{if(n===0){k.textContent='Residence Explorer · Demo';h.innerHTML='Walk the home<br>before you visit.';p.textContent='Pick a level. The roof lifts, the floor opens, every room is a tap away.'}else{k.textContent=LEVELN[n];h.innerHTML=['','The walkout.','Main living.','Loft + suite.'][n];p.textContent=levelLine(n)}lerpTo('intro',ui,{intro:curRoom?0:1},.5,eout)})}
function fmt(ft){return unit==='ft'?ft.toLocaleString()+' ft²':Math.round(ft*.092903).toLocaleString()+' m²'}
function snap([e,t]){const saved=LV.map(o=>o.lift);LV.forEach(o=>applyLift(o,0));snapCam.aspect=canvas.width/canvas.height;snapCam.updateProjectionMatrix();snapCam.position.copy(e);snapCam.lookAt(t);draw(snapCam);const url=canvas.toDataURL('image/jpeg',.88);LV.forEach((o,i)=>applyLift(o,saved[i]));return url}
function setHero(u){$('#hero').style.backgroundImage=`url(${u})`}
function openRoom(r){if(r.lv!==curLevel)setLevel(r.lv);curRoom=r;ROOMS.forEach(x=>x.el.classList.toggle('on',x===r));
 $('#eyebrow').textContent=`Space ${r.id} · Level ${r.lv}`;$('#title').textContent=r.name;$('#size').textContent=fmt(r.sq);$('#faces').textContent=r.faces;$('#level').textContent=r.lv;$('#feat').textContent=r.feat;
 const urls=r.views.map(snap);render();setHero(urls[0]);const th=$('#thumbs');th.innerHTML='';
 urls.forEach((u,i)=>{const b=document.createElement('button');b.style.backgroundImage=`url(${u})`;if(!i)b.classList.add('on');b.setAttribute('aria-label','View '+(i+1));b.onclick=()=>{setHero(u);th.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))};th.appendChild(b)});
 lerpTo('card',ui,{card:1},.7,eout);lerpTo('vo',ui,{vo:1},1.4);lerpTo('intro',ui,{intro:0},.3,eout);
 const v=LVIEW[r.lv];lerpTo('cam',cam,{az:v.az+.08,el:.86,dist:r.id==='206'||r.id==='205'?28:26,tx:r.c.x,ty:LV[r.lv-1].base,tz:r.c.z,sway:0},1.6)}
function closeCard(back=true){curRoom=null;ROOMS.forEach(x=>x.el.classList.remove('on'));lerpTo('card',ui,{card:0},.45,eout);lerpTo('vo',ui,{vo:0},1.2);if(back){lerpTo('cam',cam,LVIEW[curLevel],1.4);lerpTo('intro',ui,{intro:1},.6,eout)}}
function toast(m){$('#toast').textContent=m;lerpTo('toast',ui,{toast:1},.35,eout);after(2.4,()=>lerpTo('toast',ui,{toast:0},.35,eout))}

let W=0,H=0;const v3=new THREE.Vector3();
function resize(){W=innerWidth;H=innerHeight;renderer.setSize(W,H,false);camera.aspect=W/H;camera.updateProjectionMatrix();if(composer)composer.setSize(W,H)}
function render(){const az=cam.az+cam.sway*(REDUCED?0:.22*Math.sin(T*.16));const t=new THREE.Vector3(cam.tx,cam.ty,cam.tz);camera.position.set(t.x+cam.dist*Math.cos(cam.el)*Math.sin(az),t.y+cam.dist*Math.sin(cam.el),t.z+cam.dist*Math.cos(cam.el)*Math.cos(az));camera.lookAt(t);
 const off=W>700?ui.vo*Math.min(220,W*.17)+ui.lvo*(1-ui.vo)*Math.min(140,W*.11):0;if(off>.5)camera.setViewOffset(W,H,-off,0,W,H);else camera.clearViewOffset();draw(camera)}
function frame(){stepTweens();LV.forEach(o=>applyLift(o,o.lift));render();
 $('#card').style.transform=`translateX(${(ui.card-1)*112}%)`;$('#card').style.opacity=ui.card;$('#intro').style.opacity=ui.intro;$('#intro').style.transform=`translateY(${(1-ui.intro)*10}px)`;
 const ts=$('#toast');ts.style.opacity=ui.toast;ts.style.transform=`translate(-50%,${(1-ui.toast)*16}px)`;
 for(const r of ROOMS){const show=r.lv===curLevel?ui.pins:0;if(show<=0.001){r.el.style.opacity=0;continue}v3.copy(r.c).project(camera);const x=(v3.x+1)/2*W,y=(1-v3.y)/2*H;r.el.style.transform=`translate(${x}px,${y}px) scale(${.7+.3*show})`;r.el.style.opacity=show}}

// ---------- boot ----------
async function boot(){
 $('#loading').style.opacity=1;
 const sky=ctex();scene.background=sky;scene.fog=new THREE.FogExp2(0x22325a,0.0019);
 await Promise.all([pbrSet('floor',2.2),pbrSet('stone',2.6),pbrSet('clad',2.4),pbrSet('roof',2.4,Math.PI/2),pbrSet('plaster',3),pbrSet('deck',2.4),pbrSet('patio',3),pbrSet('ground',5),pbrSet('gravel',2),loadModels()]);
 const hdr=await new RGBELoader().loadAsync(A.sky);const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromEquirectangular(hdr).texture;scene.environmentIntensity=.45;hdr.dispose();
 scene.add(new THREE.HemisphereLight(0x9db4e6,0x1c2228,.55));
 const moon=new THREE.DirectionalLight(0xc4d3ff,1.6);moon.position.set(-38,55,40);moon.castShadow=true;moon.shadow.mapSize.set(Q.includes('lowshadow')?1024:2048,Q.includes('lowshadow')?1024:2048);Object.assign(moon.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:5,far:160});moon.shadow.bias=-0.0004;moon.shadow.normalBias=.04;moon.shadow.radius=3;scene.add(moon);
 const rim=new THREE.DirectionalLight(0xffc293,.6);rim.position.set(60,18,-50);scene.add(rim);
 for(const[x,z]of[[11.8,7],[-10.2,10.8],[12.6,-4]]){const u=new THREE.SpotLight(0xffcf98,40,14,.5,.6,1.5);u.position.set(x+.6,.3,z+.8);u.target.position.set(x,6,z);scene.add(u,u.target)}
 mountains();house();await setting();
 ROOMS.forEach(r=>{const[x0,x1,z0,z1]=r.r;r.c=new THREE.Vector3((x0+x1)/2,LV[r.lv-1].base+1.0,(z0+z1)/2);r.sq=Math.round((x1-x0)*(z1-z0)*10.764/10)*10;
  const b=LV[r.lv-1].base,i=.55,y=b+1.55;r.views=[[x0+i,z0+i],[x1-i,z0+i],[x0+i,z1-i]].map(([x,z])=>{const e=new THREE.Vector3(x,y,z);const t=r.c.clone().setY(b+1.05);t.add(t.clone().sub(e).multiplyScalar(.5));return[e,t]});
  const el=document.createElement('button');el.className='pin';el.textContent=r.id;el.setAttribute('aria-label',r.name);el.style.opacity=0;el.style.pointerEvents='none';el.dataset.id=r.id;el.onclick=()=>openRoom(r);$('#pins').appendChild(el);r.el=el});
 setupPost();resize();addEventListener('resize',resize);
 document.querySelectorAll('#levels button').forEach(b=>b.onclick=()=>goLevel(+b.dataset.l));
 $('#close').onclick=()=>closeCard();
 $('#units').onclick=()=>{unit=unit==='ft'?'m':'ft';document.querySelectorAll('.u').forEach(u=>u.classList.toggle('on',u.dataset.u===unit));if(curRoom)$('#size').textContent=fmt(curRoom.sq);if(curLevel)$('#introP').textContent=levelLine(curLevel)};
 const toForm=()=>{try{window.parent.postMessage({hd:'contact',room:curRoom?curRoom.name:''},location.origin)}catch(e){}};$('#book').onclick=()=>EMBED?toForm():toast('Demo: this button would open your booking calendar.');$('#contact').onclick=()=>EMBED?toForm():toast('Demo: this would open the contact form.');
 addEventListener('keydown',e=>{if(e.key==='Escape'&&curRoom)closeCard()});
 frame();$('#loading').style.opacity=0;setTimeout(()=>$('#loading').remove(),600);
 if(CAPTURE){document.getElementById('cursor').style.display='block';window.__step=dt=>{T+=dt;frame()};window.__cam=cam;window.__ready=true}
 else{const t0=performance.now();const loop=()=>{T=(performance.now()-t0)/1000;frame();requestAnimationFrame(loop)};loop()}
}
function ctex(){const c=document.createElement('canvas');c.width=4;c.height=512;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'#08122a');gr.addColorStop(.45,'#16295a');gr.addColorStop(.72,'#3a5288');gr.addColorStop(.86,'#7b7fa6');gr.addColorStop(1,'#d9a27e');g.fillStyle=gr;g.fillRect(0,0,4,512);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
boot().catch(e=>{console.error(e);$('#loading').textContent='Could not load the 3D scene: '+e.message});
