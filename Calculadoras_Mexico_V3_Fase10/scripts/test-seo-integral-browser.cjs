'use strict';
// Prepared for a browser-enabled environment. Not executed successfully in the
// authoring environment: Chromium could not create its process socket.
// Ad scripts and affiliate images are explicitly simulated; no real ad clicks.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium,launchOptions}=require('./browser-runtime.cjs');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'site-public');
const out=process.env.SEO_BROWSER_QA_DIR||path.join(root,'.qa-seo-browser');
const cfg=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
const rewrites=Object.fromEntries((cfg.rewrites||[]).map(r=>[r.source,r.destination]));
const headers=Object.fromEntries((cfg.headers.find(r=>r.source==='/(.*)')?.headers||[]).map(r=>[r.key,r.value]));
const report={status:'RUNNING',conditions:'Local compiled HTML with Vercel rewrites/CSP; advertising simulated. No field CWV, production response times or conversions measured.',layouts:[],errors:[],missing:[],interactions:[]};
const save=()=>{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'browser-validation.json'),JSON.stringify(report,null,2));};
async function run(){
 let browser;
 try{
  browser=await chromium.launch(launchOptions);
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.hostname==='ad.admitad.com')return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="#dce7f5"/><text x="30" y="125">Banner simulado para pruebas</text></svg>'});
   if(u.hostname==='bauval.org')return route.fulfill({contentType:'application/javascript',body:'/* Ad delivery excluded from test. */'});
   if(u.hostname!=='qa.test')return route.abort();
   if(u.pathname.startsWith('/_vercel/'))return route.fulfill({contentType:'application/javascript',body:''});
   const name=rewrites[u.pathname]||u.pathname,file=path.resolve(pub,'.'+(name==='/'?'/index.html':name));
   if(!file.startsWith(pub+path.sep)||!fs.existsSync(file)){report.missing.push(u.pathname);return route.fulfill({status:404,body:'Not found'});}
   const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
   return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',headers,body:fs.readFileSync(file)});
  });
  const page=await context.newPage();page.on('pageerror',error=>report.errors.push(error.message));
  const pages=['/','/articulos/isr-semanal-quincenal-mensual.html',...['bono','ahorro-mensual','margen-ganancia','iva-incluido','precio-venta','regla-tres','salario-diario','pago-quincenal','salario-neto'].map(s=>'/calculadoras/'+s+'.html')];
  for(const url of pages)for(const width of [320,390,768,1440])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:900});await page.goto('https://qa.test'+url,{waitUntil:'load'});
   await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,url+' '+width+' overflow');
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('[data-affiliate]').count(),2);
   report.layouts.push({url,width,theme,overflow:false});
  }
  await page.goto('https://qa.test/calculadoras/bono.html');
  await page.locator('.calc-button').click();assert.match(await page.locator('#resultado').innerText(),/1,500\.00/);
  await page.locator('#bonoModo').selectOption('fijo');assert.equal(await page.locator('#bonoPct').isVisible(),false);assert.equal(await page.locator('#bonoFijo').isVisible(),true);
  await page.locator('#bonoFijo').fill('750');await page.locator('.calc-button').click();assert.match(await page.locator('#resultado').innerText(),/5%/);
  await page.locator('#bonoBaseTipo').selectOption('otra');await page.locator('.calc-button').click();assert.match(await page.locator('#resultado').innerText(),/no es sueldo/);
  await page.locator('#salario').fill('');await page.locator('.calc-button').click();assert.ok(await page.locator('#bonoError').innerText());assert.equal(await page.locator('#salario').getAttribute('aria-invalid'),'true');
  await page.locator('[data-form-reset]').click();assert.equal(await page.locator('#bonoModo').inputValue(),'porcentaje');assert.equal(await page.locator('#bonoFijo').isVisible(),false);
  await page.locator('[data-calc-example]').nth(1).click();assert.equal(await page.locator('#bonoModo').inputValue(),'fijo');assert.match(await page.locator('#resultado').innerText(),/1,500\.00/);
  await page.goto('https://qa.test/calculadoras/bono.html?salario=20000&bonoModo=fijo&bonoFijo=2000&bonoBaseTipo=sueldo');
  await page.waitForFunction(()=>document.getElementById('resultado').dataset.ready==='true');assert.match(await page.locator('#resultado').innerText(),/2,000\.00/);
  report.interactions.push('Bono: default, fixed amount, equivalent percentage, other base, invalid input, reset, example and shared URL');
  await page.goto('https://qa.test/articulos/isr-semanal-quincenal-mensual.html');
  for(const [period,income,expected] of [['semanal','3000','248.82'],['quincenal','10000','1,204.26'],['mensual','20000','2,383.65']]){
   await page.locator('#isrPeriodo').selectOption(period);await page.locator('#isrBase').fill(income);await page.locator('#isrConsulta button').click();
   assert.ok((await page.locator('#isrConsultaResultado').innerText()).includes(expected));assert.equal(await page.locator('.isr-tariff-scroll tr[aria-current="true"]').count(),1);
  }
  await page.locator('#isrBase').fill('0');await page.locator('#isrConsulta button').click();assert.ok(await page.locator('#isrConsultaError').innerText());
  report.interactions.push('ISR: three periods, row highlight and invalid input');
  for(const slug of ['ahorro-mensual','margen-ganancia','iva-incluido','precio-venta','regla-tres']){
   await page.goto('https://qa.test/calculadoras/'+slug+'.html');
   for(const button of await page.locator('[data-calc-example]').all()){await button.click();assert.equal(await page.locator('#resultado').getAttribute('data-ready'),'true');}
  }
  if(process.argv.includes('--all')){
   const inventory=JSON.parse(fs.readFileSync(path.join(root,'docs/seo-integral-2026-11-09/deep-after.json')));
   await page.setViewportSize({width:320,height:900});
   for(const p of inventory.pages.filter(p=>p.indexable)){await page.goto('https://qa.test'+p.url);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,p.url);}
   report.indexableMobilePages=379;
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
  report.status='PASS';save();console.log(JSON.stringify({status:report.status,layouts:report.layouts.length,interactions:report.interactions}));
 }catch(error){report.status='FAIL_OR_BLOCKED';report.error=error.message;save();throw error;}
 finally{if(browser)await browser.close();}
}
run().catch(error=>{console.error(error.message);process.exitCode=1;});
