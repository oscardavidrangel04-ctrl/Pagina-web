const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'../..'),checks=[];
const routes=['horas-extra','ptu','salario-bruto','salario-neto','finiquito','liquidacion','vacaciones','prima-vacacional','pago-quincenal','salario-diario'];
function check(name,pass,detail){checks.push({name,pass,detail});assert(pass,name+' '+JSON.stringify(detail));}
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.abort();
  if(u.pathname.startsWith('/_vercel/'))return route.fulfill({body:'',contentType:'application/javascript'});
  const file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:''});
  const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
  await route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const slug of routes){
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});
   await page.goto('https://local.test/calculadoras/'+slug+'.html',{waitUntil:'networkidle'});
   const state=await page.evaluate(()=>{
    const box=document.querySelector('.calc-controls'),calc=box.querySelector('.calc-button'),reset=box.querySelector('[data-form-reset]');
    const b=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right,text:e.textContent.trim()}};
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,controls:b(box),calc:b(calc),reset:b(reset),display:getComputedStyle(box).display};
   });
   check(slug+' '+width,!state.overflow&&state.calc.width>=180&&state.calc.height<=100&&state.reset.height<=100&&state.calc.right<=width&&state.reset.right<=width&&(width>760||state.reset.y>=state.calc.bottom),state);
   if((slug==='horas-extra'&&[320,390,1440].includes(width))||(slug==='salario-neto'&&width===320)||(slug==='pago-quincenal'&&width===390)||(slug==='salario-diario'&&width===390)){
    await page.locator('.calc-controls').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(__dirname,'controles-'+slug+'-'+width+'.png')});
   }
  }
 }
 await page.goto('https://local.test/calculadoras/salario-neto.html',{waitUntil:'networkidle'});
 async function valid(){
  for(const [id,v] of Object.entries({salario:'20000',isrManual:'2500',imss:'500',otras:'0',snDeposito:'17000'}))await page.locator('#'+id).fill(v);
  await page.locator('.calc-button').click();
  check('neto válido',(await page.locator('#resultado').innerText()).includes('17,000.00')&&(await page.locator('#snReceiptCheck').innerText()).includes('coincide'));
 }
 async function invalidated(name){
  check(name,await page.locator('#resultado').getAttribute('data-ready')===null&&await page.locator('#snReceiptCheck').isHidden()&&!(await page.locator('#resultado').innerText()).includes('17,000.00'));
 }
 await valid();await page.locator('#salario').fill('21000');await invalidated('importe editado invalida resultado/comparación');
 await valid();await page.locator('#snPeriodo').selectOption('quincenal');await invalidated('periodo cambiado invalida resultado/comparación');
 await valid();await page.locator('#snDeposito').fill('16800');await invalidated('depósito editado invalida resultado/comparación');
 await page.locator('.calc-button').click();check('diferencia recalculada',(await page.locator('#snReceiptCheck').innerText()).includes('$200.00 menor'));
 for(const [id,value] of [['salario',''],['salario','0'],['isrManual','-1'],['snDeposito','-1'],['isrManual','25000'],['isrManual','0.001']]){
  await valid();await page.locator('#'+id).fill(value);await page.locator('.calc-button').click();
  check('rechazo sin ready '+id+' '+value,await page.locator('#resultado').getAttribute('data-ready')===null&&await page.locator('#resultado .result-actions').count()===0);
 }
 await valid();await page.locator('[data-form-reset]').click();await invalidated('limpiar invalida resultado/comparación');
 check('limpiar depósito',await page.locator('#snDeposito').inputValue()==='');
 await page.locator('[data-sn-example="semanal,5000,450,120,80"]').click();
 check('ejemplo después de limpiar',(await page.locator('#resultado').innerText()).includes('4,350.00')&&(await page.locator('#snReceiptCheck').innerText()).includes('semanal'));
 await page.locator('#snDeposito').fill('4300');await page.locator('#snDeposito').press('Enter');
 check('Enter recalcula',(await page.locator('#snReceiptCheck').innerText()).includes('$50.00 menor'));
 check('sin errores JS',errors.length===0,errors);
 fs.writeFileSync(path.join(__dirname,'qa-controles-responsive.json'),JSON.stringify({status:'PASS',checks},null,2));
 console.log(JSON.stringify({status:'PASS',checks:checks.length,layouts:30}));
 }finally{await browser.close()}
})().catch(e=>{fs.writeFileSync(path.join(__dirname,'qa-controles-responsive.json'),JSON.stringify({status:'FAIL',error:e.message,checks},null,2));console.error(e);process.exit(1)});
