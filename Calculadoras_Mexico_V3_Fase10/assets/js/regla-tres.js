(function (root) {
  'use strict';
  function calculate(a,b,c) {
    if (![a,b,c].every(Number.isFinite)) throw new Error('Completa A, B y C con números finitos.');
    if (a===0) throw new Error('A no puede ser cero porque es el divisor.');
    const product=b*c, result=product/a, factor=c/a;
    if (![product,result,factor].every(Number.isFinite) || (b!==0 && c!==0 && (product===0 || result===0))) throw new Error('Las cantidades exceden la precisión de esta herramienta. Usa valores de menor escala.');
    return {a,b,c,product,result,factor};
  }
  root.CMReglaTres={calculate};if(typeof module==='object'&&module.exports)module.exports={calculate};
  if(typeof document==='undefined')return;
  function init(){
    if(document.body.dataset.calc!=='regla-tres')return;
    const controls=['a','b','c'].map(id=>document.getElementById(id)),result=document.getElementById('resultado');
    const format=n=>Math.abs(n)!==0&&(Math.abs(n)<1e-6||Math.abs(n)>=1e15)?n.toExponential(8):n.toLocaleString('es-MX',{maximumFractionDigits:6});
    function clear(){result.removeAttribute('data-ready');result.innerHTML='<span>Datos actualizados. Pulsa Calcular para ver los pasos.</span>';}
    function run(){try{
      if(controls.some(c=>!c.value.trim()))throw new Error('Completa A, B y C; cero es válido en B o C.');
      const r=calculate(...controls.map(c=>Number(c.value)));
      showRows([{label:'Correspondencia conocida: A → B',value:format(r.a)+' → '+format(r.b)},
        {label:'Nueva correspondencia: C → X',value:format(r.c)+' → '+format(r.result)},
        {label:'Paso 1: multiplica B por C',value:format(r.b)+' × '+format(r.c)+' = '+format(r.product)},
        {label:'Paso 2: divide entre A',value:format(r.product)+' ÷ '+format(r.a)},
        {label:'Factor de cambio: C ÷ A',value:format(r.factor)},
        {label:'Valor desconocido X',value:format(r.result),total:true}], 'Proporción directa: A y C deben usar la misma unidad; X usa la unidad de B. Resultado aproximado a seis decimales o en notación científica.');
    }catch(error){showRows([{label:'Revisa los datos',value:error.message}]);}}
    controls.forEach(c=>{c.addEventListener('input',clear);c.addEventListener('change',clear);c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});});
    document.querySelector('#calculadora .calc-button').addEventListener('click',run);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof globalThis==='object'?globalThis:this);
