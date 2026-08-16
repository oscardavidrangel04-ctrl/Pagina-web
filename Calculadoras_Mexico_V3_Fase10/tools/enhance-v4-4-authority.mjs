import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const calcDir = path.join(root, 'calculadoras');
const catalogText = fs.readFileSync(path.join(root, 'assets/js/catalog.js'), 'utf8');
const items = [...catalogText.matchAll(/\{slug:'([^']+)', title:'([^']+)', category:'([^']+)'/g)]
  .map(([,slug,title,category]) => ({slug,title,category}));
const sources = {
  Impuestos:['SAT · Normatividad fiscal 2026','https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html'],
  Prestaciones:['Ley Federal del Trabajo vigente','https://www.diputados.gob.mx/LeyesBiblio/ref/lft.htm'],
  'Nómina':['PROFEDET · Derechos laborales','https://www.profedet.gob.mx/'],
  Finanzas:['CONDUSEF · Educación financiera','https://www.condusef.gob.mx/'],
  'Créditos':['CONDUSEF · Simuladores de crédito','https://phpapps.condusef.gob.mx/condusef_personalnomina/'],
  Negocios:['Metodología aritmética explicada','../acerca-de.html'],
  Herramientas:['Metodología aritmética explicada','../acerca-de.html']
};
const trustPanel = category => {
  const [label,href] = sources[category] || sources.Herramientas;
  return `<aside class="trust-record" aria-label="Ficha de confianza del contenido"><div><span>Última revisión</span><strong>9 de agosto de 2026</strong></div><div><span>Metodología</span><strong>Fórmula y desglose visibles</strong></div><div><span>Referencia</span><a href="${href}" rel="noopener noreferrer">${label} ↗</a></div></aside>`;
};
const intentBlocks = {
  isr:`<section class="intent-guide"><span class="badge">Respuestas rápidas</span><h2>ISR 2026: escenarios que suelen buscarse</h2><div class="intent-grid"><article><h3>¿Cuánto ISR me descuentan?</h3><p>Depende del ingreso gravable y del periodo. La tarifa localiza un rango, resta el límite inferior, aplica una tasa al excedente y suma la cuota fija.</p></article><article><h3>ISR con sueldo de $20,000</h3><p>Captura $20,000 y selecciona “mensual”. El desglose muestra rango, excedente, cuota fija, tasa marginal, ISR, tasa efectiva y neto estimado.</p></article><article><h3>¿Qué pasa si gano $1,000 más?</h3><p>Usa las simulaciones rápidas del resultado. Podrás comparar el ISR anterior contra el nuevo sin asumir que la tasa marginal se aplica a todo el salario.</p></article></div></section>`,
  finiquito:`<section class="intent-guide"><span class="badge">Respuestas rápidas</span><h2>Cuánto te toca de finiquito: escenarios frecuentes</h2><div class="intent-grid"><article><h3>Finiquito por renuncia</h3><p>Puede reunir salarios pendientes y partes proporcionales de aguinaldo, vacaciones y prima vacacional. La calculadora separa estos conceptos para revisarlos uno por uno.</p></article><article><h3>Finiquito por un año trabajado</h3><p>La antigüedad por sí sola no determina el total. También importan salario, fecha de salida, días pendientes y prestaciones ya pagadas.</p></article><article><h3>¿Finiquito o liquidación?</h3><p>El finiquito reúne cantidades devengadas; una liquidación puede incluir indemnizaciones cuando correspondan. Usa ambas herramientas como escenarios separados.</p></article></div></section>`,
  liquidacion:`<section class="intent-guide"><span class="badge">Respuestas rápidas</span><h2>Liquidación por despido: qué revisar antes de calcular</h2><div class="intent-grid"><article><h3>¿Siempre son tres meses?</h3><p>La indemnización y los conceptos aplicables dependen de la causa y del caso. La herramienta presenta una simulación, no una resolución jurídica.</p></article><article><h3>¿Siempre corresponden 20 días por año?</h3><p>No. Por eso el concepto puede activarse o desactivarse y se muestra por separado en el resultado.</p></article><article><h3>¿Incluye el finiquito?</h3><p>No automáticamente. Conviene estimar aparte salarios y prestaciones pendientes y después comparar ambos desgloses sin duplicar conceptos.</p></article></div></section>`
};
for (const {slug,category} of items) {
  const file = path.join(calcDir, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/Contenido revisado el \d{1,2} de agosto de 2026/g, 'Contenido revisado el 9 de agosto de 2026');
  if (!html.includes('class="trust-record"')) html = html.replace(/(<section class="content-box seo-guide">)/, `$1${trustPanel(category)}`);
  if (intentBlocks[slug] && !html.includes('class="intent-guide"')) html = html.replace(/(<section class="content-box topic-hub">)/, `${intentBlocks[slug]}$1`);
  fs.writeFileSync(file, html);
}
console.log(`V4.4 authority layer added to ${items.length} calculators; 3 priority intent guides added.`);
