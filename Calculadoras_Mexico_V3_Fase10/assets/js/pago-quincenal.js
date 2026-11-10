/* Ordinary gross pay by period. No tax, subsidy, social-security or payroll engine. */
(function (root) {
  'use strict';
  function calculate(amount, period = 'mensual') {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 1e12) {
      throw new RangeError('Ingresa un salario bruto mayor que cero y de hasta 1,000,000,000,000 MXN.');
    }
    if (!['mensual', 'diario'].includes(period)) throw new RangeError('Selecciona Mensual o Diario.');
    const daily = period === 'mensual' ? amount / 30 : amount;
    const monthly = period === 'mensual' ? amount : amount * 30;
    const quincenal = period === 'mensual' ? amount / 2 : amount * 15, catorcenal = daily * 14;
    return {monthly, daily, quincenal, catorcenal, payments24: quincenal * 24, payments26: catorcenal * 26, payments27: catorcenal * 27};
  }
  if (typeof module === 'object' && module.exports) module.exports = {calculate};
  if (typeof document === 'undefined') return;
  root.CMPagoQuincenal = Object.freeze({calculate});
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.calc !== 'pago-quincenal') return;
    const form = document.getElementById('quincenal-form');
    const salary = document.getElementById('salario');
    const period = document.getElementById('periodo');
    const result = document.getElementById('resultado');
    const params = new URLSearchParams(location.search);
    // Old shared links predate this selector and always mean monthly gross pay.
    // common.js restores controls first, then schedules the automatic calculation.
    if (params.has('salario') && !params.has('periodo')) period.value = 'mensual';
    const fail = (message, field) => {
      result.removeAttribute('data-ready'); result.textContent = message;
      field.setAttribute('aria-invalid', 'true'); field.focus();
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      salary.removeAttribute('aria-invalid'); period.removeAttribute('aria-invalid');
      if (!salary.value.trim() || !salary.validity.valid) {
        fail('Escribe un salario bruto mayor que cero y de hasta 1,000,000,000,000 MXN, con hasta dos decimales.', salary); return;
      }
      let r;
      try { r = calculate(Number(salary.value), period.value); }
      catch (error) { fail(error.message, ['mensual', 'diario'].includes(period.value) ? salary : period); return; }
      const operation = period.value === 'mensual'
        ? `${money(Number(salary.value))} mensuales ÷ 2 = ${money(r.quincenal)} por quincena. La referencia diaria usa mensual ÷ 30.`
        : `${money(Number(salary.value))} diarios × 15 = ${money(r.quincenal)} por quincena. La referencia mensual usa diario × 30.`;
      showRows([
        {label: 'Salario mensual', value: money(r.monthly)},
        {label: 'Salario diario', value: money(r.daily)},
        {label: 'Pago quincenal', value: money(r.quincenal), total: true}
      ], `${operation} Todos los importes son brutos de referencia: no se descuentan ISR, IMSS ni otros conceptos. Los decimales intermedios se conservan; se muestran centavos al final.`);
      const details = document.createElement('details'); details.className = 'result-steps quincenal-comparison';
      const summary = document.createElement('summary'); summary.textContent = 'Comparar la misma cuota diaria en 14 y 15 días'; details.append(summary);
      for (const [label, value] of [['Referencia bruta de 14 días', r.catorcenal], ['Referencia bruta de 15 días', r.quincenal]]) {
        const row = document.createElement('div'); row.className = 'result-row';
        const strong = document.createElement('strong'); strong.textContent = label;
        const span = document.createElement('span'); span.textContent = money(value);
        row.append(strong, span); details.append(row);
      }
      const note = document.createElement('p');
      note.textContent = 'Se multiplica la misma cuota diaria, sin cambiar sus decimales. Esto compara días de referencia, no ofertas de sueldo ni depósitos garantizados. Dos pagos por mes y pagos cada 14 días siguen calendarios distintos.';
      const calendar = document.createElement('a'); calendar.href = '#quincena-catorcena'; calendar.textContent = 'Revisar quincena, catorcena y calendario de pagos';
      details.append(note, calendar);
      const annualHeading = document.createElement('h3'); annualHeading.textContent = 'Suma de pagos con el mismo importe por periodo'; details.append(annualHeading);
      for (const [count, payment, total] of [[24, r.quincenal, r.payments24], [26, r.catorcenal, r.payments26], [27, r.catorcenal, r.payments27]]) {
        const row = document.createElement('div'); row.className = 'result-row'; row.dataset.paymentCount = String(count);
        const label = document.createElement('strong'); label.textContent = `${count} pagos de ${money(payment)} (${count === 24 ? '15' : '14'} días de referencia)`;
        const amount = document.createElement('span'); amount.textContent = money(total); row.append(label, amount); details.append(row);
      }
      const annualNote = document.createElement('p'); annualNote.textContent = 'Son sumas hipotéticas de pagos brutos constantes: 24 × 15 representa 360 días de referencia; 26 × 14, 364; y 27 × 14, 378. Tener 27 fechas de cobro dentro de un año no significa trabajar 378 días de ese año: los periodos pueden cruzar sus límites. No son tres sueldos anuales equivalentes; revisa el calendario, los importes pactados y los conceptos del recibo.'; details.append(annualNote);
      const tax = document.createElement('p');
      const taxLink = document.createElement('a'); taxLink.href = '#isr-quincenal-pasos'; taxLink.textContent = 'Cómo revisar ISR y deducciones de esta quincena'; tax.append(taxLink);
      result.querySelector('.result-actions').before(details, tax);
    });
    form.addEventListener('input', () => {
      if (result.dataset.ready === 'true') {
        result.removeAttribute('data-ready');
        result.textContent = 'Los datos cambiaron. Pulsa Calcular para actualizar tu quincena.';
      }
    });
  });
})(globalThis);
