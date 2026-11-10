/* Page-specific arithmetic. Ordinary pay conversion is not SDI, SBC or tax calculation. */
(function (root) {
  'use strict';
  const days = Object.freeze({mensual: 30, quincenal: 15, semanal: 7, diario: 1});
  function calculate(amount, period) {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 1e12) {
      throw new RangeError('Ingresa un sueldo mayor que cero y de hasta 1,000,000,000,000 MXN.');
    }
    if (!Object.hasOwn(days, period)) throw new RangeError('Selecciona un periodo válido.');
    const divisor = days[period], daily = amount / divisor;
    return {divisor, daily, weekly: daily * 7, quincenal: daily * 15,
      monthly30: daily * 30, monthly365: daily * 365 / 12, monthly52: daily * 7 * 52 / 12,
      fourWeeklyPayments: daily * 7 * 4, fiveWeeklyPayments: daily * 7 * 5};
  }
  if (typeof module === 'object' && module.exports) module.exports = {calculate};
  if (typeof document === 'undefined') return;
  root.CMSalaryDaily = Object.freeze({calculate});
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.calc !== 'salario-diario') return;
    const form = document.getElementById('salary-form');
    const salary = document.getElementById('salario');
    const period = document.getElementById('periodo');
    const result = document.getElementById('resultado');
    const invalidate = (message, field) => {
      result.replaceChildren();
      const notice = document.createElement('p');
      notice.textContent = message;
      result.append(notice);
      result.removeAttribute('data-ready');
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      salary.removeAttribute('aria-invalid'); period.removeAttribute('aria-invalid');
      if (!salary.value.trim() || !salary.validity.valid) {
        invalidate('Escribe un sueldo válido en MXN, mayor que cero, con hasta dos decimales.', salary); return;
      }
      let r;
      try { r = calculate(Number(salary.value), period.value); }
      catch (error) { invalidate(error.message, Object.hasOwn(days, period.value) ? salary : period); return; }
      showRows([
        {label: 'Ingreso del periodo', value: money(Number(salary.value))},
        {label: 'Divisor', value: `${r.divisor} ${r.divisor === 1 ? 'día' : 'días'}`},
        {label: 'Equivalente de 7 días', value: money(r.weekly)},
        {label: 'Equivalente de 15 días', value: money(r.quincenal)},
        {label: 'Equivalente de 30 días', value: money(r.monthly30)},
        {label: 'Salario diario', value: money(r.daily), total: true}
      ], `${money(Number(salary.value))} ÷ ${r.divisor} = ${money(r.daily)} por día (redondeado a centavos). Las equivalencias conservan los decimales intermedios. No se calculan descuentos ni prestaciones; bruto o neto depende del importe capturado.`);
      const details = document.createElement('details');
      details.className = 'result-steps salary-monthly-methods';
      const summary = document.createElement('summary');
      summary.textContent = 'Comparar 30 días y promedios mensuales anuales';
      details.append(summary);
      for (const [label, value, formula] of [
        ['Mes de referencia de 30 días', r.monthly30, 'sueldo del periodo ÷ divisor × 30'],
        ['Promedio mensual de 365 días / 12', r.monthly365, 'sueldo del periodo ÷ divisor × 365 ÷ 12'],
        ['Promedio mensual de 52 semanas / 12', r.monthly52, 'sueldo del periodo ÷ divisor × 7 × 52 ÷ 12']
      ]) {
        const row = document.createElement('div'); row.className = 'result-row';
        const name = document.createElement('strong'); name.textContent = label;
        const amount = document.createElement('span'); amount.textContent = money(value);
        row.append(name, amount); details.append(row);
        const operation = document.createElement('p'); operation.textContent = formula; details.append(operation);
      }
      const note = document.createElement('p');
      note.textContent = (period.value === 'mensual' ? 'Si capturaste un sueldo mensual, ese importe sigue siendo tu pago mensual de entrada; los promedios anuales mostrados se derivan de dividirlo entre 30. ' : '') + 'Son modelos distintos: 52 semanas suman 364 días. Los promedios sirven para comparar ingresos; no determinan lo que cobrarás en un mes concreto ni sustituyen las reglas de prestaciones, SDI o SBC.';
      const guide = document.createElement('a'); guide.href = '#metodos-mensuales'; guide.textContent = 'Cuándo usar cada equivalencia';
      details.append(note, guide);
      if (period.value === 'semanal') {
        const heading = document.createElement('h3'); heading.textContent = 'Si recibes cuatro o cinco pagos semanales iguales'; details.append(heading);
        for (const [count, value] of [[4, r.fourWeeklyPayments], [5, r.fiveWeeklyPayments]]) {
          const row = document.createElement('div'); row.className = 'result-row'; row.dataset.weeklyPayments = String(count);
          const label = document.createElement('strong'); label.textContent = `${count} pagos de ${money(Number(salary.value))}`;
          const total = document.createElement('span'); total.textContent = money(value); row.append(label, total); details.append(row);
        }
        const cashNote = document.createElement('p'); cashNote.textContent = 'Cuenta las fechas de pago del mes. Estas sumas suponen depósitos constantes del importe capturado: no son un mes de 30 días ni un promedio anual. Si capturaste bruto, tampoco representan el dinero neto que llegará a tu cuenta.'; details.append(cashNote);
      }
      result.querySelector('.result-actions').before(details);
    });
    // A changed input must not leave an old monetary result looking current.
    form.addEventListener('input', () => {
      if (result.dataset.ready === 'true') {
        result.removeAttribute('data-ready');
        result.textContent = 'Los datos cambiaron. Pulsa Calcular para actualizar el resultado.';
      }
    });
  });
})(globalThis);
