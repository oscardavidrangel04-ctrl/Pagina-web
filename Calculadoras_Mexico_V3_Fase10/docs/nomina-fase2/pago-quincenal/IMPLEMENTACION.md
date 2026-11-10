# Pago quincenal: segunda fase — 9 de noviembre de 2026

URL `/calculadoras/pago-quincenal.html`. Principal: **calculadora de pago quincenal**. Secundarias: cálculo de sueldo quincenal, sueldo mensual a quincenal, salario diario a quincenal y diferencia quincena/catorcena. Se protege el contexto de ISR quincenal. La base `dfe634e` ya incorporaba entrada diaria, ejercicio $275, validación, explicación ISR y ocho FAQs. No se presentan como novedades.

Se revisaron 143 consultas GSC y 18 registros SEMrush de la [primera fase](../../pago-quincenal-seo/DATOS.md). La [matriz 149 filas](matriz-oportunidades.csv) añade acción de fase 2 y grupo de posición. GSC 5 ago–7 nov 2026:115 clics 18.566 imp/CTR 0,6194%/posición 5,05; detalle 2 clics 1.347 imp. Son datos anteriores a ambas fases. SEMrush ISR 7 y 15 es un duplicado de la misma URL/fecha, no una evolución temporal demostrada.

| Consulta | Posición histórica | Impresiones GSC | Acción de esta fase | Medición posterior |
| --- | --- | ---: | --- | --- |
| como calcular mi isr quincenal | SEMrush 7 y 15 | — | Atajo directo a respuesta y enlaces especializados existentes | Proteger contexto; posición/CTR |
| cuanto es la quincena de un sueldo | GSC 5,85 | 108 | Tabla mensual enlazada a escenarios verificables | Clics y uso del formulario |
| calculo de pago quincenal | SEMrush 43 | — | Ejemplos de 10/15/18/24 mil abren cálculo mensual ÷2 | Impresiones/posición relevante |
| cuantas quincenas tiene un año | SEMrush 73 | — | Suma de 24 pagos frente 26/27 catorcenales con supuestos explícitos | Visibilidad sin desviar intención salarial |
| nomina catorcena | SEMrush 69 | — | Comparación 14/15 d y efectos del número de pagos | CTR/posición, pendientes de medir |

## Implementación

La tabla existente de 10.000/15.000/18.000/24.000 mensuales ahora enlaza cada escenario del formulario; sus encabezados de fila son semánticos. Se conservan valores y ejemplos. Nuevos accesos internos llevan a ISR y calendario sin ampliar otra vez esas explicaciones.

El desplegable existente añade sumas hipotéticas de 24 pagos de 15 d y 26/27 pagos de 14 d. Con 275 diarios:4.125×24=99.000;3.850×26=100.100;3.850×27=103.950. Las bases representan 360/364/378 días de referencia y NO tres sueldos anuales equivalentes. Tener 27 fechas de pago dentro del año no implica trabajar 378 días de ese año: los periodos pueden cruzar sus límites. Se requiere el calendario y salario pactados antes de comparar ingresos reales.

No se cambia mensual ÷2, diario ×15 ni el cálculo fiscal de otra URL. Title, metadescripción, H1, canonical, FAQ, contexto ISR, logo, diseño y anuncios permanecen. WebApplication describe el nuevo comparador y WebPage lo referencia.

La [comparación de competidores](../COMPETENCIA-PERIODOS.md) detecta terminología distinta para biweekly; la implementación mantiene dos pagos mensuales frente 14 d. No se duplica el artículo ISR ni el conversor de quincenas a meses. Los datos de una URL no demuestran canibalización entre páginas.

Archivos: `calculadoras/pago-quincenal.html`, `assets/js/pago-quincenal.js`. Sin CSS nuevo. Ver [validation.json](../validation.json): cálculos, enlaces antiguos/nuevos, persistencia, Enter, reset, responsive, axe y ads simulados. INP y Core Web Vitals de campo pendientes; la entrega real de anuncios no se certifica.

Seguimiento 7/28/60 d desde publicación: rastreo y canonical; comparación GSC con mismos filtros/ventanas; persistencia y estacionalidad. Separar consultas de sueldo, ISR y calendario y observar CTR junto con posición. Las mejoras de código no prueban aumentos de tráfico.
