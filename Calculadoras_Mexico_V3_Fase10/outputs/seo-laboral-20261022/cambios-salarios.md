# Cierre de salarios — revisión editorial del 23 de octubre de 2026

## Evidencia y alcance

- Línea base GSC: `salario-neto.html`, 4 clics / 1,585 impresiones / posición 30.13; `salario-bruto-neto.html`, 0 clics / 337 impresiones / posición 35.39. Procedencia: `linea-base-urls.csv` y fuentes originales inventariadas en `fuentes-completas.json`. No se atribuyen consultas de GSC a una página sin evidencia.
- Respaldo inicial de las tres páginas: `outputs/seo-laboral-20261022/antes/`, conservado. El JS y CSS de bruto son archivos nuevos de esta tanda; no existían en el inventario inicial.
- Se conservaron title, description, canonical y URLs existentes. Fechas visibles y `dateModified` coinciden en 2026-10-23.
- No se modificó `assets/js/calculators.js` ni se agregaron tablas fiscales o cálculo automático de ISR/IMSS. Neto resta cantidades capturadas; bruto suma neto y deducciones conocidas.

## Cambios finales por archivo

### calculadoras/salario-neto.html

1. Ayuda de salario bruto: usar las percepciones del recibo antes de descuentos.
2. Campo del depósito: etiqueta “Depósito de este recibo”; aclaración para varias transferencias, reembolsos y pagos de otros periodos.
3. Advertencia de doble captura: no añadir en “Otras” el total que ya incluye ISR e IMSS.
4. Fecha visible y estructurada actualizada del 17 al 23 de octubre. Se conservan los ejemplos y funciones ya existentes.

### calculadoras/salario-bruto.html

1. Formulario orientado a reconstruir el bruto con datos conocidos, selector mensual/quincenal/semanal y explicación de que el selector no convierte cantidades.
2. Límites y etiquetas: neto positivo, deducciones no negativas, total de descuentos capturado una sola vez; aviso explícito de que no estima ISR ni IMSS.
3. Estado del ejemplo precargado y aviso del periodo junto al resultado.
4. Guía compacta con fórmula, ejemplo de $15,000 + $2,500 = $17,500, interpretación del porcentaje de deducciones y límite cuando solo se conoce un neto deseado.
5. Tabla con seis ejemplos editables y botones que cargan, calculan y enfocan el formulario.
6. Preguntas frecuentes revisadas y sincronizadas con FAQPage, incluida la imposibilidad de determinar un bruto único con solo un neto objetivo.
7. Se eliminaron textos de guía repetidos y dos bloques finales de enlaces íntegramente duplicados (“Recursos relacionados” y “Herramientas laborales relacionadas”); todos sus destinos permanecen en “Herramientas relacionadas de trabajo y nómina”.
8. Carga de `assets/js/salario-bruto-focus.js` y `assets/css/salario-bruto-focus.css`; fecha visible y estructurada 2026-10-23.

### articulos/salario-bruto-neto.html

1. El apartado inverso explica bruto = neto + deducciones conocidas, con ejemplo $15,000 + $2,500 = $17,500 y enlace contextual a la herramienta.
2. Se retiró la promesa de estimar automáticamente el bruto necesario para un neto deseado; texto, FAQ y CTA describen el alcance real.
3. CTA distintos para “Conozco mi bruto y deducciones” y “Conozco mi neto y deducciones”.
4. Limpieza de bloques repetidos de aguinaldo; una sección contextual conserva destinos útiles.
5. Fecha editorial y Article.dateModified 2026-10-23. No se afirma una nueva comprobación externa de las fuentes oficiales antiguas.

### assets/js/salario-bruto-focus.js — nuevo

1. Control exclusivo de la página de bruto; deja la suma al motor compartido.
2. Rechaza campos vacíos, valores no finitos, neto cero/negativo y deducciones negativas antes del motor.
3. Carga ejemplos, dispara los eventos de guardado existentes, calcula y respeta movimiento reducido.
4. Muestra el periodo y el alcance manual del resultado.
5. En un rechazo elimina `dataset.ready`; al editar datos, cambiar periodo o limpiar elimina el resultado anterior y el estado listo. Se corrigió el valor textual `false`, que era problemático para consumidores que evalúan presencia/valor verdadero.

### assets/css/salario-bruto-focus.css — nuevo

Estilos limitados a la página de bruto: nota de alcance, botones de ejemplo con foco visible, tabla desplazable y controles apilados en móvil. Pendiente de confirmación visual en el navegador por el agente principal.

## QA ejecutada

`node outputs/seo-laboral-20261022/verificar-salarios.cjs` → PASS, 24 comprobaciones registradas en `qa-salarios.json`.

Se ejecutó el motor compartido real y los helpers dentro de Node VM con un DOM mínimo. Esta comprobación valida eventos y aritmética, pero no sustituye las comprobaciones nativas y visuales del navegador.

| Caso | Entradas | Esperado | Resultado |
|---|---|---:|---:|
| Bruto mensual 1 | Neto 10,000 + deducciones 1,500 | 11,500 | 11,500 |
| Bruto mensual 2 | Neto 15,000 + deducciones 2,500 | 17,500 | 17,500 |
| Bruto mensual 3 | Neto 20,000 + deducciones 3,000 | 23,000 | 23,000 |
| Bruto mensual 4 | Neto 30,000 + deducciones 5,000 | 35,000 | 35,000 |
| Bruto quincenal | Neto 8,000 + deducciones 1,200 | 9,200 | 9,200 |
| Bruto semanal | Neto 3,500 + deducciones 450 | 3,950 | 3,950 |
| Bruto sin deducciones | Neto 15,000 + 0 | 15,000 | 15,000 |
| Neto mensual 1 | 10,000 − 900 − 300 − 0 | 8,800 | 8,800 |
| Neto mensual 2 | 15,000 − 1,600 − 400 − 0 | 13,000 | 13,000 |
| Neto mensual 3 | 20,000 − 2,500 − 500 − 0 | 17,000 | 17,000 |
| Neto mensual 4 | 30,000 − 4,000 − 700 − 300 | 25,000 | 25,000 |
| Neto quincenal | 10,000 − 1,100 − 250 − 400 | 8,250 | 8,250 |
| Neto semanal | 5,000 − 450 − 120 − 80 | 4,350 | 4,350 |
| Depósito coincide | Neto calculado 17,000; depósito 17,000 | Coincide | Coincide |
| Depósito distinto | Neto calculado 17,000; depósito 16,800 | $200 menor | $200 menor |
| Bruto inválido | Neto vacío/0/−1; deducciones −1/vacías/NaN | Rechazo | Rechazo |
| Neto inválido | Bruto 20,000; ISR 25,000 o −1 | Rechazo | Rechazo |
| Edición / cambio de periodo / limpiar en bruto | Resultado previamente calculado | Quitar resultado anterior y ready | Correcto |

FAQ visible = FAQPage exactamente: neto 10, bruto 5, artículo 9. Cada página contiene un H1, IDs únicos, anclas internas resueltas y recursos/enlaces locales existentes. Title y description coinciden con Open Graph/Twitter; descripción y fecha coinciden con JSON-LD.

## Selectores y comprobaciones para navegador

- Bruto: `#neto`, `#deducciones`, `#sbPeriodo`, `#sbExampleState`, `#sbPeriodResult`, `#resultado`, `.calc-button`, `[data-form-reset]`.
- Ejemplo bruto: `[data-sb-example="quincenal,8000,1200"]` → 9,200 y periodo quincenal. `[data-sb-example="semanal,3500,450"]` → 3,950.
- Neto: `#salario`, `#isrManual`, `#imss`, `#otras`, `#snDeposito`, `#snPeriodo`, `#snReceiptCheck`, `#resultado`.
- Ejemplo neto: `[data-sn-example="semanal,5000,450,120,80"]` → 4,350. El depósito anterior debe vaciarse al cargar ejemplos.
- FAQ calculadoras: `.faq-section details`; FAQ artículo: `#faq` y sus `details` siguientes.
- Comprobar 1440, 390 y 320 px, tabla desplazable sin desbordamiento global, foco con teclado y Enter, almacenamiento/restauración, validación nativa de decimales, limpiar, y ausencia de errores de página.
- Observación resuelta en la ampliación posterior de alcance: `salario-neto-receipt.js` ahora elimina `dataset.ready` en rechazos y elimina resultado/comparación al editar, cambiar periodo o limpiar. Ver `qa-controles-responsive.md` y sus 55 comprobaciones de navegador aprobadas.
