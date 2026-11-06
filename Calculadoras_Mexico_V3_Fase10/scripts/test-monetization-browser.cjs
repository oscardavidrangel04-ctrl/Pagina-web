'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {placements}=require('./affiliate-cards.cjs');
const root=path.resolve(__dirname,'..');
const output=process.env.MONETIZATION_QA_DIR;
if(!output) throw Error('Set MONETIZATION_QA_DIR outside the public directory');
fs.mkdirSync(output,{recursive:true});
const baseline=process.env.MONETIZATION_BASELINE_DIR;
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="#edf1f7"/><text x="150" y="110" text-anchor="middle" fill="#28334a" font-family="sans-serif" font-size="14">Imagen simulada para pruebas</text><text x="150" y="140" text-anchor="middle" fill="#28334a" font-family="sans-serif" font-size="14">300 × 250 · banner externo</text></svg>';
const report={conditions:'Chromium local; ads/analytics blocked; official banners simulated, not verified; no real affiliate clicks',axe:process.env.AXE_PATH?'enabled':'not requested',pages:[],calculators:[],events:[]};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const context=await browser.newContext({serviceWorkers:'block'});
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.hostname==='ad.admitad.com') {await new Promise(r=>setTimeout(r,150));return route.fulfill({contentType:'image/svg+xml',body:svg});}
   if(!['updated.test','baseline.test'].includes(u.hostname))return route.abort();
   if(u.pathname.startsWith('/_vercel/'))return route.fulfill({body:'',contentType:'application/javascript'});
   const dir=u.hostname==='baseline.test'?baseline:root;
   if(!dir)return route.abort();
   const file=path.join(dir,u.pathname==='/'?'index.html':u.pathname);
   if(!fs.existsSync(file))return route.fulfill({status:404,body:''});
   const ext=path.extname(file),type={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.json':'application/json'}[ext]||'application/octet-stream';
   return route.fulfill({contentType:type,body:fs.readFileSync(file)});
  });
  const page=await context.newPage();
  let errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.qaEvents=[];window.qaCLS=0;window.addEventListener('cm:affiliate',e=>window.qaEvents.push(e.detail));new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.qaCLS+=e.value})).observe({type:'layout-shift',buffered:true});});
  for(const [file] of placements)for(const width of [320,390,1440])for(const theme of ['light','dark']) {
   errors=[];await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme:theme});
   await page.goto('https://updated.test/'+file,{waitUntil:'load'});
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   const card=page.locator('[data-affiliate]');await card.scrollIntoViewIfNeeded();await page.waitForTimeout(200);
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,cards:document.querySelectorAll('[data-affiliate]').length,cls:window.qaCLS,loaded:document.querySelector('[data-affiliate] img').naturalWidth}));
   assert.equal(state.overflow,false,`${file} ${width} ${theme}: overflow`);assert.equal(state.cards,1);assert.equal(state.loaded,300);assert.deepEqual(errors,[],file);
   assert.ok(state.cls<=.01,`${file} ${width}: layout shift ${state.cls}`);
   if(process.env.AXE_PATH){
    await page.addScriptTag({path:process.env.AXE_PATH});
    const audit=await page.evaluate(()=>axe.run(document.querySelector('.affiliate-card'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    assert.deepEqual(audit.violations.map(v=>({id:v.id,impact:v.impact})),[],`${file} ${width} ${theme}: accessibility`);
   }
   for(const link of await card.locator('a').all())assert.equal(await link.getAttribute('rel'),'sponsored nofollow noopener');
   if(['index.html','calculadoras/prestamo.html','articulos/costo-total-prestamo-como-calcular.html'].includes(file)&&width===390)await page.screenshot({path:path.join(output,file.replaceAll('/','_')+'-'+theme+'.png'),fullPage:false});
   report.pages.push({file,width,theme,...state});
  }
  for(const file of ['calculadoras/descuento.html','calculadoras/prestamo.html','calculadoras/iva.html','calculadoras/iva-incluido.html','calculadoras/precio-sin-descuento.html','calculadoras/costo-unidad.html','calculadoras/salario-diario.html','calculadoras/pago-quincenal.html']) {
   const results=[];
   for(const host of ['baseline.test','updated.test']) {
    await page.goto('https://'+host+'/'+file);await page.locator('.calc-button').click();
    // Compare monetary/numeric rows; the surrounding UI includes a live timestamp.
    results.push(await page.locator('#resultado .result-row').allTextContents());
    if(host==='updated.test'&&await page.locator('[data-affiliate]').count()) {
     const r=await page.locator('#resultado').boundingBox(),a=await page.locator('[data-affiliate]').boundingBox();assert.ok(a.y>=r.y+r.height,file+': ad interrupts results');
    }
   }
   assert.deepEqual(results[1],results[0],file+': result differs');assert.ok(results[1].length>0);report.calculators.push({file,result:results[1]});
  }
  await page.setViewportSize({width:390,height:900});await page.goto('https://updated.test/calculadoras/prestamo.html?monto=12345');
  await page.locator('.affiliate-card__banner').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(()=>window.qaEvents.length),0,'events without consent');
  await page.evaluate(()=>{window.CM_AFFILIATE_ANALYTICS_CONSENT=true;window.dispatchEvent(new Event('cm:analytics-consent-change'));});await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(()=>window.qaEvents.filter(e=>e.name==='affiliate_card_view').length),1);
  await page.evaluate(()=>{document.querySelector('.affiliate-card__cta').addEventListener('click',e=>e.preventDefault());document.querySelector('.affiliate-card__cta').click();});
  report.events=await page.evaluate(()=>window.qaEvents);
  assert.ok(report.events.some(e=>e.name==='affiliate_click'&&e.program==='solcredito'));
  assert.ok(!JSON.stringify(report.events).includes('12345'));assert.ok(!JSON.stringify(report.events).includes('?'));
  const count=report.events.length;
  await page.evaluate(()=>{window.CM_AFFILIATE_ANALYTICS_CONSENT=false;window.dispatchEvent(new Event('cm:analytics-consent-change'));document.querySelector('.affiliate-card__cta').click();});
  assert.equal(await page.evaluate(()=>window.qaEvents.length),count,'events after withdrawal');
  await page.evaluate(()=>{window.CM_AFFILIATE_ANALYTICS_CONSENT=true;Object.defineProperty(navigator,'globalPrivacyControl',{value:true});document.querySelector('.affiliate-card__cta').click();});
  assert.equal(await page.evaluate(()=>window.qaEvents.length),count,'events with GPC');
  // Network failure: the text CTA remains accessible and the image keeps its box.
  await context.route('https://ad.admitad.com/**',r=>r.abort());
  await page.goto('https://updated.test/index.html');await page.locator('.affiliate-card').scrollIntoViewIfNeeded();
  assert.ok(await page.locator('.affiliate-card__cta').isVisible());
  const box=await page.locator('.affiliate-card__banner').boundingBox();assert.ok(box.height>200);
  report.status='PASS';report.maxSyntheticCLS=Math.max(...report.pages.map(p=>p.cls));
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,layouts:report.pages.length,calculators:report.calculators.length,maxSyntheticCLS:report.maxSyntheticCLS,events:report.events.length}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
