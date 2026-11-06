'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const changes=require('../docs/seo-geo/implemented-changes.json');
const files=[...new Set(changes.map(c=>c.canonical))];
const baseline=process.env.SEO_BASELINE_DIR;
const output=process.env.SEO_QA_DIR;
if(!baseline||!output)throw Error('Set SEO_BASELINE_DIR and SEO_QA_DIR to non-public directories');
fs.mkdirSync(output,{recursive:true});
const result={status:'PASS',conditions:'Local Chromium; third-party ads/analytics blocked. No field CWV or live rankings measured.',layouts:[],calculators:[],schema:[]};
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const c=await b.newContext({serviceWorkers:'block'});
  await c.route('**/*',r=>{
   const u=new URL(r.request().url());if(!['updated.test','baseline.test'].includes(u.host))return r.abort();
   if(u.pathname.startsWith('/_vercel/'))return r.fulfill({body:'',contentType:'application/javascript'});
   const f=path.join(u.host==='updated.test'?root:baseline,u.pathname==='/'?'index.html':u.pathname);
   if(!fs.existsSync(f))return r.fulfill({status:404,body:''});
   const type={'.css':'text/css','.js':'application/javascript','.html':'text/html','.svg':'image/svg+xml','.json':'application/json'}[path.extname(f)]||'application/octet-stream';
   return r.fulfill({body:fs.readFileSync(f),contentType:type});
  });
  const p=await c.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));
  for(const file of files)for(const width of [390,1440]){
   errors=[];await p.setViewportSize({width,height:900});await p.goto('https://updated.test/'+file);
   assert.deepEqual(errors,[],file);assert.equal(await p.locator('h1').count(),1,file);
   const stats=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,heading:document.querySelector('h1').textContent,canonical:document.querySelector('link[rel=canonical]').href}));
   assert.equal(stats.overflow,false,file+' '+width+' overflow');
   const schema=await p.evaluate(()=>[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{const d=JSON.parse(s.textContent);return d['@graph']||[d]}));
   for(const entity of schema.filter(s=>s['@type']==='FAQPage'))for(const q of entity.mainEntity||[]){
    const found=await p.evaluate(({q,a})=>{
     const clean=s=>s.replace(/\s+/g,' ').replace(/\s+([;,.])/g,'$1').trim();const t=clean(document.querySelector('main').textContent);
     return t.includes(clean(q))&&t.includes(clean(a));
    },{q:q.name,a:q.acceptedAnswer.text});assert.ok(found,file+': schema FAQ not present '+q.name);
   }
   // Scroll each changed section to exercise intrinsic sizing and responsive tables.
   for(const section of await p.locator('.seo-evidence,.seo-guide,#conversion-diaria-resumen').all()){
    await section.scrollIntoViewIfNeeded();await p.waitForTimeout(80);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,file+': section overflow');
   }
   if(width===390&&/salario-diario|pago-quincenal/.test(file)){
    await p.locator('h1').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(output,path.basename(file)+'.png')});
   }
   result.layouts.push({file,width,...stats});if(width===390)result.schema.push({file,types:schema.map(s=>s['@type'])});
  }
  // Equivalent default calculations before/after, excluding timestamps and prose.
  for(const file of files.filter(f=>f.startsWith('calculadoras/'))){
   let rows=[];
   for(const host of ['baseline.test','updated.test']){
    await p.goto('https://'+host+'/'+file);const button=p.locator('.calc-button').first();
    if(await button.count())await button.click();else throw Error('No calculator action: '+file);
    rows.push(await p.locator('.result .result-row,.result .salary-hour-result-head,.result .salary-hour-result-grid').allTextContents());
   }
   assert.ok(rows[0].length>0,file+': no results');assert.deepEqual(rows[1],rows[0],file+': calculation changed');result.calculators.push({file,rows:rows[1]});
  }
  const scenarios=[
   ['salario-diario',{salario:'2500'}, {periodo:'semanal'},'357.14'],
   ['pago-quincenal',{salario:'8250'}, {},'4,125.00'],
   ['ahorro-mensual',{inicial:'1000',aportacion:'500',tasa:'12',meses:'12'}, {},'7,468.08'],
   ['margen-ganancia',{costo:'700',venta:'1000'}, {},'30'],
   ['salario-hora',{salario:'18000',horasSemana:'48'}, {},'86.54']
  ];
  for(const [slug,inputs,selects,expected] of scenarios){
   await p.goto('https://updated.test/calculadoras/'+slug+'.html');
   for(const [id,v] of Object.entries(inputs))await p.locator('#'+id).fill(v);
   for(const [id,v] of Object.entries(selects))await p.locator('#'+id).selectOption(v);
   await p.locator('.calc-button').first().click();const text=await p.locator('.result').first().innerText();assert.ok(text.includes(expected),slug+': example mismatch '+text);
  }
  // Important explanations and links are available without client-side JavaScript.
  const nojs=await b.newContext({javaScriptEnabled:false,serviceWorkers:'block'});
  await nojs.route('**/*',r=>{const u=new URL(r.request().url());const f=path.join(root,u.pathname);if(u.host!=='updated.test'||!fs.existsSync(f))return r.abort();return r.fulfill({body:fs.readFileSync(f),contentType:f.endsWith('.css')?'text/css':'text/html'});});
  for(const slug of ['salario-diario','pago-quincenal']){const q=await nojs.newPage();await q.goto('https://updated.test/calculadoras/'+slug+'.html');assert.ok(await q.locator('.seo-guide').isVisible());assert.ok(await q.locator('table').count());await q.close();}
  result.examples=scenarios.length;result.noJavaScript='PASS';fs.writeFileSync(path.join(output,'seo-browser.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({status:result.status,layouts:result.layouts.length,calculators:result.calculators.length,examples:result.examples,noJavaScript:result.noJavaScript}));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
