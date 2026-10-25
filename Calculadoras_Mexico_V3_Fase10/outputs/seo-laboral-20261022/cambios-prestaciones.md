# Cambios en cuatro calculadoras laborales

Aplicados el 24 de octubre de 2026 en `calculadoras/finiquito.html`, `liquidacion.html`, `vacaciones.html` y `prima-vacacional.html`. Respaldos previos conservados sin sobrescribir en `antes/calculadoras/`.

- Cada página pasa de 12 preguntas a 6 preguntas complementarias. FAQPage usa exactamente las mismas preguntas y respuestas que el contenido visible.
- Se consolidan 12, 6, 12 y 9 bloques de navegación, respectivamente, en `#recursos-relacionados`. Se retienen todos los destinos únicos: finiquito 51, liquidación 40, vacaciones 48, prima vacacional 43. No se crean URLs.
- Se eliminan rejillas de respuestas rápidas que repetían las FAQs. Se conservan explicación, ejemplos, contexto, alcance y tablas.
- Finiquito: las tablas muestran 90/180/270/365 días, no moneda. `#diasAnio` ahora dice «Días del año para aguinaldo», tiene ayuda `#diasAnio-ayuda` y rango 0–365. No representa antigüedad total. Se elimina la instrucción incorrecta de capturar fechas que el formulario no solicita.
- Vacaciones: las tablas muestran 12/14/20/22 días, no moneda.
- Liquidación: `#incluir20` inicia en `no`; `#incluir20-ayuda` explica que no corresponde automáticamente. Los ejemplos con el concepto incluido lo dicen expresamente. Una selección guardada o un enlace compartido puede recuperar `si`, comportamiento existente documentado en la FAQ; Limpiar restaura `no`.
- Todos los campos numéricos son obligatorios, prima mínima 25%, aguinaldo anual mínimo 15 días. Se usa el interceptor existente de `assets/js/interface-v570.js`, que ejecuta `checkValidity()` antes del cálculo. Motor intacto y sin JavaScript nuevo de producción.
- Ficha de revisión y `WebPage.dateModified` alineados a 2026-10-24.

## Evidencia

GSC registra para `/calculadoras/prima-vacacional.html` 2 clics, 295 impresiones, CTR 0.68% y posición 48.73. Las otras tres URLs exactas no aparecen en la tabla Páginas; esto no equivale a cero tráfico. Las consultas GSC son agregadas y no se atribuyen a una URL sin cruce consulta/página. Semrush representa estimaciones de demanda, no tráfico real.

La [LFT vigente de Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf) se verificó el 24-10-2026: reforma indicada 14-05-2026; artículos 76, 79, 80, 87 y 48–50/89. Se mantienen las fórmulas existentes y sus límites informativos.

## QA de navegador para el agente principal

Limpiar almacenamiento del origen o pulsar Limpiar antes de probar. Botón `.calc-button`; resultado `#resultado`.

| Página / captura | Resultado esperado |
|---|---|
| Finiquito predeterminado: salario 15000, pendientes 5, año 180, vacaciones 6, aguinaldo 15, prima 25 | Sueldo 2500; aguinaldo 3698.63; vacaciones 3000; prima 750; total **9948.63** |
| Finiquito `#diasAnio=365`, demás predeterminados | Total **13750.00** |
| Finiquito `#diasAnio=366` o `-1` | Inválido, no recalcular |
| Finiquito `#diasAguinaldo=14` o `#prima=24` | Inválido, no recalcular |
| Liquidación predeterminada: diario 500, años 3, pendientes 0, `#incluir20=no` | **45000.00** |
| Liquidación `#incluir20=si`, demás predeterminados | **75000.00** |
| Liquidación después de Limpiar | `#incluir20=no` |
| Vacaciones predeterminadas: salario 15000, años 1, prima 25 | **12 días**, pago 6000, prima 1500, total **7500** |
| Vacaciones años 6 / 10 / 11 | **22 / 22 / 24 días** |
| Vacaciones `#anios=0` o `1.5` | Inválido, no recalcular |
| Prima predeterminada: diario 500, días 12, prima 25 | Base 6000, prima **1500** |
| Prima `#prima=50` | Prima **3000** |
| Cualquier página: vaciar campo, salario 0 o negativo, prima negativa | Inválido, no recalcular |

Los ejemplos y las tablas conservan sus resultados: finiquito 8099.32/9948.63/11797.95/13750 para 90/180/270/365 días; ejemplos adicionales 6000 y 12465.75. Liquidación con 20 días y salario diario 500: 55000/75000/95000 para 1/3/5 años. Vacaciones: 7500/8750/12500/13750 para 1/2/5/6 años. Prima: 1500/1750/2000/2500/2750 para 12/14/16/20/22 días con diario 500 y 25%.

Revisión estática: JSON-LD válido, seis FAQs por página, campos y límites esperados presentes, destinos únicos preservados y destinos internos existentes. La revisión visual y funcional de navegador corresponde al agente principal.

Límites conocidos: la selección anterior de 20 días puede recuperarse. La calculadora de liquidación utiliza una misma base diaria para indemnización y salarios pendientes. El formulario ahora lo explica en `#baseSalarial-ayuda`, asociado mediante `aria-describedby` a salario diario y días pendientes. Si la base indemnizatoria difiere del sueldo ordinario, indica capturar 0 en días pendientes y revisar ese pago por separado, con enlace al finiquito. La FAQ de salario y su JSON-LD incluyen la misma indicación y aclaran que la herramienta no integra prestaciones automáticamente. Motor, título y ejemplos conservados.
