'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),base=process.env.V2_BASELINE_DIR,out=process.env.V2_QA_DIR;
if(!base||!out)throw Error('Set V2_BASELINE_DIR to the c57dbf2 checkout and V2_QA_DIR outside site-public');
fs.mkdirSync(out,{recursive:true});
const pub=path.join(root,'site-public'),cfg=require('../vercel.json'),{transform,nativeId,bannerKey}=require('./monetization-v2.cjs');
const pilots=['index.html',...['salario-diario','pago-quincenal','aguinaldo','finiquito'].map(x=>'calculadoras/'+x+'.html')];
const rewrites=Object.fromEntries(cfg.rewrites.map(x=>[x.source,x.destination]));
const list=(dir,rel='')=>fs.readdirSync(path.join(dir,rel),{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(dir,path.join(rel,e.name)):[path.join(rel,e.name)]);
const htmlFiles=list(pub).filter(f=>f.endsWith('.html'));
const execScripts=s=>(s.match(/<script\b[\s\S]*?<\/script>/gi)||[]).filter(s=>!/^<script\b[^>]*type=["']application\/ld\+json["']/i.test(s));
const report={status:'RUNNING',conditions:'Built output; Vercel rewrites and CSP applied. External advertising scripts are intercepted with empty responses, banners simulated. No live advertising delivery, affiliate redirects or field CWV validated.',static:{pages:0,verificationFiles:0,adSensePreserved:0,legacyAffiliateDestinationsPreserved:0},layouts:[],calculators:[],accessibility:[],events:[]};
const save=()=>fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(report,null,2));
function staticChecks(){
 for(const file of htmlFiles){
  const before=fs.readFileSync(path.join(base,file),'utf8'),source=fs.readFileSync(path.join(root,file),'utf8'),html=fs.readFileSync(path.join(pub,file),'utf8');
  assert.deepEqual(execScripts(source),execScripts(before),file+' executable source scripts');
  for(const re of [/<link\b[^>]*rel="canonical"[^>]*>/gi,/<meta\b[^>]*name="robots"[^>]*>/gi,/<(?:input|select|textarea|button)\b[^>]*>/gi])assert.deepEqual(source.match(re),before.match(re),file+' source invariant');
  if(!/<body\b/i.test(html)){assert.equal(html,before,file+' verification');report.static.verificationFiles++;continue;}
  for(const re of [/<link\b[^>]*rel="canonical"[^>]*>/gi,/<meta\b[^>]*name="robots"[^>]*>/gi,/<title>[\s\S]*?<\/title>/gi])assert.deepEqual(html.match(re),source.match(re),file+' compiled SEO invariant');
  assert.equal((html.match(/<h1\b/gi)||[]).length,1,file+' compiled H1');
  for(const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi))JSON.parse(match[1]);
  report.static.pages++;
  for(const type of ['native','partners','banner'])assert.equal(html.split(`<!-- monetization-v2:${type}:start -->`).length-1,1,file+' '+type);
  assert.equal(html.split('id="container-'+nativeId+'"').length-1,1,file+' native container');
  assert.equal(html.split('src="https://bauval.org/21/'+nativeId+'"').length-1,1,file+' native script');
  assert.equal(html.split('https://bauval.org/22/'+bannerKey).length-1,1,file+' banner script');
  for(const name of ['aliexpress','solcredito'])assert.equal(html.split('data-affiliate="'+name+'"').length-1,1,file+' affiliate');
  assert.equal(html.split('src="/assets/js/affiliate-events.js?v=1"').length-1,1,file+' analytics');
  assert.equal(html.includes('/assets/css/pilot-v2.css'),pilots.includes(file),file+' pilot isolation');
  assert.equal((html.match(/adsbygoogle\.js/g)||[]).length,(before.match(/adsbygoogle\.js/g)||[]).length,file+' AdSense preservation');
  report.static.adSensePreserved+=(before.match(/adsbygoogle\.js/g)||[]).length;
  for(const match of before.matchAll(/href="(https:\/\/(?:rzekl|dkfrh)\.com\/[^\"]+)"/g)){
   assert.ok(html.includes(match[1]),file+' tracking destination lost');
   if(match[1].includes('1e8d114494934a2368'))report.static.legacyAffiliateDestinationsPreserved++;
  }
  assert.equal(transform(html,file).html,html,file+' idempotence');
 }
 for(const file of list(path.join(base,'assets')))assert.ok(fs.readFileSync(path.join(root,'assets',file)).equals(fs.readFileSync(path.join(base,'assets',file))),file+' existing asset changed');
 assert.deepEqual(cfg.rewrites,JSON.parse(fs.readFileSync(path.join(base,'vercel.json'))).rewrites);
 assert.equal(cfg.git.deploymentEnabled['codex/optimizacion-integral-v2-2026-11-06'],false);
 report.static.pilots=pilots;report.static.assets='existing assets byte-identical';save();console.log('Static checks PASS',report.static);
}
async function browserChecks(){
 const {chromium}=require('playwright');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="#edf1f7"/><text x="150" y="125" text-anchor="middle" fill="#173b40" font-family="sans-serif" font-size="15">Banner simulado para pruebas</text></svg>';
 const globalHeaders=Object.fromEntries(cfg.headers.find(x=>x.source==='/(.*)').headers.map(x=>[x.key,x.value]));
 const requests=[];
 try{
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',async r=>{
   const u=new URL(r.request().url());
   if(u.hostname==='ad.admitad.com')return r.fulfill({contentType:'image/svg+xml',body:svg});
   if(u.hostname==='bauval.org'){requests.push(u.href);return r.fulfill({contentType:'application/javascript',body:'/* External ad delivery excluded from local test. */'});}
   if(!['current.test','baseline.test'].includes(u.hostname))return r.abort();
   if(u.pathname.startsWith('/_vercel/'))return r.fulfill({contentType:'application/javascript',body:''});
   const dir=u.hostname==='baseline.test'?path.join(base,'site-public'):pub;
   const route=rewrites[u.pathname]||u.pathname,file=path.join(dir,route==='/'?'index.html':route);
   if(!fs.existsSync(file))return r.fulfill({status:404,body:''});
   const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
   return r.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream',headers:globalHeaders});
  });
  const page=await context.newPage();let errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.qaEvents=[];window.qaCLS=0;window.qaLCP=0;window.addEventListener('cm:affiliate',e=>qaEvents.push(e.detail));
   new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)qaCLS+=e.value})).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(l=>l.getEntries().forEach(e=>qaLCP=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});
  });
  await page.setViewportSize({width:320,height:900});
  let checked=0;
  for(const file of htmlFiles.filter(f=>!/^google/.test(f))){
   errors=[];await page.goto('https://current.test/'+file,{waitUntil:'load'});
   assert.equal(await page.locator('.cm-commercial').count(),3,file+' browser blocks');
   assert.equal(await page.locator('[data-affiliate]').count(),2,file+' browser affiliates');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,file+' overflow');
   assert.deepEqual(errors,[],file+' JS errors');
   if(++checked%50===0)console.log('Public pages checked',checked);
  }
  report.publicBrowserPages=checked;save();
  const extra=JSON.parse(fs.readFileSync(path.join(root,'docs/v2/seo-extra.json'))).map(x=>x.route);
  const seo=[...new Set([...extra,'articulos/cuanto-se-deja-propina-mexico.html','articulos/spei-devuelto-que-hacer.html','articulos/spei-liquidado-pero-no-recibido.html'])];
  for(const file of [...pilots,...seo])for(const [width,theme] of (pilots.includes(file)?[[320,'light'],[390,'light'],[1440,'light'],[320,'dark'],[390,'dark'],[1440,'dark']]:[[320,'light'],[1440,'dark']])){
   errors=[];await page.setViewportSize({width,height:900});await page.goto('https://current.test/'+file);await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);await page.waitForTimeout(100);
   const check=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,file+' '+width+' '+theme+' overflow');await check();
   if(pilots.includes(file))await page.screenshot({path:path.join(out,path.basename(file)+'-'+width+'-'+theme+'.png')});
   for(const el of await page.locator('.cm-commercial').all()){
    await el.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(80);await check();
   }
   const frame=page.frames().find(f=>f.url()==='about:srcdoc');assert.ok(frame,file+' iframe');
   assert.deepEqual(await frame.evaluate(()=>window.atOptions),{key:bannerKey,format:'iframe',height:250,width:300,params:{}},file+' atOptions isolation/CSP');
   assert.equal(await page.evaluate(()=>typeof window.atOptions),'undefined',file+' global collision');
   assert.deepEqual(errors,[],file+' JS');
   report.layouts.push({file,width,theme,overflow:false,cls:await page.evaluate(()=>qaCLS)});
   if(process.env.AXE_PATH&&(width===390||(seo.includes(file)&&width===320))){
    await page.addScriptTag({path:process.env.AXE_PATH});
    const violations=await page.evaluate(async()=>{const a=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
    for(const v of violations.filter(v=>v.id==='color-contrast')){
     const confirmed=[];
     for(const n of v.nodes){const target=page.locator(n.target[0]);await target.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(80);if(await target.evaluate(async e=>(await axe.run(e,{runOnly:['color-contrast']})).violations.length))confirmed.push(n);}
     v.nodes=confirmed;
    }
    report.accessibility.push({file,width,theme,violations:violations.filter(v=>v.nodes.length)});save();
   }
  }
  for(const slug of ['salario-diario','pago-quincenal','aguinaldo','finiquito','salario-neto','prima-vacacional','salario-diario-integrado','isr','prestamo','iva','descuento']){
   const values=[];
   for(const host of ['baseline.test','current.test']){await page.goto('https://'+host+'/calculadoras/'+slug+'.html');await page.locator('.calc-button').first().click();values.push(await page.locator('.result .result-row').allTextContents());}
   assert.ok(values[0].length,slug+' no result');assert.deepEqual(values[1],values[0],slug+' result regression');
   const result=await page.locator('.calc-layout').boundingBox(),ad=await page.locator('.cm-commercial--native').boundingBox();assert.ok(ad.y>=result.y+result.height-1,slug+' ad interrupts form/results');
   report.calculators.push({slug,rows:values[1]});
  }
  for(const [slug,input,expected] of [['salario-diario',{salario:'12000'},'400.00'],['pago-quincenal',{salario:'12000'},'6,000.00'],['salario-neto',{salario:'20000',isrManual:'2500',imss:'500',otras:'0'},'17,000.00']]){
   await page.goto('https://current.test/calculadoras/'+slug+'.html');for(const [id,value] of Object.entries(input))await page.locator('#'+id).fill(value);await page.locator('.calc-button').first().click();assert.ok((await page.locator('.result').innerText()).includes(expected),slug+' arithmetic');
  }
  await page.setViewportSize({width:390,height:900});await page.goto('https://current.test/calculadoras/prestamo.html?monto=12345');
  await page.locator('[data-affiliate="solcredito"] .affiliate-card__banner').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>qaEvents.length),0,'no consent');
  await page.evaluate(()=>{window.CM_AFFILIATE_ANALYTICS_CONSENT=true;window.dispatchEvent(new Event('cm:analytics-consent-change'));});await page.waitForTimeout(1100);
  await page.evaluate(()=>{const a=document.querySelector('[data-affiliate="solcredito"] .cm-commercial__cta');a.addEventListener('click',e=>e.preventDefault());a.click();});
  report.events=await page.evaluate(()=>qaEvents);assert.ok(report.events.some(x=>x.name==='affiliate_card_view'));assert.ok(report.events.some(x=>x.name==='affiliate_click'));assert.ok(!JSON.stringify(report.events).includes('12345'));
  const count=report.events.length;await page.evaluate(()=>{window.CM_AFFILIATE_ANALYTICS_CONSENT=false;document.querySelector('[data-affiliate="solcredito"] .cm-commercial__cta').click();});assert.equal(await page.evaluate(()=>qaEvents.length),count);
  await page.evaluate(()=>{window.CM_AFFILIATE_ANALYTICS_CONSENT=true;Object.defineProperty(navigator,'globalPrivacyControl',{value:true});document.querySelector('[data-affiliate="solcredito"] .cm-commercial__cta').click();});assert.equal(await page.evaluate(()=>qaEvents.length),count);
  assert.ok(requests.includes('https://bauval.org/21/'+nativeId));assert.ok(requests.includes('https://bauval.org/22/'+bannerKey));report.bannerCSP='PASS; iframe script requested, atOptions confined to child frame';
  report.performance=[];
  for(const file of pilots){const data={file};for(const host of ['baseline.test','current.test']){const runs=[];for(let i=0;i<3;i++){await page.setViewportSize({width:390,height:900});await page.goto('https://'+host+'/'+file);await page.waitForTimeout(250);runs.push(await page.evaluate(()=>({lcp:qaLCP,cls:qaCLS})));}data[host]=runs;}report.performance.push(data);}
  report.issues=report.accessibility.filter(x=>x.violations.length);report.status=report.issues.length?'ACCESSIBILITY_REVIEW':'PASS';save();console.log(JSON.stringify({status:report.status,publicPages:checked,layouts:report.layouts.length,calculators:report.calculators.length,accessibilityFindings:report.issues}));
 }finally{await browser.close();}
}
(async()=>{staticChecks();if(process.env.V2_STATIC_ONLY!=='1')await browserChecks();else{report.status='PASS_STATIC';save();}})().catch(e=>{report.status='FAIL';report.error=e.message;save();console.error(e.message);process.exitCode=1;});
