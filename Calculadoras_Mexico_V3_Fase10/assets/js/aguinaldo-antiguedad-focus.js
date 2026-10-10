(function () {
  'use strict';

  function money(value) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  function init() {
    if (!document.body || document.body.dataset.article !== 'aguinaldo-antiguedad') return;
    var salary = document.getElementById('antiguedadSueldo');
    var benefitDays = document.getElementById('antiguedadDiasAguinaldo');
    var workedDays = document.getElementById('antiguedadDiasTrabajados');
    var button = document.getElementById('calcularAguinaldoAntiguedad');
    var result = document.getElementById('resultadoAguinaldoAntiguedad');
    if (!salary || !benefitDays || !workedDays || !button || !result) return;

    function showError(message) {
      result.classList.remove('has-result');
      result.innerHTML = '<span role="alert"><strong>Revisa los datos.</strong> ' + message + '</span>';
      result.focus({ preventScroll: true });
    }

    function calculate() {
      var monthly = Number(salary.value);
      var days = Number(benefitDays.value);
      var worked = Number(workedDays.value);
      if (!Number.isFinite(monthly) || monthly <= 0) return showError('Captura un sueldo mensual mayor a cero.');
      if (!Number.isFinite(days) || days <= 0 || days > 365) return showError('Captura entre 1 y 365 días de aguinaldo.');
      if (!Number.isFinite(worked) || worked <= 0 || worked > 365) return showError('Captura entre 1 y 365 días trabajados.');

      var daily = monthly / 30;
      var annual = daily * days;
      var proportional = annual * (worked / 365);
      result.classList.add('has-result');
      result.innerHTML =
        '<div class="aguinaldo-result-main"><div><span>Aguinaldo bruto estimado</span><strong>' + money(proportional) + '</strong></div><small>' + (worked === 365 ? 'Año completo' : worked + ' días trabajados') + '</small></div>' +
        '<div class="aguinaldo-result-details"><div><span>Salario diario</span><strong>' + money(daily) + '</strong></div><div><span>Aguinaldo anual</span><strong>' + money(annual) + '</strong></div><div><span>Proporción trabajada</span><strong>' + (worked / 365 * 100).toLocaleString('es-MX', { maximumFractionDigits: 2 }) + '%</strong></div></div>';
      result.focus({ preventScroll: true });
    }

    button.addEventListener('click', calculate);
    [salary, benefitDays, workedDays].forEach(function (input) {
      input.addEventListener('keydown', function (event) { if (event.key === 'Enter') calculate(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
