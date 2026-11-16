const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:816,height:1056},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/claude-code-cheat-sheet.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
const ov=await p.evaluate(()=>{const c=[...document.querySelectorAll('.c')].pop().getBoundingClientRect().bottom,f=document.querySelector('.foot').getBoundingClientRect().top;return Math.round(f-c)});console.log('gap cards→footer',ov);
await p.screenshot({path:__dirname+'/claude-code-cheat-sheet.png'});await p.pdf({path:__dirname+'/claude-code-cheat-sheet.pdf',width:'8.5in',height:'11in',printBackground:true});await b.close()})();
