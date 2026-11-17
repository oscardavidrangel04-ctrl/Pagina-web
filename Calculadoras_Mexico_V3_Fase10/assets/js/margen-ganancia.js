(function (root) {
  'use strict';
  function cents(value, name) {
    if (!Number.isFinite(value) || value < 0 || value > 1e9 || Number(value.toFixed(2)) !== value) throw new Error(name + ': usa de 0 a 1,000,000,000 de pesos, con hasta dos decimales.');
    return BigInt(Math.round(value * 100));
  }
  function calculate({cost, sale, mode = 'actual', target = 30}) {
    const costCents = cents(cost, 'Costo');
    if (!['actual', 'objetivo'].includes(mode)) throw new Error('Elige calcular margen actual o precio para un margen.');
    let saleCents;
    if (mode === 'objetivo') {
      if (costCents === 0n) throw new Error('Para obtener un precio desde un margen, el costo debe ser mayor que cero.');
      if (!Number.isFinite(target) || target < 0 || target >= 100 || Number(target.toFixed(2)) !== target) throw new Error('El margen objetivo debe ir de 0 a 99.99%, con hasta dos decimales.');
      const denominator = 10000n - BigInt(Math.round(target * 100));
      // Round upward to the next cent so the displayed price meets the target.
      saleCents = (costCents * 10000n + denominator - 1n) / denominator;
      if (saleCents > 100000000000000n) throw new Error('El precio supera el límite de un billón de pesos.');
    } else {
      saleCents = cents(sale, 'Precio de venta');
      if (saleCents === 0n) throw new Error('El precio de venta debe ser mayor que cero.');
    }
    const profit = Number(saleCents - costCents) / 100;
    const price = Number(saleCents) / 100;
    return {mode, cost, sale: price, target: mode === 'objetivo' ? target : null, profit, margin: profit / price * 100, markup: cost === 0 ? null : profit / cost * 100};
  }
  if (typeof module === 'object' && module.exports) module.exports = {calculate};
  root.CMMargen = {calculate};
  if (typeof document === 'undefined') return;
  function init() {
    if (document.body.dataset.calc !== 'margen-ganancia') return;
    const mode = document.getElementById('margenModo'), target = document.getElementById('margenObjetivo'), sale = document.getElementById('venta'), cost = document.getElementById('costo'), result = document.getElementById('resultado');
    function sync() {
      const goal = mode.value === 'objetivo';
      sale.disabled = goal; sale.closest('.form-group').hidden = goal;
      target.disabled = !goal; target.closest('.form-group').hidden = !goal;
    }
    function clear() {result.removeAttribute('data-ready'); result.innerHTML = '<span>Datos actualizados. Pulsa Calcular para ver el resultado.</span>';}
    function number(control) {
      if (!control.value.trim()) throw new Error('Completa los importes del modo seleccionado.');
      return Number(control.value);
    }
    function run() {
      sync();
      try {
        const r = calculate({mode: mode.value, cost: number(cost), sale: mode.value === 'actual' ? number(sale) : undefined, target: mode.value === 'objetivo' ? number(target) : undefined});
        const rows = [
          {label: 'Costo capturado', value: money(r.cost)},
          {label: r.mode === 'objetivo' ? 'Precio mínimo para ese margen' : 'Precio de venta', value: money(r.sale), total: r.mode === 'objetivo'},
          {label: 'Utilidad', value: money(r.profit)},
          {label: 'Aumento sobre costo', value: r.markup === null ? 'No definido: costo cero' : r.markup.toFixed(2) + '%'},
          {label: 'Margen sobre venta', value: r.margin.toFixed(2) + '%', total: r.mode === 'actual'}
        ];
        if (r.mode === 'objetivo') rows.push({label: 'Margen objetivo', value: r.target.toFixed(2) + '%'});
        showRows(rows, r.mode === 'objetivo' ? 'Precio = costo ÷ (1 − margen/100), redondeado hacia arriba al centavo. No añade impuestos ni gastos no capturados.' : 'Costo y venta deben tener la misma base de impuestos. La utilidad descuenta solo el costo capturado.');
      } catch (error) {showRows([{label: 'Revisa los datos', value: error.message}]);}
    }
    [mode, target, sale, cost].forEach(control => {
      control.addEventListener('input', clear);
      control.addEventListener('change', () => {sync(); clear();});
      control.addEventListener('keydown', event => {if (event.key === 'Enter') {event.preventDefault(); run();}});
    });
    document.querySelector('#calculadora .calc-button').addEventListener('click', run);
    document.querySelector('[data-form-reset]').addEventListener('click', () => setTimeout(sync, 0));
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof globalThis === 'object' ? globalThis : this);
