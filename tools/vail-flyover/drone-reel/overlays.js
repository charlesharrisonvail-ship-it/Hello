const { chromium } = require('playwright');
const T = [
 ['t1','Vail Village','Colorado',''],
 ['t2','Vail Mountain','Right out the back door',''],
 ['t3','','Snow from here to the valley floor…',''],
 ['t4','Ski-in. Ski-out.','The way Vail was meant to be lived',''],
 ['t5','One valley.<br>A lifetime of winters.','','Charles Harrison, Epique Area/Growth Leader'],
 ['base','','','']];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [n,big,small,sig] of T){
 const shade = n==='base'?'':`<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0) 45%,rgba(0,0,0,.45) 100%)"></div>`;
 const pin = n==='base'?`<div style="position:absolute;top:150px;width:100%;text-align:center;color:#fff;font:600 40px Inter,sans-serif;text-shadow:0 2px 8px rgba(0,0,0,.7)">📍 Vail, Colorado</div>
 <div style="position:absolute;left:36px;bottom:290px;color:rgba(255,255,255,.9);font:500 22px Inter,sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.9)">Footage: Jaxon Matthew Willis / Pexels</div>`:'';
 await p.setContent(`<html><body style="margin:0;background:transparent;width:1080px;height:1920px;position:relative;overflow:hidden">${shade}${pin}
 <div style="position:absolute;left:0;right:0;top:1080px;text-align:center;color:#fff;padding:0 60px">
 ${big?`<div style="font:800 92px Inter,sans-serif;line-height:1.05;text-shadow:0 4px 18px rgba(0,0,0,.8)">${big}</div>`:''}
 ${small?`<div style="font:italic 600 50px Inter,sans-serif;margin-top:18px;text-shadow:0 3px 12px rgba(0,0,0,.85)">${small}</div>`:''}
 ${sig?`<div style="font:700 40px Inter,sans-serif;margin-top:34px;white-space:nowrap;text-shadow:0 3px 12px rgba(0,0,0,.9)">${sig}</div>`:''}
 </div></body></html>`);
 await p.screenshot({path:`ov/${n}.png`,omitBackground:true});}
await b.close();})();
