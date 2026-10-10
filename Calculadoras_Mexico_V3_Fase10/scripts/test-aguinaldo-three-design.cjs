const fs = require('fs');
const path = require('path');
const {chromium} = require('C:/Users/Casa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname!=='local.test')return route.abort();
  const target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target))return route.fulfill({status:404,body:''});
  const type=target.endsWith('.css')?'text/css':target.endsWith('.js')?'application/javascript':target.endsWith('.svg')?'image/svg+xml':target.endsWith('.html')?'text/html':'application/octet-stream';
  await route.fulfill({contentType:type,body:fs.readFileSync(target)});
 });
 await page.goto('http://local.test/articulos/aguinaldo-3-meses.html');
 await page.locator('.a3-hero').waitFor();
 if(await page.locator('h1').count()!==1)throw Error('H1');
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:path.join(root,'outputs/aguinaldo-three-desktop.png'),fullPage:false});
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>window.scrollTo(0,0));
 if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw Error('Mobile overflow');
 await page.screenshot({path:path.join(root,'outputs/aguinaldo-three-mobile.png'),fullPage:false});
 if(errors.length)throw Error(errors.join('\n'));
 console.log('Desktop/mobile, calculation, reset and browser errors: OK');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
