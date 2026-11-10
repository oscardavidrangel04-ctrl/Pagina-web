'use strict';
// Execute the shipped example loader, shared-link loader and real calculator.
// Minimal event/document adapter only: this does not test layout or a browser DOM.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const common = read('assets/js/common.js');
const exampleLoader = common.slice(common.indexOf('function loadCalculatorExample('), common.indexOf("document.addEventListener('DOMContentLoaded'", common.indexOf('function loadCalculatorExample(')));
const linkLoader = common.slice(common.indexOf('function loadCalculatorForm('), common.indexOf('function resetCalculatorForm('));
const decode = s => s.replaceAll('&quot;', '"').replaceAll('&amp;', '&');
const report = {status: 'RUNNING', conditions: 'Actual handlers in a minimal event adapter, not a browser test.', examples: [], links: []};

function run(type, inputs, mode) {
  let click, rows, focused = 0;
  const controls = Object.entries(inputs).map(([id]) => ({
    id, value: '', tagName: 'INPUT', dataset: {},
    dispatchEvent() {}, addEventListener() {}
  }));
  const button = {addEventListener: (e, fn) => {if (e === 'click') click = fn;}, click: () => click()};
  const document = {
    body: {dataset: {calc: type}},
    addEventListener: (e, fn) => {if (e === 'DOMContentLoaded') fn();},
    getElementById: id => controls.find(c => c.id === id),
    querySelector: selector => selector === '.calc-button' ? button : selector === '.result' ? {focus: () => focused++, scrollIntoView() {}} : null
  };
  const ctx = vm.createContext({
    document, calculatorControls: () => controls,
    val: id => Number(document.getElementById(id).value),
    money: n => new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(n),
    showRows: value => {rows = value;},
    matchMedia: () => ({matches: true}), Event: class {constructor(type) {this.type = type;}},
    URLSearchParams, location: {search: '?' + new URLSearchParams(inputs)}, readStore: () => ({}),
    setTimeout: fn => fn(), console
  });
  vm.runInContext(read('assets/js/calculators.js'), ctx);
  if (mode === 'example') {
    vm.runInContext(exampleLoader, ctx);
    ctx.loadCalculatorExample({dataset: {calcExample: JSON.stringify(inputs)}});
    assert.equal(focused, 1);
  } else {
    vm.runInContext(linkLoader, ctx);
    ctx.loadCalculatorForm();
  }
  for (const control of controls) assert.equal(control.value, String(inputs[control.id]));
  assert.ok(rows, 'Expected calculation after loading inputs');
  return JSON.parse(JSON.stringify(rows));
}

try {
  const page = read('calculadoras/prima-vacacional.html');
  const payloads = [...page.matchAll(/data-calc-example="([^"]+)"/g)].map(m => JSON.parse(decode(m[1])));
  assert.deepEqual(payloads, [
    {salarioDiario: 480, dias: 12, prima: 25},
    {salarioDiario: 500, dias: 12, prima: 50},
    {salarioDiario: 600, dias: 14, prima: 25}
  ]);
  const expected = ['$1,440.00', '$3,000.00', '$2,100.00'];
  payloads.forEach((inputs, i) => {
    const rows = run('prima-vacacional', inputs, 'example');
    assert.equal(rows.find(r => r.label === 'Prima vacacional').value, expected[i]);
    report.examples.push({inputs, result: expected[i]});
  });
  for (const file of ['articulos/como-calcular-prima-vacacional.html', 'fallback-como-calcular-prima-vacacional.html']) {
    const links = [...read(file).matchAll(/href="(\/calculadoras\/prima-vacacional\.html\?[^"]+)"/g)].map(m => decode(m[1]));
    assert.equal(links.length, 2);
    links.forEach((link, i) => {
      const inputs = Object.fromEntries(new URL(link, 'https://example.test').searchParams);
      const rows = run('prima-vacacional', inputs, 'link');
      assert.equal(rows.find(r => r.label === 'Prima vacacional').value, expected[i]);
      report.links.push({file, link, result: expected[i]});
    });
  }
  const afore = read('articulos/aportaciones-voluntarias-afore.html');
  const link = decode(afore.match(/href="(\/calculadoras\/ahorro-mensual\.html\?[^"]+)"/)[1]);
  const inputs = Object.fromEntries(new URL(link, 'https://example.test').searchParams);
  assert.equal(run('ahorro-mensual', inputs, 'link').find(r => r.label === 'Ahorro acumulado').value, '$6,000.00');
  report.links.push({file: 'articulos/aportaciones-voluntarias-afore.html', link, result: '$6,000.00'});
  report.status = 'PASS';
} catch (error) {
  report.status = 'FAIL'; report.error = error.stack; process.exitCode = 1;
}
fs.writeFileSync(path.join(root, 'docs/seo-semrush-2026-11-10/validation-examples.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
