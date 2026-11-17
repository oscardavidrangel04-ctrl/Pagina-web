'use strict';
// Arithmetic and shipped handlers. The adapter below is deliberately not a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const savings = require('../assets/js/ahorro-mensual.js');
const margin = require('../assets/js/margen-ganancia.js');
const hour = require('../assets/js/salario-hora-focus.js');
const bonus = require('../assets/js/aguinaldo-antiguedad-focus.js');
const prima = require('../assets/js/prima-exenta.js');
const report = {status:'RUNNING', conditions:'Node: actual formulas and handlers with a minimal event adapter. No browser, layout, ads delivery or CWV measurement.', checks:[]};
const check = (name, fn) => {fn(); report.checks.push(name);};
const near = (a, b) => assert.ok(Math.abs(a-b) < Math.max(1, Math.abs(b))*1e-10, `${a} != ${b}`);
const money = n => new Intl.NumberFormat('es-MX', {style:'currency',currency:'MXN'}).format(n);

// Inputs, default values, examples and links come from the actual HTML.
const fixtures = JSON.parse(execFileSync('python3', ['-c', String.raw`
import json
from pathlib import Path
from lxml import html
out={}
names=['calculadoras/ahorro-mensual.html','calculadoras/margen-ganancia.html','calculadoras/salario-hora.html','articulos/aguinaldo-por-antiguedad.html','articulos/isr-prima-vacacional.html','calculadoras/propina.html','calculadoras/aguinaldo.html','calculadoras/salario-diario.html','calculadoras/pago-quincenal.html','articulos/que-es-propina.html','articulos/convertir-salario-mensual-diario-hora.html','articulos/aportaciones-voluntarias-afore.html']
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
  for(const timing of ['fin','inicio']) for(const annualRate of [0,6,12]) for(const months of [0,1,12,120]) {
    check(`Ahorro ${timing}, ${annualRate}%, ${months} meses`,()=>{
      const r=savings.project({initial:1000,contribution:500,annualRate,months,timing});
      const rate=annualRate/1200, factor=(1+rate)**months;
      const expected=rate===0?1000+500*months:1000*factor+500*(factor-1)/rate*(timing==='inicio'?1+rate:1);
      near(r.total,expected);near(r.invested+r.interest,r.total);assert.equal(r.schedule.length,months);
      r.schedule.forEach((row,i)=>{near(row.opening,i?r.schedule[i-1].balance:1000);near(row.opening+row.contribution+row.interest,row.balance);});
    });
  }
  for(const override of [{months:1.5},{months:601},{months:-1},{annualRate:NaN},{annualRate:101},{initial:Infinity},{contribution:-1},{initial:1.001},{timing:'otro'}]) check('Ahorro rechaza '+JSON.stringify(override),()=>assert.throws(()=>savings.project({initial:1000,contribution:500,annualRate:12,months:12,...override})));
  check('Ahorro limita desbordamiento',()=>assert.throws(()=>savings.project({initial:1e9,contribution:1e9,annualRate:100,months:600})));
  for(const [cost,sale,profit,markup]of [[100,150,50,50],[100,80,-20,-20],[0,10,10,null],[100,100,0,0]]) check(`Margen actual ${cost}/${sale}`,()=>{let r=margin.calculate({cost,sale});near(r.profit,profit);assert.equal(r.markup,markup);near(r.margin,profit/sale*100);});
  for(const cost of [0.01,2,100,999999]) for(const target of [0,30,40,99.99]) check(`Precio objetivo ${cost}/${target}`,()=>{
    const r=margin.calculate({cost,target,mode:'objetivo'});const cents=BigInt(Math.round(r.sale*100)),basis=10000n-BigInt(Math.round(target*100)),needed=BigInt(Math.round(cost*100))*10000n;
    assert.ok(cents*basis>=needed);assert.ok((cents-1n)*basis<needed);near(r.profit+r.cost,r.sale);
  });
  check('Objetivo 40%, costo 2: 3.34, no 3.33',()=>assert.equal(margin.calculate({cost:2,target:40,mode:'objetivo'}).sale,3.34));
  for(const input of [{cost:0,mode:'objetivo'},{cost:100,target:100,mode:'objetivo'},{cost:1,target:0.001,mode:'objetivo'},{cost:-1,sale:2},{cost:1,sale:0},{cost:1,sale:NaN},{cost:1.001,sale:2},{cost:1,sale:2,mode:'otro'}])check('Margen rechaza '+JSON.stringify(input),()=>assert.throws(()=>margin.calculate(input)));
  for(const [period,amount]of [['mensual',13000],['quincenal',6500],['semanal',3000],['anual',156000],['hora',62.5]]) check('Conversión '+period,()=>{const r=hour.convert(amount,period,48);near(r.annual,156000);near(r.hourly,62.5);near(r.monthly,13000);});
  check('Ofertas 18k: misma mensualidad y +20%/hora',()=>{const r=hour.compare(hour.convert(18000,'mensual',48),hour.convert(18000,'mensual',40));near(r.hourlyChange,20);assert.equal(r.monthlyDifference,0);});
  for(const args of [[0,'mensual',48],[1.001,'mensual',48],[1,'otro',48],[1,'mensual',0],[1,'mensual',169],[NaN,'mensual',48],[1,'mensual',NaN]])check('Hora rechaza '+JSON.stringify(args),()=>assert.throws(()=>hour.convert(...args)));
  for(const [gross,limit,exempt,taxable]of [[0,1759.65,0,0],[1000,1759.65,1000,0],[1759.65,1759.65,1759.65,0],[3000,1759.65,1759.65,1240.35],[2000,759.65,759.65,1240.35],[3000,0,0,3000],[3000,1697.10,1697.10,1302.90]])check(`Prima ${gross}/${limit}`,()=>assert.deepEqual(prima.split(gross,limit),{gross,exempt,taxable}));
  for(const args of [[-1,1],[1,-1],[NaN,1],[1,Infinity],[1.001,2]])check('Prima rechaza '+JSON.stringify(args),()=>assert.throws(()=>prima.split(...args)));
  for(const days of [15,30])for(const worked of [1,182,365])check(`Aguinaldo ${days}/${worked}`,()=>{const r=bonus.estimate(15000,days,worked);near(r.proportional,500*days*worked/365);near(r.minimum,7500*worked/365);});
  for(const args of [[0,15,365],[15000,14,365],[15000,7.5,182],[15000,15,1.5],[15000,15,366],[15000,15,0]])check('Aguinaldo rechaza '+JSON.stringify(args),()=>assert.throws(()=>bonus.estimate(...args)));

  check('Ahorro: ejemplos HTML, carga URL y estado invalidado',()=>{
    const h=harness('calculadoras/ahorro-mensual.html',read('assets/js/ahorro-mensual.js'));
    for(const values of h.fixture.examples){h.example(values);assert.equal(h.rows.at(-1).value,money(savings.project({initial:+values.inicial,contribution:+values.aportacion,annualRate:+values.tasa,months:+values.meses,timing:values.momento}).total));}
    assert.equal(h.nodes['ahorro-plan'].hidden,false);h.set('meses',1.5);assert.equal(h.nodes['ahorro-plan'].hidden,true);h.button.click();assert.equal(h.rows[0].label,'Revisa los datos');
    h.set('meses','');h.button.click();assert.equal(h.rows[0].label,'Revisa los datos');
    h.reset.click();h.flush();assert.equal(h.nodes['ahorro-plan'].hidden,true);
    const link=fixtures['articulos/aportaciones-voluntarias-afore.html'].links.find(x=>x.startsWith('/calculadoras/ahorro-mensual.html?'));
    const linked=harness('calculadoras/ahorro-mensual.html',read('assets/js/ahorro-mensual.js'),new URL(link,'https://example.test').search,{momento:'inicio'});
    assert.equal(linked.rows.at(-1).value,'$6,000.00');
  });
  check('Margen: ejemplos, cambio de modo, solo campos activos, reset',()=>{
    const h=harness('calculadoras/margen-ganancia.html',read('assets/js/margen-ganancia.js'));
    for(const values of h.fixture.examples){h.example(values);assert.notEqual(h.rows[0].label,'Revisa los datos');}
    h.set('margenModo','objetivo','change');h.set('costo',2);h.set('margenObjetivo',40);h.set('venta','');h.button.click();assert.equal(h.rows.find(r=>r.label==='Precio mínimo para ese margen').value,'$3.34');assert.equal(h.nodes.venta.disabled,true);assert.equal(h.nodes.margenObjetivo.disabled,false);
    h.reset.click();h.flush();assert.equal(h.nodes.venta.disabled,false);assert.equal(h.nodes.margenObjetivo.disabled,true);
    const linked=harness('calculadoras/margen-ganancia.html',read('assets/js/margen-ganancia.js'),'?margenModo=objetivo&costo=100&margenObjetivo=30');assert.equal(linked.rows[1].value,'$142.86');assert.equal(linked.nodes.venta.disabled,true);
  });
  check('Hora: comparador URL, etiquetas, ejemplos, cambio de datos y reset',()=>{
    const query='?periodoSalarioHora=mensual&salario=18000&horasSemana=48&compararOferta=si&sueldoOfertaB=18000&horasOfertaB=40';
    const h=harness('calculadoras/salario-hora.html',read('assets/js/salario-hora-focus.js'),query);
    assert.match(h.nodes.resultado.innerHTML,/20\.00%/);assert.match(h.nodes.resultado.innerHTML,/\$103\.85/);assert.equal(h.nodes.camposOfertaB.hidden,false);
    h.set('salario',19000);assert.match(h.nodes.resultado.innerHTML,/Datos actualizados/);
    h.example(h.fixture.examples.at(-1));assert.match(h.nodes.resultado.innerHTML,/20\.00%/);
    h.reset.click();h.flush();assert.equal(h.nodes.compararOferta.value,'no');assert.equal(h.nodes.camposOfertaB.hidden,true);
    const weekly=harness('calculadoras/salario-hora.html',read('assets/js/salario-hora-focus.js'),'?periodoSalarioHora=semanal&salario=3000&horasSemana=48&compararOferta=no');assert.equal(weekly.label.textContent,'Importe semanal');assert.match(weekly.nodes.resultado.innerHTML,/\$62\.50/);
  });
  check('Prima: cálculo, entrada vacía, cambio y Enter',()=>{
    const h=harness('articulos/isr-prima-vacacional.html',read('assets/js/prima-exenta.js'));
    h.nodes.separarPrima.click();assert.match(h.nodes.resultadoPrimaExenta.textContent,/1,240\.35/);
    h.set('exencionDisponible','');h.nodes.separarPrima.click();assert.match(h.nodes.resultadoPrimaExenta.textContent,/Completa ambos/);
    h.set('exencionDisponible','0');h.nodes.primaBruta.dispatchEvent({type:'keydown',key:'Enter',preventDefault(){}});assert.match(h.nodes.resultadoPrimaExenta.textContent,/Parte gravada: \$3,000\.00/);
  });
  check('Antigüedad: mínimo, proporcional, cambio, enlace a calculadora real',()=>{
    const h=harness('articulos/aguinaldo-por-antiguedad.html',read('assets/js/aguinaldo-antiguedad-focus.js'));
    h.set('antiguedadSueldo',15000);h.set('antiguedadDiasAguinaldo',15);h.set('antiguedadDiasTrabajados',182);h.nodes.calcularAguinaldoAntiguedad.click();assert.match(h.nodes.resultadoAguinaldoAntiguedad.innerHTML,/3,739\.73/);
    const link=h.nodes.resultadoAguinaldoAntiguedad.innerHTML.match(/href="([^"]+)"/)[1].replaceAll('&amp;','&');
    const linked=harness('calculadoras/aguinaldo.html',read('assets/js/calculators.js'),new URL(link,'https://example.test').search);
    assert.ok(linked.rows.some(r=>r.value==='$3,739.73'),JSON.stringify(linked.rows));
    h.set('antiguedadDiasAguinaldo',7.5);h.nodes.calcularAguinaldoAntiguedad.click();assert.match(h.nodes.resultadoAguinaldoAntiguedad.innerHTML,/entre 15 y 365/);
  });
  check('Propina: enlace fuerza reparto y redondeo ante preferencias guardadas',()=>{
    const link=fixtures['articulos/que-es-propina.html'].links.find(x=>x.startsWith('/calculadoras/propina.html?'));
    const h=harness('calculadoras/propina.html',read('assets/js/calculators.js'),new URL(link,'https://example.test').search,{tipSplitMode:'one-tip',tipRounding:'10',tipServiceAmount:'500'});
    assert.equal(h.rows.find(r=>r.label==='Total final').value,'$550.00');assert.equal(h.rows.at(-1).value,'$137.50');
  });
  check('Conversión: parámetros de los enlaces existen en los controles destino',()=>{
    for(const link of fixtures['articulos/convertir-salario-mensual-diario-hora.html'].links.filter(x=>x.startsWith('/calculadoras/')&&x.includes('?'))){
      const u=new URL(link,'https://example.test'), fixture=fixtures[u.pathname.slice(1)];assert.ok(fixture);
      for(const [key,value]of u.searchParams){const field=fixture.nodes.find(n=>n.id===key);assert.ok(field,key);if(field.options)assert.ok(field.options.includes(value),key+'='+value);}
    }
  });
  report.status='PASS';
} catch(error) {report.status='FAIL';report.error=error.stack;process.exitCode=1;}
report.total_checks=report.checks.length;
fs.writeFileSync(path.join(root,'docs/seo-gsc-2026-11-10/validation-calculations.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,total_checks:report.total_checks,error:report.error},null,2));
