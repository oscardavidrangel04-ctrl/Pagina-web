const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const {chromium} = require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const topics = fs.readdirSync(path.join(root,'temas')).filter(x=>x.endsWith('.html'));
const rewrites = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites.map(x=>[x.source,x.destination]));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
  const page=await browser.newPage({javaScriptEnabled:false});
  await page.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='local.test')return route.abort();
   const file=path.resolve(root,'.'+(rewrites[url.pathname]||url.pathname));
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
   const types={'.html':'text/html','.css':'text/css','.svg':'image/svg+xml'};
   return route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
  });
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:1000});
   for(const topic of topics){
    await page.goto('http://local.test/temas/'+topic);
    const check=await page.evaluate(()=>{
     const graph=JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
     const crumbs=graph.find(x=>x['@type']==='BreadcrumbList').itemListElement;
     const visibleCrumb=document.querySelector('.breadcrumb').textContent;
     const heading=document.querySelector('h1'), rect=heading.getBoundingClientRect();
     const point=document.elementFromPoint(Math.max(0,rect.left)+5,rect.top+rect.height/2);
     const headerBottom=document.querySelector('.site-header').getBoundingClientRect().bottom;
     return {navContained:document.querySelector('.main-nav').getBoundingClientRect().bottom<=headerBottom+1,breadcrumbClear:document.querySelector('.breadcrumb').getBoundingClientRect().top>=headerBottom-1,headingUncovered:!!point&&(point===heading||heading.contains(point)),h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+2,
      routes:document.querySelectorAll('.topic-route').length,canonical:document.querySelector('link[rel=canonical]').href,
      crumbNames:crumbs.every(c=>visibleCrumb.includes(c.name)),
      anchors:[...document.querySelectorAll('.topic-index a')].every(a=>document.getElementById(a.hash.slice(1))),
      links:[...document.querySelectorAll('.topic-route a')].map(a=>({path:a.getAttribute('href'),label:a.textContent.trim()}))};
    });
    assert.equal(check.h1,1);assert.equal(check.overflow,false);assert(check.headingUncovered&&check.navContained&&check.breadcrumbClear,'Navigation overlaps content');assert(check.anchors&&check.crumbNames);assert(check.routes>=3);
    assert.equal(check.canonical,'https://calculadora-isr-mexico.vercel.app/temas/'+topic);
    for(const a of check.links){assert(a.label);assert(fs.existsSync(path.join(root,rewrites[a.path]||a.path)));}
    if(['nomina.html','prestaciones.html'].includes(topic))await page.screenshot({path:path.join(root,'outputs','fase4-'+topic.replace('.html','')+'-'+width+'.png')});
    console.log(JSON.stringify({topic,width,routes:check.routes,status:'OK'}));
   }
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
