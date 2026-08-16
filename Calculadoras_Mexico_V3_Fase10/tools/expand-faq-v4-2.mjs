import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'calculadoras');
const priority = new Set(['isr','salario-neto','aguinaldo','vacaciones','finiquito','liquidacion','iva','horas-extra','prima-vacacional','prestamo']);
const esc = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

for (const name of fs.readdirSync(dir).filter(name => name.endsWith('.html'))) {
  const slug = name.replace(/\.html$/,'');
  if (priority.has(slug)) continue;
  const file = path.join(dir, name);
  let html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<h1>([^<]+)<\/h1>/)?.[1] || 'esta calculadora';
  const extras = [
    [`¿Cómo puedo comprobar el resultado de ${title}?`, 'Revisa los datos de entrada, las unidades o el periodo y después contrasta las filas del desglose. También puedes cambiar un solo dato y volver a calcular para comprobar cómo afecta al resultado.'],
    [`¿Puedo comparar dos escenarios en ${title}?`, 'Sí. Guarda el primer escenario, modifica los datos y calcula de nuevo. Cuando ambos resultados son comparables, la página muestra la diferencia entre el escenario guardado y el actual.'],
    [`¿Puedo compartir un cálculo de ${title}?`, 'Sí. La opción de compartir genera un enlace con los datos del formulario para recrear el escenario. La persona que lo abra puede revisar y volver a calcular desde su propio navegador.']
  ];
  const section = html.match(/<section class="content-box faq-section">[\s\S]*?<\/section>/)?.[0];
  if (!section) throw new Error(`FAQ visible no encontrada: ${name}`);
  html = html.replace(section, section.replace('</section>', `${extras.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`));

  const faqMatch = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?)<\/script>/);
  if (!faqMatch) throw new Error(`FAQ JSON-LD no encontrado: ${name}`);
  const faq = JSON.parse(faqMatch[1]);
  for (const [q,a] of extras) faq.mainEntity.push({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}});
  html = html.replace(faqMatch[0], `<script type="application/ld+json">${JSON.stringify(faq)}</script>`);
  fs.writeFileSync(file, html);
}

console.log('Expanded the remaining 40 calculators to 8 FAQs each. Sitemap intentionally untouched.');
