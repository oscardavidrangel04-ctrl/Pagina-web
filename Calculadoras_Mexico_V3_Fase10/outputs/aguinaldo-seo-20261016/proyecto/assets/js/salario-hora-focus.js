(function () {
  'use strict';

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
      var enteredAmount = Number(amount.value);
      var weeklyHours = Number(hours.value);
      if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
        showError('Captura un importe mayor a cero.');
        return;
      }
      if (!Number.isFinite(weeklyHours) || weeklyHours <= 0 || weeklyHours > 168) {
        showError('Captura entre 1 y 168 horas semanales.');
        return;
      }

      var annual;
      switch (period.value) {
        case 'hora': annual = enteredAmount * weeklyHours * 52; break;
        case 'semanal': annual = enteredAmount * 52; break;
        case 'quincenal': annual = enteredAmount * 24; break;
        case 'anual': annual = enteredAmount; break;
        default: annual = enteredAmount * 12;
      }

      var hourly = annual / (weeklyHours * 52);
      var weekly = annual / 52;
      var biweekly = annual / 24;
      var monthly = annual / 12;
      result.classList.add('has-result');
      result.innerHTML =
        '<div class="salary-hour-result-head"><span>Tu equivalencia estimada</span><strong>' + money(hourly) + '<small> por hora</small></strong></div>' +
        '<div class="salary-hour-result-grid">' +
          '<div><span>Por semana</span><strong>' + money(weekly) + '</strong></div>' +
          '<div><span>Por quincena</span><strong>' + money(biweekly) + '</strong></div>' +
          '<div><span>Por mes</span><strong>' + money(monthly) + '</strong></div>' +
          '<div><span>Por año</span><strong>' + money(annual) + '</strong></div>' +
        '</div>' +
        '<p class="salary-hour-result-note">Base: ' + weeklyHours.toLocaleString('es-MX') + ' horas por semana × 52 semanas. No incluye ISR, IMSS, prestaciones ni horas extra.</p>';
      result.focus({ preventScroll: true });
    }

    period.addEventListener('change', updateLabel);
    hours.addEventListener('input', updatePresets);
    calculate.addEventListener('click', calculateSalary);
    [amount, hours].forEach(function (input) {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') calculateSalary();
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
          updateLabel();
          updatePresets();
          result.classList.remove('has-result');
          result.innerHTML = '<span>Completa los datos y presiona Calcular.</span>';
        }, 0);
      });
    }

    updateLabel();
    updatePresets();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
