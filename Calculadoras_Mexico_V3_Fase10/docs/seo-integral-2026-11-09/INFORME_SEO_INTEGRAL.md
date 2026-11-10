# Calculadoras México — informe de implementación SEO integral

Inicio de cambios: 9 de noviembre de 2026. Cierre de pruebas y entrega: 10 de noviembre de 2026.

Se implementaron cambios en **19 URLs canónicas, representadas por 20 archivos HTML fuente**, además de componentes compartidos, dos módulos JavaScript y herramientas de comprobación. Se trabajó sobre el ZIP suministrado. No se publicó en Vercel ni se envió a GitHub.

**Estado:** build, comprobaciones numéricas y auditorías estáticas aprobados. La comprobación visual en navegador, la entrega real de publicidad y los Core Web Vitals quedan pendientes por las restricciones del entorno. Las mejoras de posicionamiento y CTR son objetivos; no existen mediciones posteriores que demuestren aumentos.

## Base de evidencia

| Fuente | Periodo o alcance | Uso |
| --- | --- | --- |
| GSC de ISR y Bono, exportado el 8 de noviembre | 5 de agosto–7 de noviembre de 2026 | Métricas de la hoja Páginas, contrastadas con Gráfico |
| SEMrush propio ISR | 7 filas históricas | Consultas y brechas; no SERP actual |
| SEMrush El Contribuyente | 191 filas, 131 términos distintos, 61 posiciones vacías | Comparación por intención y por datos disponibles |
| Investigación de bono | 231 términos de los 598 anunciados en el resumen | Clasificación temática; no son posiciones propias |
| Matriz histórica existente del repositorio | GSC 3 de agosto–4 de noviembre de 2026 | Priorización global por URL |
| Build local y configuración Vercel | 408 HTML físicos, 379 rutas canónicas indexables | Auditoría del contenido que se generaría y sus reescrituras |

Las hojas **Páginas y Gráfico sí coinciden** en los dos nuevos libros. Sin embargo, Consultas, Países y Dispositivos no cuadran con esos totales: ISR contiene 46 consultas con 0 clics y 91 impresiones frente a 11/457 en Páginas; Bono contiene 5 consultas con 0 clics y 8 impresiones frente a 30/1,191. Se conservaron los alcances por hoja. No se atribuyó la discrepancia a una causa no demostrada ni se sumaron los registros como si fueran una serie homogénea.

Los volúmenes y KD son estimaciones históricas de SEMrush. Hay observaciones anteriores a las capturas de noviembre y filas duplicadas; sus volúmenes no se suman. No se obtuvo una nueva medición de posiciones actuales. Los datos ausentes permanecen como ausentes, no como cero.

## A. ISR semanal, quincenal y mensual

### Investigación y keywords

URL: `/articulos/isr-semanal-quincenal-mensual.html`.

GSC: **11 clics, 457 impresiones, CTR 2.41%, posición media 16.72**. El foco editorial es «tablas ISR 2026» delimitado a nómina semanal de 7 días, quincenal de 15 días y mensual. No se presenta como un directorio de todos los regímenes fiscales.

| Keyword | Posición propia histórica | El Contribuyente | Volumen estimado | KD |
| --- | --- | --- | --- | --- |
| tabla isr semanal | 22 | 2 | 170 | 22 |
| calculadora isr semanal | 22 | Sin dato | 40 | 20 |
| calculo isr semanal | 23 | Sin dato | 40 | 28 |
| isr semanal | 61 | 2 | 140 | 31 |
| isr quincenal | 66,83 | 13 | 90 | 18 |
| tabla isr quincenal 2026 | Sin dato | 2 | 320 | 24 |
| tabla isr mensual 2026 | Sin dato | 3 | 1300 | 32 |
| tarifa mensual isr 2026 | Sin dato | 4 | 1000 | 28 |
| tablas isr 2026 | Sin dato | 1 | 22200 | 27 |

También se atendieron las consultas sobre cómo calcular la retención, leer límite inferior/cuota/tasa, distinguir impuesto de tarifa y subsidio, y entender un mes con cinco semanas. Las cifras del CSV de keywords son históricas, incluidas las dos posiciones de «isr quincenal»; no se escogió una de ellas como si fuera la posición actual.

Se revisaron las 191 filas y se extrajo texto de las 38 capturas aportadas, con inspección de capturas representativas y del contenido público del competidor. El Contribuyente reúne tablas de múltiples periodicidades y regímenes. La oportunidad elegida para esta URL fue **hacer comprobable el cálculo de nómina con los datos del lector**: seleccionar periodo, ubicar renglón, desglosar fórmula y aclarar ajustes. No se copiaron sus textos ni se añadieron tablas empresariales o de otros regímenes para perseguir volumen ajeno al contenido.

### Implementación

- Title, H1, descripción y metadatos sociales coordinados; descripciones de entidades JSON-LD sincronizadas. Se mantienen las entidades existentes, sin añadir calificaciones ni reseñas inventadas.
- Consulta de tarifa con base gravada y periodicidad; muestra cuota fija, excedente, tasa marginal, tasa efectiva e impuesto antes de subsidio. Señala el renglón de la tabla y enlaza el escenario a `/calculadoras/isr.html`.
- Se conservaron las tres tablas completas en HTML, con sus encabezados, unidades y fuente oficial. El texto y los datos no dependen del cálculo JavaScript para aparecer en el documento.
- Ejemplo semanal trasladado al cuerpo principal; ejemplo quincenal añadido; ejemplo mensual mantenido y comprobado. Glosario de columnas y comparación de dos quincenas contra un mes.
- Explicación diferenciada del subsidio: se enlaza el decreto y la herramienta existente. Este módulo **no calcula subsidio, IMSS ni sueldo neto**.
- Campos etiquetados, mensajes de error anunciables, resultado con región viva y desplazamiento horizontal acotado a tablas. Estas propiedades se revisaron en el HTML/CSS; su presentación visual sigue pendiente.
- Se conservan los destinos internos anteriores y se refuerzan relaciones con ISR, subsidio, recibo de nómina y cálculo de bono.

### Verificación fiscal y numérica

Se contrastaron **33 renglones y 132 valores** de las tablas de 7 días, 15 días y mes contra el Anexo 8 RMF 2026: secciones B.II, B.IV y B.V. La última banda sin límite superior se representa como tal. No se cambiaron las tarifas de `tablas.js` porque ya coincidían.

| Base gravada | Periodo | ISR de tarifa antes de subsidio |
| --- | --- | --- |
| $3,000.00 | Semanal, 7 días | $248.82 |
| $10,000.00 | Quincenal, 15 días | $1,204.26 |
| $20,000.00 | Mensual | $2,383.65 |

El módulo opera en centavos y usa aritmética entera para el redondeo del impuesto marginal. Se probaron **66 casos de límites de tarifa**, además de ejemplos y rechazos de entradas. Las pruebas comparan tanto el HTML como las tablas JavaScript con la referencia fiscal guardada; esa referencia es una transcripción contrastada con la fuente oficial, no una certificación del SAT.

Archivos principales: `articulos/isr-semanal-quincenal-mensual.html`, `assets/js/isr-periodos.js`, `assets/css/isr-tarifas.css`; datos y pruebas en `tarifas-sat-2026.json` y `scripts/test-seo-integral.cjs`.

## B. Calculadora de bono

### Investigación e intención

URL: `/calculadoras/bono.html`.

GSC: **30 clics, 1,191 impresiones, CTR 2.52%, posición media 4.23**. Keyword principal propuesta: **calculadora de bono por porcentaje**. La función de importe fijo amplía la utilidad dentro de la misma URL.

Se priorizaron «cómo calcular un bono», «bono sobre sueldo», productividad, cumplimiento, puntualidad, asistencia y porcentaje equivalente. Entre los términos de la muestra: «bono de productividad como se calcula» tiene volumen estimado 30/KD 15; «calculo de bono de productividad», 30/KD 12; «bono de puntualidad como se calcula», 30/KD no disponible. «Calculadora de bonos» y «calculadora de bonos México» registran volumen 20, pero requieren desambiguar hacia el bono laboral. Un volumen registrado como cero no demuestra ausencia de demanda.

| Tratamiento de keywords de bono | Términos |
| --- | --- |
| Excluir | 101 |
| Enlazar a contenido específico | 12 |
| Priorizar si el bono es laboral | 74 |
| No orientar esta URL | 8 |
| Secundaria; no prometer archivo Excel | 10 |
| Explicar alcance y enlazar | 26 |

La clasificación completa de los **231 términos**, con decisión y motivo individual, está en `bono-keywords-clasificadas.csv`. Se excluyen inversión, deuda gubernamental, valuación/rendimiento de instrumentos, ISSSTE y carbono. Despensa y SBC se remiten a contenido específico; búsquedas de ISR se atienden explicando el alcance y enlazando, sin prometer calcular el bono neto. Consultas de Excel no justifican anunciar una plantilla que no se entrega.

### Funciones y contenido implementados

- **Porcentaje:** base × porcentaje ÷ 100 = bono bruto.
- **Importe fijo:** bono ÷ base × 100 = porcentaje equivalente aproximado.
- Selector de base: sueldo del periodo o ventas/otra cantidad acordada. Si la base no es sueldo, la suma se identifica expresamente como «Base más bono (no es sueldo)».
- Resultado separado de base, bono bruto, porcentaje y suma; redondeo monetario a centavos con enteros. Se rechazan bases vacías, cero o negativas; porcentajes/importes negativos, exceso de precisión y cantidades fuera de los límites declarados. Un bono cero sí es válido.
- Campos inactivos ocultos y deshabilitados; sincronización al cargar datos guardados, enlaces de escenario, cambios de modo y restablecimiento. Al modificar los datos se limpia el resultado anterior.
- Se mantiene el sistema común de copiar, compartir, enlace del escenario, historial, guardar escenario, exportar CSV e imprimir. El módulo produce las mismas filas que esperan esas acciones; el comportamiento del navegador de cada acción aún debe comprobarse.
- Ejemplos ejecutables de porcentaje, importe fijo y puntualidad; explicaciones de productividad, cumplimiento y base anual. Los porcentajes son ejemplos pactados, no prestaciones universales.
- Se distingue bono bruto de neto. Se enlazan LISR 94/96, tablas ISR, recibo, comisión, aguinaldo y prima vacacional según el caso. No se añadió una función fiscal nueva de ISR sobre bonos.

Ejemplos: 10% de $15,000 = $1,500; bono fijo de $1,500 sobre $15,000 = 10%; 5% de $12,000 = $600. El porcentaje equivalente puede redondearse en pantalla; el importe capturado no se recalcula a partir de ese porcentaje mostrado.

### Cambios técnicos y pruebas

`assets/js/bono.js` sustituye la carga del módulo genérico **solo en Bono**. El archivo genérico `calculators.js` se conserva intacto para las demás calculadoras. Se sincroniza la ficha del catálogo y buscador, así como title, descripción, H1 y entidades de la página.

Se aprobaron **12 casos numéricos de bono**. El conjunto ISR/Bono rechazó **26 entradas inválidas**. Se comprobó sintaxis JavaScript, carga estática de los archivos y conservación de integraciones. La prueba preparada de navegador cubre modo fijo, porcentaje equivalente, otra base, validación, restablecimiento, ejemplos y enlace compartido, pero **no se ejecutó con éxito en este entorno**.

Archivos principales: `calculadoras/bono.html`, `assets/js/bono.js`, `assets/js/catalog.js`, `assets/js/catalog.min.js`, `assets/data/calculators.json`, componentes comunes y pruebas.

## C. SEO global de Calculadoras México

### Inventario y auditoría técnica

| Comprobación | Antes | Después |
| --- | --- | --- |
| HTML físicos en build | 408 | 408 |
| HTML con cuerpo de página | 407 | 407 |
| Rutas canónicas indexables localmente | 379 | 379 |
| URLs indexables cubiertas por los sitemaps | 379 | 379 |
| URLs indexables huérfanas o inalcanzables | 0 | 0 |
| Enlaces internos rotos o dirigidos a redirecciones detectados | 0 | 0 |
| Titles o descripciones duplicados detectados | 0 | 0 |
| Descripciones JSON-LD desalineadas | 14 en 12 URLs | 0 |
| Archivos publicados por build | 490 | 492 |

Las 379 rutas comprenden **63 calculadoras, 296 artículos, 12 temas y 8 páginas restantes**. El HTML físico adicional incluye fallbacks, páginas no indexables y un archivo de verificación; no representa contenido que deba indexarse por existir. «Indexable» describe las condiciones locales de HTML/configuración, **no significa que Google haya indexado 379 páginas**.

Se revisaron sitemap, robots, canonicals, redirecciones/reescrituras de Vercel, noindex, vínculos y fragmentos internos, títulos/descripciones/H1, IDs, etiquetas de campos, alternativas de imágenes, referencias a activos y JSON-LD. La revisión del HTML no sustituye un rastreo HTTP de producción ni una auditoría visual de accesibilidad.

La arquitectura ya mantenía home a profundidad 0, **65 URLs a un clic y 313 a dos clics**. Se conservó esa cobertura. No se atribuye a esta entrega una reducción de profundidad ni una eliminación de enlaces rotos que no existían en la línea base.

La segunda auditoría detectó que `/articulos/dias-de-aguinaldo.html` se sirve mediante `fallback-dias-de-aguinaldo.html`. Se corrigió la descripción estructurada tanto en la fuente como en el fallback efectivo y se repitió la auditoría sobre el build.

### Mejoras implementadas

Además de las dos prioridades, se mejoraron cinco calculadoras con evidencia histórica: **ahorro mensual, margen de ganancia, IVA incluido, precio de venta y regla de tres**. Incluyen ejemplos que cargan valores y ejecutan el cálculo; instrucciones específicas; y selección editorial de herramientas relacionadas. Se verificaron 13 resultados de sus fórmulas existentes, sin reescribir esas fórmulas.

El manejador compartido de ejemplos valida el payload, utiliza controles existentes, dispara eventos y enfoca el resultado. Los seis bloques de relacionados elegidos se marcan para que el JavaScript genérico no sustituya su selección editorial. Las otras páginas mantienen su comportamiento anterior.

Se retiraron **65 apariciones de enlaces** en bloques redundantes de cuatro de esas páginas, conservando sus enlaces contextuales y la cobertura del sitio. No son 65 URLs eliminadas. Los relacionados ahora conectan ahorro con meta/tiempo/interés; margen con precio/costos; IVA incluido con IVA/retenciones; y regla de tres con porcentajes y descuentos.

También se añadieron conexiones contextuales en los temas de nómina e impuestos y en los artículos de bonos/SBC y lectura del recibo. Se corrigieron las 14 discrepancias de descripción estructurada en 12 URLs. Son ajustes de coherencia; por sí solos no prueban mayor visibilidad.

Se actualizaron los `lastmod` correspondientes a las 19 URLs modificadas, con fecha **2026-11-09**, cuando se realizaron los cambios de contenido/datos estructurados/enlaces. No se cambió la fecha de las 379 URLs indiscriminadamente ni se alteraron canonicals.

### Metadatos y preservación

| URL | Title entregado |
| --- | --- |
| /articulos/isr-semanal-quincenal-mensual.html | Tablas ISR 2026: semanal, quincenal y mensual |
| /calculadoras/bono.html | Calculadora de bono: porcentaje o monto fijo  /  México |
| /calculadoras/iva-incluido.html | Calculadora de IVA incluido: desglosar y quitar IVA |
| /calculadoras/regla-tres.html | Calculadora de regla de tres simple directa paso a paso |

El detalle de title, descripción y H1 antes/después está en `metadatos-antes-despues.csv`. En el resto se conservan títulos y H1 existentes salvo los ajustes descritos de contenido y schema; no hubo una reescritura masiva.

Las fuentes HTML de **salario diario, pago quincenal y salario neto**, sus módulos específicos, el módulo genérico de calculadoras, las tarifas, la home, Vercel y el generador de monetización coinciden byte a byte con la versión recibida: **11 archivos protegidos por SHA-256**. Los componentes compartidos sí reciben el cambio acotado descrito; esto se declara para no confundir preservación del código propio con una prueba visual completa.

Se mantienen identidad azul, logo verde, tipografías, navegación y sistema de diseño. Las adiciones CSS se limitan a los controles de consulta ISR y a los botones de ejemplos, con ajuste de texto y ancho. No se rediseñó la home.

### Mapa temático y canibalización

`mapa-keywords-379-urls.csv` asigna grupo, intención, keyword propuesta, métricas disponibles y profundidad a cada URL indexable. Las URLs principales tienen una asignación editorial específica; para páginas secundarias se toma el H1 vigente como propuesta inicial. Esto no equivale a haber obtenido volumen o posiciones SEMrush individuales para las 379 URLs. Las ausencias de datos se indican expresamente.

La matriz histórica contiene **96 consultas compartidas entre más de una URL**, registradas en `solapamientos-keyword-url.csv`. Una consulta compartida no demuestra que una página perjudique a otra. No hay una serie consulta–URL suficiente para medir alternancia temporal o pérdida atribuible a competencia interna.

| Relación revisada | Distinción observada | Decisión |
| --- | --- | --- |
| Salario diario / salario neto | Conversión de periodo / deducciones conocidas del recibo | Mantener y proteger ambas |
| Pago quincenal / tema de nómina | Cálculo de referencia de 15 días / navegación y explicación de conceptos | Mantener roles complementarios |
| Tablas por periodo / calculadora ISR / cómo leer la tabla | Consulta de las tablas completas / herramienta de cálculo / explicación de columnas | Mantener, diferenciar presentación y enlazar escenarios |
| Aguinaldo / aguinaldo proporcional | Existe solapamiento funcional parcial; la general cubre más escenarios y la segunda se centra en parte del año | Mantener; medir consulta–URL antes de fusionar |
| Finiquito / liquidación | Prestaciones pendientes / escenarios de indemnización | Mantener distinción y enlaces existentes |
| Artículos / herramientas relacionadas | Explicación específica / operación con datos del lector | Mejorar enlaces, sin canonical cruzado por similitud temática |
| Margen / precio de venta | Utilidad sobre venta / aumento sobre costo | Ejemplos diferentes y enlaces complementarios |

No se fusionaron, eliminaron ni redirigieron páginas por similitud de palabras. Tampoco se crearon URLs para variantes mínimas de keywords.

### Rendimiento: medición disponible

| Página | Cambio HTML (bytes) | Cambio JS local (bytes) |
| --- | --- | --- |
| /articulos/isr-semanal-quincenal-mensual.html | +5,430 | +8,464 |
| /calculadoras/bono.html | +3,737 | -24,507 |
| /calculadoras/ahorro-mensual.html | -2,499 | +1,360 |
| /calculadoras/margen-ganancia.html | -2,818 | +1,360 |
| /calculadoras/iva-incluido.html | +474 | +1,360 |
| /calculadoras/precio-venta.html | -3,047 | +1,360 |
| /calculadoras/regla-tres.html | -1,491 | +1,360 |

Son diferencias del **HTML compilado y la suma de JavaScript local referenciado**, sin caché ni descarga de terceros. El CSV `recursos-antes-despues.csv` incluye también CSS y tamaños gzip. Bono carga 24,507 bytes menos de JavaScript local al usar su módulo específico; ISR añade 8,464 bytes por tablas/módulo y cambio compartido. Las cinco calculadoras adicionales reciben 1,360 bytes del componente compartido. No se oculta ese coste.

**No hay mejoras de LCP, INP o CLS verificadas.** No se obtuvo una medición Lighthouse/CrUX o de campo posterior. No se eliminó CSS global por una supuesta falta de uso sin poder recorrer visualmente las páginas. Los recuentos de bytes no equivalen a tiempos reales ni garantizan mejores Core Web Vitals.

### Monetización

El build mantiene en las **407 páginas con cuerpo** exactamente una instancia de cada una de las dos unidades Adsterra existentes y las integraciones de Sol Crédito MX y AliExpress. Se comprobó que volver a aplicar el transformador no duplicara las integraciones. No se eliminaron afiliados ni se agregaron formatos publicitarios.

Esta comprobación demuestra presencia y consistencia del código, no la entrega de impresiones, clics, conversiones ni disponibilidad de las redes. La suite de navegador preparada simula anuncios para aislar el layout; incluso cuando se ejecute, hará falta una inspección separada con las redes reales.

### Matriz de oportunidades y decisiones

Los datos GSC se mantienen por periodo y URL. Todos los impactos de esta tabla son **esperados**, no resultados medidos después del cambio. Las últimas cuatro filas documentan decisiones de conservación.

| URL | Problema SEO | Datos que lo justifican | Cambio implementado | Impacto esperado | Validación |
| --- | --- | --- | --- | --- | --- |
| /articulos/bonos-salario-base-cotizacion.html | Descripción estructurada desalineada y oportunidad de conectar bono bruto con recibo/SBC. | Sin métricas GSC de página aportadas; evidencia en HTML/auditoría. 1 discrepancia(s) de descripción JSON-LD. | Descripción JSON-LD sincronizada y enlaces contextuales a bono y revisión de nómina. | Coherencia de entidades y continuidad entre cálculo y explicación. | JSON-LD y enlaces locales verificados. |
| /articulos/como-calcular-salario-diario-integrado.html | Descripción de la entidad de página distinta a la metadescripción vigente. | GSC 03-ago–04-nov-2026: 0 clics; 274 impresiones; CTR 0.00%; posición 43.16. 2 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /articulos/cuenta-de-ahorro.html | Descripción de la entidad de página distinta a la metadescripción vigente. | GSC 03-ago–04-nov-2026: 0 clics; 149 impresiones; CTR 0.00%; posición 61.23. 1 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /articulos/dias-de-aguinaldo.html | Descripción de la entidad de página distinta a la metadescripción vigente. | GSC 03-ago–04-nov-2026: 0 clics; 130 impresiones; CTR 0.00%; posición 43.86. 1 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /articulos/finiquito-por-despido.html | Descripción de la entidad de página distinta a la metadescripción vigente. | Sin métricas GSC de página aportadas; evidencia en HTML/auditoría. 1 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /articulos/isr-semanal-quincenal-mensual.html | Faltaba consultar el rango con la base propia; ejemplos y distinción de subsidio mejorables. | GSC 05-ago–07-nov-2026: 11 clics; 457 impresiones; CTR 2.41%; posición 16.72. 1 discrepancia(s) de descripción JSON-LD. | Consulta de tarifa, ejemplos de 7/15 días y mes, glosario, enlaces y metadatos coordinados. | Mejor respuesta a tablas y cálculo de nómina; posible mejora de relevancia y CTR. | 132 celdas fiscales, 66 límites, auditoría estática; interacción visual pendiente. |
| /articulos/leer-recibo-nomina.html | Descripción estructurada desalineada y oportunidad de conectar percepciones y retención. | Sin métricas GSC de página aportadas; evidencia en HTML/auditoría. 1 discrepancia(s) de descripción JSON-LD. | Descripción JSON-LD sincronizada y rutas contextuales a bono, tablas y salario neto. | Facilitar la lectura del recibo sin mezclar bono bruto con neto. | JSON-LD y enlaces locales verificados. |
| /articulos/que-es-salario-diario-integrado.html | Descripción de la entidad de página distinta a la metadescripción vigente. | GSC 03-ago–04-nov-2026: 0 clics; 110 impresiones; CTR 0.00%; posición 50.25. 2 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /calculadoras/ahorro-mensual.html | CTR bajo; instrucciones genéricas y relacionados poco pertinentes. | GSC 03-ago–04-nov-2026: 3 clics; 1,303 impresiones; CTR 0.23%; posición 8.55. | Ejemplos ejecutables sin interés y con aportaciones; supuestos y relacionados de ahorro. | Aclarar aportaciones y tasa; facilitar la siguiente herramienta. | 2 proyecciones verificadas, HTML/enlaces; navegador pendiente. |
| /calculadoras/bono.html | Solo porcentaje; no resolvía importe fijo ni porcentaje equivalente; había consultas ajenas a bonos laborales. | GSC 05-ago–07-nov-2026: 30 clics; 1,191 impresiones; CTR 2.52%; posición 4.23. | Dos modos, tipo de base, cálculos a centavos, ejemplos, bruto/neto, contenido y metadatos. | Cubrir consultas laborales pertinentes y facilitar el uso sin diluir intención. | 12 casos numéricos; entradas inválidas; módulo exclusivo y activos verificados; navegador pendiente. |
| /calculadoras/interes-compuesto.html | Descripción de la entidad de página distinta a la metadescripción vigente. | GSC 03-ago–04-nov-2026: 0 clics; 126 impresiones; CTR 0.00%; posición 33.00. 1 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /calculadoras/iva-incluido.html | Baja visibilidad; la intención de desglosar/quitar IVA podía explicarse de forma más directa. | GSC 03-ago–04-nov-2026: 1 clics; 555 impresiones; CTR 0.18%; posición 58.15. | Title y descripción específicos; ejemplos de total a base e impuesto; relacionados fiscales. | Mejorar correspondencia con desglosar IVA incluido. | 3 casos con tasas capturadas 16% y 0%; HTML/enlaces; navegador pendiente. |
| /calculadoras/margen-ganancia.html | Oportunidad en segunda página; confusión entre margen y aumento sobre costo. | GSC 03-ago–04-nov-2026: 2 clics; 562 impresiones; CTR 0.36%; posición 12.40. | Ejemplos de margen, markup y pérdida; explicación y enlaces a precio/costos. | Responder mejor a la intención y diferenciar la herramienta de precio de venta. | 4 casos, incluidos pérdida y costo cero; HTML/enlaces; navegador pendiente. |
| /calculadoras/precio-venta.html | Sin clics en el periodo histórico; riesgo de confundir aumento sobre costo y margen. | GSC 03-ago–04-nov-2026: 0 clics; 397 impresiones; CTR 0.00%; posición 50.17. 1 discrepancia(s) de descripción JSON-LD. | Ejemplos ejecutables, explicación del aumento, enlaces a margen y corrección de descripción de schema. | Diferenciar precio por markup y enlazar al cálculo de margen. | 2 casos numéricos; JSON-LD/enlaces; navegador pendiente. |
| /calculadoras/prima-vacacional.html | Descripción de la entidad de página distinta a la metadescripción vigente. | GSC 03-ago–04-nov-2026: 2 clics; 427 impresiones; CTR 0.47%; posición 57.74. 1 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /calculadoras/regla-tres.html | Baja visibilidad e instrucciones poco específicas para proporción directa. | GSC 03-ago–04-nov-2026: 2 clics; 402 impresiones; CTR 0.50%; posición 31.41. | Title y descripción de regla de tres simple directa; ejemplos y relacionados pertinentes. | Ajustar intención a la función que realmente ofrece. | 2 casos numéricos; HTML/enlaces; navegador pendiente. |
| /calculadoras/vacaciones-proporcionales.html | Descripción de la entidad de página distinta a la metadescripción vigente. | Sin métricas GSC de página aportadas; evidencia en HTML/auditoría. 1 discrepancia(s) de descripción JSON-LD. | Sincronización de la descripción JSON-LD con el contenido actual. | Consistencia semántica; no se atribuye un salto de posiciones a este cambio. | Discrepancia inicial eliminada en la auditoría posterior. |
| /temas/impuestos.html | Oportunidad de distinguir tarifa ISR de subsidio y descuentos. | Sin métricas GSC de página aportadas; evidencia en HTML/auditoría. | Sección contextual de tabla, cálculo y subsidio. | Orientar al usuario hacia la función fiscal adecuada. | Enlaces y cobertura de temas verificados. |
| /temas/nomina.html | Oportunidad de conexión contextual entre bono, tarifa ISR y recibo. | Sin métricas GSC de página aportadas; evidencia en HTML/auditoría. | Sección Del bono bruto al recibo de nómina con destinos complementarios. | Conectividad temática más útil; no reducción de profundidad atribuida. | Enlaces y cobertura de temas verificados. |
| /calculadoras/salario-diario.html | CTR bajo histórico; contenido ya optimizado antes de esta entrega. | GSC 03-ago–04-nov-2026: 133 clics; 22,291 impresiones; CTR 0.60%; posición 4.97. | Conservación de la optimización existente; sin reescribir título, H1 ni fórmula. | Evitar regresiones y medir la respuesta de la versión existente. | SHA-256 del HTML original y módulo protegido (primeras tres); diff sin cambios para salario-hora. |
| /calculadoras/pago-quincenal.html | CTR bajo histórico; contenido ya optimizado antes de esta entrega. | GSC 03-ago–04-nov-2026: 109 clics; 17,142 impresiones; CTR 0.64%; posición 4.99. | Conservación de la optimización existente; sin reescribir título, H1 ni fórmula. | Evitar regresiones y medir la respuesta de la versión existente. | SHA-256 del HTML original y módulo protegido (primeras tres); diff sin cambios para salario-hora. |
| /calculadoras/salario-neto.html | CTR bajo histórico; contenido ya optimizado antes de esta entrega. | GSC 03-ago–04-nov-2026: 6 clics; 1,986 impresiones; CTR 0.30%; posición 30.71. | Conservación de la optimización existente; sin reescribir título, H1 ni fórmula. | Evitar regresiones y medir la respuesta de la versión existente. | SHA-256 del HTML original y módulo protegido (primeras tres); diff sin cambios para salario-hora. |
| /calculadoras/salario-hora.html | CTR bajo histórico; contenido ya optimizado antes de esta entrega. | GSC 03-ago–04-nov-2026: 6 clics; 1,397 impresiones; CTR 0.43%; posición 7.23. | Conservación de la optimización existente; sin reescribir título, H1 ni fórmula. | Evitar regresiones y medir la respuesta de la versión existente. | SHA-256 del HTML original y módulo protegido (primeras tres); diff sin cambios para salario-hora. |

### Pruebas y estado reproducible

| Comprobación | Resultado |
| --- | --- |
| `node scripts/build-public.cjs` | PASS; 492 archivos públicos; informes y scripts excluidos |
| `node scripts/test-seo-integral.cjs` | PASS; 132 valores fiscales, 66 límites, 12 casos de bono, 26 rechazos, 13 ejemplos; preservación y monetización |
| `python3 scripts/audit-seo-integral.py docs/seo-integral-2026-11-09/deep-after.json` | Sin incidencias dentro del alcance estático comprobado |
| `python3 scripts/audit-seo-technical.py` | Sin incidencias detectadas; 379 rutas |
| `python3 scripts/check-phase6-release.py` | PASS; arquitectura, enlaces y sitemaps |
| `python3 scripts/check-phase4-topics.py` | PASS; 359 artículos/calculadoras cubiertos por 12 temas |
| Sintaxis JS y `git diff --check` | PASS |
| `node scripts/check-seo-release.cjs` | No completado: Chromium bloqueado por el entorno |
| `node scripts/test-seo-integral-browser.cjs` | Preparado y sintaxis válida; ejecución de navegador pendiente |

Las pruebas de ejemplos comunes usan un adaptador mínimo de eventos/documento para ejecutar las funciones reales; **no son una prueba DOM de navegador**. Se conserva esa distinción en `validation-static-unit.json`.

Se sustituyó la ruta Windows fija de Playwright en seis comprobadores existentes por `scripts/browser-runtime.cjs`, que permite dependencia local, runtime o rutas explícitas. Tras resolver ese problema de portabilidad, Chromium falló al crear su socket de proceso (`Operation not permitted`). La alternativa de abrir un archivo local en el navegador compartido fue rechazada por la política de protocolos. No se eludieron esas restricciones.

La nueva suite de navegador está preparada para 11 páginas, cuatro anchos (320, 390, 768 y 1440) y dos temas, más interacciones y revisión opcional de todas las rutas indexables con `--all`. **88 combinaciones previstas no son 88 pruebas ejecutadas.** No hay capturas nuevas que acrediten esa revisión.

Para reproducir en un entorno con Python/lxml, Node y Playwright/Chromium disponibles:

```bash
node scripts/build-public.cjs
node scripts/test-seo-integral.cjs
python3 scripts/audit-seo-integral.py docs/seo-integral-2026-11-09/deep-after.json
python3 scripts/check-phase6-release.py
python3 scripts/check-phase4-topics.py
node scripts/test-seo-integral-browser.cjs
node scripts/test-seo-integral-browser.cjs --all
```

### Pendientes y seguimiento

1. Ejecutar y revisar la suite de navegador en un entorno permitido: desbordamientos, temas, controles, errores de consola, escenarios guardados y acciones de resultado. Luego comprobar visualmente móvil y escritorio con las redes publicitarias reales.
2. Tras publicar, comprobar respuestas HTTP, reescrituras, recursos, robots y canonicals de producción. Confirmar la actualización del caché/service worker con una sesión nueva y otra que ya haya visitado el sitio.
3. Medir LCP/CLS y tiempos de interacción en laboratorio; observar INP de campo cuando haya muestra suficiente. Mantener la publicidad y ajustar solo a partir de problemas reproducibles.
4. Comparar en GSC ventanas equivalentes de 28 días **después del rastreo de la nueva versión**, segmentadas por página, consulta, dispositivo y país. Revisar primero las dos URLs principales y después las cinco calculadoras adicionales. Separar estacionalidad de aguinaldo/fin de año y cambios de demanda.
5. Si existe alternancia de URLs para una consulta, obtener la serie consulta–URL antes de decidir fusiones o redirecciones. No usar solo promedios de posición para concluir canibalización.

## Archivos y trazabilidad

Todo el proyecto actualizado se entrega en el ZIP, con el informe y las evidencias en `docs/seo-integral-2026-11-09/`. `archivos-modificados.csv` lista cambios y hashes finales. Las pruebas y nuevos módulos se incluyen en la fuente; el build público excluye documentación, exports y scripts.

Evidencias principales: `deep-before.json`, `deep-after.json`, `audit-before.json`, `audit-after.json`, `validation-static-unit.json`, `preservation-baseline.json`, `tarifas-sat-2026.json`, `research-original.json`, `gsc-metricas-por-url.csv`, `isr-keywords-priorizadas.csv`, `bono-keywords-clasificadas.csv`, `mapa-keywords-379-urls.csv`, `solapamientos-keyword-url.csv`, `matriz-oportunidades-implementadas.csv`, `metadatos-antes-despues.csv`, `recursos-antes-despues.csv` y `sitemap-changes.json`. Las hojas originales se exportaron también a CSV para conservar sus alcances.

## Fuentes consultadas

- [SAT: Anexo 8 RMF 2026, publicado el 28 de diciembre de 2025](https://wwwnp.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf). Tarifas de nómina B.II, B.IV y B.V.
- [DOF: decreto de subsidio para el empleo, 31 de diciembre de 2025](https://sidof.segob.gob.mx/notas/5777649). Contexto y enlace; el nuevo módulo no implementa el subsidio.
- [Cámara de Diputados: Ley del ISR](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf), artículos 94 y 96.
- [El Contribuyente: tablas ISR 2026](https://www.elcontribuyente.mx/tablas-isr/2026/), junto con el export y capturas aportados; referencia competitiva, no fuente normativa.
- [Google Search Central: construcción de sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Fecha de modificación vinculada al cambio real.
- [Google Search Central: datos estructurados FAQ](https://developers.google.com/search/docs/appearance/structured-data/faqpage). No se promete un resultado enriquecido FAQ para este sitio financiero.
