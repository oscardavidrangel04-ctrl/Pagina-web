'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'site-public'),out=path.join(root,'docs/seo-integral-2026-11-09');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const report={status:'RUNNING',conditions:'Executable unit tests and generated HTML checks. This is not a browser, live advertising, field CWV or Google indexing test.',tariffCells:0,tariffBoundaryCases:0,bonusCases:0,invalidCases:0,exampleCases:[],preserved:[],htmlPages:0};
const save=()=>fs.writeFileSync(path.join(out,'validation-static-unit.json'),JSON.stringify(report,null,2)+'\n');
function tables(){const context=vm.createContext({});vm.runInContext(read('assets/js/tablas.js')+';this.tables={mensual:tablaISRMensual,semanal:tablaISRSemanal,quincenal:tablaISRQuincenal};',context);return context.tables;}
function tariffTests(){
  const golden=JSON.parse(read('docs/seo-integral-2026-11-09/tarifas-sat-2026.json')),actual=tables();
  const {calculate}=require('../assets/js/isr-periodos.js');
  const article=read('articulos/isr-semanal-quincenal-mensual.html');
  for(const period of ['semanal','quincenal','mensual']){
    const markup=article.match(new RegExp('id="tabla-isr-'+period+'"[\\s\\S]*?<tbody>([\\s\\S]*?)</tbody>'))[1];
    const rendered=[...markup.matchAll(/<tr>(.*?)<\/tr>/gs)].map(m=>[...m[1].matchAll(/<td>(.*?)<\/td>/gs)].map(t=>t[1]==='En adelante'?null:Number(t[1].replace(/[,%%]/g,''))));
    assert.deepEqual(rendered,golden[period],period+' visible table vs official fixture');
    golden[period].forEach((row,i)=>{
      const expected={limiteInferior:row[0],limiteSuperior:row[1]===null?Infinity:row[1],cuotaFija:row[2],porcentaje:row[3]};
      for(const key of golden.columns){assert.equal(actual[period][i][key],expected[key],period+' '+i+' '+key);report.tariffCells++;}
      for(const income of [row[0],...(row[1]===null?[1000000]:[row[1]])]){
        const result=calculate(income,period,actual);assert.equal(result.index,i);
        // Independent integer-cent reference, with half-up rounding of the marginal part.
        const excess=BigInt(Math.round(income*100)-Math.round(row[0]*100));
        const taxCents=BigInt(Math.round(row[2]*100))+(excess*BigInt(Math.round(row[3]*100))+5000n)/10000n;
        assert.equal(result.tax,Number(taxCents)/100);report.tariffBoundaryCases++;
      }
      if(i>0)assert.equal(Math.round(golden[period][i-1][1]*100)+1,Math.round(row[0]*100),'No missing cent');
    });
  }
  for(const [period,income,tax] of [['semanal',3000,248.82],['quincenal',10000,1204.26],['mensual',20000,2383.65]])assert.equal(calculate(income,period,actual).tax,tax);
  for(const value of [0,-1,NaN,Infinity,0.001,1000000000001,'3000',null]){assert.throws(()=>calculate(value,'semanal',actual));report.invalidCases++;}
  for(const period of ['__proto__','catorcenal','anual','']){assert.throws(()=>calculate(3000,period,actual));report.invalidCases++;}
}
function bonusTests(){
  const {calculate}=require('../assets/js/bono.js');
  for(const [input,bonus,total,percent] of [
    [{base:15000,percent:10},1500,16500,10],
    [{base:12000,percent:5},600,12600,5],
    [{base:18000,percent:6},1080,19080,6],
    [{base:180000,percent:10},18000,198000,10],
    [{base:15000,mode:'fijo',amount:1500},1500,16500,10],
    [{base:30000,mode:'fijo',amount:1500},1500,31500,5],
    [{base:0.01,percent:50},0.01,0.02,50],
    [{base:0.3,mode:'fijo',amount:0.1},0.1,0.4,100/3],
    [{base:100,percent:125},125,225,125],
    [{base:1000,percent:0},0,1000,0],
    [{base:1000,mode:'fijo',amount:0},0,1000,0],
    [{base:1000000000,percent:99.99},999900000,1999900000,99.99]
  ]){
    const r=calculate(input);assert.equal(r.bonus,bonus);assert.equal(r.total,total);assert.ok(Math.abs(r.percent-percent)<1e-10);report.bonusCases++;
  }
  for(const input of [{base:0},{base:-1},{base:NaN},{base:Infinity},{base:1.001},{base:100,percent:-1},{base:100,percent:NaN},{base:100,percent:1.001},{base:100,mode:'invalid'},{base:100,mode:'fijo',amount:-1},{base:100,mode:'fijo',amount:1.001},{base:'100'},{base:1000000000000,percent:1},{base:100,percent:10001}]){assert.throws(()=>calculate(input));report.invalidCases++;}
}
// Exercise the existing calculator click handlers with real inputs. The harness
// supplies only document events and output capture; it is not a DOM/browser test.
function oldCalculator(type,values){
  let click,rows;
  const context=vm.createContext({document:{body:{dataset:{calc:type}},addEventListener:(event,callback)=>{if(event==='DOMContentLoaded')callback();},querySelector:selector=>selector==='.calc-button'?{addEventListener:(event,callback)=>{if(event==='click')click=callback;}}:null,getElementById:id=>({value:values[id]})},val:id=>Number(values[id]||0),money:n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n),showRows:value=>{rows=value;},console});
  vm.runInContext(read('assets/js/calculators.js'),context);assert.ok(click);click();return JSON.parse(JSON.stringify(rows));
}
function examples(){
  const cases=[
    ['ahorro-mensual',{inicial:0,aportacion:500,tasa:0,meses:12},'Ahorro acumulado','$6,000.00'],
    ['ahorro-mensual',{inicial:1000,aportacion:500,tasa:12,meses:12},'Ahorro acumulado','$7,468.08'],
    ['margen-ganancia',{costo:700,venta:1000},'Margen sobre venta','30.00%'],
    ['margen-ganancia',{costo:100,venta:130},'Margen sobre venta','23.08%'],
    ['margen-ganancia',{costo:100,venta:80},'Margen sobre venta','-25.00%'],
    ['margen-ganancia',{costo:0,venta:80},'Aumento sobre costo','No definido: costo cero'],
    ['iva-incluido',{total:1160,tasa:16},'Subtotal','$1,000.00'],
    ['iva-incluido',{total:580,tasa:16},'IVA incluido','$80.00'],
    ['iva-incluido',{total:1000,tasa:0},'Subtotal','$1,000.00'],
    ['precio-venta',{costo:100,aumento:30},'Precio de venta','$130.00'],
    ['precio-venta',{costo:700,aumento:50},'Precio de venta','$1,050.00'],
    ['regla-tres',{a:3,b:45,c:8},'Valor desconocido','120'],
    ['regla-tres',{a:100,b:800,c:15},'Valor desconocido','120']
  ];
  for(const [type,input,label,expected] of cases){const rows=oldCalculator(type,input);assert.equal(rows.find(r=>r.label===label)?.value,expected);report.exampleCases.push({type,input,expected});}
  for(const [type,input] of [['regla-tres',{a:0,b:20,c:4}],['margen-ganancia',{costo:10,venta:0}],['iva-incluido',{total:0,tasa:16}]])assert.equal(oldCalculator(type,input)[0].label,'Revisa los datos');
}
function sharedExampleHandler(){
  const code=read('assets/js/common.js');const start=code.indexOf('function loadCalculatorExample('),end=code.indexOf("document.addEventListener('DOMContentLoaded'",start);
  let clicked=0,focused=0,scrolled=0;const changes=[];
  const controls=[{id:'salario',tagName:'INPUT',value:'15000',dispatchEvent:e=>changes.push(e.type)},{id:'bonoModo',tagName:'SELECT',value:'porcentaje',options:[{value:'porcentaje'},{value:'fijo'}],dispatchEvent:e=>changes.push(e.type)}];
  const ctx=vm.createContext({calculatorControls:()=>controls,Event:class{constructor(type){this.type=type;}},matchMedia:()=>({matches:true}),document:{querySelector:selector=>selector==='.calc-button'?{click:()=>clicked++}:{focus:()=>focused++,scrollIntoView:()=>scrolled++}}});
  vm.runInContext(code.slice(start,end),ctx);
  ctx.loadCalculatorExample({dataset:{calcExample:'{"salario":12000,"bonoModo":"fijo"}'}});
  assert.equal(controls[0].value,'12000');assert.equal(controls[1].value,'fijo');assert.equal(clicked,1);assert.equal(focused,1);assert.equal(scrolled,1);assert.deepEqual(changes,['input','change','input','change']);
  for(const data of ['bad json','[]','null','{"unknown":7}','{"bonoModo":"other"}'])ctx.loadCalculatorExample({dataset:{calcExample:data}});
  assert.equal(clicked,1,'Malformed scenarios ignored');report.sharedExamples='PASS: load, input/change events, calculation, focus, invalid payloads';
}
function staticChecks(){
  const hashes=JSON.parse(read('docs/seo-integral-2026-11-09/preservation-baseline.json'));
  for(const [file,expected] of Object.entries(hashes)){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),expected,file+' preservation');report.preserved.push(file);}
  assert.equal(read('assets/js/common.js'),read('assets/js/common.min.js'));
  assert.equal(read('assets/js/catalog.js'),read('assets/js/catalog.min.js'));
  require('../assets/js/catalog.js');assert.deepEqual(globalThis.CM_CATALOG,JSON.parse(read('assets/data/calculators.json')));
  for(const file of fs.readdirSync(path.join(root,'assets/js')).filter(x=>x.endsWith('.js')))new vm.Script(read('assets/js/'+file),{filename:file});
  const {transform,nativeId,bannerKey}=require('./monetization-v2.cjs');
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
  for(const file of walk(pub).filter(x=>x.endsWith('.html'))){
    const html=fs.readFileSync(file,'utf8');if(!/<body\b/.test(html))continue;
    report.htmlPages++;
    for(const name of ['native','partners','banner'])assert.equal(html.split('<!-- monetization-v2:'+name+':start -->').length-1,1,file+' slot '+name);
    for(const name of ['aliexpress','solcredito'])assert.equal(html.split('data-affiliate="'+name+'"').length-1,1,file+' '+name);
    for(const token of ['src="https://bauval.org/21/'+nativeId+'"','https://bauval.org/22/'+bannerKey])assert.equal(html.split(token).length-1,1,file+' Adsterra');
    assert.equal(transform(html,path.relative(pub,file)).html,html,'Idempotent monetization transform');
    for(const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))JSON.parse(m[1]);
  }
  assert.equal(report.htmlPages,407);
  for(const slug of ['bono','ahorro-mensual','margen-ganancia','iva-incluido','precio-venta','regla-tres']){
    const html=read('calculadoras/'+slug+'.html');assert.ok(html.includes('data-related-curated="true"'));assert.ok(html.includes('data-calc-example='));
    for(const m of html.matchAll(/data-calc-example="(.*?)"/g)){
      const data=JSON.parse(m[1].replaceAll('&quot;','"').replaceAll('&amp;','&'));
      for(const key of Object.keys(data))assert.ok(html.includes('id="'+key+'"'),slug+' example control '+key);
    }
  }
  report.monetization='407 pages, exactly one of each existing Adsterra unit and both affiliates; network delivery not tested';
}
try{tariffTests();bonusTests();examples();sharedExampleHandler();staticChecks();report.status='PASS';save();console.log(JSON.stringify({...report,exampleCases:report.exampleCases.length,preserved:report.preserved.length},null,2));}
catch(e){report.status='FAIL';report.error=e.stack;save();console.error(e);process.exitCode=1;}
