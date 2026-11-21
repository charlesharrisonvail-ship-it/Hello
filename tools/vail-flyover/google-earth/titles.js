const { chromium } = require('playwright');
const T=[['t1','The Vail Valley','Colorado',''],['t2','Vail Village','&amp; Lionshead',''],['t3','The Back Bowls','Where the powder days go',''],
['t4','','Heading west down the valley…',''],['t5','Beaver Creek','Not exactly roughing it',''],['t6','Arrowhead','The quiet side of Beaver Creek',''],
['t7','Three mountains.<br>One valley.','','Charles Harrison, Epique Area/Growth Leader'],['base','','','']];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [n,big,small,sig] of T){
 const body = n==='base'
  ? `<div style="position:absolute;top:150px;width:100%;text-align:center;color:#fff;font:600 40px Inter,sans-serif;text-shadow:0 2px 8px rgba(0,0,0,.7)">📍 Vail Valley, Colorado</div>`
  : `<div style="position:absolute;left:0;right:0;top:820px;height:700px;background:radial-gradient(ellipse at center,rgba(0,0,0,.38) 0%,rgba(0,0,0,0) 65%)"></div>
 <div style="position:absolute;left:0;right:0;top:1030px;text-align:center;color:#fff;padding:0 60px">
 ${big?`<div style="font:800 96px Inter,sans-serif;line-height:1.05;text-shadow:0 4px 18px rgba(0,0,0,.8),0 0 3px rgba(0,0,0,.7)">${big}</div>`:''}
 ${small?`<div style="font:italic 600 52px Inter,sans-serif;margin-top:18px;text-shadow:0 3px 12px rgba(0,0,0,.85)">${small}</div>`:''}
 ${sig?`<div style="font:700 40px Inter,sans-serif;margin-top:34px;white-space:nowrap;text-shadow:0 3px 12px rgba(0,0,0,.9)">${sig}</div>`:''}</div>`;
 await p.setContent(`<html><body style="margin:0;background:transparent;width:1080px;height:1920px;position:relative;overflow:hidden">${body}</body></html>`);
 await p.screenshot({path:`${n}.png`,omitBackground:true});}
await b.close();})();
