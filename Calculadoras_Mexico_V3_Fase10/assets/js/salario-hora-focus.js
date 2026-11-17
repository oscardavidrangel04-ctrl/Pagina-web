(function (root) {
  'use strict';

  function convert(amount, period, hours) {
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9 || Number(amount.toFixed(2)) !== amount) throw new Error('Captura un importe positivo de hasta 1,000,000,000, con dos decimales como máximo.');
    if (!Number.isFinite(hours) || hours < 1 || hours > 168) throw new Error('Captura entre 1 y 168 horas semanales.');
    if (!['hora', 'semanal', 'quincenal', 'mensual', 'anual'].includes(period)) throw new Error('Selecciona un periodo válido.');
    var annual = amount * ({hora: hours * 52, semanal: 52, quincenal: 24, mensual: 12, anual: 1}[period]);
    return {annual: annual, monthly: annual / 12, weekly: annual / 52, fortnight: annual / 24, hourly: annual / (hours * 52), hours: hours};
  }
  function compare(first, second) {
    return {hourlyDifference: second.hourly - first.hourly, hourlyChange: (second.hourly / first.hourly - 1) * 100, monthlyDifference: second.monthly - first.monthly};
  }
  if (typeof module === 'object' && module.exports) module.exports = {convert: convert, compare: compare};
  root.CMSalarioHora = {convert: convert, compare: compare};
  if (typeof document === 'undefined') return;

  function money(value) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function init() {
    if (!document.body || document.body.dataset.calc !== 'salario-hora-v2') return;

    var period = document.getElementById('periodoSalarioHora');
    var amount = document.getElementById('salario');
    var hours = document.getElementById('horasSemana');
    var result = document.getElementById('resultado');
    var calculate = document.querySelector('#calculadora .calc-button');
    var reset = document.querySelector('#calculadora [data-form-reset]');
    var amountLabel = document.querySelector('[data-salary-hour-amount-label]');
    var compareMode = document.getElementById('compararOferta');
    var secondAmount = document.getElementById('sueldoOfertaB');
    var secondHours = document.getElementById('horasOfertaB');
    var presets = Array.prototype.slice.call(document.querySelectorAll('[data-hours-week]'));
    if (!period || !amount || !hours || !result || !calculate) return;

    var labels = {
      mensual: 'Importe mensual',
      quincenal: 'Importe quincenal',
      semanal: 'Importe semanal',
      anual: 'Importe anual',
      hora: 'Pago por hora'
    };

    function updateLabel() {
      amountLabel.textContent = labels[period.value] || 'Importe';
    }

    function syncComparison() {
      var enabled = compareMode.value === 'si';
      document.getElementById('camposOfertaB').hidden = !enabled;
      secondAmount.disabled = !enabled;
      secondHours.disabled = !enabled;
    }

    function clearResult() {
      result.classList.remove('has-result');
      result.innerHTML = '<span>Datos actualizados. Pulsa Calcular para ver las equivalencias.</span>';
    }

    function updatePresets() {
      presets.forEach(function (button) {
        button.classList.toggle('is-active', Number(button.dataset.hoursWeek) === Number(hours.value));
      });
    }

    function showError(message) {
      result.classList.remove('has-result');
      result.innerHTML = '<div class="salary-hour-error" role="alert"><strong>Revisa los datos</strong><span>' + message + '</span></div>';
      result.focus({ preventScroll: true });
    }

    function calculateSalary() {
      syncComparison();
      updateLabel();
      updatePresets();
      var a, b;
      try {
        a = convert(Number(amount.value), period.value, Number(hours.value));
        if (!['si', 'no'].includes(compareMode.value)) throw new Error('Elige si quieres comparar otra oferta.');
        if (compareMode.value === 'si') b = convert(Number(secondAmount.value), 'mensual', Number(secondHours.value));
      } catch (error) {showError(error.message); return;}
      result.classList.add('has-result');
      result.innerHTML =
        '<div class="salary-hour-result-head"><span>Tu equivalencia estimada</span><strong>' + money(a.hourly) + '<small> por hora</small></strong></div>' +
        '<div class="salary-hour-result-grid">' +
          '<div><span>Por semana</span><strong>' + money(a.weekly) + '</strong></div>' +
          '<div><span>Por quincena</span><strong>' + money(a.fortnight) + '</strong></div>' +
          '<div><span>Por mes</span><strong>' + money(a.monthly) + '</strong></div>' +
          '<div><span>Por año</span><strong>' + money(a.annual) + '</strong></div>' +
        '</div>' +
        '<p class="salary-hour-result-note">Base: ' + a.hours.toLocaleString('es-MX') + ' horas por semana × 52 semanas. No incluye ISR, IMSS, prestaciones ni horas extra.</p>';
      if (b) {
        var difference = compare(a, b);
        result.innerHTML += '<div class="table-wrap" role="region" aria-label="Comparación de ofertas" tabindex="0"><table><caption>Misma base salarial y 52 semanas por año</caption><thead><tr><th scope="col">Referencia</th><th scope="col">Oferta A</th><th scope="col">Oferta B</th></tr></thead><tbody><tr><th scope="row">Horas semanales</th><td>' + a.hours + '</td><td>' + b.hours + '</td></tr><tr><th scope="row">Por mes</th><td>' + money(a.monthly) + '</td><td>' + money(b.monthly) + '</td></tr><tr><th scope="row">Por hora</th><td>' + money(a.hourly) + '</td><td>' + money(b.hourly) + '</td></tr></tbody></table></div><p>Diferencia B menos A por hora: <strong>' + money(difference.hourlyDifference) + ' (' + difference.hourlyChange.toFixed(2) + '%)</strong>. Diferencia mensual: ' + money(difference.monthlyDifference) + '. Compara también prestaciones y condiciones.</p>';
      }
      result.focus({ preventScroll: true });
    }

    period.addEventListener('change', function () {updateLabel(); clearResult();});
    compareMode.addEventListener('change', function () {syncComparison(); clearResult();});
    hours.addEventListener('input', updatePresets);
    calculate.addEventListener('click', calculateSalary);
    [amount, hours, secondAmount, secondHours].forEach(function (input) {
      input.addEventListener('input', clearResult);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {event.preventDefault(); calculateSalary();}
      });
    });
    presets.forEach(function (button) {
      button.addEventListener('click', function () {
        hours.value = button.dataset.hoursWeek;
        updatePresets();
        calculateSalary();
      });
    });
    if (reset) {
      reset.addEventListener('click', function () {
        window.setTimeout(function () {
          period.value = 'mensual';
          amount.value = '15000';
          hours.value = '48';
          compareMode.value = 'no';
          secondAmount.value = '18000';
          secondHours.value = '40';
          syncComparison();
          updateLabel();
          updatePresets();
          result.classList.remove('has-result');
          result.innerHTML = '<span>Completa los datos y presiona Calcular.</span>';
        }, 0);
      });
    }

    updateLabel();
    updatePresets();
    syncComparison();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(typeof globalThis === 'object' ? globalThis : this);
