import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => fs.writeFileSync(path.join(root, file), value);
const money = n => n.toLocaleString('es-MX', {style:'currency', currency:'MXN'});

const premium = [
  ['isr','ISR 2026','🧾','Calcula impuesto, tasa efectiva y neto por periodo.'],
  ['salario-neto','Salario neto','💵','Compara el sueldo bruto contra deducciones conocidas.'],
  ['finiquito','Finiquito','📄','Estima prestaciones pendientes al terminar una relación laboral.'],
  ['liquidacion','Liquidación laboral','⚖️','Simula conceptos frecuentes sin asumir que siempre proceden.'],
  ['aguinaldo','Aguinaldo','🎁','Calcula el importe completo o proporcional.'],
  ['vacaciones','Vacaciones','🏖️','Consulta días por antigüedad y prima vacacional.'],
  ['iva','IVA','🧮','Agrega, quita o separa el impuesto de un precio.'],
  ['horas-extra','Horas extra','⏱️','Estima pago doble y triple según los datos capturados.'],
  ['salario-bruto','Salario bruto','🧾','Reconstruye una referencia desde neto y deducciones.'],
  ['prima-vacacional','Prima vacacional','🏝️','Separa pago base y prima adicional.']
];

const premiumCards = premium.map(([slug,title,icon,description]) => `<article class="authority-tool"><span aria-hidden="true">${icon}</span><div><small>Calculadora Premium</small><h3>${title}</h3><p>${description}</p><a href="calculadoras/${slug}.html">Abrir ${title} →</a></div></article>`).join('');

const clusters = [
  ['Nómina y salario','Recibos, sueldo bruto, neto, pagos y jornadas.','Nómina',['salario-neto','salario-bruto','pago-quincenal','horas-extra']],
  ['Prestaciones laborales','Aguinaldo, vacaciones y terminación laboral.','Prestaciones',['aguinaldo','vacaciones','finiquito','liquidacion']],
  ['Impuestos','ISR, IVA y operaciones fiscales frecuentes.','Impuestos',['isr','iva','iva-incluido','retencion-iva']],
  ['Finanzas personales','Ahorro, rendimiento, préstamos y metas.','Finanzas',['prestamo','interes-compuesto','ahorro-mensual','cetes']],
  ['Créditos','Escenarios de automóvil, vivienda y mensualidades.','Créditos',['credito-automotriz','hipoteca','prestamo']],
  ['Negocios y herramientas','Precios, utilidad, costos y cálculos cotidianos.','Negocios',['margen-ganancia','precio-venta','punto-equilibrio','roi']]
];
const titleBySlug = new Map([
  ...premium.map(([slug,title])=>[slug,title]),
  ['pago-quincenal','Pago quincenal'],['iva-incluido','IVA incluido'],['retencion-iva','Retención de IVA'],
  ['prestamo','Préstamo'],['interes-compuesto','Interés compuesto'],['ahorro-mensual','Ahorro mensual'],['cetes','CETES'],
  ['credito-automotriz','Crédito automotriz'],['hipoteca','Hipoteca'],['margen-ganancia','Margen de ganancia'],
  ['precio-venta','Precio de venta'],['punto-equilibrio','Punto de equilibrio'],['roi','ROI']
]);
const clusterCards = clusters.map(([title,description,category,slugs]) => `<article class="cluster-card"><span class="cluster-kicker">${category}</span><h3>${title}</h3><p>${description}</p><ul>${slugs.map(slug=>`<li><a href="calculadoras/${slug}.html">${titleBySlug.get(slug)}</a></li>`).join('')}</ul><a class="cluster-all" href="calculadoras.html?categoria=${encodeURIComponent(category)}">Explorar ${category.toLowerCase()} →</a></article>`).join('');

const homeHub = `<section class="section semantic-hub"><div class="container"><div class="section-title"><span class="badge">Centro especializado</span><h2>Calculadoras fiscales, laborales y financieras para México</h2><p>Explora por tema o entra directamente a una herramienta. Las calculadoras principales reúnen fórmula, desglose, ejemplos, preguntas frecuentes y enlaces a información relacionada.</p></div><div class="cluster-grid">${clusterCards}</div></div></section>`;
const homePremium = `<section class="section alt authority-tools"><div class="container"><div class="section-title"><span class="badge">10 herramientas principales</span><h2>Calculadoras Premium con explicaciones y escenarios</h2><p>Estas páginas reciben el enlazado principal del portal porque responden las búsquedas laborales y fiscales más importantes del proyecto.</p></div><div class="authority-grid">${premiumCards}</div></div></section>`;
const trustSection = `<section class="section authority-method"><div class="container"><div class="method-grid"><article><span class="badge">Cómo trabajamos</span><h2>Fórmula, pasos y límites visibles</h2><p>Cada resultado separa sus componentes para que puedas revisar los datos capturados. Cuando una cifra depende de circunstancias personales, la página la presenta como estimación y explica lo que no incluye.</p><a href="acerca-de.html">Conoce la metodología editorial →</a></article><article><span class="badge">Revisión 2026</span><h2>Fuentes según el tipo de cálculo</h2><p>Las herramientas laborales se contrastan con la Ley Federal del Trabajo y materiales de PROFEDET. Las fiscales identifican la tarifa o tasa empleada, y las financieras explican los supuestos de tasa y plazo.</p><div class="official-links"><a href="https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_Federal_del_Trabajo.pdf" rel="noopener noreferrer">Ley Federal del Trabajo ↗</a><a href="https://www.profedet.gob.mx/" rel="noopener noreferrer">PROFEDET ↗</a><a href="https://www.sat.gob.mx/" rel="noopener noreferrer">SAT ↗</a><a href="https://www.condusef.gob.mx/" rel="noopener noreferrer">CONDUSEF ↗</a></div></article></div></div></section>`;
const homeFaq = `<section class="section alt home-faq"><div class="container"><div class="section-title"><span class="badge">Preguntas frecuentes</span><h2>Sobre Calculadoras México</h2></div><div class="content-box faq-section"><details><summary>¿Las calculadoras son gratuitas?</summary><p>Sí. Puedes utilizar las 50 herramientas sin crear una cuenta.</p></details><details><summary>¿Los resultados son definitivos?</summary><p>No siempre. Son referencias informativas basadas en los datos que introduces y en los supuestos visibles de cada herramienta.</p></details><details><summary>¿Dónde se procesan mis datos?</summary><p>Los cálculos se ejecutan en tu navegador. Favoritos, escenarios e historial permanecen localmente en tu dispositivo.</p></details><details><summary>¿Qué calculadoras se revisan con mayor profundidad?</summary><p>ISR, salario neto, salario bruto, finiquito, liquidación, aguinaldo, vacaciones, prima vacacional, IVA y horas extra forman el grupo Premium.</p></details><details><summary>¿Por qué un resultado puede diferir de un documento real?</summary><p>Una nómina, contrato, crédito o situación fiscal puede incluir conceptos particulares que una simulación general no conoce. Revisa el desglose y las advertencias de la herramienta.</p></details></div></div></section>`;
const homeFaqSchema = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:[
  ['¿Las calculadoras son gratuitas?','Sí. Las 50 herramientas pueden utilizarse sin crear una cuenta.'],
  ['¿Los resultados son definitivos?','No siempre. Son referencias informativas basadas en los datos capturados y los supuestos visibles.'],
  ['¿Dónde se procesan mis datos?','Los cálculos se ejecutan en el navegador y el historial permanece localmente en el dispositivo.'],
  ['¿Qué calculadoras se revisan con mayor profundidad?','Diez herramientas laborales y fiscales forman el grupo Premium del portal.']
].map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))})}</script>`;

let home = read('index.html');
home = home
  .replace(/<title>[^<]*<\/title>/, '<title>Calculadoras México 2026: fiscales, laborales y financieras</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="50 calculadoras para México: ISR, salario, finiquito, aguinaldo, vacaciones, IVA, créditos y finanzas, con fórmula, ejemplos y desglose.">')
  .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="Calculadoras México 2026: herramientas fiscales y laborales">')
  .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Calcula ISR, salario, prestaciones, IVA, créditos y finanzas con desglose, ejemplos y metodología visible.">')
  .replace(/<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="Calculadoras México 2026: herramientas fiscales y laborales">')
  .replace(/<meta name="twitter:description" content="[^"]*">/, '<meta name="twitter:description" content="50 calculadoras gratuitas con desglose, ejemplos y metodología visible.">')
  .replace('<h1>Tus cálculos, más claros.</h1>', '<h1>Calculadoras México: herramientas fiscales, laborales y financieras</h1>')
  .replace('<p>50 calculadoras gratuitas para entender nómina, prestaciones, impuestos, negocios y finanzas sin registro.</p>', '<p>Calcula ISR, salario, finiquito, aguinaldo, vacaciones, IVA, créditos y finanzas con fórmulas claras, ejemplos y resultados desglosados.</p>')
  .replace('<strong>El portal sigue creciendo</strong><ul><li>24 calculadoras nuevas</li><li>Datos y escenarios compartibles</li><li>Gráficas y comparaciones</li><li>Favoritos e historial local</li></ul>', '<strong>Información que puedes revisar</strong><ul><li>50 calculadoras organizadas por tema</li><li>10 herramientas Premium con casos concretos</li><li>Fórmulas, pasos y advertencias visibles</li><li>Datos procesados localmente</li></ul>');
if (!home.includes('class="section semantic-hub"')) {
  home = home.replace('<section class="section"><div class="container"><div class="section-title"><span class="badge">Más utilizadas</span>', `${homeHub}<section class="section"><div class="container"><div class="section-title"><span class="badge">Más utilizadas</span>`);
  home = home.replace('<section class="section alt"><div class="container"><div class="section-title"><span class="badge">Nuevas</span>', `${homePremium}<section class="section alt"><div class="container"><div class="section-title"><span class="badge">Nuevas</span>`);
  home = home.replace('<section class="section"><div class="container"><div class="section-title"><span class="badge">Tu espacio</span>', `${trustSection}${homeFaq}<section class="section"><div class="container"><div class="section-title"><span class="badge">Tu espacio</span>`);
  home = home.replace('</body>', `${homeFaqSchema}</body>`);
}
write('index.html', home);

const catalogClusters = `<section class="catalog-hubs" aria-labelledby="catalog-hubs-title"><div class="section-title compact"><span class="badge">Rutas temáticas</span><h2 id="catalog-hubs-title">Explora las calculadoras por necesidad</h2><p>Cada grupo conecta herramientas que suelen utilizarse juntas.</p></div><div class="cluster-grid">${clusters.map(([title,description,category,slugs])=>`<article class="cluster-card"><span class="cluster-kicker">${category}</span><h3>${title}</h3><p>${description}</p><p class="cluster-links">${slugs.map(slug=>`<a href="calculadoras/${slug}.html">${titleBySlug.get(slug)}</a>`).join(' · ')}</p><a class="cluster-all" href="?categoria=${encodeURIComponent(category)}">Ver grupo completo →</a></article>`).join('')}</div></section>`;
let catalog = read('calculadoras.html');
catalog = catalog
  .replace(/<title>[^<]*<\/title>/, '<title>50 calculadoras gratuitas por categoría | Calculadoras México</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Explora 50 calculadoras de nómina, prestaciones, impuestos, finanzas, créditos, negocios y herramientas, organizadas por necesidad.">');
if (!catalog.includes('class="catalog-hubs"')) catalog = catalog.replace('<div class="catalog-status"', `${catalogClusters}<div class="catalog-status"`);
catalog = catalog.replace('<h2>Calculadoras gratuitas organizadas por tema</h2><p>Encuentra herramientas de nómina, prestaciones, impuestos, finanzas, créditos, negocios y uso diario. Cada tarjeta es un enlace directo y permanece disponible aunque alguna función interactiva no cargue.</p>', '<h2>Un catálogo conectado, no una lista aislada</h2><p>Las herramientas se agrupan por nómina, prestaciones, impuestos, finanzas, créditos, negocios y uso diario. Empieza en una categoría, revisa el resultado y continúa con la calculadora relacionada que responda tu siguiente pregunta.</p>');
write('calculadoras.html', catalog);

let about = read('acerca-de.html');
const shortAbout = '<article class="content-box"><h2>Nuestra misión</h2><p>Crear herramientas gratuitas, rápidas y fáciles de entender.</p><h2>Cómo trabajamos</h2><p>Usamos fórmulas transparentes, contenido educativo y avisos claros.</p><h2>Importante</h2><p>No sustituimos asesoría fiscal, contable, laboral o jurídica.</p></article>';
const fullAbout = `<article class="content-box methodology-page"><span class="updated-note">Metodología revisada en agosto de 2026</span><h2>Nuestra misión</h2><p>Crear herramientas gratuitas que ayuden a comprender cálculos laborales, fiscales, financieros y cotidianos. El objetivo no es mostrar solamente una cifra: buscamos explicar los datos, la fórmula y los límites de cada estimación.</p><h2>Cómo construimos una calculadora</h2><ol class="method-steps"><li><strong>Definimos el problema.</strong><span>Identificamos qué dato quiere obtener la persona y qué variables necesita proporcionar.</span></li><li><strong>Documentamos la fórmula.</strong><span>Separamos las operaciones y los supuestos para que puedan mostrarse en el resultado.</span></li><li><strong>Contrastamos el contexto.</strong><span>Cuando el tema es laboral o fiscal, enlazamos la legislación o institución correspondiente. En finanzas explicamos tasa, plazo y periodicidad.</span></li><li><strong>Probamos escenarios.</strong><span>Ejecutamos valores normales, límites y datos inválidos para detectar errores de lógica o presentación.</span></li><li><strong>Publicamos límites claros.</strong><span>Indicamos conceptos excluidos y recordamos cuándo una situación requiere revisión profesional.</span></li></ol><h2>Fuentes y actualización</h2><p>No existe una única fuente para las 50 herramientas. Las calculadoras laborales se apoyan en la <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_Federal_del_Trabajo.pdf" rel="noopener noreferrer">Ley Federal del Trabajo</a> y materiales de <a href="https://www.profedet.gob.mx/" rel="noopener noreferrer">PROFEDET</a>. Las fiscales remiten al <a href="https://www.sat.gob.mx/" rel="noopener noreferrer">SAT</a>, mientras que las financieras pueden apoyarse en materiales de <a href="https://www.condusef.gob.mx/" rel="noopener noreferrer">CONDUSEF</a>. La ficha de confianza de cada página muestra la referencia relevante y su fecha de revisión.</p><h2>Qué significa “estimación”</h2><p>Una herramienta general no conoce contratos, recibos de nómina, exenciones, subsidios, convenios, comisiones bancarias ni circunstancias particulares. Por eso el resultado debe utilizarse como referencia para comprender un escenario y no como resolución fiscal, laboral, contable, jurídica o financiera.</p><h2>Privacidad y funcionamiento</h2><p>Los cálculos se ejecutan directamente en el navegador. Los favoritos, escenarios e historial se almacenan localmente en el dispositivo y pueden borrarse desde las funciones del sitio.</p><h2>Cómo reportar un problema</h2><p>Si detectas una fórmula, enlace o explicación que necesita revisión, utiliza la <a href="contacto.html">página de contacto</a> e indica la calculadora, los datos utilizados y el resultado esperado. Eso permite reproducir el caso con mayor precisión.</p></article>`;
if (about.includes(shortAbout)) about = about.replace(shortAbout, fullAbout);
write('acerca-de.html', about);

const tableData = {
  isr:{title:'Ejemplos de ISR mensual por nivel de ingreso',heads:['Ingreso bruto','ISR estimado','Neto antes de otras deducciones'],rows:[[10000,770.90,9229.10],[15000,1552.78,13447.22],[20000,2604.00,17396.00],[30000,4740.00,25260.00]],note:'Resultados producidos con la tarifa mensual incorporada. No incluyen subsidio al empleo, IMSS ni ajustes particulares.'},
  'salario-neto':{title:'Ejemplos de salario neto con deducciones conocidas',heads:['Salario bruto','Deducciones capturadas','Neto estimado'],rows:[[10000,1200,8800],[15000,2000,13000],[20000,3000,17000],[30000,5000,25000]],note:'Las deducciones son supuestos de ejemplo; no representan una nómina universal.'},
  finiquito:{title:'Finiquito según días trabajados del año',heads:['Sueldo mensual','Días del año','Finiquito de referencia'],rows:[[15000,90,8099.32],[15000,180,9948.63],[15000,270,11797.95],[15000,365,13750]],note:'Supuesto común: 5 días pendientes, 6 días de vacaciones pendientes, 15 días de aguinaldo y prima de 25%. No incluye indemnización, prima de antigüedad ni retenciones.'},
  liquidacion:{title:'Escenarios de liquidación por antigüedad',heads:['Salario diario','Antigüedad','Referencia con 20 días por año'],rows:[[500,'1 año',55000],[500,'3 años',75000],[500,'5 años',95000]],note:'Suma 90 días de salario y el concepto opcional de 20 días por año, sin sueldo pendiente. La procedencia legal depende del caso.'},
  aguinaldo:{title:'Aguinaldo proporcional con sueldo mensual de $15,000',heads:['Tiempo trabajado','Días de prestación','Aguinaldo bruto'],rows:[['90 días',15,1849.32],['180 días',15,3698.63],['270 días',15,5547.95],['Año completo',15,7500]],note:'La proporción usa 365 días y un salario diario de $500.'},
  vacaciones:{title:'Vacaciones y prima por años de antigüedad',heads:['Antigüedad','Días de vacaciones','Pago más prima'],rows:[['1 año',12,7500],['2 años',14,8750],['5 años',20,12500],['6 años',22,13750]],note:'Ejemplo con salario mensual de $15,000 y prima vacacional de 25%.'},
  iva:{title:'Ejemplos al agregar IVA de 16%',heads:['Subtotal','IVA','Total'],rows:[[1000,160,1160],[5000,800,5800],[10000,1600,11600],[20000,3200,23200]],note:'Para retirar IVA de un precio final se divide entre 1.16; no se resta 16% directamente.'},
  'horas-extra':{title:'Pago de horas extra con salario mensual de $15,000',heads:['Horas capturadas','Pago doble','Total extraordinario'],rows:[[3,375,375],[6,750,750],[9,1125,1125],[12,1125,1687.50]],note:'Supone jornada de 8 horas. La simulación aplica doble hasta 9 horas y triple al excedente, sin reconstruir la distribución semanal.'},
  'salario-bruto':{title:'Ejemplos para reconstruir salario bruto',heads:['Salario neto','Deducciones conocidas','Bruto estimado'],rows:[[10000,1500,11500],[15000,2500,17500],[20000,3000,23000],[30000,5000,35000]],note:'Es una suma aritmética; si faltan deducciones o percepciones, no representa toda la nómina.'},
  'prima-vacacional':{title:'Ejemplos de prima vacacional al 25%',heads:['Salario diario','Días de vacaciones','Prima vacacional'],rows:[[500,12,1500],[500,14,1750],[500,20,2500],[500,22,2750]],note:'La prima es adicional al pago base de vacaciones.'}
};
const cell = value => typeof value === 'number' ? money(value) : value;
for (const [slug,data] of Object.entries(tableData)) {
  const file = `calculadoras/${slug}.html`;
  let html = read(file);
  if (html.includes('class="search-cases"')) continue;
  const block = `<section class="content-box search-cases"><span class="badge">Casos concretos</span><h2>${data.title}</h2><p>Estas referencias permiten comparar escenarios frecuentes antes de utilizar tus propios datos.</p><div class="table-wrap table-scroll"><table><thead><tr>${data.heads.map(item=>`<th scope="col">${item}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row=>`<tr>${row.map(value=>`<td>${cell(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="table-note">${data.note}</p></section>`;
  html = html.replace('<section class="content-box premium-guide">', `${block}<section class="content-box premium-guide">`);
  write(file, html);
}

for (const file of fs.readdirSync(root, {recursive:true}).filter(file => /\.(?:html|js|mjs)$/.test(file))) {
  const full = path.join(root, file);
  const next = fs.readFileSync(full,'utf8').replaceAll('5.1.0','5.1.0');
  fs.writeFileSync(full,next);
}
console.log('V5.1: Home semántica, clusters, catálogo y 10 tablas long-tail integrados.');
