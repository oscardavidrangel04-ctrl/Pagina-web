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
    <figcaption><span>Comparación visual</span><small>Proporción relativa entre los conceptos del resultado</small></figcaption>
    <div class="chart-bars">
      ${items.map((item, index) => {
        const percent = maximum > 0 ? item.value / maximum * 100 : 0;
        return `<div class="chart-item">
        <div class="chart-label"><span><i class="chart-dot color-${index % 5}"></i>${item.label}</span><strong>${item.formatted} <small>${percent.toFixed(0)}%</small></strong></div>
        <div class="chart-track" aria-label="${item.label}: ${percent.toFixed(0)}% respecto al valor mayor"><span class="color-${index % 5}" style="width:${Math.max(3, percent).toFixed(2)}%"></span></div>
      </div>`;
      }).join('')}
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
  const base = Math.abs(saved.primary.number);
  const percentage = base > 0 ? Math.abs(difference) / base * 100 : 0;
  const direction = difference === 0 ? 'Sin cambio' : `${difference > 0 ? '▲' : '▼'} ${differenceText}`;
  return `<section class="scenario-comparison" aria-label="Comparación de escenarios">
    <div><small>Escenario guardado</small><strong>${saved.primary.value}</strong></div>
    <span aria-hidden="true">→</span>
    <div><small>Resultado actual</small><strong>${current.value}</strong></div>
    <b class="${difference > 0 ? 'up' : difference < 0 ? 'down' : ''}">${direction}<small>${difference === 0 ? 'Mismo resultado' : `${percentage.toFixed(1)}% de diferencia`}</small></b>
  </section>`;
}

const resultValue = (rows, label) => rows.find(row => row.label === label)?.value || '';

const CM_RESULT_INSIGHTS = {
  isr: rows => {
    const gross = resultValue(rows, 'Ingreso bruto');
    const tax = resultValue(rows, 'ISR estimado');
    const net = resultValue(rows, 'Neto estimado');
    const effective = resultValue(rows, 'Tasa efectiva estimada');
    const marginal = resultValue(rows, 'Tasa marginal');
    return `De un ingreso bruto de <strong>${gross}</strong>, la estimación separa <strong>${tax}</strong> de ISR y deja <strong>${net}</strong> antes de otras deducciones. El ISR equivale aproximadamente al <strong>${effective}</strong> del ingreso capturado. La tasa marginal de ${marginal} no se aplica a todo el sueldo: corresponde al excedente dentro del rango.`;
  },
  'salario-neto': rows => {
    const gross = resultValue(rows, 'Salario bruto');
    const deductions = resultValue(rows, 'Deducciones');
    const net = resultValue(rows, 'Salario neto estimado');
    const keep = numericValue(gross) > 0 ? numericValue(net) / numericValue(gross) * 100 : 0;
    return `Partiendo de <strong>${gross}</strong> brutos y <strong>${deductions}</strong> en deducciones capturadas, quedan <strong>${net}</strong>. Eso representa aproximadamente <strong>${keep.toFixed(1)}%</strong> del bruto. Es una referencia construida con los importes que escribiste, no una nómina oficial.`;
  },
  'salario-bruto': rows => {
    const net = resultValue(rows, 'Salario neto');
    const deductions = resultValue(rows, 'Deducciones');
    const gross = resultValue(rows, 'Salario bruto estimado');
    const share = numericValue(gross) > 0 ? numericValue(deductions) / numericValue(gross) * 100 : 0;
    return `Para recibir <strong>${net}</strong> después de las deducciones capturadas, la referencia bruta es <strong>${gross}</strong>. Las deducciones representan aproximadamente <strong>${share.toFixed(1)}%</strong> del bruto reconstruido. Este cálculo suma importes conocidos; una nómina real puede contener conceptos adicionales.`;
  },
  aguinaldo: rows => `Con el salario y los días que capturaste, el aguinaldo completo de referencia es <strong>${resultValue(rows,'Aguinaldo completo')}</strong>. Por los días trabajados indicados, el proporcional estimado es <strong>${resultValue(rows,'Aguinaldo proporcional')}</strong>. El resultado es bruto y puede tener tratamiento fiscal según el caso.`,
  vacaciones: rows => `La antigüedad indicada produce una referencia de <strong>${resultValue(rows,'Días de vacaciones')} días</strong>. El pago del periodo es <strong>${resultValue(rows,'Pago del periodo')}</strong> y la prima vacacional estimada es <strong>${resultValue(rows,'Prima vacacional')}</strong>. Revisa ambos conceptos por separado antes de interpretar el total.`,
  finiquito: rows => `Con tus datos, el finiquito estimado es <strong>${resultValue(rows,'Finiquito estimado')}</strong>. La cifra reúne los conceptos mostrados arriba —salarios y prestaciones pendientes capturadas— y no significa que incluya automáticamente indemnizaciones, prima de antigüedad o todas las retenciones posibles.`,
  liquidacion: rows => `La referencia total del escenario es <strong>${resultValue(rows,'Referencia total')}</strong>. Está formada por los conceptos que activaste y capturaste, como tres meses, veinte días por año cuando se incluyan y sueldo pendiente. La procedencia legal de cada concepto depende del caso concreto.`,
  iva: rows => `El escenario separa <strong>${resultValue(rows,'Subtotal')}</strong> de base y <strong>${resultValue(rows,'IVA')}</strong> de impuesto. El resultado final mostrado es <strong>${resultValue(rows,'Total') || resultValue(rows,'Impuesto')}</strong>. Para uso fiscal confirma que la tasa elegida corresponda a la operación.`,
  'horas-extra': rows => `La hora ordinaria de referencia es <strong>${resultValue(rows,'Hora ordinaria')}</strong>. Con las horas capturadas, el pago doble estimado es <strong>${resultValue(rows,'Pago doble')}</strong> y el triple <strong>${resultValue(rows,'Pago triple')}</strong>, para un total extraordinario de <strong>${resultValue(rows,'Total extraordinario')}</strong>.`,
  'prima-vacacional': rows => `El pago base de los días indicados es <strong>${resultValue(rows,'Pago base de vacaciones')}</strong>. Aplicando el porcentaje capturado, la prima vacacional estimada es <strong>${resultValue(rows,'Prima vacacional')}</strong>. La prima es adicional al pago base; no son el mismo concepto.`,
  prestamo: rows => {
    const capital = resultValue(rows, 'Capital');
    const monthly = resultValue(rows, 'Mensualidad estimada');
    const interest = resultValue(rows, 'Intereses totales');
    const total = resultValue(rows, 'Pago total');
    return `Para un capital de <strong>${capital}</strong>, la mensualidad matemática estimada es <strong>${monthly}</strong>. Si tasa y plazo se mantuvieran como los capturaste, los intereses sumarían aproximadamente <strong>${interest}</strong> y el pago total <strong>${total}</strong>. Comisiones, seguros y CAT pueden cambiar el costo real.`;
  }
};

const CM_STEP_LABELS = {
  isr: ['Ingreso bruto','Límite inferior del rango','Excedente','Tasa marginal','Cuota fija','ISR estimado','Tasa efectiva estimada','Neto estimado'],
  'salario-neto': ['Salario bruto','Deducciones','Salario neto estimado'],
  'salario-bruto': ['Salario neto','Deducciones','Salario bruto estimado'],
  aguinaldo: ['Salario diario','Aguinaldo completo','Aguinaldo proporcional'],
  vacaciones: ['Días de vacaciones','Pago del periodo','Prima vacacional','Referencia total'],
  finiquito: ['Días pendientes','Aguinaldo proporcional','Vacaciones pendientes','Prima vacacional','Finiquito estimado'],
  liquidacion: ['Tres meses de salario','20 días por año','Sueldo pendiente','Referencia total'],
  iva: ['Subtotal','IVA','Total','Impuesto'],
  'horas-extra': ['Hora ordinaria','Horas dobles','Pago doble','Horas triples','Pago triple','Total extraordinario'],
  'prima-vacacional': ['Pago base de vacaciones','Porcentaje de prima','Prima vacacional'],
  prestamo: ['Capital','Mensualidad estimada','Intereses totales','Pago total']
};

function resultInsightMarkup(rows) {
  const build = CM_RESULT_INSIGHTS[document.body.dataset.calc];
  if (!build) return '';
  return `<section class="result-insight" aria-label="Explicación personalizada del resultado">
    <span class="result-eyebrow">Interpretación personalizada</span>
    <h3>¿Qué significa tu resultado?</h3>
    <p>${build(rows)}</p>
  </section>`;
}

function stepByStepMarkup(rows) {
  const labels = CM_STEP_LABELS[document.body.dataset.calc];
  if (!labels) return '';
  const available = labels.map(label => rows.find(row => row.label === label)).filter(Boolean);
  if (available.length < 2) return '';
  return `<details class="result-steps"><summary>Ver cálculo paso a paso con tus números</summary><ol>${available.map(row => `<li><span>${row.label}</span><strong>${row.value}</strong></li>`).join('')}</ol></details>`;
}

const CM_QUICK_SIMULATIONS = {
  isr: {id:'salario', unit:'$', deltas:[1000,2000,5000,-1000]},
  'salario-neto': {id:'salario', unit:'$', deltas:[1000,2000,5000,-1000]},
  'salario-bruto': {id:'neto', unit:'$', deltas:[1000,2000,5000,-1000]},
  aguinaldo: {id:'salario', unit:'$', deltas:[1000,2000,5000,-1000]},
  vacaciones: {id:'salario', unit:'$', deltas:[1000,2000,5000,-1000]},
  finiquito: {id:'salario', unit:'$', deltas:[1000,2000,5000,-1000]},
  liquidacion: {id:'salarioDiario', unit:'$', deltas:[100,250,500,-100]},
  iva: {id:'cantidad', unit:'$', deltas:[1000,2000,5000,-1000]},
  'horas-extra': {id:'horas', unit:'h', deltas:[1,3,5,-1]},
  'prima-vacacional': {id:'salarioDiario', unit:'$', deltas:[100,250,500,-100]},
  prestamo: {id:'monto', unit:'$', deltas:[10000,25000,50000,-10000]}
};

function simulationLabel(delta, unit) {
  const sign = delta > 0 ? '+' : '−';
  const amount = Math.abs(delta).toLocaleString('es-MX');
  return unit === '$' ? `${sign}$${amount}` : `${sign}${amount} ${unit}`;
}

function quickSimulationMarkup() {
  const config = CM_QUICK_SIMULATIONS[document.body.dataset.calc];
  if (!config || !document.getElementById(config.id)) return '';
  return `<section class="quick-simulations" aria-label="Simulaciones rápidas">
    <div><span class="result-eyebrow">Explora escenarios</span><h3>Simulaciones rápidas</h3><p>Cambia un dato y recalcula al instante.</p></div>
    <div class="simulation-buttons">${config.deltas.map(delta => `<button type="button" data-quick-sim="${config.id}" data-sim-delta="${delta}">${simulationLabel(delta,config.unit)}</button>`).join('')}</div>
  </section>`;
}

const CM_NEXT_ACTIONS = {
  isr: ['Ahora calcula tu salario neto','Combina esta retención con las demás deducciones de tu nómina.','salario-neto.html'],
  'salario-neto': ['Compara contra el salario bruto','Reconstruye o revisa el importe antes de deducciones.','salario-bruto.html'],
  'salario-bruto': ['Estima el ISR del ingreso bruto','Revisa rango, cuota fija, tasa marginal y neto estimado.','isr.html'],
  finiquito: ['¿Tu salida podría implicar liquidación?','Compara los conceptos sin mezclar prestaciones pendientes con indemnizaciones.','liquidacion.html'],
  liquidacion: ['Calcula también el finiquito','Revisa salarios y prestaciones pendientes como un desglose separado.','finiquito.html'],
  aguinaldo: ['Calcula el aguinaldo proporcional','Úsalo si no se trabajó el año completo o para un escenario de salida.','aguinaldo-proporcional.html'],
  vacaciones: ['Revisa la prima vacacional','Separa el pago de los días de descanso de la prestación adicional.','prima-vacacional.html'],
  iva: ['¿El precio ya incluye IVA?','Separa el subtotal y el impuesto dentro de un total final.','iva-incluido.html'],
  'horas-extra': ['Comprueba tu salario por hora','Revisa primero el valor ordinario usado como base del cálculo.','salario-hora.html'],
  'prima-vacacional': ['Calcula los días de vacaciones','Relaciona antigüedad, días correspondientes y pago del periodo.','vacaciones.html']
};

function nextActionMarkup() {
  const action = CM_NEXT_ACTIONS[document.body.dataset.calc];
  if (!action) return '';
  return `<aside class="result-next"><div><span class="result-eyebrow">Siguiente paso recomendado</span><h3>${action[0]}</h3><p>${action[1]}</p></div><a href="./${action[2]}">Abrir herramienta →</a></aside>`;
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
    <div class="result-heading"><span>Resultado</span><small>${new Date().toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'})}</small></div>
    <div class="result-grid">
      ${rows.map(row => `<div class="result-row ${row.total ? 'total' : ''}"><strong>${row.label}</strong><span>${row.value}</span></div>`).join('')}
      ${note ? `<small>${note}</small>` : ''}
    </div>
    ${resultInsightMarkup(rows)}
    ${stepByStepMarkup(rows)}
    ${chartMarkup(rows)}
    ${comparisonMarkup(rows)}
    ${quickSimulationMarkup()}
    ${nextActionMarkup()}
    <div class="result-actions" aria-label="Acciones del resultado">
      <button type="button" data-result-copy>📋 Copiar</button>
      <button type="button" data-result-share>↗ Compartir</button>
      <button type="button" data-result-link>🔗 Copiar enlace</button>
      <button type="button" data-result-save>⚖ Guardar escenario</button>
      <button type="button" data-result-export>⬇ Exportar CSV</button>
      <button type="button" data-result-print>🖨 Imprimir / PDF</button>
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

let CM_RUNTIME_CATALOG = [];

const normalizeSearch = value => String(value || '')
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase();

function catalogItems() {
  return Array.isArray(globalThis.CM_CATALOG) && globalThis.CM_CATALOG.length
    ? globalThis.CM_CATALOG
    : CM_RUNTIME_CATALOG;
}

function catalogFromCards(scope = document) {
  const seen = new Set();
  return [...scope.querySelectorAll('.calculator-card')].map(card => {
    const link = card.querySelector('a[href*="calculadoras/"]');
    const slug = link?.getAttribute('href')?.match(/calculadoras\/([^/?#]+)\.html/)?.[1];
    if (!slug || seen.has(slug)) return null;
    seen.add(slug);
    return {
      slug,
      title: card.querySelector('h3')?.textContent?.trim() || slug,
      category: card.querySelector('.card-kicker')?.textContent?.trim() || 'Calculadora',
      icon: card.querySelector('.icon')?.textContent?.trim() || '🧮',
      description: card.querySelector('p')?.textContent?.trim() || 'Herramienta gratuita',
      keywords: card.dataset.search || '',
      popular: false,
      new: Boolean(card.querySelector('.new-badge'))
    };
  }).filter(Boolean);
}

async function ensureCatalog() {
  const loaded = catalogItems();
  if (loaded.length >= 50) return loaded;
  const visible = catalogFromCards();
  if (visible.length > CM_RUNTIME_CATALOG.length) CM_RUNTIME_CATALOG = visible;
  try {
    const response = await fetch(`${pageDepth()}calculadoras.html`, {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
    const recovered = catalogFromCards(parsed);
    if (recovered.length > CM_RUNTIME_CATALOG.length) CM_RUNTIME_CATALOG = recovered;
  } catch {
    // Las tarjetas visibles y el enlace al catálogo siguen disponibles sin conexión.
  }
  return catalogItems();
}

function relatedCalculators(slug, limit = 4) {
  const catalog = catalogItems();
  const current = catalog.find(item => item.slug === slug);
  if (!current) return [];
  return catalog
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
  return catalogItems()
    .map(item => ({item, score: activity.filter(slug => slug === item.slug).length * 5 + (item.popular ? 3 : 0) + (item.new ? 1 : 0)}))
    .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'es'))
    .slice(0, limit)
    .map(entry => entry.item);
}

function recommendedCalculators(limit = 8) {
  const signals = [...readStore(CM_KEYS.favorites), ...readStore(CM_KEYS.recent)];
  const catalog = catalogItems();
  const categories = signals.map(slug => catalog.find(item => item.slug === slug)?.category).filter(Boolean);
  const excluded = new Set(signals);
  const ranked = catalog
    .filter(item => !excluded.has(item.slug))
    .map(item => ({item, score: categories.filter(category => category === item.category).length * 4 + (item.popular ? 2 : 0) + (item.new ? 1 : 0)}))
    .sort((a,b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'es'));
  return ranked.slice(0, limit).map(entry => entry.item);
}

function renderPortalSections() {
  if (!catalogItems().length) return;
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
  const catalog = catalogItems();
  const favorites = readStore(CM_KEYS.favorites)
    .map(slug => catalog.find(item => item.slug === slug))
    .filter(Boolean)
    .slice(0, 4);
  const recent = readStore(CM_KEYS.recent)
    .map(slug => catalog.find(item => item.slug === slug))
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
    const catalog = catalogItems();
    if (!catalog.length) return;
    const category = container.dataset.catalog;
    const items = category === 'all' ? catalog : catalog.filter(item => item.category === category);
    container.innerHTML = items.map(item => calculatorCard(item)).join('');
  });
}

function setupCatalogFilters() {
  const input = document.getElementById('catalog-search');
  const grid = document.querySelector('[data-catalog]');
  const buttons = [...document.querySelectorAll('[data-catalog-category]')];
  const count = document.querySelector('[data-catalog-count]');
  if (!input || !grid) return;
  const requestedCategory = new URLSearchParams(location.search).get('categoria');
  let category = buttons.some(button => button.dataset.catalogCategory === requestedCategory) ? requestedCategory : 'Todas';
  const apply = () => {
    const query = normalizeSearch(input.value.trim());
    let visible = 0;
    grid.querySelectorAll('.calculator-card').forEach(card => {
      const cardCategory = card.querySelector('.card-kicker')?.textContent?.trim() || '';
      const matchesCategory = category === 'Todas' || cardCategory === category;
      const matchesText = !query || normalizeSearch(card.dataset.search).includes(query);
      card.hidden = !(matchesCategory && matchesText);
      if (!card.hidden) visible++;
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'resultado' : 'resultados'}`;
  };
  input.addEventListener('input', apply);
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.catalogCategory;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    apply();
    const url = new URL(location.href);
    if (category === 'Todas') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', category);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }));
  buttons.forEach(button => {
    const active = button.dataset.catalogCategory === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  apply();
}

function setupSearch() {
  const dialog = document.querySelector('.search-dialog');
  const input = document.querySelector('.global-search');
  const results = document.querySelector('.search-results');
  const root = pageDepth();
  let active = -1;

  const render = async (term = '') => {
    const catalog = await ensureCatalog();
    const query = normalizeSearch(term.trim());
    const found = catalog.filter(item => !query || normalizeSearch(`${item.title} ${item.description} ${item.category} ${item.keywords}`).includes(query)).slice(0, 10);
    active = -1;
    results.innerHTML = found.length
      ? found.map(item => `<a class="search-result" href="${root}calculadoras/${item.slug}.html"><span><b>${item.icon} ${item.title}</b><small>${item.category} · ${item.description}</small></span><span>→</span></a>`).join('')
      : `<div class="search-empty">No encontramos resultados. <a href="${root}calculadoras.html">Abrir el catálogo completo</a>.</div>`;
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

function setupHomeFinder() {
  const form = document.querySelector('[data-home-finder]');
  const input = form?.querySelector('input');
  const results = document.querySelector('[data-home-finder-results]');
  if (!form || !input || !results) return;
  const render = async () => {
    const query = normalizeSearch(input.value.trim());
    const catalog = await ensureCatalog();
    const found = catalog
      .filter(item => !query || normalizeSearch(`${item.title} ${item.description} ${item.category} ${item.keywords}`).includes(query))
      .slice(0, query ? 8 : 6);
    results.innerHTML = found.length
      ? found.map(item => `<a class="finder-result" href="calculadoras/${item.slug}.html"><span aria-hidden="true">${item.icon}</span><span><strong>${item.title}</strong><small>${item.category}</small></span><b aria-hidden="true">→</b></a>`).join('')
      : '<p class="finder-empty">No hubo coincidencias. Prueba “salario”, “IVA”, “ahorro” o “préstamo”.</p>';
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    results.querySelector('a')?.click();
  });
  input.addEventListener('input', render);
  render();
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
  setupCatalogFilters();
  markRecent();
  renderPersonalSpace();
  renderPortalSections();
  setupSearch();
  setupHomeFinder();
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
    const quickSimulation = event.target.closest('[data-quick-sim]');
    if (quickSimulation) {
      const input = document.getElementById(quickSimulation.dataset.quickSim);
      const delta = Number(quickSimulation.dataset.simDelta || 0);
      if (input && Number.isFinite(delta)) {
        const current = Number(input.value || 0);
        const minimum = input.min === '' ? -Infinity : Number(input.min);
        const next = current + delta;
        if (Number.isFinite(next) && next >= minimum) {
          input.value = String(Math.round((next + Number.EPSILON) * 100) / 100);
          input.dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('.calc-button')?.click();
          showToast('Escenario actualizado');
        } else {
          showToast('Ese cambio dejaría un valor fuera del rango permitido');
        }
      }
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
