const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const changes=JSON.parse(fs.readFileSync(path.join(root,'outputs/CTR_2026-10-15_cambios.json'),'utf8'));
const expected={'salario-neto':'17,000','salario-bruto':'20,000','pago-quincenal':'7,500','salario-diario':'500','salario-hora':'72.12','aguinaldo':'7,500','aguinaldo-proporcional':'3,698.63','finiquito':'9,948.63','liquidacion':'75,000','vacaciones':'7,500','prima-vacacional':'1,500'};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const results=[];
 try{
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:950}});
   const page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const url=new URL(route.request().url());if(url.hostname!=='local.test')return route.abort();
    const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
    const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
    return route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'});
   });
   for(const change of changes){
    await page.goto('http://local.test'+change.url,{waitUntil:'load'});
    const check=await page.evaluate(()=>{
     const norm=s=>s.replace(/\s+/g,' ').trim();
     const flat=[];const visit=v=>{if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object'){if(v['@type'])flat.push(v);Object.values(v).forEach(x=>{if(typeof x==='object')visit(x)});}};
     document.querySelectorAll('script[type="application/ld+json"]').forEach(x=>visit(JSON.parse(x.textContent)));
     const visible=[...document.querySelectorAll('details')].map(x=>norm(x.querySelector('summary')?.textContent||''));
     const faq=flat.filter(x=>x['@type']==='FAQPage');
     return {h1:document.querySelectorAll('h1').length,title:document.title,description:document.querySelector('meta[name=description]').content,
      og:document.querySelector('meta[property="og:title"]').content,
      overflow:document.documentElement.scrollWidth>innerWidth+2,
      original:document.querySelectorAll('[data-ctr-review="20261015"]').length,
      danglingFaq:faq.flatMap(x=>x.mainEntity||[]).filter(x=>!visible.includes(norm(x.name))).map(x=>x.name)};
    });
    if(check.h1!==1||check.original!==1||check.title!==change.after||check.og!==change.after||check.description!==change.description||check.overflow||check.danglingFaq.length)throw Error(change.url+JSON.stringify(check));
    await page.locator('.calc-button').click();
    const result=await page.locator('#resultado').innerText();
    const slug=path.basename(change.url,'.html');
    if(expected[slug]&&!result.includes(expected[slug]))throw Error(slug+' unexpected: '+result);
    if(slug==='isr'&&!result.includes('ISR estimado'))throw Error('ISR output missing');
    results.push({url:change.url,width,status:'PASS'});
    if(['salario-neto','vacaciones'].includes(slug)&&width===390){
     await page.addStyleTag({content:'* { content-visibility: visible !important; }'});
     await page.locator('[data-ctr-review]').scrollIntoViewIfNeeded();
     await page.screenshot({path:path.join(root,'outputs','ctr-'+slug+'-mobile.png')});
    }
   }
   if(errors.length)throw Error(errors.join('; '));await context.close();
  }
  console.log(JSON.stringify({status:'PASS',views:results.length,results},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
