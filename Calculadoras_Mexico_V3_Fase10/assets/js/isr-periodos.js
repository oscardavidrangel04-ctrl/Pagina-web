/* Uses the published 2026 tariff tables in tablas.js. No subsidy or net-pay estimate. */
(function (root) {
  'use strict';
  function calculate(income, period, tables) {
    if (typeof income !== 'number' || !Number.isFinite(income) || income <= 0 || income > 1e12) throw new RangeError('Captura una base gravada mayor que cero y hasta $1,000,000,000,000.');
    const cents = Math.round(income * 100);
    if (Math.abs(income * 100 - cents) > Math.max(1e-7, Math.abs(income * 100) * Number.EPSILON * 2)) throw new RangeError('Usa como máximo dos decimales.');
    if (!['semanal', 'quincenal', 'mensual'].includes(period)) throw new RangeError('Elige el periodo de pago.');
    const index = tables[period].findIndex(row => cents >= Math.round(row.limiteInferior * 100) && (row.limiteSuperior === Infinity || cents <= Math.round(row.limiteSuperior * 100)));
    if (index < 0) throw new RangeError('No se encontró una tarifa para esta base.');
    const row = tables[period][index], excessCents = cents - Math.round(row.limiteInferior * 100), excess = excessCents / 100;
    const marginalCents = (BigInt(excessCents) * BigInt(Math.round(row.porcentaje * 100)) + 5000n) / 10000n;
    const tax = Number(BigInt(Math.round(row.cuotaFija * 100)) + marginalCents) / 100;
    return {income: cents / 100, period, index, row, excess, tax, effective: tax / income * 100};
  }
  root.CMISRTarifa = {calculate};
  if (typeof module !== 'undefined' && module.exports) module.exports = {calculate};
  if (typeof document === 'undefined') return;
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('isrConsulta');
    if (!form) return;
    const input = document.getElementById('isrBase'), period = document.getElementById('isrPeriodo');
    const result = document.getElementById('isrConsultaResultado'), error = document.getElementById('isrConsultaError');
    const tables = {semanal: tablaISRSemanal, quincenal: tablaISRQuincenal, mensual: tablaISRMensual};
    const money = n => new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN'}).format(n);
    const tableIds = {semanal:'tabla-isr-semanal', quincenal:'tabla-isr-quincenal', mensual:'tabla-isr-mensual'};
    form.addEventListener('submit', event => {
      event.preventDefault(); error.textContent = ''; input.removeAttribute('aria-invalid');
      document.querySelectorAll('.isr-tariff-scroll tr[aria-current]').forEach(row => row.removeAttribute('aria-current'));
      try {
        if (!input.value.trim() || !input.checkValidity()) throw new Error('Escribe una base mayor que cero, con hasta dos decimales.');
        const value = calculate(Number(input.value), period.value, tables);
        const row = document.getElementById(tableIds[period.value]).nextElementSibling.querySelectorAll('tbody tr')[value.index];
        row.setAttribute('aria-current', 'true');
        result.innerHTML = '<p><strong>ISR de tarifa: ' + money(value.tax) + '</strong> antes de subsidio y ajustes.</p>' +
          '<p>' + money(value.income) + ' − ' + money(value.row.limiteInferior) + ' = ' + money(value.excess) + ' de excedente. ' +
          money(value.row.cuotaFija) + ' + (' + money(value.excess) + ' × ' + value.row.porcentaje + '%) = ' + money(value.tax) + '.</p>' +
          '<p>Tasa marginal: ' + value.row.porcentaje + '%. Tasa efectiva de esta tarifa: ' + value.effective.toFixed(2) + '%.</p>' +
          '<p><a href="#' + tableIds[period.value] + '">Ver el renglón en la tabla ' + period.value + '</a> · ' +
          '<a href="/calculadoras/isr.html?salario=' + encodeURIComponent(input.value) + '&amp;periodo=' + period.value + '">Abrir este caso en la calculadora de ISR</a></p>';
      } catch (e) {input.setAttribute('aria-invalid', 'true'); error.textContent = e.message; result.textContent = 'Revisa los datos para consultar la tarifa.'; input.focus();}
    });
    form.addEventListener('input', () => {
      error.textContent = ''; input.removeAttribute('aria-invalid');
      result.textContent = 'Presiona Consultar tarifa para actualizar el resultado.';
      document.querySelectorAll('.isr-tariff-scroll tr[aria-current]').forEach(row => row.removeAttribute('aria-current'));
    });
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
