# Corrección de controles móviles y estado del neto

## Archivos de producción modificados

- `assets/css/interface-v570.css`: regla a un máximo de 760 px limitada a `.cm-ui .calc-controls`. Usa una columna de cuadrícula y botones de ancho completo, sin mínimos ni partición de palabras que los compriman. El estilo de escritorio permanece intacto.
- `assets/js/salario-neto-receipt.js`: elimina `dataset.ready` al rechazar una operación y elimina resultado y comparación del depósito al editar, cambiar periodo o limpiar. Los errores de campos vacíos marcan `aria-invalid`. La aritmética compartida no cambia.

Ambos originales se respaldaron antes de editar en `antes/assets/css/interface-v570.css` y `antes/assets/js/salario-neto-receipt.js`.

## Causa y verificación

El estilo antiguo asignaba `width:100%` a Calcular y Limpiar en móvil. El estilo posterior convertía el contenedor a flex horizontal; Limpiar ocupaba casi todo el ancho y Calcular se comprimía hasta partir palabras. El contenedor ahora apila ambos botones en móvil y conserva la fila de escritorio.

Prueba real en Edge: `qa-controles-responsive.cjs` → **55 comprobaciones aprobadas**, incluidas **30 combinaciones de diseño**: 10 calculadoras × 320, 390 y 1440 px. Evidencia detallada en `qa-controles-responsive.json`.

Calculadoras: horas extra, PTU, salario bruto, salario neto, finiquito, liquidación, vacaciones, prima vacacional, pago quincenal y salario diario.

En todas las combinaciones: sin desbordamiento horizontal de página; botón principal de al menos 180 px; alturas de ambos controles inferiores a 100 px; botones dentro de la ventana; controles apilados en móvil. En escritorio se conserva la disposición horizontal.

Se inspeccionaron visualmente las capturas de horas extra a 390 y 1440 px, salario neto a 320 px, pago quincenal y salario diario a 390 px: etiquetas legibles y controles utilizables.

## Casos de salario neto

- 20,000 bruto − 2,500 ISR − 500 IMSS = 17,000; depósito de 17,000 coincide.
- Editar importe, periodo o depósito quita el resultado listo y oculta la comparación anterior.
- Depósito de 16,800 al recalcular: $200 menor.
- Campos vacío, salario 0, ISR −1, depósito −1, ISR 25,000 y decimal incompatible con el paso 0.001: sin `data-ready` ni acciones sobre un resultado anterior.
- Limpiar borra el depósito y deja el resultado sin marcar como listo.
- Ejemplo semanal tras limpiar: 4,350 netos; Enter con depósito 4,300 recalcula diferencia de $50 menor.
- Sin errores JavaScript en las páginas comprobadas.

También se volvió a ejecutar `verificar-salarios.cjs`: sus 24 comprobaciones VM/estáticas siguen aprobadas.

Capturas: `controles-horas-extra-320.png`, `controles-horas-extra-390.png`, `controles-horas-extra-1440.png`, `controles-salario-neto-320.png`, `controles-pago-quincenal-390.png` y `controles-salario-diario-390.png`.
