const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('pageerror',e=>console.log('err',e.message));
await p.goto('http://127.0.0.1:8777/sprite.html');await p.waitForFunction(()=>window.ready);
const meta=JSON.parse(fs.existsSync(S+'/assets/sprites/meta.json')?fs.readFileSync(S+'/assets/sprites/meta.json'):'{}');
for(const [m,W] of process.argv.slice(3).map(s=>s.split(':'))){const t=Date.now();
 try{const res=await p.evaluate(([u,W])=>window.renderModel(u,+W),[`/assets/raw/${m}/${m}.gltf`,W]);
 res.forEach((r,i)=>{const f=`${m}_${i}.png`;fs.writeFileSync(S+'/assets/sprites/'+f,Buffer.from(r.url.split(',')[1],'base64'));meta[f]={w:r.w,h:r.h}});
 console.log(m,res.length,'sprites',(Date.now()-t)/1000+'s')}catch(e){console.log('fail',m,e.message.slice(0,200))}
 fs.writeFileSync(S+'/assets/sprites/meta.json',JSON.stringify(meta,null,1))}
await b.close()})();
