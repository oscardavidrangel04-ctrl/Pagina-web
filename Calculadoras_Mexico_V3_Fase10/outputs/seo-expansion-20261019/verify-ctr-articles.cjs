const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'../..');
const slugs=['aguinaldo-por-antiguedad','aguinaldo-3-meses','cuando-pagan-finiquito'];
const rewrites=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites;
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 try{
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.abort();
    const url=rewrites.find(r=>r.source===u.pathname)?.destination||u.pathname;
    const target=path.resolve(root,'.'+decodeURIComponent(url));
    if(!target.startsWith(root+path.sep)||!fs.existsSync(target))return route.fulfill({status:404,body:''});
    const types={'.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.html':'text/html; charset=utf-8','.json':'application/json'};
    return route.fulfill({contentType:types[path.extname(target)]||'application/octet-stream',body:fs.readFileSync(target)});
   });
   for(const slug of slugs){
    assert.equal(fs.readFileSync(path.join(root,'articulos',slug+'.html'),'utf8'),fs.readFileSync(path.join(root,'fallback-'+slug+'.html'),'utf8'));
    await page.goto('http://local.test/articulos/'+slug+'.html',{waitUntil:'load'});
    const state=await page.evaluate(()=>{
     const json=[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent));
     return {h1:document.querySelectorAll('h1').length,title:document.title,og:document.querySelector('meta[property="og:title"]').content,desc:document.querySelector('meta[name="description"]').content,canon:document.querySelector('link[rel="canonical"]').href,overflow:document.documentElement.scrollWidth>innerWidth+2,broken:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>id&&!document.getElementById(id)),schemas:json.length};
    });
    assert.equal(state.h1,1);assert.equal(state.title,state.og);assert(state.desc.length>100);assert(!state.overflow,slug+' overflow');assert.equal(state.broken.length,0,slug+JSON.stringify(state.broken));assert(state.canon.endsWith('/articulos/'+slug+'.html'));
    if(slug==='aguinaldo-por-antiguedad'){
     await page.locator('#antiguedadSueldo').fill('15000');await page.locator('#antiguedadDiasAguinaldo').fill('15');await page.locator('#antiguedadDiasTrabajados').fill('365');await page.locator('#calcularAguinaldoAntiguedad').click();
     assert((await page.locator('#resultadoAguinaldoAntiguedad').innerText()).includes('$7,500.00'));
     await page.locator('#antiguedadDiasTrabajados').fill('182');await page.locator('#calcularAguinaldoAntiguedad').click();assert((await page.locator('#resultadoAguinaldoAntiguedad').innerText()).includes('$3,739.73'));
    }
    if(slug==='cuando-pagan-finiquito'){
     await page.locator('.fp-faq summary').first().click();assert(await page.locator('.fp-faq').first().evaluate(e=>e.open));
    }
    await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(__dirname,'ctr-'+slug+'-'+width+'.png')});
    results.push({slug,width,status:'PASS',title:state.title});
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  fs.writeFileSync(path.join(__dirname,'ctr-pruebas.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({status:'PASS',views:results.length}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
