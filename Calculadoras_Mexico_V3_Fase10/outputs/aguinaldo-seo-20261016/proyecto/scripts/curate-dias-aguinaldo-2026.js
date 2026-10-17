const fs = require('fs');

const file = 'articulos/dias-de-aguinaldo.html';
let html = fs.readFileSync(file, 'utf8');

html = html.replace('Actualizado el 5 de septiembre de 2026 · Lectura aproximada: 5 minutos', 'Actualizado el 21 de septiembre de 2026 · Lectura aproximada: 4 minutos');
html = html.replace('<nav aria-label="En esta guía" class="toc"><strong>En esta guía</strong><a href="#minimo">Mínimo legal</a><a href="#calculo">Cómo calcular</a><a href="#mas-dias">Más de 15 días</a><a href="#faq">Preguntas frecuentes</a></nav>', '<nav aria-label="En esta guía" class="toc"><strong>En esta guía</strong><a href="#minimo">Mínimo legal</a><a href="#tabla">Tabla de días</a><a href="#calculo">Ejemplo</a><a href="#faq">Dudas frecuentes</a></nav>');
const start = '<p>Si buscas <strong>cuántos días de aguinaldo son por ley</strong>';
const end = '<aside class="source-note">';
const begin = html.indexOf(start);
const finish = html.indexOf(end, begin);
if (begin < 0 || finish < 0) throw new Error('No se encontró el contenido original del artículo');

const article = `<p>El artículo 87 de la Ley Federal del Trabajo establece un <strong>mínimo anual de 15 días de salario</strong> para quien trabajó el año completo. Si no completaste el año, tienes derecho a la parte proporcional. El pago debe realizarse antes del 20 de diciembre.</p>
<h2 id="minimo">¿La antigüedad aumenta los días por ley?</h2>
<p>No automáticamente. El mínimo general sigue siendo de 15 días por cada año trabajado. Un contrato individual o colectivo puede reconocer 20, 30 o 40 días; en ese caso se aplica la condición más favorable. Dos años de antigüedad no significan cobrar dos anualidades juntas: cada año genera su propio pago.</p>
<h2 id="tabla">Tabla de días de aguinaldo por año y antigüedad</h2>
<div style="overflow-x:auto"><table><caption>Referencia para relaciones laborales sujetas al artículo 87 de la LFT</caption><thead><tr><th scope="col">Tiempo trabajado en el año</th><th scope="col">Mínimo general</th><th scope="col">Si el contrato ofrece más</th></tr></thead><tbody><tr><th scope="row">Año completo; primer año de antigüedad</th><td>15 días de salario</td><td>Los días pactados, por ejemplo 20 o 30</td></tr><tr><th scope="row">Año completo; 2 años de antigüedad</th><td>15 días de salario de ese año</td><td>Los días pactados para esa antigüedad</td></tr><tr><th scope="row">Año completo; 3 años o más</th><td>15 días de salario de ese año</td><td>Los días pactados para esa antigüedad</td></tr><tr><th scope="row">Menos de un año de servicios</th><td>Parte proporcional de 15 días</td><td>Parte proporcional de los días superiores pactados</td></tr></tbody></table></div>
<p>Esta tabla muestra <strong>días de salario por anualidad</strong>, no el total acumulado desde que ingresaste. Si buscas una tabla por meses o un caso de varios años, la base de cálculo sigue siendo la prestación anual que corresponda a tu contrato.</p>
<h2 id="calculo">Cómo convertir los días en dinero</h2>
<p>Multiplica tu salario diario ordinario por los días anuales que te correspondan. Por ejemplo, con un salario diario de $400 y 15 días anuales, el monto bruto de un año completo es <strong>$6,000</strong>. Para un periodo incompleto, multiplica además por los días laborados en el año y divide entre los días del año: $400 × 15 × 90 ÷ 365 ≈ <strong>$1,479.45</strong>.</p>
<p>El cálculo es orientativo y el depósito puede diferir del bruto por impuestos o ajustes de nómina. Introduce tus datos en la <a href="/calculadoras/aguinaldo.html">calculadora</a> para estimar tu caso.</p>
<h2 id="faq">Dudas frecuentes</h2>
<h3>¿Me corresponden 30 o 40 días?</h3><p>Sólo si tu contrato, convenio o régimen aplicable reconoce esa cantidad. Una propuesta de reforma no modifica por sí sola el mínimo vigente.</p>
<h3>¿Qué pasa si trabajé sólo unos meses?</h3><p>Conservas el derecho a recibir la parte proporcional al tiempo trabajado, incluso si ya no laboras en la fecha de pago. Puedes revisar el procedimiento en la <a href="/articulos/aguinaldo-proporcional.html">guía proporcional</a>.</p>
<h3>¿Dónde reviso el impuesto?</h3><p>El derecho laboral se determina antes de impuestos. Para entender la parte exenta, la gravada y el neto, consulta <a href="/articulos/aguinaldo-isr-2026.html">aguinaldo e ISR</a>.</p>
`;
html = html.slice(0, begin) + article + html.slice(finish);

const afterSourceStart = '<section class="article-next">';
const afterSourceEnd = '</main>';
const a = html.indexOf(afterSourceStart, begin);
const b = html.indexOf(afterSourceEnd, a);
if (a < 0 || b < 0) throw new Error('No se encontró el bloque de enlaces que se consolidará');
const related = `<section class="content-box"><h2>Para seguir</h2><p><a href="/articulos/aguinaldo-por-antiguedad.html">Aguinaldo por antigüedad</a> · <a href="/articulos/recibo-de-aguinaldo.html">Cómo leer el recibo</a> · <a href="/articulos/aguinaldo-30-dias-aprobado-vigencia.html">Situación de la propuesta de 30 días</a></p></section></article></div></div>`;
html = html.slice(0, a) + related + html.slice(b);

html = html.replace(/"dateModified": "2026-09-20"/g, '"dateModified": "2026-09-21"');
fs.writeFileSync(file, html, 'utf8');

const sitemap = 'sitemap.xml';
let xml = fs.readFileSync(sitemap, 'utf8');
xml = xml.replace(/(<loc>https:\/\/calculadora-isr-mexico\.vercel\.app\/articulos\/dias-de-aguinaldo\.html<\/loc><lastmod>)\d{4}-\d{2}-\d{2}/, (_, prefix) => `${prefix}2026-09-21`);
fs.writeFileSync(sitemap, xml, 'utf8');
console.log('Guía de días de aguinaldo consolidada.');
