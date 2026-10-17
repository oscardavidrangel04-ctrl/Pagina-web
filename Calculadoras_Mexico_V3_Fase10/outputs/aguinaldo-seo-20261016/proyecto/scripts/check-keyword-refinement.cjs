const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const targets=[['calculadoras/pago-quincenal.html','7,500'],['calculadoras/salario-diario.html','500'],['calculadoras/salario-neto.html','17,000'],['calculadoras/bono.html','1,500'],['articulos/isr-semanal-quincenal-mensual.html',null]];
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});let count=0;
try{for(const width of [390,1440]){const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='local.test')return r.abort();const f=path.resolve(root,'.'+u.pathname);if(!f.startsWith(root+path.sep)||!fs.existsSync(f))return r.fulfill({status:404,body:''});return r.fulfill({body:fs.readFileSync(f),contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream'});});
for(const [url,expected] of targets){await page.goto('http://local.test/'+url,{waitUntil:'load'});await page.evaluate(()=>{const st=document.createElement('style');st.textContent='*{content-visibility:visible!important}';document.head.append(st);});
const state=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+2,added:document.querySelectorAll('[data-keyword-refinement]').length}));if(state.h1!==1||state.overflow||state.added!==1)throw Error(url+JSON.stringify(state));
if(expected){await page.locator('.calc-button').click();const result=await page.locator('#resultado').innerText();if(!result.includes(expected))throw Error(url+result);}
if(width===390&&url.includes('/bono.')){await page.locator('[data-keyword-refinement]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'outputs/keyword-refinement-bono-mobile.png')});}count++;}
if(errors.length)throw Error(errors.join('\n'));await page.close();}console.log(JSON.stringify({status:'PASS',views:count,calculators:4}));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
