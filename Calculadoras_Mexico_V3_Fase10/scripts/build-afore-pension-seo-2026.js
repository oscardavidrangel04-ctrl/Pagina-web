const fs = require('fs');
const path = require('path');

const base = 'https://calculadora-isr-mexico.vercel.app';
const today = '2026-09-21';
const guides = [
  {
    slug: 'como-saber-en-que-afore-estoy', title: 'Cómo saber en qué AFORE estoy: consulta con CURP o NSS',
    description: 'Aprende a localizar la AFORE que administra tu cuenta con CURP o NSS, qué hacer si no aparece y cómo consultar después tu saldo.',
    lead: 'Si no recuerdas en qué AFORE estás registrado, primero localiza la administradora y después solicita tu estado de cuenta. Localizarla no equivale a conocer el saldo.',
    sections: [
      ['Consulta paso a paso', 'Entra al servicio oficial Localiza tu AFORE de AforeWeb. Ten a la mano tu CURP o número de seguridad social (NSS) y un correo personal. Verifica que los datos coincidan con tus documentos; el resultado identifica la administradora que lleva la cuenta, no es un estado de cuenta.'],
      ['Si no aparece una AFORE', 'Revisa errores de captura y posibles diferencias entre CURP, NSS y datos registrados. Si persiste, pide orientación a CONSAR o al instituto en el que cotizas. No compartas CURP, NSS ni códigos de verificación en sitios que prometen localizar tu cuenta a cambio de dinero.'],
      ['Cómo consultar cuánto tienes', 'Una vez identificada la administradora, solicita estado de cuenta y revisa saldo, movimientos y datos personales. Si estás evaluando cambiarte, compara rendimiento neto, comisión y servicio antes de iniciar un traspaso.']
    ], source: ['CONSAR: servicios de AforeWeb', 'https://www.gob.mx/consar/articulos/consar-lanza-el-portal-aforeweb-para-acercar-informacion-y-servicios-de-la-cuenta-afore-a-mas-mexicanos?idiom=es'],
    links: ['como-cambiar-de-afore', 'aportaciones-voluntarias-afore', 'pension-imss-ley-97']
  },
  {
    slug: 'como-cambiar-de-afore', title: 'Cómo cambiar de AFORE: trámite y qué comparar antes',
    description: 'Guía para cambiar de AFORE en México: opciones de traspaso, documentos, comparación de rendimiento y pasos para revisar el resultado.',
    lead: 'Cambiar de AFORE es un traspaso de tu cuenta individual, no un retiro del ahorro. La decisión debe considerar rendimiento neto, comisión, atención y reglas del trámite.',
    sections: [
      ['Antes de pedir el traspaso', 'Localiza tu AFORE actual y consulta tu estado de cuenta. Compara administradoras con el indicador de rendimiento neto correspondiente a tu generación y revisa las condiciones actuales publicadas por CONSAR. Una promesa de rendimiento futuro no es garantía.'],
      ['Cómo se solicita', 'CONSAR describe la solicitud de traspaso y la alternativa móvil mediante AforeMóvil. Pueden pedir expediente electrónico, validación de identidad y consentimiento. Sigue los pasos del canal oficial y conserva el folio; no entregues contraseñas ni códigos a un promotor.'],
      ['Después del cambio', 'Confirma que el traspaso quedó registrado y revisa el siguiente estado de cuenta. Si no lo autorizaste, contacta a tu administradora y a CONSAR para aclarar el movimiento.']
    ], source: ['CONSAR: trámite de traspaso', 'https://www.gob.mx/consar/articulos/tramite-de-traspaso-en-la-afore?idiom=es%2F1000'],
    links: ['como-saber-en-que-afore-estoy', 'aportaciones-voluntarias-afore']
  },
  {
    slug: 'retiro-por-desempleo-afore', title: 'Retiro por desempleo de la AFORE: consecuencias y trámite',
    description: 'Entiende cómo funciona el retiro parcial por desempleo de la AFORE, qué verificar antes de solicitarlo y cómo puede afectar tus semanas cotizadas.',
    lead: 'El retiro por desempleo permite disponer de una parte del ahorro cuando se cumplen los requisitos. No significa retirar toda la cuenta y puede reducir semanas reconocidas para la pensión.',
    sections: [
      ['Qué revisar antes de solicitar', 'Confirma tu situación de baja, la administradora que lleva la cuenta y las condiciones de la modalidad aplicable. El importe autorizado depende del expediente y las reglas vigentes; no se obtiene multiplicando cualquier saldo por un porcentaje fijo.'],
      ['Trámite y canales', 'Consulta primero a tu AFORE o AforeMóvil/AforeWeb y verifica documentos y tiempos directamente en el canal oficial. Evita gestores que prometen liberar la cuenta completa o que piden datos bancarios fuera del procedimiento.'],
      ['Efecto en la pensión', 'CONSAR advierte que el retiro por desempleo descuenta semanas cotizadas y puede afectar el monto futuro. Antes de decidir, solicita un desglose de semanas y pregunta cómo reintegrar recursos si posteriormente quieres recuperar las semanas descontadas.']
    ], source: ['CONSAR: retiro parcial por desempleo', 'https://www.consar.gob.mx/gobmx/aplicativo/catsar/Docs/Tramite14.pdf'],
    links: ['semanas-cotizadas-pension-imss', 'como-saber-en-que-afore-estoy', 'pension-imss-ley-97']
  },
  {
    slug: 'aportaciones-voluntarias-afore', title: 'Aportaciones voluntarias a la AFORE: cómo hacerlas y retirarlas',
    description: 'Conoce cómo hacer aportaciones voluntarias a tu AFORE, las diferencias entre plazos de retiro y qué revisar antes de deducirlas de impuestos.',
    lead: 'El ahorro voluntario complementa las aportaciones obligatorias. Antes de depositar, identifica el tipo de subcuenta: el plazo de disponibilidad y el tratamiento fiscal no son iguales para todas.',
    sections: [
      ['Cómo empezar', 'Localiza tu administradora, revisa su estado de cuenta y usa sus canales autorizados o AforeWeb para aportar. Conserva comprobantes y comprueba que el depósito apareció en la subcuenta correcta.'],
      ['Disponibilidad del dinero', 'No todas las aportaciones voluntarias se retiran en el mismo plazo. Las de corto plazo, largo plazo y complementarias de retiro tienen condiciones distintas; confirma el contrato y la información vigente de tu AFORE antes de necesitarlas.'],
      ['¿Son deducibles?', 'Sólo ciertas aportaciones, bajo requisitos fiscales y de permanencia, pueden considerarse deducibles. Un retiro anticipado puede modificar ese tratamiento. Revisa tu constancia y consulta al SAT o a un asesor fiscal antes de declarar.']
    ], source: ['CONSAR: guía del sistema de ahorro para el retiro', 'https://www.gob.mx/consar/documentos/guia-del-sistema-de-ahorro-para-el-retiro-imss?idiom=es'],
    links: ['como-saber-en-que-afore-estoy', 'como-cambiar-de-afore', 'pension-imss-ley-97']
  },
  {
    slug: 'modalidad-40-imss', title: 'Modalidad 40 del IMSS: qué es y para quién puede servir',
    description: 'Explicación de la continuación voluntaria o Modalidad 40 del IMSS: cotización, inscripción, límites y puntos que debes verificar antes de pagar.',
    lead: 'La Modalidad 40 es la continuación voluntaria en el régimen obligatorio después de una baja laboral. Permite seguir cotizando bajo condiciones legales, pero no garantiza una pensión de determinado monto.',
    sections: [
      ['Qué permite y qué no', 'La persona inscrita elige un salario de cotización dentro de los límites aplicables y paga las cuotas correspondientes. El efecto sobre una futura pensión depende del régimen, semanas, edad, salario y expediente. No debe confundirse con una póliza de servicios médicos.'],
      ['Antes de inscribirte', 'Revisa fecha de baja, semanas registradas, régimen pensionario, salario de referencia y capacidad para cubrir pagos periódicos. El IMSS ofrece inscripción por internet con CURP y correo personal; verifica requisitos actuales en su trámite oficial.'],
      ['Riesgo de las promesas de pensión', 'No existe una cifra universal que convierta una cuota mensual en una pensión garantizada. Compara escenarios y revisa directamente con el IMSS tu historial antes de contratar asesoría o comprometer ahorros.']
    ], source: ['IMSS: continuación voluntaria', 'https://www.imss.gob.mx/faq/como-inscribirme-continuacion-voluntaria-internet'],
    links: ['cuanto-cuesta-modalidad-40', 'pension-imss-ley-73', 'conservacion-derechos-imss-ley-73']
  },
  {
    slug: 'cuanto-cuesta-modalidad-40', title: 'Cuánto cuesta la Modalidad 40: factores del pago mensual',
    description: 'Conoce de qué depende el costo de la Modalidad 40 del IMSS y qué datos necesitas para estimar tu cuota sin usar tablas antiguas.',
    lead: 'La cuota de Modalidad 40 no es un precio único. Depende del salario con el que elijas cotizar, los límites vigentes y las reglas de contribución del periodo.',
    sections: [
      ['Datos necesarios', 'Reúne salario base de cotización de tu última baja, salario que deseas registrar, fecha de inscripción y periodo de pago. El salario elegido está sujeto a límites; no es correcto aplicar una tarifa histórica a un año nuevo.'],
      ['Por qué cambia el pago', 'Las tasas y bases pueden cambiar con el tiempo. Un ejemplo publicado para otro año puede subestimar el costo actual. Solicita al IMSS la línea de captura o comprobante del periodo y compara ese importe con cualquier estimación.'],
      ['Costo frente a beneficio', 'Antes de pagar, revisa si el régimen de pensión aplicable y tus semanas hacen razonable la estrategia. El beneficio potencial no debe presentarse como garantizado: depende del expediente individual y de las reglas vigentes.']
    ], source: ['IMSS: inscripción a continuación voluntaria', 'https://www.imss.gob.mx/node/1399'],
    links: ['modalidad-40-imss', 'pension-imss-ley-73', 'semanas-cotizadas-pension-imss']
  },
  {
    slug: 'pension-imss-ley-97', title: 'Pensión IMSS Ley 97 en 2026: cuenta AFORE y semanas',
    description: 'Guía de pensión IMSS bajo Ley 97: cuenta individual, semanas requeridas en 2026, opciones de pago y qué revisar antes del trámite.',
    lead: 'En el régimen de 1997 la cuenta individual administrada por una AFORE es central para financiar la pensión. La edad, semanas y saldo se revisan juntos; una sola cifra no determina el resultado.',
    sections: [
      ['Semanas para 2026', 'La guía del IMSS para tramitar pensión señala 875 semanas en 2026 para este régimen. La exigencia aumenta gradualmente; verifica el año en que presentarás la solicitud y descarga tu constancia actualizada.'],
      ['Opciones de pensión', 'CONSAR explica alternativas como renta vitalicia y retiro programado. Cada una tiene características y riesgos diferentes. El monto estimado depende de recursos acumulados, edad, beneficiarios y condiciones al momento de pensionarte.'],
      ['Antes del trámite', 'Comprueba CURP, NSS, AFORE, semanas y datos de beneficiarios. Si el IMSS determina que no cumples requisitos, solicita una resolución formal; una negativa no debe confundirse con una estimación de una calculadora.']
    ], source: ['IMSS: guía para tramitar pensión', 'https://www.imss.gob.mx/sites/all/statics/pensiones/Guia-Tramitar-Pension.pdf'],
    links: ['diferencia-ley-73-ley-97', 'semanas-cotizadas-pension-imss', 'negativa-pension-imss', 'aportaciones-voluntarias-afore']
  },
  {
    slug: 'diferencia-ley-73-ley-97', title: 'Ley 73 vs Ley 97 del IMSS: diferencias para pensionarse',
    description: 'Compara Ley 73 y Ley 97 del IMSS: quién puede pertenecer a cada régimen, semanas, base de cálculo y papel de la AFORE.',
    lead: 'La primera pregunta no es cuál ley “paga más”, sino qué régimen corresponde a tu historial. Quienes cotizaron antes del 1 de julio de 1997 pueden tener un supuesto de transición; quienes comenzaron después siguen Ley 97.',
    sections: [
      ['Base de la pensión', 'Ley 73 considera reglas de salario y semanas del régimen anterior. Ley 97 se centra en el ahorro de la cuenta individual y las modalidades disponibles. Por ello no sirve comparar dos montos sin el mismo expediente.'],
      ['Semanas y conservación', 'Ley 73 contempla el periodo de conservación de derechos después de la baja. Ley 97 exige un número de semanas que aumenta por año; para 2026 la guía del IMSS indica 875. Verifica edad, baja y cotizaciones registradas.'],
      ['Qué revisar en tu caso', 'Descarga constancia de semanas y estado de cuenta AFORE; corrige inconsistencias antes de iniciar. Si tienes opción de régimen, pide al IMSS la información comparativa oficial para tomar la decisión.']
    ], source: ['IMSS: guía para tramitar pensión', 'https://www.imss.gob.mx/sites/all/statics/pensiones/Guia-Tramitar-Pension.pdf'],
    links: ['pension-imss-ley-73', 'pension-imss-ley-97', 'conservacion-derechos-imss-ley-73']
  },
  {
    slug: 'negativa-pension-imss', title: 'Negativa de pensión IMSS: qué significa y qué revisar',
    description: 'Comprende qué es una negativa de pensión del IMSS, por qué puede emitirse, cómo obtener la resolución y qué verificar antes de disponer de la AFORE.',
    lead: 'Una negativa de pensión es una resolución formal del IMSS, no un mensaje informal ni un cálculo en línea. Puede surgir cuando no se acreditan requisitos; sus efectos dependen del régimen y de la causa específica.',
    sections: [
      ['Motivos que debes revisar', 'Comprueba semanas reconocidas, edad, baja, régimen, datos personales y beneficiarios. Si observas una discrepancia, solicita la corrección de tu historial antes de asumir que la resolución es definitiva.'],
      ['Cómo obtener el documento', 'El IMSS indica que, cuando el servicio digital arroja un caso que requiere negativa, debes acudir a la UMF o Subdelegación correspondiente para tramitar el documento. Guarda la resolución y pregunta por las vías de aclaración disponibles para tu supuesto.'],
      ['AFORE y servicio médico', 'No retires recursos basándote sólo en una promesa de un tercero. Pregunta al IMSS y a tu AFORE qué subcuentas pueden entregarse y qué derechos conservas; incluso una negativa puede tener efectos distintos para servicio médico según semanas y régimen.']
    ], source: ['IMSS: orientación sobre negativa de pensión', 'https://www.imss.gob.mx/node/98889'],
    links: ['pension-imss-ley-97', 'semanas-cotizadas-pension-imss', 'como-saber-en-que-afore-estoy']
  },
  {
    slug: 'conservacion-derechos-imss-ley-73', title: 'Conservación de derechos IMSS Ley 73: periodo y constancia',
    description: 'Conoce cómo se determina el periodo de conservación de derechos bajo Ley 73 del IMSS, desde cuándo cuenta y qué documentos revisar.',
    lead: 'Al dejar de cotizar, la conservación de derechos puede mantener la posibilidad de solicitar una pensión Ley 73 durante un periodo. No es lo mismo que tener servicio médico vigente.',
    sections: [
      ['Periodo después de la baja', 'Para cesantía en edad avanzada bajo Ley 73, el IMSS señala un periodo equivalente a la cuarta parte del tiempo cubierto por cotizaciones semanales, contado desde la baja. Ejemplo orientativo: 800 semanas cotizadas equivaldrían a 200 semanas de conservación; confirma fechas y semanas reconocidas con el instituto.'],
      ['Cómo comprobarlo', 'Descarga tu constancia de semanas cotizadas y revisa la fecha de baja más reciente. Una constancia de semanas no sustituye la resolución de pensión; si necesitas acreditar el periodo para un trámite, pide al IMSS el documento y la orientación específica.'],
      ['Si terminó el periodo', 'No concluyas que perdiste para siempre toda posibilidad de pensión. El reingreso y el reconocimiento posterior de cotizaciones dependen de las reglas y del historial individual. Consulta al IMSS antes de pagar Modalidad 40 o tomar una decisión irreversible.']
    ], source: ['IMSS: requisitos de pensión de cesantía', 'https://www.imss.gob.mx/node/97282'],
    links: ['pension-imss-ley-73', 'semanas-cotizadas-pension-imss', 'modalidad-40-imss']
  },
  {
    slug: 'recibo-de-aguinaldo', title: 'Recibo de aguinaldo: cómo revisar días, ISR y pago neto',
    description: 'Aprende a leer un recibo de aguinaldo: salario diario, días pagados, monto bruto, parte exenta de ISR, retención y depósito neto.',
    lead: 'El recibo de aguinaldo permite verificar de dónde sale el pago, no sólo cuánto llegó al banco. Compara días reconocidos, salario usado, deducciones y depósito.',
    sections: [
      ['Datos que debes encontrar', 'Revisa periodo, salario diario ordinario, días de aguinaldo reconocidos y monto bruto. Si trabajaste menos de un año, confirma que se utilizó la proporción de tiempo efectivamente laborado y las prestaciones pactadas.'],
      ['ISR y neto', 'Separa el monto exento del gravado y la retención de ISR. El monto depositado puede ser menor al bruto por la retención; eso no significa por sí mismo que falten días. Compara con la nómina y solicita aclaración si el desglose no coincide.'],
      ['Si hay diferencias', 'Conserva contrato, recibos y comprobante de depósito. Pide al empleador la explicación del cálculo y acude a PROFEDET si persiste una diferencia en una prestación que te corresponde.']
    ], source: ['PROFEDET: preguntas frecuentes sobre aguinaldo', 'https://profedet.gob.mx/prensa/preguntas_aguinaldo.html'],
    links: ['dias-de-aguinaldo', 'aguinaldo-isr-2026', 'calculadoras/aguinaldo']
  },
  {
    slug: 'faltas-afectan-aguinaldo', title: '¿Las faltas afectan el aguinaldo? Qué revisar en el cálculo',
    description: 'Descubre cuándo las faltas pueden cambiar el aguinaldo proporcional y por qué no deben confundirse con vacaciones o incapacidades.',
    lead: 'Para saber si una ausencia afecta el aguinaldo, importa cómo se registró: falta injustificada, permiso, incapacidad o periodo que se considera tiempo laborado. No todas las ausencias reciben el mismo tratamiento.',
    sections: [
      ['Faltas injustificadas', 'El aguinaldo se vincula con el tiempo laborado. Si el empleador descuenta días por ausencias injustificadas, pide el desglose de fechas y la base de cálculo; evita aceptar una resta global sin explicación.'],
      ['No confundas una incapacidad', 'Las incapacidades tienen reglas propias. PROFEDET señala expresamente que un accidente de trabajo no elimina el derecho al aguinaldo completo por el periodo de incapacidad temporal. Otros supuestos requieren revisar el documento y el caso concreto.'],
      ['Cómo verificar tu pago', 'Compara asistencia, nóminas, contrato y días anuales de aguinaldo. Estima el monto con los días reconocidos y solicita una aclaración por escrito si hay diferencia. PROFEDET puede orientar sobre el caso específico.']
    ], source: ['PROFEDET: preguntas frecuentes sobre aguinaldo', 'https://profedet.gob.mx/prensa/preguntas_aguinaldo.html'],
    links: ['incapacidades-afectan-aguinaldo', 'aguinaldo-proporcional', 'calculadoras/aguinaldo']
  }
];

const clean = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const route = slug => slug.startsWith('calculadoras/') ? `/${slug}.html` : `/articulos/${slug}.html`;
const labels = Object.fromEntries(guides.map(g => [g.slug, g.title]));
const related = g => `<ul>${g.links.map(slug => `<li><a href="${route(slug)}">${clean(labels[slug] || slug.replaceAll('-', ' '))}</a></li>`).join('')}</ul>`;

for (const g of guides) {
  const url = `${base}/articulos/${g.slug}.html`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      {'@type': 'Article', headline: g.title, description: g.description, url, datePublished: today, dateModified: today, inLanguage: 'es-MX', author: {'@type': 'Organization', name: 'Calculadoras México'}, publisher: {'@type': 'Organization', name: 'Calculadoras México'}, mainEntityOfPage: url},
      {'@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${base}/` }, { '@type': 'ListItem', position: 2, name: 'Artículos', item: `${base}/articulos.html` }, { '@type': 'ListItem', position: 3, name: g.title, item: url }]}
    ]
  };
  const sections = g.sections.map(([heading, text]) => `<section><h2>${clean(heading)}</h2><p>${clean(text)}</p></section>`).join('');
  const html = `<!DOCTYPE html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${clean(g.title)} | Calculadoras México</title><meta name="description" content="${clean(g.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${url}"><link rel="icon" href="/assets/img/favicon.svg"><meta property="og:type" content="article"><meta property="og:title" content="${clean(g.title)}"><meta property="og:description" content="${clean(g.description)}"><meta property="og:url" content="${url}"><link rel="stylesheet" href="/styles-v5628.css?v=5.6.28"><link rel="stylesheet" href="/assets/css/interface-v570.css?v=5.7.0"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1606770348282610" crossorigin="anonymous"></script></head><body class="ziro-site cm-ui"><a class="skip" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="header-inner"><a class="brand" href="/"><img src="/assets/img/logo-mark.svg" alt="" width="40" height="40"><span class="cm-wordmark">Calculadoras<strong>México</strong></span></a><nav class="main-nav" aria-label="Navegación principal"><a href="/">Inicio</a><a href="/calculadoras.html">Calculadoras</a><a href="/articulos.html">Artículos</a></nav></div></header><main id="contenido" class="page-wrap"><nav class="breadcrumb" aria-label="Ruta"><a href="/">Inicio</a> › <a href="/articulos.html">Artículos</a> › ${clean(g.title)}</nav><header class="page-head"><span class="badge">Guía práctica</span><h1>${clean(g.title)}</h1><p>${clean(g.description)}</p></header><div class="article-layout"><article class="article"><p class="article-meta">Actualizado el 21 de septiembre de 2026</p><p><strong>${clean(g.lead)}</strong></p>${sections}<section><h2>Fuentes y alcance</h2><p>Consulta <a href="${g.source[1]}" target="_blank" rel="noopener noreferrer">${clean(g.source[0])}</a>. Información orientativa; verifica tu expediente, reglas y documentación directamente con la institución competente antes de decidir o tramitar.</p></section></article><aside class="side-box"><h2>Guías relacionadas</h2>${related(g)}<p><a href="/articulos.html">Ver todo el blog</a></p></aside></div></main><footer class="footer"><div class="footer-bottom">© 2026 Calculadoras México. <span>Información orientativa.</span></div></footer><script defer src="/assets/js/common.js?v=5.7.0"></script><script defer src="/assets/js/interface-v570.js?v=5.7.0"></script></body></html>`;
  const file = path.join('articulos', `${g.slug}.html`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, html, 'utf8');
}

const markerStart = '<!-- AFORERETIRO_SEO_2026_START -->';
const markerEnd = '<!-- AFORERETIRO_SEO_2026_END -->';
function upsertBefore(file, needle, block) {
  let html = fs.readFileSync(file, 'utf8');
  const regex = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, 'g');
  html = html.replace(regex, '');
  if (!html.includes(needle)) throw new Error(`No se encontró inserción en ${file}`);
  html = html.replace(needle, `${markerStart}${block}${markerEnd}${needle}`);
  fs.writeFileSync(file, html, 'utf8');
}

const pensionGuides = guides.filter(g => !['recibo-de-aguinaldo', 'faltas-afectan-aguinaldo'].includes(g.slug));
const hub = `<section class="content-box" id="guias-afore-pension"><h2>AFORE y pensión IMSS</h2><p>Guías de localización de cuenta, ahorro, Modalidad 40 y diferencias entre regímenes de pensión.</p><ul>${pensionGuides.map(g => `<li><a href="/articulos/${g.slug}.html">${clean(g.title)}</a></li>`).join('')}</ul></section>`;
const aguinaldoHub = `<section class="content-box"><h2>Más dudas sobre el aguinaldo</h2><ul><li><a href="/articulos/recibo-de-aguinaldo.html">Cómo revisar el recibo de aguinaldo</a></li><li><a href="/articulos/faltas-afectan-aguinaldo.html">Si las faltas afectan el aguinaldo</a></li></ul></section>`;
upsertBefore('articulos.html', '</main>', hub + aguinaldoHub);
for (const file of ['articulos/pension-imss-ley-73.html', 'articulos/semanas-cotizadas-pension-imss.html', 'articulos/cuenta-ahorro-para-retiro.html']) {
  if (fs.existsSync(file)) upsertBefore(file, '</main>', `<section class="content-box"><h2>Continúa con AFORE y pensión</h2><p><a href="/articulos/como-saber-en-que-afore-estoy.html">Localizar tu AFORE</a> · <a href="/articulos/retiro-por-desempleo-afore.html">Retiro por desempleo y semanas cotizadas</a> · <a href="/articulos/pension-imss-ley-97.html">Pensión Ley 97</a> · <a href="/articulos/conservacion-derechos-imss-ley-73.html">Conservación de derechos Ley 73</a> · <a href="/articulos/modalidad-40-imss.html">Modalidad 40</a></p></section>`);
}
const aguinaldoReinforcement = {
  'articulos/dias-de-aguinaldo.html': '<section class="content-box"><h2>¿Y si el contrato ofrece 40 días?</h2><p>Quince días son el mínimo general de la Ley Federal del Trabajo; una empresa puede ofrecer 30, 40 u otra cantidad superior mediante contrato o convenio. Confirma cuántos días te corresponden antes de multiplicar por tu salario diario. La noticia de una propuesta de reforma no cambia por sí sola el mínimo legal.</p><p><a href="/articulos/aguinaldo-30-dias-aprobado-vigencia.html">Revisar la situación de los 30 días</a></p></section>',
  'articulos/cuando-se-paga-aguinaldo.html': '<section class="content-box"><h2>Fecha de pago y recibo</h2><p>Si buscas cuándo cae el aguinaldo 2026, distingue la fecha límite legal de la fecha concreta de depósito de tu empleador. Cuando lo recibas, compara el importe neto con los días reconocidos, el salario diario y la retención que aparezcan en el comprobante.</p><p><a href="/articulos/recibo-de-aguinaldo.html">Cómo revisar el recibo de aguinaldo</a></p></section>',
  'articulos/aguinaldo-isr-2026.html': '<section class="content-box"><h2>Cómo se refleja el ISR en el recibo</h2><p>El comprobante debe permitir distinguir el aguinaldo bruto, la parte exenta, la porción gravada y la retención. No compares sólo el depósito neto con la fórmula laboral: el ISR se determina aparte. Si los conceptos no están claros, solicita el desglose de nómina.</p><p><a href="/articulos/recibo-de-aguinaldo.html">Leer el recibo paso a paso</a></p></section>',
  'articulos/incapacidades-afectan-aguinaldo.html': '<section class="content-box"><h2>Incapacidad no es lo mismo que falta</h2><p>Una incapacidad documentada y una falta injustificada son supuestos distintos. PROFEDET señala que el accidente de trabajo no elimina el derecho al aguinaldo del periodo de incapacidad temporal. Para otras ausencias, revisa el documento y el tiempo reconocido por nómina.</p><p><a href="/articulos/faltas-afectan-aguinaldo.html">Revisar el caso de las faltas</a></p></section>',
  'calculadoras/aguinaldo.html': '<section class="content-box"><h2>Antes de capturar los días</h2><p>Usa los días de aguinaldo previstos en tu contrato, no una propuesta de reforma. Después verifica las fechas y el salario diario; al recibir el pago, el recibo puede mostrar una retención de ISR que explique la diferencia entre bruto y neto.</p><p><a href="/articulos/recibo-de-aguinaldo.html">Entender el recibo</a> · <a href="/articulos/faltas-afectan-aguinaldo.html">Revisar ausencias</a></p></section>'
};
for (const [file, block] of Object.entries(aguinaldoReinforcement)) {
  // Su contenido ya está integrado en una versión editorial consolidada.
  if (file === 'articulos/dias-de-aguinaldo.html') continue;
  if (fs.existsSync(file)) upsertBefore(file, '</main>', block + aguinaldoHub);
}

const sitemapFile = 'sitemap-seo-2026.xml';
let xml = fs.readFileSync(sitemapFile, 'utf8');
const entries = guides.filter(g => !xml.includes(`${base}/articulos/${g.slug}.html`)).map(g => `  <url><loc>${base}/articulos/${g.slug}.html</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>`).join('\n');
if (entries) xml = xml.replace('</urlset>', `${entries}\n</urlset>`);
fs.writeFileSync(sitemapFile, xml, 'utf8');

console.log(`Páginas nuevas: ${guides.length}; sitemap actualizado; hubs y enlaces añadidos.`);
