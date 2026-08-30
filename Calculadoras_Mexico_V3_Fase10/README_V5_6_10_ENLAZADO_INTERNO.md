# V5.6.10 — Mejora de enlazado interno

Fecha: 30 de agosto de 2026

## Objetivo

Reforzar clusters temáticos y aumentar rutas internas contextuales hacia calculadoras y artículos prioritarios sin llenar las páginas de enlaces genéricos.

## Cambios aplicados

- `calculadoras/margen-ganancia.html` → `porcentaje.html` con anchor contextual **calculadora de porcentajes**.
- `calculadoras/margen-ganancia.html` → `precio-sin-descuento.html` con anchor contextual **calcular el precio antes de un descuento**.
- `calculadoras/regla-tres.html` → `porcentaje.html` con anchor contextual **calcular porcentajes**.
- `calculadoras/regla-tres.html` → `precio-sin-descuento.html` con anchor contextual **calcular el precio original antes del descuento**.
- `calculadoras/rendimiento-anualizado.html` → `tiempo-ahorro.html` con anchor contextual **calcular cuánto tiempo necesitas para ahorrar**.
- `calculadoras/rendimiento-anualizado.html` → `interes-simple.html` con anchor contextual **calculadora de interés simple**.
- `calculadoras/interes-simple.html` → `tiempo-ahorro.html` con anchor contextual **calculadora de tiempo para ahorrar**.
- `calculadoras/interes-simple.html` → `rendimiento-anualizado.html` con anchor contextual **calcular rendimiento anualizado**.
- `calculadoras/ahorro-mensual.html` → `tiempo-ahorro.html` con anchor contextual **calcular el tiempo para alcanzar una meta de ahorro**.
- `calculadoras/ahorro-mensual.html` → `rendimiento-anualizado.html` con anchor contextual **rendimiento anualizado**.
- `calculadoras/ahorro-mensual.html` → `inflacion.html` con anchor contextual **efecto de la inflación**.
- `calculadoras/aguinaldo.html` → `ptu.html` con anchor contextual **calculadora de PTU**.
- `calculadoras/aguinaldo.html` → `salario-diario-integrado.html` con anchor contextual **calculadora de salario diario integrado**.
- `calculadoras/vacaciones.html` → `ptu.html` con anchor contextual **calculadora de PTU**.
- `calculadoras/vacaciones.html` → `salario-diario-integrado.html` con anchor contextual **salario diario integrado**.
- `calculadoras/salario-bruto.html` → `salario-diario-integrado.html` con anchor contextual **calculadora de salario diario integrado**.
- `calculadoras/salario-neto.html` → `ptu.html` con anchor contextual **calculadora de PTU**.
- `calculadoras/salario-neto.html` → `salario-diario-integrado.html` con anchor contextual **calculadora de SDI**.
- `calculadoras/aguinaldo-proporcional.html` → `../articulos/aguinaldo-isr-2026.html` con anchor contextual **ISR del aguinaldo**.
- `calculadoras/aguinaldo-proporcional.html` → `../articulos/aguinaldo-si-renuncio.html` con anchor contextual **aguinaldo proporcional al renunciar**.

## Enlaces entrantes después de la mejora

- `calculadoras/porcentaje.html`: **7** páginas internas distintas enlazan hacia ella.
- `calculadoras/tiempo-ahorro.html`: **6** páginas internas distintas enlazan hacia ella.
- `calculadoras/precio-sin-descuento.html`: **6** páginas internas distintas enlazan hacia ella.
- `calculadoras/interes-simple.html`: **5** páginas internas distintas enlazan hacia ella.
- `calculadoras/ptu.html`: **7** páginas internas distintas enlazan hacia ella.
- `calculadoras/rendimiento-anualizado.html`: **7** páginas internas distintas enlazan hacia ella.
- `calculadoras/inflacion.html`: **4** páginas internas distintas enlazan hacia ella.
- `calculadoras/salario-diario-integrado.html`: **10** páginas internas distintas enlazan hacia ella.
- `calculadoras/tasa-efectiva.html`: **5** páginas internas distintas enlazan hacia ella.
- `articulos/aguinaldo-isr-2026.html`: **7** páginas internas distintas enlazan hacia ella.
- `articulos/aguinaldo-si-renuncio.html`: **7** páginas internas distintas enlazan hacia ella.

## Validación

- Archivos HTML revisados: **70**.
- Nuevos enlaces contextuales añadidos: **20**.
- Enlaces internos HTML rotos detectados tras los cambios: **0**.
- No se modificaron fórmulas, JavaScript de las calculadoras, canonicals ni estructura de navegación principal.
