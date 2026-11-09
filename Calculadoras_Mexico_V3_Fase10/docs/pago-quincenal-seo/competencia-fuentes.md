# Pago quincenal: investigación de competencia, fuentes y alcance

Revisión realizada el 8 de noviembre de 2026 (hora de México). Esta investigación acompaña a la matriz de oportunidades y a la línea base del export; no sustituye sus métricas ni demuestra cambios posteriores de posicionamiento.

## Alcance y límites de la investigación

Se buscaron calculadoras de sueldo/pago quincenal, nómina quincenal, ISR quincenal y conversiones entre periodos. Se abrió el contenido de las páginas comparables y las fuentes oficiales indicadas abajo. El proveedor de búsqueda disponible no ofrece una SERP de Google México reproducible con ubicación, dispositivo y posición orgánica comprobables. Por tanto, estas páginas son **competidores funcionales encontrados**, no un supuesto Top 3 certificado.

La comparación externa es de contenido y funciones descritas en HTML. No se ejecutaron sus formularios ni se midieron sus Core Web Vitals, accesibilidad o diseño móvil. Las cifras fiscales de sitios comerciales no se usan como autoridad: se contrastan con SAT.

## Qué hace actualmente el proyecto

La inspección inicial de `calculadoras/pago-quincenal.html` y `assets/js/calculators.js` muestra una conversión de salario mensual: importe diario de referencia = mensual / 30; pago quincenal bruto = mensual / 2. El formulario inicial admite salario mensual, aunque el contenido explica también diario × 15. No calcula retención de ISR ni cuotas IMSS.

El sitio ya tiene un motor separado en `/calculadoras/isr.html`, tablas en `assets/js/tablas.js` y una explicación extensa en `/articulos/isr-semanal-quincenal-mensual.html`. La calculadora ISR permite seleccionar periodo quincenal y advierte que no considera subsidio al empleo, IMSS u otros ajustes. Preservar esta división evita convertir el conversor de pago quincenal en otra calculadora fiscal con resultados distintos.

## Competidores y oportunidades específicas

| Página examinada | Función o contenido observado | Aplicación pertinente a pago quincenal |
| --- | --- | --- |
| [Runa: salario en nómina](https://runahr.com/mx/recursos/nomina/salario-en-nomina/) | Artículo con sueldo mensual/quincenal, percepciones, deducciones y diferencias del calendario. Presenta pasos y ejemplos numéricos. | Explicar bruto frente a depósito final y qué datos del recibo se necesitan. Mantener ejemplos sencillos junto a la herramienta. Revisar aritmética y contexto fiscal independientemente. |
| [Nuvvo/MiFiscal: ISR quincenal](https://fiscal.nuvvo.org/calculadora-isr-quincenal) | Página centrada en ISR de 15 días, tabla por rangos y ejemplo; incluye supuestos fiscales propios. | Responder brevemente «cómo calcular mi ISR quincenal» y dirigir a la herramienta ISR y a la guía existente. No reproducir sus supuestos de subsidio ni desplazar la conversión salarial como intención principal. |
| [ShiftFlow: ingreso mensual](https://www.shiftflow.app/es/free-tools/free-monthly-income-calculator-mexico) | Conversión entre ingreso por hora, día, semana, quincena y año; muestra supuestos de jornada y anualización. | Mostrar el periodo de entrada, la fórmula y el periodo del resultado. Distinguir el equivalente diario con base 30 de una proyección de ingreso por jornadas realmente trabajadas. |
| [Tu Salario MX: sueldo neto quincenal](https://tusalariomx.com/sueldo-neto/quincenal) | Tabla comparativa de bruto, ISR, IMSS y neto, con supuestos salariales explícitos y enlaces a ejemplos. | Diferenciar neto estimado y bruto convertido. Si se permite restar deducciones capturadas por el visitante, explicar que son datos de su recibo, no impuestos calculados automáticamente. |

La oportunidad diferenciadora es ofrecer una conversión inmediata desde mensual **o diario**, fórmulas legibles, deducciones identificadas por el usuario y respuestas de calendario sin exigir un recorrido largo ni atribuir precisión fiscal a un cálculo salarial simple. Las consultas informativas pueden tener respuestas breves después de la herramienta; no justifican convertir toda la página en un calendario o una guía de ISR.

## Fuentes oficiales verificadas

### SAT: tarifa de 15 días de 2026

Fuente abierta: [Anexo 8 de la RMF para 2026, publicación DOF del 28 de diciembre de 2025](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf). El [índice normativo del SAT](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/normatividad_rmf_rgce2026.html) también identifica el anexo.

Se revisó el apartado B, fracción IV, tarifa para pagos de 15 días, en las páginas 5–6 del PDF (índices 4–5). Se contrastaron los 11 rangos —límites inferior/superior, cuota fija y tasa— con `assets/js/tablas.js` y la tabla visible del artículo del proyecto. Coinciden.

Ejemplo independiente, **base gravable hipotética de $10,000**, antes de subsidio y otras deducciones: cuota $916.20 + ($10,000 − $8,651.41) × 21.36% = $1,204.258824 → **$1,204.26**. Redondear al presentar el resultado; no introducir redondeos intermedios innecesarios.

La tarifa del periodo se aplica a su base gravable; no es un porcentaje plano sobre cualquier salario ni se obtiene dividiendo automáticamente el ISR mensual entre dos. Esta revisión verifica la tabla y el ejemplo; no certifica una nómina completa, exenciones, subsidio, IMSS o todos los escenarios del motor fiscal. La página de pago quincenal no necesita duplicar las tablas.

### Ley Federal del Trabajo: alcance salarial

Fuente abierta: [Ley Federal del Trabajo, Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf), documento con última reforma indicada del 14 de mayo de 2026.

- Artículo 83: contempla distintas modalidades de fijación del salario; ayuda a explicar por qué el supuesto del conversor debe ser explícito.
- Artículo 88: regula el intervalo máximo de pago —una semana para trabajo material y quince días para los demás trabajadores—, no una tarifa universal de retención.
- Artículo 89: contiene la división entre siete o treinta para salario semanal o mensual **en el contexto de determinar indemnizaciones**. No presentar ese artículo como si ordenara por sí solo todo pago mensual dividido entre dos, ni como fórmula universal para ausencias o periodos incompletos.

No afirmar que cualquier depósito quincenal equivale necesariamente a 15 días efectivamente trabajados. La herramienta debe distinguir la equivalencia de sueldo fijo de la liquidación real de un periodo con incidencias.

## Calendario y verificaciones aritméticas

Estas son comprobaciones de calendario y del modelo de conversión, no nuevas reglas laborales:

| Concepto | Interpretación correcta |
| --- | --- |
| Dos pagos mensuales durante un año completo | Normalmente 24 fechas de pago: 12 × 2. |
| Pago cada 14 días/catorcena | Cadencia distinta de dos pagos al mes; puede haber 26 o 27 fechas dentro de un año según dónde cae el primer pago. |
| Ejemplo comprobado con fechas de 2026 | Empezando el 1 de enero y sumando 14 días hay 27 fechas hasta el 31 de diciembre; empezando el 2 de enero hay 26, la última el 18 de diciembre. |
| Sueldo mensual fijo dividido en dos pagos iguales | $15,000 / 2 = $7,500 por pago. Es el supuesto del conversor, no la cuantificación automática de faltas o incapacidades. |
| Salario diario de referencia y quincena de 15 días | $500 × 15 = $7,500. Mensual equivalente bajo base 30: $15,000. |
| Segunda parte de un mes | Las fechas reales pueden abarcar distinto número de días en febrero o en meses de 31; deben distinguirse de la equivalencia salarial de 15 días. |

La enumeración de fechas se verificó con `datetime.date` y sumas de `timedelta(days=14)`. No se supone que 26 catorcenas equivalgan a 24 periodos de exactamente 15 días ni que cualquier conjunto de 24 pagos represente necesariamente un año calendario.

## Distribución de intenciones y canibalización

| URL | Intención principal que conviene conservar | Relación útil desde pago quincenal |
| --- | --- | --- |
| `/calculadoras/pago-quincenal.html` | Convertir sueldo mensual o diario a pago quincenal; interpretar el resultado. | Página objetivo. Respuestas cortas sobre bruto, neto, ISR y calendario. |
| `/calculadoras/salario-diario.html` | Obtener/converter salario por día entre periodos. | Enlace para profundizar en cómo obtener la cuota diaria. |
| `/calculadoras/salario-neto.html` | Interpretar/calcular bruto frente a neto y deducciones según el alcance de esa herramienta. | Enlace descriptivo después de explicar que el bruto no es el depósito final. |
| `/calculadoras/isr.html` | Calcular ISR estimado con tarifa del periodo. | Indicar que el usuario seleccione «quincenal»; no inventar parámetros URL que el formulario no procese. |
| `/articulos/isr-semanal-quincenal-mensual.html` | Explicar tarifas fiscales por periodo y su aplicación. | Enlace desde la respuesta sobre ISR quincenal. |
| `/calculadoras/quincenas-a-meses.html` | Convertir cantidades de quincenas a meses/años según su supuesto. | Respuesta breve a «24 quincenas» y enlace hacia la herramienta especializada. |
| `/articulos/presupuesto-con-pago-quincenal.html` | Organizar presupuesto a partir de la periodicidad de ingreso. | Enlace útil después de obtener la cantidad por pago. |

La coexistencia de «salario», «quincena» o «ISR» no demuestra canibalización. El export específico de esta URL no permite comprobar que dos URLs compitan alternativamente por la misma consulta. Para diagnosticar un conflicto real se requiere comparar consultas × páginas × fechas en Search Console. No se proponen fusiones, redirecciones, cambios de canonical ni eliminación de respuestas útiles sin esa evidencia.

La coincidencia de una consulta en filas duplicadas de SEMrush tampoco prueba canibalización cuando ambas señalan la misma URL; la línea base documenta esos registros sin convertirlos en una evolución temporal inventada.

## Decisiones de implementación justificadas

1. Priorizar la intención «calculadora de pago quincenal» y variantes sueldo mensual/diario a quincenal. Conservar la respuesta a ISR mediante contexto y enlaces especializados.
2. Acercar la función del formulario a lo que el contenido ya explica: entrada mensual o diaria, conversión visible y validación de números finitos positivos.
3. Explicar cualquier cálculo neto como resta de deducciones capturadas; no tratar datos ausentes como ISR cero ni afirmar retenciones verificadas.
4. Mantener el ejemplo proporcional de $275, que tiene demanda observada, resolviéndolo con números claros sin desplazar la herramienta.
5. Diferenciar 24 pagos mensuales y ciclos de 14 días, y limitar el alcance de ejemplos de meses de 31 días o periodos incompletos.
6. Conservar identidad visual, monetización, URL/canonical y el contenido útil. No crear otra guía fiscal, otro conversor de quincenas a meses ni páginas por variantes mínimas.

Las mejoras de posiciones, CTR o tráfico quedan pendientes de mediciones posteriores. Esta investigación valida fundamentos y oportunidades, no resultados orgánicos futuros.
