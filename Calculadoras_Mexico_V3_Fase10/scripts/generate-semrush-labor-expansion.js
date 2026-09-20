const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://calculadora-isr-mexico.vercel.app';
const TODAY = '2026-09-19';

const pages = [
  {
    slug: 'tabla-isr-2026', cluster: 'ISR', title: 'Tabla ISR 2026: cómo leer límites, cuota y porcentaje',
    description: 'Aprende a leer la tabla ISR 2026 de México: límite inferior, excedente, porcentaje, cuota fija y tarifa mensual, quincenal o semanal.',
    intro: 'La tabla ISR 2026 no aplica un porcentaje único a todo el sueldo. Ubica el ingreso gravable dentro de un rango, calcula el excedente sobre el límite inferior, aplica la tasa marginal y suma la cuota fija.',
    tool: '/calculadoras/isr.html', toolText: 'Calcular ISR 2026',
    sections: [
      ['Qué columnas tiene la tabla ISR 2026', '<p>Las tarifas publicadas para cada periodo contienen límite inferior, límite superior, cuota fija y porcentaje aplicable al excedente. El ingreso del periodo debe compararse con la tarifa del mismo periodo: mensual con mensual, quincenal con quincenal y semanal con semanal.</p><p>La tasa del rango es marginal: se aplica al excedente, no necesariamente a todo el ingreso. Por eso dos personas dentro del mismo rango pueden tener importes distintos.</p>'],
      ['Fórmula para usar la tarifa', '<ol><li>Identifica el ingreso gravable del periodo.</li><li>Resta el límite inferior del rango.</li><li>Multiplica el excedente por la tasa marginal.</li><li>Suma la cuota fija.</li><li>Aplica subsidio o ajustes únicamente cuando correspondan.</li></ol><p>La <a href="/calculadoras/isr.html">calculadora ISR 2026</a> muestra este desglose para que puedas comprobar cada paso.</p>'],
      ['Mensual, quincenal y semanal', '<p>No conviene dividir mecánicamente un ISR mensual para obtener la retención semanal. Cada periodicidad utiliza su tarifa correspondiente. Consulta la explicación de <a href="/articulos/isr-semanal-quincenal-mensual.html">ISR semanal, quincenal y mensual</a> antes de comparar recibos.</p>'],
      ['Errores frecuentes', '<ul><li>Usar salario neto en lugar del ingreso gravable.</li><li>Aplicar la tasa marginal a todo el sueldo.</li><li>Mezclar una tarifa mensual con un pago quincenal.</li><li>Ignorar ingresos exentos, subsidio o ajustes de nómina.</li><li>Usar una tabla de un ejercicio diferente.</li></ul>']
    ],
    faqs: [['¿La tasa del rango se aplica a todo el sueldo?', 'No. Se aplica al excedente sobre el límite inferior y después se suma la cuota fija.'], ['¿Puedo usar la tabla 2026 para otro año?', 'No. Debes consultar la tarifa oficial correspondiente al ejercicio y periodo que vas a calcular.']],
    sources: [['SAT: normatividad y tarifas fiscales', 'https://www.sat.gob.mx/'], ['Ley del Impuesto sobre la Renta', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf']]
  },
  {
    slug: 'cuanto-quitan-isr-sueldo', cluster: 'ISR', title: 'Cuánto quitan de ISR al sueldo en México: cálculo y ejemplo',
    description: 'Descubre cuánto te pueden retener de ISR del sueldo, por qué no existe un porcentaje único y cómo revisar el cálculo de tu recibo de nómina.',
    intro: 'La retención de ISR depende del ingreso gravable, la periodicidad de pago, la tarifa aplicable y los ajustes del recibo. No existe un porcentaje único que sirva para todos los sueldos.',
    tool: '/calculadoras/isr.html', toolText: 'Estimar cuánto ISR me quitan',
    sections: [
      ['De qué depende cuánto te quitan', '<p>Primero se determina la base gravable del periodo. Después se utiliza la tarifa semanal, quincenal o mensual correspondiente. La retención también puede variar por subsidio para el empleo, pagos extraordinarios, ingresos exentos y ajustes acumulados.</p>'],
      ['Ejemplo orientativo', '<p>Si el ingreso gravable cae dentro de un rango, se resta su límite inferior, se aplica la tasa marginal al excedente y se agrega la cuota fija. El resultado no se obtiene multiplicando todo el sueldo por la tasa más visible de la tabla.</p><p>Introduce el ingreso bruto y el periodo en la <a href="/calculadoras/isr.html">calculadora de ISR</a> para ver cuota fija, excedente y tasa utilizados.</p>'],
      ['Por qué cambia entre recibos', '<p>Un bono, comisiones, horas extra o aguinaldo pueden modificar la base. También puede haber diferencias si un recibo abarca más días. Compara percepciones gravadas y exentas antes de concluir que el impuesto está mal.</p>'],
      ['Qué revisar en la nómina', '<ul><li>Periodo y días pagados.</li><li>Total de percepciones y parte gravada.</li><li>ISR retenido y, cuando aplique, subsidio.</li><li>Otros descuentos que no son ISR.</li><li>Neto depositado.</li></ul><p>La guía para <a href="/articulos/leer-recibo-nomina.html">leer un recibo de nómina</a> ayuda a separar estos conceptos.</p>']
    ],
    faqs: [['¿El ISR y el IMSS son el mismo descuento?', 'No. El ISR es un impuesto y las cuotas de seguridad social son conceptos diferentes.'], ['¿Por qué me quitan más ISR cuando recibo un bono?', 'Un ingreso adicional puede aumentar la base gravable del periodo; revisa el desglose y el tratamiento aplicado al concepto.']],
    sources: [['Ley del Impuesto sobre la Renta, artículo 96', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf'], ['SAT', 'https://www.sat.gob.mx/']]
  },
  {
    slug: 'isr-a-cargo-asalariado', cluster: 'ISR', title: 'Por qué me sale ISR a cargo si soy asalariado',
    description: 'Conoce por qué una persona asalariada puede obtener ISR a cargo en la declaración anual y qué datos revisar antes de pagar o aclarar.',
    intro: 'Tener retenciones de nómina no garantiza que el resultado anual sea cero. El cálculo anual reúne ingresos, retenciones, deducciones y ajustes de todo el ejercicio.',
    tool: '/calculadoras/isr.html', toolText: 'Revisar una estimación de ISR',
    sections: [
      ['Causas frecuentes de un saldo a cargo', '<ul><li>Tuviste dos o más patrones durante el año.</li><li>Recibiste ingresos adicionales o pagos extraordinarios.</li><li>Las retenciones fueron menores al impuesto anual.</li><li>Algún CFDI tiene datos incorrectos o duplicados.</li><li>Las deducciones personales no cumplieron requisitos o no fueron reconocidas.</li></ul>'],
      ['Qué documentos comparar', '<p>Reúne los CFDI de nómina, constancias de retención, estados de cuenta y comprobantes de deducciones. Compara ingresos acumulados y retenciones con la información precargada; no corrijas una cifra sin identificar primero su origen.</p>'],
      ['La calculadora no sustituye la declaración', '<p>Una calculadora periódica ayuda a entender una retención, pero el impuesto anual integra todo el ejercicio. Para preparar tu revisión consulta también <a href="/articulos/declaracion-anual-asalariados-2026.html">declaración anual de asalariados</a> y <a href="/articulos/deducciones-personales-2026.html">deducciones personales</a>.</p>'],
      ['Qué hacer si detectas una diferencia', '<p>Verifica los comprobantes directamente en los servicios del SAT y solicita al emisor la corrección que corresponda. Si el caso involucra varios patrones, indemnizaciones u otros ingresos, considera asesoría fiscal antes de presentar una modificación.</p>']
    ],
    faqs: [['¿Un saldo a cargo significa que mi patrón calculó mal?', 'No necesariamente. El resultado anual puede cambiar por varios empleadores, otros ingresos, deducciones o ajustes del ejercicio.'], ['¿Puedo usar la calculadora mensual para presentar la declaración?', 'No. Sirve como orientación para retenciones periódicas, no reemplaza el cálculo anual del SAT.']],
    sources: [['SAT: declaración anual de personas físicas', 'https://www.sat.gob.mx/'], ['Ley del Impuesto sobre la Renta', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf']]
  },
  {
    slug: 'salario-minimo-diario-mensual-2026', cluster: 'Salario', title: 'Salario mínimo 2026 diario, semanal, quincenal y mensual',
    description: 'Convierte el salario mínimo 2026 de México de monto diario a semanal, quincenal y mensual y distingue una referencia de un pago real de nómina.',
    intro: 'Desde el 1 de enero de 2026, el salario mínimo general es de $315.04 diarios y el de la Zona Libre de la Frontera Norte es de $440.87 diarios. Las conversiones dependen de los días considerados.',
    tool: '/calculadoras/pago-quincenal.html', toolText: 'Convertir salario por periodo',
    sections: [
      ['Conversión del salario mínimo general', '<div class="table-wrap"><table><thead><tr><th>Referencia</th><th>Cálculo</th><th>Importe</th></tr></thead><tbody><tr><td>Diario</td><td>Dato oficial</td><td>$315.04</td></tr><tr><td>Semanal</td><td>$315.04 × 7</td><td>$2,205.28</td></tr><tr><td>Quincenal</td><td>$315.04 × 15</td><td>$4,725.60</td></tr><tr><td>30 días</td><td>$315.04 × 30</td><td>$9,451.20</td></tr></tbody></table></div><p>Son conversiones aritméticas de referencia. El recibo real puede incluir días del periodo, prestaciones, incidencias y deducciones.</p>'],
      ['General o frontera norte', '<p>La zona aplicable no se elige por preferencia personal. Depende de que el centro de trabajo se encuentre en uno de los municipios que integran la Zona Libre de la Frontera Norte. Consulta la <a href="/articulos/salario-minimo-frontera-norte-2026.html">guía de salario mínimo fronterizo</a>.</p>'],
      ['Salario mínimo y salario profesional', '<p>Determinadas profesiones, oficios y trabajos especiales tienen montos mínimos profesionales. Por eso el monto general no siempre es la referencia correcta para una ocupación incluida en la resolución de CONASAMI.</p>'],
      ['Qué revisar en el recibo', '<p>Compara días pagados, salario diario, percepciones, deducciones y neto. El salario mínimo es una cantidad mínima por jornada; no debe confundirse con el importe neto después de ISR u otras partidas.</p>']
    ],
    faqs: [['¿Cuál es el salario mínimo diario en México en 2026?', 'El salario mínimo general es de $315.04 diarios; en la Zona Libre de la Frontera Norte es de $440.87 diarios.'], ['¿El salario mínimo mensual siempre se calcula por 30 días?', 'La multiplicación por 30 es una referencia. Para revisar una nómina deben considerarse el periodo, los días pagados y sus demás conceptos.']],
    sources: [['CONASAMI: incremento a los salarios mínimos para 2026', 'https://www.gob.mx/conasami/articulos/incremento-a-los-salarios-minimos-para-2026?idiom=es'], ['Resolución de salarios mínimos 2026', 'https://sidof.segob.gob.mx/notas/docFuente/5775534']]
  },
  {
    slug: 'salario-minimo-frontera-norte-2026', cluster: 'Salario', title: 'Salario mínimo en la frontera norte 2026: monto y zona',
    description: 'Consulta el salario mínimo 2026 de la Zona Libre de la Frontera Norte, su monto diario y cómo saber si corresponde a tu centro de trabajo.',
    intro: 'El salario mínimo general de la Zona Libre de la Frontera Norte es de $440.87 diarios desde el 1 de enero de 2026. Solo corresponde a los municipios incluidos oficialmente en esa zona.',
    tool: '/calculadoras/salario-diario.html', toolText: 'Convertir salario diario',
    sections: [
      ['Monto fronterizo 2026', '<p>CONASAMI fijó $440.87 por jornada diaria para la ZLFN. Como referencia aritmética, 15 días equivalen a $6,613.05 y 30 días a $13,226.10, antes de revisar cualquier otro concepto de nómina.</p>'],
      ['Cómo saber si corresponde', '<p>La ubicación relevante es la del centro de trabajo dentro de los municipios definidos en la resolución. No todo un estado fronterizo queda incluido automáticamente. Verifica el municipio en la clasificación oficial de CONASAMI.</p>'],
      ['Diferencia con el salario general', '<p>En el resto del país el salario mínimo general 2026 es de $315.04 diarios. Además existen salarios mínimos profesionales; si la ocupación está listada, debe revisarse la cantidad específica aplicable.</p>'],
      ['Cómo comparar tu pago', '<p>Localiza salario diario, días pagados y percepciones en el recibo. Si el monto no coincide, comprueba primero zona, ocupación y periodo. Después solicita un desglose al empleador o asesoría laboral.</p>']
    ],
    faqs: [['¿Toda ciudad fronteriza usa el salario de la ZLFN?', 'No. Debe verificarse que el municipio esté incluido en la clasificación oficial.'], ['¿El monto de $440.87 es neto?', 'No. Es el salario mínimo diario; el recibo puede mostrar otras percepciones y deducciones.']],
    sources: [['CONASAMI: salarios mínimos 2026', 'https://www.gob.mx/conasami/articulos/incremento-a-los-salarios-minimos-para-2026?idiom=es'], ['CONASAMI: clasificación de municipios', 'https://www.gob.mx/conasami/documentos/clasificacion-de-los-municipios-por-area-geografica']]
  },
  {
    slug: 'horas-extra-dobles-triples', cluster: 'Horas extra', title: 'Horas extra dobles y triples en México: diferencia y cálculo',
    description: 'Aprende cuándo las horas extra se pagan dobles o triples en México, cómo separarlas por semana y cómo calcular su importe.',
    intro: 'La diferencia entre horas extra dobles y triples depende de los límites semanales previstos en la Ley Federal del Trabajo. El control debe hacerse por semana, no mezclando periodos distintos.',
    tool: '/calculadoras/horas-extra.html', toolText: 'Calcular horas extra',
    sections: [
      ['Cuándo se pagan dobles', '<p>La prolongación de la jornada por circunstancias extraordinarias no debe exceder tres horas diarias ni tres veces por semana. Dentro del límite legal, las horas extraordinarias se pagan con un ciento por ciento adicional al salario de la hora ordinaria: en términos prácticos, al doble.</p>'],
      ['Cuándo se pagan triples', '<p>Cuando el tiempo extraordinario excede de nueve horas en una semana, el excedente se paga con un doscientos por ciento adicional: en términos prácticos, al triple. Separa las primeras nueve de las horas excedentes.</p>'],
      ['Ejemplo de separación', '<p>Si el valor ordinario de la hora es $100 y durante una semana se acreditan 11 horas extra, las primeras nueve se estiman a $200 cada una y las dos excedentes a $300 cada una. El ejemplo explica la mecánica; el salario base y las circunstancias deben comprobarse.</p>'],
      ['Cómo documentarlas', '<ul><li>Registra fecha, horario de entrada y salida.</li><li>Conserva mensajes, controles de asistencia y recibos.</li><li>Comprueba en qué semana ocurrió cada hora.</li><li>Compara el valor de la hora con el salario y jornada pactados.</li></ul>']
    ],
    faqs: [['¿Las primeras nueve horas extra siempre son dobles?', 'La regla se analiza por semana y dentro de los límites legales; las circunstancias concretas y la jornada deben verificarse.'], ['¿Puedo juntar horas de varias semanas?', 'No para decidir cuáles exceden de nueve: el límite se revisa semana por semana.']],
    sources: [['Ley Federal del Trabajo, artículos 66 a 68', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['PROFEDET', 'https://www.gob.mx/profedet']]
  },
  {
    slug: 'cuantas-horas-extra-semana', cluster: 'Horas extra', title: 'Cuántas horas extra se pueden trabajar a la semana en México',
    description: 'Consulta el límite de horas extra por día y por semana en México, qué sucede al exceder nueve horas y cómo registrar tu jornada.',
    intro: 'La LFT establece que el tiempo extraordinario no debe exceder tres horas diarias ni repetirse más de tres veces en una semana. De ahí surge la referencia de nueve horas semanales.',
    tool: '/calculadoras/horas-extra.html', toolText: 'Estimar pago de horas extra',
    sections: [
      ['Límite diario y semanal', '<p>La prolongación extraordinaria puede ser hasta de tres horas en un día y solo tres veces en una semana. Esto no convierte nueve horas en una extensión normal de la jornada: deben existir circunstancias extraordinarias.</p>'],
      ['Qué pasa si se exceden nueve', '<p>El patrón debe pagar el tiempo que exceda de nueve horas semanales con un doscientos por ciento adicional al salario de la hora ordinaria, sin que el pago elimine la infracción a los límites de jornada.</p>'],
      ['Cómo llevar el control', '<p>Organiza las horas por semana calendario o por el corte utilizado en el control laboral, conservando las fechas. No uses únicamente el total mensual porque podrías ocultar semanas con excedentes.</p>'],
      ['Hora extra y día de descanso', '<p>Trabajar en un día de descanso puede involucrar reglas diferentes de las horas extraordinarias. Identifica si se prolongó una jornada ordinaria o se laboró un día que debía ser de descanso antes de calcular.</p>']
    ],
    faqs: [['¿El límite general es nueve horas extra a la semana?', 'La ley permite una prolongación de hasta tres horas diarias, tres veces por semana, bajo circunstancias extraordinarias.'], ['¿Pagar triple vuelve legal cualquier exceso?', 'No. El pago del excedente no elimina los límites legales de jornada.']],
    sources: [['Ley Federal del Trabajo, artículos 66 a 68', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf']]
  },
  {
    slug: 'me-pueden-obligar-horas-extra', cluster: 'Horas extra', title: '¿Me pueden obligar a trabajar horas extra en México?',
    description: 'Conoce hasta dónde puede prolongarse la jornada, cuándo no estás obligado a trabajar tiempo extraordinario y qué evidencia conservar.',
    intro: 'Las personas trabajadoras no están obligadas a prestar servicios por un tiempo mayor al permitido en el capítulo de jornada de la Ley Federal del Trabajo.',
    tool: '/calculadoras/horas-extra.html', toolText: 'Calcular tiempo extraordinario',
    sections: [
      ['Qué establece la ley', '<p>La jornada puede prolongarse por circunstancias extraordinarias dentro de los límites legales. El artículo 68 señala que las personas trabajadoras no están obligadas a prestar servicios por un tiempo mayor al permitido.</p>'],
      ['Emergencia y horas extraordinarias', '<p>No deben confundirse las circunstancias extraordinarias ordinarias con situaciones de siniestro o riesgo inminente, que tienen reglas específicas. La causa y duración importan para analizar cada caso.</p>'],
      ['Qué evidencia conservar', '<ul><li>Registros de entrada y salida.</li><li>Solicitudes escritas o mensajes.</li><li>Calendario por semana.</li><li>Recibos donde aparezca el pago.</li><li>Contrato y políticas de jornada.</li></ul>'],
      ['Dónde pedir orientación', '<p>Si existe presión, falta de pago o un riesgo para tu seguridad, solicita orientación personalizada. PROFEDET ofrece asesoría laboral gratuita; una calculadora solo estima importes y no resuelve el conflicto.</p>']
    ],
    faqs: [['¿Puedo negarme a trabajar más allá del límite permitido?', 'El artículo 68 establece que las personas trabajadoras no están obligadas a prestar servicios por un tiempo mayor al permitido.'], ['¿Debo registrar las horas aunque no aparezcan en nómina?', 'Sí. Llevar fechas y horarios puede ayudarte a explicar y documentar la diferencia.']],
    sources: [['Ley Federal del Trabajo, artículos 65 a 68', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['PROFEDET', 'https://www.gob.mx/profedet']]
  },
  {
    slug: 'cuanto-finiquito-un-ano-renuncia', cluster: 'Finiquito', title: 'Cuánto me toca de finiquito por un año si renuncio',
    description: 'Calcula qué puede incluir tu finiquito al renunciar después de un año: días pendientes, aguinaldo, vacaciones y prima vacacional proporcionales.',
    intro: 'No existe una cantidad universal por cumplir un año. El finiquito depende del salario, fecha de salida, prestaciones pagadas y cantidades pendientes.',
    tool: '/calculadoras/finiquito.html', toolText: 'Calcular mi finiquito',
    sections: [
      ['Qué conceptos revisar', '<ul><li>Salario de días trabajados y no pagados.</li><li>Aguinaldo proporcional del año de salida.</li><li>Vacaciones generadas y no disfrutadas, según el caso.</li><li>Prima vacacional correspondiente.</li><li>Otras prestaciones pendientes del contrato.</li></ul>'],
      ['Un año completo no significa una cifra fija', '<p>Dos personas con la misma antigüedad pueden recibir cantidades distintas por salario, fecha de renuncia, vacaciones disfrutadas y prestaciones superiores. La antigüedad es solo una de las variables.</p>'],
      ['Ejemplo de método', '<p>Convierte el salario mensual a diario según la base usada, identifica días pendientes y calcula cada prestación por separado. Después suma los conceptos y distingue importe bruto, retenciones y neto.</p><p>La <a href="/calculadoras/finiquito.html">calculadora de finiquito</a> presenta un desglose editable.</p>'],
      ['Renuncia no es liquidación', '<p>Al renunciar normalmente se revisa el finiquito de prestaciones pendientes; no debe añadirse automáticamente una indemnización por despido. Consulta <a href="/articulos/finiquito-vs-liquidacion.html">finiquito vs liquidación</a>.</p>']
    ],
    faqs: [['¿Me corresponden tres meses de sueldo si renuncio?', 'No como regla general. Esa referencia pertenece a determinados supuestos de indemnización, no al finiquito ordinario por renuncia.'], ['¿El aguinaldo se pierde al renunciar?', 'No. Debe revisarse la parte proporcional generada hasta la fecha de salida.']],
    sources: [['Ley Federal del Trabajo, artículos 76, 79, 80 y 87', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['Derechos laborales: finiquito', 'https://www.gob.mx/derechoslaborales/articulos/condiciones-de-trabajo']]
  },
  {
    slug: 'me-pueden-descontar-finiquito', cluster: 'Finiquito', title: '¿Me pueden descontar de mi finiquito? Qué revisar',
    description: 'Conoce qué revisar si aparecen descuentos en tu finiquito, cómo pedir un desglose y por qué no conviene firmar sin entender cada concepto.',
    intro: 'Un descuento en el finiquito no debe aceptarse solo porque aparezca en un total. Solicita el concepto, fundamento, importe y comprobante de cada deducción.',
    tool: '/calculadoras/finiquito.html', toolText: 'Estimar finiquito antes de descuentos',
    sections: [
      ['Primero pide el desglose', '<p>Separa salarios pendientes, aguinaldo, vacaciones, prima vacacional y otras prestaciones. Después identifica ISR u otras deducciones. Un único total impide comprobar si el cálculo y los descuentos corresponden.</p>'],
      ['Descuentos al salario', '<p>El artículo 110 de la LFT prohíbe descuentos al salario salvo los casos y condiciones que enumera. La procedencia depende del concepto, límites y documentación; no debe suponerse que cualquier adeudo permite descontar cualquier cantidad.</p>'],
      ['Antes de firmar', '<ul><li>Compara fechas y salario utilizados.</li><li>Pide el cálculo bruto, deducciones y neto.</li><li>Conserva recibos y propuesta de finiquito.</li><li>No firmes espacios en blanco.</li><li>Solicita orientación si no estás de acuerdo.</li></ul>'],
      ['Cómo comparar una propuesta', '<p>Calcula prestaciones pendientes sin descuentos y contrástalas una por una. Una diferencia no prueba por sí sola un incumplimiento, pero indica exactamente qué concepto debes aclarar.</p>']
    ],
    faqs: [['¿Pueden descontarme cualquier deuda del finiquito?', 'No. Debe revisarse si el descuento está permitido, documentado y dentro de las condiciones legales aplicables.'], ['¿Tengo que firmar si no entiendo el cálculo?', 'No conviene firmar sin entender el desglose; puedes pedir explicación y orientación laboral.']],
    sources: [['Ley Federal del Trabajo, artículo 110', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['PROFEDET: derechos laborales', 'https://www.gob.mx/profedet/articulos/defiende-a-tiempo-tus-derechos-laborales']]
  },
  {
    slug: 'trabajadores-sin-derecho-reparto-utilidades', cluster: 'PTU', title: 'Qué trabajadores no tienen derecho al reparto de utilidades',
    description: 'Revisa quiénes no participan en la PTU, la regla de trabajadores eventuales y la diferencia entre persona excluida y patrón exento.',
    intro: 'Para saber si corresponde PTU hay que distinguir dos preguntas: si la persona trabajadora participa y si el patrón está obligado a repartir.',
    tool: '/calculadoras/ptu.html', toolText: 'Estimar reparto de utilidades',
    sections: [
      ['Personas que no participan', '<p>El artículo 127 de la LFT establece reglas especiales. Entre ellas, directores, administradores y gerentes generales no participan; las personas trabajadoras del hogar tampoco. Las personas eventuales participan cuando hayan trabajado al menos sesenta días durante el año.</p>'],
      ['Trabajadores de confianza', '<p>Las personas trabajadoras de confianza sí pueden participar, pero para la parte calculada con salario existe un tope cuando su sueldo supera al de la persona sindicalizada o de planta con mayor salario, conforme a la regla legal.</p>'],
      ['Patrones exentos', '<p>Es diferente que el centro de trabajo esté dentro de un supuesto de excepción del artículo 126. Por ejemplo, determinadas empresas de nueva creación y ciertas instituciones están exentas bajo las condiciones previstas.</p>'],
      ['Si ya no trabajas ahí', '<p>Haber renunciado no elimina por sí mismo el derecho generado. Si trabajaste el tiempo requerido durante el ejercicio a repartir, revisa tu caso y la fecha de pago en <a href="/articulos/derecho-ptu-si-renuncio.html">PTU si renuncio</a>.</p>']
    ],
    faqs: [['¿Un trabajador eventual recibe utilidades?', 'Puede participar si trabajó al menos sesenta días durante el año, continuos o discontinuos.'], ['¿Los trabajadores de confianza reciben PTU?', 'Sí pueden participar, con la regla especial de tope salarial prevista en el artículo 127.']],
    sources: [['Ley Federal del Trabajo, artículos 126 y 127', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['PROFEDET: reparto de utilidades', 'https://www.profedet.gob.mx/profedet/info/reparto-utilidades.html']]
  },
  {
    slug: 'es-obligatorio-reparto-utilidades', cluster: 'PTU', title: '¿Es obligatorio el reparto de utilidades en México?',
    description: 'Conoce cuándo es obligatorio repartir utilidades, qué patrones pueden estar exentos y qué debe revisar una persona trabajadora.',
    intro: 'La participación de los trabajadores en las utilidades es un derecho constitucional y laboral. Sin embargo, la ley contempla excepciones para determinados patrones y reglas para calcular la participación.',
    tool: '/calculadoras/ptu.html', toolText: 'Calcular una estimación de PTU',
    sections: [
      ['Cuándo existe obligación', '<p>La obligación se analiza a partir de la renta gravable y del porcentaje determinado para la participación, junto con las reglas de la LFT. Que una empresa tenga ventas no permite conocer por sí solo el monto repartible.</p>'],
      ['Quiénes pueden estar exentos', '<p>El artículo 126 contempla supuestos como empresas de nueva creación durante el primer año y determinadas instituciones, entre otros. Cada excepción tiene condiciones; no basta con que el patrón se describa informalmente como nuevo o sin fines de lucro.</p>'],
      ['Cómo se distribuye', '<p>La utilidad repartible se divide en dos partes iguales: una considera los días trabajados y otra los salarios devengados. La comisión mixta elabora el proyecto individual con la información necesaria.</p>'],
      ['Qué puede revisar el trabajador', '<ul><li>Ejercicio al que corresponde el reparto.</li><li>Días y salario considerados.</li><li>Proyecto individual y observaciones.</li><li>Si existe una excepción legal documentada.</li><li>Fecha límite y comprobante de pago.</li></ul>']
    ],
    faqs: [['¿Todas las empresas nuevas están exentas para siempre?', 'No. La excepción general para una empresa de nueva creación corresponde al primer año de funcionamiento, con reglas especiales para algunos casos.'], ['¿La PTU se calcula solo con el salario?', 'No. La distribución utiliza una mitad por días trabajados y otra por salarios devengados.']],
    sources: [['Ley Federal del Trabajo, artículos 117 a 131', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['PROFEDET: preguntas frecuentes de utilidades', 'https://www.profedet.gob.mx/profedet/info/reparto-utilidades.html']]
  },
  {
    slug: 'dias-vacaciones-por-antiguedad-2026', cluster: 'Vacaciones', title: 'Días de vacaciones por año y antigüedad: tabla 2026',
    description: 'Consulta la tabla de días mínimos de vacaciones por antigüedad en México y aprende cómo aumenta después del quinto año.',
    intro: 'Después de cumplir el primer año de servicio corresponden al menos 12 días laborables de vacaciones. El periodo aumenta con la antigüedad conforme al artículo 76 de la LFT.',
    tool: '/calculadoras/vacaciones.html', toolText: 'Calcular días de vacaciones',
    sections: [
      ['Tabla de vacaciones por antigüedad', '<div class="table-wrap"><table><thead><tr><th>Antigüedad</th><th>Días mínimos</th></tr></thead><tbody><tr><td>1 año</td><td>12</td></tr><tr><td>2 años</td><td>14</td></tr><tr><td>3 años</td><td>16</td></tr><tr><td>4 años</td><td>18</td></tr><tr><td>5 años</td><td>20</td></tr><tr><td>6 a 10 años</td><td>22</td></tr><tr><td>11 a 15 años</td><td>24</td></tr><tr><td>16 a 20 años</td><td>26</td></tr><tr><td>21 a 25 años</td><td>28</td></tr><tr><td>26 a 30 años</td><td>30</td></tr></tbody></table></div>'],
      ['Cómo aumenta después del quinto año', '<p>Durante los primeros cinco años el periodo aumenta dos días por cada año. A partir del sexto año aumenta dos días por cada cinco años de servicios. Las prestaciones contractuales pueden ser superiores.</p>'],
      ['Cuándo deben concederse', '<p>Las vacaciones deben concederse dentro de los seis meses siguientes al cumplimiento del año de servicios. La persona empleadora debe entregar una constancia anual con antigüedad, periodo y fecha de disfrute.</p>'],
      ['Vacaciones y prima vacacional', '<p>Los días de descanso y la prima vacacional son conceptos relacionados pero distintos. La prima mínima es de 25% sobre los salarios correspondientes al periodo de vacaciones. Usa la <a href="/calculadoras/prima-vacacional.html">calculadora de prima vacacional</a>.</p>']
    ],
    faqs: [['¿Cuántos días corresponden al cumplir un año?', 'Al menos 12 días laborables de vacaciones.'], ['¿Cuántos días corresponden con seis años?', 'El mínimo legal es de 22 días.'], ['¿Las vacaciones pueden ser mayores?', 'Sí. El contrato, política o contrato colectivo puede conceder una prestación superior.']],
    sources: [['Ley Federal del Trabajo, artículos 76 a 81', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf']]
  },
  {
    slug: 'aguinaldo-30-dias-aprobado-vigencia', cluster: 'Aguinaldo', title: '¿Ya se aprobó el aguinaldo de 30 días? Estado y vigencia',
    description: 'Consulta si el aguinaldo de 30 días ya fue aprobado en México, qué diferencia hay entre iniciativa, dictamen y decreto, y qué mínimo sigue vigente.',
    intro: 'Al 19 de septiembre de 2026 no se ha publicado en el Diario Oficial una reforma general que sustituya por 30 días el mínimo de 15 días establecido en el artículo 87 de la LFT.',
    tool: '/calculadoras/aguinaldo.html', toolText: 'Calcular aguinaldo con mis días',
    sections: [
      ['Respuesta rápida', '<p><strong>No existe todavía una vigencia general de 30 días para todas las personas trabajadoras regidas por la LFT.</strong> Han existido iniciativas y avances en comisiones legislativas, pero una propuesta no cambia la ley por sí sola.</p>'],
      ['Iniciativa, aprobación y publicación no son lo mismo', '<ol><li>Una iniciativa propone modificar la ley.</li><li>Las cámaras deben discutir y aprobar el texto mediante el procedimiento legislativo.</li><li>El decreto debe publicarse en el Diario Oficial.</li><li>La entrada en vigor depende de sus artículos transitorios.</li></ol><p>Una nota sobre una comisión o una nueva iniciativa no basta para afirmar que ya cambió el mínimo obligatorio.</p>'],
      ['Qué mínimo se utiliza mientras tanto', '<p>El artículo 87 vigente establece al menos 15 días de salario, pagaderos antes del 20 de diciembre, con parte proporcional para quien no haya cumplido el año. Un contrato, política o convenio colectivo sí puede conceder 20, 30 o más días.</p>'],
      ['Cómo verificar un cambio', '<p>Revisa el texto vigente de la LFT y busca el decreto en el Diario Oficial. Desconfía de publicaciones que no enlazan el decreto o confunden una aprobación en comisión con la conclusión de todo el proceso.</p><p>La <a href="/calculadoras/aguinaldo.html">calculadora de aguinaldo</a> permite introducir los días que realmente te concede la empresa.</p>']
    ],
    faqs: [['¿Cuándo entran en vigor los 30 días de aguinaldo?', 'No hay una fecha general de entrada en vigor mientras no exista un decreto aprobado y publicado que modifique el artículo 87 de la LFT.'], ['¿Mi empresa puede pagar 30 días aunque la ley marque 15?', 'Sí. La ley establece un mínimo; el contrato o una prestación superior puede conceder más días.']],
    sources: [['Ley Federal del Trabajo vigente, artículo 87', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['Diario Oficial de la Federación', 'https://www.dof.gob.mx/'], ['Cámara de Diputados: seguimiento de iniciativas', 'https://sitl.diputados.gob.mx/']]
  },
  {
    slug: 'es-legal-pago-nomina-dos-partes', cluster: 'Nómina', title: '¿Es legal que me paguen la nómina en dos partes?',
    description: 'Conoce qué revisar cuando tu salario llega en dos depósitos: recibo CFDI, fechas, conceptos, registro ante el IMSS y salario completo.',
    intro: 'Recibir dos transferencias no demuestra por sí solo una irregularidad. Lo importante es que el salario completo, la fecha, los conceptos y el comprobante de nómina coincidan y estén correctamente registrados.',
    tool: '/calculadoras/salario-neto.html', toolText: 'Comparar salario bruto y neto',
    sections: [
      ['Qué debes comparar', '<ul><li>Importe total pactado y cantidad efectivamente depositada.</li><li>Fecha y periodo de pago.</li><li>Percepciones y deducciones del CFDI de nómina.</li><li>Cuenta de origen y referencias de ambos depósitos.</li><li>Salario registrado ante el IMSS cuando corresponda.</li></ul>'],
      ['Dos depósitos y un solo recibo', '<p>Puede existir una razón administrativa para separar pagos, pero ambos deben poder conciliarse con el recibo y el salario acordado. Si una parte no aparece, pide por escrito la explicación y el comprobante correspondiente.</p>'],
      ['Señales que requieren aclaración', '<p>Presta atención si una parte se presenta como apoyo para ocultar salario, si las deducciones no cuadran, si el CFDI refleja menos ingreso o si el pago llega después de la fecha pactada. Conserva contrato, CFDI, estados de cuenta y mensajes.</p>'],
      ['Cómo revisar el recibo', '<p>Empieza por periodo, días pagados, percepciones gravadas y exentas, deducciones y neto. Usa la guía para <a href="/articulos/leer-recibo-nomina.html">leer un recibo de nómina</a> y solicita asesoría si existe una diferencia que el empleador no aclara.</p>']
    ],
    faqs: [['¿Dos depósitos significan evasión?', 'No necesariamente. Debes comprobar que el salario completo esté documentado y que el recibo, los depósitos y el registro aplicable sean congruentes.'], ['¿Qué guardo para pedir una aclaración?', 'Contrato, CFDI de nómina, estados de cuenta, fechas y cualquier explicación escrita del empleador.']],
    sources: [['Ley Federal del Trabajo', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'], ['SAT: recibos de nómina', 'https://www.sat.gob.mx/'], ['IMSS', 'https://www.imss.gob.mx/']]
  }
];

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function pageHtml(p) {
  const url = `${BASE}/articulos/${p.slug}.html`;
  const faqSchema = p.faqs.map(([q,a]) => ({'@type':'Question', name:q, acceptedAnswer:{'@type':'Answer', text:a}}));
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':`${BASE}/#org`,name:'Calculadoras México',url:`${BASE}/`,logo:{'@type':'ImageObject',url:`${BASE}/assets/img/logo.svg`}},
    {'@type':'BlogPosting','@id':`${url}#article`,headline:p.title,description:p.description,url,datePublished:TODAY,dateModified:TODAY,inLanguage:'es-MX',articleSection:p.cluster,author:{'@id':`${BASE}/#org`},publisher:{'@id':`${BASE}/#org`},image:`${BASE}/assets/img/og-image.png`},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:`${BASE}/`},{'@type':'ListItem',position:2,name:'Artículos',item:`${BASE}/articulos.html`},{'@type':'ListItem',position:3,name:p.title,item:url}]},
    {'@type':'FAQPage',mainEntity:faqSchema}
  ]};
  const toc = p.sections.map(([h],i)=>`<li><a href="#s${i+1}">${escapeHtml(h)}</a></li>`).join('');
  const body = p.sections.map(([h,c],i)=>`<h2 id="s${i+1}">${escapeHtml(h)}</h2>${c}`).join('');
  const faq = p.faqs.map(([q,a])=>`<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join('');
  const sources = p.sources.map(([n,u])=>`<li><a href="${u}" target="_blank" rel="noopener noreferrer">${escapeHtml(n)}</a></li>`).join('');
  const related = pages.filter(x=>x.cluster===p.cluster&&x.slug!==p.slug).slice(0,3).map(x=>`<li><a href="/articulos/${x.slug}.html">${escapeHtml(x.title)}</a></li>`).join('');
  return `<!DOCTYPE html>
<html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(p.title)}</title><meta name="description" content="${escapeHtml(p.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${url}"><link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml"><meta property="og:locale" content="es_MX"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(p.title)}"><meta property="og:description" content="${escapeHtml(p.description)}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="Calculadoras México"><meta property="og:image" content="${BASE}/assets/img/og-image.png"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/styles-v5628.css?v=5.6.28"><link rel="stylesheet" href="/assets/css/interface-v570.css?v=5.7.0"><script>try{document.documentElement.dataset.theme=localStorage.getItem('cm-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}</script><script type="application/ld+json">${JSON.stringify(schema)}</script><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1606770348282610" crossorigin="anonymous"></script></head>
<body class="ziro-site cm-ui"><a class="skip" href="#contenido">Saltar al contenido</a><header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Ir al inicio"><img src="/assets/img/logo-mark.svg" alt="" width="40" height="40" class="cm-logo-mark"><span class="cm-wordmark">Calculadoras<strong>México</strong></span></a><nav class="main-nav" id="main-navigation" aria-label="Navegación principal"><a href="/">Inicio</a><a href="/calculadoras.html">Calculadoras</a><a href="/simuladores.html">Simuladores</a><a class="active" aria-current="page" href="/articulos.html">Artículos</a><a href="/acerca-de.html">Acerca de</a><a href="/contacto.html">Contacto</a></nav><div class="header-actions"><button class="icon-button" data-search-open type="button" aria-label="Abrir buscador">⌕</button><button class="icon-button" data-theme-toggle type="button" aria-label="Cambiar tema"><span data-theme-icon>🌙</span></button><button class="icon-button menu-toggle" data-menu-toggle type="button" aria-label="Abrir menú" aria-controls="main-navigation" aria-expanded="false">☰</button></div></div></header>
<main id="contenido"><nav class="breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>›</span><a href="/articulos.html">Artículos</a><span>›</span><span aria-current="page">${escapeHtml(p.title)}</span></nav><div class="page-wrap"><header class="page-head"><span class="badge">Guía de ${escapeHtml(p.cluster)}</span><h1>${escapeHtml(p.title)}</h1><p>${escapeHtml(p.description)}</p><p><a class="btn" href="${p.tool}">${escapeHtml(p.toolText)}</a></p></header><div class="article-layout"><article class="article"><p class="article-meta">Actualizado el <time datetime="${TODAY}">19 de septiembre de 2026</time> · Lectura aproximada: 6 minutos</p><p><strong>${escapeHtml(p.intro)}</strong></p><nav class="toc" aria-label="En esta guía"><strong>En esta guía</strong><ol>${toc}<li><a href="#preguntas">Preguntas frecuentes</a></li><li><a href="#fuentes">Fuentes</a></li></ol></nav>${body}<h2 id="preguntas">Preguntas frecuentes</h2>${faq}<h2 id="fuentes">Fuentes y alcance</h2><ul>${sources}</ul><p>Información general actualizada al 19 de septiembre de 2026. Los ejemplos muestran el método y sus supuestos; no sustituyen el cálculo oficial ni asesoría laboral o fiscal para un caso particular.</p></article><aside class="side-box"><h2>Más sobre ${escapeHtml(p.cluster)}</h2><ul>${related}<li><a href="${p.tool}">${escapeHtml(p.toolText)}</a></li></ul><p><a href="/articulos.html#semrush-laboral-2026">Ver el clúster completo</a></p></aside></div></div></main>
<nav class="mobile-dock" aria-label="Navegación móvil"><a href="/"><span>⌂</span>Inicio</a><a href="/calculadoras.html"><span>▦</span>Calculadoras</a><a href="/simuladores.html"><span>⇄</span>Comparar</a><button data-search-open type="button"><span>⌕</span>Buscar</button><a href="/articulos.html"><span>▤</span>Artículos</a></nav><footer class="footer"><div class="footer-grid"><div><h3>Calculadoras México</h3><p>Herramientas gratuitas y guías claras para tomar decisiones con más información.</p></div><div><h3>Calculadoras</h3><a href="/calculadoras/isr.html">ISR</a><a href="/calculadoras/finiquito.html">Finiquito</a><a href="/calculadoras/horas-extra.html">Horas extra</a><a href="/calculadoras.html">Ver todas</a></div><div><h3>Aprende</h3><a href="/articulos.html">Todos los artículos</a><a href="/articulos/que-es-el-isr.html">¿Qué es el ISR?</a><a href="/articulos/vacaciones-mexico.html">Vacaciones en México</a></div><div><h3>Información</h3><a href="/acerca-de.html">Acerca de</a><a href="/privacidad.html">Privacidad</a><a href="/terminos.html">Términos</a><a href="/contacto.html">Contacto</a></div></div><div class="footer-bottom">© 2026 Calculadoras México.<span>Resultados informativos; no sustituyen asesoría profesional.</span></div></footer><div class="search-dialog" role="dialog" aria-modal="true" aria-label="Buscador" aria-hidden="true"><div class="search-panel"><div class="search-head"><input class="global-search" type="search" aria-label="Buscar en el sitio" placeholder="Busca ISR, finiquito, vacaciones..."><button class="icon-button" data-search-close type="button" aria-label="Cerrar">✕</button></div><div class="search-results"></div></div></div><script defer src="/assets/js/common.js?v=5.7.0"></script><script defer src="/assets/js/interface-v570.js?v=5.7.0"></script></body></html>`;
}

for (const p of pages) {
  fs.writeFileSync(path.join(ROOT, 'articulos', `${p.slug}.html`), pageHtml(p), 'utf8');
}

const markerStart = '<!-- SEMRUSH_LABORAL_2026_START -->';
const markerEnd = '<!-- SEMRUSH_LABORAL_2026_END -->';
const grouped = [...new Set(pages.map(p=>p.cluster))].map(cluster => `<div><h3>${escapeHtml(cluster)}</h3><ul>${pages.filter(p=>p.cluster===cluster).map(p=>`<li><a href="/articulos/${p.slug}.html">${escapeHtml(p.title)}</a></li>`).join('')}</ul></div>`).join('');
const hubBlock = `${markerStart}<section class="content-box" id="semrush-laboral-2026"><span class="badge">Datos Semrush</span><h2>Nuevas guías de trabajo, salario e ISR</h2><p>Respuestas específicas conectadas con las calculadoras principales, creadas a partir de las consultas y preguntas detectadas para México.</p><div class="grid">${grouped}</div></section>${markerEnd}`;

function upsertBefore(file, before, block) {
  let html = fs.readFileSync(file, 'utf8');
  const re = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  if (re.test(html)) html = html.replace(re, block);
  else {
    const idx = html.indexOf(before);
    if (idx < 0) throw new Error(`No se encontró ${before} en ${file}`);
    html = html.slice(0, idx) + block + html.slice(idx);
  }
  fs.writeFileSync(file, html, 'utf8');
}

upsertBefore(path.join(ROOT, 'articulos.html'), '</main>', hubBlock);

const targetLinks = {
  'calculadoras/isr.html': ['tabla-isr-2026','cuanto-quitan-isr-sueldo','isr-a-cargo-asalariado'],
  'articulos/que-es-el-isr.html': ['tabla-isr-2026','cuanto-quitan-isr-sueldo','isr-a-cargo-asalariado'],
  'articulos/salario-minimo-2026.html': ['salario-minimo-diario-mensual-2026','salario-minimo-frontera-norte-2026'],
  'calculadoras/horas-extra.html': ['horas-extra-dobles-triples','cuantas-horas-extra-semana','me-pueden-obligar-horas-extra'],
  'articulos/horas-extra-2026.html': ['horas-extra-dobles-triples','cuantas-horas-extra-semana','me-pueden-obligar-horas-extra'],
  'calculadoras/finiquito.html': ['cuanto-finiquito-un-ano-renuncia','me-pueden-descontar-finiquito'],
  'articulos/finiquito-renuncia-voluntaria.html': ['cuanto-finiquito-un-ano-renuncia','me-pueden-descontar-finiquito'],
  'calculadoras/ptu.html': ['trabajadores-sin-derecho-reparto-utilidades','es-obligatorio-reparto-utilidades'],
  'articulos/que-es-ptu.html': ['trabajadores-sin-derecho-reparto-utilidades','es-obligatorio-reparto-utilidades'],
  'calculadoras/vacaciones.html': ['dias-vacaciones-por-antiguedad-2026'],
  'articulos/vacaciones-mexico.html': ['dias-vacaciones-por-antiguedad-2026']
  ,'calculadoras/aguinaldo.html': ['aguinaldo-30-dias-aprobado-vigencia']
  ,'articulos/como-calcular-aguinaldo.html': ['aguinaldo-30-dias-aprobado-vigencia']
  ,'articulos/leer-recibo-nomina.html': ['es-legal-pago-nomina-dos-partes']
  ,'calculadoras/salario-neto.html': ['es-legal-pago-nomina-dos-partes']
};

for (const [relative, slugs] of Object.entries(targetLinks)) {
  const links = slugs.map(slug => { const p=pages.find(x=>x.slug===slug); return `<li><a href="/articulos/${slug}.html">${escapeHtml(p.title)}</a></li>`; }).join('');
  const block = `${markerStart}<section class="content-box" data-cluster="semrush-laboral-2026"><h2>Respuestas relacionadas basadas en búsquedas reales</h2><ul>${links}</ul></section>${markerEnd}`;
  upsertBefore(path.join(ROOT, relative), '</main>', block);
}

const sitemapPath = path.join(ROOT, 'sitemap-seo-2026.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
for (const p of pages) {
  const url = `${BASE}/articulos/${p.slug}.html`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `  <url><loc>${url}</loc><lastmod>${TODAY}</lastmod><priority>0.75</priority></url>\n</urlset>`);
  }
}
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

const primaStart = '<!-- SEMRUSH_PRIMA_VACACIONAL_2026_START -->';
const primaEnd = '<!-- SEMRUSH_PRIMA_VACACIONAL_2026_END -->';
const primaBlock = `${primaStart}<section class="content-box" data-cluster="semrush-prima-vacacional-2026"><h2>Dudas frecuentes sobre prima vacacional</h2><p>Para saber cuánto corresponde, multiplica salario diario por días de vacaciones y por el porcentaje de prima. El mínimo general es 25%, pero el contrato puede conceder uno superior.</p><ul><li><a href="/articulos/como-calcular-prima-vacacional.html">Cómo se calcula la prima vacacional paso a paso</a></li><li><a href="/articulos/isr-prima-vacacional.html">¿A la prima vacacional se le quitan impuestos?</a></li><li><a href="/articulos/dias-vacaciones-por-antiguedad-2026.html">Días de vacaciones por año y antigüedad</a></li><li><a href="/calculadoras/prima-vacacional.html">Calcular cuánto me toca de prima vacacional</a></li></ul></section>${primaEnd}`;
for (const relative of ['articulos/como-calcular-prima-vacacional.html','calculadoras/prima-vacacional.html']) {
  let html = fs.readFileSync(path.join(ROOT, relative), 'utf8');
  const re = new RegExp(`${primaStart}[\\s\\S]*?${primaEnd}`);
  if (re.test(html)) html = html.replace(re, primaBlock);
  else html = html.replace('</main>', `${primaBlock}</main>`);
  fs.writeFileSync(path.join(ROOT, relative), html, 'utf8');
}

let refreshedSitemap = fs.readFileSync(sitemapPath, 'utf8');
for (const relative of [...Object.keys(targetLinks), 'articulos/como-calcular-prima-vacacional.html', 'calculadoras/prima-vacacional.html']) {
  const url = `${BASE}/${relative}`;
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  refreshedSitemap = refreshedSitemap.replace(new RegExp(`(<loc>${escaped}<\\/loc><lastmod>)[^<]+`), `$1${TODAY}`);
}
fs.writeFileSync(sitemapPath, refreshedSitemap, 'utf8');

console.log(JSON.stringify({created: pages.length, reinforced: Object.keys(targetLinks).length, slugs: pages.map(p=>p.slug)}, null, 2));
