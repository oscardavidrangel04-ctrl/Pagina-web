import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const calcDir = path.join(root, 'calculadoras');
const changedDate = '2026-08-06';

const priority = new Set(['isr','salario-neto','aguinaldo','vacaciones','finiquito','liquidacion','iva','horas-extra','prima-vacacional','prestamo']);

const data = {
  'salario-diario': ['Divide el ingreso del periodo entre el número de días del periodo elegido: 30 para mensual, 15 para quincenal o 7 para semanal.', 'Con un ingreso mensual de $18,000, la referencia diaria es $600. Si capturas una quincena, usa el importe realmente correspondiente a esa quincena.', 'El salario diario de referencia no siempre equivale al salario base de cotización ni al salario diario integrado utilizado para otras obligaciones.'],
  descuento: ['Multiplica el precio original por el porcentaje de descuento para obtener el ahorro y réstalo del precio inicial.', 'Un artículo de $1,000 con 20% de descuento ahorra $200 y queda en $800 antes de impuestos, cargos u otras promociones.', 'Si existen descuentos consecutivos, no sumes automáticamente sus porcentajes: cada descuento puede aplicarse sobre una base distinta.'],
  'salario-bruto': ['Suma al ingreso neto las deducciones que hayas capturado para obtener una referencia del salario bruto.', 'Si recibes $15,000 netos y registras $2,500 de deducciones, la herramienta mostrará $17,500 como referencia bruta.', 'Es una reconstrucción aritmética: una nómina real puede incluir percepciones exentas, variables, subsidios, prestaciones y ajustes.'],
  'salario-diario-integrado': ['Aplica un factor de integración construido con días del año, aguinaldo y prima vacacional, y lo multiplica por el salario diario capturado.', 'Puedes comparar cómo cambia el SDI estimado al aumentar los días de aguinaldo o de vacaciones de un escenario.', 'El SDI real puede incorporar prestaciones adicionales y reglas o topes del IMSS; usa el resultado como referencia educativa.'],
  'prima-dominical': ['Multiplica el salario diario por el porcentaje de prima y por el número de domingos trabajados que indiques.', 'Con salario diario de $500, una prima de 25% representa $125 por domingo; dos domingos darían $250 de prima estimada.', 'El cálculo presupone que los datos capturados corresponden a jornadas que generan esa prestación; revisa tu caso laboral concreto.'],
  'aguinaldo-proporcional': ['Calcula primero el aguinaldo anual con salario diario por días de aguinaldo y después lo multiplica por la proporción de días trabajados del año.', 'Si trabajaste aproximadamente medio año, el monto proporcional será cercano a la mitad del aguinaldo anual con los mismos datos.', 'Los días efectivamente computables, salario aplicable y conceptos exentos o gravados pueden requerir una revisión particular.'],
  'vacaciones-proporcionales': ['Prorratea los días anuales de vacaciones según los días trabajados y calcula el pago base y la prima vacacional indicada.', 'Si tienes derecho a 12 días anuales y trabajaste medio año, la referencia será cercana a 6 días antes de considerar la prima.', 'La antigüedad y la forma en que termina o continúa la relación laboral pueden afectar los datos que corresponde usar.'],
  ptu: ['Divide la bolsa capturada en dos partes: una se distribuye por proporción de días trabajados y otra por proporción de salarios.', 'Si una persona representa 5% de los días computables y 4% de los salarios del grupo, cada mitad de la bolsa usa su propia proporción.', 'La PTU tiene reglas de elegibilidad, topes y excepciones que esta simulación no determina por sí sola.'],
  'retencion-iva': ['Calcula el IVA causado sobre el subtotal y aplica el porcentaje de retención que tú indiques sobre ese IVA.', 'Con un subtotal de $1,000 y tasa de IVA de 16%, el IVA causado sería $160; la retención depende del porcentaje capturado.', 'La tasa y obligación de retener dependen del tipo de operación y contribuyente. No asumas que una tasa de ejemplo aplica a todos los casos.'],
  'iva-incluido': ['Divide el total entre uno más la tasa de IVA para recuperar el subtotal; la diferencia entre total y subtotal es el IVA incluido.', 'Si un precio final es $1,160 con tasa de 16%, el subtotal matemático es $1,000 y el IVA incluido es $160.', 'Existen operaciones con tasas distintas o tratamiento fiscal específico; confirma la tasa aplicable antes de usar el resultado.'],
  porcentaje: ['Permite calcular X% de Y, qué porcentaje representa un valor respecto de otro y el cambio porcentual entre un valor inicial y uno final.', 'El 20% de 500 es 100. Si un valor pasa de 500 a 600, el cambio respecto al valor inicial es 20%.', 'En cambios porcentuales, la base importa: subir 20% y después bajar 20% no regresa exactamente al valor original.'],
  'aumento-salarial': ['Multiplica el salario actual por el porcentaje de aumento y suma ese incremento al salario inicial.', 'Un sueldo de $10,000 con aumento de 8% incrementa $800 y pasa a $10,800 antes de considerar impuestos o deducciones.', 'El aumento bruto no equivale necesariamente al aumento neto recibido porque las deducciones pueden cambiar.'],
  comision: ['Multiplica las ventas por el porcentaje de comisión y, si indicas un pago base, suma ambos conceptos.', 'Ventas de $50,000 con comisión de 5% generan $2,500 de comisión; después se suma el pago base que captures.', 'Planes de comisión reales pueden usar escalones, metas, devoluciones, topes o reglas internas no representadas aquí.'],
  'interes-simple': ['Usa capital × tasa anual × tiempo expresado en años. El interés no se incorpora al capital para generar intereses nuevos.', 'Con $10,000 al 12% anual durante 6 meses, el interés simple de referencia es $600 y el monto final $10,600.', 'Comisiones, impuestos, inflación y periodicidad contractual pueden hacer que el resultado financiero real sea distinto.'],
  'interes-compuesto': ['Aplica capital × (1 + tasa/frecuencia) elevado al número de periodos de capitalización.', 'Con la misma tasa anual, capitalizar mensualmente puede producir un resultado distinto a capitalizar una sola vez al año.', 'Una tasa constante es una simplificación; rendimientos de inversión o costos de crédito reales pueden variar en el tiempo.'],
  'ahorro-mensual': ['Proyecta por separado el capital inicial y las aportaciones periódicas usando una tasa mensual derivada de la tasa anual capturada.', 'Prueba el mismo objetivo con 12, 24 y 36 meses para observar cuánto influye el tiempo sobre aportaciones y rendimiento.', 'La proyección supone una tasa constante y aportaciones regulares; no garantiza rendimientos futuros.'],
  'regla-tres': ['Calcula el valor desconocido como B × C ÷ A cuando dos razones son proporcionales.', 'Si 4 unidades cuestan $100, 10 unidades al mismo precio unitario cuestan 100 × 10 ÷ 4 = $250.', 'La regla de tres directa solo es válida cuando existe proporcionalidad entre las cantidades comparadas.'],
  edad: ['Compara dos fechas y descompone la diferencia en años, meses y días; también muestra los días transcurridos.', 'Puedes usar como fecha inicial un cumpleaños y como fecha final una fecha de consulta para obtener la edad exacta en ese día.', 'Los meses tienen distinta duración; por eso no conviene estimar una edad exacta dividiendo el total de días entre 30 o 365.'],
  'diferencia-fechas': ['Resta la fecha inicial de la final y convierte la diferencia en días; además separa semanas completas y días restantes.', 'Una diferencia total de 17 días equivale a 2 semanas completas y 3 días adicionales.', 'El cálculo usa días calendario. Para días hábiles, festivos o plazos legales se necesita una regla específica adicional.'],
  propina: ['Multiplica la cuenta por el porcentaje de propina, suma ambos importes y divide el total entre el número de personas.', 'Una cuenta de $800 con 10% de propina suma $80; entre cuatro personas son $220 por persona.', 'Si algunas personas consumieron importes diferentes, dividir el total en partes iguales puede no representar el reparto deseado.'],
  'margen-ganancia': ['Calcula utilidad como venta menos costo; el margen divide utilidad entre venta y el aumento sobre costo divide utilidad entre costo.', 'Costo $600 y venta $1,000 producen $400 de utilidad, 40% de margen sobre venta y 66.67% de aumento sobre costo.', 'Margen y aumento sobre costo no son el mismo porcentaje. Distinguirlos evita fijar precios con una meta equivocada.'],
  'precio-venta': ['Multiplica el costo por el porcentaje de aumento y suma la utilidad resultante al costo.', 'Un costo de $400 con aumento de 25% agrega $100 y produce un precio de venta de $500 antes de impuestos u otros gastos.', 'Para fijar precios reales considera costos indirectos, comisiones, impuestos y el margen objetivo, no solo el costo directo.'],
  'punto-equilibrio': ['Resta costo variable unitario al precio para obtener margen de contribución y divide los costos fijos entre ese margen.', 'Con $10,000 de costos fijos y $100 de contribución por unidad necesitas 100 unidades para cubrir esos costos.', 'El modelo supone precio y costo variable constantes; cambios de mezcla, descuentos o capacidad pueden alterar el punto real.'],
  roi: ['Resta la inversión al valor final para obtener ganancia o pérdida y divide esa diferencia entre la inversión inicial.', 'Invertir $10,000 y terminar con $12,000 representa $2,000 de ganancia y un ROI simple de 20%.', 'El ROI simple no incorpora por sí solo el tiempo, inflación, riesgo, impuestos o flujos intermedios.'],
  inflacion: ['Proyecta un precio futuro con capitalización de la tasa de inflación y calcula el poder adquisitivo inverso con el mismo factor.', 'Una tasa constante aplicada durante varios años muestra cómo un mismo monto compra relativamente menos con el paso del tiempo.', 'La inflación futura no es constante ni conocida; esta herramienta es un escenario, no un pronóstico.'],
  'ahorro-meta': ['Resta el ahorro actual de la meta y divide lo que falta entre el número de meses disponibles.', 'Si faltan $12,000 para una meta a 12 meses, la referencia sin rendimientos es ahorrar $1,000 cada mes.', 'No incluye rendimientos, inflación ni aportaciones irregulares; puedes usarlos después para construir escenarios más completos.'],
  'tiempo-ahorro': ['Resta el ahorro actual de la meta y divide el faltante entre la aportación mensual para estimar los meses necesarios.', 'Si faltan $18,000 y puedes ahorrar $1,500 al mes, la referencia sin rendimientos es 12 meses.', 'Cambios en la aportación, gastos inesperados o rendimientos modifican el tiempo real para alcanzar la meta.'],
  'credito-automotriz': ['Resta el enganche al precio del auto y aplica la fórmula de una anualidad con tasa mensual para estimar mensualidad e intereses.', 'Aumentar el enganche reduce el capital financiado; compara varios enganches manteniendo tasa y plazo para ver el efecto.', 'La mensualidad real puede incluir seguros, comisiones, accesorios, impuestos y otros cargos del contrato.'],
  hipoteca: ['Aplica la fórmula de pago periódico al monto financiado usando tasa mensual y número total de mensualidades.', 'Compara el mismo crédito a 15 y 20 años: un plazo mayor suele reducir mensualidad pero puede aumentar intereses acumulados.', 'Seguros, avalúo, comisiones, gastos notariales, CAT y tasas variables no quedan representados solo con capital, tasa y plazo.'],
  'pago-quincenal': ['Divide el salario mensual entre dos para la referencia quincenal y entre 30 para la referencia diaria.', 'Un salario mensual de $24,000 equivale aritméticamente a $12,000 por quincena y $800 diarios como referencia.', 'La nómina real puede variar por días, bonos, faltas, deducciones y periodicidad exacta del empleador.'],
  'salario-hora': ['Convierte el salario mensual a una referencia diaria y después la divide entre las horas de la jornada indicadas.', 'Con $18,000 mensuales, la referencia diaria es $600; en una jornada de 8 horas son $75 por hora.', 'No sustituye la determinación legal de jornada, salario integrado, horas extraordinarias ni prestaciones.'],
  bono: ['Calcula el porcentaje indicado sobre el salario base y suma el bono al salario para mostrar el total bruto de referencia.', 'Un salario de $20,000 con bono de 10% agrega $2,000 y produce $22,000 antes de deducciones.', 'La forma de gravar, integrar o pagar un bono depende de su naturaleza y de la nómina real.'],
  'reparto-cuenta': ['Divide el total de la cuenta entre el número de personas y permite visualizar una parte igual por persona.', 'Una cuenta de $1,200 entre seis personas corresponde a $200 por persona si el reparto es exactamente igual.', 'Si consumos, propinas o cargos son diferentes por persona, conviene hacer un reparto ponderado.'],
  'precio-sin-descuento': ['Divide el precio final entre uno menos el porcentaje de descuento para recuperar el precio original.', 'Si pagaste $800 después de 20% de descuento, $800 ÷ 0.80 recupera un precio original de $1,000.', 'El cálculo presupone un solo descuento directo; promociones encadenadas o cupones pueden usar bases diferentes.'],
  'tasa-efectiva': ['Convierte una tasa nominal a efectiva usando la frecuencia de capitalización: (1 + tasa nominal/frecuencia)^frecuencia − 1.', 'Dos productos con la misma tasa nominal pueden tener tasa efectiva distinta si capitalizan con diferente frecuencia.', 'Para comparar créditos o inversiones revisa también comisiones, impuestos, CAT/GAT y condiciones contractuales cuando correspondan.'],
  'rendimiento-anualizado': ['Convierte un rendimiento observado durante un periodo a una tasa anual equivalente mediante capitalización geométrica.', 'Un rendimiento de corto plazo no debe multiplicarse sin más por el número de periodos; anualizar considera la composición.', 'Anualizar describe una equivalencia matemática y no significa que el mismo rendimiento vaya a repetirse durante un año.'],
  cetes: ['Compara el precio de adquisición con el valor nominal y relaciona esa diferencia con el plazo para estimar rendimiento.', 'Si el precio de compra es menor al valor nominal, la diferencia representa el rendimiento bruto del escenario al vencimiento.', 'Precios, plazos, impuestos y condiciones de mercado cambian; verifica datos vigentes antes de tomar decisiones.'],
  'costo-unidad': ['Divide el costo total entre el número de unidades producidas o compradas.', 'Si producir 250 unidades cuesta $10,000 en total, el costo promedio calculado es $40 por unidad.', 'Un promedio puede ocultar costos fijos, variables, desperdicio, inventario y cambios de escala.'],
  'conversion-longitud': ['Convierte primero la medida a una unidad base y después aplica el factor de la unidad de destino.', 'Un kilómetro equivale a 1,000 metros; al cambiar de unidad la distancia física es la misma y solo cambia su representación.', 'Para trabajos técnicos de alta precisión revisa el número de decimales y el estándar de unidades requerido.'],
  'costo-combustible': ['Divide la distancia entre el rendimiento del vehículo para estimar litros y multiplica esos litros por el precio del combustible.', 'Un recorrido de 300 km con rendimiento de 15 km/L requiere cerca de 20 L; después se multiplica por el precio capturado.', 'Tráfico, velocidad, carga, clima y conducción hacen que el consumo real difiera del rendimiento usado como referencia.']
};

const sources = {
  labor: '<aside class="source-note"><strong>Referencia oficial:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf" rel="noopener noreferrer">Ley Federal del Trabajo, Cámara de Diputados</a>. <span>Consulta la norma vigente y las condiciones de tu caso.</span></aside>',
  imss: '<aside class="source-note"><strong>Referencia oficial:</strong> <a href="https://www.imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf" rel="noopener noreferrer">Ley del Seguro Social, IMSS</a>. <span>El cálculo mostrado es educativo y puede no incluir todas las reglas aplicables.</span></aside>',
  tax: '<aside class="source-note"><strong>Referencia oficial:</strong> <a href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf" rel="noopener noreferrer">Ley del Impuesto al Valor Agregado, Cámara de Diputados</a>. <span>Verifica la tasa y el supuesto fiscal que corresponda a tu operación.</span></aside>',
  credit: '<aside class="source-note"><strong>Referencia de educación financiera:</strong> <a href="https://www.condusef.gob.mx/" rel="noopener noreferrer">CONDUSEF</a>. <span>Compara tasa, CAT, comisiones, seguros y costo total antes de contratar un crédito.</span></aside>',
  cetes: '<aside class="source-note"><strong>Referencia oficial:</strong> <a href="https://www.banxico.org.mx/" rel="noopener noreferrer">Banco de México</a>. <span>Consulta información vigente de valores gubernamentales y tasas de mercado.</span></aside>'
};

const sourceFor = slug => {
  if (['salario-diario','prima-dominical','aguinaldo-proporcional','vacaciones-proporcionales','ptu','pago-quincenal','salario-hora','bono'].includes(slug)) return sources.labor;
  if (slug === 'salario-diario-integrado') return sources.imss;
  if (['retencion-iva','iva-incluido'].includes(slug)) return sources.tax;
  if (['credito-automotriz','hipoteca'].includes(slug)) return sources.credit;
  if (slug === 'cetes') return sources.cetes;
  return '';
};

const titleOf = html => html.match(/<h1>([^<]+)<\/h1>/)?.[1] || 'esta calculadora';
const descOf = html => html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';

for (const [slug, [method, example, caveat]] of Object.entries(data)) {
  const file = path.join(calcDir, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const title = titleOf(html);
  const description = descOf(html);
  const guide = `<section class="content-box seo-guide"><p class="updated-note">Contenido revisado el 6 de agosto de 2026</p><h2>Cómo funciona ${title}</h2><p>${description} La herramienta hace el cálculo directamente en tu navegador y presenta un desglose para que puedas revisar de dónde sale la cifra.</p><h3>Fórmula y procedimiento</h3><p>${method}</p><h3>Ejemplo práctico</h3><p>${example}</p><h3>Cómo interpretar el resultado</h3><p>Usa el resultado como punto de comparación y modifica los datos para probar escenarios. Revisa tanto la cifra principal como las filas del desglose: entender la base, la tasa, el plazo o la proporción empleada es más útil que quedarse únicamente con el total.</p><h3>Qué debes tener en cuenta</h3><p>${caveat}</p>${sourceFor(slug)}</section>`;
  html = html.replace(/<section class="content-box seo-guide">[\s\S]*?<\/section>/, guide);

  const faqs = [
    [`¿Cómo se calcula ${title}?`, method],
    [`¿Para qué sirve ${title}?`, `${description} Puedes cambiar los datos y comparar escenarios sin enviar información a un servidor.`],
    [`¿Puedo usar el resultado como cifra definitiva?`, `No necesariamente. ${caveat}`],
    [`¿Por qué conviene revisar el desglose?`, 'Porque permite identificar la base, tasa, plazo o proporción usada y detectar si los datos capturados corresponden al escenario que quieres analizar.'],
    [`¿Se guardan mis datos en un servidor?`, 'No. El cálculo se ejecuta localmente en tu navegador; las funciones de favoritos e historial permanecen en tu dispositivo.']
  ];
  const faqVisible = `<section class="content-box faq-section"><h2>Preguntas frecuentes sobre ${title}</h2>${faqs.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>`;
  html = html.replace(/<section class="content-box faq-section">[\s\S]*?<\/section>/, faqVisible);

  const faqJson = JSON.stringify({
    '@context':'https://schema.org', '@type':'FAQPage',
    mainEntity: faqs.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))
  });
  const faqScript = `<script type="application/ld+json">${faqJson}</script>`;
  html = html.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/, faqScript);
  html = html.replace(/"dateModified":"2026-08-0[13]"/g, `"dateModified":"${changedDate}"`);
  fs.writeFileSync(file, html);
}

// Keep the ten priority pages untouched, but ensure only actually edited calculator URLs receive a new lastmod.
let sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const slug of Object.keys(data)) {
  const pattern = new RegExp(`(<loc>https://calculadora-isr-mexico\\.vercel\\.app/calculadoras/${slug}\\.html<\\/loc><lastmod>)[^<]+(</lastmod>)`);
  sitemap = sitemap.replace(pattern, `$1${changedDate}$2`);
}
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);

console.log(`Enhanced ${Object.keys(data).length} non-priority calculators; preserved ${priority.size} priority calculators.`);
