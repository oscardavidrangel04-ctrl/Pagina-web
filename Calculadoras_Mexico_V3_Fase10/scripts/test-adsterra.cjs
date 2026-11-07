'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),unit=require('./adsterra-unit.cjs');
const rewrites=Object.fromEntries(require('../vercel.json').rewrites.map(r=>[r.source,r.destination]));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const result={scope:'Local Chromium; all third parties blocked. Checks integration/layout, not live ad delivery or impressions.',layouts:[],adRequests:0};
 try{
  const context=await browser.newContext({serviceWorkers:'block'});
  await context.route('**/*',r=>{
   const u=new URL(r.request().url());
   if(u.host!=='adsterra-local.test'){if(u.href==='https://bauval.org/21/'+unit.id)result.adRequests++;return r.abort();}
   const f=path.join(root,rewrites[u.pathname]||u.pathname);if(!fs.existsSync(f)||!fs.statSync(f).isFile())return r.fulfill({status:404,body:''});
   return r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'text/plain'});
  });
  const page=await context.newPage();
  for(const f of unit.placements)for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});await page.goto('https://adsterra-local.test/'+f);
   assert.equal(await page.locator('script[src="https://bauval.org/21/'+unit.id+'"]').count(),1);
   const ad=page.locator('.adsterra-unit');assert.equal(await ad.count(),1);
   await ad.scrollIntoViewIfNeeded();
   assert.equal(await ad.getAttribute('aria-label'),'Publicidad de Adsterra');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,f+' overflow');
   assert.ok(await page.locator('#container-'+unit.id).evaluate(e=>e.getBoundingClientRect().height>=250));
   if(f!=='index.html'){
    const sol=page.locator('[data-affiliate="solcredito"]');assert.equal(await sol.count(),1);
    assert.ok((await sol.locator('[data-affiliate-link="button"]').getAttribute('href')).endsWith('/?i=4'));
    assert.equal(await sol.evaluate((e,id)=>Boolean(e.compareDocumentPosition(document.getElementById(id))&Node.DOCUMENT_POSITION_FOLLOWING),'container-'+unit.id),true);
   }
   result.layouts.push({file:f,width,unitCount:1,overflow:false});
  }
  assert.equal(result.adRequests,9);
  result.status='PASS';
  if(process.env.ADSTERRA_QA_PATH)fs.writeFileSync(process.env.ADSTERRA_QA_PATH,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
