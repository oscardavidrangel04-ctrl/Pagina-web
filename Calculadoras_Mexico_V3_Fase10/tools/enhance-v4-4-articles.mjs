import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'articulos');
const pages = {
  'que-es-el-isr': {source:'SAT · Anexo 8 de la RMF 2026',url:'https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html',links:[['Calcular ISR','../calculadoras/isr.html'],['Estimar salario neto','../calculadoras/salario-neto.html'],['Leer recibo de nómina','./leer-recibo-nomina.html']]},
  'aguinaldo-proporcional': {source:'PROFEDET · Prestaciones laborales',url:'https://www.profedet.gob.mx/profedet/transparencia/focalizada/conoce_prestaciones_labores.html',links:[['Calcular aguinaldo','../calculadoras/aguinaldo.html'],['Aguinaldo proporcional','../calculadoras/aguinaldo-proporcional.html'],['Estimar finiquito','../calculadoras/finiquito.html']]},
  'vacaciones-mexico': {source:'Ley Federal del Trabajo vigente',url:'https://www.diputados.gob.mx/LeyesBiblio/ref/lft.htm',links:[['Calcular vacaciones','../calculadoras/vacaciones.html'],['Vacaciones proporcionales','../calculadoras/vacaciones-proporcionales.html'],['Prima vacacional','../calculadoras/prima-vacacional.html']]},
  'finiquito-vs-liquidacion': {source:'PROFEDET · Derechos ante renuncia o despido',url:'https://www.profedet.gob.mx/profedet/prensa/asesoria_despido.html',links:[['Estimar finiquito','../calculadoras/finiquito.html'],['Simular liquidación','../calculadoras/liquidacion.html'],['Calcular prima de antigüedad','../calculadoras/finiquito.html']]},
  'horas-extra-2026': {source:'Ley Federal del Trabajo vigente',url:'https://www.diputados.gob.mx/LeyesBiblio/ref/lft.htm',links:[['Calcular horas extra','../calculadoras/horas-extra.html'],['Calcular salario por hora','../calculadoras/salario-hora.html'],['Convertir salario diario','../calculadoras/salario-diario.html']]},
  'leer-recibo-nomina': {source:'SAT · Información fiscal',url:'https://www.sat.gob.mx/',links:[['Calcular ISR','../calculadoras/isr.html'],['Estimar salario neto','../calculadoras/salario-neto.html'],['Comparar bruto y neto','./salario-bruto-neto.html']]},
  'salario-bruto-neto': {source:'PROFEDET · Derechos laborales',url:'https://www.profedet.gob.mx/',links:[['Estimar salario neto','../calculadoras/salario-neto.html'],['Reconstruir salario bruto','../calculadoras/salario-bruto.html'],['Calcular ISR','../calculadoras/isr.html']]},
  'como-calcular-iva': {source:'SAT · Información fiscal',url:'https://www.sat.gob.mx/',links:[['Calcular IVA','../calculadoras/iva.html'],['Separar IVA incluido','../calculadoras/iva-incluido.html'],['Calcular retención de IVA','../calculadoras/retencion-iva.html']]}
};

for (const [slug,data] of Object.entries(pages)) {
  const file = path.join(dir, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/Actualizado el \d{1,2} de (?:julio|agosto) de 2026/, 'Actualizado el 9 de agosto de 2026');
  html = html.replace(/"dateModified":"2026-[0-9]{2}-[0-9]{2}"/, '"dateModified":"2026-08-09"');
  if (!html.includes('class="article-authority"')) {
    const block = `<aside class="article-authority"><strong>Revisión editorial</strong><span>Actualizado el 9 de agosto de 2026 · Fórmulas y conceptos revisados.</span><a href="${data.url}" rel="noopener noreferrer">Fuente principal: ${data.source} ↗</a></aside><section class="article-next"><h2>Qué hacer después</h2><p>Usa estas herramientas para pasar de la explicación a un escenario con tus propios datos.</p><div class="resource-links">${data.links.map(([label,href])=>`<a href="${href}"><strong>${label}</strong><span>Abrir →</span></a>`).join('')}</div></section>`;
    html = html.replace('</article>', `${block}</article>`);
  }
  fs.writeFileSync(file, html);
}
console.log(`V4.4 article authority and conversion paths added to ${Object.keys(pages).length} articles.`);
