(function(root){
  'use strict';
  function calculate({amount,rate,operation}){
    if(!Number.isFinite(amount)||amount<=0||amount>1e9||Number(amount.toFixed(2))!==amount)throw new Error('Cantidad: usa un importe mayor que cero, hasta 1,000,000,000 de pesos y con hasta dos decimales.');
    if(!Number.isFinite(rate)||rate<0||rate>100||Number(rate.toFixed(2))!==rate)throw new Error('Tasa: usa de 0 a 100% y hasta dos decimales; confirma la que corresponde a tu operación.');
    if(!['agregar','quitar','calcular'].includes(operation))throw new Error('Elige agregar, quitar o calcular solo el impuesto.');
    const value=BigInt(Math.round(amount*100)),basis=BigInt(Math.round(rate*100));
    let subtotal,tax,total;
    if(operation==='quitar'){
      total=value;const divisor=10000n+basis;subtotal=(value*10000n+divisor/2n)/divisor;tax=total-subtotal;
    }else{subtotal=value;tax=(value*basis+5000n)/10000n;total=subtotal+tax;}
    return {operation,subtotal:Number(subtotal)/100,tax:Number(tax)/100,total:Number(total)/100,primary:Number(operation==='calcular'?tax:total)/100};
  }
  root.CMIVA={calculate};if(typeof module==='object'&&module.exports)module.exports={calculate};
  if(typeof document==='undefined')return;
  function init(){
    if(document.body.dataset.calc!=='iva')return;
    const amount=document.getElementById('cantidad'),rate=document.getElementById('tasa'),mode=document.getElementById('operacion'),result=document.getElementById('resultado');
    function sync(){document.getElementById('iva-cantidad-label').textContent=mode.value==='quitar'?'Total con IVA incluido (MXN)':'Subtotal antes de IVA (MXN)';}
    function clear(){result.removeAttribute('data-ready');result.innerHTML='<span>Datos actualizados. Pulsa Calcular para ver el desglose.</span>';}
    function run(){sync();try{
      if(!amount.value.trim()||!rate.value.trim())throw new Error('Completa el importe y la tasa. Para tasa cero, escribe 0.');
      const r=calculate({amount:Number(amount.value),rate:Number(rate.value),operation:mode.value});
      const rows=[{label:'Subtotal antes de IVA',value:money(r.subtotal)},{label:'IVA ('+Number(rate.value)+'%)',value:money(r.tax),total:r.operation==='calcular'},
        {label:'Total con IVA',value:money(r.total),total:r.operation!=='calcular'}];
      showRows(rows,'Desglose de un importe global a centavos: subtotal + IVA = total. En «solo impuesto», la cantidad capturada es la base sin IVA. No calcula retenciones ni determina el tratamiento fiscal.');
    }catch(error){showRows([{label:'Revisa los datos',value:error.message}]);}}
    [amount,rate,mode].forEach(c=>{c.addEventListener('input',clear);c.addEventListener('change',()=>{sync();clear();});c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});});
    document.querySelector('#calculadora .calc-button').addEventListener('click',run);
    document.querySelector('[data-form-reset]').addEventListener('click',()=>setTimeout(sync,0));sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof globalThis==='object'?globalThis:this);
