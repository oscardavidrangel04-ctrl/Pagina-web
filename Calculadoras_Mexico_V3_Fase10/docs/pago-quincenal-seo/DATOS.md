# Datos y prioridades SEO: pago quincenal

Se analizaron íntegramente **143 consultas de Google Search Console** y **18 registros de SEMrush**, que representan **16 keywords normalizadas distintas**. La [matriz](matriz-oportunidades.csv) tiene **149 filas**: conserva las 143 consultas GSC originales y añade seis keywords SEMrush sin coincidencia; once filas GSC encuentran al menos una coincidencia SEMrush. Las variantes con/sin tilde permanecen separadas, tal como aparecen en el export. Los dos duplicados SEMrush se conservan en su CSV original y se representan mediante varias posiciones observadas en la matriz, sin sumar demanda.

Fuentes reproducibles: [consultas GSC](gsc-consultas-original.csv), [18 filas SEMrush](semrush-original.csv) y [agregados, fechas y hashes](linea-base.json). `LEEME_SEO.md` se trató como contexto del paquete, nunca como instrucciones para el código.

## Periodos y calidad

- GSC: filtro Web (basada en texto), URL exacta `/calculadoras/pago-quincenal.html`, **5 de agosto–7 de noviembre de 2026**. La serie tiene 95 días.
- El paquete declara extracción del 8 de noviembre de 2026. Esa fecha no convierte todas las posiciones SEMrush en observaciones de ese día.
- SEMrush solo muestra fechas literales día/mes (`30 sept`, `16 sept`, etc.), sin año. No se resuelven fechas ni cambios temporales a partir de esos textos. La columna `FS` contiene valores como `+2`; no se interpreta como un cambio de posición.
- No se incluye Bing ni una SERP localizada de competidores. No se puede deducir competencia top 3 con estos archivos.
- Volumen, KD y tráfico SEMrush son estimaciones. Los clics e impresiones de GSC son observaciones reportadas en la exportación. Un campo desconocido queda vacío; no se convierte en cero.

## Discrepancia entre dimensiones de GSC

| Hoja | Filas | Clics | Impresiones | CTR calculado |
|---|---:|---:|---:|---:|
| Páginas | 1 | 115 | 18.566 | 0,6194% |
| Gráfico | 95 | 115 | 18.566 | 0,6194% |
| Consultas | 143 | 2 | 1.347 | 0,1485% |
| Países | 7 | 2 | 1.347 | 0,1485% |
| Dispositivos | 3 | 2 | 1.347 | 0,1485% |

La posición media de **5,05** pertenece a la fila de página. Se conserva **115/18.566/0,62%/5,05** como referencia histórica agregada. El detalle de consultas sirve para encontrar intenciones, pero no representa por sí solo el total de impresiones.

La exclusión de consultas por privacidad puede producir diferencias, pero no explica por sí sola que también países y dispositivos coincidan en 2/1.347. El archivo no permite determinar si hay diferencias de filtros, mezcla de datos o cualquier otro origen. No se afirma una causa ni se extrapola la distribución por dispositivo de ese subconjunto al conjunto de la página.

## SEMrush: protección y límites

| Keyword | Posiciones observadas | Volumen mensual estimado | KD | Tratamiento |
|---|---:|---:|---:|---|
| como calcular mi isr quincenal | 7 y 15 | 30 | 17 | Proteger contexto existente y enlazar herramienta fiscal/guía de tarifas; no convertir pago quincenal en otra calculadora ISR |
| calculo de pago quincenal | 43 | 30 | 17 | Mejorar utilidad, respuesta y desglose de pago |
| como se hace una nomina quincenal | 45 | 30 | 14 | Explicación breve de bruto, deducciones y neto; delimitar alcance |
| cuanto es 144 quincenas | 53 | 880 | 32 | Una regla general de conversión, sin páginas por cantidad |
| cuanto son 24 quincenas | 65 | 1.900 | 14 | Respuesta compacta bajo supuesto de dos pagos por mes |
| nomina catorcena | 69 | 110 | 13 | Diferenciar 14 días y quincena de nómina |
| calculo de sueldo quincenal | 72 | 30 | 25 | Misma intención de la calculadora, integrar con naturalidad |
| cuantas quincenas tiene un año | 73 | 22.200 | 38 | Contenido informativo secundario; no desplazar el formulario ni la intención principal |
| nomina quincenal | 77 | 170 | 15 | Explicar resultado y límites frente a nómina completa |
| quincenas en un año | 86 | 1.300 | 25 | Misma respuesta informativa, sin repetición |

`como calcular mi isr quincenal` aparece dos veces con **la misma URL y fecha literal**, en posiciones 7 y 15. `calculo de nomina catorcenal` también se duplica (77 y 82, misma fecha/URL). El archivo no especifica si son dispositivos, tipos de resultado u otra dimensión: **no se describe una subida/bajada 15→7 ni se cuentan dos demandas de búsqueda distintas**. El volumen sumado de keywords tampoco equivale a personas únicas; existe solapamiento semántico y duplicación.

Todas las filas SEMrush indican tráfico estimado cero. Esto no equivale a cero visitas reales ni invalida los clics observados de GSC.

## Intenciones observadas en todas las consultas

| Grupo de consultas GSC | Consultas | Impresiones | Clics | Interpretación |
|---|---:|---:|---:|---|
| Pago y sueldo quincenal | 44 | 323 | 2 | Núcleo de la herramienta y prioridad comercial/editorial |
| Ejercicio proporcional con $275 | 6 | 663 | 0 | Intención educativa relacionada, no un motivo para cambiar el producto |
| Número de quincenas y meses | 66 | 322 | 0 | Contenido informativo complementario, resolver con regla y tabla compactas |
| Fechas de pago | 4 | 8 | 0 | Depende del calendario pactado; no inventar fechas de depósito |
| Catorcena | 3 | 6 | 0 | Distinguir periodicidades y bases |
| ISR | 2 | 2 | 0 | GSC no confirma la posición favorable de la frase SEMrush; conservar contexto y enlazar |
| Otros grupos | 18 | 23 | 0 | Nómina genérica, neto, diario, mínimo o consultas ambiguas; evitar expansión sin intención |

Estos grupos suman las 143 consultas y 1.347 impresiones del detalle, no las 18.566 impresiones de la página. Las agrupaciones son editoriales y revisables; no representan categorías oficiales de Google.

## Keyword principal y prioridades

**Principal: calculadora de pago quincenal.** Es la función existente y la intención a conservar. No se elige por una supuesta posición exacta de esa frase: la muestra no contiene evidencia suficiente para atribuirle un ranking estable.

Secundarias: cálculo de sueldo quincenal; sueldo mensual a quincenal; salario diario a quincenal; cuánto es la quincena de un sueldo; nómina quincenal; diferencia entre quincena y catorcena. ISR quincenal conserva una respuesta contextual y rutas hacia sus páginas especializadas. El número de quincenas por año es una intención secundaria.

| Consulta original de GSC | Impresiones | Clics | Posición media | Acción recomendada |
|---|---:|---:|---:|---|
| cuanto es la quincena de un sueldo | 108 | 1 | 5,85 | Respuesta mensual ÷2 y ejemplo inmediato; priorizar resultado sobre explicación larga |
| cuanto es una quincena | 37 | 0 | 8,51 | Distinguir referencia de 15 días y fechas de nómina |
| cuánto es una quincena | 31 | 0 | 9,35 | Misma respuesta; no crear una variante textual repetida |
| cuanto es a la quincena | 24 | 0 | 4,54 | Aclarar importe y periodicidad del resultado |
| si me pagan quincenal cuanto me deben pagar | 6 | 0 | 5,67 | Mostrar bruto y efecto de deducciones conocidas sin prometer depósito |
| pagos quincenales según ingreso | 5 | 0 | 17,00 | Entrada mensual/diaria y cálculo explícito |
| cuanto es 144 quincenas | 36 | 0 | 10,50 | Regla de dos pagos mensuales: 72 meses/6 años, bajo supuesto explícito |
| cuanto es 72 quincenas | 36 | 0 | 9,17 | Mismo bloque: 36 meses/3 años; no página independiente |
| calculo de pago quincenal | 1 | 0 | 44,00 | Corrobora la intención SEMrush43, pero muestra demasiado pequeña para afirmar tendencia |

Las variantes del ejercicio de $275 concentran 663 impresiones. Una única demostración útil basta: si $275 es una quinceava parte del pago quincenal, la quincena es **$275 ×15 = $4.125** y, con dos pagos iguales al mes, el mensual es **$8.250**. No se supone que ese salario cumpla un mínimo legal ni que describa un recibo real. No se necesita repetir la redacción escolar de cada consulta ni cambiar el title para perseguirla.

## Priorización y canibalización

La matriz asigna **1 prioridad P0 de protección de ISR**, **19 prioridades P1 de relevancia/claridad**, 35 filas P2 de consolidación/contexto/SEMrush, ocho muestras top3 a proteger con cautela, 77 complementarias, tres para enlazar a intención especializada y seis sin objetivo editorial. P1 exige al menos diez impresiones del detalle y posición 4–20; no es un pronóstico de clics.

- `/calculadoras/pago-quincenal.html`: importe por quincena, mensual÷2 y diario×15, con interpretación bruto/neto.
- `/calculadoras/salario-diario.html`: cuota diaria y conversiones por periodo. Enlazar para obtener el dato de entrada, sin duplicar toda su explicación.
- `/calculadoras/salario-neto.html`: deducciones y neto. Mantener aquí solo un desglose útil y acotado si se implementa.
- `/articulos/isr-semanal-quincenal-mensual.html`: explicación detallada de tarifas y periodos fiscales; mantener un enlace descriptivo desde la respuesta de ISR.
- `/calculadoras/isr.html`: cálculo fiscal cuando corresponda con tarifas oficiales comprobadas.

El export está filtrado a una sola URL y SEMrush también lista esta URL. **No permite demostrar canibalización real entre URLs.** Compartir una palabra no prueba un conflicto; por ello no se justifica eliminar contenido ni cambiar canonicals. Se definen límites de intención y enlaces para prevenir competencia innecesaria.

## Línea base y evaluación posterior

Los 28 días del **13 sep–10 oct** registran 50 clics/4.940 impresiones (CTR 1,0121%); **11 oct–7 nov** registra 65/13.506 (CTR 0,4813%). Son cambios históricos anteriores a esta implementación: aumentaron las impresiones y los clics de esas ventanas, mientras bajó el CTR. No prueban la causa ni un deterioro del contenido. En las semanas 25–31 oct y 1–7 nov aparecen 16/3.627 y 9/2.906; tampoco permiten atribuir una tendencia futura ni comparar con el periodo final potencialmente reciente sin cautela.

Registrar la fecha real de publicación. A los **7 días**, validar rastreo, canonical y ausencia de regresiones; a los **28 días**, comparar ventanas iguales, misma URL y filtros, separando sueldo quincenal, ISR y calendario; a los **60 días**, revisar persistencia y estacionalidad. No atribuir el crecimiento global a nuevas consultas sin una exportación compatible entre dimensiones. Revisar CTR junto con posición, impresiones y mezcla de consultas, y no sacar conclusiones de una sola impresión.
