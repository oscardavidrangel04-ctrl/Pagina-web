# Mejora SEO de salario neto — 17 de octubre de 2026

URL trabajada: /calculadoras/salario-neto.html. Cambios aplicados a la carpeta principal. Sin publicación ni nuevas URLs.

## Datos usados

Excel de GSC del 17 de octubre: filtro de página exacta, búsqueda Web basada en texto, 28 julio–16 octubre de 2026. Páginas y Gráfico coinciden: 4 clics, 1,429 impresiones, CTR 0.28%; Páginas informa posición media 26.55.

Consultas, Países y Dispositivos suman 2 clics y 655 impresiones. No se concilian esos desgloses con el total. Las consultas omitidas pueden explicar parte de una diferencia, pero no se atribuye automáticamente a ello la diferencia de dispositivos y países. Se usa cada pestaña dentro de su alcance y se recomienda un nuevo export simultáneo antes de medir tendencias.

La habilidad de análisis de hojas de cálculo se utilizó para revisar filtros, tipos de dato, sumas y denominadores; el Excel se mantuvo intacto. Lectura con openpyxl del runtime disponible; sin exportar una versión alterada.

Se analizaron los JSON del scraper para Stori, Finsus, Buk y la página propia; y los cuatro exports de posiciones aportados:

| Fuente | Filas | Keywords normalizadas |
|---|---:|---:|
| Propia | 50 | 47 |
| Stori | 688 | 587 |
| Finsus | 1,228 | 950 |
| Buk | 1,149 | 877 |

Las métricas originales y la comparación están en evidencia.json. Las posiciones vacías permanecen desconocidas. Semrush refleja las capturas suministradas, no una comprobación de posiciones actuales; no se equipara su posición puntual con la media de GSC.

## Oportunidades que motivaron los cambios

| Consulta de GSC | Impresiones | Clics | Posición media | Respuesta implementada |
|---|---:|---:|---:|---|
| salario bruto a neto | 26 | 0 | 13.31 | Mantener intención y ruta; descripción más concreta |
| calcular sueldo bruto a neto | 20 | 0 | 12.05 | Procedimiento visible y ejemplos editables |
| calcular sueldo neto a partir del bruto | 20 | 0 | 1.00 | H2 y respuesta directa; FAQ equivalente |
| como calcular un sueldo bruto a neto | 15 | 0 | 4.53 | Explicación en tres pasos y desglose |
| como calcular sueldo bruto a neto | 13 | 0 | 10.00 | Tabla con cada descuento y acción para probar |
| calcular sueldo neto | 17 | 1 | 39.71 | Mantener keyword principal y utilidad del formulario |

Las muestras individuales son pequeñas. Cero clics no demuestra por sí solo un fallo de título; posición, intención, país, dispositivo y presentación de la SERP influyen. Estos cambios son una hipótesis medible de mejora de utilidad y CTR.

## Comparación con competidores

- Stori presenta la intención de conversión de bruto a neto. El documento capturado permite estudiar contenido y controles, pero no certifica la precisión de su cálculo interactivo.
- Finsus muestra bruto, ISR, IMSS y neto, con desglose del impuesto. Los valores capturados incluyen límites de tarifa y condiciones que no deben copiarse como normativa 2026 sin comprobación.
- Buk destaca periodos y cálculo automático de ISR/IMSS, además de contenido de apoyo y captación comercial. El texto extraído también incluye listas de países y formularios: la cantidad de palabras del scraper no representa solo contenido útil.
- Nuestra herramienta captura deducciones conocidas y compara el depósito. Esa diferencia funcional es relevante: cambiar texto no la convierte en un motor automático de nómina. Se refuerza el uso que sí resuelve y se mantiene la ruta al estimador de ISR.

No se copiaron fórmulas fiscales ni cifras de la competencia. No se añadieron keywords de países, años o cálculos ajenos. Consultas inversas como neto a bruto se atienden con enlace a /calculadoras/salario-bruto.html, sin crear una página duplicada.

## Cambios en la carpeta principal

1. Title más legible conservando calculadora, sueldo neto, México y bruto a neto. Meta description centrada en calcular y comparar el depósito, con captura de importes explícita, ejemplos y sin registro.
2. Metadatos sociales y descripciones de schema sincronizados; fecha de revisión y lastmod actualizados únicamente para salario neto.
3. Introducción más directa y accesos a ejemplos y periodos. Formulario conserva aviso de ISR/IMSS manuales y todos sus campos.
4. Ejemplos mensuales, quincenales y semanales que rellenan los importes y calculan. Al cargar un ejemplo se borra el depósito anterior para evitar comparaciones engañosas.
5. Tabla ahora distingue ISR, cuotas y otros descuentos. Cada fila puede cargarse con teclado o ratón. Los importes son explícitamente hipotéticos.
6. Respuesta paso a paso alineada con consultas de GSC. Preguntas frecuentes útiles reemplazan dos preguntas genéricas; FAQ visible y schema permanecen iguales.
7. Acceso claro a neto a bruto y al estimador fiscal. No se cambió la URL ni su canonical.
8. Ajustes de legibilidad móvil y foco de teclado; soporte de preferencia de movimiento reducido al cargar ejemplos.
9. Se retiró de esta página una ilustración PNG de 1,061,968 bytes que repetía la fórmula ya disponible en texto. El archivo se conserva para otras páginas. Esto elimina esa descarga al llegar a la sección; no prueba mejoras de LCP, CLS o INP.

Archivos: calculadoras/salario-neto.html, assets/css/salario-neto-focus.css, assets/js/salario-neto-receipt.js, sitemap.xml y scripts/test-salario-neto-focus.cjs. Respaldo previo en antes/.

## Validación

Prueba local en Edge con terceros bloqueados: cálculo base $17,000; depósito coincidente y diferencia de $200; deducciones negativas y superiores al bruto; ejemplo quincenal $8,250; semanal $4,350; mensual por teclado $13,000; reinicio del depósito al cambiar de ejemplo; FAQ/schema coherentes; anclas válidas; una sola H1; sin excepciones JavaScript; sin desbordamiento de página a 390 y 320 px, incluido tema oscuro. Captura móvil inspeccionada visualmente.

La tabla permite desplazamiento horizontal dentro de su contenedor. No se midieron Core Web Vitals de producción ni funcionamiento de anuncios. Sin cambios al motor fiscal compartido.

Se mantienen index,follow y canonical autorreferente. Los controles locales no certifican el canonical seleccionado o la indexación de Google. FAQPage se conserva como descripción del contenido, sin prometer resultados enriquecidos.

## Fuentes y siguientes mediciones

[Google: títulos descriptivos y concisos](https://developers.google.com/search/docs/appearance/title-link) y [descripciones y snippets](https://developers.google.com/search/docs/appearance/snippet) orientan la consistencia entre contenido y presentación. Google puede generar un título o fragmento diferente.

Se consultó el [Anexo 8 RMF 2026 del SAT](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf) para evitar adoptar las cifras fiscales de los competidores. No se implementaron nuevos cálculos de ISR/IMSS en esta entrega.

Tras publicar, registrar fecha y comparar 28 días anteriores/posteriores para esta URL con filtros constantes, por consulta y dispositivo. Evaluar CTR en posiciones comparables; un aumento de impresiones por nuevas búsquedas puede bajar el CTR agregado. Primero resolver la discrepancia de pestañas del export.

Principal mejora funcional pendiente: un estimador automático de nómina con reglas verificadas de ISR, subsidio e IMSS y supuestos editables. Requiere una implementación y validación fiscal específica; la mejora actual no promete esa función. No se garantizan puestos, clics o impresiones.
