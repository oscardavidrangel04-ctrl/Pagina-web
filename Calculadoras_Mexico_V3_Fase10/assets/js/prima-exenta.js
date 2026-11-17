(function (root) {
  'use strict';
  function split(premium, available) {
    for (const value of [premium, available]) {
      if (!Number.isFinite(value) || value < 0 || value > 1e9 || Number(value.toFixed(2)) !== value) throw new Error('Usa importes de 0 a 1,000,000,000, con hasta dos decimales.');
    }
    const gross = Math.round(premium * 100), limit = Math.round(available * 100);
    return {gross: gross / 100, exempt: Math.min(gross, limit) / 100, taxable: Math.max(gross - limit, 0) / 100};
  }
  if (typeof module === 'object' && module.exports) module.exports = {split};
  root.CMPrimaExenta = {split};
  if (typeof document === 'undefined') return;
  function init() {
    const gross = document.getElementById('primaBruta'), limit = document.getElementById('exencionDisponible'), button = document.getElementById('separarPrima'), result = document.getElementById('resultadoPrimaExenta');
    if (!gross || !limit || !button || !result) return;
    const money = n => new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(n);
    function calculate() {
      try {
        if (!gross.value.trim() || !limit.value.trim()) throw new Error('Completa ambos importes. Cero es válido si no hay exención disponible.');
        const r = split(Number(gross.value), Number(limit.value));
        result.textContent = 'Prima bruta: ' + money(r.gross) + '. Parte exenta según el límite capturado: ' + money(r.exempt) + '. Parte gravada: ' + money(r.taxable) + '. La parte gravada no es el impuesto retenido.';
      } catch (error) {result.textContent = 'Revisa los datos. ' + error.message;}
      result.focus({preventScroll: true});
    }
    button.addEventListener('click', calculate);
    [gross, limit].forEach(input => {
      input.addEventListener('input', () => {result.textContent = 'Datos actualizados. Pulsa Separar importes.';});
      input.addEventListener('keydown', event => {if (event.key === 'Enter') {event.preventDefault(); calculate();}});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof globalThis === 'object' ? globalThis : this);
