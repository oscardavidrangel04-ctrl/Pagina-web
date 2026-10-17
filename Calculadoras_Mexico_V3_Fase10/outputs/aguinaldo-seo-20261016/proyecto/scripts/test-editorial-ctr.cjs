const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const edits=JSON.parse(fs.readFileSync(path.join(root,'outputs/CTR_ARTICULOS_2026-10-15.json'),'utf8'));
const cfg=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
const rewrites=Object.fromEntries(cfg.rewrites.map(r=>[r.source,r.destination]));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});const results=[];
 try{
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:960},javaScriptEnabled:false});
   const page=await context.newPage();
   page.setDefaultTimeout(12000);
   await page.route('**/*',route=>{
    const url=new URL(route.request().url());if(url.hostname!=='local.test')return route.abort();
    const file=path.resolve(root,'.'+(rewrites[url.pathname]||url.pathname));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
    const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml'};
    return route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'});
   });
   for(const row of edits){
    console.log(`Checking ${width}: ${row.url}`);
    await page.goto('http://local.test'+row.url,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>{const s=document.createElement('style');s.textContent='* { content-visibility: visible !important; }';document.head.append(s);});
    const checks=await page.evaluate(()=>{
     const nodes=[];function walk(v){if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object'){nodes.push(v);Object.values(v).forEach(x=>{if(typeof x==='object')walk(x);});}}
     document.querySelectorAll('script[type="application/ld+json"]').forEach(s=>walk(JSON.parse(s.textContent)));
     return {title:document.title,description:document.querySelector('meta[name=description]').content,og:document.querySelector('meta[property="og:title"]')?.content,
      canonical:document.querySelector('link[rel=canonical]')?.href,h1:document.querySelectorAll('h1').length,original:document.querySelectorAll('[data-editorial-ctr]').length,
      overflow:document.documentElement.scrollWidth>innerWidth+2,
      updated:nodes.filter(x=>['Article','BlogPosting','WebPage'].includes(x['@type'])).every(x=>x.dateModified==='2026-10-15')};
    });
    if(checks.title!==row.title||checks.description!==row.description||checks.og!==row.title||checks.canonical!=='https://calculadora-isr-mexico.vercel.app'+row.url||checks.h1!==1||checks.original!==1||checks.overflow||!checks.updated)throw Error(row.url+JSON.stringify(checks));
    await page.locator('[data-editorial-ctr]').scrollIntoViewIfNeeded();
    if(['salario-bruto-neto.html','convertir-salario-mensual-diario-hora.html','como-calcular-aguinaldo.html'].includes(path.basename(row.url)))await page.screenshot({path:path.join(root,'outputs',`editorial-${path.basename(row.url,'.html')}-${width}.png`)});
    results.push({url:row.url,width,status:'PASS'});
   }
   await context.close();
  }
  console.log(JSON.stringify({status:'PASS',views:results.length,javaScriptDisabled:true},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
