'use strict';

// Regression suite for the three payroll pages. Remote advertising is simulated
// explicitly; these tests do not certify delivery, conversions or field CWV.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const {execFileSync} = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'site-public');
const BASE = process.env.NOMINA_BASE_COMMIT || 'dfe634e';
const OUT = process.env.NOMINA_QA_DIR || path.join(ROOT, 'docs/nomina-fase2');
const AXE = process.env.AXE_PATH || '/workspace/work/monetization-tools/node_modules/axe-core/axe.min.js';
const TARGETS = ['salario-neto','salario-diario','pago-quincenal'];
const CHANGED = new Set(TARGETS.map(s=>'calculadoras/'+s+'.html').concat([
  'assets/js/salario-neto-receipt.js', 'assets/css/salario-neto-focus.css',
  'assets/js/salario-diario.js', 'assets/js/pago-quincenal.js'
]));
const NATIVE = '409e3950cb7b10082bb628969be6611a';
const BANNER = '94dbe87812d642e0600cc58986b093c2';
const report = {status:'RUNNING',baseline:BASE,conditions:[
  'Compiled files served with Vercel rewrites and headers, including CSP.',
  'Adsterra is simulated with empty scripts; Admitad banners use labeled test SVGs. Other remote providers, including AdSense, are blocked.',
  'No real ad delivery, affiliate redirects, conversions, income or field Core Web Vitals are verified.'
],arithmetic:[],rejected:0,layouts:[],accessibility:[],interactions:[],errors:[],missingResources:[],structures:[],screenshots:[],localPerformance:[]};
fs.mkdirSync(OUT,{recursive:true});
const save=()=>fs.writeFileSync(path.join(OUT,'validation.json'),JSON.stringify(report,null,2)+'\n');
const read=p=>fs.readFileSync(p,'utf8');
const git=(...args)=>execFileSync('git',args,{cwd:ROOT,maxBuffer:32*1024*1024});
const walk=(dir,rel='')=>fs.readdirSync(path.join(dir,rel),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir,path.join(rel,e.name)):[path.join(rel,e.name)]);
const url=(slug,host='current.test')=>'https://'+host+'/calculadoras/'+slug+'.html';
const currency=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n);
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<Math.max(1e-8,Math.abs(b)*1e-12),label+': '+a+' vs '+b);

function arithmetic(){
  const net=require(path.join(ROOT,'assets/js/salario-neto-receipt.js')).calculate;
  const base={gross:20000,tax:2500,social:500,other:0,period:'mensual',deductionMode:'desglose',otherPayments:0};
  for(const [changes,expected] of [
    [{},{deductions:3000,net:17000}],
    [{gross:10000,tax:1100,social:250,other:400,period:'quincenal'},{deductions:1750,net:8250}],
    [{gross:5000,tax:450,social:120,other:80,period:'semanal'},{deductions:650,net:4350}],
    [{gross:100.01,tax:0.01,social:0,other:0},{deductions:0.01,net:100}],
    [{gross:0.3,tax:0.1,social:0.2,other:0},{deductions:0.3,net:0}],
    [{otherPayments:100.25},{deductions:3000,net:17100.25}],
    [{deductionMode:'total',deductionsTotal:4000},{deductions:4000,net:16000}],
    [{deductionMode:'total',deductionsTotal:0,otherPayments:0.01},{deductions:0,net:20000.01}],
    [{deposit:17000},{net:17000,depositDifference:0}],
    [{deposit:17010.01},{net:17000,depositDifference:10.01}],
    [{deposit:16999.99},{net:17000,depositDifference:-0.01}],
    [{deposit:0},{net:17000,depositDifference:-17000}]
  ]){
    const input={...base,...changes},r=net(input);
    for(const [key,value] of Object.entries(expected))assert.equal(r[key],value,'Net exact cents '+key);
    report.arithmetic.push({page:'salario-neto',input,expected,result:r});
  }
  for(const changes of [{gross:0},{gross:-1},{gross:Infinity},{gross:NaN},{gross:1.001},{gross:1e12+1},{tax:-1},{tax:0.001},{social:-1},{other:-1},{otherPayments:-1},{otherPayments:Infinity},{deductionMode:'invalid'},{period:'invalid'},{deposit:-1},{deposit:1.001},{deductionMode:'total',deductionsTotal:-1},{deductionMode:'total',deductionsTotal:30000},{tax:30000}]){
    assert.throws(()=>net({...base,...changes}),undefined,'Reject invalid receipt '+JSON.stringify(changes));report.rejected++;
  }
  const daily=require(path.join(ROOT,'assets/js/salario-diario.js')).calculate;
  for(const [amount,period,divisor] of [[15000,'mensual',30],[9000,'quincenal',15],[4200,'semanal',7],[500,'diario',1],[2000,'semanal',7],[2300,'semanal',7],[2500,'semanal',7],[3000,'semanal',7],[0.01,'mensual',30]]){
    const r=daily(amount,period),d=amount/divisor;
    for(const [key,value] of Object.entries({daily:d,weekly:d*7,quincenal:d*15,monthly30:d*30,monthly365:d*365/12,monthly52:d*7*52/12}))near(r[key],value,'daily '+key);
    report.arithmetic.push({page:'salario-diario',amount,period,result:r});
  }
  assert.equal(daily(2300,'semanal').monthly30.toFixed(2),'9857.14');
  const fortnight=require(path.join(ROOT,'assets/js/pago-quincenal.js')).calculate;
  for(const [amount,period,expected] of [[15000,'mensual',7500],[10000,'mensual',5000],[8250,'mensual',4125],[275,'diario',4125],[333.33,'diario',4999.95],[0.01,'mensual',0.005]]){
    const r=fortnight(amount,period);near(r.quincenal,expected,'quincenal');
    report.arithmetic.push({page:'pago-quincenal',amount,period,result:r});
  }
  for(const calculate of [daily,fortnight]){
    for(const value of [0,-1,NaN,Infinity,1e12+1,'275',null]){assert.throws(()=>calculate(value,'mensual'));report.rejected++;}
    for(const period of ['invalid','__proto__']){assert.throws(()=>calculate(275,period));report.rejected++;}
  }
}

function fileSizes(root,html){
  const result={htmlBytes:Buffer.byteLength(html),htmlGzip:zlib.gzipSync(html).length};
  for(const [kind,regex] of [['js',/<script[^>]*src="(\/[^"?]+)(?:\?[^\"]*)?"/g],['css',/<link[^>]*href="(\/[^"?]+\.css)(?:\?[^\"]*)?"/g]]){
    const files=[...new Set([...html.matchAll(regex)].map(m=>m[1]))].map(p=>path.join(root,p)).filter(p=>fs.existsSync(p));
    result[kind+'Bytes']=files.reduce((s,p)=>s+fs.statSync(p).size,0);
    result[kind+'Gzip']=files.reduce((s,p)=>s+zlib.gzipSync(fs.readFileSync(p)).length,0);
  }
  return result;
}
function invariants(){
  const tracked=git('ls-tree','-r','--name-only',BASE).toString().trim().split('\n');
  const publicFiles=walk(PUBLIC),existing=publicFiles.filter(f=>tracked.includes(f));
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nomina-baseline-'));
  execFileSync('tar',['-xf','-','-C',temp],{input:git('archive',BASE,'--',...existing,'vercel.json'),maxBuffer:32*1024*1024});
  const {transform}=require('./monetization-v2.cjs');
  let unchangedHTML=0,unchangedResources=0;
  for(const file of existing){
    const original=fs.readFileSync(path.join(temp,file));
    const compiled=file.endsWith('.html')?Buffer.from(transform(original.toString(),file).html):original;
    fs.writeFileSync(path.join(temp,file),compiled);
    if(CHANGED.has(file))continue;
    assert.ok(compiled.equals(fs.readFileSync(path.join(PUBLIC,file))),'Unexpected change '+file);
    if(file.endsWith('.html'))unchangedHTML++;else unchangedResources++;
  }
  assert.equal(unchangedHTML,405,'Preserve the 405 other public HTML pages');
  const cfg=JSON.parse(read(path.join(ROOT,'vercel.json'))),oldCfg=JSON.parse(read(path.join(temp,'vercel.json')));
  for(const key of ['headers','rewrites','redirects'])assert.deepEqual(cfg[key],oldCfg[key],'Unchanged Vercel '+key);
  const canonical=html=>(html.match(/<link\b[^>]*>/g)||[]).find(t=>/rel=["']canonical/.test(t))?.match(/href=["']([^"']+)/)?.[1];
  const links=html=>[...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)].map(m=>m[1].replaceAll('&amp;','&'));
  report.sizes={conditions:'Local resources referenced directly from compiled HTML; excludes remote transfer and dynamically inserted dependencies.',pages:{}};
  for(const slug of TARGETS){
    const file='calculadoras/'+slug+'.html',before=read(path.join(temp,file)),after=read(path.join(PUBLIC,file));
    assert.equal(after.match(/<title>(.*?)<\/title>/s)?.[1],before.match(/<title>(.*?)<\/title>/s)?.[1],slug+' protected title');
    assert.equal(canonical(after),canonical(before),slug+' canonical');
    const destinations=new Set(links(after));assert.deepEqual([...new Set(links(before))].filter(href=>!destinations.has(href)),[],slug+' old link destinations');
    for(const token of ['id="container-'+NATIVE+'"','src="https://bauval.org/21/'+NATIVE+'"','https://bauval.org/22/'+BANNER,'data-affiliate="aliexpress"','data-affiliate="solcredito"'])assert.equal(after.split(token).length-1,1,slug+' single integration '+token);
    report.sizes.pages[slug]={before:fileSizes(temp,before),after:fileSizes(PUBLIC,after)};
  }
  report.static={unchangedHTML,unchangedResources,protectedTitles:3,canonicalPreserved:3,advertisingUnitsPerPage:4,newPublicFiles:publicFiles.filter(f=>!tracked.includes(f))};
  return {temp,cfg};
}

function routes({cfg,temp}){
  const rewrites=Object.fromEntries((cfg.rewrites||[]).map(r=>[r.source,r.destination]));
  const defaults=Object.fromEntries((cfg.headers.find(r=>r.source==='/(.*)')?.headers||[]).map(h=>[h.key,h.value]));
  const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json','.webmanifest':'application/manifest+json'};
  return async route=>{
    const u=new URL(route.request().url());
    if(!['current.test','baseline.test'].includes(u.hostname)){
      if(u.hostname==='ad.admitad.com')return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="#e8eef8"/><text x="150" y="125" text-anchor="middle" fill="#17345b">Banner simulado · prueba local</text></svg>'});
      if(u.hostname==='bauval.org')return route.fulfill({contentType:'application/javascript',body:'/* Simulated ad delivery. */'});
      return route.abort('blockedbyclient');
    }
    if(u.pathname.startsWith('/_vercel/'))return route.fulfill({contentType:'application/javascript',body:''});
    const root=u.hostname==='current.test'?PUBLIC:temp,resolved=rewrites[u.pathname]||u.pathname;
    const file=path.join(root,resolved==='/'?'index.html':decodeURIComponent(resolved));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){report.missingResources.push(u.href);return route.fulfill({status:404,body:'Not found'});}
    const headers={...defaults};for(const entry of cfg.headers||[])if(entry.source===u.pathname)for(const h of entry.headers)headers[h.key]=h.value;
    return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',headers,body:fs.readFileSync(file)});
  };
}
async function structure(page,slug,state){
  const data=await page.evaluate(()=>{
    const schemas=[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{const j=JSON.parse(s.textContent);return j['@graph']||[j];});
    const faq=schemas.find(j=>j['@type']==='FAQPage'),normalize=s=>s.replace(/\s+/g,' ').trim();
    const text=normalize(document.querySelector('main').textContent);
    return {h1:document.querySelectorAll('h1').length,robots:document.querySelector('meta[name=robots]').content,faq:faq?.mainEntity?.map(q=>({question:q.name,present:text.includes(normalize(q.name))&&text.includes(normalize(q.acceptedAnswer.text))})),links:[...document.querySelectorAll('main a[href]')].map(a=>a.href),schemas:schemas.map(j=>j['@type'])};
  });
  assert.equal(data.h1,1);assert.ok(!data.robots.includes('noindex'));assert.ok(data.faq?.every(q=>q.present),slug+' FAQ matches visible text');
  assert.ok(data.schemas.includes('WebApplication'));assert.ok(data.schemas.includes('BreadcrumbList'));
  const rewrite=Object.fromEntries((state.cfg.rewrites||[]).map(r=>[r.source,r.destination]));
  for(const href of data.links){const u=new URL(href);if(u.hostname!=='current.test')continue;assert.ok(fs.existsSync(path.join(PUBLIC,rewrite[u.pathname]||(u.pathname==='/'?'index.html':u.pathname))),'Broken link '+href);if(u.pathname==='/calculadoras/'+slug+'.html'&&u.hash)assert.ok(await page.locator(u.hash).count(),'Missing anchor '+href);}
  report.structures.push({page:slug,...data});
}
async function overflow(page,label){const s=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));assert.ok(s.document<=s.viewport+1,'Overflow '+label+' '+JSON.stringify(s));}
async function total(page){return page.locator('#resultado .result-row.total span').first().innerText();}
async function fillNet(page,changes={}){
  const values={salario:'20000',isrManual:'2500',imss:'500',otras:'0',snOtrosPagos:'0',snDeposito:'',...changes};
  await page.locator('#snDeductionMode').selectOption('desglose');
  await page.locator('#snPeriodo').selectOption('mensual');
  for(const [id,value] of Object.entries(values))await page.locator('#'+id).fill(value);
}
async function calculateDefault(page,slug){
  if(slug==='salario-neto'){await fillNet(page);await page.locator('.calc-button').click();assert.equal(await total(page),currency(17000));}
  else{
    await page.locator('#salario').fill(slug==='salario-diario'?'2300':'275');
    await page.locator('#periodo').selectOption(slug==='salario-diario'?'semanal':'diario');
    await page.locator('.calc-button').click();assert.equal(await total(page),currency(slug==='salario-diario'?2300/7:4125));
    const details=page.locator(slug==='salario-diario'?'.salary-monthly-methods':'.quincenal-comparison');
    await details.locator('summary').click();
    const text=await details.innerText();for(const value of slug==='salario-diario'?[9857.14,9994.05,9966.67,9200,11500]:[3850,4125,99000,100100,103950])assert.ok(text.includes(currency(value)),slug+' expanded amount '+value);
  }
}
async function advertising(page){
  assert.equal(await page.locator('#container-'+NATIVE).count(),1);assert.equal(await page.locator('.cm-commercial--banner iframe').count(),1);
  for(const name of ['aliexpress','solcredito']){const card=page.locator('[data-affiliate="'+name+'"]');assert.equal(await card.count(),1);for(const a of await card.locator('a').all()){assert.ok((await a.getAttribute('rel')).includes('sponsored'));assert.ok((await a.getAttribute('href')).includes('?i=4'));}}
}
async function netInteractions(page){
  await page.goto(url('salario-neto'));await fillNet(page,{snOtrosPagos:'100.25',snDeposito:'17100.25'});await page.locator('#salario').press('Enter');
  assert.equal(await total(page),currency(17100.25));assert.ok((await page.locator('.result-insight').innerText()).includes(currency(100.25)),'Other payments are explained in interpretation');assert.ok((await page.locator('.result-steps').textContent()).includes('Otros pagos'),'Steps include other payments');assert.ok((await page.locator('#snReceiptCheck').innerText()).includes('coincide'));
  await page.locator('#snDeductionMode').selectOption('total');await page.locator('#snDeduccionesTotal').fill('4000');await page.locator('.calc-button').click();assert.equal(await total(page),currency(16100.25));
  await page.reload();assert.equal(await page.locator('#snDeductionMode').inputValue(),'total');assert.equal(await page.locator('#snDeduccionesTotal').inputValue(),'4000');
  await page.locator('.calc-button').click();assert.equal(await total(page),currency(16100.25));
  await page.locator('[data-result-save]').click();assert.ok(await page.evaluate(()=>localStorage.getItem('cm-scenario-salario-neto')));
  await page.goto(url('salario-neto')+'?salario=10000&isrManual=1100&imss=250&otras=400');
  await page.waitForFunction(()=>document.querySelector('.result[data-ready=true]'));
  assert.equal(await page.locator('#snDeductionMode').inputValue(),'desglose','Legacy links must not reuse total deduction mode');
  assert.equal(await total(page),currency(8250),'Legacy link must not retain unrelated other payments');
  await page.locator('[data-sn-example="semanal,5000,450,120,80"]').click();assert.equal(await total(page),currency(4350));
  for(const value of ['','0','-10','100.001']){await page.locator('#salario').fill(value);await page.locator('.calc-button').click();assert.equal(await page.locator('#salario').getAttribute('aria-invalid'),'true');}
  await fillNet(page,{salario:'0.3',isrManual:'0.1',imss:'0.2'});await page.locator('.calc-button').click();assert.equal(await total(page),currency(0),'Zero balance with decimal cents');
  await fillNet(page,{isrManual:'21000'});await page.locator('.calc-button').click();assert.notEqual(await page.locator('#resultado').getAttribute('data-ready'),'true','Overdeductions rejected');
  await page.locator('#snDeductionMode').selectOption('total');await page.locator('#snDeduccionesTotal').fill('3000');
  await page.locator('[data-form-reset]').click();assert.equal(await page.locator('#isrManual').isEnabled(),true,'Reset restores detail fields');assert.equal(await page.locator('#isrManual').isVisible(),true);assert.equal(await page.locator('#salario').inputValue(),'20000');assert.equal(await page.locator('#snDeductionMode').inputValue(),'desglose');assert.equal(await page.locator('#snOtrosPagos').inputValue(),'0');
  await page.locator('.calc-button').click();assert.equal(await total(page),currency(17000));
  await page.locator('#salario').fill('21000');assert.notEqual(await page.locator('#resultado').getAttribute('data-ready'),'true','Edits invalidate old result');
  report.interactions.push({page:'salario-neto',checks:['Enter','exact cents','zero net','deduction modes without double counting','other payments','deposit match','persistence','legacy links','examples','scenario save','invalid values','reset','stale result invalidation']});
}
async function conversionInteractions(page,slug){
  await page.goto(url(slug));await calculateDefault(page,slug);await page.locator('#salario').press('Enter');
  const expected=slug==='salario-diario'?2300/7:4125;assert.equal(await total(page),currency(expected));
  await page.reload();assert.equal(await page.locator('#salario').inputValue(),slug==='salario-diario'?'2300':'275');
  await page.locator('.calc-button').click();assert.equal(await total(page),currency(expected));
  for(const value of ['','0','-20']){await page.locator('#salario').fill(value);await page.locator('.calc-button').click();await page.waitForFunction(()=>document.querySelector('#salario').getAttribute('aria-invalid')==='true').catch(async e=>{throw new Error(slug+' '+JSON.stringify(value)+' '+JSON.stringify(await page.evaluate(()=>({value:document.querySelector('#salario').value,valid:document.querySelector('#salario').validity.valid,result:document.querySelector('#resultado').innerText,form:document.querySelector('.calc-button').form?.id})))+' '+e.message);});assert.equal(await page.locator('#salario').getAttribute('aria-invalid'),'true',slug+' invalid '+value);}
  const suffix=slug==='salario-diario'?'?salario=500&periodo=diario':'?salario=8250';
  await page.goto(url(slug)+suffix);await page.waitForFunction(()=>document.querySelector('.result[data-ready=true]'));
  assert.equal(await total(page),currency(slug==='salario-diario'?500:4125));
  if(slug==='pago-quincenal')assert.equal(await page.locator('#periodo').inputValue(),'mensual');
  await page.locator('[data-result-save]').click();assert.ok(await page.evaluate(s=>localStorage.getItem('cm-scenario-'+s),slug));
  await page.locator('[data-form-reset]').click();assert.equal(await page.locator('#salario').inputValue(),'15000');assert.equal(await page.locator('#periodo').inputValue(),'mensual');
  report.interactions.push({page:slug,checks:['Enter','persistence','invalid values','shared and legacy links','save scenario','reset']});
}
async function browserChecks(state){
  const {chromium}=require('playwright');const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  try{
    const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});await context.route('**/*',routes(state));
    const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>report.errors.push(e.message));
    await page.addInitScript(()=>{window.qaCLS=0;window.qaLCP=0;try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.qaCLS+=e.value;})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>window.qaLCP=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});}catch{}});
    for(const slug of TARGETS){
      await page.goto(url(slug));await structure(page,slug,state);
      for(const width of [320,390,768,1440])for(const theme of ['light','dark']){
        await page.setViewportSize({width,height:900});await page.goto(url(slug));await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('cm-theme',t);},theme);
        await calculateDefault(page,slug);await overflow(page,slug+' '+width+' '+theme);await advertising(page);
        report.layouts.push({page:slug,width,theme,overflow:false,total:await total(page)});
        if([390,1440].includes(width)){
          await page.addScriptTag({path:AXE});const violations=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
          report.accessibility.push({page:slug,width,theme,scope:'main',violations});
          if(theme==='light'){const filename=slug+'-'+width+'.png';await page.locator('#calculadora').screenshot({path:path.join(OUT,filename),style:'.site-header,.mobile-dock{visibility:hidden!important}'});report.screenshots.push(filename);}
        }
        save();
      }
    }
    await netInteractions(page);for(const slug of ['salario-diario','pago-quincenal'])await conversionInteractions(page,slug);
    const plain=await browser.newContext({javaScriptEnabled:false,serviceWorkers:'block'});await plain.route('**/*',routes(state));const noJS=await plain.newPage();
    for(const slug of TARGETS){await noJS.goto(url(slug));assert.ok(await noJS.locator('h1').isVisible());assert.ok((await noJS.locator('main').innerText()).length>3000);}
    await plain.close();report.interactions.push({pages:TARGETS,check:'Explanatory content and navigation readable without JavaScript'});
    for(const slug of TARGETS)for(const host of ['baseline.test','current.test']){
      await page.setViewportSize({width:390,height:900});await page.goto(url(slug,host));await page.waitForTimeout(250);
      report.localPerformance.push({page:slug,host,...await page.evaluate(()=>({lcpMs:qaLCP,cls:qaCLS,domNodes:document.querySelectorAll('*').length})),conditions:'One local sample per version; no CPU/network throttling; simulated or blocked remote resources. Not field CWV or evidence of statistically significant improvement.'});
    }
    assert.deepEqual(report.errors,[],'Runtime JavaScript errors');assert.deepEqual([...new Set(report.missingResources)],[],'Missing local resources');
    report.status=report.accessibility.some(r=>r.violations.length)?'ACCESSIBILITY_REVIEW':'PASS';save();if(report.status!=='PASS')process.exitCode=1;
  }finally{await browser.close();}
}
(async()=>{arithmetic();const state=invariants();await browserChecks(state);console.log(JSON.stringify({status:report.status,arithmetic:report.arithmetic.length,rejected:report.rejected,layouts:report.layouts.length,accessibility:report.accessibility.length,output:OUT}));})().catch(error=>{report.status='FAIL';report.error=error.stack;save();console.error(error.stack);process.exitCode=1;});
