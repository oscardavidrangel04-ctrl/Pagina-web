# Aguinaldo: auditoría y mejoras implementadas

Fecha de revisión: 16 de octubre de 2026, México. URL: /calculadoras/aguinaldo.html.

## Entrega y alcance

Se trabajó exclusivamente en la copia situada en la subcarpeta proyecto. La página original del directorio principal no se modificó. No se publicó ni desplegó nada. El ZIP de cambios conserva las rutas relativas; antes de aplicarlo a otra versión, comparar los archivos. El sitemap incluido parte de esta copia: no sobrescribir cambios posteriores sin fusionarlos.

No se crearon nuevas URLs ni se cambiaron H1, canonical o intención principal. La keyword objetivo sigue siendo «calculadora de aguinaldo». El cambio de snippet es una hipótesis de CTR, no una garantía de mejora; Google puede reescribirlo.

## Evidencia y límites

Se analizaron los cuatro JSON del scraper y cinco exportaciones Semrush, incluidas las dos tablas idénticas de Fiscoclic. La matriz conserva métricas y procedencia por keyword. Las posiciones son las de los archivos aportados, no una comprobación de la SERP actual. La extracción es del 17 de octubre UTC (16 de octubre local); las fechas de actualización de cada keyword varían.

Inventario normalizado sin distinción de acentos: propia 142 filas / 133 keywords; Fiscoclic 1,117 / 927; Novacard 517 / 385; Nominax 1,053 / 1,017. Unión: 1,113 keywords. No se suman volúmenes de variantes ni se equipara tráfico estimado a clics GSC. La clasificación de la matriz es heurística: requiere revisar la intención antes de crear páginas.

## Comparación competitiva

| Aspecto | Fiscoclic | Nominax | Novacard | Nuestra página antes del cambio |
|---|---|---|---|---|
| Orientación | Herramienta y desglose fiscal | Herramienta con orientación de nómina empresarial | Guía explicativa con herramienta | Calculadora, escenarios y guía extensa |
| Title | Aguinaldo en México 2026 y marca | Aguinaldo y marca, sin año | Año, fórmula, ISR y ejemplos | Año, monto, ISR y proporcional |
| Meta | Gratuidad y desglose de ISR | Rapidez y nómina de empleados | Completo/proporcional y retención | Sueldo/días, estimador adicional y sin registro |
| H1 | Aguinaldo con ISR 2026 | Aguinaldo 2026 | Aguinaldo en México 2026: cómo calcularlo | Aguinaldo 2026 en México |
| H2 detectados | 2: cálculo y resultado | 2: explicación y uso | 7: derecho, fórmula, proporcional, ejemplos, ISR, reclamación y uso del dinero | 12: cálculo, escenarios, ISR, uso, fórmulas, tablas y ayuda |
| H3 | Base, exento/gravado e ISR | Otras herramientas de nómina | Herramienta y preguntas concretas | Desglose, ejemplos y cuestiones específicas |
| Palabras del scraper | 408 | 404 | 2,067 | 3,607 |
| Tablas detectadas | 0 | 0 | 1 | 2 |
| Preguntas detectadas | 0 | 0 | 6 | 12; 10 son FAQ editoriales, el resto son otros desplegables |
| Schema detectado | Ninguno | WebPage, Breadcrumb, Organization, entre otros | BlogPosting, FAQPage, Breadcrumb | WebPage, WebApplication, Breadcrumb y FAQPage |
| Canonical | Misma URL | Destino diferente: zona-nominax/calculadora-de-sueldo-neto/ | Misma URL | Misma URL |
| HTTP del scraper | 200 | 200 | 200 | 200 |

Los textos completos de metadatos y encabezados, tablas y schema están en EVIDENCIA_COMPETIDORES.json. Cero detectado no prueba ausencia absoluta: un componente interactivo puede no quedar capturado.

### Qué sí demuestra la comparación

- Fiscoclic presenta salario mensual, fecha de ingreso, días de prestación y campos de bruto, exento, gravado, ISR y neto. Declara usar el artículo 96. No se ejecutaron casos numéricos en su web: estos son controles/textos observados, no una certificación de su motor. Su contenido breve y posicionamiento aportado no permiten atribuir éxito a una cantidad de palabras.
- Nominax enlaza herramientas de sueldo neto, IMSS, presupuesto y finiquito. El scraper usó un contenedor alternativo, por lo que hay mayor incertidumbre sobre el contenido dinámico. Su canonical inesperado también aparece en schema; puede responder a consolidación, pero no se conoce el canonical elegido por Google. No se imitó.
- Novacard organiza bien la explicación y sus ejemplos. Su tabla ilustra sueldo, salario diario, días y bruto. Su explicación genérica de salario variable no sustituye la distinción oficial entre promedio de 30 días y comisionistas/agentes. Se observa además dateModified anterior a datePublished en su schema: no se copiaron estas fechas ni su contenido.
- Nuestra página ya tiene más extensión y funciones: periodos salariales, fechas, días, comparación de prestaciones, guardar, compartir, imprimir y estimador fiscal. La necesidad no era añadir otro artículo completo, sino clarificar la utilidad y corregir el estado del estimador.

### Enlazado e intención

Se conservan las rutas a la calculadora proporcional, guía de ISR, renuncia, finiquito y antigüedad. El resumen proporcional permanece en la calculadora principal, pero las explicaciones extensas siguen en sus URLs dedicadas. No se añadieron páginas para cada variación de palabra ni para años anteriores, pensiones IMSS o consultas de otros países.

## Prioridades y decisiones

| Prioridad | Evidencia | Acción |
|---|---|---|
| P1 | «calculadora de isr aguinaldo»: posición 9, volumen 40, KD 4 en export propio | Ejemplo original bruto → exento/gravado → ISR → neto con supuestos; corrección del ingreso fiscal |
| P1 | «calculadora de aguinaldo»: volumen 22,200; Fisco 1, Nominax 2, Nova 3 en export | Mantener intención de herramienta; title directo con proporcional, ISR y neto |
| P1 | Variantes de cálculo general y cuánto corresponde | Descripción concreta: fechas y periodos salariales, gratuidad y sin registro |
| P2 | Variantes proporcionales y de seis meses; propia posición 25 en «cuanto te toca de aguinaldo por 6 meses» | Infografía y advertencia de días reales; mantener enlaces a herramientas/guías específicas |
| P2 | Cobertura ya extensa | Sustituir repetición de regla general por ejemplo visual; no perseguir longitud |
| Excluir | Años anteriores, otros países, pensiones y consultas ajenas | No introducir términos fuera de intención |

La matriz completa está en MATRIZ_KEYWORDS.json y la selección prioritaria en MATRIZ_KEYWORDS.md. Ausente del export propio no significa que la página nunca aparezca en Google.

## Cambios realizados

1. Title: «Calculadora de aguinaldo 2026: proporcional, ISR y neto». Sin prometer un resultado fiscal exacto.
2. Meta description orientada a la tarea; sincronizada con Open Graph, Twitter y descripciones de schema.
3. Ejemplo fiscal de $7,500 brutos y $15,000 de ingreso ordinario gravable: ISR estimado $713.34 y neto $6,786.66. Supuestos y exclusiones visibles.
4. Infografía SVG original, sin dependencias externas, con dimensiones reservadas, carga diferida, alt y explicación textual. No se reemplaza el formulario.
5. Corrección: el ingreso mensual autocompletado ahora sigue el sueldo al recalcular. Un importe editado manualmente se conserva; al restaurar un escenario se respeta su ingreso guardado.
6. Validación de días enteros de 1 a 365, fechas de calendario reales e ingresos fiscales finitos y positivos.
7. Fechas de revisión coherentes y lastmod de esta URL actualizado; recursos versionados para invalidar caché.
8. Test de regresión extendido para autofill fiscal, respeto de edición manual, días fraccionarios y carga de infografía.

Archivos de sitio modificados: calculadoras/aguinaldo.html; assets/js/aguinaldo-premium.js; assets/css/aguinaldo-focus.css; assets/img/aguinaldo-proporcional-pasos.svg (nuevo); sitemap.xml. También se entrega scripts/test-aguinaldo-focus.cjs actualizado.

## Revisión legal y matemática

Se contrastaron el mínimo general y proporcionalidad con [PROFEDET](https://www.profedet.gob.mx/micrositio/index.php/aguinaldo). La regla general sigue siendo 15 días y pago antes del 20 de diciembre; no se elevó arbitrariamente a 30 días.

La [orientación oficial sobre bases salariales](https://profedet.gob.mx/prensa/preguntas_aguinaldo.html) distingue el promedio de 30 días de los vendedores/agentes, para quienes indica promedio anual o del tiempo trabajado. Se conserva la advertencia del formulario: el modo de 30 días no debe aplicarse automáticamente a toda comisión. Esta fuente antigua se usa para la base laboral, no para su referencia fiscal histórica.

La [UMA publicada por INEGI](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf) es $117.31 diarios desde febrero de 2026; 30 UMA diarias equivalen a $3,519.30. No se confunde con la UMA mensual.

Se revisó la tabla mensual del [Anexo 8 RMF 2026, apartado B.V](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf) y el procedimiento opcional del [artículo 174](https://wwwmatnp.sat.gob.mx/articulo/46306/articulo-174). El motor usa el equivalente mensual de la parte gravada y diferencia de ISR para obtener la tasa aplicable, sin redondear resultados intermedios.

Límites: no compara automáticamente con artículo 96, no calcula subsidio ni ajuste anual, no conoce exenciones consumidas con otro pago y usa UMA vigente desde febrero. No es adecuado para liquidar impuestos de enero ni regímenes especiales sin revisión. Se explicitan estos supuestos; no se presenta como cálculo definitivo de nómina.

## Validaciones

Pruebas ejecutadas en Edge headless sobre copia local, con terceros bloqueados:

- $15,000 mensuales, 15 días, año completo: $7,500.
- 180 días: $3,698.63; julio 1–diciembre 31: 184 días, $3,780.82.
- Equivalencia mensual, quincenal, semanal y diario.
- Reinicio de ejemplo tras salario variable y cálculo por días; interacción de ejemplo con teclado.
- Fechas invertidas, fuera del año y recorte al año.
- Exención $3,519.30 e ISR $713.34 en caso conocido.
- Ingreso fiscal automático actualizado y manual preservado.
- Días fraccionarios rechazados.
- Un H1, canonical correcto, JSON-LD parseable, 10 preguntas coherentes con el contenido, sin IDs duplicados ni anclas internas rotas.
- Vista 1440px, móvil 390px y 320px; sin desbordamiento horizontal. Capturas en proyecto/outputs. Inspección visual de portada e infografía móvil.
- Sin excepciones JavaScript de página durante la prueba. No equivale a auditoría de anuncios de terceros en producción.

El primer intento de navegador falló por el entorno aislado; la ejecución autorizada posterior y la prueba ampliada terminaron correctamente. No se publican cifras de Core Web Vitals: las pruebas locales no miden LCP, CLS o INP de usuarios reales.

## Schema e indexabilidad

Se mantiene index,follow y canonical autorreferente; no se detecta una razón para cambiar slug. JSON-LD de aplicación describe funciones reales y gratuidad, sin valoraciones inventadas. FAQPage se conserva coherente como descripción semántica, no como promesa de rich results: [Google retiró la función FAQ en mayo de 2026](https://developers.google.com/search/updates).

HTTP 200 histórico y meta index no garantizan indexación. Quedan pendientes la inspección de URL de GSC, canonical seleccionado por Google, cabeceras reales y rastreo tras publicación. No se cambiaron robots.txt ni reglas globales de Vercel sin evidencia de un problema.

## Medición pendiente para CTR

Después de publicar, anotar fecha y esperar datos comparables. Solicitar de GSC esta URL exacta: consultas × página, últimos 28 días frente a 28 anteriores, país México, por dispositivo, clics, impresiones, CTR y posición. Comparar también por grupos de posición: subir impresiones puede incorporar consultas nuevas de bajo CTR.

Priorizar consultas con impresiones y posición estable. No cambiar el title cada pocos días. Evaluar en 2–4 semanas teniendo presente la fuerte estacionalidad del aguinaldo; cuando sea posible, comparar también el periodo del año anterior. Revisar si la guía proporcional y esta calculadora alternan para la misma intención antes de consolidar nada.

Semrush aporta oportunidades y contexto competitivo; GSC confirma consultas y clics reales. No se promete puesto 1, aumento de CTR ni ausencia de fluctuaciones. El siguiente paso es publicar esta copia con autorización y verificar la versión servida; no se ha hecho en esta entrega.
