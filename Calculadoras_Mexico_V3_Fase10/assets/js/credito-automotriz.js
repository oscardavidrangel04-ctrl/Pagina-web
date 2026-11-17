(function(root){
  'use strict';
  function check(value,min,max,label,integer=false){
    if(!Number.isFinite(value)||value<min||value>max||(integer?!Number.isInteger(value):Number(value.toFixed(2))!==value))throw new Error(label+': usa '+min+' a '+max+(integer?' en números enteros.':' y hasta dos decimales.'));
  }
  function project({price,downRate,annualRate,months}){
    check(price,0.01,1e9,'Precio');check(downRate,0,100,'Enganche (%)');check(annualRate,0,100,'Tasa nominal anual (%)');check(months,1,240,'Meses',true);
    const priceCents=Math.round(price*100),downCents=Math.floor((priceCents*Math.round(downRate*100)+5000)/10000),principalCents=priceCents-downCents;
    const rate=annualRate/1200;
    // log1p/expm1 avoids cancellation for small rates.
    const exact=rate===0?principalCents/months:principalCents*rate/-Math.expm1(-months*Math.log1p(rate));
    const regular=principalCents===0?0:Math.max(1,Math.round(exact));
    let balance=principalCents,total=0,totalInterest=0;const schedule=[];
    for(let month=1;month<=months&&balance>0;month++){
      const opening=balance,interest=Math.floor((opening*Math.round(annualRate*100)+60000)/120000);
      const payment=month===months?opening+interest:Math.min(regular,opening+interest);
      const capital=payment-interest;balance-=capital;total+=payment;totalInterest+=interest;
      schedule.push({month,opening:opening/100,payment:payment/100,interest:interest/100,capital:capital/100,balance:balance/100});
    }
    if(balance!==0||total-principalCents!==totalInterest)throw new Error('No se pudo conciliar el calendario de pagos.');
    return {price,down:downCents/100,principal:principalCents/100,months,annualRate,monthly:regular/100,exactMonthly:exact/100,
      total:total/100,interest:totalInterest/100,outlay:(downCents+total)/100,schedule,lastPayment:schedule.length?schedule[schedule.length-1].payment:0};
  }
  root.CMAuto={project};if(typeof module==='object'&&module.exports)module.exports={project};
  if(typeof document==='undefined')return;
  function init(){
    if(document.body.dataset.calc!=='credito-automotriz')return;
    const controls=['precioAuto','enganchePct','tasa','meses'].map(id=>document.getElementById(id)),result=document.getElementById('resultado'),details=document.getElementById('auto-detalle');
    function clear(){result.removeAttribute('data-ready');result.innerHTML='<span>Datos actualizados. Pulsa Calcular para ver la mensualidad y las tablas.</span>';details.hidden=true;}
    function run(){details.hidden=true;try{
      if(controls.some(c=>!c.value.trim()))throw new Error('Completa precio, enganche, tasa y plazo; escribe 0 si no hay enganche o interés.');
      const [price,downRate,annualRate,months]=controls.map(c=>Number(c.value)),input={price,downRate,annualRate,months},r=project(input);
      showRows([{label:'Enganche',value:money(r.down)},{label:'Monto financiado',value:money(r.principal)},
        {label:'Mensualidad regular: capital e interés',value:money(r.monthly),total:true},
        {label:'Último pago ajustado',value:money(r.lastPayment)},{label:'Intereses del calendario',value:money(r.interest)},
        {label:'Suma de pagos del crédito',value:money(r.total)},{label:'Desembolso: enganche + pagos',value:money(r.outlay)}],
        r.principal===0?'Con 100% de enganche no hay capital financiado ni mensualidades.':'Modelo de pagos mensuales a tasa nominal fija. No incluye seguros, comisiones, impuestos sobre intereses ni pagos especiales. No calcula CAT.');
      const table=document.getElementById('auto-amortizacion'),compare=document.getElementById('auto-comparacion');
      table.innerHTML=r.schedule.map(p=>'<tr><th scope="row">'+p.month+'</th><td>'+money(p.opening)+'</td><td>'+money(p.payment)+'</td><td>'+money(p.interest)+'</td><td>'+money(p.capital)+'</td><td>'+money(p.balance)+'</td></tr>').join('');
      const terms=[...new Set([36,48,60,months])].sort((a,b)=>a-b);
      compare.innerHTML=terms.map(term=>{const p=project({...input,months:term});return '<tr><th scope="row">'+term+(term===months?' (seleccionado)':'')+'</th><td>'+money(p.monthly)+'</td><td>'+money(p.interest)+'</td><td>'+money(p.outlay)+'</td></tr>';}).join('');
      document.getElementById('auto-resumen').textContent=r.schedule.length+' pagos efectivos. Intereses: '+money(r.interest)+'. Último saldo: $0.00. El enganche no forma parte de las cuotas del crédito.';
      details.hidden=false;
    }catch(error){showRows([{label:'Revisa los datos',value:error.message}]);}}
    controls.forEach(c=>{c.addEventListener('input',clear);c.addEventListener('change',clear);c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});});
    document.querySelector('#calculadora .calc-button').addEventListener('click',run);
    document.querySelector('[data-form-reset]').addEventListener('click',()=>{details.hidden=true;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof globalThis==='object'?globalThis:this);
