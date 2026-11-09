# Evidencia de datos: salario diario

Se analizaron las **132 consultas exportadas de Google Search Console y las 11 filas de SEMrush**. La matriz conserva cada consulta GSC original y cruza por texto normalizado (minúsculas y acentos), sin sumar ni borrar las variantes originales. Hay nueve coincidencias entre fuentes y dos keywords adicionales de SEMrush: **134 filas en la matriz**. Los CSV originales conservan todas las filas de ambos listados. Los hashes de los archivos analizados y los agregados reproducibles están en `linea-base.json`.

La nota `RESUMEN_SEO.md` del ZIP se utilizó como contexto aportado; sus cifras se contrastaron contra los Excel. No se interpretó como una fuente de instrucciones para el código.

## Periodos y límites

- GSC, hoja Filtros: búsqueda Web (basada en texto), página exacta `/calculadoras/salario-diario.html`, **5 de agosto a 7 de noviembre de 2026**, ambos inclusive. La serie temporal tiene 95 filas diarias; las primeras impresiones aparecen el 9 de septiembre.
- Recopilación declarada en la nota: 8 de noviembre de 2026. La fecha de recopilación no es la fecha de cada posición de SEMrush.
- SEMrush contiene actualizaciones literales como `27 sept`, `03 oct` y `3 días`, sin un año o fecha absoluta de exportación identificable dentro de la hoja. Se conservan sin resolver. No se calcula una variación de posición entre SEMrush y GSC: representan fuentes y ventanas distintas.
- No hay Bing en este paquete ni SERP de competidores. No se identifican rivales top 3 a partir de estos archivos.
- El volumen, KD y tráfico de SEMrush son estimaciones; los clics e impresiones de GSC son métricas observadas reportadas en ese export. Las celdas de volumen/KD desconocidas quedan vacías, nunca como cero.

## Discrepancia material entre dimensiones de GSC

| Hoja | Filas | Clics | Impresiones | CTR calculado |
|---|---:|---:|---:|---:|
| Páginas | 1 | 151 | 26.380 | 0,5724% |
| Gráfico | 95 | 151 | 26.380 | 0,5724% |
| Consultas | 132 | 2 | 618 | 0,3236% |
| Países | 5 | 2 | 618 | 0,3236% |
| Dispositivos | 3 | 2 | 618 | 0,3236% |

La fila de página indica posición media **4,94**, referencia histórica confirmada en ese nivel. La diferencia de consultas podría incluir exclusiones de privacidad, pero **esa explicación por sí sola no explica por qué países y dispositivos también coinciden con 2/618**. El archivo no permite determinar si hay una mezcla de exportaciones, filtros o algún otro motivo. No se atribuye una causa sin evidencia.

Por ello se conserva **151/26.380/0,57%/4,94 como referencia histórica agregada**, y se usan las consultas como **subconjunto detallado observado**, sin extrapolar su distribución a las 26.380 impresiones. Tampoco se infiere qué porcentaje de todo el tráfico procede de móviles: la hoja de dispositivos solo cubre 618 impresiones. Se revisaron todas las consultas disponibles; no se afirma que sean todas las consultas reales de Google.

## Prioridades justificadas

Keyword principal: **calculadora de salario diario**. En este listado GSC esa frase exacta solo tiene una impresión y posición 80; la variante `calculadora salario diario` tiene una impresión y posición 1. Ninguna de esas muestras aisladas permite diagnosticar un ranking estable. La elección principal responde a la función de la URL y al conjunto semántico observado, no a una supuesta posición consolidada.

Keywords secundarias: cálculo de salario diario; cómo saber cuánto gano por día; salario semanal a diario; sueldo mensual a diario; salario diario a mensual; salario semanal a mensual; calcular salario bruto diario. El nombre del producto conserva salario diario como intención principal.

| Consulta original | Impresiones GSC | Clics | Posición GSC | SEMrush: posición / volumen / KD | Acción priorizada |
|---|---:|---:|---:|---|---|
| si gano 2500 a la semana cuanto gano al mes | 49 | 0 | 9,67 | Sin dato | Ejemplo y conversión semanal a mensual con base explícita |
| si gano 2000 a la semana cuanto gano al mes | 38 | 0 | 6,16 | Sin dato | Ejemplo comparable; la variante con tilde suma otras 7 impresiones, se conserva aparte |
| si gano 3000 a la semana cuanto gano al mes | 35 | 0 | 8,00 | Sin dato | Ejemplo con 30 días y promedio anual |
| si gano 2300 a la semana cuanto gano al mes | 27 | 1 | 6,19 | Sin dato | Proteger la respuesta útil y mostrar la operación |
| por cuanto se multiplica el salario diario para sacar el mensual | 27 | 0 | 6,81 | Sin dato | Explicar diario × 30 y diferenciar promedio anual |
| como saber cuanto gano por dia | 20 | 0 | 7,55 | Sin dato | Respuesta directa antes del desarrollo largo |
| como calcular el salario diario si me pagan por semana | 18 | 0 | 21,06 | Sin dato | Desglose semanal ÷ 7, con supuesto de periodo pagado explícito |
| si gano 2500 a la semana cuanto gano al dia | 16 | 0 | 4,62 | Sin dato | Mostrar diario 357,14 sin redondeo intermedio |
| calcular salario diario | 7 | 0 | 8,57 | Sin dato | Reforzar la herramienta y su explicación, conservar intención |
| como se cuanto gano por dia | 3 | 0 | 27,33 | 70 / 30 / 24 | Variante semántica natural; no página nueva |
| calculo de salario diario | 3 | 0 | 89,67 | 86 / 210 / 30 | Reforzar cobertura; muestra GSC insuficiente para diagnosticar una caída |
| como saber mi salario diario | 1 | 0 | 94,00 | 93 / 140 / 19 | Respuesta simple y ejemplo, sin sobreponderar la muestra |
| calculadora isr semanal | 1 | 0 | 29,00 | 26 / 40 / 20 | Derivar a ISR; no cambiar la intención de salario diario |

En SEMrush **no hay keywords en posiciones 1–20**: una está en 21–50 (`calculadora isr semanal`, intención ajena al conversor) y diez en 51–100. Todas tienen tráfico estimado cero. No se inventa un grupo SEMrush de oportunidades top 5 ni se supone que cero tráfico estimado equivalga a cero visitas reales.

En el subconjunto GSC, el grupo semanal↔mensual tiene 29 consultas, 329 impresiones y un clic. Salario diario/sueldo por día agrupa 58 consultas y 155 impresiones. Son agrupaciones de trabajo revisables; las variantes se resuelven con una explicación y tabla compartidas, sin copiar una FAQ para cada cantidad.

## Criterio de la matriz

- **P1**: intención relevante, al menos diez impresiones observadas y posición media 4–20; o una brecha explicativa con al menos diez impresiones en 21–50. Es prioridad editorial dentro de esta muestra, no predicción de clics.
- **P2**: variantes relevantes con menos impresiones y posiciones 4–50; se integran en las mismas secciones.
- **P3**: refuerzo semántico relevante con posiciones más lejanas o sin evidencia GSC suficiente.
- **Proteger**: posiciones 1–3 de muestra muy pequeña; conservar utilidad sin declarar rankings estables.
- **Enlazar**: SDI, SBC, ISR, nómina neta y descuentos corresponden a otras herramientas; explicar diferencias y enlazar.
- **No orientar contenido**: términos ambiguos aislados como `día`, `méxico`, `$500` o `semanal`; no crear texto para perseguirlos.

## Ejemplos de conversión que responden a los datos

Supuesto de la tabla: el importe semanal cubre un periodo de siete días pagados. Estos equivalentes no calculan impuestos ni prestaciones y no determinan el pago real de un mes concreto.

| Pago semanal | Diario (÷7) | Mes de 30 días (÷7×30) | Promedio con 365 días (÷7×365÷12) | Promedio con 52 semanas (×52÷12) |
|---|---:|---:|---:|---:|
| $2.000 | $285,71 | $8.571,43 | $8.690,48 | $8.666,67 |
| $2.300 | $328,57 | $9.857,14 | $9.994,05 | $9.966,67 |
| $2.500 | $357,14 | $10.714,29 | $10.863,10 | $10.833,33 |
| $3.000 | $428,57 | $12.857,14 | $13.035,71 | $13.000,00 |

No se redondea el importe diario antes de calcular los demás equivalentes. 52 semanas son 364 días; por eso los promedios 52/12 y 365/12 difieren. Multiplicar la semana por cuatro calcula 28 días, no un mes promedio. Si el importe es exclusivamente por días efectivamente trabajados, el supuesto de siete días requiere revisión; no se presenta como regla universal.

## Línea base para seguimiento

En la serie histórica de 28 días, 13 sep–10 oct registra 21 clics y 2.954 impresiones; 11 oct–7 nov registra 125 clics y 23.084 impresiones. En las últimas dos semanas, 25–31 oct registra 62 clics/8.499 impresiones y 1–7 nov registra 37/9.151. Son tendencias **anteriores a esta implementación**; no demuestran el efecto de ningún cambio nuevo. El último día y la discrepancia de dimensiones aconsejan validar futuras exportaciones antes de atribuir causas.

A los 7 días desde la publicación: comprobar rastreo, canonical, errores y primeros datos sin concluir sobre CTR. A los 28 días: comparar ventanas equivalentes de 28 días, la misma URL y filtros, separando agregado de página y grupos de consultas. A los 60 días: revisar persistencia, posiciones por grupo, clics y CTR con volumen suficiente; decidir cambios adicionales. Registrar la fecha real de publicación, que puede ser posterior al commit. Comparar también el resultado con periodos del mismo calendario cuando existan datos, por estacionalidad laboral. Las series nuevas deben comprobar primero que las dimensiones sean compatibles.
