import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const values = new Map();
const controls = [{id: 'salario', value: '20000'}, {id: 'periodo', value: 'mensual'}];
const context = vm.createContext({
  Intl,
  Number,
  String,
  Date,
  URL,
  URLSearchParams,
  location: {href: 'https://example.com/calculadoras/isr.html'},
  window: {addEventListener() {}},
  document: {
    body: {dataset: {calc: 'isr'}},
    addEventListener() {},
    querySelectorAll(selector) { return selector.includes('.calc-box') ? controls : []; }
  },
  localStorage: {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, value); }
  }
});
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/common.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/catalog.js'), 'utf8'), context);

const rows = [
  {label: 'Ingreso bruto', value: '$20,000.00'},
  {label: 'ISR estimado', value: '$2,383.65'},
  {label: 'Neto estimado', value: '$17,616.35', total: true}
];
const chart = vm.runInContext(`chartMarkup(${JSON.stringify(rows)})`, context);
if (!chart.includes('ISR estimado') || !chart.includes('Neto estimado')) throw new Error('ISR chart was not generated');

values.set('cm-scenario-isr', JSON.stringify({
  primary: {label: 'Neto estimado', value: '$16,000.00', number: 16000},
  rows,
  at: Date.now()
}));
const comparison = vm.runInContext(`comparisonMarkup(${JSON.stringify(rows)})`, context);
if (!comparison.includes('$1,616.35') || !comparison.includes('Resultado actual')) throw new Error('Scenario comparison was not generated');

const shared = vm.runInContext('scenarioUrl()', context);
if (!shared.includes('salario=20000') || !shared.includes('periodo=mensual')) throw new Error('Shareable scenario URL was not generated');

const related = vm.runInContext("relatedCalculators('isr', 4)", context);
if (related.length !== 4 || related.some(item => item.slug === 'isr')) throw new Error('Related calculators were not generated correctly');
const trending = vm.runInContext('trendingCalculators(8)', context);
if (trending.length !== 8) throw new Error('Trending calculators were not generated correctly');
const recommended = vm.runInContext('recommendedCalculators(8)', context);
if (recommended.length !== 8) throw new Error('Recommended calculators were not generated correctly');

console.log('Feature test passed: charts, scenarios, related, trending and recommended calculators.');
