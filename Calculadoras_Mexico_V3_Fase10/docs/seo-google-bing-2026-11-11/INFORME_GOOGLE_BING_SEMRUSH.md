# Optimización SEO con Google, Bing y SEMrush — 11 de noviembre de 2026

Implementación terminada sobre la entrega anterior (`7e7f022`), sin despliegue ni subida remota. Esta etapa mejora **nueve destinos canónicos**: cinco calculadoras con funciones/validaciones nuevas y cuatro artículos con conexiones de escenarios, precisión o proporcionales. Son **11 HTML físicos**, por los dos fallbacks que sirven las guías de finiquito. Además incorpora una redirección permanente para una URL histórica ausente. Se analizaron las cinco exportaciones nuevas completas y se conservan como referencia con SHA256.

## Datos y alcance real

- Google: siete pestañas, **187 URLs**, 1,000 consultas, 131 países, tres dispositivos y 94 días. Periodo indicado: **9 agosto–10 noviembre de 2026**, búsqueda Web basada en texto. La pestaña de aparición en búsquedas está vacía.
- Bing: **98 URLs**, **746 consultas** y 90 días en el informe general. El diario cubre 11 agosto–8 noviembre; **los CSV por página y consulta no incluyen fechas ni filtros**. No se les atribuye automáticamente el intervalo del diario.
- SEMrush: **1,369 registros**, **1,104 keywords distintas** y 126 URLs reportadas. Se recalcularon las 126 filas del resumen sin diferencias. Sus volúmenes, KD y tráfico son estimaciones históricas; no son resultados de Search Console.
- Unión de Google y Bing: **228 URLs con impresiones**, 57 presentes en ambos. Todas las URLs SEMrush utilizables ya aparecen en esa unión. La matriz tiene **380 filas**: 379 rutas canónicas indexables locales y la ruta histórica ausente.
- Prioridad local: **2 críticas, 8 altas, 62 medias y 308 bajas**. Crítica significa brecha concreta que se resuelve en esta entrega, no una predicción cuantificada de tráfico. Las mejoras recientes protegidas quedan en seguimiento; prioridad baja no significa falta de valor comercial.

Las consultas agregadas se analizan por separado: **1,746 filas entre ambos motores**, sin emparejarlas con páginas por posición de fila ni por parecido textual. `consultas-ambos-motores-sin-url.csv` conserva consulta, motor y una agrupación léxica orientativa. La relación keyword–URL de SEMrush tampoco demuestra cuál consulta generó los clics de Google o Bing.

Los totales también se mantienen separados. Google informa 446 clics/83,286 impresiones en el gráfico y 447/84,927 en páginas; las 1,000 consultas exportadas reúnen 13/10,949. Bing reúne 562/14,270 en páginas, 299/1,559 en consultas y 686/22,411 en el diario. Son ámbitos distintos; no se suman ni se fuerzan a coincidir. En Google, móvil aporta 321 clics y 62,036 impresiones; México, 433 y 76,722, sin atribuir esos segmentos a cada URL.

El Excel Google anterior tenía el mismo intervalo agregado: las diferencias entre archivos pueden reflejar actualización/completado del último día y no constituyen un experimento antes/después. En SEMrush, cinco asignaciones a home de la página fuente 14 coinciden con marcadores no confirmados de la investigación anterior; se conservan y se excluyen de la priorización por URL. El nuevo Excel no trae los 14 textos originales para recotejar cada fila. Las fechas relativas se conservan literalmente y `FS` no se trata como variación de ranking.

## Implementación por URL

NA significa ausencia en esa exportación, **no cero**. Los datos Bing por URL tienen periodo no declarado; esta tabla no compara CTR ni posiciones entre ventanas equivalentes. KW cuenta términos SEMrush distintos por URL.

| URL | G imp. | G clics | B imp. | B clics | KW SEMrush | Mejora aplicada | Prueba |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /calculadoras/iva.html | NA | NA | 156 | 0 | 0 | Módulo propio: etiquetas según modo, validación, tres ejemplos ejecutables, desglose exacto a centavos. Se elimina una tabla duplicada y un bloque de propina ajeno al objetivo. | 60 escenarios de IVA, casos inválidos, redondeo, carga por URL, etiqueta y restablecimiento. |
| /articulos/como-calcular-iva.html | NA | NA | 2,083 | 32 | 0 | Tres escenarios enlazados: $1,000 más IVA, desglose de $1,160 y redondeo de $999.99. Cuatro respuestas JSON-LD se alinean con el texto visible. Title/H1 se conservan. | Enlaces ejecutados con estado anterior adverso; FAQ visible y fuentes preservadas. |
| /calculadoras/credito-automotriz.html | 254 | 1 | 3 | 0 | 2 | Tabla mensual de capital, interés y saldo; comparación de 36/48/60 meses; último pago ajustado; totales con enganche separado; validaciones y escenario con enganche 100%. | 240 combinaciones de precio, tasa, enganche y plazo; conciliación del capital, intereses y saldo; límites, ejemplos y eventos. |
| /articulos/simulador-credito-automotriz.html | 565 | 1 | NA | NA | 14 | Enlaces a ambos escenarios completos y explicación de la diferencia entre fórmula continua y calendario redondeado. Mantiene exclusiones y fuentes. | Enlaces reales reproducidos; misma tasa y enganche; sin prometer CAT ni aprobación. |
| /calculadoras/costo-unidad.html | 162 | 2 | NA | NA | 5 | Modo variable por lote o por unidad; componentes fijos/variables; dos ejemplos equivalentes y contraste de $28 frente a $40; traslado explícito al centavo superior. | Equivalencia de modos; unidades enteras; límites; costo cero; fracciones de centavo; cadena costo→precio→margen. |
| /calculadoras/precio-venta.html | 438 | 0 | NA | NA | 11 | Costo base y gastos por unidad, utilidad y margen sobre venta; tres escenarios; enlace al verificador de margen. Conserva la intención de aumento sobre costo. | Precio $150 y margen 20% para costo $100+$20 con aumento 25%; redondeo y estado persistido. |
| /calculadoras/regla-tres.html | 526 | 3 | NA | NA | 3 | Correspondencias A→B y C→X, producto, división y factor; seis decimales/notación científica; ceros válidos en B/C; conservación de ejemplos e intención directa. | Proporciones, porcentajes, signo, ceros, vacíos, subdesbordamiento/desbordamiento y ejemplos reales. |
| /articulos/finiquito-renuncia-voluntaria.html | 222 | 0 | 4 | 0 | 10 | Carga salario, días pendientes, días del año, vacaciones, aguinaldo y prima en la calculadora existente. Se conserva todo el contenido jurídico previo. | Ejemplo bruto $8,519.18 en artículo y fallback; carga anula valores anteriores del dispositivo. |
| /articulos/que-incluye-finiquito.html | 264 | 0 | NA | NA | 1 | Sección que distingue días del año, periodo vacacional y pagos pendientes; ejemplos de aguinaldo para 90/180 días. Enlaces a cálculo y renuncia, con LFT y PROFEDET. | Decimal independiente: $1,479.45/$2,958.90; no se presentan como finiquito completo; artículo y fallback iguales en la mejora. |
| /articulos/finiquito-por-meses-trabajados.html | NA | NA | 37 | 2 | 0 | Redirección permanente de un salto a /articulos/que-incluye-finiquito.html. No se crea otra página similar. | Configuración comparada íntegramente: solo se añade esta redirección; destino indexable local y en sitemap. HTTP de producción pendiente. |


La tabla completa con **problema, evidencia, prioridad, cambio, impacto esperado y validación** está en `oportunidades-implementadas.csv`. La matriz de todas las rutas está en `matriz-google-bing-semrush.csv`. La clasificación general combina impresiones, posición, intención y riesgo de alterar mejoras recientes; las decisiones de implementación añaden la brecha individual verificada. No hay una puntuación de tráfico inventada.

## Keywords y decisiones de intención

Se priorizan editorialmente «calculadora de IVA», «cómo calcular IVA 16%», «costo por unidad», «precio de venta por aumento», «regla de tres simple directa», «calculadora de crédito automotriz» y «finiquito por renuncia». Que una keyword se elija editorialmente no implica que Google o Bing la hayan asociado a esa URL.

Evidencia histórica útil de SEMrush: «convertidor de regla de 3», posición 12, volumen 40, KD 29; «calculadora regla de tres», posición 34, volumen 320, KD 30; «si renuncio cuanto me dan de finiquito», posición 6, volumen 320, KD 19; «calcular una renuncia voluntaria», posición 14, volumen 40, KD 13; «costo total unitario formula», posición 51, volumen 110, KD 27; «calculadora de financiamiento de auto méxico», posición 58 en herramienta y 61 en guía, volumen 170, KD 40. Son observaciones del archivo, no rankings verificados hoy.

Las 1,369 filas se distribuyen en 6 posiciones 1–3, 9 entre 4–10, 41 entre 11–20, 53 entre 21–30, 137 entre 31–50 y 1,123 entre 51–100. `semrush-clasificada.csv` conserva todas las filas y su tratamiento. Se apartan de la optimización vigente las consultas con otros años y las de programas/instituciones no simulados: «simulador de credito para auto issste» o «cotizador finanmadrid». «Calculo de valor» no justifica alterar la intención de precio de venta; una consulta de sumar IVA no se utiliza para reorientar una calculadora de quitarlo.

Las consultas Bing sobre dividir entre 1.16, IVA incluido y redondeo respaldan investigar ese grupo temático, pero siguen sin URL atribuida. No se añaden tasas especiales automáticamente ni retenciones fiscales nuevas. La calculadora de regla de tres conserva la proporción directa; no se añade una modalidad inversa por imitación de competidores.

## Investigación competitiva y fuentes

Se consultaron resultados públicos y las páginas de los proveedores el 11 de noviembre. Esto permite comparar contenido y controles descritos; **no es una captura certificada del top 10 de Google México**, ni una prueba móvil de esos sitios.

| Página examinada | Observación útil | Decisión propia |
| --- | --- | --- |
| [Calcu.mx: crédito automotriz](https://calcu.mx/calculadoras/credito-automotriz) | Comparación de plazos y distinción de costos. | Añadir amortización conciliada y comparación; no reproducir estimaciones de CAT ni recomendaciones de endeudamiento. |
| [Reliable Calculator: regla de tres](https://reliablecalculator.com/es/regla-de-tres) | Correspondencias y operación por pasos. | Explicitar A/B/C y pasos; conservar la intención directa existente. |
| [Lynka: precio de venta](https://www.lynka.io/herramientas/calculadora-precio-de-venta) | Diferencia entre gastos por unidad, margen y aumento. | Añadir gastos y margen efectivo; enlazar la herramienta de margen ya existente. |
| [EmprendeHoy: costo por unidad](https://emprendehoy.digital/herramientas/costo-por-unidad/) | Importancia del alcance del lote y de las unidades usadas. | Explicitar costos por lote/unidad; no incorporar merma ni contabilidad de inventarios sin necesidad demostrada. |
| [Kotiza: IVA](https://kotiza.mx/calculadora-iva) | Distinción entre sumar impuesto y separar un total. | Etiquetas dependientes del modo, ejemplos transferibles y conciliación a centavos; no copiar afirmaciones fiscales sobre tasas especiales. |

Fuentes primarias utilizadas: [SAT: Ley del IVA](https://wwwmatnp.sat.gob.mx/ordenamiento/37585/ley-del-impuesto-al-valor-agregado), [CONDUSEF: crédito automotriz](https://www.condusef.gob.mx/?idc=864&p=contenido), [PROFEDET: renuncia](https://www.profedet.gob.mx/micrositio/index.php/renuncia-voluntaria) y [Ley Federal del Trabajo, artículos 79, 80 y 87](https://www.ordenjuridico.gob.mx/Documentos/Federal/html/wo125151.html). Se mantienen las referencias SAT/DOF/IMSS de las etapas previas. Las fórmulas aritméticas se prueban por separado; no se incorporan nuevas tablas fiscales ni se recalcula ISR sobre bonos.

## Arquitectura, rastreo y canibalización

La auditoría compilada revisa **408 HTML físicos**, de los que 407 tienen cuerpo de página; el restante es verificación. Hay **379 rutas canónicas indexables localmente**, todas en sitemap y alcanzables desde la home a un máximo de dos clics: 1 a profundidad cero, 65 a uno y 313 a dos. Cero huérfanas, enlaces rotos, cadenas internas a redirecciones y duplicados de title/metadescripción detectados por el auditor. Estos números no certifican páginas indexadas en Google/Bing.

La única ruta adicional ausente se descubrió gracias al nuevo CSV Bing. La redirección se configura hacia una guía que cubre la composición y los proporcionales del finiquito; no cambia el canonical de ninguna página existente. No se pudo acreditar el estado HTTP de esa URL en producción: el acceso web devolvió «no accesible». La corrección se verifica en la configuración local y deberá probarse tras publicar. Las pruebas antiguas de preservación se mantienen, con una excepción estricta que permite solo esa redirección y exige conservar íntegros build, despliegue, encabezados y rewrites.

Se añadieron o cambiaron **13 destinos de enlaces contextuales** en los HTML canónicos, además de los enlaces dinámicos costo→precio→margen. Los escenarios trasladan todos sus campos para que un dato guardado previamente no cambie el ejemplo. Los nueve destinos actualizan `lastmod` al 11 de noviembre; ninguna otra fecha de sitemap se modifica.

Se identificaron **115 keywords históricas con varias URLs** (`keywords-varias-urls.csv`). No hay serie por consulta/URL para demostrar alternancia, caída causada por otra página o canibalización real. Se conservan las diferencias: artículo de sueldo bruto/neto frente a herramienta neta; explicación de prima vacacional frente a cálculo; guía de crédito frente a simulación; costo por unidad frente a precio y margen. No se fusionan ni eliminan páginas por similitud temática. La redirección de finiquito resuelve una ruta ausente, no una supuesta canibalización.

No se encontró implementación IndexNow ni acceso conectado a Bing Webmaster Tools/Search Console. No se agrega un script redundante, se inventa una clave ni se declara que se enviaron URLs a indexar. Robots y canonical se verificaron localmente. No hay evidencia que justifique cambios nuevos en la home o en los directorios temáticos existentes.

## Metadatos, frontend, monetización y rendimiento

Se conservan los **titles, H1 y canonicals de los nueve destinos**. Se ajustan cinco metadescripciones de calculadoras para describir la utilidad añadida, sincronizando las descripciones sociales/estructuradas existentes. `metadatos-antes-despues.csv` registra el texto exacto. Se verifican 35 pares de preguntas y respuestas visibles en los HTML modificados. Las cuatro respuestas de la guía IVA se alinearon con su redacción visible; no se promete un resultado enriquecido.

Los CSS y las 15 imágenes bajo `assets/img` quedan idénticos a la base; las 11 páginas HTML de la etapa GSC previa también. Se conserva la identidad azul, logo verde, navegación y componentes. Las tablas usan contenedores de desplazamiento existentes, encabezados con `scope`, captions y regiones accesibles por teclado. Las etiquetas identifican unidades y los resultados previos se ocultan al cambiar entradas. Estas verificaciones son estáticas y de eventos; el diseño renderizado aún requiere navegador.

El test de monetización confirma en **407 páginas con body** una instancia de cada bloque Adsterra y los afiliados Sol Crédito MX/AliExpress, con transformación idempotente. No se hicieron clics publicitarios. La entrega de anuncios reales y las conversiones no se verificaron.

| URL | JS antes (bytes) | JS después (bytes) | Reducción JS (bytes) | HTML antes (bytes) | HTML después (bytes) |
| --- | --- | --- | --- | --- | --- |
| /calculadoras/iva.html | 95284 | 67043 | 28241 | 25980 | 25820 |
| /calculadoras/credito-automotriz.html | 95284 | 68953 | 26331 | 22639 | 26168 |
| /calculadoras/regla-tres.html | 95284 | 66454 | 28830 | 21123 | 21360 |
| /calculadoras/costo-unidad.html | 95284 | 69922 | 25362 | 20981 | 23526 |
| /calculadoras/precio-venta.html | 95284 | 69922 | 25362 | 26000 | 27953 |


Son bytes de recursos locales referenciados, antes de compresión y sin medir red o terceros. Se sustituye el módulo genérico en cinco páginas por módulos específicos; el genérico compartido sigue intacto para las demás. **No se han medido mejoras de LCP, INP, CLS ni Core Web Vitals**. Chromium quedó bloqueado en este entorno por la creación de su socket; el acceso alternativo a archivos locales tampoco estaba permitido. No se intentó eludir esa restricción. La prueba de navegador preparada ahora incluye las páginas nuevas y sus escenarios, pero sus anuncios son simulados y no sustituye la revisión publicitaria real.

## Validación y segunda pasada

- Build: **499 archivos públicos**, sin documentos, exportaciones ni scripts de auditoría publicados.
- Nuevas pruebas: **379 comprobaciones** de módulos reales, aritmética, límites, eventos, ejemplos, enlaces, estado y reset mediante adaptador mínimo. No son pruebas de navegador.
- Regresión: pasan ISR (132 celdas y 66 fronteras), bono (12 casos válidos y 26 inválidos), 13 ejemplos anteriores, pruebas SEMrush y **107 comprobaciones** de la etapa GSC anterior.
- Preservación: cinco páginas originales, módulos compartidos, frontend y ocho URLs de la etapa previa conservados. Configuración idéntica salvo la redirección descrita.
- Auditoría global y comprobaciones de fases 4/6 aprobadas; sin bloques de contenido idénticos adicionales detectados por el detector acotado de secciones sin controles/anuncios.
- Segunda pasada: se sincronizaron cuatro respuestas FAQ, se actualizaron solo nueve `lastmod`, se añadió alternativa sin JavaScript y se verificó que el informe y las pruebas funcionen sin depender de un historial Git dentro del ZIP.

Comandos reproducibles desde la carpeta del proyecto:

```bash
node scripts/build-public.cjs
node scripts/test-seo-google-bing.cjs
node scripts/test-seo-integral.cjs
node scripts/test-seo-semrush.cjs
node scripts/test-seo-gsc.cjs
python3 scripts/audit-seo-integral.py docs/seo-google-bing-2026-11-11/auditoria-despues.json
python3 scripts/check-seo-google-bing.py
python3 scripts/check-seo-gsc.py
python3 scripts/check-seo-semrush.py
python3 scripts/check-phase6-release.py
python3 scripts/check-phase4-topics.py
```

Python necesita `lxml`; para regenerar la investigación, `openpyxl`. El analizador acepta la carpeta `docs/seo-google-bing-2026-11-11/fuentes-originales/`. La prueba `test-seo-integral-browser.cjs` queda preparada para un entorno permitido; no se marca como aprobada aquí. `archivos-de-produccion.csv` y `cambios-implementados.json` registran archivos y hashes. Los cuatro nuevos módulos son `costos-precios.js`, `credito-automotriz.js`, `iva.js` y `regla-tres.js`.

## Seguimiento a 14, 28 y 56 días

La fecha cero será la publicación real, aún no realizada. No se programó una automatización ni se enviaron datos a los buscadores.

| Momento | Comprobación | Comparación |
| --- | --- | --- |
| Día 14 | Respuesta de la redirección, canonical, sitemap, rastreo, errores y primeras consultas por URL; anuncios y móvil. | 14 días completos frente a los 14 anteriores a publicar, por motor y con los mismos filtros. Es una señal temprana. |
| Día 28 | Clics, impresiones, CTR, posición y consultas de cada URL modificada; segmentos país/dispositivo. | Ventanas de 28 días equivalentes; calcular CTR como clics/impresiones. Separar cambios de posición de presentación. |
| Día 56 | Persistencia de consultas relevantes, nuevas consultas y posibles alternancias entre artículo/herramienta. | Dos ventanas consecutivas de 28 días y referencia de 56 días previa si existe; controlar estacionalidad de aguinaldo y demanda. |

Como referencia histórica de propiedad, las ventanas alineadas **14 septiembre–11 octubre** y **12 octubre–8 noviembre** registran Google 118→263 clics y 17,054→56,509 impresiones; Bing 173→495 clics y 5,982→15,438 impresiones. Son tendencias anteriores a esta entrega, **no resultados de estos cambios**, y no identifican cuáles URLs crecieron. No se suman posiciones medias ni se mezcla el CTR de motores diferentes.

Pendientes concretos: publicación, validación visual móvil/escritorio y teclado en navegador, HTTP real de la redirección, publicidad real, medición de laboratorio/campo y exportaciones por consulta–URL con fechas verificadas. La matriz mantiene 62 oportunidades medias y los motivos para conservar páginas ya completas; por ejemplo, SDI, quincenas a meses, PTU exenta y conservación de derechos IMSS. El objetivo esperado es aumentar utilidad, descubrimiento y relevancia; todavía no existe medición posterior que demuestre aumento de clics o posiciones.

## Conservación de las prioridades originales

**A. ISR semanal, quincenal y mensual:** no se modifica en esta etapa. Se conservan las tablas oficiales, ejemplos, navegación, fuentes SAT/DOF, enlaces y trabajo competitivo documentado en `docs/seo-integral-2026-11-09/`; las 132 celdas y 66 casos de frontera vuelven a pasar.

**B. Calculadora de bono:** no se modifica en esta etapa. Se mantienen porcentaje/importe fijo, base salarial u otra base, distinción bruto/neto y filtros de intención laboral; pasan 12 casos válidos y 26 inválidos.

**C. SEO global:** esta etapa complementa las anteriores con nueve destinos, una redirección, cinco metadescripciones, 13 destinos contextuales y cuatro módulos verificados. Las auditorías y entregas anteriores se conservan como historial, con sus cifras referidas a cada etapa.

## Cierre y reconstrucción de la entrega

Cierre del paquete: 16 de noviembre de 2026. La extracción aislada del ZIP, sin historial Git, aprobó los 13 comandos de build, análisis y pruebas. Los 499 archivos del build reconstruido coinciden byte por byte con los validados en la fuente. Las exportaciones mantienen su fecha histórica; no se incorporaron métricas posteriores.
