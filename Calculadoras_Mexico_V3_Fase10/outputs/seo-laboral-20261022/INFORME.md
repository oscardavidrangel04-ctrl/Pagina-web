# Optimización SEO laboral — cierre del 25 de octubre de 2026

**Estado: implementado y probado en la carpeta principal; no publicado.** Los cambios de contenido se aplicaron el 23 y 24 de octubre; el cierre se verificó el 25. Se mejoraron 12 URLs existentes: ocho calculadoras y cuatro guías. Hay 13 HTML modificados porque una guía también se sirve mediante un archivo fallback. No se crearon ni eliminaron URLs.

El trabajo cruza Google Search Console, Bing, Semrush del dominio, competidores y Keyword Magic. Las mejoras buscan aumentar la utilidad y la cobertura de búsquedas; el código terminado no demuestra todavía un aumento de clics, posiciones o CTR.

## A. Inventario de keywords y procedencia

Se procesaron **16,098 filas de keywords**, incluidas 44 semillas sin métricas. Quedaron **9,875 consultas normalizadas distintas** y 6,223 repeticiones por keyword entre los conjuntos. No hay filas idénticas dentro de cada reporte. Son medidas diferentes: una consulta repetida puede tener otra URL, posición o fuente.

| Fuente | Filas de keywords | Únicas dentro de la fuente | Interpretación |
|---|---:|---:|---|
| Google Search Console | 1,000 | 979 | Observadas en el export; no son todas las consultas del dominio |
| Bing Webmaster Tools | 485 | 481 | Observadas; export de keywords sin rango de fechas incluido |
| Semrush competidores | 6,932 | 4,400 | Estimaciones de diez reportes competidores |
| Semrush dominio propio | 893 | 713 | Estimaciones; diferentes apariciones de una misma keyword |
| Keyword Magic | 6,744 | 6,400 | Diez CSV completos; México, escritorio, amplia, filtro KD 0–50 |
| Semillas | 44 | 44 | Ideas iniciales, sin asignarles métricas inexistentes |

Las **9,875 keywords son material de análisis, no keywords que el sitio haya ganado**. Las cifras únicas de fuentes distintas no se suman porque se solapan.

Clasificación final: 6,702 consultas en alcance actual; 1,636 fuera de los diez clústeres; 1,467 con año antiguo; 69 de otros países y una de año futuro. Las 6,702 en alcance se dividen en 3,808 propuestas de URL por intención y 2,894 pendientes de revisión editorial. No se incorporaron todas al texto ni se crearon páginas automáticamente. La clasificación usa reglas y revisión de muestras; los casos ambiguos quedan pendientes.

Los 713 términos del reporte propio se distribuyen por su mejor posición estimada: 5 en 1–3, 8 en 4–10, 23 en 11–20, 88 en 21–50 y 589 en 51–100. En forma acumulada son Top 3: 5; Top 10: 13; Top 20: 36; Top 100: 713. No conocemos el total absoluto de keywords del dominio por este export.

Archivos completos:

- [Maestro para filtrar](keywords-maestro.csv) y [observaciones completas por keyword](keywords-maestro.json).
- [Conteos, filtros, fechas, país y dispositivo por reporte](keywords-fuentes-conteos.csv).
- [Metodología y conciliación](keywords-reporte.md), [conteos reproducibles](keywords-conteos.json) y [fuentes originales con procedencia](fuentes-completas.json).

Se conservaron los valores de volumen en conflicto; no se suman volúmenes ni se convierten en impresiones. La normalización agrupa acentos, mayúsculas y espacios, pero conserva variantes originales y referencias de cada fila. Los CSV consolidados duplicados dentro del ZIP Magic no se contaron una segunda vez.

## B. Línea base y mapa SEO por URL

### Métricas observadas

| Buscador / export | Periodo | Clics | Impresiones | CTR |
|---|---|---:|---:|---:|
| GSC, gráfico de rendimiento | 28 julio–22 octubre 2026 | 206 | 34,025 | 0.6054% |
| Bing, resumen diario | 4 agosto–19 octubre 2026 | 292 | 9,887 | 2.9534% |

Estos periodos y conjuntos no son equivalentes: **no permiten concluir que Bing convierta mejor que Google**. El archivo Bing de keywords no incluye fechas ni URLs. Sus 485 filas suman 163 clics y 921 impresiones, distintos del resumen diario.

GSC exporta consultas y páginas por separado, sin unión consulta–URL. Las 1,000 filas de consultas solo suman nueve clics y 6,311 impresiones: no equivalen a los totales del gráfico. Una consulta ausente no prueba falta de posicionamiento. Las asignaciones de keywords a páginas del maestro son propuestas editoriales, no asociaciones observadas en GSC.

Se revisaron semanas completas: 4–10 octubre, 15 clics/3,560 impresiones/posición 19.2; 11–17 octubre, 29/7,429/12.2. Hay crecimiento agregado previo a esta intervención. La última fila, 18–22 octubre, solo contiene cinco días y no se comparó como semana completa. No existe una serie diaria por URL que permita atribuir ese crecimiento a páginas concretas o a cambios previos.

### URLs intervenidas

La posición y las impresiones de esta tabla corresponden a la página completa en GSC, no a su keyword principal propuesta. «Sin fila» significa ausencia de esa URL exacta del export, no cero tráfico.

| URL relativa | Keyword principal editorial | Clics / impresiones / posición inicial | Mejora aplicada |
|---|---|---|---|
| `/calculadoras/salario-neto.html` | sueldo neto | 4 / 1,585 / 30.13 | Datos del recibo más claros, prevención de doble descuento y limpieza de resultados antiguos |
| `/calculadoras/salario-bruto.html` | sueldo bruto | Sin fila | Alcance real del cálculo inverso, seis ejemplos interactivos, selector de periodo y validaciones |
| `/articulos/salario-bruto-neto.html` | sueldo bruto y neto | 0 / 337 / 35.39 | Explicación inversa precisa, ejemplo original y accesos según los datos que conoce la persona |
| `/articulos/con-que-salario-se-calcula-aguinaldo.html` | aguinaldo con sueldo bruto o neto | 0 / 285 / 19.64 | Ejemplo comparativo y distinción de salario fijo/variable; también en el fallback servido |
| `/calculadoras/finiquito.html` | calculadora de finiquito | Sin fila | Días y moneda corregidos, requisitos del formulario, seis preguntas útiles y navegación consolidada |
| `/calculadoras/liquidacion.html` | calculadora de liquidación | Sin fila | Veinte días opcionales desactivados por defecto, base de cálculo explicada y seis preguntas |
| `/calculadoras/vacaciones.html` | calculadora de vacaciones | Sin fila | Días de vacaciones expresados correctamente, validación, fuentes y seis preguntas |
| `/calculadoras/prima-vacacional.html` | calculadora de prima vacacional | 2 / 295 / 48.73 | Mínimo y campos validados, seis preguntas y enlaces más claros |
| `/calculadoras/horas-extra.html` | calculadora de horas extra | Sin fila | Descripción específica, ejemplos editables, cómputo semanal y regla transitoria de 2026 |
| `/articulos/horas-extra-2026.html` | horas extra 2026 | Sin fila | Ejemplo numérico claro, descripción, reforma verificada y eliminación de schema redundante |
| `/articulos/horas-extra-dobles-triples.html` | horas extra dobles y triples | Sin fila | Límites vigentes, diferencia entre pago y jornada y ejemplos por semana |
| `/calculadoras/ptu.html` | calculadora de PTU | Sin fila | Fórmula 50/50, datos empresariales necesarios, ejemplo editable y validaciones de coherencia |

[Mapa implementado por URL](mapa-implementado-por-url.csv) incluye variantes seleccionadas, intención, oportunidad, métricas, fuentes y cambios. [Inventario completo](matriz-inventario-urls.csv) incluye archivo servido, canonical, sitemap, robots y métricas disponibles. El maestro permite filtrar todas las propuestas por URL.

### Conservación de páginas con visibilidad

Se verificó que los HTML de pago quincenal, salario diario, bono, calculadora de aguinaldo, aguinaldo por antigüedad, aguinaldo de tres meses y salario diario integrado permanecen idénticos a la línea base. También permanece idéntico el motor compartido `assets/js/calculators.js`.

Pago quincenal tenía 86 clics/10,950 impresiones/posición 4.82 y salario diario 46/7,123/5.16. No había evidencia suficiente para volver a cambiar sus títulos o su enfoque en esta tanda. Sí reciben la corrección técnica compartida de los botones móviles. La calculadora de aguinaldo ya tenía una revisión reciente; se reforzó la guía complementaria de base salarial, evitando otra reescritura inmediata de la herramienta.

## C. Brecha competitiva y decisiones de contenido

Hay **3,067 consultas en alcance presentes con posición numérica en competidores y sin fila en el export del dominio propio**. Es una brecha entre archivos, no prueba de que el sitio nunca posicione o de que carezca de contenido sobre esos temas. El listado completo está en [brechas priorizadas](keywords-brechas-priorizadas.csv).

Se priorizaron familias compatibles con soluciones existentes: cálculo de finiquito y liquidación, vacaciones y prima, bruto/neto, horas dobles/triples y reparto de utilidades. Las consultas extensas sobre salario, otros países, turismo, aguinaldos no laborales y PTU con otros significados se separaron o quedaron pendientes.

La revisión accesible de Facturama y del portal de Conciliación Laboral mostró formularios con periodos de salario, fechas y desglose. La oportunidad propia fue aclarar qué pide cada campo, mostrar ejemplos reproducibles y decir qué calcula cada herramienta. No se copiaron textos, fórmulas ni divisores de los competidores. No se adoptó automáticamente su promesa de cálculo neto.

Páginas consultadas:

- [Facturama: finiquito](https://facturama.mx/calculadoras/finiquito).
- [Facturama: aguinaldo](https://facturama.mx/calculadoras/aguinaldo).
- [Conciliación Laboral: calculadora](https://www.conciliacionlaboral.org.mx/herramientas/calculadora).
- [STPS: reparto de utilidades](https://www.gob.mx/stps/articulos/todo-lo-que-necesitas-saber-del-reparto-de-utilidades): acceso directo bloqueado con 403; no se atribuyen hallazgos de contenido no leído.

Los otros reportes competidores aportan keywords y métricas estimadas; eso no equivale a una inspección visual completa de todas sus páginas. El competidor Santander.es aporta variantes lingüísticas, pero no se usó como autoridad fiscal mexicana.

No se crearon URLs: los temas implementados ya tenían destinos adecuados y crear otra página habría solapado su intención. Las peticiones de Excel/PDF, países/años distintos y los plazos específicos para reclamar finiquito se mantienen como pendientes de validación; no se fabricaron recursos ni respuestas para llenar el mapa.

## D. Modificaciones de contenido, snippets, arquitectura y código

### Contenido original y precisión

- Aguinaldo: caso de $18,000 brutos y $15,500 depositados. Con 15 días y año completo, $9,000 frente a $7,750 si se usa indebidamente el depósito; diferencia $1,250. Se explica por qué no debe confundirse el neto recibido con la base salarial.
- Bruto: seis ejemplos editables, alcance de bruto = neto + deducciones conocidas y advertencia clara de que no determina por sí solo un bruto único para un neto objetivo. Neto evita la doble captura de descuentos y permite comparar un recibo del mismo periodo.
- Horas extra: ejemplo de sueldo mensual $15,000, jornada de ocho horas y 12 horas extra de la misma semana: $1,687.50; se distingue de repartir las horas entre semanas. La tabla repetida se retiró.
- PTU: bolsa $100,000, días 300/5,000 y salarios 180,000/3,000,000: $6,000 antes de topes e impuestos. Se explica que faltando datos empresariales no se puede obtener un monto individual fiable.
- Prestaciones: se corrigieron unidades en tablas que mostraban días como dinero. Las preguntas se redujeron de 12 a seis por calculadora, con FAQPage coincidente. Se retiraron repeticiones sin eliminar destinos internos únicos.
- Liquidación: los 20 días por año requieren activación consciente. La ayuda indica que el simulador usa una sola base diaria; si indemnización y sueldo pendiente requieren bases diferentes, se deben separar los cálculos. No se presenta la simulación como un finiquito integral ni como resolución de un caso legal.

Las descripciones nuevas de horas extra, su guía anual y PTU destacan la solución concreta, los ejemplos y los límites reales. Se conservaron los títulos de páginas con señales previas que no justificaban otra prueba. Google puede construir títulos y snippets distintos: [documentación de títulos](https://developers.google.com/search/docs/appearance/title-link) y [snippets](https://developers.google.com/search/docs/appearance/snippet). No se promete un fragmento enriquecido por incorporar FAQPage.

### Verificación oficial

La [Ley Federal del Trabajo de Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf), con última reforma indicada de 14 mayo 2026, se consultó para vacaciones, prima, aguinaldo, indemnización, horas extraordinarias y PTU. La transición de la reforma del 1 mayo conserva nueve horas semanales extraordinarias en 2026 y 2027; los artículos reformados no deben leerse sin sus transitorios. Las guías distinguen el umbral de pago del límite legal de jornada.

Para la base de aguinaldo se utilizó [PROFEDET, preguntas frecuentes oficiales](https://profedet.gob.mx/profedet/archivos/Preguntas_frecuentes_AGUINALDO_2020.pdf), identificando su año, junto con la LFT vigente. Se distinguieron salario fijo, destajo y vendedores/agentes. No se introdujeron tablas fiscales nuevas ni se cambió el motor de cálculo.

### Archivos y arquitectura

El listado exacto está en [cierre verificado](cierre-verificado.json): 17 archivos existentes modificados y cuatro nuevos de producción. Incluye 13 HTML, dos sitemaps, dos assets compartidos corregidos y tres assets nuevos de ayuda/estilo, además de `.vercelignore`.

- `assets/js/laboral-ejemplos-20261023.js`: ejemplos y validación, solo horas extra y PTU.
- `assets/js/salario-bruto-focus.js` y `assets/css/salario-bruto-focus.css`: controles, ejemplos y presentación de bruto.
- `assets/js/salario-neto-receipt.js`: limpieza del resultado y estado al editar, cambiar periodo o rechazar entradas.
- `assets/css/interface-v570.css`: botones de cálculo apilados y legibles en móvil. La corrección es compartida porque el defecto provenía del estilo común.
- `sitemap.xml` y `sitemap-seo-2026.xml`: solo las fechas de las 12 URLs con contenido cambiado.
- `.vercelignore`: excluye las carpetas de evidencia locales de estas tandas de la publicación en Vercel; no sustituye las reglas de lo que se suba a un repositorio.

Se respetaron URLs y canonical. Se leyó el archivo realmente servido por los rewrites de Vercel; la guía de aguinaldo se actualizó en ambas copias necesarias. Los enlaces HTML siguen siendo rastreables. Los bloques repetidos se consolidaron preservando sus destinos únicos, y se añadieron accesos contextuales entre ejemplos, guías y herramientas.

Respaldos previos en `antes/`. Detalles adicionales: [salarios](cambios-salarios.md), [prestaciones](cambios-prestaciones.md), [controles móviles](qa-controles-responsive.md).

## E. Validación técnica y funcional

| Verificación ejecutada | Resultado |
|---|---|
| Auditoría general `check-phase6-release.py` | PASS: 379 URLs indexables locales, 408 HTML físicos |
| Enlaces y arquitectura | Cero enlaces internos rotos o hacia redirecciones; cero páginas indexables huérfanas o inaccesibles; todas en sitemap; profundidad máxima de dos clics en el grafo local |
| Navegador de 12 páginas a 320/390/1440 px y cálculos | PASS: 136 comprobaciones en `pruebas-navegador.json` |
| Botones móviles y recibo neto, diez calculadoras | PASS: 55 comprobaciones, 30 layouts, en `qa-controles-responsive.json` |
| Aritmética y ayudas de salarios | PASS: 24 comprobaciones en `qa-salarios.json` |
| Preservación, FAQ visible/schema y lastmod | PASS en `cierre-verificado.json` |

Se probaron valores predeterminados, ejemplos, campos vacíos, negativos, totales incoherentes de PTU, horas fraccionarias, cero horas, deducciones superiores al bruto y navegación con Enter. Liquidación da $45,000 con datos predeterminados y $75,000 al incluir los 20 días; finiquito $9,948.63; vacaciones $7,500; prima $1,500. Son resultados de escenarios concretos, no derechos universales.

Se corrigieron durante QA un enlace PTU inexistente, un marcado redundante y el botón móvil que mostraba «Calcular» en vertical. Las pruebas finales pasan. Las capturas se revisaron, además de las medidas de desbordamiento y tamaño de controles.

Los distintos conjuntos de pruebas se solapan; sus conteos no representan usuarios, URLs distintas ni cobertura exhaustiva de todas las situaciones legales.

**Límites de verificación:** las pruebas sirven los archivos locales respetando rewrites y bloqueando terceros. No hay un despliegue nuevo verificado, inspección de URLs de Google/Bing, medición CrUX ni Core Web Vitals de producción en esta tarea. La indexabilidad local no demuestra que un buscador haya indexado una URL. No se comprobaron transacciones de anuncios ni integraciones externas bloqueadas en el navegador de prueba.

## F. Seguimiento de 7, 14, 30, 60 y 90 días

La fecha de publicación está vacía en la línea base. **El día cero será el despliegue real**, no el día de modificación de archivos. [Comparación posterior](comparacion-posterior.csv) contiene filas preparadas y métricas posteriores vacías, no ceros ficticios. [Línea base por URL](linea-base-urls.csv) y [línea base completa](linea-base.json) conservan las cifras iniciales.

| Hito | Qué comprobar | Decisión |
|---|---|---|
| 7 días | Publicación de archivos, acceso y canonical en producción; sitemap; primeras señales de rastreo; errores de cálculo o móvil | Corregir regresiones técnicas; no reescribir títulos por unos días sin clics |
| 14 días | Consultas y URLs nuevas observadas; indexación; comparación de periodos completos iguales y mismo país/dispositivo | Separar crecimiento de cobertura de cambios en CTR; registrar títulos que el buscador muestra |
| 30 días | Ventana de 28 días posterior frente a 28 días anterior al despliegue; clics, impresiones, CTR, posiciones por consulta y URL | Revisar snippets solo cuando exista exposición suficiente y una diferencia interpretable |
| 60 días | Persistencia de variaciones; nuevos términos; distribución de posiciones; páginas que compiten por las mismas consultas | Ampliar una intención útil si el dato y el contenido lo justifican; confirmar canibalización antes de consolidar |
| 90 días | Resultado por URL y clúster, Google/Bing por separado; Semrush con misma base/dispositivo y estacionalidad | Mantener cambios útiles, ajustar los débiles y decidir nuevas páginas con evidencia |

Para cada medición:

1. Exportar GSC con consulta + página cuando sea posible, además de fecha, país, dispositivo y tipo de búsqueda. Mantener México, tipo Web y el mismo dispositivo o segmentarlo; no mezclarlos al comparar. Guardar también el reporte completo para no perder contexto.
2. Exportar Bing con las mismas fechas comparables y páginas además de consultas. Si no dispone de una dimensión, dejarla como desconocida. No sumar Google y Bing ni comparar sus CTR como si fueran la misma SERP.
3. Calcular CTR como clics totales / impresiones totales. No promediar porcentajes de filas. Usar la posición de cada consulta/URL y, al agregar, ponderarla por impresiones; una media global puede empeorar por nuevas consultas aunque las antiguas se mantengan.
4. Seguir cohortes de consultas ya observadas y consultas nuevas por separado. Comparar CTR dentro de rangos de posición 1–3, 4–10, 11–20 y demás, y por dispositivo. Una caída del CTR global no implica automáticamente un snippet peor.
5. Para Semrush conservar país/base, dispositivo, fecha y alcance de URL o dominio. Deduplicar keywords y comparar mejor posición de forma consistente. Registrar nuevas, subidas, bajadas y ausentes del export; «ausente» no es necesariamente «perdida».
6. Medir Top 3/10/20/100 acumulados y bandas exclusivas sin mezclarlos. Contar keywords por URL y dominio sin sumarlas entre URLs como si fueran únicas del dominio.
7. Registrar estacionalidad de aguinaldo y PTU, variaciones de demanda, cambios en SERP y otros despliegues. No atribuir automáticamente todo aumento posterior a esta intervención ni fijar porcentajes de crecimiento inventados.

No se ha creado una automatización ni se han solicitado cambios de indexación. El siguiente resultado medible depende de publicar esta versión y disponer de exportaciones posteriores comparables.
