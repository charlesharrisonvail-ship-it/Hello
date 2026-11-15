const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const V={fb:{w:1080,h:1350,pad:72,g1:56,g2:40,hs:'100px',ip:'30px',ts:'29px',ds:'21px',ps:'76px'},li:{w:1200,h:1200,pad:68,g1:36,g2:28,hs:'82px',ip:'22px',ts:'26px',ds:'19px',ps:'64px'}};
for(const [n,v] of Object.entries(V)){const p=await b.newPage({viewport:{width:v.w,height:v.h}});await p.goto('file://'+__dirname+'/ad.html');
await p.evaluate(v=>{const r=document.documentElement.style;for(const k of ['w','h'])r.setProperty('--'+k,v[k]+'px');r.setProperty('--pad',v.pad+'px');r.setProperty('--g1',v.g1+'px');r.setProperty('--g2',v.g2+'px');for(const k of ['hs','ip','ts','ds','ps'])r.setProperty('--'+k,v[k]);},v);
await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
const ov=await p.evaluate(()=>{const l=document.querySelector('.list').getBoundingClientRect().bottom,t=document.querySelector('.bot').getBoundingClientRect().top;return Math.round(t-l)});
await p.screenshot({path:`${__dirname}/what-you-keep-${n==='fb'?'facebook-1080x1350':'linkedin-1200x1200'}.png`});console.log(n,'gap list→price',ov);}
await b.close()})();
