import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const common = fs.readFileSync(path.join(root, 'assets/js/common.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/styles.css'), 'utf8');
const calculators = fs.readFileSync(path.join(root, 'assets/js/calculators.js'), 'utf8');
const priority = ['isr','salario-neto','aguinaldo','vacaciones','finiquito','liquidacion','iva','horas-extra','prima-vacacional','prestamo'];
const errors = [];

for (const token of ['CM_RESULT_INSIGHTS','resultInsightMarkup','CM_STEP_LABELS','stepByStepMarkup','CM_QUICK_SIMULATIONS','data-quick-sim','Escenario actualizado','Imprimir / PDF']) {
  if (!common.includes(token)) errors.push(`Falta la función V4.3: ${token}`);
}
for (const className of ['.result-heading','.result-insight','.result-steps','.quick-simulations','.simulation-buttons']) {
  if (!css.includes(className)) errors.push(`Falta estilo V4.3: ${className}`);
}
for (const slug of priority) {
  if (!common.includes(`${slug}:`) && !common.includes(`'${slug}':`)) errors.push(`Sin experiencia V4.3 para ${slug}`);
  const html = fs.readFileSync(path.join(root, 'calculadoras', `${slug}.html`), 'utf8');
  if (!html.includes(`data-calc="${slug}"`)) errors.push(`Slug incorrecto en ${slug}.html`);
  if (!html.includes('common.js?v=5.1.0')) errors.push(`Assets sin versión 5.1.0 en ${slug}.html`);
}
for (const token of ['Tasa marginal','Tasa efectiva estimada','Neto estimado']) {
  if (!calculators.includes(token)) errors.push(`ISR sin desglose profesional: ${token}`);
}

if (errors.length) {
  console.error(`V4.3 test failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('V4.3 test passed: 10 priority calculators have intelligent results, steps, simulations and responsive UI.');
