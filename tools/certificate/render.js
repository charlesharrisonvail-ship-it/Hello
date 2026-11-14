const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1056,height:816},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/certificate.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:__dirname+'/certificate-sample.png'});await p.pdf({path:__dirname+'/certificate-sample.pdf',width:'11in',height:'8.5in',printBackground:true});await b.close()})();
