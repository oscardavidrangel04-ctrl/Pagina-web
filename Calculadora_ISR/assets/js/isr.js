
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('.calc-button')?.addEventListener('click',()=>{
  const salario=val('salario'),periodo=document.getElementById('periodo').value;
  if(salario<=0)return showRows([{label:'Revisa el salario',value:'Debe ser mayor que cero'}]);
  const tablas={mensual:tablaISRMensual,quincenal:tablaISRQuincenal,semanal:tablaISRSemanal};
  const fila=tablas[periodo].find(r=>salario>=r.limiteInferior&&salario<=r.limiteSuperior);
  if(!fila)return showRows([{label:'Sin rango',value:'Revisa el importe'}]);
  const exc=salario-fila.limiteInferior,isr=fila.cuotaFija+exc*fila.porcentaje/100;
  showRows([{label:'Ingreso bruto',value:money(salario)},{label:'Cuota fija',value:money(fila.cuotaFija)},{label:'Excedente',value:money(exc)},{label:'Tasa marginal',value:fila.porcentaje.toFixed(2)+'%'},{label:'ISR estimado',value:money(isr)},{label:'Neto estimado',value:money(salario-isr),total:true}],'No considera subsidio al empleo ni otras deducciones.')
 })
})
