# Salario neto: análisis íntegro de GSC y SEMrush

Fecha del análisis: 9 de noviembre de 2026. URL: `https://calculadora-isr-mexico.vercel.app/calculadoras/salario-neto.html`.

Se analizaron las ocho hojas de Search Console y los 86 registros de la hoja SEMrush. El TXT original del paquete contiene todas las keywords transcritas al XLSX; se conservan sus archivos de origen identificados por SHA-256 en [linea-base.json](linea-base.json). El LEEME del ZIP se trató como contexto de procedencia, no como instrucciones de edición.

La [matriz de oportunidades](matriz-oportunidades.csv) contiene **304 filas**: las **300 consultas GSC** originales y cuatro keywords SEMrush sin coincidencia normalizada. **78 filas GSC** encuentran alguna coincidencia SEMrush. No se fusionan consultas originales con/sin acento ni se borran muestras pequeñas. La matriz distingue acciones recomendadas, acciones de esta implementación y medición pendiente.

Fuentes tabulares preservadas: [GSC original](gsc-consultas-original.csv) y [SEMrush original](semrush-original.csv). Las celdas desconocidas quedan vacías; `n/d` de KD permanece sin convertir en cero.

## Periodos, filtros y alcance

- **GSC:** búsqueda Web (basada en texto), URL exacta, del **5 de agosto al 7 de noviembre de 2026**, 95 fechas en Gráfico. La hoja Filtros no declara filtro adicional de país o dispositivo.
- **SEMrush:** la columna Actualizado contiene fechas como `28 sept`, `29 sept`, `07 oct`, sin año, y relativas como `1 día`, `2 días`, `4 días`. El LEEME declara extracción el 8 de noviembre, pero no permite reconstruir con certeza cuándo se consultó cada dato de origen. No se convierten las fechas relativas en una serie histórica.
- No consta en las columnas aportadas la base geográfica ni el dispositivo de SEMrush. La URL mexicana no prueba por sí sola que la captura use exactamente la misma población y configuración que GSC.
- La columna `FS` con valores `+2` o `+3` no se interpreta como cambio de ranking. No se inventa una evolución de posiciones.
- No hay export de Bing en este paquete ni una SERP localizada que certifique el Top 3 actual de competidores.

## Discrepancia interna de GSC

| Hoja | Filas de datos | Clics | Impresiones | CTR calculado |
| --- | ---: | ---: | ---: | ---: |
| Páginas | 1 | 6 | 2.087 | 0,2875% |
| Gráfico | 95 | 6 | 2.087 | 0,2875% |
| Consultas | 300 | 2 | 947 | 0,2112% |
| Países | 9 | 2 | 947 | 0,2112% |
| Dispositivos | 3 | 2 | 947 | 0,2112% |
| Aparición en búsquedas | 0 | — | — | — |

La posición media **31,59** corresponde al agregado de página. Se conserva la referencia histórica **6 clics / 2.087 impresiones / 0,29% / 31,59**, sin reemplazarla por la suma de consultas.

La omisión de consultas por privacidad puede producir discrepancias, pero no explica por sí sola que también Países y Dispositivos coincidan en el subconjunto 2/947. No se puede demostrar si hay filtros diferentes, una mezcla de datos u otra causa. No se atribuye una causa inventada ni se extrapola la distribución del detalle al agregado.

En el subconjunto, México registra 2 clics/939 impresiones; los otros ocho países, una impresión cada uno. Ordenador registra 842 impresiones, móvil 103 y tablet 2. La posición móvil 8,21 y ordenador 65,03 no demuestra que el diseño móvil posicione mejor: las consultas y su mezcla pueden ser diferentes, y faltan cruces consulta × dispositivo comparables.

## SEMrush: 86 registros, 80 keywords normalizadas

| Grupo de posición | Registros SEMrush | Consultas GSC | Impresiones GSC del detalle |
| --- | ---: | ---: | ---: |
| 1–3 | 1 | 15 | 21 |
| 4–10 | 0 | 23 | 64 |
| 11–20 | 1 | 19 | 80 |
| 21–50 | 3 | 41 | 177 |
| 51–100 | 81 | 202 | 605 |

Las 15 consultas GSC en top 3 solo suman 21 impresiones y cero clics: son muestras muy pequeñas para describir una posición estable. Tampoco las 202 consultas de posiciones 51–100 justifican perseguir todas sus variantes.

**Corrección de la referencia de tráfico:** la fila «calcular sueldo bruto a neto» aporta **312 visitas estimadas** y la fila «salario bruto y neto» aporta **1**. La suma de las 86 filas es **313**, no 312 para todo el archivo. Ninguna de esas cifras equivale a sesiones medidas ni clics observados de Google. El porcentaje 99,68% corresponde a la primera fila.

La posición **2** de SEMrush para «calcular sueldo bruto a neto» y la posición media **22,61** de GSC para esa frase no son directamente comparables: SEMrush es una observación estimada con fecha literal y dimensiones incompletas; GSC es un promedio de 95 días en el filtro de página. No se puede declarar que alguna fuente está equivocada, que se perdió el puesto 2, ni que los 312 estimados deberían aparecer como clics en este export.

Duplicados normalizados:

| Keyword | Posiciones observadas | Tratamiento |
| --- | --- | --- |
| salario despues de impuestos mexico | 39 / 47 | Misma URL y fecha literal; conservar ambas, sin inferir cambio temporal |
| salsrio neto | 59 / 83 | Conservar datos; no introducir la errata artificialmente en el contenido |
| salario neto y bruto calculadora | 75 / 84 | Misma intención, sin duplicar volumen |
| pago neto | 79 / 85 | Fecha relativa idéntica, sin inferir tendencia |
| calcular salario neto a bruto | 89 / 90 | Remitir al cálculo inverso existente |
| calculadora de salario base de cotizacion/cotización | 93 / 94 | Acentos distintos, volúmenes 90/140 y KD 19/17; no sumar ni tratar como observación idéntica |

## Keyword principal e intenciones

**Principal: calculadora de sueldo neto en México, de bruto a neto.** Coincide con el title actual y la función de comprobar un recibo. La frase histórica «calcular sueldo bruto a neto» se protege manteniendo la intención, el title/H1 y la explicación directa; la muestra no justifica un reemplazo agresivo del título.

Secundarias pertinentes: calcular sueldo neto a partir del bruto; salario bruto a neto; cómo calcular ingreso neto; salario bruto y neto; sueldo neto mensual/quincenal/semanal; deducciones de nómina; diferencia entre neto calculado y depósito. Las búsquedas ISR se atienden mediante contexto y enlaces especializados. La herramienta no debe prometer un cálculo automático de impuestos si utiliza importes capturados.

Agrupación editorial de las 300 consultas; no son categorías de Google:

| Intención | Consultas | Impresiones | Clics |
| --- | ---: | ---: | ---: |
| Cálculo bruto a neto | 96 | 441 | 1 |
| Sueldo bruto | 29 | 75 | 1 |
| Conversión inversa | 18 | 98 | 0 |
| ISR e impuestos | 48 | 101 | 0 |
| Diferencia bruto/neto | 20 | 42 | 0 |
| Importes concretos bruto a neto | 16 | 17 | 0 |
| Deducciones del recibo | 3 | 8 | 0 |
| Nómina general | 14 | 25 | 0 |
| Conversión diaria/anual | 9 | 22 | 0 |
| Salario genérico/ambiguo | 33 | 94 | 0 |
| Otras fechas o marcas | 11 | 21 | 0 |
| SBC/SDI | 3 | 3 | 0 |

La mayoría de variantes por importe tiene una impresión. La tabla existente de cuatro ejemplos permite explicar los supuestos sin crear ocho secciones ni publicar retenciones ficticias. Los términos «2022», «2023», «Runa», «Calculanet» o «sin nube» no justifican ampliar esta calculadora para cubrir años pasados o marcas de terceros.

## Prioridades y acciones concretas

| Keyword | Posición GSC | Impresiones/clics GSC | Posición SEMrush / volumen / KD | Acción de la intervención | Métrica posterior |
| --- | ---: | --- | --- | --- | --- |
| calcular sueldo bruto a neto | 22,61 | 23 / 0 | 2 / 2.400 / 50 | Proteger title, H1 e intención; modos explícitos de deducciones y resultado verificable | Posición/CTR de esta consulta con misma URL y filtros |
| salario bruto a neto | 16,41 | 27 / 0 | 92 / 9.900 / 46 | Mejorar recorrido bruto → descuentos → neto y validar importes | Impresiones, clics y posición media |
| calcular sueldo neto a partir del bruto | 13,78 | 23 / 0 | — | Mostrar la resta y desglose sin convertir datos ausentes en impuestos calculados | CTR junto con posición |
| como calcular un sueldo bruto a neto | 4,53 | 15 / 0 | — | Deducciones desglosadas o total, evitando doble descuento | Proteger posición y medir clics |
| como calcular sueldo bruto a neto | 10,00 | 13 / 0 | 93 / 40 / 27 | Mismo flujo útil, sin repetir una sección por variante | Entrada a primera página y CTR, pendientes de medir |
| como calcular ingreso neto | 14,00 | 1 / 0 | 11 / 40 / 22 | Aclarar neto salarial, otros pagos conocidos y conciliación del depósito | Evolución con más muestra; no concluir desde una impresión |
| salario bruto y neto | 24,00 | 3 / 0 | 22 / 1.300 / 15 | Fórmula y diferencia breve; conservar guía informativa enlazada | Consulta × página para detectar reparto de intención |
| calcular sueldo neto a bruto | 9,80 | 10 / 0 | 88 / 50 / 27 | Conservar enlace al cálculo inverso; no duplicarlo | Rendimiento conjunto de ambas URLs, si se obtiene export compatible |
| calcular sueldo neto | 45,58 | 19 / 1 | 85 / 1.300 / 54 | Metadescripción veraz y utilidad del recibo, sin prometer nómina automática | Clics/impresiones, junto con posición |

La matriz asigna **1 P0**, **4 P1**, **2 P2**, **103 P3**, **15 protecciones cautas**, **121 filas para enlazar una intención especializada** y **58 para no expandir/contextualizar**. P1 exige diez impresiones y posición GSC 4–20 en una intención directamente pertinente. Esta selección es editorial, no un pronóstico de visitas o ingresos.

## Qué ya existía y qué se evita repetir

La página ya tenía title y H1 enfocados en bruto a neto, mensual/quincenal/semanal, comparación de depósito, cuatro ejemplos de descuentos hipotéticos, FAQs, fórmula, guía de copiado del recibo y enlaces a ISR e inversa. Volver a añadir la misma información no ofrece una ventaja identificable.

La intervención se orienta a una mejora funcional: elegir **deducciones separadas o total conocido**, sin sumarlos dos veces; mostrar el desglose y contemplar otros pagos conocidos al conciliar el depósito; validar importes y trabajar en centavos. La metadescripción se alinea con ese alcance y se preservan los elementos cuya sustitución supondría un riesgo innecesario. Las pruebas y resultados de implementación se documentan en el informe general; esta matriz no certifica por sí sola el código.

No se solicitan automatismos de ISR, IMSS o subsidio como consecuencia de una keyword. Añadirlos requeriría validar tarifas, base gravable, SBC, exenciones, subsidio y fecha de aplicación; un salario bruto aislado no contiene todos esos datos.

## Canibalización y limitaciones

Los exports solo contienen la URL de salario neto. No permiten demostrar que Google alterne dos URLs del sitio para la misma consulta. Un duplicado SEMrush con la misma URL tampoco demuestra canibalización.

- Salario neto: importe después de deducciones y comprobación del recibo.
- Salario bruto: cálculo inverso con los datos que corresponden a su alcance.
- Artículo salario bruto/neto: explicación conceptual.
- Salario diario y pago quincenal: conversión por periodos; preservar las mejoras anteriores.
- ISR y guía de tarifas: retención y periodos fiscales.
- SDI/SBC: conceptos laborales y de cotización, distintos del bruto capturado.

Se conservan esos límites y enlaces. No hay fundamento para fusiones, redirecciones o cambios de canonical. El CTR bajo puede deberse a posición, mezcla de consultas e intención; el archivo no contiene un registro histórico de funciones SERP para afirmar otra causa.

## Seguimiento

Ventanas históricas comparables: **13 septiembre–10 octubre: 4 clics/1.232 impresiones, CTR 0,3247%**; **11 octubre–7 noviembre: 2 clics/774 impresiones, CTR 0,2584%**. Ambas preceden esta implementación. Las muestras pequeñas y las diferencias de consultas impiden atribuir el cambio a una causa concreta.

Registrar la fecha real de despliegue. A los **7 días**, revisar URL, canonical, rastreo y errores funcionales. A los **28 días**, comparar ventanas iguales con los mismos filtros y grupos de intención, sin mezclar los 6/2.087 agregados con el detalle 2/947. A los **60 días**, evaluar persistencia y estacionalidad, y comprobar especialmente la frase protegida antes de nuevos cambios de title. Resolver la discrepancia del export con datos compatibles cuando estén disponibles; no se necesita pedir de nuevo los archivos actuales.
