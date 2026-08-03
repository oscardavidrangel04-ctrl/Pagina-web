import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const catalogContext = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/catalog.js'), 'utf8'), catalogContext);
const catalog = vm.runInContext('globalThis.CM_CATALOG', catalogContext);
const calculatorSource = fs.readFileSync(path.join(root, 'assets/js/calculators.js'), 'utf8');
const tableSource = fs.readFileSync(path.join(root, 'assets/js/tablas.js'), 'utf8');

function attr(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? '';
}

function controlsFrom(html) {
  const controls = new Map();
  for (const match of html.matchAll(/<input\b[^>]*\bid="[^"]+"[^>]*>/g)) {
    const tag = match[0];
    const id = attr(tag, 'id');
    if (id && !tag.includes('class="global-search"')) controls.set(id, {id, value: attr(tag, 'value')});
  }
  for (const match of html.matchAll(/<select\b[^>]*\bid="[^"]+"[^>]*>([\s\S]*?)<\/select>/g)) {
    const tag = match[0];
    const id = attr(tag, 'id');
    const selected = match[1].match(/<option\b[^>]*selected[^>]*value="([^"]+)"/)?.[1]
      ?? match[1].match(/<option\b[^>]*value="([^"]+)"/)?.[1]
      ?? '';
    controls.set(id, {id, value: selected});
  }
  return controls;
}

const failures = [];
for (const item of catalog) {
  const html = fs.readFileSync(path.join(root, 'calculadoras', `${item.slug}.html`), 'utf8');
  const controls = controlsFrom(html);
  let click;
  let output;
  const button = {addEventListener(type, callback) { if (type === 'click') click = callback; }};
  const context = vm.createContext({
    Intl, Number, String, Date, Math,
    document: {
      body: {dataset: {calc: item.slug}},
      addEventListener(type, callback) { if (type === 'DOMContentLoaded') callback(); },
      querySelector(selector) { return selector === '.calc-button' ? button : null; },
      getElementById(id) { return controls.get(id) ?? null; }
    },
    val(id) { return Number(controls.get(id)?.value || 0); },
    money(value) { return new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(value) || 0); },
    showRows(rows, note = '') { output = {rows, note}; }
  });
  try {
    if (item.slug === 'isr') vm.runInContext(tableSource, context);
    vm.runInContext(calculatorSource, context);
    if (typeof click !== 'function') throw new Error('no conectó el botón Calcular');
    click();
    if (!output?.rows?.length) throw new Error('no produjo filas de resultado');
    if (output.rows.some(row => row.label === 'Revisa los datos')) throw new Error(output.rows[0].value);
    if (!output.rows.some(row => row.total)) throw new Error('no marcó un resultado principal');
  } catch (error) {
    failures.push(`${item.slug}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`Calculator regression failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`Calculator regression passed: ${catalog.length} calculators respond with their default values.`);
