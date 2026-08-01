import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://calculadora-isr-mexico.vercel.app';
const calculators = [
  ['isr','ISR 2026','Impuestos','🧾','Estima el ISR y el salario neto por periodo.',[
    ['number','salario','Ingreso bruto del periodo','20000','0.01','0.01'],
    ['select','periodo','Periodo de pago',[['mensual','Mensual'],['quincenal','Quincenal'],['semanal','Semanal']]]
  ]],
  ['aguinaldo','Aguinaldo','Prestaciones','🎁','Calcula aguinaldo completo o proporcional.',[
    ['number','salario','Salario mensual','15000','0.01','0.01'],['number','diasAguinaldo','Días de aguinaldo','15','1','1'],['number','diasTrabajados','Días trabajados en el año','365','1','1']
  ]],
  ['vacaciones','Vacaciones','Prestaciones','🏖️','Consulta días y prima vacacional estimada.',[
    ['number','salario','Salario mensual','15000','0.01','0.01'],['number','anios','Años de antigüedad','1','1','1'],['number','prima','Prima vacacional (%)','25','0','0.01']
  ]],
  ['iva','IVA','Impuestos','🧮','Agrega, quita o calcula el IVA.',[
    ['number','cantidad','Cantidad','1000','0.01','0.01'],['number','tasa','Tasa de IVA (%)','16','0','0.01'],['select','operacion','Operación',[['agregar','Agregar IVA'],['quitar','Quitar IVA'],['calcular','Calcular solo el impuesto']]]
  ]],
  ['finiquito','Finiquito','Prestaciones','📄','Estima prestaciones pendientes al terminar una relación laboral.',[
    ['number','salario','Salario mensual','15000','0.01','0.01'],['number','diasPendientes','Días de sueldo pendientes','5','0','1'],['number','diasAnio','Días trabajados del año','180','0','1'],['number','vacacionesPendientes','Días de vacaciones pendientes','6','0','0.01'],['number','diasAguinaldo','Días anuales de aguinaldo','15','0','0.01'],['number','prima','Prima vacacional (%)','25','0','0.01']
  ]],
  ['horas-extra','Horas extra','Nómina','⏱️','Calcula una referencia de pago doble y triple.',[
    ['number','salario','Salario mensual','15000','0.01','0.01'],['number','horas','Horas extra de la semana','4','0','0.5'],['number','jornada','Horas de la jornada diaria','8','1','0.5']
  ]],
  ['salario-diario','Salario diario','Nómina','📆','Convierte un ingreso a salario diario.',[
    ['number','salario','Ingreso del periodo','15000','0.01','0.01'],['select','periodo','Periodo',[['mensual','Mensual'],['quincenal','Quincenal'],['semanal','Semanal']]]
  ]],
  ['descuento','Descuento','Finanzas','🏷️','Calcula ahorro y precio final.',[
    ['number','precio','Precio original','1000','0.01','0.01'],['number','porcentaje','Descuento (%)','20','0','0.01']
  ]],
  ['salario-neto','Salario neto','Nómina','💵','Resta deducciones al salario bruto.',[
    ['number','salario','Salario bruto','20000','0.01','0.01'],['number','isrManual','ISR','2500','0','0.01'],['number','imss','IMSS u otras cuotas','500','0','0.01'],['number','otras','Otras deducciones','0','0','0.01']
  ]],
  ['salario-bruto','Salario bruto','Nómina','🧾','Suma deducciones al ingreso neto.',[
    ['number','neto','Salario neto','16000','0.01','0.01'],['number','deducciones','Deducciones totales','4000','0','0.01']
  ]],
  ['salario-diario-integrado','Salario diario integrado','Nómina','📊','Estima el SDI con prestaciones básicas.',[
    ['number','salarioDiario','Salario diario','500','0.01','0.01'],['number','diasAguinaldo','Días de aguinaldo','15','0','0.01'],['number','diasVacaciones','Días de vacaciones','12','0','0.01'],['number','prima','Prima vacacional (%)','25','0','0.01']
  ]],
  ['prima-dominical','Prima dominical','Nómina','🌞','Calcula una referencia por domingos trabajados.',[
    ['number','salarioDiario','Salario diario','500','0.01','0.01'],['number','domingos','Domingos trabajados','4','0','1'],['number','porcentaje','Prima (%)','25','0','0.01']
  ]],
  ['prima-vacacional','Prima vacacional','Prestaciones','🏝️','Estima la prima sobre tus días de descanso.',[
    ['number','salarioDiario','Salario diario','500','0.01','0.01'],['number','dias','Días de vacaciones','12','0','0.01'],['number','prima','Prima vacacional (%)','25','0','0.01']
  ]],
  ['aguinaldo-proporcional','Aguinaldo proporcional','Prestaciones','🎄','Estima el aguinaldo por una parte del año.',[
    ['number','salarioDiario','Salario diario','500','0.01','0.01'],['number','diasAguinaldo','Días anuales de aguinaldo','15','0','0.01'],['number','diasTrabajados','Días trabajados','180','0','1']
  ]],
  ['vacaciones-proporcionales','Vacaciones proporcionales','Prestaciones','🗓️','Calcula vacaciones y prima por una fracción del año.',[
    ['number','salarioDiario','Salario diario','500','0.01','0.01'],['number','diasAnuales','Días anuales de vacaciones','12','0','0.01'],['number','diasTrabajados','Días trabajados','180','0','1'],['number','prima','Prima vacacional (%)','25','0','0.01']
  ]],
  ['liquidacion','Liquidación laboral','Prestaciones','⚖️','Simula conceptos comunes de liquidación.',[
    ['number','salarioDiario','Salario diario','500','0.01','0.01'],['number','anios','Años trabajados','3','0','0.01'],['number','diasPendientes','Días de sueldo pendientes','0','0','1'],['select','incluir20','Incluir 20 días por año',[['si','Sí'],['no','No']]]
  ]],
  ['ptu','PTU','Prestaciones','🏭','Distribuye una bolsa usando días y salario.',[
    ['number','bolsa','Bolsa total de PTU','100000','0.01','0.01'],['number','diasPersona','Días de la persona','300','0','1'],['number','diasTotal','Días de todas las personas','5000','0.01','1'],['number','salarioPersona','Salario acumulado de la persona','180000','0','0.01'],['number','salarioTotal','Salario acumulado total','3000000','0.01','0.01']
  ]],
  ['retencion-iva','Retención de IVA','Impuestos','🧮','Calcula retención sobre el IVA causado.',[
    ['number','subtotal','Subtotal','10000','0.01','0.01'],['number','tasaIva','Tasa de IVA (%)','16','0','0.01'],['number','retencion','Porcentaje del IVA retenido','66.6667','0','0.0001']
  ]],
  ['iva-incluido','IVA incluido','Impuestos','🧾','Separa subtotal e IVA de un precio final.',[
    ['number','total','Precio con IVA','1160','0.01','0.01'],['number','tasa','Tasa de IVA (%)','16','0','0.01']
  ]],
  ['porcentaje','Porcentajes','Herramientas','％','Calcula porcentajes y cambios porcentuales.',[
    ['select','operacion','Operación',[['de','X% de Y'],['representa','X representa qué % de Y'],['cambio','Cambio de X a Y']]],['number','x','Valor X','20','','0.01'],['number','y','Valor Y','100','','0.01']
  ]],
  ['aumento-salarial','Aumento salarial','Finanzas','📈','Conoce el nuevo salario tras un aumento.',[
    ['number','salario','Salario actual','15000','0.01','0.01'],['number','porcentaje','Aumento (%)','10','0','0.01']
  ]],
  ['comision','Comisión','Finanzas','🤝','Calcula comisión e ingreso total.',[
    ['number','ventas','Ventas','50000','0','0.01'],['number','porcentaje','Comisión (%)','5','0','0.01'],['number','base','Pago base','8000','0','0.01']
  ]],
  ['interes-simple','Interés simple','Finanzas','💰','Calcula interés sin capitalización.',[
    ['number','capital','Capital inicial','10000','0.01','0.01'],['number','tasa','Tasa anual (%)','10','0','0.01'],['number','meses','Plazo en meses','12','0','1']
  ]],
  ['interes-compuesto','Interés compuesto','Finanzas','📈','Proyecta capital con reinversión de intereses.',[
    ['number','capital','Capital inicial','10000','0.01','0.01'],['number','tasa','Tasa anual (%)','10','0','0.01'],['number','anios','Años','5','0','0.01'],['select','frecuencia','Capitalizaciones por año',[['1','Anual'],['12','Mensual'],['365','Diaria']]]
  ]],
  ['prestamo','Préstamo','Finanzas','🏦','Estima mensualidad, intereses y pago total.',[
    ['number','monto','Monto del préstamo','100000','0.01','0.01'],['number','tasa','Tasa anual (%)','18','0','0.01'],['number','meses','Plazo en meses','36','1','1']
  ]],
  ['ahorro-mensual','Ahorro mensual','Finanzas','🐷','Proyecta ahorro con aportaciones periódicas.',[
    ['number','inicial','Ahorro inicial','10000','0','0.01'],['number','aportacion','Aportación mensual','2000','0','0.01'],['number','tasa','Rendimiento anual (%)','8','0','0.01'],['number','meses','Plazo en meses','60','0','1']
  ]],
  ['regla-tres','Regla de tres','Herramientas','✖️','Encuentra un valor proporcional desconocido.',[
    ['number','a','Valor A','10','','0.01'],['number','b','Valor B','25','','0.01'],['number','c','Valor C','8','','0.01']
  ]],
  ['edad','Edad exacta','Herramientas','🎂','Calcula años, meses y días entre dos fechas.',[
    ['date','fechaNacimiento','Fecha inicial','2000-01-01'],['date','fechaFinal','Fecha final','2026-07-31']
  ]],
  ['diferencia-fechas','Diferencia entre fechas','Herramientas','📅','Obtén días y semanas entre dos fechas.',[
    ['date','fechaInicio','Fecha inicial','2026-01-01'],['date','fechaFin','Fecha final','2026-07-31']
  ]],
  ['propina','Propina','Herramientas','🧾','Calcula propina, total y monto por persona.',[
    ['number','cuenta','Total de la cuenta','1000','0.01','0.01'],['number','propinaPct','Propina (%)','10','0','0.01'],['number','personas','Número de personas','2','1','1']
  ]],
  ['margen-ganancia','Margen de ganancia','Negocios','📊','Calcula utilidad y margen sobre ventas.',[
    ['number','costo','Costo total','700','0','0.01'],['number','venta','Precio de venta','1000','0.01','0.01']
  ]],
  ['precio-venta','Precio de venta','Negocios','🏷️','Calcula un precio aplicando aumento sobre costo.',[
    ['number','costo','Costo del producto','700','0','0.01'],['number','aumento','Aumento sobre costo (%)','30','0','0.01']
  ]],
  ['punto-equilibrio','Punto de equilibrio','Negocios','⚖️','Estima unidades necesarias para cubrir costos.',[
    ['number','costosFijos','Costos fijos','20000','0','0.01'],['number','precioUnidad','Precio por unidad','250','0.01','0.01'],['number','costoVariable','Costo variable por unidad','150','0','0.01']
  ]],
  ['roi','Retorno de inversión (ROI)','Negocios','📈','Calcula ganancia neta y retorno porcentual.',[
    ['number','inversion','Inversión inicial','10000','0.01','0.01'],['number','valorFinal','Valor final obtenido','12500','0','0.01']
  ]],
  ['inflacion','Impacto de inflación','Finanzas','📉','Estima valor futuro y poder adquisitivo.',[
    ['number','cantidad','Cantidad actual','10000','0.01','0.01'],['number','inflacionPct','Inflación anual estimada (%)','4','0','0.01'],['number','anios','Años','5','0','0.01']
  ]],
  ['ahorro-meta','Ahorro para una meta','Finanzas','🎯','Calcula cuánto ahorrar cada mes.',[
    ['number','meta','Meta de ahorro','100000','0.01','0.01'],['number','actual','Ahorro actual','10000','0','0.01'],['number','meses','Meses disponibles','24','1','1']
  ]],
  ['tiempo-ahorro','Tiempo para ahorrar','Finanzas','⏳','Estima meses necesarios para alcanzar una meta.',[
    ['number','meta','Meta de ahorro','100000','0.01','0.01'],['number','actual','Ahorro actual','10000','0','0.01'],['number','aportacion','Aportación mensual','3000','0.01','0.01']
  ]],
  ['credito-automotriz','Crédito automotriz','Créditos','🚗','Estima enganche, mensualidad e intereses.',[
    ['number','precioAuto','Precio del automóvil','300000','0.01','0.01'],['number','enganchePct','Enganche (%)','20','0','0.01'],['number','tasa','Tasa anual (%)','16','0','0.01'],['number','meses','Plazo en meses','48','1','1']
  ]],
  ['hipoteca','Hipoteca','Créditos','🏠','Estima mensualidad y costo de un crédito hipotecario.',[
    ['number','precioCasa','Precio de la vivienda','1500000','0.01','0.01'],['number','enganchePct','Enganche (%)','20','0','0.01'],['number','tasa','Tasa anual (%)','11','0','0.01'],['number','anios','Plazo en años','20','1','1']
  ]],
  ['pago-quincenal','Pago quincenal','Nómina','📆','Convierte salario mensual a quincenal y diario.',[
    ['number','salario','Salario mensual','15000','0.01','0.01']
  ]],
  ['salario-hora','Salario por hora','Nómina','⏰','Convierte salario mensual en pago por hora.',[
    ['number','salario','Salario mensual','15000','0.01','0.01'],['number','diasMes','Días trabajados al mes','26','1','1'],['number','horasDia','Horas por día','8','0.5','0.5']
  ]],
  ['bono','Bono','Nómina','🎁','Calcula bono bruto y total con salario.',[
    ['number','salario','Salario base','15000','0','0.01'],['number','bonoPct','Bono (%)','10','0','0.01']
  ]],
  ['reparto-cuenta','Dividir una cuenta','Herramientas','👥','Divide un total entre varias personas.',[
    ['number','total','Total a dividir','1200','0','0.01'],['number','personas','Número de personas','4','1','1']
  ]],
  ['precio-sin-descuento','Precio antes del descuento','Herramientas','🔖','Recupera el precio original desde el precio final.',[
    ['number','precioFinal','Precio pagado','800','0.01','0.01'],['number','descuentoPct','Descuento aplicado (%)','20','0','0.01']
  ]],
  ['tasa-efectiva','Tasa efectiva anual','Finanzas','％','Convierte una tasa nominal en efectiva.',[
    ['number','tasaNominal','Tasa nominal anual (%)','12','0','0.01'],['number','frecuencia','Capitalizaciones por año','12','1','1']
  ]],
  ['rendimiento-anualizado','Rendimiento anualizado','Finanzas','📈','Anualiza el rendimiento de un periodo.',[
    ['number','capitalInicial','Capital inicial','10000','0.01','0.01'],['number','capitalFinal','Capital final','11000','0.01','0.01'],['number','dias','Duración en días','180','1','1']
  ]],
  ['cetes','Rendimiento de CETES','Finanzas','🇲🇽','Estima rendimiento usando precio y valor nominal.',[
    ['number','precio','Precio de compra por título','9.70','0.01','0.0001'],['number','valorNominal','Valor nominal','10','0.01','0.0001'],['number','titulos','Número de títulos','1000','1','1'],['number','dias','Plazo en días','28','1','1']
  ]],
  ['costo-unidad','Costo por unidad','Negocios','📦','Distribuye costos totales entre unidades.',[
    ['number','costosFijos','Costos fijos','10000','0','0.01'],['number','costosVariables','Costos variables totales','5000','0','0.01'],['number','unidades','Unidades producidas','100','1','1']
  ]],
  ['conversion-longitud','Conversor de longitud','Herramientas','📏','Convierte metros, kilómetros, pies y millas.',[
    ['number','cantidad','Cantidad','1','','0.0001'],['select','origen','Unidad de origen',[['m','Metros'],['km','Kilómetros'],['ft','Pies'],['mi','Millas']]],['select','destino','Unidad de destino',[['km','Kilómetros'],['m','Metros'],['ft','Pies'],['mi','Millas']]]
  ]],
  ['costo-combustible','Costo de combustible','Herramientas','⛽','Estima litros y costo de un recorrido.',[
    ['number','distancia','Distancia del recorrido (km)','300','0','0.01'],['number','rendimiento','Rendimiento (km/l)','12','0.01','0.01'],['number','precioLitro','Precio por litro','24','0','0.01']
  ]]
];

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const fields = list => list.map(field => {
  if (field[0] === 'select') return `<div class="form-group"><label for="${field[1]}">${field[2]}</label><select id="${field[1]}">${field[3].map(option => `<option value="${option[0]}">${option[1]}</option>`).join('')}</select></div>`;
  const type = field[0] === 'date' ? 'date' : 'number';
  const numeric = type === 'number';
  return `<div class="form-group"><label for="${field[1]}">${field[2]}</label><input id="${field[1]}" type="${type}" value="${field[3]}" ${numeric && field[4] !== '' ? `min="${field[4]}"` : ''} ${numeric ? `step="${field[5]}" inputmode="decimal"` : ''}></div>`;
}).join('');

const searchDialog = `<div class="search-dialog" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Buscador"><div class="search-panel"><div class="search-head"><input class="global-search" type="search" placeholder="Busca ISR, finiquito, IVA..." aria-label="Buscar en el sitio"><button class="icon-button modal-close" type="button" data-search-close aria-label="Cerrar">✕</button></div><div class="search-results"></div></div></div>`;
const header = (depth = '', active = '') => `<a class="skip" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="header-inner"><a class="brand" href="${depth}index.html" aria-label="Ir al inicio"><img class="logo-img" src="${depth}assets/img/logo.svg" width="280" height="60" alt="Calculadoras México"></a><nav class="main-nav" aria-label="Navegación principal"><a href="${depth}index.html" class="${active === 'inicio' ? 'active' : ''}">Inicio</a><a href="${depth}calculadoras.html" class="${active === 'calculadoras' ? 'active' : ''}">Calculadoras</a><a href="${depth}articulos.html" class="${active === 'articulos' ? 'active' : ''}">Artículos</a><a href="${depth}acerca-de.html">Acerca de</a><a href="${depth}contacto.html">Contacto</a></nav><div class="header-actions"><button class="icon-button" type="button" data-search-open aria-label="Abrir buscador" title="Buscar (Ctrl+K)">⌕</button><button class="icon-button" type="button" data-theme-toggle aria-label="Cambiar tema"><span data-theme-icon>🌙</span></button><button class="icon-button menu-toggle" type="button" data-menu-toggle aria-label="Abrir menú" aria-expanded="false">☰</button></div></div></header>`;
const footer = depth => `<footer class="footer"><div class="footer-grid"><div><h2>Calculadoras México</h2><p>Herramientas gratuitas y guías claras. Tus favoritos e historial permanecen en tu dispositivo.</p></div><div><h3>Calculadoras</h3><a href="${depth}calculadoras/isr.html">ISR</a><a href="${depth}calculadoras/aguinaldo.html">Aguinaldo</a><a href="${depth}calculadoras/iva.html">IVA</a><a href="${depth}calculadoras.html">Ver todas</a></div><div><h3>Aprende</h3><a href="${depth}articulos.html">Todos los artículos</a><a href="${depth}articulos/que-es-el-isr.html">¿Qué es el ISR?</a><a href="${depth}articulos/salario-bruto-neto.html">Salario bruto y neto</a></div><div><h3>Información</h3><a href="${depth}acerca-de.html">Acerca de</a><a href="${depth}privacidad.html">Privacidad</a><a href="${depth}terminos.html">Términos</a><a href="${depth}contacto.html">Contacto</a></div></div><div class="footer-bottom">© 2026 Calculadoras México.<span>Resultados informativos; no sustituyen asesoría profesional.</span></div></footer>${searchDialog}<script src="${depth}assets/js/catalog.js"></script><script src="${depth}assets/js/common.js"></script><script defer src="/_vercel/insights/script.js"></script>`;
const head = (title, description, canonical, depth = '') => `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${site}/${canonical}"><link rel="icon" href="${depth}assets/img/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0b57d0"><meta property="og:locale" content="es_MX"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${site}/${canonical}"><meta property="og:site_name" content="Calculadoras México"><meta property="og:image" content="${site}/assets/img/og-image.png"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="${depth}assets/css/styles.css"><script>document.documentElement.dataset.theme=localStorage.getItem('cm-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')</script></head>`;

function calculatorPage(calc) {
  const [slug, title, category, icon, description, inputs] = calc;
  const scripts = slug === 'isr' ? '<script src="../assets/js/tablas.js"></script>' : '';
  const schema = JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebApplication","name":`Calculadora de ${title}`,"url":`${site}/calculadoras/${slug}.html`,"applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"MXN"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":`${site}/`},{"@type":"ListItem","position":2,"name":"Calculadoras","item":`${site}/calculadoras.html`},{"@type":"ListItem","position":3,"name":title,"item":`${site}/calculadoras/${slug}.html`}]}]});
  return `${head(`Calculadora de ${title} 2026 | Calculadoras México`, description, `calculadoras/${slug}.html`, '../')}<body data-calc="${slug}">${header('../','calculadoras')}<main id="contenido"><nav class="breadcrumb"><a href="../index.html">Inicio</a><span>›</span><a href="../calculadoras.html">Calculadoras</a><span>›</span><span>${title}</span></nav><div class="page-wrap"><header class="page-head"><span class="category-hero-icon">${icon}</span><span class="badge">${category}</span><h1>Calculadora de ${title}</h1><p>${description}</p><button class="favorite-page" type="button" data-favorite="${slug}" aria-pressed="false"><span data-favorite-icon>☆</span> <span data-favorite-label>Guardar</span></button></header><div class="calc-layout"><section class="calc-box" aria-label="Formulario de cálculo">${fields(inputs)}<div class="calc-controls"><button class="calc-button" type="button">Calcular</button><button class="reset-button" type="button" data-form-reset>Limpiar</button></div><small class="form-state" data-form-state>Los datos se guardan automáticamente en este dispositivo.</small><div class="result" aria-live="polite"><span>Completa los datos y presiona Calcular.</span></div></section><aside class="side-box"><h2>Portal V3 — Fase 4</h2><ul><li>Forma parte de un catálogo de 50 herramientas.</li><li>Recupera y comparte tus escenarios.</li><li>Visualiza y compara resultados.</li><li>Exporta, copia o imprime el desglose.</li></ul><p class="privacy-note">🔒 Los datos se procesan en tu navegador y no se envían a un servidor.</p></aside></div><section class="content-box"><h2>Cómo usar esta calculadora</h2><p>Ingresa tus datos, revisa que correspondan al periodo indicado y presiona <strong>Calcular</strong>. El resultado es una estimación informativa para ayudarte a comprender el cálculo.</p><h2>Importante</h2><p>Las reglas fiscales, laborales y financieras pueden depender de circunstancias particulares. Verifica cifras oficiales o consulta a un profesional cuando tomes una decisión relevante.</p></section></div></main>${footer('../')}${scripts}<script src="../assets/js/calculators.js"></script><script type="application/ld+json">${schema}</script></body></html>`;
}

function home() {
  return `${head('Calculadoras México: 50 herramientas gratuitas','Calculadoras gratuitas para trabajo, impuestos, negocios y finanzas personales en México.','')}<body>${header('','inicio')}<main id="contenido"><section class="hero"><div class="hero-inner"><div><span class="eyebrow">Actualizado para 2026</span><h1>Tus cálculos, más claros.</h1><p>50 calculadoras gratuitas para entender nómina, prestaciones, impuestos, negocios y finanzas sin registro.</p><div class="hero-actions"><button class="btn btn-primary" type="button" data-search-open>Buscar calculadora →</button><a class="btn btn-secondary" href="calculadoras.html">Explorar todas</a></div></div><aside class="hero-panel"><strong>El portal sigue creciendo</strong><ul><li>24 calculadoras nuevas</li><li>Datos y escenarios compartibles</li><li>Gráficas y comparaciones</li><li>Favoritos e historial local</li></ul></aside></div></section><div class="quick-strip"><div class="quick-strip-inner"><div class="quick-item"><strong>50</strong><span>calculadoras</span></div><div class="quick-item"><strong>100%</strong><span>gratuitas</span></div><div class="quick-item"><strong>0</strong><span>registros necesarios</span></div><div class="quick-item"><strong>Local</strong><span>favoritos e historial</span></div></div></div><section class="section"><div class="container"><div class="section-title"><span class="badge">Más utilizadas</span><h2>Empieza por una popular</h2><p>Accesos rápidos a las herramientas más consultadas.</p></div><div class="grid" data-popular></div></div></section><section class="section alt"><div class="container"><div class="section-title"><span class="badge">Fase 4</span><h2>24 calculadoras nuevas</h2><p>Nuevas herramientas de finanzas, nómina, negocios y uso diario.</p></div><div class="grid" data-new></div><p class="section-cta"><a class="btn btn-primary standalone" href="calculadoras.html">Ver las 50 calculadoras</a></p></div></section><section class="section"><div class="container"><div class="section-title"><span class="badge">Tu espacio</span><h2>Favoritas y recientes</h2><p>Se guardan solamente en tu navegador.</p></div><div class="personal-tabs"><h3>★ Favoritas</h3><div class="grid personal-grid" data-favorites-list></div><h3>🕘 Vistas recientemente</h3><div class="grid personal-grid" data-recent-list></div></div></div></section><section class="section alt"><div class="container"><div class="section-title"><span class="badge">Historial</span><h2>Tus últimos cálculos</h2><p>Regresa rápido al resultado que necesites.</p></div><div class="personal-panel"><div class="history-head"><h3>Actividad en este dispositivo</h3><button type="button" class="text-button" data-history-clear>Limpiar historial</button></div><div data-history-list></div></div></div></section><section class="section"><div class="container"><div class="trust"><div class="trust-item"><div class="icon">🔒</div><strong>Privado por diseño</strong><p>Los cálculos se realizan dentro del navegador.</p></div><div class="trust-item"><div class="icon">⚡</div><strong>Rápido y ligero</strong><p>HTML, CSS y JavaScript sin dependencias pesadas.</p></div><div class="trust-item"><div class="icon">📱</div><strong>Listo para celular</strong><p>Formularios y resultados adaptables.</p></div></div></div></section></main>${footer('')}<script>document.addEventListener('DOMContentLoaded',()=>{const popular=document.querySelector('[data-popular]'),recent=document.querySelector('[data-new]');popular.innerHTML=CM_CATALOG.filter(x=>x.popular).map(x=>calculatorCard(x)).join('');recent.innerHTML=CM_CATALOG.filter(x=>x.new).slice(0,8).map(x=>calculatorCard(x)).join('');updateFavoriteButtons()})</script></body></html>`;
}

function catalogPage() {
  return `${head('50 calculadoras gratuitas | Calculadoras México','Explora 50 calculadoras gratuitas organizadas por nómina, prestaciones, impuestos, negocios y finanzas.','calculadoras.html')}<body>${header('','calculadoras')}<main id="contenido"><div class="page-wrap"><header class="page-head"><span class="badge">50 herramientas</span><h1>Todas las calculadoras</h1><p>Busca por nombre o explora el catálogo completo.</p><form class="search-box category-search"><input id="catalog-search" type="search" placeholder="Filtra ISR, préstamo, aguinaldo..." aria-label="Filtrar calculadoras"></form></header><div class="grid" data-catalog="all"></div><section class="content-box personal-section"><h2>Tu espacio</h2><p>Favoritos y recientes se guardan solamente en este dispositivo.</p><h3>Favoritas</h3><div class="grid personal-grid" data-favorites-list></div><h3>Recientes</h3><div class="grid personal-grid" data-recent-list></div></section></div></main>${footer('')}<script>document.addEventListener('DOMContentLoaded',()=>{const q=document.getElementById('catalog-search');q.addEventListener('input',()=>{const term=q.value.toLowerCase().normalize('NFD').replace(/\\p{Diacritic}/gu,'');document.querySelectorAll('[data-catalog] .card').forEach(card=>card.hidden=!card.dataset.search.normalize('NFD').replace(/\\p{Diacritic}/gu,'').includes(term))})})</script></body></html>`;
}

function simulatorsPage(){
  const input=(id,label,value,step='0.01')=>`<div class="form-group"><label for="${id}">${label}</label><input id="${id}" type="number" value="${value}" min="0" step="${step}" inputmode="decimal"></div>`;
  const schema=JSON.stringify({'@context':'https://schema.org','@type':'WebApplication','name':'Comparadores financieros de Calculadoras México','url':`${site}/simuladores.html`,'applicationCategory':'FinanceApplication','operatingSystem':'Any','offers':{'@type':'Offer','price':'0','priceCurrency':'MXN'}});
  return `${head('Simuladores y comparadores financieros | Calculadoras México','Compara dos salarios, préstamos o planes de ahorro con diferencias y gráficas claras. Herramientas gratuitas y sin registro.','simuladores.html')}<body>${header('','simuladores')}<main id="contenido"><div class="page-wrap"><header class="page-head"><span class="badge">Fase 9</span><h1>Simuladores inteligentes</h1><p>Compara dos escenarios lado a lado y entiende la diferencia antes de tomar una decisión.</p></header><div class="smart-tabs" role="tablist"><button class="active" type="button" data-smart-tab="salary">💼 Salarios</button><button type="button" data-smart-tab="loan">🏦 Préstamos</button><button type="button" data-smart-tab="saving">📈 Ahorro</button></div><section class="smart-panel" data-smart-panel="salary"><h2>Comparador de salarios</h2><p>Compara el ingreso neto después de deducciones estimadas.</p><div class="smart-scenarios"><div class="smart-scenario"><h3>Escenario A</h3>${input('salary-a','Salario bruto mensual','18000')}${input('deductions-a','Deducciones mensuales','2500')}</div><div class="smart-scenario"><h3>Escenario B</h3>${input('salary-b','Salario bruto mensual','22000')}${input('deductions-b','Deducciones mensuales','3500')}</div></div><button class="calc-button" id="compare-salary" type="button">Comparar salarios</button><div class="smart-result" id="salary-result" aria-live="polite"></div></section><section class="smart-panel" data-smart-panel="loan" hidden><h2>Comparador de préstamos</h2><p>Compara mensualidad, intereses y pago total con el mismo importe solicitado.</p>${input('loan-amount','Importe del préstamo','150000')}<div class="smart-scenarios"><div class="smart-scenario"><h3>Escenario A</h3>${input('loan-rate-a','Tasa anual (%)','18')}${input('loan-years-a','Plazo (años)','3','1')}</div><div class="smart-scenario"><h3>Escenario B</h3>${input('loan-rate-b','Tasa anual (%)','15')}${input('loan-years-b','Plazo (años)','4','1')}</div></div><button class="calc-button" id="compare-loan" type="button">Comparar préstamos</button><div class="smart-result" id="loan-result" aria-live="polite"></div></section><section class="smart-panel" data-smart-panel="saving" hidden><h2>Comparador de planes de ahorro</h2><p>Proyecta dos escenarios con aportaciones, plazo y rendimiento diferentes.</p><div class="smart-scenarios"><div class="smart-scenario"><h3>Escenario A</h3>${input('save-initial-a','Ahorro inicial','10000')}${input('save-monthly-a','Aportación mensual','2000')}${input('save-rate-a','Rendimiento anual (%)','6')}${input('save-years-a','Plazo (años)','5','1')}</div><div class="smart-scenario"><h3>Escenario B</h3>${input('save-initial-b','Ahorro inicial','10000')}${input('save-monthly-b','Aportación mensual','2500')}${input('save-rate-b','Rendimiento anual (%)','5')}${input('save-years-b','Plazo (años)','5','1')}</div></div><button class="calc-button" id="compare-saving" type="button">Comparar ahorro</button><div class="smart-result" id="saving-result" aria-live="polite"></div></section><section class="content-box"><h2>Cómo interpretar los escenarios</h2><p>La comparación muestra diferencias matemáticas con los datos proporcionados. No predice tasas futuras ni sustituye cotizaciones, contratos o asesoría profesional.</p></section></div></main>${footer('')}<script src="assets/js/simulators.js" defer></script><script type="application/ld+json">${schema}</script></body></html>`;
}

function offlinePage(){
  return `${head('Sin conexión | Calculadoras México','No hay conexión disponible. Puedes volver al inicio o abrir una página visitada anteriormente desde la caché local.','offline.html')}<body>${header('')}<main id="contenido"><div class="offline-state"><div class="icon">📡</div><h1>Estás sin conexión</h1><p>Algunas páginas visitadas anteriormente pueden seguir disponibles. Revisa tu conexión o vuelve a intentarlo.</p><a class="btn btn-primary standalone" href="index.html">Volver al inicio</a></div></main>${footer('')}</body></html>`.replace('index,follow,max-image-preview:large','noindex,nofollow');
}

function infoPage(name, title, text) {
  return `${head(`${title} | Calculadoras México`,text,`${name}.html`)}<body>${header('')}<main id="contenido"><div class="page-wrap"><header class="page-head"><h1>${title}</h1><p>${text}</p></header><article class="content-box"><h2>Calculadoras México</h2><p>${text}</p><p>Este portal ofrece herramientas informativas. No solicita cuentas y los cálculos se procesan en el navegador.</p><p><a class="btn btn-primary standalone" href="calculadoras.html">Ver calculadoras</a></p></article></div></main>${footer('')}</body></html>`;
}

fs.writeFileSync(path.join(root,'index.html'), home());
fs.writeFileSync(path.join(root,'calculadoras.html'), catalogPage());
fs.writeFileSync(path.join(root,'simuladores.html'), simulatorsPage());
fs.writeFileSync(path.join(root,'offline.html'), offlinePage());
for (const calc of calculators) fs.writeFileSync(path.join(root,'calculadoras',`${calc[0]}.html`), calculatorPage(calc));
fs.writeFileSync(path.join(root,'contacto.html'), infoPage('contacto','Contacto','Si detectas un error, conserva la URL y los datos del ejemplo para poder revisarlo.'));
fs.writeFileSync(path.join(root,'privacidad.html'), infoPage('privacidad','Aviso de privacidad','Los favoritos, recientes e historial de cálculos se guardan localmente en tu dispositivo.'));
fs.writeFileSync(path.join(root,'terminos.html'), infoPage('terminos','Términos de uso','Los resultados son estimaciones informativas y no sustituyen asesoría profesional.'));

// Fase 5: convierte el catálogo en un portal conectado.
for (const calc of calculators) {
  const slug = calc[0];
  const target = path.join(root,'calculadoras',`${slug}.html`);
  let html = fs.readFileSync(target,'utf8');
  html = html.replace('Portal V3 — Fase 4','Portal V3 — Fase 5');
  html = html.replace('<li>Recupera y comparte tus escenarios.</li>','<li>Encuentra herramientas relacionadas.</li><li>Recupera y comparte tus escenarios.</li>');
  html = html.replace('</div></main>',`<section class="portal-related"><div class="section-title compact"><span class="badge">Continúa calculando</span><h2>Herramientas relacionadas</h2><p>Recomendaciones elegidas por categoría y tema.</p></div><div class="grid" data-related-list="${slug}"></div></section></div></main>`);
  fs.writeFileSync(target,html);
}

{
  const target = path.join(root,'index.html');
  let html = fs.readFileSync(target,'utf8');
  html = html.replace('<span class="badge">Fase 4</span>','<span class="badge">Fase 5</span>');
  html = html.replace('<section class="section alt"><div class="container"><div class="section-title"><span class="badge">Tu espacio</span>', '<section class="section portal-discovery"><div class="container"><div class="section-title"><span class="badge">Descubre</span><h2>Tendencias del portal</h2><p>Una mezcla de herramientas populares y actividad guardada en este dispositivo.</p></div><div class="grid" data-trending-list></div></div></section><section class="section alt portal-discovery"><div class="container"><div class="section-title"><span class="badge">Para ti</span><h2>Recomendadas según tus intereses</h2><p>Se calculan localmente a partir de favoritas y visitas recientes.</p></div><div class="grid" data-recommended-list></div></div></section><section class="section alt"><div class="container"><div class="section-title"><span class="badge">Tu espacio</span>');
  fs.writeFileSync(target,html);
}

// Conecta el catálogo antes del script común en las páginas heredadas.
for (const directory of [root, path.join(root,'articulos')]) {
  for (const file of fs.readdirSync(directory).filter(name => name.endsWith('.html'))) {
    const target = path.join(directory,file);
    let html = fs.readFileSync(target,'utf8');
    const depth = directory === root ? '' : '../';
    if (html.includes('assets/js/common.js') && !html.includes('assets/js/catalog.js')) {
      html = html.replace(`<script src="${depth}assets/js/common.js" defer></script>`,`<script src="${depth}assets/js/catalog.js"></script><script src="${depth}assets/js/common.js" defer></script>`);
      fs.writeFileSync(target,html);
    }
  }
}

// Fase 6: SEO técnico, FAQ visible y datos estructurados coherentes.
for (const calc of calculators) {
  const [slug,title] = calc;
  const target = path.join(root,'calculadoras',`${slug}.html`);
  let html = fs.readFileSync(target,'utf8');
  const questions = [
    {q:`¿Para qué sirve la calculadora de ${title}?`,a:`Sirve para obtener una estimación de ${title.toLowerCase()} con los datos que ingreses y revisar un desglose claro del resultado.`},
    {q:'¿El resultado es oficial?',a:'No. Es una referencia informativa. Para decisiones fiscales, laborales o financieras importantes conviene verificar las reglas vigentes y las condiciones particulares.'},
    {q:'¿Se guardan mis datos en un servidor?',a:'No. El cálculo y el historial se procesan localmente en tu navegador.'}
  ];
  const faqHtml = `<section class="content-box faq-section"><h2>Preguntas frecuentes</h2>${questions.map(item=>`<details><summary>${item.q}</summary><p>${item.a}</p></details>`).join('')}</section>`;
  const faqSchema = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','mainEntity':questions.map(item=>({'@type':'Question','name':item.q,'acceptedAnswer':{'@type':'Answer','text':item.a}}))});
  html = html.replace('</section><section class="portal-related">',`</section>${faqHtml}<section class="portal-related">`);
  html = html.replace('</body>',`<script type="application/ld+json">${faqSchema}</script></body>`);
  html = html.replaceAll(' 2026 2026 |',' 2026 |');
  fs.writeFileSync(target,html);
}

for (const file of fs.readdirSync(path.join(root,'articulos')).filter(name=>name.endsWith('.html'))) {
  const target = path.join(root,'articulos',file);
  let html = fs.readFileSync(target,'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.split('|')[0].trim() || file.replace('.html','');
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || title;
  const articleSchema = JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting','headline':title,'description':description,'image':`${site}/assets/img/og-image.png`,'author':{'@type':'Organization','name':'Calculadoras México'},'publisher':{'@type':'Organization','name':'Calculadoras México','logo':{'@type':'ImageObject','url':`${site}/assets/img/logo.svg`}},'mainEntityOfPage':`${site}/articulos/${file}`,'dateModified':'2026-07-31'});
  if (!html.includes('"@type":"BlogPosting"')) html = html.replace('</body>',`<script type="application/ld+json">${articleSchema}</script></body>`);
  fs.writeFileSync(target,html);
}

{
  const target = path.join(root,'index.html');
  let html = fs.readFileSync(target,'utf8');
  const siteSchema = JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebSite','name':'Calculadoras México','url':`${site}/`,'inLanguage':'es-MX'},{'@type':'Organization','name':'Calculadoras México','url':`${site}/`,'logo':`${site}/assets/img/logo.svg`} ]});
  html = html.replace('</body>',`<script type="application/ld+json">${siteSchema}</script></body>`);
  fs.writeFileSync(target,html);
}

for (const directory of [root,path.join(root,'calculadoras'),path.join(root,'articulos')]) {
  const depth = directory === root ? '' : '../';
  for (const file of fs.readdirSync(directory).filter(name=>name.endsWith('.html'))) {
    const target = path.join(directory,file);
    let html = fs.readFileSync(target,'utf8');
    if (!html.includes('rel="manifest"')) html=html.replace('<meta name="theme-color"',`<link rel="manifest" href="${depth}manifest.webmanifest"><meta name="application-name" content="Calculadoras México"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Calculadoras MX"><meta name="theme-color"`);
    const currentDescription = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    if (currentDescription && currentDescription.length < 50) {
      const improvedDescription = `${currentDescription.replace(/[. ]+$/,'')}. Calcula gratis, revisa el desglose y comprende el resultado de forma clara.`;
      html = html.replace(`<meta name="description" content="${currentDescription}">`,`<meta name="description" content="${improvedDescription}">`);
      html = html.replace(`<meta property="og:description" content="${currentDescription}">`,`<meta property="og:description" content="${improvedDescription}">`);
    }
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical && !html.includes('hreflang="es-MX"')) html = html.replace('<link rel="icon"',`<link rel="alternate" hreflang="es-MX" href="${canonical}"><link rel="icon"`);
    if (!html.includes('name="twitter:title"')) {
      const pageTitle = html.match(/<title>(.*?)<\/title>/)?.[1] || 'Calculadoras México';
      const pageDescription = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
      html = html.replace('<meta name="twitter:card" content="summary_large_image">',`<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${pageTitle}"><meta name="twitter:description" content="${pageDescription}"><meta name="twitter:image" content="${site}/assets/img/og-image.png">`);
    }
    if (!html.includes('class="mobile-dock"')) {
      html = html.replace('<footer class="footer">',`<nav class="mobile-dock" aria-label="Navegación móvil"><a href="${depth}index.html"><span>⌂</span>Inicio</a><a href="${depth}calculadoras.html"><span>▦</span>Calculadoras</a><button type="button" data-search-open><span>⌕</span>Buscar</button><a href="${depth}articulos.html"><span>▤</span>Artículos</a></nav><footer class="footer">`);
    }
    if (!html.includes('>Simuladores</a>')) html=html.replace(`<a href="${depth}articulos.html"`,`<a href="${depth}simuladores.html">Simuladores</a><a href="${depth}articulos.html"`);
    html=html.replace(`<a href="${depth}calculadoras.html"><span>▦</span>Calculadoras</a><button`,`<a href="${depth}calculadoras.html"><span>▦</span>Calculadoras</a><a href="${depth}simuladores.html"><span>⇄</span>Comparar</a><button`);
    html = html
      .replaceAll('<script src="'+depth+'assets/js/catalog.js"></script>','<script src="'+depth+'assets/js/catalog.js" defer></script>')
      .replaceAll('<script src="'+depth+'assets/js/common.js"></script>','<script src="'+depth+'assets/js/common.js" defer></script>')
      .replaceAll('<script src="'+depth+'assets/js/calculators.js"></script>','<script src="'+depth+'assets/js/calculators.js" defer></script>')
      .replaceAll('<script src="'+depth+'assets/js/tablas.js"></script>','<script src="'+depth+'assets/js/tablas.js" defer></script>')
      .replaceAll('alt="Calculadoras México">','alt="Calculadoras México" decoding="async" fetchpriority="high">');
    fs.writeFileSync(target,html);
  }
}

{
  const target=path.join(root,'index.html');
  let html=fs.readFileSync(target,'utf8');
  if(!html.includes('Comparar escenarios inteligentes')) html=html.replace('<section class="section portal-discovery">','<section class="section alt smart-home"><div class="container"><div class="section-title"><span class="badge">Fase 9</span><h2>Comparar escenarios inteligentes</h2><p>Contrasta salarios, préstamos y planes de ahorro lado a lado.</p></div><div class="trust"><div class="trust-item"><div class="icon">💼</div><strong>Dos salarios</strong><p>Compara ingreso neto y deducciones.</p></div><div class="trust-item"><div class="icon">🏦</div><strong>Dos préstamos</strong><p>Revisa mensualidad, intereses y total.</p></div><div class="trust-item"><div class="icon">📈</div><strong>Dos planes de ahorro</strong><p>Proyecta aportaciones y rendimientos.</p></div></div><p class="section-cta"><a class="btn btn-primary standalone" href="simuladores.html">Abrir simuladores</a></p></div></section><section class="section portal-discovery">');
  fs.writeFileSync(target,html);
}

const urls = ['', 'calculadoras.html','simuladores.html','articulos.html','acerca-de.html','contacto.html','privacidad.html','terminos.html',
  ...calculators.map(calc => `calculadoras/${calc[0]}.html`),
  ...fs.readdirSync(path.join(root,'articulos')).filter(file => file.endsWith('.html')).map(file => `articulos/${file}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${site}/${url}</loc><lastmod>2026-07-31</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
fs.writeFileSync(path.join(root,'vercel.json'),JSON.stringify({cleanUrls:false,headers:[{source:'/sitemap.xml',headers:[{key:'Content-Type',value:'application/xml; charset=utf-8'},{key:'Cache-Control',value:'public, max-age=0, s-maxage=3600'}]},{source:'/manifest.webmanifest',headers:[{key:'Content-Type',value:'application/manifest+json; charset=utf-8'},{key:'Cache-Control',value:'public, max-age=3600'}]},{source:'/sw.js',headers:[{key:'Content-Type',value:'application/javascript; charset=utf-8'},{key:'Cache-Control',value:'public, max-age=0, must-revalidate'}]},{source:'/assets/(.*)',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},{source:'/(.*).html',headers:[{key:'Cache-Control',value:'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'}]},{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}]}]},null,2));
console.log(`Generated ${calculators.length} calculator pages and ${urls.length} sitemap URLs.`);
await import('./harden-release.mjs');
