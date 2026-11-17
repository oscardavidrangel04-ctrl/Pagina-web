(function (root) {
  'use strict';
  function project(input) {
    const {initial, contribution, annualRate, months, timing = 'fin'} = input;
    for (const [label, value] of [['Ahorro inicial', initial], ['Aportación mensual', contribution]]) {
      if (!Number.isFinite(value) || value < 0 || value > 1e9 || Number(value.toFixed(2)) !== value) throw new Error(label + ': usa de 0 a 1,000,000,000 de pesos y hasta dos decimales.');
    }
    if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) throw new Error('La tasa nominal anual debe estar entre 0 y 100%.');
    if (!Number.isInteger(months) || months < 0 || months > 600) throw new Error('El plazo debe ser un número entero entre 0 y 600 meses.');
    if (!['fin', 'inicio'].includes(timing)) throw new Error('Elige aportaciones al inicio o al final del mes.');
    const rate = annualRate / 1200;
    let balance = initial, totalInterest = 0;
    const schedule = [];
    for (let month = 1; month <= months; month++) {
      const opening = balance;
      const interest = (opening + (timing === 'inicio' ? contribution : 0)) * rate;
      balance = opening + contribution + interest;
      if (!Number.isFinite(balance) || balance > 1e12) throw new Error('La proyección supera el límite de un billón de pesos; reduce tasa, plazo o importes.');
      totalInterest += interest;
      schedule.push({month, opening, contribution, interest, balance});
    }
    return {initial, contribution, annualRate, months, timing, rate, schedule, invested: initial + contribution * months, interest: totalInterest, total: balance};
  }
  if (typeof module === 'object' && module.exports) module.exports = {project};
  root.CMAhorroMensual = {project};
  if (typeof document === 'undefined') return;
  function init() {
    if (document.body.dataset.calc !== 'ahorro-mensual') return;
    const result = document.getElementById('resultado'), plan = document.getElementById('ahorro-plan');
    const controls = ['inicial', 'aportacion', 'tasa', 'meses', 'momento'].map(id => document.getElementById(id));
    function clear() {
      result.removeAttribute('data-ready');
      result.innerHTML = '<span>Datos actualizados. Pulsa Calcular para ver la proyección.</span>';
      plan.hidden = true; plan.innerHTML = '';
    }
    function number(id) {
      const value = document.getElementById(id).value;
      if (!value.trim()) throw new Error('Completa los cuatro campos numéricos; puedes usar cero cuando corresponda.');
      return Number(value);
    }
    function calculate() {
      plan.hidden = true; plan.innerHTML = '';
      try {
        const r = project({initial: number('inicial'), contribution: number('aportacion'), annualRate: number('tasa'), months: number('meses'), timing: document.getElementById('momento').value});
        showRows([
          {label: 'Aportado por ti', value: money(r.invested)},
          {label: 'Rendimiento estimado', value: money(r.interest)},
          {label: 'Ahorro acumulado', value: money(r.total), total: true}
        ], 'Tasa nominal anual dividida entre 12; aportaciones al ' + (r.timing === 'inicio' ? 'inicio' : 'final') + ' de cada mes. Sin impuestos, comisiones, inflación ni retiros.');
        if (r.months > 0) {
          plan.innerHTML = '<h2>Evolución mensual del ahorro</h2><p>Saldo inicial: ' + money(r.initial) + '. Las cifras visibles se redondean a centavos; el cálculo conserva decimales entre meses.</p><details><summary>Ver los ' + r.months + ' meses de la proyección</summary><div class="table-wrap" role="region" aria-label="Evolución mensual del ahorro" tabindex="0"><table><caption>Aportación al ' + (r.timing === 'inicio' ? 'inicio' : 'final') + ' del mes, tasa constante</caption><thead><tr><th scope="col">Mes</th><th scope="col">Saldo inicial</th><th scope="col">Aportación</th><th scope="col">Rendimiento</th><th scope="col">Saldo final</th></tr></thead><tbody>' + r.schedule.map(row => '<tr><th scope="row">' + row.month + '</th><td>' + money(row.opening) + '</td><td>' + money(row.contribution) + '</td><td>' + money(row.interest) + '</td><td>' + money(row.balance) + '</td></tr>').join('') + '</tbody></table></div></details>';
          plan.hidden = false;
        }
      } catch (error) {
        showRows([{label: 'Revisa los datos', value: error.message}]);
      }
    }
    document.querySelector('#calculadora .calc-button').addEventListener('click', calculate);
    controls.forEach(control => {
      control.addEventListener('input', clear);
      control.addEventListener('change', clear);
      control.addEventListener('keydown', event => {if (event.key === 'Enter') {event.preventDefault(); calculate();}});
    });
    document.querySelector('[data-form-reset]').addEventListener('click', () => {plan.hidden = true; plan.innerHTML = '';});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof globalThis === 'object' ? globalThis : this);
