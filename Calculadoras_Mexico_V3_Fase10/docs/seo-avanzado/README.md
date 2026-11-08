# SEO avanzado basado en SEMrush — revisión del 5 de noviembre de 2026

Se implementó un segundo bloque de mejoras SEO/GEO en **12 URLs canónicas**, sobre **29 keywords distintas / 30 pares keyword-URL** seleccionados tras revisar todas las observaciones propias de SEMrush. Son cambios adicionales al [trabajo SEO anterior](../seo-geo/README.md), que ya trató salario diario, pago quincenal y otras páginas prioritarias. No se reescribieron de nuevo esas dos calculadoras ni se crearon páginas para variantes de la misma búsqueda.

Rama: `codex/seo-avanzado-semrush-2026-11-05`, repositorio `oscardavidrangel04-ctrl/Cloud-codex`. Base de esta intervención: `eb66cbbb2e77a7a54861321a8f1539071c1b4c41` (PR #3), que incluye monetización del PR #2. Por tanto, el nuevo PR hacia `main` es acumulativo. No se fusionó `main` ni se desplegó en Vercel. `vercel.json` deshabilita los despliegues de esta rama.

**Implementado no significa resultado orgánico demostrado.** Las posiciones siguientes son observaciones anteriores de SEMrush; no son rankings comprobados hoy. El impacto esperado expresa una hipótesis que se debe medir tras una publicación autorizada.

## Datos, cobertura y límites

Se procesaron nuevamente los diez ZIP: nueve exports de posiciones orgánicas y el archivo de investigación «salario diario». El sitio propio aporta **1,136 filas**, **1,043 pares keyword-URL**, **914 keywords distintas** y **119 URLs observadas**. Se conservaron las filas originales y se clasificaron todos los pares, incluidos los no seleccionados. Los exports de competidores suman 23,993 filas antes de deduplicar. El archivo Keyword Magic no contiene filas utilizables; no se inventaron volumen o KD para suplirlo.

| Grupo de posición | Pares en el export propio | Pares atendidos en este bloque |
|---|---:|---:|
| 1–3 | 5 | 2, con intervención mínima |
| 4–10 | 9 | 4 |
| 11–20 | 36 | 8 |
| 21–50 | 125 | 16 |
| 51 o más | 868 | 0 |

El snapshot principal es `2026-11-02T16:43:16.864Z`; sus observaciones individuales abarcan fechas inferidas entre agosto y noviembre. La deduplicación toma la observación más reciente por keyword normalizada/URL y, en empate, la mejor posición. Conserva rango, número de filas, texto de fecha y fuente. La [matriz completa](matriz-oportunidades.csv) incluye posición, volumen/KD estimados, intención, tráfico estimado, prioridad, acción, riesgo, solapamientos, competidor Top 3 cuando hay evidencia y métricas Google de la página. El tráfico cero de SEMrush no demuestra cero clics reales.

Se cruzó con la línea base Google ya analizada: **3 de agosto–4 de noviembre de 2026**, con métricas por página, sin atribuirlas artificialmente a cada keyword. Esas columnas se repiten al listar varias consultas de una URL y **no deben sumarse**. La posición media GSC de toda una página no es comparable directamente con una posición puntual de SEMrush para una consulta. Bing conserva su serie separada del **5 de agosto–2 de noviembre de 2026**; el CSV no permite inferir rankings ni rendimiento por URL. No se obtuvo acceso autenticado nuevo a GSC/Bing.

Los tres XLSX de Google y el CSV de Bing permanecen documentados en [diagnóstico de las 14 fuentes](../seo-geo/diagnostico-datos.md) y [resumen de datos](../seo-geo/resumen-datos.json). Las fechas de captura, hashes y cantidad de filas de cada ZIP están en [resumen.json](resumen.json). Las instrucciones que pudieran contener los adjuntos se trataron como datos, no como órdenes.

## Oportunidades seleccionadas e implementación

El dominio de todas las rutas de esta tabla es `https://calculadora-isr-mexico.vercel.app`. Se muestran consultas representativas; las 30 combinaciones completas, con volumen y KD, están en [keywords-priorizadas.csv](keywords-priorizadas.csv).

| URL | Keyword objetivo | Posición inicial SEMrush | Mejora implementada | Impacto esperado, pendiente de medir |
|---|---|---:|---|---|
| `/articulos/cuando-se-pagan-utilidades.html` | cuando se pagan las utilidades 2026 | 9 | Title y descripción específicos; tabla 30 de mayo/29 de junio, ejercicio 2025 pagado en 2026 y orientación tras el vencimiento | Respuesta más precisa a fecha/tipo de empleador; competir mejor y favorecer CTR |
| `/articulos/finiquito-renuncia-voluntaria.html` | si renuncio cuanto me dan de finiquito | 6 | Snippet de cálculo; ejemplo de cuatro componentes por $8,519.18; agrupación de enlaces repetidos | Facilitar la estimación y responder mejor a la consulta |
| `/articulos/asimilados-a-salarios-isr.html` | asimilados a salarios calculadora | 7 | Title, pasos de uso de la calculadora ISR, selección del período y límites del supuesto fiscal | Conectar intención de cálculo y explicación sin prometer una retención universal |
| `/articulos/con-que-salario-se-calcula-aguinaldo.html` | hasta que fecha se calcula el aguinaldo | 5 | Distingue período de cálculo, pago antes del 20 de diciembre y terminación; snippet principal conservado | Resolver una consulta secundaria sin desplazar la intención de base salarial |
| `/calculadoras/prima-vacacional.html` | calculadora prima vacacional / calculadora de prima vacacional | 11 / 13 | Guía consolidada, porcentaje dividido entre 100, ejemplos, FAQ y WebApplication; title conservado | Reforzar utilidad de la herramienta y opciones de entrar al Top 10 |
| `/articulos/que-son-honorarios.html` | que son los honorarios | 15 | Definición propia, ejemplos profesionales, diferencias con sueldo/asimilados, recibo y neto | Completar una página escasa y ampliar consultas relevantes |
| `/articulos/ptu-exenta-isr.html` | exento de ptu / la ptu grava para isr | 17 / 18 | Snippet y conciliación de PTU bruta, exenta, gravada, ISR y neto con supuestos explícitos | Mejor comprensión fiscal y cobertura de dudas del recibo |
| `/articulos/que-es-salario-base-cotizacion.html` | qué es el salario base de cotización | 25 | Title, ejemplo fijo de $524.66, factor, fuentes legales y distinción de SBC registrado | Aclarar cálculo y significado para una consulta con demanda estimada |
| `/articulos/cuando-pagan-finiquito.html` | cuanto tiempo tardan en dar el finiquito / plazo para pagar finiquito por renuncia voluntaria | 29 / 40 | Metadescripción y cronología que separan pago pendiente, reclamación y prescripción | Resolver la intención de plazo sin inventar días de tolerancia |
| `/articulos/como-saber-saldo-favor-sat.html` | como saber si tengo saldo a favor en el sat | 39 | Secuencia declaración→saldo→solicitud→estado; ejemplo, FAQ y servicios oficiales | Mejorar claridad para consultas de saldo y devolución |
| `/articulos/que-es-ptu.html` | cuando pagan el ptu | 1 | Enlace contextual a la guía de fechas; title, descripción, H1 e introducción protegidos | Conservar la respuesta posicionada y facilitar el siguiente paso |
| `/articulos/como-calcular-prima-vacacional.html` | calculadora prima vacacional | 3 | Aclaración mínima del porcentaje y enlace al formulario; snippet y H1 protegidos | Defender la guía y diferenciar explicación de herramienta |

Entre las oportunidades principales: utilidades (volumen estimado 3,600; KD 28), prima vacacional (1,300/KD 31 y 1,600/KD 26), honorarios (880/KD 20), SBC (1,300/KD 24) y saldo SAT (4,400/KD 24). Son estimaciones de demanda, no previsiones de clics. Saldo SAT tiene solo 39 impresiones en la muestra Google por URL, por lo que su potencial es más incierto que su volumen estimado sugiere.

La selección final se restringió a intenciones realmente atendidas. No se cuenta como optimizada la consulta de renuncia con 15 años de antigüedad, que requiere revisar específicamente prima de antigüedad; ni se presenta la guía de base salarial de aguinaldo como calculadora de ISR. La consulta de PTU exenta se refuerza en su artículo especializado. Esto explica que la selección final sea menor que la lista preliminar.

## Fragmentos, contenido y protección de páginas posicionadas

Cambian **7 titles y 8 metadescripciones** de las versiones efectivamente servidas. Se alinean también los metadatos sociales y las respuestas visibles. El registro [cambios-implementados.json](cambios-implementados.json) conserva los textos exactos anteriores/nuevos, H1, palabras, bytes y enlaces de cada página. El anexo de este informe reproduce los títulos y descripciones modificados.

Se mantuvieron los cinco snippets/H1 del Top 3 observado: días de aguinaldo, qué es PTU, salario neto, aguinaldo por meses y guía de prima vacacional. Una prueba compara estos elementos con la base limpia. Se conserva además el title ya específico de la calculadora de prima vacacional. No se añadió «2026» de forma generalizada: aparece solo cuando el contenido tiene una referencia temporal pertinente.

Se consolidaron ejemplos o secciones redundantes en lugar de acumular texto: la guía de prima en la calculadora pasa de 1,321 a 1,267 palabras del contenido principal, mientras que honorarios pasa de 289 a 882 al completar una intención insuficientemente explicada. Los ejemplos son propios y tienen supuestos visibles. El análisis independiente verificó $8,519.18 de finiquito, $524.66 de componente fijo, $1,759.65/$4,240.35 de exención/base bajo el supuesto existente de PTU, y $9,600 netos del recibo hipotético de honorarios. Verificar aritmética no certifica la aplicación fiscal a cualquier caso.

## Competidores y canibalización

Hay **96 consultas con más de una URL propia** en la muestra. Se registran como solapamiento, no como prueba de perjuicio. Para «calculadora prima vacacional», el artículo aparece en 3 y la herramienta en 11: se conservó el snippet del artículo, se precisó la utilidad de la herramienta y se conectaron de forma contextual. No se cambian canonicals, se fusionan URLs ni se redirigen páginas por ese solapamiento.

Los exports aportan dos coincidencias Top 3 útiles para las consultas seleccionadas: BBVA para «qué es el salario base de cotización» (1; observación 19 de septiembre) y «plazo para pagar finiquito por renuncia voluntaria» (2; 17 de octubre). Se consultó también su contenido público actual:

- [BBVA: SBC](https://www.bbva.mx/educacion-financiera/banca-digital/portabilidad-de-nomina/portabilidad-que-es-salario-base-de-cotizacion.html): definiciones, tipos de salario y factor. Nuestra mejora aporta un ejemplo verificable del componente fijo sin contar dos veces el salario durante vacaciones y delimita qué falta para obtener el registro real ante IMSS.
- [BBVA: finiquito](https://www.bbva.mx/educacion-financiera/banca-digital/portabilidad-de-nomina/que-es-finiquito.html): conceptos, fórmula, derechos y ejemplo. Nuestra respuesta separa el momento de pago de los distintos plazos para reclamar y explicita componentes y supuestos de la estimación.
- [BBVA: prima vacacional](https://www.bbva.mx/educacion-financiera/ahorro/como-calcular-la-prima-vacacional.html): herramienta y pasos de cálculo. Se contrastó la utilidad, sin afirmar que el export demuestra su Top 3 para nuestras consultas.

Consultar esas páginas no verifica su ranking actual. No hay evidencia suficiente de los tres competidores actuales de cada keyword seleccionada. No se copiaron textos ni se presentó una búsqueda web como SERP de Google México validada.

## Enlaces internos, GEO y confiabilidad

Se refuerzan relaciones de intención: asimilados→ISR/retenciones; honorarios→retenciones, bruto/neto y servicios; renuncia→calculadora de finiquito; base de aguinaldo→proporcional/fecha de pago; PTU→fecha/exención; SBC→factor/integrado; prima guía↔herramienta. No se eliminaron destinos internos existentes de las 12 páginas servidas. Los cambios exactos de anchor/destino se conservan en el JSON.

La auditoría de todo el sitio encontró 379 URLs indexables alcanzables, sin huérfanas y con profundidad máxima de dos pasos desde el inicio. Por ello no se añadieron directorios ni enlaces masivos para corregir problemas inexistentes.

Las respuestas directas, tablas, pasos, ejemplos y limitaciones están en HTML y se comprobaron sin JavaScript. Se mantienen BreadcrumbList y otros schemas válidos; las FAQ reflejan preguntas/respuestas visibles y la calculadora prima añade WebApplication para su funcionalidad real. No se inventaron autores, revisores profesionales, testimonios ni fechas de legislación. Las fechas editoriales corresponden a esta revisión (fecha civil México, 5 de noviembre); no cambian fechas históricas de leyes/publicación. Schema y claridad pueden ayudar a interpretar una página; no garantizan resultados enriquecidos ni citas en IA.

Fuentes oficiales utilizadas: [LFT](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf), [LSS](https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf), [LISR](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf), [SAT artículo 94](https://wwwmat.sat.gob.mx/articulo/91680/articulo-94), [SAT artículo 96](https://wwwmat.sat.gob.mx/articulo/36534/articulo-96), [SAT artículo 100](https://wwwmat.sat.gob.mx/articulo/18620/articulo-100), [SAT devoluciones](https://wwwmat.sat.gob.mx/derechos-contribuyentes/25159/obtener-tu-devolucion), [INEGI UMA](https://www.inegi.org.mx/temas/uma/) y [manual laboral/fiscal PTU 2026 SAT](https://www.sat.gob.mx/minisitio/RepartodeUtilidades/documentos/manuallaboralfiscal2026.pdf). Algunas páginas de PROFEDET/IMSS no permitieron lectura directa completa en este entorno; se conservaron las referencias verificables y no se afirma haber probado trámites autenticados. La interfaz SAT puede variar; la guía explica qué consultar sin recoger credenciales.

**Pendiente normativo concreto:** el manual SAT de PTU 2026 incluye una tabla basada en 15 salarios mínimos ($4,725.60) y después un párrafo de 15 UMA. La página ya utilizaba el supuesto de UMA; esta intervención conserva ese criterio y las fórmulas existentes. El ejemplo es coherente aritméticamente con ese supuesto, pero la discrepancia requiere resolver la interpretación aplicable antes de una futura actualización fiscal. No se presenta esta revisión SEO como dictamen fiscal.

## Técnica, accesibilidad, rendimiento y monetización

Se modifican 16 HTML físicos para 12 URLs: cuatro rutas tienen archivos de respaldo servidos por Vercel. Tres de esos respaldos ya diferían de su archivo canónico antes del trabajo; se aplicaron cambios equivalentes conservando el contenido útil de cada versión. No se sobrescribieron ciegamente. Las reescrituras, cabeceras, canonicals, robots y URLs permanecen intactos. Los dos sitemaps solo actualizan `lastmod` de las rutas revisadas, sin fechas globales ficticias.

Se corrigió el contraste preexistente de las etiquetas de ejemplos de prima vacacional en modo oscuro. El otro aviso inicial de axe, en un enlace de aguinaldo fuera de pantalla, no se confirmó: al mostrarlo, el contraste real sobre fondo blanco es 7.41:1 y axe no detecta infracciones. Se conserva la evidencia y la prueba vuelve a comprobar cada aviso de contraste con el elemento visible; no se cambió el color de ese enlace sin necesidad. Las tablas tienen acceso móvil sin producir desbordamiento de toda la página. No se añadieron solicitudes de terceros, dependencias, imágenes ni JavaScript de producción. Los recursos de `assets/`, hojas CSS compartidas y scripts de cálculo permanecen byte a byte iguales a la base; las correcciones visuales se limitan a elementos del HTML afectado. El crecimiento combinado de HTML servido de las 12 páginas es aproximadamente 25.5 KB sin comprimir: contenido y schema, no código de ejecución adicional.

Se preservan todos los scripts ejecutables de 408 HTML, **368 inclusiones de AdSense** y **11 tarjetas de afiliados**, con sus enlaces y parámetros. El inventario anterior identificó AdSense, no códigos atribuibles a Adsterra; no se inventó una sustitución ni se retiró ningún formato. No se volvió a validar la entrega real de anuncios/banners externos en las pruebas de este bloque, que bloquean terceros. El trabajo anterior de afiliados permanece incluido en la rama.

Estos cambios limitan costo adicional, pero no demuestran mejoras de LCP, INP o CLS de campo. No se dispone de datos CrUX actuales ni de carga publicitaria real reproducida. No se midieron rankings nuevos, indexación efectiva, ingresos ni conversiones.

## Pruebas reproducibles y resultados

| Comprobación | Resultado y alcance |
|---|---|
| `python scripts/check-phase6-release.py` | PASS: 408 HTML, 379 URLs indexables; sin enlaces internos rotos, huérfanas, títulos/descripciones duplicados ni inconsistencias de sitemap/canonical detectadas |
| `python scripts/check-phase4-topics.py` | PASS: 12 hubs, 359 páginas y 13 relaciones temáticas comprobadas |
| `node scripts/test-seo-advanced.cjs` | 48 layouts: 12 URLs a 320/390/1440 px en claro y 320 px en oscuro; sin desbordamiento, errores JS o FAQ schema sin contenido visible |
| Comparación con `eb66cbb` | Ocho calculadoras con los mismos resultados predeterminados; formularios y scripts de cálculo conservados |
| Casos numéricos en Chromium | Cuatro escenarios: prima $1,500/$3,500/$3,300 y SDI fijo $524.66 |
| Sin JavaScript | Contenido principal y encabezados de las 12 URLs disponibles |
| axe WCAG 2/2.1 A/AA | 24 casos sobre contenido principal, sin infracciones confirmadas tras corregir las etiquetas oscuras y verificar el aviso fuera de pantalla; ver resultado exacto en validación |
| Build público | PASS: 480 archivos; informes, exports y pruebas excluidos del sitio |
| HTTP local con reescrituras | PASS: 379 rutas de sitemaps responden 200; documentos internos y pruebas no se publican |
| `git diff --check` | Sin errores de espacios del diff |

La prueba nueva requiere Playwright, Chromium, `SEO_ADVANCED_BASELINE_DIR` (copia limpia de `eb66cbb`), `SEO_ADVANCED_QA_DIR` y, para axe, `AXE_PATH`. Ejemplo:

```sh
SEO_ADVANCED_BASELINE_DIR=/ruta/base-eb66cbb \
SEO_ADVANCED_QA_DIR=/ruta/resultados \
AXE_PATH=/ruta/axe.min.js node scripts/test-seo-advanced.cjs
```

El análisis de datos se reproduce con `python scripts/analyze-semrush-opportunities.py --attachments /ruta/adjuntos`. Los JSON/CSV no contienen los archivos originales completos y no reemplazan su conservación privada. No se usan cuentas de analítica en estas pruebas.

Los resultados y capturas están en [validacion](validacion/). La revisión automatizada y visual muestreada no equivale a certificación de accesibilidad ni reproduce todos los dispositivos, las cabeceras/caché de Vercel o servicios fiscales autenticados. Se conservaron capturas de escritorio y móvil claro/oscuro. Las pruebas antiguas con rutas específicas de Windows no se presentan como ejecutadas aquí.

## Seguimiento y siguientes oportunidades

Definir T0 con la fecha de una publicación futura autorizada; guardar el commit publicado. La rama y el PR todavía no establecen T0.

| Momento | Métricas y decisión |
|---|---|
| T0 + 7 días | Inspección de URLs/canonical elegido, rastreo, errores, móvil y anuncios; comprobar indexación antes de juzgar CTR |
| T0 + 28 días | Google y Bing por separado; ventanas comparables de clics, impresiones, CTR, posición y URLs con clics; segmentar por consulta/dispositivo/país; atender estacionalidad |
| T0 + 60 días | Cohortes 1–3/4–10/11–20/21–50, cobertura de long-tail, cambios guía/herramienta y CWV de campo; mantener o ajustar hipótesis según evidencia sostenida |

Para salario diario y pago quincenal, conservar la línea base del bloque anterior y vigilar también sus consultas principales: este trabajo no debe desplazar su intención. Para GEO, registrar una cita real con consulta, sistema, fecha y URL; una visita de crawler no es una cita confirmada. Para monetización, separar clics salientes, conversiones Admitad e ingresos de cada red.

Próximas oportunidades no implementadas en este bloque: propina sugerida (12; volumen 170/KD 32), «tabla ISR semanal» en la guía de ISR por período (22; 170/KD 22) e interés compuesto (20; 3,600/KD 56, mayor competencia). Las consultas históricas de años previos (54 pares) y salario mínimo requieren verificar vigencia/intención antes de modificar cifras. No conviene crear URLs duplicadas para perseguir cada variante.

Pendientes de acceso/datos: nueva exportación válida de Keyword Magic de salario diario, Bing por URL/consulta, Search Console actualizado, SERPs actuales por país/dispositivo, CWV de campo y resolución de la discrepancia fiscal PTU. Son límites documentados, no resultados ya comprobados.

## Archivos modificados y textos exactos

El [manifiesto de archivos](archivos-modificados.txt) enumera este bloque respecto de `eb66cbb`. Además de los 16 HTML, se modifican los dos sitemaps y `vercel.json`; se añaden el analizador SEMrush, la prueba de regresión SEO y esta carpeta de documentación/evidencias. El build excluye estos informes y CSV de la web pública.

### articulos/asimilados-a-salarios-isr.html

- Title anterior: Asimilados a salarios: qué son y cómo revisar el ISR
- Title nuevo: Asimilados a salarios: cálculo de ISR y uso de calculadora
- Descripción anterior: Entiende qué significa asimilados a salarios, qué revisar en la retención y por qué el tratamiento fiscal no determina por sí solo tus derechos laborales.
- Descripción nueva: Revisa cómo estimar el ISR de asimilados a salarios, qué datos usar en una calculadora y cuándo la tarifa ordinaria no basta para tu caso.

### articulos/como-saber-saldo-favor-sat.html

- Title anterior: Cómo saber si tengo saldo a favor en el SAT
- Title nuevo: Cómo saber si tengo saldo a favor en el SAT: consulta
- Descripción anterior: Aprende dónde revisar un posible saldo a favor, qué significa y qué documentos validar antes de solicitar devolución.
- Descripción nueva: Revisa tu declaración y consulta el saldo a favor en el SAT. Distingue el resultado calculado, la devolución solicitada y el depósito autorizado.

### articulos/cuando-pagan-finiquito.html

- Descripción anterior: Al renunciar, el finiquito corresponde al separarte del empleo. Revisa qué hacer si se retrasa, qué pedir por escrito y cuánto tiempo tienes para reclamar.
- Descripción nueva: Consulta cuándo deben pagarte el finiquito y cuánto tiempo tienes para reclamarlo. Distingue renuncia, despido y retrasos sin asumir plazos de gracia.

### articulos/cuando-se-pagan-utilidades.html

- Title anterior: Cuándo se pagan las utilidades 2026: fechas de PTU
- Title nuevo: Cuándo se pagan las utilidades 2026: fechas límite
- Descripción anterior: Consulta las fechas de pago de utilidades 2026 en México para empresas y personas físicas, el plazo legal y qué hacer si no recibes tu PTU.
- Descripción nueva: Fechas límite de PTU 2026: 30 de mayo para personas morales y 29 de junio para personas físicas. Revisa el ejercicio 2025 y cómo reclamar un pago pendiente.

### articulos/finiquito-renuncia-voluntaria.html

- Title anterior: Finiquito por renuncia: qué te pagan y cómo revisarlo
- Title nuevo: Finiquito por renuncia: cuánto te toca y cómo calcularlo
- Descripción anterior: Si renuncias, revisa sueldo y prestaciones pendientes. Consulta un ejemplo de finiquito, pagos previos y diferencias frente a la indemnización.
- Descripción nueva: Si renuncias, suma salario pendiente, aguinaldo, vacaciones y prima vacacional. Revisa un ejemplo desglosado y qué se diferencia de la liquidación.

### articulos/ptu-exenta-isr.html

- Title anterior: PTU exenta de ISR: parte gravada y recibo de utilidades
- Title nuevo: PTU exenta de ISR: qué grava y cómo revisar tu recibo
- Descripción anterior: Aprende a separar PTU exenta y gravada, distinguir el impuesto del límite laboral y revisar el desglose de tu recibo antes de comparar el depósito.
- Descripción nueva: ¿La PTU grava para ISR? Separa parte exenta, gravada y retención; comprueba el neto del recibo y evita confundir la exención con el límite laboral.

### articulos/que-es-salario-base-cotizacion.html

- Title anterior: Qué es el SBC en nómina: salario base de cotización IMSS
- Title nuevo: Salario base de cotización (SBC): qué es y cómo calcularlo
- Descripción anterior: Conoce qué significa SBC en nómina, qué integra el salario base de cotización del IMSS, cómo se calcula y qué diferencia existe entre SBC y SDI.
- Descripción nueva: Entiende qué es el salario base de cotización del IMSS. Ejemplo de integración fija, diferencias con SDI y sueldo neto, y cómo revisar tu registro.

### articulos/que-son-honorarios.html

- Title anterior: Qué son los honorarios y cómo se facturan en México
- Title nuevo: Qué son los honorarios: significado, ejemplos y pago neto
- Descripción anterior: Entiende qué son los honorarios profesionales, cómo se documentan y qué impuestos o retenciones pueden aparecer en el CFDI.
- Descripción nueva: Conoce qué son los honorarios profesionales, ejemplos de servicios y diferencias con sueldo y asimilados. Aprende a revisar factura, retenciones y pago neto.
