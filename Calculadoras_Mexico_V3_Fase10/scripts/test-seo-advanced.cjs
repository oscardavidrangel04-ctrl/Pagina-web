'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),baseline=process.env.SEO_ADVANCED_BASELINE_DIR,output=process.env.SEO_ADVANCED_QA_DIR;
if(!baseline||!output)throw Error('Set SEO_ADVANCED_BASELINE_DIR and SEO_ADVANCED_QA_DIR');
const changes=require('../docs/seo-avanzado/cambios-implementados.json');
const adsterra=require('./adsterra-unit.cjs');
const cfg=require('../vercel.json'),oldCfg=JSON.parse(fs.readFileSync(path.join(baseline,'vercel.json')));
const rewrites=Object.fromEntries(cfg.rewrites.map(r=>[r.source,r.destination]));
assert.deepEqual(cfg.rewrites,oldCfg.rewrites);assert.deepEqual(cfg.headers,oldCfg.headers);
assert.equal(cfg.git.deploymentEnabled['codex/seo-avanzado-semrush-2026-11-05'],false);
fs.mkdirSync(output,{recursive:true});
function list(dir,base=dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(dir,e.name),base):[path.relative(base,path.join(dir,e.name))]);}
const scripts=s=>(s.match(/<script\b[\s\S]*?<\/script>/gi)||[]).filter(t=>!/^<script\b[^>]*type=["']application\/ld\+json["']/i.test(t));
const cards=s=>s.match(/<!-- affiliate-card:start -->[\s\S]*?<!-- affiliate-card:end -->/g)||[];
const invariants={htmlFiles:0,originalAdsenseScripts:0,affiliateCards:0,assetFiles:0,forms:'unchanged',executableScripts:'byte-identical',assets:'byte-identical'};
for(const file of list(baseline)){
 const a=fs.readFileSync(path.join(baseline,file));
 if(file.endsWith('.html')){
  const before=a.toString(),after=fs.readFileSync(path.join(root,file),'utf8');
  const actualScripts=scripts(after);
  if(adsterra.placements.includes(file)){assert.equal(actualScripts.filter(s=>s===adsterra.script).length,1,file+' Adsterra');actualScripts.splice(actualScripts.indexOf(adsterra.script),1);}
  assert.deepEqual(actualScripts,scripts(before),file+' original executable scripts');
  assert.deepEqual(cards(after),cards(before),file+' affiliates');
  for(const pattern of [/<link\b[^>]*rel="canonical"[^>]*>/gi,/<meta\b[^>]*name="robots"[^>]*>/gi,/<(?:input|select|textarea|button)\b[^>]*>/gi])assert.deepEqual(after.match(pattern),before.match(pattern),file+' invariant');
  invariants.htmlFiles++;invariants.originalAdsenseScripts+=(before.match(/adsbygoogle\.js/g)||[]).length;invariants.affiliateCards+=cards(before).length;
 }
 if(file.startsWith('assets/')||/^(styles[^/]*\.css|robots\.txt|sw\.js|ads\.txt|llms\.txt)$/.test(file)){
  assert.ok(fs.readFileSync(path.join(root,file)).equals(a),file+' production resource changed');invariants.assetFiles++;
 }
}
// Preserve all five observed Top-3 titles/descriptions/H1s, resolving real routes.
const protectedPages=['articulos/dias-de-aguinaldo.html','articulos/que-es-ptu.html','calculadoras/salario-neto.html','articulos/aguinaldo-por-meses.html','articulos/como-calcular-prima-vacacional.html'];
for(const file of protectedPages){
 const actual=(rewrites['/'+file]||'/'+file).slice(1),a=fs.readFileSync(path.join(baseline,actual),'utf8'),b=fs.readFileSync(path.join(root,actual),'utf8');
 for(const pattern of [/<title>[\s\S]*?<\/title>/g,/<meta\b[^>]*name="description"[^>]*>/g,/<h1\b[^>]*>[\s\S]*?<\/h1>/g])assert.deepEqual(b.match(pattern),a.match(pattern),file+' Top 3');
}
const result={status:'PASS',conditions:'Local Chromium, Vercel rewrites resolved; ads and other external resources blocked. No live search rankings or field CWV.',invariants,protectedPages,layouts:[],calculators:[],accessibility:[],examples:[]};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  await context.route('**/*',r=>{
   const u=new URL(r.request().url());if(!['current.test','baseline.test'].includes(u.host))return r.abort();
   if(u.pathname.startsWith('/_vercel/'))return r.fulfill({body:'',contentType:'application/javascript'});
   const base=u.host==='current.test'?root:baseline,route=rewrites[u.pathname]||u.pathname;
   const file=path.join(base,route==='/'?'index.html':route);if(!fs.existsSync(file))return r.fulfill({status:404,body:''});
   const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
   return r.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
  });
  const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const {canonical:file} of changes.urls){
   for(const [width,theme] of [[320,'light'],[390,'light'],[1440,'light'],[320,'dark']]){
    errors=[];await page.setViewportSize({width,height:900});await page.goto('https://current.test/'+file);await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    assert.equal(await page.locator('h1').count(),1,file);
    const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    assert.equal(await overflow(),false,file+' '+width+' '+theme);
    for(const el of await page.locator('main table,main [data-seo-review],main .seo-guide').all()){
     await el.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(50);assert.equal(await overflow(),false,file+' table/section');
    }
    const schema=await page.evaluate(()=>[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(n=>{const d=JSON.parse(n.textContent);return d['@graph']||[d]}));
    for(const faq of schema.filter(e=>e['@type']==='FAQPage'))for(const q of faq.mainEntity){
     assert.ok(await page.evaluate(q=>{const clean=s=>s.replace(/\s+/g,' ').replace(/\s+([;,.])/g,'$1').trim(),text=clean(document.querySelector('main').textContent);return text.includes(clean(q.name))&&text.includes(clean(q.acceptedAnswer.text))},q),file+' FAQ not visible '+q.name);
    }
    assert.deepEqual(errors,[],file+' runtime errors');
    result.layouts.push({file,width,theme,servedFile:rewrites['/'+file]||'/'+file,overflow:false});
    if(width===390||theme==='dark'||width===1440){
     await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
     if(process.env.AXE_PATH&&(width===390||theme==='dark')){
      await page.addScriptTag({path:process.env.AXE_PATH});
      const violations=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
      // Axe can sample an unrelated footer background for an offscreen link.
      // Recheck each contrast node while visible; retain the original finding.
      const resolvedOffscreenFindings=[];
      for(const violation of violations.filter(v=>v.id==='color-contrast')){
       const confirmed=[];
       for(const node of violation.nodes){
        const target=page.locator(node.target[0]);
        await target.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
        await page.waitForTimeout(150);
        const visibleCheck=await target.evaluate(async e=>(await axe.run(e,{runOnly:['color-contrast']})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
        if(visibleCheck.length)confirmed.push(node);
        else resolvedOffscreenFindings.push({...node,visibleRecheck:'PASS'});
       }
       violation.nodes=confirmed;
      }
      const confirmedViolations=violations.filter(v=>v.nodes.length);
      result.accessibility.push({file,width,theme,violations:confirmedViolations,resolvedOffscreenFindings});
      assert.deepEqual(confirmedViolations,[],file+' '+width+' '+theme+' accessibility');
     }
     await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
     if(['calculadoras/prima-vacacional.html','articulos/que-son-honorarios.html','articulos/cuando-se-pagan-utilidades.html'].includes(file))await page.screenshot({path:path.join(output,path.basename(file)+'-'+width+'-'+theme+'.png')});
    }
   }
  }
  for(const slug of ['prima-vacacional','salario-diario-integrado','retenciones-isr-iva-honorarios','isr','finiquito','aguinaldo','salario-diario','pago-quincenal']){
   const snapshots=[];
   for(const host of ['baseline.test','current.test']){
    await page.goto('https://'+host+'/calculadoras/'+slug+'.html');await page.locator('.calc-button').first().click();
    snapshots.push(slug==='retenciones-isr-iva-honorarios'?[await page.locator('#resultado').innerText()]:await page.locator('.result .result-row').allTextContents());
   }
   assert.ok(snapshots[0].length,slug+' no result');assert.deepEqual(snapshots[1],snapshots[0],slug+' calculation changed');result.calculators.push({slug,rows:snapshots[1]});
  }
  const scenarios=[
   ['prima-vacacional',{salarioDiario:'500',dias:'12',prima:'25'},'1,500.00'],
   ['prima-vacacional',{salarioDiario:'700',dias:'20',prima:'25'},'3,500.00'],
   ['prima-vacacional',{salarioDiario:'500',dias:'22',prima:'30'},'3,300.00'],
   ['salario-diario-integrado',{salarioDiario:'500',diasAguinaldo:'15',diasVacaciones:'12',prima:'25'},'524.66']
  ];
  for(const [slug,inputs,expected] of scenarios){
   await page.goto('https://current.test/calculadoras/'+slug+'.html');for(const [id,value] of Object.entries(inputs))await page.locator('#'+id).fill(value);
   await page.locator('.calc-button').first().click();assert.ok((await page.locator('.result').innerText()).includes(expected),slug+' numerical example');result.examples.push({slug,inputs,expected});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false,serviceWorkers:'block'});
  await nojs.route('**/*',r=>{const u=new URL(r.request().url()),file=path.join(root,rewrites[u.pathname]||u.pathname);if(u.host!=='current.test'||!fs.existsSync(file))return r.abort();return r.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':'text/html'});});
  const p=await nojs.newPage();for(const {canonical:file} of changes.urls){await p.goto('https://current.test/'+file);assert.ok(await p.locator('main').isVisible());assert.ok(await p.locator('main h2').count());}result.noJavaScriptPages=changes.urls.length;
  fs.writeFileSync(path.join(output,'browser-and-preservation.json'),JSON.stringify(result,null,2));
  const violations=result.accessibility.filter(r=>r.violations.length);
  console.log(JSON.stringify({status:result.status,layouts:result.layouts.length,calculators:result.calculators.length,examples:result.examples.length,accessibilityCases:result.accessibility.length,pagesWithAxeFindings:violations.map(x=>({file:x.file,width:x.width,theme:x.theme,rules:x.violations.map(v=>v.id)})),invariants}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
