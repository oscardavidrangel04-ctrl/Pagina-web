const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium, launchOptions} = require('./browser-runtime.cjs');
const root=path.resolve(__dirname,'..');
require(path.join(root,'assets/js/catalog.js'));
const publicSlugs=fs.readdirSync(path.join(root,'calculadoras')).filter(name=>name.endsWith('.html')).map(name=>name.slice(0,-5)).sort();
assert.deepEqual(globalThis.CM_CATALOG.map(item=>item.slug).sort(),publicSlugs,'Every calculator must appear in search');
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'assets/data/calculators.json'),'utf8')),globalThis.CM_CATALOG,'Keep lightweight and full catalogs in sync');
assert.equal(fs.readFileSync(path.join(root,'assets/js/common.js'),'utf8'),fs.readFileSync(path.join(root,'assets/js/common.min.js'),'utf8'));
const cfg=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
const rewrites=Object.fromEntries(cfg.rewrites.map(x=>[x.source,x.destination]));
(async()=>{
 const browser=await chromium.launch(launchOptions);
 try{
  const page=await browser.newPage();let requests=0,fail=false;const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.abort();
   if(u.pathname==='/assets/data/calculators.json'){requests++;if(fail)return route.fulfill({status:503,body:''});await new Promise(r=>setTimeout(r,150));}
   const p=rewrites[u.pathname]||u.pathname;
   const file=path.resolve(root,'.'+(p==='/'?'/index.html':p));
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
   const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
   return route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
  });
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});
   for(const url of ['/','/calculadoras/salario-neto.html','/calculadoras/aguinaldo.html','/calculadoras/salario-hora.html','/articulos/aguinaldo-por-antiguedad.html','/temas/nomina.html']){
    requests=0;await page.goto('http://local.test'+url);
    assert.equal(requests,0,'Do not fetch catalog on initial load');
    assert.equal(await page.locator('h1').count(),1);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Horizontal overflow '+url);
    assert(await page.locator('h1').isVisible());
    console.log('OK viewport',width,url);
   }
  }
  await page.goto('http://local.test/articulos/aguinaldo-por-antiguedad.html');requests=0;
  // Explicit concurrency proves one network request even before it completes.
  const lengths=await page.evaluate(()=>Promise.all([ensureCatalog(),ensureCatalog(),ensureCatalog()]).then(rows=>rows.map(x=>x.length)));
  assert.deepEqual(lengths,Array(3).fill(publicSlugs.length));assert.equal(requests,1);
  await page.evaluate(()=>ensureCatalog());assert.equal(requests,1);
  await page.keyboard.press('Control+k');await page.locator('.global-search').fill('aguinaldo');
  await page.waitForFunction(()=>document.querySelector('.search-results').textContent.includes('Aguinaldo'));
  await page.locator('.global-search').fill('salario');
  await page.waitForFunction(()=>!document.querySelector('.search-results').textContent.includes('Aguinaldo'));
  await page.keyboard.press('Escape');assert.equal(await page.locator('.search-dialog').getAttribute('aria-hidden'),'true');
  // Finish an older search after a newer one: the older results must not win.
  await page.keyboard.press('Control+k');
  await page.evaluate(async()=>{
   const original=ensureCatalog,items=await original();let calls=0;
   ensureCatalog=()=>new Promise(resolve=>setTimeout(()=>resolve(items),++calls===1?120:0));
   const input=document.querySelector('.global-search');
   input.value='aguinaldo';input.dispatchEvent(new Event('input'));
   input.value='salario';input.dispatchEvent(new Event('input'));
   await new Promise(resolve=>setTimeout(resolve,180));ensureCatalog=original;
  });
  assert(!(await page.locator('.search-results').textContent()).includes('Aguinaldo'));
  // Failed request must not poison the shared promise; a later attempt recovers.
  await page.reload();requests=0;fail=true;await page.evaluate(()=>ensureCatalog());fail=false;
  assert.equal(await page.evaluate(()=>ensureCatalog().then(x=>x.length)),publicSlugs.length);assert.equal(requests,2);
  assert.deepEqual(errors,[]);
  console.log('OK concurrent requests, search, retry, JS errors, catalog parity');
  const light=fs.statSync(path.join(root,'assets/data/calculators.json')).size,html=fs.statSync(path.join(root,'calculadoras.html')).size;
  console.log(JSON.stringify({catalogBytes:light,previousHtmlBytes:html,reductionPercent:Math.round((1-light/html)*100)}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
