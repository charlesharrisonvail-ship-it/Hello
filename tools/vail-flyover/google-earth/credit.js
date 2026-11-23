const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<html><body style="margin:0;background:transparent;width:1080px;height:1920px;position:relative;overflow:hidden">
<div style="position:absolute;top:150px;width:100%;text-align:center;color:#fff;font:600 40px Inter,sans-serif;text-shadow:0 2px 8px rgba(0,0,0,.7)">📍 Vail Valley, Colorado</div>
<div style="position:absolute;left:36px;bottom:300px;color:rgba(255,255,255,.92);font:500 21px/1.35 Inter,sans-serif;text-shadow:0 1px 4px rgba(0,0,0,.9)">
<span style="font:600 26px Inter,sans-serif">Google Earth</span><br>Imagery: Airbus, Landsat / Copernicus, Data SIO</div></body></html>`);
await p.screenshot({path:'base2.png',omitBackground:true});await b.close();})();
