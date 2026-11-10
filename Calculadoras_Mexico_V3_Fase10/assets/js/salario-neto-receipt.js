/* Receipt reconciliation in integer cents. Entered amounts, not automatic taxes. */
(function (root) {
  'use strict';
  function cents(value, positive = false) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (positive && value === 0) || value > 1e12) throw new RangeError('Usa importes válidos de hasta 1,000,000,000,000 MXN.');
    const scaled = value * 100, rounded = Math.round(scaled);
    if (Math.abs(scaled - rounded) > Math.max(1e-6, Number.EPSILON * Math.abs(scaled))) throw new RangeError('Usa como máximo dos decimales.');
    return rounded;
  }
  function calculate({gross, tax = 0, social = 0, other = 0, otherPayments = 0, deductionMode = 'desglose', deductionsTotal = 0, period = 'mensual', deposit = null}) {
    if (!['mensual', 'quincenal', 'semanal'].includes(period)) throw new RangeError('Selecciona el periodo del recibo.');
    if (!['desglose', 'total'].includes(deductionMode)) throw new RangeError('Selecciona cómo capturar las deducciones.');
    const g = cents(gross, true), p = cents(otherPayments);
    const t = deductionMode === 'desglose' ? cents(tax) : null;
    const s = deductionMode === 'desglose' ? cents(social) : null;
    const o = deductionMode === 'desglose' ? cents(other) : null;
    const d = deductionMode === 'total' ? cents(deductionsTotal) : t + s + o;
    const n = g + p - d;
    if (n < 0) throw new RangeError('Las deducciones superan las percepciones y otros pagos. Revisa duplicaciones y el periodo.');
    const difference = deposit === null ? null : (cents(deposit) - n) / 100;
    return {gross:g/100, tax:t===null?null:t/100, social:s===null?null:s/100, other:o===null?null:o/100, otherPayments:p/100, deductions:d/100, net:n/100, depositDifference:difference, period};
  }
  if (typeof module === 'object' && module.exports) module.exports = {calculate};
  if (typeof document === 'undefined') return;
  root.CMSalarioNeto = Object.freeze({calculate});
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.calc !== 'salario-neto') return;
    const form = document.getElementById('snForm'), result = document.getElementById('resultado');
    const output = document.getElementById('snReceiptCheck');
    const el = id => document.getElementById(id);
    const ids = ['salario','isrManual','imss','otras'];
    const fields = ids.map(el), deposit = el('snDeposito'), period = el('snPeriodo'), mode = el('snDeductionMode');
    const params = new URLSearchParams(location.search);
    // Old links encoded only the original four receipt amounts.
    if (ids.some(id=>params.has(id)) && !params.has('snDeductionMode')) mode.value = 'desglose';
    if (ids.some(id=>params.has(id)) && !params.has('snOtrosPagos')) el('snOtrosPagos').value = '0';
    const syncMode = () => {
      const total = mode.value === 'total';
      document.querySelectorAll('[data-sn-detail]').forEach(group=>{group.hidden=total;group.querySelector('input').disabled=total;});
      el('snTotalGroup').hidden = !total; el('snDeduccionesTotal').disabled = !total;
    };
    syncMode();
    const invalidate = () => {
      output.hidden=true;output.textContent='';delete result.dataset.ready;
      result.textContent='Datos modificados. Pulsa Calcular para actualizar el neto y la comparación del depósito.';
      form.querySelectorAll('[aria-invalid]').forEach(field=>field.removeAttribute('aria-invalid'));
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach(field=>field.removeAttribute('aria-invalid'));
      const invalid = [...form.querySelectorAll('input:not(:disabled)')].find(field=>!field.validity.valid || (field.required && !field.value.trim()));
      const fail = (message, field) => {
        delete result.dataset.ready;result.textContent=message;output.hidden=true;output.textContent='';
        if(field){field.setAttribute('aria-invalid','true');field.focus();}
      };
      if(invalid){fail('Revisa este importe: usa pesos, hasta dos decimales y valores no negativos. El bruto debe ser mayor que cero.',invalid);return;}
      let r;
      try{r=calculate({gross:Number(el('salario').value),tax:Number(el('isrManual').value),social:Number(el('imss').value),other:Number(el('otras').value),otherPayments:Number(el('snOtrosPagos').value),deductionMode:mode.value,deductionsTotal:Number(el('snDeduccionesTotal').value),period:period.value,deposit:deposit.value===''?null:Number(deposit.value)});}
      catch(error){fail(error.message);return;}
      clearTimeout(saveCalculatorForm.timer); saveCalculatorForm();
      const rows=[{label:'Salario bruto',value:money(r.gross)},{label:'Otros pagos del recibo',value:money(r.otherPayments)}];
      if(mode.value==='desglose')rows.push({label:'ISR capturado',value:money(r.tax)},{label:'IMSS u otras cuotas capturadas',value:money(r.social)},{label:'Otras deducciones capturadas',value:money(r.other)});
      rows.push({label:'Deducciones',value:money(r.deductions)},{label:'Salario neto estimado',value:money(r.net),total:true});
      showRows(rows,`Recibo ${r.period}: ${money(r.gross)} + ${money(r.otherPayments)} − ${money(r.deductions)} = ${money(r.net)}. Importes capturados del mismo periodo; no calculamos impuestos ni cuotas automáticamente. Cambiar el periodo no convierte cantidades.`);
      const insight = result.querySelector('.result-insight p');
      if(insight) insight.textContent = `Con ${money(r.gross)} de percepciones y ${money(r.otherPayments)} de otros pagos, menos ${money(r.deductions)} de descuentos, quedan ${money(r.net)}. Es una conciliación de los importes capturados, no una nómina fiscal calculada automáticamente.`;
      const steps = result.querySelector('.result-steps ol');
      if(steps) steps.replaceChildren(...rows.map(row=>{const li=document.createElement('li'),label=document.createElement('span'),amount=document.createElement('strong');label.textContent=row.label;amount.textContent=row.value;li.append(label,amount);return li;}));
      const simulationNote = result.querySelector('.quick-simulations p');
      if(simulationNote) simulationNote.textContent = 'Estos botones cambian solo el bruto; conservan las deducciones y otros pagos capturados. No estiman cómo variarían tus impuestos con otro sueldo.';
      // The existing shared chart labels visual bars; expose their image role on this page.
      result.querySelectorAll('.chart-track[aria-label]').forEach(track=>track.setAttribute('role','img'));
      output.hidden=false;
      output.textContent = mode.value==='total' ? 'Usamos únicamente el total de deducciones. No se sumó el desglose ni se atribuyó una parte del total a ISR o IMSS.' : 'ISR, cuotas y otras deducciones se muestran por separado. Cada concepto se resta una sola vez.';
      if(r.depositDifference!==null)output.textContent += r.depositDifference===0 ? ' El depósito coincide con el neto calculado.' : ` El depósito es ${money(Math.abs(r.depositDifference))} ${r.depositDifference>0?'mayor':'menor'} que el neto calculado. Revisa conceptos y transferencias de ese recibo.`;
    });
    form.addEventListener('input',invalidate);
    form.addEventListener('change',()=>{syncMode();invalidate();});
    document.addEventListener('click',event=>{
      if(event.target.closest('[data-form-reset]')){clearTimeout(saveCalculatorForm.timer);syncMode();invalidate();deposit.value='';return;}
      const example=event.target.closest('[data-sn-example]');if(!example)return;
      const [p,...amounts]=example.dataset.snExample.split(',');
      if(!['mensual','quincenal','semanal'].includes(p)||amounts.length!==4||amounts.some(v=>!Number.isFinite(Number(v))))return;
      period.value=p;mode.value='desglose';el('snOtrosPagos').value='0';syncMode();
      fields.forEach((field,i)=>{field.value=amounts[i];field.dispatchEvent(new Event('input',{bubbles:true}));});
      deposit.value='';el('snExampleState').textContent='Ejemplo cargado con descuentos hipotéticos. Sustituye los importes por los de tu recibo.';
      period.dispatchEvent(new Event('change',{bubbles:true}));form.requestSubmit();
      el('calculadora').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});fields[0].focus({preventScroll:true});
    });
  });
})(globalThis);
