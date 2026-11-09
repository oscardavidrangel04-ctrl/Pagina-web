'use strict';

// Run after build-public.cjs. Third parties are explicitly simulated; this suite
// validates calculations, preservation and browser behaviour, not ad delivery.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {execFileSync} = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'site-public');
const BASE = process.env.SALARY_BASE_COMMIT || '3a7a4f8';
const TARGET = 'calculadoras/salario-diario.html';
const PAGE_URL = 'https://current.test/' + TARGET;
const OUT = process.env.SALARY_QA_DIR || path.join(ROOT, 'docs/salario-diario-seo-2026-11-08');
const AXE = process.env.AXE_PATH || '/workspace/work/monetization-tools/node_modules/axe-core/axe.min.js';
const NATIVE = '409e3950cb7b10082bb628969be6611a';
const BANNER = '94dbe87812d642e0600cc58986b093c2';
const report = {status:'RUNNING', baseline:BASE, conditions:[
  'Compiled output with Vercel rewrites and response headers, including CSP.',
  'Adsterra scripts simulated as empty responses; Admitad images replaced by labeled test SVGs.',
  'No live impressions, affiliate redirects, conversions or field Core Web Vitals are verified.'
], arithmetic:[], layouts:[], accessibility:[], interactions:[], errors:[], missingResources:[], requests:[], screenshots:[]};
fs.mkdirSync(OUT,{recursive:true});
const save=()=>fs.writeFileSync(path.join(OUT,'validation.json'),JSON.stringify(report,null,2)+'\n');
const read=p=>fs.readFileSync(p,'utf8');
const walk=(dir,rel='')=>fs.readdirSync(path.join(dir,rel),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir,path.join(rel,e.name)):[path.join(rel,e.name)]);
const git=(...args)=>execFileSync('git',args,{cwd:ROOT,maxBuffer:32*1024*1024});
const near=(actual,expected,description)=>assert.ok(Math.abs(actual-expected)<Math.max(1e-8,Math.abs(expected)*1e-12),description+': '+actual+' vs '+expected);

function arithmetic(){
  const {calculate}=require(path.join(ROOT,'assets/js/salario-diario.js'));
  for(const [amount,period,divisor] of [[15000,'mensual',30],[9000,'quincenal',15],[4200,'semanal',7],[500,'diario',1],[2300,'semanal',7],[2500,'semanal',7],[2000,'semanal',7],[3000,'semanal',7],[0.01,'mensual',30],[1e12,'diario',1]]){
    const r=calculate(amount,period),daily=amount/divisor;
    for(const [key,expected] of Object.entries({daily,weekly:daily*7,quincenal:daily*15,monthly30:daily*30,monthly365:daily*365/12,monthly52:daily*7*52/12,divisor}))near(r[key],expected,period+' '+amount+' '+key);
    report.arithmetic.push({amount,period,result:r});
  }
  const r=calculate(2300,'semanal');
  assert.equal(r.monthly30.toFixed(2),'9857.14','Do not round daily pay before multiplying');
  assert.equal(r.monthly365.toFixed(2),'9994.05');
  assert.equal(r.monthly52.toFixed(2),'9966.67');
  for(const value of [0,-1,NaN,Infinity,-Infinity,1e12+1,'','2300',null,undefined])assert.throws(()=>calculate(value,'mensual'),undefined,'Invalid amount '+String(value));
  for(const period of ['',null,undefined,'semanales','toString','__proto__'])assert.throws(()=>calculate(2300,period),undefined,'Invalid period '+String(period));
  report.arithmeticRejectedCases=17;
}

function invariants(){
  const files=git('ls-tree','-r','--name-only',BASE).toString().trim().split('\n');
  const publicFiles=walk(PUBLIC);
  const existing=publicFiles.filter(f=>files.includes(f));
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'salary-baseline-'));
  const archive=git('archive',BASE,'--',...existing,'vercel.json');
  execFileSync('tar',['-xf','-','-C',temp],{input:archive,maxBuffer:32*1024*1024});
  const {transform}=require('./monetization-v2.cjs');
  let unchangedHTML=0,unchangedResources=0;
  for(const file of existing){
    if(file===TARGET)continue;
    const base=fs.readFileSync(path.join(temp,file));
    const expected=file.endsWith('.html')?Buffer.from(transform(base.toString(),file).html):base;
    assert.ok(expected.equals(fs.readFileSync(path.join(PUBLIC,file))),'Unexpected public change: '+file);
    if(file.endsWith('.html'))unchangedHTML++;else unchangedResources++;
  }
  const baselineHTML=transform(read(path.join(temp,TARGET)),TARGET).html;
  const currentHTML=read(path.join(PUBLIC,TARGET));
  fs.writeFileSync(path.join(temp,TARGET),baselineHTML);
  // Serve the compiled baseline for realistic controls and audit comparisons.
  const cfg=JSON.parse(read(path.join(ROOT,'vercel.json'))),beforeCfg=JSON.parse(read(path.join(temp,'vercel.json')));
  for(const k of ['headers','rewrites','redirects'])assert.deepEqual(cfg[k],beforeCfg[k],'Routing/header change: '+k);
  const one=(html,rx)=>html.match(rx)?.[1];
  assert.equal(one(currentHTML,/<title>(.*?)<\/title>/s),one(baselineHTML,/<title>(.*?)<\/title>/s),'Protected title changed');
  const canonical=html=>(html.match(/<link\b[^>]*>/g)||[]).find(t=>/rel=["']canonical/.test(t))?.match(/href=["']([^"']+)/)?.[1];
  assert.equal(canonical(currentHTML),canonical(baselineHTML),'Canonical changed');
  for(const token of ['id="container-'+NATIVE+'"','src="https://bauval.org/21/'+NATIVE+'"','https://bauval.org/22/'+BANNER,'data-affiliate="aliexpress"','data-affiliate="solcredito"'])assert.equal(currentHTML.split(token).length-1,1,'Exactly one ad integration '+token);
  assert.ok(!currentHTML.includes('/assets/js/calculators.js'),'Global calculator bundle no longer needed on this page');
  assert.ok(currentHTML.includes('/assets/js/salario-diario.js'),'Dedicated script is loaded');
  report.static={unchangedHTML,unchangedResources,protectedTitle:true,canonicalPreserved:true,advertisingUnits:4,baselineSourceBytes:Buffer.byteLength(baselineHTML),currentSourceBytes:Buffer.byteLength(currentHTML),newPublicResources:publicFiles.filter(f=>!files.includes(f))};
  return {cfg,temp,baselineHTML,currentHTML};
}

function routes(cfg,temp){
  const rewrites=Object.fromEntries((cfg.rewrites||[]).map(r=>[r.source,r.destination]));
  const defaults=Object.fromEntries((cfg.headers.find(r=>r.source==='/(.*)')?.headers||[]).map(h=>[h.key,h.value]));
  const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json','.webmanifest':'application/manifest+json'};
  return async route=>{
    const u=new URL(route.request().url());
    if(!['current.test','baseline.test'].includes(u.hostname)){
      report.requests.push({url:u.href,simulated:['ad.admitad.com','bauval.org'].includes(u.hostname)});
      if(u.hostname==='ad.admitad.com')return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect width="300" height="250" fill="#e8eef8"/><text x="150" y="125" text-anchor="middle" fill="#17345b">Banner simulado · prueba local</text></svg>'});
      if(u.hostname==='bauval.org')return route.fulfill({contentType:'application/javascript',body:'/* Ad delivery is not under test. */'});
      return route.abort('blockedbyclient');
    }
    if(u.pathname.startsWith('/_vercel/'))return route.fulfill({contentType:'application/javascript',body:''});
    const root=u.hostname==='current.test'?PUBLIC:temp;
    const resolved=rewrites[u.pathname]||u.pathname;
    const file=path.join(root,resolved==='/'?'index.html':decodeURIComponent(resolved));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){report.missingResources.push(u.href);return route.fulfill({status:404,body:'Not found'});}
    const headers={...defaults};for(const entry of cfg.headers||[])if(entry.source===u.pathname)for(const h of entry.headers)headers[h.key]=h.value;
    return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',headers,body:fs.readFileSync(file)});
  };
}

async function structure(page,cfg){
  const data=await page.evaluate(()=>{
    const json=[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent));
    const schemas=json.flatMap(j=>j['@graph']||[j]);
    const faq=schemas.find(j=>j['@type']==='FAQPage');
    const text=document.querySelector('main').textContent.replace(/\s+/g,' ').trim();
    const normalize=s=>s.replace(/\s+/g,' ').trim();
    return {h1:document.querySelectorAll('h1').length,robots:document.querySelector('meta[name=robots]').content,faq:faq?.mainEntity?.map(q=>({q:q.name,a:q.acceptedAnswer.text,present:text.includes(normalize(q.name))&&text.includes(normalize(q.acceptedAnswer.text))})),links:[...document.querySelectorAll('main a[href]')].map(a=>a.href),schemas:schemas.map(j=>j['@type'])};
  });
  assert.equal(data.h1,1);assert.ok(!data.robots.includes('noindex'));
  assert.ok(data.faq?.length);assert.ok(data.faq.every(q=>q.present),'FAQ schema must describe visible HTML');
  assert.ok(data.schemas.includes('WebApplication'));assert.ok(data.schemas.includes('BreadcrumbList'));
  const rewrite=Object.fromEntries((cfg.rewrites||[]).map(r=>[r.source,r.destination]));
  for(const href of data.links){const u=new URL(href);if(u.hostname!=='current.test')continue;assert.ok(fs.existsSync(path.join(PUBLIC,rewrite[u.pathname]||(u.pathname==='/'?'index.html':u.pathname))),'Broken internal link '+href);if(u.pathname==='/'+TARGET&&u.hash)assert.ok(await page.locator(u.hash).count(),'Missing anchor '+u.hash);}
  report.structure=data;
}

async function overflow(page,label){
  const size=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
  assert.ok(size.document<=size.viewport+1,'Horizontal document overflow '+label+' '+JSON.stringify(size));
}
async function dailyValue(page){
  return page.locator('.result-row').filter({has:page.locator('strong',{hasText:/^Salario diario$/})}).locator('span').innerText();
}
const currency=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n);

async function browserChecks(state){
  const {chromium}=require('playwright');
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  try{
    const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
    await context.route('**/*',routes(state.cfg,state.temp));
    const page=await context.newPage();page.setDefaultTimeout(10000);
    page.on('pageerror',e=>report.errors.push(e.message));
    await page.addInitScript(()=>{window.qaCLS=0;window.qaLCP=0;try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.qaCLS+=e.value;})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>window.qaLCP=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});}catch{}});
    await page.goto(PAGE_URL);await structure(page,state.cfg);
    for(const width of [320,390,768,1440])for(const theme of ['light','dark']){
      await page.setViewportSize({width,height:900});await page.goto(PAGE_URL);
      await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('cm-theme',t);},theme);
      await page.locator('#salario').fill('2300');await page.locator('#periodo').selectOption('semanal');await page.locator('.calc-button').click();
      assert.equal(await dailyValue(page),currency(2300/7));
      await overflow(page,width+' '+theme);
      await page.locator('.salary-monthly-methods summary').click();
      const methods=await page.locator('.salary-monthly-methods').innerText();
      for(const value of [9857.14,9994.05,9966.67])assert.ok(methods.includes(currency(value)), 'Monthly methods show independently verified values');
      await overflow(page,width+' '+theme+' expanded monthly methods');
      assert.equal(await page.locator('#container-'+NATIVE).count(),1);
      assert.equal(await page.locator('.cm-commercial--banner iframe').count(),1);
      for(const name of ['aliexpress','solcredito']){
        const card=page.locator('[data-affiliate="'+name+'"]');assert.equal(await card.count(),1);
        for(const a of await card.locator('a').all()){assert.ok((await a.getAttribute('rel')).includes('sponsored'));assert.ok((await a.getAttribute('href')).includes('?i=4'));}
      }
      report.layouts.push({width,theme,overflow:false,dailyResult:await dailyValue(page)});
      if([390,1440].includes(width)){
        await page.addScriptTag({path:AXE});
        const result=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
        report.accessibility.push({width,theme,scope:'main',violations:result});
        if(theme==='light'){
          await page.locator('#calculadora').scrollIntoViewIfNeeded();
          const name='salario-diario-'+width+'.png';await page.screenshot({path:path.join(OUT,name)});report.screenshots.push(name);
        }
      }
      save();
    }
    for(const [amount,period,expected] of [[15000,'mensual',500],[9000,'quincenal',600],[4200,'semanal',600],[500,'diario',500],[2500,'semanal',2500/7]]){
      await page.locator('#salario').fill(String(amount));await page.locator('#periodo').selectOption(period);await page.locator('.calc-button').click();assert.equal(await dailyValue(page),currency(expected));
    }
    await page.locator('#salario').fill('2300');await page.locator('#periodo').selectOption('semanal');await page.locator('#salario').press('Enter');assert.equal(await dailyValue(page),currency(2300/7));
    report.interactions.push('All four source periods and Enter submission produce correct daily pay.');
    for(const value of ['','0','-20']){
      await page.locator('#salario').fill(value);await page.locator('.calc-button').click();
      assert.equal(await page.locator('#salario').getAttribute('aria-invalid'),'true','Invalid input marked: '+value);
    }
    report.interactions.push('Empty, zero and negative input identified accessibly.');
    await page.locator('#salario').fill('2300');await page.locator('#periodo').selectOption('semanal');await page.locator('.calc-button').click();
    assert.notEqual(await page.locator('#salario').getAttribute('aria-invalid'),'true');
    await page.reload();assert.equal(await page.locator('#salario').inputValue(),'2300');assert.equal(await page.locator('#periodo').inputValue(),'semanal');
    await page.goto(PAGE_URL+'?salario=500&periodo=diario');await page.waitForFunction(()=>document.querySelector('.result[data-ready=true]'));
    assert.equal(await dailyValue(page),currency(500));
    await page.locator('[data-result-save]').click();
    assert.ok(await page.evaluate(()=>localStorage.getItem('cm-scenario-salario-diario')));
    await page.locator('[data-form-reset]').click();assert.equal(await page.locator('#salario').inputValue(),'15000');assert.equal(await page.locator('#periodo').inputValue(),'mensual');
    report.interactions.push('Persistence, legacy salary/period query parameters, scenario save and reset preserved.');
    const plain=await browser.newContext({javaScriptEnabled:false,serviceWorkers:'block'});await plain.route('**/*',routes(state.cfg,state.temp));const noJS=await plain.newPage();await noJS.goto(PAGE_URL);assert.ok((await noJS.locator('main').innerText()).includes('52'));assert.ok(await noJS.locator('h1').isVisible());await plain.close();
    report.interactions.push('Explanations, examples and navigation remain readable without JavaScript.');
    report.localPerformance=[];
    for(const host of ['baseline.test','current.test']){
      await page.setViewportSize({width:390,height:900});await page.goto('https://'+host+'/'+TARGET);await page.waitForTimeout(250);
      report.localPerformance.push({host,...await page.evaluate(()=>({lcpMs:qaLCP,cls:qaCLS,domNodes:document.querySelectorAll('*').length})),conditions:'Single local browser sample, simulated third parties, no throttling; not field CWV.'});
    }
    assert.deepEqual(report.errors,[],'Runtime JavaScript errors');assert.deepEqual([...new Set(report.missingResources)],[],'Missing local resources');
    report.status=report.accessibility.some(x=>x.violations.length)?'ACCESSIBILITY_REVIEW':'PASS';save();
    if(report.status!=='PASS')process.exitCode=1;
  }finally{await browser.close();}
}

(async()=>{arithmetic();const state=invariants();await browserChecks(state);console.log(JSON.stringify({status:report.status,arithmetic:report.arithmetic.length,layouts:report.layouts.length,accessibility:report.accessibility.length,output:OUT}));})().catch(e=>{report.status='FAIL';report.error=e.stack;save();console.error(e.stack);process.exitCode=1;});
