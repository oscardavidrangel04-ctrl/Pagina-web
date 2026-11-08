const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),baseline=process.env.SEO_BASELINE_DIR,out=process.env.SEO_QA_DIR;
const axePath=process.env.AXE_PATH;
if(!baseline||!out||!axePath)throw Error('Set SEO_BASELINE_DIR, SEO_QA_DIR and AXE_PATH');
fs.mkdirSync(out,{recursive:true});
const files=[...new Set(require(root+'/docs/seo-geo/implemented-changes.json').map(e=>e.canonical))];
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const results=[];
 try{
  const c=await b.newContext({viewport:{width:320,height:850},serviceWorkers:'block'});
  await c.route('**/*',r=>{
   const u=new URL(r.request().url());if(!['old.test','new.test'].includes(u.host))return r.abort();
   const f=path.join(u.host==='old.test'?baseline:root,u.pathname);if(!fs.existsSync(f))return r.fulfill({status:404,body:''});
   return r.fulfill({body:fs.readFileSync(f),contentType:{'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[path.extname(f)]||'application/octet-stream'});
  });
  const p=await c.newPage();
  for(const f of files){
   const checks={file:f};
   for(const [host,theme] of [['old.test','dark'],['new.test','dark'],['new.test','light']]){
    await p.goto('https://'+host+'/'+f);await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    if(host==='new.test'){
     for(const el of await p.locator('.seo-evidence,.seo-guide,#conversion-diaria-resumen').all()){
      await el.scrollIntoViewIfNeeded();await p.waitForTimeout(70);
      assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,f+' 320 dark overflow');
     }
    }
    await p.evaluate(()=>scrollTo(0,0));
    await p.addScriptTag({path:axePath});
    const a=await p.evaluate(()=>axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
    checks[host+'-'+theme]=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   }
   results.push(checks);
   if(/salario-diario|pago-quincenal/.test(f)){
    await p.evaluate(()=>document.documentElement.dataset.theme='dark');
    await p.locator('.seo-guide').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
    await p.waitForTimeout(350);await p.screenshot({path:out+'/'+path.basename(f)+'-guide-320-dark.png'});
   }
  }
  fs.writeFileSync(out+'/accessibility-320.json',JSON.stringify({scope:'17 changed pages; main WCAG2/2.1 A/AA automated checks at 320px dark/light; external resources blocked; does not replace a full manual accessibility audit',results},null,2));
  console.log(JSON.stringify(results.map(r=>({file:r.file,beforeDark:r['old.test-dark'].map(v=>[v.id,v.nodes.length]),afterDark:r['new.test-dark'].map(v=>[v.id,v.nodes.length]),afterLight:r['new.test-light'].map(v=>[v.id,v.nodes.length])})),null,2));
  assert.equal(results.reduce((n,r)=>n+r['new.test-dark'].length+r['new.test-light'].length,0),0,'Review accessibility-320.json for remaining violations');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
