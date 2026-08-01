import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content);

const catalogSource = read('assets/js/catalog.js');
const sandbox = {};
vm.runInNewContext(`${catalogSource}\nglobalThis.__catalog = CM_CATALOG;`, sandbox);
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
  'interes-compuesto': `<section class="content-box seo-guide"><p class="updated-note">Revisado el 31 de julio de 2026</p><h2>Cómo crece el interés compuesto</h2><p>El rendimiento de cada periodo se incorpora al capital y también puede generar rendimientos posteriores. La frecuencia de capitalización y el plazo influyen de forma importante en el resultado final.</p></section>`
};

// Una sola dependencia existente contiene catálogo, navegación, calculadoras y simuladores.
const markerPatterns = [
  /\/\* CM_CATALOG_BUNDLE_START \*\/[\s\S]*?\/\* CM_CATALOG_BUNDLE_END \*\//g,
  /\/\* CM_CALCULATORS_BUNDLE_START \*\/[\s\S]*?\/\* CM_CALCULATORS_BUNDLE_END \*\//g,
  /\/\* CM_SIMULATORS_BUNDLE_START \*\/[\s\S]*?\/\* CM_SIMULATORS_BUNDLE_END \*\//g
];
let common = read('assets/js/common.js');
for (const pattern of markerPatterns) common = common.replace(pattern, '').trim();
common = `/* CM_CATALOG_BUNDLE_START */\n${catalogSource}\n/* CM_CATALOG_BUNDLE_END */\n\n${common}\n\n/* CM_CALCULATORS_BUNDLE_START */\n${read('assets/js/calculators.js')}\n/* CM_CALCULATORS_BUNDLE_END */\n\n/* CM_SIMULATORS_BUNDLE_START */\n${read('assets/js/simulators.js')}\n/* CM_SIMULATORS_BUNDLE_END */\n`;
write('assets/js/common.js', common);

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
    .replace(/<script src="(?:\.\.\/)?assets\/js\/catalog\.js"[^>]*><\/script>/g, '')
    .replace(/<script src="(?:\.\.\/)?assets\/js\/calculators\.js"[^>]*><\/script>/g, '')
    .replace(/<script src="(?:\.\.\/)?assets\/js\/simulators\.js"[^>]*><\/script>/g, '')
    .replace(/assets\/css\/styles\.css(?:\?v=[^"']+)?/g, 'assets/css/styles.css?v=3.10.1')
    .replace(/assets\/js\/common\.js(?:\?v=[^"']+)?/g, 'assets/js/common.js?v=3.10.1')
    .replace(/assets\/js\/tablas\.js(?:\?v=[^"']+)?/g, 'assets/js/tablas.js?v=3.10.1')
    .replaceAll('<span class="badge">Fase 5</span>', '<span class="badge">Nuevas</span>')
    .replaceAll('<span class="badge">Fase 9</span>', '<span class="badge">Compara opciones</span>')
    .replaceAll('<h2>Portal V3 — Fase 5</h2>', '<h2>Todo en un solo lugar</h2>')
    .replace('content="index,follow,max-image-preview:large"', 'content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"');

  if (relative === 'calculadoras.html') {
    html = html.replace('<div class="grid" data-catalog="all"></div>', `<div class="catalog-status" aria-live="polite"><strong>50 calculadoras disponibles</strong><span data-catalog-count>Explora por nombre o categoría.</span></div><div class="grid catalog-grid" data-catalog="all">${catalog.map(item => card(item)).join('')}</div>`);
    html = html.replace('<section class="content-box personal-section">', `<section class="content-box catalog-intro"><h2>Calculadoras gratuitas organizadas por tema</h2><p>Encuentra herramientas de nómina, prestaciones, impuestos, finanzas, créditos, negocios y uso diario. Cada tarjeta es un enlace directo y permanece disponible aunque alguna función interactiva no cargue.</p></section><section class="content-box personal-section">`);
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
    if (seoGuides[slug] && !html.includes('class="content-box seo-guide"')) {
      html = html.replace('<section class="content-box faq-section">', `${seoGuides[slug]}<section class="content-box faq-section">`);
    }
  }

  write(relative, html);
}

// El filtro del catálogo también actualiza el contador y acepta acentos.
let catalogHtml = read('calculadoras.html');
catalogHtml = catalogHtml.replace(
  "document.querySelectorAll('[data-catalog] .card').forEach(card=>card.hidden=!card.dataset.search.normalize('NFD').replace(/\\p{Diacritic}/gu,'').includes(term))",
  "let visible=0;document.querySelectorAll('[data-catalog] .card').forEach(card=>{card.hidden=!card.dataset.search.normalize('NFD').replace(/\\p{Diacritic}/gu,'').includes(term);if(!card.hidden)visible++});const count=document.querySelector('[data-catalog-count]');if(count)count.textContent=visible===1?'1 resultado':`${visible} resultados`"
);
write('calculadoras.html', catalogHtml);

// La caché no conserva archivos incompletos de la publicación anterior.
let sw = read('sw.js')
  .replace(/const CACHE='[^']+';/, "const CACHE='calculadoras-mx-v3.10.1';")
  .replace("'/assets/js/catalog.js',", '')
  .replace("'/assets/css/styles.css'", "'/assets/css/styles.css?v=3.10.1'")
  .replace("'/assets/js/common.js'", "'/assets/js/common.js?v=3.10.1'")
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
write('vercel.json', `${JSON.stringify(vercel, null, 2)}\n`);

console.log(`Release hardened: ${catalog.length} static catalog cards, bundled JavaScript and SEO guides.`);
