const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const reports = [];
const normalize = text => text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
for (const file of ['calculadoras/salario-neto.html', 'calculadoras/salario-bruto.html', 'articulos/salario-bruto-neto.html']) {
  const html = read(file);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const faq = schemas.find(s => s['@type'] === 'FAQPage');
  const visible = [...html.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map(m => ({q:normalize(m[1]), a:normalize(m[2])}));
  assert.deepEqual(visible, faq.mainEntity.map(x => ({q:x.name, a:x.acceptedAnswer.text})), file + ': FAQ');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file + ': H1');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, file + ': duplicate IDs');
  for (const m of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(m[1]), file + ': missing anchor ' + m[1]);
  for (const m of html.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)) {
    if (m[1].startsWith('/_vercel/')) continue;
    assert(fs.existsSync(path.join(root, m[1] === '/' ? 'index.html' : m[1])), file + ': missing local URL ' + m[1]);
  }
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  const description = html.match(/<meta content="([^"]+)" name="description">/)[1];
  assert(html.includes('content="' + title + '" property="og:title"'), file + ': OG title');
  assert(html.includes('content="' + title + '" name="twitter:title"'), file + ': Twitter title');
  assert(html.includes('content="' + description + '" property="og:description"'), file + ': OG description');
  assert(html.includes('content="' + description + '" name="twitter:description"'), file + ': Twitter description');
  const entity = schemas.flatMap(s => s['@graph'] || [s]).find(s => ['WebPage', 'Article'].includes(s['@type']));
  assert.equal(entity.dateModified, '2026-10-23');
  assert.equal(entity.description, description);
  assert(html.includes('23 de octubre de 2026'));
  reports.push({file, status:'PASS', faq:visible.length, h1:1, uniqueIDs:ids.length, metadata:'aligned', localURLs:'exist'});
}
class FakeEvent {
  constructor(type, options={}) { this.type=type; this.bubbles=!!options.bubbles; }
  stopImmediatePropagation() { this.stopped=true; }
}
class Node {
  constructor(id, parent) { this.id=id; this.parent=parent; this.value=''; this.dataset={}; this.hidden=true; this.attrs={}; this.events={}; this.textContent=''; }
  addEventListener(type, fn, capture=false) { (this.events[type] ||= []).push({fn,capture}); }
  dispatchEvent(event) {
    event.target ||= this;
    for (const listener of [...(this.events[event.type] || [])].sort((a,b) => Number(b.capture)-Number(a.capture))) {
      listener.fn(event); if (event.stopped) return;
    }
    if (event.bubbles && this.parent) this.parent.dispatchEvent(event);
  }
  click() { this.dispatchEvent(new FakeEvent('click', {bubbles:true})); }
  setAttribute(name,value) { this.attrs[name]=value; }
  removeAttribute(name) { delete this.attrs[name]; }
  focus() { this.focused=true; }
  scrollIntoView() {}
  closest(selector) { return selector === '[data-sb-example]' && this.dataset.sbExample || selector === '[data-sn-example]' && this.dataset.snExample ? this : null; }
}
function environment(type) {
  const doc=new Node('document');
  doc.body={dataset:{calc:type}};
  const box=new Node('calculadora',doc), button=new Node('button',box), reset=new Node('reset',box);
  const elements={calculadora:box};
  const html=read('calculadoras/'+type+'.html');
  for (const m of html.matchAll(/<(?:input|select|p|div)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    if (m[1] === 'calculadora') continue;
    const el=elements[m[1]]=new Node(m[1],box);
    el.value=m[0].match(/\bvalue="([^"]*)"/)?.[1] || '';
    if (m[0].startsWith('<select')) el.value='mensual';
  }
  doc.getElementById=id => elements[id];
  doc.querySelector=box.querySelector=selector => selector === '.calc-button' ? button : selector === '[data-form-reset]' ? reset : null;
  let rows;
  const context={document:doc, Event:FakeEvent, matchMedia:()=>({matches:true}), Intl,
    val:id=>Number(elements[id].value), money:n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n),
    showRows:value=>{rows=value; elements.resultado.textContent=JSON.stringify(value); elements.resultado.dataset.ready='true';}};
  vm.createContext(context);
  vm.runInContext(read('assets/js/calculators.js'),context);
  vm.runInContext(read(type === 'salario-bruto' ? 'assets/js/salario-bruto-focus.js' : 'assets/js/salario-neto-receipt.js'),context);
  doc.dispatchEvent(new FakeEvent('DOMContentLoaded'));
  const set=values => { for(const [id,value] of Object.entries(values)) { elements[id].value=String(value); elements[id].dispatchEvent(new FakeEvent('input',{bubbles:true})); } };
  const example=value=>{const el=new Node('example',doc); el.dataset[type==='salario-bruto'?'sbExample':'snExample']=value; el.click();};
  return {elements, button, reset, set, example, rows:()=>rows, html};
}
const gross=environment('salario-bruto');
for (const m of gross.html.matchAll(/data-sb-example="([^"]+)"/g)) {
  const [period,net,deductions]=m[1].split(',');
  gross.example(m[1]);
  const expected=Number(net)+Number(deductions);
  assert.equal(gross.rows().at(-1).value,new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(expected));
  assert.equal(gross.elements.sbPeriodo.value,period);
  assert(gross.elements.sbPeriodResult.textContent.includes(period));
  assert.equal(gross.elements.sbPeriodResult.hidden,false);
  reports.push({case:'gross example',input:{period,net:Number(net),deductions:Number(deductions)},expected,result:expected,status:'PASS'});
}
for (const [net,deductions] of [['',0],[0,0],[-1,0],[100,-1],[100,''],[100,'NaN']]) {
  gross.set({neto:net,deducciones:deductions}); gross.button.click();
  assert(gross.elements.resultado.textContent.includes('Introduce un neto'));
  assert.equal(gross.elements.resultado.dataset.ready,undefined);
  reports.push({case:'gross invalid',input:{net,deductions},expected:'rejected',result:'rejected',status:'PASS'});
}
gross.set({neto:15000,deducciones:0});gross.button.click();
assert(gross.rows().at(-1).value.includes('15,000.00'));
gross.set({neto:15001});assert.equal(gross.elements.resultado.dataset.ready,undefined);
assert(gross.elements.resultado.textContent.includes('actualizar'));
gross.button.click();gross.elements.sbPeriodo.value='quincenal';gross.elements.sbPeriodo.dispatchEvent(new FakeEvent('change'));
assert.equal(gross.elements.resultado.dataset.ready,undefined);
gross.button.click();gross.reset.click();assert.equal(gross.elements.resultado.dataset.ready,undefined);
reports.push({case:'gross zero deductions, edited amount, changed period, reset',status:'PASS'});
const net=environment('salario-neto');
for (const m of net.html.matchAll(/data-sn-example="([^"]+)"/g)) {
  const [period,g,t,s,o]=m[1].split(',');
  net.elements.snDeposito.value='999';net.example(m[1]);
  const expected=Number(g)-Number(t)-Number(s)-Number(o);
  assert.equal(net.rows().at(-1).value,new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(expected));
  assert.equal(net.elements.snPeriodo.value,period);
  assert.equal(net.elements.snDeposito.value,'');
  reports.push({case:'net example',input:{period,gross:Number(g),tax:Number(t),social:Number(s),other:Number(o)},expected,result:expected,status:'PASS'});
}
net.set({salario:20000,isrManual:2500,imss:500,otras:0,snDeposito:17000});net.button.click();
assert(net.elements.snReceiptCheck.textContent.includes('coincide'));
net.set({snDeposito:16800});net.button.click();assert(net.elements.snReceiptCheck.textContent.includes('$200.00 menor'));
net.set({isrManual:25000});net.button.click();assert(net.elements.resultado.textContent.includes('superan'));
net.set({isrManual:-1});net.button.click();assert(net.elements.resultado.textContent.includes('Revisa'));
reports.push({case:'net receipt match, receipt -200, excess and negative deductions',status:'PASS'});
fs.writeFileSync(path.join(__dirname,'qa-salarios.json'), JSON.stringify({method:'Node VM with lightweight DOM and shared calculators.js; static HTML. Browser QA remains separate.',reports},null,2));
console.log(JSON.stringify({status:'PASS',checks:reports.length,pages:reports.slice(0,3)},null,2));
