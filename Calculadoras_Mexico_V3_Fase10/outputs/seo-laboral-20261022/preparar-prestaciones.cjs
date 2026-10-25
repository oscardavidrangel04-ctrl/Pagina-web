const fs = require('fs');
const path = require('path');
const pages = ['finiquito', 'liquidacion', 'vacaciones', 'prima-vacacional'];
const faq = {
  finiquito: [
    ['¿Cuánto me toca de finiquito por renuncia?', 'Depende del salario y de los conceptos que aún no se han pagado. Captura los días de sueldo y vacaciones pendientes, los días del año considerados para aguinaldo y tu prima vacacional. No vuelvas a sumar prestaciones ya cubiertas.'],
    ['¿Qué incluye el finiquito de esta calculadora?', 'Incluye sueldo pendiente, aguinaldo proporcional, vacaciones pendientes y su prima vacacional. El resultado desglosa cada concepto antes del total para compararlo con tu recibo. No agrega automáticamente comisiones, bonos, PTU ni otras prestaciones contractuales.'],
    ['¿Finiquito y liquidación son iguales? ¿Incluye tres meses de sueldo?', 'Son conceptos distintos. El finiquito reúne cantidades devengadas pendientes. Los tres meses y otras indemnizaciones dependen de la causa y del supuesto aplicable; esta calculadora no los suma. Revisa por separado una posible liquidación.'],
    ['¿Incluye ISR o prima de antigüedad?', 'No. El resultado es bruto, antes de retenciones, y no calcula prima de antigüedad. La procedencia de esta última requiere revisar las condiciones de la separación y los requisitos legales.'],
    ['¿Los días trabajados del año son mi antigüedad total?', 'No. Este campo sirve únicamente para prorratear el aguinaldo del año: captura entre 0 y 365 días. Haber trabajado uno o varios años no determina por sí solo el finiquito; los años cumplidos influyen en el derecho a vacaciones, cuyo saldo pendiente debes capturar por separado.'],
    ['¿Qué documentos conviene comparar con el resultado?', 'Revisa contrato, recibos, fecha de salida, salario diario y desglose del empleador. Comprueba los días pendientes, las prestaciones superiores y los pagos previos. Si el resultado difiere de la propuesta, identifica primero en qué concepto está la diferencia.']
  ],
  liquidacion: [
    ['¿Toda separación laboral genera liquidación?', 'No. La causa de terminación y las circunstancias determinan los conceptos procedentes. Esta herramienta simula importes; no determina por sí sola si existe derecho a una indemnización.'],
    ['¿Cómo se calcula una liquidación por despido en esta herramienta?', 'La simulación multiplica el salario diario capturado por 90, agrega sueldo pendiente y, solo si eliges incluirlos, suma 20 días por cada año capturado. No calcula prestaciones proporcionales, prima de antigüedad, salarios vencidos, intereses ni ISR.'],
    ['¿Siempre corresponden 20 días por año?', 'No. Su procedencia depende del supuesto legal, por lo que la opción inicia en No. Selecciona Sí únicamente para explorar ese escenario cuando corresponda; un dato guardado o un enlace compartido puede recuperar una selección anterior.'],
    ['¿La liquidación incluye finiquito?', 'Esta simulación solo incorpora los campos visibles. Calcula por separado aguinaldo, vacaciones y prima vacacional pendientes en la herramienta de finiquito, evitando sumar dos veces los días de sueldo pendiente.'],
    ['¿Qué salario debo capturar? ¿La calculadora obtiene el integrado?', 'El campo solicita salario diario en pesos, no salario mensual. La herramienta no integra prestaciones ni determina la base legal: confirma la base indemnizatoria aplicable a tu caso antes de capturarla.'],
    ['¿Puedo usar el resultado para firmar un convenio?', 'Úsalo como referencia para revisar un desglose, no como única base para aceptar o firmar. Contrasta causa de separación, antigüedad, salario, prestaciones y deducciones con los documentos y la orientación laboral correspondiente.']
  ],
  vacaciones: [
    ['¿Cuántos días de vacaciones corresponden el primer año?', 'Después del primer año de servicios, la referencia mínima general es de 12 días laborables. Captura años cumplidos; esta herramienta usa la tabla mínima, que no reemplaza días superiores reconocidos por contrato.'],
    ['¿Cuántos días corresponden de 6 a 10 años?', 'La tabla mínima asigna 22 días al bloque de 6 a 10 años cumplidos. De 11 a 15 años son 24; después aumenta dos días por cada nuevo bloque de cinco años.'],
    ['¿Vacaciones y prima vacacional son lo mismo?', 'No. Las vacaciones son descanso con salario; la prima es un importe adicional sobre el salario del periodo vacacional. La referencia total suma pago base y prima: no significa que ambos importes sean dinero extra sobre el sueldo habitual.'],
    ['¿La prima mínima es 25%? ¿Puedo usar una mayor?', 'La referencia mínima de la prima vacacional es 25%. Puedes capturar un porcentaje superior si así lo reconoce tu contrato o prestación. La calculadora aplica ese porcentaje al salario de los días de vacaciones.'],
    ['¿Qué pasa si no cumplí el año completo?', 'Esta tabla trabaja con años completos. Para revisar el saldo generado en un periodo incompleto, especialmente al terminar la relación laboral, usa vacaciones proporcionales con los días trabajados y el derecho anual aplicable.'],
    ['¿El resultado es un recibo oficial o un importe neto?', 'No. Es una estimación bruta sin ISR ni deducciones. Compara salario, años cumplidos, días y porcentaje de prima con tu contrato y recibo de nómina.']
  ],
  'prima-vacacional': [
    ['¿Cuál es la fórmula para calcular la prima vacacional?', 'Multiplica salario diario por días de vacaciones y por el porcentaje de prima dividido entre 100. Por ejemplo, $500 diarios × 12 días × 25% = $1,500 de prima.'],
    ['¿La prima se calcula sobre el salario mensual completo?', 'La base es el salario de los días de vacaciones capturados. No se aplica al mes completo, salvo que el periodo considerado sea de 30 días. Si tienes salario mensual fijo, la referencia diaria de esta herramienta es salario mensual dividido entre 30.'],
    ['¿Cuál es el mínimo y puedo usar un porcentaje mayor?', 'La prima vacacional mínima de referencia es 25%. Puedes ingresar un porcentaje mayor cuando tus condiciones laborales reconozcan una prestación superior.'],
    ['¿La prima vacacional sustituye el pago de vacaciones?', 'No. La prima es adicional al salario del periodo vacacional. La calculadora muestra el pago base por separado y destaca únicamente la prima como resultado principal.'],
    ['¿Qué días de vacaciones debo capturar?', 'Captura los días del periodo que quieres calcular, según tu antigüedad, contrato y saldo. Para periodos incompletos revisa primero los días proporcionales; no vuelvas a incluir días o primas ya pagados.'],
    ['¿El resultado de prima vacacional es antes de impuestos?', 'Sí. El importe es bruto: la calculadora no resta ISR ni otras deducciones. Compara la prima bruta y las retenciones por separado con tu recibo.']
  ]
};
const labels = {finiquito:'finiquito', liquidacion:'liquidación laboral', vacaciones:'vacaciones', 'prima-vacacional':'prima vacacional'};
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const anchors = s => [...s.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
let patch = '*** Begin Patch\n';
const results = [];
for (const name of pages) {
  const file = 'calculadoras/' + name + '.html';
  const original = fs.readFileSync(file,'utf8');
  const backup = 'outputs/seo-laboral-20261022/antes/' + file;
  fs.mkdirSync(path.dirname(backup), {recursive:true});
  if (!fs.existsSync(backup)) fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
  let s = original;
  // The shared interface's capture handler already enforces native constraints.
  s = s.replace(/<input\b[^>]*type="number"[^>]*>/g, tag => tag.replace('<input ', '<input required '));
  s = s.replace(/(<input\b[^>]*id="prima"[^>]*min=")0"/g,'$125"');
  s = s.replace(/(<input\b[^>]*id="diasAguinaldo"[^>]*min=")0"/g,'$115"');
  if (name === 'finiquito') {
    s = s.replace('Días trabajados del año</label>','Días del año para aguinaldo</label>');
    s = s.replace(/(<input\b[^>]*id="diasAnio")/, '$1 aria-describedby="diasAnio-ayuda" max="365"');
    s = s.replace(/(<input\b[^>]*id="diasAnio"[^>]*>)/, '$1<small id="diasAnio-ayuda">De 0 a 365 días del año que corresponden al aguinaldo pendiente; no es tu antigüedad total en la empresa.</small>');
    s = s.replace('Introduce tu salario y las fechas que pide la herramienta.','Introduce tu salario mensual, los días de sueldo pendientes y los días del año para aguinaldo.');
    s = s.replace(/<td>\$(90|180|270|365)\.00<\/td>/g,'<td>$1 días</td>');
    s = s.replace('Estas referencias permiten comparar escenarios frecuentes antes de utilizar tus propios datos.','Compara días del año considerados para aguinaldo, no años de antigüedad. Los demás datos permanecen fijos.');
  }
  if (name === 'liquidacion') {
    s = s.replace('<select id="incluir20"><option value="si">Sí</option><option value="no">No</option></select>', '<select id="incluir20" aria-describedby="incluir20-ayuda"><option value="no" selected>No</option><option value="si">Sí, simular cuando corresponda</option></select><small id="incluir20-ayuda">No es un pago automático por cualquier despido. La opción inicia en No; verifica el supuesto aplicable antes de incluirlo.</small>');
    s = s.replace('Tres meses son $36,000 y 20 días por año agregan $8,000: total de referencia $44,000.','Tres meses son $36,000; si activas 20 días por año, agrega $8,000: total de referencia $44,000.');
  }
  if (name === 'vacaciones') s = s.replace(/<td>\$(12|14|20|22)\.00<\/td>/g,'<td>$1 días</td>');
  // Keep one useful answer per intent and use precisely the same text in JSON-LD.
  const faqSection = '<section class="content-box faq-section" id="preguntas-frecuentes"><h2>Preguntas frecuentes sobre '+labels[name]+'</h2>' + faq[name].map(([q,a])=>'<details><summary>'+escape(q)+'</summary><p>'+escape(a)+'</p></details>').join('') + '</section>';
  s = s.replace(/<section class="content-box faq-section">[\s\S]*?<\/section>/,faqSection);
  s = s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(tag,json)=>{
    const data = JSON.parse(json);
    if (data['@type'] === 'FAQPage') return '<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq[name].map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))})+'</script>';
    if (data['@graph']) for (const entity of data['@graph']) if (entity['@type']==='WebPage') entity.dateModified='2026-10-24';
    return '<script type="application/ld+json">'+JSON.stringify(data)+'</script>';
  });
  s = s.replace(/(?:15 de agosto|30 de septiembre|21 de septiembre|1 de octubre) de 2026/g,'24 de octubre de 2026');
  // These short repeated answer grids repeat the FAQ or the explanation above.
  s = s.replace(/<section class="(?:intent-guide|content-box cluster-quick-answers)">[\s\S]*?<\/section>/g,'');
  // Consolidate only navigation sections; preserve the explanatory sections and all destinations.
  const removed = [];
  s = s.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g,section=>{
    const opening = section.slice(0,section.indexOf('>')+1);
    const heading = section.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1] || '';
    const navigation = /topic-hub|related-tools|v5621-cluster|portal-related|internal-hub-v56|aguinaldo-context|data-cluster="(?:v590|v512-internal-links|semrush-laboral-2026)"/.test(opening)
      || ['Herramientas laborales relacionadas','Guías relacionadas basadas en búsquedas reales','Dudas frecuentes sobre prima vacacional'].includes(heading);
    if (!navigation) return section;
    removed.push(section); return '';
  });
  const remaining = new Set(anchors(s).map(m=>m[1]));
  const links = new Map();
  for (const section of removed) for (const m of anchors(section)) {
    if (remaining.has(m[1]) || links.has(m[1])) continue;
    const primary = m[2].match(/<(?:strong|span)\b[^>]*>([\s\S]*?)<\/(?:strong|span)>/)?.[1] || m[2];
    let label = primary.replace(/<[^>]*>/g,'').replace(/(?:Consultar|Abrir calculadora|Abrir herramienta o guía)\s*→?/g,'').replace(/→/g,'').trim();
    if (!label) label = m[1].split('/').at(-1).split('.')[0].replaceAll('-',' ');
    links.set(m[1], label);
  }
  const groups = [
    ['Calculadoras para completar el resultado', ([href])=>href.startsWith('/calculadoras/')],
    ['Guías para revisar tu caso', ([href])=>!href.startsWith('/calculadoras/') && !href.includes('aguinaldo')],
    ['Aguinaldo y prestaciones del año', ([href])=>!href.startsWith('/calculadoras/') && href.includes('aguinaldo')]
  ];
  const resources = '<section class="content-box related-tools" id="recursos-relacionados"><h2>Recursos relacionados con '+labels[name]+'</h2>'+groups.map(([heading,filter])=>{
    const items = [...links].filter(filter); return items.length ? '<h3>'+heading+'</h3><ul>'+items.map(([href,label])=>'<li><a href="'+href+'">'+label+'</a></li>').join('')+'</ul>' : '';
  }).join('')+'</section>';
  s = s.replace(faqSection,faqSection+resources);
  const before = new Set(anchors(original).map(m=>m[1]));
  const after = new Set(anchors(s).map(m=>m[1]));
  const missing = [...before].filter(h=>!after.has(h));
  if (missing.length) throw new Error(name+' lost destinations: '+missing.join(', '));
  // Break top-level sections into reviewable lines without changing DOM content.
  s = s.replace(/(?=<section\b|<script\b|<footer\b)/g,'\n');
  patch += '*** Update File: '+file+'\n@@\n'+original.trimEnd().split(/\r?\n/).map(l=>'-'+l).join('\n')+'\n'+s.trimEnd().split(/\r?\n/).map(l=>'+'+l).join('\n')+'\n';
  results.push({page:name,faq:faq[name].length,removedNavigationSections:removed.length,uniqueDestinationsBefore:before.size,uniqueDestinationsAfter:after.size});
}
patch += '*** End Patch\n';
process.stdout.write(JSON.stringify({patch,results}));
