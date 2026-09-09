/* Progressive UI enhancement; no calculation formulas. */
(() => {
  'use strict';
  const start = () => {
    const menu = document.querySelector('.main-nav');
    const toggle = document.querySelector('[data-menu-toggle]');
    const closeMenu = () => {
      menu?.classList.remove('open');
      document.body.classList.remove('nav-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Abrir menú');
    };
    toggle?.addEventListener('click', () => toggle.setAttribute('aria-label', toggle.getAttribute('aria-expanded') === 'true' ? 'Cerrar menú' : 'Abrir menú'));
    menu?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu?.classList.contains('open')) { closeMenu(); toggle?.focus(); }
    });
    matchMedia('(min-width:1041px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

    const box = document.querySelector('.calc-box');
    const button = box?.querySelector('.calc-button');
    const result = box?.querySelector('.result');
    if (box && button && result) {
      // Enter submits numeric/date inputs; selects and specialist controls keep native behavior.
      box.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.matches('input:not([type=checkbox]):not([type=radio])')) { e.preventDefault(); button.click(); }
      });
      const stale = document.createElement('p');
      stale.className = 'cm-stale'; stale.hidden = true; stale.setAttribute('role', 'status');
      stale.textContent = 'Cambiaste los datos. Vuelve a calcular para actualizar este resultado.';
      result.before(stale);
      const clearError = field => {
        field.removeAttribute('aria-invalid');
        document.getElementById(field.id + '-error')?.remove();
        const help = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== field.id + '-error');
        if (help.length) field.setAttribute('aria-describedby', help.join(' ')); else field.removeAttribute('aria-describedby');
      };
      box.addEventListener('input', e => {
        if (e.target.matches('input,select,textarea')) {
          clearError(e.target);
          if (result.dataset.ready === 'true') stale.hidden = false;
        }
      });
      box.addEventListener('change', e => { if (e.target.matches('input,select') && result.dataset.ready === 'true') stale.hidden = false; });
      // Capture prevents invalid visible native fields from reaching the existing arithmetic handlers.
      button.addEventListener('click', e => {
        const fields = [...box.querySelectorAll('input[id]')].filter(f => f.type !== 'hidden' && f.getClientRects().length && !f.disabled);
        fields.forEach(clearError);
        const invalid = fields.filter(f => !f.checkValidity());
        if (invalid.length) {
          e.preventDefault(); e.stopImmediatePropagation();
          invalid.forEach(f => {
            f.setAttribute('aria-invalid', 'true');
            const error = document.createElement('span'); error.className = 'cm-field-error'; error.id = f.id + '-error';
            const v=f.validity;const message=v.rangeUnderflow?'El valor mínimo es '+f.min+'.':v.rangeOverflow?'El valor máximo es '+f.max+'.':v.stepMismatch?'Usa incrementos de '+f.step+'.':v.valueMissing?'Completa este dato.':'Introduce un valor válido.';error.textContent = message;
            f.after(error); f.setAttribute('aria-describedby', [f.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
          });
          invalid[0].focus();
          return;
        }
        stale.hidden = true;
        requestAnimationFrame(() => { if (result.dataset.ready === 'true') result.focus({preventScroll:true}); });
      }, true);
      const decorate = () => {
        const rows = [...result.querySelectorAll('.result-row')];
        const totals = rows.filter(r => r.classList.contains('total'));
        const primary = totals.at(-1);
        rows.forEach(r => r.classList.toggle('cm-primary-result', r === primary));
        const failed = rows.length === 1 && /Revisa los datos/.test(rows[0].textContent);
        result.classList.toggle('cm-result-error', failed);
        result.setAttribute('aria-label', failed ? 'Revisa los datos del cálculo' : 'Resultado del cálculo');
        stale.hidden = true;
      };
      new MutationObserver(decorate).observe(result, {childList:true});
      document.querySelector('[data-form-reset]')?.addEventListener('click', () => {
        box.querySelectorAll('input[id]').forEach(clearError); stale.hidden = true;
      });
      // Live calculators repaint outside the generic result container.
      const live = document.querySelector('#tipProResult');
      if (live) new MutationObserver(() => { stale.hidden = true; }).observe(live, {childList:true,subtree:true});
      decorate();
    }
    const syncTipControls = () => {
      const percent = document.querySelector('#propinaPct');
      document.querySelectorAll('[data-tip-preset]').forEach(b => {
        const active = percent && Number(b.dataset.tipPreset) === Number(percent.value);
        b.classList.toggle('is-active', !!active); b.setAttribute('aria-pressed', String(!!active));
      });
      document.querySelectorAll('[data-tip-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('is-active'))));
    };
    if (document.querySelector('#propinaPct')) {
      syncTipControls();
      document.querySelector('.calc-box').addEventListener('click', () => requestAnimationFrame(syncTipControls));
      document.querySelector('.calc-box').addEventListener('input', () => requestAnimationFrame(syncTipControls));
    }
    const grid = document.querySelector('[data-catalog]');
    const count = document.querySelector('[data-catalog-count]');
    const empty = document.querySelector('[data-catalog-empty]');
    if (count) count.setAttribute('role','status');
    if (grid && empty) {
      const update = () => { empty.hidden = !!grid.querySelector('.calculator-card:not([hidden])'); };
      new MutationObserver(update).observe(grid,{attributes:true,subtree:true,attributeFilter:['hidden'],childList:true}); update();
    }
    document.querySelectorAll('.cm-table-scroll,.table-scroll,.table-wrap').forEach(w => {
      w.setAttribute('tabindex','0'); w.setAttribute('role','region');
      if (!w.hasAttribute('aria-label')) w.setAttribute('aria-label','Tabla de datos; desplaza horizontalmente si es necesario');
    });
  };
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', start); else start();
})();
