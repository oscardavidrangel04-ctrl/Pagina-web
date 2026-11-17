'use strict';
// Execute shipped arithmetic, events, examples, URL loading and reset without a browser.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const costs=require('../assets/js/costos-precios.js'),auto=require('../assets/js/credito-automotriz.js'),iva=require('../assets/js/iva.js'),rule=require('../assets/js/regla-tres.js');
const report={status:'RUNNING',conditions:'Real modules and handlers in a minimal DOM adapter; not browser, visual, network ads or CWV verification.',checks:[]};
const check=(name,fn)=>{fn();report.checks.push(name);};
const near=(a,b,tolerance=1e-7)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n);
// Inputs, default values, examples and links come from the actual HTML.
const fixtures = JSON.parse(execFileSync('python3', ['-c', String.raw`
import json
from pathlib import Path
from lxml import html
out={}
names=['calculadoras/costo-unidad.html', 'calculadoras/precio-venta.html', 'calculadoras/credito-automotriz.html', 'calculadoras/regla-tres.html', 'calculadoras/iva.html', 'calculadoras/margen-ganancia.html', 'calculadoras/finiquito.html', 'articulos/como-calcular-iva.html', 'articulos/simulador-credito-automotriz.html', 'articulos/finiquito-renuncia-voluntaria.html', 'fallback-finiquito-renuncia-voluntaria.html']
for name in names:
 t=html.fromstring(Path(name).read_text()); nodes=[]
 for e in t.xpath('//*[@id]'):
  d=dict(e.attrib); d['tagName']=e.tag.upper()
  if e.tag=='select':
   opts=e.xpath('./option'); d['options']=[o.get('value','') for o in opts]
   d['value']=next((o.get('value','') for o in opts if 'selected' in o.attrib),opts[0].get('value','') if opts else '')
  d['isControl']=e.tag in ['input','select'] and bool(e.xpath('ancestor::*[contains(concat(" ",normalize-space(@class)," ")," calc-box ")]'))
  nodes.append(d)
 out[name]={'body':dict(t.xpath('//body')[0].attrib),'nodes':nodes,'examples':[json.loads(x) for x in t.xpath('//*[@data-calc-example]/@data-calc-example')], 'links':t.xpath('//a/@href'), 'presets':t.xpath('//*[@data-hours-week]/@data-hours-week')}
print(json.dumps(out))
`], {cwd:root,encoding:'utf8'}));
const common = read('assets/js/common.js');
const part = (a,b) => common.slice(common.indexOf(a),common.indexOf(b,common.indexOf(a)));
const linkLoader = part('function loadCalculatorForm(', 'function resetCalculatorForm(');
const resetLoader = part('function resetCalculatorForm(', 'function markInvalidFields(');
const exampleLoader = part('function loadCalculatorExample(', "document.addEventListener('DOMContentLoaded'");

function harness(name, script, query='', stored={}) {
  const fixture=fixtures[name], timers=[], ready=[]; let rows, focuses=0;
  function element(attrs={}) {
    const listeners={}, classes=new Set((attrs.class||'').split(' '));
    const el={...attrs, value:attrs.value||'', hidden:Object.hasOwn(attrs,'hidden'), disabled:Object.hasOwn(attrs,'disabled'), checked:Object.hasOwn(attrs,'checked'), tagName:attrs.tagName||'DIV', dataset:{}, innerHTML:'',textContent:'', options:(attrs.options||[]).map(value=>({value})),
      classList:{add:s=>classes.add(s), remove:s=>classes.delete(s), contains:s=>classes.has(s), toggle:(s,on)=>on?classes.add(s):classes.delete(s)},
      addEventListener:(e,fn)=>(listeners[e]??=[]).push(fn),
      dispatchEvent(event){for(const fn of listeners[event.type]||[]) fn(event);},
      click(){this.dispatchEvent({type:'click',preventDefault(){}});},
      setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},
      focus(){focuses++;},scrollIntoView(){},closest(){return this.group??(this.group=element());}
    };
    for(const [key,value]of Object.entries(attrs)) if(key.startsWith('data-')) el.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
    return el;
  }
  const nodes=Object.fromEntries(fixture.nodes.map(n=>[n.id,element(n)]));
  const controls=fixture.nodes.filter(n=>n.isControl).map(n=>nodes[n.id]);
  const button=element(), reset=element(), note=element(), label=element();
  const presets=fixture.presets.map(value=>element({'data-hours-week':value}));
  const document={readyState:'loading',body:element(fixture.body),getElementById:id=>nodes[id],addEventListener:(e,fn)=>{if(e==='DOMContentLoaded')ready.push(fn);},
    querySelector(selector){
      if(selector.includes('.calc-button'))return button;
      if(selector.includes('[data-form-reset]'))return reset;
      if(selector==='[data-form-state]')return note;
      if(selector==='[data-salary-hour-amount-label]')return label;
      if(selector==='[data-tip-mode].is-active')return {dataset:{tipMode:'percent'}};
      if(selector==='.result')return nodes.resultado;
      return null;
    },querySelectorAll:selector=>selector==='[data-hours-week]'?presets:[]};
  const ctx=vm.createContext({document,console,Intl,URLSearchParams,Event:class {constructor(type){this.type=type;}},
    money, val:id=>Number(nodes[id]?.value||0), showRows:r=>{rows=r;if(nodes.resultado){nodes.resultado.innerHTML=JSON.stringify(r);nodes.resultado['data-ready']='true';}},
    calculatorControls:()=>controls, readStore:()=>stored, saveCalculatorForm(){},showToast(){},
    setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},
    location:{search:query,pathname:'/'+name},localStorage:{removeItem(){}},history:{replaceState(){}},matchMedia:()=>({matches:true})});
  ctx.window=ctx;
  vm.runInContext(script,ctx);
  vm.runInContext(linkLoader+resetLoader+exampleLoader,ctx);
  // common.js registers its DOMContentLoaded handler first, and schedules a click.
  ctx.loadCalculatorForm();
  for(const fn of ready)fn();
  function flush(){let count=0;while(timers.length){assert.ok(count++<100);timers.shift()();}}
  reset.addEventListener('click',()=>ctx.resetCalculatorForm());
  flush();
  return {nodes,button,reset,label,presets,ctx,fixture,flush,get rows(){return rows;},get focuses(){return focuses;},
    set(id,value,event='input'){nodes[id].value=String(value);nodes[id].dispatchEvent({type:event,key:null,preventDefault(){}});},
    example(values){ctx.loadCalculatorExample({dataset:{calcExample:JSON.stringify(values)}});flush();}};
}

try {
  for(const [input,unit,total] of [
    [{fixed:8000,variable:12000,units:1000},20,20000],
    [{fixed:8000,variable:12,units:1000,mode:'unidad'},20,20000],
    [{fixed:8000,variable:12,units:500,mode:'unidad'},28,14000],
    [{fixed:8000,variable:12000,units:500},40,20000],
    [{fixed:0,variable:0,units:1},0,0],
    [{fixed:100,variable:0,units:3},100/3,100]
  ])check('Costo unitario '+JSON.stringify(input),()=>{const r=costs.unitCost(input);near(r.unit,unit);near(r.total,total);near(r.fixedUnit+r.variableUnit,unit);assert.ok(r.transferCost>=r.unit&&r.transferCost-r.unit<.010001);});
  for(const bad of [{units:0},{units:1.5},{units:1000001},{fixed:-1},{fixed:NaN},{variable:Infinity},{variable:.001},{mode:'otro'},{variable:1e9,units:1e6,mode:'unidad'}])check('Costo rechaza '+JSON.stringify(bad),()=>assert.throws(()=>costs.unitCost({fixed:10,variable:1,units:10,...bad})));
  for(const [input,sale,margin] of [
    [{cost:700,markup:30},910,210/910*100],
    [{cost:100,extra:20,markup:25},150,20],
    [{cost:.01,markup:50},.02,50],
    [{cost:0,markup:25},0,null],
    [{cost:0,extra:10,markup:0},10,0]
  ])check('Precio y margen '+JSON.stringify(input),()=>{const r=costs.sellingPrice(input);assert.equal(r.sale,sale);near(r.totalCost+r.profit,r.sale);if(margin===null)assert.equal(r.margin,null);else near(r.margin,margin);});
  for(const bad of [{cost:-1},{extra:-1},{cost:Infinity},{markup:NaN},{markup:-1},{markup:100001},{extra:.001},{markup:.001}])check('Precio rechaza '+JSON.stringify(bad),()=>assert.throws(()=>costs.sellingPrice({cost:100,markup:30,...bad})));

  for(const price of [.01,1,1000,300000,999999999.99])for(const downRate of [0,20,100])for(const annualRate of [0,.01,18,100])for(const months of [1,36,48,240])check(`Auto ${price}/${downRate}/${annualRate}/${months}`,()=>{
    const r=auto.project({price,downRate,annualRate,months}),rate=annualRate/1200;
    const expected=r.principal===0?0:rate===0?r.principal/months:r.principal*rate/(1-(1+rate)**(-months));
    near(r.exactMonthly,expected,Math.max(.0001,Math.abs(expected)*1e-9));
    let capital=0,interest=0,payments=0;
    for(const [i,p]of r.schedule.entries()){
      near(p.opening,i?r.schedule[i-1].balance:r.principal,.000001);
      near(p.opening-p.capital,p.balance,.000001);near(p.capital+p.interest,p.payment,.000001);
      assert.ok(p.balance>=0&&p.capital>=0);capital+=Math.round(p.capital*100);interest+=Math.round(p.interest*100);payments+=Math.round(p.payment*100);
    }
    assert.equal(capital,Math.round(r.principal*100));assert.equal(interest,Math.round(r.interest*100));assert.equal(payments,Math.round(r.total*100));
    assert.equal(Math.round(r.outlay*100),Math.round(r.down*100)+payments);
    assert.equal(r.schedule.at(-1)?.balance||0,0);
    if(annualRate===0)assert.equal(r.interest,0);
    if(downRate===100){assert.equal(r.monthly,0);assert.equal(r.schedule.length,0);assert.equal(r.outlay,price);}
  });
  check('Auto tasa cero del ejemplo',()=>{const r=auto.project({price:240000,downRate:20,annualRate:0,months:48});assert.equal(r.monthly,4000);assert.equal(r.down,48000);assert.equal(r.outlay,240000);});
  check('Auto aumenta costo y reduce mensualidad al ampliar plazo',()=>{
    const a=auto.project({price:300000,downRate:20,annualRate:18,months:36}),b=auto.project({price:300000,downRate:20,annualRate:18,months:48});
    assert.equal(a.monthly,8676.57);assert.equal(b.monthly,7050);assert.ok(a.interest<b.interest);assert.ok(a.outlay<b.outlay);
  });
  for(const bad of [{price:0},{price:NaN},{price:Infinity},{price:.001},{downRate:101},{downRate:-1},{annualRate:-1},{annualRate:101},{annualRate:.001},{months:0},{months:1.5},{months:241}])check('Auto rechaza '+JSON.stringify(bad),()=>assert.throws(()=>auto.project({price:300000,downRate:20,annualRate:18,months:48,...bad})));

  for(const amount of [.01,.03,.17,999.99,1000])for(const rate of [0,8,16,100])for(const operation of ['agregar','quitar','calcular'])check(`IVA ${amount}/${rate}/${operation}`,()=>{
    const r=iva.calculate({amount,rate,operation});
    assert.equal(Math.round(r.subtotal*100)+Math.round(r.tax*100),Math.round(r.total*100));
    near(r.tax,operation==='quitar'?amount-amount/(1+rate/100):amount*rate/100,.0050001);
    assert.equal(r.primary,operation==='calcular'?r.tax:r.total);if(operation==='quitar')assert.equal(r.total,amount);
  });
  check('IVA 999.99 a centavos',()=>assert.deepEqual(iva.calculate({amount:999.99,rate:16,operation:'agregar'}),{operation:'agregar',subtotal:999.99,tax:160,total:1159.99,primary:1159.99}));
  for(const bad of [{amount:0},{amount:-1},{amount:NaN},{amount:Infinity},{amount:.001},{rate:-1},{rate:101},{rate:NaN},{operation:'otra'}])check('IVA rechaza '+JSON.stringify(bad),()=>assert.throws(()=>iva.calculate({amount:1000,rate:16,operation:'agregar',...bad})));
  for(const [a,b,c,result]of [[10,25,8,20],[100,240,15,36],[3,10,2,20/3],[-2,10,3,-15],[2,0,4,0],[2,4,0,0],[1,1e-12,1,1e-12]])check('Regla '+[a,b,c],()=>near(rule.calculate(a,b,c).result,result));
  for(const values of [[0,1,2],[NaN,1,2],[1,Infinity,2],[1,1e308,2],[1,1e-300,1e-300]])check('Regla rechaza '+values,()=>assert.throws(()=>rule.calculate(...values)));

  const modules={'costo-unidad':'costos-precios','precio-venta':'costos-precios','iva':'iva','regla-tres':'regla-tres','credito-automotriz':'credito-automotriz'};
  for(const [type,script]of Object.entries(modules))check('Formulario, ejemplos y reset '+type,()=>{
    const h=harness('calculadoras/'+type+'.html',read('assets/js/'+script+'.js'));
    h.button.click();assert.ok(h.rows.some(r=>r.total));
    for(const input of h.fixture.examples){h.example(input);assert.ok(h.rows.some(r=>r.total),JSON.stringify(input));}
    const first=h.fixture.nodes.find(n=>n.isControl&&n.tagName==='INPUT').id;
    h.set(first,'');h.button.click();assert.equal(h.rows[0].label,'Revisa los datos');
    h.reset.click();h.flush();h.button.click();assert.ok(h.rows.some(r=>r.total));
    h.set(first,'');assert.ok(!h.nodes.resultado['data-ready'],'Editing clears stale result');
    if(h.nodes['auto-detalle'])assert.equal(h.nodes['auto-detalle'].hidden,true);
    if(h.nodes['costos-siguiente'])assert.equal(h.nodes['costos-siguiente'].hidden,true);
  });
  check('IVA URL completa cambia etiqueta sin evento change',()=>{
    const h=harness('calculadoras/iva.html',read('assets/js/iva.js'),'?cantidad=1160&tasa=16&operacion=quitar',{cantidad:999,tasa:8,operacion:'agregar'});
    assert.equal(h.nodes['iva-cantidad-label'].textContent,'Total con IVA incluido (MXN)');assert.equal(h.rows.find(r=>r.label==='Subtotal antes de IVA').value,money(1000));
    h.reset.click();h.flush();assert.equal(h.nodes['iva-cantidad-label'].textContent,'Subtotal antes de IVA (MXN)');
  });
  check('Costo por unidad URL y ejemplo evitan estado previo',()=>{
    const h=harness('calculadoras/costo-unidad.html',read('assets/js/costos-precios.js'),'?costosFijos=8000&costosVariables=12&unidades=1000&modoVariables=unidad');
    assert.match(h.nodes['variable-label'].textContent,/una unidad/);assert.equal(h.rows.find(r=>r.total).value,money(20));
    h.example({costosFijos:8000,costosVariables:12000,unidades:1000,modoVariables:'total'});assert.match(h.nodes['variable-label'].textContent,/todo el lote/);assert.equal(h.rows.find(r=>r.total).value,money(20));
  });
  check('Cadena costo unitario → precio → margen',()=>{
    const h=harness('calculadoras/costo-unidad.html',read('assets/js/costos-precios.js'),'?costosFijos=100&costosVariables=0&unidades=3&modoVariables=total');
    const link=new URL(h.nodes['costos-enlace'].href,'https://local.test');assert.equal(link.searchParams.get('costo'),'33.34');
    const p=harness('calculadoras/precio-venta.html',read('assets/js/costos-precios.js'),link.search,{costosExtra:999});
    assert.equal(p.nodes.costosExtra.value,'0');assert.equal(p.rows.find(r=>r.total).value,money(43.34));
    const target=new URL(p.nodes['costos-enlace'].href,'https://local.test');
    const m=harness('calculadoras/margen-ganancia.html',read('assets/js/margen-ganancia.js'),target.search,{margenModo:'objetivo'});
    assert.equal(m.nodes.margenModo.value,'actual');assert.equal(m.rows.find(r=>r.label==='Precio de venta').value,money(43.34));
  });
  for(const source of ['articulos/como-calcular-iva.html','articulos/simulador-credito-automotriz.html','articulos/finiquito-renuncia-voluntaria.html','fallback-finiquito-renuncia-voluntaria.html']){
    for(const href of fixtures[source].links.filter(h=>h.startsWith('/calculadoras/')&&h.includes('?'))){
      const u=new URL(href,'https://local.test'),type=path.basename(u.pathname,'.html');if(!modules[type]&&type!=='finiquito')continue;
      check('Enlace ejecutable '+source+' '+href,()=>{
        const h=harness(u.pathname.slice(1),read('assets/js/'+(modules[type]||'calculators')+'.js'),u.search,{diasAnio:365,tasa:99,operacion:'calcular',meses:200});
        assert.ok(h.rows.some(r=>r.total));if(type==='finiquito')assert.equal(h.rows.find(r=>r.total).value,money(8519.17808219178));
      });
    }
  }
  report.status='PASS';
}catch(error){report.status='FAIL';report.error=error.stack;throw error;}
finally{fs.writeFileSync(path.join(root,'docs/seo-google-bing-2026-11-11/validation-calculators.json'),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({status:report.status,checks:report.checks.length,conditions:report.conditions},null,2));
