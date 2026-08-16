import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const priority = ['isr','salario-neto','finiquito','liquidacion','aguinaldo','vacaciones','iva','horas-extra','salario-bruto','prima-vacacional'];
const errors = [];

for (const slug of priority) {
  const file = path.join(root, 'calculadoras', `${slug}.html`);
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="content-box premium-guide"')) errors.push(`${slug}: falta guía Premium`);
  const premium = html.match(/<section class="content-box premium-guide">[\s\S]*?<\/section>/)?.[0] || '';
  if ((premium.match(/<article>/g) || []).length < 3) errors.push(`${slug}: faltan tres ejemplos Premium`);
  if (!premium.includes('Metodología específica de esta calculadora')) errors.push(`${slug}: falta metodología específica`);
  if (!premium.includes('Continúa según tu resultado')) errors.push(`${slug}: faltan enlaces contextuales`);
  const faq = html.match(/\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/)?.[0] || '';
  if ((faq.match(/"@type":"Question"/g) || []).length < 10) errors.push(`${slug}: FAQ Schema insuficiente`);
  if (!html.includes('common.js?v=5.1.0')) errors.push(`${slug}: recursos sin versión V5`);
}

const common = fs.readFileSync(path.join(root, 'assets/js/common.js'), 'utf8');
for (const token of ['CM_NEXT_ACTIONS', "'salario-bruto': rows =>", "'salario-bruto': [", 'nextActionMarkup()']) {
  if (!common.includes(token)) errors.push(`common.js: falta ${token}`);
}

const calculators = fs.readFileSync(path.join(root, 'assets/js/calculators.js'), 'utf8');
const vacationFormula = 'years <= 5 ? 10 + years * 2 : 22 + Math.floor((years - 6) / 5) * 2';
if (!calculators.includes(vacationFormula)) errors.push('vacaciones: fórmula de antigüedad no corregida');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) errors.push('sitemap: namespace inválido');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('V5 Premium: 10 calculadoras, ejemplos, FAQ, resultados y fórmula de vacaciones verificados.');
