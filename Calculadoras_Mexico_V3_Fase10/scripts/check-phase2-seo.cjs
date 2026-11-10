const fs = require('fs');
const path = require('path');
const {chromium, launchOptions} = require('./browser-runtime.cjs');
const root = path.resolve(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const rewrites = Object.fromEntries(cfg.rewrites.map(x => [x.source, x.destination]));
const phase3 = process.argv.includes('--phase3');
const pages = phase3 ? ['calculadoras/salario-neto.html','articulos/aguinaldo-por-antiguedad.html','articulos/isr-semanal-quincenal-mensual.html','articulos/cuando-pagan-finiquito.html','articulos/con-que-salario-se-calcula-aguinaldo.html','calculadoras/propina.html','articulos/simulador-credito-automotriz.html','articulos/cuanto-se-deja-propina-mexico.html','articulos/finiquito-renuncia-voluntaria.html','calculadoras/salario-diario-integrado.html'] : ['calculadoras/pago-quincenal.html','calculadoras/salario-diario.html','calculadoras/salario-hora.html','calculadoras/bono.html','articulos/aguinaldo-3-meses.html','articulos/isr-prima-vacacional.html','articulos/propina-obligatoria-mexico.html','articulos/que-incluye-finiquito.html','articulos/convertir-salario-mensual-diario-hora.html','articulos/aguinaldo-si-renuncio.html'];
(async () => {
 const browser = await chromium.launch(launchOptions);
 try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  await page.route('**/*', async route => {
   const url = new URL(route.request().url());
   if(url.hostname !== 'local.test') return route.abort();
   const target = path.resolve(root, '.' + (rewrites[url.pathname] || url.pathname));
   if(!target.startsWith(root+path.sep) || !fs.existsSync(target)) return route.fulfill({status:404,body:''});
   const ext=path.extname(target); const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
   return route.fulfill({body:fs.readFileSync(target),contentType:types[ext]||'application/octet-stream'});
  });
  for(const url of pages){
   await page.goto('http://local.test/'+url,{waitUntil:'domcontentloaded'});
   const check=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,titleInHead:!!document.head.querySelector('title'),schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent)).length,overflow:document.documentElement.scrollWidth>innerWidth+2,canonical:document.querySelector('link[rel=canonical]')?.href}));
   if(check.h1!==1 || !check.titleInHead || !check.schemas || check.overflow || check.canonical!=='https://calculadora-isr-mexico.vercel.app/'+url) throw Error(url+JSON.stringify(check));
   if(phase3 && ['articulos/con-que-salario-se-calcula-aguinaldo.html','articulos/simulador-credito-automotriz.html'].includes(url)) {
    // Render deferred offscreen sections for a complete visual inspection.
    await page.addStyleTag({content:'* { content-visibility: visible !important; }'});
    await page.screenshot({path:path.join(root,'outputs','fase3-'+path.basename(url,'.html')+'-mobile.png'),fullPage:true});
   }
   if(phase3 && url==='calculadoras/salario-diario-integrado.html') {
    for(const [id,value] of Object.entries({salarioDiario:'500',diasAguinaldo:'15',diasVacaciones:'12',prima:'25'})) await page.locator('#'+id).fill(value);
    await page.locator('.calc-button').click();
    if(!(await page.locator('#resultado').innerText()).includes('524.66')) throw Error('SDI result');
   }
   if(phase3 && url==='calculadoras/propina.html') {
    for(const [id,value] of Object.entries({cuenta:'800',propinaPct:'15',personas:'4'})) await page.locator('#'+id).fill(value);
    await page.locator('.calc-button').click();
    const result=await page.locator('#resultado').innerText();
    if(!result.includes('120') || !result.includes('920') || !result.includes('230')) throw Error('Propina result: '+result);
   }
   if(url==='calculadoras/pago-quincenal.html' || url==='calculadoras/salario-diario.html'){
    await page.locator('#salario').fill('15000');await page.locator('.calc-button').click();
    const result=await page.locator('#resultado').innerText();
    const expected=url.includes('pago-quincenal')?'7,500':'500';
    if(!result.includes(expected)) throw Error(url+' resultado inesperado: '+result);
   }
   console.log(JSON.stringify({url,...check}));
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
