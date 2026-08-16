import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'calculadoras');

const pages = {
  isr: {
    cases: ['Comparar el mismo ingreso en periodo mensual, quincenal y semanal usando siempre el importe que corresponde a cada periodo.', 'Revisar por separado bonos, comisiones u otros ingresos variables antes de asumir que todo el recibo tiene el mismo tratamiento.', 'Contrastar un aumento salarial con el cambio en ISR estimado y en la tasa efectiva.', 'Separar ISR de otras deducciones de nómina como seguridad social o descuentos internos.', 'Usar el desglose para identificar cuota fija, excedente y tasa marginal del rango aplicado.'],
    errors: ['Aplicar la tasa marginal a todo el ingreso en lugar de solo al excedente del rango.', 'Capturar un salario mensual y seleccionar una tarifa semanal o quincenal.', 'Confundir tasa marginal con tasa efectiva; son medidas distintas.', 'Tomar el neto de esta herramienta como nómina final aunque no incorpora todas las deducciones y ajustes posibles.'],
    extraFaq: [['¿Qué diferencia hay entre tasa marginal y tasa efectiva?','La tasa marginal es la que corresponde al excedente dentro del rango aplicado. La tasa efectiva compara el ISR estimado contra todo el ingreso capturado.'],['¿Un aumento de sueldo hace que todo mi salario pague una tasa mayor?','No. Al entrar a otro rango cambia la mecánica sobre el excedente; no significa que todo el ingreso se multiplique por la nueva tasa marginal.'],['¿Puedo comparar dos salarios con esta calculadora?','Sí. Guarda un escenario, cambia el ingreso y vuelve a calcular; la página mostrará una comparación entre el resultado guardado y el actual.']],
    resources: [['Guía: ¿qué es el ISR?','../articulos/que-es-el-isr.html'],['Salario bruto vs. neto','../articulos/salario-bruto-neto.html'],['Calculadora de salario neto','./salario-neto.html']]
  },
  'salario-neto': {
    cases: ['Comparar una oferta laboral por sueldo bruto contra lo que recibirías después de deducciones capturadas.', 'Probar un aumento salarial manteniendo constantes las deducciones para entender el efecto aritmético.', 'Separar ISR, IMSS y otras deducciones en lugar de tratarlas como un único porcentaje.', 'Guardar dos escenarios para comparar empleo actual y una propuesta nueva.', 'Usar salario neto e ISR como cálculos relacionados, no como conceptos intercambiables.'],
    errors: ['Restar porcentajes directamente sin convertirlos a importes cuando el formulario solicita cantidades.', 'Confundir salario bruto con salario neto.', 'Asumir que todas las deducciones son iguales para todas las personas.', 'Usar una estimación informativa como sustituto del recibo de nómina.'],
    extraFaq: [['¿Salario neto y salario líquido significan lo mismo?','En uso cotidiano suelen referirse al importe que queda después de las deducciones aplicadas al salario bruto.'],['¿Puedo incluir otras deducciones?','Sí. El formulario permite capturar deducciones adicionales para construir una referencia más cercana a tu escenario.'],['¿Cómo comparo dos ofertas de empleo?','Calcula la primera, guarda el escenario y después cambia los datos de la segunda; la herramienta puede mostrar la diferencia entre ambos resultados.']],
    resources: [['Salario bruto vs. neto','../articulos/salario-bruto-neto.html'],['Guía del recibo de nómina','../articulos/leer-recibo-nomina.html'],['Calculadora de ISR','./isr.html']]
  },
  aguinaldo: {
    cases: ['Trabajar el año completo frente a trabajar solo una fracción del año.', 'Cambiar los días de aguinaldo cuando el contrato otorga más que el mínimo aplicable.', 'Calcular una referencia antes de un finiquito usando días efectivamente trabajados.', 'Separar el monto bruto de cualquier tratamiento fiscal que pueda corresponder.', 'Comparar aguinaldo anual y proporcional con el mismo salario diario.'],
    errors: ['Usar el salario mensual completo como si fuera salario diario.', 'Olvidar prorratear cuando no se trabajó todo el año.', 'Suponer que todas las empresas otorgan exactamente el mismo número de días cuando pueden existir prestaciones superiores.', 'Confundir aguinaldo bruto con el depósito neto después de posibles retenciones.'],
    extraFaq: [['¿Qué pasa si no trabajé todo el año?','El aguinaldo puede calcularse proporcionalmente a los días computables del periodo; la herramienta permite introducir los días trabajados.'],['¿Puedo capturar más días de aguinaldo?','Sí. Si tu prestación contractual es superior, cambia el número de días para simular ese escenario.'],['¿El resultado ya descuenta impuestos?','No. El resultado mostrado es una estimación bruta de la prestación; el tratamiento fiscal puede depender del caso.']],
    resources: [['Guía de aguinaldo proporcional','../articulos/aguinaldo-proporcional.html'],['Calculadora proporcional','./aguinaldo-proporcional.html'],['Calculadora de finiquito','./finiquito.html']]
  },
  vacaciones: {
    cases: ['Comparar los días correspondientes a distintas antigüedades.', 'Separar días de vacaciones del importe de prima vacacional.', 'Revisar una fracción del año con la calculadora de vacaciones proporcionales.', 'Probar una prima superior cuando las condiciones de trabajo la otorguen.', 'Relacionar vacaciones pendientes con un escenario de finiquito.'],
    errors: ['Confundir días de descanso con prima vacacional.', 'Usar una antigüedad distinta a la que realmente corresponde.', 'Suponer que la prima y el pago de vacaciones son el mismo concepto.', 'Ignorar prestaciones superiores a las mínimas cuando el contrato sí las contempla.'],
    extraFaq: [['¿Vacaciones y prima vacacional son lo mismo?','No. Las vacaciones son el periodo de descanso; la prima vacacional es una prestación adicional calculada sobre el salario correspondiente a esos días.'],['¿Qué hago si aún no cumplo un año?','Para una referencia proporcional utiliza la calculadora de vacaciones proporcionales y captura los días trabajados y el derecho anual aplicable.'],['¿Puedo usar una prima mayor a 25%?','Sí. El formulario permite cambiar el porcentaje para representar prestaciones superiores cuando correspondan.']],
    resources: [['Guía de vacaciones en México','../articulos/vacaciones-mexico.html'],['Vacaciones proporcionales','./vacaciones-proporcionales.html'],['Prima vacacional','./prima-vacacional.html']]
  },
  finiquito: {
    cases: ['Renuncia con salarios pendientes y prestaciones proporcionales.', 'Terminación de la relación laboral con vacaciones pendientes.', 'Comparar días trabajados del año para observar el aguinaldo proporcional.', 'Separar finiquito de una posible indemnización o liquidación.', 'Revisar cada concepto individual antes de considerar el total estimado.'],
    errors: ['Usar finiquito y liquidación como si fueran exactamente lo mismo.', 'Contar dos veces vacaciones o salarios ya pagados.', 'Olvidar que los días pendientes dependen de la situación real.', 'Interpretar la simulación como determinación jurídica de lo que debe pagar un empleador.'],
    extraFaq: [['¿Finiquito y liquidación son iguales?','No necesariamente. El finiquito reúne conceptos pendientes al terminar la relación; una liquidación puede involucrar indemnizaciones según la causa y las circunstancias.'],['¿La calculadora incluye indemnización?','No. El cálculo de finiquito está enfocado en salarios y prestaciones pendientes capturadas; revisa por separado una posible liquidación.'],['¿Puedo revisar cada concepto por separado?','Sí. El resultado muestra un desglose para identificar salario pendiente, aguinaldo, vacaciones y prima antes del total.']],
    resources: [['Finiquito vs. liquidación','../articulos/finiquito-vs-liquidacion.html'],['Calculadora de liquidación','./liquidacion.html'],['Aguinaldo proporcional','./aguinaldo-proporcional.html']]
  },
  liquidacion: {
    cases: ['Comparar un escenario con y sin el concepto de veinte días por año cuando corresponda analizarlo.', 'Separar la referencia de tres meses de otros conceptos pendientes.', 'Revisar antigüedad y salario diario antes de calcular.', 'Contrastar liquidación con el finiquito de prestaciones pendientes.', 'Guardar escenarios distintos cuando existen interpretaciones o datos por confirmar.'],
    errors: ['Asumir que toda terminación laboral genera automáticamente los mismos conceptos.', 'Confundir liquidación con finiquito.', 'Usar salario mensual donde el formulario solicita salario diario.', 'Tomar la cifra de una simulación como resolución legal definitiva.'],
    extraFaq: [['¿Toda separación laboral genera liquidación?','No necesariamente. Los conceptos dependen de la causa de terminación y de las circunstancias concretas de la relación laboral.'],['¿Por qué existe una opción de veinte días por año?','Se ofrece como escenario porque ese concepto puede aparecer en determinados supuestos; activarlo no significa que corresponda automáticamente en todos los casos.'],['¿Debo calcular también el finiquito?','Puede ser útil revisarlo por separado para identificar prestaciones y salarios pendientes distintos de los conceptos simulados aquí.']],
    resources: [['Finiquito vs. liquidación','../articulos/finiquito-vs-liquidacion.html'],['Calculadora de finiquito','./finiquito.html'],['Vacaciones proporcionales','./vacaciones-proporcionales.html']]
  },
  iva: {
    cases: ['Agregar IVA a un subtotal.', 'Separar el IVA que ya está incluido en un precio final.', 'Calcular únicamente el importe del impuesto.', 'Comparar tasas cuando una operación tenga un tratamiento diferente.', 'Usar subtotal, impuesto y total como conceptos separados al revisar una factura.'],
    errors: ['Restar 16% directamente de un precio con IVA para recuperar el subtotal; la operación inversa requiere dividir entre 1.16 cuando esa tasa aplica.', 'Asumir que todas las operaciones usan la misma tasa.', 'Confundir IVA causado con retenciones.', 'Redondear demasiado pronto y acumular diferencias en varias operaciones.'],
    extraFaq: [['¿Cómo quito el IVA de un precio que ya lo incluye?','Si la tasa aplicable es 16%, divide el total entre 1.16 para obtener el subtotal; la diferencia es el IVA incluido.'],['¿Todas las operaciones llevan IVA de 16%?','No. El tratamiento puede variar según la operación. Confirma la tasa o supuesto fiscal aplicable antes de usar una cifra.'],['¿Retención de IVA es lo mismo que quitar IVA incluido?','No. Una retención es un concepto fiscal distinto; separar IVA incluido solo descompone matemáticamente subtotal e impuesto dentro de un total.']],
    resources: [['Guía: cómo calcular IVA','../articulos/como-calcular-iva.html'],['IVA incluido','./iva-incluido.html'],['Retención de IVA','./retencion-iva.html']]
  },
  'horas-extra': {
    cases: ['Comparar horas dentro del primer bloque usado por la simulación y horas que lo exceden.', 'Revisar primero el valor de una hora ordinaria según salario y jornada capturados.', 'Separar pago ordinario de pago extraordinario.', 'Probar escenarios con distinta cantidad de horas sin modificar el salario.', 'Contrastar el resultado con las condiciones reales de jornada y distribución semanal.'],
    errors: ['Multiplicar todas las horas por el mismo factor sin revisar límites y distribución.', 'Usar salario mensual directamente como pago por hora.', 'Ignorar la duración de la jornada capturada.', 'Tomar una referencia general como cálculo definitivo de una semana laboral concreta.'],
    extraFaq: [['¿Todas las horas extra se pagan igual?','No necesariamente. La LFT establece reglas y límites que pueden llevar a tratamientos distintos; la herramienta muestra una referencia simplificada de pago doble y triple.'],['¿Cómo obtiene la hora ordinaria?','La simulación parte del salario capturado, obtiene una referencia diaria y la divide entre las horas de jornada indicadas.'],['¿Importa cómo se distribuyeron las horas durante la semana?','Sí puede importar en un caso real. Esta calculadora resume horas capturadas y no reconstruye por sí sola toda la distribución de la jornada.']],
    resources: [['Guía de horas extra 2026','../articulos/horas-extra-2026.html'],['Salario por hora','./salario-hora.html'],['Salario diario','./salario-diario.html']]
  },
  'prima-vacacional': {
    cases: ['Calcular la prima a partir de salario diario y días de vacaciones.', 'Comparar el porcentaje mínimo de referencia con una prestación contractual superior.', 'Separar pago base de vacaciones y prima adicional.', 'Relacionar la prima con vacaciones proporcionales en una salida laboral.', 'Guardar dos escenarios con diferentes días o porcentajes.'],
    errors: ['Aplicar la prima sobre todo el salario mensual en vez del pago correspondiente a los días de vacaciones.', 'Confundir vacaciones con prima vacacional.', 'Olvidar cambiar el porcentaje cuando existe una prestación superior.', 'Duplicar la prima al sumar conceptos de otra calculadora.'],
    extraFaq: [['¿Sobre qué cantidad se calcula la prima vacacional?','La herramienta obtiene primero el pago base de los días de vacaciones y aplica el porcentaje de prima sobre esa base.'],['¿Puedo usar un porcentaje superior?','Sí. Puedes cambiar el porcentaje si tus condiciones laborales contemplan una prima mayor.'],['¿La prima vacacional sustituye el pago de vacaciones?','No. Es un concepto adicional al salario correspondiente al periodo de vacaciones.']],
    resources: [['Guía de vacaciones en México','../articulos/vacaciones-mexico.html'],['Calculadora de vacaciones','./vacaciones.html'],['Vacaciones proporcionales','./vacaciones-proporcionales.html']]
  },
  prestamo: {
    cases: ['Comparar plazos cortos y largos con el mismo monto y tasa.', 'Comparar dos tasas manteniendo monto y plazo.', 'Observar mensualidad frente a intereses totales, no solo el pago mensual.', 'Simular un monto menor para medir cuánto cambia el costo total.', 'Usar escenarios guardados antes de comparar ofertas reales por CAT y comisiones.'],
    errors: ['Elegir solo la mensualidad más baja sin revisar el total pagado.', 'Confundir tasa anual con tasa mensual.', 'Ignorar comisiones, seguros y CAT.', 'Suponer que una tasa permanecerá fija cuando el contrato indique otra condición.'],
    extraFaq: [['¿Una mensualidad menor siempre significa un crédito más barato?','No. Un plazo más largo puede reducir la mensualidad y al mismo tiempo aumentar los intereses totales.'],['¿La calculadora incluye CAT?','No. La simulación usa monto, tasa y plazo. Para comparar ofertas reales revisa CAT, comisiones, seguros y demás condiciones.'],['¿Cómo comparo dos préstamos?','Guarda el primer escenario y después cambia tasa, monto o plazo; también puedes usar el comparador de préstamos del portal.']],
    resources: [['Comparador de préstamos','../simuladores.html#prestamos'],['Calculadora de hipoteca','./hipoteca.html'],['Crédito automotriz','./credito-automotriz.html']]
  }
};

const esc = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

for (const [slug, data] of Object.entries(pages)) {
  const file = path.join(dir, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<h1>([^<]+)<\/h1>/)?.[1] || slug;
  const deepDive = `<div class="deep-dive"><h3>Casos que conviene comparar</h3><ul>${data.cases.map(item=>`<li>${item}</li>`).join('')}</ul><h3>Errores comunes al hacer este cálculo</h3><ul>${data.errors.map(item=>`<li>${item}</li>`).join('')}</ul></div>`;
  html = html.replace(/(<aside class="source-note">)/, `${deepDive}$1`);

  const hub = `<section class="content-box topic-hub"><span class="badge">Centro de recursos</span><h2>Aprende más sobre ${esc(title)}</h2><p>Continúa con una guía o una calculadora relacionada para revisar el tema desde otro ángulo.</p><div class="resource-links">${data.resources.map(([label,href])=>`<a href="${href}"><strong>${esc(label)}</strong><span>Consultar →</span></a>`).join('')}</div></section>`;
  html = html.replace(/(<section class="content-box faq-section">)/, `${hub}$1`);

  const faqSection = html.match(/<section class="content-box faq-section">[\s\S]*?<\/section>/)?.[0];
  if (!faqSection) throw new Error(`FAQ visible no encontrada: ${slug}`);
  let enhancedFaq = faqSection.replace('</section>', `${data.extraFaq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`);
  html = html.replace(faqSection, enhancedFaq);

  const faqMatch = html.match(/<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?)<\/script>/);
  if (!faqMatch) throw new Error(`FAQ JSON-LD no encontrado: ${slug}`);
  const faq = JSON.parse(faqMatch[1]);
  for (const [q,a] of data.extraFaq) faq.mainEntity.push({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}});
  html = html.replace(faqMatch[0], `<script type="application/ld+json">${JSON.stringify(faq)}</script>`);
  fs.writeFileSync(file, html);
}

console.log(`Deep content added to ${Object.keys(pages).length} priority calculators. Sitemap intentionally untouched.`);
