import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content);

const catalogSource = read('assets/js/catalog.js');
const sandbox = {};
vm.runInNewContext(`${catalogSource}\nglobalThis.__catalog = globalThis.CM_CATALOG;`, sandbox);
const catalog = sandbox.__catalog;

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const card = (item, depth = '') => {
  const searchable = [item.title, item.description, item.category, item.keywords].join(' ').toLowerCase();
  return `<article class="card calculator-card" data-search="${escapeHtml(searchable)}">
    <button class="favorite-mini" type="button" data-favorite="${item.slug}" aria-label="Guardar ${escapeHtml(item.title)}" aria-pressed="false"><span data-favorite-icon>☆</span></button>
    <div class="icon" aria-hidden="true">${item.icon}</div>
    <span class="card-kicker">${escapeHtml(item.category)}</span>
    ${item.new ? '<span class="new-badge">Nueva</span>' : ''}
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <a class="card-link" href="${depth}calculadoras/${item.slug}.html">Abrir calculadora →</a>
  </article>`;
};

const related = slug => {
  const current = catalog.find(item => item.slug === slug);
  if (!current) return [];
  return catalog
    .filter(item => item.slug !== slug)
    .map(item => ({item, score: (item.category === current.category ? 5 : 0) + (item.popular ? 2 : 0)}))
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'es'))
    .slice(0, 4)
    .map(entry => entry.item);
};

const seoGuides = {
  isr: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Cómo se estima el ISR</h2><p>La tarifa del ISR es progresiva. Primero se localiza el rango del ingreso, después se resta el límite inferior, se aplica la tasa al excedente y se suma la cuota fija. La herramienta presenta cada parte para que puedas revisar el procedimiento.</p><h3>Ejemplo de interpretación</h3><p>Si introduces un sueldo mensual, el resultado muestra el ingreso bruto, la cuota fija, el excedente, la tasa marginal y el neto estimado. La tasa marginal no se aplica a todo el salario.</p><p class="source-note"><strong>Fuente oficial:</strong> <a href="https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf" rel="noopener noreferrer">Anexo 8 de la Resolución Miscelánea Fiscal para 2026</a>, tarifas del artículo 96. La estimación no incluye subsidio al empleo ni circunstancias personales.</p></section>`,
  aguinaldo: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Cómo calcular el aguinaldo</h2><p>Divide el salario mensual entre 30 para obtener el salario diario y multiplícalo por los días de aguinaldo. Si no trabajaste el año completo, la herramienta calcula la parte proporcional según los días laborados.</p><p class="source-note"><strong>Fuente:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf" rel="noopener noreferrer">Ley Federal del Trabajo, artículo 87</a>.</p></section>`,
  vacaciones: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Vacaciones y prima vacacional</h2><p>La antigüedad determina los días mínimos de vacaciones. La prima vacacional se calcula sobre el pago correspondiente a esos días y puede ser superior al mínimo si así lo establece el contrato.</p><p class="source-note"><strong>Fuente:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf" rel="noopener noreferrer">Ley Federal del Trabajo, artículos 76 a 81</a>.</p></section>`,
  'prima-vacacional': `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Qué representa la prima vacacional</h2><p>Es una cantidad adicional al salario de los días de vacaciones. La herramienta multiplica el salario diario por los días de vacaciones y aplica el porcentaje indicado.</p><p class="source-note"><strong>Fuente:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf" rel="noopener noreferrer">Ley Federal del Trabajo, artículo 80</a>.</p></section>`,
  finiquito: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Qué puede incluir un finiquito</h2><p>La estimación reúne salario pendiente, aguinaldo proporcional, vacaciones pendientes y prima vacacional. El monto real puede cambiar por contrato, retenciones, prestaciones superiores o conceptos adicionales.</p><p class="source-note"><strong>Referencia general:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf" rel="noopener noreferrer">Ley Federal del Trabajo vigente</a>.</p></section>`,
  'horas-extra': `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Cómo se interpreta el pago de horas extra</h2><p>La calculadora obtiene primero el valor aproximado de una hora ordinaria y separa las horas dobles y triples. El resultado depende de la distribución real de la jornada y del contrato.</p><p class="source-note"><strong>Fuente:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf" rel="noopener noreferrer">Ley Federal del Trabajo, artículos 66 a 68</a>.</p></section>`,
  iva: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Agregar o quitar IVA correctamente</h2><p>Para agregar IVA se multiplica el subtotal por la tasa y se suma el impuesto. Para obtener el subtotal desde un precio que ya incluye IVA, se divide el total entre uno más la tasa; restar directamente el porcentaje produce un resultado distinto.</p></section>`,
  'salario-neto': `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Diferencia entre salario bruto y neto</h2><p>El salario bruto es el ingreso antes de deducciones. El neto es la cantidad restante después de ISR, cuotas y otros descuentos. Esta herramienta permite introducir las deducciones conocidas para obtener una referencia clara.</p></section>`,
  prestamo: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Qué muestra la mensualidad estimada</h2><p>La herramienta utiliza monto, tasa anual y plazo para estimar una mensualidad constante, intereses y pago total. Una cotización real también puede incluir comisiones, seguros, impuestos y un CAT diferente.</p></section>`,
  'interes-compuesto': `<section class="content-box seo-guide"><p class="updated-note">Revisado el 1 de agosto de 2026</p><h2>Cómo crece el interés compuesto</h2><p>El rendimiento de cada periodo se incorpora al capital y también puede generar rendimientos posteriores. La frecuencia de capitalización y el plazo influyen de forma importante en el resultado final.</p></section>`,
  cetes: `<section class="content-box seo-guide"><p class="updated-note">Revisado el 1 de agosto de 2026</p><h2>Cómo se estima el rendimiento de CETES</h2><p>La herramienta multiplica el precio de compra por el número de títulos para estimar la inversión y compara ese importe con el valor nominal al vencimiento. El rendimiento anual simple usa un año comercial de 360 días.</p><p class="source-note"><strong>Referencia oficial:</strong> <a href="https://www.anterior.banxico.org.mx/dyn/divulgacion/sistema-financiero/sistema-financiero.html" rel="noopener noreferrer">Banco de México: características de los CETES</a>. El cálculo no incluye impuestos, comisiones ni reinversión.</p></section>`
};

const calculationMethods = {
  'salario-diario': 'Divide el ingreso del periodo entre 30, 15 o 7 días, según el periodo seleccionado.',
  descuento: 'Multiplica el precio original por el porcentaje de descuento y resta ese ahorro al precio.',
  'salario-bruto': 'Suma al salario neto las deducciones conocidas para reconstruir una referencia del ingreso bruto.',
  'salario-diario-integrado': 'Aplica al salario diario un factor que integra aguinaldo y prima vacacional sobre los días de vacaciones indicados.',
  'prima-dominical': 'Multiplica el salario diario por el porcentaje de prima y por el número de domingos trabajados.',
  'aguinaldo-proporcional': 'Calcula el aguinaldo anual con salario diario y días de prestación; después aplica la proporción de días trabajados sobre 365.',
  'vacaciones-proporcionales': 'Prorratea los días anuales de vacaciones según los días trabajados y aplica salario diario y prima vacacional.',
  liquidacion: 'Suma una referencia de tres meses de salario, el concepto opcional de 20 días por año y el sueldo pendiente indicado.',
  ptu: 'Divide la bolsa en dos mitades: una se reparte por días trabajados y la otra por proporción salarial.',
  'retencion-iva': 'Obtiene primero el IVA causado sobre el subtotal y aplica a ese impuesto el porcentaje de retención indicado.',
  'iva-incluido': 'Divide el precio final entre uno más la tasa para recuperar el subtotal y obtiene el IVA por diferencia.',
  porcentaje: 'Resuelve porcentaje de una cantidad, proporción entre dos valores o cambio porcentual entre valor inicial y final.',
  'aumento-salarial': 'Multiplica el salario actual por el porcentaje de aumento y suma el incremento al salario original.',
  comision: 'Multiplica las ventas por la tasa de comisión y suma, si existe, el pago base.',
  'interes-simple': 'Usa capital × tasa anual × meses ÷ 12; el interés no se incorpora de nuevo al capital.',
  'ahorro-mensual': 'Proyecta por separado el ahorro inicial y las aportaciones mensuales con una tasa mensual constante.',
  'regla-tres': 'Calcula el valor desconocido como B × C ÷ A, por lo que A no puede ser cero.',
  edad: 'Compara las fechas por calendario para obtener años, meses y días adicionales, además de los días totales transcurridos.',
  'diferencia-fechas': 'Resta las dos fechas en tiempo UTC y convierte la diferencia a días y semanas completas.',
  propina: 'Calcula la propina como cuenta × porcentaje, la suma al total y divide el importe entre las personas.',
  'margen-ganancia': 'Resta costo a precio de venta; divide la utilidad entre venta para el margen y entre costo para el aumento sobre costo.',
  'precio-venta': 'Multiplica el costo por el porcentaje de aumento y suma esa utilidad al costo.',
  'punto-equilibrio': 'Divide costos fijos entre el margen por unidad —precio menos costo variable— y redondea hacia arriba.',
  roi: 'Resta la inversión al valor final y divide la ganancia o pérdida entre la inversión inicial.',
  inflacion: 'Aplica crecimiento compuesto con una tasa anual constante y muestra también el poder adquisitivo inverso estimado.',
  'ahorro-meta': 'Resta el ahorro actual a la meta y divide el faltante entre los meses disponibles.',
  'tiempo-ahorro': 'Divide el faltante entre la aportación mensual y redondea hacia arriba al siguiente mes completo.',
  'credito-automotriz': 'Resta el enganche al precio y aplica una fórmula de mensualidad fija al monto financiado.',
  hipoteca: 'Resta el enganche al precio de la vivienda y amortiza el saldo con tasa mensual durante el plazo indicado.',
  'pago-quincenal': 'Divide el salario mensual entre dos para la quincena y entre 30 para la referencia diaria.',
  'salario-hora': 'Divide el salario mensual entre los días trabajados por mes y las horas de cada jornada.',
  bono: 'Multiplica el salario base por el porcentaje de bono y suma ambos importes para el total bruto.',
  'reparto-cuenta': 'Divide el total entre el número de personas indicado.',
  'precio-sin-descuento': 'Divide el precio pagado entre uno menos la tasa de descuento para recuperar el precio original.',
  'tasa-efectiva': 'Convierte la tasa nominal con (1 + tasa ÷ frecuencia) elevado al número de capitalizaciones, menos uno.',
  'rendimiento-anualizado': 'Calcula el rendimiento del periodo y lo eleva a 365 dividido entre los días del periodo.',
  'costo-unidad': 'Suma costos fijos y variables y divide el total entre las unidades producidas.',
  'conversion-longitud': 'Convierte primero la cantidad a metros y después aplica el factor de la unidad de destino.',
  'costo-combustible': 'Divide la distancia entre el rendimiento del vehículo para obtener litros y los multiplica por el precio.'
};

const genericSeoGuide = item => {
  const method = calculationMethods[item.slug];
  if (!method) return '';
  return `<section class="content-box seo-guide"><p class="updated-note">Revisado el 1 de agosto de 2026</p><h2>Cómo calcula ${escapeHtml(item.title)}</h2><p>${escapeHtml(method)}</p><h3>Cómo interpretar el resultado</h3><p>Prueba más de un escenario y revisa el desglose, no solamente la cifra final. Los redondeos, tasas, plazos y conceptos adicionales pueden cambiar el resultado real.</p></section>`;
};

// Conserva cada responsabilidad en un archivo pequeño y comprobable. Esto evita que
// una publicación con un common.js anterior deje sin catálogo o sin calculadoras al sitio.
const markerPatterns = [
  /\/\* CM_CATALOG_BUNDLE_START \*\/[\s\S]*?\/\* CM_CATALOG_BUNDLE_END \*\//g,
  /\/\* CM_CALCULATORS_BUNDLE_START \*\/[\s\S]*?\/\* CM_CALCULATORS_BUNDLE_END \*\//g,
  /\/\* CM_SIMULATORS_BUNDLE_START \*\/[\s\S]*?\/\* CM_SIMULATORS_BUNDLE_END \*\//g
];
let common = read('assets/js/common.js');
for (const pattern of markerPatterns) common = common.replace(pattern, '').trim();
write('assets/js/common.js', `${common}\n`);

const htmlFiles = [];
for (const directory of ['', 'calculadoras', 'articulos']) {
  for (const name of fs.readdirSync(path.join(root, directory)).filter(file => file.endsWith('.html'))) {
    htmlFiles.push(path.join(directory, name));
  }
}

const catalogSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://calculadora-isr-mexico.vercel.app/calculadoras.html#page',
      name: '50 calculadoras gratuitas',
      url: 'https://calculadora-isr-mexico.vercel.app/calculadoras.html',
      description: 'Catálogo de calculadoras gratuitas de nómina, prestaciones, impuestos, finanzas, créditos y negocios.',
      inLanguage: 'es-MX',
      mainEntity: {'@id': 'https://calculadora-isr-mexico.vercel.app/calculadoras.html#list'}
    },
    {
      '@type': 'ItemList',
      '@id': 'https://calculadora-isr-mexico.vercel.app/calculadoras.html#list',
      name: 'Catálogo de Calculadoras México',
      numberOfItems: catalog.length,
      itemListElement: catalog.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `https://calculadora-isr-mexico.vercel.app/calculadoras/${item.slug}.html`
      }))
    }
  ]
});

for (const relative of htmlFiles) {
  let html = read(relative);
  html = html
    .replace(/assets\/css\/styles\.css(?:\?v=[^"']+)?/g, 'assets/css/styles.css?v=3.11.0')
    .replace(/assets\/js\/catalog\.js(?:\?v=[^"']+)?/g, 'assets/js/catalog.js?v=3.11.0')
    .replace(/assets\/js\/common\.js(?:\?v=[^"']+)?/g, 'assets/js/common.js?v=3.11.0')
    .replace(/assets\/js\/calculators\.js(?:\?v=[^"']+)?/g, 'assets/js/calculators.js?v=3.11.0')
    .replace(/assets\/js\/simulators\.js(?:\?v=[^"']+)?/g, 'assets/js/simulators.js?v=3.11.0')
    .replace(/assets\/js\/tablas\.js(?:\?v=[^"']+)?/g, 'assets/js/tablas.js?v=3.11.0')
    .replaceAll('<span class="badge">Fase 5</span>', '<span class="badge">Nuevas</span>')
    .replaceAll('<span class="badge">Fase 9</span>', '<span class="badge">Compara opciones</span>')
    .replaceAll('<h2>Portal V3 — Fase 5</h2>', '<h2>Todo en un solo lugar</h2>')
    .replace('content="index,follow,max-image-preview:large"', 'content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"');

  if (relative === 'calculadoras.html') {
    const categoryButtons = ['Todas', 'Nómina', 'Prestaciones', 'Impuestos', 'Finanzas', 'Créditos', 'Negocios', 'Herramientas']
      .map((category, index) => `<button type="button" data-catalog-category="${category}" aria-pressed="${index === 0 ? 'true' : 'false'}" class="${index === 0 ? 'active' : ''}">${category}</button>`)
      .join('');
    html = html.replace('</form></header>', `</form><div class="catalog-categories" aria-label="Filtrar por categoría">${categoryButtons}</div></header>`);
    html = html.replace('<div class="grid" data-catalog="all"></div>', `<div class="catalog-status" aria-live="polite"><strong>50 calculadoras disponibles</strong><span data-catalog-count>Explora por nombre o categoría.</span></div><div class="grid catalog-grid" data-catalog="all">${catalog.map(item => card(item)).join('')}</div>`);
    html = html.replace('<section class="content-box personal-section">', `<section class="content-box catalog-intro"><h2>Calculadoras gratuitas organizadas por tema</h2><p>Encuentra herramientas de nómina, prestaciones, impuestos, finanzas, créditos, negocios y uso diario. Cada tarjeta es un enlace directo y permanece disponible aunque alguna función interactiva no cargue.</p></section><section class="content-box personal-section">`);
    html = html.replace(/<script>document\.addEventListener\('DOMContentLoaded',\(\)=>\{const q=document\.getElementById\('catalog-search'\);[\s\S]*?<\/script>/, '');
    if (!html.includes('calculadoras.html#list')) html = html.replace('</body>', `<script type="application/ld+json">${catalogSchema}</script></body>`);
  }

  if (relative === 'index.html') {
    html = html
      .replace('<div class="grid" data-popular></div>', `<div class="grid" data-popular>${catalog.filter(item => item.popular).map(item => card(item)).join('')}</div>`)
      .replace('<div class="grid" data-new></div>', `<div class="grid" data-new>${catalog.filter(item => item.new).slice(0, 8).map(item => card(item)).join('')}</div>`)
      .replace('<div class="grid" data-trending-list></div>', `<div class="grid" data-trending-list>${catalog.filter(item => item.popular).slice(0, 8).map(item => card(item)).join('')}</div>`)
      .replace('<div class="grid" data-recommended-list></div>', `<div class="grid" data-recommended-list>${catalog.slice(8, 16).map(item => card(item)).join('')}</div>`);
  }

  const slug = relative.match(/^calculadoras\/(.+)\.html$/)?.[1];
  if (slug) {
    html = html.replace(`<div class="grid" data-related-list="${slug}"></div>`, `<div class="grid" data-related-list="${slug}">${related(slug).map(item => card(item, '../')).join('')}</div>`);
    const item = catalog.find(entry => entry.slug === slug);
    const guide = seoGuides[slug] || (item ? genericSeoGuide(item) : '');
    if (guide && !html.includes('class="content-box seo-guide"')) {
      html = html.replace('<section class="content-box faq-section">', `${guide}<section class="content-box faq-section">`);
    }
  }

  write(relative, html);
}

// Unifica la fecha visible de revisión de las guías de esta entrega.
for (const relative of htmlFiles.filter(file => file.startsWith('calculadoras/'))) {
  write(relative, read(relative).replaceAll('Revisado el 31 de julio de 2026', 'Revisado el 1 de agosto de 2026'));
}

// La caché no conserva archivos incompletos de la publicación anterior.
let sw = read('sw.js')
  .replace(/const CACHE='[^']+';/, "const CACHE='calculadoras-mx-v3.11.0';")
  .replace(/const CORE=\[[^;]+;/, "const CORE=['/index.html','/calculadoras.html','/simuladores.html','/offline.html','/assets/css/styles.css?v=3.11.0','/assets/js/catalog.js?v=3.11.0','/assets/js/common.js?v=3.11.0','/assets/img/logo.svg','/assets/img/favicon.svg'];")
  .replace("if(url.pathname.startsWith('/assets/'))event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response})));", "if(url.pathname.startsWith('/assets/'))event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request)));" );
write('sw.js', sw);

// JavaScript y CSS cambian entre versiones. No deben quedar bloqueados por la
// política "immutable" de una publicación anterior; las imágenes sí pueden
// conservar la caché larga porque sus nombres y contenido son estables.
const vercel = JSON.parse(read('vercel.json'));
const assetIndex = vercel.headers.findIndex(entry => entry.source === '/assets/(.*)');
const updateableAssets = [
  {
    source: '/assets/js/(.*)',
    headers: [{key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, must-revalidate'}]
  },
  {
    source: '/assets/css/(.*)',
    headers: [{key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, must-revalidate'}]
  },
  {
    source: '/assets/img/(.*)',
    headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]
  }
];
if (assetIndex >= 0) vercel.headers.splice(assetIndex, 1, ...updateableAssets);
else if (!vercel.headers.some(entry => entry.source === '/assets/js/(.*)')) vercel.headers.push(...updateableAssets);
const securityEntry = vercel.headers.find(entry => entry.source === '/(.*)');
if (securityEntry) {
  const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.effectivecpmnetwork.com https://effectivecpmnetwork.com https://*.highperformanceformat.com https://highperformanceformat.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; font-src 'self' data: https:; frame-src https:; child-src https:; media-src https: data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY'
};
  for (const [key, value] of Object.entries(securityHeaders)) {
    const existing = securityEntry.headers.find(header => header.key === key);
    if (existing) existing.value = value;
    else securityEntry.headers.push({key, value});
  }
}
write('vercel.json', `${JSON.stringify(vercel, null, 2)}\n`);

console.log(`Release hardened: ${catalog.length} static catalog cards, versioned JavaScript and SEO guides.`);
