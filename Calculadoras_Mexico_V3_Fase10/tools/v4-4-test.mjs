import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const calculatorDir = path.join(root, 'calculadoras');
const articleDir = path.join(root, 'articulos');
const calculators = fs.readdirSync(calculatorDir).filter(file => file.endsWith('.html'));
const articles = fs.readdirSync(articleDir).filter(file => file.endsWith('.html'));
const errors = [];

for (const file of calculators) {
  const html = fs.readFileSync(path.join(calculatorDir, file), 'utf8');
  if (!html.includes('class="trust-record"')) errors.push(`${file}: falta ficha de confianza`);
  if (!html.includes('9 de agosto de 2026')) errors.push(`${file}: fecha editorial desactualizada`);
  if (!html.includes('common.js?v=5.1.0')) errors.push(`${file}: recursos sin versión 5.1.0`);
}
for (const slug of ['isr','finiquito','liquidacion']) {
  const html = fs.readFileSync(path.join(calculatorDir, `${slug}.html`), 'utf8');
  if (!html.includes('class="intent-guide"')) errors.push(`${slug}: falta guía de intención de búsqueda`);
}
for (const file of articles) {
  const html = fs.readFileSync(path.join(articleDir, file), 'utf8');
  if (!html.includes('class="article-authority"')) errors.push(`${file}: falta revisión editorial`);
  if (!html.includes('class="article-next"')) errors.push(`${file}: falta ruta de conversión`);
  if (!html.includes('"dateModified":"2026-08-09"')) errors.push(`${file}: schema dateModified incorrecto`);
}
const common = fs.readFileSync(path.join(root, 'assets/js/common.js'), 'utf8');
if (!common.includes('% de diferencia')) errors.push('Comparador sin diferencia porcentual');
if (errors.length) {
  console.error(`V4.4 test failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`V4.4 test passed: ${calculators.length} trust records, 3 intent guides and ${articles.length} article conversion paths.`);
