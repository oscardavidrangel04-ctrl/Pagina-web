# Mejora de salario diario — 16 de octubre de 2026

Implementada localmente por petición del usuario. Pendiente de publicación; no se ha desplegado.

URL: https://calculadora-isr-mexico.vercel.app/calculadoras/salario-diario.html

## Cambios

- Título: «Calculadora de salario diario: ¿cuánto ganas al día?»; sincronizado con Open Graph, Twitter y WebPage.
- Descripción orientada a uso gratuito, sin registro, periodos disponibles, ejemplos y diferencia con SDI.
- Respuesta inicial con divisores 30/15/7 y ejemplo $15,000 → $500, visible en HTML.
- Instrucciones específicas para identificar sueldo ordinario, bruto y depósito neto; botón de cálculo explícito.
- Sustitución de FAQs genéricas por seis respuestas sobre salario diario, semana, $12,000 mensuales, conversión inversa, bruto/neto y SDI. FAQPage coincide con las respuestas visibles. Esto no garantiza resultados enriquecidos.
- Sección original sobre divisor 30 frente a promedio 365/12 del IMSS, semana de siete días frente a jornadas pagadas y ejemplo de sueldo fijo con comisiones.
- Fechas de revisión coherentes y lastmod de esta URL actualizado.
- Conservados URL, canonical, H1 y lógica de la calculadora. Eliminado un bloque genérico redundante.

## Correcciones a la investigación previa

La página del IMSS sí contiene una respuesta oficial útil aunque sea breve. Se verificó directamente el 16 de octubre: define el promedio mensual a partir de SBC diario × 365 / 12. El mínimo de palabras del scraper no demuestra que una fuente carezca de valor. Fuente: https://www.imss.gob.mx/pensiones/preguntas-frecuentes/como-calculo-el-salario-promedio-mensual

El número de palabras, encabezados y FAQs no demuestra superioridad SEO. Tampoco se ha probado que la autoridad sea la causa de las posiciones del competidor; es una hipótesis. Las keywords irrelevantes de los reportes (salud, Newton, Netflix, etc.) no deben incorporarse. No se interpreta una celda de posición vacía como posición 1.

## Validación

Comprobaciones aprobadas: un H1, IDs sin duplicación, anclas existentes, enlaces internos a archivos existentes, JSON-LD válido y las seis preguntas/respuestas sincronizadas. Se ejecutó la lógica real de calculators.js con mensual 15,000, quincenal 7,500 y semanal 3,500 (resultado 500), semanal 2,500 (357.142857…) y rechazo de ingreso cero. No se realizó una prueba visual de navegador en este turno.

## Medición tras publicar

Referencia histórica proporcionada por el usuario: 27 clics / 3,864 impresiones = CTR 0.699%, posición media 5.3. Se desconoce el intervalo exacto de esa tabla; no es una línea base temporal comparable hasta recuperar fechas y filtros.

Guardar fecha de publicación. En GSC filtrar esta URL exacta y comparar 28 días antes y después, con mismo país, dispositivo y tipo de búsqueda. Revisar por consulta, no solo agregados: salario diario, cálculo de salario diario, cómo saber mi salario diario y pago semanal. Analizar conjuntamente CTR y posición: ampliar consultas puede reducir CTR agregado aunque aumenten clics. Considerar estacionalidad, mezcla de consultas y retraso de rastreo antes de atribuir variaciones a los cambios.

Google puede reescribir título y descripción. No se promete una posición o incremento concreto.
