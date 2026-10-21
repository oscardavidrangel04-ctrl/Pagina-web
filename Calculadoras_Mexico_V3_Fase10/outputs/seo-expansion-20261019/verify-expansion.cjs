const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const {chromium} = require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = process.cwd(), out = path.join(root,'outputs/seo-expansion-20261019');
const rewrites=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8').replace(/^\uFEFF/,'')).rewrites||[];
const checks=[];
function ok(name,value,detail){checks.push({name,pass:!!value,detail});assert.ok(value,name);}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='local.test')return route.abort();
  let p=decodeURIComponent(u.pathname);
  const rewrite=rewrites.find(r=>r.source===p);
  if(rewrite)p=rewrite.destination;
  if(p==='/')p='/index.html';
  if(p.startsWith('/_vercel/'))return route.fulfill({body:'',contentType:'application/javascript'});
  const file=path.resolve(root,'.'+p);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'not found'});
  const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
  await route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'});
 });
 const page=await context.newPage(), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const routes=['/calculadoras/quincenas-a-meses.html','/articulos/aguinaldo-trabajadoras-hogar.html','/calculadoras/salario-diario-integrado.html','/articulos/factor-integracion-sdi.html'];
 for(const route of routes){
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:1000});
   await page.goto('https://local.test'+route,{waitUntil:'networkidle'});
   ok('one H1 '+route+' '+width,await page.locator('h1').count()===1);
   ok('no horizontal overflow '+route+' '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const missing=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>a.hash&&!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash));
   ok('anchors '+route+' '+width,missing.length===0,missing);
   await page.screenshot({path:path.join(out,path.basename(route,'.html')+'-'+width+'.png'),fullPage:false});
  }
 }
 await page.goto('https://local.test/calculadoras/quincenas-a-meses.html',{waitUntil:'networkidle'});
 for(const [q,months,years] of [[24,12,1],[48,24,2],[144,72,6],[275,137.5,11.458333],[3,1.5,.125],[0,0,0]]){
  await page.locator('#quincenas').fill(String(q));
  await page.locator('#quincenas').press('Enter');
  const text=await page.locator('#duration-result').innerText();
  ok('convert '+q,text.includes(months+' '+(months===1?'mes':'meses'))&&text.includes(years+' '+(years===1?'año':'años')),text);
 }
 for(const value of ['', '-1','1000000001']){
  await page.locator('#quincenas').fill(value);await page.locator('#duration-form [type=submit]').click();
  ok('reject '+JSON.stringify(value),await page.locator('#quincenas').getAttribute('aria-invalid')==='true');
  ok('clear stale result '+JSON.stringify(value),(await page.locator('#duration-result').innerText())==='');
 }
 await page.locator('[data-quincenas="144"]').click();
 ok('preset 144',(await page.locator('#duration-result').innerText()).includes('72 meses'));
 await page.locator('#duration-form [type=reset]').click();
 await page.waitForFunction(()=>document.getElementById('quincenas').value==='48'&&document.getElementById('duration-result').textContent.includes('24 meses'));
 ok('reset restores 48',true);
 await page.goto('https://local.test/calculadoras/salario-diario-integrado.html',{waitUntil:'networkidle'});
 for(const [preset,total] of [['basico','524.66'],['segundo','525.34'],['superior','554.79']]){
  await page.locator('[data-sdi-example="'+preset+'"]').click();
  const text=await page.locator('#resultado').innerText();
  ok('SDI '+preset,text.includes(total),text);
 }
 await page.locator('#salarioDiario').fill('');
 await page.locator('.calc-button').click();await page.waitForTimeout(100);
 ok('SDI blank focus',await page.evaluate(()=>document.activeElement.id==='salarioDiario'));
 ok('SDI blank ready cleared',await page.locator('#resultado').getAttribute('data-ready')===null);
 await page.locator('#salarioDiario').fill('-10');await page.locator('.calc-button').click();
 ok('SDI negative',await page.locator('#salarioDiario').getAttribute('aria-invalid')==='true');
 await page.goto('https://local.test/articulos/factor-integracion-sdi.html',{waitUntil:'networkidle'});
 await page.locator('.header-actions [data-search-open]').click();
 await page.locator('.global-search').fill('quincenas a meses');
 await page.waitForFunction(()=>document.querySelector('.search-results')?.textContent.includes('Quincenas a meses'));
 ok('search fallback JSON finds new tool',await page.locator('.search-results a[href$="calculadoras/quincenas-a-meses.html"]').count()>0);
 await page.goto('https://local.test/calculadoras.html',{waitUntil:'networkidle'});
 ok('catalog card new tool',await page.locator('.catalog-grid a[href$="calculadoras/quincenas-a-meses.html"]').count()>0);
 ok('no JavaScript errors',errors.length===0,errors);
 const nojs=await browser.newContext({javaScriptEnabled:false});
 await nojs.route('**/*',async route=>{
  const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.abort();
  const file=path.join(root,u.pathname);if(!fs.existsSync(file))return route.abort();
  await route.fulfill({path:file});
 });
 const staticPage=await nojs.newPage();await staticPage.goto('https://local.test/calculadoras/quincenas-a-meses.html');
 ok('no-JS formula/table',await staticPage.locator('#tabla tbody tr').count()===11);
 await nojs.close();
 }finally{
 await browser.close();
 fs.writeFileSync(path.join(out,'pruebas-expansion.json'),JSON.stringify({status:checks.every(c=>c.pass)?'PASS':'FAIL',checks},null,2));
 console.log(JSON.stringify(checks,null,2));
 }
})().catch(e=>{console.error(e);process.exitCode=1});
