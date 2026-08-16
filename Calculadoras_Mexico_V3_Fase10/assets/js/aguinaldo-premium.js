document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.calc !== 'aguinaldo') return;

  const mode = document.getElementById('modoAguinaldo');
  const salaryPeriod = document.getElementById('periodoSalario');
  const salaryInput = document.getElementById('salario');
  const salaryHelp = document.querySelector('[data-aguinaldo-salary-help]');
  const dateFields = document.querySelector('[data-aguinaldo-date-fields]');
  const daysField = document.querySelector('[data-aguinaldo-days-field]');
  const daysInput = document.getElementById('diasTrabajados');
  const startInput = document.getElementById('fechaInicio');
  const endInput = document.getElementById('fechaFin');
  const liveSummary = document.querySelector('[data-aguinaldo-live-summary]');
  const periodVisual = document.querySelector('[data-aguinaldo-period-visual]');
  const periodLabel = document.querySelector('[data-aguinaldo-period-label]');
  const progress = document.querySelector('.aguinaldo-progress');
  const progressBar = document.querySelector('[data-aguinaldo-progress-bar]');
  const calcBox = document.querySelector('.calc-box');
  const resultActions = document.querySelector('[data-aguinaldo-result-actions]');
  const paidCheck = document.querySelector('[data-aguinaldo-paid-check]');
  const paidInput = document.getElementById('aguinaldoPagado');
  const paidResult = document.querySelector('[data-aguinaldo-paid-result]');
  const actionState = document.querySelector('[data-aguinaldo-action-state]');
  const savedList = document.querySelector('[data-aguinaldo-saved-list]');
  const savedKey = 'cm-aguinaldo-saved-v1';
  let lastResult = null;
  const yearStart = new Date(Date.UTC(2026, 0, 1));
  const yearEnd = new Date(Date.UTC(2026, 11, 31));
  const dayMs = 86400000;

  const iso = date => date.toISOString().slice(0, 10);
  const parseDate = value => {
    if (!value) return null;
    const parts = value.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  };
  const clamp = date => new Date(Math.max(yearStart.getTime(), Math.min(yearEnd.getTime(), date.getTime())));
  const formatDate = date => new Intl.DateTimeFormat('es-MX', {day:'numeric', month:'short', year:'numeric', timeZone:'UTC'}).format(date);

  function salaryInfo() {
    const period = salaryPeriod?.value || 'mensual';
    const amount = Number(salaryInput?.value || 0);
    const divisors = {mensual:30, quincenal:15, semanal:7, diario:1};
    const labels = {mensual:'Mensual', quincenal:'Quincenal', semanal:'Semanal', diario:'Diario'};
    const divisor = divisors[period] || 30;
    return {period, amount, divisor, daily: amount / divisor, label: labels[period] || 'Mensual'};
  }

  function updateSalaryHelp() {
    if (!salaryHelp) return;
    const info = salaryInfo();
    const wording = {
      mensual:'Mensual: la herramienta obtiene una referencia diaria dividiendo entre 30.',
      quincenal:'Quincenal: la herramienta obtiene una referencia diaria dividiendo entre 15.',
      semanal:'Semanal: la herramienta obtiene una referencia diaria dividiendo entre 7.',
      diario:'Diario: el importe capturado se usa directamente como referencia diaria.'
    };
    salaryHelp.textContent = wording[info.period] || wording.mensual;
  }

  function dateScenario() {
    const rawStart = parseDate(startInput?.value);
    const rawEnd = parseDate(endInput?.value);
    if (!rawStart || !rawEnd) return null;
    const start = clamp(rawStart);
    const end = clamp(rawEnd);
    if (start > end) return {error: 'La fecha inicial debe ser anterior o igual a la fecha final.'};
    const days = Math.floor((end - start) / dayMs) + 1;
    return {start, end, days};
  }

  function currentDays() {
    if (!mode || mode.value === 'completo') return 365;
    if (mode.value === 'dias') {
      const days = Number(daysInput?.value || 0);
      return Number.isFinite(days) ? Math.max(0, Math.min(days,365)) : 0;
    }
    const scenario = dateScenario();
    return scenario && !scenario.error ? scenario.days : 0;
  }

  function updatePeriodVisual() {
    if (!periodVisual || !periodLabel || !progress || !progressBar) return;
    const days = currentDays();
    const percent = Math.max(0, Math.min(100, days / 365 * 100));
    periodLabel.textContent = days > 0 ? `${Math.round(days)} de 365 días · ${percent.toFixed(2)}%` : 'Completa el periodo para ver la proporción';
    progressBar.style.width = `${percent}%`;
    progress.setAttribute('aria-valuenow', percent.toFixed(2));
  }

  function setSummary() {
    if (!liveSummary || !mode) return;
    updateSalaryHelp();
    if (mode.value === 'completo') {
      liveSummary.innerHTML = '<strong>Escenario actual:</strong> año completo, 365 días considerados.';
      updatePeriodVisual();
      return;
    }
    if (mode.value === 'dias') {
      const days = Number(daysInput?.value || 0);
      liveSummary.innerHTML = `<strong>Escenario actual:</strong> ${days > 0 ? `${Math.min(days,365)} días capturados` : 'captura tus días trabajados'}.`;
      updatePeriodVisual();
      return;
    }
    const scenario = dateScenario();
    if (!scenario) {
      liveSummary.innerHTML = '<strong>Escenario actual:</strong> selecciona fecha inicial y final para contar los días automáticamente.';
    } else if (scenario.error) {
      liveSummary.innerHTML = `<strong>Revisa las fechas:</strong> ${scenario.error}`;
    } else {
      const pct = scenario.days / 365 * 100;
      liveSummary.innerHTML = `<strong>Periodo detectado:</strong> ${formatDate(scenario.start)} a ${formatDate(scenario.end)} · <strong>${scenario.days} días</strong> · ${pct.toFixed(2)}% de 2026.`;
    }
    updatePeriodVisual();
  }

  function applyMode(value, focusDates = false) {
    if (!mode) return;
    mode.value = value;
    if (dateFields) dateFields.hidden = value !== 'fechas';
    if (daysField) daysField.hidden = value !== 'dias';
    document.querySelectorAll('[data-aguinaldo-mode]').forEach(button => {
      button.classList.toggle('active', button.dataset.aguinaldoMode === value);
      button.setAttribute('aria-pressed', String(button.dataset.aguinaldoMode === value));
    });
    if (value === 'completo' && daysInput) daysInput.value = '365';
    setSummary();
    if (focusDates && value === 'fechas') startInput?.focus();
    mode.dispatchEvent(new Event('input', {bubbles:true}));
  }

  function applyDaysPreset(days) {
    if (!daysInput) return;
    if (days >= 365) {
      applyMode('completo');
    } else {
      daysInput.value = String(days);
      applyMode('dias');
      daysInput.dispatchEvent(new Event('input', {bubbles:true}));
    }
    calcBox?.scrollIntoView({behavior:'smooth', block:'start'});
  }

  mode?.addEventListener('change', () => applyMode(mode.value));
  salaryPeriod?.addEventListener('change', () => { updateSalaryHelp(); setSummary(); });
  [salaryInput,daysInput,startInput,endInput].forEach(input => input?.addEventListener('input', setSummary));

  document.addEventListener('click', event => {
    const modeButton = event.target.closest('[data-aguinaldo-mode]');
    if (modeButton) {
      applyMode(modeButton.dataset.aguinaldoMode, modeButton.dataset.aguinaldoMode === 'fechas');
      return;
    }
    const preset = event.target.closest('[data-aguinaldo-days-preset]');
    if (preset) {
      applyDaysPreset(Number(preset.dataset.aguinaldoDaysPreset));
      return;
    }
    const caseButton = event.target.closest('[data-aguinaldo-case]');
    if (caseButton) {
      document.querySelectorAll('[data-aguinaldo-case]').forEach(button => {
        const selected = button === caseButton;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      const value = caseButton.dataset.aguinaldoCase === 'salida' ? 'fechas' : caseButton.dataset.aguinaldoCase;
      applyMode(value, value === 'fechas');
      calcBox?.scrollIntoView({behavior:'smooth', block:'start'});
      return;
    }
    if (event.target.closest('[data-aguinaldo-today]')) {
      const today = new Date();
      const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      if (endInput) endInput.value = iso(clamp(utcToday));
      endInput?.dispatchEvent(new Event('input', {bubbles:true}));
      return;
    }
    if (event.target.closest('[data-aguinaldo-year-end]')) {
      if (endInput) endInput.value = '2026-12-31';
      endInput?.dispatchEvent(new Event('input', {bubbles:true}));
      return;
    }
    if (event.target.closest('[data-form-reset]')) {
      setTimeout(() => {
        if (salaryPeriod) salaryPeriod.value = 'mensual';
        applyMode(mode?.value || 'completo');
        updateSalaryHelp();
        const resultGuide = document.querySelector('[data-aguinaldo-result-guide]');
        const comparison = document.querySelector('[data-aguinaldo-comparison]');
        if (resultGuide) { resultGuide.hidden = true; resultGuide.innerHTML = ''; }
        if (comparison) { comparison.hidden = true; comparison.innerHTML = ''; }
      }, 0);
    }
  });

  setTimeout(() => {
    applyMode(mode?.value || 'completo');
    updateSalaryHelp();
  }, 0);

  globalThis.CMAguinaldo = {
    getSalaryInfo: salaryInfo,
    getScenario() {
      const selected = mode?.value || 'completo';
      if (selected === 'completo') return {mode:selected, days:365, label:'Año completo'};
      if (selected === 'dias') {
        const days = Number(daysInput?.value || 0);
        return {mode:selected, days, label:'Días capturados'};
      }
      const scenario = dateScenario();
      if (!scenario) return {mode:selected, error:'Selecciona una fecha inicial y una fecha final.'};
      if (scenario.error) return {mode:selected, error:scenario.error};
      return {mode:selected, days:scenario.days, label:'Cálculo por fechas', start:scenario.start, end:scenario.end, period:`${formatDate(scenario.start)} a ${formatDate(scenario.end)}`};
    },
    renderGuide(data) {
      const resultGuide = document.querySelector('[data-aguinaldo-result-guide]');
      if (!resultGuide) return;
      const scenarioText = data.mode === 'completo' ? 'un año completo' : data.mode === 'fechas' ? `el periodo ${data.period}` : `${data.worked} días capturados`;
      resultGuide.hidden = false;
      resultGuide.innerHTML = `<span class="badge">Cómo se obtuvo</span><h3>Tu estimación usa ${scenarioText}</h3><p>Tu salario ${data.salaryPeriod.toLowerCase()} de <strong>${data.salaryAmount}</strong> se convirtió a una referencia diaria de <strong>${data.daily}</strong>. Con <strong>${data.days} días de aguinaldo</strong>, el aguinaldo anual de referencia es <strong>${data.full}</strong>. Al aplicar <strong>${data.percentage}%</strong> del año, el monto estimado es <strong>${data.proportional}</strong>.</p><p class="table-note">Es una estimación bruta. No calcula ISR ni sustituye tu recibo de nómina.</p>`;
    },
    renderComparison(data) {
      const box = document.querySelector('[data-aguinaldo-comparison]');
      if (!box) return;
      const diffClass = data.differenceValue > 0 ? 'is-positive' : data.differenceValue < 0 ? 'is-negative' : 'is-neutral';
      const note = data.days > 15
        ? `Tu prestación capturada es de ${data.days} días, por encima de la referencia general de 15 días.`
        : `Tu prestación capturada coincide con la referencia general de 15 días.`;
      box.hidden = false;
      const quick = [15,20,30].map(days => `<article><span>${days} días</span><strong>${moneyLocal(data.dailyValue * days * data.proportion)}</strong></article>`).join('');
      box.innerHTML = `<span class="badge">Comparador</span><h3>15 días vs. tu prestación</h3><p>${note}</p><div class="aguinaldo-comparison-grid"><article><span>Referencia con 15 días</span><strong>${data.minimum}</strong></article><article><span>Con ${data.days} días</span><strong>${data.current}</strong></article><article class="${diffClass}"><span>Diferencia</span><strong>${data.difference}</strong></article></div><h4>Comparación rápida con el mismo salario</h4><div class="aguinaldo-advanced-grid">${quick}</div><p class="table-note">Todos los importes usan el mismo salario y la misma proporción del año. El comparador es informativo y no determina por sí solo lo que debe aparecer en tu nómina.</p>`;
      lastResult = {...data, savedAt: Date.now(), summary: `Aguinaldo estimado: ${data.current} · ${data.worked} de 365 días · ${data.percentage}% del año · prestación de ${data.days} días.`};
      if (resultActions) resultActions.hidden = false;
      if (paidCheck) paidCheck.hidden = false;
      updatePaidComparison();
    },
    setLastResult(extra) { if (lastResult) lastResult = {...lastResult, ...extra}; }
  };

  function moneyLocal(value) { return new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2}).format(Number(value)||0); }
  function readSaved(){ try { return JSON.parse(localStorage.getItem(savedKey)) || []; } catch { return []; } }
  function writeSaved(items){ localStorage.setItem(savedKey, JSON.stringify(items.slice(0,8))); }
  function escapeHtml(text){ return String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function renderSaved(){
    if (!savedList) return;
    const items=readSaved();
    savedList.classList.add('aguinaldo-saved-list');
    savedList.innerHTML = items.length ? items.map((item,i)=>`<article class="aguinaldo-saved-item"><div><strong>${escapeHtml(item.result || 'Cálculo de aguinaldo')}</strong><span>${escapeHtml(item.label || '')} · ${new Date(item.savedAt).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'})}</span></div><div class="aguinaldo-saved-actions"><button type="button" data-aguinaldo-restore="${i}">Usar datos</button><button type="button" data-aguinaldo-delete="${i}">Eliminar</button></div></article>`).join('') : '<p class="table-note">Todavía no has guardado cálculos de aguinaldo.</p>';
  }
  function currentFormSnapshot(){ return {salary:salaryInput?.value||'',salaryPeriod:salaryPeriod?.value||'mensual',bonusDays:document.getElementById('diasAguinaldo')?.value||'15',mode:mode?.value||'completo',days:daysInput?.value||'365',start:startInput?.value||'',end:endInput?.value||''}; }
  function saveCurrent(){
    if (!lastResult) { if(actionState) actionState.textContent='Primero calcula tu aguinaldo.'; return; }
    const snapshot={...currentFormSnapshot(),result:lastResult.current,label:lastResult.summary,savedAt:Date.now()};
    const items=readSaved(); items.unshift(snapshot); writeSaved(items); renderSaved();
    if(actionState) actionState.textContent='Cálculo guardado en este dispositivo.';
  }
  function restoreSaved(index){
    const item=readSaved()[index]; if(!item) return;
    if(salaryInput) salaryInput.value=item.salary; if(salaryPeriod) salaryPeriod.value=item.salaryPeriod; const bonus=document.getElementById('diasAguinaldo'); if(bonus) bonus.value=item.bonusDays;
    if(daysInput) daysInput.value=item.days; if(startInput) startInput.value=item.start; if(endInput) endInput.value=item.end; applyMode(item.mode||'completo'); updateSalaryHelp(); setSummary();
    calcBox?.scrollIntoView({behavior:'smooth',block:'start'}); if(actionState) actionState.textContent='Datos restaurados. Presiona Calcular aguinaldo para actualizar el resultado.';
  }
  function resultText(){ if(!lastResult) return ''; return `Calculadora de Aguinaldo 2026 — ${lastResult.summary} Estimación bruta e informativa. https://calculadora-isr-mexico.vercel.app/calculadoras/aguinaldo.html`; }
  async function copyText(text){
    try { await navigator.clipboard.writeText(text); return true; } catch { const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); const ok=document.execCommand('copy'); ta.remove(); return ok; }
  }
  async function shareResult(){ const text=resultText(); if(!text) return; try { if(navigator.share) await navigator.share({title:'Mi cálculo de aguinaldo 2026',text,url:location.href}); else { await copyText(text); if(actionState) actionState.textContent='Resumen copiado para compartir.'; } } catch(e) { if(e?.name!=='AbortError' && actionState) actionState.textContent='No se pudo compartir. Puedes usar Copiar resultado.'; } }
  function updatePaidComparison(){
    if(!paidResult) return; const paid=Number(paidInput?.value||0); if(!lastResult || paid<=0){paidResult.innerHTML='<span>Captura un importe para comparar.</span>';return;}
    const expected=Number(lastResult.currentValue||0); const diff=paid-expected; const word=diff>0?'por encima de':diff<0?'por debajo de':'igual a'; paidResult.innerHTML=`<div><span>Importe capturado</span><strong>${moneyLocal(paid)}</strong><p>Está <strong>${moneyLocal(Math.abs(diff))}</strong> ${word} esta estimación bruta.</p></div>`;
  }
  paidInput?.addEventListener('input',updatePaidComparison);
  document.addEventListener('click', async event => {
    if(event.target.closest('[data-aguinaldo-save-result]')) return saveCurrent();
    if(event.target.closest('[data-aguinaldo-print]')) return window.print();
    if(event.target.closest('[data-aguinaldo-share]')) return shareResult();
    if(event.target.closest('[data-aguinaldo-copy]')) { const ok=await copyText(resultText()); if(actionState) actionState.textContent=ok?'Resultado copiado.':'No se pudo copiar el resultado.'; return; }
    const restore=event.target.closest('[data-aguinaldo-restore]'); if(restore) return restoreSaved(Number(restore.dataset.aguinaldoRestore));
    const del=event.target.closest('[data-aguinaldo-delete]'); if(del){const items=readSaved();items.splice(Number(del.dataset.aguinaldoDelete),1);writeSaved(items);renderSaved();return;}
    if(event.target.closest('[data-aguinaldo-clear-saved]')){writeSaved([]);renderSaved();if(actionState)actionState.textContent='Cálculos guardados eliminados.';return;}
  });
  renderSaved();
});
