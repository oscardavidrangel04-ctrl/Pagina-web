/* Monthly end-of-period deposits; nominal annual rate convertible n times/year. */
(function(root){
'use strict';
function project(p,rate,years,n,c){
 const monthly=Math.expm1((n/12)*Math.log1p(rate/100/n));
 let balance=p;const rows=[];
 for(let year=1;year<=years;year++){
  const start=balance;
  for(let month=0;month<12;month++)balance=balance*(1+monthly)+c;
  if(!Number.isFinite(balance))throw new Error('El resultado es demasiado grande; reduce tasa, plazo o importes.');
  rows.push({year,start,contributions:c*12,interest:balance-start-c*12,end:balance,paid:p+c*12*year});
 }
 return {rate,rows,balance,paid:p+c*12*years,interest:balance-p-c*12*years};
}
root.CMCompound={project};
if(typeof document==='undefined')return;
document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('ic-form');if(!form)return;
 const cash=x=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(x);
 const names=['Prudente','Base','Favorable'];let results=[],selected=1,settings;
 const get=id=>Number(document.getElementById(id).value);
 function table(){
  document.getElementById('ic-caption').textContent='Evolución del escenario '+names[selected].toLowerCase()+' (MXN)';
  document.getElementById('ic-rows').innerHTML=results[selected].rows.map(r=>'<tr><th scope="row">'+r.year+'</th><td>'+cash(r.start)+'</td><td>'+cash(r.contributions)+'</td><td>'+cash(r.interest)+'</td><td>'+cash(r.end)+'</td></tr>').join('');
  document.querySelectorAll('[data-ic-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.icScenario)===selected)));
 }
 function chart(){
  const width=600,height=270,left=64,top=15,bottom=235,right=580;
  const maximum=Math.max(1,...results.map(r=>r.balance));
  const x=y=>left+(right-left)*y/settings.years,y=v=>bottom-(bottom-top)*v/maximum;
  const points=r=>[[0,settings.p],...r.rows.map(z=>[z.year,z.end])].map(z=>x(z[0])+','+y(z[1])).join(' ');
  let grid='';
  for(let i=0;i<=4;i++){const v=maximum*i/4;grid+='<line x1="'+left+'" x2="'+right+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="currentColor" opacity=".12"/><text x="58" y="'+(y(v)+4)+'" text-anchor="end">'+new Intl.NumberFormat('es-MX',{notation:'compact',maximumFractionDigits:1}).format(v)+'</text>';}
  const colors=['#637fb2','#1870e4','#08a0ba'];
  const paid=[[0,settings.p],...results[1].rows.map(r=>[r.year,r.paid])].map(z=>x(z[0])+','+y(z[1])).join(' ');
  document.getElementById('ic-chart').innerHTML='<svg viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Saldos nominales de tres escenarios; la tabla siguiente ofrece los valores por año">'+grid+results.map((r,i)=>'<polyline points="'+points(r)+'" fill="none" stroke="'+colors[i]+'" stroke-width="'+(i===1?3:2)+'"/>').join('')+'<polyline points="'+paid+'" fill="none" stroke="#8897ac" stroke-width="2" stroke-dasharray="4 5"/><text x="'+left+'" y="258">Inicio</text><text x="'+right+'" y="258" text-anchor="end">'+settings.years+' años</text></svg>';
 }
 function calculate(event){
  event?.preventDefault();if(!form.reportValidity())return;
  const error=document.getElementById('ic-error');error.textContent='';
  try{
   settings={p:get('capital'),rate:get('tasa'),years:get('anios'),n:get('frecuencia'),c:get('aportacion'),variation:get('variacion'),inflation:get('inflacion')};
   if(Object.values(settings).some(v=>!Number.isFinite(v))||!Number.isInteger(settings.years)||settings.years<1||settings.years>100||![1,12,365].includes(settings.n))throw new Error('Revisa los datos y usa de 1 a 100 años completos.');
   results=[Math.max(0,settings.rate-settings.variation),settings.rate,settings.rate+settings.variation].map(r=>project(settings.p,r,settings.years,settings.n,settings.c));
   document.getElementById('ic-results').innerHTML=results.map((r,i)=>'<section class="ic-result-card '+(i===1?'ic-base':'')+'"><h3>'+names[i]+'<span>'+r.rate.toFixed(2)+'% anual</span></h3><strong class="ic-amount">'+cash(r.balance)+'</strong><dl><div><dt>Total aportado</dt><dd>'+cash(r.paid)+'</dd></div><div><dt>Intereses acumulados</dt><dd>'+cash(r.interest)+'</dd></div>'+(settings.inflation>0?'<div><dt>Saldo en pesos de hoy</dt><dd>'+cash(r.balance/Math.pow(1+settings.inflation/100,settings.years))+'</dd></div>':'')+'</dl></section>').join('');
   table();chart();
  }catch(e){error.textContent=e.message;results=[];document.getElementById('ic-chart').replaceChildren();document.getElementById('ic-rows').replaceChildren();document.getElementById('ic-results').textContent='No se pudo calcular este escenario.';}
 }
 form.addEventListener('submit',calculate);
 document.querySelectorAll('[data-ic-scenario]').forEach(b=>b.addEventListener('click',()=>{if(!results.length)return;selected=Number(b.dataset.icScenario);table();}));
 document.getElementById('ic-reset').addEventListener('click',()=>{form.querySelectorAll('input,select').forEach(c=>{c.value=c.dataset.defaultValue??c.defaultValue;if(c.tagName==='SELECT'&&!c.value)c.value='12';c.dispatchEvent(new Event('input',{bubbles:true}));});selected=1;calculate();});
 document.getElementById('ic-print').addEventListener('click',()=>window.print());
 document.getElementById('ic-csv').addEventListener('click',()=>{
  if(!results.length)return;
  const lines=[['Moneda','MXN'],['Capital inicial',settings.p],['Tasa nominal anual base (%)',settings.rate],['Capitalizaciones por año',settings.n],['Aportacion mensual al final',settings.c],['Inflacion anual (%)',settings.inflation],['Variacion puntos porcentuales',settings.variation],[],['Escenario','Tasa nominal anual (%)','Año','Saldo inicial','Aportaciones','Intereses','Saldo final']];
  results.forEach((r,i)=>r.rows.forEach(z=>lines.push([names[i],r.rate,z.year,z.start.toFixed(2),z.contributions.toFixed(2),z.interest.toFixed(2),z.end.toFixed(2)])));
  const csv=lines.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='interes-compuesto-escenarios.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 calculate();
});
})(globalThis);

