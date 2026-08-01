/* CM_CATALOG_BUNDLE_START */
const CM_CATALOG = [
  {slug:'isr', title:'ISR 2026', category:'Impuestos', icon:'🧾', description:'Estima ISR y salario neto por periodo.', keywords:'renta salario impuestos mensual quincenal semanal', popular:true},
  {slug:'aguinaldo', title:'Aguinaldo', category:'Prestaciones', icon:'🎁', description:'Calcula aguinaldo completo o proporcional.', keywords:'prestación navidad días trabajados', popular:true},
  {slug:'vacaciones', title:'Vacaciones', category:'Prestaciones', icon:'🏖️', description:'Consulta días y prima vacacional.', keywords:'antigüedad descanso prima', popular:true},
  {slug:'iva', title:'IVA', category:'Impuestos', icon:'🧮', description:'Agrega, quita o calcula IVA.', keywords:'factura impuesto subtotal', popular:true},
  {slug:'finiquito', title:'Finiquito', category:'Prestaciones', icon:'📄', description:'Estima prestaciones pendientes.', keywords:'renuncia terminación laboral', popular:true},
  {slug:'horas-extra', title:'Horas extra', category:'Nómina', icon:'⏱️', description:'Calcula una referencia de pago doble y triple.', keywords:'jornada pago hora', popular:true},
  {slug:'salario-diario', title:'Salario diario', category:'Nómina', icon:'📆', description:'Convierte ingresos a salario diario.', keywords:'sueldo mensual quincenal semanal'},
  {slug:'descuento', title:'Descuento', category:'Finanzas', icon:'🏷️', description:'Calcula ahorro y precio final.', keywords:'porcentaje oferta precio'},
  {slug:'salario-neto', title:'Salario neto', category:'Nómina', icon:'💵', description:'Resta deducciones al salario bruto.', keywords:'sueldo deducciones recibo'},
  {slug:'salario-bruto', title:'Salario bruto', category:'Nómina', icon:'🧾', description:'Estima el bruto desde el ingreso neto.', keywords:'sueldo deducciones recibo'},
  {slug:'salario-diario-integrado', title:'Salario diario integrado', category:'Nómina', icon:'📊', description:'Estima el SDI con prestaciones básicas.', keywords:'sdi imss prestaciones'},
  {slug:'prima-dominical', title:'Prima dominical', category:'Nómina', icon:'🌞', description:'Calcula una referencia por trabajar en domingo.', keywords:'domingo salario prima'},
  {slug:'prima-vacacional', title:'Prima vacacional', category:'Prestaciones', icon:'🏝️', description:'Estima la prima sobre tus días de descanso.', keywords:'vacaciones pago prima'},
  {slug:'aguinaldo-proporcional', title:'Aguinaldo proporcional', category:'Prestaciones', icon:'🎄', description:'Estima la parte correspondiente del año.', keywords:'días trabajados finiquito'},
  {slug:'vacaciones-proporcionales', title:'Vacaciones proporcionales', category:'Prestaciones', icon:'🗓️', description:'Calcula días y pago por una fracción del año.', keywords:'prima finiquito días'},
  {slug:'liquidacion', title:'Liquidación laboral', category:'Prestaciones', icon:'⚖️', description:'Simula conceptos frecuentes de liquidación.', keywords:'indemnización despido salario'},
  {slug:'ptu', title:'PTU', category:'Prestaciones', icon:'🏭', description:'Distribuye utilidades usando días y salario.', keywords:'utilidades reparto trabajadores'},
  {slug:'retencion-iva', title:'Retención de IVA', category:'Impuestos', icon:'🧮', description:'Calcula una retención sobre el IVA causado.', keywords:'honorarios factura impuesto'},
  {slug:'iva-incluido', title:'IVA incluido', category:'Impuestos', icon:'🧾', description:'Separa subtotal e IVA de un precio final.', keywords:'quitar iva subtotal'},
  {slug:'porcentaje', title:'Porcentajes', category:'Herramientas', icon:'％', description:'Calcula porcentajes y cambios porcentuales.', keywords:'regla de tres cambio'},
  {slug:'aumento-salarial', title:'Aumento salarial', category:'Finanzas', icon:'📈', description:'Conoce el nuevo salario tras un aumento.', keywords:'incremento sueldo porcentaje'},
  {slug:'comision', title:'Comisión', category:'Finanzas', icon:'🤝', description:'Calcula comisión e ingreso total.', keywords:'ventas porcentaje pago'},
  {slug:'interes-simple', title:'Interés simple', category:'Finanzas', icon:'💰', description:'Calcula interés sin capitalización.', keywords:'inversión préstamo tasa'},
  {slug:'interes-compuesto', title:'Interés compuesto', category:'Finanzas', icon:'📈', description:'Proyecta capital con reinversión de intereses.', keywords:'inversión ahorro tasa'},
  {slug:'prestamo', title:'Préstamo', category:'Finanzas', icon:'🏦', description:'Estima mensualidad, intereses y pago total.', keywords:'crédito mensualidad deuda'},
  {slug:'ahorro-mensual', title:'Ahorro mensual', category:'Finanzas', icon:'🐷', description:'Proyecta ahorro con aportaciones periódicas.', keywords:'inversión meta rendimiento'},
  {slug:'regla-tres', title:'Regla de tres', category:'Herramientas', icon:'✖️', description:'Encuentra un valor proporcional desconocido.', keywords:'proporción regla tres matemáticas', new:true},
  {slug:'edad', title:'Edad exacta', category:'Herramientas', icon:'🎂', description:'Calcula años, meses y días entre dos fechas.', keywords:'fecha nacimiento cumpleaños años', new:true},
  {slug:'diferencia-fechas', title:'Diferencia entre fechas', category:'Herramientas', icon:'📅', description:'Obtén los días y semanas entre dos fechas.', keywords:'calendario plazo días semanas', new:true},
  {slug:'propina', title:'Propina', category:'Herramientas', icon:'🧾', description:'Calcula propina, total y monto por persona.', keywords:'restaurante cuenta dividir', new:true},
  {slug:'margen-ganancia', title:'Margen de ganancia', category:'Negocios', icon:'📊', description:'Calcula utilidad y margen sobre ventas.', keywords:'negocio utilidad costo venta', new:true},
  {slug:'precio-venta', title:'Precio de venta', category:'Negocios', icon:'🏷️', description:'Calcula un precio aplicando aumento sobre costo.', keywords:'markup costo ganancia producto', new:true},
  {slug:'punto-equilibrio', title:'Punto de equilibrio', category:'Negocios', icon:'⚖️', description:'Estima unidades necesarias para cubrir costos.', keywords:'costos fijos variable negocio', new:true},
  {slug:'roi', title:'Retorno de inversión (ROI)', category:'Negocios', icon:'📈', description:'Calcula ganancia neta y retorno porcentual.', keywords:'inversión retorno utilidad negocio', new:true},
  {slug:'inflacion', title:'Impacto de inflación', category:'Finanzas', icon:'📉', description:'Estima valor futuro y poder adquisitivo.', keywords:'inflación precios dinero futuro', new:true},
  {slug:'ahorro-meta', title:'Ahorro para una meta', category:'Finanzas', icon:'🎯', description:'Calcula cuánto ahorrar cada mes.', keywords:'meta mensual objetivo ahorro', new:true},
  {slug:'tiempo-ahorro', title:'Tiempo para ahorrar', category:'Finanzas', icon:'⏳', description:'Estima meses necesarios para alcanzar una meta.', keywords:'ahorro meta plazo meses', new:true},
  {slug:'credito-automotriz', title:'Crédito automotriz', category:'Créditos', icon:'🚗', description:'Estima enganche, mensualidad e intereses.', keywords:'auto coche préstamo enganche mensualidad', new:true},
  {slug:'hipoteca', title:'Hipoteca', category:'Créditos', icon:'🏠', description:'Estima mensualidad y costo de un crédito hipotecario.', keywords:'casa vivienda préstamo tasa', new:true},
  {slug:'pago-quincenal', title:'Pago quincenal', category:'Nómina', icon:'📆', description:'Convierte salario mensual a quincenal y diario.', keywords:'salario sueldo quincena nómina', new:true},
  {slug:'salario-hora', title:'Salario por hora', category:'Nómina', icon:'⏰', description:'Convierte salario mensual en pago por hora.', keywords:'sueldo hora jornada trabajo', new:true},
  {slug:'bono', title:'Bono', category:'Nómina', icon:'🎁', description:'Calcula bono bruto y total con salario.', keywords:'bonificación porcentaje sueldo', new:true},
  {slug:'reparto-cuenta', title:'Dividir una cuenta', category:'Herramientas', icon:'👥', description:'Divide un total entre varias personas.', keywords:'repartir cuenta personas partes', new:true},
  {slug:'precio-sin-descuento', title:'Precio antes del descuento', category:'Herramientas', icon:'🔖', description:'Recupera el precio original desde el precio final.', keywords:'descuento inverso precio original', new:true},
  {slug:'tasa-efectiva', title:'Tasa efectiva anual', category:'Finanzas', icon:'％', description:'Convierte una tasa nominal en efectiva.', keywords:'tea tasa nominal capitalización', new:true},
  {slug:'rendimiento-anualizado', title:'Rendimiento anualizado', category:'Finanzas', icon:'📈', description:'Anualiza el rendimiento de un periodo.', keywords:'inversión rendimiento anual tasa', new:true},
  {slug:'cetes', title:'Rendimiento de CETES', category:'Finanzas', icon:'🇲🇽', description:'Estima rendimiento usando precio y valor nominal.', keywords:'cetes rendimiento plazo inversión', new:true},
  {slug:'costo-unidad', title:'Costo por unidad', category:'Negocios', icon:'📦', description:'Distribuye costos totales entre unidades.', keywords:'producto fabricación costo unitario', new:true},
  {slug:'conversion-longitud', title:'Conversor de longitud', category:'Herramientas', icon:'📏', description:'Convierte metros, kilómetros, pies y millas.', keywords:'unidades distancia conversión', new:true},
  {slug:'costo-combustible', title:'Costo de combustible', category:'Herramientas', icon:'⛽', description:'Estima litros y costo de un recorrido.', keywords:'gasolina viaje distancia rendimiento', new:true}
];

/* CM_CATALOG_BUNDLE_END */

const money = value => new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
}).format(Number(value) || 0);

const val = id => Number(document.getElementById(id)?.value || 0);
const CM_KEYS = {
  theme: 'cm-theme',
  favorites: 'cm-favorites-v1',
  recent: 'cm-recent-v1',
  history: 'cm-history-v1'
};

const readStore = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const pageDepth = () => location.pathname.includes('/calculadoras/') || location.pathname.includes('/articulos/') ? '../' : '';

function showToast(message) {
  let toast = document.querySelector('.cm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cm-toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function resultText(result) {
  return [...result.querySelectorAll('.result-row')]
    .map(row => `${row.querySelector('strong')?.textContent}: ${row.querySelector('span')?.textContent}`)
    .join('\n');
}

const CM_CHART_LABELS = {
  isr: ['ISR estimado', 'Neto estimado'],
  aguinaldo: ['Aguinaldo completo', 'Aguinaldo proporcional'],
  vacaciones: ['Pago del periodo', 'Prima vacacional'],
  iva: ['Subtotal', 'IVA'],
  finiquito: ['Días pendientes', 'Aguinaldo proporcional', 'Vacaciones pendientes', 'Prima vacacional'],
  'horas-extra': ['Pago doble', 'Pago triple'],
  descuento: ['Ahorro', 'Precio final'],
  'salario-neto': ['Deducciones', 'Salario neto estimado'],
  'salario-bruto': ['Salario neto', 'Deducciones'],
  'prima-vacacional': ['Pago base de vacaciones', 'Prima vacacional'],
  'vacaciones-proporcionales': ['Pago de vacaciones', 'Prima vacacional'],
  liquidacion: ['Tres meses de salario', '20 días por año', 'Sueldo pendiente'],
  ptu: ['Parte por días', 'Parte por salario'],
  'retencion-iva': ['IVA causado', 'IVA retenido'],
  'iva-incluido': ['Subtotal', 'IVA incluido'],
  'aumento-salarial': ['Salario actual', 'Aumento'],
  comision: ['Comisión', 'Pago base'],
  'interes-simple': ['Capital', 'Interés generado'],
  'interes-compuesto': ['Capital inicial', 'Intereses estimados'],
  prestamo: ['Capital', 'Intereses totales'],
  'ahorro-mensual': ['Aportado por ti', 'Rendimiento estimado'],
  propina: ['Cuenta', 'Propina'],
  'precio-venta': ['Costo', 'Utilidad agregada'],
  roi: ['Inversión', 'Ganancia o pérdida'],
  inflacion: ['Cantidad actual', 'Costo futuro equivalente', 'Poder adquisitivo estimado'],
  'ahorro-meta': ['Ahorro mensual necesario', 'Faltante'],
  'credito-automotriz': ['Enganche', 'Monto financiado', 'Intereses estimados'],
  hipoteca: ['Enganche', 'Monto financiado', 'Intereses estimados'],
  bono: ['Salario base', 'Bono bruto'],
  'precio-sin-descuento': ['Precio pagado', 'Descuento recibido'],
  cetes: ['Inversión estimada', 'Ganancia bruta']
};

function numericValue(value) {
  const number = Number(String(value).replaceAll(',', '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function chartMarkup(rows) {
  const wanted = CM_CHART_LABELS[document.body.dataset.calc] || [];
  const items = rows.filter(row => wanted.includes(row.label))
    .map(row => ({label: row.label, value: Math.max(0, numericValue(row.value)), formatted: row.value}))
    .filter(row => row.value > 0);
  if (items.length < 2) return '';
  const maximum = Math.max(...items.map(item => item.value));
  return `<figure class="result-chart" aria-label="Comparación visual del resultado">
    <figcaption>Comparación visual</figcaption>
    <div class="chart-bars">
      ${items.map((item, index) => `<div class="chart-item">
        <div class="chart-label"><span><i class="chart-dot color-${index % 5}"></i>${item.label}</span><strong>${item.formatted}</strong></div>
        <div class="chart-track"><span class="color-${index % 5}" style="width:${Math.max(3, item.value / maximum * 100).toFixed(2)}%"></span></div>
      </div>`).join('')}
    </div>
  </figure>`;
}

function primaryResult(rows) {
  const row = [...rows].reverse().find(item => item.total) || rows.at(-1);
  return row ? {label: row.label, value: row.value, number: numericValue(row.value)} : null;
}

function calculatorControls() {
  return [...document.querySelectorAll('.calc-box input[id], .calc-box select[id]')];
}

function formValues() {
  return Object.fromEntries(calculatorControls().map(control => [control.id, control.value]));
}

function scenarioUrl() {
  const url = new URL(location.href);
  url.search = '';
  for (const [key, value] of Object.entries(formValues())) url.searchParams.set(key, value);
  return url.toString();
}

function saveCalculatorForm() {
  const slug = document.body.dataset.calc;
  if (!slug) return;
  writeStore(`cm-form-${slug}`, formValues());
  const note = document.querySelector('[data-form-state]');
  if (note) note.textContent = '✓ Datos guardados automáticamente en este dispositivo';
}

function loadCalculatorForm() {
  const slug = document.body.dataset.calc;
  const controls = calculatorControls();
  if (!slug || !controls.length) return;
  controls.forEach(control => {
    control.dataset.defaultValue = control.value;
  });
  const params = new URLSearchParams(location.search);
  const fromUrl = controls.some(control => params.has(control.id));
  const stored = readStore(`cm-form-${slug}`, {});
  controls.forEach(control => {
    const value = fromUrl && params.has(control.id) ? params.get(control.id) : stored[control.id];
    if (value !== undefined && value !== null && String(value).length <= 80) control.value = value;
  });
  const note = document.querySelector('[data-form-state]');
  if (note) {
    if (fromUrl) note.textContent = '🔗 Escenario cargado desde un enlace compartido';
    else if (Object.keys(stored).length) note.textContent = '↻ Recuperamos tus últimos datos guardados';
  }
  controls.forEach(control => {
    control.addEventListener('input', () => {
      control.removeAttribute('aria-invalid');
      control.closest('.form-group')?.classList.remove('field-invalid');
      clearTimeout(saveCalculatorForm.timer);
      saveCalculatorForm.timer = setTimeout(saveCalculatorForm, 250);
    });
  });
  if (fromUrl) setTimeout(() => document.querySelector('.calc-button')?.click(), 0);
}

function resetCalculatorForm() {
  const slug = document.body.dataset.calc;
  calculatorControls().forEach(control => {
    control.value = control.dataset.defaultValue ?? '';
    control.removeAttribute('aria-invalid');
    control.closest('.form-group')?.classList.remove('field-invalid');
  });
  localStorage.removeItem(`cm-form-${slug}`);
  localStorage.removeItem(`cm-scenario-${slug}`);
  const result = document.querySelector('.result');
  if (result) {
    result.removeAttribute('data-ready');
    result.innerHTML = '<span>Completa los datos y presiona Calcular.</span>';
  }
  const note = document.querySelector('[data-form-state]');
  if (note) note.textContent = 'Formulario restablecido';
  try {
    history.replaceState({}, '', location.pathname);
  } catch {}
  showToast('Datos restablecidos');
}

function markInvalidFields() {
  calculatorControls().forEach(control => {
    const invalid = control instanceof HTMLInputElement && !control.checkValidity();
    control.toggleAttribute('aria-invalid', invalid);
    control.closest('.form-group')?.classList.toggle('field-invalid', invalid);
  });
}

function comparisonMarkup(rows) {
  const slug = document.body.dataset.calc;
  const saved = readStore(`cm-scenario-${slug}`, null);
  const current = primaryResult(rows);
  if (!saved || !current || !saved.primary) return '';
  const difference = current.number - saved.primary.number;
  const isMoney = String(current.value).includes('$') || String(saved.primary.value).includes('$');
  const differenceText = isMoney ? money(Math.abs(difference)) : Math.abs(difference).toLocaleString('es-MX', {maximumFractionDigits: 2});
  const direction = difference === 0 ? 'Sin cambio' : `${difference > 0 ? '▲' : '▼'} ${differenceText}`;
  return `<section class="scenario-comparison" aria-label="Comparación de escenarios">
    <div><small>Escenario guardado</small><strong>${saved.primary.value}</strong></div>
    <span aria-hidden="true">→</span>
    <div><small>Resultado actual</small><strong>${current.value}</strong></div>
    <b class="${difference > 0 ? 'up' : difference < 0 ? 'down' : ''}">${direction}</b>
  </section>`;
}

function registerHistory() {
  const result = document.querySelector('.result');
  if (!result || !result.querySelector('.result-row')) return;
  const item = {
    title: document.querySelector('h1')?.textContent.trim() || document.title,
    path: location.pathname.split('/').pop() || 'index.html',
    url: location.pathname,
    summary: result.querySelector('.result-row.total span')?.textContent || result.querySelector('.result-row:last-of-type span')?.textContent || '',
    text: resultText(result),
    at: Date.now()
  };
  const history = readStore(CM_KEYS.history).filter(entry => entry.url !== item.url);
  history.unshift(item);
  writeStore(CM_KEYS.history, history.slice(0, 12));
  renderPersonalSpace();
}

function showRows(rows, note = '') {
  const el = document.querySelector('.result');
  if (!el) return;
  el.innerHTML = `
    <div class="result-grid">
      ${rows.map(row => `<div class="result-row ${row.total ? 'total' : ''}"><strong>${row.label}</strong><span>${row.value}</span></div>`).join('')}
      ${note ? `<small>${note}</small>` : ''}
    </div>
    ${chartMarkup(rows)}
    ${comparisonMarkup(rows)}
    <div class="result-actions" aria-label="Acciones del resultado">
      <button type="button" data-result-copy>📋 Copiar</button>
      <button type="button" data-result-share>↗ Compartir</button>
      <button type="button" data-result-link>🔗 Copiar enlace</button>
      <button type="button" data-result-save>⚖ Guardar escenario</button>
      <button type="button" data-result-export>⬇ Exportar CSV</button>
      <button type="button" data-result-print>🖨 Imprimir</button>
    </div>`;
  el.dataset.ready = 'true';
  registerHistory();
}

function toggleFavorite(slug) {
  const favorites = readStore(CM_KEYS.favorites);
  const next = favorites.includes(slug) ? favorites.filter(item => item !== slug) : [slug, ...favorites];
  writeStore(CM_KEYS.favorites, next);
  updateFavoriteButtons();
  renderPersonalSpace();
  showToast(next.includes(slug) ? 'Guardada en favoritos' : 'Eliminada de favoritos');
}

function updateFavoriteButtons() {
  const favorites = readStore(CM_KEYS.favorites);
  document.querySelectorAll('[data-favorite]').forEach(button => {
    const active = favorites.includes(button.dataset.favorite);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('title', active ? 'Quitar de favoritos' : 'Guardar en favoritos');
    const text = button.querySelector('[data-favorite-label]');
    if (text) text.textContent = active ? 'Guardada' : 'Guardar';
    const icon = button.querySelector('[data-favorite-icon]');
    if (icon) icon.textContent = active ? '★' : '☆';
  });
}

function markRecent() {
  const slug = document.body.dataset.calc;
  if (!slug) return;
  const recent = readStore(CM_KEYS.recent).filter(item => item !== slug);
  recent.unshift(slug);
  writeStore(CM_KEYS.recent, recent.slice(0, 6));
}

function calculatorCard(item, root = '') {
  return `<article class="card calculator-card" data-search="${[item.title, item.description, item.category].join(' ').toLowerCase()}">
    <button class="favorite-mini" type="button" data-favorite="${item.slug}" aria-label="Guardar ${item.title}" aria-pressed="false"><span data-favorite-icon>☆</span></button>
    <div class="icon" aria-hidden="true">${item.icon}</div>
    <span class="card-kicker">${item.category}</span>
    ${item.new ? '<span class="new-badge">Nueva</span>' : ''}
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <a class="card-link" href="${root}calculadoras/${item.slug}.html">Calcular →</a>
  </article>`;
}

function relatedCalculators(slug, limit = 4) {
  const current = CM_CATALOG.find(item => item.slug === slug);
  if (!current) return [];
  return CM_CATALOG
    .filter(item => item.slug !== slug)
    .map(item => ({item, score:
      (item.category === current.category ? 6 : 0) +
      (item.popular ? 2 : 0) +
      (item.new ? 1 : 0) +
      current.keywords.split(' ').filter(word => item.keywords.includes(word)).length
    }))
    .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'es'))
    .slice(0, limit)
    .map(entry => entry.item);
}

function trendingCalculators(limit = 8) {
  const activity = [...readStore(CM_KEYS.recent), ...readStore(CM_KEYS.history).map(entry => entry.slug)];
  return CM_CATALOG
    .map(item => ({item, score: activity.filter(slug => slug === item.slug).length * 5 + (item.popular ? 3 : 0) + (item.new ? 1 : 0)}))
    .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'es'))
    .slice(0, limit)
    .map(entry => entry.item);
}

function recommendedCalculators(limit = 8) {
  const signals = [...readStore(CM_KEYS.favorites), ...readStore(CM_KEYS.recent)];
  const categories = signals.map(slug => CM_CATALOG.find(item => item.slug === slug)?.category).filter(Boolean);
  const excluded = new Set(signals);
  const ranked = CM_CATALOG
    .filter(item => !excluded.has(item.slug))
    .map(item => ({item, score: categories.filter(category => category === item.category).length * 4 + (item.popular ? 2 : 0) + (item.new ? 1 : 0)}))
    .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'es'));
  return ranked.slice(0, limit).map(entry => entry.item);
}

function renderPortalSections() {
  const root = pageDepth();
  document.querySelectorAll('[data-trending-list]').forEach(container => {
    container.innerHTML = trendingCalculators().map(item => calculatorCard(item, root)).join('');
  });
  document.querySelectorAll('[data-recommended-list]').forEach(container => {
    container.innerHTML = recommendedCalculators().map(item => calculatorCard(item, root)).join('');
  });
  document.querySelectorAll('[data-related-list]').forEach(container => {
    const slug = container.dataset.relatedList || document.body.dataset.calc;
    container.innerHTML = relatedCalculators(slug).map(item => calculatorCard(item, root)).join('');
  });
  updateFavoriteButtons();
}

function renderPersonalSpace() {
  const root = pageDepth();
  const favorites = readStore(CM_KEYS.favorites)
    .map(slug => CM_CATALOG.find(item => item.slug === slug))
    .filter(Boolean)
    .slice(0, 4);
  const recent = readStore(CM_KEYS.recent)
    .map(slug => CM_CATALOG.find(item => item.slug === slug))
    .filter(Boolean)
    .slice(0, 4);
  const history = readStore(CM_KEYS.history).slice(0, 5);

  document.querySelectorAll('[data-favorites-list]').forEach(container => {
    container.innerHTML = favorites.length
      ? favorites.map(item => calculatorCard(item, root)).join('')
      : '<div class="empty-state"><b>Aún no tienes favoritas</b><span>Usa la estrella de cualquier calculadora para guardarla aquí.</span></div>';
  });
  document.querySelectorAll('[data-recent-list]').forEach(container => {
    container.innerHTML = recent.length
      ? recent.map(item => calculatorCard(item, root)).join('')
      : '<div class="empty-state"><b>Todavía no hay recientes</b><span>Las calculadoras que abras aparecerán aquí.</span></div>';
  });
  document.querySelectorAll('[data-history-list]').forEach(container => {
    container.innerHTML = history.length
      ? history.map(item => `<a class="history-item" href="${root}calculadoras/${item.path}">
          <span><b>${item.title}</b><small>${new Date(item.at).toLocaleString('es-MX', {dateStyle: 'medium', timeStyle: 'short'})}</small></span>
          <strong>${item.summary}</strong>
        </a>`).join('')
      : '<div class="empty-state"><b>Sin cálculos guardados</b><span>Tu historial se guarda solamente en este dispositivo.</span></div>';
  });
  updateFavoriteButtons();
}

function renderCatalog() {
  document.querySelectorAll('[data-catalog]').forEach(container => {
    const category = container.dataset.catalog;
    const items = category === 'all' ? CM_CATALOG : CM_CATALOG.filter(item => item.category === category);
    container.innerHTML = items.map(item => calculatorCard(item)).join('');
  });
}

function setupSearch() {
  const dialog = document.querySelector('.search-dialog');
  const input = document.querySelector('.global-search');
  const results = document.querySelector('.search-results');
  const root = pageDepth();
  let active = -1;

  const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const render = (term = '') => {
    const query = normalize(term.trim());
    const found = CM_CATALOG.filter(item => !query || normalize(`${item.title} ${item.description} ${item.category} ${item.keywords}`).includes(query)).slice(0, 10);
    active = -1;
    results.innerHTML = found.length
      ? found.map(item => `<a class="search-result" href="${root}calculadoras/${item.slug}.html"><span><b>${item.icon} ${item.title}</b><small>${item.category} · ${item.description}</small></span><span>→</span></a>`).join('')
      : '<div class="search-empty">No encontramos resultados. Prueba con otra palabra.</div>';
  };
  const open = () => {
    dialog?.classList.add('open');
    dialog?.setAttribute('aria-hidden', 'false');
    render();
    setTimeout(() => input?.focus(), 30);
  };
  const close = () => {
    dialog?.classList.remove('open');
    dialog?.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-search-open]').forEach(button => button.addEventListener('click', open));
  document.querySelectorAll('[data-search-close]').forEach(button => button.addEventListener('click', close));
  input?.addEventListener('input', () => render(input.value));
  input?.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((link, index) => link.classList.toggle('active', index === active));
      links[active]?.scrollIntoView({block: 'nearest'});
    }
    if (event.key === 'Enter' && active >= 0) links[active]?.click();
  });
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) close();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open();
    }
    if (event.key === 'Escape') close();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(()=>{});
  const root = document.documentElement;
  const saved = localStorage.getItem(CM_KEYS.theme);
  const preferred = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = saved || preferred;

  const setTheme = theme => {
    root.dataset.theme = theme;
    localStorage.setItem(CM_KEYS.theme, theme);
    document.querySelectorAll('[data-theme-icon]').forEach(icon => icon.textContent = theme === 'dark' ? '☀️' : '🌙');
  };
  setTheme(root.dataset.theme);

  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')));
  const menu = document.querySelector('.main-nav');
  const toggle = document.querySelector('[data-menu-toggle]');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.classList.remove('nav-open');
  }));

  renderCatalog();
  markRecent();
  renderPersonalSpace();
  renderPortalSections();
  setupSearch();
  loadCalculatorForm();

  document.addEventListener('click', async event => {
    const favorite = event.target.closest('[data-favorite]');
    if (favorite) {
      event.preventDefault();
      toggleFavorite(favorite.dataset.favorite);
      return;
    }
    if (event.target.closest('[data-history-clear]')) {
      writeStore(CM_KEYS.history, []);
      renderPersonalSpace();
      showToast('Historial eliminado');
      return;
    }
    if (event.target.closest('[data-form-reset]')) {
      resetCalculatorForm();
      return;
    }
    if (event.target.closest('.calc-button')) markInvalidFields();
    const result = document.querySelector('.result[data-ready="true"]');
    if (!result) return;
    const text = `${document.querySelector('h1')?.textContent}\n${resultText(result)}\n${location.href}`;
    if (event.target.closest('[data-result-copy]')) {
      await navigator.clipboard.writeText(text);
      showToast('Resultado copiado');
    }
    if (event.target.closest('[data-result-share]')) {
      const url = scenarioUrl();
      if (navigator.share) await navigator.share({title: document.title, text, url});
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        showToast('Resultado copiado para compartir');
      }
    }
    if (event.target.closest('[data-result-link]')) {
      await navigator.clipboard.writeText(scenarioUrl());
      showToast('Enlace del escenario copiado');
    }
    if (event.target.closest('[data-result-save]')) {
      const rows = [...result.querySelectorAll('.result-row')].map(row => ({
        label: row.querySelector('strong')?.textContent || '',
        value: row.querySelector('span')?.textContent || '',
        total: row.classList.contains('total')
      }));
      writeStore(`cm-scenario-${document.body.dataset.calc}`, {
        primary: primaryResult(rows),
        rows,
        at: Date.now()
      });
      showToast('Escenario guardado; cambia datos y calcula otra vez');
    }
    if (event.target.closest('[data-result-export]')) {
      const rows = [...result.querySelectorAll('.result-row')].map(row => [
        row.querySelector('strong')?.textContent || '',
        row.querySelector('span')?.textContent || ''
      ]);
      const csv = [
        ['Calculadora', document.querySelector('h1')?.textContent || document.title],
        ['Fecha', new Date().toLocaleString('es-MX')],
        [],
        ['Concepto', 'Resultado'],
        ...rows
      ].map(columns => columns.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
      const blob = new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${document.body.dataset.calc || 'calculo'}-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast('Archivo CSV descargado');
    }
    if (event.target.closest('[data-result-print]')) window.print();
  });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), {threshold: .06});
  document.querySelectorAll('.card,.trust-item,.content-box,.calc-box,.article,.personal-panel').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
});

let cmInstallPrompt;
window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  cmInstallPrompt=event;
  const actions=document.querySelector('.header-actions');
  if(actions&&!actions.querySelector('[data-install-app]')){
    const button=document.createElement('button');
    button.type='button';button.className='icon-button install-app';button.dataset.installApp='';button.title='Instalar aplicación';button.setAttribute('aria-label','Instalar aplicación');button.textContent='⇩';
    actions.prepend(button);
  }
});
document.addEventListener('click',async event=>{if(!event.target.closest('[data-install-app]')||!cmInstallPrompt)return;cmInstallPrompt.prompt();await cmInstallPrompt.userChoice;cmInstallPrompt=null;event.target.closest('[data-install-app]')?.remove()});

/* CM_CALCULATORS_BUNDLE_START */
document.addEventListener('DOMContentLoaded', () => {
  const type = document.body.dataset.calc;
  const button = document.querySelector('.calc-button');
  const fail = message => showRows([{label: 'Revisa los datos', value: message}]);
  const dateValue = id => {
    const value = document.getElementById(id)?.value;
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };
  const payment = (principal, annualRate, periods) => {
    const rate = annualRate / 100 / 12;
    return rate === 0 ? principal / periods : principal * rate * Math.pow(1 + rate, periods) / (Math.pow(1 + rate, periods) - 1);
  };

  button?.addEventListener('click', () => {
    if (type === 'isr') {
      const income = val('salario');
      const period = document.getElementById('periodo').value;
      if (income <= 0) return fail('El ingreso debe ser mayor que cero');
      const tables = {mensual: tablaISRMensual, quincenal: tablaISRQuincenal, semanal: tablaISRSemanal};
      const row = tables[period].find(item => income >= item.limiteInferior && income <= item.limiteSuperior);
      if (!row) return fail('No se encontró un rango para ese importe');
      const excess = income - row.limiteInferior;
      const tax = row.cuotaFija + excess * row.porcentaje / 100;
      return showRows([
        {label: 'Ingreso bruto', value: money(income)},
        {label: 'Cuota fija', value: money(row.cuotaFija)},
        {label: 'Excedente', value: money(excess)},
        {label: 'Tasa marginal', value: `${row.porcentaje.toFixed(2)}%`},
        {label: 'ISR estimado', value: money(tax)},
        {label: 'Neto estimado', value: money(income - tax), total: true}
      ], 'No considera subsidio al empleo ni otras deducciones.');
    }
    if (type === 'aguinaldo') {
      const salary = val('salario'), days = val('diasAguinaldo'), worked = val('diasTrabajados');
      if (salary <= 0 || days <= 0 || worked <= 0) return fail('Ingresa valores mayores que cero');
      const daily = salary / 30, full = daily * days, proportional = full * Math.min(worked, 365) / 365;
      return showRows([{label: 'Salario diario', value: money(daily)}, {label: 'Aguinaldo completo', value: money(full)}, {label: 'Aguinaldo proporcional', value: money(proportional), total: true}], 'Estimación bruta.');
    }
    if (type === 'vacaciones') {
      const salary = val('salario'), years = Math.floor(val('anios')), premium = val('prima') / 100;
      if (salary <= 0 || years < 1) return fail('El salario y la antigüedad deben ser válidos');
      const days = years <= 5 ? 10 + years * 2 : 20 + Math.floor((years - 5) / 5) * 2;
      const daily = salary / 30, base = daily * days, bonus = base * premium;
      return showRows([{label: 'Días de vacaciones', value: days}, {label: 'Pago del periodo', value: money(base)}, {label: 'Prima vacacional', value: money(bonus)}, {label: 'Referencia total', value: money(base + bonus), total: true}]);
    }
    if (type === 'iva') {
      const amount = val('cantidad'), rate = val('tasa') / 100, operation = document.getElementById('operacion').value;
      if (amount <= 0) return fail('La cantidad debe ser mayor que cero');
      let subtotal, tax, total;
      if (operation === 'agregar') { subtotal = amount; tax = amount * rate; total = subtotal + tax; }
      else if (operation === 'quitar') { total = amount; subtotal = total / (1 + rate); tax = total - subtotal; }
      else { subtotal = amount; tax = amount * rate; total = tax; }
      return showRows([{label: 'Subtotal', value: money(subtotal)}, {label: 'IVA', value: money(tax)}, {label: operation === 'calcular' ? 'Impuesto' : 'Total', value: money(total), total: true}]);
    }
    if (type === 'finiquito') {
      const salary = val('salario'), pending = val('diasPendientes'), yearDays = val('diasAnio'), vacation = val('vacacionesPendientes'), bonusDays = val('diasAguinaldo'), premium = val('prima') / 100;
      if (salary <= 0 || yearDays < 0) return fail('Ingresa valores válidos');
      const daily = salary / 30, wages = daily * pending, bonus = daily * bonusDays * yearDays / 365, vacationPay = daily * vacation, vacationBonus = vacationPay * premium;
      return showRows([{label: 'Días pendientes', value: money(wages)}, {label: 'Aguinaldo proporcional', value: money(bonus)}, {label: 'Vacaciones pendientes', value: money(vacationPay)}, {label: 'Prima vacacional', value: money(vacationBonus)}, {label: 'Finiquito estimado', value: money(wages + bonus + vacationPay + vacationBonus), total: true}], 'No incluye indemnizaciones, prima de antigüedad ni retenciones.');
    }
    if (type === 'horas-extra') {
      const salary = val('salario'), hours = val('horas'), shift = val('jornada');
      if (salary <= 0 || hours < 0 || shift <= 0) return fail('Ingresa valores válidos');
      const hourly = salary / 30 / shift, doubleHours = Math.min(hours, 9), tripleHours = Math.max(hours - 9, 0), doublePay = hourly * 2 * doubleHours, triplePay = hourly * 3 * tripleHours;
      return showRows([{label: 'Hora ordinaria', value: money(hourly)}, {label: 'Horas dobles', value: doubleHours}, {label: 'Pago doble', value: money(doublePay)}, {label: 'Horas triples', value: tripleHours}, {label: 'Pago triple', value: money(triplePay)}, {label: 'Total extraordinario', value: money(doublePay + triplePay), total: true}], 'Referencia general; revisa las condiciones reales de tu jornada.');
    }
    if (type === 'salario-diario') {
      const salary = val('salario'), period = document.getElementById('periodo').value;
      if (salary <= 0) return fail('El ingreso debe ser mayor que cero');
      const divisor = {mensual: 30, quincenal: 15, semanal: 7}[period];
      return showRows([{label: 'Ingreso del periodo', value: money(salary)}, {label: 'Divisor', value: `${divisor} días`}, {label: 'Salario diario', value: money(salary / divisor), total: true}]);
    }
    if (type === 'descuento') {
      const price = val('precio'), percentage = val('porcentaje');
      if (price <= 0 || percentage < 0) return fail('Ingresa valores válidos');
      const saving = price * percentage / 100;
      return showRows([{label: 'Precio original', value: money(price)}, {label: 'Ahorro', value: money(saving)}, {label: 'Precio final', value: money(price - saving), total: true}]);
    }
    if (type === 'salario-neto') {
      const gross = val('salario'), tax = val('isrManual'), social = val('imss'), other = val('otras');
      if (gross <= 0) return fail('El salario debe ser mayor que cero');
      const deductions = tax + social + other;
      return showRows([{label: 'Salario bruto', value: money(gross)}, {label: 'Deducciones', value: money(deductions)}, {label: 'Salario neto estimado', value: money(gross - deductions), total: true}]);
    }
    if (type === 'salario-bruto') {
      const net = val('neto'), deductions = val('deducciones');
      if (net <= 0) return fail('El salario debe ser mayor que cero');
      return showRows([{label: 'Salario neto', value: money(net)}, {label: 'Deducciones', value: money(deductions)}, {label: 'Salario bruto estimado', value: money(net + deductions), total: true}]);
    }
    if (type === 'salario-diario-integrado') {
      const daily = val('salarioDiario'), bonusDays = val('diasAguinaldo'), vacationDays = val('diasVacaciones'), premium = val('prima') / 100;
      if (daily <= 0) return fail('Ingresa un salario diario válido');
      const factor = (365 + bonusDays + vacationDays * premium) / 365;
      return showRows([{label: 'Factor de integración', value: factor.toFixed(6)}, {label: 'Salario diario', value: money(daily)}, {label: 'SDI estimado', value: money(daily * factor), total: true}], 'No incluye prestaciones adicionales ni topes aplicables.');
    }
    if (type === 'prima-dominical') {
      const daily = val('salarioDiario'), sundays = val('domingos'), percentage = val('porcentaje') / 100;
      if (daily <= 0 || sundays < 0) return fail('Ingresa valores válidos');
      return showRows([{label: 'Prima por domingo', value: money(daily * percentage)}, {label: 'Domingos', value: sundays}, {label: 'Prima total', value: money(daily * percentage * sundays), total: true}]);
    }
    if (type === 'prima-vacacional') {
      const daily = val('salarioDiario'), days = val('dias'), percentage = val('prima') / 100;
      if (daily <= 0 || days < 0) return fail('Ingresa valores válidos');
      const base = daily * days;
      return showRows([{label: 'Pago base de vacaciones', value: money(base)}, {label: 'Porcentaje de prima', value: `${(percentage * 100).toFixed(2)}%`}, {label: 'Prima vacacional', value: money(base * percentage), total: true}]);
    }
    if (type === 'aguinaldo-proporcional') {
      const daily = val('salarioDiario'), bonusDays = val('diasAguinaldo'), worked = val('diasTrabajados');
      if (daily <= 0 || bonusDays <= 0 || worked < 0) return fail('Ingresa valores válidos');
      const annual = daily * bonusDays, proportional = annual * Math.min(worked, 365) / 365;
      return showRows([{label: 'Aguinaldo anual', value: money(annual)}, {label: 'Proporción del año', value: `${(Math.min(worked, 365) / 365 * 100).toFixed(2)}%`}, {label: 'Aguinaldo proporcional', value: money(proportional), total: true}]);
    }
    if (type === 'vacaciones-proporcionales') {
      const daily = val('salarioDiario'), annualDays = val('diasAnuales'), worked = val('diasTrabajados'), premium = val('prima') / 100;
      if (daily <= 0 || annualDays < 0 || worked < 0) return fail('Ingresa valores válidos');
      const days = annualDays * Math.min(worked, 365) / 365, base = daily * days, bonus = base * premium;
      return showRows([{label: 'Días proporcionales', value: days.toFixed(2)}, {label: 'Pago de vacaciones', value: money(base)}, {label: 'Prima vacacional', value: money(bonus)}, {label: 'Total estimado', value: money(base + bonus), total: true}]);
    }
    if (type === 'liquidacion') {
      const daily = val('salarioDiario'), years = val('anios'), pending = val('diasPendientes'), include = document.getElementById('incluir20').value === 'si';
      if (daily <= 0 || years < 0) return fail('Ingresa valores válidos');
      const threeMonths = daily * 90, twentyDays = include ? daily * 20 * years : 0, pendingPay = daily * pending;
      return showRows([{label: 'Tres meses de salario', value: money(threeMonths)}, {label: '20 días por año', value: money(twentyDays)}, {label: 'Sueldo pendiente', value: money(pendingPay)}, {label: 'Referencia total', value: money(threeMonths + twentyDays + pendingPay), total: true}], 'Es una simulación informativa y no determina derechos.');
    }
    if (type === 'ptu') {
      const pool = val('bolsa'), personDays = val('diasPersona'), totalDays = val('diasTotal'), personSalary = val('salarioPersona'), totalSalary = val('salarioTotal');
      if (pool <= 0 || totalDays <= 0 || totalSalary <= 0) return fail('Los totales deben ser mayores que cero');
      const byDays = pool / 2 * personDays / totalDays, bySalary = pool / 2 * personSalary / totalSalary;
      return showRows([{label: 'Parte por días', value: money(byDays)}, {label: 'Parte por salario', value: money(bySalary)}, {label: 'PTU estimada', value: money(byDays + bySalary), total: true}], 'Simulación sin topes ni reglas de elegibilidad.');
    }
    if (type === 'retencion-iva') {
      const subtotal = val('subtotal'), rate = val('tasaIva') / 100, retentionRate = val('retencion') / 100;
      if (subtotal <= 0) return fail('El subtotal debe ser mayor que cero');
      const tax = subtotal * rate, retention = tax * retentionRate;
      return showRows([{label: 'Subtotal', value: money(subtotal)}, {label: 'IVA causado', value: money(tax)}, {label: 'IVA retenido', value: money(retention)}, {label: 'Total después de retención', value: money(subtotal + tax - retention), total: true}]);
    }
    if (type === 'iva-incluido') {
      const total = val('total'), rate = val('tasa') / 100;
      if (total <= 0 || rate < 0) return fail('Ingresa valores válidos');
      const subtotal = total / (1 + rate);
      return showRows([{label: 'Precio con IVA', value: money(total)}, {label: 'Subtotal', value: money(subtotal)}, {label: 'IVA incluido', value: money(total - subtotal), total: true}]);
    }
    if (type === 'porcentaje') {
      const operation = document.getElementById('operacion').value, x = val('x'), y = val('y');
      if ((operation !== 'de' && y === 0) || (operation === 'cambio' && x === 0)) return fail('No se puede dividir entre cero');
      let label, result;
      if (operation === 'de') { label = `${x}% de ${y}`; result = x / 100 * y; }
      else if (operation === 'representa') { label = `${x} representa`; result = x / y * 100; }
      else { label = 'Cambio porcentual'; result = (y - x) / x * 100; }
      return showRows([{label, value: operation === 'de' ? result.toFixed(2) : `${result.toFixed(2)}%`, total: true}]);
    }
    if (type === 'aumento-salarial') {
      const salary = val('salario'), percentage = val('porcentaje') / 100;
      if (salary <= 0) return fail('El salario debe ser mayor que cero');
      const increase = salary * percentage;
      return showRows([{label: 'Salario actual', value: money(salary)}, {label: 'Aumento', value: money(increase)}, {label: 'Nuevo salario', value: money(salary + increase), total: true}]);
    }
    if (type === 'comision') {
      const sales = val('ventas'), percentage = val('porcentaje') / 100, base = val('base');
      if (sales < 0) return fail('Las ventas no pueden ser negativas');
      const commission = sales * percentage;
      return showRows([{label: 'Ventas', value: money(sales)}, {label: 'Comisión', value: money(commission)}, {label: 'Pago base', value: money(base)}, {label: 'Ingreso total', value: money(commission + base), total: true}]);
    }
    if (type === 'interes-simple') {
      const principal = val('capital'), rate = val('tasa') / 100, months = val('meses');
      if (principal <= 0 || months < 0) return fail('Ingresa valores válidos');
      const interest = principal * rate * months / 12;
      return showRows([{label: 'Capital', value: money(principal)}, {label: 'Interés generado', value: money(interest)}, {label: 'Monto final', value: money(principal + interest), total: true}]);
    }
    if (type === 'interes-compuesto') {
      const principal = val('capital'), rate = val('tasa') / 100, years = val('anios'), frequency = Number(document.getElementById('frecuencia').value);
      if (principal <= 0 || years < 0) return fail('Ingresa valores válidos');
      const total = principal * Math.pow(1 + rate / frequency, frequency * years);
      return showRows([{label: 'Capital inicial', value: money(principal)}, {label: 'Intereses estimados', value: money(total - principal)}, {label: 'Monto final', value: money(total), total: true}]);
    }
    if (type === 'prestamo') {
      const principal = val('monto'), annual = val('tasa') / 100, months = val('meses');
      if (principal <= 0 || months <= 0) return fail('Ingresa valores válidos');
      const rate = annual / 12;
      const payment = rate === 0 ? principal / months : principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      const total = payment * months;
      return showRows([{label: 'Capital', value: money(principal)}, {label: 'Mensualidad estimada', value: money(payment)}, {label: 'Intereses totales', value: money(total - principal)}, {label: 'Pago total', value: money(total), total: true}]);
    }
    if (type === 'ahorro-mensual') {
      const initial = val('inicial'), contribution = val('aportacion'), annual = val('tasa') / 100, months = val('meses');
      if (initial < 0 || contribution < 0 || months < 0) return fail('Ingresa valores válidos');
      const rate = annual / 12, initialFuture = initial * Math.pow(1 + rate, months), contributionFuture = rate === 0 ? contribution * months : contribution * (Math.pow(1 + rate, months) - 1) / rate, total = initialFuture + contributionFuture, invested = initial + contribution * months;
      return showRows([{label: 'Aportado por ti', value: money(invested)}, {label: 'Rendimiento estimado', value: money(total - invested)}, {label: 'Ahorro acumulado', value: money(total), total: true}]);
    }
    if (type === 'regla-tres') {
      const a = val('a'), b = val('b'), c = val('c');
      if (a === 0) return fail('El valor A no puede ser cero');
      return showRows([{label: 'Proporción', value: `${b} × ${c} ÷ ${a}`}, {label: 'Valor desconocido', value: (b * c / a).toLocaleString('es-MX', {maximumFractionDigits: 6}), total: true}]);
    }
    if (type === 'edad') {
      const start = dateValue('fechaNacimiento'), end = dateValue('fechaFinal');
      if (!start || !end || end < start) return fail('La fecha final debe ser posterior a la inicial');
      let years = end.getUTCFullYear() - start.getUTCFullYear();
      let months = end.getUTCMonth() - start.getUTCMonth();
      let days = end.getUTCDate() - start.getUTCDate();
      if (days < 0) {
        months--;
        days += new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
      }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((end - start) / 86400000);
      return showRows([{label: 'Años', value: years}, {label: 'Meses adicionales', value: months}, {label: 'Días adicionales', value: days}, {label: 'Días transcurridos', value: totalDays.toLocaleString('es-MX'), total: true}]);
    }
    if (type === 'diferencia-fechas') {
      const start = dateValue('fechaInicio'), end = dateValue('fechaFin');
      if (!start || !end || end < start) return fail('La fecha final debe ser posterior a la inicial');
      const days = Math.floor((end - start) / 86400000), weeks = days / 7;
      return showRows([{label: 'Semanas completas', value: Math.floor(weeks)}, {label: 'Días adicionales', value: days % 7}, {label: 'Diferencia total', value: `${days.toLocaleString('es-MX')} días`, total: true}]);
    }
    if (type === 'propina') {
      const bill = val('cuenta'), percentage = val('propinaPct') / 100, people = val('personas');
      if (bill <= 0 || people < 1) return fail('La cuenta y las personas deben ser válidas');
      const tip = bill * percentage, total = bill + tip;
      return showRows([{label: 'Cuenta', value: money(bill)}, {label: 'Propina', value: money(tip)}, {label: 'Total', value: money(total)}, {label: 'Por persona', value: money(total / people), total: true}]);
    }
    if (type === 'margen-ganancia') {
      const cost = val('costo'), sale = val('venta');
      if (cost < 0 || sale <= 0) return fail('Ingresa costo y venta válidos');
      const profit = sale - cost, margin = profit / sale * 100, markup = cost === 0 ? 0 : profit / cost * 100;
      return showRows([{label: 'Utilidad', value: money(profit)}, {label: 'Aumento sobre costo', value: `${markup.toFixed(2)}%`}, {label: 'Margen sobre venta', value: `${margin.toFixed(2)}%`, total: true}]);
    }
    if (type === 'precio-venta') {
      const cost = val('costo'), percentage = val('aumento') / 100;
      if (cost < 0 || percentage < 0) return fail('Ingresa valores válidos');
      const profit = cost * percentage;
      return showRows([{label: 'Costo', value: money(cost)}, {label: 'Utilidad agregada', value: money(profit)}, {label: 'Precio de venta', value: money(cost + profit), total: true}]);
    }
    if (type === 'punto-equilibrio') {
      const fixed = val('costosFijos'), price = val('precioUnidad'), variable = val('costoVariable');
      const contribution = price - variable;
      if (fixed < 0 || contribution <= 0) return fail('El precio debe ser mayor al costo variable');
      const units = Math.ceil(fixed / contribution);
      return showRows([{label: 'Margen por unidad', value: money(contribution)}, {label: 'Ventas de equilibrio', value: money(units * price)}, {label: 'Unidades necesarias', value: units.toLocaleString('es-MX'), total: true}]);
    }
    if (type === 'roi') {
      const investment = val('inversion'), final = val('valorFinal');
      if (investment <= 0) return fail('La inversión debe ser mayor que cero');
      const gain = final - investment, roi = gain / investment * 100;
      return showRows([{label: 'Inversión', value: money(investment)}, {label: 'Ganancia o pérdida', value: money(gain)}, {label: 'ROI', value: `${roi.toFixed(2)}%`, total: true}]);
    }
    if (type === 'inflacion') {
      const amount = val('cantidad'), rate = val('inflacionPct') / 100, years = val('anios');
      if (amount <= 0 || rate < 0 || years < 0) return fail('Ingresa valores válidos');
      const factor = Math.pow(1 + rate, years), futureCost = amount * factor, purchasing = amount / factor;
      return showRows([{label: 'Cantidad actual', value: money(amount)}, {label: 'Costo futuro equivalente', value: money(futureCost)}, {label: 'Poder adquisitivo estimado', value: money(purchasing), total: true}], 'Simulación basada en una tasa constante.');
    }
    if (type === 'ahorro-meta') {
      const target = val('meta'), current = val('actual'), months = val('meses');
      if (target <= 0 || current < 0 || months <= 0) return fail('Ingresa valores válidos');
      const missing = Math.max(0, target - current);
      return showRows([{label: 'Meta', value: money(target)}, {label: 'Faltante', value: money(missing)}, {label: 'Ahorro mensual necesario', value: money(missing / months), total: true}], 'No incluye rendimientos ni inflación.');
    }
    if (type === 'tiempo-ahorro') {
      const target = val('meta'), current = val('actual'), contribution = val('aportacion');
      if (target <= 0 || current < 0 || contribution <= 0) return fail('Ingresa valores válidos');
      const months = Math.max(0, Math.ceil((target - current) / contribution));
      return showRows([{label: 'Faltante actual', value: money(Math.max(0, target - current))}, {label: 'Aportación mensual', value: money(contribution)}, {label: 'Tiempo estimado', value: `${months} meses`, total: true}], 'No incluye rendimientos ni inflación.');
    }
    if (type === 'credito-automotriz') {
      const price = val('precioAuto'), downRate = val('enganchePct') / 100, annual = val('tasa'), months = val('meses');
      if (price <= 0 || downRate < 0 || downRate >= 1 || months <= 0) return fail('Revisa precio, enganche y plazo');
      const down = price * downRate, principal = price - down, monthly = payment(principal, annual, months), total = monthly * months;
      return showRows([{label: 'Enganche', value: money(down)}, {label: 'Monto financiado', value: money(principal)}, {label: 'Intereses estimados', value: money(total - principal)}, {label: 'Mensualidad', value: money(monthly), total: true}], 'No incluye seguros, comisiones ni gastos adicionales.');
    }
    if (type === 'hipoteca') {
      const price = val('precioCasa'), downRate = val('enganchePct') / 100, annual = val('tasa'), years = val('anios'), months = years * 12;
      if (price <= 0 || downRate < 0 || downRate >= 1 || years <= 0) return fail('Revisa precio, enganche y plazo');
      const down = price * downRate, principal = price - down, monthly = payment(principal, annual, months), total = monthly * months;
      return showRows([{label: 'Enganche', value: money(down)}, {label: 'Monto financiado', value: money(principal)}, {label: 'Intereses estimados', value: money(total - principal)}, {label: 'Mensualidad', value: money(monthly), total: true}], 'No incluye seguros, comisiones, avalúo ni gastos notariales.');
    }
    if (type === 'pago-quincenal') {
      const salary = val('salario');
      if (salary <= 0) return fail('El salario debe ser mayor que cero');
      return showRows([{label: 'Salario mensual', value: money(salary)}, {label: 'Salario diario', value: money(salary / 30)}, {label: 'Pago quincenal', value: money(salary / 2), total: true}], 'Importes brutos antes de deducciones.');
    }
    if (type === 'salario-hora') {
      const salary = val('salario'), days = val('diasMes'), hours = val('horasDia');
      if (salary <= 0 || days <= 0 || hours <= 0) return fail('Ingresa valores mayores que cero');
      const monthlyHours = days * hours;
      return showRows([{label: 'Horas mensuales', value: monthlyHours.toFixed(2)}, {label: 'Salario diario', value: money(salary / days)}, {label: 'Salario por hora', value: money(salary / monthlyHours), total: true}]);
    }
    if (type === 'bono') {
      const salary = val('salario'), rate = val('bonoPct') / 100;
      if (salary < 0 || rate < 0) return fail('Ingresa valores válidos');
      const bonus = salary * rate;
      return showRows([{label: 'Salario base', value: money(salary)}, {label: 'Bono bruto', value: money(bonus)}, {label: 'Total bruto', value: money(salary + bonus), total: true}]);
    }
    if (type === 'reparto-cuenta') {
      const total = val('total'), people = val('personas');
      if (total < 0 || people < 1) return fail('Ingresa un total y personas válidos');
      return showRows([{label: 'Total', value: money(total)}, {label: 'Personas', value: people}, {label: 'Monto por persona', value: money(total / people), total: true}]);
    }
    if (type === 'precio-sin-descuento') {
      const final = val('precioFinal'), rate = val('descuentoPct') / 100;
      if (final <= 0 || rate < 0 || rate >= 1) return fail('El descuento debe estar entre 0% y menos de 100%');
      const original = final / (1 - rate);
      return showRows([{label: 'Precio pagado', value: money(final)}, {label: 'Descuento recibido', value: money(original - final)}, {label: 'Precio original', value: money(original), total: true}]);
    }
    if (type === 'tasa-efectiva') {
      const nominal = val('tasaNominal') / 100, frequency = val('frecuencia');
      if (nominal < 0 || frequency < 1) return fail('Ingresa una tasa y frecuencia válidas');
      const effective = Math.pow(1 + nominal / frequency, frequency) - 1;
      return showRows([{label: 'Tasa nominal', value: `${(nominal * 100).toFixed(2)}%`}, {label: 'Capitalizaciones por año', value: frequency}, {label: 'Tasa efectiva anual', value: `${(effective * 100).toFixed(4)}%`, total: true}]);
    }
    if (type === 'rendimiento-anualizado') {
      const initial = val('capitalInicial'), final = val('capitalFinal'), days = val('dias');
      if (initial <= 0 || final < 0 || days <= 0) return fail('Ingresa valores válidos');
      const periodReturn = final / initial - 1, annualized = Math.pow(final / initial, 365 / days) - 1;
      return showRows([{label: 'Rendimiento del periodo', value: `${(periodReturn * 100).toFixed(2)}%`}, {label: 'Duración', value: `${days} días`}, {label: 'Rendimiento anualizado', value: `${(annualized * 100).toFixed(2)}%`, total: true}], 'Anualización matemática; no garantiza rendimientos futuros.');
    }
    if (type === 'cetes') {
      const price = val('precio'), nominal = val('valorNominal'), titles = val('titulos'), days = val('dias');
      if (price <= 0 || nominal <= 0 || titles < 1 || days <= 0) return fail('Ingresa valores válidos');
      const investment = price * titles, gain = (nominal - price) * titles, annualYield = (nominal - price) / price * 360 / days * 100;
      return showRows([{label: 'Inversión estimada', value: money(investment)}, {label: 'Valor al vencimiento', value: money(nominal * titles)}, {label: 'Ganancia bruta', value: money(gain)}, {label: 'Rendimiento anual simple', value: `${annualYield.toFixed(2)}%`, total: true}], 'No incluye impuestos, comisiones ni reinversión.');
    }
    if (type === 'costo-unidad') {
      const fixed = val('costosFijos'), variable = val('costosVariables'), units = val('unidades');
      if (fixed < 0 || variable < 0 || units < 1) return fail('Ingresa costos y unidades válidos');
      const total = fixed + variable;
      return showRows([{label: 'Costo total', value: money(total)}, {label: 'Unidades', value: units.toLocaleString('es-MX')}, {label: 'Costo por unidad', value: money(total / units), total: true}]);
    }
    if (type === 'conversion-longitud') {
      const amount = val('cantidad'), from = document.getElementById('origen').value, to = document.getElementById('destino').value;
      const meters = {m: 1, km: 1000, ft: 0.3048, mi: 1609.344};
      const labels = {m: 'metros', km: 'kilómetros', ft: 'pies', mi: 'millas'};
      const result = amount * meters[from] / meters[to];
      return showRows([{label: 'Cantidad original', value: `${amount.toLocaleString('es-MX')} ${labels[from]}`}, {label: 'Resultado', value: `${result.toLocaleString('es-MX', {maximumFractionDigits: 6})} ${labels[to]}`, total: true}]);
    }
    if (type === 'costo-combustible') {
      const distance = val('distancia'), efficiency = val('rendimiento'), price = val('precioLitro');
      if (distance < 0 || efficiency <= 0 || price < 0) return fail('Ingresa valores válidos');
      const liters = distance / efficiency;
      return showRows([{label: 'Distancia', value: `${distance.toLocaleString('es-MX')} km`}, {label: 'Combustible estimado', value: `${liters.toFixed(2)} litros`}, {label: 'Costo del recorrido', value: money(liters * price), total: true}]);
    }
  });
});

/* CM_CALCULATORS_BUNDLE_END */

/* CM_SIMULATORS_BUNDLE_START */
document.addEventListener('DOMContentLoaded',()=>{
  const money=value=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2}).format(value);
  const number=id=>Number(document.getElementById(id)?.value)||0;
  const payment=(principal,annual,months)=>{const r=annual/1200;return r===0?principal/months:principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1)};
  const future=(initial,monthly,annual,years)=>{const months=Math.round(years*12),r=annual/1200;let total=initial;for(let i=0;i<months;i++)total=total*(1+r)+monthly;return total};
  const bars=(a,b,labelA='Escenario A',labelB='Escenario B')=>{const max=Math.max(a,b,1);return `<div class="smart-bars"><div><span>${labelA}<strong>${money(a)}</strong></span><i style="--w:${a/max*100}%"></i></div><div><span>${labelB}<strong>${money(b)}</strong></span><i style="--w:${b/max*100}%"></i></div></div>`};
  const result=(id,a,b,better,extra='')=>{const delta=b-a;document.getElementById(id).innerHTML=`<div class="smart-summary"><div><small>Escenario A</small><strong>${money(a)}</strong></div><div><small>Escenario B</small><strong>${money(b)}</strong></div><div class="smart-winner"><small>Diferencia</small><strong>${money(Math.abs(delta))}</strong><span>${better}</span></div></div>${bars(a,b)}${extra}`};
  document.querySelectorAll('[data-smart-tab]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-smart-tab]').forEach(x=>x.classList.toggle('active',x===button));document.querySelectorAll('[data-smart-panel]').forEach(x=>x.hidden=x.dataset.smartPanel!==button.dataset.smartTab)}));
  document.getElementById('compare-salary')?.addEventListener('click',()=>{const a=number('salary-a')-number('deductions-a'),b=number('salary-b')-number('deductions-b');if(a<0||b<0)return;result('salary-result',a,b,b>a?'B deja mayor ingreso neto':a>b?'A deja mayor ingreso neto':'Ambos son iguales')});
  document.getElementById('compare-loan')?.addEventListener('click',()=>{const principal=number('loan-amount'),ma=Math.round(number('loan-years-a')*12),mb=Math.round(number('loan-years-b')*12);if(principal<=0||ma<=0||mb<=0)return;const pa=payment(principal,number('loan-rate-a'),ma),pb=payment(principal,number('loan-rate-b'),mb),ta=pa*ma,tb=pb*mb;result('loan-result',ta,tb,tb<ta?'B tiene menor pago total':ta<tb?'A tiene menor pago total':'El pago total es igual',`<div class="smart-detail"><span>Mensual A: <b>${money(pa)}</b></span><span>Mensual B: <b>${money(pb)}</b></span><span>Intereses A: <b>${money(ta-principal)}</b></span><span>Intereses B: <b>${money(tb-principal)}</b></span></div><small class="smart-note">Estimación sin comisiones, seguros ni impuestos.</small>`)});
  document.getElementById('compare-saving')?.addEventListener('click',()=>{const a=future(number('save-initial-a'),number('save-monthly-a'),number('save-rate-a'),number('save-years-a')),b=future(number('save-initial-b'),number('save-monthly-b'),number('save-rate-b'),number('save-years-b'));result('saving-result',a,b,b>a?'B acumula más':a>b?'A acumula más':'Ambos acumulan lo mismo','<small class="smart-note">Proyección matemática; no garantiza rendimientos futuros.</small>')});
});

/* CM_SIMULATORS_BUNDLE_END */
