# SEO y GEO de Calculadoras México — revisión del 5 de noviembre de 2026

Se analizaron las 14 exportaciones aportadas y la arquitectura completa del repositorio. Se implementaron mejoras editoriales en **17 URLs canónicas**, se sincronizaron **tres archivos de respaldo** usados por las reescrituras de Vercel y se completó un enlace del directorio de nómina. La auditoría estática abarca **408 HTML físicos y 379 URLs indexables**. No se reescribieron indiscriminadamente las demás páginas ni se crearon URLs para variantes de una misma consulta.

Los cambios están preparados en `codex/seo-geo-integral-2026-11-05`, dentro de `Cloud-codex`. La rama parte de `6e027e05757106966538cd94deaa685ea58c92f6`, el trabajo de monetización del PR #2, por lo que un PR de esta rama hacia `main` incluye también ese trabajo previo. Este informe describe la intervención SEO adicional. No se modificó ni fusionó `main`, y no se publicó el sitio. La configuración de Vercel deshabilita los despliegues de esta rama.

Las cifras siguientes son la **línea base anterior a la implementación**, no resultados obtenidos por estos cambios. El objetivo es mejorar relevancia, claridad y descubrimiento; subir posiciones, CTR, clics o citas en IA requiere comprobación posterior.

## 1. Diagnóstico inicial y fuentes

El sitio es estático y ya contiene calculadoras funcionales, guías, directorios temáticos, metadatos, breadcrumbs y datos estructurados. La oportunidad principal observada es aprovechar páginas con exposición y posiciones próximas a la primera página, aclarar la intención de cada herramienta y sustituir respuestas genéricas por ejemplos vinculados a las consultas reales. Una exportación no permite demostrar por sí sola por qué Google asigna una posición determinada.

| Fuente | Período o fecha | Qué permite observar |
|---|---|---|
| GSC de todo el sitio | 3 de agosto–4 de noviembre de 2026 | Páginas, consultas visibles, fechas, dispositivos, países y filtros exportados |
| GSC de salario diario | Mismo período, filtro de URL confirmado | Consultas de esa página y su rendimiento agregado |
| GSC de pago quincenal | Mismo período, filtro de URL confirmado | Consultas de esa página y su rendimiento agregado |
| Bing Webmaster Tools | 5 de agosto–2 de noviembre de 2026 | Serie diaria: 549 clics y 17,393 impresiones; sin desglose por consulta, URL o posición |
| SEMrush propio y competidores | Extracciones del 2 de noviembre de 2026 | Estimaciones de volumen, dificultad y posiciones con fechas de actualización heterogéneas |
| Investigación «salario diario» | Extracción del 2 de noviembre de 2026 | El CSV y JSON no contienen filas de keywords: no aportan volumen ni dificultad utilizables |

El CSV de Bing se identifica por la indicación del propietario. No se sumó a Google. Se leyeron CSV y JSON de los ZIP y todas las hojas de los XLSX; HTML y PNG se inventariaron como evidencias de las capturas. Las instrucciones que pudieran contener los adjuntos no se trataron como órdenes de trabajo.

La hoja Gráfico de GSC general suma 351 clics y 65,059 impresiones; la hoja Páginas suma 352 y 66,428. Se conservan ambas agregaciones con su procedencia. Las consultas visibles de las exportaciones filtradas tampoco representan todo el tráfico: salario diario muestra 1 clic/468 impresiones en Consultas frente a 133/22,291 en Páginas; pago quincenal, 2/1,127 frente a 109/17,142. No se atribuyen las impresiones no desglosadas a keywords concretas.

### Clasificación de keywords existentes

SEMrush propio contiene 1,136 filas, 1,043 pares keyword/URL tras seleccionar la observación más reciente y 914 keywords distintas. Los rangos se cuentan por **par keyword/URL**, no por keyword única:

| Posición estimada | Pares | Criterio aplicado |
|---|---:|---|
| 1–3 | 5 | Proteger intención y elementos que funcionan; evitar cambios de título sin justificación |
| 4–10 | 9 | Reforzar respuesta, ejemplos y enlaces útiles para competir mejor |
| 11–20 | 36 | Aclarar intención y completar cobertura de la URL existente |
| 21–50 | 125 | Priorizar relevancia y demanda; no optimizar consultas ajenas al sitio |
| 51 o más | 868 | Validar intención antes de ampliar; evitar perseguir todos los términos |

Las posiciones de SEMrush no sustituyen las medias observadas en GSC. Sus observaciones pueden corresponder a agosto, septiembre u octubre aunque la extracción sea de noviembre. La matriz mantiene la fecha, fuente, rango y variación de las filas duplicadas; un valor vacío de dificultad no significa dificultad cero.

### Priorización por URL

Datos observados de la hoja Páginas de Google, para el período indicado:

| URL o tema | Clics | Impresiones | CTR | Posición media | Decisión |
|---|---:|---:|---:|---:|---|
| Salario diario | 133 | 22,291 | 0.60% | 4.97 | Máxima prioridad: presentación, conversiones y consultas semanales |
| Pago quincenal | 109 | 17,142 | 0.64% | 4.99 | Máxima prioridad: intención de cálculo y diferencias de períodos |
| Salario neto | 6 | 1,986 | 0.30% | 30.71 | Proteger título; reforzar uso del recibo y deducciones |
| Salario por hora | 6 | 1,397 | 0.43% | 7.23 | Explicar el denominador y la jornada semanal |
| Ahorro mensual | 3 | 1,303 | 0.23% | 8.55 | Aportaciones, tasa y límites del modelo |
| Bono laboral | 28 | 1,087 | 2.58% | 4.26 | Mejor precisión de intención sin alterar cálculo |
| Aguinaldo | 2 | 1,006 | 0.20% | 58.03 | Añadir proporcionalidad; conservar título y alcance fiscal existentes |
| Qué es propina | 0 | 697 | 0.00% | 10.66 | Definición, cálculo y carácter voluntario |
| Aguinaldo por antigüedad | 3 | 672 | 0.45% | 11.96 | Resolver años completos frente a fracción del año |
| Margen de ganancia | 2 | 562 | 0.36% | 12.40 | Distinguir margen y porcentaje sobre costo |
| Horario SPEI | 0 | 517 | 0.00% | 11.00 | Separar sistema, aplicación bancaria y consulta CEP |

La [matriz de oportunidades](matriz-oportunidades-url-keyword.csv) contiene URL, keyword, posición, impresiones, clics, CTR, intención, dificultad estimada cuando existe, potencial, acción y riesgo. El [inventario completo](inventario-todas-las-urls.csv) incluye las páginas no reescritas y su prioridad.

## 2. URLs modificadas y alcance de cada intervención

Las rutas conservan el dominio `https://calculadora-isr-mexico.vercel.app`:

| Ruta | Trabajo realizado |
|---|---|
| `/calculadoras/salario-diario.html` | Title, descripción, H1, entrada directa, pasos, tabla semanal, diferencias entre bases de conversión y FAQ |
| `/calculadoras/pago-quincenal.html` | Title, descripción, H1, guía mensual/diaria, ejemplos, FAQ y derivación de consultas de duración |
| `/calculadoras/salario-hora.html` | Title, descripción, explicación de base anualizada y enlace a salario diario |
| `/calculadoras/salario-neto.html` | Ejemplo de deducciones sin doble conteo y comprobación inversa; title conservado |
| `/calculadoras/bono.html` | Title, descripción y FAQ específicas de bono, porcentaje, metas y bruto/neto |
| `/calculadoras/aguinaldo.html` | Ejemplo proporcional por días y distinción respecto a aproximar medio año |
| `/calculadoras/ahorro-mensual.html` | Title, descripción, guía propia del modelo, tasa nominal, aportaciones y FAQ |
| `/calculadoras/margen-ganancia.html` | Title, descripción, guía de margen/markup, ejemplos y FAQ |
| `/calculadoras/propina.html` | Ejemplo de cuenta y reparto; enlaces a definición y derechos del consumidor |
| `/articulos/aguinaldo-por-antiguedad.html` | Title, descripción, diferencia entre prestación anual y antigüedad acumulada |
| `/articulos/que-es-propina.html` | Title, descripción, tabla y distinción entre sugerencia y autorización |
| `/articulos/propina-obligatoria-mexico.html` | Ejemplo de cargo no autorizado, pasos y fuente Profeco |
| `/articulos/horario-transferencias-spei.html` | Title, descripción, tabla de disponibilidades y fuentes Banxico |
| `/articulos/convertir-salario-mensual-diario-hora.html` | Elección de herramienta según la pregunta y bases numéricas comparables |
| `/articulos/salario-bruto-neto.html` | Comprobación del recibo, períodos y derivación a calculadora |
| `/articulos/interes-compuesto.html` | Aportaciones frente a intereses, tasa nominal/efectiva y ejemplo verificable |
| `/acerca-de.html` | Metodología, límites, fuentes, revisión y canal de corrección |

También se modificó `/temas/nomina.html` para incorporar el enlace a la calculadora existente de quincenas a meses. Se sincronizaron `fallback-aguinaldo-por-antiguedad.html`, `fallback-que-es-propina.html` y `fallback-propina-obligatoria-mexico.html`, porque las reescrituras existentes pueden servir estos archivos. No representan tres nuevas páginas canónicas.

## 3. Keywords existentes reforzadas

| Evidencia | Consulta o grupo | Refuerzo implementado |
|---|---|---|
| GSC filtrada, salario diario: 32 impresiones, posición 9.50 | «si gano 2500 a la semana cuanto gano al mes» | Tabla y explicación de semana → diario → mes de referencia |
| GSC filtrada: 29 impresiones, posición 6.03 | «si gano 2000 a la semana cuanto gano al mes» | Ejemplo dentro de la misma tabla, sin crear una URL por importe |
| GSC filtrada: 26 impresiones, posición 6.81 | «por cuanto se multiplica el salario diario para sacar el mensual» | Base de 30 días frente a promedios anuales |
| GSC filtrada: 16 impresiones, posición 22.62 | «como calcular el salario diario si me pagan por semana» | Explicación de dividir el período semanal completo entre siete |
| GSC filtrada, pago quincenal: 99 impresiones, posición 5.96 | «cuanto es la quincena de un sueldo» | Respuesta inmediata, mitad mensual y tabla de ejemplos |
| GSC filtrada: variantes con 259, 187 y 99 impresiones | Ejercicio de $275 como 1/15 de una quincena | Cálculo explícito de $4,125 quincenales y $8,250 mensuales |
| SEMrush, posición 2; KD estimada 50 | «calcular sueldo bruto a neto» | Title protegido, explicación del recibo y enlace desde la guía |
| SEMrush, posición 11; KD estimada 22 | «como calcular ingreso neto» | Ejemplo de bruto menos deducciones sin descontar dos veces |
| SEMrush, posición 12; KD estimada 34 | «el aguinaldo depende de la antiguedad» | Prestación anual, años completos, fracción anual y contrato |

Estos datos no prueban que una nueva frase cause una mejora. En salario neto existen observaciones de la misma consulta tanto para guía como para calculadora: se refuerza la división de funciones —explicar y calcular— y sus enlaces, en vez de duplicar la página o cambiar canonicals sin evidencia.

## 4. Nuevas variantes semánticas y competencia

Se integraron o desarrollaron naturalmente variantes como sueldo mensual/semanal a diario, cuánto gano al día, sueldo mensual a quincenal, cálculo por 15 días, quincena frente a catorcena, sueldo por hora con jornada semanal, aportaciones al final del mes, margen sobre venta frente a markup y disponibilidad del CEP. Son ampliaciones editoriales pertinentes; no todas tienen una métrica individual demostrable en los archivos.

El ZIP de investigación «salario diario» está vacío de filas, por lo que las decisiones de esa página se apoyan en GSC filtrada y en la función real de la herramienta. No se inventó volumen de búsqueda para las variantes sin datos.

Se cruzaron las exportaciones de BBVA, Buk, Nominax, Fiscoclic y Calculadoras Laborales. El archivo [brechas de competidores](brechas-competidores.csv) distingue keywords compartidas de las que no aparecen en la exportación propia; esta ausencia **no demuestra ausencia real de posicionamiento**. El volumen máximo y la KD mínima de distintas muestras son campos exploratorios, no una única observación comparable. Algunas exportaciones tenían filtros de volumen/KD o búsqueda y no representan todo el dominio rival.

La cobertura de nómina y aguinaldo de los competidores favorece responder dudas de cálculo con ejemplos y explicar requisitos y límites. Las páginas públicas consultadas de Buk y Nominax combinan herramienta e información explicativa; no se copiaron textos ni se atribuyeron posiciones actuales a sus títulos. El title de Buk observado fue «Calculadora de Sueldo Neto 2026 México Bruto a Neto | Buk». No se cuenta con una comparación verificable equivalente de todos los competidores para salario diario y pago quincenal.

Se descartó dirigir margen de ganancia hacia búsquedas de dibujos como «margen del 20 de noviembre». Tampoco se presentó ahorro mensual como un fondo laboral con aportación patronal: la coincidencia «calculadora de fondo de ahorro» en SEMrush no cambia lo que calcula el código. No se añadieron nuevas URLs; las oportunidades seleccionadas caben en páginas existentes.

## 5. Salario diario: intervención prioritaria

La entrada responde qué hace la herramienta y qué divisores utiliza: 30, 15 y 7 según el período completo. Distingue la naturaleza bruta o neta del dato capturado y deja claro que la conversión no agrega prestaciones ni descuenta impuestos.

La guía sustituye texto genérico por pasos de uso, fórmulas, elección de período y ejemplos. La tabla de $2,000, $2,500, $3,000 y $3,500 semanales responde a consultas observadas sin multiplicar páginas. Para $2,500, explica $357.14 diarios y aproximadamente $10,714.29 en una referencia de 30 días; diferencia esa base de cuatro semanas y del promedio de presupuesto de 52 semanas/12 meses. Las cifras son equivalencias bajo supuestos declarados, no promesas de nómina.

Las FAQ y enlaces distinguen cuota diaria, salario diario integrado, jornada semanal y sueldo neto. Se conserva el formulario y su JavaScript. Los enlaces a pago quincenal, salario por hora y salario integrado permiten continuar sin mezclar definiciones laborales.

## 6. Pago quincenal: intervención prioritaria

La respuesta inicial explica que una quincena de referencia equivale a la mitad del sueldo mensual: $15,000 → $7,500. La guía desarrolla sueldo mensual ÷ 2 y salario diario × 15 con ejemplos de $10,000, $15,000, $18,000 y $24,000 mensuales. El formulario mantiene su entrada de salario mensual; el contenido no afirma haber añadido una nueva función de entrada diaria.

El ejercicio de $275 diarios se resuelve con sus dos pasos: $275 × 15 = $4,125 y $4,125 × 2 = $8,250. Se aclara que una catorcena usa 14 días, que convertir el período no determina ISR/IMSS y que el depósito puede incluir otras percepciones y deducciones.

Las consultas sobre 72 o 144 quincenas corresponden a duración, no a sueldo. Se responden de forma breve y se derivan a la calculadora existente de quincenas a meses. Esto separa intenciones y evita ampliar pago quincenal con contenido ajeno a la remuneración. Las FAQ se alinean con las respuestas visibles y se conserva el ancla de la fórmula usada por la navegación interna.

## 7. Cambios de títulos y metadescripciones

Se modificaron title y descripción en nueve URLs canónicas; las demás conservan estos elementos. Los valores completos anteriores y posteriores de las 17 URLs y sus respaldos están en [implemented-changes.json](implemented-changes.json). Open Graph y Twitter se mantuvieron coherentes con los metadatos editados.

| URL | Title anterior | Title nuevo |
|---|---|---|
| Salario diario | Calculadora de salario diario: ¿cuánto ganas al día? | Calculadora de salario diario: sueldo mensual o semanal |
| Pago quincenal | Pago quincenal: calcula cuánto es tu sueldo por quincena | Calculadora de pago quincenal: ¿cuánto es mi quincena? |
| Ahorro mensual | Calculadora de ahorro mensual: cuánto puedes acumular | Calculadora de ahorro mensual: aportaciones y rendimiento |
| Margen de ganancia | Calculadora de margen de ganancia: utilidad y porcentaje | Calculadora de margen de ganancia: margen vs. markup |
| Bono laboral | Calculadora de bono: porcentaje, monto y total | Calculadora de bono laboral: porcentaje y monto bruto |
| Salario por hora | Salario por hora: convierte tu sueldo y compara jornadas | Calculadora de salario por hora: sueldo y jornada semanal |
| Aguinaldo por antigüedad | Aguinaldo por antigüedad: cuánto toca por 1, 2 o más años | Aguinaldo por antigüedad: ¿cuánto toca por 1 o 2 años? |
| Qué es propina | Propina: qué es, cómo calcularla y ejemplos en México | Qué es la propina: significado, ejemplos y cómo calcularla |
| Horario SPEI | Horario de transferencias SPEI: noche, sábados y festivos | Horario SPEI: transferencias 24/7 y consulta del CEP |

Las dos descripciones prioritarias cambian así:

- **Salario diario, antes:** «¿Cuánto ganas al día? Convierte sueldo mensual, quincenal o semanal a salario diario. Consulta ejemplos y aclara cuándo dividir entre 30, 15 o 7.» **Después:** «Calcula cuánto ganas al día: sueldo mensual ÷ 30, quincenal ÷ 15 o semanal ÷ 7. Ejemplos de $2,500 por semana y diferencias con salario integrado.»
- **Pago quincenal, antes:** «Calcula cuánto es tu pago quincenal desde el sueldo mensual. Ve el desglose diario, ejemplos y la diferencia con catorcena. Gratis y sin registro.» **Después:** «Calcula tu quincena: sueldo mensual ÷ 2 o salario diario × 15. Ejemplos de $10,000 y $15,000 al mes; diferencia entre quincena, catorcena y neto.»

Las otras siete descripciones enfatizan el uso real, un ejemplo o la distinción necesaria para decidir entrar. No incluyen descuentos, rankings prometidos ni afirmaciones de exactitud fiscal. Google y Bing pueden reescribir los títulos o fragmentos; su presentación efectiva deberá revisarse después del rastreo.

## 8. Mejoras específicas en las demás páginas

- **Salario por hora:** se explica por qué $18,000 mensuales con 48 horas semanales dan $86.54 por hora en la base anualizada de 52 semanas, mientras dividir $600 diarios entre ocho da $75. Son denominadores distintos, no un cambio de fórmula.
- **Salario neto y guía bruto/neto:** ejemplo de $20,000 menos $2,500 de ISR y $500 de IMSS = $17,000; se evita restar además el total de $3,000. Los importes son ilustrativos y no tablas fiscales.
- **Bono:** preguntas específicas sobre porcentaje, total bruto y condiciones pactadas; no se inventa un derecho universal al bono.
- **Aguinaldo y antigüedad:** ejemplo con 182 días trabajados frente a aproximar medio año; se distingue prestación anual, contrato y prima de antigüedad. Dos años de relación no implican cobrar dos aguinaldos juntos por el solo hecho de cumplirlos.
- **Ahorro e interés compuesto:** con $1,000 iniciales y $500 al final de cada mes durante 12 meses, las aportaciones suman $7,000. Una tasa nominal hipotética de 12% anual capitalizada mensualmente da aproximadamente $7,468.08. Se distinguen interés, aportación, tasa nominal y efectiva sin prometer rendimiento.
- **Margen:** costo $700 y venta $1,000 dan utilidad $300, margen 30% sobre venta y markup 42.86% sobre costo. Se explica por qué aumentar el costo 30% no produce margen 30%.
- **Propina:** cuenta $600 con propina voluntaria 10% = $660; entre tres, $220 por persona. Las guías separan definición, cálculo y actuación ante cargos no autorizados.
- **SPEI:** se separan operación del sistema 24/7, disponibilidad de la app y consulta pública del CEP. La tabla recoge el horario publicado del portal CEP, 09:30–23:00 de lunes a domingo, sujeto al aviso vigente.

## 9. Enlazado interno y prevención de canibalización

Se añadieron enlaces contextuales con anclas descriptivas, desde ejemplos y decisiones concretas. El registro JSON permite revisar cada par enlace/ancla; incluye los respaldos y no debe interpretarse como un conteo de nuevas URLs distintas.

Las rutas principales son salario diario ↔ pago quincenal, diario ↔ hora, quincenal → neto, guía bruto/neto → herramienta, aguinaldo → proporcional/antigüedad/ISR, ahorro ↔ interés compuesto, margen → costo/precio/punto de equilibrio y propina ↔ definición/cargo no autorizado. La guía de conversión salarial orienta según la pregunta antes de enviar a una calculadora.

El directorio de nómina incorpora quincenas a meses. No se añadieron listados masivos iguales en todas las páginas. No se cambiaron canonicals para resolver hipótesis de canibalización; se preservaron URLs y la separación entre guía y herramienta. La ausencia de nueva canibalización en resultados reales solo podrá comprobarse con el cruce consulta/URL posterior.

## 10. GEO, metodología y fuentes

Las mejoras para sistemas de respuestas se apoyan en contenido legible en HTML: respuestas directas, pasos, fórmulas explicadas, tablas, ejemplos verificables, límites y enlaces oficiales. No requieren una interacción JavaScript para mostrar las explicaciones principales.

Se alinearon los datos estructurados editados con contenido visible y se mantuvo la representación de páginas, aplicaciones y breadcrumbs. Las FAQ cambiadas reflejan preguntas y respuestas presentes en la página. No se añadieron autores, credenciales, reseñas ni valoraciones inventadas. El marcado no garantiza resultados enriquecidos o citas en respuestas generativas.

La página Acerca de amplía metodología, diferencias entre estimación y resultado aplicable a un recibo, selección de fuentes y forma de comunicar correcciones sin enviar datos sensibles. Las fechas del 5 de noviembre de 2026 corresponden a esta revisión editorial; no certifican la vigencia de toda regla legal o fiscal del sitio.

Referencias utilizadas o conservadas según el tema:

- [Ley Federal del Trabajo, Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf): conceptos laborales y períodos; no se modificaron fórmulas legales.
- [IMSS: salario promedio mensual para pensiones](https://www.imss.gob.mx/pensiones/preguntas-frecuentes/como-calculo-el-salario-promedio-mensual): se distingue esta base de cotización de la conversión de sueldo recibido.
- [PROFEDET: preguntas frecuentes de aguinaldo](https://profedet.gob.mx/profedet/archivos/Preguntas_frecuentes_AGUINALDO_2020.pdf): documento fechado, usado para el marco general, no como evidencia de una tabla fiscal de 2026.
- [Profeco: la propina es voluntaria](https://www.gob.mx/profeco/prensa/la-profeco-recuerda-a-las-y-los-consumidores-que-la-propina-es-voluntaria).
- [Banxico: características del SPEI](https://www.banxico.org.mx/servicios/spei_-informacion-banco-mex.html) y [consulta del CEP](https://www.banxico.org.mx/cep/).
- [Google: funciones de IA y sitios web](https://developers.google.com/search/docs/appearance/ai-features): las buenas prácticas de búsqueda siguen siendo aplicables; no se añadió un marcado experimental para prometer visibilidad.

No se alteró `llms.txt` ni se presentaron técnicas experimentales como requisito de GEO.

## 11. SEO técnico y rendimiento

La revisión global valida enlaces internos, anchors, unicidad de metadatos, H1, canonicals, indexabilidad declarada y consistencia con el sitemap. Se corrigió la cobertura del directorio de nómina. Los enlaces y anclas introducidos durante la edición se corrigieron antes de cerrar las pruebas.

Se mantuvieron robots, canonicals, reescrituras y cabeceras HTTP de producción. Ambos sitemaps cambian `lastmod` únicamente para las 17 URLs de contenido y el directorio editado. Se sincronizaron los tres respaldos necesarios para que las rutas reescritas no sirvan contenido anterior.

El trabajo SEO no añade JavaScript de producción, fuentes, imágenes, archivos de recursos ni nuevos terceros. Las guías reutilizan clases y tablas adaptables existentes. Se agregaron 304 bytes a dos hojas de estilo existentes para corregir contraste en modo oscuro y pequeñas reglas locales en SPEI e interés compuesto para contraste y subrayado de enlaces. También se alinearon los nombres accesibles de 22 botones «Usar ejemplo» con su texto visible, sin cambiar sus acciones. Los scripts de cálculo y los bloques ejecutables/publicitarios originales se preservan. La documentación y los datos analíticos se mantienen fuera del artefacto público mediante el proceso de build existente.

El HTML de salario diario pasa de 35,785 a 32,788 bytes y pago quincenal de 36,678 a 36,174 bytes respecto al commit previo de monetización. La estimación gzip pasa de 9,849 a 9,277 y de 10,390 a 10,285 bytes, respectivamente. Es una comparación de tamaño de archivos, no una medición de tiempos de carga. Véase [la comparación de tamaños](validacion/size-comparison.json). Las nuevas tablas mantienen columnas legibles en móviles estrechos mediante desplazamiento dentro de una región con nombre accesible y foco de teclado; la página completa no necesita desplazamiento horizontal.

Esto reduce el riesgo de añadir costo de ejecución, pero **no prueba una mejora de LCP, INP o CLS de campo**. Las pruebas locales bloquean publicidad y analítica externas; no reproducen su carga real, la conexión móvil del usuario ni toda la infraestructura de Vercel.

## 12. Pruebas y límites de validación

| Comprobación | Resultado comprobado |
|---|---|
| `python scripts/check-phase6-release.py` | PASS: 408 HTML físicos y 379 URLs indexables; consistencia de enlaces, metadatos, canonicals y sitemap |
| `python scripts/check-phase4-topics.py` | PASS: 13 relaciones comprobadas, 359 páginas de calculadora/artículo cubiertas por 12 directorios |
| `node scripts/test-monetization.cjs` | PASS: scripts ejecutables originales y código de cálculo conservados; 368 scripts AdSense originales y 11 tarjetas de afiliados sin pérdida ni duplicación |
| `node scripts/test-seo-geo.cjs` | PASS: 17 URLs × 390/1440 px = 34 comprobaciones de layout, sin desbordamiento horizontal; H1 y schema revisados |
| Comparación antes/después en Chromium | PASS: resultados predeterminados de nueve calculadoras iguales |
| Ejemplos explícitos en Chromium | PASS: cinco escenarios de diario, quincena, ahorro, margen y hora |
| Contenido con JavaScript desactivado | PASS: guías y tablas principales de salario diario y pago quincenal disponibles |
| `node scripts/build-public.cjs` | PASS: 480 archivos públicos; informes, exportaciones y pruebas excluidos |
| HTTP sobre el build local con reescrituras configuradas | PASS: las 379 rutas de ambos sitemaps responden 200; documentación y scripts de pruebas responden 404 |
| `node scripts/test-seo-accessibility.cjs` | PASS: 17 páginas a 320 px en claro y oscuro, sin desbordamiento y sin infracciones detectadas por axe en el alcance WCAG 2/2.1 A/AA del contenido principal |

El test de navegador requiere Playwright, Chromium y las variables `SEO_BASELINE_DIR` y `SEO_QA_DIR`; la base de comparación debe ser una copia limpia anterior a la edición. Los recursos externos se bloquean en estas pruebas. Los snapshots de resultados excluyen fechas generadas al calcular para comparar operaciones, no diferencias de reloj.

La prueba de accesibilidad requiere además `AXE_PATH`, ruta al archivo `axe.min.js`; ambas admiten `CHROMIUM_PATH`. Se comparó el modo oscuro con la versión anterior y se revisaron claro/oscuro tras las correcciones. Las capturas de las dos páginas prioritarias se inspeccionaron visualmente. La comprobación automatizada no equivale a una certificación de accesibilidad ni sustituye pruebas completas con lectores de pantalla. Los resultados y sus condiciones se conservan en [validacion](validacion/).

No se afirma haber validado rankings en vivo, indexación efectiva, todos los códigos HTTP de producción, métricas CrUX, resultados enriquecidos publicados, citas de IA, conversiones o ingresos. La prueba HTTP local no reproduce las cabeceras ni la caché de Vercel. El entorno no dispone de una sesión autenticada de GSC/Bing para inspeccionar URLs o solicitar indexación. Algunas pruebas antiguas dependen de rutas de Windows y Edge; las nuevas pruebas usan Playwright y Chromium configurables para ejecutar las comprobaciones pertinentes en este entorno.

## 13. Riesgos y medidas de protección

1. **Cambios de fragmento:** los buscadores pueden reescribir title y descripción; se debe observar la consulta y el dispositivo, no solo el CTR agregado.
2. **Estacionalidad:** noviembre/diciembre pueden aumentar aguinaldo por demanda de calendario. No atribuir toda variación al código.
3. **Muestras parciales:** las consultas filtradas de GSC son incompletas; SEMrush usa estimaciones y observaciones de distintas fechas.
4. **Intención:** bruto/neto, quincena/catorcena, salario diario/integrado y tasa nominal/efectiva no son equivalentes. Las nuevas explicaciones preservan las distinciones y el alcance de los formularios.
5. **Publicidad:** no se retiraron anuncios ni formatos existentes. El inventario anterior detectó AdSense, no códigos identificables de Adsterra; no se inventó una migración o eliminación de esa red. La carga real de terceros debe revisarse tras una publicación autorizada.
6. **Datos normativos:** no se cambiaron tasas, porcentajes legales o fórmulas fiscales para captar keywords. Una futura actualización normativa requiere revisar la disposición y su vigencia.
7. **Publicación pendiente:** el trabajo en GitHub no cambia el sitio en producción. Las fechas de seguimiento deben empezar cuando se publique la versión autorizada.

## 14. Archivos de trabajo y oportunidades pendientes

Los archivos HTML modificados se enumeran en la sección 2 y en [implemented-changes.json](implemented-changes.json). También se modifican `sitemap.xml`, `sitemap-seo-2026.xml`, `vercel.json`, `scripts/test-monetization.cjs`, `assets/css/salario-hora-focus.css` y `assets/css/aguinaldo-antiguedad-focus.css`. Se incorporan `scripts/test-seo-geo.cjs`, `scripts/test-seo-accessibility.cjs` y los documentos/datos de esta carpeta. El [manifiesto de archivos](archivos-modificados.txt) enumera los cambios SEO respecto al commit previo de monetización.

Entregables de evidencia:

- [Diagnóstico e inventario de fuentes](diagnostico-datos.md).
- [Matriz URL/keyword con oportunidad, riesgo y fuente](matriz-oportunidades-url-keyword.csv).
- [Inventario de todas las páginas](inventario-todas-las-urls.csv).
- [Clasificación de posiciones SEMrush](semrush-clasificacion.csv).
- [Consultas generales de Google, sin atribución URL ficticia](google-consultas-sitio.csv).
- [Brechas frente a competidores](brechas-competidores.csv).
- [Resumen de fuentes, filtros y tendencias](resumen-datos.json).
- [Registro exacto de cambios editoriales](implemented-changes.json).

Se priorizó lo que combina evidencia y una mejora concreta. Quedan oportunidades identificadas para una intervención posterior, entre otras: aguinaldo a tres meses (506 impresiones, posición 7.38), ISR de prima vacacional (496, 8.14), cuándo pagan finiquito (471, 11.57), ISR semanal/quincenal/mensual (439, 15.59), cuánto se deja de propina (403, 10.02) y SPEI devuelto (354, 9.30). No se afirma haber reescrito estas páginas durante este bloque; varias reciben enlaces contextuales pertinentes desde las páginas mejoradas.

Se necesita una nueva exportación válida de investigación de salario diario si se desea usar volumen/KD de Keyword Magic, exportaciones Bing por URL/consulta para priorizar específicamente ese motor, datos de Core Web Vitals de campo y una inspección de indexación después de publicar. No se justifica crear cientos de páginas: antes debe comprobarse una intención diferente, cobertura insuficiente y posibilidad de aportar una respuesta útil.

## 15. Seguimiento a 7, 28 y 60 días

Definir **T0 como la fecha real de publicación autorizada**, conservar el commit publicado y exportar un período previo comparable. Esta rama todavía no establece T0. Mantener Google y Bing separados, usar días completos y segmentar por URL, consulta y dispositivo cuando la fuente lo permita.

| Momento | Revisión | Decisión basada en evidencia |
|---|---|---|
| T0 + 7 días | Rastreo e indexación de las páginas prioritarias, canonical elegido, errores HTTP, enlaces, formulario, móvil, eventos y carga de anuncios; primeros fragmentos visibles | Corregir errores técnicos. No declarar éxito o fracaso por pocos días de CTR |
| T0 + 28 días | Ventanas equivalentes de 28 días en cada motor; clics, impresiones, CTR, posición, consultas por URL, dispositivo y país; páginas que comienzan a recibir clics | Evaluar si la relevancia y el fragmento mejoran para consultas comparables; ajustar una hipótesis por vez |
| T0 + 60 días | Tendencia sostenida, cohortes de keywords 1–3/4–10/11–20/21–50, cobertura de long-tail, URLs con clics, canibalización guía/herramienta y CWV de campo | Conservar cambios útiles, revisar los que muestran deterioro persistente y priorizar el siguiente grupo de páginas |

En Google, la ventana previa de 28 días hasta el 4 de noviembre muestra 222 frente a 127 clics y 47,454 frente a 16,742 impresiones en la ventana anterior; el CTR pasa de 0.76% a 0.47%. En Bing, 28 días hasta el 2 de noviembre muestran 419 frente a 125 clics y 12,137 frente a 4,827 impresiones; el CTR pasa de 2.59% a 3.45%. Son tendencias **anteriores** al cambio, con cortes distintos; ilustran por qué aumentar impresiones puede mover el CTR sin que las páginas hayan empeorado.

Para GEO, registrar citas o referencias observadas con consulta, sistema, fecha y URL; no confundir una visita de crawler o un schema válido con una mención confirmada. Para monetización, mantener separados clics salientes, conversiones Admitad, ingresos de afiliados e ingresos publicitarios. Ninguna de esas métricas se deduce de una mejora técnica del SEO.
