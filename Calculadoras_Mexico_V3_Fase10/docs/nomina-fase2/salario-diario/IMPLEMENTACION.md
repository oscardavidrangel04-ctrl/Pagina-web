# Salario diario: segunda fase — 9 de noviembre de 2026

URL `/calculadoras/salario-diario.html`. Principal: **calculadora de salario diario**. Secundarias: cómo calcular salario diario, sueldo semanal a mensual, cuánto gano al día y salario diario a mensual. Se parte de `dfe634e`, que ya tenía entradas mensual/quincenal/semanal/diaria, tres modelos mensuales, ejemplos y ocho FAQs. Esas mejoras se conservan.

Se revisaron íntegramente las 132 consultas GSC y los 11 registros SEMrush ya normalizados en la [primera fase](../../salario-diario-seo-2026-11-08/DATOS.md). La nueva [matriz de 134 filas](matriz-oportunidades.csv) conserva las métricas y añade grupo de posición, acción concreta de esta fase y medición pendiente. No hay un export posterior para demostrar crecimiento. GSC 5 ago–7 nov 2026:151 clics 26.380 imp/CTR 0,5724%/posición 4,94; el detalle solo 2 clics 618 imp. No se mezclan esos ámbitos.

| Consulta GSC | Posición | Impresiones | Acción adicional | Medición posterior |
| --- | ---: | ---: | --- | --- |
| si gano 2000 a la semana cuanto gano al mes | 6,16 | 38 | Tabla enlaza escenario semanal; sumas de 4/5 pagos | CTR, clics y posición |
| si gano 2300 a la semana cuanto gano al mes | 6,19 | 27 | Escenario existente preservado y nuevo desglose de cobros | Clics y uso del cálculo |
| si gano 2500 a la semana cuanto gano al mes | 9,67 | 49 | Escenario desde tabla y distinción cobros/promedios | Visibilidad top 10 y CTR |
| si gano 3000 a la semana cuanto gano al mes | 8,00 | 35 | Escenario desde tabla, con 4/5 pagos | Impresiones y clics |
| por cuanto se multiplica el salario diario para sacar el mensual | 6,81 | 27 | Se conserva explicación 30 d/365÷12/52÷12; no se repite | Posición y consultas pertinentes |

## Implementación

Los cinco importes de la tabla existente —2.000/2.300/2.500/3.000/3.500— ahora abren escenarios semanales. Se usan encabezados de fila y nombres de enlace descriptivos, sin añadir una tabla duplicada. Los parámetros mantienen el canonical limpio y no crean nuevas entradas en sitemap.

El desplegable de resultados añade, únicamente para entrada semanal, cuatro y cinco pagos constantes. Con 2.300 semanales son 9.200 y 11.500; con 2.500 son 10.000 y 12.500. No se confunden esas sumas con el modelo de 30 d(10.714,29 para 2.500) o promedio 52÷12(10.833,33). El importe puede ser bruto o neto según lo capturado; la suma no convierte bruto en depósitos netos.

Se corrige la relación entre WebPage y WebApplication mediante un identificador compartido y se describen las funcionalidades reales. Fecha editorial actualizada. Title, metadescripción, H1, fórmulas base, FAQs, enlaces anteriores, logo, diseño y monetización se conservan.

Competencia y decisiones adicionales: [investigación conjunta](../COMPETENCIA-PERIODOS.md). No se certifica Top 3 actual ni una ventaja de rendimiento frente a esos sitios. Salario diario no se convierte en otra herramienta de nómina fiscal o SDI; los enlaces a neto/quincenal/hora conservan intenciones complementarias. Los exports por URL no prueban canibalización real.

Archivos: `calculadoras/salario-diario.html`, `assets/js/salario-diario.js`. Sin nuevo CSS. Validaciones de divisores, promedios, escenarios, cuatro/cinco pagos, móvil y publicidad en [validation.json](../validation.json). Las muestras locales de LCP/CLS no son métricas de campo; INP de campo pendiente.

Seguimiento desde publicación:7 dindexación, canonical y funciones;28 dventanas iguales por consulta;60 dpersistencia/estacionalidad. No volver a cambiar title sin nuevos datos. Revisar CTR junto con posición y mezcla de búsquedas. No se afirma crecimiento posterior.
