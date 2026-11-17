# Optimización de las URLs observadas en Search Console — 10 de noviembre de 2026

Se implementaron mejoras funcionales y de contenido en **8 URLs canónicas (11 HTML fuente contando tres fallbacks)**, sobre la versión local `ee6d803`, que ya incorporaba las etapas ISR/Bono y SEMrush. Esta entrega conserva esos cambios. No se publicó en Vercel ni se subió a GitHub.

Se analizaron las **186 URLs del Excel GSC**, las **1,272 observaciones históricas SEMrush** y su relación por URL. Hubo revisión editorial individual de **27 candidatos**: ocho modificados y 19 conservados con motivos documentados. Para los otros 159 se revisaron datos, metadatos y arquitectura; no se presenta eso como una lectura editorial profunda de todos sus textos.

Build: **495 archivos públicos**. Auditoría: **408 HTML físicos, 407 con cuerpo de página y 379 rutas canónicas indexables localmente**. No hay nuevas URLs, fusiones, redirecciones ni cambios de canonical. Las 379 rutas no equivalen a 379 páginas indexadas por Google; las 186 de GSC tampoco son un inventario de indexación.

## Datos, procedencia y límites

Fuente GSC: `https___calculadora-isr-mexico.vercel.app_-Performance-on-Search-2026-11-10(1).xlsx`, periodo 9 de agosto–10 de noviembre de 2026, búsqueda Web basada en texto. SHA-256: `daab97bc45d1a86f83e24c97ff6f552db32d2ba2bfbba312ffa6d78b64382c57`. Se conserva el archivo de entrada; siete pestañas exportadas a CSV sin alterar valores.

| Pestaña | Filas | Clics | Impresiones |
| --- | ---: | ---: | ---: |
| Gráfico | 94 | 424 | 79,566 |
| Páginas | 186 | 425 | 81,144 |
| Consultas | 1,000 | 13 | 10,657 |
| Países | 130 | 424 | 79,566 |
| Dispositivos | 3 | 424 | 79,566 |
| Aparición en búsquedas | 0 | 0 | 0 |
| Filtros | 2 | — | — |

Las diferencias entre gráfico, páginas y consultas se conservan: **no se suman agregaciones ni se fuerzan totales iguales**. Google documenta diferencias de agregación, consultas omitidas y límites de filas; este archivo no permite atribuir toda la diferencia a una única causa. [Documentación de GSC](https://support.google.com/webmasters/answer/17010575?hl=es).

La relación consulta–URL de GSC no está disponible en esta exportación general. `Consultas` y `Páginas` no se unen por orden. La matriz usa la URL confirmada de SEMrush y las métricas agregadas de página GSC. **No sumar las métricas GSC repetidas en cada fila de keyword**. El inventario de 186 filas es la tabla adecuada para agregarlas.

El paquete SEMrush seleccionado es `Calculadoras_Mexico_SEO_Completo_Reenviado(1).zip` (SHA `b9bf6420515cea257c8763df636d56f4d0c7315ae0b3a0d72e000380eac127d8`). Su Excel de posiciones tiene 1,272 registros y 1,023 keywords distintas; las primeras 1,200 filas se cotejaron con los textos originales en la etapa anterior. Las 72 de la última página mantienen sus advertencias de procedencia; siete no tienen URL original confirmada y **no se asignan a la home**. Se conserva el literal de fecha, incluido «3 días», sin inventar una fecha absoluta. Volumen y KD son estimaciones históricas de SEMrush, no impresiones ni resultados actuales.

Las 124 URLs SEMrush confirmadas están dentro de las 186 de GSC. La matriz tiene 1,327 filas: 1,265 observaciones con URL y 62 destinos sin observación SEMrush propia. Los archivos de soporte y capturas del competidor ya analizados no se presentan como investigación nueva de esta etapa.

Por posición media GSC de página: una URL por debajo de 4; 36 entre 4 y 10; 54 por encima de 10 y hasta 20; 48 por encima de 20 y hasta 50; 47 por encima de 50. Una posición media decimal 10.66 pertenece al segundo grupo de oportunidad, sin redondearla artificialmente a 10.

El gráfico de propiedad muestra 285 clics/59,370 impresiones del 13 de octubre al 9 de noviembre frente a 111/17,122 del 15 de septiembre al 12 de octubre. Son dos ventanas históricas de 28 días; se excluyó el posible día parcial 10 de noviembre. **No es una mejora causada por esta entrega ni demuestra tendencia por URL**. Los CTR correspondientes son 0.480% y 0.648%; no se interpreta el crecimiento de impresiones como mejora automática del CTR.

## Oportunidades implementadas por URL

Los datos siguientes son históricos de GSC por página; «pos.» dentro de la keyword es la observación SEMrush, de otra fecha y alcance. No se verificó una SERP actual, geolocalizada y reproducible que permita afirmar posiciones nuevas.

| URL | Clics históricos | Impresiones históricas | Posición GSC | Keyword SEMrush | Problema | Mejora implementada | Pruebas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /articulos/aguinaldo-por-antiguedad.html | 3 | 704 | 11.76 | el aguinaldo depende de la antiguedad (pos. 12; vol. 40; KD 34) | La mini herramienta permitía menos de 15 días anuales y días computables fraccionarios; facilitaba una doble proporcionalidad. | Validación del mínimo anual, días enteros, comparación con 15 días, limpieza del resultado y enlace con el escenario a aguinaldo. | Seis escenarios válidos, seis inválidos y transferencia al cálculo real de aguinaldo. |
| /articulos/convertir-salario-mensual-diario-hora.html | 0 | 263 | 8.53 |  (pos. ; vol. ; KD ) | La explicación no trasladaba esos ejemplos a las herramientas con los valores precargados. | Tres escenarios a salario diario, pago quincenal y comparador por hora; distinción entre aumento por hora y sueldo mensual. | IDs y opciones destino verificados; cálculo del comparador y fórmulas de 15,000/30 y 15,000/2. |
| /articulos/horario-transferencias-spei.html | 0 | 653 | 11.12 | fecha de operacion en el spei (pos. 76; vol. 50; KD 33) | Faltaba explicar qué fecha introducir al buscar el comprobante de una operación anterior. | Pasos y ejemplo de fecha de operación/consulta; diferencia horario CEP del canal bancario; enlaces por estado del pago. | Fuente Banxico consultada; auditoría de destinos, fragmentos y estructura HTML. |
| /articulos/isr-prima-vacacional.html | 5 | 510 | 8.07 | la prima vacacional grava para isr (pos. 78; vol. 390; KD 18) | Secciones repetidas mezclaban un límite hipotético con una cifra 2026; faltaba una separación verificable por fecha y pagos parciales. | Contenido consolidado, 15 UMA con vigencias enero/febrero, separador exento/gravado a centavos, pagos parciales y cuatro FAQ coherentes. | Cuatro celdas UMA, siete casos de separación, cinco inválidos, entradas vacías, FAQ visible y ancla heredada. |
| /articulos/que-es-propina.html | 0 | 714 | 10.66 | cuanto se da de propina (pos. 79; vol. 480; KD 21); intención secundaria remitida a guía de porcentajes | La definición repetía tablas de porcentajes y un enlace a sí misma; podía confundirse con la guía de cuánto dejar. | Distingue consumo, propina, total y sugerencia autorizada; elimina repetición y autovínculo; enlace con ejemplo reproducible. | Escenario con preferencias guardadas: total 550, cuatro personas, 137.50 por persona; FAQ y enlaces. |
| /calculadoras/ahorro-mensual.html | 4 | 1877 | 8.45 | calculadora de ahorro (pos. 60; vol. 260; KD 22) | Solo devolvía tres totales; no permitía comprobar la evolución ni elegir el momento del depósito. | Evolución por mes, aportación al inicio/final, validación de importes y meses enteros, ejemplos y módulo específico. | Fórmula cerrada independiente, 24 escenarios de evolución, errores, ejemplos y enlace AFORE. |
| /calculadoras/margen-ganancia.html | 2 | 712 | 11.92 | calculadora de margen de ganancia (pos. 62; vol. 40; KD 13) | La explicación incluía precio desde margen, pero el formulario solo aceptaba costo y venta. | Modo inverso de precio con margen objetivo; redondeo hacia arriba a centavos, margen efectivo, estados de campos y ejemplos. | 16 combinaciones de costo/margen y comprobación de centavo mínimo; pérdidas, costo cero y errores. |
| /calculadoras/salario-hora.html | 6 | 1646 | 7.37 | salario por hora en mexico (pos. 74; vol. 590; KD 22) | Convertía un solo sueldo; comparar jornadas exigía cálculos separados y el resultado permanecía visible tras editar. | Comparación A/B por hora y mes, invalidación de resultado, etiquetas sincronizadas y eliminación del módulo genérico sin uso. | Cinco periodicidades, ejemplo 18,000/48h vs 18,000/40h, enlace, errores y reinicio. |

La tabla ampliada `oportunidades-implementadas.csv` incluye CTR e impacto esperado cualitativo. Ningún incremento de clics, impresiones o posición se da por medido.

## Qué cambia en las herramientas y el contenido

### Ahorro mensual

Se mantiene el modelo de tasa nominal anual dividida entre 12. El usuario puede aportar al inicio o al final del mes y abrir un detalle con saldo inicial, aportación, rendimiento y saldo final por mes. El resultado distingue capital y rendimiento. A tasa cero coinciden ambas modalidades; cero meses conserva solo el capital inicial. Se valida plazo entero de 0–600 meses, importes no negativos a centavos y valores finitos; la proyección se limita para evitar resultados desbordados. La tasa capturada no representa una oferta garantizada y no se añaden impuestos, comisiones o inflación inexistentes.

Con $1,000 iniciales, $500 por mes y 12% nominal anual durante 12 meses: **$7,468.08 al final del mes y $7,531.49 al inicio**. Las filas visibles redondean a centavos; el motor conserva decimales, supuesto explicado junto a la tabla. El enlace previo de AFORE con tasa cero continúa dando $6,000. No se reconvierte esta URL en una calculadora de fondo de ahorro laboral ni se duplica `/calculadoras/ahorro-meta.html`.

### Salario por hora

Se preservan las cinco conversiones y el modelo de 52 semanas. Se añade comparación opcional de otra oferta mensual con distinta jornada. A $18,000 mensuales, 48 horas dan **$86.54/hora** y 40 horas **$103.85/hora**: 20% más por hora con la misma mensualidad. Se explicita comparar bruto con bruto o neto con neto. Cambiar datos invalida el resultado anterior; cargar un enlace sincroniza también etiquetas y campos. Se retira el script genérico, que no atendía el identificador `salario-hora-v2`.

Keywords históricas compatibles: «salario por hora en mexico» (vol. 590, KD 22), «como saber cuanto gano por hora» (90, 14), «salario por hora» (140, 17). Las variantes centradas en pago por día corresponden mejor a salario diario; no se añaden masivamente al encabezado de esta URL.

### Margen de ganancia

Conserva utilidad, margen sobre venta y aumento sobre costo; incluye pérdidas y costo cero en el modo de margen actual. El nuevo modo usa **precio = costo / (1 − margen/100)**. El precio se redondea hacia arriba al centavo y se muestra el margen efectivo: costo $2, objetivo 40% → **$3.34**, porque $3.33 quedaría debajo. Costo cero no determina un precio único para un objetivo y se rechaza en ese modo. El margen objetivo se limita a menos de 100%.

Se descarta «margen del 20 de noviembre» por intención ajena. «Cómo sacar porcentaje de utilidad» (vol. 90, KD 19) es complementaria. Se mantiene enlace a precio de venta para el caso distinto de aumentar un porcentaje sobre costo.

### Aguinaldo por antigüedad

La prestación anual capturada debe ser al menos 15 días en el alcance LFT de la página. Los días computables se introducen por separado, como enteros de 1 a 365 para 2026. Se explica por qué introducir 7.5 días anuales para medio año y además reducir el periodo descontaría dos veces. $15,000 mensuales, 15 días anuales y 182 computables → **$3,739.73 brutos**. El resultado compara contra 15 días y traslada el escenario a la calculadora principal. No multiplica el aguinaldo de un ejercicio por los años de servicio.

### ISR de prima vacacional

Se consolidan secciones repetidas y se sustituye el ejemplo de límite hipotético. Se distinguen **enero 2026: 15 × $113.14 = $1,697.10; desde febrero: 15 × $117.31 = $1,759.65**. La referencia exige revisar fecha, condiciones y exención utilizada durante el año. Se conserva el alcance de casos especiales, sin automatizar la elegibilidad.

El separador aplica la exención disponible capturada; **no calcula ISR ni neto**. Prima $3,000 y límite $1,759.65 → $1,759.65 exentos y $1,240.35 gravados. Si se aplicaron antes $1,000 y se recibe otra prima de $2,000, con $759.65 disponibles la parte gravada también sería $1,240.35. Se diferencia salario de vacaciones y prima. Se conservó el destino `#isr-vacaciones` utilizado por tres páginas; la primera auditoría detectó su pérdida y la segunda comprueba que está restituido.

### Propina, SPEI y guía de conversiones

«Qué es propina» mantiene la definición como intención principal. La consulta histórica «cuanto se da de propina» se atiende mediante un enlace a la guía de porcentajes; no se convierte la definición en otra copia de esa guía. Se distingue consumo, importe elegido y total, con la advertencia de no duplicar la propina. El enlace de ejemplo especifica reparto y redondeo para dar $550/4 = **$137.50**, incluso con esas preferencias guardadas. Se retiran una tabla redundante y un enlace a sí misma.

En SPEI se explica la fecha de la operación frente a la fecha de consulta y el horario que publica **el portal CEP**, 09:30–23:00 de lunes a domingo. No se extrapola a todas las apps ni se publica un horario particular de BBVA sin una fuente bancaria aplicable. Se enlazan los estados liquidado/devuelto y la diferencia entre referencia y clave de rastreo.

La guía de conversión conecta ejemplos precargados con salario diario, quincenal y por hora; $15,000/30 = $500 diarios y $15,000/2 = $7,500 por quincena de referencia. No mezcla esos divisores con el modelo anual de 52 semanas usado para comparar jornadas.

## Candidatos conservados y protección del trabajo previo

| URL | Clics | Impresiones | Posición | Decisión |
| --- | --- | --- | --- | --- |
| /articulos/aguinaldo-3-meses.html | 3 | 530 | 7.36 | Ya distingue 90 días aproximados y días reales por fecha; ejemplos y enlace a calculadora cubren el caso. Conservar. |
| /articulos/como-calcular-aguinaldo.html | 0 | 347 | 69.26 | Ya tiene fórmula anual/proporcional, ejemplo 7,500/3,698.63 y casos por meses; no convertirla en copia de la calculadora. |
| /articulos/cuando-pagan-finiquito.html | 1 | 508 | 11.54 | Ya distingue fecha de terminación, reclamación y conciliación; evita inventar un plazo universal de 10/15/30 días. No repetir contenido. |
| /articulos/cuanto-se-deja-propina-mexico.html | 0 | 441 | 9.89 | Ya responde porcentajes como escenarios voluntarios, sugerencia y doble conteo. La definición enlaza aquí; no convertir ambas páginas en copias. |
| /articulos/isr-semanal-quincenal-mensual.html | 11 | 469 | 17.64 | Conservar las tres tablas oficiales, consulta de rango, ejemplos y navegación ya implementados. Recibe un enlace contextual desde ISR de prima vacacional. |
| /articulos/propina-obligatoria-mexico.html | 0 | 320 | 10.08 | Ya desarrolla consentimiento, ticket, pasos y fuentes Profeco; conserva intención legal y recibe enlace contextual de la definición. |
| /articulos/que-es-el-isr.html | 0 | 344 | 58.96 | Ya contiene definición, ejemplo, glosario y consulta de rango; se conserva frente a la intención de consultar tablas completas del artículo prioritario. |
| /articulos/salario-bruto-neto.html | 0 | 414 | 41.82 | Ya compara conceptos y ejemplos con misma base; enlaces a herramientas permiten separar explicación de cálculo. Conservar. |
| /articulos/simulador-credito-automotriz.html | 1 | 561 | 50.6 | Candidato adicional por 561 impresiones: ya explica escenarios 36/48 meses, enganche, intereses y diferencia con CAT. Sin evidencia de consulta-URL que justifique cambiar su orientación. |
| /articulos/spei-devuelto-que-hacer.html | 0 | 445 | 9.16 | Ya diferencia devuelto/en devolución y evita recomendar repetir el pago sin revisar el abono. Recibe enlace desde horario SPEI. |
| /calculadoras/aguinaldo.html | 2 | 1056 | 58.64 | 147 observaciones SEMrush no son 147 oportunidades nuevas. Ya cubre fijo/variable a destajo, fechas/días, proporcional, ISR orientativo y pago recibido; distingue comisiones. Nuevo acceso con escenario desde antigüedad. No alterar por keywords de 2020/2022. |
| /calculadoras/bono.html | 33 | 1251 | 4.2 | Ya implementa porcentaje/fijo, base y total bruto, centavos y validaciones. Conservar sin incorporar bonos de inversión, ISSSTE, gobierno o carbono. |
| /calculadoras/iva-incluido.html | 1 | 681 | 60.65 | Ya explica dividir por 1+tasa, evita restar 16% al total y tiene tres ejemplos ejecutables. Conservar. |
| /calculadoras/pago-quincenal.html | 121 | 19858 | 5.07 | Conservar periodicidades y tratamiento quincena/14 días; no sustituir por una calculadora fiscal. Recibe enlace con escenario desde la guía de conversión. |
| /calculadoras/prima-vacacional.html | 2 | 478 | 60.61 | Ya incorpora tres ejemplos reales probados y enlace a guía; calcular prestación bruta y revisar ISR son intenciones complementarias. Conservar. |
| /calculadoras/propina.html | 1 | 358 | 15.85 | Ya ofrece porcentaje, pesos, total deseado, cargo incluido, reparto y redondeo. Se prueba un nuevo enlace de entrada; no reimplementar estas funciones. |
| /calculadoras/regla-tres.html | 3 | 509 | 33.45 | Se conserva la mejora de la etapa inicial: ejemplos ejecutables, fórmula directa y explicación de por qué la inversa requiere otro planteamiento. |
| /calculadoras/salario-diario.html | 171 | 30240 | 4.89 | Auditoría de oportunidades: ya ofrece cinco periodicidades, casos y distinción de base salarial. Se refuerza desde la guía de conversión, sin cambiar fuente ni módulo. |
| /calculadoras/salario-neto.html | 6 | 2130 | 31.49 | Conservar herramienta y deducciones ya trabajadas. Posición SEMrush #2 de una keyword no equivale al promedio GSC 31.49 de toda la URL. |

Salario diario (CTR calculado 0.565%) y pago quincenal (0.609%) concentran mucha visibilidad, pero el archivo no permite diagnosticar por sí solo si cada impresión sin clic se debe al snippet, a una consulta poco compatible o al tipo de resultados. Se conservan titles/H1/canonicals y contenido trabajado, se añaden accesos contextuales y se propone revisar consultas filtradas por URL antes de otro cambio.

Salario neto: la observación SEMrush #2 para «calcular sueldo bruto a neto» (vol. 2,400; KD 50; literal «28 sept») se refiere a una consulta concreta. GSC 31.49 agrega todas las búsquedas de esa URL durante el periodo, con posibles países/dispositivos y fechas distintos. Ambas cifras pueden coexistir. No se inventa una caída ni una posición actual #2.

## Investigación de otras experiencias e intenciones

Se inspeccionaron fuentes y herramientas públicas; la comparación es de contenido/funciones visibles, **no certificación de sus posiciones actuales ni prueba de sus motores**.

| Fuente | Evidencia útil | Decisión propia |
| --- | --- | --- |
| [CONDUSEF, simulador de ahorro](https://simulador.condusef.gob.mx/condusefahorro/index.php) | Ahorro inicial, adiciones y periodicidad son datos relevantes para una proyección. | Explicar supuestos y evolución; no copiar tasas de productos ni prometer rendimientos. La consulta directa de la subpágina tuvo un timeout en una verificación posterior. |
| [2POS, margen y precio](https://2pos.mx/herramientas/calculadora-de-margen) | Expone las dos direcciones del problema y diferencia margen de aumento sobre costo. | Añadir la operación inversa que faltaba; comprobar independientemente el centavo mínimo y no incorporar IVA automático. |
| [EchaCuentas, ahorro para objetivo](https://echacuentas.com/mx/calculadora-ahorro-objetivo/) | Resuelve aportación necesaria desde meta y fecha, una intención distinta. | Mantener ahorro mensual como proyección y la URL existente de ahorro-meta como destino para metas. |
| [El Contribuyente, tablas ISR 2026](https://www.elcontribuyente.mx/tablas-isr/2026/) y sus 191 registros históricos aportados | Cobertura de tarifas y posiciones históricas documentadas en la primera etapa. | Conservar las tres tarifas completas, fuentes, ejemplos y consulta de rango ya implementados. No volver a escribirlos ni copiar el contenido del competidor. |

## Canibalización, metadatos y arquitectura

Los datos aportan solapamientos de keywords, pero no una serie simultánea consulta–URL suficiente para probar sustitución perjudicial de resultados. Por eso no se fusionan ni redirigen contenidos. El reparto de intención queda así:

| Grupo | Destinos y diferencias |
| --- | --- |
| Salarios | Diario: referencia por día; hora: jornada y ofertas; quincenal: periodicidad de pago; neto: deducciones y recibo; guía: explicación y elección del método. |
| Aguinaldo | Calculadora: monto con datos; antigüedad: años de servicio y prestación anual; proporcional/meses: periodo incompleto; cómo calcular: fórmula manual. |
| Propina | Calculadora: operación y reparto; definición: significado/conceptos; cuánto dejar: escenarios voluntarios; obligatoriedad: consentimiento y actuación. |
| ISR | Guía general: concepto; artículo de periodicidades: tarifas completas; calculadora ISR: estimación; prima vacacional: exención y base gravada. |
| Negocio y ahorro | Margen: utilidad y precio desde margen; precio-venta: aumento sobre costo; ahorro-mensual: saldo futuro; ahorro-meta: objetivo y aportación. |

Se mantienen los **ocho titles/H1/canonicals** de las páginas modificadas. Cambian cuatro descripciones —ahorro, margen, hora e ISR de prima— para reflejar funciones reales; se sincronizan descripción social y datos estructurados. No se vende la descripción como garantía de CTR. Hay 51 respuestas FAQ verificadas en HTML visible de los 11 archivos modificados, excluyendo el propio JSON-LD al comprobar visibilidad. Tener FAQ válido no garantiza un resultado enriquecido en Google.

La arquitectura sigue con home a profundidad 0, 65 rutas a un clic y 313 a dos clics; ninguna huérfana. Los enlaces de escenarios aportan utilidad aunque el conteo de dominios/páginas entrantes no crezca cuando ya existía un enlace entre los mismos destinos. La limpieza de un bloque ajeno en ISR de prima reduce un enlace entrante redundante a antigüedad (37→36); sigue descubierta y enlazada. Se actualiza `lastmod` solo para los ocho destinos modificados en los dos sitemaps.

## Validación y rendimiento: lo observado

| Comprobación | Resultado |
| --- | --- |
| `node scripts/build-public.cjs` | PASS, 495 archivos; documentación y datos internos excluidos. |
| `node scripts/test-seo-gsc.cjs` | PASS, 107 comprobaciones de fórmulas, límites, eventos, ejemplos y enlaces con adaptador mínimo. |
| `python3 scripts/check-seo-gsc.py` | PASS, 17 archivos protegidos, 24 CSS intactos, 51 FAQ visibles, referencias UMA y estructura. |
| `node scripts/test-seo-integral.cjs` | PASS, 132 valores de tarifas, 66 límites, 12 casos Bono, 26 entradas inválidas y 13 ejemplos previos. |
| `node scripts/test-seo-semrush.cjs` | PASS, tres ejemplos de prima y cinco enlaces anteriores. La prueba GSC también comprueba ahorro con su nuevo módulo real. |
| `python3 scripts/check-seo-semrush.py` | PASS, 18 archivos protegidos de etapa anterior, tabla de salario mínimo y datos SEMrush. |
| Auditoría integral y técnica / fase 6 | 379 indexables/sitemap, cero duplicados de title/description detectados, cero enlaces rotos, huérfanos y omisiones de sitemap. |
| Fase 4 de temas | PASS, 13 relaciones corregidas conservadas; 359 artículos/calculadoras en 12 directorios temáticos. |
| Monetización estática | 407 páginas con las dos unidades existentes de Adsterra y ambos afiliados; código de integración preservado. |
| Revisión del diff | Código y HTML sin errores de whitespace. Se conservan 14 avisos de espacios finales dentro de consultas originales en dos CSV; no se modificaron los datos para ocultarlos. |
| ZIP extraído y compilado desde cero | PASS, 495 archivos públicos idénticos byte a byte; 2,365 archivos originales conservados. |
| Navegador, móvil, entrega de anuncios y CWV | Pendiente por bloqueo del entorno; no se declara aprobado. |

La primera pasada detectó tres fragmentos rotos al reorganizar ISR de prima. Se corrigieron antes de la segunda pasada. La revisión también detectó que un script con salto de línea no había sido retirado de salario por hora; se corrigió y se añadió una aserción para evitar su reintroducción en las tres calculadoras con módulo específico.

Reducción verificable de **JS local referenciado en HTML**: ahorro 95,284→68,892 bytes (**−26,392**), margen 95,284→68,496 (**−26,788**), hora 99,960→71,320 (**−28,640**). En prima se añaden 2,171 bytes para el separador; en antigüedad 1,380 para validación y transferencia. Los 24 CSS fuente permanecen idénticos. Las tablas nuevas reutilizan contenedores responsivos y semántica accesible existentes; no hay nuevo diseño ni fuentes o librerías de terceros.

Estos son pesos estáticos, no ahorros de descarga reales en cada visita ni mejoras medidas de LCP/INP/CLS. La tabla mensual puede tener hasta 600 filas y solo se genera después del cálculo; verificar su interacción real en móvil sigue pendiente. El navegador local falló previamente por `socket() failed: Operation not permitted` / `process_singleton_posix`; la alternativa de vista local tampoco estaba autorizada por el entorno. No se eludió ese bloqueo. No hay capturas visuales ni mediciones de campo nuevas.

## Fuentes fiscales, laborales y de consumo

Consultadas para el alcance concreto del cambio, sin extrapolar importes de otro ejercicio:

- [INEGI, UMA 2026](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf): $117.31 diarios desde el 1 de febrero de 2026.
- [INEGI, valores históricos UMA](https://www.inegi.org.mx/temas/uma/): $113.14 en 2025, referencia anterior a la entrada en vigor de la UMA 2026.
- [SAT, artículo 93](https://wwwmat.sat.gob.mx/articulo/15199/articulo-93): condiciones de exención y excedente. [FAQ SAT de anual PF 2025](https://www.sat.gob.mx/minisitio/DeclaracionAnual/Personas/documentos/PreguntasFrecuentes_AnualPF2025.pdf): referencia de 15 UMA; sus importes de 2025 no se trasladan a febrero 2026.
- [PROFEDET, aguinaldo](https://www.profedet.gob.mx/micrositio/index.php/aguinaldo): mínimo anual y proporcional. El contenido fue recuperable en búsqueda; una apertura directa devolvió bucle de redirección. No se afirma disponibilidad HTTP continua.
- [PROFEDET, FAQ](https://www.profedet.gob.mx/profedet/archivos/Preguntas_frecuentes_AGUINALDO_2020.pdf): distinción de bases en destajo y vendedores, usada para revisar la cautela ya existente; no como fuente de importes fiscales 2026.
- [Profeco, restaurantes y bares, 15 febrero 2026](https://www.gob.mx/profeco/prensa/profeco-recuerda-a-la-poblacion-consumidora-sus-derechos-en-restaurantes-y-bares?idiom=es): consentimiento, propina voluntaria y ticket.
- [Banxico, portal CEP](https://www.banxico.org.mx/cep/): fecha requerida, datos de consulta y horario del portal.

## Archivos y continuidad

Contenido: tres calculadoras (`ahorro-mensual`, `margen-ganancia`, `salario-hora`); cinco artículos (`aguinaldo-por-antiguedad`, `isr-prima-vacacional`, `que-es-propina`, `horario-transferencias-spei`, `convertir-salario-mensual-diario-hora`) y tres fallbacks sincronizados. Código: tres módulos nuevos (`ahorro-mensual.js`, `margen-ganancia.js`, `prima-exenta.js`), dos módulos ampliados (`salario-hora-focus.js`, `aguinaldo-antiguedad-focus.js`), dos sitemaps, scripts de análisis/pruebas/informe y documentación. El listado completo está en `archivos-modificados.csv`.

Datos entregados en esta carpeta:

- `datos-verificados.json` y siete `gsc-*.csv`: referencia histórica sin mezclar ámbitos.
- `matriz-url-keyword.csv`: 1,327 filas con posición/volumen/KD/fecha SEMrush y datos GSC por URL; 62 filas indican que falta keyword propia.
- `decisiones-186-urls.csv`: estado y motivo de cada URL analizada.
- `mapa-379-urls-gsc-semrush.csv`: mapa temático completo; keywords principales propuestas editorialmente, no atribución ficticia de consultas.
- `oportunidades-implementadas.csv`, `metadatos-antes-despues.csv`, `recursos-antes-despues.csv`, `auditoria-despues.json`: cambios y evidencia.
- `validation-calculations.json`, `validation-preservation-data.json` y manifiestos de preservación: resultados reproducibles.

Los informes completos de ISR/Bono/global y de la ampliación SEMrush siguen en `docs/seo-integral-2026-11-09/INFORME_SEO_INTEGRAL.md` y `docs/seo-semrush-2026-11-10/INFORME_SEO_COMPLETO.md`. Sus recuentos de cambios son de esas etapas; no se suman como si todas las URLs fueran distintas ni como si todo ese trabajo se hubiera rehecho ahora.

El diff acumulado desde el ZIP original afecta **66 destinos canónicos y 71 HTML fuente**. Incluye mejoras de distinta profundidad y limpiezas editoriales de etapas previas; no son 66 calculadoras nuevas ni 66 optimizaciones funcionales. La comprobación del paquete está en `validation-package.json`.

## Pendientes y medición tras publicar

1. Publicar la versión validada y registrar fecha, hora y commit desplegado. Después comprobar respuestas HTTP, canonicals y recursos en el dominio real; los controles actuales son locales.
2. En un navegador permitido, comprobar 375/390 px, tablet y escritorio: campos ocultos, navegación por teclado, foco, tablas, estado tras editar, reinicio, carga de enlaces y publicidad real sin hacer clic en anuncios propios. Revisar CLS con anuncios presentes y bloqueados y comportamiento con almacenamiento previo.
3. Ejecutar Lighthouse/PageSpeed como laboratorio y consultar CrUX/Search Console cuando haya datos suficientes. Informar por separado LCP/INP/CLS de campo, fecha, dispositivo y cobertura. La reducción de JS no sustituye estas mediciones.
4. Obtener consultas GSC filtradas por cada URL prioritaria. Separar México/otros países y móvil/escritorio cuando el volumen permita hacerlo. Confirmar las long-tails hipotéticas y la relevancia de los snippets antes de cambiar titles protegidos.

Plan propuesto; **no hay recordatorios ni automatizaciones creados**:

| Momento desde publicación | Comparación | Qué decidir |
| --- | --- | --- |
| D+14 | Primeros 14 días completos frente a los 14 previos, mismos días de semana y filtros; registrar fecha de rastreo. | Detectar errores de despliegue, pérdida brusca, consultas inesperadas y funcionamiento de ejemplos. No atribuir variaciones pequeñas al cambio. |
| D+28 | Ventana de 28 días frente a la anterior; por URL y consulta, dispositivo y país; clicks, impresiones, CTR, posición y número de consultas observadas. | Validar cobertura de ahorro/hora/margen y respuestas informativas. Comparar CTR solo en consultas/posiciones comparables. |
| D+56 | Segunda ventana de 28 días frente a primera y base previa, con mismo método. | Sostener mejoras útiles; investigar regresiones y decidir nuevos cambios con evidencia. |

No extrapolar el promedio del periodo agosto–noviembre como base de una ventana corta. Guardar las exportaciones futuras con filtros y fecha; excluir días aún preliminares. Aguinaldo cambia mucho por temporada noviembre/diciembre: una subida puede reflejar demanda, y una caída posterior también. Considerar consultas equivalentes, páginas conservadas y estacionalidad, sin asumir que son un grupo de control causal perfecto. Registrar publicaciones simultáneas y cambios en anuncios.

**Resultado de esta entrega:** código y pruebas disponibles; utilidad y exactitud mejoradas donde se acreditó una brecha. Impresiones, clics, CTR y rankings posteriores siguen pendientes de medición.
