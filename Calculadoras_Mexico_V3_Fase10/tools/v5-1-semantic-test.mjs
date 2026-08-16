import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const errors = [];
const priority = ['isr','salario-neto','finiquito','liquidacion','aguinaldo','vacaciones','iva','horas-extra','salario-bruto','prima-vacacional'];

const home = read('index.html');
for (const token of ['Calculadoras México: herramientas fiscales, laborales y financieras','class="section semantic-hub"','class="authority-grid"','class="method-grid"','home-faq','"@type":"FAQPage"']) {
  if (!home.includes(token)) errors.push(`Home: falta ${token}`);
}
for (const category of ['Nómina','Prestaciones','Impuestos','Finanzas','Créditos','Negocios']) {
  if (!home.includes(`categoria=${encodeURIComponent(category)}`)) errors.push(`Home: falta cluster ${category}`);
}

const catalog = read('calculadoras.html');
if (!catalog.includes('class="catalog-hubs"')) errors.push('Catálogo: faltan hubs temáticos');
const about = read('acerca-de.html');
for (const token of ['class="content-box methodology-page"','Cómo construimos una calculadora','Fuentes y actualización','Qué significa “estimación”']) {
  if (!about.includes(token)) errors.push(`Metodología: falta ${token}`);
}
const common = read('assets/js/common.js');
for (const token of ["get('categoria')", "url.searchParams.set('categoria', category)", "button.dataset.catalogCategory === category"]) {
  if (!common.includes(token)) errors.push(`Filtros: falta ${token}`);
}

for (const slug of priority) {
  const html = read(`calculadoras/${slug}.html`);
  const block = html.match(/<section class="content-box search-cases">[\s\S]*?<\/section>/)?.[0] || '';
  if (!block) errors.push(`${slug}: falta tabla long-tail`);
  if ((block.match(/<tr>/g)||[]).length < 4) errors.push(`${slug}: tabla insuficiente`);
  if (!html.includes('styles.css?v=5.1.0') || !html.includes('common.js?v=5.1.0')) errors.push(`${slug}: versión de recursos incorrecta`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('V5.1 test passed: Home hub, 6 clusters, filtros enlazables y 10 tablas long-tail.');
