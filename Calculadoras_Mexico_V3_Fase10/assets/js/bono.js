/* Bono bruto. Importes en centavos; sin reglas fiscales ni porcentajes supuestos. */
(function (root) {
  'use strict';
  const MAX_AMOUNT = 1e12;
  function scaled(value, label, allowZero, max) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (!allowZero && value === 0) || value > max) {
      throw new RangeError(label + ': escribe un número ' + (allowZero ? 'igual o mayor que cero' : 'mayor que cero') + ' dentro del límite mostrado.');
    }
    const integer = Math.round(value * 100);
    if (Math.abs(value * 100 - integer) > Math.max(1e-7, Math.abs(value * 100) * Number.EPSILON * 2)) {
      throw new RangeError(label + ': usa como máximo dos decimales.');
    }
    return BigInt(integer);
  }
  function calculate({base, mode = 'porcentaje', percent = 0, amount = 0}) {
    const cents = scaled(base, 'Base del bono', false, MAX_AMOUNT);
    if (!['porcentaje', 'fijo'].includes(mode)) throw new RangeError('Selecciona porcentaje o importe fijo.');
    let bonus;
    if (mode === 'porcentaje') {
      const points = scaled(percent, 'Porcentaje', true, 10000);
      bonus = (cents * points + 5000n) / 10000n;
    } else bonus = scaled(amount, 'Bono fijo', true, MAX_AMOUNT);
    if (cents + bonus > BigInt(MAX_AMOUNT * 100)) throw new RangeError('La suma supera el límite de cálculo de $1,000,000,000,000.');
    return {base: Number(cents) / 100, bonus: Number(bonus) / 100, total: Number(cents + bonus) / 100,
      percent: mode === 'porcentaje' ? percent : Number(bonus) / Number(cents) * 100, mode};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {calculate};
  root.CMBono = {calculate};
  if (typeof document === 'undefined') return;
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.calc !== 'bono') return;
    const get = id => document.getElementById(id);
    const mode = get('bonoModo'), baseType = get('bonoBaseTipo'), box = get('calculadora'), result = get('resultado');
    const percentGroup = get('bonoPorcentajeGrupo'), fixedGroup = get('bonoFijoGrupo');
    const error = get('bonoError');
    function syncMode() {
      const fixed = mode.value === 'fijo';
      percentGroup.hidden = fixed; get('bonoPct').disabled = fixed;
      fixedGroup.hidden = !fixed; get('bonoFijo').disabled = !fixed;
      get('bonoBaseAyuda').textContent = baseType.value === 'sueldo'
        ? 'Usa el sueldo del periodo al que corresponde el bono.'
        : 'Si la base son ventas u otra cantidad, su suma con el bono no es tu sueldo.';
    }
    function clearResult() {
      result.removeAttribute('data-ready');
      result.innerHTML = '<span>Datos modificados. Presiona Calcular para actualizar el bono.</span>';
      error.textContent = '';
    }
    function run() {
      syncMode(); error.textContent = '';
      const fields = [get('salario'), mode.value === 'fijo' ? get('bonoFijo') : get('bonoPct')];
      for (const input of fields) {
        input.removeAttribute('aria-invalid');
        if (!input.value.trim() || !input.checkValidity()) {
          input.setAttribute('aria-invalid', 'true');
          error.textContent = input === get('salario') ? 'Escribe una base mayor que cero, con hasta dos decimales.' : 'Escribe un bono igual o mayor que cero, con hasta dos decimales y dentro del límite del campo.';
          result.removeAttribute('data-ready'); result.textContent = 'Revisa el campo indicado para calcular.';
          input.focus(); return;
        }
      }
      try {
        if (!['sueldo', 'otra'].includes(baseType.value)) throw new Error('Selecciona el tipo de base.');
        const value = calculate({base: Number(get('salario').value), mode: mode.value, percent: Number(get('bonoPct').value), amount: Number(get('bonoFijo').value)});
        const salary = baseType.value === 'sueldo';
        const percentage = value.percent.toLocaleString('es-MX', {maximumFractionDigits: 4});
        const method = value.mode === 'fijo'
          ? 'Porcentaje equivalente ≈ ' + money(value.bonus) + ' ÷ ' + money(value.base) + ' × 100 = ' + percentage + '%.'
          : money(value.base) + ' × (' + percentage + ' ÷ 100) = ' + money(value.bonus) + '. Bono redondeado a centavos.';
        showRows([
          {label: salary ? 'Salario base' : 'Base acordada', value: money(value.base)},
          {label: 'Bono bruto', value: money(value.bonus), total: !salary},
          {label: value.mode === 'fijo' ? 'Porcentaje equivalente (aprox.)' : 'Porcentaje aplicado', value: percentage + '%'},
          {label: salary ? 'Total bruto' : 'Base más bono (no es sueldo)', value: money(value.total), total: salary}
        ], method + ' No se descuentan ISR, IMSS ni otras retenciones.');
      } catch (e) {
        error.textContent = e.message;
        result.removeAttribute('data-ready'); result.textContent = 'Revisa los datos para calcular.';
      }
    }
    syncMode();
    box.querySelector('.calc-button').addEventListener('click', run);
    box.addEventListener('keydown', event => {
      if (event.key === 'Enter' && event.target.tagName === 'INPUT' && !event.isComposing) {event.preventDefault(); run();}
    });
    box.addEventListener('input', clearResult);
    box.addEventListener('change', () => {syncMode(); clearResult();});
    document.addEventListener('click', event => {
      if (event.target.closest('[data-form-reset]')) {syncMode(); error.textContent = '';}
    });
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
