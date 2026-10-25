const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(),out=__dirname,checks=[];
const rewrites=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).rewrites||[];
function ok(name,value,detail){checks.push({name,pass:!!value,detail});if(!value)console.log('FAIL',name,detail);}
const routes=['calculadoras/horas-extra.html','calculadoras/ptu.html','calculadoras/salario-bruto.html','calculadoras/salario-neto.html','calculadoras/finiquito.html','calculadoras/liquidacion.html','calculadoras/vacaciones.html','calculadoras/prima-vacacional.html','articulos/horas-extra-2026.html','articulos/horas-extra-dobles-triples.html','articulos/con-que-salario-se-calcula-aguinaldo.html','articulos/salario-bruto-neto.html'];
async function local(route){
 const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.abort();
 let p=rewrites.find(r=>r.source===u.pathname)?.destination||u.pathname;
 if(p.startsWith('/_vercel/'))return route.fulfill({body:'',contentType:'application/javascript'});
 const file=path.resolve(root,'.'+p);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'not found'});
 const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
 return route.fulfill({body:fs.readFileSync(file),contentType:mime[path.extname(file)]||'application/octet-stream'});
}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await context.route('**/*',local);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const url of routes){
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});await page.goto('https://local.test/'+url,{waitUntil:'networkidle'});
   const state=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id),seen=new Set(),duplicates=[];
    ids.forEach(id=>{if(seen.has(id))duplicates.push(id);seen.add(id)});
    return {h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,duplicates,
     canonical:document.querySelector('link[rel=canonical]')?.href,
     missing:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.hash.slice(1)).filter(x=>x&&!document.getElementById(decodeURIComponent(x))),
     title:document.title,og:document.querySelector('meta[property="og:title"]')?.content};
   });
   ok('layout '+url+' '+width,state.h1===1&&!state.overflow&&!state.duplicates.length&&!state.missing.length,state);
   if(url.startsWith('calculadoras/')){
    const button=await page.locator('.calc-controls .calc-button').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}));
    ok('calculate button '+url+' '+width,button.width>=100&&button.height>=44&&button.height<100,button);
   }
   ok('canonical '+url+' '+width,state.canonical==='https://calculadora-isr-mexico.vercel.app/'+url);
   if(width!==320&&['calculadoras/horas-extra.html','calculadoras/ptu.html','calculadoras/salario-bruto.html'].includes(url)){
    await page.locator('#calculadora').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,path.basename(url,'.html')+'-'+width+'.png')});
   }
  }
 }
 await page.goto('https://local.test/calculadoras/horas-extra.html',{waitUntil:'networkidle'});
 for(const [hours,expected] of [['0','0.00'],['3','375.00'],['6','750.00'],['9','1,125.00'],['12','1,687.50'],['1.5','187.50']]){
  await page.locator('#salario').fill('15000');await page.locator('#jornada').fill('8');await page.locator('#horas').fill(hours);await page.locator('.calc-button').click();
  const text=await page.locator('#resultado').innerText();ok('hours '+hours,text.includes(expected),text);
 }
 for(const [id,val] of [['horas',''],['horas','-1'],['jornada','0'],['salario','']]){
  await page.locator('[data-labor-example]').click();await page.locator('#'+id).fill(val);await page.locator('.calc-button').click();
  ok('invalid hours '+id+' '+val,await page.locator('#'+id).getAttribute('aria-invalid')==='true'&&await page.locator('#resultado').getAttribute('data-ready')===null);
 }
 await page.locator('[data-labor-example]').click();ok('hours preset',(await page.locator('#resultado').innerText()).includes('1,687.50'));
 await page.locator('#horas').fill('2');ok('hours stale cleared',!(await page.locator('#resultado').innerText()).includes('1,687.50'));
 await page.goto('https://local.test/calculadoras/ptu.html',{waitUntil:'networkidle'});
 await page.locator('[data-labor-example]').click();ok('PTU preset',(await page.locator('#resultado').innerText()).includes('6,000.00'));
 await page.locator('#diasPersona').fill('150');await page.locator('.calc-button').click();ok('PTU 150 days',(await page.locator('#resultado').innerText()).includes('4,500.00'));
 for(const [id,val] of [['diasPersona','5001'],['salarioPersona','3000001'],['diasPersona','-1'],['bolsa',''],['diasTotal','0']]){
  await page.locator('[data-labor-example]').click();await page.locator('#'+id).fill(val);await page.locator('.calc-button').click();
  ok('invalid PTU '+id+' '+val,await page.locator('#'+id).getAttribute('aria-invalid')==='true'&&await page.locator('#resultado').getAttribute('data-ready')===null);
 }
 await page.locator('[data-labor-example]').click();await page.locator('#diasPersona').fill('0');await page.locator('#salarioPersona').fill('0');await page.locator('.calc-button').click();ok('PTU zero individual',(await page.locator('#resultado').innerText()).includes('0.00'));
 await page.goto('https://local.test/calculadoras/salario-bruto.html',{waitUntil:'networkidle'});
 await page.locator('#neto').fill('12000');await page.locator('#deducciones').fill('1800');await page.locator('.calc-button').click();ok('bruto manual',(await page.locator('#resultado').innerText()).includes('13,800.00'));
 await page.locator('[data-sb-example]').first().click();ok('bruto preset valid',await page.locator('#neto').inputValue()!=='');
 await page.locator('#neto').fill('');await page.locator('.calc-button').click();ok('bruto blank',await page.locator('#neto').getAttribute('aria-invalid')==='true');
 for(const [slug,expected] of [['finiquito','9,948.63'],['liquidacion','45,000.00'],['vacaciones','7,500.00'],['prima-vacacional','1,500.00']]){
  await page.goto('https://local.test/calculadoras/'+slug+'.html',{waitUntil:'networkidle'});
  await page.locator('.calc-button').click();const text=await page.locator('#resultado').innerText();
  ok('default '+slug,!/NaN|Infinity|undefined/.test(text)&&text.includes(expected),text);
  const required=page.locator('input[required]').first();
  await required.fill('');await page.locator('.calc-button').click();
  ok('required '+slug,await required.getAttribute('aria-invalid')==='true');
 }
 await page.goto('https://local.test/calculadoras/liquidacion.html',{waitUntil:'networkidle'});
 await page.locator('[data-form-reset]').click();
 ok('20 days opt in',await page.locator('#incluir20').inputValue()==='no');
 await page.locator('#incluir20').selectOption('si');await page.locator('.calc-button').click();
 ok('liquidacion optional 20 days',(await page.locator('#resultado').innerText()).includes('75,000.00'));
 await page.goto('https://local.test/calculadoras/salario-neto.html',{waitUntil:'networkidle'});
 await page.locator('[data-sn-example="semanal,5000,450,120,80"]').click();
 ok('neto example',(await page.locator('#resultado').innerText()).includes('4,350.00'));
 await page.locator('#isrManual').fill('9000');await page.locator('.calc-button').click();
 ok('neto deductions exceed gross',await page.locator('#resultado').getAttribute('data-ready')===null&&(await page.locator('#resultado').innerText()).includes('superan'));
 await page.locator('#isrManual').fill('450');await page.locator('#salario').press('Enter');
 ok('neto keyboard Enter',(await page.locator('#resultado').innerText()).includes('4,350.00'));
 ok('JS errors',errors.length===0,errors);
 const nojs=await browser.newContext({javaScriptEnabled:false});await nojs.route('**/*',local);const staticPage=await nojs.newPage();
 for(const url of ['calculadoras/ptu.html','calculadoras/horas-extra.html','articulos/con-que-salario-se-calcula-aguinaldo.html']){
  await staticPage.goto('https://local.test/'+url);ok('no JS content '+url,(await staticPage.locator('main').innerText()).length>1500);
 }
 await nojs.close();await context.close();
 }catch(e){checks.push({name:'Execution',pass:false,detail:e.stack});console.error(e.message)}finally{await browser.close();}
 const report={date:'2026-10-24',status:checks.every(c=>c.pass)?'PASS':'FAIL',checks};fs.writeFileSync(path.join(out,'pruebas-navegador.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({status:report.status,checks:checks.length,failed:checks.filter(x=>!x.pass)},null,2));if(report.status!=='PASS')process.exitCode=1;
})();
