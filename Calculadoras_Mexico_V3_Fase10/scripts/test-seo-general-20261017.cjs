const fs = require('fs'), path = require('path'), assert = require('assert');
const {chromium} = require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const pages = ['/', '/temas/nomina.html', '/temas/impuestos.html', '/calculadoras/pago-quincenal.html', '/articulos/isr-semanal-quincenal-mensual.html', '/articulos/que-es-propina.html', '/articulos/propina-obligatoria-mexico.html'];
const rewrites = JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites;
(async () => {
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results=[];
 try {
  for (const width of [390,1440]) {
   const context=await browser.newContext({viewport:{width,height:900}}), page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.abort();
    const url=rewrites.find(r=>r.source===u.pathname)?.destination || (u.pathname==='/'?'/index.html':u.pathname);
    const file=path.resolve(root,'.'+decodeURIComponent(url));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
    const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
    return route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
   });
   for(const url of pages){
    await page.goto('http://local.test'+url,{waitUntil:'load'});
    const state=await page.evaluate(()=>{
     const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
     const schemas=[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent));
     return {h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+2,title:document.title,og:document.querySelector('meta[property="og:title"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,duplicates:ids.filter((v,i)=>ids.indexOf(v)!==i),brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id)),schemas:schemas.length};
    });
    assert.equal(state.h1,1,url);assert(!state.overflow,url+' overflow');assert.equal(state.duplicates.length,0,url+' duplicates');assert.equal(state.brokenAnchors.length,0,url+' anchors '+state.brokenAnchors);assert(state.canonical,url+' canonical');
    if(url==='/calculadoras/pago-quincenal.html'){
     await page.locator('#salario').fill('8250');await page.locator('.calc-button').click();
     const result=await page.locator('#resultado').innerText();assert(result.includes('4,125')&&result.includes('275'),result);
     assert(await page.locator('#equivalencia-quincena').evaluate(el=>!!(el.compareDocumentPosition(document.querySelector('#guia-del-calculo'))&Node.DOCUMENT_POSITION_FOLLOWING)));
    }
    if(url.includes('isr-semanal')){
     assert.equal(await page.locator('#tablas-isr-2026 tbody tr').count(),33);
     assert.equal(state.title,state.og);
     await page.locator('#tabla-isr-quincenal').scrollIntoViewIfNeeded();
     await page.screenshot({path:path.join(root,'outputs/seo-general-20261017/isr-'+width+'.png')});
    }
    results.push({url,width,status:'PASS'});
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  fs.writeFileSync(path.join(root,'outputs/seo-general-20261017/pruebas.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({status:'PASS',views:results.length}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
