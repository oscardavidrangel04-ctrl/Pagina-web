(function (root) {
  'use strict';
  function cents(value, label) {
    if (!Number.isFinite(value) || value < 0 || value > 1e9 || Number(value.toFixed(2)) !== value) throw new Error(label + ': usa de 0 a 1,000,000,000 de pesos y hasta dos decimales.');
    return BigInt(Math.round(value * 100));
  }
  function unitCost({fixed, variable, units, mode = 'total'}) {
    const f = cents(fixed, 'Costos fijos'), v = cents(variable, 'Costos variables');
    if (!Number.isInteger(units) || units < 1 || units > 1e6) throw new Error('Unidades: usa un entero entre 1 y 1,000,000.');
    if (!['total', 'unidad'].includes(mode)) throw new Error('Elige costos variables totales o por unidad.');
    const quantity = BigInt(units), variables = mode === 'unidad' ? v * quantity : v, total = f + variables;
    if (total > 100000000000000n) throw new Error('El costo total supera un billón de pesos; revisa las cantidades.');
    return {fixed, variableTotal: Number(variables) / 100, total: Number(total) / 100, units,
      fixedUnit: fixed / units, variableUnit: Number(variables) / 100 / units,
      unit: Number(total) / 100 / units, transferCost: Number((total + quantity - 1n) / quantity) / 100};
  }
  function sellingPrice({cost, extra = 0, markup}) {
    const base = cents(cost, 'Costo base'), other = cents(extra, 'Costos adicionales'), total = base + other;
    if (!Number.isFinite(markup) || markup < 0 || markup > 100000 || Number(markup.toFixed(2)) !== markup) throw new Error('Aumento: usa de 0 a 100,000% y hasta dos decimales.');
    const profit = (total * BigInt(Math.round(markup * 100)) + 5000n) / 10000n;
    const sale = total + profit;
    if (sale > 100000000000000n) throw new Error('El precio supera un billón de pesos; revisa las cantidades.');
    return {cost, extra, totalCost: Number(total) / 100, profit: Number(profit) / 100, sale: Number(sale) / 100,
      markup, margin: sale === 0n ? null : Number(profit) / Number(sale) * 100};
  }
  const api = {unitCost, sellingPrice}; root.CMCostos = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;
  function init() {
    const type = document.body.dataset.calc;
    if (!['costo-unidad', 'precio-venta'].includes(type)) return;
    const unit = type === 'costo-unidad', ids = unit ? ['costosFijos','costosVariables','unidades','modoVariables'] : ['costo','costosExtra','aumento'];
    const controls = ids.map(id => document.getElementById(id)), result = document.getElementById('resultado'), next = document.getElementById('costos-siguiente'), link = document.getElementById('costos-enlace');
    function sync() {
      if (unit) document.getElementById('variable-label').textContent = controls[3].value === 'unidad' ? 'Costo variable de una unidad (MXN)' : 'Costos variables de todo el lote (MXN)';
    }
    function clear() {result.removeAttribute('data-ready');result.innerHTML='<span>Datos actualizados. Pulsa Calcular para ver el desglose.</span>';next.hidden=true;}
    function n(id) {const value=document.getElementById(id).value;if (!value.trim()) throw new Error('Completa todos los campos; escribe 0 cuando no haya un costo.');return Number(value);}
    function run() {
      sync();next.hidden=true;
      try {
        if (unit) {
          const r=unitCost({fixed:n('costosFijos'),variable:n('costosVariables'),units:n('unidades'),mode:controls[3].value});
          const fine=v=>v.toLocaleString('es-MX',{maximumFractionDigits:6});
          showRows([{label:'Costos fijos del lote',value:money(r.fixed)},{label:'Costos variables del lote',value:money(r.variableTotal)},
            {label:'Costo total del lote',value:money(r.total)},{label:'Unidades',value: String(r.units)},
            {label:'Costo fijo por unidad (MXN)',value:fine(r.fixedUnit)},{label:'Costo variable por unidad (MXN)',value:fine(r.variableUnit)},
            {label:'Costo por unidad',value:money(r.unit),total:true}], 'Costo unitario antes de redondear: '+fine(r.unit)+' MXN. Los costos deben corresponder al mismo lote o periodo.');
          // The next tool accepts cents. Round upward explicitly to avoid losing a fraction of the unit cost.
          link.href='/calculadoras/precio-venta.html?costo='+r.transferCost.toFixed(2)+'&costosExtra=0&aumento=30#calculadora';
          next.hidden=r.transferCost>1e9;
        } else {
          const r=sellingPrice({cost:n('costo'),extra:n('costosExtra'),markup:n('aumento')});
          showRows([{label:'Costo base por unidad',value:money(r.cost)},{label:'Costos adicionales por unidad',value:money(r.extra)},
            {label:'Costo total por unidad',value:money(r.totalCost)},{label:'Aumento solicitado sobre costo',value:r.markup+'%'},
            {label:'Utilidad agregada',value:money(r.profit)},{label:'Margen efectivo sobre venta',value:r.margin===null?'No definido: precio cero':r.margin.toFixed(4)+'%'},
            {label:'Precio de venta',value:money(r.sale),total:true}], 'Utilidad redondeada al centavo y sumada al costo. El margen se obtiene del precio mostrado. No añade IVA ni deduce costos no capturados.');
          link.href='/calculadoras/margen-ganancia.html?margenModo=actual&costo='+r.totalCost.toFixed(2)+'&venta='+r.sale.toFixed(2)+'&margenObjetivo=30#calculadora';
          next.hidden=r.sale<=0||r.sale>1e9||r.totalCost>1e9;
        }
      } catch(error) {showRows([{label:'Revisa los datos',value:error.message}]);}
    }
    controls.forEach(c=>{c.addEventListener('input',clear);c.addEventListener('change',()=>{sync();clear();});c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});});
    document.querySelector('#calculadora .calc-button').addEventListener('click',run);
    document.querySelector('[data-form-reset]').addEventListener('click',()=>{next.hidden=true;setTimeout(sync,0);});
    sync();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);else init();
})(typeof globalThis==='object'?globalThis:this);
