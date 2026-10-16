# Revisión SEO y CTR — 15 de octubre de 2026

## Entrega

Cambios locales en 12 calculadoras que cubren los 15 temas del bloque. No se ha desplegado el sitio ni modificado el scraper. No se cambiaron fórmulas, rutas, canonical, anuncios o configuración de Vercel.

Objetivo: hacer más evidente el resultado que ofrece cada página y alinear título, descripción y contenido con la intención del visitante. No hay garantía de primera posición, de aumento de CTR ni de que Google muestre literalmente la descripción propuesta.

## Qué se utilizó y qué se descartó

Se revisaron los 14 ZIP proporcionados y el texto de Palabra clave.docx. Las pautas de análisis de hojas de cálculo se usaron para distinguir datos exportados de información ausente; el documento se trató como evidencia de consultas, no como instrucciones para modificar el sitio.

- `bloque 1.zip`: calculadora de sueldo, sueldo neto, sueldo bruto, ISR y pago quincenal.
- `bloque 2.zip`: salario diario, salario por hora, aguinaldo, calculadora de aguinaldo y aguinaldo proporcional.
- `bloque 3.zip`: finiquito, calculadora de finiquito, vacaciones y prima vacacional. No contiene una comparación independiente de liquidación laboral.
- `sueldo bruto.zip`, `sueldo neto .zip` y `auditoria_seo_resultados.zip`: muestras adicionales de competidores; las URL propias de estas tres comparaciones apuntaban al inicio. No se trasladó esa asignación a la arquitectura: las herramientas específicas siguen siendo los destinos principales.
- Los seis ZIP individuales de Keyword Magic y los dos lotes múltiples: CSV de palabras clave sin filas. Los JSON indican `filtered_empty`, con `kdMin=0` y `kdMax=0`; se conservaron enlaces y etiquetas de consultas, útiles como señales cualitativas, pero no como un conjunto completo de volúmenes y dificultad.
- Los dos archivos `magic-varias-keywords-2026-10-15T04-35-00-285Z` (con y sin `(1)`) son idénticos por SHA-256. Se contó su evidencia una sola vez.
- El lote múltiple sí contiene referencias de consultas sobre liquidación laboral: se usaron junto con el alcance real de la calculadora y fuentes oficiales.
- Palabra clave.docx: consultas como bruto a neto, calcular aguinaldo y prima vacacional, con diversas URL y fechas. Sus posiciones y estimaciones no se tomaron como clics reales de Search Console ni como medición actual uniforme.
- Se excluyeron del criterio editorial noticias, navegación de otros sitios, vídeos y comentarios irrelevantes, búsquedas turísticas/escolares sobre vacaciones y reglas fiscales de otros países. Las sugerencias automáticas de “añadir sección” del scraper no se ejecutaron de forma ciega.

## Cambios por página

| Página en /calculadoras/ | Intención prioritaria | Contenido original incorporado |
|---|---|---|
| salario-neto.html | Calculadora de sueldo / bruto a neto | Comprobar depósito frente al recibo; distinguir transferencias y periodos; ejemplo con deducciones expresamente ilustrativas. |
| salario-bruto.html | Neto a bruto | Comparar ofertas del mismo periodo y explicar qué dato falta cuando solo se conoce el neto deseado. |
| isr.html | ISR mensual, quincenal y semanal | Diferenciar ingreso gravable, tasa marginal, tasa efectiva y neto final; etiqueta del formulario más precisa. |
| pago-quincenal.html | Conversión de sueldo a quincena | Explicar por qué el depósito puede ser distinto de la mitad del sueldo; ejemplo bruto/neto y distinción de catorcena. |
| salario-diario.html | Conversión mensual, quincenal y semanal | El mismo resultado con tres periodicidades y un error de captura concreto; enlace a SDI sin confundirlo con salario ordinario. |
| salario-hora.html | Sueldo por hora y conversión inversa | Comparar ofertas de 40 y 48 horas semanales, manteniendo la misma base salarial. |
| aguinaldo.html | Aguinaldo / calculadora de aguinaldo | Comparación con el recibo recibido, prestación de 15 frente a 20 días y separación entre antigüedad y fracción anual. |
| aguinaldo-proporcional.html | Parte proporcional por días | Ejemplo verificable de 180 días y explicación de por qué no equivale exactamente a dividir entre dos. |
| finiquito.html | Finiquito / calculadora por renuncia | Datos que preparar, saldos pendientes y advertencia sobre anticipos que no se restan automáticamente. |
| liquidacion.html | Simulación de liquidación laboral | Separar conceptos, declarar exclusiones y evitar duplicar sueldo pendiente al combinar simulaciones. |
| vacaciones.html | Días por antigüedad y pago | Distinguir salario del periodo de la prima adicional; años cumplidos y condiciones superiores a la tabla mínima. |
| prima-vacacional.html | Importe de prima vacacional | Base de cálculo, comparación de 25% y 40%, y error de contar el beneficio dos veces. |

Los títulos y metadescripciones se reescribieron para estas 12 páginas. Se sincronizaron Open Graph, Twitter y los nombres/descripciones de los objetos de página o aplicación presentes en JSON-LD. Se conservaron los H1 y las rutas existentes para evitar cambios innecesarios de identidad.

Se retiraron 20 preguntas genéricas en cuatro páginas (8 de salario bruto, 8 de aguinaldo proporcional, 3 de salario diario y 1 de pago quincenal). Los FAQPage afectados se regeneraron a partir de las preguntas visibles. No se prometen resultados enriquecidos de FAQ.

Se sustituyeron bloques de palabras clave genéricos por explicaciones útiles y se añadieron enlaces contextuales entre herramientas. El acceso principal pasó de “Ir a la calculadora” a “Calcular ahora”. Los lastmod de las 12 calculadoras se actualizaron en ambos sitemaps, sin fechar todo el sitio artificialmente.

Los valores anteriores y nuevos de título y descripción están en `CTR_2026-10-15_cambios.json`.

## Verificación

- Revisión técnica: 377 URL indexables; sin incidencias detectadas, enlaces rotos, páginas huérfanas ni discrepancias de cobertura en sitemap.
- Prueba específica: 24 vistas, las 12 calculadoras a 390 y 1440 píxeles. Títulos, descripciones, Open Graph, H1, contenido nuevo, ausencia de desbordamiento y preguntas estructuradas visibles: PASS.
- Cálculos predeterminados comprobados en las 12 páginas; para ISR se verificó la salida de impuesto, no se hizo una nueva auditoría fiscal del motor.
- Pruebas previas de lotes editoriales, navegación sin JavaScript, carga/buscador, salario neto, salario por hora y aguinaldo: PASS tras actualizar la expectativa del test de salario neto al nuevo título sin año y a la declaración de deducciones manuales. Se conservaron las pruebas de fórmula y depósito.
- Inspección visual de las nuevas secciones en salario neto y vacaciones en móvil: texto legible y sin recortes. Las capturas fuerzan la representación de contenido diferido para poder revisarlo.
- No se modificaron los motores de cálculo ni se afirma haber medido Core Web Vitals o comportamiento en producción con anuncios externos cargados.

## Publicación y medición de CTR

1. Publicar esta carpeta en el despliegue habitual. No sustituirla por los ZIP del scraper.
2. Verificar las 12 páginas públicas y sus canonical. En Search Console, revisar la URL canónica elegida y el rastreo de las páginas prioritarias; solicitar indexación no garantiza plazos.
3. Anotar la fecha de despliegue y conservar el registro de títulos. El punto de partida de este cambio es la publicación, no la fecha del archivo.
4. Comparar 28 días con los 28 anteriores, por página y consulta, separando México, dispositivo y tipo de búsqueda. Usar periodos menores solo como seguimiento provisional, no como prueba concluyente.
5. Calcular CTR como clics totales / impresiones totales, no como promedio simple de porcentajes. Comparar consultas con posición similar: un cambio de posición o de mezcla de consultas puede explicar el CTR sin efecto del snippet.
6. Revisar clics, impresiones, CTR y posición juntos. Más impresiones en búsquedas nuevas pueden reducir el CTR agregado aunque aumenten los clics. En aguinaldo, considerar la estacionalidad de fin de año.
7. Si hay suficientes impresiones comparables y el CTR no mejora, revisar el resultado que Google realmente muestra antes de volver a cambiar títulos. No rotarlos diariamente ni perseguir un objetivo de CTR universal.

No se ha medido todavía un aumento atribuible a esta entrega. Para una evaluación fiable se necesitan datos posteriores a la publicación, idealmente con exportaciones filtradas por página y consulta.

## Referencias comprobadas

- Google Search Central: [títulos de resultados](https://developers.google.com/search/docs/appearance/title-link) y [descripciones/snippets](https://developers.google.com/search/docs/appearance/snippet). Google puede construirlos con distintas fuentes del contenido; no basta con escribir una metaetiqueta.
- [Ley Federal del Trabajo vigente, Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf): artículos 76 y 80 para vacaciones/prima, 87 para aguinaldo y 89 para bases salariales. Comprobación del texto consultado el 15-10-2026.
- PROFEDET: [renuncia voluntaria](https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria) y [despido](https://profedet.gob.mx/profedet/micrositio/index.php/despido), para mantener separadas las prestaciones pendientes y la indemnización.
